"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";
import type { DashboardNavigationVariant } from "@/lib/constants/navigation";

type DashboardShellProps = {
  accountPreview?: DashboardAccountPreview | null;
  children: ReactNode;
  cartCount?: number;
  variant: DashboardNavigationVariant;
};

export type DashboardAccountPreview = {
  avatarUrl: string | null;
  displayName: string;
  initials: string;
};

export function DashboardShell({
  accountPreview,
  cartCount = 0,
  children,
  variant,
}: DashboardShellProps) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="h-dvh overflow-hidden bg-[linear-gradient(180deg,var(--surface),var(--background))] [--page-gutter-desktop:2rem] [--page-gutter-mobile:1rem] [--page-gutter-tablet:1.5rem]">
      <div className="flex h-full min-h-0 min-w-0">
        <DashboardSidebar
          variant={variant}
          className="hidden lg:flex"
          collapsed={isSidebarCollapsed}
          mode="sidebar"
          onToggleCollapsed={() =>
            setIsSidebarCollapsed((currentValue) => !currentValue)
          }
        />

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <DashboardTopbar accountPreview={accountPreview} cartCount={cartCount} variant={variant} />
          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain py-5 lg:py-7">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
