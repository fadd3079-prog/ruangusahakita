import {
  updateBaseProfile,
  updateBusinessProfile,
  updateCreatorProfile,
  getCurrentProfile,
} from "../services/profile.service.js";
import {
  updateBusinessProfileSchema,
  updateCreatorProfileSchema,
  updateProfileSchema,
} from "../validators/profile.validators.js";
import { sendSuccess } from "../utils/api-response.js";

export async function getProfileController(req, res) {
  const data = await getCurrentProfile(req.supabase, req.user.id);

  return sendSuccess(res, {
    message: "Profil berhasil dimuat",
    data,
  });
}

export async function updateProfileController(req, res) {
  const payload = updateProfileSchema.parse(req.body);
  const data = await updateBaseProfile(req.supabase, req.user.id, payload);

  return sendSuccess(res, {
    message: "Profil berhasil diperbarui",
    data,
  });
}

export async function updateBusinessProfileController(req, res) {
  const payload = updateBusinessProfileSchema.parse(req.body);
  const data = await updateBusinessProfile(req.supabase, req.user.id, payload);

  return sendSuccess(res, {
    message: "Profil usaha berhasil diperbarui",
    data,
  });
}

export async function updateCreatorProfileController(req, res) {
  const payload = updateCreatorProfileSchema.parse(req.body);
  const data = await updateCreatorProfile(req.supabase, req.user.id, payload);

  return sendSuccess(res, {
    message: "Profil kreator berhasil diperbarui",
    data,
  });
}
