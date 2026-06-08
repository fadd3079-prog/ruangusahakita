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
    redirect(`/umkm/payments/${paymentId}?error=${code}`);
  }

  revalidatePath(`/umkm/payments/${paymentId}`);
  revalidatePath(`/umkm/orders/${orderId}`);
  revalidatePath("/umkm/orders");
  revalidatePath("/umkm/dashboard");
  redirect(`/umkm/orders/${orderId}?paid=1`);
}
