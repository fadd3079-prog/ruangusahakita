import { supabaseAdmin } from "../lib/supabase.js";
import { createHttpError } from "../utils/http-error.js";
import { buildUniqueSlug } from "../utils/slug.js";

function db(client) {
  return supabaseAdmin || client;
}

export function mapBaseProfile(row) {
  if (!row) return null;

  return {
    id: row.id,
    role: row.role,
    name: row.name,
    email: row.email,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapBusinessProfile(row) {
  if (!row) return null;

  return {
    id: row.id,
    profileId: row.profile_id,
    businessName: row.business_name,
    category: row.category,
    city: row.city,
    description: row.description,
    mainProduct: row.main_product,
    promotionTarget: row.promotion_target,
    contact: row.contact,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapCreatorProfile(row) {
  if (!row) return null;

  return {
    id: row.id,
    profileId: row.profile_id,
    slug: row.slug,
    brandName: row.brand_name,
    city: row.city,
    niche: row.niche,
    platforms: row.platforms || [],
    shortBio: row.short_bio,
    fullBio: row.full_bio,
    priceFrom: Number(row.price_from || 0),
    bannerUrl: row.banner_url,
    portfolioUrl: row.portfolio_url,
    socialLinks: row.social_links || {},
    isPublished: row.is_published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function bootstrapProfile(client, user, role, name) {
  const database = db(client);
  const email = user.email || "";

  const { data: profile, error: profileError } = await database
    .from("profiles")
    .upsert(
      {
        id: user.id,
        role,
        name,
        email,
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (profileError) {
    throw createHttpError(500, "Profil belum bisa dibuat", profileError.message);
  }

  if (role === "creator") {
    const { error } = await database
      .from("creator_profiles")
      .upsert(
        {
          profile_id: user.id,
          slug: buildUniqueSlug(name, user.id),
          brand_name: name,
          is_published: true,
        },
        { onConflict: "profile_id" }
      );

    if (error) {
      throw createHttpError(500, "Profil kreator belum bisa dibuat", error.message);
    }
  }

  if (role === "umkm") {
    const { error } = await database
      .from("business_profiles")
      .upsert(
        {
          profile_id: user.id,
          business_name: name,
        },
        { onConflict: "profile_id" }
      );

    if (error) {
      throw createHttpError(500, "Profil usaha belum bisa dibuat", error.message);
    }
  }

  return mapBaseProfile(profile);
}

export async function getCurrentProfile(client, userId) {
  const database = db(client);
  const { data: profile, error } = await database
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    throw createHttpError(404, "Profil tidak ditemukan", error.message);
  }

  const payload = {
    profile: mapBaseProfile(profile),
    businessProfile: null,
    creatorProfile: null,
  };

  if (profile.role === "umkm") {
    const { data } = await database
      .from("business_profiles")
      .select("*")
      .eq("profile_id", userId)
      .maybeSingle();

    payload.businessProfile = mapBusinessProfile(data);
  }

  if (profile.role === "creator") {
    const { data } = await database
      .from("creator_profiles")
      .select("*")
      .eq("profile_id", userId)
      .maybeSingle();

    payload.creatorProfile = mapCreatorProfile(data);
  }

  return payload;
}

export async function updateBaseProfile(client, userId, payload) {
  const database = db(client);
  const update = {};

  if (payload.name !== undefined) update.name = payload.name;
  if (payload.avatarUrl !== undefined) update.avatar_url = payload.avatarUrl;

  const { data, error } = await database
    .from("profiles")
    .update(update)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw createHttpError(400, "Profil belum bisa diperbarui", error.message);
  }

  return mapBaseProfile(data);
}

export async function updateBusinessProfile(client, userId, payload) {
  const database = db(client);
  const update = {};

  if (payload.businessName !== undefined) update.business_name = payload.businessName;
  if (payload.category !== undefined) update.category = payload.category;
  if (payload.city !== undefined) update.city = payload.city;
  if (payload.description !== undefined) update.description = payload.description;
  if (payload.mainProduct !== undefined) update.main_product = payload.mainProduct;
  if (payload.promotionTarget !== undefined) update.promotion_target = payload.promotionTarget;
  if (payload.contact !== undefined) update.contact = payload.contact;

  const { data, error } = await database
    .from("business_profiles")
    .update(update)
    .eq("profile_id", userId)
    .select()
    .single();

  if (error) {
    throw createHttpError(400, "Profil usaha belum bisa diperbarui", error.message);
  }

  return mapBusinessProfile(data);
}

export async function updateCreatorProfile(client, userId, payload) {
  const database = db(client);
  const update = {};

  if (payload.brandName !== undefined) {
    update.brand_name = payload.brandName;
    update.slug = buildUniqueSlug(payload.brandName, userId);
  }
  if (payload.city !== undefined) update.city = payload.city;
  if (payload.niche !== undefined) update.niche = payload.niche;
  if (payload.platforms !== undefined) update.platforms = payload.platforms;
  if (payload.shortBio !== undefined) update.short_bio = payload.shortBio;
  if (payload.fullBio !== undefined) update.full_bio = payload.fullBio;
  if (payload.priceFrom !== undefined) update.price_from = payload.priceFrom;
  if (payload.bannerUrl !== undefined) update.banner_url = payload.bannerUrl;
  if (payload.portfolioUrl !== undefined) update.portfolio_url = payload.portfolioUrl;
  if (payload.socialLinks !== undefined) update.social_links = payload.socialLinks;
  if (payload.isPublished !== undefined) update.is_published = payload.isPublished;

  const { data, error } = await database
    .from("creator_profiles")
    .update(update)
    .eq("profile_id", userId)
    .select()
    .single();

  if (error) {
    throw createHttpError(400, "Profil kreator belum bisa diperbarui", error.message);
  }

  return mapCreatorProfile(data);
}
