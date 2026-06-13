"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { STORAGE_BUCKETS } from "@/lib/storage/buckets";
import { FILE_SIZE_LIMITS } from "@/lib/storage/file-limits";
import { createProjectResultStoragePath } from "@/lib/storage/file-paths";
import { uploadFileAsset } from "@/lib/storage/file-assets";
import { validateProjectResultFile } from "@/lib/storage/validate-file";
import { sendOrderEventEmail } from "@/lib/email/order-notifications";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type FileAssetRow = Database["public"]["Tables"]["file_assets"]["Row"];

const deliveryErrorCodes = [
  "asset_not_allowed",
  "file_extension",
  "file_size",
  "file_type",
  "not_authenticated",
  "not_creator",
  "not_umkm",
  "order_not_approvable",
  "order_not_revisable",
  "order_not_submittable",
  "revision_limit_reached",
  "revision_note_required",
  "revision_not_found",
  "submission_empty",
] as const;

type DeliveryErrorCode = (typeof deliveryErrorCodes)[number];

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getLinks(formData: FormData, key: string) {
  return getText(formData, key)
    .split(/\r?\n|,/)
    .map((value) => value.trim())
    .filter(isSafeHttpUrl);
}

function isSafeHttpUrl(value: string) {
  if (!value) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function getDeliveryErrorCode(message: string): DeliveryErrorCode | "delivery_update" {
  return deliveryErrorCodes.find((code) => message.includes(code)) ?? "delivery_update";
}

async function cleanupUploadedAssets(
  supabase: Awaited<ReturnType<typeof createClient>>,
  assets: readonly FileAssetRow[],
) {
  if (assets.length === 0) {
    return;
  }

  await Promise.all(
    assets.map((asset) =>
      supabase.storage.from(asset.bucket_name).remove([asset.storage_path]),
    ),
  );

  await supabase
    .from("file_assets")
    .update({ deleted_at: new Date().toISOString() })
    .in("id", assets.map((asset) => asset.id));
}

export async function submitCreatorDelivery(formData: FormData) {
  const orderId = getText(formData, "orderId");

  if (!orderId) {
    redirect("/creator/orders?error=order");
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    redirect(`/creator/orders/${orderId}?error=not_authenticated`);
  }

  const { data: creator } = await supabase
    .from("creator_profiles")
    .select("id, user_id, profiles!inner(role, account_status)")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (
    !creator ||
    creator.profiles?.role !== "creator" ||
    creator.profiles.account_status !== "active"
  ) {
    redirect(`/creator/orders/${orderId}?error=not_creator`);
  }

  const { data: order } = await supabase
    .from("orders")
    .select("id, creator_id, payment_status, order_status")
    .eq("id", orderId)
    .eq("creator_id", creator.id)
    .maybeSingle();

  if (
    !order ||
    order.payment_status !== "paid" ||
    !["in_progress", "revision_requested"].includes(order.order_status)
  ) {
    redirect(`/creator/orders/${orderId}?error=order_not_submittable`);
  }

  const files = formData
    .getAll("projectFiles")
    .filter((value): value is File => value instanceof File && value.size > 0);
  const uploadedAssets: FileAssetRow[] = [];

  for (const fileValue of files.slice(0, 5)) {
    const validation = validateProjectResultFile(fileValue, {
      maxSizeBytes: FILE_SIZE_LIMITS.projectResult,
    });

    if (!validation.ok) {
      await cleanupUploadedAssets(supabase, uploadedAssets);
      const code =
        validation.code === "extension"
          ? "file_extension"
          : validation.code === "size"
            ? "file_size"
            : "file_type";
      redirect(`/creator/orders/${orderId}?error=${code}`);
    }

    const uploadResult = await uploadFileAsset({
      bucket: STORAGE_BUCKETS.PROJECT_RESULTS,
      context: "project_result",
      creatorId: creator.id,
      extension: validation.extension,
      file: validation.file,
      orderId,
      ownerId: userData.user.id,
      storagePath: createProjectResultStoragePath(
        creator.id,
        orderId,
        validation.extension,
      ),
      supabase,
      uploadedBy: userData.user.id,
      visibility: "restricted",
    });

    if (uploadResult.error || !uploadResult.asset) {
      await cleanupUploadedAssets(supabase, uploadedAssets);
      redirect(`/creator/orders/${orderId}?error=asset_not_allowed`);
    }

    uploadedAssets.push(uploadResult.asset);
  }

  const externalLinks = getLinks(formData, "externalLinks");
  const description = getText(formData, "description");
  const captionText = getText(formData, "captionText");

  if (uploadedAssets.length === 0 && externalLinks.length === 0 && !description && !captionText) {
    redirect(`/creator/orders/${orderId}?error=submission_empty`);
  }

  const { data: submissionId, error } = await supabase.rpc("submit_creator_delivery", {
    caption_text: captionText,
    external_links: externalLinks,
    file_asset_ids: uploadedAssets.map((asset) => asset.id),
    submission_description: description,
    submission_title: getText(formData, "title") || "Hasil konten",
    target_order_id: orderId,
  });

  if (error || !submissionId) {
    await cleanupUploadedAssets(supabase, uploadedAssets);
    const code = getDeliveryErrorCode(error?.message ?? "");
    redirect(`/creator/orders/${orderId}?error=${code}`);
  }

  revalidatePath("/creator/orders");
  revalidatePath(`/creator/orders/${orderId}`);
  revalidatePath(`/umkm/orders/${orderId}`);
  revalidatePath("/creator/dashboard");
  await sendOrderEventEmail(orderId, "result_submitted");
  redirect(`/creator/orders/${orderId}?submitted=1`);
}

export async function requestOrderRevision(formData: FormData) {
  const orderId = getText(formData, "orderId");

  if (!orderId) {
    redirect("/umkm/orders?error=order");
  }

  const { data, error } = await (await createClient()).rpc("request_order_revision", {
    reference_urls: getLinks(formData, "referenceUrls"),
    revision_note: getText(formData, "revisionNote"),
    target_order_id: orderId,
  });

  if (error || !data) {
    const code = getDeliveryErrorCode(error?.message ?? "");
    redirect(`/umkm/orders/${orderId}?error=${code}`);
  }

  revalidatePath("/umkm/orders");
  revalidatePath(`/umkm/orders/${orderId}`);
  revalidatePath(`/creator/orders/${orderId}`);
  revalidatePath("/umkm/dashboard");
  await sendOrderEventEmail(orderId, "revision_requested");
  redirect(`/umkm/orders/${orderId}?revision_requested=1`);
}

export async function approveOrderDelivery(formData: FormData) {
  const orderId = getText(formData, "orderId");

  if (!orderId) {
    redirect("/umkm/orders?error=order");
  }

  const { data, error } = await (await createClient()).rpc("approve_order_delivery", {
    target_order_id: orderId,
  });

  if (error || !data) {
    const code = getDeliveryErrorCode(error?.message ?? "");
    redirect(`/umkm/orders/${orderId}?error=${code}`);
  }

  revalidatePath("/umkm/orders");
  revalidatePath(`/umkm/orders/${orderId}`);
  revalidatePath(`/creator/orders/${orderId}`);
  revalidatePath("/umkm/dashboard");
  await sendOrderEventEmail(orderId, "order_completed");
  redirect(`/umkm/orders/${orderId}?completed=1`);
}
