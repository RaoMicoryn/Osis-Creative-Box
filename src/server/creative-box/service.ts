import { and, asc, desc, eq, sql, type SQL } from 'drizzle-orm';
import type { Db } from '../db';
import { AppError } from '../http/response';
import { creativeBoxAspirations as t, type STATUS_VALUES } from '../db/schema';
import type { CreateIdeaInput, ListQuery } from './validation';

export async function createIdea(db: Db, input: CreateIdeaInput) {
  const [row] = await db
    .insert(t)
    .values({ ...input, status: 'pending' })
    .returning({
      id: t.id,
      judul_ide: t.judul_ide,
      kategori: t.kategori,
      status: t.status,
      is_anonymous: t.is_anonymous,
      created_at: t.created_at,
    });
  return row;
}

export async function listIdeas(db: Db, q: ListQuery) {
  const filters: SQL[] = [];
  if (q.kategori) filters.push(eq(t.kategori, q.kategori));
  if (q.status) filters.push(eq(t.status, q.status));
  if (q.is_anonymous !== undefined) filters.push(eq(t.is_anonymous, q.is_anonymous));
  const where = filters.length ? and(...filters) : undefined;

  const order = q.sort === 'terlama' ? [asc(t.created_at), asc(t.id)] : [desc(t.created_at), desc(t.id)];

  const [items, [{ total }]] = await Promise.all([
    db
      .select()
      .from(t)
      .where(where)
      .orderBy(...order)
      .limit(q.limit)
      .offset((q.page - 1) * q.limit),
    db.select({ total: sql<number>`count(*)::int` }).from(t).where(where),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / q.limit));
  return {
    items,
    pagination: {
      page: q.page,
      limit: q.limit,
      total,
      totalPages,
      hasNext: q.page < totalPages,
      hasPrev: q.page > 1,
    },
    filters: {
      kategori: q.kategori ?? null,
      status: q.status ?? null,
      is_anonymous: q.is_anonymous ?? null,
      sort: q.sort,
    },
  };
}

export async function updateStatus(db: Db, id: string, status: (typeof STATUS_VALUES)[number]) {
  const [row] = await db
    .update(t)
    .set({ status }) // updated_at ikut diperbarui otomatis ($onUpdate)
    .where(eq(t.id, id))
    .returning({ id: t.id, status: t.status, updated_at: t.updated_at });
  if (!row) throw new AppError(404, 'Aspirasi tidak ditemukan.');
  return row;
}

export async function deleteIdea(db: Db, id: string) {
  const [row] = await db.delete(t).where(eq(t.id, id)).returning({ id: t.id });
  if (!row) throw new AppError(404, 'Aspirasi tidak ditemukan.');
  return row;
}