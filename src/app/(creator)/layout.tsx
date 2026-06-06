import type { ReactNode } from "react";

import { DashboardShell } from "@/components/layout/dashboard-shell";

type CreatorLayoutProps = {
  children: ReactNode;
};

export default function CreatorLayout({ children }: CreatorLayoutProps) {
  return <DashboardShell variant="creator">{children}</DashboardShell>;
}
