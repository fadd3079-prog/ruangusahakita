saat pindah akun/chat, kirim begini:

Saya lanjut project Ruang Usaha Kita. Baca file RUANGUSAHA_HANDOFF_NEXT_ACCOUNT.md, AGENTS.md, dan folder docs. Jangan ulang dari awal. Status terakhir: prompt cart-checkout belum dieksekusi karena Codex limit. Tolong lanjut dari bagian "Prompt Lanjutan yang Belum Dieksekusi".



# Ruang Usaha Kita

Ruang Usaha Kita adalah website marketplace jasa digital yang menghubungkan UMKM dengan content creator atau marketer untuk kebutuhan promosi digital. Platform ini dibuat sebagai project e-commerce jasa digital, bukan toko online barang fisik.

Website ini menggunakan konsep katalog kreator, paket jasa digital, brief campaign, keranjang layanan, checkout, pembayaran dummy/sandbox, status pesanan, revisi, hasil konten, review, serta dashboard untuk UMKM, creator, dan admin.

## Tech Stack

Project ini menggunakan:

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Radix UI
- Lucide React
- Inter Font
- Dummy Data untuk tahap UI awal
- Supabase untuk database/auth/storage tahap lanjut
- Vercel untuk deployment
- Midtrans Sandbox untuk payment gateway tahap lanjut

## Prasyarat

Sebelum menjalankan project, pastikan laptop sudah memiliki:

1. Git
2. Node.js versi LTS atau versi terbaru yang stabil
3. npm
4. Visual Studio Code

Cek versi Git:

```bash
git --version
```

Cek versi Node.js:

```bash
node -v
```

Cek versi npm:

```bash
npm -v
```

Jika Node.js belum terpasang, install dari website resmi Node.js.

## Cara Menjalankan Project Setelah Git Clone

### 1. Clone Repository

```bash
git clone https://github.com/faddgraphics/ruangusahakita.git
```

Masuk ke folder project:

```bash
cd ruangusahakita
```

Jika nama folder berbeda, sesuaikan dengan nama folder hasil clone.

### 2. Install Dependency

Jalankan:

```bash
npm install
```

Tunggu sampai proses instalasi selesai. Folder `node_modules` akan otomatis dibuat setelah perintah ini berhasil.

### 3. Buat File Environment

Copy file `.env.example` menjadi `.env.local`.

Di Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Atau secara manual:

1. Duplikat file `.env.example`
2. Rename hasil duplikat menjadi `.env.local`

Untuk tahap UI awal, sebagian value environment boleh dikosongkan jika fitur Supabase atau Midtrans belum dipakai.

Contoh isi `.env.local` untuk development awal:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false
```

Catatan penting:

- Jangan commit file `.env.local`
- Jangan membagikan secret key ke publik
- Variable yang mengandung secret tidak boleh memakai prefix `NEXT_PUBLIC_`
- `NEXT_PUBLIC_` hanya untuk value yang memang boleh terbaca di browser

### 4. Jalankan Development Server

```bash
npm run dev
```

Jika berhasil, buka browser:

```txt
http://localhost:3000
```

Jika port 3000 sudah dipakai, Next.js biasanya akan menawarkan port lain, misalnya:

```txt
http://localhost:3001
```

## Script yang Tersedia

Project ini menggunakan beberapa script npm.

### Menjalankan Development Server

```bash
npm run dev
```

Digunakan saat coding dan melihat perubahan secara langsung di browser.

### Mengecek TypeScript

```bash
npm run typecheck
```

Digunakan untuk mengecek error TypeScript tanpa menjalankan build.

### Mengecek Lint

```bash
npm run lint
```

Digunakan untuk mengecek masalah penulisan kode berdasarkan ESLint.

### Build Production

```bash
npm run build
```

Digunakan untuk memastikan project bisa dibuild sebelum deploy.

### Menjalankan Semua Pengecekan

```bash
npm run check
```

Script ini menjalankan:

```bash
npm run typecheck && npm run lint && npm run build
```

Sebelum push atau membuat pull request, disarankan menjalankan:

```bash
npm run check
```

## Struktur Folder Penting

Struktur utama project:

```txt
src
├── app
│   ├── (public)
│   ├── (auth)
│   ├── (umkm)
│   ├── (creator)
│   ├── (admin)
│   └── api
├── components
│   ├── ui
│   ├── layout
│   ├── common
│   ├── cards
│   └── dashboard
├── features
├── lib
│   ├── dummy
│   ├── constants
│   ├── formatters
│   └── utils.ts
├── stores
└── types
```

Penjelasan singkat:

- `src/app` berisi routing Next.js App Router
- `src/components/ui` berisi komponen shadcn/ui
- `src/components/layout` berisi header, footer, dashboard shell, sidebar, dan layout component
- `src/components/common` berisi komponen kecil yang digunakan lintas halaman
- `src/components/cards` berisi komponen card seperti creator card, service card, dan order card
- `src/features` berisi komponen atau logic berdasarkan fitur
- `src/lib/dummy` berisi data dummy untuk tahap UI awal
- `src/lib/constants` berisi data konstan seperti navigasi, status, dan fee
- `src/lib/formatters` berisi helper format currency dan tanggal
- `docs` berisi dokumentasi arsitektur, produk, prompt, dan UI/UX
- `public/logo` berisi logo project

## Route Utama

Beberapa route utama yang dapat dicek:

```txt
/
 /katalog
 /cara-kerja
 /bantuan
 /login
 /register
 /forgot-password
 /umkm/dashboard
 /umkm/cart
 /umkm/checkout
 /creator/dashboard
 /admin/dashboard
```

Catatan:

Beberapa route mungkin masih berupa placeholder sesuai tahap pengerjaan.

## Konsep Project

Project ini adalah marketplace jasa digital.

Gunakan istilah:

- UMKM
- kreator
- paket jasa
- layanan digital
- brief campaign
- hasil konten
- revisi
- status pesanan
- pembayaran
- invoice
- portofolio
- review

Jangan gunakan istilah toko barang fisik seperti:

- stok
- gudang
- ongkir
- kurir
- resi
- packing
- shipping
- alamat pengiriman barang

## Aturan Coding

Aturan utama:

1. Gunakan TypeScript dengan type yang jelas
2. Hindari penggunaan `any`
3. Gunakan import alias `@/*`
4. Gunakan Server Components secara default
5. Gunakan Client Components hanya jika butuh interaksi
6. Jangan mengubah file `src/components/ui/*` kecuali benar-benar perlu
7. Jangan membuat folder `src/lib/utils` karena sudah ada file `src/lib/utils.ts`
8. Jangan commit `.env.local`
9. Jangan hardcode API key atau secret
10. Jalankan `npm run check` sebelum push

Contoh import yang benar:

```ts
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/layout/page-container"
import { dummyCreators } from "@/lib/dummy"
```

Hindari import relatif terlalu panjang:

```ts
import { Button } from "../../../../components/ui/button"
```

## Workflow Tim

### Sebelum Mulai Coding

Ambil update terbaru:

```bash
git pull origin main
```

Install dependency jika ada perubahan package:

```bash
npm install
```

Jalankan project:

```bash
npm run dev
```

### Membuat Branch Baru

Disarankan tidak langsung coding di `main`.

Contoh membuat branch fitur:

```bash
git switch -c feature/cart-checkout
```

Contoh nama branch:

```txt
feature/homepage
feature/catalog-page
feature/cart-checkout
feature/payment-dummy
fix/navbar-mobile
docs/update-readme
```

### Setelah Selesai Coding

Cek project:

```bash
npm run check
```

Cek perubahan:

```bash
git status
git diff --stat
```

Commit:

```bash
git add .
git commit -m "feat: build cart and checkout pages"
```

Push branch:

```bash
git push origin feature/cart-checkout
```

## Commit Message

Gunakan format sederhana:

```txt
type: message
```

Contoh:

```bash
git commit -m "feat: build public homepage"
git commit -m "fix: correct catalog card spacing"
git commit -m "docs: update readme"
git commit -m "style: adjust global design tokens"
git commit -m "chore: add dummy data"
```

Jenis commit:

- `feat` untuk fitur baru
- `fix` untuk perbaikan bug
- `docs` untuk dokumentasi
- `style` untuk perubahan tampilan/styling
- `refactor` untuk perapian struktur kode
- `chore` untuk maintenance
- `test` untuk testing

## Environment dan Secret

File yang boleh dishare:

```txt
.env.example
```

File yang tidak boleh dishare/commit:

```txt
.env.local
.env
```

Jika membutuhkan Supabase atau Midtrans, minta value environment ke anggota yang bertanggung jawab. Jangan menaruh secret key langsung di kode.

## Supabase

Supabase disiapkan untuk tahap lanjut sebagai:

- database
- authentication
- storage
- row level security

Untuk tahap UI awal, project dapat berjalan menggunakan dummy data tanpa Supabase.

Jika Supabase sudah mulai dipakai, pastikan file `.env.local` berisi:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Catatan:

- `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` boleh digunakan di client
- `SUPABASE_SERVICE_ROLE_KEY` hanya boleh digunakan di server
- Jangan pernah expose service role key ke browser

## Payment Gateway

Payment gateway belum digunakan untuk transaksi real pada tahap awal.

Tahapan payment:

1. Dummy payment
2. Server dummy payment
3. Midtrans Sandbox
4. Midtrans production jika project benar-benar digunakan untuk transaksi nyata

Untuk tahap UI atau demo, gunakan dummy payment atau sandbox. Jangan menggunakan payment production sebelum seluruh flow aman.

## Deployment

Project direncanakan deploy ke Vercel.

Sebelum deploy, pastikan:

```bash
npm run check
```

Jika deploy manual via Vercel:

1. Push project ke GitHub
2. Import repository ke Vercel
3. Pilih framework Next.js
4. Masukkan environment variable jika diperlukan
5. Deploy

Untuk tahap awal, preview deployment Vercel sudah cukup untuk demo.

## Troubleshooting

### 1. `npm install` gagal

Coba hapus `node_modules` dan `package-lock.json`, lalu install ulang:

```bash
rm -rf node_modules package-lock.json
npm install
```

Di Windows PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

Gunakan ini hanya jika benar-benar perlu.

### 2. Port 3000 sudah dipakai

Jalankan di port lain:

```bash
npm run dev -- -p 3001
```

Buka:

```txt
http://localhost:3001
```

### 3. Build gagal karena environment

Pastikan `.env.local` sudah dibuat dari `.env.example`.

```powershell
Copy-Item .env.example .env.local
```

### 4. Error import `@/*`

Pastikan `tsconfig.json` memiliki path alias yang benar.

### 5. Halaman 404

Cek apakah file `page.tsx` sudah ada di route yang sesuai.

Contoh:

```txt
src/app/(public)/katalog/page.tsx
```

### 6. Perubahan tidak muncul

Restart development server:

```bash
Ctrl + C
npm run dev
```

## Checklist Sebelum Push

Sebelum push, cek:

```bash
npm run check
git status
git diff --stat
```

Pastikan:

- tidak ada `.env.local`
- tidak ada `node_modules`
- tidak ada `.next`
- tidak ada secret key
- tidak ada istilah toko barang fisik
- build berhasil

## Catatan untuk Tim

Baca file berikut sebelum mengerjakan fitur besar:

```txt
AGENTS.md
docs/architecture/coding-standards.md
docs/architecture/implementation-roadmap.md
docs/product/feature-list.md
docs/product/dummy-data.md
docs/prompts/codex-guidelines.md
docs/RUANGUSAHA_HANDOFF_NEXT_ACCOUNT.md
```

Jika menggunakan AI/Codex, jangan minta semua fitur dibuat sekaligus. Kerjakan bertahap per fitur kecil agar kode tetap aman dan mudah dicek.

## Status Project

Project masih dalam tahap pengembangan. Sebagian fitur menggunakan dummy data dan placeholder. Integrasi real seperti Supabase, auth, storage, Midtrans Sandbox, dan deployment production dilakukan bertahap setelah UI flow utama stabil.
