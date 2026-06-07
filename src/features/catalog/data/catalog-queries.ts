import { createClient } from "@/lib/supabase/server";
import { 
  dummyServiceCategories, 
  dummyCreators, 
  dummyServicePackages,
  dummyServiceTiers,
  dummyServiceAddons,
  dummyPortfolios,
} from "@/lib/dummy";
import type { 
  DummyServiceCategory, 
  DummyCreatorProfile, 
  DummyServicePackage,
  DummyServiceTier,
  DummyServiceAddon,
  DummyPortfolioItem,
  DummyReview,
  DummyUmkmProfile,
  DummyAvailabilityStatus,
  DummyServiceTierName
} from "@/lib/dummy/types";

/**
 * Fetches active service categories from Supabase.
 */
export async function getPublicCategories(): Promise<readonly DummyServiceCategory[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("service_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return dummyServiceCategories;
    }

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description ?? "",
      iconName: item.icon_name ?? "Megaphone",
    }));
  } catch {
    return dummyServiceCategories;
  }
}

/**
 * Fetches a public creator profile by ID.
 */
export async function getPublicCreatorById(id: string): Promise<DummyCreatorProfile | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("creator_profiles")
      .select("*, profiles!inner(account_status)")
      .eq("id", id)
      .eq("profiles.account_status", "active")
      .single();

    if (error || !data) {
      return dummyCreators.find(c => c.id === id) ?? null;
    }

    return {
      id: data.id,
      userId: data.user_id,
      displayName: data.display_name,
      bio: data.bio ?? "",
      city: data.city ?? "",
      province: data.province ?? "",
      niche: data.niche ?? "",
      skills: data.skills ?? [],
      avatarUrl: data.avatar_url ?? "",
      bannerUrl: data.banner_url ?? "",
      instagramUrl: data.instagram_url ?? "",
      tiktokUrl: data.tiktok_url ?? "",
      availabilityStatus: data.availability_status as DummyAvailabilityStatus,
      startingPrice: Number(data.starting_price),
      averageRating: Number(data.average_rating),
      completedOrdersCount: data.completed_orders_count,
      responseTimeHours: data.response_time_hours ?? 0,
      isVerified: data.is_verified,
      isFeatured: data.is_featured,
    };
  } catch {
    return dummyCreators.find(c => c.id === id) ?? null;
  }
}

/**
 * Fetches full creator details.
 */
export async function getPublicCreatorDetail(id: string) {
  try {
    const supabase = await createClient();
    
    const creator = await getPublicCreatorById(id);
    if (!creator) return null;

    const [servicesRes, portfoliosRes, categories] = await Promise.all([
      supabase.from("service_packages").select("*").eq("creator_id", id).eq("is_active", true).is("deleted_at", null),
      supabase.from("portfolios").select("*").eq("creator_id", id).is("deleted_at", null),
      getPublicCategories(),
    ]);

    const services: DummyServicePackage[] = (servicesRes.data ?? []).map(s => ({
      id: s.id,
      creatorId: s.creator_id,
      categoryId: s.category_id ?? "",
      title: s.title,
      slug: s.slug,
      shortDescription: s.short_description ?? "",
      description: s.description ?? "",
      coverImageUrl: s.cover_image_url ?? "",
      basePrice: Number(s.base_price),
      estimatedDays: s.estimated_days,
      revisionCount: s.revision_count,
      deliverables: s.deliverables ?? [],
      requirements: s.requirements ?? [],
      tags: s.tags ?? [],
      isActive: s.is_active,
      isFeatured: s.is_featured,
    }));

    const portfolios: DummyPortfolioItem[] = (portfoliosRes.data ?? []).map(p => ({
      id: p.id,
      creatorId: p.creator_id,
      categoryId: p.category_id ?? "",
      title: p.title,
      description: p.description ?? "",
      thumbnailUrl: p.thumbnail_url ?? "",
      externalUrl: p.external_url ?? "",
      clientName: p.client_type ?? "Client",
      isFeatured: p.is_featured,
    }));

    return {
      creator,
      services,
      portfolios,
      categories,
      reviews: [] as DummyReview[],
      umkmProfiles: [] as DummyUmkmProfile[],
    };
  } catch {
    return null;
  }
}

/**
 * Fetches full service details.
 */
export async function getPublicServiceDetail(id: string) {
  try {
    const supabase = await createClient();
    
    const { data: service, error: sError } = await supabase
      .from("service_packages")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .is("deleted_at", null)
      .single();

    if (sError || !service) {
      const fallback = dummyServicePackages.find(s => s.id === id);
      if (!fallback) return null;
      
      return {
        service: fallback,
        creator: dummyCreators.find(c => c.id === fallback.creatorId)!,
        category: dummyServiceCategories.find(c => c.id === fallback.categoryId)!,
        tiers: dummyServiceTiers.filter(t => t.servicePackageId === id),
        addons: dummyServiceAddons.filter(a => a.compatibleServiceIds.includes(id)),
        portfolios: dummyPortfolios.filter(p => p.creatorId === fallback.creatorId),
        reviews: [] as DummyReview[],
        umkmProfiles: [] as DummyUmkmProfile[],
      };
    }

    const [creator, categories, tiersRes, addonsRes, portfoliosRes] = await Promise.all([
      getPublicCreatorById(service.creator_id),
      getPublicCategories(),
      supabase.from("service_package_tiers").select("*").eq("service_package_id", id).eq("is_active", true),
      supabase.from("service_addons").select("*").eq("service_package_id", id).eq("is_active", true),
      supabase.from("portfolios").select("*").eq("creator_id", service.creator_id).is("deleted_at", null),
    ]);

    const mappedService: DummyServicePackage = {
      id: service.id,
      creatorId: service.creator_id,
      categoryId: service.category_id ?? "",
      title: service.title,
      slug: service.slug,
      shortDescription: service.short_description ?? "",
      description: service.description ?? "",
      coverImageUrl: service.cover_image_url ?? "",
      basePrice: Number(service.base_price),
      estimatedDays: service.estimated_days,
      revisionCount: service.revision_count,
      deliverables: service.deliverables ?? [],
      requirements: service.requirements ?? [],
      tags: service.tags ?? [],
      isActive: service.is_active,
      isFeatured: service.is_featured,
    };

    const tiers: DummyServiceTier[] = (tiersRes.data ?? []).map(t => ({
      id: t.id,
      servicePackageId: t.service_package_id,
      name: t.name as DummyServiceTierName,
      description: t.description ?? "",
      price: Number(t.price),
      estimatedDays: t.estimated_days,
      revisionCount: t.revision_count,
      deliverables: t.deliverables ?? [],
      sortOrder: t.sort_order,
    }));

    const addons: DummyServiceAddon[] = (addonsRes.data ?? []).map(a => ({
      id: a.id,
      name: a.name,
      description: a.description ?? "",
      price: Number(a.price),
      compatibleServiceIds: [id],
    }));

    const portfolios: DummyPortfolioItem[] = (portfoliosRes.data ?? []).map(p => ({
      id: p.id,
      creatorId: p.creator_id,
      categoryId: p.category_id ?? "",
      title: p.title,
      description: p.description ?? "",
      thumbnailUrl: p.thumbnail_url ?? "",
      externalUrl: p.external_url ?? "",
      clientName: p.client_type ?? "Client",
      isFeatured: p.is_featured,
    }));

    return {
      service: mappedService,
      creator: creator!,
      category: categories.find(c => c.id === service.category_id)!,
      tiers,
      addons,
      portfolios,
      reviews: [] as DummyReview[],
      umkmProfiles: [] as DummyUmkmProfile[],
    };
  } catch {
    return null;
  }
}

/**
 * Fetches featured creators.
 */
export async function getPublicFeaturedCreators(): Promise<readonly DummyCreatorProfile[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("creator_profiles")
      .select("*, profiles!inner(account_status)")
      .eq("is_featured", true)
      .eq("profiles.account_status", "active")
      .limit(4);

    if (error || !data || data.length === 0) {
      return dummyCreators.filter(c => c.isFeatured).slice(0, 4);
    }

    return data.map((item) => ({
      id: item.id,
      userId: item.user_id,
      displayName: item.display_name,
      bio: item.bio ?? "",
      city: item.city ?? "",
      province: item.province ?? "",
      niche: item.niche ?? "",
      skills: item.skills ?? [],
      avatarUrl: item.avatar_url ?? "",
      bannerUrl: item.banner_url ?? "",
      instagramUrl: item.instagram_url ?? "",
      tiktokUrl: item.tiktok_url ?? "",
      availabilityStatus: item.availability_status as DummyAvailabilityStatus,
      startingPrice: Number(item.starting_price),
      averageRating: Number(item.average_rating),
      completedOrdersCount: item.completed_orders_count,
      responseTimeHours: item.response_time_hours ?? 0,
      isVerified: item.is_verified,
      isFeatured: item.is_featured,
    }));
  } catch {
    return dummyCreators.filter(c => c.isFeatured).slice(0, 4);
  }
}

/**
 * Fetches catalog data.
 */
export async function getPublicCatalogData() {
  try {
    const supabase = await createClient();
    
    const [creatorsRes, servicesRes, categories] = await Promise.all([
      supabase.from("creator_profiles").select("*, profiles!inner(account_status)").eq("profiles.account_status", "active"),
      supabase.from("service_packages").select("*").eq("is_active", true).is("deleted_at", null),
      getPublicCategories(),
    ]);

    if (creatorsRes.error || servicesRes.error || !creatorsRes.data || creatorsRes.data.length === 0) {
      return {
        creators: dummyCreators,
        services: dummyServicePackages,
        categories: dummyServiceCategories,
      };
    }

    const creators: DummyCreatorProfile[] = creatorsRes.data.map((item) => ({
      id: item.id,
      userId: item.user_id,
      displayName: item.display_name,
      bio: item.bio ?? "",
      city: item.city ?? "",
      province: item.province ?? "",
      niche: item.niche ?? "",
      skills: item.skills ?? [],
      avatarUrl: item.avatar_url ?? "",
      bannerUrl: item.banner_url ?? "",
      instagramUrl: item.instagram_url ?? "",
      tiktokUrl: item.tiktok_url ?? "",
      availabilityStatus: item.availability_status as DummyAvailabilityStatus,
      startingPrice: Number(item.starting_price),
      averageRating: Number(item.average_rating),
      completedOrdersCount: item.completed_orders_count,
      responseTimeHours: item.response_time_hours ?? 0,
      isVerified: item.is_verified,
      isFeatured: item.is_featured,
    }));

    const services: DummyServicePackage[] = servicesRes.data.map((item) => ({
      id: item.id,
      creatorId: item.creator_id,
      categoryId: item.category_id ?? "",
      title: item.title,
      slug: item.slug,
      shortDescription: item.short_description ?? "",
      description: item.description ?? "",
      coverImageUrl: item.cover_image_url ?? "",
      basePrice: Number(item.base_price),
      estimatedDays: item.estimated_days,
      revisionCount: item.revision_count,
      deliverables: item.deliverables ?? [],
      requirements: item.requirements ?? [],
      tags: item.tags ?? [],
      isActive: item.is_active,
      isFeatured: item.is_featured,
    }));

    return {
      creators,
      services,
      categories,
    };
  } catch {
    return {
      creators: dummyCreators,
      services: dummyServicePackages,
      categories: dummyServiceCategories,
    };
  }
}
