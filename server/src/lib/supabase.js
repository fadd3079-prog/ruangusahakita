import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";

export const supabase = createClient(
  env.supabaseUrl,
  env.supabaseAnonKey
);

export const supabaseAdmin = env.supabaseServiceRoleKey
  ? createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export function createUserSupabaseClient(accessToken) {
  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
