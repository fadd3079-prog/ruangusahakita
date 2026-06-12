import type { ReactNode } from "react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireRole } from "@/lib/auth/guards";

type UmkmLayoutProps = {
  children: ReactNode;
};

export default async function UmkmLayout({ children }: UmkmLayoutProps) {
  await requireRole("umkm");
  return <DashboardShell variant="umkm">{children}</DashboardShell>;
}
