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

export type PaymentActionState = {
  ok: boolean;
  message: string;
  redirectTo?: string;
};

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

export async function markSandboxPaymentAsPaidWithState(
  _previousState: PaymentActionState,
  formData: FormData,
): Promise<PaymentActionState> {
  const paymentId = getText(formData, "paymentId");

  if (!paymentId) {
    return {
      message: "Pembayaran tidak ditemukan.",
      ok: false,
    };
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
        return {
          message: "Pembayaran sudah diproses sebelumnya.",
          ok: true,
          redirectTo: `/umkm/orders/${existingPayment.order_id}?already_paid=1`,
        };
      }
    }

    return {
      message: getPaymentActionMessage(code),
      ok: false,
    };
  }

  revalidatePath(`/umkm/payments/${paymentId}`);
  revalidatePath(`/umkm/orders/${orderId}`);
  revalidatePath("/umkm/orders");
  revalidatePath("/umkm/dashboard");
  return {
    message: "Pembayaran berhasil diproses.",
    ok: true,
    redirectTo: `/umkm/orders/${orderId}?paid=1`,
  };
}

function getPaymentActionMessage(code: PaymentErrorCode | "payment_update") {
  const messages = {
    not_authenticated: "Silakan masuk terlebih dahulu.",
    not_umkm: "Hanya akun UMKM aktif yang dapat memproses pembayaran.",
    payment_amount_mismatch: "Nominal pembayaran tidak sesuai.",
    payment_not_payable: "Pembayaran sudah berubah atau tidak bisa diproses.",
    payment_update: "Pembayaran belum bisa diproses saat ini.",
  };

  return messages[code];
}
