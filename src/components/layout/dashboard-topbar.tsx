import Link from "next/link";
import { Home, LogOut, Menu, ShoppingCart } from "lucide-react";

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { SubmitButton } from "@/components/common/submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  dashboardRoleLabels,
  type DashboardNavigationVariant,
} from "@/lib/constants/navigation";
import { logoutAction } from "@/lib/auth/actions";
import type { DashboardAccountPreview } from "@/components/layout/dashboard-shell";

type DashboardTopbarProps = {
  accountPreview?: DashboardAccountPreview | null;
  variant: DashboardNavigationVariant;
};

export function DashboardTopbar({ accountPreview, variant }: DashboardTopbarProps) {
  const roleLabel = dashboardRoleLabels[variant];
  const displayName = accountPreview?.displayName ?? roleLabel;
  const initials = accountPreview?.initials ?? roleLabel.slice(0, 1);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/78">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Buka navigasi dashboard"
                className="lg:hidden"
              >
                <Menu aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[min(22rem,calc(100vw-2rem))] p-0"
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Navigasi dashboard {roleLabel}</SheetTitle>
                <SheetDescription>
                  Menu dashboard untuk ruang kerja {roleLabel}.
                </SheetDescription>
              </SheetHeader>
              <DashboardSidebar variant={variant} mode="drawer" />
            </SheetContent>
          </Sheet>

          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Ruang Kerja
            </p>
            <h1 className="truncate text-base font-semibold text-foreground">
              Dashboard {roleLabel}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="icon" className="hidden rounded-full sm:inline-flex">
            <Link href="/" aria-label="Kembali ke Home">
              <Home aria-hidden="true" />
            </Link>
          </Button>
          {variant === "umkm" ? (
            <Button asChild variant="outline" size="icon" className="rounded-full">
              <Link href="/umkm/cart" aria-label="Buka keranjang">
                <ShoppingCart aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
          <Badge variant="secondary" className="rounded-full">Live</Badge>
          <div className="hidden items-center gap-2 rounded-full border bg-card px-2 py-1 sm:flex">
            <div
              className="flex size-7 items-center justify-center rounded-full bg-primary bg-cover bg-center text-xs font-semibold text-primary-foreground"
              style={
                accountPreview?.avatarUrl
                  ? { backgroundImage: `url("${accountPreview.avatarUrl}")` }
                  : undefined
              }
            >
              {accountPreview?.avatarUrl ? null : initials}
            </div>
            <span className="max-w-[12rem] truncate pr-1 text-sm font-medium text-foreground">
              {displayName}
            </span>
          </div>
          <form action={logoutAction}>
            <SubmitButton
              pendingLabel="Keluar..."
              variant="outline"
              size="sm"
              className="rounded-full"
              icon={<LogOut aria-hidden="true" />}
            >
              Keluar
            </SubmitButton>
          </form>
        </div>
      </div>
    </header>
  );
}
