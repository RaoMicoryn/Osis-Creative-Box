import { z } from 'zod';
import { KATEGORI_VALUES, STATUS_VALUES } from '../db/schema';
import { badRequest, type FieldError } from '../http/response';

/* ------------------------------------------------------------------ */
/* Helper sanitasi                                                     */
/* ------------------------------------------------------------------ */

/** Buang karakter kontrol (termasuk NUL, yang membuat INSERT Postgres error) kecuali \n \r \t. */
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

const cleanString = (v: unknown) => (typeof v === 'string' ? v.replace(CONTROL_CHARS, '') : v);

/** String kosong / spasi saja -> null. */
const blankToNull = (v: unknown) => {
  const s = cleanString(v);
  if (s === undefined || s === null) return null;
  return typeof s === 'string' ? (s.trim() === '' ? null : s.trim()) : s;
};

const blankToUndefined = (v: unknown) => {
  const s = blankToNull(v);
  return s === null ? undefined : s;
};

/** "Acara Sekolah" / "acara sekolah" / "acara_sekolah" -> "acara_sekolah" */
export const normalizeKategori = (v: unknown) =>
  typeof v === 'string' ? (cleanString(v) as string).trim().toLowerCase().replace(/[\s-]+/g, '_') : v;

const optionalText = (max: number, label: string) =>
  z.preprocess(
    blankToNull,
    z.string({ error: `${label} harus berupa teks` }).max(max, `${label} maksimal ${max} karakter`).nullable(),
  );

/** Email atau nomor HP (8-15 digit, boleh diawali +, spasi/strip/kurung). */
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
const isPhone = (s: string) => {
  if (!/^\+?[\d\s().-]+$/.test(s)) return false;
  const digits = s.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15;
};

/* ------------------------------------------------------------------ */
/* POST body                                                           */
/* ------------------------------------------------------------------ */

export const createIdeaSchema = z
  .object({
    judul_ide: z.preprocess(
      cleanString,
      z
        .string({ error: 'Judul ide wajib diisi' })
        .trim()
        .min(1, 'Judul ide wajib diisi')
        .max(255, 'Judul ide maksimal 255 karakter'),
    ),
    kategori: z.preprocess(
      normalizeKategori,
      z.enum(KATEGORI_VALUES, { error: `Kategori tidak valid. Pilihan: ${KATEGORI_VALUES.join(', ')}` }),
    ),
    deskripsi_ide: z.preprocess(
      cleanString,
      z
        .string({ error: 'Deskripsi ide wajib diisi' })
        .trim()
        .min(1, 'Deskripsi ide wajib diisi')
        .max(500, 'Deskripsi ide maksimal 500 karakter'),
    ),
    detail_pengerjaan: optionalText(1000, 'Detail pengerjaan'),
    manfaat: optionalText(1000, 'Manfaat'),
    // Default & fail-safe: anonim, KECUALI klien secara eksplisit mengirim false.
    is_anonymous: z.preprocess((v) => !(v === false || v === 'false'), z.boolean()),
    nama_siswa: optionalText(100, 'Nama'),
    kelas: optionalText(20, 'Kelas'),
    kontak: optionalText(100, 'Kontak'),
  })
  .superRefine((d, ctx) => {
    // Format kontak hanya dicek kalau memang dipakai (non-anonim & terisi)
    if (!d.is_anonymous && d.kontak && !isEmail(d.kontak) && !isPhone(d.kontak)) {
      ctx.addIssue({ code: 'custom', path: ['kontak'], message: 'Kontak harus berupa email atau nomor HP yang valid' });
    }
  })
  // Sanitasi privasi: anonim => data diri dipaksa null SEBELUM menyentuh DB.
  .transform((d) =>
    d.is_anonymous ? { ...d, nama_siswa: null, kelas: null, kontak: null } : d,
  );

export type CreateIdeaInput = z.output<typeof createIdeaSchema>;

type Rec = Record<string, unknown>;
const isRec = (v: unknown): v is Rec => typeof v === 'object' && v !== null && !Array.isArray(v);
const get = (o: unknown, k: string) => (isRec(o) ? o[k] : undefined);

/**
 * Terima DUA bentuk body:
 *  1. Flat sesuai spesifikasi API   : { judul_ide, kategori, ... }
 *  2. Nested dari form wizard FE    : { idea: {title,...}, implementation, benefit, submitter }
 * Keduanya dinormalkan ke bentuk 1 sebelum divalidasi, jadi front-end tidak perlu diubah.
 */
export function normalizeCreateBody(raw: unknown): Rec {
  if (!isRec(raw)) throw badRequest('Body harus berupa objek JSON.');
  if (!isRec(raw.idea)) return raw;
  const { idea, implementation, benefit, submitter } = raw;
  return {
    judul_ide: get(idea, 'title'),
    kategori: get(idea, 'category'),
    deskripsi_ide: get(idea, 'description'),
    detail_pengerjaan: get(implementation, 'description'),
    manfaat: get(benefit, 'description'),
    is_anonymous: get(submitter, 'isAnonymous'),
    nama_siswa: get(submitter, 'name'),
    kelas: get(submitter, 'className'),
    kontak: get(submitter, 'contact'),
  };
}

/* ------------------------------------------------------------------ */
/* GET query (admin)                                                   */
/* ------------------------------------------------------------------ */

const SORT_ALIASES: Record<string, 'terbaru' | 'terlama'> = {
  terbaru: 'terbaru',
  desc: 'terbaru',
  newest: 'terbaru',
  terlama: 'terlama',
  asc: 'terlama',
  oldest: 'terlama',
};

export const listQuerySchema = z.object({
  page: z.preprocess(
    blankToUndefined,
    z.coerce.number({ error: 'page harus berupa angka' }).int('page harus bilangan bulat').min(1, 'page minimal 1').max(100_000, 'page terlalu besar').default(1),
  ),
  limit: z.preprocess(
    blankToUndefined,
    z.coerce.number({ error: 'limit harus berupa angka' }).int('limit harus bilangan bulat').min(1, 'limit minimal 1').max(100, 'limit maksimal 100').default(10),
  ),
  kategori: z.preprocess(
    (v) => normalizeKategori(blankToUndefined(v)),
    z.enum(KATEGORI_VALUES, { error: `kategori tidak valid. Pilihan: ${KATEGORI_VALUES.join(', ')}` }).optional(),
  ),
  status: z.preprocess(
    (v) => {
      const s = blankToUndefined(v);
      return typeof s === 'string' ? s.toLowerCase() : s;
    },
    z.enum(STATUS_VALUES, { error: `status tidak valid. Pilihan: ${STATUS_VALUES.join(', ')}` }).optional(),
  ),
  is_anonymous: z.preprocess(
    (v) => {
      const s = blankToUndefined(v);
      if (s === undefined) return undefined;
      const t = String(s).toLowerCase();
      return t === 'true' || t === '1' ? true : t === 'false' || t === '0' ? false : s;
    },
    z.boolean({ error: 'is_anonymous harus true atau false' }).optional(),
  ),
  sort: z.preprocess(
    (v) => {
      const s = blankToUndefined(v);
      return typeof s === 'string' ? (SORT_ALIASES[s.toLowerCase()] ?? s) : s;
    },
    z.enum(['terbaru', 'terlama'], { error: 'sort harus terbaru atau terlama' }).default('terbaru'),
  ),
});

export type ListQuery = z.output<typeof listQuerySchema>;

/* ------------------------------------------------------------------ */
/* Util: Zod error -> response 400                                     */
/* ------------------------------------------------------------------ */

export function parseOrThrow<S extends z.ZodType>(schema: S, input: unknown): z.output<S> {
  const result = schema.safeParse(input);
  if (result.success) return result.data;

  const errors: FieldError[] = result.error.issues.map((i) => ({
    field: i.path.join('.') || '(body)',
    message: i.message,
  }));
  throw badRequest(`Validasi gagal: ${errors[0].message}`, errors);
}
