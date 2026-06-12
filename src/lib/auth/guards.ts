import { redirect } from "next/navigation";
import { isDemoMode } from "@/lib/config/demo-mode";
import { getCurrentProfile } from "./session";
import type { UserRole } from "./roles";
import { getPostLoginPath } from "./routing";

export { getDashboardPathByRole } from "./routing";

export async function requireRole(requiredRole: UserRole) {
  if (isDemoMode()) {
    return null;
  }

  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  if (profile.account_status !== "active") {
    redirect("/login?error=inactive");
  }

  if (profile.role !== requiredRole) {
    redirect(getPostLoginPath(profile));
  }

  return profile;
}
