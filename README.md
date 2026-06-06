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