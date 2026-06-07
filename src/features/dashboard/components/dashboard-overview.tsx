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
  description: string;
  icon: LucideIcon;
};

export type DashboardAction = {
  href: string;
  label: string;
  variant?: "default" | "outline" | "secondary";
};

export type DashboardListItem = {
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
    <section className="overflow-hidden rounded-3xl border border-primary/15 bg-[linear-gradient(135deg,rgba(12,41,73,0.98),rgba(17,73,85,0.94))] text-primary-foreground shadow-[0_24px_70px_rgba(12,41,73,0.18)]">
      <div className="grid gap-8 p-6 sm:p-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground/70">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-primary-foreground/78 sm:text-base">
            {description}
          </p>
          {actions.length > 0 ? (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
          <div className="grid gap-3 rounded-2xl border border-white/12 bg-white/8 p-4 backdrop-blur-sm">
            {highlights.map((highlight) => (
              <div
                key={highlight.label}
                className="flex items-center justify-between gap-4 rounded-2xl bg-white/8 px-4 py-3"
              >
                <span className="text-sm text-primary-foreground/70">
                  {highlight.label}
                </span>
                <span className="text-lg font-semibold">
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
};

export function DashboardMetricGrid({ metrics }: DashboardMetricGridProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <DashboardMetricCard key={metric.label} metric={metric} />
      ))}
    </section>
  );
}

function DashboardMetricCard({ metric }: { metric: DashboardMetric }) {
  const Icon = metric.icon;

  return (
    <Card className="rounded-2xl border-border/70 bg-card/90 shadow-[var(--shadow-soft)]">
      <CardContent className="space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {metric.label}
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              {metric.value}
            </p>
          </div>
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/10">
            <Icon className="size-5" aria-hidden="true" />
          </div>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          {metric.description}
        </p>
      </CardContent>
    </Card>
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
        "rounded-2xl border-border/70 bg-card/90 shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      <CardHeader className="gap-3 sm:flex sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          {description ? (
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {action ? (
          <Button asChild variant={action.variant ?? "outline"}>
            <Link href={action.href}>
              {action.label}
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        ) : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
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
      <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-5 text-sm text-muted-foreground">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => {
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
              key={`${item.title}-${item.href}`}
              href={item.href}
              className="rounded-2xl border border-border/70 bg-background/80 p-4 transition-colors hover:border-primary/30 hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {content}
            </Link>
          );
        }

        return (
          <div
            key={`${item.title}-${item.description}`}
            className="rounded-2xl border border-border/70 bg-background/80 p-4"
          >
            {content}
          </div>
        );
      })}
    </div>
  );
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
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <Link
            key={action.href}
            href={action.href}
            className="group rounded-2xl border border-border/70 bg-card/90 p-4 shadow-[var(--shadow-soft)] transition-colors hover:border-primary/30 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
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
