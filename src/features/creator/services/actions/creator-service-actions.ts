"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type CreatorProfile = Database["public"]["Tables"]["creator_profiles"]["Row"];

type CreatorContext = {
  creator: CreatorProfile;
  supabase: Awaited<ReturnType<typeof createClient>>;
};

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

  return { creator, supabase };
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

function revalidateServicePaths(serviceId: string) {
  revalidatePath("/creator/services");
  revalidatePath(`/creator/services/${serviceId}/edit`);
  revalidatePath(`/layanan/${serviceId}`);
}

export async function createCreatorServiceAction(formData: FormData) {
  const validationError = getValidationError(formData);

  if (validationError) {
    redirect(`/creator/services/new?error=${validationError}`);
  }

  const { creator, supabase } = await getCreatorContext();
  const title = getText(formData, "title");
  const basePrice = getNumber(formData, "basePrice");
  const estimatedDays = getInteger(formData, "estimatedDays");
  const revisionCount = getInteger(formData, "revisionCount");
  const tierPrice = getNumber(formData, "tierPrice");
  const tierEstimatedDays = getInteger(formData, "tierEstimatedDays") || estimatedDays;
  const tierRevisionCount = getInteger(formData, "tierRevisionCount");
  const slug = `${createSlug(title)}-${Date.now().toString(36)}`;

  const { data: service, error: serviceError } = await supabase
    .from("service_packages")
    .insert({
      base_price: basePrice,
      category_id: getNullableText(formData, "categoryId"),
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
    })
    .select("id")
    .single();

  if (serviceError || !service) {
    redirect("/creator/services/new?error=save");
  }

  const { error: tierError } = await supabase.from("service_package_tiers").insert({
    deliverables: getTextList(formData, "tierDeliverables"),
    description: getNullableText(formData, "tierDescription"),
    estimated_days: tierEstimatedDays,
    is_active: true,
    name: getText(formData, "tierName"),
    price: tierPrice,
    revision_count: tierRevisionCount >= 0 ? tierRevisionCount : revisionCount,
    service_package_id: service.id,
    sort_order: 1,
  });

  revalidatePath("/creator/services");

  if (tierError) {
    redirect(`/creator/services/${service.id}/edit?error=tier`);
  }

  redirect("/creator/services?created=1");
}

export async function updateCreatorServiceAction(formData: FormData) {
  const serviceId = getText(formData, "serviceId");
  const tierId = getText(formData, "tierId");

  if (!serviceId) {
    redirect("/creator/services?error=missing");
  }

  const validationError = getValidationError(formData);

  if (validationError) {
    redirect(`/creator/services/${serviceId}/edit?error=${validationError}`);
  }

  const { creator, supabase } = await getCreatorContext();
  const { data: existingService, error: existingError } = await supabase
    .from("service_packages")
    .select("id")
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

  const { error: serviceError } = await supabase
    .from("service_packages")
    .update({
      base_price: basePrice,
      category_id: getNullableText(formData, "categoryId"),
      deliverables: getTextList(formData, "deliverables"),
      description: getNullableText(formData, "description"),
      estimated_days: estimatedDays,
      is_active: getText(formData, "isActive") === "true",
      requirements: getTextList(formData, "requirements"),
      revision_count: revisionCount,
      short_description: getNullableText(formData, "shortDescription"),
      tags: getTextList(formData, "tags"),
      title,
    })
    .eq("id", serviceId)
    .eq("creator_id", creator.id);

  if (serviceError) {
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

  revalidateServicePaths(serviceId);
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

  revalidateServicePaths(serviceId);
  redirect("/creator/services?toggled=1");
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
