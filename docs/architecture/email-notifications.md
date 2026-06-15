# Email Delivery Status

Pemulihan password memakai email bawaan Supabase Auth melalui `supabase.auth.resetPasswordForEmail`.

Redirect yang digunakan:

* Lokal: `http://localhost:3000/reset-password`
* Produksi: `https://www.ruangusahakita.my.id/reset-password`

Kedua URL harus terdaftar di Supabase Authentication Redirect URLs. Halaman `/reset-password` menukar recovery code menjadi session sebelum menerima password baru.

Brand styling untuk email autentikasi sementara dinonaktifkan. Repository tidak menyimpan atau merender HTML email lokal, dan aplikasi tidak melakukan pengiriman email sendiri.

Pengiriman receipt melalui email sementara dinonaktifkan. Status pembayaran tidak bergantung pada layanan email. Invoice dan receipt tetap tersedia di dalam aplikasi melalui halaman order terkait.

Update order, hasil konten, revisi, review, dan komplain tetap menggunakan status serta notifikasi dalam aplikasi.
