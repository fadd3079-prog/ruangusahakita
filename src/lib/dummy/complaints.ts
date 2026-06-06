import type { DummyComplaint } from "@/lib/dummy/types";

export const dummyComplaints: readonly DummyComplaint[] = [
  {
    id: "complaint_001",
    orderId: "order_004",
    openedBy: "user_umkm_005",
    assignedAdminId: "user_admin_001",
    complaintStatus: "under_review",
    subject: "Hasil review belum sesuai tone brand",
    description:
      "UMKM meminta mediasi karena hasil konten review terasa terlalu bercanda dan belum menonjolkan keunggulan rasa utama.",
    resolutionNote: null,
    resolvedAt: null,
    createdAt: "2026-06-06T09:40:00.000Z",
  },
];
