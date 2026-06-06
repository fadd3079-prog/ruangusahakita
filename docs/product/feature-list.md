# Ruang Usaha Kita — Feature List

## 1. Tujuan Dokumen

Dokumen ini menjelaskan daftar fitur Ruang Usaha Kita secara lengkap dan terstruktur. Feature list ini digunakan sebagai pedoman sebelum proses coding dimulai agar pengembangan tidak melebar tanpa arah.

Ruang Usaha Kita adalah marketplace jasa digital yang menghubungkan UMKM dengan content creator atau marketer untuk kebutuhan promosi digital. Oleh karena itu, fitur website harus mengikuti konsep e-commerce, tetapi disesuaikan dengan karakter jasa digital.

Website ini bukan toko barang fisik. Fitur seperti stok barang, gudang, ongkir, kurir, nomor resi, packing, shipping, dan alamat pengiriman tidak digunakan. Konsep tersebut diganti dengan paket jasa, brief campaign, ketersediaan kreator, pengiriman hasil konten, revisi, approval, dan review.

Dokumen ini menggabungkan kebutuhan dari:

1. Konsep Ruang Usaha Kita sebagai marketplace jasa digital.
2. Materi Sales Management.
3. Materi alur proses e-commerce.
4. Referensi marketplace jasa seperti Upwork dan Fiverr.
5. Kebutuhan teknis website full-stack berbasis Next.js, Supabase, dan Vercel.
6. Kebutuhan UI/UX Apple-like yang clean, premium, dan mudah dipahami.

## 2. Prinsip Penentuan Fitur

Fitur Ruang Usaha Kita harus mengikuti prinsip berikut:

1. Mengutamakan alur utama UMKM.
2. Menampilkan pengalaman e-commerce yang jelas.
3. Mengadaptasi konsep e-commerce ke jasa digital.
4. Mendukung tiga role utama: UMKM, Creator, dan Admin.
5. Memiliki order management dari awal sampai selesai.
6. Memiliki payment flow yang aman dan terstruktur.
7. Memiliki review, revisi, dan komplain untuk membangun trust.
8. Memiliki dashboard yang mendukung sales management.
9. Tidak membangun fitur terlalu canggih sebelum MVP selesai.
10. Setiap fitur harus punya fungsi bisnis yang jelas.

## 3. Kategori Prioritas Fitur

Setiap fitur diberi prioritas:

| Prioritas | Makna                                                   |
| --------- | ------------------------------------------------------- |
| P0        | Wajib untuk MVP. Tanpa fitur ini alur utama tidak utuh. |
| P1        | Sangat penting, tetapi bisa dibuat setelah P0 stabil.   |
| P2        | Fitur pendukung yang meningkatkan pengalaman pengguna.  |
| P3        | Fitur lanjutan/roadmap, tidak wajib untuk MVP awal.     |

## 4. Role Pengguna

Website memiliki tiga role utama.

### 4.1 UMKM

UMKM adalah pengguna yang mencari dan membeli jasa promosi digital.

Kebutuhan utama:

* mencari kreator
* melihat paket jasa
* membandingkan harga
* mengisi brief campaign
* melakukan pembayaran
* memantau status pesanan
* menerima hasil konten
* meminta revisi
* memberi review

### 4.2 Creator

Creator adalah pengguna yang menyediakan jasa promosi digital.

Kebutuhan utama:

* membuat profil
* mengatur portofolio
* membuat paket layanan
* menerima order
* membaca brief campaign
* mengirim hasil konten
* menangani revisi
* melihat pendapatan
* melihat review

### 4.3 Admin

Admin adalah pengelola platform.

Kebutuhan utama:

* mengelola user
* mengelola UMKM
* mengelola creator
* memoderasi layanan
* memantau order
* memantau pembayaran
* menangani komplain
* melihat laporan
* mengatur konfigurasi platform

## 5. Modul Fitur Utama

Ruang Usaha Kita dibagi menjadi modul berikut:

1. Public Website
2. Auth dan User Role
3. UMKM Profile
4. Creator Profile
5. Catalog dan Search
6. Service Package
7. Portfolio
8. Cart
9. Checkout Brief
10. Payment
11. Order Management
12. Submission / Delivery Hasil Konten
13. Revision
14. Review dan Rating
15. Notification
16. Messaging / Communication
17. Promotion Management
18. Customer Relationship Management
19. Sales Analytics
20. Reporting System
21. Admin Management
22. File Storage
23. Security dan Access Control
24. AI dan Recommendation
25. UX Supporting Features

## 6. Public Website Features

Public website adalah bagian yang dapat diakses tanpa login.

### 6.1 Landing Page

Prioritas: P0
Role: Guest, UMKM, Creator
Route: `/`

Fungsi:

Landing page memperkenalkan Ruang Usaha Kita sebagai marketplace jasa digital untuk UMKM dan content creator.

Elemen fitur:

* navbar
* logo
* hero section
* headline utama
* deskripsi singkat
* CTA “Cari Kreator”
* CTA “Daftar sebagai Kreator”
* kategori layanan
* kreator unggulan
* cara kerja
* manfaat untuk UMKM
* manfaat untuk creator
* testimonial dummy
* FAQ preview
* footer

Kriteria:

* harus menjelaskan platform dalam 5–10 detik
* tidak memakai bahasa terlalu promosi
* tidak memakai istilah barang fisik
* visual harus clean dan premium

### 6.2 Public Navigation

Prioritas: P0
Role: Guest, UMKM, Creator
Route: global public layout

Fungsi:

Navigasi utama untuk halaman public.

Menu:

* Beranda
* Katalog Kreator
* Cara Kerja
* Bantuan
* Masuk
* Daftar

Kriteria:

* sticky top
* mobile responsive
* menggunakan sheet/drawer untuk mobile
* sederhana dan tidak penuh menu

### 6.3 Service Category Preview

Prioritas: P0
Role: Guest, UMKM
Route: `/`

Fungsi:

Menampilkan kategori layanan utama.

Kategori awal:

* Video TikTok/Reels
* Desain Feed Instagram
* Foto Produk
* Review Produk
* Caption Promosi
* Campaign UMKM

Kriteria:

* setiap kategori memiliki icon
* card tidak terlalu ramai
* mengarah ke katalog dengan filter kategori

### 6.4 How It Works Section

Prioritas: P0
Role: Guest, UMKM, Creator
Route: `/cara-kerja`

Fungsi:

Menjelaskan alur kerja platform.

Alur UMKM:

1. Cari kreator.
2. Pilih paket jasa.
3. Isi brief campaign.
4. Lakukan pembayaran.
5. Pantau proses konten.
6. Terima hasil.
7. Ajukan revisi jika perlu.
8. Beri review.

Alur Creator:

1. Daftar sebagai kreator.
2. Lengkapi profil.
3. Buat paket jasa.
4. Terima order.
5. Baca brief.
6. Produksi konten.
7. Kirim hasil.
8. Tangani revisi.
9. Terima rating.

### 6.5 FAQ / Bantuan Publik

Prioritas: P1
Role: Guest, UMKM, Creator
Route: `/bantuan`

Fungsi:

Menjawab pertanyaan umum pengguna.

Topik FAQ:

* apa itu Ruang Usaha Kita
* cara mencari kreator
* cara menjadi kreator
* cara memesan jasa
* cara mengisi brief
* cara pembayaran
* cara revisi
* cara komplain
* cara refund
* keamanan data

## 7. Auth dan User Role Features

### 7.1 Register

Prioritas: P0
Role: Guest
Route: `/register`

Fungsi:

Membuat akun baru.

Field:

* nama lengkap
* email
* password
* nomor WhatsApp
* role: UMKM atau Creator
* nama usaha jika UMKM
* nama brand/kreator jika Creator

Kriteria:

* role harus jelas sejak awal
* admin tidak register dari public page
* validasi form wajib
* tahap awal boleh dummy

### 7.2 Login

Prioritas: P0
Role: UMKM, Creator, Admin
Route: `/login`

Fungsi:

Masuk ke dashboard sesuai role.

Field:

* email
* password

Output:

* UMKM diarahkan ke `/umkm/dashboard`
* Creator diarahkan ke `/creator/dashboard`
* Admin diarahkan ke `/admin/dashboard`

Tahap awal:

* login boleh dummy
* integrasi Supabase Auth dilakukan setelah UI stabil

### 7.3 Forgot Password

Prioritas: P1
Role: Registered user
Route: `/forgot-password`

Fungsi:

Reset password.

Tahap awal:

* UI placeholder

Tahap lanjutan:

* Supabase password reset

### 7.4 Role Guard

Prioritas: P1
Role: System
Area: middleware/server guard

Fungsi:

Membatasi akses berdasarkan role.

Aturan:

* `/umkm/*` hanya UMKM
* `/creator/*` hanya Creator
* `/admin/*` hanya Admin
* public page terbuka
* auth page redirect jika sudah login

Tahap awal:

* belum wajib real

Tahap lanjutan:

* middleware dan Supabase session

## 8. UMKM Profile Features

### 8.1 UMKM Profile

Prioritas: P1
Role: UMKM
Route: `/umkm/settings`

Fungsi:

Menyimpan profil usaha UMKM.

Field:

* nama usaha
* pemilik usaha
* kategori usaha
* deskripsi usaha
* lokasi
* nomor WhatsApp
* email
* logo usaha
* sosial media
* target audiens umum
* preferensi konten

Manfaat:

Profil UMKM membantu kreator memahami konteks usaha saat mengerjakan brief.

### 8.2 Business Identity Assets

Prioritas: P2
Role: UMKM
Route: `/umkm/settings` atau `/umkm/briefs`

Fungsi:

Menyimpan aset dasar usaha.

Aset:

* logo
* foto produk
* brand color
* contoh konten lama
* link Instagram/TikTok
* guideline sederhana

Tahap awal:

* upload placeholder

Tahap lanjutan:

* Supabase Storage

## 9. Creator Profile Features

### 9.1 Creator Public Profile

Prioritas: P0
Role: Guest, UMKM, Creator
Route: `/kreator/[creatorId]`

Fungsi:

Menampilkan profil publik kreator.

Data:

* nama kreator
* avatar/foto
* lokasi
* niche
* bio
* rating
* jumlah proyek selesai
* response time dummy
* portofolio
* paket jasa
* review
* tombol konsultasi
* tombol pilih layanan

Kriteria:

* harus membangun trust
* harga dan output harus jelas
* jangan terlalu banyak teks

### 9.2 Creator Profile Management

Prioritas: P1
Role: Creator
Route: `/creator/profile`

Fungsi:

Creator mengatur profil publik.

Field:

* nama kreator
* bio
* lokasi
* niche
* platform sosial media
* foto profil
* banner
* skill tags
* status availability
* kontak

### 9.3 Creator Availability

Prioritas: P1
Role: Creator, UMKM
Area: creator profile, catalog

Fungsi:

Mengganti konsep inventory pada e-commerce barang.

Status availability:

* tersedia
* jadwal terbatas
* sedang penuh
* tidak menerima order

Kriteria:

* tidak memakai istilah stok
* dipakai untuk memberi sinyal kapasitas kreator

## 10. Catalog dan Search Features

### 10.1 Creator Catalog

Prioritas: P0
Role: Guest, UMKM
Route: `/katalog`

Fungsi:

Menampilkan daftar kreator dan layanan.

Komponen:

* search bar
* filter sidebar
* sort
* creator grid
* creator card
* empty state
* pagination atau load more

### 10.2 Search Creator

Prioritas: P0
Role: Guest, UMKM
Route: `/katalog`

Fungsi:

Mencari kreator berdasarkan nama, layanan, atau kategori.

Placeholder:

“Cari kreator, layanan, atau kategori”

Tahap awal:

* search UI dummy atau filter data dummy

Tahap lanjutan:

* query Supabase

### 10.3 Catalog Filter

Prioritas: P0
Role: Guest, UMKM
Route: `/katalog`

Filter:

* kategori layanan
* lokasi
* harga
* rating
* niche
* estimasi pengerjaan
* availability

Contoh kategori:

* Video pendek
* Desain feed
* Foto produk
* Review produk
* Caption
* Campaign

Contoh niche:

* Kuliner
* Fashion
* Beauty
* Edukasi
* Lifestyle
* Produk lokal

### 10.4 Sorting

Prioritas: P1
Role: Guest, UMKM
Route: `/katalog`

Sort:

* paling relevan
* harga terendah
* rating tertinggi
* proyek terbanyak
* estimasi tercepat

### 10.5 Creator Card

Prioritas: P0
Role: Guest, UMKM
Area: catalog, homepage

Isi card:

* avatar
* nama kreator
* niche
* layanan utama
* rating
* jumlah proyek selesai
* harga mulai
* estimasi pengerjaan
* badge availability
* tombol lihat detail
* tombol tambah ke keranjang

## 11. Service Package Features

### 11.1 Service Detail

Prioritas: P0
Role: Guest, UMKM
Route: `/layanan/[serviceId]`

Fungsi:

Menampilkan detail paket jasa.

Data:

* nama layanan
* nama kreator
* kategori
* harga
* deskripsi
* output layanan
* estimasi pengerjaan
* jumlah revisi
* cocok untuk siapa
* syarat brief
* portofolio terkait
* review
* CTA tambah ke keranjang
* CTA pesan sekarang

### 11.2 Package Tiers

Prioritas: P0
Role: UMKM, Creator
Area: service detail, creator services

Fungsi:

Menyediakan pilihan paket seperti Basic, Standard, Premium.

Contoh:

| Paket    | Isi                                                                     |     Harga |
| -------- | ----------------------------------------------------------------------- | --------: |
| Basic    | 1 video pendek, 1 caption, 1 revisi                                     | Rp150.000 |
| Standard | 2 video pendek, 2 caption, konsep campaign sederhana, 1 revisi          | Rp300.000 |
| Premium  | 3 video pendek, 3 caption, konsep campaign, laporan sederhana, 2 revisi | Rp500.000 |

Kriteria:

* setiap paket memiliki scope jelas
* harga jelas
* revisi jelas
* estimasi pengerjaan jelas

### 11.3 Service Package Management

Prioritas: P1
Role: Creator
Route: `/creator/services`

Fungsi:

Creator mengelola paket jasa.

Aksi:

* tambah paket
* edit paket
* aktif/nonaktif paket
* hapus paket
* preview paket

Field:

* nama paket
* kategori layanan
* deskripsi
* harga
* estimasi pengerjaan
* jumlah revisi
* output layanan
* syarat brief
* add-on

### 11.4 Add-on Services

Prioritas: P2
Role: UMKM, Creator
Area: cart, checkout, order

Fungsi:

Menambahkan layanan ekstra.

Contoh add-on:

* revisi tambahan
* caption tambahan
* file mentah
* konsep campaign tambahan
* upload lebih cepat
* bantuan brief campaign

Catatan:

Add-on harus digunakan secukupnya agar tidak membuat checkout membingungkan.

### 11.5 Custom Offer

Prioritas: P3
Role: UMKM, Creator
Area: message/order

Fungsi:

Creator dapat membuat penawaran khusus berdasarkan kebutuhan UMKM.

Use case:

* kebutuhan tidak cocok dengan paket standar
* campaign lebih kompleks
* durasi kerja lebih panjang
* output lebih banyak

Tahap MVP:

* belum perlu real

Tahap lanjutan:

* creator membuat custom price, custom scope, custom deadline

## 12. Portfolio Features

### 12.1 Portfolio Preview

Prioritas: P0
Role: Guest, UMKM
Area: creator detail, service detail

Fungsi:

Menampilkan contoh karya kreator.

Jenis:

* thumbnail video
* desain feed
* foto produk
* link TikTok
* link Instagram
* case study singkat

### 12.2 Portfolio Management

Prioritas: P1
Role: Creator
Route: `/creator/portfolio`

Fungsi:

Creator mengelola portofolio.

Aksi:

* tambah portofolio
* edit portofolio
* hapus portofolio
* tandai featured
* tambah link eksternal

Field:

* judul karya
* kategori
* deskripsi singkat
* thumbnail
* link hasil
* tahun/bulan
* client type dummy

### 12.3 Portfolio Verification

Prioritas: P3
Role: Admin
Area: admin creator management

Fungsi:

Admin memvalidasi portofolio agar tidak palsu atau melanggar hak cipta.

Tahap MVP:

* belum perlu real

## 13. Cart Features

### 13.1 Cart Page

Prioritas: P0
Role: UMKM
Route: `/umkm/cart`

Fungsi:

Menampilkan paket jasa yang dipilih.

Isi:

* nama paket
* nama kreator
* harga
* estimasi pengerjaan
* jumlah revisi
* output
* add-on
* biaya admin
* total pembayaran
* tombol lanjut checkout

### 13.2 Add to Cart

Prioritas: P0
Role: UMKM
Area: catalog, detail service

Fungsi:

Menambahkan paket jasa ke keranjang.

Catatan:

Quantity tidak ditonjolkan. Untuk jasa digital, satu order biasanya satu scope kerja.

### 13.3 Remove from Cart

Prioritas: P0
Role: UMKM
Area: cart

Fungsi:

Menghapus layanan dari keranjang.

### 13.4 Cart Summary

Prioritas: P0
Role: UMKM
Area: cart

Komponen:

* subtotal layanan
* biaya admin
* add-on
* total pembayaran
* CTA checkout

## 14. Checkout Brief Features

### 14.1 Checkout Stepper

Prioritas: P0
Role: UMKM
Route: `/umkm/checkout`

Fungsi:

Menampilkan langkah checkout.

Stepper:

1. Detail Pesanan
2. Brief Campaign
3. Pembayaran

### 14.2 Campaign Brief Form

Prioritas: P0
Role: UMKM
Route: `/umkm/checkout`

Field:

* nama usaha
* kategori usaha
* produk/jasa yang ingin dipromosikan
* tujuan campaign
* target audiens
* platform konten
* gaya konten
* referensi konten
* deadline
* catatan tambahan
* upload aset pendukung placeholder

### 14.3 Brief Validation

Prioritas: P1
Role: UMKM
Area: checkout

Fungsi:

Memastikan brief tidak kosong atau terlalu ambigu.

Validasi minimal:

* nama usaha wajib
* kategori usaha wajib
* produk/jasa wajib
* tujuan campaign wajib
* deadline wajib
* platform konten wajib

### 14.4 Brief Template

Prioritas: P2
Role: UMKM
Area: checkout, briefs

Fungsi:

Menyediakan template brief agar UMKM tidak bingung.

Contoh template:

* promosi produk makanan
* launching produk baru
* promo diskon
* konten awareness
* review produk

## 15. Payment Features

### 15.1 Payment Summary

Prioritas: P0
Role: UMKM
Route: `/umkm/payments/[paymentId]`

Fungsi:

Menampilkan ringkasan pembayaran.

Data:

* order id
* paket jasa
* nama kreator
* harga layanan
* biaya admin
* platform fee jika ditampilkan
* add-on
* total pembayaran
* status pembayaran

### 15.2 Dummy Payment Method

Prioritas: P0
Role: UMKM
Area: checkout/payment

Metode dummy:

* transfer bank
* QRIS
* e-wallet
* virtual account

Catatan:

Pada MVP, payment boleh dummy agar flow selesai dulu.

### 15.3 Invoice

Prioritas: P1
Role: UMKM, Admin
Area: payment, orders

Fungsi:

Mencatat bukti transaksi.

Data invoice:

* invoice id
* order id
* tanggal
* nama UMKM
* nama kreator
* layanan
* subtotal
* biaya admin
* total
* status pembayaran

### 15.4 Payment Verification

Prioritas: P1
Role: System, Admin
Area: payment

Fungsi:

Mengubah status pembayaran.

Tahap awal:

* manual dummy

Tahap lanjutan:

* webhook payment gateway

### 15.5 Payment Gateway Integration

Prioritas: P2
Role: System
Area: API

Fungsi:

Integrasi Midtrans sandbox atau payment gateway lain.

Endpoint:

* `/api/payments/create`
* `/api/payments/webhook`

Catatan keamanan:

* server key tidak boleh berada di client
* webhook harus divalidasi
* payment status tidak boleh diubah langsung oleh user

### 15.6 Refund

Prioritas: P2
Role: UMKM, Admin
Area: order, payment, complaints

Fungsi:

Menangani pengembalian dana sebagian atau penuh.

Use case:

* creator tidak mengerjakan
* hasil tidak sesuai brief
* order dibatalkan sebelum produksi
* kesalahan pembayaran

Tahap awal:

* UI dan status placeholder

### 15.7 Platform Fee

Prioritas: P1
Role: System, Admin
Area: payment, reports

Fungsi:

Menghitung pendapatan platform.

Komponen:

* komisi/platform fee
* biaya admin
* add-on fee jika ada

Catatan:

Nilai platform fee dapat diatur admin.

## 16. Order Management Features

### 16.1 Create Order

Prioritas: P0
Role: UMKM
Area: checkout

Fungsi:

Membuat order dari cart dan brief.

Data:

* order id
* UMKM id
* creator id
* service id
* package id
* brief id
* total amount
* payment status
* order status
* deadline

### 16.2 Order List UMKM

Prioritas: P0
Role: UMKM
Route: `/umkm/orders`

Fungsi:

Menampilkan daftar pesanan milik UMKM.

Kolom:

* order id
* kreator
* paket jasa
* status order
* status pembayaran
* deadline
* total
* aksi

### 16.3 Order List Creator

Prioritas: P0
Role: Creator
Route: `/creator/orders`

Fungsi:

Menampilkan order yang masuk ke kreator.

Kolom:

* order id
* nama UMKM
* paket jasa
* deadline
* status
* aksi

### 16.4 Order Detail

Prioritas: P0
Role: UMKM, Creator, Admin
Route:

* `/umkm/orders/[orderId]`
* `/creator/orders/[orderId]`
* `/admin/orders/[orderId]`

Fungsi:

Menampilkan detail order.

Konten:

* informasi order
* data UMKM
* data creator
* detail paket jasa
* brief campaign
* payment status
* order timeline
* hasil konten
* revisi
* review
* catatan admin

### 16.5 Order Status Timeline

Prioritas: P0
Role: UMKM, Creator, Admin
Area: order detail

Status:

* draft
* awaiting_payment
* paid
* waiting_creator_confirmation
* brief_accepted
* in_progress
* submitted
* revision_requested
* revised
* completed
* cancelled
* refunded

Label UI:

* Draft
* Menunggu Pembayaran
* Dibayar
* Menunggu Konfirmasi Kreator
* Brief Diterima
* Konten Diproduksi
* Hasil Dikirim
* Revisi Diminta
* Revisi Dikirim
* Selesai
* Dibatalkan
* Refund

### 16.6 Creator Accept Order

Prioritas: P1
Role: Creator
Area: order detail

Fungsi:

Creator menerima order setelah pembayaran berhasil.

Status berubah:

paid → brief_accepted atau waiting_creator_confirmation → brief_accepted

### 16.7 Creator Reject Order

Prioritas: P2
Role: Creator
Area: order detail

Fungsi:

Creator menolak order jika tidak sesuai scope atau jadwal.

Dampak:

* order masuk status cancelled atau perlu admin review
* refund bisa diproses

### 16.8 Deadline Tracking

Prioritas: P1
Role: UMKM, Creator, Admin
Area: order

Fungsi:

Menampilkan batas waktu pengerjaan.

Kriteria:

* deadline jelas
* status terlambat bisa ditandai
* tidak memakai istilah pengiriman paket

### 16.9 Order Cancellation

Prioritas: P2
Role: UMKM, Creator, Admin
Area: order

Fungsi:

Membatalkan pesanan dengan aturan tertentu.

Use case:

* belum dibayar
* creator tidak merespons
* brief tidak sesuai
* kesepakatan dibatalkan
* admin mediasi

## 17. Submission / Digital Delivery Features

### 17.1 Submit Result

Prioritas: P0
Role: Creator
Route: `/creator/orders/[orderId]`

Fungsi:

Creator mengirim hasil konten.

Jenis hasil:

* file video
* file desain
* file foto
* caption
* link Google Drive
* link TikTok/Instagram
* link unggahan publik

Tahap awal:

* form input link dan placeholder upload

### 17.2 View Result

Prioritas: P0
Role: UMKM
Route: `/umkm/orders/[orderId]`, `/umkm/results`

Fungsi:

UMKM melihat hasil pekerjaan.

Aksi:

* lihat file/link
* baca caption
* download file
* ajukan revisi
* setujui hasil

### 17.3 Result History

Prioritas: P1
Role: UMKM, Creator
Area: order detail

Fungsi:

Mencatat riwayat hasil yang pernah dikirim.

Use case:

* draft awal
* hasil revisi
* hasil final

## 18. Revision Features

### 18.1 Request Revision

Prioritas: P0
Role: UMKM
Route: `/umkm/orders/[orderId]`

Fungsi:

UMKM meminta perbaikan hasil.

Field:

* catatan revisi
* bagian yang perlu diperbaiki
* file referensi opsional
* deadline revisi opsional

### 18.2 Revision Status

Prioritas: P0
Role: UMKM, Creator
Area: order detail

Status:

* revision_requested
* revised
* submitted
* completed

### 18.3 Creator Submit Revision

Prioritas: P0
Role: Creator
Route: `/creator/orders/[orderId]`

Fungsi:

Creator mengirim hasil revisi.

### 18.4 Revision Limit

Prioritas: P1
Role: System
Area: service package, order

Fungsi:

Membatasi jumlah revisi berdasarkan paket.

Contoh:

* Basic: 1 revisi
* Standard: 1 revisi
* Premium: 2 revisi

### 18.5 Extra Revision Add-on

Prioritas: P2
Role: UMKM, Creator
Area: order

Fungsi:

UMKM membeli revisi tambahan jika melebihi scope.

## 19. Review dan Rating Features

### 19.1 Submit Review

Prioritas: P0
Role: UMKM
Area: completed order

Fungsi:

UMKM memberi rating dan ulasan setelah pesanan selesai.

Field:

* rating bintang
* komentar
* kualitas hasil
* komunikasi
* ketepatan waktu
* kesesuaian brief

### 19.2 Display Review

Prioritas: P0
Role: Guest, UMKM, Creator
Area: creator detail, service detail

Fungsi:

Menampilkan review untuk membangun trust.

### 19.3 Review Moderation

Prioritas: P2
Role: Admin
Area: admin reviews

Fungsi:

Admin dapat menyembunyikan review yang melanggar aturan.

### 19.4 Rating Calculation

Prioritas: P1
Role: System
Area: creator profile

Fungsi:

Menghitung rating rata-rata kreator.

Kriteria:

* berdasarkan order selesai
* review hanya bisa dari UMKM yang pernah order
* rating palsu harus dicegah pada tahap lanjutan

## 20. Notification Features

### 20.1 In-App Notification

Prioritas: P1
Role: UMKM, Creator, Admin
Area: dashboard

Fungsi:

Memberi notifikasi dalam aplikasi.

Contoh notifikasi UMKM:

* pembayaran berhasil
* brief diterima
* hasil konten dikirim
* revisi selesai
* pesanan selesai

Contoh notifikasi Creator:

* order baru masuk
* brief baru diterima
* revisi diminta
* pesanan selesai

Contoh notifikasi Admin:

* pembayaran pending
* komplain baru
* order terlambat

### 20.2 Email Notification

Prioritas: P2
Role: UMKM, Creator
Area: system

Fungsi:

Mengirim email untuk aktivitas penting.

Tahap awal:

* belum perlu real

Tahap lanjutan:

* pakai Resend

### 20.3 WhatsApp Shortcut

Prioritas: P2
Role: UMKM, Creator
Area: order detail

Fungsi:

Tombol menuju WhatsApp manual.

Catatan:

Bukan WhatsApp API otomatis pada MVP awal.

## 21. Messaging / Communication Features

### 21.1 Order Comment Thread

Prioritas: P2
Role: UMKM, Creator, Admin
Area: order detail

Fungsi:

Komentar sederhana dalam order.

Use case:

* klarifikasi brief
* konfirmasi revisi
* catatan tambahan
* admin mediation

### 21.2 Direct Chat

Prioritas: P3
Role: UMKM, Creator
Area: platform

Fungsi:

Chat real-time.

Catatan:

Tidak masuk MVP awal karena kompleksitas tinggi.

## 22. Promotion Management Features

### 22.1 Featured Creator

Prioritas: P1
Role: Admin
Area: homepage, catalog

Fungsi:

Menampilkan kreator unggulan.

Use case:

* kreator terbaik
* kreator baru
* kreator dengan rating tinggi
* kreator dari niche tertentu

### 22.2 Promo Banner

Prioritas: P2
Role: Admin
Area: homepage

Fungsi:

Menampilkan campaign promosi platform.

Contoh:

* Promo UMKM Baru
* Paket Konten Bulanan
* Kreator Lokal Pilihan

### 22.3 Voucher

Prioritas: P3
Role: UMKM, Admin
Area: checkout

Fungsi:

Potongan biaya admin atau potongan layanan.

Catatan:

Tidak masuk MVP awal.

### 22.4 Referral

Prioritas: P3
Role: UMKM, Creator
Area: account

Fungsi:

Mengajak user baru melalui referral.

Catatan:

Roadmap.

## 23. Customer Relationship Management Features

### 23.1 Favorite Creator

Prioritas: P2
Role: UMKM
Area: catalog, creator detail

Fungsi:

UMKM menyimpan kreator favorit.

### 23.2 Repeat Order

Prioritas: P2
Role: UMKM
Area: order history

Fungsi:

UMKM memesan ulang layanan yang pernah digunakan.

### 23.3 Brief History

Prioritas: P1
Role: UMKM
Route: `/umkm/briefs`

Fungsi:

Menyimpan riwayat brief.

Manfaat:

* UMKM bisa memakai ulang brief
* creator dapat memahami histori campaign
* platform dapat menganalisis kebutuhan UMKM

### 23.4 Customer Segmentation

Prioritas: P3
Role: Admin
Area: admin reports

Fungsi:

Mengelompokkan UMKM berdasarkan kategori usaha, frekuensi order, dan nilai transaksi.

## 24. Sales Analytics Features

### 24.1 Dashboard Metrics

Prioritas: P1
Role: Admin
Route: `/admin/dashboard`

Metrik:

* total user
* total UMKM
* total kreator
* total order
* order aktif
* order selesai
* pembayaran pending
* komplain aktif
* pendapatan platform dummy

### 24.2 Order Analytics

Prioritas: P1
Role: Admin
Route: `/admin/reports`

Data:

* order per bulan
* order berdasarkan status
* layanan terlaris
* kategori terlaris
* kreator paling aktif
* UMKM aktif

### 24.3 Revenue Analytics

Prioritas: P2
Role: Admin
Area: reports

Data:

* gross transaction value
* platform fee
* admin fee
* refund
* pendapatan bersih platform

### 24.4 Funnel Analytics

Prioritas: P3
Role: Admin
Area: analytics

Funnel:

* view landing
* search catalog
* view service detail
* add to cart
* start checkout
* submit brief
* payment started
* payment completed
* order completed

Catatan:

Funnel analytics bisa memakai PostHog pada tahap lanjutan.

## 25. Reporting System Features

### 25.1 Order Report

Prioritas: P1
Role: Admin
Route: `/admin/reports`

Isi:

* total order
* order selesai
* order aktif
* order revisi
* order dibatalkan
* order refund

### 25.2 Payment Report

Prioritas: P2
Role: Admin
Route: `/admin/payments`

Isi:

* total pembayaran
* pending payment
* paid payment
* failed payment
* refund payment
* platform fee
* admin fee

### 25.3 Creator Report

Prioritas: P2
Role: Admin
Area: reports

Isi:

* kreator aktif
* kreator dengan order terbanyak
* rating tertinggi
* order terlambat
* komplain per kreator

### 25.4 Export Report

Prioritas: P3
Role: Admin
Area: reports

Format:

* CSV
* Excel
* PDF

Catatan:

Tidak masuk MVP awal.

## 26. Admin Management Features

### 26.1 Admin Dashboard

Prioritas: P0
Role: Admin
Route: `/admin/dashboard`

Fungsi:

Ringkasan operasional platform.

### 26.2 User Management

Prioritas: P1
Role: Admin
Route: `/admin/users`

Fungsi:

Mengelola semua user.

Aksi:

* lihat user
* filter role
* aktif/nonaktif user
* lihat detail user

### 26.3 UMKM Management

Prioritas: P1
Role: Admin
Route: `/admin/umkm`

Fungsi:

Mengelola akun UMKM.

### 26.4 Creator Management

Prioritas: P1
Role: Admin
Route: `/admin/creators`

Fungsi:

Mengelola akun kreator.

Aksi:

* lihat kreator
* validasi profil
* tandai featured
* aktif/nonaktif
* lihat review

### 26.5 Service Moderation

Prioritas: P1
Role: Admin
Route: `/admin/services`

Fungsi:

Memoderasi paket jasa.

Use case:

* layanan tidak jelas
* harga tidak wajar
* deskripsi melanggar aturan
* portofolio tidak sesuai

### 26.6 Order Monitoring

Prioritas: P0
Role: Admin
Route: `/admin/orders`

Fungsi:

Memantau seluruh order.

### 26.7 Payment Monitoring

Prioritas: P1
Role: Admin
Route: `/admin/payments`

Fungsi:

Memantau pembayaran dan invoice.

### 26.8 Complaint Management

Prioritas: P1
Role: Admin
Route: `/admin/complaints`

Fungsi:

Menangani sengketa antara UMKM dan creator.

Jenis komplain:

* hasil tidak sesuai brief
* revisi tidak selesai
* creator terlambat
* UMKM tidak merespons
* file tidak bisa dibuka
* permintaan refund

### 26.9 Platform Settings

Prioritas: P2
Role: Admin
Route: `/admin/settings`

Pengaturan:

* biaya admin
* persentase platform fee
* kategori layanan
* status order
* aturan revisi
* aturan refund
* featured creator

## 27. File Storage Features

### 27.1 Avatar Upload

Prioritas: P1
Role: UMKM, Creator
Area: profile

Fungsi:

Upload foto profil.

### 27.2 Portfolio Upload

Prioritas: P1
Role: Creator
Area: portfolio

Fungsi:

Upload thumbnail portofolio.

### 27.3 Brief Asset Upload

Prioritas: P2
Role: UMKM
Area: checkout

Fungsi:

Upload aset pendukung brief.

Contoh:

* logo
* foto produk
* contoh konten
* brand guideline sederhana

### 27.4 Submission Upload

Prioritas: P2
Role: Creator
Area: order detail

Fungsi:

Upload hasil konten.

Catatan:

Untuk MVP awal, lebih aman menggunakan link file daripada upload video besar.

### 27.5 File Size Limit

Prioritas: P2
Role: System
Area: upload

Fungsi:

Membatasi ukuran file.

Contoh batas awal:

* gambar: 5 MB
* dokumen: 10 MB
* video: gunakan link eksternal dulu

## 28. Security dan Access Control Features

### 28.1 Row Level Security Planning

Prioritas: P1
Role: System
Area: Supabase

Fungsi:

Membatasi akses data berdasarkan role.

Aturan:

* UMKM hanya melihat order miliknya
* Creator hanya melihat order yang ditujukan kepadanya
* Admin dapat melihat semua data
* Payment status tidak bisa diubah user biasa
* Review hanya bisa dibuat oleh UMKM yang menyelesaikan order

### 28.2 Server-Side Payment Protection

Prioritas: P1
Role: System
Area: API

Fungsi:

Menjaga payment key tidak bocor.

Aturan:

* server key tidak masuk client component
* create payment berjalan di API route
* webhook berjalan di API route
* status pembayaran diubah oleh server/admin

### 28.3 Input Validation

Prioritas: P0
Role: System
Area: forms

Fungsi:

Memvalidasi input user.

Tools:

* Zod
* React Hook Form

Form yang wajib divalidasi:

* register
* login
* creator profile
* service form
* checkout brief
* revision form
* review form

### 28.4 File Validation

Prioritas: P2
Role: System
Area: upload

Validasi:

* tipe file
* ukuran file
* nama file
* akses file

## 29. AI dan Recommendation Features

### 29.1 Manual Recommendation

Prioritas: P1
Role: UMKM
Area: catalog/homepage

Fungsi:

Rekomendasi kreator berdasarkan data dummy atau kurasi admin.

### 29.2 AI Brief Assistant

Prioritas: P3
Role: UMKM
Area: checkout

Fungsi:

Membantu UMKM menyusun brief campaign.

Catatan:

Belum masuk MVP awal.

### 29.3 Creator Matching

Prioritas: P3
Role: UMKM
Area: catalog

Fungsi:

Merekomendasikan kreator berdasarkan kategori, budget, niche, dan kebutuhan campaign.

Tahap awal:

* filter manual

Tahap lanjutan:

* rule-based recommendation
* AI recommendation

### 29.4 Chatbot Bantuan

Prioritas: P3
Role: UMKM, Creator
Area: bantuan

Fungsi:

Menjawab pertanyaan umum.

Catatan:

Roadmap.

## 30. UX Supporting Features

### 30.1 Empty State

Prioritas: P0
Role: All
Area: dashboard, tables

Fungsi:

Menampilkan pesan saat data kosong.

Contoh:

* belum ada pesanan
* belum ada portofolio
* belum ada hasil konten
* belum ada laporan

### 30.2 Loading State

Prioritas: P0
Role: All
Area: pages, components

Fungsi:

Menampilkan skeleton/loading agar UI tidak terasa patah.

### 30.3 Error State

Prioritas: P0
Role: All
Area: forms, pages

Fungsi:

Menampilkan pesan error yang jelas.

### 30.4 Status Badge

Prioritas: P0
Role: All
Area: order, payment, dashboard

Fungsi:

Menampilkan status order dan payment secara konsisten.

### 30.5 Responsive Layout

Prioritas: P0
Role: All
Area: all pages

Fungsi:

Website dapat digunakan di desktop, tablet, dan mobile.

### 30.6 Accessibility

Prioritas: P1
Role: All
Area: all UI

Kriteria:

* tombol minimal 44px height
* focus state jelas
* label form jelas
* kontras cukup
* icon penting harus punya teks
* heading hierarchy rapi

## 31. Mapping Fitur ke Materi Sales Management

Materi Sales Management menyebut beberapa modul utama. Dalam Ruang Usaha Kita, modul tersebut diadaptasi sebagai berikut:

| Modul Sales Management | Adaptasi di Ruang Usaha Kita          | Fitur Terkait                                  |
| ---------------------- | ------------------------------------- | ---------------------------------------------- |
| Product Management     | Service Package Management            | paket jasa, kategori, harga, output, revisi    |
| Inventory Management   | Creator Availability Management       | status tersedia, jadwal terbatas, sedang penuh |
| Order Management       | Digital Service Order Management      | order, brief, status, hasil, revisi            |
| Customer Management    | UMKM dan Creator Management           | profile, riwayat, dashboard                    |
| Payment Management     | Payment dan Invoice                   | dummy payment, invoice, webhook                |
| Shipping & Delivery    | Digital Result Delivery               | upload hasil, link konten, submission          |
| Sales Analytics        | Dashboard dan Reports                 | order, revenue, funnel                         |
| Promotion Management   | Featured creator, banner, voucher     | promosi dan referral                           |
| CRM                    | Favorite, repeat order, brief history | retensi user                                   |
| Reporting System       | Admin reports                         | order report, payment report                   |
| User & Role Management | Role UMKM, Creator, Admin             | auth, guard, RLS                               |
| Automation             | Auto invoice, notification            | roadmap                                        |
| AI Recommendation      | AI brief, creator matching            | roadmap                                        |

## 32. Feature Priority Summary

### P0 — Wajib MVP

* landing page
* public navigation
* katalog kreator
* search UI
* filter katalog
* creator card
* detail kreator
* detail paket jasa
* package tiers
* cart
* checkout brief
* dummy payment
* order list
* order detail
* order status timeline
* submission placeholder
* revision request
* review
* dashboard UMKM
* dashboard Creator
* dashboard Admin
* status badge
* responsive layout
* empty/loading/error state
* input validation dasar

### P1 — Penting Setelah MVP Stabil

* Supabase Auth
* role guard
* creator profile management
* service package management
* portfolio management
* invoice
* payment verification
* platform fee setting
* creator availability
* order accept/reject
* deadline tracking
* revision limit
* in-app notification
* reports dasar
* admin user management
* admin service moderation
* RLS planning
* accessibility polish

### P2 — Pendukung

* add-on services
* brief template
* refund UI
* email notification
* WhatsApp shortcut
* favorite creator
* repeat order
* brief history
* sales analytics
* file upload
* payment gateway sandbox
* complaint management lebih detail
* promotion banner
* featured creator management

### P3 — Roadmap

* AI smart matching
* AI brief assistant
* chatbot bantuan
* direct chat real-time
* custom offer
* milestone project
* voucher
* referral
* payout otomatis
* export report
* CRM kompleks
* advanced analytics
* escrow legal penuh
* mobile app native

## 33. Feature Naming Rules

Gunakan nama fitur yang konsisten.

| Nama Fitur           | Istilah UI           |
| -------------------- | -------------------- |
| Service Package      | Paket Jasa           |
| Campaign Brief       | Brief Campaign       |
| Digital Submission   | Hasil Konten         |
| Revision Request     | Ajukan Revisi        |
| Order Timeline       | Status Pesanan       |
| Creator Availability | Ketersediaan Kreator |
| Payment Summary      | Ringkasan Pembayaran |
| Admin Fee            | Biaya Admin          |
| Platform Fee         | Komisi Platform      |
| Portfolio            | Portofolio           |
| Review               | Ulasan               |

Hindari:

| Hindari          | Ganti                   |
| ---------------- | ----------------------- |
| Product stock    | Ketersediaan kreator    |
| Shipping         | Pengiriman hasil konten |
| Packing          | Persiapan draft         |
| Courier          | Tidak digunakan         |
| Tracking number  | Timeline status pesanan |
| Delivery address | Tidak digunakan         |
| Warehouse        | Tidak digunakan         |
| COD barang       | Tidak digunakan         |

## 34. Kesimpulan

Feature list Ruang Usaha Kita dirancang untuk membangun marketplace jasa digital yang utuh, bukan sekadar website katalog. Fitur utama harus mendukung alur UMKM dari mencari kreator sampai menyelesaikan pesanan. Di sisi lain, creator harus memiliki ruang untuk mengelola profil, layanan, order, dan hasil pekerjaan. Admin harus memiliki dashboard untuk memantau user, layanan, order, pembayaran, komplain, dan laporan.

Pada tahap awal, fokus utama adalah P0. Fitur P1 dikerjakan setelah MVP stabil. Fitur P2 dan P3 menjadi pengembangan lanjutan. Dengan pembagian ini, proses vibe coding dapat dilakukan secara bertahap, rapi, dan tidak keluar dari konsep utama Ruang Usaha Kita.
