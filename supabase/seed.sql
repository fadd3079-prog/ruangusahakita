-- Seed Data for Ruang Usaha Kita Service Catalog

-- 1. Service Categories
INSERT INTO service_categories (id, name, slug, description, icon_name, sort_order) VALUES
('category_001', 'Video TikTok/Reels', 'video-tiktok-reels', 'Layanan digital untuk video pendek promosi UMKM di TikTok, Instagram Reels, dan kanal sosial sejenis.', 'Clapperboard', 1),
('category_002', 'Desain Feed Instagram', 'desain-feed-instagram', 'Paket desain visual untuk feed, poster digital, carousel, dan materi promosi Instagram.', 'PanelsTopLeft', 2),
('category_003', 'Foto Produk', 'foto-produk', 'Sesi foto untuk menampilkan produk, menu, atau penawaran UMKM dengan visual yang lebih siap promosi.', 'Camera', 3),
('category_004', 'Review Produk', 'review-produk', 'Konten review dari kreator untuk membantu calon pelanggan memahami nilai dan keunggulan produk UMKM.', 'MessageCircleHeart', 4),
('category_005', 'Caption Promosi', 'caption-promosi', 'Penulisan caption, hook, dan copy promosi pendek untuk meningkatkan kejelasan pesan campaign.', 'TextQuote', 5),
('category_006', 'Campaign UMKM', 'campaign-umkm', 'Rangkaian konten dan arahan campaign sederhana untuk promosi digital UMKM dalam periode tertentu.', 'Megaphone', 6);

-- NOTE: To add creators and services, you need auth.users IDs.
-- Since this is a local seed, we can't easily guess auth.users IDs.
-- Users should use the /register page to create real users, 
-- then update the 'role' to 'creator' and 'is_featured' to true if they want to see them in the featured section.

-- Example of how to manually feature a creator in SQL Editor after they register:
-- UPDATE creator_profiles SET is_featured = true WHERE display_name = 'Your Creator Name';
