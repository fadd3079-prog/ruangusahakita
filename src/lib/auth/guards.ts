import { redirect } from "next/navigation";
import { getCurrentProfile } from "./session";
import type { UserRole } from "./roles";

/**
 * Returns the appropriate dashboard base path for a given role.
 */
export function getDashboardPathByRole(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "creator":
      return "/creator/dashboard";
    case "umkm":
      return "/umkm/dashboard";
    default:
      return "/"; // Fallback
  }
}

/**
 * Validates if a user has the required role to access a route.
 * Redirects to the appropriate dashboard or login if unauthorized.
 */
export async function requireRole(requiredRole: UserRole) {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  if (profile.role !== requiredRole) {
    redirect(getDashboardPathByRole(profile.role));
  }

  return true;
}
