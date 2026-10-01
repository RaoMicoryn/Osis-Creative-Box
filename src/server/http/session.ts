import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Sesi admin tanpa tabel sesi: cookie berisi `<exp>.<HMAC(exp)>`, ditandatangani SESSION_SECRET.
 * Cookie httpOnly => tidak terbaca JavaScript halaman (aman dari XSS mencuri sesi).
 */
export const SESSION_COOKIE = 'cb_admin';
export const SESSION_MAX_AGE_SEC = 8 * 60 * 60; // 8 jam

const sign = (exp: string, secret: string) =>
  createHmac('sha256', secret).update(`cb-admin-session:${exp}`).digest('base64url');

export function createSessionToken(now = Date.now()): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET belum diatur');
  const exp = String(Math.floor(now / 1000) + SESSION_MAX_AGE_SEC);
  return `${exp}.${sign(exp, secret)}`;
}

export function verifySessionToken(token: string | null | undefined, now = Date.now()): boolean {
  const secret = process.env.SESSION_SECRET;
  if (!secret || !token) return false;

  const [exp, sig, ...rest] = token.split('.');
  if (!exp || !sig || rest.length || !/^\d+$/.test(exp)) return false;
  if (Number(exp) * 1000 < now) return false; // kadaluarsa

  const a = Buffer.from(sig);
  const b = Buffer.from(sign(exp, secret));
  return a.length === b.length && timingSafeEqual(a, b);
}

export function readSessionCookie(req: Request): string | null {
  const header = req.headers.get('cookie');
  if (!header) return null;
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i > 0 && part.slice(0, i).trim() === SESSION_COOKIE) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return null;
}

export const sessionCookieBase = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};
