import type { DummyCart } from "@/lib/dummy/types";

export const dummyCarts: readonly DummyCart[] = [
  {
    id: "cart_001",
    umkmId: "umkm_001",
    status: "active",
    items: [
      {
        id: "cart_item_001",
        servicePackageId: "service_001",
        tierId: "tier_service_001_standard",
        creatorId: "creator_001",
        serviceTitle: "Video Reels Kuliner untuk UMKM",
        creatorName: "Raka Visual",
        tierName: "Standard",
        unitPrice: 300000,
        addonTotal: 150000,
        subtotal: 450000,
        estimatedDays: 4,
        revisionCount: 2,
        addons: [
          {
            id: "addon_001",
            name: "Bantuan Brief Campaign",
            price: 150000,
          },
        ],
      },
    ],
    subtotalAmount: 300000,
    addonAmount: 150000,
    adminFee: 5000,
    totalAmount: 455000,
    updatedAt: "2026-06-01T09:30:00.000Z",
  },
];
