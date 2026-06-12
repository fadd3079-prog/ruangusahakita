import type { Profile, UserRole } from "./roles";

const authRoutes = new Set(["/login", "/register", "/forgot-password"]);
const publicRoutes = new Set(["/", "/katalog", "/cara-kerja", "/bantuan"]);

export type AuthRouteState =
  | { kind: "guest" }
  | { kind: "missing-profile" }
  | { kind: "profile"; profile: Profile };

export function getDashboardPathByRole(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "creator":
      return "/creator/dashboard";
    case "umkm":
      return "/umkm/dashboard";
  }
}

export function getOnboardingPathByRole(role: UserRole): string {
  if (role === "creator") {
    return "/creator/onboarding";
  }

  if (role === "umkm") {
    return "/umkm/onboarding";
  }

  return getDashboardPathByRole(role);
}

export function shouldStartOnboarding(profile: Profile) {
  return (
    profile.role !== "admin" &&
    profile.account_status === "active" &&
    !profile.onboarding_completed &&
    !profile.onboarding_skipped_at
  );
}

export function getPostLoginPath(profile: Profile) {
  return shouldStartOnboarding(profile)
    ? getOnboardingPathByRole(profile.role)
    : getDashboardPathByRole(profile.role);
}

export function getPostLoginDestination(
  profile: Profile,
  requestedPath?: string | null,
) {
  const fallback = getPostLoginPath(profile);

  if (
    !requestedPath ||
    profile.role === "admin" ||
    shouldStartOnboarding(profile) ||
    !requestedPath.startsWith("/") ||
    requestedPath.startsWith("//")
  ) {
    return fallback;
  }

  try {
    const url = new URL(requestedPath, "https://app.local");
    const requiredRole = getRequiredRole(url.pathname);

    if (requiredRole !== profile.role) {
      return fallback;
    }

    return `${url.pathname}${url.search}`;
  } catch {
    return fallback;
  }
}

export function isDashboardPath(pathname: string) {
  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/creator" ||
    pathname.startsWith("/creator/") ||
    pathname === "/umkm" ||
    pathname.startsWith("/umkm/")
  );
}

export function shouldBypassDashboardAuth(demoMode: boolean, pathname: string) {
  return demoMode && isDashboardPath(pathname);
}

export function getRequiredRole(pathname: string): UserRole | null {
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return "admin";
  }

  if (pathname === "/creator" || pathname.startsWith("/creator/")) {
    return "creator";
  }

  if (pathname === "/umkm" || pathname.startsWith("/umkm/")) {
    return "umkm";
  }

  return null;
}

export function isAuthRoute(pathname: string) {
  return authRoutes.has(pathname);
}

export function isPublicRoute(pathname: string) {
  return (
    publicRoutes.has(pathname) ||
    pathname.startsWith("/kreator/") ||
    pathname.startsWith("/layanan/")
  );
}

export function getNonLoopingRedirect(pathname: string, destination: string) {
  const destinationPathname = destination.split("?", 1)[0];
  return destinationPathname === pathname ? null : destination;
}

export function getRouteRedirect(
  pathname: string,
  authState: AuthRouteState,
): string | null {
  if (pathname === "/callback") {
    return null;
  }

  const requiredRole = getRequiredRole(pathname);
  const protectedRoute = requiredRole !== null;

  if (authState.kind === "guest") {
    return protectedRoute ? getNonLoopingRedirect(pathname, "/login") : null;
  }

  if (authState.kind === "missing-profile") {
    if (protectedRoute || isAuthRoute(pathname)) {
      return getNonLoopingRedirect(pathname, "/login?error=profile");
    }

    return null;
  }

  const { profile } = authState;

  if (profile.account_status !== "active") {
    if (protectedRoute || isAuthRoute(pathname)) {
      return getNonLoopingRedirect(pathname, "/login?error=inactive");
    }

    return null;
  }

  if (isAuthRoute(pathname)) {
    return getNonLoopingRedirect(pathname, getPostLoginPath(profile));
  }

  if (requiredRole) {
    if (profile.role !== requiredRole) {
      return getNonLoopingRedirect(pathname, getPostLoginPath(profile));
    }

    if (shouldStartOnboarding(profile)) {
      return getNonLoopingRedirect(
        pathname,
        getOnboardingPathByRole(profile.role),
      );
    }

    const onboardingPath = getOnboardingPathByRole(profile.role);
    if (profile.role !== "admin" && pathname === onboardingPath) {
      return getNonLoopingRedirect(
        pathname,
        getDashboardPathByRole(profile.role),
      );
    }

    return null;
  }

  if (profile.role === "admin" && isPublicRoute(pathname)) {
    return getNonLoopingRedirect(pathname, getDashboardPathByRole("admin"));
  }

  return null;
}
