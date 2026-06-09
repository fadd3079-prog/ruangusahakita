import type { ReactNode } from "react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getCurrentAccountSummary } from "@/lib/auth/account";

type CreatorLayoutProps = {
  children: ReactNode;
};

export default async function CreatorLayout({ children }: CreatorLayoutProps) {
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
      variant="creator"
    >
      {children}
    </DashboardShell>
  );
}
