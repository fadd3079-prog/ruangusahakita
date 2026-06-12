import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getCurrentAccountSummary } from "@/lib/auth/account";
import { getDashboardPathByRole } from "@/lib/auth/routing";
import { isDemoMode } from "@/lib/config/demo-mode";

type PublicLayoutProps = {
  children: ReactNode;
};

export default async function PublicLayout({ children }: PublicLayoutProps) {
  const account = isDemoMode() ? null : await getCurrentAccountSummary();

  if (account?.role === "admin") {
    redirect(getDashboardPathByRole("admin"));
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader account={account} />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
