# Ruang Usaha Kita — Dummy Data

## 1. Tujuan Dokumen

Dokumen ini berisi rancangan dummy data untuk pengembangan awal Ruang Usaha Kita. Dummy data digunakan sebelum database Supabase aktif agar UI, komponen, halaman, flow order, payment, dashboard, dan laporan dapat dibangun lebih cepat.

Dummy data harus dibuat realistis, konsisten, dan sesuai dengan konteks marketplace jasa digital. Jangan memakai data toko barang fisik seperti stok, gudang, pengiriman, ongkir, resi, atau kurir.

Dummy data ini dipakai untuk:

1. Homepage.
2. Katalog kreator.
3. Detail kreator.
4. Detail layanan.
5. Cart.
6. Checkout brief.
7. Payment dummy.
8. Order detail.
9. Dashboard UMKM.
10. Dashboard creator.
11. Dashboard admin.
12. Review dan rating.
13. Reports dummy.
14. Testing UI.

## 2. Prinsip Dummy Data

### 2.1 Realistis

Data harus terasa masuk akal untuk marketplace jasa digital mahasiswa/UMKM lokal.

Contoh harga:

- Rp100.000 sampai Rp750.000 untuk paket jasa kreator lokal.
- Biaya admin Rp5.000.
- Platform fee internal 10%.
- Estimasi pengerjaan 2–7 hari.
- Revisi 1–2 kali.

### 2.2 Tidak Mengklaim Data Real

Dummy data tidak boleh ditulis sebagai data nyata platform.

Gunakan label:

- dummy
- simulasi
- contoh
- data pengembangan

### 2.3 Konsisten

Nama creator, layanan, order, review, payment, dan dashboard harus saling berhubungan.

Contoh:

Jika order memakai creator “Raka Visual”, maka creator tersebut harus ada di dummy creator list.

### 2.4 Sesuai Jasa Digital

Gunakan istilah:

- paket jasa
- brief campaign
- hasil konten
- revisi
- rating
- portofolio
- payment
- invoice

Hindari:

- stok
- barang
- pengiriman
- resi
- ongkir
- kurir
- gudang

## 3. Dummy User Roles

Role utama:

```ts
export type DummyRole = "umkm" | "creator" | "admin"
```

Data user dummy:

| ID | Role | Nama | Email |
|---|---|---|---|
| user_umkm_001 | UMKM | Andi Pratama | andi.umkm@example.com |
| user_umkm_002 | UMKM | Sari Lestari | sari.umkm@example.com |
| user_creator_001 | Creator | Raka Visual | raka.creator@example.com |
| user_creator_002 | Creator | Nabila Creative | nabila.creator@example.com |
| user_admin_001 | Admin | Admin Ruang Usaha | admin@ruangusahakita.id |

## 4. Dummy UMKM Profiles

### 4.1 Daftar UMKM

| ID | Nama Usaha | Kategori | Lokasi | Deskripsi |
|---|---|---|---|---|
| umkm_001 | Bakso Mas Adi | Kuliner | Purbalingga | Usaha bakso lokal yang ingin memperkuat promosi di TikTok dan Instagram. |
| umkm_002 | Kopi Sudut Kota | Minuman | Purwokerto | Kedai kopi kecil yang ingin memperkenalkan menu signature dan suasana tempat. |
| umkm_003 | Roti Lembut Pagi | Makanan | Banyumas | Usaha roti rumahan yang ingin membuat konten promosi untuk pre-order. |
| umkm_004 | Batik Loka | Fashion | Purbalingga | Brand batik lokal yang ingin memperluas promosi ke anak muda. |
| umkm_005 | Keripik Bu Sari | Produk Lokal | Wonosobo | Produk makanan ringan rumahan yang ingin masuk ke pasar online. |

### 4.2 Contoh Object

```ts
export const dummyUmkmProfiles = [
  {
    id: "umkm_001",
    userId: "user_umkm_001",
    businessName: "Bakso Mas Adi",
    businessCategory: "Kuliner",
    ownerName: "Andi Pratama",
    city: "Purbalingga",
    province: "Jawa Tengah",
    description:
      "Usaha bakso lokal yang ingin memperkuat promosi di TikTok dan Instagram.",
    instagramUrl: "https://instagram.com/baksomasadi",
    whatsappNumber: "081234567890",
    targetAudience: "Mahasiswa, pekerja muda, dan keluarga sekitar Purbalingga",
    contentPreference: "Konten video pendek yang natural, hangat, dan menggugah selera",
  },
]
```

## 5. Dummy Creator Profiles

### 5.1 Daftar Creator

| ID | Nama | Niche | Lokasi | Rating | Proyek Selesai | Harga Mulai |
|---|---|---|---|---:|---:|---:|
| creator_001 | Raka Visual | Kuliner | Purbalingga | 4.8 | 42 | Rp150.000 |
| creator_002 | Nabila Creative | Fashion & Beauty | Purwokerto | 4.7 | 35 | Rp120.000 |
| creator_003 | Dimas Review | Produk Lokal | Banyumas | 4.9 | 51 | Rp200.000 |
| creator_004 | Sinta Studio | Foto Produk | Purbalingga | 4.6 | 28 | Rp175.000 |
| creator_005 | Fadd Graphics | Branding & Desain | Purbalingga | 4.8 | 47 | Rp150.000 |
| creator_006 | Arkan Media | Lifestyle & TikTok | Purwokerto | 4.7 | 31 | Rp300.000 |

### 5.2 Contoh Object

```ts
export const dummyCreators = [
  {
    id: "creator_001",
    userId: "user_creator_001",
    displayName: "Raka Visual",
    niche: "Kuliner",
    city: "Purbalingga",
    province: "Jawa Tengah",
    bio:
      "Membantu UMKM kuliner membuat video pendek yang natural, menarik, dan mudah dipahami audiens lokal.",
    skills: ["Video TikTok", "Reels", "Food Content", "Caption"],
    avatarUrl: "/images/dummy/creators/raka-visual.jpg",
    bannerUrl: "/images/dummy/banners/raka-banner.jpg",
    instagramUrl: "https://instagram.com/rakavisual",
    tiktokUrl: "https://tiktok.com/@rakavisual",
    availabilityStatus: "available",
    startingPrice: 150000,
    averageRating: 4.8,
    completedOrdersCount: 42,
    responseTimeHours: 3,
    isVerified: true,
    isFeatured: true,
  },
]
```

## 6. Dummy Service Categories

### 6.1 Daftar Kategori

| ID | Nama | Slug | Deskripsi |
|---|---|---|---|
| cat_001 | Video TikTok/Reels | video-tiktok-reels | Video pendek untuk promosi produk atau usaha di media sosial. |
| cat_002 | Desain Feed Instagram | desain-feed-instagram | Desain konten feed yang rapi dan sesuai identitas usaha. |
| cat_003 | Foto Produk | foto-produk | Foto produk untuk katalog, media sosial, dan promosi. |
| cat_004 | Review Produk | review-produk | Konten review produk oleh kreator sesuai niche. |
| cat_005 | Caption Promosi | caption-promosi | Penulisan caption promosi yang jelas dan menarik. |
| cat_006 | Campaign UMKM | campaign-umkm | Paket promosi sederhana untuk kebutuhan campaign UMKM. |

### 6.2 Contoh Object

```ts
export const dummyServiceCategories = [
  {
    id: "cat_001",
    name: "Video TikTok/Reels",
    slug: "video-tiktok-reels",
    description:
      "Video pendek untuk membantu UMKM mempromosikan produk atau layanan di media sosial.",
    iconName: "Video",
  },
]
```

## 7. Dummy Service Packages

### 7.1 Daftar Paket Jasa

| ID | Creator | Kategori | Nama Layanan | Harga Mulai | Estimasi | Revisi |
|---|---|---|---|---:|---:|---:|
| service_001 | Raka Visual | Video TikTok/Reels | Video Reels Kuliner untuk UMKM | Rp150.000 | 3 hari | 1 |
| service_002 | Nabila Creative | Desain Feed Instagram | Desain Feed Promosi Fashion | Rp120.000 | 2 hari | 1 |
| service_003 | Dimas Review | Review Produk | Review Produk Lokal | Rp200.000 | 4 hari | 1 |
| service_004 | Sinta Studio | Foto Produk | Foto Produk Katalog UMKM | Rp175.000 | 3 hari | 1 |
| service_005 | Fadd Graphics | Desain Feed Instagram | Desain Promosi dan Branding UMKM | Rp150.000 | 3 hari | 1 |
| service_006 | Arkan Media | Campaign UMKM | Campaign TikTok UMKM | Rp300.000 | 5 hari | 2 |

### 7.2 Contoh Object

```ts
export const dummyServicePackages = [
  {
    id: "service_001",
    creatorId: "creator_001",
    categoryId: "cat_001",
    title: "Video Reels Kuliner untuk UMKM",
    slug: "video-reels-kuliner-umkm",
    shortDescription:
      "Paket pembuatan video pendek untuk promosi makanan, minuman, atau tempat makan.",
    description:
      "Layanan ini cocok untuk UMKM kuliner yang ingin membuat konten video pendek untuk Instagram Reels atau TikTok. Konten dibuat dengan gaya natural, menonjolkan produk, suasana, dan pesan promosi yang mudah dipahami.",
    coverImageUrl: "/images/dummy/services/video-reels-kuliner.jpg",
    basePrice: 150000,
    estimatedDays: 3,
    revisionCount: 1,
    deliverables: ["1 video pendek", "1 caption promosi", "1 kali revisi"],
    requirements: [
      "Foto atau video produk jika ada",
      "Nama usaha",
      "Tujuan promosi",
      "Referensi gaya konten",
    ],
    tags: ["kuliner", "video pendek", "reels", "tiktok"],
    isActive: true,
    isFeatured: true,
  },
]
```

## 8. Dummy Package Tiers

### 8.1 Contoh Tier Video

| Tier | Harga | Output | Estimasi | Revisi |
|---|---:|---|---:|---:|
| Basic | Rp150.000 | 1 video pendek, 1 caption | 3 hari | 1 |
| Standard | Rp300.000 | 2 video pendek, 2 caption, konsep sederhana | 5 hari | 1 |
| Premium | Rp500.000 | 3 video pendek, 3 caption, konsep campaign, laporan sederhana | 7 hari | 2 |

### 8.2 Contoh Object

```ts
export const dummyServiceTiers = [
  {
    id: "tier_001",
    servicePackageId: "service_001",
    name: "Basic",
    description: "Cocok untuk promosi sederhana satu produk.",
    price: 150000,
    estimatedDays: 3,
    revisionCount: 1,
    deliverables: ["1 video pendek", "1 caption", "1 revisi"],
    sortOrder: 1,
  },
  {
    id: "tier_002",
    servicePackageId: "service_001",
    name: "Standard",
    description: "Cocok untuk promosi produk dengan konsep konten lebih jelas.",
    price: 300000,
    estimatedDays: 5,
    revisionCount: 1,
    deliverables: ["2 video pendek", "2 caption", "Konsep konten sederhana", "1 revisi"],
    sortOrder: 2,
  },
  {
    id: "tier_003",
    servicePackageId: "service_001",
    name: "Premium",
    description: "Cocok untuk campaign UMKM dengan beberapa output konten.",
    price: 500000,
    estimatedDays: 7,
    revisionCount: 2,
    deliverables: ["3 video pendek", "3 caption", "Konsep campaign", "Laporan sederhana", "2 revisi"],
    sortOrder: 3,
  },
]
```

## 9. Dummy Add-ons

| ID | Nama | Harga | Deskripsi |
|---|---|---:|---|
| addon_001 | Bantuan Brief Campaign | Rp150.000 | Membantu UMKM menyusun brief agar lebih jelas. |
| addon_002 | Caption Tambahan | Rp50.000 | Tambahan caption untuk variasi konten. |
| addon_003 | Revisi Tambahan | Rp75.000 | Revisi tambahan di luar paket. |
| addon_004 | File Mentah | Rp100.000 | File mentah desain/video jika disepakati. |
| addon_005 | Pengerjaan Lebih Cepat | Rp150.000 | Prioritas pengerjaan lebih cepat sesuai ketersediaan kreator. |

Contoh object:

```ts
export const dummyAddons = [
  {
    id: "addon_001",
    servicePackageId: "service_001",
    name: "Bantuan Brief Campaign",
    description: "Membantu UMKM menyusun arahan konten agar lebih jelas untuk kreator.",
    price: 150000,
  },
]
```

## 10. Dummy Portfolios

### 10.1 Daftar Portfolio

| ID | Creator | Judul | Kategori | Link |
|---|---|---|---|---|
| portfolio_001 | Raka Visual | Video Promosi Bakso Lokal | Video TikTok/Reels | dummy |
| portfolio_002 | Raka Visual | Reels Menu Minuman Baru | Video TikTok/Reels | dummy |
| portfolio_003 | Nabila Creative | Feed Launching Produk Fashion | Desain Feed | dummy |
| portfolio_004 | Sinta Studio | Foto Produk Roti Rumahan | Foto Produk | dummy |
| portfolio_005 | Fadd Graphics | Desain Promo UMKM Kuliner | Desain Feed | dummy |

Contoh object:

```ts
export const dummyPortfolios = [
  {
    id: "portfolio_001",
    creatorId: "creator_001",
    title: "Video Promosi Bakso Lokal",
    description:
      "Konten video pendek untuk memperkenalkan menu bakso dan suasana tempat makan.",
    categoryId: "cat_001",
    thumbnailUrl: "/images/dummy/portfolio/bakso-reels.jpg",
    externalUrl: "https://example.com/portfolio/bakso-reels",
    clientType: "UMKM Kuliner",
    isFeatured: true,
  },
]
```

## 11. Dummy Cart

### 11.1 Contoh Cart UMKM

```ts
export const dummyCart = {
  id: "cart_001",
  umkmId: "umkm_001",
  status: "active",
  items: [
    {
      id: "cart_item_001",
      servicePackageId: "service_001",
      tierId: "tier_002",
      creatorId: "creator_001",
      serviceTitle: "Video Reels Kuliner untuk UMKM",
      creatorName: "Raka Visual",
      tierName: "Standard",
      unitPrice: 300000,
      addonTotal: 150000,
      subtotal: 450000,
      estimatedDays: 5,
      revisionCount: 1,
      addons: [
        {
          id: "addon_001",
          name: "Bantuan Brief Campaign",
          price: 150000,
        },
      ],
    },
  ],
  adminFee: 5000,
  total: 455000,
}
```

### 11.2 Catatan

Cart tidak perlu menonjolkan quantity karena jasa digital biasanya dipesan berdasarkan scope, bukan jumlah barang.

## 12. Dummy Campaign Brief

```ts
export const dummyCampaignBrief = {
  id: "brief_001",
  umkmId: "umkm_001",
  orderId: "order_001",
  businessName: "Bakso Mas Adi",
  businessCategory: "Kuliner",
  promotedProduct: "Menu bakso urat dan es teh jumbo",
  campaignGoal: "Meningkatkan awareness dan menarik pelanggan baru dari mahasiswa sekitar.",
  targetAudience: "Mahasiswa, pekerja muda, dan keluarga di sekitar Purbalingga.",
  contentPlatforms: ["Instagram Reels", "TikTok"],
  contentStyle: "Natural, hangat, menggugah selera, tidak terlalu formal.",
  referenceLinks: [
    "https://www.instagram.com/reel/example",
    "https://www.tiktok.com/@example/video/123",
  ],
  deadline: "2026-06-20",
  additionalNotes:
    "Tolong tonjolkan porsi bakso, suasana tempat, dan promo makan siang.",
  assetUrls: [],
  status: "submitted",
}
```

## 13. Dummy Orders

### 13.1 Order List

| ID | Order Number | UMKM | Creator | Paket | Payment | Status | Total |
|---|---|---|---|---|---|---|---:|
| order_001 | RUK-2026-00124 | Bakso Mas Adi | Raka Visual | Standard Video Reels | paid | in_progress | Rp455.000 |
| order_002 | RUK-2026-00125 | Kopi Sudut Kota | Sinta Studio | Foto Produk | pending | awaiting_payment | Rp180.000 |
| order_003 | RUK-2026-00126 | Batik Loka | Nabila Creative | Desain Feed | paid | submitted | Rp305.000 |
| order_004 | RUK-2026-00127 | Keripik Bu Sari | Dimas Review | Review Produk | paid | revision_requested | Rp355.000 |
| order_005 | RUK-2026-00128 | Roti Lembut Pagi | Fadd Graphics | Desain Promosi | paid | completed | Rp255.000 |

### 13.2 Contoh Object

```ts
export const dummyOrders = [
  {
    id: "order_001",
    orderNumber: "RUK-2026-00124",
    umkmId: "umkm_001",
    creatorId: "creator_001",
    campaignBriefId: "brief_001",
    orderStatus: "in_progress",
    paymentStatus: "paid",
    subtotalAmount: 300000,
    addonAmount: 150000,
    adminFee: 5000,
    platformFee: 45000,
    discountAmount: 0,
    totalAmount: 455000,
    deadline: "2026-06-20",
    createdAt: "2026-06-10T08:00:00.000Z",
    completedAt: null,
  },
]
```

## 14. Dummy Order Status History

```ts
export const dummyOrderStatusHistory = [
  {
    id: "history_001",
    orderId: "order_001",
    previousStatus: null,
    newStatus: "awaiting_payment",
    changedBy: "user_umkm_001",
    note: "Order dibuat dari checkout brief campaign.",
    createdAt: "2026-06-10T08:00:00.000Z",
  },
  {
    id: "history_002",
    orderId: "order_001",
    previousStatus: "awaiting_payment",
    newStatus: "paid",
    changedBy: "system",
    note: "Pembayaran berhasil melalui payment dummy.",
    createdAt: "2026-06-10T08:05:00.000Z",
  },
  {
    id: "history_003",
    orderId: "order_001",
    previousStatus: "paid",
    newStatus: "brief_accepted",
    changedBy: "user_creator_001",
    note: "Creator menerima brief campaign.",
    createdAt: "2026-06-10T09:00:00.000Z",
  },
  {
    id: "history_004",
    orderId: "order_001",
    previousStatus: "brief_accepted",
    newStatus: "in_progress",
    changedBy: "user_creator_001",
    note: "Creator mulai memproduksi konten.",
    createdAt: "2026-06-10T10:00:00.000Z",
  },
]
```

## 15. Dummy Payments

```ts
export const dummyPayments = [
  {
    id: "payment_001",
    orderId: "order_001",
    paymentNumber: "PAY-RUK-2026-00124",
    paymentStatus: "paid",
    paymentMethod: "qris",
    amount: 455000,
    provider: "dummy",
    providerTransactionId: "DUMMY-TRX-00124",
    providerPaymentUrl: "/umkm/payments/payment_001",
    paidAt: "2026-06-10T08:05:00.000Z",
    expiredAt: "2026-06-11T08:00:00.000Z",
  },
  {
    id: "payment_002",
    orderId: "order_002",
    paymentNumber: "PAY-RUK-2026-00125",
    paymentStatus: "pending",
    paymentMethod: "bank_transfer",
    amount: 180000,
    provider: "dummy",
    providerTransactionId: "DUMMY-TRX-00125",
    providerPaymentUrl: "/umkm/payments/payment_002",
    paidAt: null,
    expiredAt: "2026-06-11T09:00:00.000Z",
  },
]
```

## 16. Dummy Invoices

```ts
export const dummyInvoices = [
  {
    id: "invoice_001",
    orderId: "order_001",
    paymentId: "payment_001",
    invoiceNumber: "INV-RUK-2026-00124",
    subtotalAmount: 300000,
    addonAmount: 150000,
    adminFee: 5000,
    platformFee: 45000,
    discountAmount: 0,
    totalAmount: 455000,
    issuedAt: "2026-06-10T08:00:00.000Z",
    paidAt: "2026-06-10T08:05:00.000Z",
    invoiceUrl: null,
  },
]
```

## 17. Dummy Submissions

```ts
export const dummySubmissions = [
  {
    id: "submission_001",
    orderId: "order_003",
    creatorId: "creator_002",
    title: "Draft Desain Feed Batik Loka",
    description:
      "Berikut draft desain feed untuk promosi koleksi batik lokal dengan gaya modern.",
    fileUrls: [],
    externalLinks: ["https://drive.google.com/example"],
    captionText:
      "Batik lokal dengan sentuhan modern untuk gaya harian yang tetap berkarakter.",
    submissionType: "design",
    versionNumber: 1,
    submittedAt: "2026-06-12T13:00:00.000Z",
  },
]
```

## 18. Dummy Revisions

```ts
export const dummyRevisions = [
  {
    id: "revision_001",
    orderId: "order_004",
    submissionId: "submission_002",
    requestedBy: "user_umkm_005",
    revisionStatus: "requested",
    revisionNote:
      "Mohon bagian pembuka dibuat lebih singkat dan produk ditampilkan lebih jelas pada 3 detik pertama.",
    referenceUrls: [],
    responseNote: null,
    resolvedAt: null,
    createdAt: "2026-06-13T10:00:00.000Z",
  },
]
```

## 19. Dummy Reviews

```ts
export const dummyReviews = [
  {
    id: "review_001",
    orderId: "order_005",
    umkmId: "umkm_003",
    creatorId: "creator_005",
    rating: 5,
    qualityRating: 5,
    communicationRating: 5,
    timelinessRating: 4,
    comment:
      "Hasil desainnya rapi dan sesuai dengan brief. Komunikasi juga jelas, revisi kecil langsung dibantu.",
    isVisible: true,
    createdAt: "2026-06-14T09:00:00.000Z",
  },
]
```

## 20. Dummy Complaints

```ts
export const dummyComplaints = [
  {
    id: "complaint_001",
    orderId: "order_004",
    openedBy: "user_umkm_005",
    assignedAdminId: "user_admin_001",
    complaintStatus: "under_review",
    subject: "Hasil review belum sesuai brief",
    description:
      "UMKM merasa bagian pembuka video belum menampilkan produk dengan jelas sesuai brief awal.",
    resolutionNote: null,
    resolvedAt: null,
    createdAt: "2026-06-13T11:00:00.000Z",
  },
]
```

## 21. Dummy Notifications

```ts
export const dummyNotifications = [
  {
    id: "notif_001",
    userId: "user_umkm_001",
    notificationType: "payment",
    title: "Pembayaran berhasil",
    message: "Pembayaran untuk order RUK-2026-00124 sudah berhasil.",
    actionUrl: "/umkm/orders/order_001",
    isRead: false,
    createdAt: "2026-06-10T08:05:00.000Z",
  },
  {
    id: "notif_002",
    userId: "user_creator_001",
    notificationType: "order",
    title: "Order baru masuk",
    message: "Bakso Mas Adi memesan paket Standard Video Reels.",
    actionUrl: "/creator/orders/order_001",
    isRead: false,
    createdAt: "2026-06-10T08:06:00.000Z",
  },
]
```

## 22. Dummy Dashboard Metrics

### 22.1 UMKM Dashboard

```ts
export const dummyUmkmMetrics = {
  activeOrders: 2,
  completedOrders: 4,
  pendingPayments: 1,
  savedBriefs: 3,
  totalSpending: 1260000,
  latestResultCount: 2,
}
```

### 22.2 Creator Dashboard

```ts
export const dummyCreatorMetrics = {
  activeOrders: 3,
  completedOrders: 42,
  revisionRequests: 1,
  averageRating: 4.8,
  estimatedEarnings: 2350000,
  nearestDeadline: "2026-06-20",
}
```

### 22.3 Admin Dashboard

```ts
export const dummyAdminMetrics = {
  totalUsers: 128,
  totalUmkm: 74,
  totalCreators: 54,
  totalOrders: 196,
  activeOrders: 27,
  completedOrders: 142,
  pendingPayments: 9,
  activeComplaints: 3,
  grossTransactionValue: 58750000,
  platformRevenue: 5875000,
}
```

## 23. Dummy Reports

```ts
export const dummyMonthlyReports = [
  { month: "Jan", orders: 15, revenue: 615000, gtv: 6150000 },
  { month: "Feb", orders: 20, revenue: 820000, gtv: 8200000 },
  { month: "Mar", orders: 25, revenue: 1025000, gtv: 10250000 },
  { month: "Apr", orders: 30, revenue: 1230000, gtv: 12300000 },
  { month: "Mei", orders: 38, revenue: 1558000, gtv: 15580000 },
  { month: "Jun", orders: 45, revenue: 1845000, gtv: 18450000 },
]
```

Catatan:

`revenue` di sini adalah pendapatan platform dari komisi dan biaya admin, bukan seluruh nilai transaksi bruto.

## 24. Dummy Search Filters

```ts
export const dummyCatalogFilters = {
  categories: [
    "Video TikTok/Reels",
    "Desain Feed Instagram",
    "Foto Produk",
    "Review Produk",
    "Caption Promosi",
    "Campaign UMKM",
  ],
  locations: ["Purbalingga", "Purwokerto", "Banyumas", "Wonosobo"],
  niches: ["Kuliner", "Fashion", "Beauty", "Produk Lokal", "Lifestyle", "Branding"],
  priceRanges: [
    { label: "Di bawah Rp150.000", min: 0, max: 150000 },
    { label: "Rp150.000 - Rp300.000", min: 150000, max: 300000 },
    { label: "Rp300.000 - Rp500.000", min: 300000, max: 500000 },
    { label: "Di atas Rp500.000", min: 500000, max: null },
  ],
  ratings: [5, 4, 3],
}
```

## 25. Dummy Empty States

Gunakan copy berikut untuk empty state.

### 25.1 UMKM Orders Empty

```txt
Belum ada pesanan.
Pesanan jasa digital yang Anda buat akan muncul di sini.
```

### 25.2 Creator Orders Empty

```txt
Belum ada order masuk.
Order dari UMKM akan muncul setelah mereka memilih paket layanan Anda.
```

### 25.3 Admin Complaints Empty

```txt
Belum ada komplain aktif.
Komplain dari UMKM atau kreator akan tampil di halaman ini.
```

### 25.4 Portfolio Empty

```txt
Belum ada portofolio.
Tambahkan contoh karya agar UMKM lebih percaya dengan layanan Anda.
```

## 26. Dummy UI Copy

### 26.1 Homepage Hero

```txt
Temukan Kreator yang Tepat untuk Promosi UMKM Anda
```

Description:

```txt
Ruang Usaha Kita membantu UMKM mencari content creator, membuat brief promosi, dan memantau proses pembuatan konten secara lebih mudah dan terarah.
```

CTA:

```txt
Cari Kreator
Lihat Cara Kerja
```

### 26.2 Catalog

```txt
Cari kreator, layanan, atau kategori
```

### 26.3 Checkout

```txt
Isi Brief Campaign
Jelaskan kebutuhan promosi Anda agar kreator dapat memahami arah konten sejak awal.
```

### 26.4 Payment

```txt
Pembayaran akan diverifikasi sebelum pesanan diteruskan ke kreator.
```

### 26.5 Order

```txt
Pantau proses pengerjaan konten dari brief diterima sampai hasil dikirim.
```

## 27. Dummy Status Labels

```ts
export const dummyOrderStatusLabels = {
  draft: "Draft",
  awaiting_payment: "Menunggu Pembayaran",
  paid: "Dibayar",
  waiting_creator_confirmation: "Menunggu Konfirmasi Kreator",
  brief_accepted: "Brief Diterima",
  in_progress: "Konten Diproduksi",
  submitted: "Hasil Dikirim",
  revision_requested: "Revisi Diminta",
  revised: "Revisi Dikirim",
  completed: "Selesai",
  cancelled: "Dibatalkan",
  refunded: "Refund",
}
```

```ts
export const dummyPaymentStatusLabels = {
  pending: "Menunggu Pembayaran",
  paid: "Dibayar",
  failed: "Gagal",
  expired: "Kedaluwarsa",
  refunded: "Refund",
  partially_refunded: "Refund Sebagian",
}
```

## 28. Lokasi File Dummy Data

Rekomendasi lokasi:

```txt
src/lib/dummy
├── creators.ts
├── umkm.ts
├── categories.ts
├── services.ts
├── portfolios.ts
├── cart.ts
├── briefs.ts
├── orders.ts
├── payments.ts
├── reviews.ts
├── complaints.ts
├── notifications.ts
├── reports.ts
└── index.ts
```

Jika ingin lebih domain-oriented:

```txt
src/features/catalog/data/dummy-creators.ts
src/features/orders/data/dummy-orders.ts
src/features/payments/data/dummy-payments.ts
```

Untuk awal, lebih sederhana pakai:

```txt
src/lib/dummy
```

## 29. Export Strategy

Gunakan `index.ts`:

```ts
export * from "./creators"
export * from "./umkm"
export * from "./categories"
export * from "./services"
export * from "./portfolios"
export * from "./cart"
export * from "./briefs"
export * from "./orders"
export * from "./payments"
export * from "./reviews"
export * from "./complaints"
export * from "./notifications"
export * from "./reports"
```

## 30. Testing dengan Dummy Data

Dummy data harus mendukung skenario:

1. Guest browse katalog.
2. UMKM checkout.
3. Payment pending.
4. Payment paid.
5. Creator menerima order.
6. Creator mengirim hasil.
7. UMKM meminta revisi.
8. Creator mengirim revisi.
9. UMKM menyelesaikan order.
10. UMKM memberi review.
11. Admin melihat laporan.

## 31. Kesimpulan

Dummy data Ruang Usaha Kita harus cukup lengkap untuk membangun UI dan flow sebelum Supabase aktif. Data tidak boleh terlalu random. Semua data harus saling terhubung: creator punya layanan, layanan punya tier, UMKM punya order, order punya payment, order punya brief, submission, revisi, dan review.

Dengan dummy data yang rapi, proses vibe coding akan lebih stabil karena Codex tidak perlu mengarang data setiap kali membuat halaman baru.
