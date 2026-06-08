import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

type AppRole = "admin" | "creator" | "umkm";
type AuthProfile = {
  role: AppRole;
  account_status: string;
};

const authRoutes = new Set(["/login", "/register", "/forgot-password"]);

function getDashboardPath(role: AppRole) {
  if (role === "admin") return "/admin/dashboard";
  if (role === "creator") return "/creator/dashboard";
  return "/umkm/dashboard";
}

function isProtectedRoute(path: string) {
  return path.startsWith("/umkm") || path.startsWith("/creator") || path.startsWith("/admin");
}

function getRequiredRole(path: string): AppRole | null {
  if (path.startsWith("/admin")) return "admin";
  if (path.startsWith("/creator")) return "creator";
  if (path.startsWith("/umkm")) return "umkm";
  return null;
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  function redirectTo(pathname: string, error?: string) {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    url.search = "";

    if (error) {
      url.searchParams.set("error", error);
    }

    const response = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie);
    });
    return response;
  }

  const protectedRoute = isProtectedRoute(path);

  if (!user) {
    if (protectedRoute) {
      return redirectTo("/login");
    }

    return supabaseResponse;
  }

  if (!authRoutes.has(path) && !protectedRoute) {
    return supabaseResponse;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, account_status")
    .eq("id", user.id)
    .single<AuthProfile>();

  if (authRoutes.has(path)) {
    if (profile?.account_status === "active") {
      return redirectTo(getDashboardPath(profile.role));
    }

    return supabaseResponse;
  }

  if (!profile) {
    return redirectTo("/login", "profile");
  }

  if (profile.account_status !== "active") {
    return redirectTo("/login", "inactive");
  }

  const requiredRole = getRequiredRole(path);

  if (requiredRole && profile.role !== requiredRole) {
    return redirectTo(getDashboardPath(profile.role));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
