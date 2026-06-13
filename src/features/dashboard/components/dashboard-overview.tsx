import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type DashboardMetric = {
  label: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  tone?: DashboardTone;
};

export type DashboardTone = "amber" | "blue" | "cyan" | "green" | "red" | "slate" | "violet";

export type DashboardAction = {
  href: string;
  label: string;
  variant?: "default" | "outline" | "secondary";
};

export type DashboardListItem = {
  id: string;
  title: string;
  description: string;
  meta?: string;
  href?: string;
  badge?: ReactNode;
};

type DashboardHeroProps = {
  actions?: readonly DashboardAction[];
  description: string;
  eyebrow: string;
  highlights?: readonly {
    label: string;
    value: string;
  }[];
  title: string;
};

export function DashboardHero({
  actions = [],
  description,
  eyebrow,
  highlights = [],
  title,
}: DashboardHeroProps) {
  return (
    <section className="min-w-0 overflow-hidden rounded-[20px] border border-primary/15 bg-[linear-gradient(135deg,rgba(12,41,73,0.98),rgba(17,73,85,0.94))] text-primary-foreground shadow-[0_20px_56px_rgba(12,41,73,0.16)]">
      <div className="grid min-w-0 gap-6 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:items-end">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground/70">
            {eyebrow}
          </p>
          <h1 className="mt-3 max-w-4xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-primary-foreground/74 sm:text-base">
            {description}
          </p>
          {actions.length > 0 ? (
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {actions.map((action) => (
                <Button
                  key={action.href}
                  asChild
                  variant={action.variant ?? "default"}
                  className={cn(
                    action.variant === "outline" &&
                      "border-white/25 bg-white/5 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground",
                    action.variant === "secondary" &&
                      "bg-white/12 text-primary-foreground hover:bg-white/18",
                  )}
                >
                  <Link href={action.href}>
                    {action.label}
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              ))}
            </div>
          ) : null}
        </div>

        {highlights.length > 0 ? (
          <div className="grid min-w-0 gap-2 rounded-2xl border border-white/12 bg-white/8 p-3 backdrop-blur-sm">
            {highlights.map((highlight) => (
              <div
                key={highlight.label}
                className="flex items-center justify-between gap-4 rounded-xl bg-white/8 px-3 py-2.5"
              >
                <span className="text-sm text-primary-foreground/70">
                  {highlight.label}
                </span>
                <span className="min-w-0 truncate text-base font-semibold">
                  {highlight.value}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

type DashboardMetricGridProps = {
  metrics: readonly DashboardMetric[];
  showDescriptions?: boolean;
  showIcons?: boolean;
};

export function DashboardMetricGrid({
  metrics,
  showDescriptions = false,
  showIcons = false,
}: DashboardMetricGridProps) {
  return (
    <section className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(190px,1fr))]">
      {metrics.map((metric) => (
        <DashboardMetricCard
          key={metric.label}
          metric={metric}
          showDescription={showDescriptions}
          showIcon={showIcons}
        />
      ))}
    </section>
  );
}

function DashboardMetricCard({
  metric,
  showDescription,
  showIcon,
}: {
  metric: DashboardMetric;
  showDescription: boolean;
  showIcon: boolean;
}) {
  const Icon = metric.icon;
  const tone = metric.tone ?? "slate";

  return (
    <Card className={cn("dashboard-surface min-w-0 overflow-hidden border-l-4", toneBorderClasses[tone])}>
      <CardContent className="space-y-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {metric.label}
            </p>
            <p className="mt-1.5 truncate text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {metric.value}
            </p>
          </div>
          {showIcon ? (
            <div className={cn("grid size-10 shrink-0 place-items-center rounded-xl ring-1", toneIconClasses[tone])}>
              <Icon className="size-5" aria-hidden="true" />
            </div>
          ) : null}
        </div>
        {showDescription && metric.description ? (
          <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
            {metric.description}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

const toneBorderClasses: Record<DashboardTone, string> = {
  amber: "border-l-amber-400",
  blue: "border-l-blue-500",
  cyan: "border-l-cyan-500",
  green: "border-l-emerald-500",
  red: "border-l-red-500",
  slate: "border-l-slate-400",
  violet: "border-l-violet-500",
};

const toneIconClasses: Record<DashboardTone, string> = {
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
  cyan: "bg-cyan-50 text-cyan-700 ring-cyan-200",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  red: "bg-red-50 text-red-700 ring-red-200",
  slate: "bg-slate-50 text-slate-700 ring-slate-200",
  violet: "bg-violet-50 text-violet-700 ring-violet-200",
};

const toneFillClasses: Record<DashboardTone, string> = {
  amber: "bg-amber-400",
  blue: "bg-blue-500",
  cyan: "bg-cyan-500",
  green: "bg-emerald-500",
  red: "bg-red-500",
  slate: "bg-slate-400",
  violet: "bg-violet-500",
};

export function DashboardColorBars({
  items,
}: {
  items: readonly {
    label: string;
    tone: DashboardTone;
    value: number;
  }[];
}) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div key={item.label} className="min-w-0">
          <div className="mb-2 flex items-center justify-between gap-4 text-sm">
            <span className="truncate font-medium text-foreground">{item.label}</span>
            <span className="shrink-0 font-semibold text-foreground">{item.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full", toneFillClasses[item.tone])}
              style={{ width: `${Math.max(6, (item.value / maxValue) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

type DashboardPanelProps = {
  action?: DashboardAction;
  children: ReactNode;
  className?: string;
  description?: string;
  title: string;
};

export function DashboardPanel({
  action,
  children,
  className,
  description,
  title,
}: DashboardPanelProps) {
  return (
    <Card
      className={cn(
        "dashboard-surface min-w-0 overflow-hidden",
        className,
      )}
    >
      <CardHeader className="gap-3 p-4 pb-3 sm:flex sm:flex-row sm:items-start sm:justify-between sm:p-5 sm:pb-3">
        <div className="min-w-0">
          <CardTitle className="text-lg">{title}</CardTitle>
          {description ? (
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {action ? (
          <Button asChild variant={action.variant ?? "outline"} className="shrink-0">
            <Link href={action.href}>
              {action.label}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="min-w-0 p-4 pt-0 sm:p-5 sm:pt-0">{children}</CardContent>
    </Card>
  );
}

type DashboardListProps = {
  emptyText?: string;
  items: readonly DashboardListItem[];
};

export function DashboardList({
  emptyText = "Belum ada data untuk ditampilkan.",
  items,
}: DashboardListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {getUniqueDashboardItems(items).map((item) => {
        const content = (
          <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {item.title}
              </p>
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                {item.description}
              </p>
              {item.meta ? (
                <p className="mt-2 text-xs font-medium text-primary">
                  {item.meta}
                </p>
              ) : null}
            </div>
            {item.badge ? <div className="shrink-0">{item.badge}</div> : null}
          </div>
        );

        if (item.href) {
          return (
            <Link
              key={item.id}
              href={item.href}
              className="min-w-0 rounded-xl border border-border/70 bg-background/80 p-4 transition-[border-color,background-color] duration-200 hover:border-primary/30 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {content}
            </Link>
          );
        }

        return (
          <div
            key={item.id}
            className="min-w-0 rounded-xl border border-border/70 bg-background/80 p-4"
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}

function getUniqueDashboardItems(items: readonly DashboardListItem[]) {
  const seenIds = new Set<string>();

  return items.filter((item) => {
    if (seenIds.has(item.id)) {
      return false;
    }

    seenIds.add(item.id);
    return true;
  });
}

type DashboardQuickActionsProps = {
  actions: readonly {
    description: string;
    href: string;
    icon: LucideIcon;
    label: string;
  }[];
};

export function DashboardQuickActions({ actions }: DashboardQuickActionsProps) {
  return (
    <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(210px,1fr))]">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <Link
            key={action.href}
            href={action.href}
            className="group min-w-0 rounded-xl border border-border/70 bg-card/90 p-4 shadow-[var(--shadow-soft)] transition-[border-color,background-color] duration-200 hover:border-primary/30 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <div className="flex items-start gap-3">
              <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/10">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground">
                  {action.label}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
