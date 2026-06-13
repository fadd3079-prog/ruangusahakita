import type { ReactNode } from "react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getCurrentAccountSummary } from "@/lib/auth/account";
import { requireRole } from "@/lib/auth/guards";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  await requireRole("admin");
  const account = await getCurrentAccountSummary();

  return (
    <DashboardShell
      accountPreview={
        account
          ? {
              avatarUrl: account.avatarUrl,
              displayName: account.displayName,
              initials: account.initials,
            }
          : null
      }
      variant="admin"
    >
      {children}
    </DashboardShell>
  );
}
