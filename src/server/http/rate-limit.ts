import { createHmac } from 'node:crypto';
import { sql } from 'drizzle-orm';
import type { Db } from '../db';
import { AppError } from './response';

export interface RateLimitConfig {
  limit: number; // maks request per window
  windowMs: number; // panjang window
}

export const SUBMIT_LIMIT: RateLimitConfig = {
  limit: Number(process.env.CB_RATE_LIMIT ?? 5),
  windowMs: Number(process.env.CB_RATE_WINDOW_MINUTES ?? 15) * 60_000,
};

/** IP klien. Di Vercel/proxy tepercaya, x-forwarded-for diisi oleh platform. */
export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
}

/** IP tidak pernah disimpan mentah: hanya HMAC-nya. */
export function ipKey(ip: string, scope: string): string {
  const secret = process.env.RATE_LIMIT_SECRET ?? 'dev-only-secret-ganti-di-produksi';
  return createHmac('sha256', secret).update(`${scope}:${ip}`).digest('hex');
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSec: number;
}

/**
 * Fixed-window counter, atomik lewat satu statement UPSERT (aman untuk request paralel
 * dan banyak instance serverless).
 */
export async function hit(db: Db, key: string, cfg: RateLimitConfig, now = Date.now()): Promise<RateLimitResult> {
  const windowStartMs = Math.floor(now / cfg.windowMs) * cfg.windowMs;
  const windowStart = new Date(windowStartMs);

  const rows = await db.execute<{ count: number }>(sql`
    INSERT INTO rate_limit_hits (key, window_start, count)
    VALUES (${key}, ${windowStart.toISOString()}::timestamptz, 1)
    ON CONFLICT (key, window_start)
    DO UPDATE SET count = rate_limit_hits.count + 1
    RETURNING count
  `);

  const count = Number(rows[0]?.count ?? 1);
  return {
    allowed: count <= cfg.limit,
    limit: cfg.limit,
    remaining: Math.max(0, cfg.limit - count),
    retryAfterSec: Math.max(1, Math.ceil((windowStartMs + cfg.windowMs - now) / 1000)),
  };
}

/** Hapus window kadaluarsa (panggil sesekali, mis. via cron). Dipanggil oportunistik di service. */
export async function purgeExpired(db: Db, olderThanMs = 24 * 3_600_000) {
  const cutoff = new Date(Date.now() - olderThanMs).toISOString();
  await db.execute(sql`DELETE FROM rate_limit_hits WHERE window_start < ${cutoff}::timestamptz`);
}

export function tooManyRequests(r: RateLimitResult) {
  return new AppError(
    429,
    `Terlalu banyak pengiriman. Coba lagi dalam ${Math.ceil(r.retryAfterSec / 60)} menit.`,
    null,
    {
      'Retry-After': String(r.retryAfterSec),
      'X-RateLimit-Limit': String(r.limit),
      'X-RateLimit-Remaining': '0',
    },
  );
}
