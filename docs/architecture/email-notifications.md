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

Setup reset password Supabase:

1. Buka Supabase Dashboard.
2. Masuk ke Authentication.
3. Pastikan redirect URL reset password sudah diizinkan.
4. Gunakan email reset password bawaan Supabase.

Redirect URL yang perlu diizinkan di Supabase Authentication:

* `https://www.ruangusahakita.my.id/reset-password`
* `https://ruangusahakita.my.id/reset-password`
* `http://localhost:3000/reset-password`

Flow aplikasi memakai callback untuk membuat session reset sebelum masuk ke halaman reset. Jika Supabase meminta allowlist callback, tambahkan juga:

* `https://www.ruangusahakita.my.id/callback?next=/reset-password`
* `https://ruangusahakita.my.id/callback?next=/reset-password`
* `http://localhost:3000/callback?next=/reset-password`

Receipt pembayaran dikirim lewat adapter email aplikasi setelah status pembayaran tercatat paid. Jika provider belum dikonfigurasi, adapter menjadi no-op aman dan user tetap bisa membuka receipt dari halaman order.
