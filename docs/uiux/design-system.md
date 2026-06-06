# Ruang Usaha Kita — Design System dan UI/UX Direction

## 1. Tujuan Dokumen

Dokumen ini menjelaskan arah desain visual Ruang Usaha Kita. Dokumen ini menjadi pedoman sebelum proses coding UI dimulai agar tampilan website konsisten, elegan, dan sesuai dengan identitas brand.

Desain Ruang Usaha Kita menggunakan pendekatan Apple-like: bersih, minimal, elegan, banyak ruang kosong, tipografi kuat, visual premium, dan fokus pada pengalaman pengguna. Namun, website ini tidak meniru Apple.com secara langsung. Referensi Apple digunakan sebagai inspirasi struktur visual, bukan sebagai hasil tiruan.

## 2. Karakter Brand

Ruang Usaha Kita ingin tampil sebagai platform yang:

* profesional
* terpercaya
* modern
* bersih
* mudah dipahami UMKM
* ramah untuk kreator
* tidak terlalu korporat
* tidak terlalu ramai
* tidak terlalu futuristik
* terasa premium tetapi tetap membumi

Brand harus memberi kesan bahwa platform ini aman digunakan untuk kerja sama promosi digital antara UMKM dan kreator.

## 3. Referensi Visual

Referensi utama adalah Apple.com dan prinsip Apple Human Interface Guidelines.

Arah yang diambil:

1. Hero section besar dan fokus.
2. Headline singkat, tajam, dan dominan.
3. Banyak whitespace.
4. Warna tidak terlalu ramai.
5. Navigasi sederhana.
6. Card halus dengan border tipis.
7. Grid rapi.
8. Section terasa lega.
9. Tipografi menjadi elemen utama.
10. Animasi jika ada harus halus dan tidak berlebihan.

Yang tidak diambil:

* gaya promosi produk Apple secara literal
* visual device mockup Apple
* gradient terlalu kompleks
* efek glass berlebihan
* copywriting terlalu dramatis
* layout yang terlalu kosong sampai informasi bisnis hilang

## 4. Warna Brand

Warna dasar brand:

* #167163
* #114955
* #0C2949
* #0C2949

Warna tersebut berada di spektrum hijau kebiruan dan biru gelap. Karakter warnanya cocok untuk platform digital yang ingin terlihat tenang, aman, dan profesional.

Karena warna dasar cukup gelap, perlu diturunkan menjadi sistem warna yang lebih fleksibel.

## 5. Color Tokens

### 5.1 Primary Navy

Digunakan untuk teks utama, heading, navbar gelap, footer, dan elemen brand yang membutuhkan kesan kuat.

```css
--brand-navy-950: #0C2949;
--brand-navy-900: #0F345C;
--brand-navy-800: #143F6D;
--brand-navy-700: #1B4F85;
```

Penggunaan:

* heading utama
* logo text
* footer background
* primary text pada hero
* dashboard sidebar jika memakai mode gelap
* tombol utama versi dark

### 5.2 Deep Teal

Digunakan sebagai warna transisi antara navy dan hijau.

```css
--brand-teal-900: #114955;
--brand-teal-800: #135A62;
--brand-teal-700: #146A6B;
```

Penggunaan:

* badge
* highlight kategori
* icon accent
* card selected
* border aktif

### 5.3 Fresh Teal

Warna ini lebih terang dan lebih hidup. Cocok sebagai aksen.

```css
--brand-teal-600: #167163;
--brand-teal-500: #1C8A79;
--brand-teal-400: #38A99A;
```

Penggunaan:

* CTA sekunder
* hover state
* progress aktif
* success indicator
* grafik dashboard
* icon kecil

### 5.4 Neutral Light

Untuk background utama dan section.

```css
--white: #FFFFFF;
--surface: #F7F9FA;
--surface-soft: #F3F6F7;
--surface-muted: #EEF3F4;
```

Penggunaan:

* body background
* card background
* section background
* dashboard content background

### 5.5 Neutral Dark

Untuk teks.

```css
--ink-950: #06111F;
--ink-900: #0A1628;
--ink-800: #111827;
--ink-700: #1F2937;
--ink-600: #4B5563;
--ink-500: #6B7280;
```

Penggunaan:

* body text
* secondary text
* placeholder
* table text
* metadata

### 5.6 Border

```css
--border-soft: #E5EAF0;
--border-muted: #D8E0E8;
```

Penggunaan:

* card border
* input border
* table divider
* section divider
* dashboard panels

### 5.7 Semantic Colors

Semantic color tetap diperlukan, tetapi harus lebih lembut agar tidak merusak visual Apple-like.

```css
--success: #167163;
--warning: #B7791F;
--danger: #B42318;
--info: #0C4A6E;
```

Penggunaan:

* status order
* payment status
* alert
* dashboard badge

## 6. Prinsip Penggunaan Warna

1. Gunakan warna putih dan off-white sebagai warna dominan.
2. Gunakan navy gelap untuk teks utama dan identitas brand.
3. Gunakan teal sebagai aksen, bukan warna yang memenuhi seluruh halaman.
4. Jangan memakai terlalu banyak warna dalam satu section.
5. Jangan membuat semua card berwarna.
6. Hindari gradient ramai.
7. Jika memakai gradient, gunakan sangat halus.
8. Pastikan kontras teks tetap tinggi.
9. Jangan gunakan warna yang sama untuk status yang berbeda.
10. Gunakan warna status hanya saat memang perlu.

## 7. Typography

Font global menggunakan Inter family.

Alasan:

* modern
* netral
* mudah dibaca
* cocok untuk dashboard
* cocok untuk marketplace
* cocok dengan desain minimal Apple-like
* tersedia luas di web

## 8. Typography Personality

Karakter tipografi yang diinginkan:

* tegas
* bersih
* modern
* sedikit rapat
* tidak terlalu renggang
* tidak terlalu tinggi line-height
* tetap nyaman dibaca

Karena user meminta jarak antar karakter agak mepet dan line spacing juga agak mepet, maka tracking dan line-height dibuat lebih compact daripada default, tetapi tidak sampai mengganggu keterbacaan.

## 9. Typography Scale

### 9.1 Display

Untuk hero headline.

```css
font-size: clamp(3rem, 7vw, 6.5rem);
line-height: 0.95;
letter-spacing: -0.06em;
font-weight: 700;
```

Penggunaan:

* hero headline homepage
* headline campaign besar

Contoh:

Temukan Kreator yang Tepat untuk Promosi UMKM Anda

### 9.2 Heading 1

```css
font-size: clamp(2.5rem, 5vw, 4.5rem);
line-height: 1;
letter-spacing: -0.05em;
font-weight: 700;
```

Penggunaan:

* judul halaman utama
* judul section besar

### 9.3 Heading 2

```css
font-size: clamp(2rem, 4vw, 3.25rem);
line-height: 1.05;
letter-spacing: -0.045em;
font-weight: 650;
```

Penggunaan:

* judul section
* landing page section

### 9.4 Heading 3

```css
font-size: 1.5rem;
line-height: 1.15;
letter-spacing: -0.035em;
font-weight: 650;
```

Penggunaan:

* card title
* dashboard panel title
* detail service title

### 9.5 Body Large

```css
font-size: 1.125rem;
line-height: 1.45;
letter-spacing: -0.018em;
font-weight: 400;
```

Penggunaan:

* hero description
* section intro

### 9.6 Body

```css
font-size: 1rem;
line-height: 1.45;
letter-spacing: -0.012em;
font-weight: 400;
```

Penggunaan:

* paragraf umum
* isi card
* form label tambahan

### 9.7 Small

```css
font-size: 0.875rem;
line-height: 1.35;
letter-spacing: -0.006em;
font-weight: 400;
```

Penggunaan:

* metadata
* helper text
* badge
* table secondary text

### 9.8 Caption

```css
font-size: 0.75rem;
line-height: 1.3;
letter-spacing: 0;
font-weight: 500;
```

Penggunaan:

* label kecil
* status
* microcopy

## 10. Typography Rules

1. Heading harus singkat dan kuat.
2. Hindari paragraf panjang di hero.
3. Gunakan maksimal dua level heading dalam satu section.
4. Jangan terlalu banyak font weight.
5. Gunakan weight 700 untuk hero.
6. Gunakan weight 650 atau 600 untuk section heading.
7. Gunakan weight 400 atau 450 untuk body.
8. Gunakan letter spacing negatif untuk heading besar.
9. Jangan pakai teks kapital semua kecuali badge kecil.
10. Line-height boleh compact, tetapi paragraf panjang harus tetap nyaman dibaca.

## 11. Layout System

Desain menggunakan layout berbasis container.

### 11.1 Container

```css
max-width: 1280px;
padding-left: clamp(1rem, 4vw, 4rem);
padding-right: clamp(1rem, 4vw, 4rem);
```

Penggunaan:

* section homepage
* katalog
* dashboard content wrapper
* detail layanan

### 11.2 Section Spacing

```css
padding-top: 96px;
padding-bottom: 96px;
```

Untuk section besar.

```css
padding-top: 64px;
padding-bottom: 64px;
```

Untuk section sedang.

```css
padding-top: 32px;
padding-bottom: 32px;
```

Untuk section kecil.

### 11.3 Grid

Grid utama:

* desktop: 12 column
* tablet: 6 column
* mobile: 1-2 column

Card katalog:

* desktop: 3 atau 4 kolom
* tablet: 2 kolom
* mobile: 1 kolom

Dashboard:

* sidebar fixed desktop
* content fluid
* cards 3 atau 4 kolom
* table full width

## 12. Spacing Scale

Gunakan spacing scale konsisten.

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

Prinsip:

* card internal padding minimal 24px
* section gap minimal 48px
* hero gap besar
* dashboard lebih padat daripada landing page
* katalog harus tetap lega agar tidak terasa seperti marketplace murah

## 13. Border Radius

Gunakan radius lembut, bukan terlalu bulat.

```css
--radius-sm: 10px;
--radius-md: 16px;
--radius-lg: 24px;
--radius-xl: 32px;
--radius-full: 999px;
```

Penggunaan:

* button: 999px atau 14px
* card: 24px
* input: 14px
* modal: 28px
* image thumbnail: 20px

## 14. Shadow

Shadow harus sangat halus.

```css
--shadow-soft: 0 18px 60px rgba(12, 41, 73, 0.08);
--shadow-card: 0 10px 30px rgba(12, 41, 73, 0.06);
--shadow-hover: 0 20px 50px rgba(12, 41, 73, 0.12);
```

Prinsip:

* default card lebih baik pakai border daripada shadow tebal
* shadow muncul saat hover atau highlight
* jangan gunakan shadow hitam pekat
* jangan pakai glow berlebihan

## 15. Component Style

### 15.1 Button

Primary button:

* background navy
* text white
* rounded-full atau rounded-xl
* padding horizontal luas
* height 44-48px
* hover sedikit lebih terang

Secondary button:

* background white
* border soft
* text navy
* hover surface

Ghost button:

* transparan
* text muted
* hover background soft

CTA utama:

“Cari Kreator”

CTA sekunder:

“Lihat Cara Kerja”

### 15.2 Card

Card harus terasa clean dan premium.

Style:

* background white
* border 1px soft
* radius 24px
* padding 24px
* shadow sangat halus atau tanpa shadow
* hover naik sedikit jika interaktif

Jenis card:

* creator card
* service card
* package card
* metric card
* order card
* dashboard panel

### 15.3 Input

Input harus sederhana.

Style:

* border soft
* radius 14px
* height 44-48px
* focus ring teal
* placeholder muted

### 15.4 Badge

Badge untuk status dan kategori.

Style:

* radius full
* padding kecil
* font small
* warna soft
* jangan terlalu mencolok

### 15.5 Navbar

Navbar Apple-like:

* sticky top
* tinggi 64px
* background white/80
* backdrop blur
* border bottom tipis
* logo kiri
* nav tengah atau kiri
* action kanan
* text kecil dan rapi

Menu public:

* Beranda
* Katalog Kreator
* Cara Kerja
* Bantuan

Action:

* Masuk
* Daftar

### 15.6 Footer

Footer:

* background putih atau navy sangat gelap
* informasi singkat
* link penting
* tidak terlalu ramai
* copyright

## 16. Page Direction

### 16.1 Homepage

Homepage harus menjadi halaman paling premium.

Struktur:

1. Navbar
2. Hero
3. Search entry
4. Trust/stat cards
5. Kategori layanan
6. Kreator unggulan
7. Cara kerja
8. Manfaat UMKM
9. CTA akhir
10. Footer

Hero harus fokus pada pesan:

“Temukan Kreator yang Tepat untuk Promosi UMKM Anda”

Deskripsi:

“Ruang Usaha Kita membantu UMKM mencari content creator, membuat brief promosi, dan memantau proses pembuatan konten secara lebih mudah dan terarah.”

### 16.2 Katalog Kreator

Katalog harus terasa seperti marketplace modern, tetapi tidak murah.

Struktur:

* page title
* search bar besar
* filter sidebar
* creator grid
* sort
* card rapi

Kartu kreator menampilkan:

* avatar/foto
* nama
* niche
* layanan utama
* rating
* proyek selesai
* harga mulai
* estimasi pengerjaan
* tombol lihat detail

### 16.3 Detail Kreator

Detail kreator harus membangun trust.

Struktur:

* profile header
* rating
* bio
* portofolio
* paket jasa
* review
* CTA

### 16.4 Detail Layanan

Detail layanan harus menjawab keraguan UMKM.

Isi:

* layanan apa
* output apa
* harga berapa
* cocok untuk siapa
* estimasi pengerjaan
* revisi berapa kali
* contoh hasil
* tombol tambah ke keranjang

### 16.5 Checkout

Checkout harus jelas dan tidak membuat UMKM bingung.

Gunakan stepper:

1. Detail Pesanan
2. Brief Campaign
3. Pembayaran

Brief campaign menjadi pembeda utama dari e-commerce barang fisik.

### 16.6 Dashboard

Dashboard harus lebih fungsional, bukan terlalu artistik.

UMKM dashboard:

* pesanan aktif
* pesanan selesai
* brief tersimpan
* hasil konten
* invoice
* rekomendasi kreator

Creator dashboard:

* order masuk
* order aktif
* deadline
* rating
* pendapatan
* upload hasil

Admin dashboard:

* user
* UMKM
* kreator
* order
* pembayaran
* komplain
* laporan

## 17. Icon Style

Icon menggunakan Lucide React.

Prinsip:

* stroke tipis
* ukuran konsisten
* tidak terlalu besar
* gunakan icon hanya untuk membantu pemahaman
* jangan icon berlebihan

Icon penting:

* Search
* User
* Briefcase
* ShoppingCart
* CreditCard
* FileText
* Upload
* Star
* Bell
* Settings
* BarChart
* Shield
* CheckCircle
* AlertCircle

## 18. Motion

Motion jika digunakan harus halus.

Prinsip:

* durasi 150-250ms
* easing lembut
* hover card sedikit naik
* button hover lembut
* tidak pakai animasi berlebihan
* tidak mengganggu performa

Contoh:

* card hover translate-y -2px
* button hover opacity/brightness
* section fade-in opsional
* dropdown smooth

## 19. Content Tone

Bahasa UI harus natural, formal, dan mudah dipahami mahasiswa/UMKM.

Gunakan kalimat:

* “Cari Kreator”
* “Isi Brief Campaign”
* “Pantau Pesanan”
* “Terima Hasil Konten”
* “Ajukan Revisi”
* “Selesaikan Pesanan”

Hindari:

* “Solusi revolusioner”
* “Transformasi digital yang tak terhindarkan”
* “Platform paling canggih”
* “Ekosistem masa depan yang disruptif”

Gaya yang benar:

“Ruang Usaha Kita membantu UMKM mencari kreator, membuat brief promosi, dan memantau proses pembuatan konten secara lebih mudah dan terarah.”

## 20. Terminologi Wajib

Gunakan:

* UMKM
* kreator
* content creator
* marketer
* paket jasa
* layanan
* brief campaign
* hasil konten
* revisi
* status pesanan
* pembayaran
* invoice
* dashboard
* portofolio
* rating
* review

Hindari:

* stok
* gudang
* ongkir
* kurir
* resi
* alamat pengiriman
* packing
* shipping
* barang dikirim
* varian barang
* COD barang

## 21. Accessibility

Walaupun visualnya Apple-like, aksesibilitas tetap penting.

Prinsip:

* kontras teks cukup
* tombol minimal 44px height
* form label jelas
* error message mudah dibaca
* focus state terlihat
* jangan hanya mengandalkan warna untuk status
* icon harus didampingi teks jika maknanya penting
* heading harus berurutan
* link harus jelas

## 22. Responsive Design

Website harus responsive.

Breakpoint:

* mobile: < 640px
* tablet: 640px - 1024px
* desktop: > 1024px

Mobile:

* navbar menjadi sheet menu
* grid menjadi satu kolom
* dashboard sidebar menjadi drawer
* form full width
* card tidak terlalu padat

Desktop:

* navbar horizontal
* dashboard sidebar tetap
* katalog grid 3-4 kolom
* checkout dua kolom
* detail layanan dua kolom

## 23. CSS Variable Direction

Saat implementasi, warna dapat dimasukkan ke `globals.css` sebagai CSS variables.

Contoh arah token:

```css
:root {
  --brand-navy-950: #0c2949;
  --brand-teal-900: #114955;
  --brand-teal-600: #167163;

  --background: #ffffff;
  --foreground: #06111f;

  --surface: #f7f9fa;
  --surface-soft: #f3f6f7;

  --border: #e5eaf0;
  --muted: #6b7280;
}
```

Font Inter bisa diatur melalui Next Font atau import global.

## 24. Visual Rules untuk Vibe Coding

Saat memberi instruksi ke AI coding, gunakan aturan ini:

1. Jangan membuat UI terlalu ramai.
2. Jangan memakai banyak warna.
3. Jangan memakai gradient mencolok.
4. Jangan membuat card terlalu kecil.
5. Jangan membuat marketplace terasa seperti toko barang.
6. Jangan memakai istilah shipping/stock.
7. Gunakan white space besar.
8. Gunakan border halus.
9. Gunakan typography besar dan rapi.
10. Gunakan Inter.
11. Gunakan warna brand sesuai token.
12. Gunakan CTA yang jelas.
13. Fokus pada flow UMKM.
14. Dashboard harus fungsional dan rapi.
15. Landing page harus premium dan meyakinkan.

## 25. Kesimpulan

Desain Ruang Usaha Kita diarahkan menjadi marketplace jasa digital yang bersih, premium, dan mudah dipahami. Referensi Apple.com digunakan untuk membangun kesan elegan melalui whitespace, tipografi kuat, layout rapi, dan visual yang tenang. Warna brand hijau kebiruan dan biru gelap menjadi identitas utama, tetapi harus digunakan secara proporsional agar website tetap modern dan tidak berat.

Dokumen ini menjadi dasar sebelum proses coding UI dimulai. Setiap komponen, halaman, dan flow harus mengikuti prinsip ini agar hasil akhir konsisten dan tidak keluar dari identitas Ruang Usaha Kita.
