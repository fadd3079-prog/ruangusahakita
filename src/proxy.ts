import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import {
  getRequiredRole,
  getRouteRedirect,
  shouldBypassDashboardAuth,
  type AuthRouteState,
} from "@/lib/auth/routing";
import type { Profile } from "@/lib/auth/roles";
import { isDemoMode } from "@/lib/config/demo-mode";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const demoMode = isDemoMode();
  const recoveryCode =
    pathname === "/reset-password"
      ? request.nextUrl.searchParams.get("code")
      : null;

  if (demoMode) {
    if (
      shouldBypassDashboardAuth(true, pathname) &&
      request.method !== "GET" &&
      request.method !== "HEAD"
    ) {
      return NextResponse.json(
        {
          error: "Demo mode hanya menyediakan akses baca ke dashboard.",
        },
        { status: 403 },
      );
    }

    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  if (recoveryCode) {
    let exchangeFailed = false;

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(recoveryCode);
      exchangeFailed = Boolean(error);
    } catch {
      exchangeFailed = true;
    }

    const redirectUrl = new URL("/reset-password", request.url);
    if (exchangeFailed) {
      redirectUrl.searchParams.set("error", "update_failed");
    }

    const response = NextResponse.redirect(redirectUrl);
    supabaseResponse.cookies
      .getAll()
      .forEach((cookie) => response.cookies.set(cookie));
    return response;
  }

  let authState: AuthRouteState = { kind: "guest" };

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select(
          "id, role, account_status, onboarding_completed, onboarding_skipped_at",
        )
        .eq("id", user.id)
        .maybeSingle<Profile>();

      authState =
        error || !profile
          ? { kind: "missing-profile" }
          : { kind: "profile", profile };
    }
  } catch {
    authState = { kind: "guest" };
  }

  const destination = getRouteRedirect(pathname, authState);

  if (!destination) {
    return supabaseResponse;
  }

  const redirectUrl = new URL(destination, request.url);

  if (
    authState.kind === "guest" &&
    destination === "/login" &&
    getRequiredRole(pathname)
  ) {
    redirectUrl.searchParams.set(
      "redirectTo",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
  }

  const response = NextResponse.redirect(redirectUrl);
  supabaseResponse.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
  return response;
}

export const config = {
  matcher: [
    "/",
    "/katalog/:path*",
    "/cara-kerja/:path*",
    "/bantuan/:path*",
    "/kreator/:path*",
    "/layanan/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/callback",
    "/admin/:path*",
    "/umkm/:path*",
    "/creator/:path*",
  ],
};
