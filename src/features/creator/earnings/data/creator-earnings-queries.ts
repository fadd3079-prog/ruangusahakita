import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type Tables = Database["public"]["Tables"];
type OrderRow = Tables["orders"]["Row"];
type PaymentRow = Tables["payments"]["Row"];

export type CreatorEarningsTransaction = {
  amount: number;
  createdAt: string;
  id: string;
  orderNumber: string;
  orderStatus: OrderRow["order_status"];
  paymentStatus: PaymentRow["payment_status"];
  serviceTitle: string;
};

export type CreatorEarningsData = {
  metrics: {
    activeOrderValue: number;
    completedIncome: number;
    completedOrders: number;
    paidOrderCount: number;
    pendingIncome: number;
    totalOrders: number;
  };
  transactions: readonly CreatorEarningsTransaction[];
};

const emptyCreatorEarningsData: CreatorEarningsData = {
  metrics: {
    activeOrderValue: 0,
    completedIncome: 0,
    completedOrders: 0,
    paidOrderCount: 0,
    pendingIncome: 0,
    totalOrders: 0,
  },
  transactions: [],
};

async function getCurrentCreatorContext() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return null;
  }

  const { data: account, error: accountError } = await supabase
    .from("profiles")
    .select("role, account_status")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (
    accountError ||
    !account ||
    account.role !== "creator" ||
    account.account_status !== "active"
  ) {
    return null;
  }

  const { data: creator, error: creatorError } = await supabase
    .from("creator_profiles")
    .select("id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (creatorError || !creator) {
    return null;
  }

  return { creator, supabase };
}

function toNumber(value: number | string | null | undefined) {
  return Number(value ?? 0);
}

function getCreatorNetAmount(order: OrderRow) {
  return (
    toNumber(order.subtotal_amount) +
    toNumber(order.addon_amount) -
    toNumber(order.platform_fee)
  );
}

export async function getCurrentCreatorEarnings(): Promise<CreatorEarningsData> {
  try {
    const context = await getCurrentCreatorContext();

    if (!context) {
      return emptyCreatorEarningsData;
    }

    const { data: orders, error: ordersError } = await context.supabase
      .from("orders")
      .select("*")
      .eq("creator_id", context.creator.id)
      .order("created_at", { ascending: false })
      .limit(200);

    if (ordersError || !orders || orders.length === 0) {
      return emptyCreatorEarningsData;
    }

    const orderIds = orders.map((order) => order.id);
    const [paymentsResult, itemsResult] = await Promise.all([
      context.supabase.from("payments").select("*").in("order_id", orderIds),
      context.supabase.from("order_items").select("*").in("order_id", orderIds),
    ]);

    const paidOrderIds = new Set(
      (paymentsResult.data ?? [])
        .filter((payment) => payment.payment_status === "paid")
        .map((payment) => payment.order_id),
    );
    const firstItemByOrderId = new Map<string, Tables["order_items"]["Row"]>();

    for (const item of itemsResult.data ?? []) {
      if (!firstItemByOrderId.has(item.order_id)) {
        firstItemByOrderId.set(item.order_id, item);
      }
    }

    const paidOrders = orders.filter((order) => paidOrderIds.has(order.id));
    const completedOrders = paidOrders.filter(
      (order) => order.order_status === "completed",
    );
    const activePaidOrders = paidOrders.filter(
      (order) =>
        order.order_status !== "completed" &&
        order.order_status !== "cancelled" &&
        order.order_status !== "refunded",
    );

    return {
      metrics: {
        activeOrderValue: activePaidOrders.reduce(
          (total, order) => total + toNumber(order.total_amount),
          0,
        ),
        completedIncome: completedOrders.reduce(
          (total, order) => total + getCreatorNetAmount(order),
          0,
        ),
        completedOrders: completedOrders.length,
        paidOrderCount: paidOrders.length,
        pendingIncome: activePaidOrders.reduce(
          (total, order) => total + getCreatorNetAmount(order),
          0,
        ),
        totalOrders: orders.length,
      },
      transactions: paidOrders.slice(0, 20).map((order) => ({
        amount: getCreatorNetAmount(order),
        createdAt: order.created_at,
        id: order.id,
        orderNumber: order.order_number,
        orderStatus: order.order_status,
        paymentStatus: order.payment_status,
        serviceTitle:
          firstItemByOrderId.get(order.id)?.service_title ?? "Paket jasa digital",
      })),
    };
  } catch {
    return emptyCreatorEarningsData;
  }
}
