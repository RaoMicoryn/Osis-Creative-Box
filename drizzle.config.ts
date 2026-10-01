import { loadEnvConfig } from '@next/env';
import { defineConfig } from 'drizzle-kit';
import { cleanDatabaseUrl } from './src/server/db/url';

// drizzle-kit tidak membaca .env sendiri; pakai pemuat env milik Next.js (.env, .env.local)
loadEnvConfig(process.cwd());

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/server/db/schema.ts',
  out: './drizzle',
  dbCredentials: { url: cleanDatabaseUrl(process.env.DATABASE_URL ?? 'postgresql://invalid') },
});