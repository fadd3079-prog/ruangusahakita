-- Seed Data for Ruang Usaha Kita Service Catalog

-- 1. Service Categories
INSERT INTO service_categories (id, name, slug, description, icon_name, is_active, sort_order) VALUES
('10000000-0000-4000-8000-000000000001', 'Video TikTok/Reels', 'video-tiktok-reels', 'Layanan digital untuk video pendek promosi UMKM di TikTok, Instagram Reels, dan kanal sosial sejenis.', 'Clapperboard', true, 1),
('10000000-0000-4000-8000-000000000002', 'Desain Feed Instagram', 'desain-feed-instagram', 'Paket desain visual untuk feed, poster digital, carousel, dan materi promosi Instagram.', 'PanelsTopLeft', true, 2),
('10000000-0000-4000-8000-000000000003', 'Foto Produk', 'foto-produk', 'Sesi foto untuk menampilkan produk, menu, atau penawaran UMKM dengan visual yang lebih siap promosi.', 'Camera', true, 3),
('10000000-0000-4000-8000-000000000004', 'Review Produk', 'review-produk', 'Konten review dari kreator untuk membantu calon pelanggan memahami nilai dan keunggulan produk UMKM.', 'MessageCircleHeart', true, 4),
('10000000-0000-4000-8000-000000000005', 'Caption Promosi', 'caption-promosi', 'Penulisan caption, hook, dan copy promosi pendek untuk meningkatkan kejelasan pesan campaign.', 'TextQuote', true, 5),
('10000000-0000-4000-8000-000000000006', 'Campaign UMKM', 'campaign-umkm', 'Rangkaian konten dan arahan campaign sederhana untuk promosi digital UMKM dalam periode tertentu.', 'Megaphone', true, 6)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon_name = EXCLUDED.icon_name,
  is_active = EXCLUDED.is_active,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();

-- NOTE: To add creators and services, you need auth.users IDs.
-- Since this is a local seed, we can't easily guess auth.users IDs.
-- Users should use the /register page to create real users, 
-- then update the 'role' to 'creator' and 'is_featured' to true if they want to see them in the featured section.

-- Example of how to manually feature a creator in SQL Editor after they register:
-- UPDATE creator_profiles SET is_featured = true WHERE display_name = 'Your Creator Name';
