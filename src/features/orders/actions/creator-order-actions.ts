"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { sendOrderEventEmail } from "@/lib/email/order-notifications";
import { createClient } from "@/lib/supabase/server";

const creatorOrderErrorCodes = [
  "not_authenticated",
  "not_creator",
  "order_not_acceptable",
  "order_not_startable",
] as const;

type CreatorOrderErrorCode = (typeof creatorOrderErrorCodes)[number];

function getCreatorOrderErrorCode(
  message: string,
): CreatorOrderErrorCode | "order_lifecycle" {
  return (
    creatorOrderErrorCodes.find((code) => message.includes(code)) ??
    "order_lifecycle"
  );
}

function getText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export async function acceptCreatorOrder(formData: FormData) {
  const orderId = getText(formData, "orderId");

  if (!orderId) {
    redirect("/creator/orders?error=order");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("accept_creator_order", {
    target_order_id: orderId,
  });

  if (error || !data) {
    const code = getCreatorOrderErrorCode(error?.message ?? "");
    redirect(`/creator/orders/${orderId}?error=${code}`);
  }

  revalidatePath("/creator/orders");
  revalidatePath(`/creator/orders/${orderId}`);
  revalidatePath("/creator/dashboard");
  await sendOrderEventEmail(orderId, "creator_accepted");
  redirect(`/creator/orders/${orderId}?accepted=1`);
}

export async function startCreatorOrder(formData: FormData) {
  const orderId = getText(formData, "orderId");

  if (!orderId) {
    redirect("/creator/orders?error=order");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("start_creator_order", {
    target_order_id: orderId,
  });

  if (error || !data) {
    const code = getCreatorOrderErrorCode(error?.message ?? "");
    redirect(`/creator/orders/${orderId}?error=${code}`);
  }

  revalidatePath("/creator/orders");
  revalidatePath(`/creator/orders/${orderId}`);
  revalidatePath("/creator/dashboard");
  await sendOrderEventEmail(orderId, "creator_started");
  redirect(`/creator/orders/${orderId}?started=1`);
}
