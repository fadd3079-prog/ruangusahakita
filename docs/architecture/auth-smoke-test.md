# Auth & Role Smoke Test Manual

Dokumen ini dipakai untuk smoke test manual auth, profile bootstrap, session persistence, dan role guard Ruang Usaha Kita.

## Persiapan

- Pastikan `.env.local` berisi `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, dan `SUPABASE_SERVICE_ROLE_KEY`.
- Pastikan migration auth/RLS terbaru sudah diterapkan, termasuk `20260607000016_fix_profile_sensitive_field_trigger.sql`.
- Jalankan aplikasi lokal dan gunakan email baru untuk setiap skenario register.

## Registrasi UMKM

1. Buka `/register`.
2. Pilih role `UMKM`.
3. Isi nama, email baru, password minimal 8 karakter, dan konfirmasi password.
4. Klik `Daftar Sekarang`.
5. Jika Supabase email confirmation nonaktif, user masuk ke `/umkm/dashboard`.
6. Jika Supabase email confirmation aktif, user masuk ke `/login?registered=1`.
7. Verifikasi database:
   - `auth.users` punya user baru.
   - `profiles` punya row baru dengan `role = 'umkm'` dan `account_status = 'active'`.
   - `umkm_profiles` punya row baru dengan `user_id` yang sama.
   - `creator_profiles` tidak punya row untuk user tersebut.

## Registrasi Kreator

1. Logout dari akun aktif.
2. Buka `/register`.
3. Pilih role `Kreator`.
4. Isi nama, email baru, password minimal 8 karakter, dan konfirmasi password.
5. Klik `Daftar Sekarang`.
6. Jika Supabase email confirmation nonaktif, user masuk ke `/creator/dashboard`.
7. Jika Supabase email confirmation aktif, user masuk ke `/login?registered=1`.
8. Verifikasi database:
   - `profiles` punya row baru dengan `role = 'creator'` dan `account_status = 'active'`.
   - `creator_profiles` punya row baru dengan `user_id` yang sama.
   - `umkm_profiles` tidak punya row untuk user tersebut.

## Register Role Admin Ditolak

1. Kirim form register dengan `role = 'admin'` lewat request manual.
2. Expected result: server action mengembalikan error `Role tidak valid.`
3. Tidak ada row baru untuk admin dari public register.

## Login Dan Redirect Role

1. Buka `/login`.
2. Masuk sebagai akun UMKM aktif.
3. Expected result: redirect ke `/umkm/dashboard`.
4. Logout, lalu login sebagai kreator aktif.
5. Expected result: redirect ke `/creator/dashboard`.
6. Login sebagai admin manual/database.
7. Expected result: redirect ke `/admin/dashboard`.

## Session Persistence

1. Login sebagai user aktif.
2. Refresh dashboard.
3. Expected result: user tetap berada di dashboard role-nya.
4. Buka `/login` atau `/register`.
5. Expected result: user langsung diarahkan ke dashboard role-nya.

## Auth Callback

1. Jalankan flow email confirmation atau magic link Supabase yang mengarah ke `/callback`.
2. Expected result: callback menukar code Supabase menjadi session.
3. User aktif diarahkan ke dashboard sesuai role.
4. User tanpa profile diarahkan ke `/login?error=profile`.
5. User inactive/suspended/pending diarahkan ke `/login?error=inactive`.

## Proteksi Dashboard Tanpa Login

1. Logout atau hapus session browser.
2. Buka `/umkm/dashboard`, `/creator/dashboard`, dan `/admin/dashboard`.
3. Expected result: semua diarahkan ke `/login`.

## Proteksi Salah Role

1. Login sebagai UMKM.
2. Buka `/creator/dashboard` dan `/admin/dashboard`.
3. Expected result: diarahkan kembali ke `/umkm/dashboard`.
4. Login sebagai kreator.
5. Buka `/umkm/dashboard` dan `/admin/dashboard`.
6. Expected result: diarahkan kembali ke `/creator/dashboard`.

## Proteksi Account Status

1. Login sebagai user aktif.
2. Ubah `profiles.account_status` user tersebut menjadi `inactive` lewat SQL admin.
3. Refresh dashboard.
4. Expected result: user diarahkan ke `/login?error=inactive`.
5. Login ulang dengan akun tersebut.
6. Expected result: form login menampilkan error akun belum aktif atau sedang dibatasi.

## RLS Profile Sensitive Fields

1. Login sebagai user biasa.
2. Coba update `profiles.role`, `profiles.email`, atau `profiles.account_status` milik sendiri dari client authenticated.
3. Expected result: database menolak update lewat trigger `protect_profile_sensitive_fields`.
4. Coba update field aman seperti `full_name` milik sendiri.
5. Expected result: update boleh berjalan sesuai policy.

## Logout

1. Jalankan logout action.
2. Expected result: session Supabase hilang dan user diarahkan ke `/login?logged_out=1`.
3. Buka dashboard lagi.
4. Expected result: diarahkan ke `/login`.

## Admin Manual

Akun admin dibuat secara manual oleh operator database, bukan dari public register. Gunakan SQL admin atau dashboard Supabase untuk mengubah role akun yang sudah ada menjadi `admin`, lalu verifikasi login admin mengarah ke `/admin/dashboard`.
