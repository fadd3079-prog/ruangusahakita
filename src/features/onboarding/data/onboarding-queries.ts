import { redirect } from "next/navigation";

import { getDashboardPathByRole } from "@/lib/auth/guards";
import type { UserRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type Tables = Database["public"]["Tables"];

export type OnboardingAccount = Pick<
  Tables["profiles"]["Row"],
  | "account_status"
  | "email"
  | "full_name"
  | "id"
  | "onboarding_completed"
  | "onboarding_skipped_at"
  | "role"
>;

export type UmkmOnboardingData = {
  account: OnboardingAccount;
  profile: Tables["umkm_profiles"]["Row"] | null;
};

export type CreatorOnboardingData = {
  account: OnboardingAccount;
  profile: Tables["creator_profiles"]["Row"] | null;
};

async function getCurrentAccount() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: account, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, account_status, onboarding_completed, onboarding_skipped_at")
    .eq("id", user.id)
    .single<OnboardingAccount>();

  if (error || !account) {
    redirect("/login?error=profile");
  }

  if (account.account_status !== "active") {
    redirect("/login?error=inactive");
  }

  return account;
}

function redirectIfWrongRole(role: UserRole, expectedRole: UserRole) {
  if (role !== expectedRole) {
    redirect(getDashboardPathByRole(role));
  }
}

export async function getCurrentUmkmOnboardingData(): Promise<UmkmOnboardingData> {
  const account = await getCurrentAccount();
  redirectIfWrongRole(account.role, "umkm");

  const supabase = await createClient();
  const { data } = await supabase
    .from("umkm_profiles")
    .select("*")
    .eq("user_id", account.id)
    .maybeSingle();

  return {
    account,
    profile: data ?? null,
  };
}

export async function getCurrentCreatorOnboardingData(): Promise<CreatorOnboardingData> {
  const account = await getCurrentAccount();
  redirectIfWrongRole(account.role, "creator");

  const supabase = await createClient();
  const { data } = await supabase
    .from("creator_profiles")
    .select("*")
    .eq("user_id", account.id)
    .maybeSingle();

  return {
    account,
    profile: data ?? null,
  };
}
