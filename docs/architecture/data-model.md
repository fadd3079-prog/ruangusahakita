# Ruang Usaha Kita — Data Model

## 1. Tujuan Dokumen

Dokumen ini menjelaskan rancangan data model untuk website Ruang Usaha Kita. Data model digunakan sebagai pedoman sebelum membuat tabel Supabase, menulis migration SQL, membuat query, menyusun fitur backend, dan membangun integrasi antarhalaman.

Ruang Usaha Kita adalah marketplace jasa digital yang menghubungkan UMKM dengan content creator atau marketer untuk kebutuhan promosi digital. Karena bentuk bisnisnya adalah marketplace jasa, struktur database harus menyesuaikan alur jasa digital, bukan alur toko barang fisik.

Data model ini dirancang untuk mendukung:

1. Manajemen user dan role.
2. Profil UMKM.
3. Profil creator.
4. Katalog kreator.
5. Paket jasa.
6. Portofolio.
7. Keranjang layanan.
8. Checkout brief campaign.
9. Order management.
10. Payment management.
11. Digital delivery atau pengiriman hasil konten.
12. Revisi.
13. Review dan rating.
14. Komplain dan mediasi.
15. Notifikasi.
16. Laporan penjualan.
17. Admin management.
18. Supabase Row Level Security.
19. Supabase Storage.
20. Pengembangan fitur lanjutan seperti recommendation, analytics, dan AI brief assistant.

## 2. Prinsip Data Model

Data model Ruang Usaha Kita mengikuti prinsip berikut:

### 2.1 Service Marketplace First

Database tidak boleh dirancang seperti toko barang fisik.

Hindari konsep:

* stock
* warehouse
* courier
* shipping
* packing
* delivery address
* tracking number
* resi
* inventory barang
* varian barang fisik

Gunakan konsep:

* service package
* creator availability
* campaign brief
* digital submission
* revision
* order timeline
* payment status
* content result
* review
* complaint

### 2.2 Role-Based Access

Setiap data harus dipikirkan berdasarkan role pengguna:

1. UMKM hanya boleh melihat dan mengelola data miliknya.
2. Creator hanya boleh melihat dan mengelola data yang terkait dengannya.
3. Admin dapat memantau dan mengelola seluruh data platform.
4. Guest hanya boleh melihat data public seperti katalog, detail kreator, dan detail layanan yang aktif.

### 2.3 Order as the Core Entity

Order adalah pusat sistem. Hampir semua data penting akan terhubung ke order.

Order menghubungkan:

* UMKM
* creator
* service package
* campaign brief
* payment
* invoice
* submission
* revision
* review
* complaint
* status history

Karena itu, tabel `orders` harus dirancang dengan hati-hati.

### 2.4 Payment Status and Order Status Are Different

Status pembayaran dan status pengerjaan tidak boleh dicampur.

Contoh:

* payment status: pending, paid, failed, expired, refunded
* order status: awaiting_payment, paid, brief_accepted, in_progress, submitted, revision_requested, completed

Payment status menjawab apakah pembayaran sudah berhasil.

Order status menjawab sudah sampai mana proses pengerjaan jasa digital.

### 2.5 Data Dummy First, Real Integration Later

Pada tahap awal, database boleh memakai data dummy/seed. Setelah UI dan alur stabil, baru masuk ke integrasi real:

* Supabase Auth
* Supabase RLS
* Supabase Storage
* payment gateway sandbox
* webhook
* email notification
* analytics

### 2.6 Auditability

Data penting harus memiliki jejak waktu.

Gunakan field:

* created_at
* updated_at
* deleted_at jika soft delete dibutuhkan
* created_by jika perlu
* updated_by jika perlu

Untuk order, status harus dicatat dalam `order_status_history` agar perubahan status tidak hilang.

## 3. Database Technology

Database utama menggunakan Supabase PostgreSQL.

Komponen Supabase yang relevan:

1. PostgreSQL untuk relational database.
2. Supabase Auth untuk user authentication.
3. Row Level Security untuk authorization.
4. Supabase Storage untuk file.
5. Supabase Realtime untuk pengembangan notifikasi/status real-time tahap lanjutan.
6. Edge Functions atau Next.js API routes untuk proses server-side seperti payment webhook.

## 4. Naming Convention

### 4.1 Table Naming

Gunakan snake_case dan plural noun.

Contoh:

* profiles
* umkm_profiles
* creator_profiles
* service_categories
* service_packages
* orders
* payments
* invoices

### 4.2 Column Naming

Gunakan snake_case.

Contoh:

* user_id
* creator_id
* order_status
* payment_status
* created_at
* updated_at

### 4.3 Primary Key

Gunakan `uuid` sebagai primary key.

Contoh:

```sql
id uuid primary key default gen_random_uuid()
```

### 4.4 Foreign Key

Gunakan format:

```txt
nama_entity_id
```

Contoh:

* user_id
* umkm_id
* creator_id
* service_id
* order_id
* payment_id

### 4.5 Enum Naming

Gunakan singular snake_case.

Contoh:

* user_role
* order_status
* payment_status
* complaint_status

## 5. Entity Relationship Overview

Entitas utama:

1. auth.users
2. profiles
3. umkm_profiles
4. creator_profiles
5. service_categories
6. service_packages
7. service_package_tiers
8. portfolios
9. carts
10. cart_items
11. campaign_briefs
12. orders
13. order_items
14. payments
15. invoices
16. order_status_history
17. submissions
18. revisions
19. reviews
20. complaints
21. notifications
22. messages
23. platform_settings
24. saved_creators
25. activity_logs

Relasi utama:

* satu user memiliki satu profile
* satu profile dapat menjadi UMKM atau creator
* satu UMKM dapat membuat banyak order
* satu creator dapat memiliki banyak service package
* satu service package dapat memiliki beberapa tier
* satu order dimiliki oleh satu UMKM dan satu creator
* satu order memiliki satu campaign brief
* satu order dapat memiliki satu atau beberapa payment
* satu order dapat memiliki banyak submission
* satu order dapat memiliki banyak revision
* satu order dapat memiliki satu review dari UMKM
* satu order dapat memiliki complaint jika bermasalah
* satu order memiliki banyak status history

## 6. Enum Types

Enum digunakan agar status dan role konsisten.

### 6.1 user_role

```sql
create type user_role as enum (
  'admin',
  'umkm',
  'creator'
);
```

Makna:

| Value   | Makna                         |
| ------- | ----------------------------- |
| admin   | Pengelola platform            |
| umkm    | Pembeli jasa promosi digital  |
| creator | Penyedia jasa promosi digital |

### 6.2 account_status

```sql
create type account_status as enum (
  'active',
  'inactive',
  'suspended',
  'pending_verification'
);
```

Makna:

| Value                | Makna               |
| -------------------- | ------------------- |
| active               | Akun aktif          |
| inactive             | Akun tidak aktif    |
| suspended            | Akun dibekukan      |
| pending_verification | Menunggu verifikasi |

### 6.3 creator_availability_status

```sql
create type creator_availability_status as enum (
  'available',
  'limited',
  'busy',
  'unavailable'
);
```

Makna:

| Value       | Label UI        | Makna                                      |
| ----------- | --------------- | ------------------------------------------ |
| available   | Tersedia        | Kreator menerima order                     |
| limited     | Jadwal Terbatas | Kreator masih bisa menerima order terbatas |
| busy        | Sedang Penuh    | Kreator sedang banyak order                |
| unavailable | Tidak Tersedia  | Kreator tidak menerima order               |

### 6.4 order_status

```sql
create type order_status as enum (
  'draft',
  'awaiting_payment',
  'paid',
  'waiting_creator_confirmation',
  'brief_accepted',
  'in_progress',
  'submitted',
  'revision_requested',
  'revised',
  'completed',
  'cancelled',
  'refunded'
);
```

Makna:

| Value                        | Label UI                    | Makna                             |
| ---------------------------- | --------------------------- | --------------------------------- |
| draft                        | Draft                       | Pesanan belum selesai dibuat      |
| awaiting_payment             | Menunggu Pembayaran         | UMKM belum membayar               |
| paid                         | Dibayar                     | Pembayaran berhasil               |
| waiting_creator_confirmation | Menunggu Konfirmasi Kreator | Kreator belum menerima order      |
| brief_accepted               | Brief Diterima              | Brief sudah diterima kreator      |
| in_progress                  | Konten Diproduksi           | Kreator sedang mengerjakan konten |
| submitted                    | Hasil Dikirim               | Kreator mengirim hasil            |
| revision_requested           | Revisi Diminta              | UMKM meminta revisi               |
| revised                      | Revisi Dikirim              | Kreator mengirim hasil revisi     |
| completed                    | Selesai                     | Order disetujui dan ditutup       |
| cancelled                    | Dibatalkan                  | Order dibatalkan                  |
| refunded                     | Refund                      | Dana dikembalikan sebagian/penuh  |

### 6.5 payment_status

```sql
create type payment_status as enum (
  'pending',
  'paid',
  'failed',
  'expired',
  'refunded',
  'partially_refunded'
);
```

Makna:

| Value              | Label UI            | Makna                            |
| ------------------ | ------------------- | -------------------------------- |
| pending            | Menunggu Pembayaran | Belum dibayar                    |
| paid               | Dibayar             | Pembayaran berhasil              |
| failed             | Gagal               | Pembayaran gagal                 |
| expired            | Kedaluwarsa         | Batas pembayaran lewat           |
| refunded           | Refund              | Pembayaran dikembalikan penuh    |
| partially_refunded | Refund Sebagian     | Pembayaran dikembalikan sebagian |

### 6.6 payment_method

```sql
create type payment_method as enum (
  'bank_transfer',
  'qris',
  'ewallet',
  'virtual_account',
  'manual'
);
```

### 6.7 revision_status

```sql
create type revision_status as enum (
  'requested',
  'in_progress',
  'submitted',
  'approved',
  'rejected'
);
```

### 6.8 complaint_status

```sql
create type complaint_status as enum (
  'open',
  'under_review',
  'waiting_umkm',
  'waiting_creator',
  'resolved',
  'rejected'
);
```

### 6.9 notification_type

```sql
create type notification_type as enum (
  'order',
  'payment',
  'revision',
  'submission',
  'review',
  'complaint',
  'system'
);
```

## 7. Table: profiles

### 7.1 Tujuan

Tabel `profiles` menyimpan data dasar semua user. Tabel ini terhubung langsung dengan `auth.users` dari Supabase.

### 7.2 Struktur

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null,
  full_name text not null,
  email text not null unique,
  phone text,
  avatar_url text,
  account_status account_status not null default 'active',
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 7.3 Field Explanation

| Field          | Tipe           | Fungsi                       |
| -------------- | -------------- | ---------------------------- |
| id             | uuid           | Sama dengan id di auth.users |
| role           | user_role      | Menentukan role user         |
| full_name      | text           | Nama lengkap user            |
| email          | text           | Email login                  |
| phone          | text           | Nomor WhatsApp/telepon       |
| avatar_url     | text           | Foto profil                  |
| account_status | account_status | Status akun                  |
| last_login_at  | timestamptz    | Login terakhir               |
| created_at     | timestamptz    | Waktu dibuat                 |
| updated_at     | timestamptz    | Waktu diperbarui             |

### 7.4 Catatan

Tabel ini menjadi pusat identitas user. Detail role disimpan di tabel terpisah:

* UMKM detail di `umkm_profiles`
* Creator detail di `creator_profiles`

## 8. Table: umkm_profiles

### 8.1 Tujuan

Menyimpan data profil usaha UMKM.

### 8.2 Struktur

```sql
create table umkm_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  business_name text not null,
  business_category text,
  business_description text,
  owner_name text,
  location text,
  city text,
  province text,
  instagram_url text,
  tiktok_url text,
  whatsapp_number text,
  logo_url text,
  target_audience text,
  content_preference text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 8.3 Field Explanation

| Field                | Fungsi                        |
| -------------------- | ----------------------------- |
| user_id              | Menghubungkan UMKM ke profile |
| business_name        | Nama usaha                    |
| business_category    | Kategori usaha                |
| business_description | Deskripsi singkat usaha       |
| owner_name           | Nama pemilik                  |
| location             | Lokasi umum                   |
| city                 | Kota/kabupaten                |
| province             | Provinsi                      |
| instagram_url        | Link Instagram                |
| tiktok_url           | Link TikTok                   |
| whatsapp_number      | Nomor WhatsApp                |
| logo_url             | Logo usaha                    |
| target_audience      | Target audiens umum           |
| content_preference   | Preferensi gaya konten        |
| is_verified          | Status verifikasi UMKM        |

### 8.4 Catatan

UMKM profile penting untuk membantu kreator memahami konteks usaha saat membaca brief campaign.

## 9. Table: creator_profiles

### 9.1 Tujuan

Menyimpan data profil content creator atau marketer.

### 9.2 Struktur

```sql
create table creator_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  display_name text not null,
  bio text,
  location text,
  city text,
  province text,
  niche text,
  skills text[],
  instagram_url text,
  tiktok_url text,
  youtube_url text,
  portfolio_url text,
  banner_url text,
  avatar_url text,
  availability_status creator_availability_status not null default 'available',
  starting_price numeric(12,2) default 0,
  average_rating numeric(3,2) default 0,
  completed_orders_count integer not null default 0,
  response_time_hours integer,
  is_verified boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 9.3 Field Explanation

| Field                  | Fungsi                           |
| ---------------------- | -------------------------------- |
| user_id                | Menghubungkan kreator ke profile |
| display_name           | Nama publik kreator              |
| bio                    | Deskripsi diri                   |
| niche                  | Fokus konten                     |
| skills                 | Daftar keahlian                  |
| social links           | Link sosial media                |
| availability_status    | Status menerima order            |
| starting_price         | Harga mulai                      |
| average_rating         | Rating rata-rata                 |
| completed_orders_count | Jumlah order selesai             |
| response_time_hours    | Estimasi respons                 |
| is_verified            | Verifikasi kreator               |
| is_featured            | Kreator unggulan                 |

### 9.4 Catatan

`creator_profiles` menggantikan sebagian konsep seller profile pada marketplace barang. Namun, karena ini jasa digital, data yang lebih penting adalah niche, portofolio, rating, dan availability.

## 10. Table: service_categories

### 10.1 Tujuan

Menyimpan kategori layanan.

### 10.2 Struktur

```sql
create table service_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  icon_name text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 10.3 Contoh Data

| name                  | slug                  |
| --------------------- | --------------------- |
| Video TikTok/Reels    | video-tiktok-reels    |
| Desain Feed Instagram | desain-feed-instagram |
| Foto Produk           | foto-produk           |
| Review Produk         | review-produk         |
| Caption Promosi       | caption-promosi       |
| Campaign UMKM         | campaign-umkm         |

## 11. Table: service_packages

### 11.1 Tujuan

Menyimpan layanan utama yang dibuat oleh creator.

### 11.2 Struktur

```sql
create table service_packages (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references creator_profiles(id) on delete cascade,
  category_id uuid references service_categories(id) on delete set null,
  title text not null,
  slug text not null,
  short_description text,
  description text,
  cover_image_url text,
  base_price numeric(12,2) not null default 0,
  estimated_days integer not null default 3,
  revision_count integer not null default 1,
  deliverables text[],
  requirements text[],
  tags text[],
  is_active boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (creator_id, slug)
);
```

### 11.3 Field Explanation

| Field             | Fungsi                  |
| ----------------- | ----------------------- |
| creator_id        | Pemilik layanan         |
| category_id       | Kategori layanan        |
| title             | Nama layanan            |
| slug              | URL-friendly identifier |
| short_description | Deskripsi ringkas       |
| description       | Deskripsi lengkap       |
| cover_image_url   | Gambar cover layanan    |
| base_price        | Harga mulai             |
| estimated_days    | Estimasi pengerjaan     |
| revision_count    | Jumlah revisi bawaan    |
| deliverables      | Output layanan          |
| requirements      | Syarat brief dari UMKM  |
| tags              | Tag untuk search        |
| is_active         | Status tampil/tidak     |
| is_featured       | Layanan unggulan        |

### 11.4 Catatan

Tabel ini mewakili “produk” dalam e-commerce, tetapi dalam UI tetap disebut “paket jasa” atau “layanan”.

## 12. Table: service_package_tiers

### 12.1 Tujuan

Menyimpan variasi paket seperti Basic, Standard, dan Premium.

### 12.2 Struktur

```sql
create table service_package_tiers (
  id uuid primary key default gen_random_uuid(),
  service_package_id uuid not null references service_packages(id) on delete cascade,
  name text not null,
  description text,
  price numeric(12,2) not null,
  estimated_days integer not null,
  revision_count integer not null default 1,
  deliverables text[],
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 12.3 Contoh Data

| name     |  price | deliverables                                         |
| -------- | -----: | ---------------------------------------------------- |
| Basic    | 150000 | 1 video pendek, 1 caption                            |
| Standard | 300000 | 2 video pendek, 2 caption, konsep campaign sederhana |
| Premium  | 500000 | 3 video pendek, 3 caption, laporan sederhana         |

## 13. Table: service_addons

### 13.1 Tujuan

Menyimpan add-on layanan tambahan.

### 13.2 Struktur

```sql
create table service_addons (
  id uuid primary key default gen_random_uuid(),
  service_package_id uuid not null references service_packages(id) on delete cascade,
  name text not null,
  description text,
  price numeric(12,2) not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 13.3 Contoh Add-on

* revisi tambahan
* caption tambahan
* file mentah
* bantuan brief campaign
* pengerjaan lebih cepat

## 14. Table: portfolios

### 14.1 Tujuan

Menyimpan portofolio kreator.

### 14.2 Struktur

```sql
create table portfolios (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references creator_profiles(id) on delete cascade,
  title text not null,
  description text,
  category_id uuid references service_categories(id) on delete set null,
  thumbnail_url text,
  media_url text,
  external_url text,
  client_type text,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 14.3 Catatan

Untuk MVP, portofolio bisa memakai link eksternal seperti Instagram, TikTok, YouTube, Google Drive, atau gambar dummy.

## 15. Table: carts

### 15.1 Tujuan

Menyimpan keranjang UMKM.

### 15.2 Struktur

```sql
create table carts (
  id uuid primary key default gen_random_uuid(),
  umkm_id uuid not null references umkm_profiles(id) on delete cascade,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 15.3 Catatan

Cart hanya menyimpan keranjang aktif sebelum checkout. Setelah checkout berhasil, data dipindahkan menjadi order.

## 16. Table: cart_items

### 16.1 Tujuan

Menyimpan item paket jasa di cart.

### 16.2 Struktur

```sql
create table cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references carts(id) on delete cascade,
  service_package_id uuid not null references service_packages(id) on delete cascade,
  tier_id uuid references service_package_tiers(id) on delete set null,
  creator_id uuid not null references creator_profiles(id) on delete cascade,
  quantity integer not null default 1,
  unit_price numeric(12,2) not null,
  addon_total numeric(12,2) not null default 0,
  subtotal numeric(12,2) not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 16.3 Catatan

`quantity` tetap disediakan untuk fleksibilitas teknis, tetapi UI tidak menonjolkannya karena jasa digital biasanya dipesan berdasarkan scope, bukan jumlah barang.

## 17. Table: cart_item_addons

### 17.1 Tujuan

Menyimpan add-on yang dipilih pada cart item.

### 17.2 Struktur

```sql
create table cart_item_addons (
  id uuid primary key default gen_random_uuid(),
  cart_item_id uuid not null references cart_items(id) on delete cascade,
  addon_id uuid not null references service_addons(id) on delete cascade,
  price numeric(12,2) not null,
  created_at timestamptz not null default now()
);
```

## 18. Table: campaign_briefs

### 18.1 Tujuan

Menyimpan brief campaign dari UMKM.

### 18.2 Struktur

```sql
create table campaign_briefs (
  id uuid primary key default gen_random_uuid(),
  umkm_id uuid not null references umkm_profiles(id) on delete cascade,
  order_id uuid,
  business_name text not null,
  business_category text,
  promoted_product text not null,
  campaign_goal text not null,
  target_audience text,
  content_platforms text[],
  content_style text,
  reference_links text[],
  deadline date,
  additional_notes text,
  asset_urls text[],
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 18.3 Field Explanation

| Field             | Fungsi                        |
| ----------------- | ----------------------------- |
| promoted_product  | Produk/jasa yang dipromosikan |
| campaign_goal     | Tujuan campaign               |
| target_audience   | Target audiens                |
| content_platforms | Platform konten               |
| content_style     | Gaya konten                   |
| reference_links   | Referensi konten              |
| deadline          | Deadline pengerjaan           |
| asset_urls        | Aset pendukung                |

### 18.4 Catatan

`order_id` bisa nullable pada awalnya karena brief dapat disimpan sebagai draft sebelum order dibuat. Setelah checkout, brief dihubungkan ke order.

## 19. Table: orders

### 19.1 Tujuan

Menyimpan data pesanan utama.

### 19.2 Struktur

```sql
create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  umkm_id uuid not null references umkm_profiles(id) on delete restrict,
  creator_id uuid not null references creator_profiles(id) on delete restrict,
  campaign_brief_id uuid references campaign_briefs(id) on delete set null,
  order_status order_status not null default 'awaiting_payment',
  payment_status payment_status not null default 'pending',
  subtotal_amount numeric(12,2) not null default 0,
  addon_amount numeric(12,2) not null default 0,
  admin_fee numeric(12,2) not null default 0,
  platform_fee numeric(12,2) not null default 0,
  discount_amount numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null default 0,
  deadline date,
  completed_at timestamptz,
  cancelled_at timestamptz,
  cancellation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 19.3 Field Explanation

| Field             | Fungsi                        |
| ----------------- | ----------------------------- |
| order_number      | Nomor order yang tampil di UI |
| umkm_id           | Pemesan                       |
| creator_id        | Kreator yang mengerjakan      |
| campaign_brief_id | Brief terkait                 |
| order_status      | Status pengerjaan             |
| payment_status    | Status pembayaran             |
| subtotal_amount   | Harga layanan                 |
| addon_amount      | Total add-on                  |
| admin_fee         | Biaya admin                   |
| platform_fee      | Komisi platform               |
| discount_amount   | Diskon                        |
| total_amount      | Total pembayaran              |
| deadline          | Batas pengerjaan              |
| completed_at      | Waktu selesai                 |
| cancelled_at      | Waktu dibatalkan              |

### 19.4 Catatan

Order harus dibuat setelah checkout. Order adalah titik pusat transaksi dan pengerjaan.

## 20. Table: order_items

### 20.1 Tujuan

Menyimpan detail layanan dalam order.

### 20.2 Struktur

```sql
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  service_package_id uuid references service_packages(id) on delete set null,
  tier_id uuid references service_package_tiers(id) on delete set null,
  service_title text not null,
  tier_name text,
  unit_price numeric(12,2) not null,
  addon_total numeric(12,2) not null default 0,
  subtotal numeric(12,2) not null,
  estimated_days integer,
  revision_count integer,
  deliverables text[],
  created_at timestamptz not null default now()
);
```

### 20.3 Catatan

Data seperti `service_title`, `tier_name`, dan `unit_price` disalin ke order item agar histori transaksi tetap aman walaupun kreator mengubah paket jasa di masa depan.

## 21. Table: order_item_addons

### 21.1 Tujuan

Menyimpan add-on yang masuk ke order.

### 21.2 Struktur

```sql
create table order_item_addons (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid not null references order_items(id) on delete cascade,
  addon_name text not null,
  price numeric(12,2) not null,
  created_at timestamptz not null default now()
);
```

## 22. Table: payments

### 22.1 Tujuan

Menyimpan data pembayaran.

### 22.2 Struktur

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

### 22.3 Field Explanation

| Field                   | Fungsi                        |
| ----------------------- | ----------------------------- |
| payment_number          | Nomor pembayaran              |
| provider                | Nama payment gateway          |
| provider_transaction_id | ID transaksi provider         |
| provider_payment_url    | URL pembayaran                |
| raw_response            | Response provider untuk audit |

### 22.4 Catatan Keamanan

Payment status tidak boleh diubah langsung dari client. Perubahan status harus melalui:

* webhook payment gateway
* admin action
* server-side API

## 23. Table: invoices

### 23.1 Tujuan

Menyimpan invoice transaksi.

### 23.2 Struktur

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

### 23.3 Catatan

Pada MVP, invoice bisa berupa halaman UI. PDF invoice bisa menjadi fitur lanjutan.

## 24. Table: order_status_history

### 24.1 Tujuan

Mencatat perubahan status order.

### 24.2 Struktur

```sql
create table order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  previous_status order_status,
  new_status order_status not null,
  changed_by uuid references profiles(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);
```

### 24.3 Catatan

Tabel ini penting untuk timeline status pesanan. UI order detail harus membaca data dari tabel ini agar proses order terlihat jelas.

## 25. Table: submissions

### 25.1 Tujuan

Menyimpan hasil konten yang dikirim oleh creator.

### 25.2 Struktur

```sql
create table submissions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  creator_id uuid not null references creator_profiles(id) on delete restrict,
  title text not null,
  description text,
  file_urls text[],
  external_links text[],
  caption_text text,
  submission_type text,
  version_number integer not null default 1,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
```

### 25.3 Jenis Hasil

* file video
* file desain
* foto produk
* caption
* link Google Drive
* link TikTok
* link Instagram
* link unggahan publik

### 25.4 Catatan

Untuk MVP, hasil bisa berupa link. Upload file besar ditunda agar storage tidak cepat penuh.

## 26. Table: revisions

### 26.1 Tujuan

Menyimpan permintaan revisi.

### 26.2 Struktur

```sql
create table revisions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  submission_id uuid references submissions(id) on delete set null,
  requested_by uuid not null references profiles(id) on delete restrict,
  revision_status revision_status not null default 'requested',
  revision_note text not null,
  reference_urls text[],
  response_note text,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 26.3 Catatan

Jumlah revisi yang diperbolehkan dapat dihitung berdasarkan `revision_count` dari order item.

## 27. Table: reviews

### 27.1 Tujuan

Menyimpan rating dan ulasan setelah order selesai.

### 27.2 Struktur

```sql
create table reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references orders(id) on delete cascade,
  umkm_id uuid not null references umkm_profiles(id) on delete restrict,
  creator_id uuid not null references creator_profiles(id) on delete restrict,
  rating integer not null check (rating >= 1 and rating <= 5),
  quality_rating integer check (quality_rating >= 1 and quality_rating <= 5),
  communication_rating integer check (communication_rating >= 1 and communication_rating <= 5),
  timeliness_rating integer check (timeliness_rating >= 1 and timeliness_rating <= 5),
  comment text,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 27.3 Catatan

Review hanya boleh dibuat oleh UMKM yang memiliki order completed. Admin dapat menyembunyikan review jika melanggar aturan.

## 28. Table: complaints

### 28.1 Tujuan

Menyimpan komplain atau sengketa antara UMKM dan creator.

### 28.2 Struktur

```sql
create table complaints (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  opened_by uuid not null references profiles(id) on delete restrict,
  assigned_admin_id uuid references profiles(id) on delete set null,
  complaint_status complaint_status not null default 'open',
  subject text not null,
  description text not null,
  resolution_note text,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

### 28.3 Use Case

* hasil tidak sesuai brief
* creator terlambat
* UMKM meminta refund
* file hasil tidak bisa diakses
* revisi tidak diselesaikan
* komunikasi bermasalah

## 29. Table: messages

### 29.1 Tujuan

Menyimpan pesan atau komentar dalam konteks order.

### 29.2 Struktur

```sql
create table messages (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  message text not null,
  attachment_urls text[],
  is_internal boolean not null default false,
  created_at timestamptz not null default now()
);
```

### 29.3 Catatan

Untuk MVP, pesan bisa berupa comment thread sederhana. Chat real-time masuk tahap lanjutan.

## 30. Table: notifications

### 30.1 Tujuan

Menyimpan notifikasi dalam aplikasi.

### 30.2 Struktur

```sql
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  notification_type notification_type not null default 'system',
  title text not null,
  message text,
  action_url text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
```

### 30.3 Contoh Notifikasi

* Pembayaran berhasil.
* Brief diterima kreator.
* Hasil konten dikirim.
* Revisi diminta.
* Pesanan selesai.
* Komplain baru masuk.

## 31. Table: saved_creators

### 31.1 Tujuan

Menyimpan kreator favorit UMKM.

### 31.2 Struktur

```sql
create table saved_creators (
  id uuid primary key default gen_random_uuid(),
  umkm_id uuid not null references umkm_profiles(id) on delete cascade,
  creator_id uuid not null references creator_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (umkm_id, creator_id)
);
```

## 32. Table: platform_settings

### 32.1 Tujuan

Menyimpan konfigurasi platform.

### 32.2 Struktur

```sql
create table platform_settings (
  key text primary key,
  value jsonb not null,
  description text,
  updated_by uuid references profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);
```

### 32.3 Contoh Settings

| key                     | value              |
| ----------------------- | ------------------ |
| admin_fee               | {"amount": 5000}   |
| platform_fee_percentage | {"percentage": 10} |
| max_revision_default    | {"count": 1}       |
| payment_expiry_hours    | {"hours": 24}      |
| featured_creator_limit  | {"count": 6}       |

## 33. Table: activity_logs

### 33.1 Tujuan

Mencatat aktivitas penting di sistem.

### 33.2 Struktur

```sql
create table activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);
```

### 33.3 Contoh Activity

* user_registered
* service_created
* order_created
* payment_paid
* order_completed
* revision_requested
* complaint_opened
* admin_updated_setting

## 34. Storage Buckets

Supabase Storage digunakan untuk file yang dibutuhkan platform.

### 34.1 avatars

Untuk:

* avatar UMKM
* avatar creator
* avatar admin

Access:

* public read jika avatar publik
* owner write

### 34.2 business-assets

Untuk:

* logo UMKM
* foto produk
* brand guideline
* aset brief

Access:

* UMKM owner read/write
* creator read jika terkait order
* admin read

### 34.3 portfolios

Untuk:

* thumbnail portofolio
* gambar desain
* preview karya

Access:

* public read jika portofolio aktif
* creator owner write
* admin moderation

### 34.4 submissions

Untuk:

* hasil konten
* file desain
* dokumen caption
* file revisi

Access:

* UMKM terkait read
* creator terkait read/write
* admin read
* tidak public secara default

### 34.5 invoices

Untuk:

* invoice PDF tahap lanjutan

Access:

* UMKM terkait read
* admin read
* tidak public

## 35. Relationship Detail

### 35.1 User to Profile

`auth.users.id` → `profiles.id`

Satu auth user memiliki satu profile.

### 35.2 Profile to UMKM

`profiles.id` → `umkm_profiles.user_id`

Satu profile role UMKM memiliki satu UMKM profile.

### 35.3 Profile to Creator

`profiles.id` → `creator_profiles.user_id`

Satu profile role creator memiliki satu creator profile.

### 35.4 Creator to Service

`creator_profiles.id` → `service_packages.creator_id`

Satu creator memiliki banyak paket jasa.

### 35.5 Service to Tier

`service_packages.id` → `service_package_tiers.service_package_id`

Satu layanan memiliki banyak tier.

### 35.6 UMKM to Cart

`umkm_profiles.id` → `carts.umkm_id`

Satu UMKM dapat memiliki cart aktif.

### 35.7 Cart to Cart Items

`carts.id` → `cart_items.cart_id`

Satu cart memiliki banyak item.

### 35.8 UMKM to Order

`umkm_profiles.id` → `orders.umkm_id`

Satu UMKM dapat memiliki banyak order.

### 35.9 Creator to Order

`creator_profiles.id` → `orders.creator_id`

Satu creator dapat menerima banyak order.

### 35.10 Order to Brief

`orders.campaign_brief_id` → `campaign_briefs.id`

Satu order terhubung ke satu brief campaign.

### 35.11 Order to Payment

`orders.id` → `payments.order_id`

Satu order dapat memiliki satu atau beberapa payment record.

### 35.12 Order to Submission

`orders.id` → `submissions.order_id`

Satu order dapat memiliki banyak submission.

### 35.13 Order to Revision

`orders.id` → `revisions.order_id`

Satu order dapat memiliki banyak revision.

### 35.14 Order to Review

`orders.id` → `reviews.order_id`

Satu order hanya dapat memiliki satu review dari UMKM.

## 36. Index Strategy

Index dibutuhkan agar query katalog, dashboard, dan order cepat.

### 36.1 Profiles

```sql
create index profiles_role_idx on profiles(role);
create index profiles_email_idx on profiles(email);
```

### 36.2 Creator Profiles

```sql
create index creator_profiles_user_id_idx on creator_profiles(user_id);
create index creator_profiles_niche_idx on creator_profiles(niche);
create index creator_profiles_city_idx on creator_profiles(city);
create index creator_profiles_rating_idx on creator_profiles(average_rating);
create index creator_profiles_featured_idx on creator_profiles(is_featured);
```

### 36.3 Service Packages

```sql
create index service_packages_creator_id_idx on service_packages(creator_id);
create index service_packages_category_id_idx on service_packages(category_id);
create index service_packages_active_idx on service_packages(is_active);
create index service_packages_base_price_idx on service_packages(base_price);
```

### 36.4 Orders

```sql
create index orders_umkm_id_idx on orders(umkm_id);
create index orders_creator_id_idx on orders(creator_id);
create index orders_order_status_idx on orders(order_status);
create index orders_payment_status_idx on orders(payment_status);
create index orders_created_at_idx on orders(created_at);
```

### 36.5 Payments

```sql
create index payments_order_id_idx on payments(order_id);
create index payments_payment_status_idx on payments(payment_status);
create index payments_provider_transaction_id_idx on payments(provider_transaction_id);
```

### 36.6 Reviews

```sql
create index reviews_creator_id_idx on reviews(creator_id);
create index reviews_rating_idx on reviews(rating);
```

## 37. RLS Policy Planning

Row Level Security wajib dirancang sebelum database dipakai dari client.

### 37.1 profiles

Rules:

* user dapat melihat profile sendiri
* user dapat update profile sendiri
* admin dapat melihat semua profile
* public tidak boleh membaca semua profile secara bebas

### 37.2 umkm_profiles

Rules:

* UMKM dapat melihat dan update profil sendiri
* creator hanya dapat melihat informasi UMKM yang terkait order
* admin dapat melihat semua
* guest tidak boleh melihat data private UMKM

### 37.3 creator_profiles

Rules:

* guest dapat melihat creator profile yang aktif
* creator dapat update profile sendiri
* admin dapat melihat dan mengelola semua creator
* UMKM dapat melihat creator public profile

### 37.4 service_packages

Rules:

* guest dapat melihat layanan aktif
* creator dapat CRUD layanan miliknya
* admin dapat melihat dan moderasi semua layanan
* creator tidak boleh mengubah layanan creator lain

### 37.5 carts dan cart_items

Rules:

* UMKM hanya dapat melihat cart miliknya
* UMKM hanya dapat mengubah cart miliknya
* creator tidak boleh melihat cart
* admin tidak wajib melihat cart kecuali debugging

### 37.6 campaign_briefs

Rules:

* UMKM dapat CRUD brief miliknya
* creator dapat melihat brief yang sudah menjadi order untuk dirinya
* admin dapat melihat semua brief
* guest tidak boleh melihat brief

### 37.7 orders

Rules:

* UMKM hanya dapat melihat order miliknya
* creator hanya dapat melihat order yang ditujukan kepadanya
* admin dapat melihat semua order
* guest tidak boleh melihat order
* status pembayaran hanya boleh diubah server/admin
* status order hanya boleh berubah sesuai role dan flow

### 37.8 payments

Rules:

* UMKM dapat melihat payment miliknya
* creator dapat melihat status pembayaran order yang terkait dengannya
* admin dapat melihat semua payment
* user biasa tidak boleh update payment
* webhook/server dapat update payment

### 37.9 submissions

Rules:

* creator dapat membuat submission untuk order miliknya
* UMKM dapat melihat submission dari order miliknya
* admin dapat melihat semua submission
* guest tidak boleh melihat submission

### 37.10 revisions

Rules:

* UMKM dapat membuat revisi untuk order miliknya
* creator dapat melihat dan menanggapi revisi untuk order miliknya
* admin dapat melihat semua revisi

### 37.11 reviews

Rules:

* public dapat melihat review yang visible
* UMKM dapat membuat review untuk order completed miliknya
* creator dapat melihat review untuk dirinya
* admin dapat moderasi review

### 37.12 complaints

Rules:

* UMKM dan creator dapat membuat complaint terkait order mereka
* pihak terkait dapat melihat complaint
* admin dapat melihat dan mengelola semua complaint
* guest tidak boleh melihat complaint

## 38. Query Patterns

### 38.1 Homepage Featured Creators

Data:

* creator_profiles
* service_packages
* reviews aggregate

Filter:

* is_featured = true
* account active
* creator available
* layanan aktif

### 38.2 Catalog Query

Data:

* creator_profiles
* service_packages
* service_categories
* reviews aggregate

Filter:

* category
* city
* price range
* rating
* niche
* availability
* search keyword

Sort:

* relevan
* rating tertinggi
* harga terendah
* proyek terbanyak
* estimasi tercepat

### 38.3 Service Detail Query

Data:

* service_packages
* service_package_tiers
* service_addons
* creator_profiles
* portfolios
* reviews

### 38.4 UMKM Dashboard Query

Data:

* orders by umkm_id
* payments by order
* submissions by order
* notifications by user_id

Metrik:

* pesanan aktif
* pesanan selesai
* pembayaran pending
* total pengeluaran
* hasil konten terbaru

### 38.5 Creator Dashboard Query

Data:

* orders by creator_id
* submissions
* revisions
* reviews
* payments/order totals

Metrik:

* order aktif
* order selesai
* rating rata-rata
* estimasi pendapatan
* revisi aktif

### 38.6 Admin Dashboard Query

Data:

* count profiles
* count umkm_profiles
* count creator_profiles
* count orders
* count payments
* count complaints

Metrik:

* total user
* total UMKM
* total creator
* order aktif
* order selesai
* pembayaran pending
* komplain aktif
* pendapatan platform

## 39. Data Validation Rules

### 39.1 Register

* email wajib dan valid
* password minimal 8 karakter
* role wajib
* nama wajib
* nomor WhatsApp opsional tapi disarankan

### 39.2 Creator Service

* title wajib
* category wajib
* price wajib dan lebih dari 0
* estimated_days wajib dan minimal 1
* revision_count minimal 0
* deliverables tidak boleh kosong

### 39.3 Campaign Brief

* business_name wajib
* promoted_product wajib
* campaign_goal wajib
* content_platforms wajib
* deadline wajib
* notes opsional

### 39.4 Payment

* amount harus sama dengan total order
* payment status tidak boleh diubah dari client
* provider transaction id harus unik jika ada

### 39.5 Review

* rating 1 sampai 5
* order harus completed
* satu order hanya boleh satu review

## 40. Soft Delete Strategy

Tidak semua data perlu dihapus permanen.

### 40.1 Data yang sebaiknya soft delete

* service_packages
* portfolios
* user account
* reviews
* notifications

Gunakan:

```sql
deleted_at timestamptz
```

### 40.2 Data yang tidak boleh sembarang dihapus

* orders
* payments
* invoices
* order_status_history
* complaints

Alasan:

Data tersebut penting untuk audit transaksi.

## 41. Audit Trail

Aktivitas penting harus masuk ke `activity_logs`.

Aktivitas yang dicatat:

* user register
* creator create service
* UMKM create order
* payment created
* payment paid
* payment failed
* order status changed
* submission created
* revision requested
* review submitted
* complaint opened
* admin resolved complaint
* admin updated platform setting

## 42. Seed Data

Seed data digunakan untuk pengembangan UI sebelum data real tersedia.

### 42.1 Service Categories

* Video TikTok/Reels
* Desain Feed Instagram
* Foto Produk
* Review Produk
* Caption Promosi
* Campaign UMKM

### 42.2 Dummy Creators

| Creator         | Niche             | Layanan Utama         |
| --------------- | ----------------- | --------------------- |
| Raka Visual     | Kuliner           | Video Reels/TikTok    |
| Nabila Creative | Fashion & Beauty  | Desain Feed + Caption |
| Dimas Review    | Produk Lokal      | Review Produk         |
| Sinta Studio    | Kuliner           | Foto Produk           |
| Fadd Graphics   | Branding & Desain | Desain Promosi        |
| Arkan Media     | Lifestyle         | Campaign TikTok       |

### 42.3 Dummy UMKM

| UMKM             | Kategori     |
| ---------------- | ------------ |
| Bakso Mas Adi    | Kuliner      |
| Kopi Sudut Kota  | Minuman      |
| Roti Lembut Pagi | Makanan      |
| Batik Loka       | Fashion      |
| Keripik Bu Sari  | Produk Lokal |

### 42.4 Dummy Order

Contoh:

* Order ID: RUK-2026-00124
* UMKM: Bakso Mas Adi
* Creator: Raka Visual
* Paket: Standard Video Reels/TikTok
* Total: Rp455.000
* Status pembayaran: paid
* Status order: in_progress
* Deadline: 3 hari

## 43. MVP Database Scope

Untuk MVP awal, tidak semua tabel harus langsung dibuat.

### 43.1 Minimal Tables MVP

Wajib:

1. profiles
2. umkm_profiles
3. creator_profiles
4. service_categories
5. service_packages
6. service_package_tiers
7. portfolios
8. carts
9. cart_items
10. campaign_briefs
11. orders
12. order_items
13. payments
14. order_status_history
15. submissions
16. revisions
17. reviews

### 43.2 Optional MVP Tables

Boleh menyusul:

1. invoices
2. service_addons
3. cart_item_addons
4. order_item_addons
5. complaints
6. notifications
7. messages
8. saved_creators
9. platform_settings
10. activity_logs

### 43.3 Roadmap Tables

Untuk pengembangan lanjutan:

1. vouchers
2. referrals
3. creator_payouts
4. analytics_events
5. ai_brief_generations
6. recommendation_logs
7. support_tickets

## 44. Future Tables

### 44.1 vouchers

Untuk promo dan diskon.

### 44.2 referrals

Untuk referral UMKM dan creator.

### 44.3 creator_payouts

Untuk pencairan dana kreator.

### 44.4 analytics_events

Untuk funnel analytics.

Contoh event:

* view_landing
* search_catalog
* view_service
* add_to_cart
* start_checkout
* submit_brief
* payment_started
* payment_success
* order_completed

### 44.5 ai_brief_generations

Untuk menyimpan riwayat auto-brief berbasis AI jika fitur ini dibuat.

### 44.6 recommendation_logs

Untuk mencatat rekomendasi kreator yang ditampilkan kepada UMKM.

## 45. Migration Plan

### 45.1 Migration 0001

File:

`supabase/migrations/0001_init_enums.sql`

Isi:

* enum user_role
* enum account_status
* enum creator_availability_status
* enum order_status
* enum payment_status
* enum payment_method
* enum revision_status
* enum complaint_status
* enum notification_type

### 45.2 Migration 0002

File:

`supabase/migrations/0002_init_profiles.sql`

Isi:

* profiles
* umkm_profiles
* creator_profiles

### 45.3 Migration 0003

File:

`supabase/migrations/0003_init_services.sql`

Isi:

* service_categories
* service_packages
* service_package_tiers
* service_addons
* portfolios

### 45.4 Migration 0004

File:

`supabase/migrations/0004_init_cart_checkout.sql`

Isi:

* carts
* cart_items
* cart_item_addons
* campaign_briefs

### 45.5 Migration 0005

File:

`supabase/migrations/0005_init_orders.sql`

Isi:

* orders
* order_items
* order_item_addons
* order_status_history

### 45.6 Migration 0006

File:

`supabase/migrations/0006_init_payments.sql`

Isi:

* payments
* invoices

### 45.7 Migration 0007

File:

`supabase/migrations/0007_init_post_order.sql`

Isi:

* submissions
* revisions
* reviews
* complaints
* messages
* notifications

### 45.8 Migration 0008

File:

`supabase/migrations/0008_init_admin_support.sql`

Isi:

* saved_creators
* platform_settings
* activity_logs

### 45.9 Migration 0009

File:

`supabase/migrations/0009_init_indexes.sql`

Isi:

* indexes
* unique constraints tambahan

### 45.10 Migration 0010

File:

`supabase/migrations/0010_init_rls_policies.sql`

Isi:

* enable RLS
* policies profiles
* policies UMKM
* policies creator
* policies orders
* policies payments
* policies storage

## 46. Security Notes

### 46.1 Jangan Query Data Sensitif dari Client Tanpa RLS

Semua tabel yang diakses dari browser harus memiliki RLS.

### 46.2 Service Role Key Hanya di Server

`SUPABASE_SERVICE_ROLE_KEY` tidak boleh digunakan di client component.

### 46.3 Payment Webhook Harus Server-Side

Webhook payment harus berada di server route atau edge function.

### 46.4 File Hasil Konten Tidak Public by Default

File submission harus private. Hanya UMKM terkait, creator terkait, dan admin yang boleh mengakses.

### 46.5 Admin Action Harus Dicatat

Aksi admin penting harus masuk ke `activity_logs`.

## 47. Implementation Notes untuk Vibe Coding

Saat mulai coding, jangan langsung membuat semua tabel. Urutan yang lebih aman:

1. Buat enum dan profile tables.
2. Buat service categories dan service packages.
3. Seed dummy creators dan services.
4. Bangun katalog dari data dummy/local.
5. Setelah UI stabil, hubungkan ke Supabase.
6. Buat order dan campaign brief.
7. Buat payment dummy.
8. Buat status order.
9. Buat submissions dan revisions.
10. Buat reviews.
11. Baru masuk RLS detail dan storage.

AI coding harus diberi konteks bahwa database ini adalah untuk marketplace jasa digital, bukan e-commerce barang.

## 48. Kesimpulan

Data model Ruang Usaha Kita dirancang untuk mendukung alur marketplace jasa digital secara utuh. Pusat sistem adalah order, karena order menghubungkan UMKM, creator, paket jasa, brief campaign, pembayaran, hasil konten, revisi, review, dan laporan.

Struktur database harus menjaga pemisahan antara status pembayaran dan status pengerjaan. Selain itu, database harus mendukung role-based access agar data UMKM, creator, dan admin tetap aman.

Pada tahap MVP, cukup gunakan tabel inti terlebih dahulu. Tabel lanjutan seperti vouchers, referrals, creator payouts, dan AI logs dapat dibuat setelah core flow selesai. Dengan data model ini, proses pengembangan dapat berjalan lebih terarah, aman, dan sesuai dengan konsep Ruang Usaha Kita sebagai e-commerce jasa digital.
