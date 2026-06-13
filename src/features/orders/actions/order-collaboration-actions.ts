"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getNumber(formData: FormData, key: string) {
  const value = Number(getText(formData, key));
  return Number.isFinite(value) ? value : 0;
}

function getReturnPath(formData: FormData, fallback: string) {
  const value = getText(formData, "returnPath");
  return value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}

function getErrorCode(message: string) {
  const codes = [
    "complaint_required",
    "invalid_rating",
    "message_required",
    "not_authenticated",
    "not_umkm",
    "order_not_accessible",
    "order_not_reviewable",
    "review_exists",
  ] as const;

  return codes.find((code) => message.includes(code)) ?? "save";
}

export async function submitOrderReviewAction(formData: FormData) {
  const orderId = getText(formData, "orderId");
  const returnPath = getReturnPath(formData, `/umkm/orders/${orderId}`);

  if (!orderId) {
    redirect(`${returnPath}?error=save`);
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("submit_order_review", {
    communication_value: getNumber(formData, "communicationRating"),
    quality_value: getNumber(formData, "qualityRating"),
    rating_value: getNumber(formData, "rating"),
    review_comment: getText(formData, "comment"),
    target_order_id: orderId,
    timeliness_value: getNumber(formData, "timelinessRating"),
  });

  if (error) {
    redirect(`${returnPath}?error=${getErrorCode(error.message)}`);
  }

  revalidatePath(returnPath);
  revalidatePath("/katalog");
  revalidatePath("/creator/dashboard");
  redirect(`${returnPath}?reviewed=1`);
}

export async function createOrderComplaintAction(formData: FormData) {
  const orderId = getText(formData, "orderId");
  const returnPath = getReturnPath(formData, `/umkm/orders/${orderId}`);

  if (!orderId) {
    redirect(`${returnPath}?error=save`);
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("create_order_complaint", {
    complaint_description: getText(formData, "description"),
    complaint_subject: getText(formData, "subject"),
    target_order_id: orderId,
  });

  if (error) {
    redirect(`${returnPath}?error=${getErrorCode(error.message)}`);
  }

  revalidatePath(returnPath);
  revalidatePath("/admin/complaints");
  revalidatePath("/admin/dashboard");
  redirect(`${returnPath}?complaint_created=1`);
}

export async function sendOrderMessageAction(formData: FormData) {
  const orderId = getText(formData, "orderId");
  const returnPath = getReturnPath(formData, `/umkm/orders/${orderId}`);

  if (!orderId) {
    redirect(`${returnPath}?error=save`);
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("send_order_message", {
    message_body: getText(formData, "message"),
    target_order_id: orderId,
  });

  if (error) {
    redirect(`${returnPath}?error=${getErrorCode(error.message)}`);
  }

  revalidatePath(returnPath);
  redirect(`${returnPath}?message_sent=1`);
}
