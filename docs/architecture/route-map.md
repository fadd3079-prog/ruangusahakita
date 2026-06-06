# Ruang Usaha Kita — Route Map

## 1. Tujuan Dokumen

Dokumen ini menjelaskan struktur route website Ruang Usaha Kita. Route map digunakan sebagai pedoman agar setiap halaman memiliki fungsi yang jelas, tidak tumpang tindih, dan sesuai dengan peran pengguna.

Website ini menggunakan Next.js App Router dengan route group. Route group digunakan untuk mengelompokkan halaman berdasarkan area penggunaan tanpa memengaruhi URL final.

Route group utama:

* `(public)` untuk halaman publik
* `(auth)` untuk autentikasi
* `(umkm)` untuk dashboard dan fitur UMKM
* `(creator)` untuk dashboard dan fitur content creator
* `(admin)` untuk dashboard dan fitur admin
* `api` untuk route backend/internal API

## 2. Prinsip Routing

Routing Ruang Usaha Kita mengikuti prinsip:

1. Public route dapat diakses tanpa login.
2. Auth route digunakan untuk login, register, dan proses autentikasi.
3. UMKM route hanya untuk pengguna dengan role UMKM.
4. Creator route hanya untuk pengguna dengan role creator.
5. Admin route hanya untuk pengguna dengan role admin.
6. API route digunakan untuk proses server-side seperti checkout, payment, webhook, upload, dan update status order.
7. Route harus memakai istilah jasa digital, bukan istilah toko barang fisik.
8. Route harus mudah dibaca dan sesuai bahasa bisnis platform.

## 3. Public Routes

Public routes adalah halaman yang dapat diakses semua pengunjung tanpa login.

### 3.1 `/`

File:

`src/app/(public)/page.tsx`

Nama halaman:

Beranda

Fungsi:

Halaman utama untuk memperkenalkan Ruang Usaha Kita. Halaman ini harus menjelaskan value proposition platform, yaitu membantu UMKM menemukan content creator untuk promosi digital.

Konten utama:

* hero section
* headline utama
* search entry ke katalog
* kategori layanan
* kreator unggulan
* cara kerja
* manfaat untuk UMKM
* ajakan daftar sebagai kreator
* CTA ke katalog

CTA utama:

* Cari Kreator
* Lihat Cara Kerja
* Daftar sebagai Kreator

Catatan:

Beranda harus memiliki visual paling kuat karena menjadi pintu masuk utama funnel pengguna.

### 3.2 `/katalog`

File:

`src/app/(public)/katalog/page.tsx`

Nama halaman:

Katalog Kreator

Fungsi:

Menampilkan daftar content creator, marketer, dan paket jasa yang tersedia di platform.

Fitur utama:

* search kreator
* filter kategori layanan
* filter lokasi
* filter niche
* filter harga
* filter rating
* sort by relevan/harga/rating
* creator card
* tombol lihat detail
* tombol tambah ke keranjang

Data yang ditampilkan pada kartu kreator:

* nama kreator
* foto/avatar
* niche
* layanan utama
* rating
* jumlah proyek selesai
* harga mulai
* estimasi pengerjaan
* lokasi atau mode online

Catatan:

Halaman ini berperan sebagai katalog e-commerce. Namun, isi katalog adalah jasa kreator, bukan produk fisik.

### 3.3 `/kreator/[creatorId]`

File:

`src/app/(public)/kreator/[creatorId]/page.tsx`

Nama halaman:

Detail Kreator

Fungsi:

Menampilkan profil lengkap content creator.

Konten utama:

* nama kreator
* foto profil
* niche
* lokasi
* rating
* jumlah proyek selesai
* bio singkat
* portofolio
* daftar paket jasa
* review
* tombol konsultasi
* tombol pilih paket

Catatan:

Halaman ini membantu UMKM menilai apakah kreator sesuai dengan kebutuhan promosi mereka.

### 3.4 `/layanan/[serviceId]`

File:

`src/app/(public)/layanan/[serviceId]/page.tsx`

Nama halaman:

Detail Paket Jasa

Fungsi:

Menampilkan detail spesifik dari satu paket jasa.

Konten utama:

* nama paket jasa
* nama kreator
* harga
* deskripsi
* output layanan
* estimasi pengerjaan
* jumlah revisi
* cocok untuk jenis UMKM apa
* portofolio terkait
* review
* tombol tambah ke keranjang
* tombol pesan sekarang

Contoh paket:

* Video TikTok/Reels Basic
* Desain Feed Instagram
* Foto Produk UMKM
* Review Produk Lokal
* Caption Promosi
* Campaign UMKM

Catatan:

Halaman ini setara dengan product detail page pada e-commerce, tetapi istilah yang digunakan harus tetap “paket jasa”.

### 3.5 `/cara-kerja`

File:

`src/app/(public)/cara-kerja/page.tsx`

Nama halaman:

Cara Kerja

Fungsi:

Menjelaskan alur kerja platform untuk UMKM dan kreator.

Alur UMKM:

1. Cari kreator.
2. Pilih paket jasa.
3. Isi brief campaign.
4. Lakukan pembayaran.
5. Pantau proses pembuatan konten.
6. Terima hasil.
7. Ajukan revisi jika perlu.
8. Selesaikan pesanan dan beri review.

Alur kreator:

1. Daftar sebagai kreator.
2. Lengkapi profil.
3. Buat paket layanan.
4. Terima order.
5. Baca brief.
6. Produksi konten.
7. Kirim hasil.
8. Tangani revisi.
9. Terima rating dan pendapatan.

### 3.6 `/bantuan`

File:

`src/app/(public)/bantuan/page.tsx`

Nama halaman:

Bantuan

Fungsi:

Menjawab pertanyaan umum pengguna.

Topik bantuan:

* apa itu Ruang Usaha Kita
* cara mencari kreator
* cara membuat pesanan
* cara mengisi brief
* cara pembayaran
* cara revisi
* cara menjadi kreator
* cara komplain
* ketentuan refund
* keamanan data

## 4. Auth Routes

Auth routes digunakan untuk masuk dan mendaftar.

### 4.1 `/login`

File:

`src/app/(auth)/login/page.tsx`

Nama halaman:

Login

Fungsi:

Mengizinkan pengguna masuk ke akun.

Input utama:

* email
* password
* role selector opsional
* tombol masuk
* link register
* link lupa password

Catatan:

Pada tahap awal, login dapat berupa dummy UI. Integrasi Supabase Auth dilakukan setelah layout stabil.

### 4.2 `/register`

File:

`src/app/(auth)/register/page.tsx`

Nama halaman:

Register

Fungsi:

Mengizinkan user membuat akun baru.

Pilihan role:

* UMKM
* Creator

Input dasar:

* nama lengkap
* email
* password
* nomor WhatsApp
* nama usaha atau nama kreator
* role

Catatan:

Admin tidak perlu register dari public page. Admin dibuat manual atau melalui seed database.

### 4.3 `/forgot-password`

File:

`src/app/(auth)/forgot-password/page.tsx`

Nama halaman:

Lupa Password

Fungsi:

Form untuk meminta reset password.

### 4.4 `/callback`

File:

`src/app/(auth)/callback/route.ts`

Fungsi:

Route callback untuk proses autentikasi Supabase atau OAuth.

Catatan:

Pada tahap awal, callback masih placeholder.

## 5. UMKM Routes

UMKM routes berada di path `/umkm`.

### 5.1 `/umkm/dashboard`

File:

`src/app/(umkm)/umkm/dashboard/page.tsx`

Nama halaman:

Dashboard UMKM

Fungsi:

Menampilkan ringkasan aktivitas UMKM.

Konten utama:

* pesanan aktif
* pesanan selesai
* brief tersimpan
* total pengeluaran
* status pesanan terbaru
* rekomendasi kreator
* notifikasi penting

### 5.2 `/umkm/cart`

File:

`src/app/(umkm)/umkm/cart/page.tsx`

Nama halaman:

Keranjang Layanan

Fungsi:

Menampilkan paket jasa yang akan dipesan.

Konten utama:

* paket jasa
* nama kreator
* harga paket
* estimasi pengerjaan
* add-on jika ada
* biaya admin
* total pembayaran
* tombol lanjut checkout

Catatan:

Tidak memakai quantity seperti barang fisik kecuali untuk kebutuhan khusus.

### 5.3 `/umkm/checkout`

File:

`src/app/(umkm)/umkm/checkout/page.tsx`

Nama halaman:

Checkout Brief Campaign

Fungsi:

Membuat pesanan dan mengisi brief campaign.

Field brief:

* nama usaha
* kategori usaha
* produk/jasa yang dipromosikan
* tujuan campaign
* target audiens
* platform konten
* gaya konten
* referensi konten
* deadline
* catatan tambahan
* aset pendukung

### 5.4 `/umkm/orders`

File:

`src/app/(umkm)/umkm/orders/page.tsx`

Nama halaman:

Pesanan Saya

Fungsi:

Menampilkan daftar semua pesanan milik UMKM.

Kolom tabel:

* order id
* kreator
* paket jasa
* status pembayaran
* status order
* deadline
* total
* aksi

### 5.5 `/umkm/orders/[orderId]`

File:

`src/app/(umkm)/umkm/orders/[orderId]/page.tsx`

Nama halaman:

Detail Pesanan

Fungsi:

Menampilkan detail satu pesanan.

Konten utama:

* informasi pesanan
* brief campaign
* status timeline
* status pembayaran
* hasil konten
* revisi
* tombol ajukan revisi
* tombol selesaikan pesanan
* review

### 5.6 `/umkm/payments/[paymentId]`

File:

`src/app/(umkm)/umkm/payments/[paymentId]/page.tsx`

Nama halaman:

Detail Pembayaran

Fungsi:

Menampilkan invoice dan status pembayaran.

Konten utama:

* invoice id
* order id
* total pembayaran
* metode pembayaran
* status pembayaran
* instruksi pembayaran
* batas waktu pembayaran
* tombol cek status

### 5.7 `/umkm/briefs`

File:

`src/app/(umkm)/umkm/briefs/page.tsx`

Nama halaman:

Brief Campaign

Fungsi:

Menampilkan draft atau riwayat brief campaign UMKM.

### 5.8 `/umkm/results`

File:

`src/app/(umkm)/umkm/results/page.tsx`

Nama halaman:

File Hasil Konten

Fungsi:

Menampilkan semua hasil konten yang pernah diterima UMKM.

Jenis hasil:

* video
* desain
* foto
* caption
* link unggahan
* dokumen campaign

### 5.9 `/umkm/settings`

File:

`src/app/(umkm)/umkm/settings/page.tsx`

Nama halaman:

Pengaturan UMKM

Fungsi:

Mengatur profil usaha, kontak, preferensi notifikasi, dan keamanan akun.

## 6. Creator Routes

Creator routes berada di path `/creator`.

### 6.1 `/creator/dashboard`

File:

`src/app/(creator)/creator/dashboard/page.tsx`

Nama halaman:

Dashboard Kreator

Fungsi:

Menampilkan ringkasan aktivitas kreator.

Konten utama:

* order aktif
* order selesai
* rating rata-rata
* estimasi pendapatan
* order masuk terbaru
* deadline terdekat
* review terbaru

### 6.2 `/creator/profile`

File:

`src/app/(creator)/creator/profile/page.tsx`

Nama halaman:

Profil Kreator

Fungsi:

Mengatur profil publik kreator.

Data profil:

* nama kreator
* bio
* lokasi
* niche
* platform sosial media
* kontak
* foto profil
* banner
* status aktif

### 6.3 `/creator/services`

File:

`src/app/(creator)/creator/services/page.tsx`

Nama halaman:

Paket Layanan

Fungsi:

Menampilkan daftar paket jasa milik kreator.

Data:

* nama paket
* kategori
* harga
* estimasi pengerjaan
* jumlah revisi
* status aktif/nonaktif

### 6.4 `/creator/services/new`

File:

`src/app/(creator)/creator/services/new/page.tsx`

Nama halaman:

Tambah Paket Layanan

Fungsi:

Form untuk membuat paket jasa baru.

### 6.5 `/creator/orders`

File:

`src/app/(creator)/creator/orders/page.tsx`

Nama halaman:

Order Masuk

Fungsi:

Menampilkan order yang diterima kreator.

Kolom:

* order id
* nama UMKM
* paket jasa
* deadline
* status
* aksi

### 6.6 `/creator/orders/[orderId]`

File:

`src/app/(creator)/creator/orders/[orderId]/page.tsx`

Nama halaman:

Detail Order

Fungsi:

Menampilkan detail order dari sisi kreator.

Konten:

* detail UMKM
* brief campaign
* deadline
* status pembayaran
* status order
* upload hasil
* revisi
* catatan admin

### 6.7 `/creator/portfolio`

File:

`src/app/(creator)/creator/portfolio/page.tsx`

Nama halaman:

Portofolio

Fungsi:

Mengelola contoh karya kreator.

Jenis portofolio:

* link video
* gambar desain
* foto produk
* link media sosial
* case study campaign

### 6.8 `/creator/earnings`

File:

`src/app/(creator)/creator/earnings/page.tsx`

Nama halaman:

Pendapatan

Fungsi:

Menampilkan ringkasan pendapatan kreator.

Catatan:

Untuk tahap MVP, payout otomatis belum perlu dibuat. Halaman ini cukup menjadi ringkasan dummy atau simulasi.

### 6.9 `/creator/settings`

File:

`src/app/(creator)/creator/settings/page.tsx`

Nama halaman:

Pengaturan Kreator

Fungsi:

Mengatur akun, notifikasi, profil, dan keamanan.

## 7. Admin Routes

Admin routes berada di path `/admin`.

### 7.1 `/admin/dashboard`

File:

`src/app/(admin)/admin/dashboard/page.tsx`

Nama halaman:

Dashboard Admin

Fungsi:

Menampilkan ringkasan seluruh aktivitas platform.

Metrik utama:

* total user
* total UMKM
* total kreator
* total order
* order aktif
* order selesai
* pembayaran pending
* komplain aktif
* pendapatan platform

### 7.2 `/admin/users`

File:

`src/app/(admin)/admin/users/page.tsx`

Nama halaman:

Manajemen User

Fungsi:

Mengelola semua user.

### 7.3 `/admin/umkm`

File:

`src/app/(admin)/admin/umkm/page.tsx`

Nama halaman:

Manajemen UMKM

Fungsi:

Melihat dan mengelola akun UMKM.

### 7.4 `/admin/creators`

File:

`src/app/(admin)/admin/creators/page.tsx`

Nama halaman:

Manajemen Kreator

Fungsi:

Melihat dan mengelola kreator.

### 7.5 `/admin/services`

File:

`src/app/(admin)/admin/services/page.tsx`

Nama halaman:

Manajemen Layanan

Fungsi:

Melihat dan memoderasi paket jasa kreator.

### 7.6 `/admin/orders`

File:

`src/app/(admin)/admin/orders/page.tsx`

Nama halaman:

Manajemen Pesanan

Fungsi:

Melihat semua pesanan platform.

### 7.7 `/admin/orders/[orderId]`

File:

`src/app/(admin)/admin/orders/[orderId]/page.tsx`

Nama halaman:

Detail Pesanan Admin

Fungsi:

Melihat detail pesanan untuk monitoring dan mediasi.

### 7.8 `/admin/payments`

File:

`src/app/(admin)/admin/payments/page.tsx`

Nama halaman:

Manajemen Pembayaran

Fungsi:

Melihat status pembayaran, invoice, payment gateway response, dan refund.

### 7.9 `/admin/complaints`

File:

`src/app/(admin)/admin/complaints/page.tsx`

Nama halaman:

Komplain dan Mediasi

Fungsi:

Menangani masalah antara UMKM dan kreator.

Jenis masalah:

* hasil tidak sesuai brief
* kreator terlambat
* UMKM meminta refund
* file tidak bisa diakses
* kesalahpahaman revisi

### 7.10 `/admin/reports`

File:

`src/app/(admin)/admin/reports/page.tsx`

Nama halaman:

Laporan Penjualan

Fungsi:

Menampilkan laporan penjualan, order, pendapatan, layanan terlaris, dan kreator aktif.

### 7.11 `/admin/settings`

File:

`src/app/(admin)/admin/settings/page.tsx`

Nama halaman:

Pengaturan Platform

Fungsi:

Mengatur konfigurasi platform.

Konfigurasi:

* biaya admin
* platform fee
* kategori layanan
* status order
* teks bantuan
* aturan revisi
* aturan refund

## 8. API Routes

API routes digunakan untuk proses server-side.

### 8.1 `/api/health`

File:

`src/app/api/health/route.ts`

Fungsi:

Mengecek apakah API aktif.

Response contoh:

```json
{
  "ok": true,
  "route": "health"
}
```

### 8.2 `/api/checkout`

File:

`src/app/api/checkout/route.ts`

Fungsi:

Membuat order dari cart dan brief campaign.

Tahap awal:

* validasi data checkout
* membuat order dummy
* mengembalikan order id

Tahap lanjutan:

* simpan ke Supabase
* validasi user role UMKM
* hitung biaya admin
* hitung platform fee
* buat invoice

### 8.3 `/api/payments/create`

File:

`src/app/api/payments/create/route.ts`

Fungsi:

Membuat transaksi pembayaran.

Tahap awal:

* dummy payment
* return payment id
* return payment URL dummy

Tahap lanjutan:

* integrasi Midtrans sandbox
* simpan transaction token
* simpan payment status pending

### 8.4 `/api/payments/webhook`

File:

`src/app/api/payments/webhook/route.ts`

Fungsi:

Menerima notifikasi payment gateway.

Catatan penting:

Webhook harus berjalan server-side. Payment server key tidak boleh berada di client.

### 8.5 `/api/orders/[orderId]/status`

File:

`src/app/api/orders/[orderId]/status/route.ts`

Fungsi:

Mengubah status order.

Contoh status:

* paid
* brief_accepted
* in_progress
* submitted
* revision_requested
* completed
* cancelled

### 8.6 `/api/orders/[orderId]/revision`

File:

`src/app/api/orders/[orderId]/revision/route.ts`

Fungsi:

Membuat permintaan revisi.

Data:

* order id
* catatan revisi
* file referensi
* user requester

### 8.7 `/api/upload`

File:

`src/app/api/upload/route.ts`

Fungsi:

Upload file atau membuat signed URL.

Tahap awal:

* placeholder upload

Tahap lanjutan:

* integrasi Supabase Storage
* validasi file size
* validasi file type
* simpan metadata file

## 9. Route Protection

Tahap awal belum memakai route protection real.

Tahap lanjutan:

* `/umkm/*` hanya untuk role UMKM
* `/creator/*` hanya untuk role creator
* `/admin/*` hanya untuk role admin
* public page tetap terbuka
* auth page redirect jika user sudah login

Proteksi dilakukan melalui:

* Supabase session
* middleware
* server-side guard
* database Row Level Security

## 10. Funnel Route

Funnel utama UMKM:

`/`
→ `/katalog`
→ `/kreator/[creatorId]` atau `/layanan/[serviceId]`
→ `/umkm/cart`
→ `/umkm/checkout`
→ `/umkm/payments/[paymentId]`
→ `/umkm/orders/[orderId]`
→ `/umkm/results`
→ review selesai

Funnel creator:

`/register`
→ pilih role creator
→ `/creator/profile`
→ `/creator/services/new`
→ `/creator/orders`
→ `/creator/orders/[orderId]`
→ upload hasil
→ revisi/selesai

Funnel admin:

`/admin/dashboard`
→ `/admin/orders`
→ `/admin/orders/[orderId]`
→ `/admin/payments` atau `/admin/complaints`
→ `/admin/reports`

## 11. Naming Rules

Gunakan istilah berikut secara konsisten:

| Gunakan              | Hindari           |
| -------------------- | ----------------- |
| paket jasa           | produk fisik      |
| kreator              | seller barang     |
| UMKM                 | customer barang   |
| brief campaign       | alamat pengiriman |
| hasil konten         | barang            |
| revisi               | retur barang      |
| status pesanan       | tracking resi     |
| ketersediaan kreator | stok              |
| file/link hasil      | paket kiriman     |
| pembayaran           | COD barang        |

## 12. Prioritas Route MVP

Route yang wajib diprioritaskan:

1. `/`
2. `/katalog`
3. `/kreator/[creatorId]`
4. `/layanan/[serviceId]`
5. `/login`
6. `/register`
7. `/umkm/cart`
8. `/umkm/checkout`
9. `/umkm/orders`
10. `/umkm/orders/[orderId]`
11. `/creator/dashboard`
12. `/creator/orders`
13. `/admin/dashboard`

Route lain boleh menjadi placeholder sampai core flow selesai.

## 13. Kesimpulan

Route map Ruang Usaha Kita dirancang untuk mendukung alur marketplace jasa digital yang lengkap. Struktur route tidak hanya menampilkan katalog, tetapi juga mendukung proses bisnis penuh: pencarian kreator, pemilihan paket jasa, checkout brief, pembayaran, monitoring order, pengiriman hasil konten, revisi, review, dan pelaporan.

Dengan route map ini, pengembangan dapat dilakukan bertahap tanpa kehilangan arah. Setiap halaman memiliki fungsi, role, dan posisi yang jelas dalam flow e-commerce jasa digital.
