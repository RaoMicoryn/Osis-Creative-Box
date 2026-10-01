import { getDb } from '@/server/db';
import { createIdea } from '@/server/creative-box/service';
import { createIdeaSchema, normalizeCreateBody, parseOrThrow } from '@/server/creative-box/validation';
import { getClientIp, hit, ipKey, purgeExpired, SUBMIT_LIMIT, tooManyRequests } from '@/server/http/rate-limit';
import { AppError, badRequest, handleError, ok } from '@/server/http/response';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 16 * 1024; // form ini maksimal ~3KB teks; 16KB sudah sangat longgar

/**
 * POST /api/aspirasi/creative-box   (publik)
 * Urutan: cek header -> cek ukuran -> rate limit -> parse JSON -> validasi -> simpan -> 201
 */
export async function POST(req: Request) {
  try {
    // 1. Content-Type harus JSON
    if (!(req.headers.get('content-type') ?? '').toLowerCase().includes('application/json')) {
      throw new AppError(415, 'Content-Type harus application/json.');
    }

    // 2. Batasi ukuran body (tolak lebih awal lewat Content-Length, lalu cek ukuran aktual)
    const declared = Number(req.headers.get('content-length') ?? 0);
    if (declared > MAX_BODY_BYTES) throw new AppError(413, 'Data yang dikirim terlalu besar.');
    const text = await req.text();
    if (Buffer.byteLength(text, 'utf8') > MAX_BODY_BYTES) throw new AppError(413, 'Data yang dikirim terlalu besar.');

    // 3. Rate limit per IP (sebelum validasi, supaya spam data sampah pun ikut terhitung)
    const db = getDb();
    const rl = await hit(db, ipKey(getClientIp(req), 'creative-box:submit'), SUBMIT_LIMIT);
    if (!rl.allowed) throw tooManyRequests(rl);
    if (Math.random() < 0.02) void purgeExpired(db).catch(() => {}); // bersih-bersih oportunistik

    // 4. Parse JSON
    let raw: unknown;
    try {
      raw = JSON.parse(text);
    } catch {
      throw badRequest('Format JSON tidak valid.');
    }

    // 5. Validasi + sanitasi privasi (anonim => nama/kelas/kontak = null)
    const input = parseOrThrow(createIdeaSchema, normalizeCreateBody(raw));

    // 6. Simpan (status default 'pending')
    const created = await createIdea(db, input);

    return ok(201, 'Ide berhasil dikirim. Terima kasih sudah berbagi!', created, {
      'X-RateLimit-Limit': String(rl.limit),
      'X-RateLimit-Remaining': String(rl.remaining),
    });
  } catch (err) {
    return handleError(err, 'POST /api/aspirasi/creative-box');
  }
}
