"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { STORAGE_BUCKETS } from "@/lib/storage/buckets";
import { FILE_SIZE_LIMITS } from "@/lib/storage/file-limits";
import type { AllowedImageExtension } from "@/lib/storage/file-types";
import { createBriefAssetStoragePath } from "@/lib/storage/file-paths";
import { removeImageAssetById, uploadImageAsset } from "@/lib/storage/image-assets";
import { validateImageFile } from "@/lib/storage/validate-file";
import { createClient } from "@/lib/supabase/server";

type Supabase = Awaited<ReturnType<typeof createClient>>;

type ValidBriefAssetFile = {
  extension: AllowedImageExtension;
  file: File;
};

function getText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function getTextList(formData: FormData, key: string) {
  return getText(formData, key)
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getSelectedIds(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is string => typeof value === "string" && value.length > 0);
}

function isValidDate(value: string) {
  return !value || /^\d{4}-\d{2}-\d{2}$/.test(value);
}

async function requireCurrentUmkm(supabase: Supabase) {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    redirect("/login");
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
    redirect("/umkm/dashboard?error=unauthorized");
  }

  const { data: umkm, error: umkmError } = await supabase
    .from("umkm_profiles")
    .select("id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (umkmError || !umkm) {
    redirect("/umkm/dashboard?error=profile");
  }

  return {
    id: umkm.id,
    userId: userData.user.id,
  };
}

function getBriefAssetValidationError(code: "missing" | "type" | "extension" | "size") {
  if (code === "size") {
    return "asset_size";
  }

  if (code === "type" || code === "extension") {
    return "asset_type";
  }

  return "asset_missing";
}

function validateBriefAssetFiles(
  formData: FormData,
  redirectPath: string,
): ValidBriefAssetFile[] {
  const files = formData.getAll("briefAssetFiles");
  const validFiles: ValidBriefAssetFile[] = [];

  for (const value of files) {
    const validation = validateImageFile(value, {
      maxSizeBytes: FILE_SIZE_LIMITS.briefImage,
    });

    if (!validation.ok) {
      redirect(`${redirectPath}?error=${getBriefAssetValidationError(validation.code)}`);
    }

    if (validation.file) {
      validFiles.push({
        extension: validation.extension,
        file: validation.file,
      });
    }
  }

  return validFiles;
}

async function uploadBriefAssets(
  supabase: Supabase,
  umkm: { id: string; userId: string },
  briefId: string,
  files: readonly ValidBriefAssetFile[],
  redirectPath: string,
) {
  const uploadedAssetIds: string[] = [];

  for (const item of files) {
    const result = await uploadImageAsset({
      bucket: STORAGE_BUCKETS.BRIEF_ASSETS,
      context: "brief_asset",
      extension: item.extension,
      file: item.file,
      ownerId: umkm.userId,
      storagePath: createBriefAssetStoragePath(
        umkm.id,
        briefId,
        item.extension,
      ),
      supabase,
      uploadedBy: umkm.userId,
      visibility: "restricted",
      umkmId: umkm.id,
      briefId,
    });

    if (result.error || !result.asset) {
      await Promise.all(
        uploadedAssetIds.map((assetId) => removeImageAssetById(supabase, assetId)),
      );
      redirect(`${redirectPath}?error=asset_upload`);
    }

    uploadedAssetIds.push(result.asset.id);
  }
}

async function removeBriefAssets(
  supabase: Supabase,
  umkmId: string,
  briefId: string,
  assetIds: readonly string[],
) {
  if (assetIds.length === 0) {
    return;
  }

  const { data } = await supabase
    .from("file_assets")
    .select("id")
    .eq("brief_id", briefId)
    .eq("umkm_id", umkmId)
    .in("id", [...assetIds]);

  await Promise.all(
    (data ?? []).map((asset) => removeImageAssetById(supabase, asset.id)),
  );
}

export async function updateUmkmBrief(formData: FormData) {
  const briefId = getText(formData, "briefId");
  const businessName = getText(formData, "businessName");
  const businessCategory = getText(formData, "businessCategory");
  const promotedFocus = getText(formData, "promotedFocus");
  const campaignGoal = getText(formData, "campaignGoal");
  const deadline = getText(formData, "deadline");
  const redirectPath = briefId ? `/umkm/briefs/${briefId}` : "/umkm/briefs";

  if (!briefId) {
    redirect("/umkm/briefs?error=not_found");
  }

  if (!businessName || !businessCategory || !promotedFocus || !campaignGoal) {
    redirect(`/umkm/briefs/${briefId}?error=required`);
  }

  if (!isValidDate(deadline)) {
    redirect(`/umkm/briefs/${briefId}?error=date`);
  }

  const assetFiles = validateBriefAssetFiles(formData, redirectPath);
  const removeAssetIds = getSelectedIds(formData, "removeBriefAssetIds");

  const supabase = await createClient();
  const umkm = await requireCurrentUmkm(supabase);
  const { data: brief, error: briefError } = await supabase
    .from("campaign_briefs")
    .select("id, order_id, status")
    .eq("id", briefId)
    .eq("umkm_id", umkm.id)
    .maybeSingle();

  if (briefError || !brief) {
    redirect("/umkm/briefs?error=not_found");
  }

  if (brief.order_id || brief.status !== "draft") {
    redirect(`/umkm/briefs/${briefId}?error=locked`);
  }

  const { error } = await supabase
    .from("campaign_briefs")
    .update({
      additional_notes: getText(formData, "additionalNotes") || null,
      business_category: businessCategory,
      business_name: businessName,
      campaign_goal: campaignGoal,
      content_platforms: getTextList(formData, "contentPlatforms"),
      content_style: getText(formData, "contentStyle") || null,
      deadline: deadline || null,
      promoted_product: promotedFocus,
      reference_links: getTextList(formData, "referenceLinks"),
      status: "draft",
      target_audience: getText(formData, "targetAudience") || null,
    })
    .eq("id", brief.id)
    .eq("umkm_id", umkm.id)
    .is("order_id", null);

  if (error) {
    redirect(`/umkm/briefs/${briefId}?error=save`);
  }

  await removeBriefAssets(supabase, umkm.id, brief.id, removeAssetIds);
  await uploadBriefAssets(supabase, umkm, brief.id, assetFiles, redirectPath);

  revalidatePath("/umkm/briefs");
  revalidatePath(`/umkm/briefs/${briefId}`);
  revalidatePath("/umkm/checkout");
  redirect(`/umkm/briefs/${briefId}?updated=1`);
}
