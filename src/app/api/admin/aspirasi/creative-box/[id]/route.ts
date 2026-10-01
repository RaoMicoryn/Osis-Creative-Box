import { z } from 'zod';
import { getDb } from '@/server/db';
import { STATUS_VALUES } from '@/server/db/schema';
import { updateStatus } from '@/server/creative-box/service';
import { parseOrThrow } from '@/server/creative-box/validation';
import { requireAdmin } from '@/server/http/admin-auth';
import { readJson } from '@/server/http/body';
import { handleError, ok } from '@/server/http/response';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const idSchema = z.guid({ error: 'ID tidak valid' });
const bodySchema = z.object({
  status: z.enum(STATUS_VALUES, { error: `status tidak valid. Pilihan: ${STATUS_VALUES.join(', ')}` }),
});

/** PATCH /api/admin/aspirasi/creative-box/:id   { status }  (Admin OSIS & Pembina) */
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    requireAdmin(req);
    const id = parseOrThrow(idSchema, params.id);
    const { status } = parseOrThrow(bodySchema, await readJson(req));
    const row = await updateStatus(getDb(), id, status);
    return ok(200, 'Status berhasil diperbarui.', row, { 'Cache-Control': 'no-store' });
  } catch (err) {
    return handleError(err, 'PATCH /api/admin/aspirasi/creative-box/[id]');
  }
}
