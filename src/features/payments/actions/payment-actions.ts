"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

const paymentErrorCodes = [
  "not_authenticated",
  "not_umkm",
  "payment_amount_mismatch",
  "payment_not_payable",
] as const;

type PaymentErrorCode = (typeof paymentErrorCodes)[number];

function getPaymentErrorCode(message: string): PaymentErrorCode | "payment_update" {
  return paymentErrorCodes.find((code) => message.includes(code)) ?? "payment_update";
}

function getText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export async function markSandboxPaymentAsPaid(formData: FormData) {
  const paymentId = getText(formData, "paymentId");

  if (!paymentId) {
    redirect("/umkm/orders?error=payment");
  }

  const supabase = await createClient();
  const { data: orderId, error } = await supabase.rpc("mark_sandbox_payment_as_paid", {
    target_payment_id: paymentId,
  });

  if (error || !orderId) {
    const code = getPaymentErrorCode(error?.message ?? "");

    if (code === "payment_not_payable") {
      const { data: existingPayment } = await supabase
        .from("payments")
        .select("order_id, payment_status, orders!inner(umkm_id, payment_status, order_status)")
        .eq("id", paymentId)
        .maybeSingle();

      if (
        existingPayment?.payment_status === "paid" &&
        existingPayment.orders?.payment_status === "paid"
      ) {
        revalidatePath(`/umkm/payments/${paymentId}`);
        revalidatePath(`/umkm/orders/${existingPayment.order_id}`);
        revalidatePath("/umkm/orders");
        revalidatePath("/umkm/dashboard");
        redirect(`/umkm/orders/${existingPayment.order_id}?already_paid=1`);
      }
    }

    redirect(`/umkm/payments/${paymentId}?error=${code}`);
  }

  revalidatePath(`/umkm/payments/${paymentId}`);
  revalidatePath(`/umkm/orders/${orderId}`);
  revalidatePath("/umkm/orders");
  revalidatePath("/umkm/dashboard");
  redirect(`/umkm/orders/${orderId}?paid=1`);
}
