import { getDashboardPathByRole } from "@/lib/auth/guards";
import type { UserRole } from "@/lib/auth/roles";
import type { Database } from "@/lib/supabase/types";

type Tables = Database["public"]["Tables"];

export type OnboardingProfile = Pick<
  Tables["profiles"]["Row"],
  "account_status" | "id" | "onboarding_completed" | "onboarding_skipped_at" | "role"
>;

export type UmkmProfileCompletionInput = Pick<
  Tables["umkm_profiles"]["Row"],
  "business_category" | "business_description" | "business_name" | "city" | "owner_name" | "province"
> | null;

export type CreatorProfileCompletionInput = Pick<
  Tables["creator_profiles"]["Row"],
  "availability_status" | "bio" | "city" | "display_name" | "niche" | "province"
> | null;

export function getOnboardingPathByRole(role: UserRole) {
  if (role === "creator") {
    return "/creator/onboarding";
  }

  if (role === "umkm") {
    return "/umkm/onboarding";
  }

  return getDashboardPathByRole(role);
}

export function shouldStartOnboarding(profile: OnboardingProfile) {
  return (
    profile.role !== "admin" &&
    profile.account_status === "active" &&
    !profile.onboarding_completed &&
    !profile.onboarding_skipped_at
  );
}

function hasText(value: string | null | undefined) {
  return typeof value === "string" && value.trim().length >= 2;
}

export function isUmkmProfileComplete(profile: UmkmProfileCompletionInput) {
  return Boolean(
    profile &&
      hasText(profile.business_name) &&
      hasText(profile.owner_name) &&
      hasText(profile.business_category) &&
      hasText(profile.business_description) &&
      hasText(profile.city) &&
      hasText(profile.province),
  );
}

export function isCreatorProfileComplete(profile: CreatorProfileCompletionInput) {
  return Boolean(
    profile &&
      hasText(profile.display_name) &&
      hasText(profile.niche) &&
      hasText(profile.bio) &&
      hasText(profile.city) &&
      hasText(profile.province) &&
      hasText(profile.availability_status),
  );
}
