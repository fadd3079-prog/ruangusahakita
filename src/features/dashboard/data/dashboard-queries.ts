import type { SupabaseClient } from "@supabase/supabase-js";

import {
  getCreatorStatsFromMap,
  getCreatorStatsMap,
} from "@/features/creators/data/creator-stats";
import { isDemoMode } from "@/lib/config/demo-mode";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type DashboardClient = SupabaseClient<Database>;
type Tables = Database["public"]["Tables"];
type Enums = Database["public"]["Enums"];

export type DashboardOrderStatus = Enums["order_status"];
export type DashboardPaymentStatus = Enums["payment_status"];
export type DashboardComplaintStatus = Enums["complaint_status"];
export type DashboardPaymentMethod = Enums["payment_method"];
export type ProfileRow = Tables["profiles"]["Row"];
export type UmkmProfileRow = Tables["umkm_profiles"]["Row"];
export type CreatorProfileRow = Tables["creator_profiles"]["Row"];
export type ServicePackageRow = Tables["service_packages"]["Row"];
export type PortfolioRow = Tables["portfolios"]["Row"];
export type OrderRow = Tables["orders"]["Row"];
export type BriefRow = Tables["campaign_briefs"]["Row"];
export type PaymentRow = Tables["payments"]["Row"];
export type ComplaintRow = Tables["complaints"]["Row"];

export type DashboardOrderSummary = {
  campaignBriefId: string | null;
  completedAt: string | null;
  counterpartName: string;
  createdAt: string;
  creatorName: string | null;
  deadline: string | null;
  id: string;
  orderNumber: string;
  orderStatus: DashboardOrderStatus;
  paymentStatus: DashboardPaymentStatus;
  serviceTitle: string;
  tierName: string | null;
  totalAmount: number;
  umkmName: string | null;
};

export type DashboardBriefSummary = {
  businessCategory: string | null;
  businessName: string;
  campaignGoal: string;
  contentPlatforms: readonly string[];
  createdAt: string;
  deadline: string | null;
  id: string;
  promotedFocus: string;
  status: string;
};

export type DashboardNotificationSummary = {
  actionUrl: string | null;
  createdAt: string;
  id: string;
  isRead: boolean;
  message: string | null;
  title: string;
};

export type DashboardPaymentSummary = {
  amount: number;
  createdAt: string;
  id: string;
  method: DashboardPaymentMethod | null;
  orderId: string;
  orderNumber: string | null;
  paymentNumber: string;
  provider: string | null;
  status: DashboardPaymentStatus;
};

export type DashboardComplaintSummary = {
  createdAt: string;
  id: string;
  orderId: string;
  orderNumber: string | null;
  status: DashboardComplaintStatus;
  subject: string;
};

export type UmkmDashboardOverview = {
  latestResults: readonly DashboardOrderSummary[];
  metrics: {
    activeOrders: number;
    completedOrders: number;
    pendingPayments: number;
    totalSpend: number;
  };
  notifications: readonly DashboardNotificationSummary[];
  pendingPaymentOrders: readonly DashboardOrderSummary[];
  profile: UmkmProfileRow | null;
  recentBriefs: readonly DashboardBriefSummary[];
  recentOrders: readonly DashboardOrderSummary[];
};

export type CreatorDashboardOverview = {
  metrics: {
    activeOrders: number;
    averageRating: number;
    completedOrders: number;
    estimatedEarnings: number;
    revisionRequests: number;
  };
  notifications: readonly DashboardNotificationSummary[];
  portfolios: readonly PortfolioRow[];
  profile: CreatorProfileRow | null;
  recentOrders: readonly DashboardOrderSummary[];
  revisionOrders: readonly DashboardOrderSummary[];
  services: readonly ServicePackageRow[];
};

export type AdminDashboardOverview = {
  activeComplaints: number;
  dataStatus: DashboardDataStatus;
  orderStats: AdminOrderStats;
  paymentStats: AdminPaymentStats;
  recentComplaints: readonly DashboardComplaintSummary[];
  recentOrders: readonly DashboardOrderSummary[];
  recentPayments: readonly DashboardPaymentSummary[];
  serviceStats: AdminServiceStats;
  userStats: AdminUserStats;
  warnings: readonly string[];
};

export type DashboardDataStatus =
  | "available"
  | "demo"
  | "partial"
  | "unavailable";

export type AdminUserStats = {
  totalAdmins: number;
  totalCreators: number;
  totalUmkm: number;
  totalUsers: number;
};

export type AdminServiceStats = {
  activeServices: number;
  totalCategories: number;
  totalServices: number;
};

export type AdminOrderStats = {
  activeOrders: number;
  grossTransactionValue: number;
  platformRevenue: number;
  totalOrders: number;
};

export type AdminPaymentStats = {
  failedOrExpired: number;
  pending: number;
  refunded: number;
  totalPaid: number;
  totalPaidAmount: number;
};

const activeOrderStatuses: readonly DashboardOrderStatus[] = [
  "paid",
  "waiting_creator_confirmation",
  "brief_accepted",
  "in_progress",
  "submitted",
  "revision_requested",
  "revised",
];

const resultOrderStatuses: readonly DashboardOrderStatus[] = [
  "submitted",
  "revision_requested",
  "completed",
];

const activeComplaintStatuses: readonly DashboardComplaintStatus[] = [
  "open",
  "under_review",
  "waiting_umkm",
  "waiting_creator",
];

const emptyUmkmOverview: UmkmDashboardOverview = {
  latestResults: [],
  metrics: {
    activeOrders: 0,
    completedOrders: 0,
    pendingPayments: 0,
    totalSpend: 0,
  },
  notifications: [],
  pendingPaymentOrders: [],
  profile: null,
  recentBriefs: [],
  recentOrders: [],
};

const emptyCreatorOverview: CreatorDashboardOverview = {
  metrics: {
    activeOrders: 0,
    averageRating: 0,
    completedOrders: 0,
    estimatedEarnings: 0,
    revisionRequests: 0,
  },
  notifications: [],
  portfolios: [],
  profile: null,
  recentOrders: [],
  revisionOrders: [],
  services: [],
};

const emptyAdminUserStats: AdminUserStats = {
  totalAdmins: 0,
  totalCreators: 0,
  totalUmkm: 0,
  totalUsers: 0,
};

const emptyAdminServiceStats: AdminServiceStats = {
  activeServices: 0,
  totalCategories: 0,
  totalServices: 0,
};

const emptyAdminOrderStats: AdminOrderStats = {
  activeOrders: 0,
  grossTransactionValue: 0,
  platformRevenue: 0,
  totalOrders: 0,
};

const emptyAdminPaymentStats: AdminPaymentStats = {
  failedOrExpired: 0,
  pending: 0,
  refunded: 0,
  totalPaid: 0,
  totalPaidAmount: 0,
};

function createEmptyAdminOverview(
  dataStatus: DashboardDataStatus,
  warnings: readonly string[],
): AdminDashboardOverview {
  return {
    activeComplaints: 0,
    dataStatus,
    orderStats: emptyAdminOrderStats,
    paymentStats: emptyAdminPaymentStats,
    recentComplaints: [],
    recentOrders: [],
    recentPayments: [],
    serviceStats: emptyAdminServiceStats,
    userStats: emptyAdminUserStats,
    warnings,
  };
}

const emptyAdminOverview = createEmptyAdminOverview("unavailable", [
  "Data admin belum dapat dimuat.",
]);

async function withDashboardClient<T>(
  fallback: T,
  callback: (supabase: DashboardClient) => Promise<T>,
) {
  if (isDemoMode()) {
    return fallback;
  }

  try {
    const supabase = await createClient();
    return await callback(supabase);
  } catch {
    return fallback;
  }
}

async function getCurrentUserId(supabase: DashboardClient) {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user.id;
}

async function getCurrentProfileRow(supabase: DashboardClient) {
  const userId = await getCurrentUserId(supabase);

  if (!userId) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

async function getCurrentUmkmProfileRow(supabase: DashboardClient) {
  const userId = await getCurrentUserId(supabase);

  if (!userId) {
    return null;
  }

  const { data, error } = await supabase
    .from("umkm_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

async function getCurrentCreatorProfileRow(supabase: DashboardClient) {
  const userId = await getCurrentUserId(supabase);

  if (!userId) {
    return null;
  }

  const { data, error } = await supabase
    .from("creator_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

async function isCurrentAdmin(supabase: DashboardClient) {
  const profile = await getCurrentProfileRow(supabase);
  return profile?.role === "admin" && profile.account_status === "active";
}

function toNumber(value: number | string | null | undefined) {
  return Number(value ?? 0);
}

function getUniqueValues(values: readonly (string | null | undefined)[]) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

function isActiveOrderStatus(status: DashboardOrderStatus) {
  return activeOrderStatuses.includes(status);
}

async function getOrdersForUmkm(
  supabase: DashboardClient,
  umkmId: string,
  limit: number,
) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("umkm_id", umkmId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data;
}

async function getOrdersForCreator(
  supabase: DashboardClient,
  creatorId: string,
  limit: number,
) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("creator_id", creatorId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data;
}

async function getRecentAdminOrders(supabase: DashboardClient, limit: number) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data;
}

async function enrichOrders(
  supabase: DashboardClient,
  orders: readonly OrderRow[],
  counterpart: "creator" | "umkm" | "both",
): Promise<readonly DashboardOrderSummary[]> {
  if (orders.length === 0) {
    return [];
  }

  const orderIds = getUniqueValues(orders.map((order) => order.id));
  const creatorIds = getUniqueValues(orders.map((order) => order.creator_id));
  const umkmIds = getUniqueValues(orders.map((order) => order.umkm_id));

  const [itemsResult, creatorsResult, umkmResult] = await Promise.all([
    supabase.from("order_items").select("*").in("order_id", orderIds),
    creatorIds.length > 0
      ? supabase.from("creator_profiles").select("*").in("id", creatorIds)
      : Promise.resolve({ data: [] as CreatorProfileRow[], error: null }),
    umkmIds.length > 0
      ? supabase.from("umkm_profiles").select("*").in("id", umkmIds)
      : Promise.resolve({ data: [] as UmkmProfileRow[], error: null }),
  ]);

  const firstItemByOrderId = new Map<string, Tables["order_items"]["Row"]>();

  for (const item of itemsResult.data ?? []) {
    if (!firstItemByOrderId.has(item.order_id)) {
      firstItemByOrderId.set(item.order_id, item);
    }
  }

  const creatorById = new Map(
    (creatorsResult.data ?? []).map((creator) => [creator.id, creator]),
  );
  const umkmById = new Map((umkmResult.data ?? []).map((umkm) => [umkm.id, umkm]));

  return orders.map((order) => {
    const item = firstItemByOrderId.get(order.id);
    const creator = creatorById.get(order.creator_id);
    const umkm = umkmById.get(order.umkm_id);
    const creatorName = creator?.display_name ?? null;
    const umkmName = umkm?.business_name ?? null;

    return {
      campaignBriefId: order.campaign_brief_id,
      completedAt: order.completed_at,
      counterpartName:
        counterpart === "creator"
          ? creatorName ?? "Kreator"
          : counterpart === "umkm"
            ? umkmName ?? "UMKM"
            : `${umkmName ?? "UMKM"} · ${creatorName ?? "kreator"}`,
      createdAt: order.created_at,
      creatorName,
      deadline: order.deadline,
      id: order.id,
      orderNumber: order.order_number,
      orderStatus: order.order_status,
      paymentStatus: order.payment_status,
      serviceTitle: item?.service_title ?? "Paket jasa digital",
      tierName: item?.tier_name ?? null,
      totalAmount: toNumber(order.total_amount),
      umkmName,
    };
  });
}

async function getBriefsForUmkm(
  supabase: DashboardClient,
  umkmId: string,
  limit: number,
) {
  const { data, error } = await supabase
    .from("campaign_briefs")
    .select("*")
    .eq("umkm_id", umkmId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data.map((brief): DashboardBriefSummary => ({
    businessCategory: brief.business_category,
    businessName: brief.business_name,
    campaignGoal: brief.campaign_goal,
    contentPlatforms: brief.content_platforms ?? [],
    createdAt: brief.created_at,
    deadline: brief.deadline,
    id: brief.id,
    promotedFocus: brief.promoted_product,
    status: brief.status,
  }));
}

async function getNotificationsForUser(
  supabase: DashboardClient,
  userId: string,
  limit: number,
) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data.map((notification): DashboardNotificationSummary => ({
    actionUrl: notification.action_url,
    createdAt: notification.created_at,
    id: notification.id,
    isRead: notification.is_read,
    message: notification.message,
    title: notification.title,
  }));
}

async function getServicesForCreator(
  supabase: DashboardClient,
  creatorId: string,
  limit: number,
) {
  const { data, error } = await supabase
    .from("service_packages")
    .select("*")
    .eq("creator_id", creatorId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data;
}

async function getPortfoliosForCreator(
  supabase: DashboardClient,
  creatorId: string,
  limit: number,
) {
  const { data, error } = await supabase
    .from("portfolios")
    .select("*")
    .eq("creator_id", creatorId)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .limit(limit);

  if (error || !data) {
    return [];
  }

  return data;
}

async function countRows(
  supabase: DashboardClient,
  table:
    | "profiles"
    | "service_categories"
    | "service_packages"
    | "orders"
    | "payments"
    | "complaints",
) {
  const { count, error } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true });

  if (error || typeof count !== "number") {
    return 0;
  }

  return count;
}

export async function getCurrentUmkmProfile() {
  return withDashboardClient<UmkmProfileRow | null>(null, getCurrentUmkmProfileRow);
}

export async function getCurrentUmkmRecentOrders(limit = 5) {
  return withDashboardClient<readonly DashboardOrderSummary[]>([], async (supabase) => {
    const profile = await getCurrentUmkmProfileRow(supabase);

    if (!profile) {
      return [];
    }

    const orders = await getOrdersForUmkm(supabase, profile.id, limit);
    return enrichOrders(supabase, orders, "creator");
  });
}

export async function getCurrentUmkmRecentBriefs(limit = 3) {
  return withDashboardClient<readonly DashboardBriefSummary[]>([], async (supabase) => {
    const profile = await getCurrentUmkmProfileRow(supabase);

    if (!profile) {
      return [];
    }

    return getBriefsForUmkm(supabase, profile.id, limit);
  });
}

export async function getUmkmDashboardOverview() {
  return withDashboardClient<UmkmDashboardOverview>(emptyUmkmOverview, async (supabase) => {
    const profile = await getCurrentUmkmProfileRow(supabase);

    if (!profile) {
      return emptyUmkmOverview;
    }

    const [orders, recentBriefs, notifications] = await Promise.all([
      getOrdersForUmkm(supabase, profile.id, 50),
      getBriefsForUmkm(supabase, profile.id, 3),
      getNotificationsForUser(supabase, profile.user_id, 4),
    ]);
    const summaries = await enrichOrders(supabase, orders, "creator");
    const latestResults = summaries.filter((order) =>
      resultOrderStatuses.includes(order.orderStatus),
    );
    const pendingPaymentOrders = summaries.filter(
      (order) => order.paymentStatus === "pending",
    );

    return {
      latestResults: latestResults.slice(0, 3),
      metrics: {
        activeOrders: summaries.filter((order) =>
          isActiveOrderStatus(order.orderStatus),
        ).length,
        completedOrders: summaries.filter((order) => order.orderStatus === "completed")
          .length,
        pendingPayments: pendingPaymentOrders.length,
        totalSpend: summaries.reduce(
          (total, order) => total + order.totalAmount,
          0,
        ),
      },
      notifications,
      pendingPaymentOrders: pendingPaymentOrders.slice(0, 4),
      profile,
      recentBriefs,
      recentOrders: summaries.slice(0, 5),
    };
  });
}

export async function getCurrentCreatorProfile() {
  return withDashboardClient<CreatorProfileRow | null>(
    null,
    getCurrentCreatorProfileRow,
  );
}

export async function getCurrentCreatorServices(limit = 5) {
  return withDashboardClient<readonly ServicePackageRow[]>([], async (supabase) => {
    const profile = await getCurrentCreatorProfileRow(supabase);

    if (!profile) {
      return [];
    }

    return getServicesForCreator(supabase, profile.id, limit);
  });
}

export async function getCurrentCreatorRecentOrders(limit = 5) {
  return withDashboardClient<readonly DashboardOrderSummary[]>([], async (supabase) => {
    const profile = await getCurrentCreatorProfileRow(supabase);

    if (!profile) {
      return [];
    }

    const orders = await getOrdersForCreator(supabase, profile.id, limit);
    return enrichOrders(supabase, orders, "umkm");
  });
}

export async function getCurrentCreatorPortfolioPreview(limit = 4) {
  return withDashboardClient<readonly PortfolioRow[]>([], async (supabase) => {
    const profile = await getCurrentCreatorProfileRow(supabase);

    if (!profile) {
      return [];
    }

    return getPortfoliosForCreator(supabase, profile.id, limit);
  });
}

export async function getCreatorDashboardOverview() {
  return withDashboardClient<CreatorDashboardOverview>(
    emptyCreatorOverview,
    async (supabase) => {
      const profile = await getCurrentCreatorProfileRow(supabase);

      if (!profile) {
        return emptyCreatorOverview;
      }

      const [orders, services, portfolios, notifications] = await Promise.all([
        getOrdersForCreator(supabase, profile.id, 50),
        getServicesForCreator(supabase, profile.id, 5),
        getPortfoliosForCreator(supabase, profile.id, 4),
        getNotificationsForUser(supabase, profile.user_id, 4),
      ]);
      const statsMap = await getCreatorStatsMap(
        supabase,
        [profile.id],
        [
          {
            averageRating: profile.average_rating,
            completedOrdersCount: profile.completed_orders_count,
            id: profile.id,
          },
        ],
      );
      const stats = getCreatorStatsFromMap(statsMap, profile.id);
      const summaries = await enrichOrders(supabase, orders, "umkm");
      const revisionOrders = summaries.filter(
        (order) => order.orderStatus === "revision_requested",
      );
      const completedOrders = orders.filter(
        (order) => order.order_status === "completed",
      );

      return {
        metrics: {
          activeOrders: summaries.filter((order) =>
            isActiveOrderStatus(order.orderStatus),
          ).length,
          averageRating: stats.averageRating,
          completedOrders: completedOrders.length,
          estimatedEarnings: completedOrders.reduce(
            (total, order) =>
              total +
              toNumber(order.subtotal_amount) +
              toNumber(order.addon_amount) -
              toNumber(order.platform_fee),
            0,
          ),
          revisionRequests: revisionOrders.length,
        },
        notifications,
        portfolios,
        profile,
        recentOrders: summaries.slice(0, 5),
        revisionOrders: revisionOrders.slice(0, 4),
        services,
      };
    },
  );
}

export async function getAdminUserStats() {
  return withDashboardClient<AdminUserStats>(emptyAdminUserStats, async (supabase) => {
    if (!(await isCurrentAdmin(supabase))) {
      return emptyAdminUserStats;
    }

    const [totalUsers, umkmResult, creatorResult, adminResult] = await Promise.all([
      countRows(supabase, "profiles"),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "umkm"),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "creator"),
      supabase
        .from("profiles")
        .select("id", { count: "exact", head: true })
        .eq("role", "admin"),
    ]);

    return {
      totalAdmins: adminResult.count ?? 0,
      totalCreators: creatorResult.count ?? 0,
      totalUmkm: umkmResult.count ?? 0,
      totalUsers,
    };
  });
}

export async function getAdminServiceStats() {
  return withDashboardClient<AdminServiceStats>(
    emptyAdminServiceStats,
    async (supabase) => {
      if (!(await isCurrentAdmin(supabase))) {
        return emptyAdminServiceStats;
      }

      const [totalCategories, totalServices, activeServicesResult] =
        await Promise.all([
          countRows(supabase, "service_categories"),
          countRows(supabase, "service_packages"),
          supabase
            .from("service_packages")
            .select("id", { count: "exact", head: true })
            .eq("is_active", true)
            .is("deleted_at", null),
        ]);

      return {
        activeServices: activeServicesResult.count ?? 0,
        totalCategories,
        totalServices,
      };
    },
  );
}

export async function getAdminOrderStats() {
  return withDashboardClient<AdminOrderStats>(emptyAdminOrderStats, async (supabase) => {
    if (!(await isCurrentAdmin(supabase))) {
      return emptyAdminOrderStats;
    }

    const orders = await getRecentAdminOrders(supabase, 200);

    return {
      activeOrders: orders.filter((order) => isActiveOrderStatus(order.order_status))
        .length,
      grossTransactionValue: orders.reduce(
        (total, order) => total + toNumber(order.total_amount),
        0,
      ),
      platformRevenue: orders.reduce(
        (total, order) =>
          total + toNumber(order.platform_fee) + toNumber(order.admin_fee),
        0,
      ),
      totalOrders: orders.length,
    };
  });
}

export async function getAdminPaymentStats() {
  return withDashboardClient<AdminPaymentStats>(
    emptyAdminPaymentStats,
    async (supabase) => {
      if (!(await isCurrentAdmin(supabase))) {
        return emptyAdminPaymentStats;
      }

      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);

      if (error || !data) {
        return emptyAdminPaymentStats;
      }

      return {
        failedOrExpired: data.filter(
          (payment) =>
            payment.payment_status === "failed" ||
            payment.payment_status === "expired",
        ).length,
        pending: data.filter((payment) => payment.payment_status === "pending")
          .length,
        refunded: data.filter(
          (payment) =>
            payment.payment_status === "refunded" ||
            payment.payment_status === "partially_refunded",
        ).length,
        totalPaid: data.filter((payment) => payment.payment_status === "paid").length,
        totalPaidAmount: data
          .filter((payment) => payment.payment_status === "paid")
          .reduce((total, payment) => total + toNumber(payment.amount), 0),
      };
    },
  );
}

export async function getAdminDashboardOverview() {
  if (isDemoMode()) {
    return createEmptyAdminOverview("demo", [
      "Mode demo aktif. Ringkasan ditampilkan tanpa membaca Supabase.",
    ]);
  }

  return withDashboardClient<AdminDashboardOverview>(
    emptyAdminOverview,
    async (supabase) => {
      if (!(await isCurrentAdmin(supabase))) {
        return createEmptyAdminOverview("unavailable", [
          "Sesi admin aktif tidak dapat diverifikasi.",
        ]);
      }

      const labels = [
        "Ringkasan pengguna",
        "Ringkasan layanan",
        "Ringkasan pesanan",
        "Ringkasan pembayaran",
        "Pesanan terbaru",
        "Pembayaran terbaru",
        "Komplain terbaru",
        "Jumlah komplain aktif",
      ] as const;
      const results = await Promise.allSettled([
        loadAdminUserStats(supabase),
        loadAdminServiceStats(supabase),
        loadAdminOrderStats(supabase),
        loadAdminPaymentStats(supabase),
        loadRecentAdminOrders(supabase, 5),
        loadRecentPayments(supabase, 5),
        loadRecentComplaints(supabase, 5),
        loadActiveComplaintCount(supabase),
      ] as const);
      const warnings = results.flatMap((result, index) =>
        result.status === "rejected"
          ? [`${labels[index]} tidak dapat dimuat.`]
          : [],
      );

      const userStats = getSettledValue(results[0], emptyAdminUserStats);
      const serviceStats = getSettledValue(results[1], emptyAdminServiceStats);
      const orderStats = getSettledValue(results[2], emptyAdminOrderStats);
      const paymentStats = getSettledValue(results[3], emptyAdminPaymentStats);
      const recentOrders = getSettledValue(results[4], []);
      const recentPayments = getSettledValue(results[5], []);
      const recentComplaints = getSettledValue(results[6], []);
      const activeComplaints = getSettledValue(results[7], 0);
      const dataStatus: DashboardDataStatus =
        warnings.length === 0
          ? "available"
          : warnings.length === results.length
            ? "unavailable"
            : "partial";

      return {
        activeComplaints,
        dataStatus,
        orderStats,
        paymentStats,
        recentComplaints,
        recentOrders,
        recentPayments,
        serviceStats,
        userStats,
        warnings,
      };
    },
  );
}

function getSettledValue<T>(
  result: PromiseSettledResult<T>,
  fallback: T,
): T {
  return result.status === "fulfilled" ? result.value : fallback;
}

async function loadAdminUserStats(supabase: DashboardClient) {
  const [totalResult, umkmResult, creatorResult, adminResult] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "umkm"),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "creator"),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "admin"),
  ]);

  if (
    totalResult.error ||
    umkmResult.error ||
    creatorResult.error ||
    adminResult.error
  ) {
    throw new Error("admin_user_stats_unavailable");
  }

  return {
    totalAdmins: adminResult.count ?? 0,
    totalCreators: creatorResult.count ?? 0,
    totalUmkm: umkmResult.count ?? 0,
    totalUsers: totalResult.count ?? 0,
  } satisfies AdminUserStats;
}

async function loadAdminServiceStats(supabase: DashboardClient) {
  const [categoryResult, serviceResult, activeResult] = await Promise.all([
    supabase
      .from("service_categories")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("service_packages")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("service_packages")
      .select("id", { count: "exact", head: true })
      .eq("is_active", true)
      .is("deleted_at", null),
  ]);

  if (categoryResult.error || serviceResult.error || activeResult.error) {
    throw new Error("admin_service_stats_unavailable");
  }

  return {
    activeServices: activeResult.count ?? 0,
    totalCategories: categoryResult.count ?? 0,
    totalServices: serviceResult.count ?? 0,
  } satisfies AdminServiceStats;
}

async function loadAdminOrderStats(supabase: DashboardClient) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error || !data) {
    throw new Error("admin_order_stats_unavailable");
  }

  return {
    activeOrders: data.filter((order) => isActiveOrderStatus(order.order_status))
      .length,
    grossTransactionValue: data.reduce(
      (total, order) => total + toNumber(order.total_amount),
      0,
    ),
    platformRevenue: data.reduce(
      (total, order) =>
        total + toNumber(order.platform_fee) + toNumber(order.admin_fee),
      0,
    ),
    totalOrders: data.length,
  } satisfies AdminOrderStats;
}

async function loadAdminPaymentStats(supabase: DashboardClient) {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error || !data) {
    throw new Error("admin_payment_stats_unavailable");
  }

  return {
    failedOrExpired: data.filter(
      (payment) =>
        payment.payment_status === "failed" ||
        payment.payment_status === "expired",
    ).length,
    pending: data.filter((payment) => payment.payment_status === "pending").length,
    refunded: data.filter(
      (payment) =>
        payment.payment_status === "refunded" ||
        payment.payment_status === "partially_refunded",
    ).length,
    totalPaid: data.filter((payment) => payment.payment_status === "paid").length,
    totalPaidAmount: data
      .filter((payment) => payment.payment_status === "paid")
      .reduce((total, payment) => total + toNumber(payment.amount), 0),
  } satisfies AdminPaymentStats;
}

async function loadRecentAdminOrders(supabase: DashboardClient, limit: number) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    throw new Error("admin_recent_orders_unavailable");
  }

  return enrichOrders(supabase, data, "both");
}

async function loadRecentPayments(supabase: DashboardClient, limit: number) {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    throw new Error("admin_recent_payments_unavailable");
  }

  const orderIds = getUniqueValues(data.map((payment) => payment.order_id));
  const { data: orders, error: orderError } =
    orderIds.length > 0
      ? await supabase.from("orders").select("*").in("id", orderIds)
      : { data: [] as OrderRow[], error: null };

  if (orderError) {
    throw new Error("admin_recent_payment_orders_unavailable");
  }

  const orderById = new Map((orders ?? []).map((order) => [order.id, order]));
  return data.map((payment): DashboardPaymentSummary => ({
    amount: toNumber(payment.amount),
    createdAt: payment.created_at,
    id: payment.id,
    method: payment.payment_method,
    orderId: payment.order_id,
    orderNumber: orderById.get(payment.order_id)?.order_number ?? null,
    paymentNumber: payment.payment_number,
    provider: payment.provider,
    status: payment.payment_status,
  }));
}

async function loadRecentComplaints(supabase: DashboardClient, limit: number) {
  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    throw new Error("admin_recent_complaints_unavailable");
  }

  const orderIds = getUniqueValues(data.map((complaint) => complaint.order_id));
  const { data: orders, error: orderError } =
    orderIds.length > 0
      ? await supabase.from("orders").select("*").in("id", orderIds)
      : { data: [] as OrderRow[], error: null };

  if (orderError) {
    throw new Error("admin_recent_complaint_orders_unavailable");
  }

  const orderById = new Map((orders ?? []).map((order) => [order.id, order]));
  return data.map((complaint): DashboardComplaintSummary => ({
    createdAt: complaint.created_at,
    id: complaint.id,
    orderId: complaint.order_id,
    orderNumber: orderById.get(complaint.order_id)?.order_number ?? null,
    status: complaint.complaint_status,
    subject: complaint.subject,
  }));
}

async function loadActiveComplaintCount(supabase: DashboardClient) {
  const { count, error } = await supabase
    .from("complaints")
    .select("id", { count: "exact", head: true })
    .in("complaint_status", [...activeComplaintStatuses]);

  if (error || typeof count !== "number") {
    throw new Error("admin_active_complaints_unavailable");
  }

  return count;
}
