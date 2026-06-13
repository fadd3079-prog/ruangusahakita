# Email Notifications

Ruang Usaha Kita memakai adapter email server-only untuk update penting order. Adapter akan mengirim email jika environment provider tersedia, dan menjadi no-op aman jika belum disiapkan.

Environment yang dibutuhkan untuk pengiriman email:

```env
RESEND_API_KEY=
EMAIL_FROM=
```

Event yang didukung:

* pembayaran berhasil
* kreator menerima brief
* kreator mulai pengerjaan
* hasil konten dikirim
* revisi diminta
* pesanan selesai
* review dibuat
* komplain dibuat

Aturan keamanan:

* email hanya dikirim dari server
* secret provider tidak boleh masuk client
* email hanya dikirim ke UMKM, kreator, atau admin yang terkait
* chat order tidak dikirim sebagai email agar tidak spam
* analytics admin tidak menghasilkan email

Jika provider belum tersedia, flow aplikasi tetap berjalan dan tidak menampilkan detail secret.
