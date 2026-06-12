"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

const orderCreationErrorCodes = [
  "addon_unavailable",
  "brief_required",
  "cart_empty",
  "not_authenticated",
  "not_umkm",
  "service_unavailable",
  "single_creator_required",
] as const;

type OrderCreationErrorCode = (typeof orderCreationErrorCodes)[number];

function getOrderCreationErrorCode(message: string): OrderCreationErrorCode | "order_create" {
  return orderCreationErrorCodes.find((code) => message.includes(code)) ?? "order_create";
}

export async function createOrderFromCheckout() {
  const supabase = await createClient();
  const { data: orderId, error } = await supabase.rpc(
    "create_order_from_current_cart",
  );

  if (error || !orderId) {
    const code = getOrderCreationErrorCode(error?.message ?? "");

    if (code === "cart_empty") {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const { data: umkm } = user
        ? await supabase
            .from("umkm_profiles")
            .select("id")
            .eq("user_id", user.id)
            .maybeSingle()
        : { data: null };
      const { data: existingOrder } = umkm
        ? await supabase
            .from("orders")
            .select("id")
            .eq("umkm_id", umkm.id)
            .eq("order_status", "awaiting_payment")
            .eq("payment_status", "pending")
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle()
        : { data: null };

      if (existingOrder) {
        revalidatePath("/umkm/cart");
        revalidatePath("/umkm/checkout");
        revalidatePath("/umkm/orders");
        redirect(`/umkm/orders/${existingOrder.id}?created=1`);
      }
    }

    redirect(`/umkm/checkout?error=${code}`);
  }

  revalidatePath("/umkm/cart");
  revalidatePath("/umkm/checkout");
  revalidatePath("/umkm/orders");
  redirect(`/umkm/orders/${orderId}?created=1`);
}
