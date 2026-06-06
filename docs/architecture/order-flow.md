# Ruang Usaha Kita — Order Flow

## 1. Tujuan Dokumen

Dokumen ini menjelaskan alur pesanan atau order flow pada Ruang Usaha Kita. Order flow adalah salah satu bagian paling penting dalam website ini karena menjadi penghubung antara katalog layanan, checkout, pembayaran, pengerjaan konten, revisi, hasil akhir, review, dan laporan penjualan.

Ruang Usaha Kita adalah marketplace jasa digital, bukan toko barang fisik. Karena itu, alur pesanan tidak boleh mengikuti konsep barang fisik seperti packing, shipping, kurir, ongkir, resi, atau alamat pengiriman. Semua proses order harus disesuaikan dengan karakter jasa digital.

Dalam konteks Ruang Usaha Kita, order berarti pesanan jasa promosi digital dari UMKM kepada content creator atau marketer. Pesanan dapat berupa video TikTok/Reels, desain feed Instagram, foto produk, review produk, caption promosi, atau campaign UMKM.

Order flow ini dirancang agar:

1. UMKM memahami proses pemesanan jasa.
2. Creator memahami kapan harus menerima brief, mengerjakan, dan mengirim hasil.
3. Admin dapat memantau order dari awal sampai selesai.
4. Payment status dan order status tidak bercampur.
5. Revisi, komplain, dan refund memiliki alur yang jelas.
6. Dashboard dan database dapat mengikuti status order secara konsisten.
7. Vibe coding tidak membuat flow yang salah seperti toko barang fisik.

## 2. Prinsip Utama Order Flow

### 2.1 Order Adalah Pusat Sistem

Order adalah pusat dari seluruh proses marketplace. Order menghubungkan beberapa data penting:

* UMKM
* creator
* paket jasa
* tier paket
* add-on
* brief campaign
* payment
* invoice
* status pesanan
* hasil konten
* revisi
* review
* komplain
* laporan penjualan

Karena itu, hampir semua fitur penting akan membaca atau menulis data yang terkait dengan order.

### 2.2 Payment Status Berbeda dari Order Status

Payment status dan order status harus dipisahkan.

Payment status menjelaskan kondisi pembayaran.

Contoh:

* pending
* paid
* failed
* expired
* refunded
* partially_refunded

Order status menjelaskan kondisi pengerjaan jasa.

Contoh:

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

Kedua status ini bisa saling memengaruhi, tetapi tidak boleh dicampur dalam satu field yang sama.

### 2.3 Tidak Ada Pengiriman Barang

Ruang Usaha Kita tidak menggunakan konsep pengiriman fisik.

Hindari istilah:

* packing
* shipping
* shipped
* delivered
* courier
* delivery address
* shipping fee
* tracking number
* resi
* warehouse
* stock

Gunakan istilah:

* brief diterima
* konten diproduksi
* hasil dikirim
* hasil direview
* revisi diminta
* revisi dikirim
* pesanan selesai
* file hasil
* link unggahan
* status pesanan

### 2.4 Status Harus Mengikuti Aksi Bisnis

Setiap perubahan status harus memiliki alasan dan aktor yang jelas.

Contoh:

* payment berhasil karena webhook/server memverifikasi pembayaran.
* order masuk produksi karena creator sudah menerima brief.
* hasil dikirim karena creator mengunggah file/link hasil.
* revisi diminta karena UMKM belum menyetujui hasil.
* pesanan selesai karena UMKM menyetujui hasil.
* refund diproses karena admin menyelesaikan komplain.

### 2.5 Tidak Semua Aksi Boleh Dilakukan Semua Role

UMKM, creator, dan admin memiliki hak berbeda.

Contoh:

* UMKM boleh membuat order, membayar, meminta revisi, menyelesaikan pesanan, dan memberi review.
* Creator boleh menerima order, mulai produksi, mengirim hasil, dan mengirim revisi.
* Admin boleh memantau, memediasi, membatalkan, atau memproses refund sesuai aturan.
* Guest tidak boleh membuat atau mengubah order.

## 3. Adaptasi Alur E-Commerce

Alur e-commerce umum:

Customer → Product → Cart → Payment → Delivery → Review

Adaptasi Ruang Usaha Kita:

UMKM → Paket Jasa → Keranjang Layanan → Checkout Brief → Pembayaran → Produksi Konten → Pengiriman Hasil Digital → Revisi/Approval → Review

Pemetaan:

| E-Commerce Umum | Ruang Usaha Kita                                |
| --------------- | ----------------------------------------------- |
| Customer        | UMKM                                            |
| Seller          | Creator/Marketer                                |
| Product         | Paket jasa digital                              |
| Product Detail  | Detail layanan, output, harga, revisi, estimasi |
| Cart            | Keranjang layanan                               |
| Checkout        | Pengisian brief campaign                        |
| Payment         | Pembayaran jasa dan biaya admin                 |
| Delivery        | Pengiriman hasil konten digital                 |
| Return          | Revisi, komplain, refund sebagian               |
| Review          | Rating dan ulasan kreator                       |

## 4. Aktor dalam Order Flow

### 4.1 UMKM

UMKM adalah pihak yang memesan jasa.

Aksi UMKM:

* memilih kreator
* memilih paket jasa
* menambahkan layanan ke keranjang
* mengisi brief campaign
* melakukan pembayaran
* melihat status pesanan
* melihat hasil konten
* meminta revisi
* menyelesaikan pesanan
* memberi review
* membuat komplain jika ada masalah

### 4.2 Creator

Creator adalah pihak yang mengerjakan jasa.

Aksi creator:

* menerima order
* membaca brief campaign
* mulai produksi konten
* mengirim hasil konten
* membaca catatan revisi
* mengirim hasil revisi
* melihat review
* melihat ringkasan pendapatan

### 4.3 Admin

Admin adalah pengelola platform.

Aksi admin:

* memantau seluruh order
* melihat status pembayaran
* menangani komplain
* memberi catatan mediasi
* membatalkan order jika diperlukan
* memproses refund administratif
* melihat laporan order dan penjualan
* melakukan override terbatas dengan audit log

### 4.4 System / Server

System adalah proses otomatis dari aplikasi.

Aksi system:

* membuat order number
* menghitung total pembayaran
* membuat payment request
* menerima payment webhook
* mengubah payment status
* membuat order status history
* mengirim notifikasi
* membuat invoice
* mencatat activity log

## 5. Status Order

Status order utama:

| Status Sistem                | Label UI                    | Makna                                                |
| ---------------------------- | --------------------------- | ---------------------------------------------------- |
| draft                        | Draft                       | Order belum final atau masih dalam proses penyusunan |
| awaiting_payment             | Menunggu Pembayaran         | Checkout selesai, tetapi pembayaran belum berhasil   |
| paid                         | Dibayar                     | Pembayaran berhasil                                  |
| waiting_creator_confirmation | Menunggu Konfirmasi Kreator | Order sudah dibayar dan menunggu creator menerima    |
| brief_accepted               | Brief Diterima              | Creator sudah menerima order dan brief               |
| in_progress                  | Konten Diproduksi           | Creator sedang mengerjakan konten                    |
| submitted                    | Hasil Dikirim               | Creator mengirim draft/hasil konten                  |
| revision_requested           | Revisi Diminta              | UMKM meminta perbaikan                               |
| revised                      | Revisi Dikirim              | Creator mengirim hasil revisi                        |
| completed                    | Selesai                     | UMKM menyetujui hasil dan order ditutup              |
| cancelled                    | Dibatalkan                  | Order dibatalkan                                     |
| refunded                     | Refund                      | Dana dikembalikan sebagian/penuh                     |

## 6. Status Pembayaran

Status pembayaran utama:

| Status Sistem      | Label UI            | Makna                        |
| ------------------ | ------------------- | ---------------------------- |
| pending            | Menunggu Pembayaran | Pembayaran belum selesai     |
| paid               | Dibayar             | Pembayaran berhasil          |
| failed             | Gagal               | Pembayaran gagal             |
| expired            | Kedaluwarsa         | Batas waktu pembayaran habis |
| refunded           | Refund              | Dana dikembalikan penuh      |
| partially_refunded | Refund Sebagian     | Dana dikembalikan sebagian   |

## 7. Alur Utama Order

### 7.1 Dari Katalog ke Keranjang

1. UMKM membuka halaman katalog.
2. UMKM mencari kreator atau layanan.
3. UMKM memfilter berdasarkan kategori, harga, lokasi, niche, rating, dan ketersediaan.
4. UMKM membuka detail kreator atau detail paket jasa.
5. UMKM membaca informasi layanan:

   * nama layanan
   * nama creator
   * harga
   * output
   * estimasi pengerjaan
   * jumlah revisi
   * portofolio
   * review
6. UMKM klik “Tambah ke Keranjang” atau “Pesan Sekarang”.
7. Sistem menambahkan paket jasa ke cart milik UMKM.

Status pada tahap ini:

* belum ada order final
* cart aktif
* payment belum dibuat
* brief belum final

### 7.2 Dari Keranjang ke Checkout

1. UMKM membuka keranjang layanan.
2. Sistem menampilkan ringkasan layanan:

   * paket jasa
   * creator
   * tier paket
   * harga
   * add-on
   * biaya admin
   * total sementara
3. UMKM mengecek detail.
4. UMKM klik “Lanjut Checkout”.
5. Sistem membawa UMKM ke halaman checkout.

Status pada tahap ini:

* cart masih aktif
* belum ada payment
* order belum final atau masih draft

### 7.3 Checkout Brief Campaign

1. UMKM mengisi form brief campaign.
2. Field yang diisi:

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
   * aset pendukung jika ada
3. Sistem memvalidasi brief.
4. Jika brief belum lengkap, sistem menampilkan pesan error.
5. Jika brief valid, sistem membuat campaign brief.
6. Sistem membuat order awal.
7. Sistem menghitung total pembayaran.
8. Order masuk status `awaiting_payment`.
9. Payment dibuat dengan status `pending`.

Output tahap ini:

* campaign brief dibuat
* order dibuat
* order number dibuat
* payment dibuat
* invoice placeholder dibuat
* UMKM diarahkan ke halaman pembayaran

### 7.4 Pembayaran

1. UMKM membuka halaman pembayaran.
2. Sistem menampilkan ringkasan:

   * order number
   * nama creator
   * paket jasa
   * subtotal
   * add-on
   * biaya admin
   * platform fee jika ditampilkan
   * total pembayaran
3. UMKM memilih metode pembayaran.
4. Pada MVP awal, payment bisa dummy.
5. Pada tahap payment gateway, server membuat payment request.
6. Jika pembayaran berhasil, payment status berubah menjadi `paid`.
7. Order status berubah menjadi `paid`.
8. System menambahkan status history.
9. System memberi notifikasi ke UMKM dan creator.
10. Order masuk ke tahap menunggu konfirmasi creator.

Status setelah pembayaran berhasil:

* payment_status: paid
* order_status: paid atau waiting_creator_confirmation

Catatan:

Client tidak boleh langsung mengubah payment status menjadi paid. Status paid harus berasal dari server, webhook, atau admin action yang tervalidasi.

### 7.5 Konfirmasi Creator

1. Creator membuka dashboard.
2. Creator melihat order baru.
3. Creator membuka detail order.
4. Creator membaca brief campaign.
5. Creator mengecek scope, deadline, dan output.
6. Creator menerima order.
7. Order status berubah menjadi `brief_accepted`.
8. System mencatat status history.
9. System memberi notifikasi ke UMKM.

Jika creator menolak order:

1. Creator memberi alasan.
2. Order masuk review admin atau cancelled.
3. Admin menentukan apakah order dibatalkan atau dialihkan.
4. Jika perlu, refund diproses.

Catatan:

Pada MVP awal, aksi menolak order bisa belum dibuat. Minimal, creator dapat menerima order dan melanjutkan produksi.

### 7.6 Produksi Konten

1. Creator klik “Mulai Pengerjaan”.
2. Order status berubah menjadi `in_progress`.
3. Creator mulai membuat konten sesuai brief.
4. UMKM dapat melihat status “Konten Diproduksi”.
5. Admin dapat memantau order aktif.

Data yang relevan:

* deadline
* brief campaign
* output layanan
* jumlah revisi
* catatan order
* status timeline

### 7.7 Pengiriman Hasil Konten

1. Creator membuka detail order.
2. Creator mengisi form pengiriman hasil.
3. Creator mengunggah file atau memasukkan link.
4. Jenis hasil:

   * file video
   * desain feed
   * foto produk
   * caption
   * link Google Drive
   * link TikTok/Instagram
   * link unggahan publik
5. Creator menambahkan catatan hasil.
6. System membuat submission.
7. Order status berubah menjadi `submitted`.
8. System menambahkan status history.
9. System memberi notifikasi ke UMKM.

Catatan:

Pada MVP awal, upload file bisa berupa placeholder atau input link. Upload video besar belum menjadi prioritas.

### 7.8 Review Hasil oleh UMKM

Setelah hasil dikirim, UMKM memiliki dua pilihan utama:

1. Menyetujui hasil.
2. Meminta revisi.

Jika UMKM menyetujui hasil:

* order status berubah menjadi `completed`
* completed_at diisi
* UMKM dapat memberi review
* data masuk ke laporan penjualan

Jika UMKM meminta revisi:

* UMKM mengisi catatan revisi
* system membuat revision request
* order status berubah menjadi `revision_requested`
* creator menerima notifikasi revisi

### 7.9 Proses Revisi

1. UMKM mengirim catatan revisi.
2. Creator membaca catatan revisi.
3. Creator mengerjakan revisi.
4. Creator mengirim hasil revisi.
5. System membuat submission versi baru atau menandai revision selesai.
6. Order status berubah menjadi `revised`.
7. UMKM melihat hasil revisi.
8. UMKM dapat menyetujui atau meminta revisi lagi jika batas revisi masih tersedia.

Catatan:

Jumlah revisi mengikuti paket jasa.

Contoh:

* Basic: 1 revisi
* Standard: 1 revisi
* Premium: 2 revisi

Jika revisi sudah melewati batas, opsi lanjutan:

* UMKM menyetujui hasil.
* UMKM membeli revisi tambahan.
* UMKM membuat komplain.
* Admin melakukan mediasi.

### 7.10 Penyelesaian Order

Order selesai ketika UMKM menyetujui hasil.

Proses:

1. UMKM klik “Selesaikan Pesanan”.
2. System mengubah order status menjadi `completed`.
3. System mengisi `completed_at`.
4. System menambahkan status history.
5. System membuka form review.
6. UMKM dapat memberi rating dan komentar.
7. Creator melihat review.
8. Admin melihat order masuk laporan selesai.

Status final:

* order_status: completed
* payment_status: paid

## 8. Alur Review

Review hanya dapat dibuat setelah order selesai.

Syarat review:

1. User adalah UMKM pemilik order.
2. Order status adalah `completed`.
3. Belum ada review untuk order tersebut.
4. Creator yang direview adalah creator dalam order tersebut.

Data review:

* rating keseluruhan
* kualitas hasil
* komunikasi
* ketepatan waktu
* komentar
* tanggal review

Review tampil di:

* detail creator
* detail layanan
* dashboard creator
* admin moderation

## 9. Alur Komplain

Komplain dibuat jika terjadi masalah yang tidak selesai melalui revisi biasa.

### 9.1 Komplain dari UMKM

UMKM dapat membuat komplain jika:

* hasil tidak sesuai brief
* creator terlambat
* file tidak bisa diakses
* creator tidak merespons
* revisi tidak diselesaikan
* UMKM meminta refund

### 9.2 Komplain dari Creator

Creator dapat membuat komplain jika:

* brief tidak jelas atau berubah jauh
* UMKM meminta revisi di luar scope
* UMKM tidak merespons
* UMKM meminta output tambahan tanpa add-on
* ada miskomunikasi serius

### 9.3 Proses Komplain

1. Pihak terkait membuat komplain.
2. Complaint status menjadi `open`.
3. Admin melihat komplain.
4. Admin mengubah status menjadi `under_review`.
5. Admin meminta klarifikasi jika perlu.
6. Admin memberi keputusan:

   * order dilanjutkan
   * revisi tambahan diberikan
   * order dibatalkan
   * refund sebagian
   * refund penuh
   * komplain ditolak
7. Admin menulis resolution note.
8. Complaint status menjadi `resolved` atau `rejected`.
9. Activity log dibuat.

## 10. Alur Pembatalan

Order dapat dibatalkan dalam kondisi tertentu.

### 10.1 Pembatalan Sebelum Pembayaran

Jika order masih `awaiting_payment`, UMKM dapat membatalkan order.

Dampak:

* order_status: cancelled
* payment_status: expired atau pending dibatalkan
* tidak perlu refund

### 10.2 Pembatalan Setelah Pembayaran

Jika pembayaran sudah berhasil, pembatalan harus melalui admin.

Alasan:

* creator tidak menerima order
* creator tidak merespons
* brief tidak sesuai aturan
* order dibuat salah
* terjadi sengketa
* platform memutuskan refund

Dampak:

* order_status: cancelled atau refunded
* payment_status: refunded atau partially_refunded
* activity log dibuat
* admin menulis alasan

### 10.3 Creator Menolak Order

Jika creator menolak order setelah pembayaran:

1. Creator memberi alasan.
2. Admin meninjau.
3. Admin dapat:

   * mencari creator pengganti
   * membatalkan order
   * memproses refund
   * meminta UMKM memilih layanan lain

Untuk MVP awal, creator reject bisa ditunda agar flow lebih sederhana.

## 11. Alur Refund

Refund adalah proses sensitif dan tidak wajib penuh di MVP awal.

### 11.1 Jenis Refund

1. Full refund
2. Partial refund
3. No refund

### 11.2 Kondisi Full Refund

Full refund dapat diberikan jika:

* creator tidak menerima order
* creator tidak mengerjakan sama sekali
* payment terduplikasi
* order dibatalkan sebelum produksi
* kesalahan sistem

### 11.3 Kondisi Partial Refund

Partial refund dapat diberikan jika:

* sebagian pekerjaan sudah dilakukan
* hasil sebagian dapat digunakan
* terjadi kesepakatan mediasi
* creator terlambat tetapi tetap mengirim hasil

### 11.4 Kondisi No Refund

Refund dapat ditolak jika:

* UMKM menyetujui hasil
* order sudah completed
* permintaan revisi di luar scope
* brief berubah jauh dari kesepakatan awal
* komplain tidak terbukti

### 11.5 Implementasi MVP

Pada MVP awal:

* refund cukup sebagai status UI
* admin dapat melihat tombol dummy “Proses Refund”
* tidak perlu integrasi real payment refund

Pada tahap lanjutan:

* refund harus melalui payment gateway
* refund harus tercatat di payments
* refund harus tercatat di activity_logs
* invoice harus memperlihatkan refund

## 12. Order Status Transition Table

Tabel ini menjadi acuan implementasi server.

| Current Status               | Target Status                | Actor                | Keterangan                |
| ---------------------------- | ---------------------------- | -------------------- | ------------------------- |
| draft                        | awaiting_payment             | UMKM/System          | Checkout dibuat           |
| awaiting_payment             | paid                         | Server/Webhook/Admin | Pembayaran berhasil       |
| paid                         | waiting_creator_confirmation | System               | Order menunggu creator    |
| waiting_creator_confirmation | brief_accepted               | Creator              | Creator menerima order    |
| brief_accepted               | in_progress                  | Creator              | Creator mulai produksi    |
| in_progress                  | submitted                    | Creator              | Creator mengirim hasil    |
| submitted                    | revision_requested           | UMKM                 | UMKM meminta revisi       |
| revision_requested           | revised                      | Creator              | Creator mengirim revisi   |
| revised                      | completed                    | UMKM                 | UMKM menyetujui revisi    |
| submitted                    | completed                    | UMKM                 | UMKM menyetujui hasil     |
| awaiting_payment             | cancelled                    | UMKM/System/Admin    | Order belum dibayar       |
| paid                         | cancelled                    | Admin                | Pembatalan setelah bayar  |
| cancelled                    | refunded                     | Admin/Server         | Refund setelah pembatalan |
| paid                         | refunded                     | Admin/Server         | Refund langsung           |
| in_progress                  | cancelled                    | Admin                | Kondisi khusus            |
| submitted                    | cancelled                    | Admin                | Kondisi khusus            |

## 13. Forbidden Transition

Perubahan status yang dilarang:

| Dilarang                                     | Alasan                                              |
| -------------------------------------------- | --------------------------------------------------- |
| awaiting_payment → completed                 | Belum dibayar dan belum dikerjakan                  |
| awaiting_payment → in_progress               | Creator tidak boleh bekerja sebelum payment valid   |
| UMKM mengubah pending payment menjadi paid   | Payment harus diverifikasi server                   |
| Creator mengubah submitted menjadi completed | Approval harus dari UMKM                            |
| Creator mengubah paid menjadi refunded       | Refund adalah wewenang admin/server                 |
| Guest mengubah status apa pun                | Guest tidak punya order                             |
| completed → in_progress                      | Order selesai tidak boleh kembali tanpa admin audit |
| cancelled → in_progress                      | Order batal tidak boleh diproses ulang              |
| refunded → completed                         | Order refund tidak boleh dianggap selesai           |

## 14. UI Timeline Status

Timeline status harus mudah dipahami UMKM.

### 14.1 Timeline Normal

1. Pembayaran Berhasil
2. Brief Diterima
3. Konten Diproduksi
4. Hasil Dikirim
5. Pesanan Selesai

### 14.2 Timeline dengan Revisi

1. Pembayaran Berhasil
2. Brief Diterima
3. Konten Diproduksi
4. Hasil Dikirim
5. Revisi Diminta
6. Revisi Dikirim
7. Pesanan Selesai

### 14.3 Timeline Pembatalan

1. Order Dibuat
2. Menunggu Pembayaran
3. Dibatalkan

atau:

1. Pembayaran Berhasil
2. Menunggu Konfirmasi
3. Dibatalkan
4. Refund Diproses

### 14.4 Label UI yang Disarankan

Gunakan label:

* Menunggu Pembayaran
* Pembayaran Berhasil
* Menunggu Konfirmasi Kreator
* Brief Diterima
* Konten Diproduksi
* Hasil Dikirim
* Revisi Diminta
* Revisi Dikirim
* Selesai
* Dibatalkan
* Refund

Jangan gunakan:

* Packing
* Shipping
* Shipped
* Delivered
* Resi
* Kurir
* Gudang

## 15. Halaman yang Terlibat dalam Order Flow

### 15.1 Public

| Route                  | Fungsi                      |
| ---------------------- | --------------------------- |
| `/`                    | Mengarahkan user ke katalog |
| `/katalog`             | Mencari kreator/layanan     |
| `/kreator/[creatorId]` | Melihat detail kreator      |
| `/layanan/[serviceId]` | Melihat detail paket jasa   |

### 15.2 UMKM

| Route                        | Fungsi                    |
| ---------------------------- | ------------------------- |
| `/umkm/cart`                 | Melihat keranjang layanan |
| `/umkm/checkout`             | Mengisi brief campaign    |
| `/umkm/payments/[paymentId]` | Melihat pembayaran        |
| `/umkm/orders`               | Melihat daftar pesanan    |
| `/umkm/orders/[orderId]`     | Melihat detail order      |
| `/umkm/results`              | Melihat hasil konten      |

### 15.3 Creator

| Route                       | Fungsi                           |
| --------------------------- | -------------------------------- |
| `/creator/orders`           | Melihat order masuk              |
| `/creator/orders/[orderId]` | Membaca brief dan mengirim hasil |
| `/creator/dashboard`        | Melihat ringkasan order          |

### 15.4 Admin

| Route                     | Fungsi                     |
| ------------------------- | -------------------------- |
| `/admin/orders`           | Memantau seluruh order     |
| `/admin/orders/[orderId]` | Melihat detail dan mediasi |
| `/admin/payments`         | Memantau pembayaran        |
| `/admin/complaints`       | Menangani komplain         |
| `/admin/reports`          | Melihat laporan penjualan  |

## 16. Data yang Dibuat di Setiap Tahap

### 16.1 Add to Cart

Data:

* carts
* cart_items
* cart_item_addons jika ada

### 16.2 Checkout Brief

Data:

* campaign_briefs
* orders
* order_items
* order_item_addons jika ada
* order_status_history

### 16.3 Payment

Data:

* payments
* invoices
* order_status_history
* notifications

### 16.4 Creator Accept Order

Data:

* orders updated
* order_status_history
* notifications

### 16.5 Creator Submit Result

Data:

* submissions
* orders updated
* order_status_history
* notifications

### 16.6 UMKM Request Revision

Data:

* revisions
* orders updated
* order_status_history
* notifications

### 16.7 Creator Submit Revision

Data:

* submissions atau revisions updated
* orders updated
* order_status_history
* notifications

### 16.8 UMKM Complete Order

Data:

* orders updated
* order_status_history
* notifications
* reports updated secara query

### 16.9 UMKM Submit Review

Data:

* reviews
* creator_profiles.average_rating updated
* creator_profiles.completed_orders_count updated

## 17. API Routes yang Terlibat

### 17.1 `/api/checkout`

Fungsi:

* menerima data cart dan brief
* validasi user UMKM
* validasi item cart
* hitung total pembayaran
* buat campaign brief
* buat order
* buat order item
* buat payment pending
* buat invoice placeholder
* return order id dan payment id

### 17.2 `/api/payments/create`

Fungsi:

* membuat payment request
* menerima order id
* validasi order milik UMKM
* validasi payment pending
* membuat payment gateway token/URL pada tahap sandbox
* return payment URL

### 17.3 `/api/payments/webhook`

Fungsi:

* menerima notifikasi dari payment gateway
* validasi signature
* cek provider_transaction_id
* cek amount
* update payment status
* update order payment status
* update order status
* insert order_status_history
* insert activity_logs

### 17.4 `/api/orders/[orderId]/status`

Fungsi:

* mengubah status order
* validasi role
* validasi ownership
* validasi status transition
* insert order_status_history
* return order terbaru

### 17.5 `/api/orders/[orderId]/revision`

Fungsi:

* membuat atau menanggapi revisi
* validasi role
* validasi order
* cek batas revisi
* update order status
* insert status history

### 17.6 `/api/upload`

Fungsi:

* upload aset brief
* upload portofolio
* upload hasil konten
* validasi role dan ownership
* validasi file type
* validasi file size

## 18. Dashboard Impact

### 18.1 UMKM Dashboard

Data yang ditampilkan:

* pesanan aktif
* pesanan selesai
* pembayaran pending
* hasil konten terbaru
* brief tersimpan
* order yang menunggu review
* rekomendasi kreator

Status yang perlu ditonjolkan:

* Menunggu Pembayaran
* Konten Diproduksi
* Hasil Dikirim
* Revisi Diminta
* Selesai

### 18.2 Creator Dashboard

Data yang ditampilkan:

* order masuk
* order aktif
* deadline terdekat
* revisi aktif
* rating rata-rata
* estimasi pendapatan
* review terbaru

Status yang perlu ditonjolkan:

* Menunggu Konfirmasi
* Brief Diterima
* Konten Diproduksi
* Revisi Diminta
* Selesai

### 18.3 Admin Dashboard

Data yang ditampilkan:

* total order
* order aktif
* order selesai
* order dibatalkan
* pembayaran pending
* komplain aktif
* pendapatan platform
* layanan terlaris

Status yang perlu ditonjolkan:

* awaiting_payment
* paid
* in_progress
* submitted
* revision_requested
* completed
* cancelled
* refunded

## 19. Notification Trigger

Notifikasi muncul pada perubahan penting.

| Event                   | Penerima      | Isi Notifikasi                                     |
| ----------------------- | ------------- | -------------------------------------------------- |
| Order dibuat            | UMKM          | Pesanan berhasil dibuat, silakan lanjut pembayaran |
| Payment berhasil        | UMKM, Creator | Pembayaran berhasil                                |
| Creator menerima order  | UMKM          | Brief diterima oleh creator                        |
| Konten mulai diproduksi | UMKM          | Creator mulai mengerjakan konten                   |
| Hasil dikirim           | UMKM          | Hasil konten sudah dikirim                         |
| Revisi diminta          | Creator       | UMKM meminta revisi                                |
| Revisi dikirim          | UMKM          | Hasil revisi sudah dikirim                         |
| Order selesai           | UMKM, Creator | Pesanan selesai                                    |
| Review dibuat           | Creator       | UMKM memberi review                                |
| Komplain dibuat         | Admin         | Komplain baru masuk                                |
| Refund diproses         | UMKM          | Refund diproses                                    |

## 20. Activity Log Trigger

Activity log digunakan untuk audit.

Event yang perlu dicatat:

* order_created
* payment_created
* payment_paid
* payment_failed
* order_status_changed
* creator_accepted_order
* creator_submitted_result
* revision_requested
* revision_submitted
* order_completed
* review_submitted
* complaint_opened
* complaint_resolved
* refund_processed
* admin_status_override

## 21. Validation Rules

### 21.1 Checkout Validation

Checkout valid jika:

* user login sebagai UMKM
* cart tidak kosong
* service package aktif
* creator aktif
* brief lengkap
* total dihitung server
* deadline valid
* payment belum dibuat untuk order yang sama

### 21.2 Payment Validation

Payment valid jika:

* order milik UMKM
* total amount sama dengan order total
* payment status masih pending
* provider transaction valid
* callback signature valid pada tahap gateway

### 21.3 Creator Action Validation

Creator action valid jika:

* creator adalah pemilik order
* order sudah dibayar
* status order sesuai
* order belum completed/cancelled/refunded

### 21.4 Revision Validation

Revision valid jika:

* order milik UMKM
* status order submitted atau revised
* batas revisi belum habis
* catatan revisi tidak kosong

### 21.5 Completion Validation

Order dapat selesai jika:

* user adalah UMKM pemilik order
* status order submitted atau revised
* hasil konten sudah ada
* order belum cancelled/refunded

### 21.6 Review Validation

Review valid jika:

* order completed
* user adalah UMKM pemilik order
* belum ada review untuk order tersebut
* rating 1 sampai 5

## 22. Edge Cases

### 22.1 UMKM Tidak Membayar

Jika payment melewati batas waktu:

* payment_status menjadi expired
* order_status menjadi cancelled atau tetap awaiting_payment dengan label expired
* cart dapat dipulihkan jika perlu

### 22.2 Creator Tidak Merespons

Jika creator tidak menerima order dalam batas waktu:

* admin mendapat notifikasi
* order masuk status review admin
* admin dapat membatalkan atau mengalihkan order
* refund dapat diproses

### 22.3 UMKM Tidak Merespons Hasil

Jika UMKM tidak memberi respons setelah hasil dikirim:

* sistem memberi reminder
* setelah batas tertentu, admin dapat meninjau
* auto-complete bisa menjadi fitur lanjutan, tetapi tidak masuk MVP awal

### 22.4 Revisi Melebihi Batas

Jika UMKM meminta revisi melebihi batas:

* sistem menampilkan batas revisi habis
* opsi add-on revisi tambahan dapat ditawarkan
* atau UMKM dapat membuat komplain jika hasil memang jauh dari brief

### 22.5 File Hasil Tidak Bisa Dibuka

Jika file tidak bisa dibuka:

* UMKM dapat meminta creator upload ulang
* creator dapat memperbarui link/file
* admin dapat meninjau jika terjadi sengketa

### 22.6 Creator Mengirim Hasil Tidak Sesuai

Jika hasil tidak sesuai brief:

* UMKM meminta revisi
* jika revisi tidak menyelesaikan masalah, UMKM membuat komplain
* admin melakukan mediasi

### 22.7 Payment Berhasil tapi Order Tidak Update

Jika webhook gagal:

* admin dapat melihat payment pending
* sistem bisa menyediakan tombol cek status payment
* server dapat melakukan retry atau payment status sync

### 22.8 Order Sudah Completed tapi Ada Komplain

Jika order sudah completed:

* normalnya tidak dapat direvisi lagi
* komplain pasca selesai bisa ditangani admin sebagai support issue
* refund setelah completed harus sangat terbatas dan perlu audit

## 23. MVP Order Flow

Untuk MVP awal, flow yang wajib dibangun:

1. UMKM melihat katalog.
2. UMKM memilih layanan.
3. UMKM masuk cart.
4. UMKM mengisi brief.
5. UMKM melihat payment dummy.
6. Payment dummy berhasil.
7. Order muncul di dashboard UMKM.
8. Order muncul di dashboard creator.
9. Creator melihat brief.
10. Creator mengirim hasil dummy/link.
11. UMKM melihat hasil.
12. UMKM meminta revisi atau menyelesaikan order.
13. UMKM memberi review.
14. Admin dapat melihat order.

Fitur yang boleh dummy:

* login role
* payment
* upload file
* notification
* invoice
* reports

Fitur yang harus tetap benar walaupun dummy:

* status order
* istilah jasa digital
* alur halaman
* hak role
* timeline order

## 24. Non-MVP Order Flow

Tidak masuk MVP awal:

* payment production
* escrow legal penuh
* payout otomatis
* custom offer
* milestone besar
* real-time chat
* auto-complete
* auto-refund
* dispute system kompleks
* AI order matching
* AI brief scoring

## 25. Order Flow and Sales Management

Dalam materi Sales Management, order management adalah bagian penting dari sales management. Untuk Ruang Usaha Kita, order flow mendukung sales management melalui:

1. Product/Service Management
   Order mencatat paket jasa apa yang paling banyak dipesan.

2. Customer Management
   Order mencatat UMKM mana yang aktif dan kebutuhan campaign mereka.

3. Creator Management
   Order mencatat creator yang aktif, tepat waktu, dan mendapat review baik.

4. Payment Management
   Order terhubung dengan payment dan invoice.

5. Digital Delivery Management
   Order menjadi tempat pengiriman hasil konten.

6. Review Management
   Order menjadi dasar rating creator.

7. Sales Analytics
   Order menjadi sumber data untuk laporan transaksi, pendapatan, dan layanan terlaris.

8. Reporting System
   Order menjadi data utama untuk admin report.

Dengan demikian, order flow bukan hanya proses transaksi, tetapi juga pusat data bisnis platform.

## 26. UI Copy Rules

Gunakan copywriting yang jelas dan natural.

### 26.1 Tombol

Gunakan:

* Tambah ke Keranjang
* Pesan Sekarang
* Lanjut Checkout
* Isi Brief Campaign
* Lanjut Pembayaran
* Saya Sudah Bayar
* Terima Order
* Mulai Pengerjaan
* Kirim Hasil
* Ajukan Revisi
* Kirim Revisi
* Selesaikan Pesanan
* Beri Review
* Hubungi Admin

Hindari:

* Kirim Barang
* Packing
* Cetak Resi
* Lacak Paket
* Pilih Kurir
* Alamat Pengiriman
* Ongkos Kirim
* COD

### 26.2 Status

Gunakan:

* Menunggu Pembayaran
* Pembayaran Berhasil
* Menunggu Konfirmasi Kreator
* Brief Diterima
* Konten Diproduksi
* Hasil Dikirim
* Revisi Diminta
* Revisi Dikirim
* Selesai
* Dibatalkan
* Refund

## 27. Suggested Components

Komponen yang dibutuhkan:

* order-status-badge
* order-status-timeline
* payment-status-badge
* order-summary-card
* checkout-stepper
* campaign-brief-preview
* submission-card
* revision-card
* review-form
* complaint-card
* invoice-summary
* creator-order-actions
* umkm-order-actions
* admin-order-actions
* activity-log-list

Lokasi folder:

```txt
src/components/dashboard/order-status-timeline.tsx
src/components/cards/order-card.tsx
src/components/common/status-badge.tsx
src/features/orders/components/order-summary-card.tsx
src/features/orders/components/order-actions.tsx
src/features/checkout/components/checkout-stepper.tsx
src/features/briefs/components/campaign-brief-preview.tsx
src/features/submissions/components/submission-card.tsx
src/features/revisions/components/revision-card.tsx
```

## 28. Suggested Server Functions

Fungsi server yang dibutuhkan:

```ts
createOrderFromCheckout()
createPaymentForOrder()
handlePaymentWebhook()
updateOrderStatus()
acceptOrderByCreator()
startOrderProduction()
submitOrderResult()
requestOrderRevision()
submitOrderRevision()
completeOrder()
cancelOrder()
processRefund()
createReview()
openComplaint()
resolveComplaint()
```

Setiap function harus:

* memvalidasi user
* memvalidasi role
* memvalidasi ownership
* memvalidasi status saat ini
* memvalidasi status tujuan
* menulis status history
* menulis activity log jika perlu

## 29. Testing Order Flow

### 29.1 Happy Path Test

Skenario:

1. UMKM membuat order.
2. UMKM membayar.
3. Creator menerima order.
4. Creator mulai produksi.
5. Creator mengirim hasil.
6. UMKM menyelesaikan order.
7. UMKM memberi review.

Expected result:

* order completed
* payment paid
* review created
* timeline lengkap

### 29.2 Revision Path Test

Skenario:

1. Creator mengirim hasil.
2. UMKM meminta revisi.
3. Creator mengirim revisi.
4. UMKM menyetujui revisi.

Expected result:

* revision created
* order revised
* order completed

### 29.3 Cancel Before Payment Test

Skenario:

1. UMKM checkout.
2. UMKM tidak membayar.
3. Order dibatalkan.

Expected result:

* order cancelled
* payment expired/pending cancelled
* tidak ada refund

### 29.4 Payment Security Test

Skenario:

1. User mencoba mengubah payment status dari client.
2. Server menolak.

Expected result:

* payment tetap pending
* tidak ada order paid tanpa validasi server

### 29.5 Role Protection Test

Skenario:

1. Creator mencoba menyelesaikan order.
2. Server menolak karena completed hanya oleh UMKM/admin.

Expected result:

* order tidak berubah
* error permission

## 30. Implementation Roadmap

### 30.1 Phase 1 — Dummy Flow

* data order dummy
* status timeline dummy
* payment dummy
* submission dummy
* revision dummy
* review dummy

Tujuan:

Membuktikan UI flow dari katalog sampai order selesai.

### 30.2 Phase 2 — Local State Flow

* cart store
* checkout form
* order object dummy
* status update dummy

Tujuan:

Membuat flow terasa hidup tanpa database.

### 30.3 Phase 3 — Supabase Order Data

* campaign_briefs
* orders
* order_items
* payments
* order_status_history
* submissions
* revisions
* reviews

Tujuan:

Menghubungkan UI dengan database.

### 30.4 Phase 4 — Auth and Ownership

* Supabase Auth
* role guard
* RLS
* ownership check

Tujuan:

Membuat order hanya bisa diakses pihak terkait.

### 30.5 Phase 5 — Payment Sandbox

* create payment API
* webhook API
* payment status sync
* invoice

Tujuan:

Membuat payment flow teknis berjalan.

### 30.6 Phase 6 — Admin Monitoring

* admin order list
* admin payment list
* complaint management
* reports

Tujuan:

Membuat sales management dan order management terlihat lengkap.

## 31. Definition of Done

Order flow dianggap selesai jika:

1. UMKM bisa membuat order dari layanan.
2. Brief campaign tersimpan.
3. Payment dummy atau sandbox berjalan.
4. Order memiliki status yang jelas.
5. Creator bisa melihat order masuk.
6. Creator bisa mengirim hasil.
7. UMKM bisa melihat hasil.
8. UMKM bisa meminta revisi.
9. Creator bisa mengirim revisi.
10. UMKM bisa menyelesaikan order.
11. UMKM bisa memberi review.
12. Admin bisa melihat order.
13. Status history tercatat.
14. UI tidak memakai istilah barang fisik.
15. Payment status dan order status terpisah.
16. Role action sesuai permission.
17. Edge case utama sudah dipikirkan.
18. Flow bisa dijelaskan sebagai e-commerce jasa digital.

## 32. Kesimpulan

Order flow Ruang Usaha Kita adalah adaptasi dari alur e-commerce ke konteks marketplace jasa digital. Alur tidak berhenti pada pembayaran, tetapi berlanjut ke penerimaan brief, produksi konten, pengiriman hasil, revisi, approval, review, dan laporan.

Pemisahan antara payment status dan order status menjadi aturan utama agar sistem tidak rancu. Selain itu, setiap perubahan status harus memiliki aktor yang jelas, validasi yang benar, dan catatan status history.

Dokumen ini menjadi pedoman utama saat membangun fitur cart, checkout, payment, order detail, status timeline, revision, review, dashboard creator, dashboard UMKM, dan admin monitoring.
