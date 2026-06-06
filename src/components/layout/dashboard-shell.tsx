import type { ReactNode } from "react";

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import type { DashboardNavigationVariant } from "@/lib/constants/navigation";

type DashboardShellProps = {
  children: ReactNode;
  variant: DashboardNavigationVariant;
};

export function DashboardShell({ children, variant }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-surface">
      <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
        <DashboardSidebar
          variant={variant}
          className="hidden lg:block"
          mode="sidebar"
        />

        <div className="min-w-0">
          <DashboardTopbar variant={variant} />
          <DashboardSidebar
            variant={variant}
            className="lg:hidden"
            mode="mobile"
          />
          <div className="px-5 py-6 sm:px-8 lg:px-[100px] lg:py-10">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
