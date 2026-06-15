# Ruang Usaha Kita — Architecture Overview

## 1. Identitas Project

Ruang Usaha Kita adalah platform marketplace jasa digital yang menghubungkan pelaku UMKM dengan content creator atau marketer untuk kebutuhan promosi digital. Platform ini tidak dirancang sebagai toko online barang fisik, melainkan sebagai tempat pemesanan layanan promosi berbasis digital.

Dalam konteks website ini, istilah “produk” tidak dimaknai sebagai barang fisik, melainkan sebagai paket jasa yang ditawarkan oleh kreator. Paket jasa tersebut dapat berupa video pendek untuk TikTok/Reels, desain feed Instagram, foto produk, review produk, caption promosi, atau campaign promosi UMKM.

Project ini dikembangkan sebagai website full-stack berbasis Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Supabase, dan Vercel. Website dibangun dengan pendekatan modern, clean, dan profesional, dengan desain yang terinspirasi dari kesederhanaan visual Apple.com, tetapi tetap disesuaikan dengan karakter brand Ruang Usaha Kita.

## 2. Latar Belakang Masalah

Banyak UMKM sudah menyadari pentingnya promosi digital, terutama melalui media sosial seperti Instagram, TikTok, dan WhatsApp. Namun, tidak semua UMKM memiliki kemampuan untuk membuat konten yang menarik, menyusun konsep promosi, memahami tren media sosial, menentukan target audiens, atau memilih content creator yang sesuai dengan kebutuhan usaha mereka.

Di sisi lain, content creator lokal dan kreator skala mikro juga sering kesulitan mendapatkan klien secara konsisten. Banyak kreator memiliki kemampuan membuat konten, tetapi belum memiliki wadah profesional untuk menampilkan portofolio, tarif jasa, paket layanan, dan sistem kerja sama yang jelas.

Masalah yang ingin dijawab oleh Ruang Usaha Kita adalah ketidakteraturan proses kerja sama antara UMKM dan content creator. Saat ini, kerja sama sering dilakukan melalui pesan pribadi di media sosial, seperti DM Instagram atau TikTok. Cara tersebut kurang efisien karena informasi portofolio, harga, brief, revisi, pembayaran, dan status pekerjaan sering tidak terdokumentasi dengan baik.

Ruang Usaha Kita hadir untuk membuat proses tersebut lebih terstruktur, transparan, dan mudah dipantau.

## 3. Tujuan Platform

Tujuan utama Ruang Usaha Kita adalah menyediakan platform digital yang mempermudah UMKM menemukan content creator atau marketer yang sesuai untuk kebutuhan promosi digital.

Tujuan tersebut dijabarkan menjadi beberapa tujuan teknis dan bisnis:

1. Membantu UMKM mencari kreator berdasarkan kategori layanan, lokasi, niche, portofolio, rating, dan kisaran harga.
2. Membantu content creator menampilkan profil profesional, paket jasa, portofolio, dan informasi layanan secara lebih tertata.
3. Menyediakan alur pemesanan jasa digital yang mirip e-commerce, tetapi disesuaikan dengan karakter layanan kreatif.
4. Menyediakan sistem brief campaign agar kebutuhan promosi UMKM lebih jelas sejak awal.
5. Menyediakan order management agar UMKM dan kreator dapat memantau proses pengerjaan dari awal sampai selesai.
6. Menyediakan payment flow yang rapi, mulai dari checkout, invoice, verifikasi pembayaran, sampai status pesanan.
7. Menyediakan ruang review, revisi, dan penyelesaian pesanan agar proses kerja sama lebih aman.
8. Menjadi fondasi digital untuk pengembangan fitur lanjutan seperti rekomendasi kreator, auto-brief, analytics, dan dashboard penjualan.

## 4. Karakter Bisnis

Ruang Usaha Kita adalah marketplace dua sisi.

Pihak pertama adalah UMKM sebagai pembeli layanan. UMKM membutuhkan jasa promosi digital, seperti video pendek, desain konten, foto produk, review produk, atau bantuan campaign.

Pihak kedua adalah content creator atau marketer sebagai penyedia layanan. Kreator menawarkan jasa berdasarkan kemampuan, niche, portofolio, tarif, dan ketersediaan waktu.

Platform berada di tengah sebagai penghubung, pengelola transaksi, pengatur alur pesanan, penyedia dashboard, dan penjaga kejelasan proses kerja sama.

Karena bentuk bisnisnya marketplace jasa digital, platform ini tidak memiliki stok barang, gudang, kurir, ongkos kirim, nomor resi, atau pengiriman paket fisik. Seluruh alur transaksi harus diterjemahkan ke konteks layanan digital.

## 5. Adaptasi Konsep E-Commerce

Secara umum, alur e-commerce sering digambarkan sebagai:

Customer → Product → Cart → Payment → Delivery → Review

Untuk Ruang Usaha Kita, alur tersebut diadaptasi menjadi:

UMKM → Paket Jasa Kreator → Keranjang Layanan → Checkout Brief → Pembayaran → Pengiriman Hasil Konten → Review/Revisi

Penyesuaian istilahnya sebagai berikut:

| Konsep E-Commerce Umum | Adaptasi Ruang Usaha Kita                                       |
| ---------------------- | --------------------------------------------------------------- |
| Customer               | UMKM                                                            |
| Seller                 | Content creator / marketer                                      |
| Product                | Paket jasa digital                                              |
| Product detail         | Detail layanan, portofolio, output, revisi, estimasi pengerjaan |
| Inventory              | Slot/ketersediaan kreator                                       |
| Cart                   | Keranjang layanan                                               |
| Checkout               | Pengisian brief campaign dan konfirmasi pesanan                 |
| Payment                | Pembayaran jasa, biaya admin, invoice                           |
| Delivery               | Pengiriman hasil konten digital                                 |
| Return                 | Revisi, komplain, mediasi, refund sebagian                      |
| Review                 | Rating dan ulasan terhadap kreator                              |

Dengan adaptasi ini, website tetap memenuhi karakter e-commerce, tetapi tidak salah masuk ke konsep toko barang fisik.

## 6. Hubungan dengan Sales Management

Dalam konteks materi Sales Management, website ini harus dipahami sebagai sistem yang tidak hanya menampilkan katalog, tetapi juga mengatur aktivitas penjualan digital dari awal sampai akhir.

Sales management dalam Ruang Usaha Kita mencakup:

1. Service Management
   Mengelola data paket jasa kreator, kategori layanan, harga, estimasi pengerjaan, output layanan, dan status ketersediaan.

2. Customer Management
   Mengelola data UMKM sebagai pelanggan, termasuk profil usaha, riwayat pesanan, brief campaign, invoice, dan hasil konten.

3. Creator Management
   Mengelola data content creator, termasuk profil, niche, portofolio, paket layanan, rating, order masuk, dan pendapatan.

4. Order Management
   Mengelola pesanan dari proses checkout hingga selesai, termasuk status pembayaran, penerimaan brief, produksi konten, pengiriman hasil, revisi, dan penyelesaian order.

5. Payment Management
   Mengelola invoice, status pembayaran, biaya admin, platform fee, dan simulasi integrasi payment gateway.

6. Promotion Management
   Mengelola promosi platform, kategori unggulan, rekomendasi kreator, voucher, referral, atau campaign khusus untuk UMKM.

7. Reporting System
   Mengelola laporan transaksi, jumlah pesanan, pendapatan platform, layanan terlaris, kreator aktif, dan performa order.

8. Sales Analytics
   Menganalisis funnel pengguna dari melihat katalog, membuka detail layanan, menambahkan ke keranjang, checkout, membayar, sampai menyelesaikan order.

## 7. Ruang Lingkup Website

Ruang lingkup website dibagi menjadi lima area utama:

1. Public Area
   Area yang bisa diakses tanpa login. Berisi landing page, katalog kreator, detail kreator, detail layanan, cara kerja, dan bantuan.

2. Auth Area
   Area login, register, forgot password, dan auth callback.

3. UMKM Area
   Area khusus UMKM untuk melihat dashboard, keranjang, checkout, pesanan, brief campaign, hasil konten, pembayaran, dan pengaturan akun.

4. Creator Area
   Area khusus content creator untuk mengatur profil, portofolio, paket layanan, order masuk, upload hasil, pendapatan, dan pengaturan akun.

5. Admin Area
   Area pengelola platform untuk memantau user, UMKM, kreator, layanan, pesanan, pembayaran, komplain, laporan, dan pengaturan platform.

## 8. User Role

Website memiliki tiga role utama:

### 8.1 UMKM

UMKM adalah pengguna yang membeli layanan promosi digital. Kebutuhan utama UMKM adalah mencari kreator, membandingkan layanan, melihat harga, mengisi brief, melakukan pembayaran, memantau progres, menerima hasil, dan memberi review.

Fitur utama untuk UMKM:

* melihat katalog kreator
* melihat detail layanan
* menambahkan paket jasa ke keranjang
* mengisi brief campaign
* melakukan checkout
* melihat status pembayaran
* memantau progres order
* menerima hasil konten
* meminta revisi
* memberi rating dan review
* melihat riwayat transaksi

### 8.2 Content Creator / Marketer

Creator adalah pengguna yang menawarkan layanan promosi digital. Kebutuhan utama creator adalah menampilkan profil, mengatur paket jasa, menerima order, membaca brief, mengerjakan konten, mengirim hasil, menangani revisi, dan melihat pendapatan.

Fitur utama untuk creator:

* membuat profil kreator
* mengatur niche dan layanan
* menambahkan portofolio
* membuat paket Basic, Standard, Premium
* melihat order masuk
* menerima atau menolak order
* membaca brief campaign
* upload hasil konten
* menangani revisi
* melihat rating dan pendapatan

### 8.3 Admin

Admin adalah pengelola platform. Admin bertugas menjaga sistem tetap berjalan, memantau transaksi, mengelola user, memvalidasi kreator, menangani komplain, dan membaca laporan.

Fitur utama untuk admin:

* melihat ringkasan platform
* mengelola user
* mengelola UMKM
* mengelola creator
* mengelola paket layanan
* memantau semua order
* memantau pembayaran
* menangani komplain dan mediasi
* melihat laporan penjualan
* mengatur parameter platform

## 9. Core Flow Website

Core flow utama website adalah:

1. UMKM membuka landing page.
2. UMKM mencari kreator melalui katalog.
3. UMKM memfilter kreator berdasarkan kategori layanan, lokasi, niche, harga, dan rating.
4. UMKM membuka detail kreator atau detail paket jasa.
5. UMKM memilih paket jasa.
6. UMKM menambahkan paket jasa ke keranjang.
7. UMKM masuk ke checkout.
8. UMKM mengisi brief campaign.
9. UMKM memilih metode pembayaran.
10. Sistem membuat invoice.
11. Pembayaran diverifikasi.
12. Creator menerima brief.
13. Creator memproduksi konten.
14. Creator mengirim draft atau hasil final.
15. UMKM melakukan review hasil.
16. Jika belum sesuai, UMKM meminta revisi.
17. Creator mengirim revisi.
18. UMKM menyetujui hasil.
19. Pesanan selesai.
20. UMKM memberi rating dan ulasan.
21. Data transaksi masuk ke laporan platform.

## 10. Status Order

Status order harus menggunakan istilah jasa digital, bukan istilah pengiriman barang.

Status yang digunakan:

| Status Sistem                | Label UI                    | Makna                               |
| ---------------------------- | --------------------------- | ----------------------------------- |
| draft                        | Draft                       | Pesanan belum selesai dibuat        |
| awaiting_payment             | Menunggu Pembayaran         | UMKM belum menyelesaikan pembayaran |
| paid                         | Dibayar                     | Pembayaran berhasil                 |
| waiting_creator_confirmation | Menunggu Konfirmasi Kreator | Kreator belum menerima order        |
| brief_accepted               | Brief Diterima              | Kreator sudah menerima brief        |
| in_progress                  | Konten Diproduksi           | Kreator sedang mengerjakan konten   |
| submitted                    | Hasil Dikirim               | Draft/hasil konten dikirim ke UMKM  |
| revision_requested           | Revisi Diminta              | UMKM meminta perbaikan              |
| revised                      | Revisi Dikirim              | Kreator mengirim hasil revisi       |
| completed                    | Selesai                     | Pesanan disetujui dan ditutup       |
| cancelled                    | Dibatalkan                  | Pesanan dibatalkan                  |
| refunded                     | Refund                      | Dana dikembalikan sebagian/penuh    |

Status yang tidak boleh digunakan:

* packing
* shipping
* shipped
* warehouse
* stock out
* delivery address
* courier
* tracking number
* resi
* COD barang

## 11. Modul Utama

### 11.1 Public Module

Public module berisi halaman yang membantu user memahami platform dan mulai masuk ke funnel.

Halaman:

* Beranda
* Katalog Kreator
* Detail Kreator
* Detail Paket Jasa
* Cara Kerja
* Bantuan

Fungsi utama:

* menjelaskan value proposition
* mengarahkan UMKM ke katalog
* memperlihatkan kategori layanan
* menjelaskan cara kerja platform
* membangun trust awal

### 11.2 Auth Module

Auth module menangani akses masuk ke platform.

Halaman:

* Login
* Register
* Forgot Password
* Callback

Role yang didukung:

* UMKM
* Creator
* Admin

Catatan:

Pada tahap awal, auth bisa dibuat dummy terlebih dahulu. Integrasi Supabase Auth dilakukan setelah struktur UI dan route stabil.

### 11.3 Catalog Module

Catalog module adalah pusat pencarian layanan.

Fungsi utama:

* search kreator
* filter berdasarkan kategori
* filter berdasarkan lokasi
* filter berdasarkan niche
* filter berdasarkan harga
* filter berdasarkan rating
* menampilkan kartu kreator
* mengarahkan ke detail kreator atau detail layanan

### 11.4 Service Module

Service module mengelola paket jasa kreator.

Data paket jasa mencakup:

* nama layanan
* deskripsi layanan
* harga
* estimasi pengerjaan
* jumlah revisi
* output layanan
* kategori
* creator owner
* status aktif/nonaktif

Contoh paket:

* Basic
* Standard
* Premium

### 11.5 Cart Module

Cart module menyimpan paket jasa yang ingin dipesan UMKM.

Catatan penting:

Cart tidak boleh terlalu menonjolkan quantity seperti toko barang. Untuk jasa digital, quantity biasanya tetap satu. Variasi nilai transaksi berasal dari paket layanan, add-on, atau kebutuhan brief.

### 11.6 Checkout Module

Checkout module menjadi titik penting karena UMKM harus mengisi brief campaign.

Isi brief campaign:

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

### 11.7 Payment Module

Payment module menangani ringkasan pembayaran.

Komponen pembayaran:

* harga paket jasa
* biaya admin
* platform fee jika ditampilkan
* add-on jika ada
* total pembayaran
* metode pembayaran
* status pembayaran
* invoice

Pada tahap awal, payment bisa dibuat dummy. Integrasi Midtrans atau payment gateway lain dilakukan setelah order flow stabil.

### 11.8 Order Module

Order module mengatur proses kerja dari setelah checkout sampai selesai.

Order harus menyimpan:

* data UMKM
* data creator
* paket jasa
* brief campaign
* total pembayaran
* status pembayaran
* status order
* deadline
* hasil konten
* revisi
* review

### 11.9 Submission Module

Submission module digunakan creator untuk mengirim hasil pekerjaan.

Jenis hasil:

* file video
* file desain
* foto produk
* caption
* link Google Drive
* link TikTok/Instagram
* link unggahan publik

### 11.10 Revision Module

Revision module menangani perbaikan hasil.

Data revisi mencakup:

* order id
* catatan revisi
* file referensi
* status revisi
* waktu pengajuan
* waktu penyelesaian

### 11.11 Review Module

Review module digunakan untuk memberikan rating dan ulasan.

Review membantu membangun trust marketplace.

Data review:

* rating
* komentar
* order id
* creator id
* umkm id
* tanggal review

### 11.12 Reports Module

Reports module digunakan admin untuk melihat performa platform.

Data laporan:

* total order
* order selesai
* order berjalan
* order dibatalkan
* total gross transaction value
* pendapatan platform
* layanan terlaris
* kreator aktif
* UMKM aktif
* order dengan revisi
* komplain aktif

## 12. Prinsip Pengembangan

Pengembangan Ruang Usaha Kita menggunakan prinsip:

1. MVP first
   Bangun fitur inti terlebih dahulu sebelum fitur canggih.

2. Role-based architecture
   Setiap role memiliki dashboard dan hak akses berbeda.

3. Service marketplace oriented
   Semua istilah dan flow harus sesuai jasa digital, bukan barang fisik.

4. Component-driven UI
   UI disusun dari komponen reusable agar rapi dan konsisten.

5. Domain-based structure
   Logic dipisah berdasarkan domain: auth, catalog, services, orders, payments, reviews, reports.

6. Server-safe payment
   Payment key dan webhook tidak boleh berjalan di client.

7. Security by design
   Supabase RLS, role guard, dan validasi data harus dipikirkan sejak awal.

8. Design system first
   Warna, typography, spacing, button, card, dan layout harus konsisten sebelum fitur banyak dibuat.

## 13. Tech Stack

Tech stack utama:

| Area             | Teknologi                                   |
| ---------------- | ------------------------------------------- |
| Framework        | Next.js App Router                          |
| Language         | TypeScript                                  |
| UI               | React                                       |
| Styling          | Tailwind CSS                                |
| Component System | shadcn/ui, Radix UI                         |
| Icon             | Lucide React                                |
| Database         | Supabase PostgreSQL                         |
| Auth             | Supabase Auth                               |
| Storage          | Supabase Storage                            |
| Hosting          | Vercel                                      |
| Payment          | Midtrans Sandbox / dummy payment tahap awal |
| Email            | Supabase Auth untuk reset password          |
| Analytics        | PostHog tahap lanjutan                      |
| Error Monitoring | Sentry tahap lanjutan                       |
| State Management | Zustand                                     |
| Form             | React Hook Form                             |
| Validation       | Zod                                         |

## 14. Non-Goals Tahap Awal

Hal yang tidak menjadi prioritas tahap awal:

* mobile app native
* real-time chat kompleks
* AI smart matching penuh
* escrow legal penuh
* payout otomatis ke kreator
* upload video besar
* push notification
* CRM kompleks
* analytics mendalam
* multi-channel automation
* fitur admin enterprise

Fitur tersebut bisa menjadi roadmap, tetapi tidak boleh mengganggu penyelesaian MVP.

## 15. MVP Scope

MVP Ruang Usaha Kita harus mencakup:

1. Landing page
2. Katalog kreator
3. Detail kreator / detail layanan
4. Keranjang layanan
5. Checkout brief campaign
6. Simulasi pembayaran
7. Status pesanan
8. Dashboard UMKM
9. Dashboard Creator
10. Dashboard Admin sederhana
11. Status order jasa digital
12. Review sederhana

Jika MVP ini selesai, platform sudah bisa dipresentasikan sebagai e-commerce jasa digital yang utuh.

## 16. Arah Pengembangan Berikutnya

Setelah MVP selesai, pengembangan berikutnya dapat meliputi:

1. Supabase Auth dan role guard.
2. Database schema dan RLS.
3. CRUD kreator dan layanan.
4. Order flow nyata.
5. Integrasi payment gateway sandbox.
6. Upload hasil konten.
7. Revisi dan review.
8. Evaluasi notifikasi eksternal setelah flow utama stabil.
9. Analytics funnel.
10. AI auto-brief dan rekomendasi kreator.

## 17. Kesimpulan

Ruang Usaha Kita adalah marketplace jasa digital yang mengadaptasi konsep e-commerce ke dalam konteks kerja sama promosi antara UMKM dan content creator. Website ini tidak hanya menampilkan katalog kreator, tetapi juga harus memiliki sistem sales management, order management, payment management, customer management, dan reporting.

Fondasi arsitektur harus menjaga tiga hal utama: alur e-commerce jasa digital yang benar, role pengguna yang jelas, dan struktur kode yang rapi. Dengan fondasi tersebut, proses vibe coding dapat berjalan lebih terarah karena setiap fitur memiliki konteks, fungsi, dan posisi yang jelas dalam sistem.
