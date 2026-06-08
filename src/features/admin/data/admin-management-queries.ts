import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type Tables = Database["public"]["Tables"];
type Enums = Database["public"]["Enums"];

export type AdminProfileRow = Tables["profiles"]["Row"];
export type AdminUmkmRow = Tables["umkm_profiles"]["Row"] & {
  activeOrdersCount: number;
};
export type AdminCreatorRow = Tables["creator_profiles"]["Row"];
export type AdminServiceRow = Tables["service_packages"]["Row"] & {
  categoryName: string | null;
  creatorName: string | null;
};
export type AdminComplaintRow = Tables["complaints"]["Row"] & {
  openedByRole: Enums["user_role"] | null;
  orderNumber: string | null;
};
export type AdminPaymentRow = Tables["payments"]["Row"] & {
  creatorName: string | null;
  orderNumber: string | null;
  serviceTitle: string | null;
  umkmName: string | null;
};
export type AdminOrderRow = Tables["orders"]["Row"] & {
  creatorName: string | null;
  serviceTitle: string | null;
  tierName: string | null;
  umkmName: string | null;
};
export type AdminOrderDetailData = {
  brief: Tables["campaign_briefs"]["Row"] | null;
  creator: Tables["creator_profiles"]["Row"] | null;
  history: readonly Tables["order_status_history"]["Row"][];
  items: readonly Tables["order_items"]["Row"][];
  order: Tables["orders"]["Row"];
  payment: Tables["payments"]["Row"] | null;
  umkm: Tables["umkm_profiles"]["Row"] | null;
};

const activeOrderStatuses: readonly Enums["order_status"][] = [
  "paid",
  "waiting_creator_confirmation",
  "brief_accepted",
  "in_progress",
  "submitted",
  "revision_requested",
  "revised",
];

async function getAdminClient() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, account_status")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (
    profileError ||
    !profile ||
    profile.role !== "admin" ||
    profile.account_status !== "active"
  ) {
    return null;
  }

  return supabase;
}

function toNumber(value: number | string | null | undefined) {
  return Number(value ?? 0);
}

function unique(values: readonly (string | null | undefined)[]) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

export async function getAdminUsers(): Promise<readonly AdminProfileRow[]> {
  const supabase = await getAdminClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return error || !data ? [] : data;
}

export async function getAdminUmkmProfiles(): Promise<readonly AdminUmkmRow[]> {
  const supabase = await getAdminClient();

  if (!supabase) {
    return [];
  }

  const { data: umkmProfiles, error } = await supabase
    .from("umkm_profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error || !umkmProfiles) {
    return [];
  }

  const umkmIds = umkmProfiles.map((profile) => profile.id);
  const { data: orders } =
    umkmIds.length > 0
      ? await supabase.from("orders").select("id, umkm_id, order_status").in("umkm_id", umkmIds)
      : { data: [] as Pick<Tables["orders"]["Row"], "id" | "order_status" | "umkm_id">[] };
  const activeOrdersByUmkmId = new Map<string, number>();

  for (const order of orders ?? []) {
    if (!activeOrderStatuses.includes(order.order_status)) {
      continue;
    }

    activeOrdersByUmkmId.set(
      order.umkm_id,
      (activeOrdersByUmkmId.get(order.umkm_id) ?? 0) + 1,
    );
  }

  return umkmProfiles.map((profile) => ({
    ...profile,
    activeOrdersCount: activeOrdersByUmkmId.get(profile.id) ?? 0,
  }));
}

export async function getAdminCreators(): Promise<readonly AdminCreatorRow[]> {
  const supabase = await getAdminClient();

  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("creator_profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return error || !data ? [] : data;
}

export async function getAdminServices(): Promise<readonly AdminServiceRow[]> {
  const supabase = await getAdminClient();

  if (!supabase) {
    return [];
  }

  const { data: services, error } = await supabase
    .from("service_packages")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(200);

  if (error || !services) {
    return [];
  }

  const categoryIds = unique(services.map((service) => service.category_id));
  const creatorIds = unique(services.map((service) => service.creator_id));
  const [categoriesResult, creatorsResult] = await Promise.all([
    categoryIds.length > 0
      ? supabase.from("service_categories").select("id, name").in("id", categoryIds)
      : Promise.resolve({ data: [] as Pick<Tables["service_categories"]["Row"], "id" | "name">[], error: null }),
    creatorIds.length > 0
      ? supabase.from("creator_profiles").select("id, display_name").in("id", creatorIds)
      : Promise.resolve({ data: [] as Pick<Tables["creator_profiles"]["Row"], "display_name" | "id">[], error: null }),
  ]);
  const categoryById = new Map(
    (categoriesResult.data ?? []).map((category) => [category.id, category.name]),
  );
  const creatorById = new Map(
    (creatorsResult.data ?? []).map((creator) => [creator.id, creator.display_name]),
  );

  return services.map((service) => ({
    ...service,
    categoryName: service.category_id ? categoryById.get(service.category_id) ?? null : null,
    creatorName: creatorById.get(service.creator_id) ?? null,
  }));
}

export async function getAdminComplaints(): Promise<readonly AdminComplaintRow[]> {
  const supabase = await getAdminClient();

  if (!supabase) {
    return [];
  }

  const { data: complaints, error } = await supabase
    .from("complaints")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error || !complaints) {
    return [];
  }

  const orderIds = unique(complaints.map((complaint) => complaint.order_id));
  const openerIds = unique(complaints.map((complaint) => complaint.opened_by));
  const [ordersResult, profilesResult] = await Promise.all([
    orderIds.length > 0
      ? supabase.from("orders").select("id, order_number").in("id", orderIds)
      : Promise.resolve({ data: [] as Pick<Tables["orders"]["Row"], "id" | "order_number">[], error: null }),
    openerIds.length > 0
      ? supabase.from("profiles").select("id, role").in("id", openerIds)
      : Promise.resolve({ data: [] as Pick<Tables["profiles"]["Row"], "id" | "role">[], error: null }),
  ]);
  const orderById = new Map(
    (ordersResult.data ?? []).map((order) => [order.id, order.order_number]),
  );
  const roleByProfileId = new Map(
    (profilesResult.data ?? []).map((profile) => [profile.id, profile.role]),
  );

  return complaints.map((complaint) => ({
    ...complaint,
    openedByRole: roleByProfileId.get(complaint.opened_by) ?? null,
    orderNumber: orderById.get(complaint.order_id) ?? null,
  }));
}

export async function getAdminPayments(): Promise<readonly AdminPaymentRow[]> {
  const supabase = await getAdminClient();

  if (!supabase) {
    return [];
  }

  const { data: payments, error } = await supabase
    .from("payments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error || !payments) {
    return [];
  }

  const orderIds = unique(payments.map((payment) => payment.order_id));
  const { data: orders } =
    orderIds.length > 0
      ? await supabase.from("orders").select("*").in("id", orderIds)
      : { data: [] as Tables["orders"]["Row"][] };
  const creatorIds = unique((orders ?? []).map((order) => order.creator_id));
  const umkmIds = unique((orders ?? []).map((order) => order.umkm_id));
  const [itemsResult, creatorsResult, umkmResult] = await Promise.all([
    orderIds.length > 0
      ? supabase.from("order_items").select("*").in("order_id", orderIds)
      : Promise.resolve({ data: [] as Tables["order_items"]["Row"][], error: null }),
    creatorIds.length > 0
      ? supabase.from("creator_profiles").select("id, display_name").in("id", creatorIds)
      : Promise.resolve({ data: [] as Pick<Tables["creator_profiles"]["Row"], "display_name" | "id">[], error: null }),
    umkmIds.length > 0
      ? supabase.from("umkm_profiles").select("id, business_name").in("id", umkmIds)
      : Promise.resolve({ data: [] as Pick<Tables["umkm_profiles"]["Row"], "business_name" | "id">[], error: null }),
  ]);
  const orderById = new Map((orders ?? []).map((order) => [order.id, order]));
  const firstItemByOrderId = new Map<string, Tables["order_items"]["Row"]>();
  const creatorById = new Map(
    (creatorsResult.data ?? []).map((creator) => [creator.id, creator.display_name]),
  );
  const umkmById = new Map(
    (umkmResult.data ?? []).map((umkm) => [umkm.id, umkm.business_name]),
  );

  for (const item of itemsResult.data ?? []) {
    if (!firstItemByOrderId.has(item.order_id)) {
      firstItemByOrderId.set(item.order_id, item);
    }
  }

  return payments.map((payment) => {
    const order = orderById.get(payment.order_id);

    return {
      ...payment,
      creatorName: order ? creatorById.get(order.creator_id) ?? null : null,
      orderNumber: order?.order_number ?? null,
      serviceTitle: firstItemByOrderId.get(payment.order_id)?.service_title ?? null,
      umkmName: order ? umkmById.get(order.umkm_id) ?? null : null,
    };
  });
}

export async function getAdminOrders(limit = 200): Promise<readonly AdminOrderRow[]> {
  const supabase = await getAdminClient();

  if (!supabase) {
    return [];
  }

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !orders) {
    return [];
  }

  const orderIds = orders.map((order) => order.id);
  const creatorIds = unique(orders.map((order) => order.creator_id));
  const umkmIds = unique(orders.map((order) => order.umkm_id));
  const [itemsResult, creatorsResult, umkmResult] = await Promise.all([
    orderIds.length > 0
      ? supabase.from("order_items").select("*").in("order_id", orderIds)
      : Promise.resolve({ data: [] as Tables["order_items"]["Row"][], error: null }),
    creatorIds.length > 0
      ? supabase.from("creator_profiles").select("id, display_name").in("id", creatorIds)
      : Promise.resolve({ data: [] as Pick<Tables["creator_profiles"]["Row"], "display_name" | "id">[], error: null }),
    umkmIds.length > 0
      ? supabase.from("umkm_profiles").select("id, business_name").in("id", umkmIds)
      : Promise.resolve({ data: [] as Pick<Tables["umkm_profiles"]["Row"], "business_name" | "id">[], error: null }),
  ]);
  const firstItemByOrderId = new Map<string, Tables["order_items"]["Row"]>();
  const creatorById = new Map(
    (creatorsResult.data ?? []).map((creator) => [creator.id, creator.display_name]),
  );
  const umkmById = new Map(
    (umkmResult.data ?? []).map((umkm) => [umkm.id, umkm.business_name]),
  );

  for (const item of itemsResult.data ?? []) {
    if (!firstItemByOrderId.has(item.order_id)) {
      firstItemByOrderId.set(item.order_id, item);
    }
  }

  return orders.map((order) => {
    const item = firstItemByOrderId.get(order.id);

    return {
      ...order,
      creatorName: creatorById.get(order.creator_id) ?? null,
      serviceTitle: item?.service_title ?? null,
      tierName: item?.tier_name ?? null,
      umkmName: umkmById.get(order.umkm_id) ?? null,
    };
  });
}

export async function getAdminOrderDetail(
  orderId: string,
): Promise<AdminOrderDetailData | null> {
  const supabase = await getAdminClient();

  if (!supabase) {
    return null;
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (error || !order) {
    return null;
  }

  const [creatorResult, umkmResult, itemResult, briefResult, paymentResult, historyResult] =
    await Promise.all([
      supabase.from("creator_profiles").select("*").eq("id", order.creator_id).maybeSingle(),
      supabase.from("umkm_profiles").select("*").eq("id", order.umkm_id).maybeSingle(),
      supabase
        .from("order_items")
        .select("*")
        .eq("order_id", order.id)
        .order("created_at", { ascending: true }),
      order.campaign_brief_id
        ? supabase
            .from("campaign_briefs")
            .select("*")
            .eq("id", order.campaign_brief_id)
            .maybeSingle()
        : Promise.resolve({ data: null as Tables["campaign_briefs"]["Row"] | null, error: null }),
      supabase
        .from("payments")
        .select("*")
        .eq("order_id", order.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("order_status_history")
        .select("*")
        .eq("order_id", order.id)
        .order("created_at", { ascending: true }),
    ]);

  return {
    brief: briefResult.data ?? null,
    creator: creatorResult.data ?? null,
    history: historyResult.data ?? [],
    items: itemResult.data ?? [],
    order,
    payment: paymentResult.data ?? null,
    umkm: umkmResult.data ?? null,
  };
}

export async function getAdminReportMetrics() {
  const supabase = await getAdminClient();

  if (!supabase) {
    return {
      activeComplaints: 0,
      completedOrders: 0,
      grossTransactionValue: 0,
      paidAmount: 0,
      platformRevenue: 0,
      totalOrders: 0,
    };
  }

  const [ordersResult, paymentsResult, complaintsResult] = await Promise.all([
    supabase.from("orders").select("*").limit(500),
    supabase.from("payments").select("*").limit(500),
    supabase
      .from("complaints")
      .select("*")
      .in("complaint_status", ["open", "under_review", "waiting_umkm", "waiting_creator"]),
  ]);
  const orders = ordersResult.data ?? [];
  const paidPayments = (paymentsResult.data ?? []).filter(
    (payment) => payment.payment_status === "paid",
  );

  return {
    activeComplaints: complaintsResult.data?.length ?? 0,
    completedOrders: orders.filter((order) => order.order_status === "completed").length,
    grossTransactionValue: orders.reduce(
      (total, order) => total + toNumber(order.total_amount),
      0,
    ),
    paidAmount: paidPayments.reduce(
      (total, payment) => total + toNumber(payment.amount),
      0,
    ),
    platformRevenue: orders.reduce(
      (total, order) =>
        total + toNumber(order.platform_fee) + toNumber(order.admin_fee),
      0,
    ),
    totalOrders: orders.length,
  };
}
