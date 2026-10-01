/**
 * Uji login/sesi admin + PATCH status. Jalankan lewat `npm test` (butuh DATABASE_URL ke DB uji!).
 */
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

process.env.ADMIN_API_KEY = 'kunci-admin-test';
process.env.ADMIN_PASSWORD = 'password-rahasia';
process.env.SESSION_SECRET = 'secret-sesi-test-yang-panjang';
process.env.RATE_LIMIT_SECRET = 'rahasia-test';

let LOGIN: (r: Request) => Promise<Response>;
let LOGOUT: () => Promise<Response>;
let LIST: (r: Request) => Promise<Response>;
let PATCH: (r: Request, c: { params: { id: string } }) => Promise<Response>;
let DELETE: (r: Request, c: { params: { id: string } }) => Promise<Response>;
let session: typeof import('../src/server/http/session');
let sql: any;

let ipSeq = 0;
const login = (password: unknown, ip = `172.16.0.${++ipSeq}`) =>
  LOGIN(
    new Request('http://localhost/api/admin/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
      body: JSON.stringify({ password }),
    }),
  );

const cookieOf = (res: Response) => (res.headers.get('set-cookie') ?? '').split(';')[0]; // "cb_admin=..."

const list = (headers: Record<string, string> = {}) =>
  LIST(new Request('http://localhost/api/admin/aspirasi/creative-box', { headers }));

const patch = (id: string, body: unknown, headers: Record<string, string> = {}) =>
  PATCH(
    new Request(`http://localhost/api/admin/aspirasi/creative-box/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', ...headers },
      body: JSON.stringify(body),
    }),
    { params: { id } },
  );

const del = (id: string, headers: Record<string, string> = {}) =>
  DELETE(new Request(`http://localhost/api/admin/aspirasi/creative-box/${id}`, { method: 'DELETE', headers }), { params: { id } });

describe('Admin session & status', () => {
  let ideaId = '';
  before(async () => {
    process.env.DATABASE_URL ??= 'postgresql://postgres:pw@localhost:5432/cbtest';
    LOGIN = (await import('../src/app/api/admin/login/route')).POST;
    LOGOUT = (await import('../src/app/api/admin/logout/route')).POST;
    LIST = (await import('../src/app/api/admin/aspirasi/creative-box/route')).GET;
    const idRoute = await import('../src/app/api/admin/aspirasi/creative-box/[id]/route');
    PATCH = idRoute.PATCH;
    DELETE = idRoute.DELETE;
    session = await import('../src/server/http/session');
    const postgres = (await import('postgres')).default;
    sql = postgres(process.env.DATABASE_URL!);
    await sql`TRUNCATE creative_box_aspirations, rate_limit_hits`;
    const [r] = await sql`INSERT INTO creative_box_aspirations (judul_ide, kategori, deskripsi_ide) VALUES ('Ide uji','lainnya','d') RETURNING id`;
    ideaId = r.id;
  });
  after(async () => sql.end());

  it('login benar => 200 + cookie httpOnly, SameSite=Lax', async () => {
    const res = await login('password-rahasia');
    assert.equal(res.status, 200);
    const sc = res.headers.get('set-cookie') ?? '';
    assert.match(sc, /^cb_admin=/);
    assert.match(sc, /HttpOnly/i);
    assert.match(sc, /SameSite=lax/i);
    assert.match(sc, /Max-Age=28800/i);
  });

  it('login salah => 401 tanpa cookie; password kosong/bukan string => 400', async () => {
    const bad = await login('salah');
    assert.equal(bad.status, 401);
    assert.equal(bad.headers.get('set-cookie'), null);
    assert.equal((await login('')).status, 400);
    assert.equal((await login(12345)).status, 400);
  });

  it('login dibatasi: percobaan ke-9 dari IP sama => 429', async () => {
    const ip = '198.51.100.7';
    for (let i = 0; i < 8; i++) assert.equal((await login('salah', ip)).status, 401);
    const res = await login('password-rahasia', ip); // walau benar, tetap diblok
    assert.equal(res.status, 429);
    assert.ok(Number(res.headers.get('retry-after')) > 0);
  });

  it('503 jika ADMIN_PASSWORD belum diatur (fail-closed)', async () => {
    const saved = process.env.ADMIN_PASSWORD;
    delete process.env.ADMIN_PASSWORD;
    try {
      assert.equal((await login('apa-saja')).status, 503);
    } finally {
      process.env.ADMIN_PASSWORD = saved;
    }
  });

  it('cookie sesi valid dapat mengakses GET admin; tanpa / rusak => 401', async () => {
    const cookie = cookieOf(await login('password-rahasia'));
    assert.equal((await list({ cookie })).status, 200);
    assert.equal((await list()).status, 401);
    assert.equal((await list({ cookie: cookie.slice(0, -3) + 'xyz' })).status, 401); // tanda tangan diubah
    assert.equal((await list({ cookie: 'cb_admin=9999999999.palsu' })).status, 401);
    assert.equal((await list({ cookie: 'cb_admin=' })).status, 401);
  });

  it('token kadaluarsa ditolak; token dengan exp dimundurkan ditolak', async () => {
    const old = session.createSessionToken(Date.now() - 9 * 3600_000); // dibuat 9 jam lalu (> 8 jam)
    assert.equal(session.verifySessionToken(old), false);
    const fresh = session.createSessionToken();
    assert.equal(session.verifySessionToken(fresh), true);
    const [, sig] = fresh.split('.');
    assert.equal(session.verifySessionToken(`1.${sig}`), false); // exp dipalsukan
  });

  it('Bearer API key tetap berfungsi berdampingan dengan sesi', async () => {
    assert.equal((await list({ authorization: 'Bearer kunci-admin-test' })).status, 200);
    assert.equal((await list({ authorization: 'Bearer salah' })).status, 401);
  });

  it('logout menghapus cookie (Max-Age=0)', async () => {
    const res = await LOGOUT();
    assert.equal(res.status, 200);
    assert.match(res.headers.get('set-cookie') ?? '', /Max-Age=0/i);
  });

  it('PATCH status: 200, updated_at ikut berubah', async () => {
    const cookie = cookieOf(await login('password-rahasia'));
    const [before] = await sql`SELECT created_at, updated_at, status FROM creative_box_aspirations WHERE id = ${ideaId}`;
    assert.equal(before.status, 'pending');
    await new Promise((r) => setTimeout(r, 20));
    const res = await patch(ideaId, { status: 'disetujui_pembina' }, { cookie });
    const j = await res.json();
    assert.equal(res.status, 200);
    assert.equal(j.data.status, 'disetujui_pembina');
    const [after] = await sql`SELECT status, updated_at FROM creative_box_aspirations WHERE id = ${ideaId}`;
    assert.equal(after.status, 'disetujui_pembina');
    assert.ok(after.updated_at > before.updated_at);
  });

  it('PATCH: 401 tanpa auth; 400 id/status tidak valid; 404 id tidak ada', async () => {
    const h = { authorization: 'Bearer kunci-admin-test' };
    assert.equal((await patch(ideaId, { status: 'ditolak' })).status, 401);
    assert.equal((await patch('bukan-uuid', { status: 'ditolak' }, h)).status, 400);
    assert.equal((await patch(ideaId, { status: 'dihapus' }, h)).status, 400);
    assert.equal((await patch(ideaId, {}, h)).status, 400);
    assert.equal((await patch('00000000-0000-4000-8000-000000000000', { status: 'ditolak' }, h)).status, 404);
  });

  it('DELETE: 401 tanpa auth; 400 id tidak valid; 404 id tidak ada', async () => {
    const h = { authorization: 'Bearer kunci-admin-test' };
    assert.equal((await del(ideaId)).status, 401);
    assert.equal((await del('bukan-uuid', h)).status, 400);
    assert.equal((await del('00000000-0000-4000-8000-000000000000', h)).status, 404);
    const [{ n }] = await sql`SELECT count(*)::int n FROM creative_box_aspirations WHERE id = ${ideaId}`;
    assert.equal(n, 1); // percobaan gagal tidak menghapus apa pun
  });

  it('DELETE: 200 menghapus permanen (cookie sesi); hapus lagi => 404; hanya baris itu yang hilang', async () => {
    const cookie = cookieOf(await login('password-rahasia'));
    const [other] = await sql`INSERT INTO creative_box_aspirations (judul_ide, kategori, deskripsi_ide) VALUES ('Ide lain','lainnya','d') RETURNING id`;
    const res = await del(ideaId, { cookie });
    const j = await res.json();
    assert.equal(res.status, 200);
    assert.equal(j.data.id, ideaId);
    const gone = await sql`SELECT 1 FROM creative_box_aspirations WHERE id = ${ideaId}`;
    assert.equal(gone.length, 0);
    const kept = await sql`SELECT 1 FROM creative_box_aspirations WHERE id = ${other.id}`;
    assert.equal(kept.length, 1);
    assert.equal((await del(ideaId, { cookie })).status, 404);
  });
});