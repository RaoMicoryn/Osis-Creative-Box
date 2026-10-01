import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

/** Slug kategori (disimpan di DB). Label tampilan ("Acara Sekolah") dipetakan di validation.ts */
export const KATEGORI_VALUES = ['lingkungan', 'acara_sekolah', 'fasilitas', 'akademik', 'lainnya'] as const;
export const STATUS_VALUES = ['pending', 'dibaca_osis', 'disetujui_pembina', 'ditolak'] as const;

export const kategoriEnum = pgEnum('creative_box_kategori', KATEGORI_VALUES);
export const statusEnum = pgEnum('creative_box_status', STATUS_VALUES);

export const creativeBoxAspirations = pgTable(
  'creative_box_aspirations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    judul_ide: varchar('judul_ide', { length: 255 }).notNull(),
    kategori: kategoriEnum('kategori').notNull(),
    deskripsi_ide: text('deskripsi_ide').notNull(),
    detail_pengerjaan: text('detail_pengerjaan'),
    manfaat: text('manfaat'),
    is_anonymous: boolean('is_anonymous').notNull().default(true),
    nama_siswa: varchar('nama_siswa', { length: 100 }),
    kelas: varchar('kelas', { length: 20 }),
    kontak: varchar('kontak', { length: 100 }), // email / no. HP
    status: statusEnum('status').notNull().default('pending'),
    created_at: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    // Batas panjang juga dijaga di level DB (pertahanan terakhir jika ada jalur insert lain)
    check('cb_deskripsi_max_500', sql`char_length(${t.deskripsi_ide}) <= 500`),
    check('cb_detail_max_1000', sql`${t.detail_pengerjaan} IS NULL OR char_length(${t.detail_pengerjaan}) <= 1000`),
    check('cb_manfaat_max_1000', sql`${t.manfaat} IS NULL OR char_length(${t.manfaat}) <= 1000`),
    // Privasi: data diri WAJIB null kalau anonim
    check(
      'cb_anonim_tanpa_identitas',
      sql`NOT ${t.is_anonymous} OR (${t.nama_siswa} IS NULL AND ${t.kelas} IS NULL AND ${t.kontak} IS NULL)`,
    ),
    index('cb_status_created_idx').on(t.status, t.created_at.desc()),
    index('cb_kategori_created_idx').on(t.kategori, t.created_at.desc()),
    index('cb_created_idx').on(t.created_at.desc()),
  ],
);

/**
 * Penghitung rate limit berbasis DB (aman untuk serverless/Neon, tanpa Redis).
 * Sengaja TERPISAH dari tabel aspirasi: tidak ada kolom IP di data aspirasi,
 * jadi pengiriman anonim tidak bisa dilacak balik ke IP.
 * `key` = HMAC(IP), bukan IP asli.
 */
export const rateLimitHits = pgTable(
  'rate_limit_hits',
  {
    key: varchar('key', { length: 128 }).notNull(),
    window_start: timestamp('window_start', { withTimezone: true }).notNull(),
    count: integer('count').notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.key, t.window_start] })],
);

export type CreativeBoxRow = typeof creativeBoxAspirations.$inferSelect;
export type NewCreativeBoxRow = typeof creativeBoxAspirations.$inferInsert;
