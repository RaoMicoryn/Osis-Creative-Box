import { createHash, timingSafeEqual } from 'node:crypto';
import { readSessionCookie, verifySessionToken } from './session';
import { AppError } from './response';

const sha = (s: string) => createHash('sha256').update(s).digest();

export const safeEqual = (a: string, b: string) => timingSafeEqual(sha(a), sha(b));

/**
 * Guard endpoint admin (OSIS & Pembina). Dua cara masuk yang sah:
 *  1. Cookie sesi hasil login di /admin/login  (dipakai halaman admin)
 *  2. Header `Authorization: Bearer <ADMIN_API_KEY>` (curl / Postman / skrip)
 *
 * Fail-closed: jika tidak ada satupun yang dikonfigurasi, semua akses ditolak (503).
 */
export function requireAdmin(req: Request): void {
  const apiKey = process.env.ADMIN_API_KEY;
  const sessionEnabled = Boolean(process.env.SESSION_SECRET);

  if (!apiKey && !sessionEnabled) {
    console.error('[admin-auth] ADMIN_API_KEY / SESSION_SECRET belum diatur, semua akses admin ditolak');
    throw new AppError(503, 'Endpoint admin belum dikonfigurasi.');
  }

  const header = req.headers.get('authorization') ?? '';
  const bearer = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (apiKey && bearer && safeEqual(bearer, apiKey)) return;

  if (verifySessionToken(readSessionCookie(req))) return;

  throw new AppError(401, 'Tidak diizinkan. Login sebagai admin terlebih dahulu.', null, {
    'WWW-Authenticate': 'Bearer',
  });
}
