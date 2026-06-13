import { NextResponse } from "next/server";
import { getPostLoginPath } from "@/lib/auth/routing";
import type { Profile } from "@/lib/auth/roles";
import { isDemoMode } from "@/lib/config/demo-mode";
import { createClient } from "@/lib/supabase/server";

function redirectTo(origin: string, path: string) {
  return NextResponse.redirect(new URL(path, origin));
}

function getSafeNextPath(url: URL) {
  const next = url.searchParams.get("next");

  if (next === "/reset-password") {
    return next;
  }

  return null;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const nextPath = getSafeNextPath(url);

  if (isDemoMode()) {
    return redirectTo(url.origin, "/login");
  }

  try {
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
      .select(
        "id, role, account_status, onboarding_completed, onboarding_skipped_at",
      )
      .eq("id", user.id)
      .maybeSingle<Profile>();

    if (!profile) {
      await supabase.auth.signOut().catch(() => undefined);
      return redirectTo(url.origin, "/login?error=profile");
    }

    if (profile.account_status !== "active") {
      await supabase.auth.signOut().catch(() => undefined);
      return redirectTo(url.origin, "/login?error=inactive");
    }

    return redirectTo(url.origin, nextPath ?? getPostLoginPath(profile));
  } catch {
    return redirectTo(url.origin, "/login?error=unavailable");
  }
}
