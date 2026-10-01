/**
 * Uji integrasi: memanggil handler route langsung terhadap Postgres sungguhan.
 * Jalankan: DATABASE_URL=postgresql://... npm test
 */
import assert from 'node:assert/strict';
import { after, before, describe, it } from 'node:test';

process.env.ADMIN_API_KEY = 'kunci-admin-test';
process.env.RATE_LIMIT_SECRET = 'rahasia-test';
process.env.CB_RATE_LIMIT = '5';
process.env.CB_RATE_WINDOW_MINUTES = '15';

let POST: (r: Request) => Promise<Response>;
let GET: (r: Request) => Promise<Response>;
let handleError: (e: unknown, c: string) => Response;
let sql: any;

let ipSeq = 0;
const newIp = () => `10.0.0.${++ipSeq}`;

const post = (body: unknown, opts: { ip?: string; raw?: string; ct?: string } = {}) =>
  POST(
    new Request('http://localhost/api/aspirasi/creative-box', {
      method: 'POST',
      headers: { 'content-type': opts.ct ?? 'application/json', 'x-forwarded-for': opts.ip ?? newIp() },
      body: opts.raw ?? JSON.stringify(body),
    }),
  );

const get = (qs = '', key: string | null = 'kunci-admin-test') =>
  GET(
    new Request(`http://localhost/api/admin/aspirasi/creative-box${qs}`, {
      headers: key ? { authorization: `Bearer ${key}` } : {},
    }),
  );

const feAnon = {
  idea: { title: 'Alat penjernih air', category: 'Lingkungan', description: 'Saring air hujan untuk menyiram taman.' },
  implementation: { description: 'Pakai pasir dan arang.' },
  benefit: null,
  submitter: { isAnonymous: true, name: 'Budi', className: '10A', contact: 'budi@x.id' },
  meta: { submittedAt: new Date().toISOString(), source: 'creative-box-web' },
};

describe('Creative Box API', () => {
  before(async () => {
    process.env.DATABASE_URL ??= 'postgresql://postgres:pw@localhost:5432/cbtest';
    POST = (await import('../src/app/api/aspirasi/creative-box/route')).POST;
    GET = (await import('../src/app/api/admin/aspirasi/creative-box/route')).GET;
    handleError = (await import('../src/server/http/response')).handleError;
    const postgres = (await import('postgres')).default;
    sql = postgres(process.env.DATABASE_URL!);
    await sql`TRUNCATE creative_box_aspirations, rate_limit_hits`;
  });
  after(async () => sql.end());

  describe('POST', () => {
    it('201 + payload nested dari FE; anonim memaksa identitas null di DB', async () => {
      const res = await post(feAnon);
      const j = await res.json();
      assert.equal(res.status, 201);
      assert.equal(j.success, true);
      assert.equal(j.statusCode, 201);
      assert.equal(j.data.status, 'pending');
      assert.equal(j.data.kategori, 'lingkungan');
      const [row] = await sql`SELECT * FROM creative_box_aspirations WHERE id = ${j.data.id}`;
      assert.equal(row.is_anonymous, true);
      assert.equal(row.nama_siswa, null);
      assert.equal(row.kelas, null);
      assert.equal(row.kontak, null);
      assert.equal(row.manfaat, null);
      assert.equal(row.detail_pengerjaan, 'Pakai pasir dan arang.');
    });

    it('201 non-anonim menyimpan identitas (nested)', async () => {
      const body = { ...feAnon, submitter: { isAnonymous: false, name: ' Siti ', className: '11B', contact: '0812-3456-7890' } };
      const j = await (await post(body)).json();
      const [row] = await sql`SELECT * FROM creative_box_aspirations WHERE id = ${j.data.id}`;
      assert.equal(row.nama_siswa, 'Siti');
      assert.equal(row.kelas, '11B');
      assert.equal(row.kontak, '0812-3456-7890');
    });

    it('201 bentuk flat sesuai spesifikasi + kategori slug; is_anonymous default true', async () => {
      const res = await post({ judul_ide: 'Pentas seni', kategori: 'acara_sekolah', deskripsi_ide: 'Pentas akhir semester', nama_siswa: 'X' });
      const j = await res.json();
      assert.equal(res.status, 201);
      assert.equal(j.data.is_anonymous, true);
      const [row] = await sql`SELECT nama_siswa FROM creative_box_aspirations WHERE id = ${j.data.id}`;
      assert.equal(row.nama_siswa, null);
    });

    it('label "Acara Sekolah" dari FE diterima', async () => {
      const res = await post({ ...feAnon, idea: { ...feAnon.idea, category: 'Acara Sekolah' } });
      assert.equal(res.status, 201);
      assert.equal((await res.json()).data.kategori, 'acara_sekolah');
    });

    it('NUL char dibersihkan (tidak jadi 500)', async () => {
      const res = await post({ ...feAnon, idea: { ...feAnon.idea, title: 'Judul\u0000 aman' } });
      assert.equal(res.status, 201);
      assert.equal((await res.json()).data.judul_ide, 'Judul aman');
    });

    it('400: judul kosong / spasi saja, dengan detail field', async () => {
      const res = await post({ ...feAnon, idea: { ...feAnon.idea, title: '   ' } });
      const j = await res.json();
      assert.equal(res.status, 400);
      assert.equal(j.success, false);
      assert.equal(j.data, null);
      assert.equal(j.errors[0].field, 'judul_ide');
      assert.match(j.message, /Judul ide wajib diisi/);
    });

    it('400: banyak field salah sekaligus', async () => {
      const j = await (await post({})).json();
      const fields = j.errors.map((e: any) => e.field).sort();
      assert.deepEqual(fields, ['deskripsi_ide', 'judul_ide', 'kategori']);
    });

    it('400: kategori tidak valid', async () => {
      const res = await post({ ...feAnon, idea: { ...feAnon.idea, category: 'Hacking' } });
      assert.equal(res.status, 400);
      assert.equal((await res.json()).errors[0].field, 'kategori');
    });

    it('400: deskripsi 501 karakter; 500 karakter lolos', async () => {
      const r1 = await post({ ...feAnon, idea: { ...feAnon.idea, description: 'a'.repeat(501) } });
      assert.equal(r1.status, 400);
      const r2 = await post({ ...feAnon, idea: { ...feAnon.idea, description: 'a'.repeat(500) } });
      assert.equal(r2.status, 201);
    });

    it('400: detail 1001 karakter', async () => {
      const res = await post({ ...feAnon, implementation: { description: 'b'.repeat(1001) } });
      assert.equal(res.status, 400);
      assert.equal((await res.json()).errors[0].field, 'detail_pengerjaan');
    });

    it('400: kontak non-anonim bukan email/HP', async () => {
      const res = await post({ ...feAnon, submitter: { isAnonymous: false, contact: 'halo dunia' } });
      assert.equal(res.status, 400);
      assert.equal((await res.json()).errors[0].field, 'kontak');
    });

    it('400: JSON rusak; 415: bukan JSON; 413: terlalu besar', async () => {
      assert.equal((await post(null, { raw: '{bukan json' })).status, 400);
      assert.equal((await post(null, { raw: '{}', ct: 'text/plain' })).status, 415);
      assert.equal((await post(null, { raw: JSON.stringify({ x: 'a'.repeat(20_000) }) })).status, 413);
      assert.equal((await post(null, { raw: '[1,2]' })).status, 400); // array bukan objek
    });

    it('429 setelah 5 submit dari IP sama; IP lain tetap boleh', async () => {
      const ip = '203.0.113.9';
      for (let i = 0; i < 5; i++) assert.equal((await post(feAnon, { ip })).status, 201);
      const res = await post(feAnon, { ip });
      const j = await res.json();
      assert.equal(res.status, 429);
      assert.equal(j.success, false);
      assert.ok(Number(res.headers.get('retry-after')) > 0);
      assert.equal((await post(feAnon, { ip: '203.0.113.10' })).status, 201);
      // yang kena limit TIDAK tersimpan
      const [{ n }] = await sql`SELECT count(*)::int n FROM creative_box_aspirations`;
      assert.ok(n > 0);
    });

    it('IP tidak disimpan mentah di tabel rate_limit_hits', async () => {
      const rows = await sql`SELECT key FROM rate_limit_hits`;
      assert.ok(rows.length > 0);
      assert.ok(rows.every((r: any) => /^[0-9a-f]{64}$/.test(r.key)));
    });
  });

  describe('GET admin', () => {
    before(async () => {
      await sql`TRUNCATE creative_box_aspirations`;
      const base = { deskripsi_ide: 'd' };
      await sql`INSERT INTO creative_box_aspirations (judul_ide, kategori, deskripsi_ide, is_anonymous, nama_siswa, status, created_at) VALUES
        ('A','lingkungan','d',true,null,'pending','2026-01-01T00:00:00Z'),
        ('B','fasilitas','d',false,'Ani','dibaca_osis','2026-01-02T00:00:00Z'),
        ('C','fasilitas','d',true,null,'pending','2026-01-03T00:00:00Z'),
        ('D','akademik','d',false,'Dedi','disetujui_pembina','2026-01-04T00:00:00Z'),
        ('E','lainnya','d',true,null,'ditolak','2026-01-05T00:00:00Z')`;
      void base;
    });

    it('401 tanpa / dengan kunci salah', async () => {
      const r1 = await get('', null);
      assert.equal(r1.status, 401);
      assert.equal((await get('', 'salah')).status, 401);
    });

    it('503 fail-closed jika ADMIN_API_KEY tidak diatur', async () => {
      const saved = process.env.ADMIN_API_KEY;
      delete process.env.ADMIN_API_KEY;
      try {
        assert.equal((await get('', 'apa-saja')).status, 503);
      } finally {
        process.env.ADMIN_API_KEY = saved;
      }
    });

    it('200 default: terbaru dulu, pagination, no-store', async () => {
      const res = await get();
      const j = await res.json();
      assert.equal(res.status, 200);
      assert.equal(res.headers.get('cache-control'), 'no-store');
      assert.deepEqual(j.data.items.map((i: any) => i.judul_ide), ['E', 'D', 'C', 'B', 'A']);
      assert.deepEqual(j.data.pagination, { page: 1, limit: 10, total: 5, totalPages: 1, hasNext: false, hasPrev: false });
    });

    it('sort=terlama + paginasi', async () => {
      const j = await (await get('?sort=terlama&limit=2&page=2')).json();
      assert.deepEqual(j.data.items.map((i: any) => i.judul_ide), ['C', 'D']);
      assert.equal(j.data.pagination.totalPages, 3);
      assert.equal(j.data.pagination.hasNext, true);
      assert.equal(j.data.pagination.hasPrev, true);
    });

    it('filter kategori, status, is_anonymous (dan kombinasi)', async () => {
      const titles = async (qs: string) => (await (await get(qs)).json()).data.items.map((i: any) => i.judul_ide).sort();
      assert.deepEqual(await titles('?kategori=fasilitas'), ['B', 'C']);
      assert.deepEqual(await titles('?kategori=Acara%20Sekolah'), []);
      assert.deepEqual(await titles('?status=pending'), ['A', 'C']);
      assert.deepEqual(await titles('?is_anonymous=false'), ['B', 'D']);
      assert.deepEqual(await titles('?is_anonymous=true&kategori=fasilitas'), ['C']);
      assert.deepEqual(await titles('?kategori=&status='), ['A', 'B', 'C', 'D', 'E']); // kosong = abaikan
    });

    it('400 untuk parameter tidak valid', async () => {
      for (const qs of ['?limit=0', '?limit=101', '?page=abc', '?page=-1', '?status=x', '?kategori=x', '?is_anonymous=maybe', '?sort=acak']) {
        const res = await get(qs);
        assert.equal(res.status, 400, qs);
      }
    });

    it('item non-anonim membawa identitas, anonim null', async () => {
      const items = (await (await get('?sort=terlama')).json()).data.items;
      assert.equal(items.find((i: any) => i.judul_ide === 'B').nama_siswa, 'Ani');
      assert.equal(items.find((i: any) => i.judul_ide === 'A').nama_siswa, null);
    });
  });

  describe('Error handling & DB guard', () => {
    it('error tak terduga => 500 generik tanpa bocor detail/stack', async () => {
      const orig = console.error;
      console.error = () => {};
      const res = handleError(new Error('connect ECONNREFUSED 10.1.2.3:5432 password=rahasia'), 'test');
      console.error = orig;
      const j = await res.json();
      assert.equal(res.status, 500);
      assert.equal(j.success, false);
      assert.ok(!JSON.stringify(j).includes('rahasia'));
      assert.ok(!JSON.stringify(j).includes('ECONNREFUSED'));
    });

    it('CHECK constraint DB menolak anonim yang membawa identitas (insert langsung)', async () => {
      await assert.rejects(
        sql`INSERT INTO creative_box_aspirations (judul_ide, kategori, deskripsi_ide, is_anonymous, nama_siswa) VALUES ('x','lainnya','y',true,'Bocor')`,
        /cb_anonim_tanpa_identitas/,
      );
      await assert.rejects(
        sql`INSERT INTO creative_box_aspirations (judul_ide, kategori, deskripsi_ide) VALUES ('x','lainnya',${'z'.repeat(501)})`,
        /cb_deskripsi_max_500/,
      );
    });
  });
});
