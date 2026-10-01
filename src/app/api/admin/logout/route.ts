import { ok } from '@/server/http/response';
import { SESSION_COOKIE, sessionCookieBase } from '@/server/http/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** POST /api/admin/logout -> hapus cookie sesi */
export async function POST() {
  const res = ok(200, 'Logout berhasil.', null, { 'Cache-Control': 'no-store' });
  res.cookies.set(SESSION_COOKIE, '', { ...sessionCookieBase, maxAge: 0 });
  return res;
}
