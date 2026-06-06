import { Badge } from "@/components/ui/badge";
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
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur-xl">
      <div className="flex min-h-16 items-center justify-between gap-4 px-5 sm:px-8 lg:px-[100px]">
        <div>
          <p className="text-xs font-medium uppercase text-muted-foreground">
            Ruang Kerja
          </p>
          <h1 className="text-base font-semibold text-foreground">
            Dashboard {roleLabel}
          </h1>
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
      </div>
    </header>
  );
}
