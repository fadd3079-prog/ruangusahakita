import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
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

  // IMPORTANT: Avoid writing any client logic below this line that depends on
  // the `supabase` object being initialized. The `supabase` object is only
  // used to refresh the session.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Protect Auth Routes (redirect to dashboard if logged in)
  if (user && (path === "/login" || path === "/register" || path === "/forgot-password")) {
    // Fetch profile to redirect to correct dashboard
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile) {
      if (profile.role === "umkm") url.pathname = "/umkm/dashboard";
      else if (profile.role === "creator") url.pathname = "/creator/dashboard";
      else if (profile.role === "admin") url.pathname = "/admin/dashboard";
      else url.pathname = "/";
    } else {
      url.pathname = "/";
    }
    return NextResponse.redirect(url);
  }

  // Protect Dashboard Routes (redirect to login if not logged in)
  const isProtectedRoute = path.startsWith("/umkm") || path.startsWith("/creator") || path.startsWith("/admin");
  
  if (!user && isProtectedRoute) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Role Guarding for Logged-In Users
  if (user && isProtectedRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    const role = profile.role;

    if (path.startsWith("/admin") && role !== "admin") {
      url.pathname = role === "umkm" ? "/umkm/dashboard" : "/creator/dashboard";
      return NextResponse.redirect(url);
    }
    if (path.startsWith("/umkm") && role !== "umkm") {
      url.pathname = role === "admin" ? "/admin/dashboard" : "/creator/dashboard";
      return NextResponse.redirect(url);
    }
    if (path.startsWith("/creator") && role !== "creator") {
      url.pathname = role === "admin" ? "/admin/dashboard" : "/umkm/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
