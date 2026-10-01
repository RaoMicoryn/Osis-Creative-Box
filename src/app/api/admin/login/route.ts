import { z } from 'zod';
import { getDb } from '@/server/db';
import { safeEqual } from '@/server/http/admin-auth';
import { readJson } from '@/server/http/body';
import { getClientIp, hit, ipKey, tooManyRequests, type RateLimitConfig } from '@/server/http/rate-limit';
import { AppError, handleError, ok } from '@/server/http/response';
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE_SEC, sessionCookieBase } from '@/server/http/session';
import { parseOrThrow } from '@/server/creative-box/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Batasi tebak-tebakan password: 8 percobaan / 15 menit / IP
const LOGIN_LIMIT: RateLimitConfig = { limit: 8, windowMs: 15 * 60_000 };

const bodySchema = z.object({
  password: z.string({ error: 'Password wajib diisi' }).min(1, 'Password wajib diisi').max(200, 'Password terlalu panjang'),
});

/** POST /api/admin/login  { password }  ->  set cookie sesi httpOnly */
export async function POST(req: Request) {
  try {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || !process.env.SESSION_SECRET) {
      console.error('[admin-login] ADMIN_PASSWORD / SESSION_SECRET belum diatur');
      throw new AppError(503, 'Login admin belum dikonfigurasi.');
    }

    const rl = await hit(getDb(), ipKey(getClientIp(req), 'admin:login'), LOGIN_LIMIT);
    if (!rl.allowed) throw tooManyRequests(rl);

    const { password } = parseOrThrow(bodySchema, await readJson(req));
    if (!safeEqual(password, expected)) throw new AppError(401, 'Password salah.');

    const res = ok(200, 'Login berhasil.', { expiresInSec: SESSION_MAX_AGE_SEC }, { 'Cache-Control': 'no-store' });
    res.cookies.set(SESSION_COOKIE, createSessionToken(), { ...sessionCookieBase, maxAge: SESSION_MAX_AGE_SEC });
    return res;
  } catch (err) {
    return handleError(err, 'POST /api/admin/login');
  }
}
