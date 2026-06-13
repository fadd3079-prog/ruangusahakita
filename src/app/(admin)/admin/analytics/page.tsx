import Link from "next/link";
import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminAnalyticsCharts } from "@/features/admin/components/admin-analytics-charts";
import {
  createAnalyticsInsights,
  getAdminAnalyticsDashboard,
  getAnalyticsEventTypes,
  parseAnalyticsEventType,
  type AnalyticsEventType,
  type AnalyticsInsightTone,
} from "@/features/admin/data/admin-analytics-queries";
import {
  DashboardHero,
  DashboardList,
  DashboardPanel,
} from "@/features/dashboard/components/dashboard-overview";
import { formatDate } from "@/lib/formatters/date";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Analytics Admin — Ruang Usaha Kita",
  description:
    "Analytics marketplace jasa digital Ruang Usaha Kita untuk admin.",
};

type AdminAnalyticsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
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

const insightToneClasses = {
  good: "border-emerald-200 bg-emerald-50 text-emerald-800",
  neutral: "border-slate-200 bg-slate-50 text-slate-700",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
} satisfies Record<AnalyticsInsightTone, string>;

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getNumberParam(value: string | string[] | undefined) {
  const singleValue = getSingleParam(value);
  const numberValue = Number(singleValue);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function getEventCount(
  items: readonly { label: string; value: number }[],
  eventType: AnalyticsEventType,
) {
  return items.find((item) => item.label === eventType)?.value ?? 0;
}

function createEventFilterHref(params: {
  eventType?: string;
  offset?: number;
  query?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params.eventType && params.eventType !== "all") {
    searchParams.set("event", params.eventType);
  }

  if (params.query) {
    searchParams.set("q", params.query);
  }

  if (params.offset && params.offset > 0) {
    searchParams.set("offset", String(params.offset));
  }

  const search = searchParams.toString();
  return search ? `/admin/analytics?${search}` : "/admin/analytics";
}

export default async function AdminAnalyticsPage({
  searchParams,
}: AdminAnalyticsPageProps) {
  const params = await searchParams;
  const eventType = parseAnalyticsEventType(params.event);
  const query = getSingleParam(params.q)?.trim() ?? "";
  const offset = getNumberParam(params.offset) ?? 0;
  const analytics = await getAdminAnalyticsDashboard({
    eventType,
    limit: 25,
    offset,
    query,
  });
  const insights = createAnalyticsInsights(analytics);
  const ctaClicks = getEventCount(analytics.eventCounts, "cta_click");
  const outboundClicks = getEventCount(analytics.eventCounts, "outbound_click");
  const serviceViews = getEventCount(analytics.eventCounts, "service_view");
  const creatorViews = getEventCount(analytics.eventCounts, "creator_view");

  return (
    <PageContainer>
      <div className="space-y-5 pb-8">
        <DashboardHero
          eyebrow="Analytics"
          title="Funnel, traffic, dan aktivitas marketplace."
          description="Baca event publik dan dashboard secara ringkas tanpa menyimpan raw IP atau isi brief campaign."
          actions={[
            { href: "/admin/dashboard", label: "Overview" },
            { href: "/admin/reports/export?format=csv", label: "Export CSV", variant: "outline" },
            { href: "/admin/reports/export?format=print", label: "Print / PDF", variant: "secondary" },
          ]}
          highlights={[
            { label: "Total event", value: String(analytics.summary.totalEvents) },
            { label: "Page views", value: String(analytics.summary.totalPageViews) },
            { label: "Conversion", value: formatPercent(analytics.summary.conversionRate) },
          ]}
        />

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <AnalyticsStatCard label="Page views" value={String(analytics.summary.totalPageViews)} />
          <AnalyticsStatCard label="Active users" value={String(analytics.summary.activeVisitors)} />
          <AnalyticsStatCard label="Service view" value={String(serviceViews)} />
          <AnalyticsStatCard label="Creator view" value={String(creatorViews)} />
          <AnalyticsStatCard label="CTA click" value={String(ctaClicks)} />
          <AnalyticsStatCard label="Outbound" value={String(outboundClicks)} />
        </section>

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

        <AdminAnalyticsCharts
          categoryPerformance={analytics.categoryPerformance}
          conversionFunnel={analytics.conversionFunnel}
          deviceBreakdown={analytics.deviceBreakdown}
          eventsByDay={analytics.eventsByDay}
          sourceBreakdown={analytics.sourceBreakdown}
          topPages={analytics.topPages}
        />

        <section className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_420px]">
          <DashboardPanel title="Recent activity" description="25 event terbaru. Gunakan filter untuk fokus.">
            <ActivityToolbar eventType={eventType} query={query} />
            <div className="mt-4 grid gap-2">
              {analytics.recentEvents.length > 0 ? (
                analytics.recentEvents.map((event) => (
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
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={createEventFilterHref({
                        eventType,
                        offset: Math.max(offset - 25, 0),
                        query,
                      })}
                    >
                      Sebelumnya
                    </Link>
                  </Button>
                ) : null}
                {analytics.hasMoreRecentEvents ? (
                  <Button asChild variant="outline" size="sm">
                    <Link
                      href={createEventFilterHref({
                        eventType,
                        offset: offset + 25,
                        query,
                      })}
                    >
                      Berikutnya
                    </Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </DashboardPanel>

          <div className="grid gap-5">
            <DashboardPanel title="Event mix">
              <RankList items={analytics.eventCounts} />
            </DashboardPanel>
            <DashboardPanel title="CTA performance">
              <RankList
                emptyText="Belum ada CTA atau outbound click."
                items={[
                  { label: "CTA click", value: ctaClicks },
                  { label: "Outbound click", value: outboundClicks },
                  { label: "Add to cart", value: getEventCount(analytics.eventCounts, "add_to_cart") },
                  { label: "Order created", value: getEventCount(analytics.eventCounts, "order_created") },
                ].filter((item) => item.value > 0)}
              />
            </DashboardPanel>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <DashboardPanel title="Top pages">
            <RankList items={analytics.topPages} />
          </DashboardPanel>
          <DashboardPanel title="Source / referrer">
            <RankList items={analytics.sourceBreakdown} />
          </DashboardPanel>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <DashboardPanel title="Top layanan">
            <DashboardList
              items={analytics.servicePerformance.map((item) => ({
                title: item.label,
                description: `${item.value} service view`,
                href: `/layanan/${item.label}`,
                meta: "Layanan potensial",
              }))}
              emptyText="Belum ada service_view."
            />
          </DashboardPanel>
          <DashboardPanel title="Top kreator">
            <DashboardList
              items={analytics.creatorPerformance.map((item) => ({
                title: item.label,
                description: `${item.value} creator view`,
                href: `/kreator/${item.label}`,
                meta: "Kreator potensial",
              }))}
              emptyText="Belum ada creator_view."
            />
          </DashboardPanel>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <DashboardPanel title="Growth UMKM">
            <RankList items={analytics.umkmGrowth} />
          </DashboardPanel>
          <DashboardPanel title="Growth kreator">
            <RankList items={analytics.creatorGrowth} />
          </DashboardPanel>
        </section>
      </div>
    </PageContainer>
  );
}

function ActivityToolbar({
  eventType,
  query,
}: {
  eventType: AnalyticsEventType | "all";
  query: string;
}) {
  return (
    <form className="grid gap-3 rounded-2xl border border-border/70 bg-muted/30 p-3 sm:grid-cols-[1fr_190px_auto]">
      <input
        type="search"
        name="q"
        defaultValue={query}
        placeholder="Cari path, referrer, atau user id"
        className="h-10 min-w-0 rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
      />
      <select
        name="event"
        defaultValue={eventType}
        className="h-10 rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
      >
        <option value="all">Semua event</option>
        {getAnalyticsEventTypes().map((item) => (
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

function AnalyticsStatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="dashboard-surface min-w-0 rounded-2xl p-4">
      <p className="truncate text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
    </div>
  );
}

function RankList({
  emptyText = "Belum ada data.",
  items,
}: {
  emptyText?: string;
  items: readonly { label: string; value: number }[];
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
    <div className="grid gap-3">
      {items.slice(0, 8).map((item) => (
        <div key={item.label} className="min-w-0">
          <div className="mb-1 flex items-center justify-between gap-3 text-sm">
            <span className="truncate font-medium text-foreground">{item.label}</span>
            <span className="shrink-0 text-muted-foreground">{item.value}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${Math.max((item.value / maxValue) * 100, 5)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
