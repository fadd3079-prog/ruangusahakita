import type { ReactNode } from "react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getCurrentAccountSummary } from "@/lib/auth/account";
import { requireRole } from "@/lib/auth/guards";
import { getCurrentCartItemCount } from "@/features/cart/data/cart-queries";

type UmkmLayoutProps = {
  children: ReactNode;
};

export default async function UmkmLayout({ children }: UmkmLayoutProps) {
  await requireRole("umkm");
  const [account, cartCount] = await Promise.all([
    getCurrentAccountSummary(),
    getCurrentCartItemCount(),
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
      variant="umkm"
    >
      {children}
    </DashboardShell>
  );
}
