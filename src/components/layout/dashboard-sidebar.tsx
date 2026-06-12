"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CircleHelp,
  ClipboardList,
  CreditCard,
  FileText,
  FolderCheck,
  Home,
  Images,
  Inbox,
  LayoutDashboard,
  ListChecks,
  ListPlus,
  LogIn,
  MessageSquareWarning,
  PanelLeftClose,
  PanelLeftOpen,
  Route,
  Search,
  Settings,
  UserPlus,
  UserRound,
  UserRoundCheck,
  Users,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

import { AppLogo } from "@/components/common/app-logo";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import {
  dashboardNavigation,
  dashboardRoleLabels,
  type DashboardNavigationVariant,
  type NavigationIcon,
} from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";

const iconMap = {
  adminReports: BarChart3,
  brief: FileText,
  cart: ListPlus,
  checkout: ClipboardList,
  creator: UserRoundCheck,
  dashboard: LayoutDashboard,
  earnings: WalletCards,
  help: CircleHelp,
  home: Home,
  inbox: Inbox,
  login: LogIn,
  orders: ListChecks,
  payments: CreditCard,
  portfolio: Images,
  profile: UserRound,
  register: UserPlus,
  results: FolderCheck,
  route: Route,
  search: Search,
  services: BriefcaseBusiness,
  settings: Settings,
  umkm: Building2,
  users: Users,
  warning: MessageSquareWarning,
} satisfies Record<NavigationIcon, LucideIcon>;

type DashboardSidebarProps = {
  collapsed?: boolean;
  className?: string;
  mode?: "sidebar" | "drawer";
  onToggleCollapsed?: () => void;
  variant: DashboardNavigationVariant;
};

export function DashboardSidebar({
  collapsed = false,
  className,
  mode = "sidebar",
  onToggleCollapsed,
  variant,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const items = dashboardNavigation[variant];
  const roleLabel = dashboardRoleLabels[variant];
  const isDrawer = mode === "drawer";

  return (
    <aside
      className={cn(
        isDrawer
          ? "h-full bg-background"
          : "h-dvh shrink-0 border-r border-border/70 bg-background/94 transition-[width] duration-200 ease-out",
        !isDrawer && (collapsed ? "w-[80px]" : "w-[264px]"),
        className,
      )}
    >
      <div className="flex h-full flex-col p-3">
        <div className="mb-6 flex min-h-12 items-center justify-between gap-2">
          <AppLogo showText={!collapsed || isDrawer} />
          {!isDrawer && onToggleCollapsed ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onToggleCollapsed}
              aria-label={collapsed ? "Perluas navigasi" : "Ciutkan navigasi"}
              className="hidden lg:inline-flex"
            >
              {collapsed ? (
                <PanelLeftOpen aria-hidden="true" />
              ) : (
                <PanelLeftClose aria-hidden="true" />
              )}
            </Button>
          ) : null}
        </div>

        <div className={cn("mb-4 rounded-2xl border border-border/70 bg-muted/40 p-3", collapsed && !isDrawer && "sr-only")}>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Dashboard {roleLabel}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Marketplace layanan digital.
          </p>
        </div>

        <nav
          aria-label={`Navigasi dashboard ${roleLabel}`}
          className="grid flex-1 content-start gap-1 overflow-y-auto pr-1"
        >
          {items.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            const link = (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                title={collapsed && !isDrawer ? item.title : undefined}
                className={cn(
                  "inline-flex min-h-10 items-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  collapsed && !isDrawer
                    ? "justify-center px-2"
                    : "gap-2 px-3 py-2.5",
                  isActive
                    ? "bg-brand-navy text-white shadow-[0_12px_28px_rgba(12,41,73,0.16)]"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                )}
              >
                <Icon aria-hidden="true" className="size-4" />
                <span className={cn(collapsed && !isDrawer && "sr-only")}>
                  {item.title}
                </span>
              </Link>
            );

            return isDrawer ? (
              <SheetClose key={item.href} asChild>
                {link}
              </SheetClose>
            ) : (
              link
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
