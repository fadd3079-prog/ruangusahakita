import { supabase, supabaseAdmin } from "../lib/supabase.js";
import { createHttpError } from "../utils/http-error.js";

function db() {
  return supabaseAdmin || supabase;
}

function ratingSummary(reviews = []) {
  if (!reviews.length) {
    return {
      ratingAvg: 0,
      reviewCount: 0,
    };
  }

  const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);

  return {
    ratingAvg: Number((total / reviews.length).toFixed(1)),
    reviewCount: reviews.length,
  };
}

function mapPortfolioItem(row) {
  return {
    id: row.id,
    title: row.title,
    thumbnailUrl: row.thumbnail_url,
    category: row.category,
    platform: row.platform,
    caption: row.caption,
  };
}

function mapReviewItem(row) {
  return {
    id: row.id,
    reviewerName: row.reviewer_name,
    rating: Number(row.rating || 0),
    comment: row.comment,
    createdAt: row.created_at,
  };
}

export function mapServiceSummary(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    price: Number(row.price || 0),
    deliveryDays: row.delivery_days,
    revisionCount: row.revision_count,
  };
}

export function mapCreatorCard(row) {
  const reviews = row.reviews || [];
  const summary = ratingSummary(reviews);

  return {
    id: row.id,
    slug: row.slug,
    name: row.brand_name,
    avatarUrl: row.profiles?.avatar_url || null,
    niche: row.niche,
    city: row.city,
    priceFrom: Number(row.price_from || 0),
    ratingAvg: summary.ratingAvg,
    reviewCount: summary.reviewCount,
    shortBio: row.short_bio,
    isFavorite: Boolean(row.is_favorite),
  };
}

function mapCreatorDetail(row) {
  const reviews = row.reviews || [];
  const summary = ratingSummary(reviews);

  return {
    id: row.id,
    slug: row.slug,
    name: row.brand_name,
    avatarUrl: row.profiles?.avatar_url || null,
    bannerUrl: row.banner_url,
    niche: row.niche,
    city: row.city,
    platforms: row.platforms || [],
    priceFrom: Number(row.price_from || 0),
    ratingAvg: summary.ratingAvg,
    reviewCount: summary.reviewCount,
    shortBio: row.short_bio,
    fullBio: row.full_bio,
    services: (row.services || []).filter((service) => service.is_active).map(mapServiceSummary),
    portfolioItems: (row.portfolios || []).map(mapPortfolioItem),
    reviews: reviews.map(mapReviewItem),
  };
}

function mapServiceDetail(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    shortDescription: row.short_description,
    price: Number(row.price || 0),
    deliveryDays: row.delivery_days,
    revisionCount: row.revision_count,
    outputs: row.outputs || [],
    platforms: row.platforms || [],
    examples: (row.portfolios || []).map(mapPortfolioItem),
    creator: {
      id: row.creator_profiles.id,
      slug: row.creator_profiles.slug,
      name: row.creator_profiles.brand_name,
      avatarUrl: row.creator_profiles.profiles?.avatar_url || null,
    },
  };
}

function applyPriceFilter(query, filters) {
  if (filters.price) {
    const [min, max] = String(filters.price).split("-").map(Number);
    if (!Number.isNaN(min)) query = query.gte("price_from", min);
    if (!Number.isNaN(max)) query = query.lte("price_from", max);
  }

  if (filters.priceMin) query = query.gte("price_from", Number(filters.priceMin));
  if (filters.priceMax) query = query.lte("price_from", Number(filters.priceMax));

  return query;
}

export async function listCreators(filters = {}) {
  let query = db()
    .from("creator_profiles")
    .select("*, profiles(avatar_url), reviews(id, rating)")
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (filters.q) {
    query = query.or(`brand_name.ilike.%${filters.q}%,niche.ilike.%${filters.q}%,city.ilike.%${filters.q}%,short_bio.ilike.%${filters.q}%`);
  }

  if (filters.niche) query = query.eq("niche", filters.niche);
  if (filters.city || filters.location) query = query.eq("city", filters.city || filters.location);
  if (filters.platform) query = query.contains("platforms", [filters.platform]);

  query = applyPriceFilter(query, filters);

  const { data, error } = await query;

  if (error) {
    throw createHttpError(500, "Daftar kreator belum bisa dimuat", error.message);
  }

  const creators = data.map(mapCreatorCard);
  const rating = Number(filters.rating || 0);

  return rating ? creators.filter((creator) => creator.ratingAvg >= rating) : creators;
}

export async function getCreatorBySlug(slug) {
  const { data, error } = await db()
    .from("creator_profiles")
    .select("*, profiles(avatar_url), services(*), portfolios(*), reviews(*)")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    throw createHttpError(500, "Profil kreator belum bisa dimuat", error.message);
  }

  if (!data) {
    throw createHttpError(404, "Kreator tidak ditemukan");
  }

  return mapCreatorDetail(data);
}

export async function listCreatorServices(slug) {
  const creator = await getCreatorBySlug(slug);
  return creator.services;
}

export async function getServiceBySlug(slug) {
  const { data, error } = await db()
    .from("services")
    .select("*, creator_profiles(id, slug, brand_name, profiles(avatar_url)), portfolios(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error) {
    throw createHttpError(500, "Detail layanan belum bisa dimuat", error.message);
  }

  if (!data) {
    throw createHttpError(404, "Layanan tidak ditemukan");
  }

  return mapServiceDetail(data);
}
