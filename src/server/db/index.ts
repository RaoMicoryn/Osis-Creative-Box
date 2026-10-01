import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Simpan koneksi di globalThis agar hot-reload `next dev` tidak membuka koneksi baru terus-menerus.
const globalForDb = globalThis as unknown as { __pg?: ReturnType<typeof postgres> };

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL belum diatur');
  return postgres(url, {
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false, // aman untuk pooler Neon (pgbouncer / transaction mode)
  });
}

export function getDb() {
  globalForDb.__pg ??= createClient();
  return drizzle(globalForDb.__pg, { schema });
}

export type Db = ReturnType<typeof getDb>;
