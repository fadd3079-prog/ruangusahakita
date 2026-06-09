"use server";

import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { STORAGE_BUCKETS } from "@/lib/storage/buckets";
import { FILE_SIZE_LIMITS } from "@/lib/storage/file-limits";
import type { AllowedImageExtension } from "@/lib/storage/file-types";
import { createBriefAssetStoragePath } from "@/lib/storage/file-paths";
import { removeImageAssetById, uploadImageAsset } from "@/lib/storage/image-assets";
import { validateImageFile } from "@/lib/storage/validate-file";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type Supabase = Awaited<ReturnType<typeof createClient>>;
type UmkmProfile = Database["public"]["Tables"]["umkm_profiles"]["Row"];
type ServicePackage = Database["public"]["Tables"]["service_packages"]["Row"];
type ServiceTier = Database["public"]["Tables"]["service_package_tiers"]["Row"];
type ServiceAddon = Database["public"]["Tables"]["service_addons"]["Row"];
type Cart = Database["public"]["Tables"]["carts"]["Row"];
type CartItem = Database["public"]["Tables"]["cart_items"]["Row"];

type UmkmContext = {
  supabase: Supabase;
  umkm: UmkmProfile;
  userId: string;
};

type ServiceSelection = {
  addonTotal: number;
  addons: readonly ServiceAddon[];
  service: ServicePackage;
  subtotal: number;
  tier: ServiceTier;
};

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

function getSelectedAddons(formData: FormData) {
  return formData
    .getAll("addonIds")
    .filter((value): value is string => typeof value === "string" && value.length > 0);
}

function getSelectedIds(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is string => typeof value === "string" && value.length > 0);
}

function sanitizeRedirectPath(value: string) {
  if (value === "/umkm/checkout") {
    return value;
  }

  return "/umkm/cart";
}

async function requireUmkmContext(): Promise<UmkmContext> {
  const supabase = await createClient();
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
    .select("*")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (umkmError || !umkm) {
    redirect("/umkm/dashboard?error=profile");
  }

  return { supabase, umkm, userId: userData.user.id };
}

function getBriefAssetValidationError(code: "missing" | "type" | "extension" | "size") {
  if (code === "size") {
    return "brief_asset_size";
  }

  if (code === "type" || code === "extension") {
    return "brief_asset_type";
  }

  return "brief_asset_missing";
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
  context: UmkmContext,
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
      ownerId: context.userId,
      storagePath: createBriefAssetStoragePath(
        context.umkm.id,
        briefId,
        item.extension,
      ),
      supabase: context.supabase,
      uploadedBy: context.userId,
      visibility: "restricted",
      umkmId: context.umkm.id,
      briefId,
    });

    if (result.error || !result.asset) {
      await Promise.all(
        uploadedAssetIds.map((assetId) =>
          removeImageAssetById(context.supabase, assetId),
        ),
      );
      redirect(`${redirectPath}?error=brief_asset_upload`);
    }

    uploadedAssetIds.push(result.asset.id);
  }
}

async function removeBriefAssets(
  context: UmkmContext,
  briefId: string,
  assetIds: readonly string[],
) {
  if (assetIds.length === 0) {
    return;
  }

  const { data } = await context.supabase
    .from("file_assets")
    .select("id")
    .eq("brief_id", briefId)
    .eq("umkm_id", context.umkm.id)
    .in("id", [...assetIds]);

  await Promise.all(
    (data ?? []).map((asset) =>
      removeImageAssetById(context.supabase, asset.id),
    ),
  );
}

async function getOrCreateActiveCart(supabase: Supabase, umkmId: string) {
  const { data: existingCart, error: existingError } = await supabase
    .from("carts")
    .select("*")
    .eq("umkm_id", umkmId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingError) {
    redirect("/umkm/cart?error=cart");
  }

  if (existingCart) {
    return existingCart;
  }

  const { data: cart, error: createError } = await supabase
    .from("carts")
    .insert({
      status: "active",
      umkm_id: umkmId,
    })
    .select("*")
    .single();

  if (createError || !cart) {
    redirect("/umkm/cart?error=cart");
  }

  return cart;
}

async function getActiveServiceSelection(
  supabase: Supabase,
  serviceId: string,
  tierId: string,
  addonIds: readonly string[],
) {
  const { data: service, error: serviceError } = await supabase
    .from("service_packages")
    .select("*")
    .eq("id", serviceId)
    .eq("is_active", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (serviceError || !service) {
    redirect("/katalog?error=service");
  }

  const tierQuery = supabase
    .from("service_package_tiers")
    .select("*")
    .eq("service_package_id", service.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  const { data: tiers, error: tierError } = tierId
    ? await tierQuery.eq("id", tierId).limit(1)
    : await tierQuery.limit(1);

  const tier = tiers?.[0] ?? null;

  if (tierError || !tier) {
    redirect(`/layanan/${service.id}?error=tier`);
  }

  const { data: addons, error: addonError } =
    addonIds.length > 0
      ? await supabase
          .from("service_addons")
          .select("*")
          .eq("service_package_id", service.id)
          .eq("is_active", true)
          .in("id", [...addonIds])
      : { data: [] as ServiceAddon[], error: null };

  if (addonError) {
    redirect(`/layanan/${service.id}?error=addon`);
  }

  const addonTotal = (addons ?? []).reduce(
    (total, addon) => total + Number(addon.price),
    0,
  );

  return {
    addonTotal,
    addons: addons ?? [],
    service,
    subtotal: Number(tier.price) + addonTotal,
    tier,
  } satisfies ServiceSelection;
}

async function replaceCartItemAddons(
  supabase: Supabase,
  itemId: string,
  selection: ServiceSelection,
) {
  await supabase.from("cart_item_addons").delete().eq("cart_item_id", itemId);

  if (selection.addons.length === 0) {
    return;
  }

  const { error } = await supabase.from("cart_item_addons").insert(
    selection.addons.map((addon) => ({
      addon_id: addon.id,
      cart_item_id: itemId,
      price: Number(addon.price),
    })),
  );

  if (error) {
    redirect("/umkm/cart?error=addon");
  }
}

async function upsertCartItem(
  supabase: Supabase,
  cart: Cart,
  selection: ServiceSelection,
) {
  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("*")
    .eq("cart_id", cart.id)
    .eq("service_package_id", selection.service.id)
    .eq("tier_id", selection.tier.id)
    .maybeSingle();

  const payload = {
    addon_total: selection.addonTotal,
    cart_id: cart.id,
    creator_id: selection.service.creator_id,
    quantity: 1,
    service_package_id: selection.service.id,
    subtotal: selection.subtotal,
    tier_id: selection.tier.id,
    unit_price: Number(selection.tier.price),
  };

  if (existingItem) {
    const { error } = await supabase
      .from("cart_items")
      .update(payload)
      .eq("id", existingItem.id);

    if (error) {
      redirect("/umkm/cart?error=save");
    }

    await replaceCartItemAddons(supabase, existingItem.id, selection);
    return;
  }

  const { data: item, error } = await supabase
    .from("cart_items")
    .insert(payload)
    .select("*")
    .single();

  if (error || !item) {
    redirect("/umkm/cart?error=save");
  }

  await replaceCartItemAddons(supabase, item.id, selection);
}

export async function addServiceToCart(formData: FormData) {
  const serviceId = getText(formData, "serviceId");
  const tierId = getText(formData, "tierId");
  const redirectTo = sanitizeRedirectPath(getText(formData, "redirectTo"));

  if (!serviceId) {
    redirect("/katalog?error=service");
  }

  const { supabase, umkm } = await requireUmkmContext();
  const cart = await getOrCreateActiveCart(supabase, umkm.id);
  const selection = await getActiveServiceSelection(
    supabase,
    serviceId,
    tierId,
    getSelectedAddons(formData),
  );

  await upsertCartItem(supabase, cart, selection);
  revalidatePath("/umkm/cart");
  revalidatePath("/umkm/checkout");
  redirect(`${redirectTo}?added=1`);
}

export async function updateCartItem(formData: FormData) {
  const itemId = getText(formData, "itemId");
  const tierId = getText(formData, "tierId");

  if (!itemId) {
    redirect("/umkm/cart?error=item");
  }

  const { supabase, umkm } = await requireUmkmContext();
  const cart = await getOrCreateActiveCart(supabase, umkm.id);
  const { data: item, error: itemError } = await supabase
    .from("cart_items")
    .select("*")
    .eq("id", itemId)
    .eq("cart_id", cart.id)
    .maybeSingle();

  if (itemError || !item) {
    redirect("/umkm/cart?error=item");
  }

  const selection = await getActiveServiceSelection(
    supabase,
    item.service_package_id,
    tierId || item.tier_id || "",
    getSelectedAddons(formData),
  );

  await updateCartItemRow(supabase, item, selection);
  revalidatePath("/umkm/cart");
  revalidatePath("/umkm/checkout");
  redirect("/umkm/cart?updated=1");
}

async function updateCartItemRow(
  supabase: Supabase,
  item: CartItem,
  selection: ServiceSelection,
) {
  const { error } = await supabase
    .from("cart_items")
    .update({
      addon_total: selection.addonTotal,
      creator_id: selection.service.creator_id,
      quantity: 1,
      service_package_id: selection.service.id,
      subtotal: selection.subtotal,
      tier_id: selection.tier.id,
      unit_price: Number(selection.tier.price),
    })
    .eq("id", item.id);

  if (error) {
    redirect("/umkm/cart?error=save");
  }

  await replaceCartItemAddons(supabase, item.id, selection);
}

export async function removeCartItem(formData: FormData) {
  const itemId = getText(formData, "itemId");

  if (!itemId) {
    redirect("/umkm/cart?error=item");
  }

  const { supabase, umkm } = await requireUmkmContext();
  const cart = await getOrCreateActiveCart(supabase, umkm.id);
  const { data: item, error: itemError } = await supabase
    .from("cart_items")
    .select("id")
    .eq("id", itemId)
    .eq("cart_id", cart.id)
    .maybeSingle();

  if (itemError || !item) {
    redirect("/umkm/cart?error=item");
  }

  await supabase.from("cart_item_addons").delete().eq("cart_item_id", item.id);
  const { error } = await supabase.from("cart_items").delete().eq("id", item.id);

  if (error) {
    redirect("/umkm/cart?error=remove");
  }

  revalidatePath("/umkm/cart");
  revalidatePath("/umkm/checkout");
  redirect("/umkm/cart?removed=1");
}

export async function clearCart() {
  const { supabase, umkm } = await requireUmkmContext();
  const cart = await getOrCreateActiveCart(supabase, umkm.id);
  const { data: items } = await supabase
    .from("cart_items")
    .select("id")
    .eq("cart_id", cart.id);
  const itemIds = items?.map((item) => item.id) ?? [];

  if (itemIds.length > 0) {
    await supabase.from("cart_item_addons").delete().in("cart_item_id", itemIds);
    const { error } = await supabase.from("cart_items").delete().in("id", itemIds);

    if (error) {
      redirect("/umkm/cart?error=clear");
    }
  }

  revalidatePath("/umkm/cart");
  revalidatePath("/umkm/checkout");
  redirect("/umkm/cart?cleared=1");
}

export async function createOrUpdateCampaignBrief(formData: FormData) {
  const businessName = getText(formData, "businessName");
  const businessCategory = getText(formData, "businessCategory");
  const promotedFocus = getText(formData, "promotedFocus");
  const campaignGoal = getText(formData, "campaignGoal");
  const assetFiles = validateBriefAssetFiles(formData, "/umkm/checkout");
  const removeAssetIds = getSelectedIds(formData, "removeBriefAssetIds");

  if (!businessName || !businessCategory || !promotedFocus || !campaignGoal) {
    redirect("/umkm/checkout?error=brief_required");
  }

  const context = await requireUmkmContext();
  const { supabase, umkm } = context;
  const { data: existingBrief } = await supabase
    .from("campaign_briefs")
    .select("*")
    .eq("umkm_id", umkm.id)
    .is("order_id", null)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const briefId = existingBrief?.id ?? randomUUID();
  const payload = {
    additional_notes: getText(formData, "additionalNotes") || null,
    business_category: businessCategory,
    business_name: businessName,
    campaign_goal: campaignGoal,
    content_platforms: getTextList(formData, "contentPlatforms"),
    content_style: getText(formData, "contentStyle") || null,
    deadline: getText(formData, "deadline") || null,
    promoted_product: promotedFocus,
    reference_links: getTextList(formData, "referenceLinks"),
    status: "draft",
    target_audience: getText(formData, "targetAudience") || null,
    umkm_id: umkm.id,
  };

  const result = existingBrief
    ? await supabase
        .from("campaign_briefs")
        .update(payload)
        .eq("id", existingBrief.id)
        .eq("umkm_id", umkm.id)
        .is("order_id", null)
    : await supabase.from("campaign_briefs").insert({
        ...payload,
        id: briefId,
      });

  if (result.error) {
    redirect("/umkm/checkout?error=brief_save");
  }

  await removeBriefAssets(context, briefId, removeAssetIds);
  await uploadBriefAssets(context, briefId, assetFiles, "/umkm/checkout");

  revalidatePath("/umkm/checkout");
  revalidatePath("/umkm/briefs");
  revalidatePath(`/umkm/briefs/${briefId}`);
  redirect("/umkm/checkout?saved=1");
}
