"use client";

import Link from "next/link";
import type { FormEvent, ReactNode } from "react";
import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminAnalyticsCharts } from "@/features/admin/components/admin-analytics-charts";
import type {
  AdminAnalyticsDashboard,
  AnalyticsEventType,
  AnalyticsInsight,
  AnalyticsInsightTone,
} from "@/features/admin/data/admin-analytics-queries";
import {
  DashboardHero,
  DashboardList,
} from "@/features/dashboard/components/dashboard-overview";
import { formatDate } from "@/lib/formatters/date";
import { cn } from "@/lib/utils";

type AdminAnalyticsDashboardViewProps = {
  initialAnalytics: AdminAnalyticsDashboard;
  initialEventType: AnalyticsEventType | "all";
  initialInsights: readonly AnalyticsInsight[];
  initialOffset: number;
  initialQuery: string;
};

type RefreshSection =
  | "charts"
  | "events"
  | "export"
  | "insights"
  | "summary"
  | "top";

type SectionPayload = {
  analytics: AdminAnalyticsDashboard;
  insights: readonly AnalyticsInsight[];
  ok: boolean;
};

const eventLabels = {
  add_to_cart: "Tambah keranjang",
  brief_submit: "Brief submit",
  catalog_view: "Catalog view",
  checkout_start: "Checkout start",
  creator_accept_order: "Kreator terima order",
  creator_start_order: "Kreator mulai order",
  creator_view: "Creator view",
  cta_click: "CTA click",
  order_created: "Order created",
  outbound_click: "Outbound click",
  page_view: "Page view",
  payment_opened: "Payment opened",
  payment_paid: "Payment paid",
  portfolio_view: "Portfolio view",
  service_view: "Service view",
} satisfies Record<AnalyticsEventType, string>;

const analyticsEventTypes = [
  "page_view",
  "catalog_view",
  "service_view",
  "creator_view",
  "portfolio_view",
  "cta_click",
  "add_to_cart",
  "checkout_start",
  "brief_submit",
  "order_created",
  "payment_opened",
  "payment_paid",
  "creator_accept_order",
  "creator_start_order",
  "outbound_click",
] as const satisfies readonly AnalyticsEventType[];

const insightToneClasses = {
  good: "border-emerald-200 bg-emerald-50 text-emerald-800",
  neutral: "border-slate-200 bg-slate-50 text-slate-700",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
} satisfies Record<AnalyticsInsightTone, string>;

export function AdminAnalyticsDashboardView({
  initialAnalytics,
  initialEventType,
  initialInsights,
  initialOffset,
  initialQuery,
}: AdminAnalyticsDashboardViewProps) {
  const [summaryAnalytics, setSummaryAnalytics] = useState(initialAnalytics);
  const [chartAnalytics, setChartAnalytics] = useState(initialAnalytics);
  const [eventAnalytics, setEventAnalytics] = useState(initialAnalytics);
  const [topAnalytics, setTopAnalytics] = useState(initialAnalytics);
  const [exportAnalytics, setExportAnalytics] = useState(initialAnalytics);
  const [insights, setInsights] = useState(initialInsights);
  const [eventType, setEventType] = useState<AnalyticsEventType | "all">(initialEventType);
  const [query, setQuery] = useState(initialQuery);
  const [offset, setOffset] = useState(initialOffset);
  const [pendingSection, setPendingSection] = useState<RefreshSection | null>(null);
  const [, startTransition] = useTransition();

  async function fetchSection(nextOffset = offset) {
    const params = new URLSearchParams();

    if (eventType !== "all") {
      params.set("event", eventType);
    }

    if (query) {
      params.set("q", query);
    }

    if (nextOffset > 0) {
      params.set("offset", String(nextOffset));
    }

    const response = await fetch(`/api/admin/analytics/section?${params.toString()}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("refresh_failed");
    }

    return (await response.json()) as SectionPayload;
  }

  function refreshSection(section: RefreshSection, nextOffset = offset) {
    setPendingSection(section);
    startTransition(() => {
      void fetchSection(nextOffset)
        .then((payload) => {
          if (!payload.ok) {
            throw new Error("refresh_failed");
          }

          if (section === "summary") {
            setSummaryAnalytics(payload.analytics);
          }

          if (section === "charts") {
            setChartAnalytics(payload.analytics);
          }

          if (section === "events") {
            setEventAnalytics(payload.analytics);
            setOffset(nextOffset);
          }

          if (section === "top") {
            setTopAnalytics(payload.analytics);
          }

          if (section === "insights") {
            setInsights(payload.insights);
          }

          if (section === "export") {
            setExportAnalytics(payload.analytics);
          }

          toast.success("Section diperbarui.");
        })
        .catch(() => {
          toast.error("Gagal memuat section.");
        })
        .finally(() => {
          setPendingSection(null);
        });
    });
  }

  function handleFilterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    refreshSection("events", 0);
  }

  const ctaClicks = getEventCount(summaryAnalytics.eventCounts, "cta_click");
  const outboundClicks = getEventCount(summaryAnalytics.eventCounts, "outbound_click");
  const serviceViews = getEventCount(summaryAnalytics.eventCounts, "service_view");
  const creatorViews = getEventCount(summaryAnalytics.eventCounts, "creator_view");

  return (
    <div className="space-y-5 pb-8">
      <DashboardHero
        eyebrow="Analytics"
        title="Funnel, traffic, dan aktivitas marketplace."
        description="Event publik tanpa admin traffic, raw IP, atau isi brief campaign."
        actions={[
          { href: "/admin/dashboard", label: "Overview" },
          { href: "/admin/reports/export?format=csv", label: "Export CSV", variant: "outline" },
          { href: "/admin/reports/export?format=print", label: "Print / PDF", variant: "secondary" },
        ]}
        highlights={[
          { label: "Total event", value: String(summaryAnalytics.summary.totalEvents) },
          { label: "Page views", value: String(summaryAnalytics.summary.totalPageViews) },
          { label: "Conversion", value: formatPercent(summaryAnalytics.summary.conversionRate) },
        ]}
      />

      <AnalyticsPanel
        title="Summary metrics"
        onRefresh={() => refreshSection("summary")}
        pending={pendingSection === "summary"}
      >
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <AnalyticsStatCard label="Page views" value={String(summaryAnalytics.summary.totalPageViews)} tone="blue" />
          <AnalyticsStatCard label="Active users" value={String(summaryAnalytics.summary.activeVisitors)} tone="cyan" />
          <AnalyticsStatCard label="Service view" value={String(serviceViews)} tone="purple" />
          <AnalyticsStatCard label="Creator view" value={String(creatorViews)} tone="slate" />
          <AnalyticsStatCard label="CTA click" value={String(ctaClicks)} tone="green" />
          <AnalyticsStatCard label="Outbound" value={String(outboundClicks)} tone="amber" />
        </section>
      </AnalyticsPanel>

      <AnalyticsPanel
        title="ML insight ringan"
        onRefresh={() => refreshSection("insights")}
        pending={pendingSection === "insights"}
      >
        <section className="grid gap-3 xl:grid-cols-5">
          {insights.map((insight) => (
            <div
              key={insight.label}
              className={cn(
                "min-w-0 rounded-2xl border p-4",
                insightToneClasses[insight.tone],
              )}
            >
              <p className="truncate text-xs font-semibold uppercase tracking-[0.14em] opacity-75">
                {insight.label}
              </p>
              <p className="mt-2 text-xl font-semibold tracking-tight">{insight.value}</p>
              <p className="mt-2 line-clamp-3 text-sm leading-6 opacity-85">
                {insight.detail}
              </p>
            </div>
          ))}
        </section>
      </AnalyticsPanel>

      <AnalyticsPanel
        title="Chart traffic, funnel, dan tren"
        onRefresh={() => refreshSection("charts")}
        pending={pendingSection === "charts"}
      >
        <AdminAnalyticsCharts
          categoryPerformance={chartAnalytics.categoryPerformance}
          completedOrderTrend={chartAnalytics.completedOrderTrend}
          conversionFunnel={chartAnalytics.conversionFunnel}
          deviceBreakdown={chartAnalytics.deviceBreakdown}
          eventsByDay={chartAnalytics.eventsByDay}
          orderTrend={chartAnalytics.orderTrend}
          revenueTrend={chartAnalytics.revenueTrend}
          roleBreakdown={chartAnalytics.roleBreakdown}
          sourceBreakdown={chartAnalytics.sourceBreakdown}
          topPages={chartAnalytics.topPages}
        />
      </AnalyticsPanel>

      <section className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_420px]">
        <AnalyticsPanel
          title="Recent activity"
          onRefresh={() => refreshSection("events")}
          pending={pendingSection === "events"}
        >
          <ActivityToolbar
            eventType={eventType}
            onEventTypeChange={setEventType}
            onQueryChange={setQuery}
            onSubmit={handleFilterSubmit}
            query={query}
          />
          <div className="mt-4 grid gap-2">
            {eventAnalytics.recentEvents.length > 0 ? (
              eventAnalytics.recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="grid min-w-0 gap-3 rounded-2xl border border-border/70 bg-background/80 p-3 text-sm md:grid-cols-[170px_minmax(0,1fr)_140px_160px]"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <Badge variant="outline" className="rounded-lg">
                      {eventLabels[event.eventType]}
                    </Badge>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{event.path}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {event.referrer ?? event.source ?? "Direct"}
                    </p>
                  </div>
                  <p className="truncate text-muted-foreground">
                    {[event.deviceType, event.browserName].filter(Boolean).join(" · ") || "-"}
                  </p>
                  <p className="text-muted-foreground">{formatDate(event.createdAt)}</p>
                </div>
              ))
            ) : (
              <p className="rounded-2xl border border-dashed border-border bg-muted/30 p-5 text-sm text-muted-foreground">
                Belum ada event analytics yang cocok.
              </p>
            )}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              UI menampilkan ringkas. Data lama tetap tersimpan di database.
            </p>
            <div className="flex gap-2">
              {offset > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => refreshSection("events", Math.max(offset - 25, 0))}
                  disabled={pendingSection === "events"}
                >
                  Sebelumnya
                </Button>
              ) : null}
              {eventAnalytics.hasMoreRecentEvents ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => refreshSection("events", offset + 25)}
                  disabled={pendingSection === "events"}
                >
                  Berikutnya
                </Button>
              ) : null}
            </div>
          </div>
        </AnalyticsPanel>

        <div className="grid gap-5">
          <AnalyticsPanel
            title="Event mix"
            onRefresh={() => refreshSection("top")}
            pending={pendingSection === "top"}
          >
            <RankList items={topAnalytics.eventCounts} color="#2563EB" />
          </AnalyticsPanel>
          <AnalyticsPanel
            title="CTA performance"
            onRefresh={() => refreshSection("top")}
            pending={pendingSection === "top"}
          >
            <RankList
              color="#16A34A"
              emptyText="Belum ada CTA atau outbound click."
              items={[
                { label: "CTA click", value: getEventCount(topAnalytics.eventCounts, "cta_click") },
                { label: "Outbound click", value: getEventCount(topAnalytics.eventCounts, "outbound_click") },
                { label: "Add to cart", value: getEventCount(topAnalytics.eventCounts, "add_to_cart") },
                { label: "Order created", value: getEventCount(topAnalytics.eventCounts, "order_created") },
              ].filter((item) => item.value > 0)}
            />
          </AnalyticsPanel>
        </div>
      </section>

      <AnalyticsPanel
        title="Top pages, services, creator"
        onRefresh={() => refreshSection("top")}
        pending={pendingSection === "top"}
      >
        <section className="grid gap-5 xl:grid-cols-2">
          <RankList title="Top pages" items={topAnalytics.topPages} color="#2563EB" />
          <RankList title="Source / referrer" items={topAnalytics.sourceBreakdown} color="#7C3AED" />
          <DashboardList
            items={topAnalytics.servicePerformance.map((item) => ({
              id: `service-performance:${item.label}`,
              title: item.label,
              description: `${item.value} service view`,
              href: "/admin/services",
              meta: "Layanan potensial",
            }))}
            emptyText="Belum ada service_view."
          />
          <DashboardList
            items={topAnalytics.creatorPerformance.map((item) => ({
              id: `creator-performance:${item.label}`,
              title: item.label,
              description: `${item.value} creator view`,
              href: "/admin/creators",
              meta: "Kreator potensial",
            }))}
            emptyText="Belum ada creator_view."
          />
        </section>
      </AnalyticsPanel>

      <AnalyticsPanel
        title="Export dan report preview"
        onRefresh={() => refreshSection("export")}
        pending={pendingSection === "export"}
      >
        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="grid gap-3 sm:grid-cols-3">
            <ReportPreview label="Event" value={String(exportAnalytics.summary.totalEvents)} />
            <ReportPreview label="Page views" value={String(exportAnalytics.summary.totalPageViews)} />
            <ReportPreview label="Conversion" value={formatPercent(exportAnalytics.summary.conversionRate)} />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/admin/reports/export?format=csv">Export CSV</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/admin/reports/export?format=html">HTML Report</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/reports/export?format=print">Print / PDF</Link>
            </Button>
          </div>
        </section>
      </AnalyticsPanel>
    </div>
  );
}

function ActivityToolbar({
  eventType,
  onEventTypeChange,
  onQueryChange,
  onSubmit,
  query,
}: {
  eventType: AnalyticsEventType | "all";
  onEventTypeChange: (value: AnalyticsEventType | "all") => void;
  onQueryChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  query: string;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-3 rounded-2xl border border-border/70 bg-muted/30 p-3 sm:grid-cols-[1fr_190px_auto]"
    >
      <input
        type="search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Cari path, referrer, atau user id"
        className="h-10 min-w-0 rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
      />
      <select
        value={eventType}
        onChange={(event) => onEventTypeChange(event.target.value as AnalyticsEventType | "all")}
        className="h-10 rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
      >
        <option value="all">Semua event</option>
        {analyticsEventTypes.map((item) => (
          <option key={item} value={item}>
            {eventLabels[item]}
          </option>
        ))}
      </select>
      <Button type="submit" variant="secondary">
        Filter
      </Button>
    </form>
  );
}

function AnalyticsPanel({
  children,
  onRefresh,
  pending,
  title,
}: {
  children: ReactNode;
  onRefresh: () => void;
  pending: boolean;
  title: string;
}) {
  return (
    <section className="dashboard-surface min-w-0 rounded-2xl p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="truncate text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={pending}
          className="shrink-0"
        >
          <RefreshCw className={cn("size-4", pending && "animate-spin")} aria-hidden="true" />
          {pending ? "Memuat" : "Refresh"}
        </Button>
      </div>
      {children}
    </section>
  );
}

function AnalyticsStatCard({
  label,
  tone,
  value,
}: {
  label: string;
  tone: "amber" | "blue" | "cyan" | "green" | "purple" | "slate";
  value: string;
}) {
  return (
    <div className={cn("min-w-0 rounded-2xl border p-4", getStatToneClass(tone))}>
      <p className="truncate text-xs font-semibold uppercase tracking-[0.14em] opacity-75">
        {label}
      </p>
      <p className="mt-2 truncate text-2xl font-semibold tracking-tight">
        {value}
      </p>
    </div>
  );
}

function RankList({
  color,
  emptyText = "Belum ada data.",
  items,
  title,
}: {
  color: string;
  emptyText?: string;
  items: readonly { label: string; value: number }[];
  title?: string;
}) {
  const maxValue = Math.max(...items.map((item) => item.value), 1);

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        {emptyText}
      </p>
    );
  }

  return (
    <div>
      {title ? (
        <h3 className="mb-3 truncate text-sm font-semibold text-foreground">{title}</h3>
      ) : null}
      <div className="grid gap-3">
        {items.slice(0, 8).map((item) => (
          <div key={item.label} className="min-w-0">
            <div className="mb-1 flex items-center justify-between gap-3 text-sm">
              <span className="truncate font-medium text-foreground">{item.label}</span>
              <span className="shrink-0 text-muted-foreground">{item.value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{
                  backgroundColor: color,
                  width: `${Math.max((item.value / maxValue) * 100, 5)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportPreview({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/70 bg-background/80 p-4">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">{value}</p>
    </div>
  );
}

function getEventCount(
  items: readonly { label: string; value: number }[],
  eventType: AnalyticsEventType,
) {
  return items.find((item) => item.label === eventType)?.value ?? 0;
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function getStatToneClass(tone: "amber" | "blue" | "cyan" | "green" | "purple" | "slate") {
  const classes = {
    amber: "border-amber-200 bg-amber-50 text-amber-900",
    blue: "border-blue-200 bg-blue-50 text-blue-900",
    cyan: "border-cyan-200 bg-cyan-50 text-cyan-900",
    green: "border-emerald-200 bg-emerald-50 text-emerald-900",
    purple: "border-violet-200 bg-violet-50 text-violet-900",
    slate: "border-slate-200 bg-slate-50 text-slate-900",
  };

  return classes[tone];
}
