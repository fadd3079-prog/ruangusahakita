import { signupSchema, loginSchema } from "../validators/auth.validators.js";
import { signup, login, logout } from "../services/auth.service.js";
import { getCurrentProfile } from "../services/profile.service.js";
import { sendSuccess } from "../utils/api-response.js";

export async function signupController(req, res) {
  const payload = signupSchema.parse(req.body);
  const data = await signup(payload);

  return sendSuccess(res, {
    status: 201,
    message: "Akun berhasil dibuat",
    data,
  });
}

export async function loginController(req, res) {
  const payload = loginSchema.parse(req.body);
  const data = await login(payload);

  return sendSuccess(res, {
    message: "Berhasil masuk",
    data,
  });
}

export async function logoutController(req, res) {
  await logout(req.accessToken);

  return sendSuccess(res, {
    message: "Berhasil keluar",
    data: null,
  });
}

export async function meController(req, res) {
  const profile = await getCurrentProfile(req.supabase, req.user.id);

  return sendSuccess(res, {
    message: "Sesi aktif",
    data: {
      user: req.user,
      ...profile,
    },
  });
}
