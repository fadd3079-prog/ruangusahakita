import { supabase, supabaseAdmin, createUserSupabaseClient } from "../lib/supabase.js";
import { createHttpError } from "../utils/http-error.js";
import { bootstrapProfile, getCurrentProfile } from "./profile.service.js";

export async function signup({ name, email, password, role }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
      },
    },
  });

  if (error) {
    throw createHttpError(400, "Pendaftaran belum berhasil", error.message);
  }

  const accessToken = data.session?.access_token;
  const client = accessToken ? createUserSupabaseClient(accessToken) : supabase;
  const profile = await bootstrapProfile(client, data.user, role, name);

  return {
    user: data.user,
    session: data.session,
    profile,
  };
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw createHttpError(401, "Email atau kata sandi belum benar", error.message);
  }

  const client = createUserSupabaseClient(data.session.access_token);
  const profile = await getCurrentProfile(client, data.user.id);

  return {
    user: data.user,
    session: data.session,
    ...profile,
  };
}

export async function logout(accessToken) {
  if (supabaseAdmin) {
    const { error } = await supabaseAdmin.auth.admin.signOut(accessToken);
    if (error) {
      throw createHttpError(400, "Logout belum berhasil", error.message);
    }
    return true;
  }

  const client = createUserSupabaseClient(accessToken);
  const { error } = await client.auth.signOut();

  if (error) {
    throw createHttpError(400, "Logout belum berhasil", error.message);
  }

  return true;
}
