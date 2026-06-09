"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import { STORAGE_BUCKETS } from "@/lib/storage/buckets";
import { FILE_SIZE_LIMITS } from "@/lib/storage/file-limits";
import { createPortfolioThumbnailStoragePath } from "@/lib/storage/file-paths";
import {
  removeImageAsset,
  removeImageAssetById,
  uploadImageAsset,
} from "@/lib/storage/image-assets";
import { validateImageFile, type FileValidationErrorCode } from "@/lib/storage/validate-file";

type PortfolioUpdate = Database["public"]["Tables"]["portfolios"]["Update"];
type CreatorSupabaseClient = Awaited<ReturnType<typeof createClient>>;

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getNullableText(formData: FormData, key: string) {
  const value = getText(formData, key);
  return value.length > 0 ? value : null;
}

function getBoolean(formData: FormData, key: string) {
  return getText(formData, key) === "true";
}

function getInteger(formData: FormData, key: string) {
  const value = getText(formData, key).replace(/[^\d-]/g, "");
  return value.length > 0 ? Number(value) : 0;
}

function getThumbnailUploadError(code: FileValidationErrorCode) {
  switch (code) {
    case "missing":
      return "thumbnail_required";
    case "size":
      return "thumbnail_size";
    case "extension":
    case "type":
      return "thumbnail_type";
  }
}

function revalidateCreatorPortfolioPaths(creatorId: string) {
  revalidatePath("/creator/portfolio");
  revalidatePath("/creator/profile");
  revalidatePath("/creator/dashboard");
  revalidatePath("/katalog");
  revalidatePath(`/kreator/${creatorId}`);
  revalidatePath("/layanan/[serviceId]", "page");
}

async function removeStorageObject(
  supabase: CreatorSupabaseClient,
  storagePath: string | null,
  assetId?: string | null,
) {
  await removeImageAsset(supabase, STORAGE_BUCKETS.PORTFOLIOS, storagePath, assetId);
}

async function uploadPortfolioThumbnail(
  supabase: CreatorSupabaseClient,
  creatorId: string,
  userId: string,
  portfolioId: string,
  formData: FormData,
) {
  const validation = validateImageFile(formData.get("thumbnailFile"), {
    maxSizeBytes: FILE_SIZE_LIMITS.portfolioImage,
  });

  if (!validation.ok) {
    redirect(`/creator/portfolio?error=${getThumbnailUploadError(validation.code)}`);
  }

  if (validation.file === null) {
    return null;
  }

  const storagePath = createPortfolioThumbnailStoragePath(
    creatorId,
    portfolioId,
    validation.extension,
  );
  const uploadResult = await uploadImageAsset({
    bucket: STORAGE_BUCKETS.PORTFOLIOS,
    context: "portfolio_thumbnail",
    creatorId,
    extension: validation.extension,
    file: validation.file,
    ownerId: userId,
    portfolioId,
    storagePath,
    supabase,
    uploadedBy: userId,
    visibility: "public",
  });

  if (uploadResult.error || !uploadResult.asset) {
    redirect("/creator/portfolio?error=thumbnail_upload");
  }

  return {
    assetId: uploadResult.asset.id,
    storagePath,
  };
}

async function getCreatorContext() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    redirect("/login");
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
    redirect("/creator/portfolio?error=unauthorized");
  }

  const { data: creator, error: creatorError } = await supabase
    .from("creator_profiles")
    .select("id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (creatorError || !creator) {
    redirect("/creator/portfolio?error=profile");
  }

  return { creator, supabase, userId: userData.user.id };
}

export async function createCreatorPortfolioAction(formData: FormData) {
  const title = getText(formData, "title");

  if (!title) {
    redirect("/creator/portfolio?error=required");
  }

  const { creator, supabase, userId } = await getCreatorContext();
  const portfolioId = randomUUID();
  const thumbnailStoragePath = await uploadPortfolioThumbnail(
    supabase,
    creator.id,
    userId,
    portfolioId,
    formData,
  );
  const { error } = await supabase.from("portfolios").insert({
    id: portfolioId,
    category_id: getNullableText(formData, "categoryId"),
    client_type: getNullableText(formData, "clientType"),
    creator_id: creator.id,
    description: getNullableText(formData, "description"),
    external_url: getNullableText(formData, "externalUrl"),
    is_featured: getBoolean(formData, "isFeatured"),
    media_url: getNullableText(formData, "mediaUrl"),
    sort_order: getInteger(formData, "sortOrder"),
    thumbnail_file_asset_id: thumbnailStoragePath?.assetId ?? null,
    thumbnail_storage_path: thumbnailStoragePath?.storagePath ?? null,
    title,
  });

  if (error) {
    await removeStorageObject(
      supabase,
      thumbnailStoragePath?.storagePath ?? null,
      thumbnailStoragePath?.assetId ?? null,
    );
    redirect("/creator/portfolio?error=save");
  }

  revalidateCreatorPortfolioPaths(creator.id);
  redirect("/creator/portfolio?created=1");
}

export async function updateCreatorPortfolioAction(formData: FormData) {
  const portfolioId = getText(formData, "portfolioId");
  const title = getText(formData, "title");

  if (!portfolioId || !title) {
    redirect("/creator/portfolio?error=required");
  }

  const { creator, supabase, userId } = await getCreatorContext();
  const { data: existingPortfolio, error: existingError } = await supabase
    .from("portfolios")
    .select("id, thumbnail_storage_path, thumbnail_file_asset_id")
    .eq("id", portfolioId)
    .eq("creator_id", creator.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (existingError || !existingPortfolio) {
    redirect("/creator/portfolio?error=save");
  }

  const thumbnailStoragePath = await uploadPortfolioThumbnail(
    supabase,
    creator.id,
    userId,
    portfolioId,
    formData,
  );
  const updatePayload: PortfolioUpdate = {
    category_id: getNullableText(formData, "categoryId"),
    client_type: getNullableText(formData, "clientType"),
    description: getNullableText(formData, "description"),
    external_url: getNullableText(formData, "externalUrl"),
    is_featured: getBoolean(formData, "isFeatured"),
    media_url: getNullableText(formData, "mediaUrl"),
    sort_order: getInteger(formData, "sortOrder"),
    title,
  };

  if (thumbnailStoragePath) {
    updatePayload.thumbnail_file_asset_id = thumbnailStoragePath.assetId;
    updatePayload.thumbnail_storage_path = thumbnailStoragePath.storagePath;
    updatePayload.thumbnail_url = null;
  }

  const { data: updatedPortfolio, error } = await supabase
    .from("portfolios")
    .update(updatePayload)
    .eq("id", portfolioId)
    .eq("creator_id", creator.id)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  if (error || !updatedPortfolio) {
    await removeStorageObject(
      supabase,
      thumbnailStoragePath?.storagePath ?? null,
      thumbnailStoragePath?.assetId ?? null,
    );
    redirect("/creator/portfolio?error=save");
  }

  if (thumbnailStoragePath) {
    if (existingPortfolio.thumbnail_file_asset_id) {
      await removeImageAssetById(supabase, existingPortfolio.thumbnail_file_asset_id);
    } else if (existingPortfolio.thumbnail_storage_path) {
      await removeStorageObject(supabase, existingPortfolio.thumbnail_storage_path);
    }
  }

  revalidateCreatorPortfolioPaths(creator.id);
  redirect("/creator/portfolio?updated=1");
}

export async function deleteCreatorPortfolioAction(formData: FormData) {
  const portfolioId = getText(formData, "portfolioId");

  if (!portfolioId) {
    redirect("/creator/portfolio?error=required");
  }

  const { creator, supabase } = await getCreatorContext();
  const { data: existingPortfolio, error: existingError } = await supabase
    .from("portfolios")
    .select("id, thumbnail_storage_path, thumbnail_file_asset_id")
    .eq("id", portfolioId)
    .eq("creator_id", creator.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (existingError || !existingPortfolio) {
    redirect("/creator/portfolio?error=delete");
  }

  const { data: deletedPortfolio, error } = await supabase
    .from("portfolios")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", portfolioId)
    .eq("creator_id", creator.id)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  if (error || !deletedPortfolio) {
    redirect("/creator/portfolio?error=delete");
  }

  await removeStorageObject(
    supabase,
    existingPortfolio.thumbnail_storage_path,
    existingPortfolio.thumbnail_file_asset_id,
  );
  revalidateCreatorPortfolioPaths(creator.id);
  redirect("/creator/portfolio?deleted=1");
}
