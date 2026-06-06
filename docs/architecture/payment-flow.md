# Ruang Usaha Kita — Payment Flow

## 1. Tujuan Dokumen

Dokumen ini menjelaskan rancangan alur pembayaran atau payment flow pada Ruang Usaha Kita. Payment flow menjadi bagian penting karena website ini adalah marketplace jasa digital yang memiliki proses transaksi antara UMKM, creator, dan platform.

Ruang Usaha Kita bukan toko barang fisik. Oleh karena itu, pembayaran tidak boleh dikaitkan dengan ongkir, kurir, alamat pengiriman, nomor resi, stok barang, atau pengiriman paket. Pembayaran pada platform ini berkaitan dengan pemesanan paket jasa digital, biaya admin, komisi platform, add-on layanan, invoice, status pembayaran, dan status pesanan.

Dokumen ini disusun untuk menjadi panduan sebelum membangun:

1. UI pembayaran.
2. Ringkasan checkout.
3. Invoice.
4. Dummy payment.
5. Payment gateway sandbox.
6. Midtrans integration.
7. Payment webhook.
8. Payment status.
9. Refund.
10. Payment security.
11. Admin payment monitoring.
12. Payment reporting.

## 2. Posisi Payment dalam E-Commerce

Dalam alur e-commerce umum, payment berada setelah cart dan checkout.

Alur umum:

Customer → Product → Cart → Checkout → Payment → Delivery → Review

Adaptasi Ruang Usaha Kita:

UMKM → Paket Jasa → Keranjang Layanan → Checkout Brief → Pembayaran → Produksi Konten → Pengiriman Hasil Konten → Revisi/Approval → Review

Payment menjadi titik transisi dari “niat memesan” menjadi “pesanan resmi yang dapat dikerjakan creator”.

Sebelum payment berhasil, creator belum wajib mengerjakan pesanan. Setelah payment berhasil, sistem dapat mengirim order ke creator untuk dikonfirmasi dan dikerjakan.

## 3. Prinsip Payment Flow

### 3.1 Payment Status Berbeda dari Order Status

Payment status menjelaskan kondisi pembayaran.

Order status menjelaskan kondisi pengerjaan jasa.

Keduanya harus dipisah.

Contoh:

* payment_status: pending
* order_status: awaiting_payment

atau:

* payment_status: paid
* order_status: in_progress

Payment sudah paid, tetapi order belum tentu selesai. Order baru selesai jika hasil konten sudah dikirim, direview, dan disetujui UMKM.

### 3.2 Total Pembayaran Harus Dihitung Server

Client tidak boleh menjadi sumber kebenaran untuk total pembayaran.

Client boleh menampilkan total, tetapi server harus menghitung ulang:

* harga paket jasa
* harga tier
* add-on
* biaya admin
* diskon jika ada
* platform fee jika ditampilkan
* total pembayaran final

Alasan:

User bisa memanipulasi data di browser. Jika server percaya total dari client, transaksi bisa dimanipulasi.

### 3.3 Payment Key Tidak Boleh Masuk Client

API key rahasia payment gateway tidak boleh digunakan di client component.

Tidak boleh:

* `MIDTRANS_SERVER_KEY` di browser
* service role key Supabase di browser
* secret payment key dengan prefix `NEXT_PUBLIC_`

Boleh:

* `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` jika memang dibutuhkan oleh Snap client
* `MIDTRANS_SERVER_KEY` hanya di server route
* `SUPABASE_SERVICE_ROLE_KEY` hanya di server

### 3.4 Payment Webhook Harus Server-Side

Perubahan status pembayaran tidak boleh mengandalkan tombol dari user.

Contoh buruk:

UMKM klik “Saya Sudah Bayar”, lalu sistem langsung mengubah status menjadi paid.

Contoh benar:

UMKM klik “Saya Sudah Bayar” hanya memicu pengecekan atau menampilkan status, tetapi status paid tetap harus berasal dari:

* webhook payment gateway
* API sync status dari server
* admin manual verification untuk mode manual

### 3.5 Payment MVP Boleh Dummy

Pada tahap awal, payment tidak harus langsung production.

Urutan paling aman:

1. UI payment dummy.
2. Dummy status change.
3. Midtrans Sandbox.
4. Payment webhook sandbox.
5. Admin monitoring.
6. Production payment.

Dengan urutan ini, alur e-commerce bisa selesai dulu tanpa tim tersangkut di integrasi teknis.

## 4. Role dalam Payment Flow

### 4.1 UMKM

UMKM adalah pihak yang membayar.

UMKM dapat:

* melihat ringkasan pembayaran
* memilih metode pembayaran
* membuat payment request
* membuka payment page
* melihat status pembayaran
* melihat invoice
* melihat riwayat transaksi
* meminta refund melalui komplain jika ada masalah

UMKM tidak boleh:

* mengubah payment status menjadi paid
* mengubah total pembayaran
* mengubah platform fee
* mengubah biaya admin
* mengubah invoice setelah dibuat
* melihat pembayaran user lain

### 4.2 Creator

Creator adalah pihak yang mengerjakan jasa.

Creator dapat:

* melihat status pembayaran order yang ditujukan kepadanya
* melihat apakah order sudah aman untuk dikerjakan
* melihat estimasi pendapatan
* melihat riwayat order paid/completed

Creator tidak boleh:

* mengubah payment status
* membuat payment untuk UMKM
* melihat detail payment UMKM lain
* mengubah total pembayaran
* memproses refund
* mengakses payment gateway key

### 4.3 Admin

Admin adalah pengelola platform.

Admin dapat:

* melihat semua payment
* melihat invoice
* melihat status payment gateway
* melihat payment pending
* melihat payment failed
* melihat payment expired
* memproses refund administratif
* memberi catatan manual
* melakukan override terbatas dengan audit log
* melihat laporan pendapatan platform

Admin tidak boleh:

* menghapus payment history
* mengubah payment status tanpa alasan dan audit log
* mengekspos payment key
* memproses refund tanpa catatan

### 4.4 System / Server

System adalah proses otomatis dari server.

System dapat:

* menghitung total pembayaran
* membuat payment record
* membuat invoice
* membuat Midtrans transaction
* menerima webhook
* memverifikasi signature
* mengubah payment status
* mengubah order status setelah payment valid
* membuat notification
* membuat activity log

## 5. Komponen Biaya

Komponen pembayaran Ruang Usaha Kita terdiri dari beberapa bagian.

### 5.1 Harga Paket Jasa

Harga utama dari layanan yang dipilih UMKM.

Contoh:

* Basic Video Reels: Rp150.000
* Standard Video Reels: Rp300.000
* Premium Video Reels: Rp500.000

### 5.2 Add-on

Biaya tambahan jika UMKM memilih layanan ekstra.

Contoh:

* bantuan penyusunan brief
* revisi tambahan
* caption tambahan
* file mentah
* pengerjaan lebih cepat

### 5.3 Biaya Admin

Biaya tetap dari platform.

Contoh awal:

Rp5.000 per transaksi

Biaya admin dapat diatur melalui `platform_settings`.

### 5.4 Platform Fee

Komisi platform dari transaksi.

Contoh:

10% dari harga layanan

Catatan:

Pada UI untuk UMKM, platform fee bisa tidak ditampilkan terpisah jika sudah dimasukkan dalam harga layanan. Namun, untuk laporan internal, platform fee tetap perlu dihitung.

### 5.5 Diskon

Diskon adalah fitur lanjutan.

Contoh:

* voucher UMKM baru
* promo kategori tertentu
* referral

Tidak wajib pada MVP awal.

### 5.6 Total Pembayaran

Rumus sederhana:

```txt
total_pembayaran = harga_paket + add_on + biaya_admin - diskon
```

Jika platform fee ditampilkan ke user:

```txt
total_pembayaran = harga_paket + add_on + biaya_admin + platform_fee - diskon
```

Namun untuk marketplace jasa, platform fee sering dihitung sebagai bagian dari pendapatan internal platform, bukan selalu ditampilkan sebagai biaya tambahan ke UMKM.

## 6. Contoh Perhitungan

### 6.1 Tanpa Add-on

Paket jasa:

Standard Video Reels/TikTok = Rp300.000

Biaya admin:

Rp5.000

Total dibayar UMKM:

Rp305.000

Jika platform mengambil komisi 10% dari harga jasa:

Platform fee internal = Rp30.000

Estimasi bagian creator sebelum potongan lain:

Rp270.000

### 6.2 Dengan Add-on

Paket jasa:

Standard Video Reels/TikTok = Rp300.000

Add-on:

Bantuan brief campaign = Rp150.000

Biaya admin:

Rp5.000

Total dibayar UMKM:

Rp455.000

Jika platform fee 10% hanya dari harga jasa utama:

Platform fee internal = Rp30.000

Jika platform fee 10% dari harga jasa + add-on:

Platform fee internal = Rp45.000

Catatan:

Untuk tahap awal, tentukan satu aturan agar tidak membingungkan. Rekomendasi MVP:

* platform fee dihitung dari subtotal layanan + add-on
* admin fee tetap
* diskon belum dipakai

## 7. Payment Status

Status pembayaran utama:

| Status Sistem      | Label UI            | Makna                                |
| ------------------ | ------------------- | ------------------------------------ |
| pending            | Menunggu Pembayaran | Payment dibuat tetapi belum berhasil |
| paid               | Dibayar             | Pembayaran berhasil                  |
| failed             | Gagal               | Pembayaran gagal                     |
| expired            | Kedaluwarsa         | Batas waktu pembayaran habis         |
| refunded           | Refund              | Dana dikembalikan penuh              |
| partially_refunded | Refund Sebagian     | Dana dikembalikan sebagian           |

## 8. Hubungan Payment Status dan Order Status

Payment status memengaruhi order status.

| Payment Status     | Dampak ke Order                                                |
| ------------------ | -------------------------------------------------------------- |
| pending            | order_status tetap awaiting_payment                            |
| paid               | order_status berubah ke paid atau waiting_creator_confirmation |
| failed             | order dapat tetap awaiting_payment atau payment_failed label   |
| expired            | order dapat dibatalkan atau payment expired                    |
| refunded           | order_status menjadi refunded                                  |
| partially_refunded | order tetap cancelled/refunded/partial sesuai keputusan admin  |

Mapping dasar:

| Kondisi                 | payment_status     | order_status                                  |
| ----------------------- | ------------------ | --------------------------------------------- |
| Order baru dibuat       | pending            | awaiting_payment                              |
| Payment berhasil        | paid               | paid                                          |
| Sistem kirim ke creator | paid               | waiting_creator_confirmation                  |
| Creator terima          | paid               | brief_accepted                                |
| Creator produksi        | paid               | in_progress                                   |
| Creator kirim hasil     | paid               | submitted                                     |
| UMKM minta revisi       | paid               | revision_requested                            |
| Order selesai           | paid               | completed                                     |
| Refund penuh            | refunded           | refunded                                      |
| Refund sebagian         | partially_refunded | refunded atau completed dengan catatan khusus |

## 9. Metode Pembayaran

Metode pembayaran yang bisa disediakan pada UI:

1. Transfer Bank
2. Virtual Account
3. QRIS
4. E-wallet
5. Kartu Debit/Kredit
6. Manual Payment untuk tahap dummy

Untuk MVP awal:

* tampilkan pilihan metode sebagai UI
* belum perlu transaksi nyata
* klik bayar dapat mengubah status dummy atau mengarah ke halaman simulasi

Untuk Midtrans Sandbox:

* gunakan metode yang tersedia di sandbox
* sistem menerima status dari webhook
* tidak ada uang asli bergerak

Untuk production:

* aktifkan metode pembayaran sesuai kebutuhan bisnis
* hitung fee per metode
* pastikan akun merchant, domain, callback URL, dan dokumen bisnis siap

## 10. Tahapan Implementasi Payment

### 10.1 Phase 1 — UI Payment Dummy

Tujuan:

Membuat alur payment terlihat dan dapat dipahami.

Fitur:

* halaman pembayaran
* ringkasan pembayaran
* pilihan metode pembayaran
* tombol “Bayar Sekarang”
* status “Menunggu Pembayaran”
* tombol “Simulasikan Pembayaran Berhasil”
* invoice placeholder

Tidak ada:

* Midtrans
* webhook
* transaksi asli
* API key
* refund real

Output:

User dapat memahami flow dari checkout ke payment lalu ke order status.

### 10.2 Phase 2 — Server Dummy Payment

Tujuan:

Membuat payment diproses melalui server, bukan hanya state frontend.

Fitur:

* `/api/payments/create`
* payment record dummy
* payment status pending
* admin/manual action untuk paid
* order status update server-side

Output:

Payment flow mulai mengikuti pola backend yang aman.

### 10.3 Phase 3 — Midtrans Sandbox

Tujuan:

Menghubungkan sistem ke Midtrans Sandbox.

Fitur:

* Midtrans Snap sandbox
* create transaction
* redirect/payment popup
* callback URL
* webhook notification
* update payment status
* update order status

Output:

Pembayaran dapat diuji seperti real tanpa uang asli.

### 10.4 Phase 4 — Payment Webhook Hardening

Tujuan:

Membuat webhook aman dan reliable.

Fitur:

* signature validation
* idempotency check
* amount validation
* order id validation
* duplicate webhook handling
* activity log
* retry strategy
* error logging

Output:

Webhook tidak mudah salah update status.

### 10.5 Phase 5 — Production Payment

Tujuan:

Menerima pembayaran real.

Syarat:

* akun merchant production aktif
* domain production siap
* environment variable production aman
* webhook production URL benar
* test end-to-end selesai
* admin monitoring siap
* refund policy jelas
* legal/ketentuan layanan siap

## 11. UI Payment Flow

### 11.1 Checkout Summary

Halaman checkout harus menampilkan ringkasan:

* nama kreator
* nama paket jasa
* tier paket
* output layanan
* estimasi pengerjaan
* subtotal
* add-on
* biaya admin
* total pembayaran

CTA:

* Lanjut ke Pembayaran

### 11.2 Payment Page

Halaman pembayaran menampilkan:

* order number
* payment number
* total pembayaran
* metode pembayaran
* status pembayaran
* instruksi pembayaran
* batas waktu pembayaran
* tombol bayar
* tombol cek status
* tombol lihat pesanan

Label status:

* Menunggu Pembayaran
* Pembayaran Berhasil
* Pembayaran Gagal
* Pembayaran Kedaluwarsa

### 11.3 Payment Success State

Setelah pembayaran berhasil:

Tampilkan:

* ikon sukses
* teks “Pembayaran Berhasil”
* order number
* total pembayaran
* tombol “Lihat Pesanan”

Arahkan ke:

`/umkm/orders/[orderId]`

### 11.4 Payment Failed State

Jika pembayaran gagal:

Tampilkan:

* teks “Pembayaran Gagal”
* alasan jika ada
* tombol “Coba Lagi”
* tombol “Kembali ke Checkout”

### 11.5 Payment Expired State

Jika pembayaran kedaluwarsa:

Tampilkan:

* teks “Batas pembayaran sudah habis”
* tombol “Buat Pembayaran Baru”
* tombol “Kembali ke Pesanan”

## 12. Invoice Flow

### 12.1 Invoice Dibuat

Invoice dibuat saat checkout menghasilkan order dan payment.

Data invoice:

* invoice number
* order number
* payment number
* tanggal invoice
* nama UMKM
* nama kreator
* nama paket jasa
* subtotal
* add-on
* biaya admin
* diskon
* total
* payment status

### 12.2 Invoice Status

Invoice mengikuti payment status.

| Payment Status     | Invoice Label   |
| ------------------ | --------------- |
| pending            | Belum Dibayar   |
| paid               | Lunas           |
| failed             | Gagal           |
| expired            | Kedaluwarsa     |
| refunded           | Refund          |
| partially_refunded | Refund Sebagian |

### 12.3 Invoice PDF

PDF invoice tidak wajib pada MVP awal.

MVP cukup:

* halaman invoice
* ringkasan pembayaran
* nomor invoice
* status pembayaran

PDF bisa menjadi fitur lanjutan.

## 13. Database Tables yang Terlibat

Tabel utama:

1. `orders`
2. `order_items`
3. `payments`
4. `invoices`
5. `order_status_history`
6. `platform_settings`
7. `activity_logs`
8. `notifications`
9. `complaints`

## 14. Tabel Payments

Struktur konseptual:

```sql
create table payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  payment_number text not null unique,
  payment_status payment_status not null default 'pending',
  payment_method payment_method,
  amount numeric(12,2) not null,
  provider text,
  provider_transaction_id text,
  provider_payment_url text,
  paid_at timestamptz,
  expired_at timestamptz,
  raw_response jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

Field penting:

| Field                   | Fungsi                                    |
| ----------------------- | ----------------------------------------- |
| order_id                | Order yang dibayar                        |
| payment_number          | Nomor pembayaran internal                 |
| payment_status          | Status pembayaran                         |
| payment_method          | Metode pembayaran                         |
| amount                  | Total pembayaran                          |
| provider                | Nama gateway, contoh midtrans             |
| provider_transaction_id | ID transaksi dari provider                |
| provider_payment_url    | URL pembayaran jika ada                   |
| raw_response            | Response mentah dari provider untuk audit |

## 15. Tabel Invoices

Struktur konseptual:

```sql
create table invoices (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  payment_id uuid references payments(id) on delete set null,
  invoice_number text not null unique,
  subtotal_amount numeric(12,2) not null,
  addon_amount numeric(12,2) not null default 0,
  admin_fee numeric(12,2) not null default 0,
  platform_fee numeric(12,2) not null default 0,
  discount_amount numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null,
  issued_at timestamptz not null default now(),
  paid_at timestamptz,
  invoice_url text,
  created_at timestamptz not null default now()
);
```

## 16. Tabel Platform Settings

Platform settings menyimpan konfigurasi biaya.

Contoh:

| Key                        | Value                    |
| -------------------------- | ------------------------ |
| admin_fee                  | {"amount": 5000}         |
| platform_fee_percentage    | {"percentage": 10}       |
| payment_expiry_hours       | {"hours": 24}            |
| minimum_transaction_amount | {"amount": 10000}        |
| payment_provider           | {"provider": "midtrans"} |

## 17. Payment API Routes

### 17.1 `/api/payments/create`

Fungsi:

Membuat payment request untuk order tertentu.

Method:

`POST`

Request body:

```json
{
  "orderId": "uuid-order",
  "paymentMethod": "qris"
}
```

Server harus:

1. Mengecek user login.
2. Mengecek role user adalah UMKM.
3. Mengecek order milik UMKM tersebut.
4. Mengecek order belum dibayar.
5. Menghitung ulang total dari database.
6. Membuat payment record.
7. Membuat invoice jika belum ada.
8. Jika dummy, return dummy payment.
9. Jika Midtrans, buat transaksi ke Midtrans.
10. Return payment URL atau token.

Response dummy:

```json
{
  "paymentId": "uuid-payment",
  "orderId": "uuid-order",
  "status": "pending",
  "paymentUrl": "/umkm/payments/uuid-payment"
}
```

Response Midtrans Snap:

```json
{
  "paymentId": "uuid-payment",
  "orderId": "uuid-order",
  "status": "pending",
  "snapToken": "token",
  "redirectUrl": "midtrans-payment-url"
}
```

### 17.2 `/api/payments/webhook`

Fungsi:

Menerima notifikasi dari payment gateway.

Method:

`POST`

Server harus:

1. Menerima payload dari gateway.
2. Memverifikasi signature.
3. Mengecek order id.
4. Mengecek amount.
5. Mengecek transaction status.
6. Cek apakah webhook sudah pernah diproses.
7. Update payment status.
8. Update order payment_status.
9. Update order_status jika payment sukses.
10. Insert order_status_history.
11. Insert activity_logs.
12. Insert notification.
13. Return 200 jika berhasil.

Response:

```json
{
  "ok": true
}
```

### 17.3 `/api/payments/[paymentId]/sync`

Opsional.

Fungsi:

Melakukan pengecekan status payment secara manual dari server.

Use case:

* webhook telat
* user klik “Cek Status”
* admin ingin sync status

### 17.4 `/api/payments/[paymentId]/manual-verify`

Opsional untuk admin.

Fungsi:

Admin memverifikasi pembayaran manual.

Catatan:

Hanya untuk mode manual payment. Tidak boleh digunakan sembarangan untuk payment gateway otomatis.

### 17.5 `/api/payments/[paymentId]/refund`

Opsional tahap lanjutan.

Fungsi:

Memproses refund.

Syarat:

* hanya admin
* payment paid
* order bermasalah atau cancelled
* alasan refund wajib
* activity log wajib

## 18. Midtrans Integration Strategy

Midtrans dipakai sebagai payment gateway tahap lanjut. Untuk MVP awal, sistem disiapkan agar mudah naik dari dummy payment ke Midtrans Sandbox.

### 18.1 Mengapa Midtrans

Alasan:

1. Relevan untuk pasar Indonesia.
2. Mendukung banyak metode pembayaran.
3. Memiliki sandbox untuk testing.
4. Memiliki Snap payment page.
5. Memiliki webhook notification.
6. Cocok untuk startup atau project awal.
7. Integrasinya dapat dilakukan bertahap.

### 18.2 Produk Midtrans yang Cocok

Untuk Ruang Usaha Kita, opsi paling cocok adalah Snap.

Alasan:

* lebih cepat diintegrasikan
* menyediakan payment page siap pakai
* bisa redirect atau pop-up
* cocok untuk MVP dan tahap awal
* tidak perlu membangun UI payment gateway terlalu kompleks sendiri

Core API bisa dipakai jika nanti ingin kontrol UI lebih detail, tetapi tidak disarankan untuk MVP awal karena lebih kompleks.

### 18.3 Sandbox First

Tahap awal Midtrans harus menggunakan sandbox.

Sandbox digunakan untuk:

* membuat transaksi test
* mencoba QRIS/VA/e-wallet simulasi
* mengetes webhook
* mengetes status success/failure/expired
* memastikan order status berubah sesuai payment

Tidak ada uang asli dalam sandbox.

### 18.4 Production Later

Production hanya digunakan jika:

* flow sandbox sudah stabil
* domain production sudah ada
* callback URL sudah benar
* akun merchant sudah diverifikasi
* legal dan aturan refund jelas
* admin monitoring siap
* tim siap menangani transaksi nyata

## 19. Midtrans Environment Variables

File `.env.local` untuk development:

```env
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Catatan:

`MIDTRANS_SERVER_KEY` tidak boleh diberi prefix `NEXT_PUBLIC_`.

`NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` boleh dipakai jika Snap client membutuhkan client key di browser.

Pada Vercel, environment variable dipisahkan:

* Development
* Preview
* Production

Jangan campur sandbox key dan production key.

## 20. Midtrans Snap Flow

### 20.1 Redirect Flow

Alur:

1. UMKM klik “Bayar Sekarang”.
2. Frontend memanggil `/api/payments/create`.
3. Server membuat transaksi ke Midtrans.
4. Midtrans mengembalikan redirect URL.
5. Frontend mengarahkan UMKM ke halaman Midtrans.
6. UMKM menyelesaikan pembayaran.
7. Midtrans mengirim webhook ke server.
8. Server update payment status.
9. UMKM diarahkan kembali ke halaman payment/order.
10. UI menampilkan status pembayaran terbaru.

### 20.2 Pop-up Flow

Alur:

1. UMKM klik “Bayar Sekarang”.
2. Frontend memanggil `/api/payments/create`.
3. Server membuat transaksi ke Midtrans.
4. Server mengembalikan Snap token.
5. Frontend membuka Snap pop-up.
6. UMKM membayar di pop-up.
7. Midtrans mengirim webhook ke server.
8. Server update payment status.
9. Frontend menampilkan pesan sukses/pending.
10. User diarahkan ke order detail.

### 20.3 Rekomendasi untuk Ruang Usaha Kita

Untuk MVP:

* gunakan dummy payment

Untuk sandbox:

* gunakan Snap redirect atau pop-up
* Snap redirect lebih sederhana untuk awal
* Snap pop-up lebih terasa seamless tetapi butuh handling client lebih rapi

Rekomendasi:

Mulai dengan Snap redirect, lalu pertimbangkan pop-up setelah flow stabil.

## 21. Midtrans Transaction Payload Concept

Payload konseptual untuk membuat transaksi:

```json
{
  "transaction_details": {
    "order_id": "RUK-2026-00124",
    "gross_amount": 455000
  },
  "customer_details": {
    "first_name": "Bakso Mas Adi",
    "email": "umkm@example.com",
    "phone": "08123456789"
  },
  "item_details": [
    {
      "id": "service-standard-video",
      "price": 300000,
      "quantity": 1,
      "name": "Standard Video Reels/TikTok"
    },
    {
      "id": "addon-brief",
      "price": 150000,
      "quantity": 1,
      "name": "Bantuan Brief Campaign"
    },
    {
      "id": "admin-fee",
      "price": 5000,
      "quantity": 1,
      "name": "Biaya Admin"
    }
  ],
  "callbacks": {
    "finish": "https://domain.com/umkm/orders/RUK-2026-00124"
  }
}
```

Catatan:

`gross_amount` harus sama dengan total item details.

Order ID yang dikirim ke payment gateway harus unik.

## 22. Webhook Handling

Webhook adalah mekanisme utama untuk update status pembayaran.

### 22.1 Webhook Input

Payment gateway akan mengirim payload ketika:

* transaksi berhasil
* transaksi pending
* transaksi gagal
* transaksi expired
* transaksi refund
* status berubah

### 22.2 Webhook Validation

Server harus memvalidasi:

1. Signature.
2. Order ID.
3. Gross amount.
4. Transaction status.
5. Fraud status jika ada.
6. Provider transaction ID.
7. Apakah webhook sudah pernah diproses.

### 22.3 Webhook Idempotency

Webhook bisa dikirim lebih dari sekali.

Maka, handler harus idempotent.

Contoh:

Jika payment sudah `paid`, lalu webhook paid datang lagi, server tidak boleh membuat status history ganda secara berlebihan.

Strategi:

* cek payment status saat ini
* cek provider_transaction_id
* cek raw response
* hanya update jika status baru berbeda dan valid

### 22.4 Webhook Status Mapping

Mapping konseptual:

| Gateway Status | Payment Status     | Order Status                        |
| -------------- | ------------------ | ----------------------------------- |
| settlement     | paid               | paid / waiting_creator_confirmation |
| capture        | paid               | paid / waiting_creator_confirmation |
| pending        | pending            | awaiting_payment                    |
| deny           | failed             | awaiting_payment                    |
| cancel         | failed             | cancelled                           |
| expire         | expired            | cancelled                           |
| refund         | refunded           | refunded                            |
| partial_refund | partially_refunded | refunded / admin review             |

Catatan:

Mapping final harus disesuaikan dengan dokumentasi provider yang dipakai.

## 23. Security Rules

### 23.1 Jangan Percaya Client

Client hanya mengirim permintaan.

Server yang menentukan:

* total amount
* order ownership
* payment status
* status transition
* invoice status

### 23.2 Secret Key Server Only

Secret key hanya boleh dipakai di:

* Next.js Route Handler
* server action
* Supabase Edge Function jika dipakai

Tidak boleh dipakai di:

* React client component
* browser
* local storage
* public JavaScript bundle

### 23.3 Signature Verification

Webhook harus memverifikasi signature.

Jika signature tidak valid:

* return error
* jangan update payment
* catat suspicious event jika perlu

### 23.4 Amount Verification

Webhook amount harus sama dengan total order/payment.

Jika amount berbeda:

* jangan update paid
* tandai payment mismatch
* admin harus review

### 23.5 Order Ownership

Payment create harus memastikan order milik UMKM yang login.

UMKM A tidak boleh membuat payment untuk order UMKM B.

### 23.6 Status Transition Validation

Payment tidak boleh mundur sembarangan.

Contoh:

* paid tidak boleh kembali ke pending
* refunded tidak boleh menjadi paid tanpa admin/server audit
* expired bisa dibuat payment baru, bukan menghidupkan payment lama sembarangan

### 23.7 Activity Log

Event payment penting harus dicatat:

* payment_created
* payment_pending
* payment_paid
* payment_failed
* payment_expired
* payment_refunded
* webhook_received
* webhook_invalid_signature
* payment_amount_mismatch
* admin_manual_verify
* admin_refund_processed

## 24. Payment UI Components

Komponen yang dibutuhkan:

1. `payment-summary-card`
2. `payment-method-selector`
3. `payment-status-badge`
4. `payment-instruction-card`
5. `invoice-summary`
6. `payment-success-state`
7. `payment-failed-state`
8. `payment-expired-state`
9. `admin-payment-table`
10. `payment-timeline`
11. `refund-summary-card`

Lokasi yang disarankan:

```txt
src/features/payments/components/payment-summary-card.tsx
src/features/payments/components/payment-method-selector.tsx
src/features/payments/components/payment-status-badge.tsx
src/features/payments/components/payment-instruction-card.tsx
src/features/payments/components/invoice-summary.tsx
src/features/payments/components/payment-state.tsx
src/features/payments/components/admin-payment-table.tsx
```

## 25. Payment Pages

### 25.1 UMKM Payment Detail

Route:

```txt
/umkm/payments/[paymentId]
```

Isi halaman:

* invoice number
* order number
* payment number
* payment status
* total pembayaran
* metode pembayaran
* instruksi pembayaran
* batas waktu pembayaran
* tombol bayar
* tombol cek status
* tombol lihat pesanan

### 25.2 UMKM Order Detail Payment Section

Route:

```txt
/umkm/orders/[orderId]
```

Bagian payment:

* status pembayaran
* total pembayaran
* invoice
* link detail pembayaran
* status refund jika ada

### 25.3 Admin Payments

Route:

```txt
/admin/payments
```

Isi halaman:

* table semua payment
* filter status
* filter tanggal
* filter metode pembayaran
* payment detail
* action manual review
* refund action dummy/sandbox
* export tahap lanjutan

### 25.4 Admin Order Payment Detail

Route:

```txt
/admin/orders/[orderId]
```

Bagian payment:

* detail payment
* provider response
* invoice
* refund note
* activity log

## 26. Dummy Payment Flow Detail

Dummy payment digunakan sebelum Midtrans.

### 26.1 Dummy Create Payment

Aksi:

1. User klik “Lanjut Pembayaran”.
2. Sistem membuat payment dummy.
3. Payment status `pending`.
4. User masuk halaman payment.

### 26.2 Dummy Pay Button

Tombol:

“Simulasikan Pembayaran Berhasil”

Aksi:

1. User klik tombol.
2. Server dummy route memvalidasi order.
3. Payment status berubah menjadi `paid`.
4. Order status berubah menjadi `paid`.
5. Status history dibuat.
6. User diarahkan ke order detail.

Catatan:

Meskipun dummy, status sebaiknya tetap diubah lewat server route, bukan langsung dari client state, agar pola arsitektur siap untuk gateway real.

### 26.3 Dummy Failure

Sediakan tombol dev-only jika perlu:

* Simulasikan Pembayaran Gagal
* Simulasikan Pembayaran Kedaluwarsa

Ini berguna untuk menguji UI error state.

## 27. Midtrans Sandbox Flow Detail

### 27.1 Setup Sandbox

Yang dibutuhkan:

* akun Midtrans Sandbox
* server key sandbox
* client key sandbox
* payment notification URL
* finish redirect URL
* error redirect URL jika digunakan
* unfinish redirect URL jika digunakan

### 27.2 Create Transaction

Server route:

```txt
POST /api/payments/create
```

Langkah:

1. Ambil user session.
2. Validasi role UMKM.
3. Ambil order dari database.
4. Hitung total server-side.
5. Buat payment record pending.
6. Kirim request ke Midtrans Snap.
7. Simpan token/redirect URL.
8. Return token/redirect URL ke frontend.

### 27.3 User Pays

User membayar melalui halaman Midtrans.

Status awal:

* payment pending
* order awaiting_payment atau paid tergantung timing

### 27.4 Webhook Updates Status

Midtrans mengirim webhook ke:

```txt
POST /api/payments/webhook
```

Server:

1. Verifikasi signature.
2. Cek order id.
3. Cek amount.
4. Mapping transaction status.
5. Update payment.
6. Update order.
7. Insert order_status_history.
8. Insert notification.
9. Insert activity log.
10. Return 200.

### 27.5 Redirect After Payment

Setelah user selesai, user dapat kembali ke:

```txt
/umkm/orders/[orderId]
```

atau:

```txt
/umkm/payments/[paymentId]
```

Catatan:

Redirect bukan sumber kebenaran payment. Webhook tetap menjadi sumber utama.

## 28. Refund Flow

Refund tidak wajib MVP awal, tetapi arsitekturnya harus disiapkan.

### 28.1 Refund Request

Refund biasanya muncul dari complaint.

Penyebab:

* creator tidak mengerjakan
* order dibatalkan setelah pembayaran
* hasil tidak sesuai brief
* payment duplicate
* kesalahan sistem

### 28.2 Admin Review

Admin mengecek:

* brief awal
* hasil konten
* catatan revisi
* komunikasi
* status payment
* aturan refund

### 28.3 Refund Decision

Keputusan:

1. Full refund.
2. Partial refund.
3. No refund.

### 28.4 Refund Status

Jika refund disetujui:

* payment_status: refunded atau partially_refunded
* order_status: refunded
* activity log dibuat
* notification dikirim ke UMKM
* invoice diberi catatan refund

### 28.5 MVP Refund

Pada MVP awal:

* refund cukup sebagai UI status
* action admin masih dummy
* tidak perlu request refund real ke payment gateway

## 29. Admin Payment Monitoring

Admin harus dapat memantau pembayaran.

### 29.1 Payment Metrics

Metrik:

* total payment
* pending payment
* paid payment
* failed payment
* expired payment
* refunded payment
* gross transaction value
* platform fee
* admin fee
* net platform revenue dummy

### 29.2 Payment Table

Kolom:

* payment number
* order number
* UMKM
* creator
* method
* status
* amount
* provider
* created_at
* paid_at
* action

### 29.3 Payment Filter

Filter:

* status
* metode
* provider
* tanggal
* amount range

### 29.4 Payment Detail

Detail:

* payment data
* order data
* invoice data
* provider response
* webhook logs
* activity logs
* refund note

## 30. Reporting Impact

Payment data dipakai untuk laporan.

Laporan utama:

1. Total nilai transaksi.
2. Total transaksi berhasil.
3. Total transaksi pending.
4. Total transaksi gagal.
5. Pendapatan biaya admin.
6. Estimasi platform fee.
7. Refund.
8. Layanan terlaris.
9. Creator dengan transaksi tertinggi.
10. UMKM dengan transaksi terbanyak.

## 31. Payment and Sales Management

Dalam materi Sales Management, payment termasuk bagian dari pengelolaan transaksi digital. Payment mendukung:

1. Sales tracking
   Pembayaran berhasil menandai transaksi valid.

2. Profit tracking
   Platform fee dan admin fee menjadi sumber pendapatan.

3. Order management
   Order baru dapat diproses setelah pembayaran valid.

4. Customer management
   Riwayat pembayaran membantu melihat aktivitas UMKM.

5. Reporting system
   Payment menjadi data utama untuk laporan keuangan dan transaksi.

6. Business control
   Admin dapat memantau pembayaran pending, gagal, refund, dan sukses.

## 32. Error Cases

### 32.1 Payment Created but User Leaves

Kondisi:

User membuat payment tetapi tidak menyelesaikan pembayaran.

Dampak:

* payment tetap pending
* order tetap awaiting_payment
* expired setelah batas waktu

UI:

* tampilkan tombol lanjutkan pembayaran
* tampilkan batas waktu pembayaran

### 32.2 Payment Gateway Sukses tapi Webhook Telat

Kondisi:

User sudah bayar, tetapi webhook belum masuk.

Dampak:

* UI masih pending sementara

Mitigasi:

* tombol cek status
* server sync status
* admin monitoring

### 32.3 Webhook Ganda

Kondisi:

Gateway mengirim webhook lebih dari sekali.

Mitigasi:

* idempotency
* cek status sebelum update
* jangan duplikasi status history berlebihan

### 32.4 Amount Mismatch

Kondisi:

Amount dari gateway tidak sama dengan order total.

Mitigasi:

* jangan mark paid
* tandai mismatch
* admin review
* activity log

### 32.5 Invalid Signature

Kondisi:

Webhook tidak valid.

Mitigasi:

* return error
* jangan update payment
* log suspicious event

### 32.6 Payment Expired

Kondisi:

Batas pembayaran habis.

Dampak:

* payment expired
* order cancelled atau tetap awaiting_payment dengan label expired
* user dapat membuat payment baru jika order masih diperbolehkan

### 32.7 User Membayar Dua Kali

Kondisi:

Duplicate payment.

Mitigasi:

* cek payment aktif per order
* cegah multiple paid payments untuk satu order
* admin proses refund jika perlu

### 32.8 Order Cancelled but Payment Succeeds

Kondisi:

Race condition antara cancel dan payment.

Mitigasi:

* webhook cek status order
* jika order cancelled tetapi payment paid, tandai admin review
* jangan otomatis lanjutkan order tanpa validasi

## 33. Payment Data Validation

### 33.1 Create Payment

Validasi:

* user login
* role UMKM
* order milik user
* order belum paid
* amount dihitung server
* payment belum expired
* payment method valid

### 33.2 Webhook

Validasi:

* signature valid
* order id valid
* amount valid
* provider transaction id valid
* status mapping valid
* transition valid

### 33.3 Refund

Validasi:

* admin login
* payment paid
* order memenuhi syarat refund
* alasan refund wajib
* nominal refund valid
* activity log dibuat

## 34. Payment State Machine

State machine payment:

```txt
pending
  → paid
  → failed
  → expired
  → refunded
  → partially_refunded
```

Aturan:

* pending bisa menjadi paid, failed, atau expired
* paid bisa menjadi refunded atau partially_refunded
* failed tidak bisa menjadi paid kecuali membuat payment baru
* expired tidak bisa menjadi paid kecuali gateway memang mengirim settlement yang valid dan admin/server mengonfirmasi
* refunded adalah status final
* partially_refunded bisa menjadi refunded jika refund dilanjutkan

## 35. Integration Files Planning

File yang dibutuhkan nanti:

```txt
src/lib/payment/fees.ts
src/lib/payment/midtrans.ts
src/lib/payment/payment-utils.ts
src/lib/constants/payment-status.ts
src/features/payments/actions/create-payment.ts
src/features/payments/actions/sync-payment.ts
src/features/payments/actions/refund-payment.ts
src/features/payments/queries/get-payment.ts
src/features/payments/queries/get-payments.ts
src/features/payments/components/payment-summary-card.tsx
src/features/payments/components/payment-method-selector.tsx
src/features/payments/components/payment-status-badge.tsx
src/features/payments/components/invoice-summary.tsx
src/app/api/payments/create/route.ts
src/app/api/payments/webhook/route.ts
```

## 36. Environment Variable Planning

### 36.1 Development

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000

MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
```

### 36.2 Preview

```env
NEXT_PUBLIC_APP_URL=https://preview-domain.vercel.app

MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=false
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
```

### 36.3 Production

```env
NEXT_PUBLIC_APP_URL=https://ruangusahakita.id

MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=
MIDTRANS_IS_PRODUCTION=true
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=
```

Catatan:

Production key hanya dimasukkan ke environment production, bukan development.

## 37. UI Copy Rules

Gunakan copy berikut:

### 37.1 Payment CTA

* Lanjut ke Pembayaran
* Bayar Sekarang
* Cek Status Pembayaran
* Lihat Pesanan
* Coba Lagi
* Kembali ke Checkout

### 37.2 Payment Status

* Menunggu Pembayaran
* Pembayaran Berhasil
* Pembayaran Gagal
* Pembayaran Kedaluwarsa
* Refund Diproses
* Refund Berhasil
* Refund Sebagian

### 37.3 Payment Notes

Contoh microcopy:

“Pembayaran akan diverifikasi oleh sistem sebelum pesanan diteruskan ke kreator.”

“Creator mulai mengerjakan konten setelah pembayaran berhasil dan brief diterima.”

“Jika pembayaran sudah dilakukan tetapi status belum berubah, gunakan tombol cek status atau hubungi admin.”

“Pada tahap MVP, pembayaran masih menggunakan simulasi untuk menguji alur transaksi.”

## 38. Non-MVP Payment Features

Fitur berikut tidak masuk MVP awal:

* production payment
* automatic payout ke creator
* split payment otomatis
* escrow legal penuh
* recurring payment
* voucher kompleks
* refund otomatis penuh
* chargeback handling detail
* fraud scoring
* payment analytics mendalam
* tax invoice lengkap
* settlement report otomatis

## 39. Future Payment Features

Fitur masa depan:

1. Payout creator.
2. Escrow-like holding balance.
3. Settlement dashboard.
4. Platform fee report.
5. Voucher.
6. Referral credit.
7. Wallet internal.
8. Automatic refund.
9. Payment reconciliation.
10. Fraud detection.
11. Multi-provider payment gateway.
12. Export payment report.
13. PDF invoice.
14. Tax invoice if required.

## 40. Testing Plan

### 40.1 Dummy Payment Test

Skenario:

1. UMKM checkout.
2. Payment pending dibuat.
3. Klik simulasi paid.
4. Payment menjadi paid.
5. Order menjadi paid.
6. User diarahkan ke order detail.

Expected:

* payment status paid
* order status paid
* status history dibuat

### 40.2 Failed Payment Test

Skenario:

1. Payment dibuat.
2. Simulasikan gagal.

Expected:

* payment status failed
* order tidak diproses creator

### 40.3 Expired Payment Test

Skenario:

1. Payment dibuat.
2. Simulasikan expired.

Expected:

* payment status expired
* order tidak diproses
* user bisa buat payment baru jika diizinkan

### 40.4 Webhook Success Test

Skenario:

1. Midtrans sandbox mengirim settlement.
2. Server validasi webhook.
3. Payment update paid.

Expected:

* payment paid
* order paid
* notification dibuat

### 40.5 Invalid Webhook Test

Skenario:

1. Webhook signature salah.

Expected:

* server menolak
* payment tidak berubah
* log dibuat

### 40.6 Amount Mismatch Test

Skenario:

1. Webhook amount berbeda dari order total.

Expected:

* payment tidak paid
* admin review
* activity log dibuat

### 40.7 Duplicate Webhook Test

Skenario:

1. Webhook paid datang dua kali.

Expected:

* payment tetap paid
* tidak ada duplikasi status yang merusak

### 40.8 Unauthorized Payment Update Test

Skenario:

1. UMKM mengirim request update payment_status paid dari client.

Expected:

* server menolak
* payment tetap pending

## 41. Implementation Roadmap

### 41.1 Phase 1 — Payment UI Foundation

* payment page
* payment summary card
* method selector
* payment status badge
* invoice summary
* payment success/failed/expired state

### 41.2 Phase 2 — Dummy Server Payment

* create payment route
* dummy payment status
* order update server-side
* payment status UI
* admin payment table dummy

### 41.3 Phase 3 — Database Payment

* payments table
* invoices table
* platform settings
* order status history
* activity logs
* notifications

### 41.4 Phase 4 — Midtrans Sandbox

* setup sandbox account
* environment variables
* create Snap transaction
* redirect or popup payment
* webhook route
* status mapping

### 41.5 Phase 5 — Hardening

* signature validation
* amount validation
* idempotency
* error logging
* admin review for mismatch
* sync payment route

### 41.6 Phase 6 — Production Readiness

* domain
* production env
* merchant verification
* callback URLs
* refund policy
* terms of service
* admin monitoring
* testing checklist

## 42. Definition of Done

Payment flow dianggap selesai jika:

1. Checkout menghasilkan payment.
2. Payment memiliki status.
3. UI payment dapat menampilkan pending, paid, failed, expired.
4. Total pembayaran dihitung server.
5. Payment status berbeda dari order status.
6. Dummy payment berjalan.
7. Payment route tidak menerima update sembarangan dari client.
8. Invoice placeholder ada.
9. Admin dapat melihat daftar payment.
10. Order berubah status setelah payment paid.
11. Payment status tidak bisa diubah UMKM secara langsung.
12. Midtrans Sandbox dapat dibuat tanpa mengubah arsitektur besar.
13. Webhook route disiapkan.
14. Environment variable sudah dipisah client dan server.
15. Tidak ada secret key di client.
16. Tidak ada istilah ongkir, kurir, resi, atau shipping.
17. Flow bisa dijelaskan sebagai pembayaran marketplace jasa digital.

## 43. Kesimpulan

Payment flow Ruang Usaha Kita harus dibangun bertahap. Tahap awal cukup menggunakan dummy payment agar alur checkout, invoice, dan status pembayaran dapat diuji. Setelah flow stabil, sistem dapat dinaikkan ke Midtrans Sandbox untuk simulasi payment gateway. Production payment dilakukan belakangan setelah domain, akun merchant, webhook, admin monitoring, dan kebijakan refund siap.

Hal paling penting adalah keamanan. Client tidak boleh menjadi sumber kebenaran pembayaran. Total harus dihitung server, payment status harus diubah oleh server atau webhook, dan secret key tidak boleh masuk browser.

Dengan rancangan ini, Ruang Usaha Kita sudah memiliki fondasi payment yang cukup serius untuk berkembang dari prototype akademik menjadi marketplace jasa digital yang siap diintegrasikan dengan payment gateway.
