# Ruang Usaha Kita — Implementation Roadmap

## 1. Tujuan Dokumen

Dokumen ini menjelaskan roadmap implementasi teknis Ruang Usaha Kita dari tahap fondasi sampai siap demo. Roadmap ini dibuat agar proses coding tidak loncat-loncat, tidak terlalu ambisius di awal, dan tetap mengikuti konsep utama: marketplace jasa digital yang menghubungkan UMKM dengan content creator atau marketer.

Roadmap ini juga menjadi pegangan ketika menggunakan Codex atau AI coding. Setiap tahap harus punya batas kerja, target output, file yang mungkin disentuh, dan definisi selesai. Dengan begitu, AI tidak diminta membangun semua fitur sekaligus.

## 2. Kondisi Project Saat Ini

Project saat ini sudah memiliki fondasi awal:

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui dengan Radix dan preset Nova
- folder `src/app`
- route group `(public)`, `(auth)`, `(umkm)`, `(creator)`, `(admin)`
- folder `components`, `features`, `lib`, `stores`, dan `types`
- folder `docs`
- dokumentasi arsitektur awal
- konsep UI/UX Apple-like
- warna brand navy-teal
- font global Inter
- rencana deployment Vercel
- rencana database Supabase
- rencana payment dummy sampai Midtrans Sandbox

Namun, project belum boleh langsung dianggap siap fitur besar. Urutan implementasi harus bertahap.

## 3. Prinsip Roadmap

### 3.1 Foundation First

Sebelum membuat fitur, fondasi harus rapi:

- struktur folder
- global style
- design tokens
- layout
- reusable components
- route map
- coding standards
- dummy data
- testing strategy

### 3.2 MVP First

Jangan langsung membangun fitur seperti AI smart matching, chat real-time, payout otomatis, escrow legal penuh, atau analytics kompleks. MVP harus membuktikan alur utama dulu:

Beranda → Katalog Kreator → Detail Layanan → Cart → Checkout Brief → Payment Dummy → Order Detail → Submission → Revisi → Review

### 3.3 Server-Safe Architecture

Logic sensitif harus diarahkan ke server sejak awal, walaupun masih dummy:

- payment
- update order status
- role guard
- file upload
- admin action
- status transition

### 3.4 Service Marketplace, Bukan Toko Barang

Semua implementasi harus konsisten dengan jasa digital.

Gunakan:

- paket jasa
- kreator
- brief campaign
- hasil konten
- revisi
- status pesanan
- pembayaran
- invoice

Hindari:

- stok
- gudang
- ongkir
- kurir
- resi
- packing
- shipping
- alamat pengiriman

### 3.5 Coding Bertahap

Setiap tahap harus kecil dan bisa dites. Satu prompt Codex idealnya hanya mengerjakan satu fitur atau satu fondasi, bukan seluruh aplikasi sekaligus.

## 4. Target Akhir MVP

MVP dianggap cukup untuk demo jika:

1. Homepage tampil premium dan menjelaskan platform.
2. Katalog kreator tampil.
3. Detail kreator dan detail layanan tampil.
4. Cart jasa digital tampil.
5. Checkout brief campaign tampil.
6. Payment dummy berjalan secara UI.
7. Order detail menampilkan timeline.
8. Creator dashboard menampilkan order masuk.
9. Creator bisa mengirim hasil dummy/link.
10. UMKM bisa melihat hasil, revisi, dan review.
11. Admin bisa melihat dashboard, order, payment, dan komplain.
12. UI konsisten dengan desain Apple-like.
13. Tidak ada istilah toko barang fisik.
14. Build berhasil.
15. Siap deploy ke Vercel preview.

## 5. Urutan Implementasi Ringkas

1. Project audit dan dependency.
2. Global design system.
3. Layout foundation.
4. Reusable common components.
5. Public marketplace.
6. Auth dummy.
7. Cart dan checkout brief.
8. Payment dummy.
9. Order flow.
10. Submission, revision, review.
11. Dashboard UMKM.
12. Dashboard creator.
13. Dashboard admin.
14. Supabase preparation.
15. Midtrans Sandbox preparation.
16. Storage integration.
17. Testing dan QA.
18. Deployment preview.

## 6. Phase 0 — Documentation Foundation

### Tujuan

Mengunci konsep sebelum coding besar.

### Output

Dokumen yang harus ada:

- `docs/architecture/overview.md`
- `docs/architecture/route-map.md`
- `docs/architecture/data-model.md`
- `docs/architecture/roles-permissions.md`
- `docs/architecture/order-flow.md`
- `docs/architecture/payment-flow.md`
- `docs/architecture/storage-policy.md`
- `docs/architecture/testing-strategy.md`
- `docs/architecture/deployment.md`
- `docs/architecture/coding-standards.md`
- `docs/architecture/implementation-roadmap.md`
- `docs/product/mvp-scope.md`
- `docs/product/feature-list.md`
- `docs/product/dummy-data.md`
- `docs/prompts/codex-guidelines.md`

### Acceptance Criteria

- Semua dokumen punya konteks Ruang Usaha Kita.
- Semua dokumen konsisten menyebut marketplace jasa digital.
- Tidak ada konsep stok/gudang/kurir/resi.
- Semua dokumen bisa dipakai sebagai referensi prompt Codex.

## 7. Phase 1 — Project Audit dan Dependency

### Tujuan

Memastikan project siap dikembangkan sebelum UI dibuat.

### Aktivitas

1. Audit `package.json`.
2. Audit `tsconfig.json`.
3. Audit `components.json`.
4. Audit `src/app/layout.tsx`.
5. Audit `src/app/globals.css`.
6. Audit `.env.example`.
7. Audit `.gitignore`.
8. Pastikan alias `@/*` berjalan.
9. Pastikan shadcn/ui bekerja.
10. Pastikan Tailwind v4 aktif.
11. Pastikan `npm run dev` berjalan.
12. Tambahkan script `typecheck`, `check`, dan testing jika perlu.

### Dependency yang Disarankan

Core:

- `next`
- `react`
- `react-dom`
- `typescript`
- `tailwindcss`
- `lucide-react`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`

UI dan form:

- `react-hook-form`
- `zod`
- `@hookform/resolvers`
- `sonner`

State:

- `zustand`

Supabase tahap lanjut:

- `@supabase/supabase-js`
- `@supabase/ssr`

Testing tahap lanjut:

- `vitest`
- `@testing-library/react`
- `@testing-library/jest-dom`
- `playwright`

### File yang Disentuh

- `package.json`
- `tsconfig.json`
- `components.json`
- `.env.example`
- `.gitignore`
- `src/app/layout.tsx`
- `src/app/globals.css`

### Acceptance Criteria

- `npm run dev` berjalan.
- `npm run build` berjalan.
- Tidak ada konflik alias.
- Tidak ada error import shadcn.
- `.env.local` tidak masuk Git.
- Struktur folder tetap aman.

## 8. Phase 2 — Global Design System

### Tujuan

Membuat fondasi visual agar semua halaman konsisten.

### Aktivitas

1. Tambahkan font Inter.
2. Atur CSS variables untuk warna brand.
3. Atur typography default.
4. Atur body background.
5. Atur selection color.
6. Atur heading tracking dan line-height.
7. Atur token surface, border, muted, primary.
8. Pastikan shadcn tetap kompatibel.
9. Buat utility class jika perlu.
10. Pastikan desain Apple-like tidak berlebihan.

### Warna Brand

Warna dasar:

```txt
#167163
#114955
#0C2949
```

Arah token:

```css
--brand-navy-950: #0c2949;
--brand-teal-900: #114955;
--brand-teal-600: #167163;
--surface: #f7f9fa;
--surface-soft: #f3f6f7;
--ink-950: #06111f;
--border-soft: #e5eaf0;
```

### File yang Disentuh

- `src/app/globals.css`
- `src/app/layout.tsx`

### Acceptance Criteria

- Font Inter aktif.
- Warna dasar konsisten.
- Body background rapi.
- Heading terlihat premium.
- Tidak mengubah komponen shadcn sembarangan.
- Build aman.

## 9. Phase 3 — Layout Foundation

### Tujuan

Membuat tiang utama website:

- public layout
- auth layout
- dashboard layout
- header
- footer
- sidebar
- topbar
- page container

### Aktivitas

Buat komponen:

- `src/components/common/app-logo.tsx`
- `src/components/layout/page-container.tsx`
- `src/components/layout/site-header.tsx`
- `src/components/layout/site-footer.tsx`
- `src/components/layout/dashboard-sidebar.tsx`
- `src/components/layout/dashboard-topbar.tsx`
- `src/components/layout/dashboard-shell.tsx`

Buat layout route group:

- `src/app/(public)/layout.tsx`
- `src/app/(auth)/layout.tsx`
- `src/app/(umkm)/layout.tsx`
- `src/app/(creator)/layout.tsx`
- `src/app/(admin)/layout.tsx`

### Navigasi

Public:

- Beranda
- Katalog Kreator
- Cara Kerja
- Bantuan
- Masuk
- Daftar

UMKM:

- Dashboard
- Keranjang
- Checkout
- Pesanan Saya
- Brief Campaign
- File Hasil
- Pengaturan

Creator:

- Dashboard
- Profil
- Paket Layanan
- Order Masuk
- Portofolio
- Pendapatan
- Pengaturan

Admin:

- Dashboard
- Users
- UMKM
- Kreator
- Layanan
- Pesanan
- Pembayaran
- Komplain
- Laporan
- Pengaturan

### Acceptance Criteria

- Semua layout route group tampil.
- Public page punya header dan footer.
- Dashboard punya sidebar dan topbar.
- Mobile tidak rusak.
- Role navigation berbeda.
- Tidak ada route 404 utama.
- UI konsisten.

## 10. Phase 4 — Reusable Common Components

### Tujuan

Membuat komponen dasar yang dipakai banyak halaman.

### Komponen

Common:

- `status-badge.tsx`
- `price-text.tsx`
- `empty-state.tsx`
- `loading-state.tsx`
- `error-state.tsx`
- `section-heading.tsx`
- `metric-card.tsx`

Cards:

- `creator-card.tsx`
- `service-card.tsx`
- `portfolio-card.tsx`
- `order-card.tsx`

Dashboard:

- `stats-grid.tsx`
- `recent-activity-list.tsx`
- `dashboard-section.tsx`

### Acceptance Criteria

- Komponen typed.
- Tidak memakai `any`.
- Reusable.
- Tidak membawa logic bisnis berat.
- Build aman.

## 11. Phase 5 — Public Marketplace

### Tujuan

Membangun halaman publik untuk funnel awal.

### Halaman

- `/`
- `/katalog`
- `/kreator/[creatorId]`
- `/layanan/[serviceId]`
- `/cara-kerja`
- `/bantuan`

### Homepage

Section:

1. Hero.
2. Search entry.
3. Stats/trust cards.
4. Kategori layanan.
5. Kreator unggulan.
6. Cara kerja.
7. Manfaat untuk UMKM.
8. CTA kreator.
9. FAQ preview.
10. Footer.

### Katalog

Fitur UI:

- search bar
- filter kategori
- filter harga
- filter lokasi
- filter niche
- sort
- creator grid
- empty state
- creator card

### Detail Kreator

Isi:

- profil creator
- bio
- niche
- rating
- portofolio
- paket jasa
- review
- CTA pilih layanan

### Detail Layanan

Isi:

- nama paket jasa
- creator
- harga
- output
- estimasi pengerjaan
- jumlah revisi
- tier Basic/Standard/Premium
- add-on placeholder
- CTA tambah ke keranjang

### Acceptance Criteria

- Public funnel jelas.
- SEO metadata ada.
- Semantic HTML rapi.
- Tidak ada istilah barang fisik.
- Katalog terasa seperti marketplace jasa.
- Build aman.

## 12. Phase 6 — Auth Dummy

### Tujuan

Membuat UI autentikasi sebelum Supabase Auth.

### Halaman

- `/login`
- `/register`
- `/forgot-password`

### Aktivitas

1. Buat login form.
2. Buat register form.
3. Role selector untuk UMKM/Creator.
4. Redirect dummy berdasarkan role.
5. Admin login dummy jika perlu.
6. Error state dan loading state.

### Catatan

Auth dummy tidak boleh dianggap security real. Supabase Auth masuk tahap lanjut.

### Acceptance Criteria

- Login page rapi.
- Register page rapi.
- Form punya validasi UI.
- Redirect dummy berjalan.
- Tidak ada data sensitif.

## 13. Phase 7 — Cart dan Checkout Brief

### Tujuan

Membuat alur transaksi awal dari layanan ke brief campaign.

### Halaman

- `/umkm/cart`
- `/umkm/checkout`

### Fitur Cart

- daftar paket jasa
- harga paket
- tier
- add-on
- biaya admin
- total
- tombol checkout

### Fitur Checkout Brief

Field:

- nama usaha
- kategori usaha
- produk/jasa yang dipromosikan
- tujuan campaign
- target audiens
- platform konten
- gaya konten
- referensi konten
- deadline
- catatan tambahan
- upload aset placeholder

### Acceptance Criteria

- Cart tidak memakai konsep quantity barang.
- Checkout berpusat pada brief.
- Form validasi dasar.
- Total tampil jelas.
- UI rapi.

## 14. Phase 8 — Payment Dummy

### Tujuan

Membuat sistem pembayaran simulasi yang siap dinaikkan ke payment gateway.

### Halaman

- `/umkm/payments/[paymentId]`
- payment section di `/umkm/orders/[orderId]`
- `/admin/payments`

### Fitur

- payment summary
- method selector
- invoice summary
- status pending/paid/failed/expired
- tombol simulasi berhasil
- tombol simulasi gagal
- tombol lihat pesanan
- admin payment table dummy

### Server-Safe Pattern

Walaupun dummy, arahkan logic ke API route/server action:

- create payment
- update dummy status
- update order status

### Acceptance Criteria

- Payment status berbeda dari order status.
- Total dihitung dari data, bukan input manual user.
- Tidak ada server key.
- Tidak ada uang nyata.
- Flow siap naik ke Midtrans Sandbox.

## 15. Phase 9 — Order Flow

### Tujuan

Membuat pesanan terasa hidup dari sisi UMKM, creator, dan admin.

### Halaman

- `/umkm/orders`
- `/umkm/orders/[orderId]`
- `/creator/orders`
- `/creator/orders/[orderId]`
- `/admin/orders`
- `/admin/orders/[orderId]`

### Fitur

- order list
- order detail
- status timeline
- campaign brief preview
- creator actions
- UMKM actions
- admin actions placeholder
- activity/status history dummy

### Status

Gunakan status:

- awaiting_payment
- paid
- waiting_creator_confirmation
- brief_accepted
- in_progress
- submitted
- revision_requested
- revised
- completed
- cancelled
- refunded

### Acceptance Criteria

- Timeline benar.
- Role action benar.
- Status tidak loncat sembarangan.
- Tidak ada shipping/packing/resi.
- Dashboard role membaca order dummy.

## 16. Phase 10 — Submission, Revision, Review

### Tujuan

Menyelesaikan alur jasa digital setelah pembayaran.

### Submission

Creator mengirim:

- file/link hasil
- caption
- catatan hasil
- versi submission

### Revision

UMKM meminta:

- catatan revisi
- file referensi
- batas revisi
- status revisi

### Review

UMKM memberi:

- rating
- komentar
- kualitas
- komunikasi
- ketepatan waktu

### Acceptance Criteria

- Creator bisa kirim hasil dummy.
- UMKM bisa lihat hasil.
- UMKM bisa minta revisi.
- Creator bisa kirim revisi.
- UMKM bisa menyelesaikan order.
- UMKM bisa memberi review.
- Review muncul di detail kreator.

## 17. Phase 11 — Dashboard UMKM

### Tujuan

Membuat dashboard UMKM sebagai pusat aktivitas pemesan.

### Isi

- pesanan aktif
- pesanan selesai
- pembayaran pending
- brief tersimpan
- file hasil terbaru
- rekomendasi kreator
- recent activity

### Acceptance Criteria

- Ringkasan jelas.
- Data dummy masuk akal.
- CTA mengarah ke route benar.
- Empty state rapi.

## 18. Phase 12 — Dashboard Creator

### Tujuan

Membuat dashboard creator sebagai pusat pekerjaan.

### Isi

- order masuk
- order aktif
- deadline terdekat
- revisi aktif
- rating
- estimasi pendapatan
- portfolio summary

### Acceptance Criteria

- Creator memahami pekerjaan aktif.
- Brief mudah ditemukan.
- Tombol kirim hasil tersedia di detail order.
- Tidak ada data UMKM lain yang tidak terkait.

## 19. Phase 13 — Dashboard Admin

### Tujuan

Membuat dashboard admin sebagai pusat sales management dan monitoring.

### Isi

- total user
- total UMKM
- total creator
- total order
- payment pending
- complaint aktif
- revenue dummy
- laporan sederhana

### Halaman Admin

- users
- UMKM
- creators
- services
- orders
- payments
- complaints
- reports
- settings

### Acceptance Criteria

- Admin bisa melihat ringkasan platform.
- Payment dan order dapat dimonitor.
- Komplain punya placeholder.
- Reports ada walau dummy.

## 20. Phase 14 — Supabase Preparation

### Tujuan

Menyiapkan backend database real setelah UI flow stabil.

### Aktivitas

1. Install Supabase packages.
2. Buat Supabase project.
3. Isi environment variables.
4. Buat client/server/admin client.
5. Buat migration bertahap.
6. Buat seed data.
7. Generate types.
8. Aktifkan RLS.
9. Test query dasar.

### Prioritas Tabel

Mulai dari:

- profiles
- umkm_profiles
- creator_profiles
- service_categories
- service_packages
- service_package_tiers
- portfolios

Lanjut:

- carts
- cart_items
- campaign_briefs
- orders
- order_items
- payments
- submissions
- revisions
- reviews

### Acceptance Criteria

- Supabase terhubung.
- Data katalog bisa dibaca dari database.
- RLS tidak bocor.
- Type generated aman.
- UI tidak rusak.

## 21. Phase 15 — Midtrans Sandbox

### Tujuan

Menaikkan payment dummy ke gateway sandbox.

### Aktivitas

1. Buat akun Midtrans Sandbox.
2. Ambil server key dan client key sandbox.
3. Tambahkan env server/client.
4. Buat `src/lib/payment/midtrans.ts`.
5. Update `/api/payments/create`.
6. Buat webhook.
7. Test status success/failed/expired.
8. Validasi signature.
9. Validasi amount.
10. Idempotency webhook.

### Acceptance Criteria

- Payment sandbox berjalan.
- Webhook masuk.
- Payment paid mengubah order.
- Secret key aman.
- Tidak ada uang nyata.

## 22. Phase 16 — Storage Integration

### Tujuan

Menghubungkan upload file ke Supabase Storage.

### Prioritas

1. Avatar.
2. Portfolio thumbnail.
3. Brief asset kecil.
4. Submission link.
5. Submission file kecil.
6. Revision asset.
7. Invoice PDF tahap lanjutan.

### Acceptance Criteria

- File type divalidasi.
- File size dibatasi.
- File private tidak public.
- Metadata file tersimpan.
- Signed URL disiapkan untuk file private.

## 23. Phase 17 — Testing dan QA

### Tujuan

Memastikan semua flow utama tidak rusak.

### Testing Minimal

- route testing
- build check
- role UI test
- payment dummy test
- order flow test
- responsive test
- terminology test
- security checklist

### Acceptance Criteria

- `npm run build` berhasil.
- Public flow aman.
- UMKM flow aman.
- Creator flow aman.
- Admin flow aman.
- Payment dummy/sandbox aman.
- Tidak ada istilah barang fisik.

## 24. Phase 18 — Deployment Preview

### Tujuan

Menampilkan website ke tim/dosen melalui Vercel preview.

### Aktivitas

1. Push ke GitHub.
2. Import ke Vercel.
3. Set env preview.
4. Deploy.
5. Manual QA.
6. Share link preview.

### Acceptance Criteria

- Preview URL bisa dibuka.
- Route utama tidak 404.
- UI sama seperti local.
- Tidak ada env secret bocor.
- Build Vercel berhasil.

## 25. Development Milestone Table

| Milestone | Fokus | Output |
|---|---|---|
| M0 | Dokumentasi | Semua docs fondasi |
| M1 | Audit project | Dependency dan config aman |
| M2 | Design system | Token, font, globals |
| M3 | Layout | Header, footer, dashboard shell |
| M4 | Public marketplace | Homepage, katalog, detail |
| M5 | UMKM flow | Cart, checkout, payment |
| M6 | Order flow | Timeline, detail, status |
| M7 | Creator flow | Order masuk, kirim hasil |
| M8 | Admin flow | Monitoring dan reports |
| M9 | Supabase | Database dan auth |
| M10 | Payment gateway | Midtrans Sandbox |
| M11 | Storage | Upload dan file policy |
| M12 | Preview deploy | Vercel demo |

## 26. Feature Lock Urutan MVP

Urutan fitur yang tidak boleh dilompati:

1. Layout.
2. Homepage.
3. Katalog.
4. Detail layanan.
5. Cart.
6. Checkout brief.
7. Payment dummy.
8. Order detail.
9. Creator order.
10. UMKM result/revision.
11. Review.
12. Admin monitoring.
13. Supabase.
14. Payment sandbox.

Jangan masuk payment gateway sebelum payment dummy dan order flow jelas.

Jangan masuk Supabase sebelum UI flow utama stabil.

Jangan masuk AI sebelum data dan flow dasar ada.

## 27. Risiko Implementasi

### 27.1 Scope Creep

Risiko:

Project melebar ke AI, chat, escrow, payout, dan analytics sebelum MVP selesai.

Mitigasi:

Ikuti roadmap dan kerjakan P0 dulu.

### 27.2 UI Bagus tapi Flow Salah

Risiko:

Website terlihat premium tetapi tidak punya alur transaksi.

Mitigasi:

Selalu cek core flow.

### 27.3 Payment Terlalu Cepat

Risiko:

Tim tersangkut Midtrans sebelum order flow jelas.

Mitigasi:

Dummy payment dulu.

### 27.4 Supabase RLS Membingungkan

Risiko:

Integrasi database terlalu cepat membuat development lambat.

Mitigasi:

Pakai dummy data dulu, lalu naik bertahap.

### 27.5 AI Coding Mengubah Terlalu Banyak File

Risiko:

Codex mengubah file yang tidak diminta.

Mitigasi:

Prompt harus membatasi file scope dan acceptance criteria.

## 28. Definition of Done Project MVP

Project MVP dianggap selesai jika:

1. Semua route utama tampil.
2. Layout public dan dashboard rapi.
3. Homepage menjelaskan platform.
4. Katalog kreator tersedia.
5. Detail kreator dan layanan tersedia.
6. Cart layanan tersedia.
7. Checkout brief tersedia.
8. Payment dummy tersedia.
9. Order timeline tersedia.
10. Creator bisa melihat dan mengirim hasil dummy.
11. UMKM bisa revisi dan review.
12. Admin bisa monitoring.
13. UI konsisten.
14. Build berhasil.
15. Siap deploy preview.
16. Tidak ada konsep toko barang fisik.
17. Dokumentasi lengkap.

## 29. Kesimpulan

Roadmap implementasi Ruang Usaha Kita harus dijalankan bertahap. Tujuan utamanya bukan membuat semua fitur canggih sekaligus, tetapi membangun alur marketplace jasa digital yang utuh, rapi, dan bisa dijelaskan.

Tahap paling penting adalah fondasi, layout, public marketplace, cart, checkout, payment dummy, order flow, creator workflow, dan admin monitoring. Setelah itu, Supabase, storage, dan Midtrans Sandbox dapat masuk dengan lebih aman.

Dokumen ini menjadi pegangan utama sebelum membuat prompt Codex dan sebelum melakukan coding besar.
