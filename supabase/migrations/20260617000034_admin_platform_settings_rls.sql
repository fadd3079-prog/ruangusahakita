create policy "Admins can update platform settings"
  on platform_settings for update
  using (is_admin())
  with check (is_admin());

create policy "Admins can insert platform settings"
  on platform_settings for insert
  with check (is_admin());

create policy "Admins can insert activity logs"
  on activity_logs for insert
  with check (is_admin());

insert into platform_settings (key, value, description)
values
  ('platform_fee_percentage', '{"percentage": 10}', 'Persentase komisi platform dari transaksi'),
  ('admin_fee_flat', '{"amount": 5000}', 'Biaya admin tetap per transaksi'),
  ('admin_fee_min', '{"amount": 0}', 'Minimum biaya admin per transaksi'),
  ('admin_fee_max', '{"amount": 50000}', 'Maksimum biaya admin per transaksi'),
  ('default_service_status', '{"status": "active"}', 'Default status layanan baru saat dibuat kreator'),
  ('default_creator_visibility', '{"visible": true}', 'Default visibility kreator baru'),
  ('catalog_only_active_creators', '{"enabled": true}', 'Hanya tampilkan kreator aktif di katalog'),
  ('catalog_only_active_services', '{"enabled": true}', 'Hanya tampilkan layanan aktif di katalog'),
  ('catalog_only_visible_reviews', '{"enabled": true}', 'Hanya tampilkan review visible di katalog'),
  ('review_auto_visible', '{"enabled": true}', 'Review otomatis tampil tanpa moderasi admin'),
  ('review_min_rating_highlight', '{"rating": 4}', 'Rating minimum untuk highlight review'),
  ('complaint_default_status', '{"status": "open"}', 'Status default komplain baru'),
  ('notif_order_created', '{"enabled": true}', 'Notifikasi saat order dibuat'),
  ('notif_payment_paid', '{"enabled": true}', 'Notifikasi saat pembayaran berhasil'),
  ('notif_result_submitted', '{"enabled": true}', 'Notifikasi saat hasil konten dikirim'),
  ('notif_revision_requested', '{"enabled": true}', 'Notifikasi saat revisi diminta'),
  ('notif_review_created', '{"enabled": true}', 'Notifikasi saat review dibuat'),
  ('notif_complaint_created', '{"enabled": true}', 'Notifikasi saat komplain dibuat'),
  ('notif_message_new', '{"enabled": true}', 'Notifikasi saat ada pesan baru'),
  ('email_notification_enabled', '{"enabled": false}', 'Email notification custom aktif atau tidak'),
  ('site_name', '{"value": "Ruang Usaha Kita"}', 'Nama platform'),
  ('site_url', '{"value": "https://ruangusahakita.com"}', 'URL website'),
  ('site_tagline', '{"value": "Marketplace jasa digital untuk UMKM dan kreator"}', 'Tagline pendek'),
  ('support_email', '{"value": "bantuan@ruangusahakita.com"}', 'Email bantuan atau admin'),
  ('support_whatsapp', '{"value": ""}', 'Nomor WhatsApp admin atau bantuan'),
  ('support_text', '{"value": "Hubungi tim kami jika Anda membutuhkan bantuan terkait layanan di Ruang Usaha Kita."}', 'Teks singkat bantuan'),
  ('social_instagram', '{"value": ""}', 'Link Instagram platform'),
  ('social_tiktok', '{"value": ""}', 'Link TikTok platform'),
  ('maintenance_mode', '{"enabled": false}', 'Mode maintenance aktif atau tidak'),
  ('maintenance_message', '{"value": "Platform sedang dalam pemeliharaan. Silakan coba beberapa saat lagi."}', 'Pesan maintenance'),
  ('payment_mode', '{"mode": "sandbox"}', 'Mode pembayaran aktif: sandbox atau production'),
  ('payment_methods_available', '{"methods": ["qris_sandbox", "manual_transfer"]}', 'Metode pembayaran yang tersedia')
on conflict (key) do nothing;
