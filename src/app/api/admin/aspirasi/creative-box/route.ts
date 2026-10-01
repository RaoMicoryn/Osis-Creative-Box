import { getDb } from '@/server/db';
import { listIdeas } from '@/server/creative-box/service';
import { listQuerySchema, parseOrThrow } from '@/server/creative-box/validation';
import { requireAdmin } from '@/server/http/admin-auth';
import { handleError, ok } from '@/server/http/response';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/aspirasi/creative-box   (Admin OSIS & Guru Pembina)
 * Query: page, limit, kategori, status, is_anonymous, sort=terbaru|terlama
 */
export async function GET(req: Request) {
  try {
    requireAdmin(req);

    const params = Object.fromEntries(new URL(req.url).searchParams);
    const query = parseOrThrow(listQuerySchema, params);
    const data = await listIdeas(getDb(), query);

    // Data bisa memuat identitas siswa => jangan di-cache oleh browser/CDN
    return ok(200, 'Data aspirasi berhasil diambil.', data, { 'Cache-Control': 'no-store' });
  } catch (err) {
    return handleError(err, 'GET /api/admin/aspirasi/creative-box');
  }
}
