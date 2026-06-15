# Ruang Usaha Kita — Deployment Guide

## 1. Tujuan Dokumen

Dokumen ini menjelaskan strategi deployment untuk website Ruang Usaha Kita. Deployment guide digunakan agar proses pengembangan, testing, preview, dan production berjalan rapi, aman, dan tidak mencampur environment.

Ruang Usaha Kita adalah marketplace jasa digital yang menghubungkan UMKM dengan content creator atau marketer untuk kebutuhan promosi digital. Karena platform ini akan menangani akun pengguna, order, payment, brief campaign, hasil konten, revisi, dan dashboard admin, deployment tidak boleh dilakukan sembarangan.

Tujuan deployment guide:

1. Menjelaskan struktur environment.
2. Menjelaskan alur deploy ke Vercel.
3. Menjelaskan hubungan Vercel, Supabase, dan Midtrans.
4. Menjaga environment variable tetap aman.
5. Mencegah secret key bocor ke client.
6. Menyiapkan alur preview sebelum production.
7. Menyiapkan deployment untuk MVP, sandbox, dan production.
8. Menjadi pedoman sebelum domain resmi dipasang.
9. Menjadi checklist sebelum website dipresentasikan atau digunakan.

## 2. Deployment Stack

Stack deployment Ruang Usaha Kita:

| Area | Teknologi |
|---|---|
| Framework | Next.js App Router |
| UI | React, TypeScript, Tailwind CSS, shadcn/ui |
| Hosting | Vercel |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Payment | Dummy Payment → Midtrans Sandbox → Midtrans Production |
| Domain | Dibeli belakangan |
| Version Control | Git dan GitHub |
| Environment | Local, Preview, Production |

## 3. Prinsip Deployment

### 3.1 Jangan Langsung Production

Project harus berjalan bertahap:

1. Local development.
2. Preview deployment.
3. Demo/staging.
4. Production.

Untuk tugas kuliah atau prototype, tahap production tidak wajib langsung dipakai. Preview Vercel sudah cukup untuk demo awal.

### 3.2 Environment Harus Dipisah

Environment development, preview, dan production tidak boleh mencampur database, payment key, dan secret.

Contoh:

- local memakai `.env.local`
- preview memakai Vercel Preview Environment Variables
- production memakai Vercel Production Environment Variables

Jangan memakai production database atau production payment gateway saat masih eksperimen.

### 3.3 Secret Key Tidak Boleh Masuk Client

Secret key tidak boleh memakai prefix `NEXT_PUBLIC_`.

Yang tidak boleh public:

- `SUPABASE_SERVICE_ROLE_KEY`
- `MIDTRANS_SERVER_KEY`
- webhook secret
- admin secret
- internal API key
- database password

Yang boleh public:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` jika diperlukan oleh Snap client

### 3.4 Build Harus Lolos Sebelum Deploy

Sebelum deploy, minimal jalankan:

```bash
npm run typecheck
npm run lint
npm run build
````

Jika belum ada script lengkap, minimal:

```bash
npm run build
```

### 3.5 Payment Production Belakangan

Payment flow harus dibuat dari sekarang, tetapi production payment tidak perlu langsung aktif.

Urutan:

1. Dummy payment.
2. Server dummy payment.
3. Midtrans Sandbox.
4. Webhook sandbox.
5. Production payment.

## 4. Environment Strategy

Vercel mendukung tiga environment utama:

1. Local
2. Preview
3. Production

### 4.1 Local Environment

Local digunakan saat coding di laptop.

Ciri:

* berjalan di `localhost:3000`
* memakai `.env.local`
* tidak perlu domain
* payment masih dummy atau sandbox
* Supabase bisa pakai project development
* cocok untuk debugging

Contoh URL:

```txt
http://localhost:3000
```

### 4.2 Preview Environment

Preview digunakan untuk mencoba hasil deploy dari branch selain production.

Ciri:

* otomatis dibuat Vercel dari Git branch atau pull request
* URL biasanya dari Vercel
* cocok untuk demo ke teman/dosen
* cocok untuk testing sebelum merge ke main
* memakai environment variable Preview
* bisa memakai Supabase development/staging
* payment tetap sandbox/dummy

Contoh URL:

```txt
https://ruangusaha-git-feature-layout-team.vercel.app
```

### 4.3 Production Environment

Production digunakan untuk website resmi.

Ciri:

* memakai branch production utama
* memakai domain resmi
* memakai environment variable production
* Supabase production harus lebih dijaga
* payment production hanya jika bisnis benar-benar berjalan
* monitoring harus aktif

Contoh URL:

```txt
https://ruangusahakita.id
```

## 5. Branch Strategy

Branch strategy yang disarankan:

```txt
main
dev
feature/*
fix/*
docs/*
```

### 5.1 `main`

Branch utama yang paling stabil.

Aturan:

* hanya menerima fitur yang sudah dicek
* siap deploy production
* tidak boleh eksperimen langsung
* build harus lolos

### 5.2 `dev`

Branch pengembangan utama.

Aturan:

* gabungan fitur yang masih diuji
* cocok untuk preview/staging
* tidak harus production-ready, tetapi tidak boleh rusak total

### 5.3 `feature/*`

Branch untuk fitur baru.

Contoh:

```txt
feature/public-layout
feature/catalog-page
feature/cart-checkout
feature/payment-dummy
feature/admin-dashboard
```

### 5.4 `fix/*`

Branch untuk perbaikan bug.

Contoh:

```txt
fix/navbar-mobile
fix/payment-status-label
fix/order-timeline
```

### 5.5 `docs/*`

Branch untuk dokumentasi.

Contoh:

```txt
docs/architecture-foundation
docs/payment-flow
```

## 6. Git Workflow

Workflow dasar:

```bash
git status
git add .
git commit -m "docs: add deployment guide"
git push origin dev
```

Untuk fitur:

```bash
git checkout -b feature/public-layout
git add .
git commit -m "feat: add public layout foundation"
git push origin feature/public-layout
```

Untuk merge:

```bash
git checkout dev
git merge feature/public-layout
git push origin dev
```

Untuk production:

```bash
git checkout main
git merge dev
git push origin main
```

Catatan:

Jangan merge ke `main` jika build masih error.

## 7. File yang Tidak Boleh Masuk Git

Pastikan `.gitignore` mencakup:

```gitignore
node_modules
.next
.vercel
.env
.env.local
.env.*.local
.DS_Store
tree.txt
*.log
```

File yang tidak boleh di-push:

* `.env.local`
* `.env`
* `.next`
* `node_modules`
* key payment
* service role key
* file dump database
* file credential
* screenshot yang mengandung token

## 8. Environment Variables

### 8.1 `.env.example`

File `.env.example` boleh masuk Git karena hanya berisi nama variable, bukan value rahasia.

Isi yang disarankan:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_ENV=development

# Supabase public
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Supabase server only
SUPABASE_SERVICE_ROLE_KEY=

# Midtrans public/sandbox
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=

# Midtrans server only
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false

# Optional
POSTHOG_KEY=
SENTRY_DSN=
```

### 8.2 `.env.local`

File `.env.local` digunakan hanya di laptop.

Contoh:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_ENV=development

NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx

SUPABASE_SERVICE_ROLE_KEY=xxxxx

NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxx
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxx
MIDTRANS_IS_PRODUCTION=false
```

### 8.3 Vercel Environment Variables

Di Vercel, environment variable harus dimasukkan lewat dashboard Vercel atau Vercel CLI.

Pisahkan:

* Development
* Preview
* Production

Jangan mengandalkan `.env.local` di Vercel.

### 8.4 Public vs Secret Variables

Public variable:

```txt
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
```

Secret variable:

```txt
SUPABASE_SERVICE_ROLE_KEY
MIDTRANS_SERVER_KEY
SENTRY_AUTH_TOKEN
WEBHOOK_SECRET
```

Aturan:

* public variable bisa muncul di browser
* secret variable hanya server
* jangan beri prefix `NEXT_PUBLIC_` untuk secret

## 9. Supabase Deployment Strategy

### 9.1 Supabase Project Strategy

Untuk tahap awal, bisa memakai satu Supabase project development.

Namun, idealnya:

| Environment | Supabase                        |
| ----------- | ------------------------------- |
| Local       | Supabase local atau project dev |
| Preview     | Supabase staging/dev            |
| Production  | Supabase production             |

Untuk tugas kuliah/prototype, satu Supabase project development masih cukup, asalkan tidak menyimpan data sensitif nyata.

### 9.2 Supabase Local Development

Supabase CLI dapat digunakan untuk:

* local development
* migrations
* generate types
* mengelola secrets
* test database sebelum production

Struktur folder:

```txt
supabase/
  migrations/
  seed/
  policies/
```

### 9.3 Supabase Migration

Migration harus dibuat bertahap:

```txt
0001_init_enums.sql
0002_init_profiles.sql
0003_init_services.sql
0004_init_cart_checkout.sql
0005_init_orders.sql
0006_init_payments.sql
0007_init_post_order.sql
0008_init_admin_support.sql
0009_init_indexes.sql
0010_init_rls_policies.sql
```

Jangan membuat semua tabel sekaligus tanpa dicek.

### 9.4 Supabase Types

Setelah database dibuat, generate types:

```bash
supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
```

Tujuan:

* query lebih aman
* type data dari database bisa dipakai di TypeScript
* mengurangi typo field

### 9.5 Supabase RLS

Sebelum data real dipakai, RLS harus aktif untuk tabel sensitif:

* profiles
* umkm_profiles
* creator_profiles
* carts
* campaign_briefs
* orders
* payments
* submissions
* revisions
* reviews
* complaints
* notifications

Untuk MVP dummy, RLS boleh disiapkan di dokumen dulu. Untuk database real, RLS wajib.

## 10. Vercel Deployment Strategy

### 10.1 Deploy Awal

Alur:

1. Push project ke GitHub.
2. Buka Vercel.
3. Import repository.
4. Pilih framework Next.js.
5. Isi environment variables.
6. Deploy.
7. Cek URL preview.
8. Jalankan manual QA.

### 10.2 Build Command

Default:

```bash
npm run build
```

### 10.3 Install Command

Default:

```bash
npm install
```

### 10.4 Output Directory

Untuk Next.js di Vercel, biasanya otomatis.

Tidak perlu set manual kecuali ada kebutuhan khusus.

### 10.5 Production Branch

Disarankan:

```txt
main
```

Artinya:

* push ke `main` akan deploy production
* branch lain menjadi preview

### 10.6 Preview Deployments

Preview digunakan untuk:

* fitur baru
* demo sementara
* testing UI
* validasi route
* testing payment sandbox
* review sebelum merge

Jangan memakai production payment di preview.

## 11. Domain Strategy

Domain akan dibeli belakangan.

### 11.1 Sebelum Domain

Gunakan URL Vercel:

```txt
https://ruangusaha.vercel.app
```

atau URL preview dari branch.

### 11.2 Setelah Domain Dibeli

Langkah umum:

1. Beli domain.
2. Tambahkan domain di dashboard Vercel.
3. Atur DNS sesuai instruksi Vercel.
4. Tunggu propagasi DNS.
5. Pastikan SSL aktif.
6. Update `NEXT_PUBLIC_APP_URL`.
7. Update callback URL Supabase.
8. Update webhook URL Midtrans.
9. Update OAuth redirect jika ada.

### 11.3 Domain untuk Production

Contoh:

```txt
https://ruangusahakita.id
```

### 11.4 Subdomain Opsional

Opsional:

```txt
app.ruangusahakita.id
admin.ruangusahakita.id
docs.ruangusahakita.id
```

Untuk MVP, cukup satu domain.

## 12. App URL Strategy

`NEXT_PUBLIC_APP_URL` harus mengikuti environment.

### 12.1 Local

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 12.2 Preview

```env
NEXT_PUBLIC_APP_URL=https://preview-url.vercel.app
```

### 12.3 Production

```env
NEXT_PUBLIC_APP_URL=https://ruangusahakita.id
```

App URL dipakai untuk:

* auth callback
* payment redirect
* email link
* webhook reference
* sharing link
* canonical URL

## 13. Auth Deployment Notes

Jika Supabase Auth sudah dipakai, URL berikut harus diatur.

### 13.1 Local Redirect

```txt
http://localhost:3000/callback
http://localhost:3000/auth/callback
```

Sesuaikan dengan route final.

### 13.2 Preview Redirect

```txt
https://preview-url.vercel.app/callback
```

### 13.3 Production Redirect

```txt
https://ruangusahakita.id/callback
```

Catatan:

Route callback dalam project saat ini berada pada area auth. Pastikan final URL benar sesuai struktur Next.js.

## 14. Payment Deployment Notes

Payment dibuat bertahap.

### 14.1 Dummy Payment

Environment:

* local
* preview
* production demo boleh

Kondisi:

* tidak ada uang nyata
* aman untuk tugas kuliah
* cocok untuk prototype

### 14.2 Midtrans Sandbox

Environment:

* local
* preview
* staging

Kondisi:

* tidak ada uang nyata
* bisa menguji Snap
* bisa menguji webhook
* cocok sebelum production

### 14.3 Midtrans Production

Environment:

* production only

Syarat:

* domain production aktif
* merchant account siap
* webhook production URL siap
* refund policy jelas
* admin monitoring siap
* transaksi nyata memang dibutuhkan

### 14.4 Payment Webhook URL

Local webhook sulit diuji tanpa tunnel.

Untuk local testing bisa memakai:

* ngrok
* Cloudflare Tunnel
* Vercel preview URL

Webhook URL production contoh:

```txt
https://ruangusahakita.id/api/payments/webhook
```

Webhook URL preview contoh:

```txt
https://preview-url.vercel.app/api/payments/webhook
```

## 15. Deployment Phases

### 15.1 Phase 1 — Local Skeleton

Target:

* Next.js jalan
* shadcn jalan
* route utama ada
* layout belum kompleks
* data dummy

Checklist:

* `npm run dev` berhasil
* homepage tidak 404
* `/katalog` tidak 404
* `/login` tidak 404
* dashboard role tidak 404

### 15.2 Phase 2 — Local UI Foundation

Target:

* design token
* header
* footer
* dashboard shell
* sidebar
* topbar
* reusable components

Checklist:

* UI konsisten
* responsive dasar
* tidak ada istilah barang fisik
* build lolos

### 15.3 Phase 3 — Preview Deployment

Target:

* project masuk GitHub
* Vercel preview aktif
* URL bisa dibuka publik
* dosen/tim bisa review

Checklist:

* environment preview masuk
* build Vercel berhasil
* route utama aman
* UI tidak rusak di production build

### 15.4 Phase 4 — Supabase Integration

Target:

* database dibuat
* auth dasar
* data dummy dari database
* RLS awal

Checklist:

* Supabase env benar
* anon key hanya public
* service role key hanya server
* query jalan
* role profile tersimpan

### 15.5 Phase 5 — Payment Dummy

Target:

* checkout menghasilkan payment dummy
* payment status tampil
* order status berubah
* admin melihat payment

Checklist:

* payment status tidak diubah client sembarangan
* total dihitung server
* invoice placeholder tampil

### 15.6 Phase 6 — Midtrans Sandbox

Target:

* Snap sandbox aktif
* payment create route jalan
* webhook route jalan
* status payment update

Checklist:

* server key aman
* signature webhook divalidasi
* amount dicek
* duplicate webhook aman

### 15.7 Phase 7 — Production Readiness

Target:

* domain aktif
* env production siap
* build stabil
* payment production jika perlu
* admin monitoring siap

Checklist:

* final QA
* security check
* route protection
* RLS
* storage policy
* payment policy
* backup plan

## 16. Build Checklist

Sebelum deploy, cek:

```bash
npm run typecheck
npm run lint
npm run build
```

Jika belum ada script:

```bash
npm run build
```

Cek manual:

```txt
/
 /katalog
 /login
 /register
 /umkm/dashboard
 /creator/dashboard
 /admin/dashboard
 /api/health
```

Pastikan:

* tidak 404
* tidak error console fatal
* tidak ada import rusak
* tidak ada typo route besar
* UI tetap rapi setelah production build

## 17. Environment Checklist

### 17.1 Local

Cek:

* `.env.local` ada
* `.env.local` tidak masuk Git
* `NEXT_PUBLIC_APP_URL=http://localhost:3000`
* Supabase env development
* Midtrans sandbox/dummy

### 17.2 Preview

Cek:

* Vercel Preview env diisi
* App URL sesuai preview
* payment tetap sandbox/dummy
* database bukan production sensitif
* build berhasil

### 17.3 Production

Cek:

* Vercel Production env diisi
* domain benar
* Supabase production jika ada
* Midtrans production hanya jika benar-benar siap
* callback URL benar
* webhook URL benar
* admin monitoring siap

## 18. Security Checklist

Wajib dicek:

1. `.env.local` tidak masuk Git.
2. `.next` tidak masuk Git.
3. `node_modules` tidak masuk Git.
4. `SUPABASE_SERVICE_ROLE_KEY` tidak memakai `NEXT_PUBLIC_`.
5. `MIDTRANS_SERVER_KEY` tidak memakai `NEXT_PUBLIC_`.
6. Tidak ada secret hardcoded di source code.
7. Payment status tidak bisa diubah dari client.
8. File private tidak public.
9. Admin route tidak terbuka untuk guest.
10. RLS aktif sebelum data real.
11. Webhook memvalidasi signature.
12. Total payment dihitung server.
13. Activity log untuk admin action penting.
14. Preview tidak memakai production payment sembarangan.

## 19. Vercel Project Settings

Setting yang perlu dicek:

### 19.1 Framework Preset

```txt
Next.js
```

### 19.2 Build Command

```txt
npm run build
```

### 19.3 Install Command

```txt
npm install
```

### 19.4 Root Directory

Jika project berada di root repo:

```txt
.
```

Jika nanti berada di subfolder, sesuaikan.

### 19.5 Node Version

Gunakan versi Node stabil yang kompatibel dengan Next.js project.

Jika tidak ada kebutuhan khusus, gunakan default Vercel.

## 20. Supabase Project Settings

Hal yang perlu dicek:

1. Project URL.
2. Anon key.
3. Service role key.
4. Auth redirect URL.
5. Storage buckets.
6. Database migrations.
7. RLS policies.
8. Edge Functions jika dipakai.
9. API rate/security.
10. Backup jika sudah production.

Untuk MVP, jangan terlalu cepat memakai data real sensitif.

## 21. Midtrans Project Settings

Untuk sandbox:

1. Ambil server key sandbox.
2. Ambil client key sandbox.
3. Set environment variable.
4. Set payment notification URL.
5. Set finish URL jika diperlukan.
6. Test transaksi dummy.
7. Test webhook.

Untuk production:

1. Merchant production aktif.
2. Domain production aktif.
3. Server key production masuk Vercel Production env.
4. Client key production masuk Vercel Production env.
5. Notification URL production benar.
6. Refund policy jelas.
7. Admin payment monitoring siap.

## 22. Monitoring Strategy

Monitoring tahap awal:

* Vercel build logs
* Vercel runtime logs
* browser console
* Supabase logs
* payment webhook logs
* manual QA

Monitoring tahap lanjut:

* Sentry untuk error monitoring
* PostHog untuk analytics
* Supabase database logs
* payment gateway dashboard
* uptime monitoring

Untuk MVP, Sentry dan PostHog tidak wajib langsung aktif.

## 23. Logging Strategy

Event yang perlu dicatat:

* user_registered
* user_login
* order_created
* payment_created
* payment_paid
* payment_failed
* webhook_received
* webhook_invalid
* order_status_changed
* submission_created
* revision_requested
* review_created
* complaint_opened
* admin_action

Pada MVP awal, logging bisa dummy atau console server. Pada tahap backend real, logging masuk `activity_logs`.

## 24. Rollback Strategy

Rollback perlu disiapkan jika deploy merusak website.

### 24.1 Vercel Rollback

Jika deploy terbaru rusak:

1. Buka Vercel dashboard.
2. Pilih deployment sebelumnya.
3. Promote/redeploy deployment yang stabil.
4. Catat bug di issue/task.

### 24.2 Git Rollback

Jika commit bermasalah:

```bash
git revert <commit-hash>
```

atau buat fix commit.

Jangan asal `reset --hard` jika sudah push bersama tim tanpa koordinasi.

### 24.3 Database Rollback

Database rollback lebih sensitif.

Aturan:

* migration harus bertahap
* jangan ubah tabel production sembarangan
* backup sebelum migration besar
* migration destructive harus dihindari
* gunakan soft delete untuk data transaksi

## 25. Deployment Risks

### 25.1 Environment Salah

Risiko:

Preview memakai production key.

Dampak:

Transaksi/payment/data bisa kacau.

Mitigasi:

Pisahkan env preview dan production.

### 25.2 Secret Bocor

Risiko:

Secret key masuk Git atau browser.

Dampak:

Data/payment bisa disalahgunakan.

Mitigasi:

Gunakan `.gitignore`, cek prefix `NEXT_PUBLIC_`, dan audit source code.

### 25.3 Build Lokal Jalan, Vercel Gagal

Risiko:

Perbedaan environment.

Mitigasi:

Selalu jalankan `npm run build` lokal sebelum push dan cek Vercel logs.

### 25.4 Route 404 Setelah Deploy

Risiko:

Route group salah, file `page.tsx` tidak ada, atau konflik path.

Mitigasi:

Cek route map dan manual QA.

### 25.5 Payment Webhook Tidak Masuk

Risiko:

URL webhook salah atau environment salah.

Mitigasi:

Cek Midtrans dashboard, Vercel logs, dan endpoint `/api/payments/webhook`.

### 25.6 Supabase RLS Terlalu Ketat

Risiko:

User tidak bisa membaca data yang seharusnya boleh.

Mitigasi:

Test RLS per role dan gunakan policy bertahap.

### 25.7 Supabase RLS Terlalu Longgar

Risiko:

User bisa membaca data orang lain.

Mitigasi:

Test skenario negatif: UMKM A tidak boleh lihat order UMKM B.

## 26. Pre-Deploy Manual QA

Sebelum deploy:

### 26.1 Public

* Homepage terbuka.
* Katalog terbuka.
* Detail kreator terbuka.
* Detail layanan terbuka.
* Cara kerja terbuka.
* Bantuan terbuka.

### 26.2 Auth

* Login terbuka.
* Register terbuka.
* Forgot password terbuka.
* Belum ada redirect aneh.

### 26.3 UMKM

* Dashboard UMKM terbuka.
* Cart terbuka.
* Checkout terbuka.
* Payment terbuka.
* Orders terbuka.

### 26.4 Creator

* Dashboard creator terbuka.
* Profile terbuka.
* Services terbuka.
* Orders terbuka.
* Portfolio terbuka.

### 26.5 Admin

* Dashboard admin terbuka.
* Users terbuka.
* UMKM terbuka.
* Creators terbuka.
* Services terbuka.
* Orders terbuka.
* Payments terbuka.
* Complaints terbuka.
* Reports terbuka.

### 26.6 API

* `/api/health` return ok.
* API sensitif tidak asal mengubah data.

## 27. Deployment Checklist MVP

MVP siap deploy preview jika:

1. `npm run build` berhasil.
2. Route utama tidak 404.
3. Layout public ada.
4. Dashboard role ada.
5. Data dummy tampil.
6. UI sesuai desain.
7. Tidak ada istilah barang fisik.
8. `.env.local` tidak masuk Git.
9. Secret key tidak hardcoded.
10. Payment masih dummy/sandbox.
11. Supabase env aman.
12. README minimal ada.
13. Dokumentasi architecture ada.
14. Tim bisa menjalankan project dari nol.

## 28. Deployment Checklist Production

Production siap jika:

1. Semua checklist MVP lolos.
2. Domain aktif.
3. Environment production benar.
4. Supabase production siap.
5. RLS aktif.
6. Storage policy aktif.
7. Auth redirect benar.
8. Payment production siap jika digunakan.
9. Webhook production benar.
10. Admin monitoring siap.
11. Refund policy jelas.
12. Terms dan privacy minimal ada.
13. Error monitoring aktif atau minimal logs dipantau.
14. Backup/rollback dipahami.
15. Security review selesai.

## 29. README Deployment Section

README perlu memiliki bagian deployment singkat.

Contoh:

```md
## Deployment

Project ini menggunakan Vercel untuk hosting.

### Local Development

npm install
npm run dev

### Build

npm run build

### Environment Variables

Copy `.env.example` menjadi `.env.local`, lalu isi value sesuai environment.

### Deployment

Push ke GitHub, lalu import repository ke Vercel.
```

## 30. Command Reference

### 30.1 Local Dev

```bash
npm install
npm run dev
```

### 30.2 Build

```bash
npm run build
```

### 30.3 Git

```bash
git status
git add .
git commit -m "docs: add deployment guide"
git push
```

### 30.4 Vercel CLI Opsional

```bash
npm i -g vercel
vercel login
vercel
vercel --prod
```

Catatan:

Vercel CLI tidak wajib. Deploy bisa dilakukan dari dashboard GitHub integration.

### 30.5 Supabase CLI Opsional

```bash
npm install -g supabase
supabase login
supabase init
supabase start
```

Catatan:

Supabase CLI berguna untuk local development dan migration, tetapi tidak harus dipakai di hari pertama jika fokus masih UI dummy.

## 31. Environment Naming Rules

Gunakan nama env yang jelas.

Baik:

```txt
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
MIDTRANS_SERVER_KEY
MIDTRANS_IS_PRODUCTION
```

Buruk:

```txt
KEY
SECRET
TOKEN
DATABASE
URL
API
```

Nama yang terlalu umum rawan membingungkan.

## 32. Production Readiness Level

Level kesiapan deployment:

### Level 1 — Local Only

* hanya jalan di laptop
* data dummy
* belum deploy

### Level 2 — Preview Demo

* Vercel preview aktif
* UI bisa dilihat tim/dosen
* payment dummy
* database belum wajib

### Level 3 — MVP Staging

* Supabase terhubung
* auth dasar
* data dummy dari database
* payment sandbox

### Level 4 — Production Candidate

* domain aktif
* RLS aktif
* payment sandbox stabil
* admin monitoring
* security review

### Level 5 — Production Live

* production payment aktif
* data real
* monitoring
* backup
* legal policy
* support flow

Target tugas kuliah/prototype cukup sampai Level 2 atau Level 3. Jangan memaksakan Level 5 jika belum benar-benar dibutuhkan.

## 33. Deployment Roadmap

### 33.1 Tahap 1

* local project stabil
* dokumentasi lengkap
* route utama aman
* UI skeleton selesai

### 33.2 Tahap 2

* deploy preview ke Vercel
* share link ke tim
* manual QA
* perbaiki bug visual

### 33.3 Tahap 3

* Supabase project dibuat
* auth dummy naik ke auth real
* database schema dibuat bertahap
* seed data creator dan layanan

### 33.4 Tahap 4

* checkout dan order tersimpan database
* payment dummy server-side
* order timeline real

### 33.5 Tahap 5

* Midtrans Sandbox
* webhook testing
* admin payments
* invoice placeholder

### 33.6 Tahap 6

* domain
* production environment
* security review
* production deployment jika diperlukan

## 34. Definition of Done

Deployment dianggap siap jika:

1. Project bisa dijalankan lokal.
2. Project bisa build.
3. Project bisa deploy ke Vercel.
4. Environment variable terpisah.
5. `.env.local` tidak masuk Git.
6. Route utama tidak 404.
7. Preview URL bisa dibuka.
8. Tidak ada secret key di client.
9. Payment dummy/sandbox sesuai environment.
10. Supabase env benar.
11. Auth callback benar jika auth sudah aktif.
12. Webhook URL benar jika payment sandbox sudah aktif.
13. Dashboard role tampil.
14. UI tidak rusak setelah production build.
15. Rollback dipahami.
16. Deployment checklist dipenuhi.

## 35. Kesimpulan

Deployment Ruang Usaha Kita harus dilakukan bertahap. Tahap awal cukup membuat project stabil di local dan preview Vercel. Setelah itu, Supabase, auth, database, storage, dan payment sandbox bisa ditambahkan secara bertahap.

Hal paling penting adalah menjaga pemisahan environment. Local, preview, dan production tidak boleh dicampur. Secret key tidak boleh masuk client. Payment production tidak perlu buru-buru dipakai sebelum flow dummy dan sandbox benar-benar stabil.

Dengan deployment guide ini, Ruang Usaha Kita bisa dikembangkan lebih aman, rapi, dan siap naik dari prototype akademik menjadi platform marketplace jasa digital yang lebih serius.
