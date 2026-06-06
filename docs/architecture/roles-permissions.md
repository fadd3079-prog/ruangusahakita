# Ruang Usaha Kita — Roles and Permissions

## 1. Tujuan Dokumen

Dokumen ini menjelaskan pembagian role, hak akses, batasan fitur, aturan route protection, dan rencana Row Level Security untuk website Ruang Usaha Kita.

Ruang Usaha Kita adalah marketplace jasa digital yang menghubungkan UMKM dengan content creator atau marketer untuk kebutuhan promosi digital. Karena platform ini memiliki lebih dari satu jenis pengguna, sistem harus memiliki pembagian akses yang jelas.

Role tidak hanya dipakai untuk membedakan tampilan dashboard. Role juga menentukan:

1. Halaman apa yang boleh dibuka.
2. Data apa yang boleh dibaca.
3. Data apa yang boleh dibuat.
4. Data apa yang boleh diedit.
5. Data apa yang boleh dihapus.
6. Status apa yang boleh diubah.
7. Aksi bisnis apa yang boleh dilakukan.
8. File apa yang boleh diakses.
9. Laporan apa yang boleh dilihat.
10. Fitur admin apa yang boleh digunakan.

Prinsip utama dokumen ini adalah: jangan hanya mengamankan UI. Data tetap harus diamankan di database menggunakan Supabase RLS dan di server menggunakan route guard.

## 2. Role Utama

Ruang Usaha Kita memiliki empat kategori akses:

1. Guest
2. UMKM
3. Creator
4. Admin

Secara database, role utama yang masuk ke tabel `profiles.role` adalah:

```ts
type UserRole = "admin" | "umkm" | "creator";
```

Guest tidak perlu disimpan sebagai role database karena guest adalah pengguna yang belum login.

## 3. Ringkasan Role

| Role    | Status Login | Fungsi Utama                                                                                          |
| ------- | ------------ | ----------------------------------------------------------------------------------------------------- |
| Guest   | Belum login  | Melihat halaman publik, katalog, detail kreator, detail layanan                                       |
| UMKM    | Login        | Mencari kreator, memesan paket jasa, mengisi brief, membayar, memantau pesanan, menerima hasil        |
| Creator | Login        | Membuat profil, mengelola paket jasa, menerima order, membaca brief, mengirim hasil, menangani revisi |
| Admin   | Login        | Mengelola user, layanan, order, pembayaran, komplain, laporan, dan konfigurasi platform               |

## 4. Prinsip Akses

### 4.1 Least Privilege

Setiap role hanya boleh mengakses data dan fitur yang benar-benar dibutuhkan.

Contoh:

* UMKM tidak boleh melihat semua order platform.
* Creator tidak boleh melihat brief yang bukan untuk dirinya.
* Guest tidak boleh melihat data order, payment, brief, dan file hasil.
* Admin boleh melihat data luas, tetapi aksi admin harus dicatat.

### 4.2 Role-Based Access Control

Akses ditentukan berdasarkan role.

Contoh:

* Route `/umkm/*` hanya untuk role UMKM.
* Route `/creator/*` hanya untuk role Creator.
* Route `/admin/*` hanya untuk role Admin.
* Route public dapat diakses tanpa login.

### 4.3 Ownership-Based Access

Selain role, akses juga ditentukan berdasarkan kepemilikan data.

Contoh:

* UMKM hanya boleh melihat order miliknya.
* Creator hanya boleh melihat order yang ditujukan kepada dirinya.
* Creator hanya boleh mengedit paket jasa miliknya sendiri.
* UMKM hanya boleh memberi review untuk order yang pernah ia selesaikan.

### 4.4 Server-Side Protection

Proteksi route dan aksi penting harus dilakukan di server.

Contoh:

* update payment status tidak boleh dari client.
* payment webhook harus berjalan di server.
* admin action harus diverifikasi role admin di server.
* file private tidak boleh dibuka hanya karena URL diketahui.

### 4.5 Database-Level Protection

Tabel sensitif harus menggunakan Supabase RLS.

Tabel sensitif:

* profiles
* umkm_profiles
* creator_profiles
* carts
* cart_items
* campaign_briefs
* orders
* payments
* invoices
* submissions
* revisions
* complaints
* messages
* notifications
* activity_logs

## 5. Guest Permissions

Guest adalah pengguna yang belum login.

### 5.1 Guest Boleh

Guest boleh:

1. Melihat landing page.
2. Melihat katalog kreator.
3. Melihat detail kreator yang aktif.
4. Melihat detail paket jasa yang aktif.
5. Melihat portofolio publik.
6. Melihat review publik.
7. Melihat halaman cara kerja.
8. Melihat halaman bantuan.
9. Membuka halaman login.
10. Membuka halaman register.

### 5.2 Guest Tidak Boleh

Guest tidak boleh:

1. Checkout.
2. Menambahkan jasa ke cart real milik akun.
3. Membuat order.
4. Mengisi brief real.
5. Melihat dashboard.
6. Melihat order.
7. Melihat payment.
8. Melihat invoice.
9. Melihat hasil konten private.
10. Mengirim revisi.
11. Memberi review.
12. Mengakses dashboard creator.
13. Mengakses dashboard admin.
14. Mengakses API sensitif.
15. Upload file.

### 5.3 Guest Public Data

Data yang boleh dibaca guest:

* creator profile yang aktif dan public
* service package yang aktif
* service category aktif
* portfolio public
* review yang visible
* public platform settings tertentu

Data yang tidak boleh dibaca guest:

* data pribadi UMKM
* brief campaign
* cart
* order
* payment
* invoice
* file hasil konten
* complaint
* notification
* admin report

## 6. UMKM Permissions

UMKM adalah pembeli layanan promosi digital.

### 6.1 UMKM Boleh

UMKM boleh:

1. Mengelola profil usaha sendiri.
2. Melihat katalog kreator.
3. Melihat detail kreator.
4. Melihat detail paket jasa.
5. Menambahkan paket jasa ke cart miliknya.
6. Menghapus item dari cart miliknya.
7. Mengisi brief campaign.
8. Menyimpan brief draft.
9. Membuat checkout.
10. Membuat order.
11. Melihat order miliknya.
12. Melihat payment miliknya.
13. Melihat invoice miliknya.
14. Melihat status pesanan miliknya.
15. Melihat hasil konten dari order miliknya.
16. Mengajukan revisi untuk order miliknya.
17. Menyelesaikan pesanan miliknya.
18. Memberi review untuk order yang sudah selesai.
19. Menyimpan kreator favorit.
20. Melihat notifikasi miliknya.
21. Mengubah pengaturan akun miliknya.

### 6.2 UMKM Tidak Boleh

UMKM tidak boleh:

1. Melihat order UMKM lain.
2. Melihat brief UMKM lain.
3. Melihat payment UMKM lain.
4. Melihat invoice UMKM lain.
5. Melihat file hasil milik order lain.
6. Mengubah payment status.
7. Mengubah platform fee.
8. Mengubah admin fee.
9. Mengakses dashboard creator.
10. Mengakses dashboard admin.
11. Mengedit profil creator.
12. Mengedit paket jasa creator.
13. Mengubah status order secara bebas.
14. Menghapus order setelah pembayaran berhasil.
15. Memberi review untuk order yang tidak pernah ia pesan.
16. Memberi review sebelum order completed.
17. Membuka complaint yang tidak terkait dengan dirinya.
18. Melihat laporan platform.

### 6.3 UMKM Route Access

UMKM boleh mengakses:

* `/`
* `/katalog`
* `/kreator/[creatorId]`
* `/layanan/[serviceId]`
* `/cara-kerja`
* `/bantuan`
* `/umkm/dashboard`
* `/umkm/cart`
* `/umkm/checkout`
* `/umkm/orders`
* `/umkm/orders/[orderId]`
* `/umkm/payments/[paymentId]`
* `/umkm/briefs`
* `/umkm/results`
* `/umkm/settings`

UMKM tidak boleh mengakses:

* `/creator/*`
* `/admin/*`

### 6.4 UMKM Order Actions

UMKM boleh melakukan aksi berikut pada order miliknya:

| Order Status                 | Aksi UMKM                                                 |
| ---------------------------- | --------------------------------------------------------- |
| draft                        | edit brief, batal draft                                   |
| awaiting_payment             | bayar, batal                                              |
| paid                         | menunggu kreator                                          |
| waiting_creator_confirmation | menunggu kreator                                          |
| brief_accepted               | melihat progres                                           |
| in_progress                  | melihat progres                                           |
| submitted                    | melihat hasil, ajukan revisi, setujui hasil               |
| revision_requested           | menunggu revisi                                           |
| revised                      | melihat revisi, setujui, minta revisi jika masih tersedia |
| completed                    | beri review                                               |
| cancelled                    | lihat detail                                              |
| refunded                     | lihat detail refund                                       |

UMKM tidak boleh langsung mengubah status menjadi:

* paid
* brief_accepted
* in_progress
* submitted
* refunded

Status tersebut harus diubah oleh server, creator, atau admin sesuai flow.

## 7. Creator Permissions

Creator adalah penyedia jasa promosi digital.

### 7.1 Creator Boleh

Creator boleh:

1. Mengelola profil kreator miliknya.
2. Mengelola portofolio miliknya.
3. Membuat paket jasa.
4. Mengedit paket jasa miliknya.
5. Menonaktifkan paket jasa miliknya.
6. Melihat order yang ditujukan kepadanya.
7. Membaca brief campaign dari order yang ditujukan kepadanya.
8. Menerima order setelah pembayaran berhasil.
9. Menolak order dengan alasan tertentu sesuai aturan platform.
10. Mengubah status pengerjaan order yang ditujukan kepadanya.
11. Mengirim hasil konten.
12. Mengirim hasil revisi.
13. Melihat review yang diberikan untuk dirinya.
14. Melihat ringkasan pendapatan miliknya.
15. Melihat notifikasi miliknya.
16. Mengubah availability status miliknya.

### 7.2 Creator Tidak Boleh

Creator tidak boleh:

1. Melihat order creator lain.
2. Melihat brief yang bukan untuk dirinya.
3. Melihat payment detail milik creator lain.
4. Mengakses cart UMKM.
5. Mengubah payment status.
6. Mengubah total pembayaran.
7. Mengubah platform fee.
8. Menghapus order secara sepihak setelah pembayaran.
9. Menghapus review buruk secara sepihak.
10. Mengubah rating dirinya.
11. Mengakses dashboard admin.
12. Melihat semua user platform.
13. Melihat laporan pendapatan platform keseluruhan.
14. Mengakses file hasil order lain.
15. Mengubah data UMKM di luar konteks order.

### 7.3 Creator Route Access

Creator boleh mengakses:

* `/`
* `/katalog`
* `/kreator/[creatorId]`
* `/layanan/[serviceId]`
* `/cara-kerja`
* `/bantuan`
* `/creator/dashboard`
* `/creator/profile`
* `/creator/services`
* `/creator/services/new`
* `/creator/orders`
* `/creator/orders/[orderId]`
* `/creator/portfolio`
* `/creator/earnings`
* `/creator/settings`

Creator tidak boleh mengakses:

* `/umkm/*`
* `/admin/*`

Catatan:

Creator tetap boleh melihat public catalog karena creator juga perlu melihat tampilan publik platform.

### 7.4 Creator Order Actions

| Order Status                 | Aksi Creator                                |
| ---------------------------- | ------------------------------------------- |
| awaiting_payment             | tidak ada aksi                              |
| paid                         | menerima order, menolak order sesuai aturan |
| waiting_creator_confirmation | menerima order, menolak order               |
| brief_accepted               | mulai pengerjaan                            |
| in_progress                  | kirim hasil                                 |
| submitted                    | menunggu respons UMKM                       |
| revision_requested           | membaca catatan revisi, mengerjakan revisi  |
| revised                      | menunggu respons UMKM                       |
| completed                    | lihat review                                |
| cancelled                    | lihat detail                                |
| refunded                     | lihat detail                                |

Creator boleh mengubah status:

* waiting_creator_confirmation → brief_accepted
* brief_accepted → in_progress
* in_progress → submitted
* revision_requested → revised

Creator tidak boleh mengubah status:

* awaiting_payment → paid
* paid → refunded
* submitted → completed
* completed → cancelled

## 8. Admin Permissions

Admin adalah pengelola platform.

### 8.1 Admin Boleh

Admin boleh:

1. Melihat dashboard admin.
2. Melihat semua user.
3. Melihat semua UMKM.
4. Melihat semua creator.
5. Melihat semua layanan.
6. Melihat semua order.
7. Melihat semua payment.
8. Melihat semua invoice.
9. Melihat semua complaint.
10. Melihat semua review.
11. Melihat laporan penjualan.
12. Memoderasi layanan creator.
13. Menandai creator sebagai featured.
14. Menonaktifkan akun bermasalah.
15. Menangani complaint.
16. Memberi catatan mediasi.
17. Memproses refund secara administratif.
18. Mengubah platform settings.
19. Mengatur biaya admin.
20. Mengatur platform fee.
21. Mengelola kategori layanan.
22. Melihat activity logs.
23. Mengakses file yang diperlukan untuk mediasi.

### 8.2 Admin Tidak Boleh

Admin tetap tidak boleh:

1. Menggunakan akun user tanpa izin.
2. Mengubah password user secara sembarangan.
3. Mengubah isi brief campaign tanpa jejak audit.
4. Menghapus order transaksi secara permanen.
5. Menghapus payment history secara permanen.
6. Mengubah review tanpa jejak moderasi.
7. Mengakses data sensitif tanpa alasan operasional.
8. Membuka service role key di client.
9. Mengubah status pembayaran dari UI client biasa tanpa server action/admin API.
10. Menghapus activity log.

### 8.3 Admin Route Access

Admin boleh mengakses:

* `/admin/dashboard`
* `/admin/users`
* `/admin/umkm`
* `/admin/creators`
* `/admin/services`
* `/admin/orders`
* `/admin/orders/[orderId]`
* `/admin/payments`
* `/admin/complaints`
* `/admin/reports`
* `/admin/settings`

Admin juga boleh mengakses public routes.

Admin tidak diarahkan ke dashboard UMKM atau creator kecuali untuk fitur impersonation yang tidak masuk MVP.

### 8.4 Admin Actions That Must Be Logged

Aksi admin yang wajib masuk `activity_logs`:

* suspend user
* activate user
* verify creator
* unverify creator
* feature creator
* unfeature creator
* hide service
* restore service
* cancel order
* approve refund
* reject complaint
* resolve complaint
* hide review
* update platform fee
* update admin fee
* update category
* update platform settings

## 9. Permission Matrix — Routes

| Route                        | Guest |                  UMKM |               Creator |                      Admin |
| ---------------------------- | ----: | --------------------: | --------------------: | -------------------------: |
| `/`                          |  Read |                  Read |                  Read |                       Read |
| `/katalog`                   |  Read |                  Read |                  Read |                       Read |
| `/kreator/[creatorId]`       |  Read |                  Read |                  Read |                       Read |
| `/layanan/[serviceId]`       |  Read |                  Read |                  Read |                       Read |
| `/cara-kerja`                |  Read |                  Read |                  Read |                       Read |
| `/bantuan`                   |  Read |                  Read |                  Read |                       Read |
| `/login`                     |  Read | Redirect if logged in | Redirect if logged in |      Redirect if logged in |
| `/register`                  |  Read | Redirect if logged in | Redirect if logged in |      Redirect if logged in |
| `/forgot-password`           |  Read | Redirect if logged in | Redirect if logged in |      Redirect if logged in |
| `/umkm/dashboard`            |  Deny |                  Read |                  Deny |                       Deny |
| `/umkm/cart`                 |  Deny |              CRUD own |                  Deny |                       Deny |
| `/umkm/checkout`             |  Deny |            Create own |                  Deny |                       Deny |
| `/umkm/orders`               |  Deny |              Read own |                  Deny |                       Deny |
| `/umkm/orders/[orderId]`     |  Deny |       Read/Action own |                  Deny | Admin via admin route only |
| `/umkm/payments/[paymentId]` |  Deny |              Read own |                  Deny | Admin via admin route only |
| `/creator/dashboard`         |  Deny |                  Deny |                  Read |                       Deny |
| `/creator/profile`           |  Deny |                  Deny |              CRUD own |                       Deny |
| `/creator/services`          |  Deny |                  Deny |              CRUD own |                       Deny |
| `/creator/orders`            |  Deny |                  Deny |         Read assigned |                       Deny |
| `/creator/orders/[orderId]`  |  Deny |                  Deny |  Read/Action assigned | Admin via admin route only |
| `/admin/dashboard`           |  Deny |                  Deny |                  Deny |                       Read |
| `/admin/users`               |  Deny |                  Deny |                  Deny |                     Manage |
| `/admin/umkm`                |  Deny |                  Deny |                  Deny |                     Manage |
| `/admin/creators`            |  Deny |                  Deny |                  Deny |                     Manage |
| `/admin/services`            |  Deny |                  Deny |                  Deny |                     Manage |
| `/admin/orders`              |  Deny |                  Deny |                  Deny |                     Manage |
| `/admin/payments`            |  Deny |                  Deny |                  Deny |                     Manage |
| `/admin/complaints`          |  Deny |                  Deny |                  Deny |                     Manage |
| `/admin/reports`             |  Deny |                  Deny |                  Deny |                       Read |
| `/admin/settings`            |  Deny |                  Deny |                  Deny |                     Manage |

Catatan:

Admin tidak perlu masuk ke route `/umkm/*` atau `/creator/*`. Admin memiliki route sendiri agar konteks akses tetap jelas dan tidak membingungkan.

## 10. Permission Matrix — Data Tables

| Table                   | Guest              | UMKM                       | Creator                    | Admin                |
| ----------------------- | ------------------ | -------------------------- | -------------------------- | -------------------- |
| `profiles`              | No access          | Read/update own            | Read/update own            | Read/manage all      |
| `umkm_profiles`         | No private access  | CRUD own                   | Read if related order      | Read/manage all      |
| `creator_profiles`      | Read public active | Read public active         | CRUD own                   | Read/manage all      |
| `service_categories`    | Read active        | Read active                | Read active                | CRUD                 |
| `service_packages`      | Read active        | Read active                | CRUD own if creator        | Manage all           |
| `service_package_tiers` | Read active        | Read active                | CRUD own                   | Manage all           |
| `service_addons`        | Read active        | Read active                | CRUD own                   | Manage all           |
| `portfolios`            | Read public active | Read public active         | CRUD own                   | Manage all           |
| `carts`                 | No access          | CRUD own                   | No access                  | Limited/debug        |
| `cart_items`            | No access          | CRUD own                   | No access                  | Limited/debug        |
| `campaign_briefs`       | No access          | CRUD own                   | Read assigned order        | Read/manage all      |
| `orders`                | No access          | Read/action own            | Read/action assigned       | Manage all           |
| `order_items`           | No access          | Read own order             | Read assigned order        | Manage all           |
| `payments`              | No access          | Read own                   | Read assigned order status | Manage all           |
| `invoices`              | No access          | Read own                   | Read assigned summary      | Manage all           |
| `submissions`           | No access          | Read own order             | CRUD assigned order        | Manage all           |
| `revisions`             | No access          | Create/read own order      | Read/respond assigned      | Manage all           |
| `reviews`               | Read visible       | Create own completed order | Read own reviews           | Moderate             |
| `complaints`            | No access          | Create/read own            | Create/read assigned       | Manage all           |
| `messages`              | No access          | Read/write own order       | Read/write assigned        | Read/write mediation |
| `notifications`         | No access          | Read/update own            | Read/update own            | Create/manage        |
| `saved_creators`        | No access          | CRUD own                   | No access                  | Read/manage          |
| `platform_settings`     | Read public subset | Read public subset         | Read public subset         | Manage               |
| `activity_logs`         | No access          | No access                  | No access                  | Read/create          |

## 11. Permission Matrix — Business Actions

| Action                   | Guest |    UMKM | Creator |          Admin |
| ------------------------ | ----: | ------: | ------: | -------------: |
| View landing page        |   Yes |     Yes |     Yes |            Yes |
| View catalog             |   Yes |     Yes |     Yes |            Yes |
| View creator detail      |   Yes |     Yes |     Yes |            Yes |
| View service detail      |   Yes |     Yes |     Yes |            Yes |
| Register account         |   Yes |      No |      No |             No |
| Login                    |   Yes |     Yes |     Yes |            Yes |
| Create cart item         |    No |     Yes |      No |             No |
| Checkout                 |    No |     Yes |      No |             No |
| Create campaign brief    |    No |     Yes |      No |             No |
| Create order             |    No |     Yes |      No |             No |
| Create payment request   |    No |     Yes |      No |   Server/Admin |
| Mark payment as paid     |    No |      No |      No |   Server/Admin |
| Accept order             |    No |      No |     Yes | Admin override |
| Start production         |    No |      No |     Yes | Admin override |
| Submit result            |    No |      No |     Yes | Admin override |
| Request revision         |    No |     Yes |      No | Admin override |
| Submit revision          |    No |      No |     Yes | Admin override |
| Complete order           |    No |     Yes |      No | Admin override |
| Cancel order             |    No | Limited | Limited |            Yes |
| Request complaint        |    No |     Yes |     Yes |            Yes |
| Resolve complaint        |    No |      No |      No |            Yes |
| Submit review            |    No |     Yes |      No |             No |
| Moderate review          |    No |      No |      No |            Yes |
| Manage platform settings |    No |      No |      No |            Yes |

## 12. Order Status Permission Rules

Order status tidak boleh berubah sembarangan. Setiap perubahan harus sesuai role.

### 12.1 Status Transition Rules

| From                         | To                           | Actor                |
| ---------------------------- | ---------------------------- | -------------------- |
| draft                        | awaiting_payment             | UMKM/System          |
| awaiting_payment             | paid                         | Server/Webhook/Admin |
| paid                         | waiting_creator_confirmation | Server/System        |
| waiting_creator_confirmation | brief_accepted               | Creator              |
| brief_accepted               | in_progress                  | Creator              |
| in_progress                  | submitted                    | Creator              |
| submitted                    | revision_requested           | UMKM                 |
| revision_requested           | revised                      | Creator              |
| revised                      | completed                    | UMKM                 |
| submitted                    | completed                    | UMKM                 |
| awaiting_payment             | cancelled                    | UMKM/System/Admin    |
| paid                         | cancelled                    | Admin                |
| paid                         | refunded                     | Admin/Server         |
| cancelled                    | refunded                     | Admin/Server         |

### 12.2 Forbidden Transitions

Tidak boleh:

* UMKM mengubah `awaiting_payment` langsung ke `paid`.
* Creator mengubah `paid` langsung ke `completed`.
* Creator mengubah `submitted` ke `completed`.
* UMKM mengubah `in_progress` ke `submitted`.
* Guest mengubah status apa pun.
* Client mengubah payment status.
* Order completed diubah kembali tanpa admin audit.

## 13. Payment Permission Rules

Payment adalah area sensitif.

### 13.1 Payment Read Access

UMKM boleh melihat:

* payment miliknya
* invoice miliknya
* status pembayaran order miliknya

Creator boleh melihat:

* status pembayaran order yang ditujukan kepadanya
* ringkasan nominal yang relevan
* estimasi pendapatan

Admin boleh melihat:

* semua payment
* semua invoice
* semua payment provider response
* semua refund status

### 13.2 Payment Write Access

UMKM boleh:

* membuat payment request
* memilih metode pembayaran
* mengunggah bukti pembayaran jika mode manual dipakai

UMKM tidak boleh:

* mengubah payment status menjadi paid
* mengubah total pembayaran
* mengubah platform fee
* mengubah admin fee

Creator tidak boleh:

* membuat payment untuk UMKM
* mengubah payment status
* mengubah total transaksi

Admin boleh:

* membuat catatan manual
* menandai payment bermasalah
* memproses refund administratif
* melakukan override dengan audit log

Server/webhook boleh:

* mengubah status `pending` ke `paid`
* mengubah status `pending` ke `failed`
* mengubah status `pending` ke `expired`
* mengubah status menjadi `refunded` jika refund berhasil

## 14. Review Permission Rules

Review harus dijaga agar tidak menjadi manipulatif.

### 14.1 Review Create

UMKM boleh membuat review jika:

1. Order milik UMKM tersebut.
2. Order status `completed`.
3. Belum ada review untuk order tersebut.
4. Creator yang direview adalah creator dalam order tersebut.

### 14.2 Review Read

Guest, UMKM, creator, dan admin boleh membaca review yang `is_visible = true`.

Creator boleh membaca review untuk dirinya.

Admin boleh membaca semua review.

### 14.3 Review Update/Delete

UMKM boleh mengedit review sendiri dalam batas waktu tertentu jika aturan platform nanti dibuat.

Creator tidak boleh menghapus review.

Admin boleh menyembunyikan review jika:

* mengandung ujaran kasar
* mengandung data pribadi
* tidak relevan
* terbukti manipulatif
* melanggar aturan platform

Admin action harus masuk `activity_logs`.

## 15. Revision Permission Rules

### 15.1 UMKM

UMKM boleh meminta revisi jika:

1. Order miliknya.
2. Status order `submitted` atau `revised`.
3. Batas revisi belum habis.
4. Pesanan belum completed.

### 15.2 Creator

Creator boleh menanggapi revisi jika:

1. Order ditujukan kepadanya.
2. Ada revision status `requested`.
3. Order belum completed atau cancelled.

### 15.3 Admin

Admin boleh melihat semua revisi dan memberi catatan mediasi jika terjadi konflik.

## 16. Complaint Permission Rules

### 16.1 UMKM

UMKM boleh membuat complaint jika:

* order miliknya
* ada masalah hasil
* creator terlambat
* file tidak bisa diakses
* revisi tidak selesai
* pembayaran bermasalah

### 16.2 Creator

Creator boleh membuat complaint jika:

* order ditujukan kepadanya
* brief tidak sesuai kesepakatan
* UMKM meminta revisi di luar scope
* UMKM tidak merespons
* ada permintaan tidak wajar

### 16.3 Admin

Admin boleh:

* melihat complaint
* memberi status under_review
* meminta klarifikasi UMKM
* meminta klarifikasi creator
* memberi keputusan
* menyelesaikan complaint
* menolak complaint
* menyarankan refund
* menyelesaikan order

Semua perubahan complaint harus tercatat.

## 17. File Access Rules

File perlu dipisah berdasarkan tingkat akses.

### 17.1 Public Files

Dapat dibaca publik:

* avatar creator
* banner creator
* thumbnail portofolio
* gambar cover layanan

### 17.2 Semi-Private Files

Dapat dibaca oleh pemilik dan pihak terkait:

* logo UMKM
* aset brief
* foto produk untuk brief
* referensi campaign

Akses:

* UMKM pemilik
* creator yang menerima order
* admin

### 17.3 Private Files

Tidak public:

* hasil konten
* file revisi
* invoice
* dokumen mediasi
* attachment complaint

Akses:

* UMKM terkait
* creator terkait
* admin

### 17.4 File Upload Permissions

| Bucket          |       Guest |            UMKM |          Creator |  Admin |
| --------------- | ----------: | --------------: | ---------------: | -----: |
| avatars         |          No |      Upload own |       Upload own | Manage |
| business-assets |          No |      Upload own | Read if assigned | Manage |
| portfolios      | Read public |     Read public |       Upload own | Manage |
| submissions     |          No |   Read assigned |  Upload assigned | Manage |
| invoices        |          No |        Read own |     Limited read | Manage |
| complaint-files |          No | Upload assigned |  Upload assigned | Manage |

## 18. API Route Permission Rules

### 18.1 `/api/health`

Guest boleh akses karena hanya untuk cek status API.

### 18.2 `/api/checkout`

Hanya UMKM login.

Validasi:

* user role harus UMKM
* cart milik user
* service package aktif
* brief valid
* total amount dihitung server

### 18.3 `/api/payments/create`

Hanya UMKM login.

Validasi:

* order milik UMKM
* payment status pending
* total dihitung server
* user tidak boleh mengirim total manual sebagai sumber kebenaran

### 18.4 `/api/payments/webhook`

Hanya payment gateway/server.

Validasi:

* signature provider
* provider transaction id
* amount
* order id
* status transition

Tidak boleh dipanggil bebas dari browser.

### 18.5 `/api/orders/[orderId]/status`

Akses berdasarkan role.

* UMKM hanya untuk action tertentu pada order miliknya.
* Creator hanya untuk action tertentu pada order yang ditujukan kepadanya.
* Admin bisa override dengan audit log.
* Server bisa update sesuai webhook/system process.

### 18.6 `/api/orders/[orderId]/revision`

Akses:

* UMKM membuat revision request.
* Creator menanggapi revision.
* Admin melihat dan mediasi.

### 18.7 `/api/upload`

Akses berdasarkan bucket dan konteks.

* UMKM upload brief asset miliknya.
* Creator upload portfolio miliknya.
* Creator upload submission untuk order miliknya.
* Admin bisa manage file untuk kebutuhan mediasi.

## 19. Middleware atau Proxy Planning

Karena project memakai Next.js versi modern, proteksi route dapat dirancang melalui middleware/proxy layer dan server-side checks.

### 19.1 Public Route

Public route tidak perlu login.

Pattern:

* `/`
* `/katalog`
* `/kreator/:path*`
* `/layanan/:path*`
* `/cara-kerja`
* `/bantuan`

### 19.2 Auth Route

Auth route diarahkan sesuai status login.

Jika belum login:

* boleh akses `/login`
* boleh akses `/register`
* boleh akses `/forgot-password`

Jika sudah login:

* UMKM redirect ke `/umkm/dashboard`
* Creator redirect ke `/creator/dashboard`
* Admin redirect ke `/admin/dashboard`

### 19.3 Protected Route

Protected route harus login.

Pattern:

* `/umkm/:path*`
* `/creator/:path*`
* `/admin/:path*`

Rules:

* role UMKM hanya ke `/umkm/*`
* role Creator hanya ke `/creator/*`
* role Admin hanya ke `/admin/*`

### 19.4 API Route

API route memiliki aturan berbeda.

* `/api/health` public
* `/api/payments/webhook` khusus provider/server
* `/api/checkout` login UMKM
* `/api/payments/create` login UMKM
* `/api/orders/*` login dan ownership check
* `/api/upload` login dan ownership check

## 20. Route Redirect Rules

### 20.1 Guest Accessing Protected Route

Jika guest membuka:

* `/umkm/dashboard`
* `/creator/dashboard`
* `/admin/dashboard`

Redirect ke:

```txt
/login
```

Tambahkan query redirect jika perlu:

```txt
/login?redirect=/umkm/dashboard
```

### 20.2 UMKM Accessing Creator/Admin Route

Jika UMKM membuka:

* `/creator/*`
* `/admin/*`

Redirect ke:

```txt
/umkm/dashboard
```

### 20.3 Creator Accessing UMKM/Admin Route

Jika Creator membuka:

* `/umkm/*`
* `/admin/*`

Redirect ke:

```txt
/creator/dashboard
```

### 20.4 Admin Accessing UMKM/Creator Route

Admin tidak perlu mengakses route role lain. Jika admin membuka:

* `/umkm/*`
* `/creator/*`

Redirect ke:

```txt
/admin/dashboard
```

Catatan:

Jika nanti ada fitur admin preview/impersonation, itu harus dibuat eksplisit dan masuk audit log. Tidak masuk MVP.

## 21. Server Action and Route Handler Rules

Semua aksi penting harus divalidasi di server.

Aksi penting:

* create order
* create payment
* update payment status
* update order status
* submit result
* request revision
* submit review
* create complaint
* resolve complaint
* update platform settings

Server wajib mengecek:

1. User login atau tidak.
2. Role user.
3. Ownership data.
4. Status saat ini.
5. Status tujuan.
6. Validitas input.
7. Audit log jika aksi sensitif.

## 22. RLS Planning by Table

Bagian ini bukan SQL final, tetapi panduan logika RLS.

### 22.1 profiles

Select:

* user dapat select profile sendiri
* admin dapat select semua

Update:

* user dapat update profile sendiri
* admin dapat update account_status

Insert:

* dibuat otomatis saat register

Delete:

* tidak delete langsung, gunakan status inactive/suspended

### 22.2 umkm_profiles

Select:

* UMKM owner dapat select sendiri
* creator dapat select jika ada order terkait
* admin dapat select semua

Insert:

* UMKM dapat insert profile sendiri saat register/onboarding

Update:

* UMKM dapat update sendiri
* admin dapat update verification/status tertentu

Delete:

* hindari hard delete

### 22.3 creator_profiles

Select:

* public dapat select creator aktif yang public
* creator owner dapat select sendiri
* admin dapat select semua

Insert:

* creator dapat insert profile sendiri

Update:

* creator dapat update sendiri
* admin dapat update verification, featured, status

Delete:

* hindari hard delete

### 22.4 service_packages

Select:

* public dapat select layanan aktif
* creator owner dapat select layanan sendiri termasuk nonaktif
* admin dapat select semua

Insert:

* creator dapat insert layanan sendiri

Update:

* creator dapat update layanan miliknya
* admin dapat update moderation flags

Delete:

* soft delete atau inactive

### 22.5 carts

Select:

* hanya UMKM owner

Insert:

* hanya UMKM owner

Update:

* hanya UMKM owner

Delete:

* hanya UMKM owner

### 22.6 campaign_briefs

Select:

* UMKM owner
* creator yang menerima order terkait
* admin

Insert:

* UMKM owner

Update:

* UMKM owner jika belum locked oleh order
* admin untuk mediasi jika perlu

Delete:

* hanya draft dan milik UMKM

### 22.7 orders

Select:

* UMKM owner
* creator assigned
* admin

Insert:

* UMKM melalui checkout server flow

Update:

* UMKM hanya action terbatas
* creator hanya action terbatas
* admin override dengan audit
* server untuk payment-related update

Delete:

* tidak delete order transaksi

### 22.8 payments

Select:

* UMKM owner
* creator assigned summary
* admin

Insert:

* server route saat create payment

Update:

* server webhook
* admin

Delete:

* tidak delete payment

### 22.9 submissions

Select:

* UMKM order owner
* creator assigned
* admin

Insert:

* creator assigned

Update:

* creator assigned sebelum order completed
* admin jika mediasi

Delete:

* tidak delete setelah submitted, gunakan versioning

### 22.10 revisions

Select:

* UMKM owner
* creator assigned
* admin

Insert:

* UMKM owner untuk request revision

Update:

* creator assigned untuk response
* admin untuk mediation

### 22.11 reviews

Select:

* public jika `is_visible = true`
* creator terkait
* UMKM reviewer
* admin semua

Insert:

* UMKM order owner setelah completed

Update:

* UMKM reviewer dalam batas tertentu
* admin untuk moderation

Delete:

* hindari delete, gunakan `is_visible = false`

### 22.12 complaints

Select:

* complainant
* other party related to order
* admin

Insert:

* UMKM/creator yang terkait order

Update:

* admin
* pihak terkait hanya menambah respons jika fitur response dibuat

### 22.13 notifications

Select:

* user owner

Update:

* user owner hanya untuk mark read
* admin/system untuk membuat

Delete:

* user owner boleh hapus notifikasi milik sendiri

## 23. Client-Side UI Permission

Frontend tetap perlu menyembunyikan tombol yang tidak relevan, tetapi ini bukan pengamanan utama.

Contoh:

* tombol “Ajukan Revisi” hanya muncul untuk UMKM ketika status order `submitted` atau `revised`.
* tombol “Kirim Hasil” hanya muncul untuk Creator ketika status order `in_progress`.
* tombol “Selesaikan Pesanan” hanya muncul untuk UMKM ketika hasil sudah dikirim.
* tombol “Resolve Complaint” hanya muncul untuk Admin.
* tombol “Update Payment Status” tidak muncul untuk UMKM atau Creator.

Namun, meskipun tombol disembunyikan, server tetap wajib memvalidasi aksi.

## 24. UI Permission by Status

### 24.1 UMKM Order Detail

| Status             | UI Action                            |
| ------------------ | ------------------------------------ |
| awaiting_payment   | bayar, batalkan                      |
| paid               | lihat status                         |
| brief_accepted     | lihat detail                         |
| in_progress        | lihat progres                        |
| submitted          | lihat hasil, ajukan revisi, setujui  |
| revision_requested | menunggu revisi                      |
| revised            | lihat revisi, setujui, ajukan revisi |
| completed          | beri review                          |
| cancelled          | lihat ringkasan                      |
| refunded           | lihat ringkasan refund               |

### 24.2 Creator Order Detail

| Status                       | UI Action             |
| ---------------------------- | --------------------- |
| paid                         | terima order          |
| waiting_creator_confirmation | terima/tolak order    |
| brief_accepted               | mulai pengerjaan      |
| in_progress                  | kirim hasil           |
| submitted                    | menunggu respons UMKM |
| revision_requested           | kirim revisi          |
| revised                      | menunggu respons UMKM |
| completed                    | lihat review          |
| cancelled                    | lihat ringkasan       |

### 24.3 Admin Order Detail

Admin UI action:

* lihat semua detail
* tambah catatan
* ubah status terbatas
* batalkan order
* proses refund
* buka complaint
* resolve complaint
* lihat activity log

## 25. Security Anti-Patterns

Hindari pola berikut:

### 25.1 Menyimpan Role Hanya di Local Storage

Role di local storage mudah dimanipulasi. Role harus berasal dari server/database.

### 25.2 Mengandalkan Redirect Frontend Saja

Redirect frontend hanya untuk UX. Server dan RLS tetap harus menjaga data.

### 25.3 Payment Status dari Client

Client tidak boleh mengirim request seperti:

```json
{
  "payment_status": "paid"
}
```

lalu langsung dipercaya server.

Server harus memverifikasi payment provider atau admin action.

### 25.4 Service Role Key di Frontend

Service role key tidak boleh muncul pada client bundle.

### 25.5 File Private Public URL

File hasil konten dan invoice jangan dibuat public URL tanpa kontrol akses.

### 25.6 Admin Tanpa Audit Log

Aksi admin yang mengubah status transaksi harus tercatat.

## 26. Permission Constants Planning

Di codebase, role dan permission dapat dibuat sebagai constant.

Contoh arah file:

```txt
src/lib/constants/roles.ts
src/lib/constants/permissions.ts
src/lib/auth/guards.ts
src/lib/auth/session.ts
```

Contoh permission:

```ts
export const PERMISSIONS = {
  VIEW_ADMIN_DASHBOARD: "view_admin_dashboard",
  MANAGE_USERS: "manage_users",
  MANAGE_CREATORS: "manage_creators",
  MANAGE_ORDERS: "manage_orders",
  MANAGE_PAYMENTS: "manage_payments",
  CREATE_ORDER: "create_order",
  REQUEST_REVISION: "request_revision",
  SUBMIT_RESULT: "submit_result",
  SUBMIT_REVIEW: "submit_review",
} as const;
```

Role mapping:

```ts
export const ROLE_PERMISSIONS = {
  admin: [
    "view_admin_dashboard",
    "manage_users",
    "manage_creators",
    "manage_orders",
    "manage_payments",
  ],
  umkm: [
    "create_order",
    "request_revision",
    "submit_review",
  ],
  creator: [
    "submit_result",
  ],
} as const;
```

Catatan:

Permission constants hanya membantu logic aplikasi. Keamanan akhir tetap ada di server dan RLS.

## 27. Suggested Guard Functions

Arah function guard:

```ts
requireAuth()
requireRole("umkm")
requireRole("creator")
requireRole("admin")
canAccessOrder(user, order)
canManageService(user, service)
canCreateReview(user, order)
canUpdateOrderStatus(user, order, targetStatus)
canAccessFile(user, file)
```

Fungsi guard harus dipakai pada:

* server component yang membaca data sensitif
* route handler
* server action
* API payment
* API upload
* admin actions

## 28. Suggested Route Groups

Route group sudah benar:

```txt
src/app/(public)
src/app/(auth)
src/app/(umkm)
src/app/(creator)
src/app/(admin)
src/app/api
```

Mapping:

| Route Group | Role                |
| ----------- | ------------------- |
| `(public)`  | Guest, all users    |
| `(auth)`    | Guest               |
| `(umkm)`    | UMKM                |
| `(creator)` | Creator             |
| `(admin)`   | Admin               |
| `api`       | Depends on endpoint |

## 29. MVP Permission Scope

Untuk MVP awal, permission boleh dibuat bertahap.

### 29.1 MVP Tahap UI Dummy

Pada tahap UI dummy:

* role belum real
* data masih dummy
* route dashboard masih bisa dibuka langsung
* tombol tetap disesuaikan role secara UI
* dokumen ini menjadi pedoman logic

### 29.2 MVP Tahap Auth

Pada tahap Supabase Auth:

* login/register aktif
* profile role dibuat
* route protection aktif
* user diarahkan sesuai role

### 29.3 MVP Tahap Database

Pada tahap database:

* RLS aktif untuk tabel penting
* query dashboard berdasarkan user
* order hanya terbaca oleh pihak terkait
* service hanya bisa diedit owner
* payment hanya bisa diubah server/admin

### 29.4 MVP Tahap Payment

Pada tahap payment:

* payment create server-side
* payment webhook server-side
* payment status verified
* order status mengikuti payment status
* payment activity dicatat

## 30. Testing Permission

Permission harus diuji, bukan hanya diasumsikan.

### 30.1 Route Test

Test:

* guest membuka `/umkm/dashboard` harus redirect login
* guest membuka `/creator/dashboard` harus redirect login
* guest membuka `/admin/dashboard` harus redirect login
* UMKM membuka `/creator/dashboard` harus redirect
* Creator membuka `/umkm/dashboard` harus redirect
* non-admin membuka `/admin/dashboard` harus redirect

### 30.2 Data Access Test

Test:

* UMKM A tidak bisa membaca order UMKM B
* Creator A tidak bisa membaca order Creator B
* Guest tidak bisa membaca order
* Creator tidak bisa update payment
* UMKM tidak bisa update payment status
* Review hanya bisa dibuat untuk completed order

### 30.3 API Test

Test:

* `/api/checkout` menolak guest
* `/api/payments/create` menolak creator
* `/api/payments/webhook` menolak request tanpa signature valid
* `/api/orders/[orderId]/status` menolak transition tidak valid
* `/api/upload` menolak upload ke bucket yang tidak sesuai role

## 31. Implementation Roadmap

### 31.1 Phase 1 — UI Role Separation

* Buat layout public.
* Buat layout auth.
* Buat dashboard shell UMKM.
* Buat dashboard shell Creator.
* Buat dashboard shell Admin.
* Buat navigasi sesuai role.

### 31.2 Phase 2 — Dummy Role

* Buat role switch dummy jika diperlukan.
* Buat redirect dummy untuk login.
* Buat data dummy berdasarkan role.

### 31.3 Phase 3 — Supabase Auth

* Setup Supabase client/server.
* Setup register.
* Setup login.
* Buat profile setelah register.
* Simpan role di `profiles`.

### 31.4 Phase 4 — Route Guard

* Buat guard server.
* Buat middleware/proxy.
* Redirect berdasarkan role.
* Proteksi dashboard.

### 31.5 Phase 5 — RLS

* Aktifkan RLS.
* Buat policy profiles.
* Buat policy creator_profiles.
* Buat policy service_packages.
* Buat policy orders.
* Buat policy payments.
* Buat policy submissions.
* Buat policy reviews.

### 31.6 Phase 6 — Server Action and API Protection

* Validasi semua route handler.
* Tambahkan ownership check.
* Tambahkan status transition check.
* Tambahkan activity log untuk admin action.

## 32. Definition of Done

Dokumen permission dianggap berhasil diterapkan jika:

1. Setiap role memiliki dashboard berbeda.
2. Setiap role hanya melihat menu yang relevan.
3. Guest tidak bisa membuka dashboard.
4. UMKM tidak bisa membuka dashboard creator/admin.
5. Creator tidak bisa membuka dashboard UMKM/admin.
6. Admin hanya memakai dashboard admin.
7. Data order hanya terbaca oleh pihak terkait.
8. Payment status tidak bisa diubah client.
9. Review hanya bisa dibuat oleh UMKM yang menyelesaikan order.
10. File hasil konten tidak public.
11. Admin action tercatat.
12. RLS aktif untuk tabel sensitif.
13. Server guard ada untuk aksi penting.
14. Tidak ada service role key di client.
15. Permission diuji dengan skenario negatif.

## 33. Kesimpulan

Roles and permissions adalah fondasi keamanan dan struktur bisnis Ruang Usaha Kita. Platform ini memiliki tiga role login utama: UMKM, Creator, dan Admin. Setiap role memiliki kebutuhan, route, data, dan aksi yang berbeda.

Pada tahap awal, permission dapat diterapkan di level UI dan routing dummy. Namun, ketika Supabase dan database mulai digunakan, permission harus diterapkan di tiga lapisan: frontend untuk UX, server untuk validasi aksi, dan Supabase RLS untuk keamanan data.

Dokumen ini harus menjadi acuan sebelum membuat auth, dashboard role, API order, payment, upload, review, dan admin management. Tanpa permission yang jelas, marketplace akan rawan kacau karena user dapat melihat atau mengubah data yang seharusnya bukan miliknya.
