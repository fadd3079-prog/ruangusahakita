# Ruang Usaha Kita — Storage Policy

## 1. Tujuan Dokumen

Dokumen ini menjelaskan kebijakan penyimpanan file pada Ruang Usaha Kita. Storage policy dibutuhkan karena platform ini tidak hanya menyimpan data teks, tetapi juga berbagai file digital yang berkaitan dengan profil pengguna, portofolio kreator, brief campaign, hasil konten, invoice, dan komplain.

Ruang Usaha Kita adalah marketplace jasa digital. Karena itu, file yang disimpan bukan file untuk pengiriman barang fisik, melainkan file yang mendukung proses kerja sama promosi digital antara UMKM dan creator.

Contoh file yang mungkin ada:

- avatar user
- logo UMKM
- foto produk untuk brief
- aset campaign
- thumbnail portofolio
- contoh desain
- link atau file hasil konten
- invoice
- bukti pembayaran manual jika ada
- attachment revisi
- attachment komplain

Dokumen ini menjadi pedoman agar upload file tidak dibuat sembarangan, tidak membebani storage, tidak membuka file private ke publik, dan tetap sesuai dengan alur marketplace jasa digital.

## 2. Prinsip Utama Storage

### 2.1 File Harus Sesuai Konteks Bisnis

File yang disimpan harus mendukung proses bisnis Ruang Usaha Kita.

File yang relevan:

- file profil
- file portofolio
- file brief
- file hasil konten
- file revisi
- file invoice
- file komplain

File yang tidak relevan:

- file barang fisik untuk stok
- bukti pengiriman paket
- resi kurir
- label pengiriman
- dokumen gudang
- data inventory barang

### 2.2 Public dan Private File Harus Dipisah

Tidak semua file boleh public.

File public:

- avatar creator
- banner creator
- thumbnail portofolio
- cover layanan
- gambar kategori

File private:

- aset brief UMKM
- hasil konten
- file revisi
- invoice
- attachment komplain
- dokumen mediasi

File public boleh dibaca banyak orang. File private hanya boleh dibuka oleh pihak yang terkait.

### 2.3 Access Control Tidak Boleh Mengandalkan UI

Menyembunyikan tombol download di UI tidak cukup. Akses file harus dikontrol di level storage policy, database relation, dan server route.

Contoh:

UMKM A tidak boleh membuka file hasil order milik UMKM B, walaupun URL file diketahui.

### 2.4 File Besar Harus Dibatasi

Karena project memakai free/low-cost stack, upload file besar harus dibatasi sejak awal.

Rekomendasi MVP:

- avatar: maksimal 2 MB
- logo UMKM: maksimal 2 MB
- thumbnail portofolio: maksimal 5 MB
- aset brief gambar: maksimal 5 MB
- dokumen brief: maksimal 10 MB
- hasil konten berupa file: maksimal 20–50 MB jika benar-benar perlu
- video besar: gunakan link eksternal seperti Google Drive, YouTube, TikTok, atau Instagram

Untuk MVP, jangan menjadikan platform sebagai tempat upload video besar. Lebih aman menggunakan link eksternal terlebih dahulu.

### 2.5 File Hasil Konten Tidak Public by Default

Hasil konten adalah bagian dari transaksi antara UMKM dan creator. File tersebut tidak boleh public secara default.

Akses hasil konten hanya untuk:

- UMKM pemilik order
- creator yang mengerjakan order
- admin untuk mediasi

### 2.6 Gunakan Metadata di Database

Storage hanya menyimpan file. Metadata penting tetap harus disimpan di database.

Contoh metadata:

- owner_id
- order_id
- creator_id
- umkm_id
- file_type
- file_size
- bucket_name
- storage_path
- visibility
- created_at

Metadata ini membantu sistem menentukan siapa yang boleh membaca file.

## 3. Teknologi Storage

Storage utama direncanakan menggunakan Supabase Storage.

Alasan:

1. Terintegrasi dengan Supabase Auth.
2. Terintegrasi dengan Supabase RLS.
3. Cocok untuk project Next.js.
4. Cukup untuk MVP.
5. Bisa digunakan untuk avatar, gambar, dokumen, dan hasil konten ukuran kecil-sedang.
6. Tidak perlu mengelola server file sendiri.

Namun, untuk file video besar, Supabase Storage tidak selalu menjadi pilihan paling hemat pada tahap awal. Untuk video besar, MVP lebih baik menggunakan external link.

Alternatif tahap lanjutan:

- Cloudinary untuk optimasi gambar/video
- Google Drive link untuk hasil konten
- YouTube/TikTok/Instagram link untuk portofolio atau hasil publik
- S3-compatible storage jika volume file besar

## 4. Bucket Strategy

Ruang Usaha Kita membutuhkan beberapa bucket agar akses file lebih mudah diatur.

Bucket yang disarankan:

1. `avatars`
2. `public-assets`
3. `business-assets`
4. `portfolios`
5. `brief-assets`
6. `submissions`
7. `revision-assets`
8. `invoices`
9. `complaint-files`

Tidak semua bucket harus dibuat langsung pada MVP. Namun, struktur ini disiapkan agar pengembangan tidak kacau.

## 5. Bucket: avatars

### 5.1 Fungsi

Bucket `avatars` menyimpan foto profil pengguna.

Digunakan oleh:

- UMKM
- creator
- admin

### 5.2 Jenis File

File yang diperbolehkan:

- jpg
- jpeg
- png
- webp

File yang tidak diperbolehkan:

- exe
- zip
- rar
- mp4
- pdf
- svg dari user upload bebas

### 5.3 Ukuran File

Rekomendasi:

- maksimal 2 MB per file
- resolusi direkomendasikan 512x512 atau 1024x1024

### 5.4 Akses

Public read boleh dipertimbangkan karena avatar biasanya tampil di profile, katalog, dashboard, dan review.

Write access:

- user hanya boleh upload/update avatar miliknya sendiri
- admin boleh mengelola jika diperlukan

### 5.5 Path Convention

Format path:

```txt
avatars/{user_id}/avatar-{timestamp}.webp
````

Contoh:

```txt
avatars/7f1b.../avatar-20260606.webp
```

## 6. Bucket: public-assets

### 6.1 Fungsi

Bucket `public-assets` menyimpan aset umum website.

Contoh:

* logo platform
* ilustrasi homepage
* icon kategori
* gambar default
* placeholder
* banner public

### 6.2 Akses

Read:

* public

Write:

* admin/developer only

### 6.3 Catatan

Untuk aset statis yang jarang berubah, bisa juga disimpan di folder `public/` Next.js. Supabase Storage lebih cocok jika aset tersebut ingin diubah melalui admin dashboard.

## 7. Bucket: business-assets

### 7.1 Fungsi

Bucket `business-assets` menyimpan aset milik UMKM.

Contoh:

* logo usaha
* foto produk
* brand guideline sederhana
* contoh konten lama
* foto outlet
* file referensi brand

### 7.2 Akses

Read:

* UMKM pemilik
* creator yang terhubung melalui order terkait
* admin

Write:

* UMKM pemilik
* admin jika perlu

Public:

* tidak public secara default

### 7.3 Ukuran File

Rekomendasi:

* gambar: maksimal 5 MB
* dokumen: maksimal 10 MB
* video: tidak disarankan untuk MVP

### 7.4 Path Convention

```txt
business-assets/{umkm_id}/{asset_type}/{filename}
```

Contoh:

```txt
business-assets/umkm_123/logo/logo-bakso-mas-adi.webp
business-assets/umkm_123/products/foto-produk-1.webp
```

## 8. Bucket: portfolios

### 8.1 Fungsi

Bucket `portfolios` menyimpan file portofolio kreator.

Contoh:

* thumbnail video
* desain feed
* foto produk
* poster campaign
* preview karya

### 8.2 Akses

Read:

* public jika portofolio aktif
* admin untuk moderasi

Write:

* creator pemilik
* admin

### 8.3 Jenis File

Diperbolehkan:

* jpg
* jpeg
* png
* webp
* pdf ringan jika berupa case study

Untuk video:

* lebih baik simpan link eksternal
* upload video langsung ditunda

### 8.4 Path Convention

```txt
portfolios/{creator_id}/{portfolio_id}/{filename}
```

Contoh:

```txt
portfolios/creator_123/portfolio_001/feed-design.webp
```

### 8.5 Catatan

Portofolio adalah bagian penting untuk membangun trust. Namun, perlu ada validasi agar kreator tidak mengunggah file yang terlalu besar atau tidak relevan.

## 9. Bucket: brief-assets

### 9.1 Fungsi

Bucket `brief-assets` menyimpan file pendukung brief campaign.

Contoh:

* logo UMKM
* foto produk untuk campaign
* contoh konten referensi
* moodboard
* dokumen arahan singkat
* brand color reference

### 9.2 Akses

Read:

* UMKM pemilik brief
* creator yang menerima order terkait
* admin

Write:

* UMKM pemilik brief
* admin jika perlu

Public:

* tidak public

### 9.3 Ukuran File

Rekomendasi:

* gambar: maksimal 5 MB
* dokumen: maksimal 10 MB
* total file per brief: maksimal 25 MB pada MVP

### 9.4 Path Convention

```txt
brief-assets/{umkm_id}/{brief_id}/{filename}
```

Contoh:

```txt
brief-assets/umkm_123/brief_456/foto-produk-1.webp
```

## 10. Bucket: submissions

### 10.1 Fungsi

Bucket `submissions` menyimpan hasil konten yang dikirim creator.

Contoh:

* desain final
* foto produk final
* file caption
* video pendek ukuran kecil
* dokumen hasil campaign
* file preview

### 10.2 Akses

Read:

* UMKM pemilik order
* creator yang mengirim hasil
* admin

Write:

* creator yang menerima order
* admin jika perlu

Public:

* tidak public secara default

### 10.3 Ukuran File

Rekomendasi MVP:

* gambar/desain: maksimal 10 MB
* dokumen/caption: maksimal 5 MB
* video kecil: maksimal 20–50 MB
* video besar: gunakan link Google Drive/YouTube/TikTok

### 10.4 Path Convention

```txt
submissions/{order_id}/{submission_id}/{filename}
```

Contoh:

```txt
submissions/order_123/submission_001/video-preview.mp4
```

### 10.5 Catatan

Untuk submission, file tidak boleh langsung public. Sistem harus memakai signed URL atau server-mediated access jika file private.

## 11. Bucket: revision-assets

### 11.1 Fungsi

Bucket `revision-assets` menyimpan file pendukung revisi.

Contoh:

* screenshot bagian yang perlu diperbaiki
* contoh referensi baru
* catatan visual
* file revisi dari creator

### 11.2 Akses

Read:

* UMKM pemilik order
* creator terkait
* admin

Write:

* UMKM saat meminta revisi
* creator saat mengirim revisi
* admin jika mediasi

Public:

* tidak public

### 11.3 Path Convention

```txt
revision-assets/{order_id}/{revision_id}/{filename}
```

Contoh:

```txt
revision-assets/order_123/revision_001/referensi-revisi.webp
```

## 12. Bucket: invoices

### 12.1 Fungsi

Bucket `invoices` menyimpan file invoice jika nanti invoice dibuat dalam format PDF.

Pada MVP awal, invoice cukup berupa halaman UI. PDF invoice masuk tahap lanjutan.

### 12.2 Akses

Read:

* UMKM pemilik invoice
* admin
* creator hanya ringkasan jika diperlukan

Write:

* server/admin

Public:

* tidak public

### 12.3 Path Convention

```txt
invoices/{order_id}/{invoice_number}.pdf
```

Contoh:

```txt
invoices/order_123/INV-RUK-2026-0001.pdf
```

## 13. Bucket: complaint-files

### 13.1 Fungsi

Bucket `complaint-files` menyimpan lampiran komplain.

Contoh:

* screenshot masalah
* bukti komunikasi
* file hasil yang bermasalah
* dokumen pendukung refund

### 13.2 Akses

Read:

* pihak pembuat komplain
* pihak yang terkait dalam order
* admin

Write:

* UMKM terkait order
* creator terkait order
* admin

Public:

* tidak public

### 13.3 Path Convention

```txt
complaint-files/{complaint_id}/{filename}
```

Contoh:

```txt
complaint-files/complaint_123/bukti-hasil-tidak-sesuai.webp
```

## 14. Storage Visibility Matrix

| Bucket          |    Public Read | Private Read | Write Access       | Catatan                      |
| --------------- | -------------: | -----------: | ------------------ | ---------------------------- |
| avatars         |   Ya, terbatas |           Ya | Owner/Admin        | Avatar bisa public           |
| public-assets   |             Ya |        Tidak | Admin/Developer    | Aset umum website            |
| business-assets |          Tidak |           Ya | UMKM/Admin         | Aset usaha UMKM              |
| portfolios      | Ya untuk aktif |           Ya | Creator/Admin      | Portofolio public jika aktif |
| brief-assets    |          Tidak |           Ya | UMKM/Admin         | File brief private           |
| submissions     |          Tidak |           Ya | Creator/Admin      | Hasil konten private         |
| revision-assets |          Tidak |           Ya | UMKM/Creator/Admin | File revisi private          |
| invoices        |          Tidak |           Ya | Server/Admin       | Invoice private              |
| complaint-files |          Tidak |           Ya | UMKM/Creator/Admin | File mediasi private         |

## 15. File Type Policy

### 15.1 Image

Diperbolehkan:

* jpg
* jpeg
* png
* webp

Disarankan:

* webp untuk hasil optimasi
* maksimal 5–10 MB tergantung bucket

### 15.2 Document

Diperbolehkan:

* pdf
* txt
* docx jika memang perlu

Catatan:

PDF lebih aman untuk dokumen final. DOCX bisa dipakai untuk brief atau catatan, tetapi perlu validasi ukuran.

### 15.3 Video

Diperbolehkan terbatas:

* mp4
* webm

Namun untuk MVP:

* tidak disarankan upload video besar
* gunakan link eksternal
* upload video hanya jika ukuran kecil

### 15.4 Archive

Tidak disarankan:

* zip
* rar
* 7z

Alasan:

* rawan isi tidak jelas
* sulit dipreview
* bisa terlalu besar
* berisiko keamanan

### 15.5 Executable

Dilarang:

* exe
* bat
* cmd
* ps1
* sh
* apk
* msi
* dll

## 16. File Size Policy

Rekomendasi batas ukuran MVP:

| Jenis File           |               Maksimal |
| -------------------- | ---------------------: |
| Avatar               |                   2 MB |
| Logo UMKM            |                   2 MB |
| Thumbnail portofolio |                   5 MB |
| Gambar brief         |                   5 MB |
| Dokumen brief        |                  10 MB |
| Desain final         |                  10 MB |
| Caption/text file    |                   2 MB |
| Invoice PDF          |                   5 MB |
| Attachment komplain  |                  10 MB |
| Video kecil          |               20–50 MB |
| Video besar          | Gunakan link eksternal |

Catatan penting:

Supabase Free project memiliki batas global file size yang tidak dapat melebihi 50 MB. Maka, untuk MVP, limit internal sebaiknya dibuat lebih rendah agar aman dan tidak cepat menghabiskan kuota. ([Supabase][2])

## 17. Upload Method Policy

### 17.1 Standard Upload

Digunakan untuk:

* avatar
* logo
* gambar kecil
* thumbnail portofolio
* dokumen kecil
* invoice PDF kecil

Cocok untuk file kecil.

### 17.2 Resumable Upload

Digunakan untuk:

* file di atas 6 MB
* koneksi tidak stabil
* file hasil konten ukuran sedang
* video kecil

Supabase menyarankan resumable upload untuk file lebih besar dari 6 MB agar lebih reliable. ([Supabase][3])

### 17.3 External Link

Digunakan untuk:

* video besar
* hasil konten final ukuran besar
* portofolio video
* file yang sudah dipublikasikan di platform lain

Contoh:

* Google Drive
* YouTube
* TikTok
* Instagram
* Behance
* Notion
* Canva public link jika relevan

## 18. File Naming Convention

Nama file harus aman dan konsisten.

### 18.1 Format Umum

```txt
{entity}-{timestamp}-{random}.{ext}
```

Contoh:

```txt
avatar-20260606-x8a2.webp
brief-asset-20260606-k29s.webp
submission-20260606-pq91.mp4
```

### 18.2 Aturan Nama File

Gunakan:

* huruf kecil
* angka
* tanda hubung
* extension valid

Hindari:

* spasi
* karakter aneh
* tanda kurung
* simbol
* nama file asli yang terlalu panjang
* nama file mengandung data sensitif

Contoh buruk:

```txt
Foto Produk Bakso Final Banget (1).jpg
```

Contoh baik:

```txt
foto-produk-bakso-20260606-a19k.webp
```

## 19. Storage Path Convention

Path harus membantu policy dan debugging.

### 19.1 Avatar

```txt
avatars/{user_id}/{filename}
```

### 19.2 UMKM Asset

```txt
business-assets/{umkm_id}/{asset_type}/{filename}
```

### 19.3 Portfolio

```txt
portfolios/{creator_id}/{portfolio_id}/{filename}
```

### 19.4 Brief Asset

```txt
brief-assets/{umkm_id}/{brief_id}/{filename}
```

### 19.5 Submission

```txt
submissions/{order_id}/{submission_id}/{filename}
```

### 19.6 Revision

```txt
revision-assets/{order_id}/{revision_id}/{filename}
```

### 19.7 Invoice

```txt
invoices/{order_id}/{invoice_number}.pdf
```

### 19.8 Complaint

```txt
complaint-files/{complaint_id}/{filename}
```

## 20. Metadata Tables

Storage path sebaiknya tidak berdiri sendiri. File penting harus dicatat di database.

Tabel yang dapat dibuat:

1. `file_assets`
2. `portfolio_files`
3. `brief_files`
4. `submission_files`
5. `revision_files`
6. `invoice_files`
7. `complaint_files`

Untuk MVP, satu tabel generik `file_assets` bisa cukup.

## 21. Table: file_assets

### 21.1 Tujuan

Menyimpan metadata file yang diunggah ke storage.

### 21.2 Struktur Konseptual

```sql
create table file_assets (
  id uuid primary key default gen_random_uuid(),
  bucket_name text not null,
  storage_path text not null,
  original_filename text,
  file_name text not null,
  file_extension text,
  mime_type text,
  file_size integer,
  visibility text not null default 'private',
  owner_id uuid references profiles(id) on delete set null,
  umkm_id uuid references umkm_profiles(id) on delete set null,
  creator_id uuid references creator_profiles(id) on delete set null,
  order_id uuid references orders(id) on delete set null,
  brief_id uuid references campaign_briefs(id) on delete set null,
  submission_id uuid references submissions(id) on delete set null,
  revision_id uuid references revisions(id) on delete set null,
  complaint_id uuid references complaints(id) on delete set null,
  uploaded_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);
```

### 21.3 Field Explanation

| Field             | Fungsi                             |
| ----------------- | ---------------------------------- |
| bucket_name       | Nama bucket Supabase               |
| storage_path      | Path file di bucket                |
| original_filename | Nama file asli dari user           |
| file_name         | Nama file yang sudah dinormalisasi |
| mime_type         | Jenis file                         |
| file_size         | Ukuran file                        |
| visibility        | public/private/restricted          |
| owner_id          | Pemilik file                       |
| umkm_id           | Relasi ke UMKM jika ada            |
| creator_id        | Relasi ke creator jika ada         |
| order_id          | Relasi ke order jika ada           |
| uploaded_by       | User yang upload                   |
| deleted_at        | Soft delete                        |

## 22. Visibility Values

Gunakan visibility:

| Value      | Makna                         |
| ---------- | ----------------------------- |
| public     | Bisa dibaca publik            |
| private    | Hanya pemilik                 |
| restricted | Pihak terkait order dan admin |
| internal   | Hanya admin/system            |

Contoh:

* avatar creator: public
* thumbnail portofolio: public
* brief asset: restricted
* submission: restricted
* invoice: restricted
* complaint attachment: restricted/internal

## 23. Access Rules by File Context

### 23.1 Avatar

Read:

* public

Write:

* pemilik avatar
* admin

### 23.2 Creator Portfolio

Read:

* public jika portofolio aktif
* admin

Write:

* creator pemilik
* admin

### 23.3 UMKM Business Asset

Read:

* UMKM pemilik
* creator yang menerima order terkait
* admin

Write:

* UMKM pemilik
* admin

### 23.4 Brief Asset

Read:

* UMKM pemilik
* creator yang ditugaskan pada order terkait
* admin

Write:

* UMKM pemilik brief
* admin

### 23.5 Submission

Read:

* UMKM pemilik order
* creator yang mengerjakan order
* admin

Write:

* creator yang mengerjakan order
* admin

### 23.6 Revision Asset

Read:

* UMKM pemilik order
* creator terkait
* admin

Write:

* UMKM pemilik order jika meminta revisi
* creator terkait jika mengirim revisi
* admin

### 23.7 Invoice

Read:

* UMKM pemilik invoice
* admin
* creator hanya ringkasan jika dibutuhkan

Write:

* server/admin

### 23.8 Complaint File

Read:

* pihak yang terkait complaint
* admin

Write:

* UMKM/creator terkait order
* admin

## 24. Signed URL Policy

Untuk file private, gunakan signed URL atau server-mediated access.

### 24.1 Kapan Signed URL Dipakai

Signed URL dipakai untuk:

* hasil konten
* file revisi
* invoice
* attachment komplain
* aset brief private

### 24.2 Durasi Signed URL

Rekomendasi:

* preview singkat: 5–15 menit
* download hasil: 15–60 menit
* invoice: 15 menit
* admin review: 30–60 menit

### 24.3 Prinsip Signed URL

Signed URL tidak boleh disimpan permanen di database.

Database menyimpan:

* bucket
* storage_path
* metadata

Signed URL dibuat saat user berhak mengakses file.

## 25. Public URL Policy

Public URL hanya untuk file yang memang aman dibaca publik.

Boleh public:

* avatar creator
* thumbnail portofolio
* cover layanan
* icon kategori
* ilustrasi umum

Tidak boleh public:

* brief asset
* file hasil konten
* invoice
* complaint file
* dokumen mediasi
* payment proof
* file internal admin

## 26. Upload Validation

Sebelum upload, sistem harus memvalidasi:

1. User login.
2. Role user.
3. Bucket tujuan.
4. Ownership data.
5. File extension.
6. MIME type.
7. File size.
8. Jumlah file per konteks.
9. Nama file.
10. Apakah order masih aktif.
11. Apakah user berhak upload untuk order tersebut.

## 27. Validation by Upload Context

### 27.1 Avatar Upload

Validasi:

* user login
* file image
* ukuran maksimal 2 MB
* user hanya upload avatar sendiri

### 27.2 Portfolio Upload

Validasi:

* user role creator
* creator profile milik user
* file image/pdf kecil
* ukuran maksimal 5 MB
* portfolio milik creator

### 27.3 Brief Asset Upload

Validasi:

* user role UMKM
* brief milik UMKM
* order belum completed/cancelled
* file image/pdf
* ukuran sesuai limit

### 27.4 Submission Upload

Validasi:

* user role creator
* order ditujukan ke creator
* order status `in_progress` atau `revision_requested`
* file sesuai jenis deliverable
* ukuran sesuai limit

### 27.5 Revision Upload

Validasi:

* user adalah UMKM atau creator terkait order
* order belum completed/cancelled
* revision terkait order
* file sesuai limit

### 27.6 Invoice Upload

Validasi:

* hanya server/admin
* invoice terkait order
* file PDF
* tidak public

### 27.7 Complaint Upload

Validasi:

* user terkait order
* complaint terkait order
* file image/pdf
* tidak public

## 28. Storage RLS Planning

Supabase Storage menyimpan metadata object di schema storage. Access control dapat dilakukan memakai RLS policy pada storage object. Supabase Storage memang dirancang untuk bekerja dengan PostgreSQL RLS agar akses file dapat dibatasi sesuai kebutuhan bisnis. ([Supabase][1])

### 28.1 Public Buckets

Public bucket:

* `public-assets`
* sebagian `avatars`
* sebagian `portfolios`

Policy:

* public read
* write hanya admin atau owner sesuai konteks

### 28.2 Private Buckets

Private bucket:

* `business-assets`
* `brief-assets`
* `submissions`
* `revision-assets`
* `invoices`
* `complaint-files`

Policy:

* read berdasarkan owner/order relation
* write berdasarkan role dan ownership
* delete terbatas

### 28.3 RLS Access Logic

Logika umum:

* user bisa membaca file jika dia owner
* creator bisa membaca file jika file terkait order yang ditujukan kepadanya
* UMKM bisa membaca file jika file terkait order miliknya
* admin bisa membaca semua file untuk operasional
* guest hanya bisa membaca file public

## 29. Delete Policy

File tidak boleh dihapus sembarangan.

### 29.1 Soft Delete Metadata

Untuk file penting, lakukan soft delete di metadata:

```txt
deleted_at != null
```

File fisik bisa dihapus belakangan melalui cleanup job.

### 29.2 File yang Boleh Dihapus User

User boleh menghapus:

* avatar lama miliknya
* portfolio miliknya yang belum terkait order
* brief asset draft jika belum checkout
* file yang salah upload sebelum dikirim

### 29.3 File yang Tidak Boleh Dihapus Sembarangan

Jangan hapus langsung:

* hasil konten yang sudah dikirim
* file revisi
* invoice
* attachment komplain
* file terkait order completed/refunded

Alasan:

File tersebut penting untuk audit, mediasi, dan riwayat transaksi.

## 30. Replace Policy

Jika user mengganti file, lebih baik upload file baru dan update reference.

Contoh:

* avatar diganti: avatar lama bisa dihapus atau dibiarkan sementara
* portfolio diganti: update thumbnail_url ke file baru
* hasil revisi: jangan replace submission lama, buat version baru
* invoice: jangan replace invoice lama tanpa audit

## 31. Versioning Policy

Versioning penting untuk hasil konten dan revisi.

### 31.1 Submission Versioning

Gunakan `version_number`.

Contoh:

* version 1: draft awal
* version 2: revisi pertama
* version 3: final

### 31.2 Revision Versioning

Revision dapat terhubung ke submission tertentu.

Contoh:

* revision request 1 mengacu ke submission version 1
* creator mengirim submission version 2
* UMKM menyetujui version 2

### 31.3 Jangan Menimpa Hasil Lama

Hasil lama tetap disimpan untuk audit.

## 32. Image Optimization Policy

### 32.1 Format

Gunakan:

* webp untuk gambar baru jika memungkinkan
* jpg untuk foto
* png untuk gambar transparan

### 32.2 Ukuran

Rekomendasi:

* avatar: 512x512 atau 1024x1024
* thumbnail portfolio: 1200x800
* cover layanan: 1600x900
* logo UMKM: maksimal 1024x1024

### 32.3 Frontend Display

Gunakan Next.js Image jika sesuai.

Aturan:

* berikan alt text
* hindari loading gambar terlalu besar
* gunakan placeholder jika perlu
* jangan render gambar full-size di card kecil

## 33. Security Anti-Patterns

Hindari:

1. Membuat semua bucket public.
2. Menyimpan hasil konten di public URL.
3. Menggunakan filename asli tanpa sanitasi.
4. Menerima semua file extension.
5. Menerima file besar tanpa limit.
6. Membiarkan guest upload file.
7. Mengandalkan UI untuk membatasi akses file.
8. Menyimpan signed URL permanen di database.
9. Menghapus file transaksi tanpa audit.
10. Memberi service role key ke client.
11. Mengizinkan creator membaca semua brief asset.
12. Mengizinkan UMKM membaca submission order lain.

## 34. API Routes untuk Storage

Route yang bisa dibuat:

```txt
/api/upload
/api/files/[fileId]/signed-url
/api/files/[fileId]/delete
/api/files/[fileId]/metadata
```

### 34.1 `/api/upload`

Fungsi:

* validasi role
* validasi file
* upload ke bucket sesuai konteks
* simpan metadata ke `file_assets`
* return file id

### 34.2 `/api/files/[fileId]/signed-url`

Fungsi:

* validasi user
* validasi akses file
* membuat signed URL
* return signed URL sementara

### 34.3 `/api/files/[fileId]/delete`

Fungsi:

* soft delete metadata
* hapus file fisik jika aman
* catat activity log jika file sensitif

### 34.4 `/api/files/[fileId]/metadata`

Fungsi:

* mengambil metadata file
* tidak langsung membuka file private

## 35. Storage Components

Komponen UI yang dibutuhkan:

```txt
src/features/uploads/components/file-upload-zone.tsx
src/features/uploads/components/file-preview.tsx
src/features/uploads/components/upload-progress.tsx
src/features/uploads/components/file-list.tsx
src/features/uploads/components/private-file-link.tsx
src/features/uploads/components/file-type-icon.tsx
```

Komponen yang berkaitan:

```txt
src/features/briefs/components/brief-asset-upload.tsx
src/features/submissions/components/submission-upload.tsx
src/features/revisions/components/revision-file-upload.tsx
src/features/portfolio/components/portfolio-upload.tsx
```

## 36. Storage Utility Files

File utilitas yang disarankan:

```txt
src/lib/storage/buckets.ts
src/lib/storage/file-limits.ts
src/lib/storage/file-types.ts
src/lib/storage/file-paths.ts
src/lib/storage/validate-file.ts
src/lib/storage/create-signed-url.ts
src/lib/storage/upload.ts
```

### 36.1 `buckets.ts`

Berisi daftar bucket.

Contoh:

```ts
export const STORAGE_BUCKETS = {
  AVATARS: "avatars",
  PUBLIC_ASSETS: "public-assets",
  BUSINESS_ASSETS: "business-assets",
  PORTFOLIOS: "portfolios",
  BRIEF_ASSETS: "brief-assets",
  SUBMISSIONS: "submissions",
  REVISION_ASSETS: "revision-assets",
  INVOICES: "invoices",
  COMPLAINT_FILES: "complaint-files",
} as const;
```

### 36.2 `file-limits.ts`

Berisi batas file.

Contoh:

```ts
export const FILE_LIMITS = {
  avatar: 2 * 1024 * 1024,
  portfolio: 5 * 1024 * 1024,
  briefAsset: 10 * 1024 * 1024,
  submission: 50 * 1024 * 1024,
  invoice: 5 * 1024 * 1024,
} as const;
```

### 36.3 `file-types.ts`

Berisi MIME type yang diizinkan.

### 36.4 `file-paths.ts`

Berisi fungsi pembuat storage path.

Contoh:

```ts
export function createSubmissionPath(orderId: string, submissionId: string, filename: string) {
  return `submissions/${orderId}/${submissionId}/${filename}`;
}
```

## 37. Upload Flow

### 37.1 Avatar Upload Flow

1. User membuka settings.
2. User memilih file.
3. Client validasi awal.
4. Server/API validasi ulang.
5. File diupload ke `avatars`.
6. URL disimpan di `profiles.avatar_url`.
7. UI memperbarui avatar.

### 37.2 Portfolio Upload Flow

1. Creator membuka halaman portofolio.
2. Creator membuat portfolio item.
3. Creator upload thumbnail.
4. File masuk `portfolios`.
5. Metadata masuk `file_assets` dan `portfolios.thumbnail_url`.
6. Portfolio tampil di detail creator.

### 37.3 Brief Asset Upload Flow

1. UMKM mengisi checkout brief.
2. UMKM upload aset.
3. File masuk `brief-assets`.
4. Metadata terkait `brief_id`.
5. Creator dapat membaca setelah order dibuat dan ditujukan kepadanya.

### 37.4 Submission Upload Flow

1. Creator membuka detail order.
2. Creator klik kirim hasil.
3. Creator upload file atau input link.
4. File masuk `submissions`.
5. Metadata terkait `order_id` dan `submission_id`.
6. Order status berubah menjadi `submitted`.
7. UMKM mendapat notifikasi.

### 37.5 Revision Upload Flow

1. UMKM meminta revisi dan upload referensi.
2. File masuk `revision-assets`.
3. Creator membaca catatan revisi.
4. Creator upload hasil revisi.
5. File baru masuk `submissions` atau `revision-assets`.
6. Status berubah menjadi `revised`.

## 38. External Link Policy

Tidak semua hasil harus diupload ke storage.

### 38.1 Kapan External Link Dipakai

Gunakan external link untuk:

* video besar
* hasil konten yang sudah dipublikasikan
* Google Drive folder
* TikTok/Instagram post
* YouTube video
* Canva link
* Behance/portfolio link

### 38.2 Validasi Link

Minimal validasi:

* format URL valid
* protokol `https`
* domain tidak mencurigakan
* tidak kosong

### 38.3 Catatan

External link lebih hemat storage, tetapi rawan berubah atau dihapus oleh pemilik link. Untuk hasil final penting, admin/creator bisa diarahkan menyimpan backup kecil atau dokumen ringkasan.

## 39. Storage and Order Flow

Storage terhubung dengan order flow.

| Tahap Order     | File yang Mungkin Ada               | Bucket                       |
| --------------- | ----------------------------------- | ---------------------------- |
| Katalog         | avatar, portfolio thumbnail         | avatars, portfolios          |
| Checkout Brief  | logo, foto produk, referensi        | brief-assets                 |
| Payment         | invoice                             | invoices                     |
| Produksi Konten | file kerja internal, link referensi | submissions atau external    |
| Hasil Dikirim   | hasil konten                        | submissions                  |
| Revisi          | catatan visual, file revisi         | revision-assets, submissions |
| Komplain        | bukti masalah                       | complaint-files              |
| Review          | biasanya tanpa file                 | tidak wajib                  |

## 40. Storage and Dashboard

### 40.1 UMKM Dashboard

Menampilkan:

* logo UMKM
* hasil konten terbaru
* brief asset
* invoice
* file revisi

### 40.2 Creator Dashboard

Menampilkan:

* avatar creator
* portfolio
* brief asset dari order
* upload hasil
* file revisi

### 40.3 Admin Dashboard

Menampilkan:

* file terkait komplain
* invoice
* submission bermasalah
* aktivitas upload
* file yang perlu moderasi

## 41. Storage and Reports

Storage tidak menjadi sumber utama laporan, tetapi metadata file bisa mendukung laporan.

Contoh metrik:

* jumlah portfolio uploaded
* jumlah submission per bulan
* jumlah file complaint
* creator dengan submission terbanyak
* rata-rata jumlah revisi
* order dengan file bermasalah

## 42. MVP Storage Scope

### 42.1 Wajib MVP

Untuk MVP awal:

* avatar placeholder
* portfolio dummy
* brief asset upload placeholder
* submission link input
* invoice UI tanpa PDF
* revision attachment placeholder

### 42.2 Boleh Dummy

Boleh dummy dulu:

* upload hasil konten
* signed URL
* invoice PDF
* complaint attachment
* actual Supabase Storage integration

### 42.3 Harus Tetap Dirancang Benar

Walaupun dummy, struktur harus benar:

* hasil konten tidak dianggap public
* file brief tidak dibuka guest
* video besar diarahkan ke link eksternal
* tidak ada istilah pengiriman barang

## 43. Non-MVP Storage Features

Tidak masuk MVP awal:

* upload video besar
* transcoding video
* preview video otomatis
* virus scanning otomatis
* file compression server-side
* watermark otomatis
* CDN tuning
* multi-cloud storage
* storage billing dashboard
* file version diff
* automatic backup to external storage

## 44. Future Storage Features

Fitur masa depan:

1. Signed URL untuk semua file private.
2. Resumable upload untuk file besar.
3. Image optimization.
4. Auto compression.
5. Admin file moderation.
6. Virus scanning.
7. Storage usage report.
8. File retention policy.
9. Automatic cleanup unused files.
10. External backup.
11. CDN optimization.
12. Watermark untuk preview portofolio.
13. File preview viewer.
14. PDF invoice generator.

## 45. Storage Cleanup Policy

File yang tidak terpakai perlu dibersihkan.

### 45.1 File yang Bisa Dibersihkan

* avatar lama
* file draft brief yang tidak pernah checkout
* portfolio yang dihapus
* payment proof gagal yang sudah lama
* file upload gagal

### 45.2 File yang Jangan Dibersihkan Otomatis

* invoice
* submission order
* revision file
* complaint file
* file terkait refund
* file terkait order completed

### 45.3 Retention Suggestion

Untuk MVP:

* file draft tidak terpakai: 30 hari
* avatar lama: 30–90 hari
* file order completed: simpan
* invoice: simpan
* complaint file: simpan minimal sesuai kebutuhan audit

## 46. Implementation Roadmap

### 46.1 Phase 1 — UI Placeholder

* tampilkan upload zone
* tampilkan file preview dummy
* gunakan external link untuk hasil konten
* simpan data dummy

### 46.2 Phase 2 — File Validation

* validasi extension
* validasi MIME type
* validasi file size
* validasi context upload

### 46.3 Phase 3 — Supabase Storage Basic

* buat bucket
* upload avatar
* upload portfolio thumbnail
* upload brief asset kecil
* simpan metadata file

### 46.4 Phase 4 — Private File Access

* signed URL
* RLS storage
* server route untuk akses file private
* akses berdasarkan order

### 46.5 Phase 5 — Submission and Revision Storage

* upload hasil konten
* upload revisi
* versioning submission
* file history

### 46.6 Phase 6 — Admin and Cleanup

* admin file monitoring
* complaint file access
* cleanup draft file
* activity log upload/delete

## 47. Testing Plan

### 47.1 Upload Validation Test

Test:

* upload file terlalu besar harus ditolak
* upload extension dilarang harus ditolak
* upload tanpa login harus ditolak
* upload ke bucket salah harus ditolak

### 47.2 Access Control Test

Test:

* guest tidak bisa membuka file private
* UMKM A tidak bisa membuka hasil konten UMKM B
* creator A tidak bisa membuka brief order creator B
* admin bisa membuka file untuk mediasi
* creator hanya bisa upload submission untuk order miliknya

### 47.3 Signed URL Test

Test:

* signed URL hanya dibuat untuk user berhak
* signed URL expired
* signed URL tidak disimpan permanen
* file private tidak punya public URL

### 47.4 Delete Test

Test:

* user bisa hapus avatar sendiri
* creator bisa hapus portfolio sendiri yang belum terkait order
* user tidak bisa hapus invoice
* user tidak bisa hapus submission order completed
* admin delete/action masuk activity log

## 48. Definition of Done

Storage policy dianggap berhasil diterapkan jika:

1. Bucket dipisah berdasarkan konteks.
2. Public file dan private file tidak dicampur.
3. Hasil konten tidak public secara default.
4. Brief asset hanya bisa diakses pihak terkait.
5. File invoice tidak public.
6. File komplain tidak public.
7. Ukuran file dibatasi.
8. Extension dan MIME type divalidasi.
9. File path konsisten.
10. Metadata file tersimpan.
11. Signed URL digunakan untuk file private.
12. User tidak bisa membaca file milik order lain.
13. Creator tidak bisa membaca brief yang bukan ordernya.
14. Admin bisa mengakses file untuk mediasi.
15. Tidak ada service role key di client.
16. Upload video besar tidak diwajibkan di MVP.
17. External link bisa dipakai untuk hasil video besar.
18. Storage flow sesuai dengan order flow marketplace jasa digital.

## 49. Kesimpulan

Storage pada Ruang Usaha Kita harus dirancang dengan hati-hati karena file yang disimpan berkaitan langsung dengan transaksi jasa digital. Portofolio boleh public, tetapi brief, hasil konten, revisi, invoice, dan komplain harus private atau restricted.

Pada tahap MVP, storage tidak perlu langsung sempurna. Upload besar, signed URL kompleks, dan file versioning dapat dikerjakan bertahap. Namun, arah arsitekturnya harus benar sejak awal: file dibagi berdasarkan bucket, akses dikontrol berdasarkan role dan order, ukuran file dibatasi, dan hasil konten tidak dibuka publik secara sembarangan.

Dengan kebijakan ini, Ruang Usaha Kita dapat berkembang dari prototype UI menjadi marketplace jasa digital yang lebih aman, rapi, dan siap diintegrasikan dengan Supabase Storage.

## 50. Creator Storage Phase

Fase implementasi creator storage awal memakai dua bucket:

* `avatars`: public read, image-only, maksimal 2 MB.
* `portfolios`: private, image-only, maksimal 5 MB.

Avatar kreator disimpan sebagai public media karena tampil pada profil publik, katalog, dan dashboard. Path storage disimpan di `profiles.avatar_storage_path` dan `creator_profiles.avatar_storage_path`, sedangkan URL publik hasil Supabase Storage tetap disimpan di `avatar_url` agar UI existing tidak perlu membuat signed URL untuk avatar.

Gambar portofolio disimpan di bucket private `portfolios`. Database menyimpan `portfolios.thumbnail_storage_path`, dan aplikasi membuat signed URL saat halaman creator/public membutuhkan preview. Signed URL tidak disimpan permanen di database.

Trade-off fase ini:

* Belum membuat tabel generik `file_assets`.
* Metadata file creator disimpan langsung pada row profil dan portofolio.
* Pendekatan ini cukup untuk avatar dan thumbnail portofolio, tetapi brief asset, hasil konten, revisi, invoice, dan komplain tetap membutuhkan metadata table atau model file khusus pada fase berikutnya.

