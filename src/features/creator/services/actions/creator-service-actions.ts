"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import { STORAGE_BUCKETS } from "@/lib/storage/buckets";
import { FILE_SIZE_LIMITS } from "@/lib/storage/file-limits";
import { createServiceCoverStoragePath } from "@/lib/storage/file-paths";
import {
  removeImageAsset,
  removeImageAssetById,
  uploadImageAsset,
} from "@/lib/storage/image-assets";
import { validateImageFile, type FileValidationErrorCode } from "@/lib/storage/validate-file";
import { getPublicAssetUrl } from "@/lib/storage/urls";

type CreatorProfile = Database["public"]["Tables"]["creator_profiles"]["Row"];
type ServicePackageUpdate = Database["public"]["Tables"]["service_packages"]["Update"];

type CreatorContext = {
  creator: CreatorProfile;
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
};

type ServicePackageInsert =
  Database["public"]["Tables"]["service_packages"]["Insert"];
type ServiceTierInsert =
  Database["public"]["Tables"]["service_package_tiers"]["Insert"];

function getText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function getNullableText(formData: FormData, key: string) {
  const value = getText(formData, key);
  return value.length > 0 ? value : null;
}

function getTextList(formData: FormData, key: string) {
  return getText(formData, key)
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getNumber(formData: FormData, key: string) {
  const value = getText(formData, key).replace(/[^\d]/g, "");
  return Number(value);
}

function getInteger(formData: FormData, key: string) {
  return Math.floor(getNumber(formData, key));
}

function getDebugText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (value instanceof File) {
    return value.size > 0
      ? {
          name: value.name,
          size: value.size,
          type: value.type,
        }
      : null;
  }

  if (typeof value === "string") {
    return value.trim();
  }

  return null;
}

function getCreatorServiceFormDebugData(formData: FormData) {
  return {
    basePrice: getDebugText(formData, "basePrice"),
    categoryId: getDebugText(formData, "categoryId"),
    coverFile: getDebugText(formData, "coverFile"),
    deliverables: getDebugText(formData, "deliverables"),
    description: getDebugText(formData, "description"),
    estimatedDays: getDebugText(formData, "estimatedDays"),
    isActive: getDebugText(formData, "isActive"),
    requirements: getDebugText(formData, "requirements"),
    revisionCount: getDebugText(formData, "revisionCount"),
    shortDescription: getDebugText(formData, "shortDescription"),
    tags: getDebugText(formData, "tags"),
    tierDeliverables: getDebugText(formData, "tierDeliverables"),
    tierDescription: getDebugText(formData, "tierDescription"),
    tierEstimatedDays: getDebugText(formData, "tierEstimatedDays"),
    tierName: getDebugText(formData, "tierName"),
    tierPrice: getDebugText(formData, "tierPrice"),
    tierRevisionCount: getDebugText(formData, "tierRevisionCount"),
    title: getDebugText(formData, "title"),
  };
}

function getErrorDetail(error: unknown) {
  if (!error || typeof error !== "object") {
    return String(error ?? "Unknown error");
  }

  const errorRecord = error as {
    code?: unknown;
    details?: unknown;
    hint?: unknown;
    message?: unknown;
  };
  const parts = [
    typeof errorRecord.code === "string" ? `[${errorRecord.code}]` : null,
    typeof errorRecord.message === "string" ? errorRecord.message : null,
    typeof errorRecord.details === "string" ? `Details: ${errorRecord.details}` : null,
    typeof errorRecord.hint === "string" ? `Hint: ${errorRecord.hint}` : null,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" ") : JSON.stringify(error);
}

function redirectWithError(path: string, code: string, error?: unknown): never {
  const detail = error ? `&detail=${encodeURIComponent(getErrorDetail(error))}` : "";
  redirect(`${path}?error=${code}${detail}`);
}

function createSlug(value: string) {
  const slug = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);

  return slug.length > 0 ? slug : "layanan-digital";
}

function getValidationError(formData: FormData) {
  const title = getText(formData, "title");
  const categoryId = getText(formData, "categoryId");
  const basePrice = getNumber(formData, "basePrice");
  const tierPrice = getNumber(formData, "tierPrice");
  const estimatedDays = getInteger(formData, "estimatedDays");
  const revisionCount = getInteger(formData, "revisionCount");
  const tierName = getText(formData, "tierName");

  if (!title || !categoryId || !tierName) {
    return "required";
  }

  if (basePrice <= 0 || tierPrice <= 0) {
    return "price";
  }

  if (estimatedDays < 1 || revisionCount < 0) {
    return "scope";
  }

  return null;
}

function getAddonValidationError(formData: FormData) {
  const name = getText(formData, "addonName");
  const price = getNumber(formData, "addonPrice");

  if (!name) {
    return "addon_required";
  }

  if (price < 0) {
    return "addon_price";
  }

  return null;
}

function getTierValidationError(formData: FormData) {
  const name = getText(formData, "tierName");
  const price = getNumber(formData, "tierPrice");
  const estimatedDays = getInteger(formData, "tierEstimatedDays");
  const revisionCount = getInteger(formData, "tierRevisionCount");

  if (!name) {
    return "tier_required";
  }

  if (price <= 0) {
    return "tier_price";
  }

  if (estimatedDays < 1 || revisionCount < 0) {
    return "tier_scope";
  }

  return null;
}

function getCoverUploadError(code: FileValidationErrorCode) {
  switch (code) {
    case "missing":
      return "cover_required";
    case "size":
      return "cover_size";
    case "extension":
    case "type":
      return "cover_type";
  }
}

function validateOptionalCoverFile(formData: FormData, redirectPath: string) {
  const validation = validateImageFile(formData.get("coverFile"), {
    maxSizeBytes: FILE_SIZE_LIMITS.serviceCover,
  });

  if (!validation.ok) {
    redirect(`${redirectPath}?error=${getCoverUploadError(validation.code)}`);
  }

  if (validation.file === null || validation.extension === null) {
    return null;
  }

  return {
    extension: validation.extension,
    file: validation.file,
  };
}

async function getCreatorContext(): Promise<CreatorContext> {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, account_status")
    .eq("id", user.id)
    .maybeSingle();

  if (
    profileError ||
    !profile ||
    profile.role !== "creator" ||
    profile.account_status !== "active"
  ) {
    redirect("/creator/services?error=unauthorized");
  }

  const { data: creator, error: creatorError } = await supabase
    .from("creator_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (creatorError || !creator) {
    redirect("/creator/services?error=profile");
  }

  return { creator, supabase, userId: user.id };
}

async function ensureActiveCategory(context: CreatorContext, categoryId: string, redirectPath: string) {
  const { data: category, error } = await context.supabase
    .from("service_categories")
    .select("id")
    .eq("id", categoryId)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !category) {
    console.error("[creator-services] Category validation failed", {
      categoryId,
      error,
    });
    redirectWithError(redirectPath, "category", error);
  }

  return category.id;
}

async function ensureOwnedService(context: CreatorContext, serviceId: string) {
  if (!serviceId) {
    redirect("/creator/services?error=missing");
  }

  const { data: service, error } = await context.supabase
    .from("service_packages")
    .select("id")
    .eq("id", serviceId)
    .eq("creator_id", context.creator.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !service) {
    redirect("/creator/services?error=not_found");
  }

  return service.id;
}

function revalidateServicePaths(serviceId: string, creatorId?: string) {
  revalidatePath("/creator/services");
  revalidatePath(`/creator/services/${serviceId}/edit`);
  revalidatePath(`/layanan/${serviceId}`);
  revalidatePath("/katalog");
  if (creatorId) {
    revalidatePath(`/kreator/${creatorId}`);
  }
}

/**
 * Sync `creator_profiles.starting_price` with the minimum active tier price
 * across all active (non-deleted) services belonging to this creator.
 */
async function syncCreatorStartingPrice(context: CreatorContext) {
  const { creator, supabase } = context;

  const { data: tiers } = await supabase
    .from("service_package_tiers")
    .select("price, service_packages!inner(creator_id, is_active, deleted_at)")
    .eq("service_packages.creator_id", creator.id)
    .eq("service_packages.is_active", true)
    .is("service_packages.deleted_at", null)
    .eq("is_active", true);

  const prices = (tiers ?? []).map((t) => Number(t.price)).filter((p) => p > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

  await supabase
    .from("creator_profiles")
    .update({ starting_price: minPrice })
    .eq("id", creator.id);
}

function getTierPayload(formData: FormData) {
  return {
    deliverables: getTextList(formData, "tierDeliverables"),
    description: getNullableText(formData, "tierDescription"),
    estimated_days: getInteger(formData, "tierEstimatedDays"),
    is_active: getText(formData, "tierIsActive") !== "false",
    name: getText(formData, "tierName"),
    price: getNumber(formData, "tierPrice"),
    revision_count: getInteger(formData, "tierRevisionCount"),
    sort_order: getInteger(formData, "tierSortOrder"),
  };
}

async function ensureOwnedTier(
  context: CreatorContext,
  serviceId: string,
  tierId: string,
) {
  if (!tierId) {
    redirect(`/creator/services/${serviceId}/edit?error=tier_missing`);
  }

  await ensureOwnedService(context, serviceId);

  const { data: tier, error } = await context.supabase
    .from("service_package_tiers")
    .select("id, is_active")
    .eq("id", tierId)
    .eq("service_package_id", serviceId)
    .maybeSingle();

  if (error || !tier) {
    redirect(`/creator/services/${serviceId}/edit?error=tier_not_found`);
  }

  return tier;
}

async function canDeactivateTier(
  context: CreatorContext,
  serviceId: string,
  tierId: string,
) {
  const { count, error } = await context.supabase
    .from("service_package_tiers")
    .select("id", { count: "exact", head: true })
    .eq("service_package_id", serviceId)
    .eq("is_active", true);

  if (error || typeof count !== "number") {
    return false;
  }

  const { data: tier } = await context.supabase
    .from("service_package_tiers")
    .select("is_active")
    .eq("id", tierId)
    .eq("service_package_id", serviceId)
    .maybeSingle();

  return !tier?.is_active || count > 1;
}

async function uploadServiceCover(
  context: CreatorContext,
  serviceId: string,
  validatedFile: ReturnType<typeof validateOptionalCoverFile>,
) {
  if (!validatedFile) {
    return null;
  }

  const storagePath = createServiceCoverStoragePath(
    context.creator.id,
    serviceId,
    validatedFile.extension,
  );
  const uploadResult = await uploadImageAsset({
    bucket: STORAGE_BUCKETS.PUBLIC_ASSETS,
    context: "service_cover",
    creatorId: context.creator.id,
    extension: validatedFile.extension,
    file: validatedFile.file,
    ownerId: context.userId,
    servicePackageId: serviceId,
    storagePath,
    supabase: context.supabase,
    uploadedBy: context.userId,
    visibility: "public",
  });

  if (uploadResult.error || !uploadResult.asset) {
    redirect(`/creator/services/${serviceId}/edit?error=cover_upload`);
  }

  return {
    assetId: uploadResult.asset.id,
    publicUrl: getPublicAssetUrl(context.supabase, storagePath),
    storagePath,
  };
}

export async function createCreatorServiceAction(formData: FormData) {
  const coverFile = validateOptionalCoverFile(formData, "/creator/services/new");
  console.log("FORM DATA", getCreatorServiceFormDebugData(formData));
  const validationError = getValidationError(formData);

  if (validationError) {
    redirect(`/creator/services/new?error=${validationError}`);
  }

  const context = await getCreatorContext();
  const { creator, supabase } = context;
  const categoryId = await ensureActiveCategory(
    context,
    getText(formData, "categoryId"),
    "/creator/services/new",
  );
  const title = getText(formData, "title");
  const basePrice = getNumber(formData, "basePrice");
  const estimatedDays = getInteger(formData, "estimatedDays");
  const revisionCount = getInteger(formData, "revisionCount");
  const tierPrice = getNumber(formData, "tierPrice");
  const tierEstimatedDays = getInteger(formData, "tierEstimatedDays") || estimatedDays;
  const tierRevisionCount = getInteger(formData, "tierRevisionCount");
  const slug = `${createSlug(title)}-${Date.now().toString(36)}`;
  const serviceId = randomUUID();
  const servicePayload: ServicePackageInsert = {
    id: serviceId,
    base_price: basePrice,
    category_id: categoryId,
    creator_id: creator.id,
    deliverables: getTextList(formData, "deliverables"),
    description: getNullableText(formData, "description"),
    estimated_days: estimatedDays,
    is_active: getText(formData, "isActive") === "true",
    is_featured: false,
    requirements: getTextList(formData, "requirements"),
    revision_count: revisionCount,
    short_description: getNullableText(formData, "shortDescription"),
    slug,
    tags: getTextList(formData, "tags"),
    title,
  };
  const tierPayload: ServiceTierInsert = {
    deliverables: getTextList(formData, "tierDeliverables"),
    description: getNullableText(formData, "tierDescription"),
    estimated_days: tierEstimatedDays,
    is_active: true,
    name: getText(formData, "tierName"),
    price: tierPrice,
    revision_count: tierRevisionCount >= 0 ? tierRevisionCount : revisionCount,
    service_package_id: serviceId,
    sort_order: 1,
  };

  console.log("VALIDATED DATA", {
    creatorId: creator.id,
    servicePayload,
    tierPayload,
    userId: context.userId,
  });

  const { data: service, error: serviceError } = await supabase
    .from("service_packages")
    .insert(servicePayload)
    .select("id")
    .single();

  console.log("INSERT RESULT", {
    error: serviceError,
    service,
    table: "service_packages",
  });

  if (serviceError || !service) {
    console.error("[creator-services] Failed to insert service package", serviceError);
    redirectWithError("/creator/services/new", "save", serviceError);
  }

  const { error: tierError } = await supabase.from("service_package_tiers").insert({
    ...tierPayload,
    service_package_id: service.id,
  });

  console.log("INSERT RESULT", {
    error: tierError,
    table: "service_package_tiers",
  });

  revalidatePath("/creator/services");

  if (tierError) {
    console.error("[creator-services] Failed to insert service tier", tierError);
    redirectWithError(`/creator/services/${service.id}/edit`, "tier", tierError);
  }

  const cover = await uploadServiceCover(
    { creator, supabase, userId: creator.user_id },
    service.id,
    coverFile,
  );

  if (cover) {
    const { error: coverError } = await supabase
      .from("service_packages")
      .update({
        cover_file_asset_id: cover.assetId,
        cover_image_url: cover.publicUrl,
      })
      .eq("id", service.id)
      .eq("creator_id", creator.id);

    if (coverError) {
      await removeImageAsset(
        supabase,
        STORAGE_BUCKETS.PUBLIC_ASSETS,
        cover.storagePath,
        cover.assetId,
      );
      redirect(`/creator/services/${service.id}/edit?error=cover_save`);
    }
  }

  await syncCreatorStartingPrice(context);
  revalidateServicePaths(service.id, creator.id);
  redirect("/creator/services?created=1");
}

export async function updateCreatorServiceAction(formData: FormData) {
  const serviceId = getText(formData, "serviceId");
  const tierId = getText(formData, "tierId");
  const editPath = `/creator/services/${serviceId}/edit`;

  if (!serviceId) {
    redirect("/creator/services?error=missing");
  }

  const validationError = getValidationError(formData);

  if (validationError) {
    redirect(`${editPath}?error=${validationError}`);
  }

  const coverFile = validateOptionalCoverFile(formData, editPath);
  const context = await getCreatorContext();
  const { creator, supabase } = context;
  const categoryId = await ensureActiveCategory(
    context,
    getText(formData, "categoryId"),
    editPath,
  );
  const { data: existingService, error: existingError } = await supabase
    .from("service_packages")
    .select("id, cover_file_asset_id")
    .eq("id", serviceId)
    .eq("creator_id", creator.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (existingError || !existingService) {
    redirect("/creator/services?error=not_found");
  }

  const title = getText(formData, "title");
  const basePrice = getNumber(formData, "basePrice");
  const estimatedDays = getInteger(formData, "estimatedDays");
  const revisionCount = getInteger(formData, "revisionCount");
  const tierPrice = getNumber(formData, "tierPrice");
  const tierEstimatedDays = getInteger(formData, "tierEstimatedDays") || estimatedDays;
  const tierRevisionCount = getInteger(formData, "tierRevisionCount");
  const cover = await uploadServiceCover(
    { creator, supabase, userId: creator.user_id },
    serviceId,
    coverFile,
  );
  const servicePayload: ServicePackageUpdate = {
    base_price: basePrice,
    category_id: categoryId,
    deliverables: getTextList(formData, "deliverables"),
    description: getNullableText(formData, "description"),
    estimated_days: estimatedDays,
    is_active: getText(formData, "isActive") === "true",
    requirements: getTextList(formData, "requirements"),
    revision_count: revisionCount,
    short_description: getNullableText(formData, "shortDescription"),
    tags: getTextList(formData, "tags"),
    title,
  };

  if (cover) {
    servicePayload.cover_file_asset_id = cover.assetId;
    servicePayload.cover_image_url = cover.publicUrl;
  } else if (getText(formData, "removeCoverImage") === "true") {
    servicePayload.cover_file_asset_id = null;
    servicePayload.cover_image_url = null;
  }

  const { error: serviceError } = await supabase
    .from("service_packages")
    .update(servicePayload)
    .eq("id", serviceId)
    .eq("creator_id", creator.id);

  if (serviceError) {
    if (cover) {
      await removeImageAsset(
        supabase,
        STORAGE_BUCKETS.PUBLIC_ASSETS,
        cover.storagePath,
        cover.assetId,
      );
    }
    redirect(`/creator/services/${serviceId}/edit?error=save`);
  }

  const tierPayload = {
    deliverables: getTextList(formData, "tierDeliverables"),
    description: getNullableText(formData, "tierDescription"),
    estimated_days: tierEstimatedDays,
    is_active: true,
    name: getText(formData, "tierName"),
    price: tierPrice,
    revision_count: tierRevisionCount >= 0 ? tierRevisionCount : revisionCount,
    sort_order: 1,
  };

  const tierResult = tierId
    ? await supabase
        .from("service_package_tiers")
        .update(tierPayload)
        .eq("id", tierId)
        .eq("service_package_id", serviceId)
    : await supabase.from("service_package_tiers").insert({
        ...tierPayload,
        service_package_id: serviceId,
      });

  if (tierResult.error) {
    redirect(`/creator/services/${serviceId}/edit?error=tier`);
  }

  if (cover || servicePayload.cover_file_asset_id === null) {
    await removeImageAssetById(supabase, existingService.cover_file_asset_id);
  }

  await syncCreatorStartingPrice(context);
  revalidateServicePaths(serviceId, creator.id);
  redirect("/creator/services?updated=1");
}

export async function toggleCreatorServiceStatusAction(formData: FormData) {
  const serviceId = getText(formData, "serviceId");

  if (!serviceId) {
    redirect("/creator/services?error=missing");
  }

  const { creator, supabase } = await getCreatorContext();
  const { data: service, error: serviceError } = await supabase
    .from("service_packages")
    .select("id, is_active")
    .eq("id", serviceId)
    .eq("creator_id", creator.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (serviceError || !service) {
    redirect("/creator/services?error=not_found");
  }

  const { error: updateError } = await supabase
    .from("service_packages")
    .update({ is_active: !service.is_active })
    .eq("id", service.id)
    .eq("creator_id", creator.id);

  if (updateError) {
    redirect("/creator/services?error=toggle");
  }

  await syncCreatorStartingPrice({ creator, supabase, userId: creator.user_id });
  revalidateServicePaths(serviceId, creator.id);
  redirect("/creator/services?toggled=1");
}

export async function createCreatorServiceTierAction(formData: FormData) {
  const serviceId = getText(formData, "serviceId");

  if (!serviceId) {
    redirect("/creator/services?error=missing");
  }

  const editPath = `/creator/services/${serviceId}/edit`;
  const validationError = getTierValidationError(formData);

  if (validationError) {
    redirect(`${editPath}?error=${validationError}`);
  }

  const context = await getCreatorContext();
  const ownedServiceId = await ensureOwnedService(context, serviceId);
  const { error } = await context.supabase.from("service_package_tiers").insert({
    ...getTierPayload(formData),
    service_package_id: ownedServiceId,
  });

  if (error) {
    redirect(`${editPath}?error=tier_save`);
  }

  revalidateServicePaths(serviceId);
  redirect(`${editPath}?tier_created=1`);
}

export async function updateCreatorServiceTierAction(formData: FormData) {
  const serviceId = getText(formData, "serviceId");
  const tierId = getText(formData, "tierId");

  if (!serviceId) {
    redirect("/creator/services?error=missing");
  }

  const editPath = `/creator/services/${serviceId}/edit`;
  const validationError = getTierValidationError(formData);

  if (validationError) {
    redirect(`${editPath}?error=${validationError}`);
  }

  const context = await getCreatorContext();
  await ensureOwnedTier(context, serviceId, tierId);
  const payload = getTierPayload(formData);

  if (!payload.is_active && !(await canDeactivateTier(context, serviceId, tierId))) {
    redirect(`${editPath}?error=tier_last_active`);
  }

  const { error } = await context.supabase
    .from("service_package_tiers")
    .update(payload)
    .eq("id", tierId)
    .eq("service_package_id", serviceId);

  if (error) {
    redirect(`${editPath}?error=tier_update`);
  }

  revalidateServicePaths(serviceId);
  redirect(`${editPath}?tier_updated=1`);
}

export async function toggleCreatorServiceTierStatusAction(formData: FormData) {
  const serviceId = getText(formData, "serviceId");
  const tierId = getText(formData, "tierId");

  if (!serviceId) {
    redirect("/creator/services?error=missing");
  }

  const editPath = `/creator/services/${serviceId}/edit`;
  const context = await getCreatorContext();
  const tier = await ensureOwnedTier(context, serviceId, tierId);
  const nextActive = !tier.is_active;

  if (!nextActive && !(await canDeactivateTier(context, serviceId, tierId))) {
    redirect(`${editPath}?error=tier_last_active`);
  }

  const { error } = await context.supabase
    .from("service_package_tiers")
    .update({ is_active: nextActive })
    .eq("id", tier.id)
    .eq("service_package_id", serviceId);

  if (error) {
    redirect(`${editPath}?error=tier_toggle`);
  }

  revalidateServicePaths(serviceId);
  redirect(`${editPath}?tier_toggled=1`);
}

export async function createCreatorServiceAddonAction(formData: FormData) {
  const serviceId = getText(formData, "serviceId");

  if (!serviceId) {
    redirect("/creator/services?error=missing");
  }

  const editPath = `/creator/services/${serviceId}/edit`;
  const validationError = getAddonValidationError(formData);

  if (validationError) {
    redirect(`${editPath}?error=${validationError}`);
  }

  const context = await getCreatorContext();
  const ownedServiceId = await ensureOwnedService(context, serviceId);
  const { error } = await context.supabase.from("service_addons").insert({
    description: getNullableText(formData, "addonDescription"),
    is_active: getText(formData, "addonIsActive") !== "false",
    name: getText(formData, "addonName"),
    price: getNumber(formData, "addonPrice"),
    service_package_id: ownedServiceId,
  });

  if (error) {
    redirect(`${editPath}?error=addon_save`);
  }

  revalidateServicePaths(serviceId);
  redirect(`${editPath}?addon_created=1`);
}

export async function updateCreatorServiceAddonAction(formData: FormData) {
  const serviceId = getText(formData, "serviceId");
  const addonId = getText(formData, "addonId");

  if (!serviceId) {
    redirect("/creator/services?error=missing");
  }

  const editPath = `/creator/services/${serviceId}/edit`;
  const validationError = getAddonValidationError(formData);

  if (!addonId) {
    redirect(`${editPath}?error=addon_missing`);
  }

  if (validationError) {
    redirect(`${editPath}?error=${validationError}`);
  }

  const context = await getCreatorContext();
  await ensureOwnedService(context, serviceId);

  const { data: addon, error: addonError } = await context.supabase
    .from("service_addons")
    .select("id")
    .eq("id", addonId)
    .eq("service_package_id", serviceId)
    .maybeSingle();

  if (addonError || !addon) {
    redirect(`${editPath}?error=addon_not_found`);
  }

  const { error } = await context.supabase
    .from("service_addons")
    .update({
      description: getNullableText(formData, "addonDescription"),
      is_active: getText(formData, "addonIsActive") !== "false",
      name: getText(formData, "addonName"),
      price: getNumber(formData, "addonPrice"),
    })
    .eq("id", addon.id)
    .eq("service_package_id", serviceId);

  if (error) {
    redirect(`${editPath}?error=addon_update`);
  }

  revalidateServicePaths(serviceId);
  redirect(`${editPath}?addon_updated=1`);
}

export async function deleteCreatorServiceAddonAction(formData: FormData) {
  const serviceId = getText(formData, "serviceId");
  const addonId = getText(formData, "addonId");

  if (!serviceId) {
    redirect("/creator/services?error=missing");
  }

  const editPath = `/creator/services/${serviceId}/edit`;

  if (!addonId) {
    redirect(`${editPath}?error=addon_missing`);
  }

  const context = await getCreatorContext();
  await ensureOwnedService(context, serviceId);

  const { data: addon, error: addonError } = await context.supabase
    .from("service_addons")
    .select("id")
    .eq("id", addonId)
    .eq("service_package_id", serviceId)
    .maybeSingle();

  if (addonError || !addon) {
    redirect(`${editPath}?error=addon_not_found`);
  }

  const { error } = await context.supabase
    .from("service_addons")
    .delete()
    .eq("id", addon.id)
    .eq("service_package_id", serviceId);

  if (error) {
    redirect(`${editPath}?error=addon_delete`);
  }

  revalidateServicePaths(serviceId);
  redirect(`${editPath}?addon_deleted=1`);
}
