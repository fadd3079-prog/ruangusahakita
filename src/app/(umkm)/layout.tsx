import type { ReactNode } from "react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getCurrentAccountSummary } from "@/lib/auth/account";
import { requireRole } from "@/lib/auth/guards";
import { getCurrentCartItemCount } from "@/features/cart/data/cart-queries";
import { getCurrentUnreadNotificationCount } from "@/features/notifications/data/notification-queries";

type UmkmLayoutProps = {
  children: ReactNode;
};

export default async function UmkmLayout({ children }: UmkmLayoutProps) {
  await requireRole("umkm");
  const [account, cartCount, notificationCount] = await Promise.all([
    getCurrentAccountSummary(),
    getCurrentCartItemCount(),
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
      cartCount={cartCount}
      notificationCount={notificationCount}
      variant="umkm"
    >
      {children}
    </DashboardShell>
  );
}
