import { createClient } from "@/lib/supabase/server";
import { isDemoMode } from "@/lib/config/demo-mode";
import type { 
  PublicServiceCategory, 
  PublicCreatorProfile, 
  PublicServicePackage,
  PublicServiceTier,
  PublicServiceAddon,
  PublicPortfolioItem,
  PublicReview,
  PublicUmkmProfile,
  PublicAvailabilityStatus,
  PublicServiceTierName
} from "@/features/catalog/data/catalog-types";
import {
  getCreatorStatsFromMap,
  getCreatorStatsMap,
} from "@/features/creators/data/creator-stats";
import { createPortfolioThumbnailSignedUrl } from "@/lib/storage/urls";

export async function getPublicCategories(): Promise<readonly PublicServiceCategory[]> {
  if (isDemoMode()) {
    return [];
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("service_categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      description: item.description ?? "",
      iconName: item.icon_name ?? "Megaphone",
    }));
  } catch {
    return [];
  }
}

export async function getPublicCreatorById(id: string): Promise<PublicCreatorProfile | null> {
  if (isDemoMode()) {
    return null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("creator_profiles")
      .select("*, profiles!inner(account_status, onboarding_completed)")
      .eq("id", id)
      .eq("profiles.account_status", "active")
      .eq("profiles.onboarding_completed", true)
      .single();

    if (error || !data) {
      return null;
    }

    const statsMap = await getCreatorStatsMap(
      supabase,
      [data.id],
      [
        {
          averageRating: data.average_rating,
          completedOrdersCount: data.completed_orders_count,
          id: data.id,
        },
      ],
    );
    const stats = getCreatorStatsFromMap(statsMap, data.id);

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
      youtubeUrl: data.youtube_url ?? "",
      portfolioUrl: data.portfolio_url ?? "",
      availabilityStatus: data.availability_status as PublicAvailabilityStatus,
      startingPrice: Number(data.starting_price),
      averageRating: stats.averageRating,
      completedOrdersCount: stats.completedOrdersCount,
      responseTimeHours: data.response_time_hours ?? 0,
      isVerified: data.is_verified,
      isFeatured: data.is_featured,
    };
  } catch {
    return null;
  }
}

export async function getPublicCreatorDetail(id: string) {
  if (isDemoMode()) {
    return null;
  }

  try {
    const supabase = await createClient();

    const creator = await getPublicCreatorById(id);
    if (!creator) return null;

    const [servicesRes, portfoliosRes, reviewsRes, categories] = await Promise.all([
      supabase.from("service_packages").select("*").eq("creator_id", id).eq("is_active", true).is("deleted_at", null),
      supabase.from("portfolios").select("*").eq("creator_id", id).is("deleted_at", null),
      supabase.from("reviews").select("*").eq("creator_id", id).eq("is_visible", true).is("deleted_at", null).order("created_at", { ascending: false }).limit(12),
      getPublicCategories(),
    ]);
    const serviceIds = (servicesRes.data ?? []).map((service) => service.id);
    const [tiersRes, mediaRes] = await Promise.all([
      serviceIds.length > 0
        ? supabase.from("service_package_tiers").select("*").in("service_package_id", serviceIds).eq("is_active", true)
        : Promise.resolve({ data: [], error: null }),
      serviceIds.length > 0
        ? supabase.from("service_media").select("*").in("service_package_id", serviceIds).is("deleted_at", null).order("sort_order", { ascending: true })
        : Promise.resolve({ data: [], error: null }),
    ]);
    const tiersByServiceId = new Map<string, { price: number }[]>();
    const mediaByServiceId = new Map<string, string[]>();

    for (const tier of tiersRes.data ?? []) {
      const current = tiersByServiceId.get(tier.service_package_id) ?? [];
      current.push({ price: Number(tier.price) });
      tiersByServiceId.set(tier.service_package_id, current);
    }

    for (const media of mediaRes.data ?? []) {
      const current = mediaByServiceId.get(media.service_package_id) ?? [];
      current.push(media.image_url);
      mediaByServiceId.set(media.service_package_id, current);
    }

    const services: PublicServicePackage[] = (servicesRes.data ?? []).map(s => ({
      id: s.id,
      creatorId: s.creator_id,
      categoryId: s.category_id ?? "",
      title: s.title,
      slug: s.slug,
      shortDescription: s.short_description ?? "",
      description: s.description ?? "",
      coverImageUrl: mediaByServiceId.get(s.id)?.[0] ?? s.cover_image_url ?? "",
      basePrice: Math.min(
        ...(tiersByServiceId.get(s.id)?.map((tier) => tier.price) ?? [Number(s.base_price)]),
      ),
      estimatedDays: s.estimated_days,
      revisionCount: s.revision_count,
      deliverables: s.deliverables ?? [],
      requirements: s.requirements ?? [],
      tags: s.tags ?? [],
      isActive: s.is_active,
      isFeatured: s.is_featured,
      mediaUrls: mediaByServiceId.get(s.id) ?? [],
    }));

    const portfolios: PublicPortfolioItem[] = await Promise.all(
      (portfoliosRes.data ?? []).map(async (p) => {
        const signedThumbnailUrl = await createPortfolioThumbnailSignedUrl(
          supabase,
          p.thumbnail_storage_path,
        );

        return {
          id: p.id,
          creatorId: p.creator_id,
          categoryId: p.category_id ?? "",
          title: p.title,
          description: p.description ?? "",
          thumbnailUrl: signedThumbnailUrl ?? p.thumbnail_url ?? "",
          externalUrl: p.external_url ?? "",
          clientName: p.client_type ?? "Client",
          isFeatured: p.is_featured,
        };
      }),
    );

    return {
      creator,
      services,
      portfolios,
      categories,
      reviews: (reviewsRes.data ?? []).map(mapPublicReview),
      umkmProfiles: [] as PublicUmkmProfile[],
    };
  } catch {
    return null;
  }
}

export async function getPublicServiceDetail(id: string) {
  if (isDemoMode()) {
    return null;
  }

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
      return null;
    }

    const [creator, categories, tiersRes, addonsRes, portfoliosRes, mediaRes, reviewsRes] = await Promise.all([
      getPublicCreatorById(service.creator_id),
      getPublicCategories(),
      supabase.from("service_package_tiers").select("*").eq("service_package_id", id).eq("is_active", true).order("sort_order", { ascending: true }),
      supabase.from("service_addons").select("*").eq("service_package_id", id).eq("is_active", true),
      supabase.from("portfolios").select("*").eq("creator_id", service.creator_id).is("deleted_at", null),
      supabase.from("service_media").select("*").eq("service_package_id", id).is("deleted_at", null).order("sort_order", { ascending: true }),
      supabase.from("reviews").select("*").eq("creator_id", service.creator_id).eq("is_visible", true).is("deleted_at", null).order("created_at", { ascending: false }).limit(8),
    ]);

    if (!creator) {
      return null;
    }

    const mediaUrls = (mediaRes.data ?? []).map((media) => media.image_url);

    const mappedService: PublicServicePackage = {
      id: service.id,
      creatorId: service.creator_id,
      categoryId: service.category_id ?? "",
      title: service.title,
      slug: service.slug,
      shortDescription: service.short_description ?? "",
      description: service.description ?? "",
      coverImageUrl: mediaUrls[0] ?? service.cover_image_url ?? "",
      basePrice: Math.min(
        ...(tiersRes.data?.map((tier) => Number(tier.price)) ?? [Number(service.base_price)]),
      ),
      estimatedDays: service.estimated_days,
      revisionCount: service.revision_count,
      deliverables: service.deliverables ?? [],
      requirements: service.requirements ?? [],
      tags: service.tags ?? [],
      isActive: service.is_active,
      isFeatured: service.is_featured,
      mediaUrls,
    };

    const tiers: PublicServiceTier[] = (tiersRes.data ?? []).map(t => ({
      id: t.id,
      servicePackageId: t.service_package_id,
      name: t.name as PublicServiceTierName,
      description: t.description ?? "",
      price: Number(t.price),
      estimatedDays: t.estimated_days,
      revisionCount: t.revision_count,
      deliverables: t.deliverables ?? [],
      sortOrder: t.sort_order,
    }));

    const addons: PublicServiceAddon[] = (addonsRes.data ?? []).map(a => ({
      id: a.id,
      name: a.name,
      description: a.description ?? "",
      price: Number(a.price),
      compatibleServiceIds: [id],
    }));

    const portfolios: PublicPortfolioItem[] = await Promise.all(
      (portfoliosRes.data ?? []).map(async (p) => {
        const signedThumbnailUrl = await createPortfolioThumbnailSignedUrl(
          supabase,
          p.thumbnail_storage_path,
        );

        return {
          id: p.id,
          creatorId: p.creator_id,
          categoryId: p.category_id ?? "",
          title: p.title,
          description: p.description ?? "",
          thumbnailUrl: signedThumbnailUrl ?? p.thumbnail_url ?? "",
          externalUrl: p.external_url ?? "",
          clientName: p.client_type ?? "Client",
          isFeatured: p.is_featured,
        };
      }),
    );

    return {
      service: mappedService,
      creator,
      category: categories.find((category) => category.id === service.category_id),
      tiers,
      addons,
      portfolios,
      reviews: (reviewsRes.data ?? []).map(mapPublicReview),
      umkmProfiles: [] as PublicUmkmProfile[],
    };
  } catch {
    return null;
  }
}

function mapPublicReview(review: {
  comment: string | null;
  communication_rating: number | null;
  created_at: string;
  creator_id: string;
  id: string;
  is_visible: boolean;
  order_id: string;
  quality_rating: number | null;
  rating: number;
  timeliness_rating: number | null;
  umkm_id: string;
}): PublicReview {
  return {
    comment: review.comment ?? "Review tanpa catatan tambahan.",
    communicationRating: review.communication_rating ?? review.rating,
    createdAt: review.created_at,
    creatorId: review.creator_id,
    id: review.id,
    isVisible: review.is_visible,
    orderId: review.order_id,
    qualityRating: review.quality_rating ?? review.rating,
    rating: review.rating,
    timelinessRating: review.timeliness_rating ?? review.rating,
    umkmId: review.umkm_id,
  };
}

export async function getPublicFeaturedCreators(): Promise<readonly PublicCreatorProfile[]> {
  if (isDemoMode()) {
    return [];
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("creator_profiles")
      .select("*, profiles!inner(account_status, onboarding_completed)")
      .eq("is_featured", true)
      .eq("profiles.account_status", "active")
      .eq("profiles.onboarding_completed", true)
      .limit(4);

    if (error || !data || data.length === 0) {
      return [];
    }

    const statsMap = await getCreatorStatsMap(
      supabase,
      data.map((item) => item.id),
      data.map((item) => ({
        averageRating: item.average_rating,
        completedOrdersCount: item.completed_orders_count,
        id: item.id,
      })),
    );

    return data.map((item) => {
      const stats = getCreatorStatsFromMap(statsMap, item.id);

      return {
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
        youtubeUrl: item.youtube_url ?? "",
        portfolioUrl: item.portfolio_url ?? "",
        availabilityStatus: item.availability_status as PublicAvailabilityStatus,
        startingPrice: Number(item.starting_price),
        averageRating: stats.averageRating,
        completedOrdersCount: stats.completedOrdersCount,
        responseTimeHours: item.response_time_hours ?? 0,
        isVerified: item.is_verified,
        isFeatured: item.is_featured,
      };
    });
  } catch {
    return [];
  }
}

export async function getPublicCatalogData() {
  if (isDemoMode()) {
    return {
      creators: [] as PublicCreatorProfile[],
      services: [] as PublicServicePackage[],
      categories: [] as PublicServiceCategory[],
    };
  }

  try {
    const supabase = await createClient();

    const [creatorsRes, servicesRes, categories] = await Promise.all([
      supabase
        .from("creator_profiles")
        .select("*, profiles!inner(account_status, onboarding_completed)")
        .eq("profiles.account_status", "active")
        .eq("profiles.onboarding_completed", true),
      supabase.from("service_packages").select("*").eq("is_active", true).is("deleted_at", null),
      getPublicCategories(),
    ]);

    if (creatorsRes.error || servicesRes.error || !creatorsRes.data || creatorsRes.data.length === 0) {
      return {
        creators: [] as PublicCreatorProfile[],
        services: [] as PublicServicePackage[],
        categories,
      };
    }

    const statsMap = await getCreatorStatsMap(
      supabase,
      creatorsRes.data.map((item) => item.id),
      creatorsRes.data.map((item) => ({
        averageRating: item.average_rating,
        completedOrdersCount: item.completed_orders_count,
        id: item.id,
      })),
    );
    const publicCreators: PublicCreatorProfile[] = creatorsRes.data.map((item) => {
      const stats = getCreatorStatsFromMap(statsMap, item.id);

      return {
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
        youtubeUrl: item.youtube_url ?? "",
        portfolioUrl: item.portfolio_url ?? "",
        availabilityStatus: item.availability_status as PublicAvailabilityStatus,
        startingPrice: Number(item.starting_price),
        averageRating: stats.averageRating,
        completedOrdersCount: stats.completedOrdersCount,
        responseTimeHours: item.response_time_hours ?? 0,
        isVerified: item.is_verified,
        isFeatured: item.is_featured,
      };
    });
    const publicCreatorIds = new Set(publicCreators.map((creator) => creator.id));
    const serviceIds = (servicesRes.data ?? []).map((item) => item.id);
    const [tiersRes, mediaRes] = await Promise.all([
      serviceIds.length > 0
        ? supabase.from("service_package_tiers").select("*").in("service_package_id", serviceIds).eq("is_active", true)
        : Promise.resolve({ data: [], error: null }),
      serviceIds.length > 0
        ? supabase.from("service_media").select("*").in("service_package_id", serviceIds).is("deleted_at", null).order("sort_order", { ascending: true })
        : Promise.resolve({ data: [], error: null }),
    ]);
    const pricesByServiceId = new Map<string, number[]>();
    const mediaByServiceId = new Map<string, string[]>();

    for (const tier of tiersRes.data ?? []) {
      const current = pricesByServiceId.get(tier.service_package_id) ?? [];
      current.push(Number(tier.price));
      pricesByServiceId.set(tier.service_package_id, current);
    }

    for (const media of mediaRes.data ?? []) {
      const current = mediaByServiceId.get(media.service_package_id) ?? [];
      current.push(media.image_url);
      mediaByServiceId.set(media.service_package_id, current);
    }

    const services: PublicServicePackage[] = servicesRes.data
      .filter((item) => publicCreatorIds.has(item.creator_id))
      .map((item) => ({
        id: item.id,
        creatorId: item.creator_id,
        categoryId: item.category_id ?? "",
        title: item.title,
        slug: item.slug,
        shortDescription: item.short_description ?? "",
        description: item.description ?? "",
        coverImageUrl: mediaByServiceId.get(item.id)?.[0] ?? item.cover_image_url ?? "",
        basePrice: Math.min(...(pricesByServiceId.get(item.id) ?? [Number(item.base_price)])),
        estimatedDays: item.estimated_days,
        revisionCount: item.revision_count,
        deliverables: item.deliverables ?? [],
        requirements: item.requirements ?? [],
        tags: item.tags ?? [],
        isActive: item.is_active,
        isFeatured: item.is_featured,
        mediaUrls: mediaByServiceId.get(item.id) ?? [],
      }));
    const activeServiceCreatorIds = new Set(
      services.map((service) => service.creatorId),
    );
    const creators = publicCreators.filter((item) =>
      activeServiceCreatorIds.has(item.id),
    );

    return {
      creators,
      services,
      categories,
    };
  } catch {
    return {
      creators: [] as PublicCreatorProfile[],
      services: [] as PublicServicePackage[],
      categories: [] as PublicServiceCategory[],
    };
  }
}
