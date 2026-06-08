import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type Tables = Database["public"]["Tables"];

type BriefRow = Tables["campaign_briefs"]["Row"];
type CreatorRow = Tables["creator_profiles"]["Row"];
type InvoiceRow = Tables["invoices"]["Row"];
type OrderRow = Tables["orders"]["Row"];
type OrderItemAddonRow = Tables["order_item_addons"]["Row"];
type OrderItemRow = Tables["order_items"]["Row"];
type OrderStatusHistoryRow = Tables["order_status_history"]["Row"];
type PaymentRow = Tables["payments"]["Row"];
type UmkmRow = Tables["umkm_profiles"]["Row"];

export type UmkmOrderListItem = {
  id: string;
  orderNumber: string;
  orderStatus: OrderRow["order_status"];
  paymentStatus: OrderRow["payment_status"];
  creatorName: string;
  serviceTitle: string;
  tierName: string | null;
  totalAmount: number;
  deadline: string | null;
  createdAt: string;
};

export type UmkmOrderDetailItemAddon = {
  id: string;
  addonName: string;
  price: number;
};

export type UmkmOrderDetailItem = {
  id: string;
  serviceTitle: string;
  tierName: string | null;
  unitPrice: number;
  addonTotal: number;
  subtotal: number;
  estimatedDays: number | null;
  revisionCount: number | null;
  deliverables: readonly string[];
  addons: readonly UmkmOrderDetailItemAddon[];
};

export type UmkmOrderBrief = {
  businessName: string;
  campaignGoal: string;
  contentPlatforms: readonly string[];
  contentStyle: string | null;
  deadline: string | null;
  promotedProduct: string;
  targetAudience: string | null;
};

export type UmkmOrderDetail = {
  brief: UmkmOrderBrief | null;
  creatorCity: string | null;
  creatorName: string;
  history: readonly OrderStatusHistoryRow[];
  invoice: InvoiceRow | null;
  items: readonly UmkmOrderDetailItem[];
  order: OrderRow;
  payment: PaymentRow | null;
};

type CurrentUmkmContext = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  umkm: UmkmRow;
};

function toNumber(value: number | string | null | undefined) {
  return Number(value ?? 0);
}

function unique(values: readonly (string | null | undefined)[]) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

async function getCurrentUmkmContext(): Promise<CurrentUmkmContext | null> {
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
    profile.role !== "umkm" ||
    profile.account_status !== "active"
  ) {
    return null;
  }

  const { data: umkm, error: umkmError } = await supabase
    .from("umkm_profiles")
    .select("*")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (umkmError || !umkm) {
    return null;
  }

  return { supabase, umkm };
}

export async function getCurrentUmkmOrders(): Promise<readonly UmkmOrderListItem[]> {
  try {
    const context = await getCurrentUmkmContext();

    if (!context) {
      return [];
    }

    const { data: orders, error: orderError } = await context.supabase
      .from("orders")
      .select("*")
      .eq("umkm_id", context.umkm.id)
      .order("created_at", { ascending: false });

    if (orderError || !orders || orders.length === 0) {
      return [];
    }

    const orderIds = orders.map((order) => order.id);
    const creatorIds = unique(orders.map((order) => order.creator_id));

    const [itemsResult, creatorsResult] = await Promise.all([
      context.supabase.from("order_items").select("*").in("order_id", orderIds),
      creatorIds.length > 0
        ? context.supabase.from("creator_profiles").select("*").in("id", creatorIds)
        : Promise.resolve({ data: [] as CreatorRow[], error: null }),
    ]);

    const itemsByOrderId = groupByOrderId(itemsResult.data ?? []);
    const creatorsById = new Map(
      (creatorsResult.data ?? []).map((creator) => [creator.id, creator]),
    );

    return orders.map((order): UmkmOrderListItem => {
      const firstItem = itemsByOrderId.get(order.id)?.[0] ?? null;
      const creator = creatorsById.get(order.creator_id);

      return {
        createdAt: order.created_at,
        creatorName: creator?.display_name ?? "Kreator",
        deadline: order.deadline,
        id: order.id,
        orderNumber: order.order_number,
        orderStatus: order.order_status,
        paymentStatus: order.payment_status,
        serviceTitle: firstItem?.service_title ?? "Paket jasa digital",
        tierName: firstItem?.tier_name ?? null,
        totalAmount: toNumber(order.total_amount),
      };
    });
  } catch {
    return [];
  }
}

export async function getCurrentUmkmOrderDetail(
  orderId: string,
): Promise<UmkmOrderDetail | null> {
  try {
    const context = await getCurrentUmkmContext();

    if (!context) {
      return null;
    }

    const { data: order, error: orderError } = await context.supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .eq("umkm_id", context.umkm.id)
      .maybeSingle();

    if (orderError || !order) {
      return null;
    }

    const [
      creatorResult,
      itemsResult,
      briefResult,
      paymentResult,
      invoiceResult,
      historyResult,
    ] = await Promise.all([
      context.supabase
        .from("creator_profiles")
        .select("*")
        .eq("id", order.creator_id)
        .maybeSingle(),
      context.supabase
        .from("order_items")
        .select("*")
        .eq("order_id", order.id)
        .order("created_at", { ascending: true }),
      order.campaign_brief_id
        ? context.supabase
            .from("campaign_briefs")
            .select("*")
            .eq("id", order.campaign_brief_id)
            .maybeSingle()
        : Promise.resolve({ data: null as BriefRow | null, error: null }),
      context.supabase
        .from("payments")
        .select("*")
        .eq("order_id", order.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      context.supabase
        .from("invoices")
        .select("*")
        .eq("order_id", order.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      context.supabase
        .from("order_status_history")
        .select("*")
        .eq("order_id", order.id)
        .order("created_at", { ascending: true }),
    ]);

    const items = itemsResult.data ?? [];
    const itemIds = items.map((item) => item.id);
    const { data: addons } =
      itemIds.length > 0
        ? await context.supabase
            .from("order_item_addons")
            .select("*")
            .in("order_item_id", itemIds)
        : { data: [] as OrderItemAddonRow[] };

    const addonsByItemId = groupAddonsByOrderItemId(addons ?? []);
    const creator = creatorResult.data;

    return {
      brief: briefResult.data ? mapBrief(briefResult.data) : null,
      creatorCity: creator?.city ?? null,
      creatorName: creator?.display_name ?? "Kreator",
      history: historyResult.data ?? [],
      invoice: invoiceResult.data ?? null,
      items: items.map((item) => mapOrderItem(item, addonsByItemId.get(item.id) ?? [])),
      order,
      payment: paymentResult.data ?? null,
    };
  } catch {
    return null;
  }
}

function groupByOrderId(items: readonly OrderItemRow[]) {
  const map = new Map<string, OrderItemRow[]>();

  for (const item of items) {
    const current = map.get(item.order_id) ?? [];
    current.push(item);
    map.set(item.order_id, current);
  }

  return map;
}

function groupAddonsByOrderItemId(addons: readonly OrderItemAddonRow[]) {
  const map = new Map<string, OrderItemAddonRow[]>();

  for (const addon of addons) {
    const current = map.get(addon.order_item_id) ?? [];
    current.push(addon);
    map.set(addon.order_item_id, current);
  }

  return map;
}

function mapBrief(brief: BriefRow): UmkmOrderBrief {
  return {
    businessName: brief.business_name,
    campaignGoal: brief.campaign_goal,
    contentPlatforms: brief.content_platforms ?? [],
    contentStyle: brief.content_style,
    deadline: brief.deadline,
    promotedProduct: brief.promoted_product,
    targetAudience: brief.target_audience,
  };
}

function mapOrderItem(
  item: OrderItemRow,
  addons: readonly OrderItemAddonRow[],
): UmkmOrderDetailItem {
  return {
    addonTotal: toNumber(item.addon_total),
    addons: addons.map((addon) => ({
      addonName: addon.addon_name,
      id: addon.id,
      price: toNumber(addon.price),
    })),
    deliverables: item.deliverables ?? [],
    estimatedDays: item.estimated_days,
    id: item.id,
    revisionCount: item.revision_count,
    serviceTitle: item.service_title,
    subtotal: toNumber(item.subtotal),
    tierName: item.tier_name,
    unitPrice: toNumber(item.unit_price),
  };
}
