import type { DummyNotification } from "@/lib/dummy/types";

export const dummyNotifications: readonly DummyNotification[] = [
  {
    id: "notification_001",
    userId: "user_umkm_001",
    notificationType: "payment",
    title: "Pembayaran berhasil",
    message:
      "Pembayaran untuk pesanan RUK-2026-00124 berhasil. Kreator sudah dapat mulai memproses brief campaign.",
    actionUrl: "/umkm/orders/order_001",
    isRead: true,
    createdAt: "2026-06-01T10:13:00.000Z",
  },
  {
    id: "notification_002",
    userId: "user_creator_001",
    notificationType: "brief",
    title: "Brief campaign baru",
    message:
      "Bakso Mas Adi mengirim brief campaign untuk paket Video Reels Kuliner untuk UMKM.",
    actionUrl: "/creator/orders/order_001",
    isRead: false,
    createdAt: "2026-06-01T10:15:00.000Z",
  },
  {
    id: "notification_003",
    userId: "user_umkm_004",
    notificationType: "result",
    title: "Hasil konten siap direview",
    message:
      "Nabila Creative sudah mengirim hasil konten untuk pesanan RUK-2026-00126.",
    actionUrl: "/umkm/orders/order_003",
    isRead: false,
    createdAt: "2026-06-06T06:25:00.000Z",
  },
  {
    id: "notification_004",
    userId: "user_creator_003",
    notificationType: "revision",
    title: "Revisi diminta UMKM",
    message:
      "Keripik Bu Sari meminta revisi untuk hasil konten review pada pesanan RUK-2026-00127.",
    actionUrl: "/creator/orders/order_004",
    isRead: false,
    createdAt: "2026-06-06T09:20:00.000Z",
  },
  {
    id: "notification_005",
    userId: "user_admin_001",
    notificationType: "complaint",
    title: "Komplain perlu ditinjau",
    message:
      "Komplain baru masuk untuk pesanan RUK-2026-00127 dan menunggu catatan mediasi admin.",
    actionUrl: "/admin/complaints/complaint_001",
    isRead: false,
    createdAt: "2026-06-06T09:40:00.000Z",
  },
  {
    id: "notification_006",
    userId: "user_umkm_003",
    notificationType: "review",
    title: "Review berhasil dikirim",
    message:
      "Review untuk Fadd Graphics sudah tersimpan dan membantu kreator menjaga kualitas layanan digital.",
    actionUrl: "/umkm/orders/order_005",
    isRead: true,
    createdAt: "2026-06-07T12:01:00.000Z",
  },
  {
    id: "notification_007",
    userId: "user_umkm_004",
    notificationType: "payment",
    title: "Pembayaran kedaluwarsa",
    message:
      "Batas pembayaran dummy untuk pesanan RUK-2026-00129 sudah lewat. Silakan buat pesanan baru jika campaign masih diperlukan.",
    actionUrl: "/umkm/orders/order_006",
    isRead: false,
    createdAt: "2026-06-05T15:31:00.000Z",
  },
];
