import type { ReactNode } from "react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getCurrentAccountSummary } from "@/lib/auth/account";
import { requireRole } from "@/lib/auth/guards";

type UmkmLayoutProps = {
  children: ReactNode;
};

export default async function UmkmLayout({ children }: UmkmLayoutProps) {
  await requireRole("umkm");
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
      variant="umkm"
    >
      {children}
    </DashboardShell>
  );
}
