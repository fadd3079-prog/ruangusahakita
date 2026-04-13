import { supabaseAdmin } from "../lib/supabase.js";
import { createHttpError } from "../utils/http-error.js";

function db(client) {
  return supabaseAdmin || client;
}

function mapRequest(row) {
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    createdAt: row.created_at,
    creatorName: row.creator_profiles?.brand_name || null,
    businessName: row.business_name || row.business_profiles?.business_name || null,
    businessCategory: row.business_category,
    productName: row.product_name,
    promotionGoal: row.promotion_goal,
    targetAudience: row.target_audience,
    budgetRange: row.budget_range,
    deadline: row.deadline,
    notes: row.notes,
    aiDraft: row.ai_draft,
    service: row.services
      ? {
          id: row.services.id,
          slug: row.services.slug,
          title: row.services.title,
        }
      : null,
  };
}

async function getProfile(database, userId) {
  const { data, error } = await database
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    throw createHttpError(404, "Profil tidak ditemukan", error.message);
  }

  return data;
}

async function getBusinessProfile(database, userId) {
  const { data, error } = await database
    .from("business_profiles")
    .select("*")
    .eq("profile_id", userId)
    .single();

  if (error) {
    throw createHttpError(404, "Profil usaha belum lengkap", error.message);
  }

  return data;
}

async function getCreatorProfile(database, userId) {
  const { data, error } = await database
    .from("creator_profiles")
    .select("*")
    .eq("profile_id", userId)
    .single();

  if (error) {
    throw createHttpError(404, "Profil kreator belum lengkap", error.message);
  }

  return data;
}

async function resolveCreator(database, payload) {
  if (payload.creatorProfileId) return payload.creatorProfileId;
  if (!payload.creatorSlug) return null;

  const { data, error } = await database
    .from("creator_profiles")
    .select("id")
    .eq("slug", payload.creatorSlug)
    .maybeSingle();

  if (error) {
    throw createHttpError(400, "Kreator belum bisa dicek", error.message);
  }

  return data?.id || null;
}

async function resolveService(database, payload) {
  if (payload.serviceId) return payload.serviceId;
  if (!payload.serviceSlug) return null;

  const { data, error } = await database
    .from("services")
    .select("id, creator_profile_id")
    .eq("slug", payload.serviceSlug)
    .maybeSingle();

  if (error) {
    throw createHttpError(400, "Layanan belum bisa dicek", error.message);
  }

  return data || null;
}

function requestSelect() {
  return "*, business_profiles(business_name), creator_profiles(id, slug, brand_name), services(id, slug, title)";
}

export async function createRequest(client, userId, payload) {
  const database = db(client);
  const profile = await getProfile(database, userId);

  if (profile.role !== "umkm") {
    throw createHttpError(403, "Hanya UMKM yang bisa mengirim brief");
  }

  const businessProfile = await getBusinessProfile(database, userId);
  const service = await resolveService(database, payload);
  const creatorProfileId = service?.creator_profile_id || (await resolveCreator(database, payload));

  const title = payload.title || `Promosi ${payload.productName}`;

  const { data, error } = await database
    .from("requests")
    .insert({
      business_profile_id: businessProfile.id,
      creator_profile_id: creatorProfileId,
      service_id: service?.id || payload.serviceId || null,
      title,
      business_name: payload.businessName,
      business_category: payload.businessCategory || null,
      product_name: payload.productName,
      promotion_goal: payload.promotionGoal,
      target_audience: payload.targetAudience,
      budget_range: payload.budgetRange || null,
      deadline: payload.deadline || null,
      notes: payload.notes || null,
      ai_draft: payload.aiDraft || null,
      status: payload.status || "submitted",
    })
    .select(requestSelect())
    .single();

  if (error) {
    throw createHttpError(400, "Brief belum bisa dikirim", error.message);
  }

  return mapRequest(data);
}

export async function listRequests(client, userId) {
  const database = db(client);
  const profile = await getProfile(database, userId);

  let query = database
    .from("requests")
    .select(requestSelect())
    .order("created_at", { ascending: false });

  if (profile.role === "umkm") {
    const businessProfile = await getBusinessProfile(database, userId);
    query = query.eq("business_profile_id", businessProfile.id);
  } else {
    const creatorProfile = await getCreatorProfile(database, userId);
    query = query.eq("creator_profile_id", creatorProfile.id);
  }

  const { data, error } = await query;

  if (error) {
    throw createHttpError(500, "Daftar permintaan belum bisa dimuat", error.message);
  }

  return data.map(mapRequest);
}

export async function listIncomingRequests(client, userId) {
  const database = db(client);
  await getProfile(database, userId);
  const creatorProfile = await getCreatorProfile(database, userId);

  const { data, error } = await database
    .from("requests")
    .select(requestSelect())
    .eq("creator_profile_id", creatorProfile.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw createHttpError(500, "Permintaan masuk belum bisa dimuat", error.message);
  }

  return data.map(mapRequest);
}

export async function getRequestDetail(client, userId, requestId) {
  const database = db(client);
  const profile = await getProfile(database, userId);

  const { data, error } = await database
    .from("requests")
    .select(requestSelect())
    .eq("id", requestId)
    .maybeSingle();

  if (error) {
    throw createHttpError(500, "Detail permintaan belum bisa dimuat", error.message);
  }

  if (!data) {
    throw createHttpError(404, "Permintaan tidak ditemukan");
  }

  if (profile.role === "umkm") {
    const businessProfile = await getBusinessProfile(database, userId);
    if (data.business_profile_id !== businessProfile.id) {
      throw createHttpError(403, "Kamu tidak bisa membuka permintaan ini");
    }
  }

  if (profile.role === "creator") {
    const creatorProfile = await getCreatorProfile(database, userId);
    if (data.creator_profile_id !== creatorProfile.id) {
      throw createHttpError(403, "Kamu tidak bisa membuka permintaan ini");
    }
  }

  return mapRequest(data);
}

export async function updateRequestStatus(client, userId, requestId, status) {
  await getRequestDetail(client, userId, requestId);

  const { data, error } = await db(client)
    .from("requests")
    .update({ status })
    .eq("id", requestId)
    .select(requestSelect())
    .single();

  if (error) {
    throw createHttpError(400, "Status permintaan belum bisa diperbarui", error.message);
  }

  return mapRequest(data);
}
