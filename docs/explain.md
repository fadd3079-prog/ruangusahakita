# Ruang Usaha Kita: Penjelasan Produk dan Audit Website

Dokumen ini adalah panduan ringkas menyeluruh untuk kondisi aktual Ruang Usaha Kita per 15 Juni 2026. Isinya disusun dari route, komponen, helper, Server Action, integrasi Supabase, dan dokumen yang masih relevan di repo. Jika sebuah kemampuan belum ditemukan atau belum aktif, statusnya ditulis secara eksplisit.

## 1. Ringkasan produk

Ruang Usaha Kita adalah platform layanan kreatif yang mempertemukan UMKM dengan Kreator. UMKM mencari layanan, memilih paket dan add-on, mengisi brief, membayar, memantau pekerjaan, menerima hasil, meminta revisi, lalu memberi ulasan. Kreator mengelola profil, layanan, portofolio, order, hasil pekerjaan, dan pendapatan. Admin memantau pengguna, layanan, order, pembayaran, komplain, ulasan, laporan, serta analytics platform.

Alur utama produk:

1. Pengunjung menemukan Kreator melalui landing page, katalog, profil Kreator, atau detail layanan.
2. UMKM memilih `Tambah ke Keranjang` untuk mengumpulkan pilihan atau `Pesan Sekarang` untuk checkout langsung.
3. UMKM mengisi brief dan membuat order.
4. Pembayaran sandbox mengubah pembayaran menjadi `paid` dan meneruskan order ke Kreator.
5. Kreator menerima brief, memulai pekerjaan, dan mengirim hasil.
6. UMKM menyetujui hasil atau meminta revisi.
7. Order selesai saat hasil disetujui, bukan saat pembayaran baru dibayar.
8. Setelah selesai, UMKM dapat memberi ulasan. Peserta order juga dapat memakai chat dan komplain.

Stack utama adalah Next.js App Router, React, TypeScript, Tailwind CSS, shadcn/ui, Supabase Auth, PostgreSQL/Supabase, Supabase Storage, dan Recharts. Route publik dan dashboard terutama memakai Server Components; interaksi seperti filter katalog, form, analytics, chat realtime, dan pembayaran memakai Client Components.

Repo memiliki `APP_DEMO_MODE`. Saat aktif, dashboard dapat dibuka untuk review UI tanpa autentikasi dan tanpa membaca Supabase. Mode ini harus `false` pada produksi karena melewati guard dashboard dan menampilkan data kosong, bukan data simulasi.

## 2. Role dan akses

| Role | Akses utama | Dapat membuat/mengubah | Batasan utama |
| --- | --- | --- | --- |
| Guest | Landing, katalog, cara kerja, bantuan, profil Kreator, detail layanan, auth | Registrasi UMKM/Kreator dan login | Tidak dapat membuka dashboard pada mode nyata, membuat order, chat, review, atau komplain |
| UMKM | Dashboard UMKM, keranjang, checkout, brief, order, pembayaran, hasil, pengaturan | Profil bisnis, cart, brief, order, pembayaran sandbox, revisi, persetujuan hasil, review, chat, komplain | Tidak dapat mengakses dashboard Kreator/Admin atau mengubah data Kreator |
| Creator | Dashboard Kreator, profil, layanan, order masuk, portofolio, pendapatan, pengaturan | Profil Kreator, paket layanan, media, portofolio, status order, submission, chat, komplain | Tidak dapat membuat order UMKM, mengakses dashboard UMKM/Admin, atau mengubah pembayaran |
| Admin | Seluruh dashboard Admin | Moderasi status akun, fitur/verifikasi Kreator, status layanan, komplain, ulasan, export laporan | Tidak didaftarkan dari form publik; aksi tetap dibatasi role `admin` aktif |

Pemetaan dashboard terpusat:

| Role | Tujuan utama |
| --- | --- |
| `admin` | `/admin/dashboard` |
| `umkm` | `/umkm/dashboard` |
| `creator` | `/creator/dashboard` |

Pada mode nyata, guest yang membuka dashboard diarahkan ke `/login`. Pengguna dengan role salah diarahkan sekali ke dashboard atau onboarding miliknya. Admin aktif diarahkan dari halaman publik dan auth ke `/admin/dashboard`. Onboarding hanya berlaku untuk UMKM dan Kreator yang aktif tetapi profilnya belum lengkap; Admin tidak masuk onboarding.

Boundary data publik:

- Katalog hanya menampilkan profil dan layanan yang aktif/published/visible sesuai query dan RLS.
- Profil privat, brief, pembayaran, chat, hasil proyek, revisi, dan komplain hanya tersedia bagi peserta order atau Admin yang sah.
- File hasil proyek berada di bucket privat dan dibaca melalui aturan peserta/Admin.
- Client biasa tidak dapat mengangkat role sendiri menjadi Admin.

## 3. Public pages

### Layout publik

Header publik berisi logo, menu `Beranda`, `Katalog Kreator`, `Cara Kerja`, dan `Bantuan`. Guest melihat tombol `Masuk` dan `Daftar`. UMKM dapat melihat ikon keranjang beserta jumlah item, menu akun, tautan dashboard, dan logout. Pengguna login melihat identitas akun sesuai data profil. Di mobile, navigasi dipindahkan ke sheet ringkas.

Footer berisi tautan platform, auth, bantuan navigasi, identitas Ruang Usaha Kita, dan informasi penutup. Admin aktif tidak sempat melihat layout publik pada mode nyata karena redirect dilakukan sebelum UI publik dirender.

### `/` - Landing page

Landing page berfungsi sebagai pintu discovery dan penjelasan singkat alur bisnis.

| Section | Isi dan aksi |
| --- | --- |
| Hero | Judul "Temukan kreator untuk campaign yang lebih terarah.", penjelasan singkat, visual kolom pencarian, CTA ke `/katalog`, dan chip pencarian populer yang juga menuju katalog |
| Statistik | Jumlah Kreator, layanan, kategori, dan rata-rata rating dari data katalog yang tersedia |
| Kategori layanan | Kartu kategori aktif dan tautan melihat katalog |
| Kreator unggulan | Preview Kreator unggulan dengan profil, rating, layanan, dan tautan detail; section dapat kosong jika belum ada data |
| Cara kerja | Enam langkah: cari layanan, pilih paket, isi brief, bayar, proses, dan review |
| Manfaat UMKM | Discovery, kejelasan paket, brief, status, revisi, dan review |
| CTA Kreator | Ajakan mendaftar sebagai Kreator melalui `/register` |
| FAQ preview | Pertanyaan umum singkat dan tautan ke `/bantuan` |
| CTA akhir/footer | Navigasi lanjutan, login, register, dan bantuan |

Asset utama memakai `next/image`: `/images/hero-background.webp`, `/images/abstract (8).webp`, gambar kategori pada `/images/Kategori-layanan-section/`, dan `/images/image (11).webp` untuk CTA Kreator. Hero memakai `priority`; gambar lain memakai pengaturan ukuran responsif.

Kolom pencarian visual di hero belum menjalankan query langsung. CTA dan chip mengarahkan pengguna ke katalog untuk melakukan pencarian sebenarnya.

### `/katalog` - Katalog Kreator

Katalog mengambil data Kreator aktif beserta layanan, kategori, lokasi, rating, total order selesai, harga awal, dan status ketersediaan. Filtering dilakukan di client pada kumpulan data yang sudah dimuat.

Fitur pencarian mencakup nama Kreator, niche, kota, provinsi, keahlian, judul/deskripsi/tag layanan, dan kategori. Filter yang tersedia:

- Kategori layanan.
- Lokasi.
- Niche.
- Rentang harga: di bawah Rp150 ribu, Rp150-250 ribu, dan di atas Rp250 ribu.
- Rating minimum 4,8 atau 4,7.
- Status ketersediaan.
- Sort relevansi, rating, harga terendah, order selesai terbanyak, atau estimasi tercepat.

Desktop memakai search/filter bar sticky dan panel filter detail yang dapat dibuka. Mobile menampilkan search compact serta filter dalam bottom sheet dengan tinggi maksimum sekitar 82 persen viewport, tombol `Reset`, dan tombol `Lihat N kreator`.

Kartu Kreator memuat banner, avatar, nama, niche, badge tersedia/verified, lokasi, rating, jumlah order selesai, layanan utama, kategori, estimasi hari, harga awal, dan tautan detail. Teks panjang dibatasi agar kartu tidak melebar. Jika hasil kosong, `CatalogEmptyState` memberi konteks dan reset filter. Halaman memiliki loading global; kegagalan query saat ini cenderung menghasilkan daftar kosong sehingga belum selalu dapat dibedakan dari kondisi data benar-benar kosong.

### `/layanan/[serviceId]` - Detail layanan

Halaman menampilkan judul dan deskripsi layanan, kategori, galeri/media, Kreator, lokasi, rating, order selesai, harga awal, tier paket, estimasi durasi, revisi, deliverables, add-on, portofolio terkait, dan ulasan yang terlihat.

CTA utama:

- `Tambah ke Keranjang`: menambahkan layanan/tier/add-on ke cart aktif melalui Server Action.
- `Pesan Sekarang`: membangun URL checkout direct untuk satu layanan tanpa memaksa pengguna melalui cart.
- Nama/avatar Kreator: menuju `/kreator/[creatorId]`.
- Pilihan tier: dapat dipakai untuk cart atau checkout langsung.

Guest yang melakukan aksi privat diarahkan ke auth sesuai guard. Data tidak ditemukan menghasilkan not-found. Teks judul, deskripsi, tier, dan deliverables dibatasi atau dipecah secara lokal agar aman pada kartu sempit.

### `/kreator/[creatorId]` - Detail Kreator

Halaman memuat banner, avatar, nama, verified badge, niche, bio, lokasi, status ketersediaan, keahlian, rating, response time, harga mulai, jumlah order selesai, tautan sosial, layanan aktif, portofolio, dan ulasan yang terlihat.

CTA mengarah ke layanan utama atau detail layanan. Section layanan, portofolio, dan ulasan memiliki empty state jika data belum tersedia. Profil publik hanya menampilkan data yang lolos aturan publik dan status aktif.

### `/cara-kerja`

Halaman menjelaskan enam tahap penggunaan, manfaat bagi UMKM dan Kreator, serta CTA mendaftar. Copy saat ini menyebut dana ditahan sistem/escrow, tetapi mekanisme escrow atau pencairan dana belum ditemukan pada alur pembayaran aktif. Pernyataan tersebut perlu diselaraskan dengan implementasi sebelum dipakai sebagai janji produk.

### `/bantuan`

Halaman bantuan mengelompokkan FAQ untuk Akun, UMKM, Kreator, Order, Pembayaran, Revisi, dan Komplain. Tersedia tautan `Cara Kerja` dan kontak `support@ruang.usaha` melalui email. Fungsinya adalah memberi penjelasan dasar, mengurangi kebingungan sebelum order, dan memperkuat trust/support.

### State publik

- `loading.tsx` memberi state loading pada kelompok route utama.
- `error.tsx` memberi fallback error dan aksi mencoba kembali.
- `not-found.tsx` menangani route atau data yang tidak ditemukan.
- Kartu dan daftar utama memiliki empty state lokal saat tidak ada data.

## 4. Auth flow

| Route | Fungsi |
| --- | --- |
| `/login` | Login email/password, pesan sukses/error, tautan forgot password dan register |
| `/register` | Registrasi role UMKM atau Kreator; Admin tidak dapat dibuat melalui form publik |
| `/forgot-password` | Memanggil default `supabase.auth.resetPasswordForEmail` |
| `/reset-password` | Membaca recovery session dan memperbarui password |
| `/callback` | Menangani pertukaran code/session dan tujuan redirect yang aman |

### Login dan redirect

Login memakai Supabase Auth. Setelah berhasil, aplikasi membaca `profiles.role`, `profiles.account_status`, serta kelengkapan profil role. Tujuan setelah login berasal dari helper routing terpusat, bukan URL bebas:

- Admin aktif langsung ke `/admin/dashboard`.
- UMKM/Kreator aktif yang belum lengkap masuk onboarding.
- UMKM/Kreator aktif yang lengkap masuk dashboard role.
- Akun tidak aktif ditolak ke halaman aman dengan pesan error.
- Path tujuan hanya diterima jika masih berada di area role pengguna; redirect ke pathname yang sama dicegah.

Checkbox remember tersedia di UI, tetapi tidak memiliki strategi cookie terpisah; persistence mengikuti session/cookie Supabase.

### Register dan onboarding

Registrasi membuat user auth, row `profiles`, dan profil role UMKM/Kreator melalui proses server. Setelah login awal, pengguna menuju onboarding untuk melengkapi data. Admin tidak memiliki onboarding dan tidak dapat dipilih saat register.

Route onboarding:

- `/umkm/onboarding`: data awal bisnis UMKM.
- `/creator/onboarding`: identitas, niche, lokasi, dan data awal Kreator.

Mode demo melewati guard dashboard untuk review UI, tetapi tidak menganggap onboarding selesai dan tidak membuat data simulasi.

### Forgot dan reset password

Flow memakai email default Supabase Auth. Tidak ada template HTML lokal, custom sender, atau branding email dari kode. Redirect reset adalah `/reset-password` pada origin yang diizinkan. Setelah password diperbarui, session diakhiri dan pengguna diminta login ulang.

Validasi password baru mengikuti respons Supabase. Jika provider mengembalikan error `same_password`, UI menampilkan bahwa password baru tidak boleh sama dengan password lama. Development dapat menampilkan detail aman; production memakai pesan generik. Custom receipt email juga dinonaktifkan dan tidak memengaruhi pembayaran.

### Logout dan session

Logout memanggil `supabase.auth.signOut`, menghapus session, lalu kembali ke login dengan notice. Session server dibaca dari cookie melalui Supabase server client, diverifikasi dengan `getUser`, kemudian profil role/status dibaca dari database. Browser client dipakai hanya untuk interaksi client yang memerlukannya.

Saat `APP_DEMO_MODE=true`, form auth tetap terlihat tetapi submission memberi notice aman dan tidak menghubungi host Supabase placeholder. Mode demo tidak pernah aktif otomatis hanya karena credential hilang.

Google login belum tersedia dan tidak diimplementasikan pada flow ini.

## 5. UMKM dashboard

### Navigasi UMKM

| Menu/route | Fungsi utama |
| --- | --- |
| `/umkm/dashboard` | Ringkasan profil, statistik, order, brief, hasil, pembayaran, dan rekomendasi |
| `/umkm/cart` | Mengelola layanan yang sengaja ditambahkan ke keranjang |
| `/umkm/checkout` | Checkout dari cart atau direct order dan pengisian brief |
| `/umkm/orders` | Pencarian, filter, sort, dan daftar order |
| `/umkm/orders/[orderId]` | Detail order, kolaborasi, pembayaran, hasil, revisi, review, komplain, dan chat |
| `/umkm/orders/[orderId]/invoice` | Invoice yang dapat dicetak |
| `/umkm/orders/[orderId]/receipt` | Receipt untuk pembayaran yang sudah `paid` |
| `/umkm/payments/[paymentId]` | Detail dan aksi pembayaran sandbox |
| `/umkm/briefs` | Daftar brief dan status keterkaitannya dengan order |
| `/umkm/briefs/[briefId]` | Detail/edit brief jika masih dapat diubah |
| `/umkm/results` | Daftar order yang sudah memiliki submission/revisi/hasil selesai |
| `/umkm/settings` | Profil bisnis, kontak, logo, dan informasi akun |

### Dashboard utama

Hero menampilkan nama bisnis dan status profil, dengan aksi cepat menuju katalog, cart, dan order. Profile completion card menunjukkan kelengkapan onboarding. Statistik mencakup order aktif, order selesai, order menunggu, dan total nilai order. Section lain menampilkan distribusi status, ringkasan pengeluaran, order terbaru, brief, hasil, pembayaran tertunda, rekomendasi, aktivitas, dan quick actions.

Jika query gagal atau mode demo aktif, loader mengembalikan data kosong terstruktur sehingga shell, hero, dan kartu statistik tetap dirender. Empty state mengarahkan pengguna ke aksi yang relevan.

### Cart

Cart memuat layanan, Kreator, tier, add-on, estimasi durasi, revisi, deliverables, jumlah, dan subtotal. Pengguna dapat memperbarui pilihan, menghapus item, membersihkan cart, atau checkout. Empty state mengarah kembali ke katalog.

Keranjang hanya dipakai ketika pengguna memilih `Tambah ke Keranjang` atau membuka ikon cart. Checkout cart saat ini membatasi item pada Kreator yang sama untuk satu order.

### Checkout dan brief

Checkout membaca sumber secara eksplisit:

- `cart`: mengambil item dari cart aktif.
- `direct`: mengambil service, tier, dan add-on dari query hasil `Pesan Sekarang`.

Form brief mencakup nama/kategori bisnis, fokus promosi, tujuan, target audiens, platform, gaya, deadline, reference link, catatan, dan asset gambar. Brief disimpan lebih dahulu, kemudian Server Action membuat order beserta snapshot item, payment pending, invoice, dan history.

Desktop memakai form utama dan ringkasan kanan sticky dengan lebar stabil. Mobile menampilkan ringkasan compact/collapsible. Jika data checkout tidak valid, halaman memberi state aman dan tidak membuat order setengah jadi.

### Orders dan detail order

Daftar order mendukung pencarian nomor order, layanan, dan nama; filter `order_status`; filter `payment_status`; serta sort terbaru, deadline, atau total. Desktop memakai tabel, mobile memakai kartu.

Detail order berisi status/progress, snapshot layanan dan tier, brief, pembayaran, invoice/receipt, rincian biaya, history, submission, revisi, approval, review, chat, dan komplain. Tombol yang muncul bergantung pada role, payment, order status, kepemilikan order, dan batas revisi.

### Payment, invoice, receipt, hasil

Halaman pembayaran menampilkan metode sandbox dan memanggil RPC pembayaran. Invoice tersedia dari detail order. Receipt hanya tersedia setelah payment `paid`. `/umkm/results` memusatkan order berstatus `submitted`, `revised`, `revision_requested`, atau `completed`, lalu membuka detail order untuk aksi berikutnya.

### Brief dan settings

Brief draft dapat diedit. Brief yang sudah terkait/terkunci oleh order tidak dapat diubah bebas. Settings menyediakan data bisnis, kontak, konten profil, dan logo. Bagian preferensi notifikasi masih berupa informasi; kontrol notifikasi rinci belum tersedia.

## 6. Creator dashboard

### Navigasi Creator

| Menu/route | Fungsi utama |
| --- | --- |
| `/creator/dashboard` | Ringkasan order, layanan, portofolio, statistik, grafik, dan aktivitas |
| `/creator/profile` | Preview profil internal dan tautan ke profil publik/settings |
| `/creator/services` | Daftar layanan dan aksi status/edit/hapus |
| `/creator/services/new` | Membuat layanan dan tier |
| `/creator/services/[serviceId]/edit` | Mengedit layanan yang dimiliki |
| `/creator/orders` | Order berbayar yang masuk ke Kreator |
| `/creator/orders/[orderId]` | Brief, status kerja, submission, revisi, chat, dan komplain |
| `/creator/portfolio` | Membuat, mengedit, menonjolkan, dan menghapus portofolio |
| `/creator/earnings` | Ringkasan nilai order dan transaksi berbayar/selesai |
| `/creator/settings` | Profil publik, avatar, banner, availability, harga awal, dan response time |

### Dashboard utama

Hero menampilkan nama, niche, availability, dan CTA ke order, layanan, atau portofolio. Profile completion card menampilkan kelengkapan. Statistik mencakup order aktif, order selesai, revisi, dan pendapatan. Terdapat grafik order, ringkasan pendapatan, order terbaru, deadline, revisi, aktivitas, layanan, portofolio, dan quick actions.

Demo atau kegagalan data menampilkan zero metrics dan empty state tanpa merusak shell.

### Profil dan settings

Profil internal menampilkan banner, avatar, nama, verified badge, availability, bio, skills, lokasi, rating, order selesai, response time, harga awal, layanan aktif, dan portofolio. Settings memungkinkan upload/hapus avatar dan banner serta mengubah profil publik. Preferensi notifikasi rinci belum memiliki kontrol aktif.

### Paket layanan

Daftar layanan menampilkan cover, status aktif/featured, tier, add-on, harga awal, dan aksi:

- `Tambah Layanan`.
- `Edit`.
- `Preview` ke detail publik.
- `Aktifkan` atau `Nonaktifkan`.
- `Hapus` dengan validasi kepemilikan.

Form tambah/edit memiliki tahap informasi utama, kategori, tag, status aktif, tier Basic/Medium/Premium, harga, durasi, revisi, deskripsi, deliverables, media maksimal lima, brief requirements, preview, simpan, dan batal. Loader dan action add-on tersedia, tetapi editor add-on di form belum ditemukan pada UI aktual.

### Order masuk dan lifecycle Kreator

Daftar Creator hanya memuat order yang sudah berbayar. Search mencakup nomor order, layanan, dan pihak UMKM; filter berdasarkan status; sort berdasarkan terbaru, deadline, atau nilai.

Pada detail order, Kreator dapat:

1. Membaca brief dan scope.
2. Menerima order yang `waiting_creator_confirmation` dan sudah dibayar.
3. Memulai pekerjaan dari `brief_accepted`.
4. Mengirim hasil saat `in_progress` atau `revision_requested`.
5. Mengisi judul, deskripsi, caption, external link, dan file hasil proyek.
6. Menanggapi revisi dengan submission baru sehingga order menjadi `revised`.
7. Menggunakan chat atau membuat komplain sebagai peserta order.

### Portfolio dan pendapatan

Portfolio mendukung judul, kategori, client, deskripsi, external link, thumbnail, featured, edit, dan hapus. Empty state mengarahkan ke form penambahan.

Pendapatan menampilkan nilai order aktif/selesai dan daftar transaksi yang berhubungan dengan order berbayar/selesai. Payout atau withdrawal ke Kreator belum ditemukan di kode.

Review yang diterima terlihat melalui profil publik dan metrik terkait; belum ada halaman review Creator khusus. Chat dan komplain berada di detail order, bukan menu mandiri.

## 7. Admin dashboard

### Navigasi Admin

| Menu/route | Fungsi utama |
| --- | --- |
| `/admin/dashboard` | Ringkasan platform, recent data, warning, dan quick actions |
| `/admin/analytics` | Traffic, funnel, tren, top data, event, dan insight heuristik |
| `/admin/users` | Search/filter/sort semua akun dan moderasi status |
| `/admin/umkm` | Daftar dan ringkasan profil UMKM |
| `/admin/creators` | Daftar Kreator serta toggle verified/featured |
| `/admin/services` | Moderasi layanan aktif/featured |
| `/admin/orders` | Search/filter/sort order |
| `/admin/orders/[orderId]` | Detail order lintas pihak secara read-only |
| `/admin/payments` | Ringkasan dan daftar pembayaran |
| `/admin/complaints` | Moderasi komplain dan visibility review |
| `/admin/reports` | Ringkasan laporan serta export CSV/HTML/print |
| `/admin/settings` | Tautan ada di navigasi, tetapi page aktif belum ditemukan |

Tidak ada route `/admin/reviews`; moderasi review berada di halaman complaints. Settings Admin belum dapat digunakan karena tidak ada `page.tsx` untuk route tersebut.

### Dashboard utama

Dashboard memuat section secara independen dengan `Promise.allSettled`. Status data adalah `demo`, `available`, `partial`, atau `unavailable`, disertai warning. Kegagalan satu query analytics atau tabel opsional tidak menggagalkan seluruh halaman.

Kartu statistik mencakup total user, UMKM, Kreator, layanan, order, order aktif/pending, pembayaran paid, platform revenue/GTV, dan komplain. Section lanjutan menampilkan recent orders, payments, complaints, report summary, dan quick actions. Demo mode menampilkan shell dan zero metrics secara jujur.

### Analytics

Analytics menampilkan summary, grafik traffic, funnel, trend, device, source, role, kategori, top pages, top Kreator, top layanan, dan recent events. Event dapat dicari dan difilter menurut tipe. Section dapat di-refresh terpisah melalui `/api/admin/analytics/section`; error fetch ditangkap dan ditampilkan sebagai toast tanpa unhandled `Failed to fetch`.

Insight berlabel ML memakai heuristik ringan untuk tren, anomali, CTA, top service, dan top Creator. Ini bukan model machine learning terlatih. Query analytics dibatasi sekitar 30 hari dan maksimal 1.000 event/order pada beberapa loader.

Event Admin dan route `/admin` dikecualikan dari analytics agar aktivitas pengelola tidak mengotori statistik publik. Job retention atau cleanup analytics otomatis belum ditemukan.

### Users, UMKM, Creators, Services

- Users: search nama/email; filter role/status; sort terbaru/nama/role; ubah status active/suspended/inactive melalui RPC; Admin tidak dapat mengubah status dirinya sendiri.
- UMKM: search nama bisnis, kategori, lokasi, dan target; sort terbaru, nama, atau order aktif; bersifat observasi.
- Creators: search nama, niche, lokasi; filter verified/featured; sort terbaru, rating, order selesai; toggle verified dan featured.
- Services: search judul, Kreator, kategori; filter active/featured; sort terbaru, harga, judul; toggle active/featured dan buka preview publik.

### Orders, Payments, Complaints, Reports

- Orders: search nomor, layanan, tier, Kreator, UMKM; filter order/payment status; sort terbaru, deadline, total; detail Admin bersifat read-only.
- Payments: search payment, order, layanan, UMKM, Kreator, provider; filter status; sort terbaru atau amount; kartu total paid, pending, failed, expired, dan platform revenue.
- Complaints: search subject, description, order, opener; Admin memperbarui status dan resolution note.
- Review moderation: review dapat ditampilkan atau disembunyikan dari halaman complaints.
- Reports: completed orders, GTV, platform revenue, paid amount, active complaints, warning, dan export CSV/HTML/print melalui route server yang memeriksa Admin aktif.

Semua halaman memakai loading/empty state sesuai dataset. Mutasi Admin melewati helper/RPC yang memeriksa role aktif; service role key tidak dikirim ke browser.

## 8. Marketplace order flow

### Status order

Nilai `order_status` yang tersedia:

| Status | Arti operasional |
| --- | --- |
| `draft` | Order belum siap diproses |
| `awaiting_payment` | Order dan invoice sudah dibuat, pembayaran belum paid |
| `paid` | Nilai enum tersedia, tetapi flow pembayaran aktif biasanya langsung menuju `waiting_creator_confirmation` |
| `waiting_creator_confirmation` | Pembayaran paid, menunggu Kreator menerima brief |
| `brief_accepted` | Kreator menerima order/brief |
| `in_progress` | Pekerjaan sedang dikerjakan |
| `submitted` | Hasil awal dikirim Kreator |
| `revision_requested` | UMKM meminta revisi |
| `revised` | Hasil revisi dikirim Kreator |
| `completed` | UMKM menyetujui hasil; order selesai |
| `cancelled` | Order dibatalkan |
| `refunded` | Order dikembalikan sesuai status administrasi |

### Flow normal

1. UMKM memilih layanan dari cart atau direct checkout.
2. UMKM menyimpan brief.
3. RPC membuat order, snapshot item/add-on, payment pending, invoice, dan status history.
4. Pembayaran sandbox berhasil: payment menjadi `paid`, lalu order menjadi `waiting_creator_confirmation`.
5. Kreator menerima: `brief_accepted`.
6. Kreator memulai: `in_progress`.
7. Kreator mengirim hasil: `submitted`.
8. UMKM menyetujui: `completed` dan `completed_at` diisi.
9. UMKM dapat membuat satu review untuk order paid dan completed.

### Flow revisi

UMKM dapat meminta revisi dari `submitted` atau `revised` selama batas revisi belum habis. Status menjadi `revision_requested`. Kreator mengirim hasil baru dan status menjadi `revised`. UMKM kemudian menyetujui atau meminta revisi lagi jika masih diizinkan.

### Flow komplain

UMKM atau Kreator yang menjadi peserta order dapat membuat komplain. Sistem membatasi komplain aktif agar tidak berlipat untuk order yang sama. Admin memeriksa detail, mengubah status, dan menulis resolution note. Komplain tidak otomatis menggantikan status pembayaran atau order tanpa aksi bisnis yang sesuai.

### Hak aksi

- UMKM: membuat order/brief, membayar, meminta revisi, menyetujui hasil, review, chat, dan komplain pada order miliknya.
- Kreator: menerima, memulai, mengirim hasil/revisi, chat, dan komplain pada order yang ditugaskan.
- Admin: membaca lintas order, memoderasi komplain/review, dan melihat laporan; tidak mengambil alih tombol lifecycle peserta pada UI saat ini.
- Public: hanya melihat data layanan, Kreator, portofolio, dan review yang boleh dipublikasikan.

## 9. Payment, invoice, receipt

`payment_status` yang tersedia adalah `pending`, `paid`, `failed`, `expired`, `refunded`, dan `partially_refunded`.

Payment `paid` berarti kewajiban pembayaran sudah tercatat selesai. Order `completed` berarti hasil pekerjaan sudah disetujui UMKM. Keduanya sengaja berbeda: order dapat sudah dibayar tetapi masih menunggu konfirmasi, dikerjakan, dikirim, atau direvisi.

Pembayaran aktif saat ini adalah sandbox/manual melalui Server Action/RPC. Route `/api/payments/create` dan `/api/payments/webhook` masih mengembalikan `501` dan bukan jalur pembayaran aktif. Integrasi Midtrans production tidak diubah dan tidak diklaim aktif oleh dokumen ini.

Invoice dibuat bersama order dan dapat dibuka/cetak oleh pihak yang berhak. Receipt hanya tersedia setelah payment `paid`. Layout cetak memuat identitas dokumen, order, pihak terkait, item layanan, add-on, total, dan status. Tabel item memiliki scroll lokal pada viewport sempit sehingga tidak memaksa seluruh halaman melebar.

Email receipt sementara dinonaktifkan. Invoice dan receipt tetap tersedia di aplikasi. Keberhasilan pembayaran tidak bergantung pada pengiriman email.

## 10. Chat, review, complaint, notification

### Chat order

Chat hanya tersedia pada detail order dan hanya untuk UMKM/Kreator peserta. Pesan memakai tabel `messages`, subscription Supabase Realtime `postgres_changes`, optimistic update, penanda baca, fallback refresh setelah jeda, dan tombol refresh manual. Bubble memakai batas lebar dan `break-words` lokal agar URL atau token panjang tidak keluar kartu.

Belum ada inbox chat global. Chat selalu berorientasi pada order.

### Review

UMKM dapat memberi rating dan review setelah order berstatus `completed` serta payment `paid`. Satu order hanya menerima satu review dari UMKM pemilik. Review yang visible tampil pada profil Kreator/detail yang relevan. Admin dapat menyembunyikan atau menampilkan review dari `/admin/complaints`.

### Complaint

Form komplain berada di panel kolaborasi detail order. Data utama mencakup subject, description, pembuat, order, status, dan resolution note. Admin memoderasi dari dashboard complaints. Belum ada halaman komplain terpisah untuk UMKM/Kreator.

### Notification

Tabel `notifications` dan trigger mendukung event pesan, review, komplain, submission, dan revisi. Topbar menampilkan badge jumlah unread. Saat ini ikon notifikasi mengarah kembali ke dashboard role; notification center/list dan UI `mark as read` khusus belum tersedia, walaupun RPC penanda baca ditemukan.

## 11. Search/filter/sort

| Area | Search | Filter | Sort/aksi tambahan |
| --- | --- | --- | --- |
| Katalog | Kreator, niche, lokasi, skills, layanan, tag, kategori | Kategori, lokasi, niche, harga, rating, availability | Relevansi, rating, harga, completed order, estimasi |
| UMKM orders | Nomor order, layanan, nama | Order status, payment status | Terbaru, deadline, total |
| Creator orders | Nomor order, layanan, UMKM | Order status | Terbaru, deadline, nilai |
| Creator services | Informasi layanan melalui daftar | Status layanan melalui action | Edit, preview, aktif/nonaktif, hapus |
| Admin users | Nama, email | Role, status | Terbaru, nama, role |
| Admin UMKM | Nama, kategori, lokasi, target | Tidak ada filter kompleks terpisah | Terbaru, nama, active orders |
| Admin Creators | Nama, niche, lokasi | Verified, featured | Terbaru, rating, completed order |
| Admin services | Judul, Creator, kategori | Active, featured | Terbaru, harga, judul |
| Admin orders | Nomor, layanan, tier, Creator, UMKM | Order status, payment status | Terbaru, deadline, total |
| Admin payments | Payment, order, layanan, UMKM, Creator, provider | Payment status | Terbaru, amount |
| Admin complaints/reviews | Subject, description, order, opener | Status pada daftar terkait | Resolusi dan visibility review |
| Admin analytics | Recent event | Event type | Paging, refresh section, export preview |

Filter katalog mobile ditempatkan dalam sheet compact. Filter bar dashboard memakai `min-w-0`, input/select fleksibel, dan wrapping terkontrol sehingga tidak menciptakan horizontal scroll liar.

## 12. UI/UX system

### Warna dan tipografi

- Brand teal: sekitar `#167163`.
- Deep teal: sekitar `#114955`.
- Navy: sekitar `#0c2949`.
- Background utama: sekitar `#fbfdfc`.
- Teks utama: ink sekitar `#06111f`.
- Status hijau: paid/completed/success.
- Biru/cyan: status aktif atau sedang berjalan.
- Amber: menunggu, revisi, warning, expired.
- Merah: failed, destructive, atau error.
- Slate/abu: status netral dan informasi sekunder.

Font utama adalah Inter melalui `next/font` dengan `display: swap`.

### Layout

Public page memakai container maksimum yang jelas: sekitar 1.440 px untuk konten umum, 960 px untuk narrow, dan 1.600 px untuk wide. Gutter responsif memakai skala sekitar 1,25 rem, 2 rem, lalu clamp desktop. Dashboard memakai shell `h-dvh`, sidebar desktop yang dapat diperkecil, mobile drawer, topbar sticky, dan hanya main content yang melakukan scroll.

### Komponen visual

- Radius token dasar sekitar `0.625rem`; card/hero memakai radius lebih besar secara konsisten.
- Card memakai border tipis, surface terang, shadow rendah, dan padding responsif.
- Stat panel menekankan angka, label, dan indikator tanpa nested card berlebihan.
- Table dipakai untuk desktop; mobile memakai card/list atau scroll lokal yang disengaja.
- Button memiliki varian primary, secondary/outline, ghost, dan destructive.
- Hover memakai perubahan warna, border, shadow, atau transform kecil; tidak memakai motion berlebihan.
- Empty state memuat ikon, judul singkat, penjelasan, dan CTA jika ada langkah berikutnya.
- Error state global memberi pesan aman dan retry; error auth production dibuat generik.

Global CSS tidak lagi memaksa `overflow-wrap: break-word` pada seluruh body. Pemecahan teks hanya diterapkan secara lokal pada konten yang memang berisiko, sehingga kata normal tidak pecah aneh.

## 13. Mobile/responsive behavior

- Header publik berubah menjadi menu sheet.
- Filter katalog mobile menjadi search ringkas dan bottom sheet, bukan panel tinggi permanen.
- Dashboard sidebar menjadi drawer; topbar menyembunyikan label/status sekunder pada viewport kecil.
- Grid statistik turun dari beberapa kolom ke satu/dua kolom.
- Tabel order/Admin berganti menjadi card mobile atau memiliki scroll lokal pada tabel yang memang harus mempertahankan kolom.
- Checkout mengubah dua kolom menjadi alur vertikal; ringkasan tidak sticky pada mobile.
- Detail order, profil, layanan, review, complaint, dan chat memakai `min-w-0`, truncate, line-clamp, atau break lokal.
- Invoice/receipt memakai area tabel dengan lebar minimum dan scroll lokal, bukan scroll horizontal halaman.

Audit browser pada viewport desktop 1.440 px dan mobile 390 px tidak menemukan elemen yang memperlebar document pada halaman representatif. Area yang belum memiliki data nyata tetap perlu diuji kembali dengan nama, judul, URL, dan deskripsi panjang dari database staging.

## 14. Data/Supabase summary

### Tabel dan relasi utama

| Tabel | Fungsi |
| --- | --- |
| `profiles` | Identitas auth, role, account status, dan data akun umum |
| `umkm_profiles` | Profil bisnis UMKM dan kelengkapan onboarding |
| `creator_profiles` | Profil publik Kreator, niche, lokasi, availability, rating, dan statistik |
| `service_categories` | Kategori layanan yang dapat tampil di katalog |
| `service_packages` | Layanan utama milik Kreator |
| `service_package_tiers` | Tier/paket harga, durasi, revisi, dan deliverables |
| `service_addons` | Opsi tambahan layanan |
| `service_media` | Media galeri layanan |
| `portfolios` | Karya/portofolio Kreator yang dapat dipublikasikan |
| `carts` | Cart aktif UMKM |
| `cart_items` | Pilihan layanan/tier dalam cart |
| `cart_item_addons` | Add-on yang dipilih untuk item cart |
| `campaign_briefs` | Brief campaign sebelum atau saat order dibuat |
| `orders` | Record utama lifecycle pekerjaan dan pihak yang terlibat |
| `order_items` | Snapshot layanan/tier pada saat order |
| `order_item_addons` | Snapshot add-on order |
| `payments` | Status dan metadata pembayaran |
| `invoices` | Dokumen invoice terkait order/payment |
| `order_status_history` | Riwayat perubahan status order |
| `submissions` | Hasil yang dikirim Kreator |
| `revisions` | Permintaan dan respons revisi |
| `file_assets` | Metadata file upload dan relasinya |
| `reviews` | Rating/review setelah order selesai |
| `complaints` | Komplain/dispute order dan resolusi Admin |
| `messages` | Chat berbasis order |
| `notifications` | Notifikasi event untuk pengguna |
| `analytics_events` | Event traffic dan interaksi untuk dashboard analytics |

Nama tabel chat aktual adalah `messages`, bukan `order_messages`. Tabel audit Admin terpisah tidak ditemukan pada generated types saat audit ini.

Bucket Storage yang ditemukan mencakup avatars, brief-assets, business-assets, portfolios, project-results, dan public-assets. Asset publik dan privat dipisahkan sesuai konteks akses.

### Helper data utama

- Auth/session helper membaca user dan profile dari Supabase server client.
- Routing helper memetakan role, onboarding, status akun, dan safe redirect.
- Loader katalog menggabungkan Creator, layanan, kategori, tier, rating, dan statistik.
- Dashboard loader mengubah query menjadi view model terstruktur; mode demo menghasilkan zero/empty state.
- Server Actions menangani cart, brief, order, pembayaran sandbox, lifecycle order, layanan, profil, portfolio, review, complaint, chat, dan moderasi Admin.
- Admin analytics memecah query per section agar failure tidak menjatuhkan seluruh dashboard.

### Route handler teknis

| Route handler | Status |
| --- | --- |
| `/api/analytics` | Aktif untuk pencatatan event yang diizinkan |
| `/api/admin/analytics/section` | Aktif, khusus Admin, untuk refresh section |
| `/api/health` | Aktif untuk health response |
| `/admin/reports/export` | Aktif untuk CSV/HTML/print dengan guard Admin |
| `/api/checkout` | Placeholder `501`; flow aktif memakai Server Action/RPC |
| `/api/orders/[orderId]/revision` | Placeholder `501` |
| `/api/orders/[orderId]/status` | Placeholder `501` |
| `/api/payments/create` | Placeholder `501` |
| `/api/payments/webhook` | Placeholder `501` |
| `/api/upload` | Placeholder `501`; upload aktif memakai helper/Server Action lain |

Route metadata `/icon.png`, `/robots.txt`, dan `/sitemap.xml` tersedia untuk identitas serta discovery mesin pencari. `/_not-found` adalah fallback framework untuk URL atau resource yang tidak ditemukan.

## 15. Security/RLS summary

- `profiles.role` dan `account_status` menjadi sumber akses, bukan email hardcode.
- Helper `is_admin()` memeriksa role Admin dengan status aktif.
- Public hanya membaca kategori, layanan, tier, add-on, portofolio, Creator, dan review yang memenuhi status visibility.
- Creator hanya mengelola layanan, tier, media, add-on, dan portofolio miliknya.
- UMKM hanya mengelola profil, cart, brief, dan order miliknya.
- Peserta order memperoleh akses terbatas ke brief, history, messages, submissions, revisions, reviews, complaints, invoice, dan file terkait.
- Mutasi lifecycle penting melewati RPC/Server Action yang memeriksa actor, status, payment, ownership, dan batas revisi.
- Service role client tetap server-only dan tidak dipakai sebagai client Admin untuk pengguna biasa.
- Role Admin tidak tersedia pada registrasi publik dan pengguna tidak dapat mengubah role sendiri dari client.
- Result file dan brief asset privat; akses publik tidak dibuka longgar.
- Demo mode melewati autentikasi dashboard dan karena itu wajib dimatikan pada production.

Migration lama tidak diubah pada audit ini. Tidak ada kebutuhan untuk melonggarkan RLS atau membuat migration baru.

## 16. Performance summary

Yang sudah baik:

- Landing page memakai `next/image`, `sizes`, dan priority hanya pada hero penting.
- Mayoritas route adalah Server Components sehingga JavaScript client tidak dikirim tanpa kebutuhan.
- Catalog filter, chat realtime, Recharts analytics, form interaktif, payment modal, dan upload dipisahkan sebagai Client Components.
- Admin dashboard mengisolasi query per section dan tidak crash ketika data opsional gagal.
- Analytics membatasi jendela waktu dan jumlah record pada loader utama.
- Layout dashboard mempertahankan satu area scroll utama.

Potensi optimasi tersisa:

- Sejumlah gambar Supabase dinamis masih memakai CSS `background-image`, sehingga tidak memperoleh optimasi/lazy loading `next/image` secara penuh.
- Katalog memfilter seluruh data di client; saat volume besar perlu pagination dan filtering server-side.
- Layout dan page dashboard dapat mengulang pembacaan account/notifikasi/cart pada request yang sama.
- Realtime chat bergantung pada object collaboration dan dapat reconnect jika object prop berubah setelah refresh.
- Analytics memuat beberapa dataset sekaligus; section berat dapat diberi cache, pagination, atau query agregasi database.
- Tidak ditemukan job retention/cleanup otomatis untuk `analytics_events`.
- Dokumen lama seperti README/handoff masih memuat konteks rencana atau tahap dummy yang tidak selalu sama dengan runtime saat ini.

## 17. Tombol dan CTA penting

| Area | Tombol/CTA | Fungsi/target |
| --- | --- | --- |
| Header publik | Beranda, Katalog, Cara Kerja, Bantuan | Membuka route publik terkait |
| Header publik | Cart | Membuka `/umkm/cart`; badge menunjukkan jumlah item |
| Auth | Masuk, Daftar, Logout | Membuat/mengakhiri session dan mengikuti redirect role |
| Auth | Lupa password | Membuka `/forgot-password` dan flow email default Supabase |
| Landing | Jelajahi/Cari Kreator | Membuka `/katalog` |
| Landing | Daftar sebagai Kreator | Membuka `/register` |
| Katalog | Search/filter/reset/terapkan | Mengubah hasil katalog di client |
| Kartu | Lihat detail | Membuka profil Kreator atau layanan |
| Layanan | Tambah ke Keranjang | Menyimpan pilihan ke cart |
| Layanan | Pesan Sekarang | Membuka direct checkout untuk layanan/tier terpilih |
| Cart | Update/hapus/bersihkan | Mengubah cart aktif |
| Cart | Checkout | Membuka checkout source cart |
| Checkout | Simpan brief/buat order | Menyimpan brief dan membuat order/payment/invoice |
| Payment | Bayar | Menjalankan pembayaran sandbox melalui RPC |
| Invoice/receipt | Cetak | Membuka dialog cetak dokumen in-app |
| Creator order | Accept | Menerima order paid yang menunggu konfirmasi |
| Creator order | Start | Memulai order setelah brief diterima |
| Creator order | Submit hasil | Mengirim submission dan file/link hasil |
| UMKM order | Request revisi | Membuat revisi selama batas masih ada |
| UMKM order | Approve hasil | Menandai order completed |
| UMKM order | Beri review | Membuat rating/review setelah paid dan completed |
| Order | Buat komplain | Membuka/mengirim complaint untuk order peserta |
| Order | Kirim chat | Mengirim pesan realtime pada order |
| Analytics | Refresh section | Memuat ulang section tertentu tanpa mereload semua halaman |
| Admin | Suspend/aktifkan akun | Mengubah status akun melalui RPC |
| Admin | Verify/feature Creator | Memoderasi badge dan posisi Kreator |
| Admin | Aktif/feature layanan | Memoderasi visibility layanan |
| Admin | Resolve complaint | Mengubah status dan resolution note |
| Admin | Show/hide review | Memoderasi visibility review |
| Reports | Export CSV/HTML/print | Menghasilkan laporan dengan guard Admin |

Button yang tidak memenuhi kondisi status/ownership disembunyikan atau ditolak oleh action server, sehingga UI bukan satu-satunya lapisan keamanan.

## 18. Masalah kecil yang ditemukan

1. Tautan `/admin/settings` ada di navigasi tetapi page route belum tersedia.
2. Tidak ada notification center; bell hanya menampilkan badge dan kembali ke dashboard.
3. Tidak ada halaman review Admin khusus; moderasi review digabung dengan complaints.
4. Tidak ada inbox chat global atau halaman komplain mandiri untuk UMKM/Kreator.
5. Editor add-on layanan belum terlihat pada form Creator walaupun loader/action data tersedia.
6. Route API checkout/payment/status/revision/upload masih placeholder `501`; flow aktif memakai Server Action/RPC.
7. Copy `/cara-kerja` menyebut escrow/dana ditahan, tetapi mekanisme escrow/payout belum ditemukan.
8. Hero landing menampilkan search visual, tetapi pencarian sebenarnya baru berlangsung di katalog.
9. Kegagalan query katalog dapat terlihat sama dengan empty state data kosong.
10. Preference notifikasi di settings belum memiliki kontrol rinci.
11. Payout/withdrawal Kreator belum tersedia.
12. Beberapa dokumentasi lama dan README masih mencampur roadmap/handoff dengan kondisi runtime.
13. Cleanup/retention analytics otomatis belum ditemukan.
14. Gambar remote dinamis berbasis CSS background belum mendapat optimasi gambar Next.js penuh.

Tidak ditemukan horizontal document scroll pada route representatif desktop/mobile saat audit. Risiko overflow utama berasal dari data database yang sangat panjang dan sudah dipersempit melalui perbaikan lokal.

## 19. AI Smart Matching (landing page)

Section promosi fitur AI Smart Matching berada di landing page tepat setelah section Kategori Layanan. Komponen `AiSmartMatchingSection` adalah Client Component di `src/features/public/components/ai-smart-matching-section.tsx`.

Fungsi saat ini adalah frontend/visual saja. Textarea prompt menerima input teks dari pengunjung, tetapi tombol "Cari Rekomendasi" hanya menampilkan toast informasi bahwa fitur akan segera tersedia. Tidak ada request ke backend atau API AI.

Visual menggunakan card besar horizontal dengan background gradient brand (`#0C2949`, `#114955`, `#167163`), badge "AI Smart Matching", headline, deskripsi, textarea prompt box, tombol CTA, dan image abstract di sisi kanan desktop. Mobile menyembunyikan kolom visual agar section tetap compact.

Saat AI API siap, textarea dan tombol CTA tinggal dihubungkan ke endpoint rekomendasi kreator.

## 20. AI Smart Brief (checkout brief UMKM)

AI Smart Brief berada di halaman checkout UMKM (`/umkm/checkout`) sebagai panel collapsible tepat di atas form brief campaign. Komponen `AiSmartBriefPanel` adalah Client Component di `src/features/briefs/components/ai-smart-brief-panel.tsx`.

Saat ini fitur masih frontend/local draft generator. AI API belum dihubungkan. Fungsi utama membantu UMKM menyusun brief lebih rapi sebelum order dibuat.

Panel menyediakan field terstruktur:

- Tujuan campaign
- Produk/jasa yang dipromosikan
- Target audiens
- Platform konten (pilihan chip)
- Gaya komunikasi (pilihan chip)
- Poin utama pesan
- Referensi/catatan tambahan

Tombol dan behavior:

| Tombol | Fungsi |
| --- | --- |
| Susun Draft Brief | Membuat draft lokal berbasis template dari input yang diisi. Tidak memanggil API. Minimal tujuan campaign dan produk harus diisi. |
| Masukkan ke Brief | Mengisi field form brief utama (`CampaignBriefForm`) dengan data dari draft. Jika brief utama sudah berisi teks, muncul konfirmasi "Timpa" atau "Batal". |
| Reset Draft | Mengosongkan semua field AI Smart Brief dan draft preview. |

Draft yang dihasilkan menggunakan format terstruktur: Tujuan Campaign, Produk/Jasa, Target Audiens, Platform Konten, Gaya Komunikasi, Pesan Utama, Arahan Konten, dan Referensi. Format ini dirancang agar mudah dibaca kreator.

Integrasi ke form brief menggunakan native DOM manipulation karena `CampaignBriefForm` adalah Server Component dengan uncontrolled inputs. Saat AI API siap, fungsi `buildDraft` dapat diganti dengan panggilan ke endpoint AI tanpa mengubah struktur UI.

## 21. Perbaikan kecil yang dilakukan


- Menghapus pemecahan kata global pada `body` agar kata normal tidak pecah seperti "Nich e".
- Menambahkan `min-w-0`, `overflow-hidden`, `truncate`, dan `line-clamp` secara lokal pada kartu Creator, layanan, portofolio, dashboard, profile header, service detail, tier, filter, dan summary pembayaran.
- Membatasi label, judul, metadata, harga, dan nama panjang pada admin table/list.
- Mengamankan hero UMKM/Creator, stat card, quick action, dan list item dari perluasan grid.
- Mengamankan order detail UMKM, Creator, dan Admin dari nomor order, nama pihak, tier, deliverables, history, dan angka panjang.
- Mengamankan chat bubble, review card, complaint card, payment detail, dan checkout summary.
- Memberi scroll lokal pada tabel item invoice/receipt untuk mobile tanpa memperlebar halaman.
- Memadatkan topbar dashboard mobile dengan menyembunyikan label sekunder dan mempertahankan action yang dapat diakses melalui `aria-label`.
- Mempertahankan filter katalog mobile dalam sheet compact yang sudah ada; tidak membuat panel permanen baru.

Perubahan ini hanya menyentuh layout/overflow. Business logic, database, RLS, payment production, dan migration tidak diubah.

## 22. Rekomendasi next step

Prioritas dekat:

1. Hapus tautan Admin Settings atau buat page nyata yang sesuai kebutuhan.
2. Selaraskan copy escrow/payout dengan kemampuan pembayaran yang benar-benar aktif.
3. Buat error state katalog yang membedakan query gagal dari hasil kosong.
4. Uji stress content pada staging dengan nama, URL, title, dan description maksimum.
5. Lengkapi editor add-on jika add-on memang menjadi fitur Creator yang didukung.

Prioritas menengah:

1. Tambahkan notification center dan mark-as-read UI jika notifikasi akan menjadi workflow utama.
2. Pindahkan filter/pagination katalog dan tabel Admin ke server saat volume data meningkat.
3. Optimalkan gambar Supabase dinamis melalui loader/image pipeline yang aman.
4. Tambahkan agregasi/cache analytics serta kebijakan retention data.
5. Konsolidasikan README dan dokumen handoff agar menunjuk ke dokumen ini sebagai kondisi produk aktual.

Prioritas sebelum integrasi pembayaran production:

1. Tentukan provider, signature verification, webhook idempotency, retry, dan audit trail.
2. Dokumentasikan apakah platform memakai escrow, settlement langsung, atau pencatatan pembayaran saja.
3. Uji invoice/receipt, refund, dispute, dan status order terhadap sandbox provider resmi.

Dokumen lain di `docs/` tetap berguna untuk arsitektur rinci, SQL, UI reference, dan histori handoff. Untuk memahami produk dan route yang benar-benar ada saat ini, dokumen ini menjadi referensi utama.

Status dokumen pendukung:

- `docs/architecture/`: referensi teknis auth, role, route, data model, order, payment, storage, deployment, testing, dan setup Supabase. Beberapa roadmap/dummy document bersifat historis dan perlu dibaca bersama implementasi aktual.
- `docs/product/`: scope dan daftar fitur produk; berguna untuk intent, tetapi status runtime mengikuti dokumen ini dan kode.
- `docs/uiux/`: design system dan gambar referensi visual, bukan bukti fitur aktif.
- `docs/sql/set-admin-role.sql`: utilitas operasional terbatas; bukan bagian flow registrasi publik.
- `docs/RUANGUSAHA_HANDOFF_NEXT_ACCOUNT.md`: histori handoff, bukan spesifikasi runtime final.
