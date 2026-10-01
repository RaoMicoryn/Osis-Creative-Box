# Creative Box, Kotak Aspirasi OSIS

Multi-step form untuk menampung ide kreatif siswa. Next.js 14 (App Router) + Ant Design 5 + Tailwind CSS 3 + Axios.

## Jalankan

```bash
npm install
npm run dev
```

Buka http://localhost:3000 (otomatis redirect ke `/creative-box`).

## Struktur

```
src/
  app/
    layout.tsx                      # AntdRegistry + globals
    creative-box/page.tsx           # halaman form
    api/aspirasi/creative-box/route.ts   # endpoint (MOCK, ganti dengan insert DB)
  components/creative-box/CreativeBox.tsx  # wizard form
  lib/payload.ts                    # FormValues -> JSON payload
  types/creative-box.ts             # tipe & daftar kategori
db/schema.sql                       # skema tabel PostgreSQL/MySQL
```

## Back-End (Creative Box)

Next.js Route Handlers + Drizzle ORM (PostgreSQL/Neon) + Zod.

```bash
cp .env.example .env.local      # isi DATABASE_URL, ADMIN_PASSWORD, SESSION_SECRET, RATE_LIMIT_SECRET
npm run db:migrate              # menjalankan drizzle/0000_init_creative_box.sql
npm run dev
npm test                        # uji integrasi (butuh DATABASE_URL ke DB KOSONG/khusus test, menjalankan TRUNCATE!)
```

| Endpoint | Akses | Keterangan |
|---|---|---|
| `POST /api/aspirasi/creative-box` | Publik, rate limit per IP | Validasi Zod, anonim ⇒ identitas dipaksa `null`, status `pending`, 201 |
| `GET /api/admin/aspirasi/creative-box` | Cookie sesi admin, atau `Authorization: Bearer <ADMIN_API_KEY>` | `page, limit(≤100), kategori, status, is_anonymous, sort=terbaru\|terlama` |
| `PATCH /api/admin/aspirasi/creative-box/:id` | Sama seperti GET admin | Body `{ "status": "pending / dibaca_osis / disetujui_pembina / ditolak" }` |
| `POST /api/admin/login`, `POST /api/admin/logout` | - | Login dengan `ADMIN_PASSWORD`, cookie httpOnly 8 jam, dibatasi 8 percobaan / 15 menit / IP |

Format response baku: `{ success, statusCode, message, data, errors }`.

Halaman admin: `/admin/login`, lalu `/admin/creative-box` (tabel, filter, detail, ubah status).
