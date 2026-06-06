# Ruang Usaha Kita — Handoff untuk Lanjut di Akun/Chat Baru

## Tujuan
File ini dipakai agar project Ruang Usaha Kita tetap nyambung saat pindah akun GPT, sesi Codex, atau chat baru. Jangan ulang dari awal. Gunakan file ini bersama `AGENTS.md` dan seluruh folder `docs/`.

## Konteks Project
Ruang Usaha Kita adalah marketplace jasa digital yang menghubungkan UMKM dengan content creator/marketer untuk kebutuhan promosi digital.

Platform ini bukan toko barang fisik. Jangan memakai konsep stok barang, gudang, pengiriman paket, ongkir, kurir, nomor resi, packing, shipping, atau alamat pengiriman barang.

Istilah yang digunakan:
- UMKM
- kreator
- content creator
- marketer
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

Istilah yang dihindari:
- stock
- inventory barang
- warehouse
- shipping
- courier
- tracking number
- delivery address
- packing
- shipment
- resi
- ongkir
- gudang
- kurir
- alamat pengiriman barang

## Stack Teknologi
- Next.js App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Radix UI
- Lucide React
- Inter font
- Supabase untuk database, auth, dan storage tahap lanjut
- Vercel untuk hosting
- Midtrans Sandbox untuk payment gateway tahap lanjut
- Dummy data untuk tahap UI awal

## Arah Desain
Desain mengarah ke gaya Apple-like: clean, elegant, premium, calm, spacious, modern, tidak ramai.

Warna brand:
- `#167163`
- `#114955`
- `#0C2949`

Aturan spacing:
- mobile sekitar 20px
- tablet sekitar 32px
- desktop 100px
- gunakan `PageContainer`
- jangan pakai padding 100px mentah di mobile

Logo sudah ada di:
```txt
public/logo/
```
Gunakan path logo yang benar-benar ada di folder tersebut. Jangan mengarang path logo.

## Aturan Coding Utama
Ikuti `AGENTS.md` dan seluruh file di folder `docs`.

Aturan penting:
- Gunakan Server Components secara default.
- Gunakan Client Components hanya jika butuh interaksi.
- Gunakan import alias `@/*`.
- Jangan buat folder `src/lib/utils` karena sudah ada `src/lib/utils.ts`.
- Jangan ubah `src/components/ui/*` kecuali benar-benar perlu.
- Jangan pakai `any`.
- Komponen harus kecil, reusable, dan typed.
- Jangan expose secret.
- Jangan implement Supabase, Midtrans, auth real, payment real, atau dashboard real kecuali diminta eksplisit.
- Setelah perubahan, jalankan `npm run check`.

## Dokumentasi yang Harus Dibaca
Baca:
```txt
AGENTS.md
docs/architecture/overview.md
docs/architecture/route-map.md
docs/architecture/data-model.md
docs/architecture/roles-permissions.md
docs/architecture/order-flow.md
docs/architecture/payment-flow.md
docs/architecture/storage-policy.md
docs/architecture/testing-strategy.md
docs/architecture/deployment.md
docs/architecture/coding-standards.md
docs/architecture/implementation-roadmap.md
docs/product/mvp-scope.md
docs/product/feature-list.md
docs/product/dummy-data.md
docs/prompts/codex-guidelines.md
docs/uiux/DESAIN.md
```

Jika ada file yang belum ada, lanjut berdasarkan file yang tersedia.

## Status Terakhir Berdasarkan Chat
Tahap yang sudah disiapkan lewat prompt:
1. Project foundation audit.
2. Global design tokens dan global style.
3. Layout foundation.
4. Dummy data foundation.
5. Public homepage.
6. Public catalog page.
7. Public creator detail dan service detail page.
8. Prompt untuk cart dan checkout brief sudah dibuat, tetapi belum dieksekusi karena Codex limit.

Catatan paling penting:
```txt
Prompt feat: build cart and checkout brief pages belum dieksekusi.
```

Jadi tugas berikutnya adalah membangun:
```txt
/umkm/cart
/umkm/checkout
```

dengan dummy data, tanpa payment logic real, tanpa Supabase, dan tanpa Midtrans.

## Perintah Cek Status Sebelum Lanjut
Jalankan di PowerShell:
```powershell
cd C:\projects\ruangusaha
git status
git log --oneline -8
npm run check
```

Cek struktur jika perlu:
```powershell
tree src /F /A
```

Jika `npm run check` lolos, lanjut ke prompt cart-checkout.

Jika ada perubahan belum commit:
```powershell
git diff --stat
```

## Prompt Lanjutan yang Belum Dieksekusi
Gunakan prompt ini ke Codex:

```txt
Read AGENTS.md and all relevant docs under docs/.

Build the UMKM cart and checkout brief pages using dummy data.

Update:
- src/app/(umkm)/umkm/cart/page.tsx
- src/app/(umkm)/umkm/checkout/page.tsx

Create reusable components only if needed under:
- src/features/cart/components
- src/features/checkout/components
- src/features/briefs/components

Use dummy data from:
- src/lib/dummy

Cart page must show:
- selected digital service package
- creator name
- selected tier
- deliverables
- estimated days
- revision count
- add-ons
- subtotal
- admin fee
- total payment
- CTA “Lanjut Checkout”

Checkout page must show:
- checkout stepper: Detail Pesanan → Brief Campaign → Pembayaran
- order summary
- campaign brief form with fields:
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
- CTA “Lanjut ke Pembayaran” as placeholder link only

Rules:
- This is a digital service marketplace, not a physical product store.
- Do not use quantity as a main concept.
- Do not use shipping, stock, warehouse, courier, tracking, delivery address, resi, ongkir, or packing terms.
- Do not implement real cart state yet.
- Do not implement payment logic yet.
- Do not implement Supabase.
- Do not implement Midtrans.
- Do not implement real auth.
- Use PageContainer and existing layout.
- Use semantic HTML.
- Keep UI Apple-like, clean, premium, and consistent with homepage/catalog/detail pages.
- Keep components typed.
- Avoid any.

Acceptance criteria:
- /umkm/cart renders cleanly using dummy cart data.
- /umkm/checkout renders cleanly using dummy cart and brief structure.
- Total payment is displayed clearly.
- Checkout form is clear and natural for UMKM.
- CTA links are present but no transaction logic is implemented.
- npm run check passes.
```

## Setelah Codex Selesai
Jalankan:
```powershell
npm run check
git status
git diff --stat
```

Jika aman:
```powershell
git add .
git commit -m "feat: build cart and checkout brief pages"
```

Jika Codex mengubah file terlalu banyak atau menyentuh bagian yang tidak diminta, jangan commit. Cek dulu:
```powershell
git diff --stat
git diff
```

## Prompt Berikutnya Setelah Cart dan Checkout
Setelah cart-checkout selesai dan commit, lanjut ke payment dummy:

```txt
Read AGENTS.md and all relevant docs under docs/.

Build dummy payment pages and admin payment monitoring using dummy data.

Update:
- src/app/(umkm)/umkm/payments/[paymentId]/page.tsx
- src/app/(admin)/admin/payments/page.tsx

Create reusable components only if needed under:
- src/features/payments/components

Use dummy data from src/lib/dummy.

Payment page must show:
- payment number
- order number
- payment status
- selected digital service
- creator
- subtotal
- add-ons
- admin fee
- total payment
- payment method selector UI
- invoice summary
- CTA “Simulasikan Pembayaran Berhasil” as UI placeholder only
- CTA “Lihat Pesanan”

Admin payment page must show:
- payment table
- status filter UI
- total paid, pending, failed/expired
- platform revenue summary from dummy reports

Rules:
- Dummy payment only.
- Do not integrate Midtrans yet.
- Do not implement real payment update.
- Do not implement Supabase.
- Do not expose secrets.
- Payment status and order status must remain separate.
- No physical product terms.

Acceptance criteria:
- /umkm/payments/[paymentId] renders.
- /admin/payments renders.
- UI is clean and consistent.
- npm run check passes.
```

Commit jika aman:
```powershell
git add .
git commit -m "feat: build dummy payment pages"
```

## Pesan Pembuka untuk Chat/Akun Baru
Saat pindah chat/akun, kirim:

```txt
Saya lanjut project Ruang Usaha Kita. Baca file handoff ini dan jangan ulang dari awal. Project sudah punya AGENTS.md dan docs lengkap. Status terakhir: prompt cart-checkout belum dieksekusi karena Codex limit. Tolong lanjut dari bagian "Prompt Lanjutan yang Belum Dieksekusi".
```

Lalu unggah atau tempel file ini.

## Kesimpulan
Untuk pindah akun/chat, jangan mengulang seluruh riwayat panjang. Bawa:
1. `AGENTS.md`
2. folder `docs`
3. file handoff ini
4. status git terakhir
5. prompt lanjutan yang belum dieksekusi

Dengan itu, GPT atau Codex baru bisa langsung lanjut tanpa mengulang fondasi dari awal.
