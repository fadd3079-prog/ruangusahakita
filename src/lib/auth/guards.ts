import { redirect } from "next/navigation";
import { getCurrentProfile } from "./session";
import type { UserRole } from "./roles";

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

export async function requireRole(requiredRole: UserRole) {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  if (profile.account_status !== "active") {
    redirect("/login?error=inactive");
  }

  if (profile.role !== requiredRole) {
    redirect(getDashboardPathByRole(profile.role));
  }

  return true;
}
