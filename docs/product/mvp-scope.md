# Ruang Usaha Kita — MVP Scope

## 1. Tujuan Dokumen

Dokumen ini menjelaskan ruang lingkup MVP atau Minimum Viable Product untuk website Ruang Usaha Kita. MVP digunakan sebagai batas awal pengembangan agar proses building tidak melebar ke fitur yang terlalu kompleks sebelum alur utama e-commerce jasa digital selesai.

Ruang Usaha Kita adalah marketplace jasa digital yang menghubungkan UMKM dengan content creator atau marketer untuk kebutuhan promosi digital. Karena bentuk bisnisnya adalah marketplace jasa, MVP tidak boleh mengikuti konsep toko barang fisik secara mentah. Semua fitur harus disesuaikan dengan alur pemesanan layanan digital, mulai dari mencari kreator, memilih paket jasa, mengisi brief campaign, melakukan pembayaran, memantau proses pengerjaan, menerima hasil konten, hingga memberi review.

MVP bukan versi akhir website. MVP adalah versi awal yang cukup untuk menunjukkan bahwa konsep utama platform dapat berjalan, dapat dipahami pengguna, dan dapat dipresentasikan sebagai sistem e-commerce jasa digital yang utuh.

## 2. Prinsip MVP

Pengembangan MVP Ruang Usaha Kita mengikuti beberapa prinsip utama.

### 2.1 Fokus pada Core Flow

Prioritas utama MVP adalah menyelesaikan alur utama pengguna UMKM:

Beranda → Katalog Kreator → Detail Kreator/Layanan → Keranjang → Checkout Brief → Pembayaran → Status Pesanan → Hasil Konten → Review

Jika alur ini belum jelas, fitur lain seperti AI, analytics kompleks, chat real-time, atau integrasi payment gateway production tidak boleh diprioritaskan.

### 2.2 Service Marketplace First

Ruang Usaha Kita bukan marketplace barang fisik. Maka, seluruh fitur harus berorientasi pada jasa digital.

Gunakan istilah:

* paket jasa
* kreator
* UMKM
* brief campaign
* hasil konten
* revisi
* status pesanan
* pembayaran
* invoice
* review

Hindari istilah:

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

### 2.3 Role-Based Experience

MVP harus memperlihatkan tiga sudut pandang pengguna:

1. UMKM sebagai pembeli jasa.
2. Creator sebagai penyedia jasa.
3. Admin sebagai pengelola platform.

Namun, kedalaman fitur setiap role tidak harus sama pada tahap MVP. Fokus utama tetap pada alur UMKM sebagai pengguna yang melakukan transaksi.

### 2.4 Dummy Before Integration

Pada tahap MVP awal, fitur yang rumit boleh dibuat dummy atau simulasi terlebih dahulu, asalkan alurnya benar.

Contoh:

* pembayaran masih dummy sebelum Midtrans sandbox
* auth masih UI sebelum Supabase Auth
* data kreator masih dummy sebelum Supabase database
* dashboard masih menggunakan data statis sebelum query real
* upload hasil masih placeholder sebelum Supabase Storage

Prinsip ini penting agar tim tidak tersangkut pada integrasi teknis sebelum struktur alur bisnis selesai.

### 2.5 Design System First

MVP harus tetap memakai desain yang konsisten. Walaupun belum semua fitur real, tampilannya harus rapi dan meyakinkan.

Arah visual:

* clean
* modern
* Apple-like
* premium
* tidak ramai
* banyak whitespace
* warna dominan putih/off-white
* aksen navy dan teal
* font Inter
* card halus
* border tipis
* typography kuat

## 3. Tujuan MVP

MVP Ruang Usaha Kita bertujuan untuk:

1. Membuktikan bahwa marketplace jasa digital ini dapat dipahami oleh pengguna.
2. Menampilkan alur e-commerce jasa dari katalog sampai status pesanan.
3. Menunjukkan perbedaan Ruang Usaha Kita dengan toko barang fisik.
4. Menyediakan prototipe website yang dapat dikembangkan menjadi sistem nyata.
5. Menjadi dasar integrasi Supabase, payment gateway, dan fitur lanjutan.
6. Menyediakan fondasi UI/UX yang konsisten untuk proses vibe coding.
7. Menunjukkan bahwa platform memiliki unsur sales management dan order management.

## 4. Target Pengguna MVP

### 4.1 UMKM

UMKM adalah pengguna utama MVP. Dalam MVP, UMKM harus bisa:

* membuka website
* memahami fungsi platform
* mencari kreator
* melihat detail kreator
* melihat detail paket jasa
* menambahkan layanan ke keranjang
* mengisi brief campaign
* melihat ringkasan pembayaran
* melihat status pesanan
* melihat hasil konten
* memberi review

### 4.2 Creator

Creator adalah penyedia jasa. Dalam MVP, creator harus bisa melihat gambaran dashboard dan alur menerima order.

Pada tahap MVP, creator minimal memiliki:

* dashboard kreator
* profil kreator
* daftar paket layanan
* order masuk
* detail brief
* area upload hasil placeholder
* pendapatan dummy
* review dummy

### 4.3 Admin

Admin adalah pengelola platform. Dalam MVP, admin minimal memiliki dashboard untuk menunjukkan bahwa platform dapat dimonitor.

Pada tahap MVP, admin minimal memiliki:

* dashboard admin
* ringkasan user
* ringkasan order
* ringkasan pembayaran
* daftar komplain placeholder
* laporan penjualan sederhana

## 5. Core Flow MVP

Core flow MVP adalah alur utama yang harus selesai terlebih dahulu.

### 5.1 Alur UMKM

1. UMKM membuka landing page.
2. UMKM membaca penjelasan singkat platform.
3. UMKM klik “Cari Kreator”.
4. UMKM masuk ke halaman katalog kreator.
5. UMKM menggunakan search/filter untuk melihat kreator.
6. UMKM membuka detail kreator atau paket jasa.
7. UMKM membaca deskripsi layanan, harga, output, revisi, dan estimasi pengerjaan.
8. UMKM klik “Tambah ke Keranjang”.
9. UMKM membuka keranjang layanan.
10. UMKM melihat ringkasan paket jasa dan total pembayaran.
11. UMKM masuk ke checkout.
12. UMKM mengisi brief campaign.
13. UMKM lanjut ke pembayaran.
14. UMKM memilih metode pembayaran dummy.
15. Sistem menampilkan status pembayaran.
16. UMKM masuk ke halaman detail pesanan.
17. UMKM melihat timeline status order.
18. Kreator mengirim hasil konten dummy.
19. UMKM dapat melihat hasil konten.
20. UMKM dapat meminta revisi atau menyelesaikan pesanan.
21. UMKM memberi rating dan review.

### 5.2 Alur Creator

1. Creator masuk ke dashboard.
2. Creator melihat ringkasan order.
3. Creator membuka order masuk.
4. Creator melihat brief campaign.
5. Creator melihat deadline.
6. Creator mengubah status pengerjaan dummy.
7. Creator mengirim hasil konten placeholder.
8. Creator melihat status revisi atau selesai.

### 5.3 Alur Admin

1. Admin masuk ke dashboard.
2. Admin melihat ringkasan platform.
3. Admin melihat daftar user.
4. Admin melihat daftar kreator.
5. Admin melihat daftar order.
6. Admin melihat status pembayaran.
7. Admin melihat komplain atau revisi yang perlu dimediasi.
8. Admin melihat laporan penjualan sederhana.

## 6. MVP Feature Scope

MVP dibagi menjadi empat kategori prioritas: Must Have, Should Have, Could Have, dan Won’t Have.

## 7. Must Have

Must Have adalah fitur yang wajib ada agar website bisa disebut sebagai MVP.

### 7.1 Landing Page

Landing page harus menjelaskan:

* apa itu Ruang Usaha Kita
* untuk siapa platform ini dibuat
* masalah yang diselesaikan
* kategori layanan yang tersedia
* cara kerja platform
* CTA ke katalog kreator

Elemen minimal:

* navbar
* hero section
* CTA “Cari Kreator”
* kategori layanan
* cara kerja
* benefit UMKM
* footer

### 7.2 Katalog Kreator

Katalog kreator adalah inti marketplace.

Elemen minimal:

* search bar
* filter kategori
* filter harga
* filter lokasi
* filter niche
* creator card
* harga mulai
* rating
* tombol lihat detail

### 7.3 Detail Kreator

Detail kreator berfungsi membangun trust.

Elemen minimal:

* profil kreator
* niche
* lokasi
* rating
* jumlah proyek selesai
* portofolio dummy
* paket jasa
* review dummy
* tombol pilih layanan

### 7.4 Detail Paket Jasa

Detail paket jasa harus menjelaskan layanan secara jelas.

Elemen minimal:

* nama layanan
* nama kreator
* harga
* output layanan
* estimasi pengerjaan
* jumlah revisi
* cocok untuk jenis UMKM tertentu
* tombol tambah ke keranjang
* tombol pesan sekarang

### 7.5 Keranjang Layanan

Keranjang layanan berisi paket jasa yang dipilih.

Elemen minimal:

* nama paket jasa
* nama kreator
* harga
* estimasi pengerjaan
* add-on opsional
* biaya admin
* total pembayaran
* tombol lanjut checkout

Catatan:

Quantity tidak perlu ditonjolkan karena layanan jasa tidak seperti barang fisik.

### 7.6 Checkout Brief Campaign

Checkout harus memiliki form brief campaign.

Field minimal:

* nama usaha
* kategori usaha
* produk atau jasa yang ingin dipromosikan
* tujuan campaign
* target audiens
* platform konten
* gaya konten
* referensi konten
* deadline
* catatan tambahan

Checkout harus menjadi pembeda utama dari e-commerce barang fisik.

### 7.7 Pembayaran Dummy

Pembayaran pada MVP tidak wajib menggunakan payment gateway asli.

Elemen minimal:

* ringkasan pesanan
* harga layanan
* biaya admin
* total pembayaran
* pilihan metode pembayaran dummy
* status menunggu pembayaran
* status pembayaran berhasil dummy
* invoice placeholder

### 7.8 Status Pesanan

Status pesanan wajib menggunakan istilah jasa digital.

Status minimal:

* menunggu pembayaran
* pembayaran berhasil
* brief diterima
* konten diproduksi
* hasil dikirim
* revisi diminta
* selesai
* dibatalkan

Elemen minimal:

* timeline status
* detail order
* ringkasan brief
* area hasil konten
* tombol ajukan revisi
* tombol selesaikan pesanan

### 7.9 Dashboard UMKM

Dashboard UMKM harus menampilkan ringkasan aktivitas.

Elemen minimal:

* pesanan aktif
* pesanan selesai
* brief tersimpan
* total pengeluaran dummy
* daftar pesanan terbaru
* file hasil terbaru
* rekomendasi kreator

### 7.10 Dashboard Creator

Dashboard creator harus menampilkan ringkasan aktivitas kreator.

Elemen minimal:

* order aktif
* order selesai
* rating rata-rata
* estimasi pendapatan dummy
* order masuk
* deadline terdekat
* area upload hasil placeholder

### 7.11 Dashboard Admin

Dashboard admin harus menampilkan kontrol platform.

Elemen minimal:

* total user
* total UMKM
* total kreator
* total order
* pembayaran pending
* komplain aktif
* laporan sederhana

### 7.12 Layout dan Navigasi

MVP harus memiliki struktur layout yang konsisten:

* public header
* public footer
* auth layout
* dashboard sidebar
* dashboard topbar
* page container
* status badge
* price formatter

## 8. Should Have

Should Have adalah fitur yang sangat disarankan, tetapi tidak harus sempurna di MVP awal.

### 8.1 Filter Katalog Lebih Lengkap

Filter dapat mencakup:

* kategori layanan
* lokasi
* harga
* rating
* niche
* estimasi pengerjaan

### 8.2 Review dan Rating

Review membantu membangun trust.

Pada MVP, review bisa memakai data dummy terlebih dahulu.

### 8.3 Revisi

Fitur revisi sebaiknya muncul di status pesanan.

Pada MVP, revisi bisa berupa form dummy:

* catatan revisi
* file referensi opsional
* status revisi

### 8.4 Invoice Placeholder

Invoice tidak harus dalam bentuk PDF pada MVP. Cukup halaman ringkasan pembayaran yang menyerupai invoice.

### 8.5 Search UI

Search tidak harus langsung terhubung ke database. Namun secara UI, search harus tersedia agar alur e-commerce terasa lengkap.

### 8.6 Empty State

Setiap halaman dashboard perlu empty state agar rapi ketika belum ada data.

Contoh:

* belum ada pesanan
* belum ada portofolio
* belum ada brief
* belum ada hasil konten

## 9. Could Have

Could Have adalah fitur yang boleh dibuat jika waktu cukup.

### 9.1 Simulasi Login Role

Sebelum Supabase Auth, bisa dibuat role switch dummy untuk masuk sebagai UMKM, creator, atau admin.

### 9.2 Chat Placeholder

Chat real-time belum perlu. Namun tombol “Hubungi Kreator” atau “Hubungi Admin” bisa ditampilkan.

### 9.3 Notifikasi Dummy

Dashboard bisa menampilkan notifikasi dummy seperti:

* brief menunggu konfirmasi
* hasil konten menunggu review
* pembayaran berhasil
* revisi dikirim

### 9.4 Sales Analytics Sederhana

Admin dashboard bisa menampilkan grafik dummy:

* order per bulan
* pendapatan platform
* layanan terlaris
* kreator aktif

### 9.5 Favorite Creator

UMKM bisa menyimpan kreator favorit. Pada MVP, ini cukup sebagai UI dummy.

## 10. Won’t Have Pada MVP Awal

Fitur berikut tidak masuk MVP awal.

### 10.1 AI Smart Matching Penuh

AI matching belum masuk MVP karena membutuhkan data historis yang cukup. Pada tahap awal, pencocokan dilakukan melalui filter manual.

### 10.2 Auto-Brief AI

Auto-brief bisa menjadi fitur lanjutan. MVP cukup memakai form brief manual.

### 10.3 Payment Gateway Production

Midtrans production atau payment gateway real belum masuk MVP awal. Gunakan dummy payment atau sandbox setelah order flow stabil.

### 10.4 Escrow Legal Penuh

Konsep dana ditahan platform bisa dijelaskan secara UI, tetapi escrow legal penuh belum dibangun pada MVP.

### 10.5 Payout Otomatis ke Kreator

Payout otomatis belum perlu. Dashboard pendapatan cukup berupa simulasi.

### 10.6 Real-Time Chat

Chat real-time belum perlu. Gunakan tombol kontak atau placeholder komunikasi.

### 10.7 Upload Video Besar

Upload video besar belum perlu karena akan membebani storage. Gunakan link video atau upload file kecil terlebih dahulu.

### 10.8 Mobile App Native

MVP hanya website responsive, bukan aplikasi Android/iOS native.

### 10.9 CRM Kompleks

CRM kompleks belum perlu. Riwayat order dan review sudah cukup untuk tahap awal.

### 10.10 Analytics Mendalam

Analytics mendalam seperti cohort, retention, atau attribution belum masuk MVP awal.

## 11. Data Dummy MVP

Sebelum database aktif, MVP menggunakan data dummy.

### 11.1 Dummy Creator

Contoh data kreator:

| Nama            | Niche             | Layanan               | Harga Mulai | Rating |
| --------------- | ----------------- | --------------------- | ----------: | -----: |
| Raka Visual     | Kuliner           | Video TikTok/Reels    |   Rp150.000 |    4.8 |
| Nabila Creative | Fashion & Beauty  | Desain Feed Instagram |   Rp120.000 |    4.7 |
| Dimas Review    | Produk Lokal      | Review Produk         |   Rp200.000 |    4.9 |
| Sinta Studio    | Kuliner           | Foto Produk           |   Rp175.000 |    4.6 |
| Fadd Graphics   | Branding & Desain | Desain Promosi        |   Rp150.000 |    4.8 |
| Arkan Media     | Lifestyle         | Campaign TikTok       |   Rp300.000 |    4.7 |

### 11.2 Dummy Service Categories

Kategori layanan:

* Video TikTok/Reels
* Desain Feed Instagram
* Foto Produk
* Review Produk
* Caption Promosi
* Campaign UMKM

### 11.3 Dummy Order

Contoh order:

* Order ID: RUK-2026-00124
* UMKM: Bakso Mas Adi
* Creator: Raka Visual
* Paket: Standard Video TikTok/Reels
* Total: Rp455.000
* Status: Konten Diproduksi
* Deadline: 3 hari

## 12. Acceptance Criteria MVP

MVP dianggap selesai jika memenuhi kriteria berikut.

### 12.1 Public Area

* Landing page tampil rapi.
* Katalog kreator tampil.
* Detail kreator tampil.
* Detail layanan tampil.
* Cara kerja tampil.
* Bantuan tampil.
* Tidak ada 404 pada route public utama.

### 12.2 UMKM Flow

* UMKM dapat melihat katalog.
* UMKM dapat membuka detail layanan.
* UMKM dapat melihat keranjang.
* UMKM dapat mengisi brief campaign.
* UMKM dapat melihat halaman pembayaran dummy.
* UMKM dapat melihat status pesanan.
* UMKM dapat melihat dashboard.

### 12.3 Creator Flow

* Creator dashboard tampil.
* Halaman profil kreator tampil.
* Halaman paket layanan tampil.
* Halaman order masuk tampil.
* Halaman detail order tampil.
* Area upload hasil placeholder tersedia.

### 12.4 Admin Flow

* Admin dashboard tampil.
* Halaman users tampil.
* Halaman UMKM tampil.
* Halaman creators tampil.
* Halaman services tampil.
* Halaman orders tampil.
* Halaman payments tampil.
* Halaman complaints tampil.
* Halaman reports tampil.

### 12.5 UI/UX

* Desain konsisten.
* Warna sesuai brand.
* Font Inter.
* Layout Apple-like.
* Tidak ada istilah barang fisik.
* Komponen reusable mulai terbentuk.
* Responsive dasar berjalan.

### 12.6 Technical

* `npm run dev` berjalan tanpa error.
* `npm run build` berhasil.
* Tidak ada TypeScript error fatal.
* Tidak ada import path rusak.
* Route utama tidak 404.
* Komponen shadcn tidak diubah sembarangan.
* Struktur folder tetap rapi.

## 13. MVP Milestones

### Milestone 1 — Foundation

Fokus:

* struktur folder
* layout global
* design token
* typography
* header
* footer
* dashboard shell
* sidebar
* topbar
* reusable components

Output:

* semua route utama tampil
* visual dasar konsisten

### Milestone 2 — Public Marketplace

Fokus:

* landing page
* katalog kreator
* creator card
* detail kreator
* detail layanan

Output:

* pengguna memahami platform
* katalog terasa seperti marketplace jasa

### Milestone 3 — UMKM Transaction Flow

Fokus:

* cart
* checkout brief
* payment dummy
* order status
* dashboard UMKM

Output:

* alur e-commerce jasa digital terlihat utuh

### Milestone 4 — Creator Workflow

Fokus:

* dashboard creator
* profile
* services
* orders
* detail order
* upload result placeholder

Output:

* sisi penyedia jasa terlihat jelas

### Milestone 5 — Admin Monitoring

Fokus:

* dashboard admin
* users
* creators
* services
* orders
* payments
* complaints
* reports

Output:

* platform terlihat bisa dikelola

### Milestone 6 — Integration Ready

Fokus:

* Supabase schema
* Supabase Auth
* RLS
* dummy data migration
* payment sandbox planning
* storage planning

Output:

* MVP siap masuk tahap backend real

## 14. Risiko MVP

### 14.1 Scope Terlalu Melebar

Risiko:

Tim terlalu cepat membangun fitur seperti AI, chat, payment production, dan analytics kompleks.

Mitigasi:

Ikuti dokumen MVP. Selesaikan core flow dulu.

### 14.2 UI Terlihat Bagus tapi Flow Salah

Risiko:

Desain terlihat premium tetapi tidak menunjukkan alur e-commerce.

Mitigasi:

Selalu cek core flow: katalog → detail → cart → checkout → payment → status order.

### 14.3 Salah Konsep Menjadi Toko Barang

Risiko:

Muncul istilah stock, shipping, packing, courier, atau resi.

Mitigasi:

Gunakan terminologi jasa digital sesuai dokumen ini.

### 14.4 Dashboard Terlalu Rumit

Risiko:

Dashboard penuh grafik dan fitur sebelum order flow selesai.

Mitigasi:

Gunakan dashboard sederhana dengan metric card dan tabel dummy.

### 14.5 Integrasi Terlalu Cepat

Risiko:

Masuk ke Supabase dan payment sebelum struktur UI stabil.

Mitigasi:

Gunakan data dummy dulu, lalu integrasi bertahap.

## 15. Definition of Done

Satu fitur dianggap selesai jika:

1. Route dapat dibuka tanpa 404.
2. Tampilan sesuai desain.
3. Copywriting sesuai konteks jasa digital.
4. Tidak ada istilah barang fisik.
5. Responsive dasar berjalan.
6. Komponen dibuat reusable jika dipakai lebih dari sekali.
7. Tidak menimbulkan error TypeScript.
8. Tidak merusak route lain.
9. Struktur file tetap sesuai folder domain.
10. Fitur memiliki placeholder data yang masuk akal jika belum terhubung database.

## 16. Kesimpulan

MVP Ruang Usaha Kita harus membuktikan bahwa platform ini dapat berjalan sebagai marketplace jasa digital untuk UMKM dan content creator. Fokus MVP bukan membuat semua fitur sempurna, tetapi membuat alur utama terlihat utuh dan dapat dipahami.

Prioritas utama adalah menyelesaikan alur UMKM dari mencari kreator sampai menyelesaikan pesanan. Setelah itu, sisi creator dan admin dibuat sebagai pendukung agar platform terlihat lengkap. Fitur lanjutan seperti AI, chat real-time, payment production, escrow, dan analytics mendalam tidak masuk MVP awal.

Dokumen ini menjadi batas kerja agar proses vibe coding tetap terarah, tidak melebar, dan tidak keluar dari konsep utama Ruang Usaha Kita.
