import type { DummyServiceCategory } from "@/lib/dummy/types";

export const dummyServiceCategories: readonly DummyServiceCategory[] = [
  {
    id: "category_001",
    name: "Video TikTok/Reels",
    slug: "video-tiktok-reels",
    description:
      "Layanan digital untuk video pendek promosi UMKM di TikTok, Instagram Reels, dan kanal sosial sejenis.",
    iconName: "Clapperboard",
  },
  {
    id: "category_002",
    name: "Desain Feed Instagram",
    slug: "desain-feed-instagram",
    description:
      "Paket desain visual untuk feed, poster digital, carousel, dan materi promosi Instagram.",
    iconName: "PanelsTopLeft",
  },
  {
    id: "category_003",
    name: "Foto Produk",
    slug: "foto-produk",
    description:
      "Sesi foto untuk menampilkan produk, menu, atau penawaran UMKM dengan visual yang lebih siap promosi.",
    iconName: "Camera",
  },
  {
    id: "category_004",
    name: "Review Produk",
    slug: "review-produk",
    description:
      "Konten review dari kreator untuk membantu calon pelanggan memahami nilai dan keunggulan produk UMKM.",
    iconName: "MessageCircleHeart",
  },
  {
    id: "category_005",
    name: "Caption Promosi",
    slug: "caption-promosi",
    description:
      "Penulisan caption, hook, dan copy promosi pendek untuk meningkatkan kejelasan pesan campaign.",
    iconName: "TextQuote",
  },
  {
    id: "category_006",
    name: "Campaign UMKM",
    slug: "campaign-umkm",
    description:
      "Rangkaian konten dan arahan campaign sederhana untuk promosi digital UMKM dalam periode tertentu.",
    iconName: "Megaphone",
  },
];
