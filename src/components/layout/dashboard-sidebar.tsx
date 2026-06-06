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
  className?: string;
  mode?: "sidebar" | "mobile";
  variant: DashboardNavigationVariant;
};

export function DashboardSidebar({
  className,
  mode = "sidebar",
  variant,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const items = dashboardNavigation[variant];
  const roleLabel = dashboardRoleLabels[variant];
  const isMobile = mode === "mobile";

  return (
    <aside
      className={cn(
        isMobile
          ? "border-b bg-background/85"
          : "h-screen border-r bg-background/80",
        className,
      )}
    >
      <div
        className={cn(
          isMobile ? "px-5 py-3 sm:px-8" : "flex h-full flex-col p-5",
        )}
      >
        {!isMobile && (
          <div className="mb-7">
            <AppLogo />
            <p className="mt-3 text-xs font-medium uppercase text-muted-foreground">
              Dashboard {roleLabel}
            </p>
          </div>
        )}

        <nav
          aria-label={`Navigasi dashboard ${roleLabel}`}
          className={cn(
            isMobile
              ? "flex gap-2 overflow-x-auto"
              : "grid flex-1 content-start gap-1",
          )}
        >
          {items.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                  isMobile
                    ? "shrink-0 px-3 py-2"
                    : "min-h-10 px-3 py-2.5",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon aria-hidden="true" className="size-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
