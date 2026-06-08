import { NextResponse } from "next/server";
import {
  getOnboardingPathByRole,
  shouldStartOnboarding,
} from "@/features/onboarding/lib/profile-completion";
import { getDashboardPathByRole } from "@/lib/auth/guards";
import type { UserRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";

function redirectTo(origin: string, path: string) {
  return NextResponse.redirect(new URL(path, origin));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next");
  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return redirectTo(url.origin, "/login?error=callback");
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirectTo(url.origin, "/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, account_status, onboarding_completed, onboarding_skipped_at")
    .eq("id", user.id)
    .single();

  if (!profile) {
    await supabase.auth.signOut();
    return redirectTo(url.origin, "/login?error=profile");
  }

  if (profile.account_status !== "active") {
    await supabase.auth.signOut();
    return redirectTo(url.origin, "/login?error=inactive");
  }

  if (shouldStartOnboarding(profile)) {
    return redirectTo(url.origin, getOnboardingPathByRole(profile.role as UserRole));
  }

  if (next && next.startsWith("/") && !next.startsWith("//")) {
    return redirectTo(url.origin, next);
  }

  return redirectTo(url.origin, getDashboardPathByRole(profile.role as UserRole));
}
