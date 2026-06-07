# Auth & Role Smoke Test Manual

Dokumen ini menjelaskan langkah-langkah untuk melakukan pengujian manual (smoke test) pada sistem autentikasi, profil, dan role-based access control (RBAC) Ruang Usaha Kita.

## Persiapan
- Pastikan `.env.local` sudah terkonfigurasi dengan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Pastikan migrasi database (000000 sampai 000008) sudah diterapkan di Supabase.

## Skenario 1: Registrasi UMKM
1. Buka halaman `/register`.
2. Pilih peran "UMKM".
3. Isi Nama Lengkap, Email (gunakan email baru/unik), dan Password (min. 8 karakter).
4. Klik "Daftar Sekarang".
5. **Expected Result:**
   - User diarahkan ke `/umkm/dashboard`.
   - Di Supabase (Table `profiles`): Muncul row baru dengan role `umkm`.
   - Di Supabase (Table `umkm_profiles`): Muncul row baru yang terhubung ke user tersebut.
   - User mendapat sesi login (cookie `sb-access-token` terpasang).

## Skenario 2: Registrasi Kreator
1. Logout jika sedang login.
2. Buka halaman `/register`.
3. Pilih peran "Kreator".
4. Isi data lengkap.
5. Klik "Daftar Sekarang".
6. **Expected Result:**
   - User diarahkan ke `/creator/dashboard`.
   - Di Supabase (Table `profiles`): Muncul row baru dengan role `creator`.
   - Di Supabase (Table `creator_profiles`): Muncul row baru yang terhubung ke user tersebut.

## Skenario 3: Login & Redirect
1. Logout.
2. Buka halaman `/login`.
3. Masukkan kredensial akun UMKM yang dibuat tadi.
4. **Expected Result:**
   - User diarahkan otomatis ke `/umkm/dashboard`.

## Skenario 4: Proteksi Route (Unauthenticated)
1. Logout (hapus cookie/session).
2. Coba buka langsung URL:
   - `/umkm/dashboard`
   - `/creator/dashboard`
   - `/admin/dashboard`
3. **Expected Result:**
   - Semuanya dialihkan (redirect) ke `/login`.

## Skenario 5: Proteksi Role (Unauthorized)
1. Login sebagai akun **UMKM**.
2. Coba buka manual URL:
   - `/creator/dashboard`
   - `/admin/dashboard`
3. **Expected Result:**
   - User dialihkan kembali ke `/umkm/dashboard` (Middleware Role Guard).

## Skenario 6: Hardening RLS (Security)
1. Login sebagai user biasa (UMKM/Creator).
2. Buka konsol browser (F12) -> Console.
3. Coba jalankan query update role via `supabase` client (jika terekspos) atau simulasikan patch request ke profiles.
   - Contoh logika test: Mencoba mengubah `role` dari `umkm` ke `admin` pada row milik sendiri.
4. **Expected Result:**
   - Update ditolak oleh database (Trigger `profile_protection_trigger`) dengan pesan error: `You are not allowed to change your role.`

## Skenario 7: Admin Protection
1. Buka halaman `/register`.
2. Tidak ada pilihan peran "Admin" di UI.
3. Coba manipulasi request (misal lewat Postman atau modifikasi state komponen) untuk mengirim `role: 'admin'`.
4. **Expected Result:**
   - Server Action `registerAction` akan menolak dengan error: `Role tidak valid.` (Server-side validation).

## Skenario 8: Logout
1. Klik tombol Logout (jika ada) atau panggil `logoutAction`.
2. **Expected Result:**
   - Sesi dihapus.
   - User diarahkan ke `/login`.
   - Mencoba akses dashboard akan dialihkan ke login.

## Catatan Tambahan
- Untuk membuat akun Admin, saat ini harus dilakukan secara manual melalui SQL Editor di Dashboard Supabase:
  ```sql
  update profiles set role = 'admin' where email = 'admin@email.com';
  ```
- RLS pada `creator_profiles` memastikan profil hanya bisa dilihat publik jika `account_status` di tabel `profiles` adalah `active`.
