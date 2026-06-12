import { unstable_rethrow } from "next/navigation";

import { isDemoMode } from "@/lib/config/demo-mode";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type Tables = Database["public"]["Tables"];

export type CreatorServiceCategory = Pick<
  Tables["service_categories"]["Row"],
  "id" | "name" | "slug"
>;
export type CreatorServicePackage = Tables["service_packages"]["Row"];
export type CreatorServiceTier = Tables["service_package_tiers"]["Row"];
export type CreatorServiceAddon = Tables["service_addons"]["Row"];
export type CreatorServiceMedia = Tables["service_media"]["Row"];
export type CreatorProfile = Tables["creator_profiles"]["Row"];

export type CreatorServiceItem = {
  addons: readonly CreatorServiceAddon[];
  category: CreatorServiceCategory | null;
  media: readonly CreatorServiceMedia[];
  service: CreatorServicePackage;
  tiers: readonly CreatorServiceTier[];
};

export type CreatorServiceEditData = CreatorServiceItem & {
  tiersByKey: Record<CreatorServiceTier["tier_key"], CreatorServiceTier | null>;
};

async function getCurrentUserId() {
  if (isDemoMode()) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return data.user.id;
}

export async function getCurrentCreatorProfile() {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return null;
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("creator_profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export async function getCreatorServiceCategories() {
  if (isDemoMode()) {
    return [];
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("service_categories")
      .select("id, name, slug")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      return [];
    }

    if (!data) {
      return [];
    }

    return data;
  } catch (error) {
    unstable_rethrow(error);
    return [];
  }
}

export async function getCurrentCreatorServices() {
  try {
    const profile = await getCurrentCreatorProfile();

    if (!profile) {
      return [];
    }

    const supabase = await createClient();
    const { data: services, error } = await supabase
      .from("service_packages")
      .select("*")
      .eq("creator_id", profile.id)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error || !services || services.length === 0) {
      return [];
    }

    return enrichServices(services);
  } catch {
    return [];
  }
}

export async function getCreatorServiceForEdit(serviceId: string) {
  try {
    const profile = await getCurrentCreatorProfile();

    if (!profile) {
      return null;
    }

    const supabase = await createClient();
    const { data: service, error } = await supabase
      .from("service_packages")
      .select("*")
      .eq("id", serviceId)
      .eq("creator_id", profile.id)
      .is("deleted_at", null)
      .maybeSingle();

    if (error || !service) {
      return null;
    }

    const [item] = await enrichServices([service]);

    if (!item) {
      return null;
    }

    return {
      ...item,
      tiersByKey: {
        basic:
          item.tiers.find((tier) => tier.tier_key === "basic") ??
          item.tiers[0] ??
          null,
        medium: item.tiers.find((tier) => tier.tier_key === "medium") ?? null,
        premium: item.tiers.find((tier) => tier.tier_key === "premium") ?? null,
      },
    };
  } catch {
    return null;
  }
}

async function enrichServices(services: readonly CreatorServicePackage[]) {
  const supabase = await createClient();
  const serviceIds = services.map((service) => service.id);
  const categoryIds = services
    .map((service) => service.category_id)
    .filter((categoryId): categoryId is string => Boolean(categoryId));

  const [categoriesResult, tiersResult, addonsResult, mediaResult] = await Promise.all([
    categoryIds.length > 0
      ? supabase.from("service_categories").select("id, name, slug").in("id", categoryIds)
      : Promise.resolve({ data: [] as CreatorServiceCategory[], error: null }),
    supabase
      .from("service_package_tiers")
      .select("*")
      .in("service_package_id", serviceIds)
      .order("sort_order", { ascending: true }),
    supabase
      .from("service_addons")
      .select("*")
      .in("service_package_id", serviceIds)
      .order("created_at", { ascending: true }),
    supabase
      .from("service_media")
      .select("*")
      .in("service_package_id", serviceIds)
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
  ]);

  const categoryById = new Map(
    (categoriesResult.data ?? []).map((category) => [category.id, category]),
  );
  const tiersByServiceId = new Map<string, CreatorServiceTier[]>();
  const addonsByServiceId = new Map<string, CreatorServiceAddon[]>();
  const mediaByServiceId = new Map<string, CreatorServiceMedia[]>();

  for (const tier of tiersResult.data ?? []) {
    const current = tiersByServiceId.get(tier.service_package_id) ?? [];
    current.push(tier);
    tiersByServiceId.set(tier.service_package_id, current);
  }

  for (const addon of addonsResult.data ?? []) {
    const current = addonsByServiceId.get(addon.service_package_id) ?? [];
    current.push(addon);
    addonsByServiceId.set(addon.service_package_id, current);
  }

  for (const media of mediaResult.data ?? []) {
    const current = mediaByServiceId.get(media.service_package_id) ?? [];
    current.push(media);
    mediaByServiceId.set(media.service_package_id, current);
  }

  return services.map((service): CreatorServiceItem => ({
    addons: addonsByServiceId.get(service.id) ?? [],
    category: service.category_id ? categoryById.get(service.category_id) ?? null : null,
    media: mediaByServiceId.get(service.id) ?? [],
    service,
    tiers: tiersByServiceId.get(service.id) ?? [],
  }));
}
