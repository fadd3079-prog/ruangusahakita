"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { STORAGE_BUCKETS } from "@/lib/storage/buckets";
import { FILE_SIZE_LIMITS } from "@/lib/storage/file-limits";
import { createServiceMediaStoragePath } from "@/lib/storage/file-paths";
import {
  removeImageAssetById,
  uploadImageAsset,
} from "@/lib/storage/image-assets";
import { getPublicAssetUrl } from "@/lib/storage/urls";
import { validateImageFile, type FileValidationErrorCode } from "@/lib/storage/validate-file";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type Supabase = Awaited<ReturnType<typeof createClient>>;
type CreatorProfile = Database["public"]["Tables"]["creator_profiles"]["Row"];
type ServicePackageInsert = Database["public"]["Tables"]["service_packages"]["Insert"];
type ServicePackageUpdate = Database["public"]["Tables"]["service_packages"]["Update"];
type ServiceTierInsert = Database["public"]["Tables"]["service_package_tiers"]["Insert"];
type ServiceTierUpdate = Database["public"]["Tables"]["service_package_tiers"]["Update"];
type ServiceMediaRow = Database["public"]["Tables"]["service_media"]["Row"];
type TierKey = Database["public"]["Tables"]["service_package_tiers"]["Row"]["tier_key"];

type CreatorContext = {
  creator: CreatorProfile;
  supabase: Supabase;
  userId: string;
};

type TierInput = {
  deliverables: string[];
  description: string | null;
  estimatedDays: number;
  isActive: boolean;
  key: TierKey;
  name: string;
  price: number;
  revisionCount: number;
  sortOrder: number;
};

type ValidMediaFile = {
  extension: "jpg" | "jpeg" | "png" | "webp";
  file: File;
};

const tierLabels: Record<TierKey, string> = {
  basic: "Basic",
  medium: "Medium",
  premium: "Premium",
};

const tierSortOrder: Record<TierKey, number> = {
  basic: 1,
  medium: 2,
  premium: 3,
};

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
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

function getSelectedIds(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is string => typeof value === "string" && value.length > 0);
}

function getNumber(formData: FormData, key: string) {
  const value = getText(formData, key).replace(/[^\d]/g, "");
  return Number(value);
}

function getInteger(formData: FormData, key: string) {
  return Math.floor(getNumber(formData, key));
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

function redirectWithError(path: string, code: string): never {
  redirect(`${path}?error=${code}`);
}

function getImageValidationError(code: FileValidationErrorCode) {
  if (code === "size") {
    return "media_size";
  }

  if (code === "type" || code === "extension") {
    return "media_type";
  }

  return "media_missing";
}

function getBriefRequirements(formData: FormData) {
  const checklist = getSelectedIds(formData, "briefRequirements");
  const custom = getTextList(formData, "customBriefRequirements");
  return [...new Set([...checklist, ...custom])];
}

function getTierInput(formData: FormData, key: TierKey): TierInput {
  const enabled = key === "basic" || getText(formData, `${key}Enabled`) === "true";
  const name = getText(formData, `${key}Name`) || tierLabels[key];

  return {
    deliverables: getTextList(formData, `${key}Deliverables`),
    description: getNullableText(formData, `${key}Description`),
    estimatedDays: getInteger(formData, `${key}EstimatedDays`),
    isActive: enabled,
    key,
    name,
    price: getNumber(formData, `${key}Price`),
    revisionCount: getInteger(formData, `${key}RevisionCount`),
    sortOrder: tierSortOrder[key],
  };
}

function getTierInputs(formData: FormData) {
  return [
    getTierInput(formData, "basic"),
    getTierInput(formData, "medium"),
    getTierInput(formData, "premium"),
  ];
}

function getActiveTierInputs(formData: FormData) {
  return getTierInputs(formData).filter((tier) => tier.isActive);
}

function getValidationError(formData: FormData) {
  const title = getText(formData, "title");
  const categoryId = getText(formData, "categoryId");
  const basic = getTierInput(formData, "basic");

  if (!title || !categoryId || !basic.name) {
    return "required";
  }

  if (basic.price <= 0) {
    return "price";
  }

  if (basic.estimatedDays < 1 || basic.revisionCount < 0) {
    return "scope";
  }

  for (const tier of getActiveTierInputs(formData)) {
    if (!tier.name || tier.price <= 0) {
      return "price";
    }

    if (tier.estimatedDays < 1 || tier.revisionCount < 0) {
      return "scope";
    }
  }

  return null;
}

function getMediaFiles(formData: FormData, redirectPath: string) {
  const values = formData.getAll("mediaFiles");
  const files: ValidMediaFile[] = [];

  for (const value of values) {
    const validation = validateImageFile(value, {
      maxSizeBytes: FILE_SIZE_LIMITS.serviceCover,
    });

    if (!validation.ok) {
      redirectWithError(redirectPath, getImageValidationError(validation.code));
    }

    if (validation.file && validation.extension) {
      files.push({
        extension: validation.extension,
        file: validation.file,
      });
    }
  }

  return files;
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
    redirectWithError(redirectPath, "category");
  }

  return category.id;
}

async function ensureOwnedService(context: CreatorContext, serviceId: string) {
  if (!serviceId) {
    redirect("/creator/services?error=missing");
  }

  const { data: service, error } = await context.supabase
    .from("service_packages")
    .select("*")
    .eq("id", serviceId)
    .eq("creator_id", context.creator.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (error || !service) {
    redirect("/creator/services?error=not_found");
  }

  return service;
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

async function syncCreatorStartingPrice(context: CreatorContext) {
  const { data: tiers } = await context.supabase
    .from("service_package_tiers")
    .select("price, service_packages!inner(creator_id, is_active, deleted_at)")
    .eq("service_packages.creator_id", context.creator.id)
    .eq("service_packages.is_active", true)
    .is("service_packages.deleted_at", null)
    .eq("is_active", true);

  const prices = (tiers ?? []).map((tier) => Number(tier.price)).filter((price) => price > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

  await context.supabase
    .from("creator_profiles")
    .update({ starting_price: minPrice })
    .eq("id", context.creator.id);
}

function getTierPayload(serviceId: string, tier: TierInput): ServiceTierInsert {
  return {
    deliverables: tier.deliverables,
    description: tier.description,
    estimated_days: tier.estimatedDays,
    is_active: tier.isActive,
    name: tier.name,
    price: tier.price,
    revision_count: tier.revisionCount,
    service_package_id: serviceId,
    sort_order: tier.sortOrder,
    tier_key: tier.key,
  };
}

function getServiceMetricsFromTiers(tiers: readonly TierInput[]) {
  const activeTiers = tiers.filter((tier) => tier.isActive);
  const selectedTiers = activeTiers.length > 0 ? activeTiers : [tiers[0]];
  const cheapestTier = [...selectedTiers].sort((first, second) => first.price - second.price)[0];
  const fastestTier = [...selectedTiers].sort((first, second) => first.estimatedDays - second.estimatedDays)[0];
  const deliverables = cheapestTier?.deliverables.length ? cheapestTier.deliverables : selectedTiers.flatMap((tier) => tier.deliverables);

  return {
    basePrice: cheapestTier?.price ?? 0,
    deliverables: [...new Set(deliverables)],
    estimatedDays: fastestTier?.estimatedDays ?? 3,
    revisionCount: cheapestTier?.revisionCount ?? 1,
  };
}

async function uploadServiceMedia(
  context: CreatorContext,
  serviceId: string,
  files: readonly ValidMediaFile[],
  startOrder: number,
) {
  const createdMedia: ServiceMediaRow[] = [];
  const uploadedAssetIds: string[] = [];

  for (const [index, item] of files.entries()) {
    const storagePath = createServiceMediaStoragePath(
      context.creator.id,
      serviceId,
      item.extension,
    );
    const uploadResult = await uploadImageAsset({
      bucket: STORAGE_BUCKETS.PUBLIC_ASSETS,
      context: "service_media",
      creatorId: context.creator.id,
      extension: item.extension,
      file: item.file,
      ownerId: context.userId,
      servicePackageId: serviceId,
      storagePath,
      supabase: context.supabase,
      uploadedBy: context.userId,
      visibility: "public",
    });

    if (uploadResult.error || !uploadResult.asset) {
      await Promise.all(uploadedAssetIds.map((assetId) => removeImageAssetById(context.supabase, assetId)));
      redirectWithError(`/creator/services/${serviceId}/edit`, "media_upload");
    }

    uploadedAssetIds.push(uploadResult.asset.id);

    const { data: media, error: mediaError } = await context.supabase
      .from("service_media")
      .insert({
        alt_text: item.file.name,
        file_asset_id: uploadResult.asset.id,
        image_url: getPublicAssetUrl(context.supabase, storagePath),
        is_cover: false,
        service_package_id: serviceId,
        sort_order: startOrder + index,
      })
      .select("*")
      .single();

    if (mediaError || !media) {
      await Promise.all(uploadedAssetIds.map((assetId) => removeImageAssetById(context.supabase, assetId)));
      redirectWithError(`/creator/services/${serviceId}/edit`, "media_save");
    }

    createdMedia.push(media);
  }

  return createdMedia;
}

async function getActiveMedia(context: CreatorContext, serviceId: string) {
  const { data } = await context.supabase
    .from("service_media")
    .select("*")
    .eq("service_package_id", serviceId)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true });

  return data ?? [];
}

async function syncServiceCover(context: CreatorContext, serviceId: string, requestedCoverId?: string) {
  const media = await getActiveMedia(context, serviceId);
  const selected =
    media.find((item) => item.id === requestedCoverId) ??
    media.find((item) => item.is_cover) ??
    media[0] ??
    null;

  await context.supabase
    .from("service_media")
    .update({ is_cover: false })
    .eq("service_package_id", serviceId);

  if (selected) {
    await context.supabase
      .from("service_media")
      .update({ is_cover: true })
      .eq("id", selected.id)
      .eq("service_package_id", serviceId);
  }

  await context.supabase
    .from("service_packages")
    .update({
      cover_file_asset_id: selected?.file_asset_id ?? null,
      cover_image_url: selected?.image_url ?? null,
    })
    .eq("id", serviceId)
    .eq("creator_id", context.creator.id);
}

async function saveTiers(context: CreatorContext, serviceId: string, tiers: readonly TierInput[]) {
  const payload = tiers.map((tier) => getTierPayload(serviceId, tier));
  const { error } = await context.supabase
    .from("service_package_tiers")
    .upsert(payload, { onConflict: "service_package_id,tier_key" });

  if (error) {
    redirectWithError(`/creator/services/${serviceId}/edit`, "tier");
  }
}

async function removeServiceMedia(context: CreatorContext, serviceId: string, mediaIds: readonly string[]) {
  if (mediaIds.length === 0) {
    return;
  }

  const { data } = await context.supabase
    .from("service_media")
    .select("id, file_asset_id")
    .eq("service_package_id", serviceId)
    .in("id", [...mediaIds]);

  await context.supabase
    .from("service_media")
    .update({ deleted_at: new Date().toISOString(), is_cover: false })
    .eq("service_package_id", serviceId)
    .in("id", [...mediaIds]);

  await Promise.all((data ?? []).map((media) => removeImageAssetById(context.supabase, media.file_asset_id)));
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

async function ensureOwnedAddon(context: CreatorContext, serviceId: string, addonId: string) {
  await ensureOwnedService(context, serviceId);
  const { data: addon, error } = await context.supabase
    .from("service_addons")
    .select("id")
    .eq("id", addonId)
    .eq("service_package_id", serviceId)
    .maybeSingle();

  if (error || !addon) {
    redirect(`/creator/services/${serviceId}/edit?error=addon_not_found`);
  }

  return addon.id;
}

export async function createCreatorServiceAction(formData: FormData) {
  const validationError = getValidationError(formData);

  if (validationError) {
    redirect(`/creator/services/new?error=${validationError}`);
  }

  const mediaFiles = getMediaFiles(formData, "/creator/services/new");
  if (mediaFiles.length > 5) {
    redirect("/creator/services/new?error=media_limit");
  }

  const context = await getCreatorContext();
  const categoryId = await ensureActiveCategory(
    context,
    getText(formData, "categoryId"),
    "/creator/services/new",
  );
  const title = getText(formData, "title");
  const tiers = getTierInputs(formData);
  const metrics = getServiceMetricsFromTiers(tiers);
  const isActive = getText(formData, "isActive") === "true";
  const serviceId = randomUUID();
  const payload: ServicePackageInsert = {
    id: serviceId,
    base_price: metrics.basePrice,
    brief_requirements: getBriefRequirements(formData),
    category_id: categoryId,
    creator_id: context.creator.id,
    deliverables: metrics.deliverables,
    description: getNullableText(formData, "shortDescription"),
    estimated_days: metrics.estimatedDays,
    is_active: isActive,
    is_featured: false,
    published_at: isActive ? new Date().toISOString() : null,
    requirements: getBriefRequirements(formData),
    revision_count: metrics.revisionCount,
    short_description: getNullableText(formData, "shortDescription"),
    slug: `${createSlug(title)}-${Date.now().toString(36)}`,
    tags: getTextList(formData, "tags"),
    title,
  };
  const { data: service, error } = await context.supabase
    .from("service_packages")
    .insert(payload)
    .select("id")
    .single();

  if (error || !service) {
    redirectWithError("/creator/services/new", "save");
  }

  await saveTiers(context, service.id, tiers);
  const media = await uploadServiceMedia(context, service.id, mediaFiles, 0);
  await syncServiceCover(context, service.id, media[0]?.id);
  await syncCreatorStartingPrice(context);
  revalidateServicePaths(service.id, context.creator.id);
  redirect("/creator/services?created=1");
}

export async function updateCreatorServiceAction(formData: FormData) {
  const serviceId = getText(formData, "serviceId");
  const editPath = `/creator/services/${serviceId}/edit`;

  if (!serviceId) {
    redirect("/creator/services?error=missing");
  }

  const validationError = getValidationError(formData);

  if (validationError) {
    redirect(`${editPath}?error=${validationError}`);
  }

  const context = await getCreatorContext();
  const existingService = await ensureOwnedService(context, serviceId);
  const existingMedia = await getActiveMedia(context, serviceId);
  const removeMediaIds = getSelectedIds(formData, "removeMediaIds");
  const mediaFiles = getMediaFiles(formData, editPath);
  const remainingMediaCount = existingMedia.filter((media) => !removeMediaIds.includes(media.id)).length;

  if (remainingMediaCount + mediaFiles.length > 5) {
    redirect(`${editPath}?error=media_limit`);
  }

  const categoryId = await ensureActiveCategory(
    context,
    getText(formData, "categoryId"),
    editPath,
  );
  const tiers = getTierInputs(formData);
  const metrics = getServiceMetricsFromTiers(tiers);
  const isActive = getText(formData, "isActive") === "true";
  const payload: ServicePackageUpdate = {
    base_price: metrics.basePrice,
    brief_requirements: getBriefRequirements(formData),
    category_id: categoryId,
    deliverables: metrics.deliverables,
    description: getNullableText(formData, "shortDescription"),
    estimated_days: metrics.estimatedDays,
    is_active: isActive,
    published_at: isActive ? existingService.published_at ?? new Date().toISOString() : null,
    requirements: getBriefRequirements(formData),
    revision_count: metrics.revisionCount,
    short_description: getNullableText(formData, "shortDescription"),
    tags: getTextList(formData, "tags"),
    title: getText(formData, "title"),
  };

  const { error } = await context.supabase
    .from("service_packages")
    .update(payload)
    .eq("id", serviceId)
    .eq("creator_id", context.creator.id);

  if (error) {
    redirect(`${editPath}?error=save`);
  }

  await saveTiers(context, serviceId, tiers);
  await removeServiceMedia(context, serviceId, removeMediaIds);
  const uploadedMedia = await uploadServiceMedia(context, serviceId, mediaFiles, existingMedia.length);
  await syncServiceCover(
    context,
    serviceId,
    getText(formData, "coverMediaId") || uploadedMedia[0]?.id,
  );
  await syncCreatorStartingPrice(context);
  revalidateServicePaths(serviceId, context.creator.id);
  redirect("/creator/services?updated=1");
}

export async function toggleCreatorServiceStatusAction(formData: FormData) {
  const serviceId = getText(formData, "serviceId");

  if (!serviceId) {
    redirect("/creator/services?error=missing");
  }

  const context = await getCreatorContext();
  const service = await ensureOwnedService(context, serviceId);
  const nextActive = !service.is_active;
  const { error } = await context.supabase
    .from("service_packages")
    .update({
      is_active: nextActive,
      published_at: nextActive ? service.published_at ?? new Date().toISOString() : null,
    })
    .eq("id", service.id)
    .eq("creator_id", context.creator.id);

  if (error) {
    redirect("/creator/services?error=toggle");
  }

  await syncCreatorStartingPrice(context);
  revalidateServicePaths(serviceId, context.creator.id);
  redirect("/creator/services?toggled=1");
}

export async function deleteCreatorServiceAction(formData: FormData) {
  const serviceId = getText(formData, "serviceId");

  if (!serviceId) {
    redirect("/creator/services?error=missing");
  }

  const context = await getCreatorContext();
  await ensureOwnedService(context, serviceId);
  const { error } = await context.supabase
    .from("service_packages")
    .update({
      deleted_at: new Date().toISOString(),
      is_active: false,
      published_at: null,
    })
    .eq("id", serviceId)
    .eq("creator_id", context.creator.id);

  if (error) {
    redirect("/creator/services?error=delete");
  }

  await syncCreatorStartingPrice(context);
  revalidatePath("/creator/services");
  revalidatePath("/katalog");
  redirect("/creator/services?deleted=1");
}

export async function createCreatorServiceTierAction(formData: FormData) {
  const serviceId = getText(formData, "serviceId");
  const tierKey = (getText(formData, "tierKey") || "medium") as TierKey;
  const editPath = `/creator/services/${serviceId}/edit`;
  const context = await getCreatorContext();
  await ensureOwnedService(context, serviceId);
  const tier = getTierInput(formData, tierKey);

  if (!tier.name || tier.price <= 0 || tier.estimatedDays < 1 || tier.revisionCount < 0) {
    redirect(`${editPath}?error=tier_required`);
  }

  await saveTiers(context, serviceId, [{ ...tier, isActive: true }]);
  revalidateServicePaths(serviceId, context.creator.id);
  redirect(`${editPath}?tier_created=1`);
}

export async function updateCreatorServiceTierAction(formData: FormData) {
  const serviceId = getText(formData, "serviceId");
  const tierKey = (getText(formData, "tierKey") || "basic") as TierKey;
  const editPath = `/creator/services/${serviceId}/edit`;
  const context = await getCreatorContext();
  await ensureOwnedService(context, serviceId);
  const tier = getTierInput(formData, tierKey);

  if (tier.key === "basic" && !tier.isActive) {
    redirect(`${editPath}?error=tier_last_active`);
  }

  const payload: ServiceTierUpdate = getTierPayload(serviceId, tier);
  const { error } = await context.supabase
    .from("service_package_tiers")
    .update(payload)
    .eq("service_package_id", serviceId)
    .eq("tier_key", tierKey);

  if (error) {
    redirect(`${editPath}?error=tier_update`);
  }

  revalidateServicePaths(serviceId, context.creator.id);
  redirect(`${editPath}?tier_updated=1`);
}

export async function toggleCreatorServiceTierStatusAction(formData: FormData) {
  const serviceId = getText(formData, "serviceId");
  const tierKey = (getText(formData, "tierKey") || "medium") as TierKey;
  const editPath = `/creator/services/${serviceId}/edit`;

  if (tierKey === "basic") {
    redirect(`${editPath}?error=tier_last_active`);
  }

  const context = await getCreatorContext();
  await ensureOwnedService(context, serviceId);
  const { data: tier, error: tierError } = await context.supabase
    .from("service_package_tiers")
    .select("id, is_active")
    .eq("service_package_id", serviceId)
    .eq("tier_key", tierKey)
    .maybeSingle();

  if (tierError || !tier) {
    redirect(`${editPath}?error=tier_not_found`);
  }

  const { error } = await context.supabase
    .from("service_package_tiers")
    .update({ is_active: !tier.is_active })
    .eq("id", tier.id);

  if (error) {
    redirect(`${editPath}?error=tier_toggle`);
  }

  revalidateServicePaths(serviceId, context.creator.id);
  redirect(`${editPath}?tier_toggled=1`);
}

export async function createCreatorServiceAddonAction(formData: FormData) {
  const serviceId = getText(formData, "serviceId");
  const editPath = `/creator/services/${serviceId}/edit`;
  const validationError = getAddonValidationError(formData);

  if (validationError) {
    redirect(`${editPath}?error=${validationError}`);
  }

  const context = await getCreatorContext();
  await ensureOwnedService(context, serviceId);
  const { error } = await context.supabase.from("service_addons").insert({
    description: getNullableText(formData, "addonDescription"),
    is_active: getText(formData, "addonIsActive") !== "false",
    name: getText(formData, "addonName"),
    price: getNumber(formData, "addonPrice"),
    service_package_id: serviceId,
  });

  if (error) {
    redirect(`${editPath}?error=addon_save`);
  }

  revalidateServicePaths(serviceId, context.creator.id);
  redirect(`${editPath}?addon_created=1`);
}

export async function updateCreatorServiceAddonAction(formData: FormData) {
  const serviceId = getText(formData, "serviceId");
  const addonId = getText(formData, "addonId");
  const editPath = `/creator/services/${serviceId}/edit`;
  const validationError = getAddonValidationError(formData);

  if (!addonId) {
    redirect(`${editPath}?error=addon_missing`);
  }

  if (validationError) {
    redirect(`${editPath}?error=${validationError}`);
  }

  const context = await getCreatorContext();
  const ownedAddonId = await ensureOwnedAddon(context, serviceId, addonId);
  const { error } = await context.supabase
    .from("service_addons")
    .update({
      description: getNullableText(formData, "addonDescription"),
      is_active: getText(formData, "addonIsActive") !== "false",
      name: getText(formData, "addonName"),
      price: getNumber(formData, "addonPrice"),
    })
    .eq("id", ownedAddonId);

  if (error) {
    redirect(`${editPath}?error=addon_update`);
  }

  revalidateServicePaths(serviceId, context.creator.id);
  redirect(`${editPath}?addon_updated=1`);
}

export async function deleteCreatorServiceAddonAction(formData: FormData) {
  const serviceId = getText(formData, "serviceId");
  const addonId = getText(formData, "addonId");
  const editPath = `/creator/services/${serviceId}/edit`;

  if (!addonId) {
    redirect(`${editPath}?error=addon_missing`);
  }

  const context = await getCreatorContext();
  const ownedAddonId = await ensureOwnedAddon(context, serviceId, addonId);
  const { error } = await context.supabase
    .from("service_addons")
    .delete()
    .eq("id", ownedAddonId);

  if (error) {
    redirect(`${editPath}?error=addon_delete`);
  }

  revalidateServicePaths(serviceId, context.creator.id);
  redirect(`${editPath}?addon_deleted=1`);
}
