import { Menu } from "lucide-react";

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { PageContainer } from "@/components/layout/page-container";
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

type DashboardTopbarProps = {
  variant: DashboardNavigationVariant;
};

export function DashboardTopbar({ variant }: DashboardTopbarProps) {
  const roleLabel = dashboardRoleLabels[variant];

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/75">
      <PageContainer className="flex min-h-16 items-center justify-between gap-4 py-0">
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
          <Badge variant="secondary">Fondasi</Badge>
          <div className="hidden items-center gap-2 rounded-full border bg-card px-2 py-1 sm:flex">
            <div className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              {roleLabel.slice(0, 1)}
            </div>
            <span className="pr-1 text-sm font-medium text-foreground">
              {roleLabel}
            </span>
          </div>
        </div>
      </PageContainer>
    </header>
  );
}
