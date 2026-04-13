import { addFavorite, listFavorites, removeFavorite } from "../services/favorite.service.js";
import { sendSuccess } from "../utils/api-response.js";

export async function listFavoritesController(req, res) {
  const data = await listFavorites(req.supabase, req.user.id);

  return sendSuccess(res, {
    message: "Favorit berhasil dimuat",
    data,
  });
}

export async function addFavoriteController(req, res) {
  const data = await addFavorite(req.supabase, req.user.id, req.params.creatorId);

  return sendSuccess(res, {
    status: 201,
    message: "Kreator disimpan ke favorit",
    data,
  });
}

export async function removeFavoriteController(req, res) {
  const data = await removeFavorite(req.supabase, req.user.id, req.params.creatorId);

  return sendSuccess(res, {
    message: "Kreator dihapus dari favorit",
    data,
  });
}
