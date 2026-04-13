# PRD Front-End MVP

## Produk: Ruang Usaha Kita

## Versi: MVP Front-End 1.0

## Fokus: Fitur Utama Saja

## 1. Ringkasan Produk

Ruang Usaha Kita adalah platform marketplace jasa promosi digital yang menghubungkan pelaku UMKM dengan content creator agar proses promosi produk menjadi lebih mudah, aman, terarah, dan profesional. Dari sisi UMKM, platform harus mempermudah pencarian kreator berdasarkan kategori, lokasi, niche, biaya, dan portofolio. Dari sisi kreator, platform harus menjadi ruang profesional untuk menampilkan profil, layanan, dan portofolio agar lebih mudah ditemukan oleh calon klien. Proposal juga menegaskan kebutuhan akan pengelolaan brief, monitoring progres kerja, sistem transaksi aman, rekomendasi AI, dan dashboard untuk masing-masing pihak. 

Untuk tahap MVP front-end, fokus produk bukan pada fitur paling kompleks, tetapi pada pengalaman inti yang menjawab masalah paling mendasar:

* UMKM bisa memahami platform dengan cepat
* UMKM bisa menemukan kreator yang cocok
* Kreator bisa tampil profesional
* Proses awal kerja sama bisa dimulai dengan rapi
* Dashboard dasar sudah tersedia
* UI/UX terasa familier, sederhana, dan terpercaya

---

## 2. Tujuan Produk

### 2.1 Tujuan Bisnis

Produk ini dibuat untuk membantu digitalisasi promosi UMKM dan membuka peluang kerja sama yang lebih profesional bagi content creator, sebagaimana ditekankan dalam proposal. Platform harus menjadi jembatan yang membuat proses mencari, memilih, dan bekerja sama dengan kreator menjadi lebih efisien dan aman.

### 2.2 Tujuan Front-End

Front-end harus:

* menjelaskan value produk dengan sangat cepat
* mengurangi kebingungan user awam
* memudahkan discovery kreator
* membuat jasa dan portofolio mudah dipahami
* menyediakan alur awal kerja sama yang jelas
* membangun rasa aman lewat desain, bahasa, dan struktur informasi

### 2.3 Tujuan MVP

Versi MVP front-end tidak mengejar fitur lengkap. Fokusnya:

* public experience yang kuat
* listing dan discovery kreator
* profil kreator dan jasa
* form brief / permintaan kerja sama
* dashboard dasar UMKM
* dashboard dasar kreator
* landasan untuk AI smart match dan auto-brief

---

## 3. Problem Statement

Proposal menjelaskan bahwa banyak UMKM belum mampu menjalankan promosi digital secara efektif karena kesulitan membuat konten, menyusun strategi, dan memahami tren media sosial. Di sisi lain, kerja sama dengan kreator masih sering dilakukan manual lewat DM media sosial, tidak transparan dari sisi tarif dan portofolio, dan rawan ketidakjelasan terkait brief, hasil kerja, dan pembayaran. Kreator lokal maupun mikro juga kesulitan mendapatkan klien secara konsisten karena belum ada wadah profesional yang mempertemukan mereka dengan UMKM. 

Masalah front-end yang harus diselesaikan:

* user tidak boleh bingung tentang fungsi website
* user harus mudah membedakan peran UMKM dan kreator
* user harus bisa menilai kreator secara cepat
* user harus merasa platform ini rapi dan aman
* user awam tidak boleh dipaksa memahami istilah teknis

---

## 4. Target Pengguna

### 4.1 UMKM / Pebisnis Kecil-Menengah

Karakter:

* usia remaja akhir sampai dewasa
* banyak yang belum terlalu paham digital marketing
* sebagian besar lebih familiar dengan pola aplikasi marketplace umum
* sensitif terhadap harga, kejelasan proses, dan rasa aman

Kebutuhan:

* cari kreator tanpa ribet
* lihat harga dan layanan dengan jelas
* pahami langkah kerja sama
* bisa isi kebutuhan promosi dengan bahasa sederhana
* tidak dibebani dashboard rumit

### 4.2 Content Creator / Marketer / Influencer

Karakter:

* kreator lokal, mikro, atau pemula
* butuh tempat yang terlihat profesional
* ingin mudah ditemukan calon klien
* butuh struktur jasa dan portofolio yang rapi

Kebutuhan:

* profil profesional
* portofolio yang menarik
* jasa dan paket harga yang jelas
* brief yang rapi dari UMKM
* dashboard sederhana untuk permintaan kerja sama

### 4.3 Admin Internal

Untuk MVP front-end, admin bukan fokus utama. Cukup ada kebutuhan struktur untuk nanti, tetapi tidak perlu panel admin kompleks di fase ini.

---

## 5. Product Principles

Front-end Ruang Usaha Kita harus memegang prinsip berikut:

### 5.1 Familiar

UI harus terasa dekat dengan pola Shopee, Tokopedia, Fiverr, Sribu, dan marketplace Indonesia lain: search jelas, card listing jelas, CTA jelas, filter mudah dipahami.

### 5.2 Simple

Satu layar harus punya satu tujuan utama. Hindari kepadatan informasi yang membuat user awam bingung.

### 5.3 Trustworthy

Karena proposal menekankan keamanan transaksi dan profesionalitas kerja sama, desain harus membangun rasa aman walaupun escrow penuh belum aktif di MVP.

### 5.4 Guided

User harus dipandu, bukan dibiarkan menebak. Copy, empty state, button label, dan section heading harus menjelaskan apa yang harus dilakukan berikutnya.

### 5.5 Mobile-conscious

Mayoritas user Indonesia akan datang dari HP. Maka public pages harus mobile-first. Dashboard harus tetap enak di tablet dan desktop.

---

## 6. Scope Front-End MVP

### In Scope

Landing page, auth pages, creator listing, creator detail, service detail, portfolio section, form brief, dashboard UMKM dasar, dashboard kreator dasar, favorit, AI helper placeholder, responsive design.

### Out of Scope untuk MVP ini

Realtime chat, payment gateway penuh, escrow aktif penuh, sistem dispute, admin moderation kompleks, analytics lanjutan, campaign management kompleks, messaging in-app penuh.

---

## 7. Informasi Arsitektur Halaman

## 7.1 Public Pages

1. Home / Landing Page
2. Cari Kreator / Marketplace Listing
3. Detail Kreator
4. Detail Layanan
5. Tentang Platform
6. Bantuan / FAQ
7. Masuk
8. Daftar
9. Pilih Peran saat registrasi

## 7.2 Protected Pages UMKM

1. Dashboard UMKM
2. Profil Usaha
3. Permintaan Kerja Sama / Brief Saya
4. Kreator Favorit
5. Pengaturan Akun

## 7.3 Protected Pages Kreator

1. Dashboard Kreator
2. Profil Kreator
3. Kelola Layanan
4. Kelola Portofolio
5. Permintaan Masuk
6. Pengaturan Akun

---

## 8. Sitemap MVP

Struktur navigasi utama:

* Home
* Cari Kreator
* Cara Kerja
* Masuk
* Daftar

Setelah login sebagai UMKM:

* Dashboard
* Cari Kreator
* Favorit
* Permintaan Saya
* Profil Usaha

Setelah login sebagai Kreator:

* Dashboard
* Profil
* Layanan
* Portofolio
* Permintaan Masuk

---

## 9. Fitur Inti MVP Front-End

## 9.1 Landing Page

Tujuan:
menjelaskan produk dan membangun trust.

Section inti:

* Hero utama
* Penjelasan singkat platform
* Untuk UMKM / Untuk Kreator
* Cara kerja 3–4 langkah
* Preview kreator/layanan
* AI smart match teaser
* Testimoni / social proof placeholder
* CTA daftar atau cari kreator

Kebutuhan UX:

* headline harus sederhana
* subheadline menjawab masalah nyata
* CTA primer langsung terlihat
* jangan terlalu banyak paragraf panjang

Contoh arah copy:

* “Temukan kreator promosi yang cocok untuk usahamu”
* “Lebih mudah cari kreator, lebih rapi atur kerja sama”
* “Bangun profilmu dan dapatkan peluang kerja sama dari UMKM”

## 9.2 Marketplace / Creator Listing

Tujuan:
memudahkan UMKM menemukan kreator.

Elemen utama:

* search bar
* filter kategori
* filter niche
* filter lokasi
* filter kisaran harga
* sort sederhana
* card kreator

Isi card kreator:

* foto
* nama
* niche utama
* lokasi
* harga mulai
* rating
* ringkasan singkat
* CTA lihat profil

Kebutuhan UX:

* hasil listing harus mudah discan
* filter tidak terlalu banyak
* card jangan terlalu padat
* informasi paling penting harus terlihat tanpa klik

## 9.3 Detail Kreator

Tujuan:
menjadi halaman keputusan.

Section:

* hero profil
* identitas kreator
* niche dan platform
* deskripsi
* layanan yang tersedia
* portofolio unggulan
* ulasan
* CTA ajukan kerja sama
* CTA simpan favorit

Kebutuhan UX:

* tampilan harus terasa profesional
* portofolio harus mudah dilihat
* jasa dan harga harus mudah dibedakan
* review harus membangun rasa aman

## 9.4 Detail Layanan

Tujuan:
menjelaskan paket jasa dengan rinci.

Isi:

* nama layanan
* deskripsi layanan
* harga
* output yang didapat
* estimasi pengerjaan
* jumlah revisi
* platform publikasi
* contoh konten terkait
* CTA ajukan brief

Kebutuhan UX:

* format seperti halaman produk jasa
* manfaat harus lebih dominan daripada istilah teknis
* struktur harus mudah dipindai

## 9.5 Auth

Halaman:

* login
* register
* pilih role
* reset password nanti

Kebutuhan:

* form singkat
* validasi jelas
* error message manusiawi
* setelah daftar, user diarahkan ke langkah berikutnya yang paling relevan

## 9.6 Onboarding UMKM

Tujuan:
membuat profil usaha dasar.

Field minimum:

* nama usaha
* kategori usaha
* domisili
* deskripsi singkat
* produk utama
* target promosi
* kontak

Kebutuhan UX:

* step pendek
* bahasa sederhana
* ada contoh placeholder

## 9.7 Onboarding Kreator

Tujuan:
membuat profil kreator yang siap tampil.

Field minimum:

* nama kreator / brand
* domisili
* niche
* platform utama
* deskripsi singkat
* harga mulai
* upload foto
* link portofolio / media sosial

## 9.8 Brief / Permintaan Kerja Sama

Tujuan:
menjadi jembatan antara discovery dan kolaborasi.

Field minimum:

* nama usaha
* produk / jasa yang dipromosikan
* tujuan promosi
* target audiens
* budget
* deadline
* catatan tambahan

AI helper:

* tombol “Bantu buat brief”
* hasil auto-brief draft

Proposal menempatkan brief, monitoring progres, dan rekomendasi AI sebagai bagian inti dari sistem, sehingga halaman ini wajib ada walau versi awalnya sederhana.

## 9.9 Dashboard UMKM

Tujuan:
memberi pusat kontrol sederhana.

Section minimum:

* ringkasan akun
* permintaan aktif
* kreator favorit
* status kerja sama
* CTA cari kreator lagi

## 9.10 Dashboard Kreator

Tujuan:
memberi pusat kontrol sederhana untuk mengelola profil dan permintaan masuk.

Section minimum:

* profil singkat
* layanan aktif
* portofolio terbaru
* permintaan masuk
* CTA tambah layanan / portofolio

---

## 10. User Flow Utama

## 10.1 Flow UMKM

Landing → pilih “Cari Kreator” → listing kreator → filter/search → buka profil kreator → buka detail layanan → klik ajukan kerja sama → isi brief → kirim → masuk dashboard → lihat status permintaan.

## 10.2 Flow Kreator

Landing → pilih “Daftar sebagai Kreator” → onboarding profil → tambah layanan → tambah portofolio → profil tampil di marketplace → menerima permintaan masuk → melihat detail brief.

## 10.3 Flow AI Helper

User UMKM membuka form brief → menekan tombol bantuan AI → sistem menyusun draft brief dari input singkat → user review dan edit → kirim brief.

## 10.4 Flow Favorit

UMKM melihat listing → klik simpan kreator → kreator masuk ke halaman favorit → user bisa kembali kapan saja.

---

## 11. Dashboard Logic

## 11.1 Dashboard UMKM

Prioritas konten:

1. tindakan berikutnya
2. status permintaan
3. daftar kreator favorit
4. ringkasan akun

Widget utama:

* jumlah permintaan aktif
* status terbaru
* daftar kreator yang baru dilihat
* CTA buat brief baru

## 11.2 Dashboard Kreator

Prioritas konten:

1. permintaan masuk
2. status profil
3. layanan dan portofolio
4. CTA optimasi profil

Widget utama:

* jumlah permintaan masuk
* layanan aktif
* portofolio terakhir
* rekomendasi lengkapi profil

---

## 12. UI Requirements

## 12.1 Visual Direction

Gaya visual:

* bersih
* modern
* profesional
* marketplace SaaS
* ramah pengguna awam

Inspirasi:

* layout familiarnya Shopee/Tokopedia untuk browsing
* kejelasan profil jasa seperti Fiverr/Sribu
* dashboard simpel seperti admin panel modern, tapi lebih ringan

## 12.2 Color Strategy

Warna utama:

* hijau kebiruan / teal / blue-green sebagai identitas pertumbuhan, kepercayaan, dan digital
* netral terang untuk background
* warna status yang konsisten

Hindari:

* terlalu banyak warna cerah bertabrakan
* tema terlalu gelap untuk seluruh aplikasi publik
* gradien berlebihan

## 12.3 Typography

Harus:

* bersih
* modern
* sangat terbaca di mobile
* cocok untuk bahasa Indonesia

Saran:

* heading: Inter / Poppins
* body: Inter / system sans

Skala:

* H1 besar dan tegas untuk hero
* H2 untuk judul section
* body 14–16 px mobile
* line-height longgar untuk keterbacaan

## 12.4 Spacing

Spacing harus konsisten berbasis sistem 4/8 px.

* card padding nyaman
* jarak antar section cukup lebar
* jangan terlalu rapat seperti dashboard lama
* mobile harus punya napas

## 12.5 Layout

Desktop:

* container terukur
* sidebar hanya untuk dashboard
* marketplace bisa gunakan grid card

Tablet:

* filter dan card diatur ulang
* sidebar dashboard bisa collapse

Mobile:

* bottom CTA penting
* filter bisa jadi modal/drawer
* card lebih vertikal
* form lebih singkat dan jelas

## 12.6 Component Requirements

Komponen dasar:

* navbar
* footer
* search input
* filter chips
* creator card
* service card
* rating badge
* price badge
* section header
* CTA buttons
* modal
* toast
* tabs
* accordion FAQ
* stepper onboarding
* dashboard cards
* empty state
* error state
* skeleton loading

---

## 13. UX Writing Guidelines

Karena target pengguna banyak yang awam digital, UX writing harus:

* pakai Bahasa Indonesia sederhana
* hindari istilah teknis
* fokus pada tindakan
* jelas dan meyakinkan
* pendek

Contoh label yang baik:

* “Cari kreator”
* “Lihat profil”
* “Ajukan kerja sama”
* “Isi kebutuhan promosi”
* “Simpan ke favorit”
* “Tambah layanan”
* “Lengkapi profil”
* “Permintaan masuk”

Hindari:

* “inisialisasi campaign”
* “submit proposal”
* “resource allocation”
* “deliverable configuration”

Error message harus manusiawi:

* “Email atau kata sandi belum benar”
* “Lengkapi nama usaha terlebih dahulu”
* “Belum ada kreator yang sesuai. Coba ubah filter”

Success message:

* “Brief berhasil dikirim”
* “Profil berhasil diperbarui”
* “Kreator disimpan ke favorit”

---

## 14. UI/UX Laws yang Harus Dipakai

## 14.1 Hick’s Law

Jumlah pilihan di awal harus sedikit. Homepage dan onboarding jangan penuh opsi.

## 14.2 Fitts’s Law

Button utama harus besar, jelas, mudah disentuh di mobile.

## 14.3 Jakob’s Law

Gunakan pola yang sudah dikenal user Indonesia. Jangan terlalu eksperimental.

## 14.4 Aesthetic-Usability Effect

Tampilan harus bersih dan rapi karena user lebih percaya pada platform yang terlihat profesional.

## 14.5 Law of Proximity

Informasi yang berhubungan harus dikelompokkan. Misalnya harga, layanan, dan CTA harus berdekatan.

## 14.6 Progressive Disclosure

Jangan tampilkan semua hal sekaligus. Detail yang kompleks dibuka bertahap.

## 14.7 Serial Position Effect

Informasi paling penting diletakkan di awal dan akhir section, terutama CTA, harga mulai, dan trust signals.

---

## 15. Responsive Requirements

## 15.1 Mobile

Prioritas utama untuk:

* landing
* listing
* detail kreator
* auth
* brief form

## 15.2 Tablet

Prioritas:

* browsing nyaman
* dashboard tetap usable

## 15.3 Desktop

Prioritas:

* dashboard
* kelola layanan
* kelola portofolio
* view data yang lebih lengkap

---

## 16. Accessibility Requirements

MVP tetap harus punya standar minimum:

* kontras cukup
* ukuran teks nyaman
* button punya state hover/focus
* form label jelas
* error form terhubung ke input
* alt text untuk gambar penting
* keyboard navigation dasar

---

## 17. Success Metrics Front-End MVP

Ukuran keberhasilan awal:

* user bisa memahami fungsi platform dalam < 10 detik saat membuka homepage
* user UMKM bisa menemukan kreator dan membuka detail tanpa kebingungan
* user kreator bisa membuat profil awal dengan lancar
* minimal satu brief bisa dikirim end-to-end
* user bisa membedakan area publik dan dashboard dengan jelas
* UI terasa kredibel dan tidak membingungkan user awam

---

## 18. Non-Functional Front-End Requirements

* loading cepat
* struktur komponen rapi
* route terorganisir
* reusable component
* mobile responsive
* error state jelas
* SEO dasar untuk public page
* clean architecture untuk scale-up

---

## 19. MVP Deliverables Front-End

Deliverables minimum:

* design system dasar
* sitemap final
* wireframe low-mid fidelity
* high fidelity untuk halaman inti
* React page structure
* routing halaman publik
* routing dashboard dasar
* reusable UI components
* halaman auth
* halaman listing kreator
* halaman detail kreator
* halaman detail layanan
* halaman brief
* dashboard UMKM dasar
* dashboard kreator dasar

---

## 20. Prioritas Pengerjaan Front-End

### Priority 1

* landing page
* login/register
* listing kreator
* detail kreator
* detail layanan

### Priority 2

* brief form
* favorit
* onboarding UMKM
* onboarding kreator

### Priority 3

* dashboard UMKM
* dashboard kreator
* AI helper placeholder

### Priority 4

* FAQ
* about
* enhancement states
* visual polish

---

## 21. Keputusan Penting untuk Tim

1. Front-end harus memakai pola marketplace yang familiar.
2. MVP tidak boleh dipenuhi fitur rumit dulu.
3. Fokus utama adalah trust, clarity, dan discovery.
4. Dashboard harus fungsional, bukan dekoratif.
5. Copywriting harus sederhana dan Indonesia-first.
6. Mobile experience tidak boleh dianggap tambahan.
7. AI di fase awal tampil sebagai helper, bukan pusat seluruh pengalaman.

---


# 23. Benchmark Experience dan Pola Familiar Marketplace

Ruang Usaha Kita tidak perlu meniru mentah satu platform tertentu, tetapi harus mengambil **pola yang sudah familiar** di benak pengguna Indonesia. Karena target utama adalah UMKM dan pengguna umum yang tidak selalu tech-savvy, maka produk harus terasa “sudah pernah dipakai”, walaupun konteksnya berbeda. Ini selaras dengan kebutuhan proposal yang menekankan efisiensi, keamanan, kejelasan proses, dan kemudahan mencari kreator yang sesuai.

## 23.1 Pola yang diambil dari marketplace/e-commerce umum

### Shopee / Tokopedia

Yang diambil:

* search bar sangat dominan
* kategori mudah dipahami
* card listing mudah discan
* CTA utama jelas
* struktur informasi bertahap
* rasa aman dibangun lewat rating, ulasan, badge, harga, dan status

Implementasi di Ruang Usaha Kita:

* halaman “Cari Kreator” harus menjadi pusat discovery
* user harus bisa langsung memahami card kreator tanpa membaca panjang
* filter tidak boleh terasa teknis
* harga mulai, niche, lokasi, rating, dan CTA harus langsung kelihatan

### Fiverr / Sribu / Freelancer / Upwork

Yang diambil:

* profil jasa sebagai “etalase profesional”
* pemisahan jelas antara profil penyedia jasa dan detail layanan
* informasi penawaran harus jelas
* user perlu melihat portofolio, harga, deskripsi, dan review sebelum mengambil keputusan

Implementasi di Ruang Usaha Kita:

* kreator harus punya halaman profil profesional
* layanan tidak cukup hanya satu kalimat, tetapi juga tidak boleh terlalu panjang dan rumit
* harus ada struktur yang membedakan “profil kreator”, “layanan”, dan “portofolio”
* brief menjadi penghubung dari minat ke tindakan

### Amazon / marketplace katalog besar

Yang diambil:

* struktur halaman produk yang ringkas tapi informatif
* hierarchy informasi sangat jelas
* CTA dan keputusan utama selalu terlihat
* user bisa membandingkan secara mental tanpa harus berpikir keras

Implementasi di Ruang Usaha Kita:

* halaman layanan harus seperti halaman produk jasa
* nama layanan, harga, output, durasi, revisi, dan CTA harus ada di fold atas
* konten tambahan seperti FAQ, portofolio, atau detail teknis diletakkan di bawah

## 23.2 Prinsip benchmark yang dipakai

Ruang Usaha Kita harus terasa seperti:

* **Shopee/Tokopedia** saat user browsing
* **Fiverr/Sribu/Upwork** saat user menilai jasa
* **Amazon-style hierarchy** saat user membaca detail layanan
* **dashboard SaaS sederhana** saat user masuk area pengelolaan akun

Artinya, bukan desain yang terlalu unik atau eksperimental. Fokusnya adalah:

* mudah dipelajari
* cepat dipahami
* minim kejutan
* konsisten

---

# 24. Decision Framework untuk Front-End MVP

Agar tim tidak melebar saat build, semua keputusan front-end harus lolos pertanyaan ini:

## 24.1 Apakah ini membantu user memahami produk lebih cepat?

Jika tidak, tunda.

## 24.2 Apakah ini membantu user menemukan kreator atau mengelola jasa lebih mudah?

Jika tidak, tunda.

## 24.3 Apakah ini membuat platform terasa lebih aman dan terpercaya?

Jika ya, prioritaskan.

## 24.4 Apakah ini menambah kompleksitas tanpa manfaat nyata di MVP?

Jika ya, buang.

## 24.5 Apakah ini bisa dibuat lebih sederhana tanpa mengurangi manfaat?

Jika ya, sederhanakan.

Framework ini penting karena proposal menekankan masalah nyata di lapangan: pencarian manual, ketidakjelasan tarif, brief yang kacau, dan minimnya wadah profesional. Fokus front-end harus langsung ke akar masalah itu. 

---

# 25. Detail Struktur Halaman Front-End

## 25.1 Home / Landing Page

Landing page tidak boleh hanya cantik. Ia harus berfungsi sebagai:

* penjelas produk
* alat akuisisi
* alat membangun trust
* pengarah ke alur berikutnya

### Struktur section yang direkomendasikan

1. Navbar
2. Hero utama
3. Nilai utama platform
4. Untuk siapa platform ini
5. Cara kerja singkat
6. Preview kreator / jasa
7. Keunggulan / trust section
8. AI helper teaser
9. FAQ singkat
10. CTA penutup
11. Footer

### Hero

Isi hero harus menjawab tiga hal:

* ini platform apa
* untuk siapa
* langkah berikutnya apa

Format hero:

* heading utama
* subheading penjelas
* dua CTA utama
* visual mockup/platform preview

CTA utama:

* “Cari kreator”
* “Daftar sebagai kreator”

CTA sekunder:

* “Lihat cara kerja”
* “Pelajari platform”

### Trust section

Karena escrow penuh belum aktif di MVP, trust perlu dibangun dari:

* tampilan rapi
* istilah sederhana
* alur yang jelas
* rating/review placeholder
* badge profil lengkap
* deskripsi proses kerja yang transparan

---

## 25.2 Halaman Cari Kreator

Ini adalah halaman paling penting setelah landing.

### Tujuan

* mengubah rasa penasaran menjadi eksplorasi
* membantu UMKM menemukan kandidat yang relevan
* meminimalkan kebingungan saat memilih

### Struktur

* header halaman
* search bar utama
* filter area
* summary hasil
* grid list kreator
* pagination / load more

### Filter prioritas

Hanya yang paling penting dulu:

* niche
* lokasi
* kisaran harga
* platform utama
* rating minimal

Jangan terlalu banyak filter di MVP, karena itu melanggar Hick’s Law dan membuat user bingung.

### Card kreator

Urutan informasi pada card:

1. foto / avatar
2. nama kreator
3. niche utama
4. lokasi
5. harga mulai
6. rating
7. ringkasan singkat
8. CTA

CTA:

* “Lihat profil”
* “Simpan”

### Microcopy yang cocok

* “Temukan kreator yang sesuai dengan kebutuhan promosimu”
* “Gunakan filter untuk mempersempit pilihan”
* “Harga mulai”
* “Cocok untuk”

---

## 25.3 Halaman Detail Kreator

Halaman ini harus berfungsi seperti gabungan profil profesional + etalase jasa.

### Fold atas

Harus langsung terlihat:

* nama kreator
* foto
* niche
* lokasi
* ringkasan profesional
* rating
* harga mulai
* CTA utama
* CTA favorit

### Section lanjutan

* tentang kreator
* platform yang dikuasai
* layanan aktif
* portofolio
* ulasan
* FAQ kecil
* CTA sticky

### CTA utama

* “Ajukan kerja sama”
* “Lihat layanan”
* “Simpan ke favorit”

### CTA sticky mobile

Di mobile, tombol utama sebaiknya tetap terlihat di bawah layar:

* simpan
* ajukan kerja sama

---

## 25.4 Halaman Detail Layanan

Layanan harus diperlakukan seperti produk jasa.

### Struktur

* breadcrumb
* nama layanan
* ringkasan singkat
* harga
* output
* estimasi pengerjaan
* revisi
* contoh konten
* deskripsi detail
* CTA
* profil singkat kreator

### Prinsip isi

* manfaat lebih utama daripada jargon
* hasil yang didapat harus sangat jelas
* visual contoh konten harus membantu keputusan

### Komponen penting

* price card
* checklist “yang kamu dapatkan”
* badge durasi
* badge revisi
* CTA besar

---

## 25.5 Auth Pages

Auth harus sangat sederhana dan tidak menakutkan.

### Login

* email
* kata sandi
* tombol masuk
* link daftar
* link lupa kata sandi

### Register

* nama
* email
* kata sandi
* konfirmasi kata sandi
* pilih peran: UMKM / kreator

### Pilih peran

Harus sangat visual:

* card UMKM
* card kreator

Masing-masing card menjelaskan secara singkat:

* untuk siapa
* apa manfaatnya

---

## 25.6 Onboarding UMKM

Onboarding UMKM tidak boleh terasa seperti isi formulir birokrasi.

### Struktur step

Step 1: identitas usaha
Step 2: kategori dan produk
Step 3: target promosi
Step 4: selesai

### Prinsip

* jumlah field sedikit
* setiap step punya 1 tujuan
* ada progress indicator
* ada contoh pengisian

---

## 25.7 Onboarding Kreator

Harus terasa seperti membangun “profil profesional”.

### Struktur step

Step 1: identitas kreator
Step 2: niche dan platform
Step 3: harga mulai
Step 4: upload awal portofolio

### Prinsip

* arahkan kreator untuk mengisi info yang paling membuat mereka layak dipilih
* jangan paksa input terlalu banyak di awal

---

## 25.8 Brief Form

Brief adalah fitur penting karena proposal menempatkannya sebagai inti kerja sama dan dasar monitoring proses. 

### Tujuan

* membantu UMKM menyampaikan kebutuhan dengan rapi
* memudahkan kreator memahami ekspektasi
* menjadi dasar status kerja sama berikutnya

### Struktur form

1. informasi usaha
2. produk/jasa yang dipromosikan
3. tujuan promosi
4. target audiens
5. budget
6. deadline
7. catatan tambahan

### AI helper

* button: “Bantu buat brief”
* AI output berupa draft editable
* user tetap bisa mengedit

### UX

* gunakan label sederhana
* sertakan placeholder contoh
* tampilkan progress
* beri rasa aman bahwa brief bisa diubah nanti

---

# 26. Detail Dashboard

## 26.1 Dashboard UMKM

Dashboard UMKM bukan tempat analytics rumit. Ini tempat melihat progres dan tindakan berikutnya.

### Komponen utama

* sapaan singkat
* status akun / profil usaha
* permintaan aktif
* favorit
* CTA “Cari kreator lagi”
* CTA “Buat brief baru”

### Empty state

Kalau belum ada data:

* jelaskan kondisi
* beri CTA jelas

Contoh:

* “Kamu belum mengirim permintaan kerja sama”
* “Mulai cari kreator yang sesuai dengan kebutuhan usahamu”

## 26.2 Dashboard Kreator

Dashboard kreator fokus pada visibilitas dan permintaan.

### Komponen utama

* status profil
* jumlah layanan aktif
* jumlah portofolio
* permintaan masuk
* CTA “Tambah layanan”
* CTA “Tambah portofolio”

### Empty state

* “Profilmu belum lengkap”
* “Tambahkan layanan agar UMKM lebih mudah memahami jasamu”

---

# 27. State, Empty State, Error State, dan Feedback

Front-end yang baik bukan hanya halaman normal. Harus ada state yang lengkap.

## 27.1 Loading State

Setiap halaman utama perlu skeleton:

* card listing
* detail kreator
* detail layanan
* dashboard

## 27.2 Empty State

Harus ada ilustrasi ringan + teks jelas + CTA.

Contoh:

* hasil pencarian kosong
* belum ada favorit
* belum ada layanan
* belum ada portofolio
* belum ada brief

## 27.3 Error State

Mengikuti prinsip gambar “before/after” yang kamu kirim: error message harus manusiawi, bukan teknis.

Jangan:

* “Bad request: multiple hotel results or no results”

Pakai:

* “Belum ada hasil yang cocok”
* “Coba ubah kata kunci atau filter”
* “Terjadi kendala saat memuat data. Coba lagi”

## 27.4 Success Feedback

* brief berhasil dikirim
* layanan berhasil ditambahkan
* profil berhasil diperbarui
* kreator berhasil disimpan ke favorit

Feedback ideal:

* toast singkat
* warna konsisten
* jangan terlalu ramai

---

# 28. Design System Dasar

## 28.1 Grid dan Layout

Gunakan sistem grid yang konsisten.

* public page: container terpusat
* dashboard: sidebar + content
* marketplace: responsive card grid

## 28.2 Spacing Scale

Gunakan skala tetap:

* 4
* 8
* 12
* 16
* 24
* 32
* 48
* 64

Jangan pakai spacing acak.

## 28.3 Border Radius

* button kecil: sedang
* card: medium-large
* modal: medium
* input: medium

Harus konsisten.

## 28.4 Shadow

Gunakan shadow ringan.
Jangan seperti template admin lama yang terlalu berat.

## 28.5 Color Roles

* primary
* primary hover
* secondary
* success
* warning
* danger
* info
* neutral background
* border
* muted text

## 28.6 Typography Tokens

Minimal tetapkan:

* display
* h1
* h2
* h3
* body-lg
* body
* body-sm
* caption

---

# 29. Mobile, Tablet, Desktop Strategy

## 29.1 Mobile-first untuk public page

Karena user Indonesia banyak datang dari HP:

* landing
* listing
* detail kreator
* auth
* brief

harus dirancang mobile-first.

## 29.2 Tablet-first consideration untuk dashboard ringan

Dashboard harus tetap enak dipakai pada layar menengah.

## 29.3 Desktop optimization untuk pengelolaan

Desktop menjadi penting untuk:

* edit layanan
* edit portofolio
* melihat data lebih banyak
* dashboard dua kolom atau lebih

## 29.4 Behavior rules

### Mobile

* filter pakai drawer/modal
* CTA sticky
* card satu kolom
* form full-width

### Tablet

* grid dua kolom
* sidebar bisa collapse
* filter bisa inline

### Desktop

* grid tiga atau empat kolom
* sidebar permanen di dashboard
* detail view lebih lega

---

# 30. Detail UX Writing Framework

## 30.1 Tone of Voice

* ramah
* profesional
* sederhana
* tidak terlalu formal
* tidak terlalu teknis
* Indonesia-first

## 30.2 Prinsip penulisan

* satu kalimat satu ide
* gunakan kata kerja aktif
* jelaskan manfaat
* hindari jargon

## 30.3 Label button

Gunakan label tindakan:

* cari
* simpan
* lanjutkan
* ajukan
* kirim
* tambah
* ubah
* lihat detail

Jangan label kabur seperti:

* proses
* submit
* execute
* confirm workflow

## 30.4 Helper text

Gunakan untuk membantu user awam.

Contoh:

* “Tulis produk utama yang ingin kamu promosikan”
* “Contoh: kue kering rumahan, kopi literan, atau jasa laundry”
* “Kisaran anggaran ini membantu kami menampilkan kreator yang lebih sesuai”

---

# 31. Front-End Clean Code and Efficiency Requirements

Karena kamu ingin efisiensi code dan clean code, PRD front-end juga harus menetapkan aturan implementasi, bukan hanya desain.

## 31.1 Prinsip umum

* komponen harus reusable
* satu file satu tanggung jawab utama
* hindari file raksasa yang mencampur semua hal
* hindari hardcode berulang
* pisahkan data statis, config, route, dan UI
* jangan bikin logika bisnis berat di komponen presentasional

## 31.2 Struktur komponen

Pisahkan minimal:

* layout components
* page components
* shared ui components
* feature-specific components

Contoh:

* `components/ui/Button.jsx`
* `components/ui/Badge.jsx`
* `components/common/EmptyState.jsx`
* `components/layout/Navbar.jsx`
* `pages/public/HomePage.jsx`

## 31.3 Naming

Gunakan nama yang jelas:

* `CreatorCard`
* `ServiceCard`
* `BriefForm`
* `DashboardSummary`
* `FavoriteButton`

Hindari nama seperti:

* `Card1`
* `DataBox`
* `CompNew`
* `TestSection`

## 31.4 Route organization

Gunakan route yang jelas dan konsisten:

* `/`
* `/cari-kreator`
* `/kreator/:slug`
* `/layanan/:slug`
* `/masuk`
* `/daftar`
* `/dashboard/umkm`
* `/dashboard/kreator`

## 31.5 State management

Gunakan state lokal untuk hal sederhana.
Gunakan store hanya untuk state lintas halaman seperti:

* auth user
* role user
* favorit
* theme/status global jika perlu

Jangan semua dimasukkan ke global store.

## 31.6 Data fetching

* letakkan logic fetch di service layer
* komponen page memanggil service
* komponen UI menerima props bersih

Jangan fetch data langsung di banyak child component jika tidak perlu.

## 31.7 Config driven UI

Hal-hal seperti:

* menu dashboard
* filter option
* category option
* FAQ item
* hero stat
* onboarding step

sebaiknya berbasis config/data file, bukan hardcode berulang di banyak tempat.

## 31.8 CSS strategy

Karena pakai Bootstrap + custom CSS:

* Bootstrap dipakai untuk grid, utility, dan base component
* custom CSS dipakai untuk identitas visual
* hindari campur style random di banyak file
* gunakan class naming yang konsisten

## 31.9 Performance

* lazy load page jika perlu
* gambar harus optimal
* komponen jangan rerender berlebihan
* hindari dependency berat yang tidak perlu

## 31.10 Maintainability

Setiap komponen harus mudah:

* dibaca
* diuji
* dipindah
* dipakai ulang
* diubah tanpa merusak banyak file

---

# 32. Front-End Component Inventory MVP

Daftar komponen yang sebaiknya disiapkan:

## Layout

* `Navbar`
* `Footer`
* `PublicLayout`
* `DashboardLayout`
* `Sidebar`
* `Topbar`

## Shared UI

* `Button`
* `Input`
* `Textarea`
* `Select`
* `Badge`
* `Chip`
* `Card`
* `Avatar`
* `RatingStars`
* `PriceTag`
* `SectionHeader`
* `EmptyState`
* `ErrorState`
* `LoadingSkeleton`
* `ToastAlert`
* `Modal`
* `Pagination`
* `Breadcrumb`

## Marketplace

* `SearchBar`
* `FilterPanel`
* `FilterDrawer`
* `CreatorCard`
* `ServiceCard`
* `PortfolioGrid`
* `ReviewList`

## Dashboard

* `DashboardStatCard`
* `DashboardSection`
* `ProfileCompletionCard`
* `RequestStatusList`
* `FavoriteList`
* `IncomingRequestCard`

## Forms

* `RoleSelector`
* `BusinessProfileForm`
* `CreatorProfileForm`
* `ServiceForm`
* `PortfolioForm`
* `BriefForm`
* `AiBriefHelper`

---

# 33. Prioritas Build Front-End per Gelombang

## Gelombang 1

* design system dasar
* navbar/footer
* landing page
* auth page
* route dasar

## Gelombang 2

* marketplace listing
* creator detail
* service detail
* favorite button
* filter/search basic

## Gelombang 3

* onboarding UMKM
* onboarding kreator
* brief form
* AI brief helper placeholder

## Gelombang 4

* dashboard UMKM
* dashboard kreator
* empty/error/loading states
* responsive polish

---

# 34. Risiko Front-End yang Harus Dihindari

1. terlalu banyak fitur di homepage
2. dashboard terlalu rumit untuk MVP
3. filter terlalu banyak
4. istilah terlalu teknis
5. card listing terlalu padat
6. form terlalu panjang
7. mobile experience dianggap belakangan
8. desain terlalu unik hingga tidak familier
9. file komponen terlalu besar
10. styling tidak konsisten
11. fetch logic berantakan di banyak tempat
12. komponen tidak reusable

---

# 35. Kriteria Selesai untuk Front-End MVP

Front-end MVP dianggap selesai jika:

* landing page sudah menjelaskan produk dengan jelas
* auth flow dasar berjalan
* user bisa browse kreator
* user bisa membuka detail kreator dan layanan
* user bisa mengisi dan mengirim brief
* user bisa menyimpan favorit
* dashboard dasar dua role sudah ada
* seluruh tampilan utama responsif
* empty/error/loading states sudah ada
* komponen inti reusable
* struktur code bersih dan mudah dikembangkan

---

# 36. Catatan Implementasi untuk Codex / AI Coding Assistant

Agar hasil kode tetap bersih:

* kerjakan satu domain per prompt
* jangan generate semua halaman sekaligus
* mulai dari layout dan komponen dasar
* tentukan naming convention dulu
* review output sebelum merge ke struktur utama
* hindari regenerasi total file jika hanya revisi kecil
* minta AI mengikuti design tokens dan route map yang sudah final
* pisahkan prompt untuk: layout, listing, detail, forms, dashboard

---


# 37. React Route Map Final

Route map ini disusun untuk menjaga front-end tetap rapi, mudah dipahami, dan scalable. Pemisahan route dibagi menjadi public, auth, UMKM, dan kreator agar struktur navigasi jelas sejak awal.

## 37.1 Public Routes

```text
/
 /tentang
 /cara-kerja
 /cari-kreator
 /kreator/:creatorSlug
 /layanan/:serviceSlug
 /bantuan
 /faq
```

## 37.2 Auth Routes

```text
/masuk
/daftar
/daftar/pilih-peran
/lupa-kata-sandi
```

## 37.3 UMKM Routes

```text
/dashboard/umkm
/dashboard/umkm/profil-usaha
/dashboard/umkm/favorit
/dashboard/umkm/permintaan
/dashboard/umkm/permintaan/:requestId
/dashboard/umkm/pengaturan
/dashboard/umkm/brief/baru
```

## 37.4 Kreator Routes

```text
/dashboard/kreator
/dashboard/kreator/profil
/dashboard/kreator/layanan
/dashboard/kreator/layanan/tambah
/dashboard/kreator/layanan/:serviceId/edit
/dashboard/kreator/portofolio
/dashboard/kreator/portofolio/tambah
/dashboard/kreator/portofolio/:portfolioId/edit
/dashboard/kreator/permintaan
/dashboard/kreator/permintaan/:requestId
/dashboard/kreator/pengaturan
```

## 37.5 Utility Routes

```text
/404
/maintenance
```

## 37.6 Routing Principles

* public routes harus bisa diakses tanpa login
* dashboard routes wajib protected
* redirect setelah login berdasarkan role
* route naming harus konsisten, Indonesia-first
* slug dipakai untuk halaman publik, id dipakai untuk halaman dashboard internal

---

# 38. Detail Halaman Satu per Satu

## 38.1 Home Page

### Tujuan

Menjelaskan produk, membangun trust, dan mengarahkan user ke dua aksi utama: mencari kreator atau mendaftar sebagai kreator.

### Struktur utama

* top navbar
* hero
* section value proposition
* section target user
* cara kerja
* preview kreator
* AI helper teaser
* trust section
* FAQ
* footer

### CTA utama

* cari kreator
* daftar sebagai kreator

### CTA sekunder

* pelajari cara kerja
* lihat contoh kreator

### Kriteria sukses

* user langsung paham fungsi platform
* user tidak bingung ini marketplace apa
* user tahu langkah berikutnya

---

## 38.2 Halaman Cari Kreator

### Tujuan

Membantu UMKM menemukan kreator secara cepat dan terarah.

### Komponen utama

* title + subtitle halaman
* search bar
* filter
* chips filter aktif
* summary jumlah hasil
* grid kreator
* pagination/load more

### Informasi wajib per card

* nama kreator
* foto
* niche
* lokasi
* harga mulai
* rating
* CTA lihat profil
* CTA simpan

### Kriteria sukses

* hasil listing mudah discan
* user bisa membandingkan pilihan cepat
* user tidak perlu klik banyak untuk paham siapa kreator itu

---

## 38.3 Halaman Detail Kreator

### Tujuan

Menyediakan profil profesional yang cukup kuat untuk meyakinkan UMKM.

### Struktur

* hero profil
* identitas dan ringkasan
* layanan aktif
* portofolio unggulan
* ulasan
* FAQ ringkas
* CTA sticky

### Informasi terpenting di fold atas

* nama
* niche
* lokasi
* harga mulai
* rating
* CTA ajukan kerja sama
* CTA favorit

### Kriteria sukses

* user bisa memutuskan lanjut atau tidak tanpa kebingungan
* portofolio dan jasa mudah dipahami

---

## 38.4 Halaman Detail Layanan

### Tujuan

Menjelaskan paket jasa seperti halaman produk jasa.

### Struktur

* breadcrumb
* judul layanan
* summary
* price card
* output layanan
* durasi
* revisi
* detail deskripsi
* contoh hasil
* CTA ajukan brief

### Kriteria sukses

* user langsung paham apa yang dibeli
* user tahu harga dan output tanpa scroll jauh

---

## 38.5 Halaman Login

### Tujuan

Memudahkan user masuk tanpa friction.

### Isi

* email
* password
* tombol masuk
* link daftar
* link lupa kata sandi

### Kriteria sukses

* form singkat
* error jelas
* tidak ada distraksi

---

## 38.6 Halaman Register

### Tujuan

Mengajak user mulai menggunakan platform.

### Isi

* nama
* email
* password
* konfirmasi password
* pilih role

### Kriteria sukses

* proses cepat
* role mudah dimengerti

---

## 38.7 Halaman Pilih Peran

### Tujuan

Membantu user memahami dua mode utama platform.

### Card UMKM

* “Saya ingin mencari kreator untuk promosi usaha”

### Card Kreator

* “Saya ingin menawarkan jasa promosi dan membangun profil profesional”

### Kriteria sukses

* user tidak salah masuk alur

---

## 38.8 Dashboard UMKM

### Tujuan

Menjadi pusat kontrol sederhana.

### Section

* ringkasan akun
* permintaan aktif
* favorit
* CTA cari kreator
* CTA buat brief

### Kriteria sukses

* user tahu apa yang harus dilakukan selanjutnya

---

## 38.9 Dashboard Kreator

### Tujuan

Menjadi pusat kontrol untuk mengelola profil dan jasa.

### Section

* status profil
* layanan aktif
* portofolio
* permintaan masuk
* CTA tambah layanan
* CTA tambah portofolio

### Kriteria sukses

* kreator terdorong melengkapi profil
* alur pengelolaan sederhana

---

## 38.10 Halaman Favorit

### Tujuan

Menyimpan kreator yang diminati UMKM.

### Isi

* list kreator tersimpan
* CTA lihat profil
* CTA hapus favorit

### Kriteria sukses

* user mudah kembali ke kreator yang sudah dipilih

---

## 38.11 Halaman Brief Baru

### Tujuan

Mengubah minat menjadi tindakan.

### Isi

* field kebutuhan promosi
* AI brief helper
* preview hasil
* submit

### Kriteria sukses

* user awam tetap bisa membuat brief

---

# 39. Komponen per Halaman

## 39.1 Home Page Components

* `Navbar`
* `HeroSection`
* `ValuePropsSection`
* `TargetAudienceSection`
* `HowItWorksSection`
* `FeaturedCreatorsSection`
* `AiTeaserSection`
* `TrustSection`
* `FaqSection`
* `Footer`

## 39.2 Marketplace Page Components

* `PageHeader`
* `SearchBar`
* `FilterPanel`
* `ActiveFilterChips`
* `ResultSummary`
* `CreatorGrid`
* `CreatorCard`
* `LoadMoreButton`
* `EmptyState`

## 39.3 Creator Detail Components

* `CreatorHero`
* `CreatorStats`
* `CreatorAbout`
* `ServiceList`
* `PortfolioGallery`
* `ReviewSection`
* `FavoriteButton`
* `StickyActionBar`

## 39.4 Service Detail Components

* `Breadcrumb`
* `ServiceHero`
* `PriceCard`
* `ServiceOutputList`
* `ServiceMetaBadges`
* `ServiceDescription`
* `RelatedPortfolio`
* `PrimaryActionPanel`

## 39.5 Auth Components

* `AuthLayout`
* `LoginForm`
* `RegisterForm`
* `RoleSelectionCard`
* `AuthSideIllustration`

## 39.6 Dashboard UMKM Components

* `DashboardHeader`
* `StatCard`
* `RequestList`
* `FavoritesPreview`
* `NextActionCard`
* `EmptyState`

## 39.7 Dashboard Kreator Components

* `ProfileCompletionCard`
* `ServicePreviewList`
* `PortfolioPreviewList`
* `IncomingRequestList`
* `QuickActionPanel`

## 39.8 Shared Components

* `Button`
* `IconButton`
* `Input`
* `Textarea`
* `Select`
* `Badge`
* `PriceTag`
* `RatingStars`
* `Avatar`
* `Card`
* `SectionTitle`
* `Toast`
* `Modal`
* `Skeleton`
* `ErrorState`
* `EmptyState`

---

# 40. Data Contract Front-End per Halaman

Tujuan data contract adalah supaya UI dan backend punya bahasa yang sama. Ini penting untuk clean code dan efisiensi integrasi.

## 40.1 Creator Card Contract

```js
{
  id: string,
  slug: string,
  name: string,
  avatarUrl: string | null,
  niche: string,
  city: string,
  priceFrom: number,
  ratingAvg: number,
  reviewCount: number,
  shortBio: string,
  isFavorite: boolean
}
```

## 40.2 Creator Detail Contract

```js
{
  id: string,
  slug: string,
  name: string,
  avatarUrl: string | null,
  bannerUrl: string | null,
  niche: string,
  city: string,
  platforms: string[],
  priceFrom: number,
  ratingAvg: number,
  reviewCount: number,
  shortBio: string,
  fullBio: string,
  services: ServiceSummary[],
  portfolioItems: PortfolioItem[],
  reviews: ReviewItem[]
}
```

## 40.3 Service Summary Contract

```js
{
  id: string,
  slug: string,
  title: string,
  shortDescription: string,
  price: number,
  deliveryDays: number,
  revisionCount: number
}
```

## 40.4 Service Detail Contract

```js
{
  id: string,
  slug: string,
  title: string,
  description: string,
  price: number,
  deliveryDays: number,
  revisionCount: number,
  outputs: string[],
  platforms: string[],
  examples: PortfolioItem[],
  creator: {
    id: string,
    slug: string,
    name: string,
    avatarUrl: string | null
  }
}
```

## 40.5 Portfolio Item Contract

```js
{
  id: string,
  title: string,
  thumbnailUrl: string,
  category: string,
  platform: string,
  caption: string
}
```

## 40.6 Review Item Contract

```js
{
  id: string,
  reviewerName: string,
  rating: number,
  comment: string,
  createdAt: string
}
```

## 40.7 Brief Form Contract

```js
{
  businessName: string,
  businessCategory: string,
  productName: string,
  promotionGoal: string,
  targetAudience: string,
  budgetRange: string,
  deadline: string,
  notes: string
}
```

## 40.8 Dashboard UMKM Contract

```js
{
  profile: {
    name: string,
    businessName: string,
    city: string
  },
  stats: {
    activeRequests: number,
    favoritesCount: number
  },
  recentRequests: RequestItem[],
  favoriteCreators: CreatorCard[]
}
```

## 40.9 Dashboard Kreator Contract

```js
{
  profile: {
    name: string,
    completionPercent: number
  },
  stats: {
    activeServices: number,
    portfolioCount: number,
    incomingRequests: number
  },
  latestRequests: RequestItem[],
  latestServices: ServiceSummary[]
}
```

## 40.10 Request Item Contract

```js
{
  id: string,
  title: string,
  status: "draft" | "submitted" | "reviewed" | "accepted" | "in_progress" | "done",
  createdAt: string,
  creatorName?: string,
  businessName?: string
}
```

---

# 41. Folder Structure Final Mengacu ke PRD

## 41.1 Front-End Final Structure

```text
client/src
├── assets
│   ├── images
│   ├── icons
│   └── illustrations
├── components
│   ├── common
│   ├── layout
│   ├── marketplace
│   ├── dashboard
│   ├── forms
│   └── ui
├── constants
│   ├── routes.js
│   ├── roles.js
│   ├── filters.js
│   └── labels.js
├── hooks
│   ├── useAuth.js
│   ├── useBreakpoint.js
│   └── useToast.js
├── layouts
│   ├── PublicLayout.jsx
│   ├── AuthLayout.jsx
│   └── DashboardLayout.jsx
├── lib
│   └── supabase.js
├── pages
│   ├── public
│   │   ├── HomePage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── HowItWorksPage.jsx
│   │   ├── CreatorListingPage.jsx
│   │   ├── CreatorDetailPage.jsx
│   │   ├── ServiceDetailPage.jsx
│   │   ├── HelpPage.jsx
│   │   └── FaqPage.jsx
│   ├── auth
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── RoleSelectPage.jsx
│   │   └── ForgotPasswordPage.jsx
│   ├── umkm
│   │   ├── UmkmDashboardPage.jsx
│   │   ├── UmkmProfilePage.jsx
│   │   ├── FavoritesPage.jsx
│   │   ├── RequestsPage.jsx
│   │   ├── RequestDetailPage.jsx
│   │   ├── NewBriefPage.jsx
│   │   └── SettingsPage.jsx
│   ├── creator
│   │   ├── CreatorDashboardPage.jsx
│   │   ├── CreatorProfilePage.jsx
│   │   ├── CreatorServicesPage.jsx
│   │   ├── CreatorAddServicePage.jsx
│   │   ├── CreatorEditServicePage.jsx
│   │   ├── CreatorPortfolioPage.jsx
│   │   ├── CreatorAddPortfolioPage.jsx
│   │   ├── CreatorEditPortfolioPage.jsx
│   │   ├── CreatorRequestsPage.jsx
│   │   ├── CreatorRequestDetailPage.jsx
│   │   └── CreatorSettingsPage.jsx
│   └── misc
│       ├── NotFoundPage.jsx
│       └── MaintenancePage.jsx
├── routes
│   ├── index.jsx
│   ├── publicRoutes.jsx
│   ├── authRoutes.jsx
│   ├── umkmRoutes.jsx
│   └── creatorRoutes.jsx
├── services
│   ├── authService.js
│   ├── creatorService.js
│   ├── serviceService.js
│   ├── portfolioService.js
│   ├── favoriteService.js
│   └── requestService.js
├── store
│   ├── authStore.js
│   ├── favoriteStore.js
│   └── uiStore.js
├── styles
│   ├── global.css
│   ├── tokens.css
│   ├── utilities.css
│   └── components.css
├── utils
│   ├── formatCurrency.js
│   ├── formatDate.js
│   ├── buildSlug.js
│   └── classNames.js
├── App.jsx
└── main.jsx
```

## 41.2 Struktur Principles

* `pages/` hanya orchestration
* `components/` untuk UI reusable
* `services/` untuk komunikasi data
* `store/` untuk state global minimum
* `constants/` untuk config statis
* `utils/` untuk helper murni
* `layouts/` untuk struktur besar halaman

---

# 42. HTML5 Requirements untuk Front-End

Karena kamu minta detail HTML5 juga, ini aturan dasarnya.

## 42.1 Semantic HTML wajib

Gunakan elemen semantik:

* `header`
* `nav`
* `main`
* `section`
* `article`
* `aside`
* `footer`
* `form`
* `label`
* `button`

Jangan semua pakai `div`.

## 42.2 Struktur halaman

Setiap halaman publik minimal:

```html
<header></header>
<main>
  <section></section>
</main>
<footer></footer>
```

Dashboard:

```html
<div class="dashboard-shell">
  <aside></aside>
  <main></main>
</div>
```

## 42.3 Forms

Semua form harus:

* punya `label`
* punya helper text
* punya error text
* punya `type` yang tepat
* gunakan `button type="submit"`

## 42.4 Accessibility HTML

* input wajib terhubung ke label
* gambar penting harus punya `alt`
* tombol ikon perlu `aria-label`
* modal perlu struktur yang benar

## 42.5 SEO structure untuk public page

* heading hierarchy benar
* hanya satu `h1` utama
* `h2` untuk section
* `meta title` dan `meta description` nanti diatur per page

---

# 43. CSS3 + Bootstrap Strategy

## 43.1 Prinsip umum

Bootstrap dipakai untuk:

* grid
* spacing utilities
* responsive utilities
* base form/button/card

Custom CSS dipakai untuk:

* brand identity
* component styling khusus
* visual refinement
* design tokens

## 43.2 Jangan full mengandalkan Bootstrap class random

Gunakan Bootstrap sebagai fondasi, bukan sebagai tempat semua styling dicampur langsung di JSX tanpa pola.

Contoh salah:

* class terlalu panjang
* style jadi tidak konsisten
* susah di-maintain

Contoh benar:

* bootstrap untuk layout
* custom class untuk component identity

## 43.3 CSS Token Structure

Di `tokens.css` tetapkan:

```css
:root {
  --ruk-color-primary: #0f8b8d;
  --ruk-color-primary-hover: #0b6d6f;
  --ruk-color-secondary: #1f2937;
  --ruk-color-bg: #f8fafc;
  --ruk-color-surface: #ffffff;
  --ruk-color-border: #e5e7eb;
  --ruk-color-text: #111827;
  --ruk-color-text-muted: #6b7280;
  --ruk-color-success: #16a34a;
  --ruk-color-warning: #f59e0b;
  --ruk-color-danger: #dc2626;

  --ruk-radius-sm: 8px;
  --ruk-radius-md: 12px;
  --ruk-radius-lg: 16px;

  --ruk-shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.06);
  --ruk-shadow-md: 0 8px 24px rgba(0, 0, 0, 0.08);

  --ruk-space-1: 4px;
  --ruk-space-2: 8px;
  --ruk-space-3: 12px;
  --ruk-space-4: 16px;
  --ruk-space-5: 24px;
  --ruk-space-6: 32px;
  --ruk-space-7: 48px;
  --ruk-space-8: 64px;
}
```

## 43.4 Typography CSS

```css
:root {
  --ruk-font-family-base: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --ruk-font-size-display: 48px;
  --ruk-font-size-h1: 36px;
  --ruk-font-size-h2: 28px;
  --ruk-font-size-h3: 22px;
  --ruk-font-size-body-lg: 18px;
  --ruk-font-size-body: 16px;
  --ruk-font-size-body-sm: 14px;
  --ruk-font-size-caption: 12px;
}
```

## 43.5 Bootstrap grid rules

* landing section: `container` atau `container-xl`
* marketplace cards: `row` + responsive cols
* dashboard: sidebar + content dengan grid kustom

## 43.6 Responsive breakpoints

Gunakan breakpoint Bootstrap standar:

* xs
* sm
* md
* lg
* xl
* xxl

Prioritas:

* mobile default
* md untuk tablet
* lg ke atas untuk desktop

## 43.7 Custom CSS layering

* `global.css` untuk reset ringan dan base
* `tokens.css` untuk design system
* `utilities.css` untuk helper classes
* `components.css` untuk class reusable

---

# 44. JavaScript / React Logic Requirements

## 44.1 Prinsip JS “gacor” tapi tetap bersih

“JS gacor” di sini artinya:

* cepat dibangun
* enak di-debug
* tidak ribet
* responsif
* tetap clean

Bukan berarti:

* semua logika ditumpuk di satu file
* banyak state liar
* semua hardcoded

## 44.2 Logika halaman

Page component harus fokus pada:

* memanggil data
* menyusun section
* menghubungkan component

Jangan taruh formatting, filtering, atau helper berat langsung di render JSX.

## 44.3 Utility functions

Buat helper terpisah:

* format currency
* truncate text
* build query params
* parse filter
* normalize API response

## 44.4 Store usage

Gunakan Zustand hanya untuk state global yang benar-benar global:

* auth session
* auth role
* toast
* favorit ringan jika perlu
* UI drawer/modal global jika perlu

## 44.5 Local state usage

Tetap gunakan `useState` dan `useEffect` untuk:

* form
* loading page
* filter sementara
* modal state lokal

## 44.6 Service layer

Contoh:

* `creatorService.getCreators()`
* `creatorService.getCreatorBySlug(slug)`
* `serviceService.getServiceBySlug(slug)`
* `favoriteService.toggleFavorite(id)`

Jangan panggil Supabase langsung di banyak page jika bisa dipusatkan.

## 44.7 Error handling

Setiap request harus punya:

* loading
* success
* empty
* error

Minimal pattern:

```js
const [loading, setLoading] = useState(true)
const [error, setError] = useState("")
const [data, setData] = useState(null)
```

## 44.8 Form handling

Untuk MVP, form bisa pakai React state biasa dulu. Tidak harus library berat.
Kalau nanti makin kompleks, baru pertimbangkan React Hook Form.

## 44.9 Query string handling

Halaman listing harus siap mendukung:

* search keyword
* niche
* lokasi
* harga
* rating

Gunakan helper query param supaya URL tetap shareable.

## 44.10 Lazy loading

Gunakan lazy loading untuk route dashboard dan page besar bila perlu.

---

# 45. Efisiensi Code dan Clean Code Rules

## 45.1 Rule 1 — Satu komponen satu tujuan

Jangan buat satu file menangani:

* layout
* fetching
* filter
* modal
* list item
* form
  semua sekaligus.

## 45.2 Rule 2 — Hindari duplikasi

Kalau ada card kreator di 3 halaman, buat satu komponen reusable.

## 45.3 Rule 3 — Props jelas

Gunakan props yang mudah dipahami:

```js
<CreatorCard creator={creator} onSave={handleSave} />
```

bukan props acak banyak tanpa pola.

## 45.4 Rule 4 — Pisahkan presentational dan container logic

Komponen UI idealnya menerima data bersih.

## 45.5 Rule 5 — Jangan over-engineer

Untuk MVP:

* tidak perlu abstraction berlebihan
* tidak perlu pattern terlalu kompleks
* cukup modular, jelas, dan reusable

## 45.6 Rule 6 — Hindari dependency tidak perlu

Semakin sedikit dependency, semakin ringan project.

## 45.7 Rule 7 — Naming konsisten

* `Page`
* `Section`
* `Card`
* `Form`
* `List`
* `Layout`

Gunakan suffix supaya langsung terbaca fungsinya.

## 45.8 Rule 8 — Constants jangan dihardcode berulang

Contoh:

* menu dashboard
* label role
* filter options
* FAQ items
* onboarding steps

letakkan di `constants/`.

## 45.9 Rule 9 — Styling konsisten

Jangan campur:

* inline style berlebihan
* class Bootstrap acak
* CSS custom tidak terstruktur

## 45.10 Rule 10 — Mudah dibaca AI coding assistant

Karena kamu akan banyak pakai Codex, struktur harus:

* tegas
* modular
* predictable
* naming jelas

AI jauh lebih bagus hasilnya kalau struktur project rapi.

---

# 46. Front-End Build Sequence yang Sangat Disarankan

Urutan implementasi supaya efisien:

## Phase A

* tokens
* global styles
* layout dasar
* navbar/footer
* route map
* shared UI components

## Phase B

* home page
* auth pages
* role selection
* marketplace listing

## Phase C

* creator detail
* service detail
* favorite interaction
* empty/loading/error states

## Phase D

* onboarding UMKM
* onboarding kreator
* brief form
* AI helper placeholder

## Phase E

* dashboard UMKM
* dashboard kreator
* settings dasar

## Phase F

* responsive polish
* performance cleanup
* accessibility sweep
* clean code refactor

---

# 47. Definition of Done Tambahan untuk Front-End

Sebuah halaman dianggap selesai jika:

* UI sesuai design system
* mobile, tablet, desktop aman
* loading state ada
* empty state ada
* error state ada
* CTA jelas
* copy sudah sederhana
* komponen reusable
* tidak ada hardcode liar yang berulang
* route sudah terhubung benar

---

# 48. Catatan Akhir Implementasi Front-End

Front-end Ruang Usaha Kita harus dibangun sebagai marketplace jasa yang:

* familier seperti e-commerce umum
* profesional seperti platform freelance
* sederhana untuk user awam
* cukup rapi untuk berkembang menjadi produk serius

Proposal menegaskan kebutuhan utama berupa pencarian kreator, brief, dashboard, rekomendasi AI, keamanan proses, dan wadah profesional untuk kedua pihak. Karena itu, front-end harus memprioritaskan kejelasan alur, kemudahan browsing, kepercayaan visual, dan struktur informasi yang kuat sebelum menambah fitur kompleks.

---


# 49. React Component Tree Final

```text
App
└── BrowserRouter
    ├── PublicLayout
    │   ├── Navbar
    │   ├── HomePage
    │   │   ├── HeroSection
    │   │   ├── ValuePropsSection
    │   │   ├── TargetAudienceSection
    │   │   ├── HowItWorksSection
    │   │   ├── FeaturedCreatorsSection
    │   │   ├── AiTeaserSection
    │   │   ├── TrustSection
    │   │   └── FaqSection
    │   ├── CreatorListingPage
    │   │   ├── SearchBar
    │   │   ├── FilterPanel / FilterDrawer
    │   │   ├── ActiveFilterChips
    │   │   ├── ResultSummary
    │   │   └── CreatorGrid
    │   │       └── CreatorCard
    │   ├── CreatorDetailPage
    │   │   ├── CreatorHero
    │   │   ├── CreatorAbout
    │   │   ├── ServiceList
    │   │   │   └── ServiceCard
    │   │   ├── PortfolioGallery
    │   │   ├── ReviewSection
    │   │   └── StickyActionBar
    │   ├── ServiceDetailPage
    │   │   ├── Breadcrumb
    │   │   ├── ServiceHero
    │   │   ├── PriceCard
    │   │   ├── ServiceOutputList
    │   │   ├── ServiceDescription
    │   │   └── PrimaryActionPanel
    │   ├── AboutPage / HowItWorksPage / HelpPage / FaqPage
    │   └── Footer
    ├── AuthLayout
    │   ├── LoginPage
    │   │   └── LoginForm
    │   ├── RegisterPage
    │   │   └── RegisterForm
    │   └── RoleSelectPage
    │       └── RoleSelectionCard[]
    └── DashboardLayout
        ├── Sidebar
        ├── Topbar
        ├── UmkmDashboardPage
        │   ├── DashboardHeader
        │   ├── StatCard[]
        │   ├── RequestList
        │   ├── FavoritesPreview
        │   └── NextActionCard
        ├── FavoritesPage
        ├── RequestsPage
        ├── NewBriefPage
        │   ├── BriefForm
        │   └── AiBriefHelper
        ├── CreatorDashboardPage
        │   ├── ProfileCompletionCard
        │   ├── ServicePreviewList
        │   ├── PortfolioPreviewList
        │   └── IncomingRequestList
        ├── CreatorServicesPage
        ├── CreatorPortfolioPage
        └── SettingsPage
```

---

# 50. Exact Page Sections per Screen

## Home

* navbar
* hero
* manfaat utama
* untuk UMKM / untuk kreator
* cara kerja
* preview kreator
* AI helper teaser
* trust / alasan platform aman
* FAQ
* footer

## Cari Kreator

* title + subtitle
* search
* filter
* hasil aktif
* grid kreator
* load more / pagination
* empty state

## Detail Kreator

* identitas utama
* CTA utama
* tentang
* layanan
* portofolio
* ulasan
* CTA bawah / sticky mobile

## Detail Layanan

* breadcrumb
* judul + ringkasan
* harga + output + durasi + revisi
* deskripsi
* contoh hasil
* profil singkat kreator
* CTA ajukan kerja sama

## Login/Register

* header singkat
* form
* helper text
* CTA
* link pindah auth

## Dashboard UMKM

* ringkasan
* permintaan aktif
* favorit
* CTA cari kreator
* CTA buat brief

## Dashboard Kreator

* status profil
* layanan aktif
* portofolio
* permintaan masuk
* CTA tambah layanan / portofolio

## Brief Baru

* informasi usaha
* produk
* tujuan promosi
* target audiens
* budget
* deadline
* catatan
* AI helper
* submit

---

# 51. Mobile-First Wireframe Text Blueprint

## Mobile Home

* sticky navbar sederhana
* hero pendek
* 2 CTA
* 3 manfaat utama
* cara kerja 3 langkah
* horizontal preview kreator
* FAQ accordion
* footer ringkas

## Mobile Listing

* search bar full width
* tombol filter
* chip filter aktif
* card satu kolom
* CTA jelas per card
* load more

## Mobile Detail Kreator

* avatar + nama + niche + lokasi
* rating + harga mulai
* tombol favorit
* tombol ajukan kerja sama sticky
* tab/section ringkas: layanan, portofolio, ulasan

## Mobile Detail Layanan

* judul
* harga
* output
* durasi
* revisi
* deskripsi
* CTA sticky bawah

## Mobile Dashboard

* tanpa sidebar permanen
* topbar
* section vertikal
* stat card pendek
* list sederhana
* CTA menonjol

## Tablet

* grid 2 kolom
* sidebar dashboard bisa collapse
* filter bisa semi-inline

## Desktop

* listing 3–4 kolom
* dashboard sidebar kiri
* detail page dua kolom
* CTA panel tetap terlihat

---

# 52. Prompt Codex per Halaman

## A. Base setup

“Buat struktur routing React front-end Ruang Usaha Kita sesuai PRD. Gunakan React Router, Bootstrap 5, clean code, reusable layout, dan folder structure yang sudah ditetapkan. Jangan buat fitur backend dulu. Fokus public routes, auth routes, dan dashboard routes.”

## B. Home page

“Buat HomePage React untuk Ruang Usaha Kita dengan gaya profesional, bersih, familier seperti marketplace Indonesia. Gunakan section: hero, manfaat utama, untuk UMKM/kreator, cara kerja, preview kreator, AI helper teaser, trust section, FAQ, footer. Responsive mobile-first. Gunakan Bootstrap + custom CSS bersih.”

## C. Creator listing

“Buat halaman Cari Kreator untuk Ruang Usaha Kita. Harus ada search bar, filter drawer/panel, chip filter aktif, result summary, creator grid, creator card reusable, load more, empty state, loading state. UI harus mudah discan user awam.”

## D. Creator detail

“Buat halaman Detail Kreator React. Section: identitas utama, CTA, tentang, layanan, portofolio, ulasan, sticky action bar di mobile. Fokus trust, clarity, dan CTA ajukan kerja sama.”

## E. Service detail

“Buat halaman Detail Layanan seperti halaman produk jasa marketplace. Tampilkan judul, ringkasan, harga, output, durasi, revisi, deskripsi, contoh hasil, profil singkat kreator, CTA utama. Gunakan hierarchy informasi yang kuat.”

## F. Auth

“Buat LoginPage, RegisterPage, dan RoleSelectPage untuk Ruang Usaha Kita. Form sederhana, UX writing bahasa Indonesia, validasi basic, tampilan profesional dan ramah user awam.”

## G. Brief form

“Buat halaman Brief Baru untuk UMKM. Gunakan step ringan atau form section yang jelas. Field: nama usaha, produk, tujuan promosi, target audiens, budget, deadline, catatan. Tambahkan komponen AI brief helper placeholder.”

## H. Dashboard UMKM

“Buat dashboard UMKM sederhana dan clean. Section: ringkasan akun, permintaan aktif, favorit, CTA cari kreator, CTA buat brief. Mobile-first dan tidak terlalu ramai.”

## I. Dashboard Kreator

“Buat dashboard kreator sederhana dan clean. Section: status profil, layanan aktif, portofolio, permintaan masuk, quick actions. UI harus terasa profesional seperti panel pengelolaan jasa.”

## J. Shared UI

“Buat shared UI components reusable untuk Ruang Usaha Kita: Button, Input, Select, Textarea, Card, Badge, PriceTag, RatingStars, EmptyState, ErrorState, LoadingSkeleton, Modal, Toast. Gunakan clean code dan Bootstrap-friendly styling.”

---

# 53. Final Locked Front-End Decisions

* Front-end MVP hanya fokus fitur utama.
* Pola UI harus familier seperti marketplace/e-commerce yang sudah dikenal.
* Homepage harus cepat menjelaskan fungsi produk.
* Discovery kreator adalah pusat pengalaman public.
* Detail kreator dan layanan adalah halaman keputusan.
* Brief adalah jembatan utama dari minat ke kerja sama.
* Dashboard harus fungsional, bukan dekoratif.
* Mobile-first untuk public pages, desktop-friendly untuk dashboard.
* UX writing wajib sederhana, Indonesia-first.
* Bootstrap dipakai sebagai fondasi layout dan utilitas, custom CSS untuk identitas visual.
* React component harus reusable, modular, dan mudah dibaca AI coding assistant.
* Jangan over-engineer di MVP.
* Semua halaman wajib punya loading, empty, dan error state.

---

# 54. Final Checklist Sebelum Build Front-End

* route map final sudah disetujui
* daftar halaman final sudah disetujui
* component inventory final sudah disetujui
* design tokens dasar sudah dikunci
* UX writing style sudah dikunci
* naming convention sudah dikunci
* folder structure final sudah dikunci
* build sequence sudah dikunci

---

# 55. Penutup Teknis Singkat

Front-end Ruang Usaha Kita harus dibangun sebagai **marketplace jasa promosi digital yang sederhana, profesional, dan familier**. Akar utamanya bukan fitur sebanyak mungkin, melainkan **clarity, trust, discovery, dan structured collaboration**. Itu yang paling sesuai dengan masalah dalam proposal: UMKM kesulitan promosi digital, pencarian kreator masih manual, tarif dan portofolio tidak transparan, brief sering tidak jelas, dan belum ada wadah profesional yang rapi.



### Kesimpulan PRD

Front-end Ruang Usaha Kita harus menjadi wajah utama platform yang mampu menerjemahkan tujuan proposal ke bentuk yang mudah dipakai: membantu UMKM menemukan kreator dengan lebih cepat, memberi ruang profesional bagi kreator, dan menyediakan alur kerja sama yang lebih rapi, transparan, dan terasa aman. Proposal dengan jelas menekankan kebutuhan akan pencarian kreator berbasis kategori, pengelolaan brief, monitoring progres, dashboard, AI recommendation, auto-brief, dan skema transaksi aman; semua itu menjadi fondasi prioritas desain front-end, dengan implementasi dimulai dari fitur utama yang paling berdampak terlebih dahulu.

