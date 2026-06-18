# Ruang Usaha Kita

Ruang Usaha Kita adalah marketplace jasa digital yang menghubungkan UMKM dengan kreator, content creator, dan marketer untuk kebutuhan promosi digital. Platform ini dibangun sebagai sistem e-commerce jasa, bukan toko barang fisik.

Repositori ini sudah berada pada fase full-stack MVP yang cukup luas: autentikasi, onboarding, katalog publik, cart dan checkout brief, payment sandbox, order lifecycle, delivery dan revisi, dashboard per role, admin monitoring, analytics internal, dan integrasi Supabase.

## Gambaran Singkat

- Public marketplace: landing page, katalog kreator, detail kreator, detail layanan, bantuan, cara kerja
- Auth: login, register, forgot password, reset password, callback, role redirect
- UMKM: dashboard, cart, checkout brief, payment sandbox, order list, order detail, invoice, receipt, results, settings
- Creator: dashboard, onboarding, profile, services CRUD, portfolio, orders, earnings, settings
- Admin: dashboard, analytics, users, UMKM, creators, services, orders, payments, complaints, reports, settings
- Backend flow: Supabase Auth, PostgreSQL, RLS, Server Actions, API routes, storage foundation, payment sandbox RPC

## Domain Rules

Gunakan istilah berikut di seluruh pengembangan:

- `UMKM`
- `kreator`
- `content creator`
- `marketer`
- `paket jasa`
- `layanan digital`
- `brief campaign`
- `hasil konten`
- `revisi`
- `status pesanan`
- `pembayaran`
- `invoice`
- `portofolio`
- `review`

Jangan gunakan konsep marketplace barang fisik seperti:

- `stock`
- `inventory barang`
- `warehouse`
- `shipping`
- `courier`
- `tracking number`
- `delivery address`
- `packing`
- `shipment`
- `resi`
- `ongkir`
- `gudang`
- `kurir`
- `alamat pengiriman barang`

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Radix UI
- Lucide React
- Supabase Auth, Database, Storage, Realtime
- Sonner
- React Hook Form + Zod
- TanStack Table
- Recharts
- Zustand
- Vercel

## Status Sistem Saat Ini

Kondisi repo saat ini secara garis besar:

- Runtime app memakai data Supabase dan empty state jujur, bukan dummy runtime
- Public catalog dan detail page sudah membaca data real
- Register dan login berbasis Supabase Auth dengan role `umkm`, `creator`, dan `admin`
- Public register tidak membuat admin
- Dashboard per role sudah aktif
- Creator dapat mengelola layanan, tier, add-on, dan portofolio miliknya sendiri
- UMKM dapat menambahkan layanan ke cart, mengisi brief, membuat pesanan, dan membuka payment sandbox
- Payment sandbox memisahkan `payment_status` dan `order_status`
- Creator delivery, revisi, invoice, receipt, notification, dan admin analytics sudah punya fondasi route dan data layer

Source of truth utama tetap kode aktual, migration Supabase, dan dokumen di `docs/`.

## Struktur Utama

```txt
src/
  app/
    (public)/
    (auth)/
    (umkm)/
    (creator)/
    (admin)/
    api/
  components/
    common/
    dashboard/
    layout/
    ui/
  features/
    admin/
    auth/
    briefs/
    cart/
    catalog/
    checkout/
    creator/
    dashboard/
    invoices/
    notifications/
    onboarding/
    orders/
    payments/
    public/
    services/
    submissions/
    umkm/
  lib/
    auth/
    config/
    constants/
    formatters/
    payment/
    storage/
    supabase/
    utils.ts
scripts/
supabase/
  migrations/
  query/
docs/
public/
```

## Route Groups

- `(public)` untuk halaman publik
- `(auth)` untuk autentikasi
- `(umkm)` untuk area UMKM
- `(creator)` untuk area kreator
- `(admin)` untuk area admin
- `api` untuk endpoint internal

Contoh route penting:

- `/`
- `/katalog`
- `/kreator/[creatorId]`
- `/layanan/[serviceId]`
- `/cara-kerja`
- `/bantuan`
- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`
- `/umkm/dashboard`
- `/creator/dashboard`
- `/admin/dashboard`

## Prasyarat

- Node.js 20 atau lebih baru
- npm
- Git
- Akun Supabase

Cek versi:

```bash
node -v
npm -v
git --version
```

## Menjalankan Secara Lokal

1. Clone repo

```bash
git clone https://github.com/faddgraphics/ruangusahakita.git
cd ruangusaha
```

2. Install dependency

```bash
npm install
```

3. Buat `.env.local` dari `.env.example`

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

4. Isi environment variable yang dibutuhkan

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
APP_DEMO_MODE=false
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

5. Jalankan development server

```bash
npm run dev
```

6. Buka browser

```txt
http://localhost:3000
```

## Environment Variables

| Variable | Wajib | Keterangan |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Ya | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Ya | Public anon key untuk client dan server session-aware |
| `SUPABASE_SERVICE_ROLE_KEY` | Ya untuk seed/admin task | Server-only key, tidak boleh masuk browser |
| `APP_DEMO_MODE` | Opsional | Mengaktifkan mode demo read-only tertentu |
| `NEXT_PUBLIC_APP_URL` | Ya | Base URL aplikasi untuk redirect, sitemap, dan link |

Aturan:

- Jangan commit `.env.local`
- Jangan beri prefix `NEXT_PUBLIC_` pada secret
- Jangan import admin client ke client component

## Supabase Workflow

Repositori ini memakai migration SQL bertahap di `supabase/migrations/`. Jangan edit migration lama yang sudah diterapkan; selalu buat migration baru jika perlu.

Langkah setup database development:

1. Pastikan env Supabase sudah terisi
2. Apply migration ke project development

```bash
npx supabase db push
```

3. Jika perlu seed data awal dari file seed SQL

```bash
npx supabase db reset
```

Gunakan reset hanya untuk local database yang memang aman dihapus.

4. Untuk membuat akun creator demo real di Supabase Auth + database:

```bash
npm run seed:real-creators
```

Script ini membaca env, membuat akun `creator24@ruang.usaha` sampai `creator50@ruang.usaha`, lalu mengisi `profiles`, `creator_profiles`, `service_packages`, tier, dan data terkait.

## SQL Helper

Repositori ini juga menyimpan helper SQL yang berguna:

- `docs/sql/set-admin-role.sql`
- `supabase/query/admin_query.sql`
- `supabase/query/verify_seed_creators.sql`
- `supabase/query/cleanup_admin_analytics.sql`

Gunakan file query tersebut di Supabase SQL Editor saat memang dibutuhkan.

## Script NPM

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run typecheck
npm run check
npm run seed:real-creators
```

Arti script:

- `dev`: menjalankan Next.js dev server
- `build`: production build
- `start`: menjalankan hasil build
- `lint`: menjalankan ESLint
- `test`: menjalankan Vitest
- `typecheck`: menjalankan TypeScript tanpa emit
- `check`: `typecheck + lint + build`
- `seed:real-creators`: membuat akun creator real untuk katalog dan login test

## Role dan Akses

### Guest

- Bisa membuka halaman publik
- Tidak bisa membuka dashboard

### UMKM

- Redirect utama: `/umkm/dashboard`
- Bisa mengelola cart, checkout, brief, order, hasil, payment, receipt, settings

### Creator

- Redirect utama: `/creator/dashboard`
- Bisa mengelola profile, services, portfolio, orders, earnings, settings

### Admin

- Redirect utama: `/admin/dashboard`
- Bisa membuka dashboard monitoring, analytics, users, creators, services, orders, payments, complaints, reports, settings

## Feature Map Ringkas

### Public

- Landing page marketplace
- Catalog search, filter, sort
- Creator detail
- Service detail
- Bantuan dan cara kerja

### Auth

- Register role `umkm` dan `creator`
- Login role-aware
- Forgot password
- Reset password
- Auth callback

### UMKM

- Dashboard overview
- Cart
- Checkout brief
- Direct checkout
- Payment sandbox
- Order list dan detail
- Invoice dan receipt print-friendly
- Results
- Settings

### Creator

- Dashboard overview
- Onboarding
- Profile management
- Services CRUD
- Portfolio management
- Orders
- Earnings
- Settings

### Admin

- Dashboard command center
- Analytics internal
- User monitoring
- Creator moderation
- Service monitoring
- Order monitoring
- Payment monitoring
- Complaint handling
- Reports dan export
- Platform settings

## Arsitektur Penting

Beberapa aturan yang perlu dijaga:

- Default ke Server Components
- Pakai Client Components hanya untuk interaksi yang memang perlu
- Gunakan alias import `@/*`
- `src/lib/utils.ts` tetap file, jangan dibuat folder `src/lib/utils`
- Jangan ubah `src/components/ui/*` kecuali ada isu kompatibilitas yang jelas
- Hindari `any`
- Pisahkan `payment_status` dan `order_status`
- Jangan percaya data sensitif dari client
- Gunakan server action, route handler, atau RPC untuk operasi sensitif

## Validasi Sebelum Push

Minimal jalankan:

```bash
npm run check
```

Jika menyentuh database atau seed:

```bash
npx supabase db push
npm run seed:real-creators
```

Jika menyentuh search/filter, auth, order, payment, atau dashboard, lakukan juga QA manual pada route terkait.

## Testing

Tool testing yang sudah ada:

- TypeScript
- ESLint
- Vitest
- React Testing Library
- Playwright

Dokumen testing ada di:

- `docs/architecture/testing-strategy.md`
- `docs/architecture/auth-smoke-test.md`

## Deployment

Deployment utama memakai Vercel. Panduan detail ada di `docs/architecture/deployment.md`.

Checklist minimum sebelum deploy:

```bash
npm run check
```

Pastikan juga:

- env Vercel terisi benar
- redirect auth Supabase sesuai domain
- webhook/payment sandbox mengarah ke URL yang tepat

## Email dan Reset Password

Flow forgot password memakai Supabase Auth. Redirect yang perlu diizinkan dijelaskan di:

- `docs/architecture/email-notifications.md`

Route reset saat ini:

- `/forgot-password`
- `/callback?next=/reset-password`
- `/reset-password`

## Dokumen Penting

Mulai dari file ini jika ingin memahami repo lebih dalam:

- `AGENTS.md`
- `docs/architecture/overview.md`
- `docs/architecture/route-map.md`
- `docs/architecture/data-model.md`
- `docs/architecture/roles-permissions.md`
- `docs/architecture/order-flow.md`
- `docs/architecture/payment-flow.md`
- `docs/architecture/storage-policy.md`
- `docs/architecture/supabase-setup.md`
- `docs/architecture/testing-strategy.md`
- `docs/architecture/deployment.md`
- `docs/architecture/email-notifications.md`
- `docs/architecture/implementation-roadmap.md`
- `docs/product/feature-list.md`
- `docs/product/mvp-scope.md`
- `docs/uiux/design-system.md`
- `docs/uiux/fiverr-reference.md`

## Troubleshooting

### `npm install` gagal

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

Gunakan hanya jika memang perlu.

### Port 3000 dipakai

```bash
npm run dev -- -p 3001
```

### Build gagal saat fetch font Google

Project memakai `next/font` untuk Inter. Jika koneksi ke Google Fonts bermasalah saat build, ulangi build saat koneksi stabil atau siapkan strategi self-hosted font.

### Redirect auth atau reset password gagal

Periksa:

- `NEXT_PUBLIC_APP_URL`
- allowlist redirect di Supabase Auth
- session callback route `/callback`

### Dashboard atau catalog tidak menampilkan data

Periksa:

- migration sudah ter-apply
- RLS policy sesuai
- account status aktif
- seed creator atau data layanan memang tersedia

## Workflow Pengembangan

Contoh workflow harian:

```bash
git pull origin main
npm install
npm run dev
```

Sebelum commit:

```bash
npm run check
git status
git diff --stat
```

Contoh branch:

```txt
feature/creator-services
feature/payment-sandbox
fix/auth-redirect
docs/update-readme
```

## Catatan Penting

- Jangan hidupkan kembali dummy runtime
- Jangan membuka RLS longgar demi UI terlihat jalan
- Jangan pakai admin client untuk user biasa
- Jangan expose secret
- Jangan mengubah domain model menjadi toko barang fisik
- Untuk pekerjaan besar, baca `AGENTS.md` dan dokumen `docs/` dulu sebelum menulis kode
