import type { ReactNode } from "react";

import { DashboardShell } from "@/components/layout/dashboard-shell";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <DashboardShell variant="admin">{children}</DashboardShell>;
}
