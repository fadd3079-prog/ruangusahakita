import type {
  DummyAdminDashboardReport,
  DummyCreatorDashboardReport,
  DummyMonthlyReport,
  DummyUmkmDashboardReport,
} from "@/lib/dummy/types";

export const dummyMonthlyReports: readonly DummyMonthlyReport[] = [
  {
    month: "2026-01",
    orders: 15,
    grossTransactionValue: 6150000,
    platformFeeRevenue: 615000,
    adminFeeRevenue: 75000,
    platformRevenue: 690000,
  },
  {
    month: "2026-02",
    orders: 20,
    grossTransactionValue: 8200000,
    platformFeeRevenue: 820000,
    adminFeeRevenue: 100000,
    platformRevenue: 920000,
  },
  {
    month: "2026-03",
    orders: 25,
    grossTransactionValue: 10250000,
    platformFeeRevenue: 1025000,
    adminFeeRevenue: 125000,
    platformRevenue: 1150000,
  },
  {
    month: "2026-04",
    orders: 30,
    grossTransactionValue: 12300000,
    platformFeeRevenue: 1230000,
    adminFeeRevenue: 150000,
    platformRevenue: 1380000,
  },
  {
    month: "2026-05",
    orders: 38,
    grossTransactionValue: 15580000,
    platformFeeRevenue: 1558000,
    adminFeeRevenue: 190000,
    platformRevenue: 1748000,
  },
  {
    month: "2026-06",
    orders: 45,
    grossTransactionValue: 18450000,
    platformFeeRevenue: 1845000,
    adminFeeRevenue: 225000,
    platformRevenue: 2070000,
  },
];

export const dummyUmkmDashboardReports: readonly DummyUmkmDashboardReport[] = [
  {
    umkmId: "umkm_001",
    activeOrders: 1,
    completedOrders: 0,
    awaitingReview: 0,
    totalSpend: 455000,
  },
  {
    umkmId: "umkm_003",
    activeOrders: 0,
    completedOrders: 1,
    awaitingReview: 0,
    totalSpend: 255000,
  },
  {
    umkmId: "umkm_004",
    activeOrders: 1,
    completedOrders: 0,
    awaitingReview: 1,
    totalSpend: 305000,
  },
];

export const dummyCreatorDashboardReports: readonly DummyCreatorDashboardReport[] = [
  {
    creatorId: "creator_001",
    activeOrders: 1,
    completedOrders: 0,
    averageRating: 4.9,
    estimatedEarnings: 405000,
  },
  {
    creatorId: "creator_002",
    activeOrders: 1,
    completedOrders: 0,
    averageRating: 4.8,
    estimatedEarnings: 270000,
  },
  {
    creatorId: "creator_005",
    activeOrders: 0,
    completedOrders: 1,
    averageRating: 4.6,
    estimatedEarnings: 225000,
  },
];

export const dummyAdminDashboardReport: DummyAdminDashboardReport = {
  totalUsers: 12,
  totalUmkm: 5,
  totalCreators: 6,
  activeOrders: 4,
  grossTransactionValue: 70930000,
  platformRevenue: 7958000,
};
