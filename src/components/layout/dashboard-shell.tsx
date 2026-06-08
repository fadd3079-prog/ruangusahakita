"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import type { DashboardNavigationVariant } from "@/lib/constants/navigation";

type DashboardShellProps = {
  children: ReactNode;
  variant: DashboardNavigationVariant;
};

export function DashboardShell({ children, variant }: DashboardShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="h-dvh overflow-hidden bg-[linear-gradient(180deg,var(--surface),var(--background))]">
      <div className="flex h-full min-w-0">
        <DashboardSidebar
          variant={variant}
          className="hidden lg:flex"
          collapsed={isSidebarCollapsed}
          mode="sidebar"
          onToggleCollapsed={() =>
            setIsSidebarCollapsed((currentValue) => !currentValue)
          }
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardTopbar variant={variant} />
          <main className="min-h-0 flex-1 overflow-y-auto py-5 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
