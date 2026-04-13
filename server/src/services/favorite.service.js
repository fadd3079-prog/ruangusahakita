import { supabaseAdmin } from "../lib/supabase.js";
import { createHttpError } from "../utils/http-error.js";
import { mapCreatorCard } from "./discovery.service.js";

function db(client) {
  return supabaseAdmin || client;
}

function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

async function findCreator(database, creatorId) {
  let query = database.from("creator_profiles").select("id").limit(1);

  query = isUuid(creatorId) ? query.eq("id", creatorId) : query.eq("slug", creatorId);

  const { data, error } = await query.maybeSingle();

  if (error) {
    throw createHttpError(400, "Kreator belum bisa dicek", error.message);
  }

  if (!data) {
    throw createHttpError(404, "Kreator tidak ditemukan");
  }

  return data;
}

export async function listFavorites(client, userId) {
  const database = db(client);
  const { data, error } = await database
    .from("favorites")
    .select("creator_profiles(*, profiles(avatar_url), reviews(id, rating))")
    .eq("profile_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw createHttpError(500, "Favorit belum bisa dimuat", error.message);
  }

  return data.map((favorite) => mapCreatorCard({ ...favorite.creator_profiles, is_favorite: true }));
}

export async function addFavorite(client, userId, creatorId) {
  const database = db(client);
  const creator = await findCreator(database, creatorId);

  const { error } = await database
    .from("favorites")
    .upsert(
      {
        profile_id: userId,
        creator_profile_id: creator.id,
      },
      { onConflict: "profile_id,creator_profile_id" }
    );

  if (error) {
    throw createHttpError(400, "Kreator belum bisa disimpan", error.message);
  }

  return listFavorites(client, userId);
}

export async function removeFavorite(client, userId, creatorId) {
  const database = db(client);
  const creator = await findCreator(database, creatorId);

  const { error } = await database
    .from("favorites")
    .delete()
    .eq("profile_id", userId)
    .eq("creator_profile_id", creator.id);

  if (error) {
    throw createHttpError(400, "Favorit belum bisa dihapus", error.message);
  }

  return listFavorites(client, userId);
}
