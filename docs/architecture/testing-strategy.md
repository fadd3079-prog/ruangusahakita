# Ruang Usaha Kita — Testing Strategy

## 1. Tujuan Dokumen

Dokumen ini menjelaskan strategi pengujian untuk website Ruang Usaha Kita. Testing strategy diperlukan agar proses pengembangan tidak hanya fokus pada tampilan, tetapi juga memastikan setiap route, komponen, alur transaksi, role, payment, storage, dan dashboard berjalan sesuai konsep bisnis.

Ruang Usaha Kita adalah marketplace jasa digital yang menghubungkan UMKM dengan content creator atau marketer untuk kebutuhan promosi digital. Karena itu, testing tidak boleh memakai asumsi toko barang fisik seperti stok, gudang, kurir, ongkir, nomor resi, atau pengiriman paket.

Testing harus memastikan bahwa website benar-benar berjalan sebagai e-commerce jasa digital, dengan alur utama:

UMKM mencari kreator → memilih paket jasa → masuk keranjang → checkout brief campaign → pembayaran → creator mengerjakan → hasil konten dikirim → revisi/approval → review → admin monitoring.

## 2. Prinsip Testing

### 2.1 Test Berdasarkan Alur Bisnis

Pengujian tidak cukup hanya memastikan halaman tampil. Setiap fitur harus diuji berdasarkan alur bisnis.

Contoh:

- katalog harus mengarah ke detail layanan
- detail layanan harus mengarah ke cart
- cart harus mengarah ke checkout
- checkout harus menghasilkan order
- payment harus mengubah status pembayaran
- creator harus bisa melihat order masuk
- UMKM harus bisa melihat hasil konten
- admin harus bisa memantau order

### 2.2 Test Role dan Permission

Karena website memiliki beberapa role, testing harus memastikan setiap role hanya mengakses halaman dan data yang sesuai.

Role utama:

- Guest
- UMKM
- Creator
- Admin

Contoh:

- Guest tidak boleh membuka dashboard.
- UMKM tidak boleh membuka dashboard creator.
- Creator tidak boleh membuka dashboard admin.
- Admin tidak perlu masuk route UMKM/creator, karena admin memiliki dashboard sendiri.
- UMKM hanya boleh melihat order miliknya.
- Creator hanya boleh melihat order yang ditujukan kepadanya.

### 2.3 Test Payment Secara Bertahap

Payment tidak langsung diuji sebagai production gateway.

Tahapan testing payment:

1. Dummy payment.
2. Server dummy payment.
3. Midtrans Sandbox.
4. Webhook validation.
5. Production readiness.

Testing harus memastikan bahwa payment status tidak bisa diubah sembarangan dari client.

### 2.4 Test Storage dan File Access

Karena Ruang Usaha Kita memiliki brief asset, portofolio, submission, revision, invoice, dan complaint files, akses file harus diuji.

Contoh:

- file portofolio boleh public jika aktif
- hasil konten tidak boleh public
- brief asset hanya untuk UMKM, creator terkait, dan admin
- invoice hanya untuk UMKM terkait dan admin
- guest tidak boleh membuka file private

### 2.5 Test UI dan UX

Testing juga harus memastikan website tetap rapi, responsif, dan sesuai design direction.

Arah desain:

- clean
- Apple-like
- premium
- tidak ramai
- warna brand navy-teal
- font Inter
- spacing konsisten
- istilah jasa digital konsisten

## 3. Testing Stack

Testing stack yang disarankan:

| Kebutuhan | Tool |
|---|---|
| Unit test | Vitest |
| Component test | React Testing Library |
| E2E test | Playwright |
| Type checking | TypeScript |
| Linting | ESLint |
| Formatting | Prettier |
| Accessibility check | Manual + Playwright basic |
| Build check | Next.js build |
| API test | Vitest atau Playwright request |
| Database/RLS test | Supabase SQL + integration test tahap lanjut |

## 4. Script Testing yang Disarankan

Pada `package.json`, script yang disarankan:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "check": "npm run typecheck && npm run lint && npm run build"
  }
}
````

Catatan:

Script bisa disesuaikan dengan konfigurasi project. Yang penting, sebelum deploy atau push besar, minimal jalankan:

```bash
npm run typecheck
npm run lint
npm run build
```

atau:

```bash
npm run check
```

## 5. Level Testing

Testing dibagi menjadi beberapa level.

### 5.1 Static Check

Static check memastikan kode tidak rusak secara struktur.

Yang dicek:

* TypeScript error
* import path rusak
* file tidak ditemukan
* unused variable yang fatal
* syntax error
* build error
* route conflict

Command:

```bash
npm run typecheck
npm run lint
npm run build
```

### 5.2 Unit Test

Unit test menguji fungsi kecil.

Contoh fungsi yang perlu unit test:

* format currency
* format date
* calculate platform fee
* calculate admin fee
* calculate total payment
* order status mapping
* payment status mapping
* file validation
* route permission helper
* role permission helper

Contoh:

```ts
calculatePlatformFee(300000) should return 30000
calculateAdminFee() should return 5000
formatCurrency(300000) should return "Rp300.000"
```

### 5.3 Component Test

Component test menguji komponen UI secara terpisah.

Komponen yang perlu dites:

* Button wrapper jika ada custom
* StatusBadge
* PriceText
* CreatorCard
* ServiceCard
* OrderCard
* PaymentSummaryCard
* CheckoutStepper
* OrderStatusTimeline
* FileUploadZone
* EmptyState
* ErrorState
* DashboardSidebar
* SiteHeader

Tujuan:

* memastikan komponen render
* memastikan label benar
* memastikan props terbaca
* memastikan tombol muncul sesuai status
* memastikan tidak crash ketika data kosong

### 5.4 Integration Test

Integration test menguji gabungan beberapa fungsi atau modul.

Contoh:

* cart summary menghitung total dengan add-on dan biaya admin
* checkout membuat order dummy
* payment dummy mengubah status dari pending ke paid
* order status timeline membaca status yang benar
* review hanya bisa muncul setelah completed
* revision hanya muncul ketika status submitted atau revised

### 5.5 End-to-End Test

E2E test menguji alur user dari awal sampai akhir.

Contoh:

* guest membuka homepage
* guest membuka katalog
* UMKM memilih layanan
* UMKM checkout
* UMKM melakukan payment dummy
* creator membuka order
* creator mengirim hasil
* UMKM menyelesaikan order
* UMKM memberi review

E2E test paling penting karena Ruang Usaha Kita adalah sistem alur, bukan hanya kumpulan halaman.

## 6. Testing Scope Berdasarkan Fase

### 6.1 Phase 1 — Foundation

Fokus:

* route tidak 404
* layout render
* header/footer tampil
* dashboard shell tampil
* sidebar role tampil
* global style aktif
* font Inter aktif
* warna brand aktif

Testing:

* buka semua route utama
* cek build
* cek responsive dasar
* cek tidak ada istilah barang fisik

### 6.2 Phase 2 — Public Marketplace

Fokus:

* landing page
* katalog kreator
* creator card
* detail kreator
* detail layanan
* cara kerja
* bantuan

Testing:

* katalog tampil
* search UI tampil
* filter UI tampil
* detail layanan terbuka
* CTA menuju route yang benar
* tidak ada konsep stok/pengiriman barang

### 6.3 Phase 3 — UMKM Transaction Flow

Fokus:

* cart
* checkout brief
* payment dummy
* order status
* dashboard UMKM

Testing:

* add to cart
* cart summary
* checkout validation
* payment dummy
* order detail
* timeline status
* revision request
* complete order

### 6.4 Phase 4 — Creator Workflow

Fokus:

* dashboard creator
* profile creator
* service management
* order masuk
* detail order
* upload hasil placeholder
* revisi

Testing:

* creator melihat order assigned
* creator menerima order
* creator mulai pengerjaan
* creator mengirim hasil
* creator mengirim revisi
* creator melihat review

### 6.5 Phase 5 — Admin Monitoring

Fokus:

* dashboard admin
* users
* UMKM
* creators
* services
* orders
* payments
* complaints
* reports

Testing:

* admin melihat semua order
* admin melihat payment
* admin melihat komplain
* admin melihat report
* admin action tercatat secara konsep
* admin tidak memakai route UMKM/creator untuk monitoring

### 6.6 Phase 6 — Supabase Integration

Fokus:

* auth
* profile role
* database query
* RLS
* storage
* order real
* payment real/sandbox

Testing:

* login/register
* role redirect
* query data sesuai role
* UMKM tidak bisa membaca order lain
* creator tidak bisa membaca brief yang bukan ordernya
* payment status tidak bisa diubah client
* file private tidak bisa dibuka guest

## 7. Route Testing

Route testing memastikan semua halaman utama bisa dibuka.

### 7.1 Public Routes

Route yang wajib lolos:

```txt
/
 /katalog
 /kreator/[creatorId]
 /layanan/[serviceId]
 /cara-kerja
 /bantuan
```

Expected:

* tidak 404
* layout public tampil
* header dan footer tampil
* UI sesuai desain
* CTA tidak mati

### 7.2 Auth Routes

Route:

```txt
/login
/register
/forgot-password
```

Expected:

* tidak 404
* form tampil
* link antar auth page jalan
* copywriting jelas
* belum perlu auth real pada tahap awal

### 7.3 UMKM Routes

Route:

```txt
/umkm/dashboard
/umkm/cart
/umkm/checkout
/umkm/orders
/umkm/orders/[orderId]
/umkm/payments/[paymentId]
/umkm/briefs
/umkm/results
/umkm/settings
```

Expected:

* dashboard shell UMKM tampil
* sidebar UMKM tampil
* title halaman sesuai
* data dummy masuk akal
* istilah jasa digital konsisten

### 7.4 Creator Routes

Route:

```txt
/creator/dashboard
/creator/profile
/creator/services
/creator/services/new
/creator/orders
/creator/orders/[orderId]
/creator/portfolio
/creator/earnings
/creator/settings
```

Expected:

* dashboard shell creator tampil
* sidebar creator tampil
* order masuk tidak memakai istilah barang
* upload hasil memakai istilah hasil konten

### 7.5 Admin Routes

Route:

```txt
/admin/dashboard
/admin/users
/admin/umkm
/admin/creators
/admin/services
/admin/orders
/admin/orders/[orderId]
/admin/payments
/admin/complaints
/admin/reports
/admin/settings
```

Expected:

* dashboard shell admin tampil
* data monitoring tampil
* admin melihat konteks platform
* tidak ada route admin yang memakai konsep stok/kurir

### 7.6 API Routes

Route:

```txt
/api/health
/api/checkout
/api/payments/create
/api/payments/webhook
/api/orders/[orderId]/status
/api/orders/[orderId]/revision
/api/upload
```

Expected MVP:

* `/api/health` return ok
* route lain minimal punya placeholder yang aman
* route sensitif tidak langsung percaya data client

## 8. UI Testing

### 8.1 Visual Consistency

Yang dicek:

* warna brand konsisten
* font Inter aktif
* spacing tidak terlalu sempit
* line-height compact tetapi tetap terbaca
* heading punya tracking rapat
* card radius konsisten
* border halus
* button konsisten
* background dominan putih/off-white
* aksen teal tidak berlebihan

### 8.2 Apple-like Direction

Checklist:

* hero section lega
* headline kuat
* tidak terlalu banyak warna
* grid rapi
* tidak banyak shadow berat
* tidak banyak gradient
* navbar sederhana
* footer bersih
* dashboard tetap fungsional

### 8.3 Responsive Testing

Ukuran yang wajib dicek:

* mobile kecil: 360px
* mobile umum: 390px
* tablet: 768px
* laptop: 1366px
* desktop besar: 1440px+

Yang dicek:

* navbar mobile berubah menjadi menu
* card tidak pecah
* tabel bisa scroll atau berubah layout
* form tetap nyaman
* dashboard sidebar tidak merusak mobile
* tombol tidak terlalu kecil
* text tidak overflow

### 8.4 Copywriting Testing

Pastikan UI memakai istilah:

* paket jasa
* kreator
* UMKM
* brief campaign
* hasil konten
* revisi
* status pesanan
* pembayaran
* invoice
* portofolio
* review

Pastikan UI tidak memakai:

* stok
* gudang
* ongkir
* kurir
* resi
* alamat pengiriman
* packing
* shipping
* barang dikirim
* COD barang

## 9. Unit Test Target

### 9.1 Payment Fee Test

File target:

```txt
tests/unit/fees.test.ts
```

Yang dites:

* platform fee 10%
* admin fee Rp5.000
* total payment
* pembulatan angka
* format currency

Contoh kasus:

|     Input |           Expected |
| --------: | -----------------: |
|    300000 | platform fee 30000 |
|    150000 | platform fee 15000 |
| admin fee |               5000 |

### 9.2 Order Status Test

File target:

```txt
tests/unit/order-status.test.ts
```

Yang dites:

* label status benar
* status transition valid
* forbidden transition ditolak

Contoh:

* `submitted` → `completed` oleh UMKM valid
* `submitted` → `completed` oleh creator invalid
* `awaiting_payment` → `paid` oleh server valid
* `awaiting_payment` → `paid` oleh UMKM invalid

### 9.3 Payment Status Test

File target:

```txt
tests/unit/payment-status.test.ts
```

Yang dites:

* pending → paid valid
* pending → failed valid
* pending → expired valid
* paid → refunded valid
* paid → pending invalid

### 9.4 File Validation Test

File target:

```txt
tests/unit/file-validation.test.ts
```

Yang dites:

* avatar maksimal 2 MB
* portfolio maksimal 5 MB
* invoice hanya PDF
* executable ditolak
* file tanpa extension valid ditolak
* video besar diarahkan ke external link

### 9.5 Role Permission Test

File target:

```txt
tests/unit/permissions.test.ts
```

Yang dites:

* guest tidak boleh dashboard
* UMKM boleh checkout
* creator boleh submit result
* admin boleh manage orders
* UMKM tidak boleh manage payment status
* creator tidak boleh complete order

## 10. Component Test Target

### 10.1 StatusBadge

Yang dites:

* pending tampil Menunggu
* paid tampil Dibayar
* in_progress tampil Diproses
* submitted tampil Hasil Dikirim
* revision_requested tampil Revisi
* completed tampil Selesai
* cancelled tampil Dibatalkan

### 10.2 PriceText

Yang dites:

* 300000 tampil sebagai Rupiah
* 0 tetap tampil valid
* angka besar tetap rapi

### 10.3 CreatorCard

Yang dites:

* nama kreator muncul
* niche muncul
* rating muncul
* harga mulai muncul
* tombol lihat detail muncul
* tidak ada istilah produk fisik

### 10.4 ServiceCard

Yang dites:

* nama layanan muncul
* harga muncul
* estimasi pengerjaan muncul
* jumlah revisi muncul
* tombol tambah ke keranjang muncul

### 10.5 OrderStatusTimeline

Yang dites:

* urutan status benar
* status aktif ditandai
* status selesai ditandai
* status revisi muncul jika ada
* tidak ada label shipping/delivery

### 10.6 PaymentSummaryCard

Yang dites:

* subtotal muncul
* add-on muncul jika ada
* biaya admin muncul
* total muncul
* status pembayaran muncul

## 11. E2E Test Scenario

### 11.1 Guest Browse Flow

Skenario:

1. Guest membuka homepage.
2. Guest klik katalog.
3. Guest melihat daftar kreator.
4. Guest membuka detail kreator.
5. Guest membuka detail layanan.

Expected:

* semua route terbuka
* CTA bekerja
* data tampil
* tidak 404

### 11.2 UMKM Happy Path

Skenario:

1. UMKM membuka katalog.
2. UMKM memilih paket jasa.
3. UMKM menambahkan ke cart.
4. UMKM membuka cart.
5. UMKM masuk checkout.
6. UMKM mengisi brief campaign.
7. UMKM membuat payment dummy.
8. Payment dummy berhasil.
9. UMKM membuka order detail.
10. UMKM melihat status order.

Expected:

* order dibuat
* payment status paid
* order status berubah
* timeline tampil

### 11.3 Creator Order Flow

Skenario:

1. Creator membuka dashboard.
2. Creator membuka order masuk.
3. Creator membuka detail order.
4. Creator membaca brief.
5. Creator menerima order.
6. Creator mulai pengerjaan.
7. Creator mengirim hasil dummy/link.

Expected:

* status berubah ke in_progress
* submission dibuat
* order menjadi submitted

### 11.4 Revision Flow

Skenario:

1. UMKM membuka hasil.
2. UMKM meminta revisi.
3. Creator melihat revisi.
4. Creator mengirim revisi.
5. UMKM menyelesaikan order.

Expected:

* revision dibuat
* order menjadi revision_requested
* order menjadi revised
* order menjadi completed

### 11.5 Review Flow

Skenario:

1. Order completed.
2. UMKM memberi review.
3. Review tampil di order.
4. Review tampil di creator detail.

Expected:

* review dibuat
* rating muncul
* hanya order completed yang bisa review

### 11.6 Admin Monitoring Flow

Skenario:

1. Admin membuka dashboard.
2. Admin membuka orders.
3. Admin membuka order detail.
4. Admin membuka payments.
5. Admin membuka complaints.
6. Admin membuka reports.

Expected:

* admin melihat ringkasan platform
* data order tampil
* data payment tampil
* laporan sederhana tampil

## 12. API Testing

### 12.1 `/api/health`

Expected:

```json
{
  "ok": true
}
```

### 12.2 `/api/checkout`

Testing:

* guest ditolak
* creator ditolak
* admin ditolak untuk checkout UMKM
* UMKM diterima
* cart kosong ditolak
* brief tidak lengkap ditolak
* total dihitung server

### 12.3 `/api/payments/create`

Testing:

* guest ditolak
* creator ditolak
* UMKM hanya untuk order sendiri
* order paid tidak bisa dibuat payment baru sembarangan
* total dari client tidak dipercaya
* response mengembalikan paymentId

### 12.4 `/api/payments/webhook`

Testing:

* signature salah ditolak
* amount mismatch ditolak
* duplicate webhook tidak merusak data
* status settlement menjadi paid
* status expire menjadi expired
* order status ikut berubah sesuai mapping

### 12.5 `/api/orders/[orderId]/status`

Testing:

* role tidak sesuai ditolak
* ownership tidak sesuai ditolak
* forbidden transition ditolak
* valid transition diterima
* status history dibuat

### 12.6 `/api/upload`

Testing:

* guest ditolak
* file besar ditolak
* extension dilarang ditolak
* upload ke bucket salah ditolak
* user tidak terkait order ditolak
* file private tidak public

## 13. Supabase RLS Testing

RLS harus diuji setelah database aktif.

### 13.1 Profiles

Test:

* user hanya melihat profile sendiri
* admin melihat semua profile
* guest tidak melihat profile private

### 13.2 UMKM Profiles

Test:

* UMKM membaca profil sendiri
* creator hanya membaca UMKM terkait order
* admin membaca semua

### 13.3 Creator Profiles

Test:

* public membaca creator aktif
* creator update profile sendiri
* creator tidak update profile creator lain
* admin manage semua

### 13.4 Orders

Test:

* UMKM A tidak bisa membaca order UMKM B
* creator A tidak bisa membaca order creator B
* admin bisa membaca semua order
* guest tidak bisa membaca order

### 13.5 Payments

Test:

* UMKM hanya melihat payment miliknya
* creator hanya melihat status payment terkait ordernya
* user biasa tidak bisa update payment
* admin/server bisa update sesuai aturan

### 13.6 Submissions

Test:

* creator upload untuk order miliknya
* creator tidak upload untuk order creator lain
* UMKM melihat submission order miliknya
* guest tidak bisa membaca submission

### 13.7 Reviews

Test:

* public hanya membaca review visible
* UMKM hanya review order completed miliknya
* creator tidak bisa menghapus review
* admin bisa moderation

## 14. Storage Testing

### 14.1 Public File

Test:

* avatar creator public bisa dibaca
* thumbnail portfolio public bisa dibaca
* public-assets bisa dibaca

### 14.2 Private File

Test:

* brief asset tidak bisa dibaca guest
* hasil konten tidak public
* invoice tidak public
* complaint file tidak public

### 14.3 Ownership File

Test:

* UMKM A tidak bisa membaca file order UMKM B
* creator A tidak bisa membaca file order creator B
* creator bisa membaca brief order assigned
* admin bisa membaca file untuk mediasi

### 14.4 Upload Validation

Test:

* exe ditolak
* file terlalu besar ditolak
* file tanpa login ditolak
* file dengan bucket salah ditolak
* video besar diarahkan ke link eksternal

## 15. Payment Testing

### 15.1 Dummy Payment

Test:

1. Buat order.
2. Payment pending.
3. Klik simulasi berhasil.
4. Payment paid.
5. Order status berubah.

Expected:

* payment_status: paid
* order_status: paid atau waiting_creator_confirmation
* order_status_history bertambah

### 15.2 Payment Failed

Test:

1. Payment pending.
2. Simulasikan gagal.

Expected:

* payment_status: failed
* order tidak diproses creator

### 15.3 Payment Expired

Test:

1. Payment pending.
2. Simulasikan expired.

Expected:

* payment_status: expired
* order tidak diproses
* user bisa membuat payment baru jika aturan mengizinkan

### 15.4 Midtrans Sandbox

Test:

* create transaction berhasil
* redirect URL atau Snap token muncul
* payment sandbox success
* webhook masuk
* status paid
* duplicate webhook aman
* invalid signature ditolak
* amount mismatch ditolak

### 15.5 Payment Security

Test:

* client tidak bisa mengirim `payment_status: paid`
* total pembayaran tidak percaya dari client
* server key tidak muncul di browser
* env secret tidak memakai prefix `NEXT_PUBLIC_`

## 16. Order Flow Testing

### 16.1 Happy Path

Flow:

1. Checkout.
2. Payment paid.
3. Creator accept.
4. Creator in progress.
5. Creator submit result.
6. UMKM complete.
7. UMKM review.

Expected:

* semua status benar
* timeline lengkap
* review muncul
* dashboard update

### 16.2 Revision Path

Flow:

1. Creator submit result.
2. UMKM request revision.
3. Creator submit revision.
4. UMKM complete.

Expected:

* revision record dibuat
* status berubah sesuai alur
* hasil revisi tampil

### 16.3 Cancel Before Payment

Flow:

1. Order awaiting_payment.
2. UMKM cancel.

Expected:

* order cancelled
* payment tidak paid
* tidak perlu refund

### 16.4 Complaint Path

Flow:

1. Order bermasalah.
2. UMKM/creator open complaint.
3. Admin review.
4. Admin resolve.

Expected:

* complaint status berubah
* admin note tersimpan
* activity log dibuat

## 17. Accessibility Testing

Checklist:

* setiap button punya label jelas
* link dapat dikenali
* heading berurutan
* input punya label
* error form terbaca
* focus state terlihat
* warna status tidak menjadi satu-satunya penanda
* kontras teks cukup
* ukuran tombol minimal nyaman ditekan
* modal/dialog bisa ditutup
* navigasi keyboard dasar berjalan

## 18. Performance Testing

### 18.1 Page Load

Yang dicek:

* homepage tidak terlalu berat
* katalog tidak render data terlalu banyak sekaligus
* gambar tidak full-size tanpa optimasi
* dashboard tidak memuat semua data besar sekaligus

### 18.2 Image Optimization

Yang dicek:

* avatar kecil
* portfolio thumbnail teroptimasi
* cover layanan tidak terlalu besar
* gunakan placeholder jika gambar belum siap

### 18.3 Bundle Awareness

Yang dicek:

* jangan semua komponen dibuat client component
* jangan import library besar di halaman yang tidak perlu
* jangan pakai chart berat sebelum dibutuhkan
* payment SDK hanya dimuat di halaman payment

## 19. Regression Testing

Regression test dilakukan setiap kali fitur besar selesai.

Wajib cek ulang:

* homepage
* katalog
* detail layanan
* cart
* checkout
* payment
* order detail
* dashboard UMKM
* dashboard creator
* dashboard admin
* status badge
* route utama
* build

Tujuan:

Memastikan fitur baru tidak merusak flow lama.

## 20. Manual QA Checklist

### 20.1 General

* semua route utama tidak 404
* tidak ada error console fatal
* tidak ada teks lorem ipsum
* tidak ada istilah barang fisik
* warna konsisten
* responsive aman
* navbar dan footer benar

### 20.2 Public

* hero jelas
* CTA berfungsi
* kategori layanan tampil
* cara kerja jelas
* katalog tampil
* detail kreator tampil
* detail layanan tampil

### 20.3 UMKM

* dashboard tampil
* cart tampil
* checkout brief tampil
* payment tampil
* order detail tampil
* hasil konten tampil
* revisi tampil
* review tampil

### 20.4 Creator

* dashboard tampil
* profil tampil
* layanan tampil
* order masuk tampil
* detail order tampil
* upload hasil placeholder tampil
* pendapatan dummy tampil

### 20.5 Admin

* dashboard tampil
* users tampil
* UMKM tampil
* creators tampil
* services tampil
* orders tampil
* payments tampil
* complaints tampil
* reports tampil

## 21. UAT Scenario

UAT atau User Acceptance Testing dilakukan untuk melihat apakah website mudah dipahami pengguna.

### 21.1 UAT untuk UMKM

Pertanyaan:

* Apakah UMKM langsung paham fungsi platform?
* Apakah UMKM paham cara mencari kreator?
* Apakah harga dan output layanan jelas?
* Apakah brief campaign mudah diisi?
* Apakah status pesanan mudah dipahami?
* Apakah tombol revisi dan selesai jelas?

### 21.2 UAT untuk Creator

Pertanyaan:

* Apakah creator paham cara mengatur profil?
* Apakah creator paham cara membuat paket layanan?
* Apakah order masuk mudah dibaca?
* Apakah brief campaign cukup jelas?
* Apakah tombol kirim hasil mudah ditemukan?

### 21.3 UAT untuk Admin

Pertanyaan:

* Apakah admin mudah memantau order?
* Apakah status payment terlihat jelas?
* Apakah komplain mudah ditemukan?
* Apakah laporan cukup informatif?
* Apakah admin action tidak membingungkan?

## 22. Bug Severity

Bug dibagi menjadi empat level.

### 22.1 Critical

Harus segera diperbaiki.

Contoh:

* build gagal
* route utama 404
* user bisa melihat data user lain
* payment status bisa dimanipulasi client
* file private public
* admin route terbuka untuk guest

### 22.2 High

Sangat penting diperbaiki.

Contoh:

* checkout gagal
* order status salah
* payment dummy tidak jalan
* creator tidak bisa melihat order
* UMKM tidak bisa melihat hasil
* dashboard role salah

### 22.3 Medium

Perlu diperbaiki.

Contoh:

* responsive kurang rapi
* filter tidak bekerja
* card overflow
* loading state tidak ada
* copywriting kurang jelas

### 22.4 Low

Kerapian.

Contoh:

* typo kecil
* spacing kurang konsisten
* icon kurang pas
* warna badge kurang halus

## 23. Bug Report Format

Format laporan bug:

```txt
Judul:
Route/Halaman:
Role:
Langkah Reproduksi:
Expected Result:
Actual Result:
Screenshot/Video:
Severity:
Catatan Tambahan:
```

Contoh:

```txt
Judul: UMKM bisa membuka dashboard admin
Route/Halaman: /admin/dashboard
Role: UMKM
Langkah Reproduksi:
1. Login sebagai UMKM
2. Buka /admin/dashboard
Expected Result:
User diarahkan ke /umkm/dashboard
Actual Result:
Dashboard admin terbuka
Severity:
Critical
Catatan:
Perlu route guard berdasarkan role
```

## 24. Definition of Done untuk Fitur

Satu fitur dianggap selesai jika:

1. Route tidak 404.
2. UI tampil rapi.
3. Responsive dasar aman.
4. Copywriting sesuai konteks jasa digital.
5. Tidak ada istilah barang fisik.
6. Data dummy masuk akal jika belum real.
7. Loading/empty/error state ada jika diperlukan.
8. TypeScript tidak error.
9. Build tidak error.
10. Role action sesuai permission.
11. Jika fitur order/payment, status flow sesuai dokumen.
12. Jika fitur file, access policy sesuai dokumen.
13. Tidak merusak fitur lain.

## 25. Pre-Commit Checklist

Sebelum commit:

```bash
npm run typecheck
npm run lint
npm run build
```

Cek manual:

* homepage
* katalog
* login
* dashboard UMKM
* dashboard creator
* dashboard admin
* payment dummy jika ada
* order detail jika ada

Pastikan:

* tidak commit `.env.local`
* tidak commit `.next`
* tidak commit `node_modules`
* tidak commit file tree besar
* tidak ada API key di source code

## 26. Pre-Deploy Checklist

Sebelum deploy ke Vercel:

1. `npm run build` berhasil.
2. Environment variables sudah benar.
3. `.env.local` tidak masuk repo.
4. Route utama tidak 404.
5. Metadata dasar ada.
6. UI responsive dasar aman.
7. No secret key di client.
8. Payment masih dummy/sandbox sesuai environment.
9. Supabase URL dan anon key benar jika sudah dipakai.
10. Domain belum wajib jika masih preview.

## 27. Test Data

Gunakan data dummy yang konsisten.

### 27.1 Dummy Creators

* Raka Visual
* Nabila Creative
* Dimas Review
* Sinta Studio
* Fadd Graphics
* Arkan Media

### 27.2 Dummy UMKM

* Bakso Mas Adi
* Kopi Sudut Kota
* Roti Lembut Pagi
* Batik Loka
* Keripik Bu Sari

### 27.3 Dummy Services

* Video TikTok/Reels
* Desain Feed Instagram
* Foto Produk
* Review Produk
* Caption Promosi
* Campaign UMKM

### 27.4 Dummy Order

Order:

* Order ID: RUK-2026-00124
* UMKM: Bakso Mas Adi
* Creator: Raka Visual
* Paket: Standard Video Reels/TikTok
* Total: Rp455.000
* Payment status: paid
* Order status: in_progress

## 28. Testing Roadmap

### 28.1 Stage 1 — Manual Route QA

* cek semua route
* cek layout
* cek responsive
* cek istilah UI

### 28.2 Stage 2 — Unit Test Utility

* fee calculation
* status mapping
* role permission
* file validation
* format currency

### 28.3 Stage 3 — Component Test

* card
* badge
* timeline
* payment summary
* checkout stepper
* empty state

### 28.4 Stage 4 — E2E Happy Path

* guest browse
* UMKM order
* creator submit result
* UMKM complete
* admin monitoring

### 28.5 Stage 5 — Supabase RLS Test

* ownership data
* role access
* storage access
* payment protection

### 28.6 Stage 6 — Payment Sandbox Test

* create transaction
* webhook
* status sync
* failed/expired/refund state

## 29. Risiko Testing

### 29.1 Testing Terlalu Fokus UI

Risiko:

Website terlihat bagus, tetapi flow transaksi salah.

Mitigasi:

Selalu uji core flow dari katalog sampai order selesai.

### 29.2 Testing Tidak Mengecek Role

Risiko:

User bisa membuka data atau halaman yang bukan miliknya.

Mitigasi:

Buat role test untuk Guest, UMKM, Creator, dan Admin.

### 29.3 Payment Dummy Terlalu Dipercaya

Risiko:

Tim lupa bahwa payment dummy bukan payment aman.

Mitigasi:

Pisahkan jelas dummy, sandbox, dan production.

### 29.4 File Private Terbuka

Risiko:

Hasil konten atau brief asset bisa dibaca publik.

Mitigasi:

Gunakan storage policy, RLS, signed URL, dan test akses negatif.

### 29.5 Tidak Ada Regression Test

Risiko:

Fitur baru merusak fitur lama.

Mitigasi:

Setiap selesai fitur besar, jalankan route QA dan build check.

## 30. Kesimpulan

Testing strategy Ruang Usaha Kita harus mengikuti karakter platform sebagai marketplace jasa digital. Pengujian tidak cukup hanya memastikan halaman tampil, tetapi harus memastikan alur bisnis, role permission, order status, payment status, file access, dan dashboard berjalan sesuai konsep.

Pada tahap awal, testing bisa dilakukan manual dan berbasis data dummy. Setelah fitur berkembang, unit test, component test, E2E test, RLS test, dan payment sandbox test perlu ditambahkan bertahap.

Dokumen ini menjadi standar sebelum melakukan coding besar, refactor, integrasi Supabase, integrasi Midtrans Sandbox, dan deployment ke Vercel.

