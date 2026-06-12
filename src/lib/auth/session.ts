import { createClient } from "../supabase/server";
import { isDemoMode } from "../config/demo-mode";
import type { Profile } from "./roles";

export async function getCurrentUser() {
  if (isDemoMode()) {
    return null;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data?.user) {
      return null;
    }

    return data.user;
  } catch {
    return null;
  }
}

export async function getCurrentProfile(): Promise<Profile | null> {
  if (isDemoMode()) {
    return null;
  }

  const user = await getCurrentUser();

  if (!user) return null;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, role, account_status, onboarding_completed, onboarding_skipped_at",
      )
      .eq("id", user.id)
      .maybeSingle<Profile>();

    if (error || !data) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  return !!user;
}
