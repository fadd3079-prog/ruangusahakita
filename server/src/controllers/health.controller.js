import { supabase } from "../lib/supabase.js";
import { sendSuccess, sendError } from "../utils/api-response.js";

export function healthController(req, res) {
  return sendSuccess(res, {
    message: "Ruang Usaha Kita API running",
    data: {
      status: "ok",
    },
  });
}

export async function supabaseHealthController(req, res) {
  try {
    const { error } = await supabase.auth.getSession();

    if (error) {
      return sendError(res, {
        status: 500,
        message: "Supabase connection failed",
        error: error.message,
      });
    }

    return sendSuccess(res, {
      message: "Supabase connection success",
      data: {
        status: "ok",
      },
    });
  } catch (error) {
    return sendError(res, {
      status: 500,
      message: "Unexpected Supabase health error",
      error: error.message,
    });
  }
}
