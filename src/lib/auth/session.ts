import type { Profile } from "./roles";

/**
 * Placeholder to get the current authenticated user.
 * TODO: Integrate with real Supabase Auth.
 */
export async function getCurrentUser() {
  console.warn("getCurrentUser is a placeholder.");
  return null;
}

/**
 * Placeholder to get the current user's profile.
 * TODO: Integrate with real Supabase Auth.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  console.warn("getCurrentProfile is a placeholder.");
  return null;
}

/**
 * Validates that a user is authenticated.
 * TODO: Integrate with real Supabase Auth.
 */
export async function requireAuth() {
  console.warn("requireAuth is a placeholder.");
  return true;
}
