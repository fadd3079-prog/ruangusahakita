-- Seed canonical active service categories for creator service forms and catalog filters.
insert into service_categories (
  id,
  name,
  slug,
  description,
  icon_name,
  is_active,
  sort_order
) values
(
  '10000000-0000-4000-8000-000000000001',
  'Video TikTok/Reels',
  'video-tiktok-reels',
  'Layanan digital untuk video pendek promosi UMKM di TikTok, Instagram Reels, dan kanal sosial sejenis.',
  'Clapperboard',
  true,
  1
),
(
  '10000000-0000-4000-8000-000000000002',
  'Desain Feed Instagram',
  'desain-feed-instagram',
  'Paket desain visual untuk feed, poster digital, carousel, dan materi promosi Instagram.',
  'PanelsTopLeft',
  true,
  2
),
(
  '10000000-0000-4000-8000-000000000003',
  'Foto Produk',
  'foto-produk',
  'Sesi foto untuk menampilkan produk, menu, atau penawaran UMKM dengan visual yang lebih siap promosi.',
  'Camera',
  true,
  3
),
(
  '10000000-0000-4000-8000-000000000004',
  'Review Produk',
  'review-produk',
  'Konten review dari kreator untuk membantu calon pelanggan memahami nilai dan keunggulan produk UMKM.',
  'MessageCircleHeart',
  true,
  4
),
(
  '10000000-0000-4000-8000-000000000005',
  'Caption Promosi',
  'caption-promosi',
  'Penulisan caption, hook, dan copy promosi pendek untuk meningkatkan kejelasan pesan campaign.',
  'TextQuote',
  true,
  5
),
(
  '10000000-0000-4000-8000-000000000006',
  'Campaign UMKM',
  'campaign-umkm',
  'Rangkaian konten dan arahan campaign sederhana untuk promosi digital UMKM dalam periode tertentu.',
  'Megaphone',
  true,
  6
)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  icon_name = excluded.icon_name,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  updated_at = now();
