import type { DummyPortfolioItem } from "@/lib/dummy/types";

export const dummyPortfolios: readonly DummyPortfolioItem[] = [
  {
    id: "portfolio_001",
    creatorId: "creator_001",
    categoryId: "category_001",
    title: "Video Promosi Bakso Mas Adi",
    description:
      "Video reels kuliner dengan fokus tekstur kuah, proses penyajian, dan ajakan datang saat jam makan siang.",
    thumbnailUrl: "/images/dummy/portfolios/video-promosi-bakso.jpg",
    externalUrl: "https://example.com/portfolio/video-promosi-bakso",
    clientName: "Bakso Mas Adi",
    isFeatured: true,
  },
  {
    id: "portfolio_002",
    creatorId: "creator_002",
    categoryId: "category_002",
    title: "Feed Launching Batik Loka",
    description:
      "Rangkaian desain feed bernuansa premium untuk memperkenalkan motif baru dan cerita brand batik lokal.",
    thumbnailUrl: "/images/dummy/portfolios/feed-launching-batik.jpg",
    externalUrl: "https://example.com/portfolio/feed-launching-batik",
    clientName: "Batik Loka",
    isFeatured: true,
  },
  {
    id: "portfolio_003",
    creatorId: "creator_003",
    categoryId: "category_004",
    title: "Review Keripik Pedas Bu Sari",
    description:
      "Konten review singkat dengan gaya santai, menonjolkan tekstur renyah dan varian rasa pedas.",
    thumbnailUrl: "/images/dummy/portfolios/review-keripik-bu-sari.jpg",
    externalUrl: "https://example.com/portfolio/review-keripik-bu-sari",
    clientName: "Keripik Bu Sari",
    isFeatured: true,
  },
  {
    id: "portfolio_004",
    creatorId: "creator_004",
    categoryId: "category_003",
    title: "Foto Menu Kopi Sudut Kota",
    description:
      "Foto menu kopi dengan pencahayaan lembut dan styling meja yang cocok untuk promosi media sosial.",
    thumbnailUrl: "/images/dummy/portfolios/foto-menu-kopi.jpg",
    externalUrl: "https://example.com/portfolio/foto-menu-kopi",
    clientName: "Kopi Sudut Kota",
    isFeatured: true,
  },
  {
    id: "portfolio_005",
    creatorId: "creator_005",
    categoryId: "category_002",
    title: "Desain Promo Roti Lembut Pagi",
    description:
      "Desain promosi harian untuk roti sobek dan paket sarapan dengan layout bersih dan mudah dibaca.",
    thumbnailUrl: "/images/dummy/portfolios/desain-promo-roti.jpg",
    externalUrl: "https://example.com/portfolio/desain-promo-roti",
    clientName: "Roti Lembut Pagi",
    isFeatured: false,
  },
  {
    id: "portfolio_006",
    creatorId: "creator_006",
    categoryId: "category_006",
    title: "Campaign UMKM Kuliner 7 Hari",
    description:
      "Campaign video pendek dengan jadwal konten sederhana untuk meningkatkan perhatian pelanggan sekitar.",
    thumbnailUrl: "/images/dummy/portfolios/campaign-umkm-kuliner.jpg",
    externalUrl: "https://example.com/portfolio/campaign-umkm-kuliner",
    clientName: "Kopi Sudut Kota",
    isFeatured: true,
  },
];
