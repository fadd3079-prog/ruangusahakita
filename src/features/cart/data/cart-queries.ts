import { unstable_noStore as noStore } from "next/cache";

import { isDemoMode } from "@/lib/config/demo-mode";
import { createClient } from "@/lib/supabase/server";
import type { StorageBucket } from "@/lib/storage/buckets";
import { createStorageSignedUrl } from "@/lib/storage/urls";
import type { Database } from "@/lib/supabase/types";
import type { CheckoutSelection } from "@/features/checkout/lib/checkout-source";

type Tables = Database["public"]["Tables"];

type CartRow = Tables["carts"]["Row"];
type CartItemRow = Tables["cart_items"]["Row"];
type CartAddonRow = Tables["cart_item_addons"]["Row"];
type ServiceRow = Tables["service_packages"]["Row"];
type TierRow = Tables["service_package_tiers"]["Row"];
type AddonRow = Tables["service_addons"]["Row"];
type CreatorRow = Tables["creator_profiles"]["Row"];
type CategoryRow = Tables["service_categories"]["Row"];
type BriefRow = Tables["campaign_briefs"]["Row"];
type FileAssetRow = Tables["file_assets"]["Row"];

type Supabase = Awaited<ReturnType<typeof createClient>>;

export type CartAddonDisplay = {
  id: string;
  name: string;
  price: number;
};

export type CartDisplayItem = {
  addonTotal: number;
  addons: readonly CartAddonDisplay[];
  categoryDescription: string;
  categoryName: string;
  creatorName: string;
  deliverables: readonly string[];
  estimatedDays: number;
  id: string;
  revisionCount: number;
  serviceId: string;
  serviceTitle: string;
  subtotal: number;
  tierId: string | null;
  tierName: string;
  tierPrice: number;
};

export type CurrentCart = {
  addonTotal: number;
  adminFee: number;
  cart: CartRow | null;
  items: readonly CartDisplayItem[];
  serviceSubtotal: number;
  totalPayment: number;
};

export type CheckoutBriefData = {
  additionalNotes: string | null;
  assets: readonly CheckoutBriefAsset[];
  businessCategory: string | null;
  businessName: string;
  campaignGoal: string;
  contentPlatforms: readonly string[];
  contentStyle: string | null;
  deadline: string | null;
  id: string;
  promotedFocus: string;
  referenceLinks: readonly string[];
  targetAudience: string | null;
};

export type CheckoutBriefAsset = {
  id: string;
  name: string;
  url: string | null;
};

export type CheckoutUmkmData = {
  businessCategory: string | null;
  businessName: string;
  id: string;
  targetAudience: string | null;
};

export type CurrentCheckoutData = {
  brief: CheckoutBriefData | null;
  cart: CurrentCart;
  source: CheckoutSelection["source"];
  umkm: CheckoutUmkmData | null;
};

const adminFee = 5000;

async function getCurrentUmkmProfile() {
  if (isDemoMode()) {
    return null;
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return null;
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
    return null;
  }

  const { data: umkm, error: umkmError } = await supabase
    .from("umkm_profiles")
    .select("*")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (umkmError || !umkm) {
    return null;
  }

  return umkm;
}

function emptyCart(): CurrentCart {
  return {
    addonTotal: 0,
    adminFee: 0,
    cart: null,
    items: [],
    serviceSubtotal: 0,
    totalPayment: 0,
  };
}

function toNumber(value: number | string | null | undefined) {
  return Number(value ?? 0);
}

function unique(values: readonly (string | null | undefined)[]) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value))));
}

export async function getCurrentCart(): Promise<CurrentCart> {
  noStore();
  if (isDemoMode()) {
    return emptyCart();
  }

  try {
    const umkm = await getCurrentUmkmProfile();

    if (!umkm) {
      return emptyCart();
    }

    const supabase = await createClient();
    const { data: cart, error: cartError } = await supabase
      .from("carts")
      .select("*")
      .eq("umkm_id", umkm.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (cartError || !cart) {
      return emptyCart();
    }

    const { data: items, error: itemError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("cart_id", cart.id)
      .order("created_at", { ascending: true });

    if (itemError || !items || items.length === 0) {
      return {
        ...emptyCart(),
        cart,
      };
    }

    const displayItems = await enrichCartItems(items);

    const serviceSubtotal = displayItems.reduce(
      (total, item) => total + item.tierPrice,
      0,
    );
    const addonTotal = displayItems.reduce(
      (total, item) => total + item.addonTotal,
      0,
    );
    const currentAdminFee = displayItems.length > 0 ? adminFee : 0;

    return {
      addonTotal,
      adminFee: currentAdminFee,
      cart,
      items: displayItems,
      serviceSubtotal,
      totalPayment: serviceSubtotal + addonTotal + currentAdminFee,
    };
  } catch {
    return emptyCart();
  }
}

export async function getCurrentCartItemCount() {
  noStore();
  if (isDemoMode()) {
    return 0;
  }

  try {
    const umkm = await getCurrentUmkmProfile();

    if (!umkm) {
      return 0;
    }

    const supabase = await createClient();
    const { data: cart, error: cartError } = await supabase
      .from("carts")
      .select("id")
      .eq("umkm_id", umkm.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (cartError || !cart) {
      return 0;
    }

    const { count, error } = await supabase
      .from("cart_items")
      .select("id", { count: "exact", head: true })
      .eq("cart_id", cart.id);

    if (error) {
      return 0;
    }

    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function getCurrentCheckoutData(
  selection: CheckoutSelection = { source: "cart" },
): Promise<CurrentCheckoutData> {
  if (isDemoMode()) {
    return {
      brief: null,
      cart: emptyCart(),
      source: selection.source,
      umkm: null,
    };
  }

  try {
    const umkm = await getCurrentUmkmProfile();
    const cart =
      selection.source === "direct"
        ? await getDirectCheckoutCart(selection)
        : await getCurrentCart();

    if (!umkm) {
      return {
        brief: null,
        cart,
        source: selection.source,
        umkm: null,
      };
    }

    const supabase = await createClient();
    const { data: brief } = await supabase
      .from("campaign_briefs")
      .select("*")
      .eq("umkm_id", umkm.id)
      .is("order_id", null)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const assets = brief ? await getBriefAssetPreviews(supabase, brief.id) : [];

    return {
      brief: brief ? mapBrief(brief, assets) : null,
      cart,
      source: selection.source,
      umkm: {
        businessCategory: umkm.business_category,
        businessName: umkm.business_name,
        id: umkm.id,
        targetAudience: umkm.target_audience,
      },
    };
  } catch {
    return {
      brief: null,
      cart: emptyCart(),
      source: selection.source,
      umkm: null,
    };
  }
}

async function getDirectCheckoutCart(
  selection: Extract<CheckoutSelection, { source: "direct" }>,
): Promise<CurrentCart> {
  const supabase = await createClient();
  const { data: service, error: serviceError } = await supabase
    .from("service_packages")
    .select("*")
    .eq("id", selection.serviceId)
    .eq("is_active", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (serviceError || !service) {
    return emptyCart();
  }

  const tierQuery = supabase
    .from("service_package_tiers")
    .select("*")
    .eq("service_package_id", service.id)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  const { data: tiers, error: tierError } = selection.tierId
    ? await tierQuery.eq("id", selection.tierId).limit(1)
    : await tierQuery.limit(1);
  const tier = tiers?.[0] ?? null;

  if (tierError || !tier) {
    return emptyCart();
  }

  const [creatorResult, categoryResult, addonResult] = await Promise.all([
    supabase
      .from("creator_profiles")
      .select("*")
      .eq("id", service.creator_id)
      .maybeSingle(),
    service.category_id
      ? supabase
          .from("service_categories")
          .select("*")
          .eq("id", service.category_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    selection.addonIds.length > 0
      ? supabase
          .from("service_addons")
          .select("*")
          .eq("service_package_id", service.id)
          .eq("is_active", true)
          .in("id", [...selection.addonIds])
      : Promise.resolve({ data: [] as AddonRow[], error: null }),
  ]);

  if (
    creatorResult.error ||
    !creatorResult.data ||
    addonResult.error ||
    (addonResult.data?.length ?? 0) !== selection.addonIds.length
  ) {
    return emptyCart();
  }

  const addons = (addonResult.data ?? []).map((addon) => ({
    id: addon.id,
    name: addon.name,
    price: toNumber(addon.price),
  }));
  const tierPrice = toNumber(tier.price);
  const addonTotal = addons.reduce((total, addon) => total + addon.price, 0);
  const item: CartDisplayItem = {
    addonTotal,
    addons,
    categoryDescription:
      categoryResult.data?.description ??
      "Layanan digital untuk kebutuhan promosi UMKM.",
    categoryName: categoryResult.data?.name ?? "Layanan digital",
    creatorName: creatorResult.data.display_name,
    deliverables: tier.deliverables ?? service.deliverables ?? [],
    estimatedDays: tier.estimated_days,
    id: `${service.id}:${tier.id}`,
    revisionCount: tier.revision_count,
    serviceId: service.id,
    serviceTitle: service.title,
    subtotal: tierPrice + addonTotal,
    tierId: tier.id,
    tierName: tier.name,
    tierPrice,
  };

  return {
    addonTotal,
    adminFee,
    cart: null,
    items: [item],
    serviceSubtotal: tierPrice,
    totalPayment: tierPrice + addonTotal + adminFee,
  };
}

async function enrichCartItems(items: readonly CartItemRow[]) {
  const supabase = await createClient();
  const itemIds = items.map((item) => item.id);
  const serviceIds = unique(items.map((item) => item.service_package_id));
  const tierIds = unique(items.map((item) => item.tier_id));
  const creatorIds = unique(items.map((item) => item.creator_id));

  const [servicesResult, tiersResult, creatorsResult, cartAddonsResult] =
    await Promise.all([
      supabase.from("service_packages").select("*").in("id", serviceIds),
      tierIds.length > 0
        ? supabase.from("service_package_tiers").select("*").in("id", tierIds)
        : Promise.resolve({ data: [] as TierRow[], error: null }),
      supabase.from("creator_profiles").select("*").in("id", creatorIds),
      supabase.from("cart_item_addons").select("*").in("cart_item_id", itemIds),
    ]);

  const services = servicesResult.data ?? [];
  const tiers = tiersResult.data ?? [];
  const creators = creatorsResult.data ?? [];
  const cartAddons = cartAddonsResult.data ?? [];
  const categoryIds = unique(services.map((service) => service.category_id));
  const addonIds = unique(cartAddons.map((addon) => addon.addon_id));

  const [categoriesResult, addonsResult] = await Promise.all([
    categoryIds.length > 0
      ? supabase.from("service_categories").select("*").in("id", categoryIds)
      : Promise.resolve({ data: [] as CategoryRow[], error: null }),
    addonIds.length > 0
      ? supabase.from("service_addons").select("*").in("id", addonIds)
      : Promise.resolve({ data: [] as AddonRow[], error: null }),
  ]);

  const serviceById = new Map(services.map((service) => [service.id, service]));
  const tierById = new Map(tiers.map((tier) => [tier.id, tier]));
  const creatorById = new Map(creators.map((creator) => [creator.id, creator]));
  const categoryById = new Map(
    (categoriesResult.data ?? []).map((category) => [category.id, category]),
  );
  const addonById = new Map(
    (addonsResult.data ?? []).map((addon) => [addon.id, addon]),
  );
  const cartAddonsByItemId = new Map<string, CartAddonRow[]>();

  for (const addon of cartAddons) {
    const current = cartAddonsByItemId.get(addon.cart_item_id) ?? [];
    current.push(addon);
    cartAddonsByItemId.set(addon.cart_item_id, current);
  }

  return items.map((item): CartDisplayItem => {
    const service = serviceById.get(item.service_package_id) as ServiceRow | undefined;
    const tier = item.tier_id ? tierById.get(item.tier_id) : null;
    const creator = creatorById.get(item.creator_id) as CreatorRow | undefined;
    const category = service?.category_id
      ? (categoryById.get(service.category_id) as CategoryRow | undefined)
      : null;
    const addons = (cartAddonsByItemId.get(item.id) ?? []).map((cartAddon) => {
      const addon = addonById.get(cartAddon.addon_id);

      return {
        id: cartAddon.id,
        name: addon?.name ?? "Add-on layanan",
        price: toNumber(cartAddon.price),
      };
    });

    return {
      addonTotal: addons.reduce((total, addon) => total + addon.price, 0),
      addons,
      categoryDescription:
        category?.description ?? "Layanan digital untuk kebutuhan promosi UMKM.",
      categoryName: category?.name ?? "Layanan digital",
      creatorName: creator?.display_name ?? "Kreator",
      deliverables: tier?.deliverables ?? service?.deliverables ?? [],
      estimatedDays: tier?.estimated_days ?? service?.estimated_days ?? 0,
      id: item.id,
      revisionCount: tier?.revision_count ?? service?.revision_count ?? 0,
      serviceId: item.service_package_id,
      serviceTitle: service?.title ?? "Paket jasa digital",
      subtotal: toNumber(item.subtotal),
      tierId: item.tier_id,
      tierName: tier?.name ?? "Paket utama",
      tierPrice: toNumber(item.unit_price),
    };
  });
}

async function getBriefAssetPreviews(
  supabase: Supabase,
  briefId: string,
): Promise<CheckoutBriefAsset[]> {
  const { data } = await supabase
    .from("file_assets")
    .select("*")
    .eq("brief_id", briefId)
    .eq("context", "brief_asset")
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  const assets = (data ?? []) as FileAssetRow[];

  return Promise.all(
    assets.map(async (asset) => ({
      id: asset.id,
      name: asset.original_filename ?? asset.file_name,
      url: await createStorageSignedUrl(
        supabase,
        asset.bucket_name as StorageBucket,
        asset.storage_path,
      ),
    })),
  );
}

function mapBrief(
  brief: BriefRow,
  assets: readonly CheckoutBriefAsset[],
): CheckoutBriefData {
  return {
    additionalNotes: brief.additional_notes,
    assets,
    businessCategory: brief.business_category,
    businessName: brief.business_name,
    campaignGoal: brief.campaign_goal,
    contentPlatforms: brief.content_platforms ?? [],
    contentStyle: brief.content_style,
    deadline: brief.deadline,
    id: brief.id,
    promotedFocus: brief.promoted_product,
    referenceLinks: brief.reference_links ?? [],
    targetAudience: brief.target_audience,
  };
}
