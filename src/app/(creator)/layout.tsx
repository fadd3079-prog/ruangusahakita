import type { ReactNode } from "react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getCurrentUnreadNotificationCount } from "@/features/notifications/data/notification-queries";
import { getCurrentAccountSummary } from "@/lib/auth/account";
import { requireRole } from "@/lib/auth/guards";

type CreatorLayoutProps = {
  children: ReactNode;
};

export default async function CreatorLayout({ children }: CreatorLayoutProps) {
  await requireRole("creator");
  const [account, notificationCount] = await Promise.all([
    getCurrentAccountSummary(),
    getCurrentUnreadNotificationCount(),
  ]);

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
      notificationCount={notificationCount}
      variant="creator"
    >
      {children}
    </DashboardShell>
  );
}
