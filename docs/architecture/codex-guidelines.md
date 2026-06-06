# Ruang Usaha Kita — Codex Guidelines

## 1. Tujuan Dokumen

Dokumen ini berisi aturan penggunaan Codex atau AI coding untuk membangun website Ruang Usaha Kita. Tujuannya agar proses vibe coding tetap terarah, tidak liar, tidak mengubah file sembarangan, dan tidak keluar dari konsep marketplace jasa digital.

Ruang Usaha Kita adalah marketplace jasa digital yang menghubungkan UMKM dengan content creator atau marketer untuk kebutuhan promosi digital. Project ini bukan toko online barang fisik. Karena itu, setiap prompt dan hasil coding harus menghindari konsep stok, gudang, ongkir, kurir, resi, packing, shipping, dan alamat pengiriman.

Dokumen ini wajib dibaca sebelum memberikan prompt coding.

## 2. Prinsip Utama Menggunakan Codex

### 2.1 Jangan Meminta Semua Sekaligus

Hindari prompt seperti:

```txt
Buat semua website sampai selesai.
```

Prompt seperti itu berisiko:

- file berubah terlalu banyak
- struktur kacau
- komponen terlalu besar
- bug sulit dilacak
- konsep bisnis melenceng
- AI membuat fitur yang belum diminta

Gunakan prompt bertahap.

### 2.2 Satu Prompt Satu Scope

Satu prompt idealnya hanya mengerjakan satu hal:

- layout public
- header/footer
- homepage
- katalog
- creator card
- cart
- checkout
- payment dummy
- order timeline
- dashboard shell
- admin table

### 2.3 Selalu Jelaskan Konteks Bisnis

Setiap prompt harus menyebut:

- nama project
- Ruang Usaha Kita
- marketplace jasa digital
- UMKM
- content creator/marketer
- bukan toko barang fisik
- tidak boleh memakai istilah pengiriman barang

### 2.4 Selalu Sebut Stack

Setiap prompt penting harus menyebut stack:

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Radix UI
- Lucide React
- Supabase nanti, tetapi belum selalu dipakai
- Vercel deployment

### 2.5 Batasi File yang Boleh Diubah

Prompt harus menyebut:

- file yang boleh dibuat
- file yang boleh diedit
- file yang tidak boleh disentuh

Contoh:

```txt
Only create or update files under src/components/layout and src/app/(public)/layout.tsx.
Do not modify payment, Supabase, API routes, or shadcn/ui files.
```

### 2.6 Minta Acceptance Criteria

Setiap prompt harus memberi standar selesai.

Contoh:

```txt
Acceptance criteria:
- npm run build must pass.
- No physical product terms.
- Public pages must not show shipping, stock, warehouse, courier, or tracking terms.
- Imports must use @/* alias.
```

## 3. Aturan Wajib untuk Semua Prompt

Setiap prompt coding sebaiknya memuat blok ini:

```txt
Project context:
Ruang Usaha Kita is a digital service marketplace connecting UMKM with content creators/marketers for digital promotion services. It is not a physical product e-commerce website.

Do not use physical product terms:
stock, warehouse, shipping, courier, tracking number, delivery address, packing, shipment, resi, ongkir, gudang, kurir.

Use digital service terms:
paket jasa, kreator, UMKM, brief campaign, hasil konten, revisi, status pesanan, pembayaran, invoice, portofolio, review.

Tech stack:
Next.js App Router, TypeScript, Tailwind CSS v4, shadcn/ui, Radix UI, Lucide React.

Style direction:
Apple-like, clean, premium, spacious, Inter font, navy-teal brand colors, subtle borders, minimal shadows.

Rules:
- Use Server Components by default.
- Use Client Components only when interactivity is needed.
- Use @/* import alias.
- Do not create src/lib/utils folder because src/lib/utils.ts already exists.
- Do not modify src/components/ui files unless absolutely necessary.
- Keep TypeScript strict and avoid any.
- Keep components small and reusable.
```

## 4. Struktur Prompt yang Direkomendasikan

Gunakan format:

```txt
Role:
You are a senior full-stack Next.js engineer and UI systems architect.

Project context:
[context Ruang Usaha Kita]

Current task:
[tugas spesifik]

Files to create:
[list file]

Files to update:
[list file]

Files not to touch:
[list file]

UI direction:
[Apple-like, brand, typography]

Business rules:
[marketplace jasa digital, no shipping terms]

Technical rules:
[server/client, TypeScript, imports, shadcn]

Acceptance criteria:
[list test]

Output:
Make the changes directly in the codebase.
```

## 5. Prompt Phase 1 — Audit Project

Gunakan saat ingin Codex memeriksa project sebelum coding.

```txt
You are a senior Next.js project auditor.

Project:
Ruang Usaha Kita is a digital service marketplace for UMKM and content creators. It is not a physical product e-commerce website.

Task:
Audit the current project setup before feature development.

Check:
- package.json scripts and dependencies
- tsconfig path alias
- components.json
- src/app/layout.tsx
- src/app/globals.css
- .env.example
- .gitignore
- folder structure under src
- shadcn/ui setup
- Tailwind CSS v4 setup
- whether npm run build is likely to pass

Do not implement UI yet.
Do not create new features yet.
Do not modify files unless the fix is small and necessary.

Return:
- problems found
- recommended fixes
- exact files to change
- safe command list if dependencies are missing
```

## 6. Prompt Phase 2 — Design Tokens

```txt
You are a senior frontend engineer specializing in design systems.

Project context:
Ruang Usaha Kita is a digital service marketplace for UMKM and content creators. It is not a physical product store.

Task:
Set up global design tokens and typography foundation.

Brand colors:
#167163
#114955
#0C2949

Style:
Apple-like, clean, premium, spacious, minimal, white/off-white background, navy-teal accents, subtle borders, minimal shadows.

Font:
Use Inter family globally. Heading letter spacing should be slightly tight. Line-height should be compact but still readable.

Files to update:
- src/app/globals.css
- src/app/layout.tsx if font setup is needed

Rules:
- Keep Tailwind CSS v4 compatibility.
- Do not break shadcn/ui variables.
- Do not modify src/components/ui files.
- Do not add unnecessary libraries.
- Keep body accessible and readable.

Acceptance criteria:
- Global font is Inter.
- Brand tokens are available.
- Background, foreground, border, muted, and primary variables are consistent.
- UI remains compatible with shadcn/ui.
- npm run build passes.
```

## 7. Prompt Phase 3 — Layout Foundation

```txt
You are a senior Next.js App Router engineer.

Project context:
Ruang Usaha Kita is a digital service marketplace connecting UMKM with content creators/marketers. It is not a physical product e-commerce website.

Task:
Create the initial layout foundation only.

Create:
- src/components/common/app-logo.tsx
- src/components/layout/page-container.tsx
- src/components/layout/site-header.tsx
- src/components/layout/site-footer.tsx
- src/components/layout/dashboard-sidebar.tsx
- src/components/layout/dashboard-topbar.tsx
- src/components/layout/dashboard-shell.tsx
- src/lib/constants/navigation.ts

Update:
- src/app/(public)/layout.tsx
- src/app/(auth)/layout.tsx
- src/app/(umkm)/layout.tsx
- src/app/(creator)/layout.tsx
- src/app/(admin)/layout.tsx

Rules:
- Public layout uses SiteHeader and SiteFooter.
- Auth layout is clean and centered.
- UMKM, Creator, and Admin layouts use DashboardShell.
- Dashboard navigation must differ by role.
- Use Lucide React icons.
- Use shadcn/ui Button, Badge, Sheet where appropriate.
- Use @/* imports.
- Keep components typed.
- Do not implement auth, Supabase, payment, or database.
- Do not modify src/components/ui unless necessary.
- Do not use physical product terms.

Acceptance criteria:
- /, /katalog, /login, /umkm/dashboard, /creator/dashboard, /admin/dashboard render with correct layout.
- Sidebar and topbar appear in dashboard routes.
- Mobile public nav works with Sheet.
- npm run build passes.
```

## 8. Prompt Phase 4 — Dummy Data

```txt
You are a senior TypeScript engineer.

Project context:
Ruang Usaha Kita is a digital service marketplace for UMKM and content creators.

Task:
Create structured dummy data for UI development.

Create folder:
- src/lib/dummy

Create files:
- src/lib/dummy/creators.ts
- src/lib/dummy/umkm.ts
- src/lib/dummy/categories.ts
- src/lib/dummy/services.ts
- src/lib/dummy/portfolios.ts
- src/lib/dummy/cart.ts
- src/lib/dummy/briefs.ts
- src/lib/dummy/orders.ts
- src/lib/dummy/payments.ts
- src/lib/dummy/reviews.ts
- src/lib/dummy/complaints.ts
- src/lib/dummy/notifications.ts
- src/lib/dummy/reports.ts
- src/lib/dummy/index.ts

Rules:
- Data must be realistic for Indonesian UMKM and local creators.
- Use digital service terms.
- Do not use stock, shipping, warehouse, courier, tracking, delivery address, packing, resi, or ongkir.
- Keep IDs stable.
- Make relationships consistent: creators have services, services have tiers, orders refer to existing UMKM and creators.
- Use TypeScript exports.
- Avoid any.

Acceptance criteria:
- Dummy data can support homepage, catalog, detail service, cart, checkout, payment, orders, dashboard UMKM, dashboard creator, and admin reports.
- npm run build passes.
```

## 9. Prompt Phase 5 — Public Homepage

```txt
You are a senior UI engineer and product designer.

Project:
Ruang Usaha Kita is a digital service marketplace connecting UMKM with content creators.

Task:
Build the homepage using existing layout and dummy data.

Update:
- src/app/(public)/page.tsx

Create components if needed under:
- src/features/public/components
or
- src/components/common

Homepage sections:
1. Hero
2. Search entry
3. Trust stats
4. Service categories
5. Featured creators
6. How it works
7. Benefits for UMKM
8. CTA for creators
9. FAQ preview

UI direction:
Apple-like, clean, premium, spacious, Inter, navy-teal accent, subtle borders, minimal shadows.

Copy:
Use natural Indonesian. Avoid generic AI marketing language.

Rules:
- Semantic HTML.
- Add metadata if appropriate.
- Use Server Component by default.
- Do not implement real search yet.
- Use dummy data.
- Do not use physical product terms.

Acceptance criteria:
- Homepage clearly explains what Ruang Usaha Kita is.
- CTA points to /katalog and /cara-kerja.
- Responsive layout.
- npm run build passes.
```

## 10. Prompt Phase 6 — Catalog Page

```txt
You are a senior marketplace UI engineer.

Task:
Build the Katalog Kreator page for Ruang Usaha Kita.

Update:
- src/app/(public)/katalog/page.tsx

Create if needed:
- src/components/cards/creator-card.tsx
- src/features/catalog/components/catalog-filter.tsx
- src/features/catalog/components/catalog-search.tsx
- src/features/catalog/components/creator-grid.tsx

Use:
- dummy creators
- dummy categories
- dummy filters

Features:
- page heading
- search bar
- filter sidebar
- sort select
- creator grid
- creator cards
- empty state placeholder

Rules:
- This is a digital service marketplace.
- Do not use stock, shipping, warehouse, courier, resi, ongkir.
- Use terms: kreator, paket jasa, niche, harga mulai, rating, proyek selesai.
- Keep filter client-side only if needed.
- Use small Client Components only for interactive filter/search.
- Use Server Components by default.
- Use @/* imports.

Acceptance criteria:
- /katalog renders cleanly.
- Creator cards show name, niche, rating, price, service, and CTA.
- Responsive.
- npm run build passes.
```

## 11. Prompt Phase 7 — Detail Creator and Service

```txt
You are a senior full-stack UI engineer.

Task:
Build detail pages for creator and service package.

Update:
- src/app/(public)/kreator/[creatorId]/page.tsx
- src/app/(public)/layanan/[serviceId]/page.tsx

Create if needed:
- src/components/cards/service-card.tsx
- src/components/cards/portfolio-card.tsx
- src/features/creators/components/creator-profile-header.tsx
- src/features/services/components/service-tier-card.tsx

Use dummy data.

Creator detail must show:
- profile
- niche
- location
- rating
- completed orders
- bio
- portfolio
- service packages
- reviews

Service detail must show:
- service title
- creator
- price
- tiers Basic/Standard/Premium
- deliverables
- estimated days
- revision count
- requirements
- related portfolio
- CTA add to cart / pesan sekarang

Rules:
- Use semantic HTML.
- Add generateMetadata if practical.
- Do not implement real database.
- Do not implement payment.
- No physical product terms.

Acceptance criteria:
- Dynamic routes render using dummy IDs.
- Not found state exists for invalid ID.
- UI is Apple-like and clean.
- npm run build passes.
```

## 12. Prompt Phase 8 — Cart and Checkout Brief

```txt
You are a senior e-commerce flow engineer.

Project:
Ruang Usaha Kita is a marketplace for digital services, not physical products.

Task:
Build UMKM cart and checkout brief flow using dummy data.

Update:
- src/app/(umkm)/umkm/cart/page.tsx
- src/app/(umkm)/umkm/checkout/page.tsx

Create:
- src/features/cart/components/cart-summary.tsx
- src/features/cart/components/cart-item-card.tsx
- src/features/checkout/components/checkout-stepper.tsx
- src/features/checkout/components/campaign-brief-form.tsx
- src/features/checkout/components/order-summary.tsx

Rules:
- Cart is for service packages, not physical products.
- Do not emphasize quantity.
- Checkout must center on campaign brief.
- Use React Hook Form and Zod if installed; otherwise create clean form UI and note TODO.
- Do not implement real database.
- Do not implement real payment.
- Use dummy data.
- Use digital service terms only.

Acceptance criteria:
- /umkm/cart shows selected service and total.
- /umkm/checkout shows brief form and order summary.
- Form labels are clear.
- No shipping/address/courier/stock terms.
- npm run build passes.
```

## 13. Prompt Phase 9 — Payment Dummy

```txt
You are a senior payment flow engineer.

Project:
Ruang Usaha Kita is a digital service marketplace. Payment must be safe and staged.

Task:
Build dummy payment UI and route placeholders.

Update:
- src/app/(umkm)/umkm/payments/[paymentId]/page.tsx
- src/app/(admin)/admin/payments/page.tsx
- src/app/api/payments/create/route.ts if safe
- src/app/api/payments/webhook/route.ts as safe placeholder only

Create:
- src/features/payments/components/payment-summary-card.tsx
- src/features/payments/components/payment-method-selector.tsx
- src/features/payments/components/payment-status-badge.tsx
- src/features/payments/components/invoice-summary.tsx
- src/features/payments/components/payment-state.tsx

Rules:
- Payment is dummy for now.
- Do not integrate Midtrans yet.
- Do not use real API keys.
- Payment status and order status must be separate.
- Do not let client directly become source of truth.
- UI may include "Simulasikan Pembayaran Berhasil" for MVP.
- No physical product terms.

Acceptance criteria:
- Payment page shows pending, paid, failed, expired states.
- Admin payments table exists.
- API webhook placeholder does not expose secrets.
- npm run build passes.
```

## 14. Prompt Phase 10 — Order Flow

```txt
You are a senior marketplace order-flow engineer.

Task:
Build order list, order detail, and status timeline using dummy data.

Update:
- src/app/(umkm)/umkm/orders/page.tsx
- src/app/(umkm)/umkm/orders/[orderId]/page.tsx
- src/app/(creator)/creator/orders/page.tsx
- src/app/(creator)/creator/orders/[orderId]/page.tsx
- src/app/(admin)/admin/orders/page.tsx
- src/app/(admin)/admin/orders/[orderId]/page.tsx

Create:
- src/features/orders/components/order-status-timeline.tsx
- src/features/orders/components/order-summary-card.tsx
- src/features/orders/components/order-actions.tsx
- src/features/briefs/components/campaign-brief-preview.tsx
- src/features/submissions/components/submission-card.tsx
- src/features/revisions/components/revision-card.tsx

Rules:
- Follow docs/architecture/order-flow.md.
- Use status labels in Indonesian.
- Role actions must be different for UMKM, Creator, and Admin.
- Do not implement real database.
- Use dummy data.
- No shipping or physical product terms.

Acceptance criteria:
- UMKM sees own order style.
- Creator sees assigned order style.
- Admin sees monitoring style.
- Timeline status is correct.
- npm run build passes.
```

## 15. Prompt Phase 11 — Dashboard Pages

```txt
You are a senior dashboard UI engineer.

Task:
Build dashboard pages for UMKM, Creator, and Admin using dummy data.

Update:
- src/app/(umkm)/umkm/dashboard/page.tsx
- src/app/(creator)/creator/dashboard/page.tsx
- src/app/(admin)/admin/dashboard/page.tsx

Create if needed:
- src/components/dashboard/metric-card.tsx
- src/components/dashboard/dashboard-section.tsx
- src/components/dashboard/recent-activity-list.tsx

UMKM dashboard:
- active orders
- completed orders
- pending payments
- saved briefs
- latest results
- recommended creators

Creator dashboard:
- incoming orders
- active orders
- revision requests
- rating
- estimated earnings
- nearest deadline

Admin dashboard:
- total users
- total UMKM
- total creators
- total orders
- pending payments
- active complaints
- platform revenue dummy

Rules:
- Use dummy data.
- Keep UI clean and functional.
- No charts unless lightweight and necessary.
- No physical product terms.
- Use cards and tables cleanly.

Acceptance criteria:
- All dashboards render.
- Role-specific metrics are correct.
- UI is responsive.
- npm run build passes.
```

## 16. Prompt Phase 12 — Supabase Setup

Gunakan setelah UI dummy stabil.

```txt
You are a senior Supabase and Next.js engineer.

Task:
Set up Supabase client architecture only.

Create:
- src/lib/supabase/client.ts
- src/lib/supabase/server.ts
- src/lib/supabase/admin.ts
- src/lib/supabase/types.ts placeholder if generated types are not available

Update:
- .env.example

Rules:
- Do not use service role key in client.ts.
- admin.ts must be server-only.
- Use @supabase/ssr if installed.
- Do not migrate all data yet.
- Do not implement auth UI changes unless needed.
- Keep build safe.

Acceptance criteria:
- Supabase clients are separated.
- Env variables are documented.
- No secret is exposed to browser.
- npm run build passes.
```

## 17. Prompt Phase 13 — Midtrans Sandbox Preparation

Gunakan setelah payment dummy stabil.

```txt
You are a senior payment integration engineer.

Task:
Prepare Midtrans Sandbox integration architecture. Do not enable production payment.

Create:
- src/lib/payment/midtrans.ts
- src/lib/payment/payment-utils.ts

Update:
- src/app/api/payments/create/route.ts
- src/app/api/payments/webhook/route.ts
- .env.example

Rules:
- Use Midtrans Sandbox only.
- MIDTRANS_SERVER_KEY must be server-only.
- NEXT_PUBLIC_MIDTRANS_CLIENT_KEY may be used only if Snap client requires it.
- Validate amount from server data.
- Webhook must validate signature conceptually.
- Add TODO comments where real credentials or database update are not ready.
- Do not hardcode keys.
- Do not process real payment.
- No physical product terms.

Acceptance criteria:
- Payment create route is structured for Snap.
- Webhook route is safe and does not trust client.
- Env example includes Midtrans variables.
- npm run build passes.
```

## 18. Prompt Review Checklist

Setelah Codex selesai, cek:

1. File apa saja yang berubah?
2. Apakah ada file yang tidak diminta ikut berubah?
3. Apakah ada `any`?
4. Apakah ada `"use client"` terlalu banyak?
5. Apakah ada istilah shipping/stock/resi?
6. Apakah import pakai `@/*`?
7. Apakah `src/components/ui` diubah?
8. Apakah `src/lib/utils.ts` aman?
9. Apakah build lolos?
10. Apakah route utama masih aman?
11. Apakah payment status aman?
12. Apakah env secret tidak muncul?
13. Apakah UI masih sesuai brand?
14. Apakah responsive dasar aman?
15. Apakah copywriting natural?

## 19. Prompt Anti-Pattern

Hindari prompt:

```txt
Buatkan fullstack marketplace lengkap dengan database, payment, AI, chat, dan dashboard.
```

Masalah:

- terlalu luas
- risiko bug tinggi
- AI akan mengarang banyak logic
- keamanan buruk
- sulit debug

Hindari juga:

```txt
Rapikan semua file.
```

Masalah:

- bisa mengubah struktur terlalu banyak
- sulit melacak perubahan

Hindari:

```txt
Buat UI sekeren Apple.
```

Masalah:

- terlalu subjektif
- tidak ada acceptance criteria

## 20. Prompt yang Baik

Contoh prompt baik:

```txt
Build only the public site header and footer for Ruang Usaha Kita.

Files to create:
- src/components/layout/site-header.tsx
- src/components/layout/site-footer.tsx

Files to update:
- src/app/(public)/layout.tsx

Do not touch:
- payment files
- Supabase files
- dashboard pages
- src/components/ui

Acceptance criteria:
- Header has logo, nav links, login, register.
- Mobile menu uses Sheet.
- Footer has platform links.
- No physical product terms.
- npm run build passes.
```

## 21. Workflow Harian dengan Codex

Urutan kerja harian:

1. Tentukan satu fitur kecil.
2. Baca dokumen terkait.
3. Tulis prompt spesifik.
4. Jalankan Codex.
5. Review diff.
6. Jalankan build.
7. Tes route manual.
8. Commit jika aman.
9. Lanjut fitur berikutnya.

## 22. Command Setelah Codex

Setelah setiap perubahan besar:

```powershell
npm run build
```

Jika script tersedia:

```powershell
npm run typecheck
npm run lint
npm run build
```

Cek route:

```txt
http://localhost:3000
http://localhost:3000/katalog
http://localhost:3000/login
http://localhost:3000/umkm/dashboard
http://localhost:3000/creator/dashboard
http://localhost:3000/admin/dashboard
```

Cek git:

```powershell
git status
git diff --stat
```

## 23. Commit Setelah Prompt Berhasil

Contoh commit:

```powershell
git add .
git commit -m "feat: add public layout foundation"
```

Untuk dokumentasi:

```powershell
git add docs
git commit -m "docs: add architecture foundation"
```

Untuk fix:

```powershell
git add .
git commit -m "fix: correct dashboard route layout"
```

## 24. File yang Harus Dijaga

Jangan biarkan Codex mengubah sembarangan:

- `package-lock.json` kecuali memang install dependency
- `src/components/ui/*` kecuali add shadcn component
- `.env.local`
- `.gitignore`
- `tsconfig.json`
- `components.json`
- `next.config.ts`
- `src/lib/utils.ts`

Jika file-file ini berubah, review manual.

## 25. Red Flags dari Output Codex

Hati-hati jika Codex:

1. Membuat semua page jadi client component.
2. Menambahkan banyak dependency tanpa izin.
3. Mengubah struktur folder besar.
4. Menghapus file existing.
5. Mengubah `components.json`.
6. Menaruh API key di code.
7. Membuat payment paid dari client.
8. Memakai istilah shipping/stock.
9. Membuat dummy data tidak konsisten.
10. Menaruh 500 baris JSX di satu page.
11. Membuat CSS random dengan banyak hex.
12. Mengubah shadcn/ui secara langsung.
13. Mengabaikan TypeScript error.
14. Menambahkan fitur yang tidak diminta.

## 26. Definition of Good Codex Output

Output Codex dianggap baik jika:

1. Scope sesuai prompt.
2. File yang berubah sesuai.
3. Kode TypeScript rapi.
4. Import pakai alias.
5. Komponen kecil dan reusable.
6. UI sesuai design system.
7. Tidak ada istilah toko barang fisik.
8. Tidak ada secret.
9. Build aman.
10. Route aman.
11. Tidak overengineering.
12. Fitur bisa dilanjutkan tahap berikutnya.

## 27. Kesimpulan

Codex harus dipakai sebagai alat bantu coding bertahap, bukan sebagai mesin yang dibiarkan membangun semua hal tanpa batas. Untuk project Ruang Usaha Kita, prompt harus disiplin karena sistem ini memiliki banyak alur: marketplace jasa digital, role UMKM/creator/admin, order flow, payment flow, storage, dan dashboard.

Jika prompt dibuat spesifik, hasilnya akan rapi. Jika prompt terlalu luas, hasilnya berisiko kacau. Dokumen ini menjadi standar utama sebelum memberikan instruksi coding apa pun ke Codex.
