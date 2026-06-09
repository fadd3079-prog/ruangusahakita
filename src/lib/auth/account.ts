import { getDashboardPathByRole } from "@/lib/auth/guards";
import type { AccountStatus, UserRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";

export type CurrentAccountSummary = {
  id: string;
  email: string;
  role: UserRole;
  accountStatus: AccountStatus;
  onboardingCompleted: boolean;
  onboardingSkippedAt: string | null;
  displayName: string;
  dashboardHref: string;
  initials: string;
  avatarUrl: string | null;
};

type ProfileRow = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  account_status: AccountStatus;
  onboarding_completed: boolean;
  onboarding_skipped_at: string | null;
};

function getInitials(value: string) {
  return value
    .split(" ")
    .map((part) => part.at(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export async function getCurrentAccountSummary(): Promise<CurrentAccountSummary | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url, role, account_status, onboarding_completed, onboarding_skipped_at")
    .eq("id", user.id)
    .single<ProfileRow>();

  if (error || !profile || profile.account_status !== "active") {
    return null;
  }

  let roleDisplayName: string | null = null;

  if (profile.role === "umkm") {
    const { data } = await supabase
      .from("umkm_profiles")
      .select("business_name, owner_name")
      .eq("user_id", user.id)
      .maybeSingle();

    roleDisplayName = data?.business_name ?? data?.owner_name ?? null;
  }

  if (profile.role === "creator") {
    const { data } = await supabase
      .from("creator_profiles")
      .select("display_name")
      .eq("user_id", user.id)
      .maybeSingle();

    roleDisplayName = data?.display_name ?? null;
  }

  const displayName = roleDisplayName ?? profile.full_name ?? profile.email;

  return {
    id: profile.id,
    email: profile.email,
    role: profile.role,
    accountStatus: profile.account_status,
    onboardingCompleted: profile.onboarding_completed,
    onboardingSkippedAt: profile.onboarding_skipped_at,
    displayName,
    dashboardHref: getDashboardPathByRole(profile.role),
    initials: getInitials(displayName || profile.email) || "RU",
    avatarUrl: profile.avatar_url,
  };
}
