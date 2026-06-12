import { isDemoMode } from "@/lib/config/demo-mode";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type Tables = Database["public"]["Tables"];

type CreatorRow = Tables["creator_profiles"]["Row"];
type InvoiceRow = Tables["invoices"]["Row"];
type OrderItemRow = Tables["order_items"]["Row"];
type OrderRow = Tables["orders"]["Row"];
type PaymentRow = Tables["payments"]["Row"];
type UmkmRow = Tables["umkm_profiles"]["Row"];

export type CurrentUmkmPaymentDetail = {
  creator: Pick<CreatorRow, "city" | "display_name" | "id"> | null;
  invoice: InvoiceRow | null;
  order: OrderRow;
  payment: PaymentRow;
  primaryItem: OrderItemRow | null;
  umkm: Pick<UmkmRow, "business_name" | "id">;
};

type CurrentUmkmContext = {
  supabase: Awaited<ReturnType<typeof createClient>>;
  umkm: UmkmRow;
};

async function getCurrentUmkmContext(): Promise<CurrentUmkmContext | null> {
  if (isDemoMode()) {
    return null;
  }

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

export async function getCurrentUmkmPaymentDetail(
  paymentId: string,
): Promise<CurrentUmkmPaymentDetail | null> {
  try {
    const context = await getCurrentUmkmContext();

    if (!context) {
      return null;
    }

    const { data: payment, error: paymentError } = await context.supabase
      .from("payments")
      .select("*")
      .eq("id", paymentId)
      .maybeSingle();

    if (paymentError || !payment) {
      return null;
    }

    const { data: order, error: orderError } = await context.supabase
      .from("orders")
      .select("*")
      .eq("id", payment.order_id)
      .eq("umkm_id", context.umkm.id)
      .maybeSingle();

    if (orderError || !order) {
      return null;
    }

    const [creatorResult, itemResult, invoiceResult] = await Promise.all([
      context.supabase
        .from("creator_profiles")
        .select("id, display_name, city")
        .eq("id", order.creator_id)
        .maybeSingle(),
      context.supabase
        .from("order_items")
        .select("*")
        .eq("order_id", order.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle(),
      context.supabase
        .from("invoices")
        .select("*")
        .eq("order_id", order.id)
        .eq("payment_id", payment.id)
        .maybeSingle(),
    ]);

    return {
      creator: creatorResult.data ?? null,
      invoice: invoiceResult.data ?? null,
      order,
      payment,
      primaryItem: itemResult.data ?? null,
      umkm: {
        business_name: context.umkm.business_name,
        id: context.umkm.id,
      },
    };
  } catch {
    return null;
  }
}
