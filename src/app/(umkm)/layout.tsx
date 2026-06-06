import type { ReactNode } from "react";

import { DashboardShell } from "@/components/layout/dashboard-shell";

type UmkmLayoutProps = {
  children: ReactNode;
};

export default function UmkmLayout({ children }: UmkmLayoutProps) {
  return <DashboardShell variant="umkm">{children}</DashboardShell>;
}
