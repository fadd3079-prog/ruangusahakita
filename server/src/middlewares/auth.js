import { supabase, createUserSupabaseClient } from "../lib/supabase.js";
import { createHttpError } from "../utils/http-error.js";

export function getBearerToken(req) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

export async function requireAuth(req, res, next) {
  try {
    const accessToken = getBearerToken(req);

    if (!accessToken) {
      throw createHttpError(401, "Sesi tidak ditemukan. Silakan masuk kembali.");
    }

    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data?.user) {
      throw createHttpError(401, "Sesi tidak valid. Silakan masuk kembali.", error?.message);
    }

    req.accessToken = accessToken;
    req.user = data.user;
    req.supabase = createUserSupabaseClient(accessToken);

    return next();
  } catch (error) {
    return next(error);
  }
}
