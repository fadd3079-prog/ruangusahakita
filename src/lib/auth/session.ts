import { createClient } from "../supabase/server";
import type { Profile } from "./roles";

/**
 * Gets the current authenticated user from Supabase Auth.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return null;
  }

  return data.user;
}

/**
 * Gets the current user's profile from the public.profiles table.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const user = await getCurrentUser();
  
  if (!user) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .single();

  if (error || !data) {
    console.error("Error fetching profile:", error);
    return null;
  }

  return data as Profile;
}

/**
 * Validates that a user is authenticated. 
 * Note: For route protection, prefer using Middleware.
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  return !!user;
}
