import { AppError, badRequest } from './response';

/** Baca body JSON dengan batas ukuran + cek Content-Type. Mengembalikan `unknown` untuk divalidasi Zod. */
export async function readJson(req: Request, maxBytes = 4 * 1024): Promise<unknown> {
  if (!(req.headers.get('content-type') ?? '').toLowerCase().includes('application/json')) {
    throw new AppError(415, 'Content-Type harus application/json.');
  }
  if (Number(req.headers.get('content-length') ?? 0) > maxBytes) throw new AppError(413, 'Data yang dikirim terlalu besar.');
  const text = await req.text();
  if (Buffer.byteLength(text, 'utf8') > maxBytes) throw new AppError(413, 'Data yang dikirim terlalu besar.');
  try {
    return JSON.parse(text);
  } catch {
    throw badRequest('Format JSON tidak valid.');
  }
}
