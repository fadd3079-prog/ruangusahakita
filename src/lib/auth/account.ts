import { getDashboardPathByRole } from "@/lib/auth/routing";
import type { AccountStatus, UserRole } from "@/lib/auth/roles";
import { isDemoMode } from "@/lib/config/demo-mode";
import { createClient } from "@/lib/supabase/server";
import type { StorageBucket } from "@/lib/storage/buckets";
import { createStorageSignedUrl } from "@/lib/storage/urls";

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
  if (isDemoMode()) {
    return null;
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select(
        "id, email, full_name, avatar_url, role, account_status, onboarding_completed, onboarding_skipped_at",
      )
      .eq("id", user.id)
      .maybeSingle<ProfileRow>();

    if (error || !profile || profile.account_status !== "active") {
      return null;
    }

    let roleDisplayName: string | null = null;
    let roleAvatarUrl: string | null = null;

    if (profile.role === "umkm") {
      const { data } = await supabase
        .from("umkm_profiles")
        .select("business_name, owner_name, logo_url, logo_file_asset_id")
        .eq("user_id", user.id)
        .maybeSingle();

      roleDisplayName = data?.business_name ?? data?.owner_name ?? null;
      roleAvatarUrl = data
        ? await getFileAssetPreviewUrl(
            supabase,
            data.logo_file_asset_id,
            data.logo_url,
          )
        : null;
    }

    if (profile.role === "creator") {
      const { data } = await supabase
        .from("creator_profiles")
        .select("display_name, avatar_url")
        .eq("user_id", user.id)
        .maybeSingle();

      roleDisplayName = data?.display_name ?? null;
      roleAvatarUrl = data?.avatar_url ?? null;
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
      avatarUrl: profile.avatar_url ?? roleAvatarUrl,
    };
  } catch {
    return null;
  }
}

async function getFileAssetPreviewUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  fileAssetId: string | null,
  fallbackUrl: string | null,
) {
  if (!fileAssetId) {
    return fallbackUrl;
  }

  const { data } = await supabase
    .from("file_assets")
    .select("bucket_name, storage_path")
    .eq("id", fileAssetId)
    .maybeSingle();

  if (!data) {
    return fallbackUrl;
  }

  return createStorageSignedUrl(
    supabase,
    data.bucket_name as StorageBucket,
    data.storage_path,
  );
}
