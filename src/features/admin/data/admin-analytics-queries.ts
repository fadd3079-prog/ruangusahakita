import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type Tables = Database["public"]["Tables"];
type AnalyticsEventRow = Tables["analytics_events"]["Row"];
export type AnalyticsEventType = Database["public"]["Enums"]["analytics_event_type"];

export type AnalyticsBucket = {
  label: string;
  value: number;
};

export type AnalyticsRecentEvent = {
  browserName: string | null;
  createdAt: string;
  deviceType: string | null;
  eventType: AnalyticsEventType;
  id: string;
  path: string;
  referrer: string | null;
  role: string;
  source: string | null;
  userId: string | null;
};

export type AdminAnalyticsFilters = {
  eventType?: AnalyticsEventType | "all";
  limit?: number;
  offset?: number;
  query?: string;
};

export type AdminAnalyticsDashboard = {
  categoryPerformance: readonly AnalyticsBucket[];
  conversionFunnel: readonly AnalyticsBucket[];
  creatorPerformance: readonly AnalyticsBucket[];
  creatorGrowth: readonly AnalyticsBucket[];
  deviceBreakdown: readonly AnalyticsBucket[];
  eventCounts: readonly AnalyticsBucket[];
  eventsByDay: readonly AnalyticsBucket[];
  hasMoreRecentEvents: boolean;
  recentEvents: readonly AnalyticsRecentEvent[];
  servicePerformance: readonly AnalyticsBucket[];
  sourceBreakdown: readonly AnalyticsBucket[];
  summary: {
    activeVisitors: number;
    conversionRate: number;
    totalEvents: number;
    totalPageViews: number;
  };
  topPages: readonly AnalyticsBucket[];
  umkmGrowth: readonly AnalyticsBucket[];
};

export type AnalyticsInsightTone = "good" | "warning" | "neutral";

export type AnalyticsInsight = {
  detail: string;
  label: string;
  tone: AnalyticsInsightTone;
  value: string;
};

const eventTypes = [
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

const emptyAnalyticsDashboard: AdminAnalyticsDashboard = {
  categoryPerformance: [],
  conversionFunnel: [],
  creatorPerformance: [],
  creatorGrowth: [],
  deviceBreakdown: [],
  eventCounts: [],
  eventsByDay: [],
  hasMoreRecentEvents: false,
  recentEvents: [],
  servicePerformance: [],
  sourceBreakdown: [],
  summary: {
    activeVisitors: 0,
    conversionRate: 0,
    totalEvents: 0,
    totalPageViews: 0,
  },
  topPages: [],
  umkmGrowth: [],
};

function clampLimit(value: number | undefined) {
  if (!value || Number.isNaN(value)) return 25;
  return Math.min(Math.max(value, 10), 100);
}

function toOffset(value: number | undefined) {
  if (!value || Number.isNaN(value)) return 0;
  return Math.max(value, 0);
}

function normalizeQuery(value: string | undefined) {
  const query = value?.trim().replace(/[,%()]/g, " ");
  return query ? query.slice(0, 120) : undefined;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function isAnalyticsEventType(value: string | undefined): value is AnalyticsEventType {
  return eventTypes.some((eventType) => eventType === value);
}

async function getAdminSupabase() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, account_status")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin" || profile.account_status !== "active") {
    return null;
  }

  return supabase;
}

function increment(map: Map<string, number>, key: string | null | undefined, amount = 1) {
  const label = key?.trim() || "Tidak diketahui";
  map.set(label, (map.get(label) ?? 0) + amount);
}

function toBuckets(map: Map<string, number>, limit = 8) {
  return Array.from(map.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((first, second) => second.value - first.value)
    .slice(0, limit);
}

function getDateKey(value: string) {
  return value.slice(0, 10);
}

function createDayBuckets(events: readonly AnalyticsEventRow[]) {
  const map = new Map<string, number>();

  for (const event of events) {
    increment(map, getDateKey(event.created_at));
  }

  return Array.from(map.entries())
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([label, value]) => ({ label, value }));
}

function getPathLabel(path: string) {
  return path.split("?", 1)[0] || "/";
}

function getEntityLabel(path: string) {
  const segments = getPathLabel(path).split("/").filter(Boolean);
  return segments.at(-1) ?? path;
}

function createFunnel(events: readonly AnalyticsEventRow[]) {
  const map = new Map<AnalyticsEventType, number>();

  for (const event of events) {
    map.set(event.event_type, (map.get(event.event_type) ?? 0) + 1);
  }

  return [
    { label: "Katalog", value: map.get("catalog_view") ?? 0 },
    { label: "Detail layanan", value: map.get("service_view") ?? 0 },
    { label: "Tambah ke keranjang", value: map.get("add_to_cart") ?? 0 },
    { label: "Checkout", value: map.get("checkout_start") ?? 0 },
    { label: "Brief", value: map.get("brief_submit") ?? 0 },
    { label: "Order", value: map.get("order_created") ?? 0 },
    { label: "Pembayaran paid", value: map.get("payment_paid") ?? 0 },
  ];
}

function createRecentEvent(event: AnalyticsEventRow): AnalyticsRecentEvent {
  return {
    browserName: event.browser_name,
    createdAt: event.created_at,
    deviceType: event.device_type,
    eventType: event.event_type,
    id: event.id,
    path: event.path,
    referrer: event.referrer,
    role: event.role,
    source: event.source,
    userId: event.user_id,
  };
}

async function getGrowthBuckets(
  supabase: Awaited<ReturnType<typeof getAdminSupabase>>,
  role: "creator" | "umkm",
) {
  if (!supabase) return [];

  const since = new Date();
  since.setDate(since.getDate() - 29);
  const { data, error } = await supabase
    .from("profiles")
    .select("created_at")
    .eq("role", role)
    .gte("created_at", since.toISOString());

  if (error || !data) return [];

  const map = new Map<string, number>();

  for (const profile of data) {
    increment(map, getDateKey(profile.created_at));
  }

  return Array.from(map.entries())
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([label, value]) => ({ label, value }));
}

async function getCategoryPerformance(
  supabase: Awaited<ReturnType<typeof getAdminSupabase>>,
) {
  if (!supabase) return [];

  const { data: categories } = await supabase
    .from("service_categories")
    .select("id, name")
    .limit(200);
  const { data: services } = await supabase
    .from("service_packages")
    .select("category_id")
    .is("deleted_at", null)
    .limit(500);

  const categoryById = new Map((categories ?? []).map((category) => [category.id, category.name]));
  const map = new Map<string, number>();

  for (const service of services ?? []) {
    increment(map, service.category_id ? categoryById.get(service.category_id) : null);
  }

  return toBuckets(map, 6);
}

export function parseAnalyticsEventType(value: string | string[] | undefined) {
  const normalized = Array.isArray(value) ? value[0] : value;
  return normalized === "all" || isAnalyticsEventType(normalized)
    ? normalized
    : "all";
}

export function getAnalyticsEventTypes() {
  return eventTypes;
}

function sumBucketRange(
  items: readonly AnalyticsBucket[],
  start: Date,
  end: Date,
) {
  return items.reduce((total, item) => {
    const date = new Date(`${item.label}T00:00:00`);
    return date >= start && date <= end ? total + item.value : total;
  }, 0);
}

function getEventCount(
  items: readonly AnalyticsBucket[],
  eventType: AnalyticsEventType,
) {
  return items.find((item) => item.label === eventType)?.value ?? 0;
}

function formatTrendPercent(current: number, previous: number) {
  if (previous === 0) {
    return current > 0 ? "+100%" : "0%";
  }

  return `${(((current - previous) / previous) * 100).toFixed(0)}%`;
}

export function createAnalyticsInsights(
  analytics: AdminAnalyticsDashboard,
): readonly AnalyticsInsight[] {
  const today = new Date();
  const last7Start = new Date(today);
  last7Start.setDate(today.getDate() - 6);
  const previous7Start = new Date(today);
  previous7Start.setDate(today.getDate() - 13);
  const previous7End = new Date(today);
  previous7End.setDate(today.getDate() - 7);
  const last7Events = sumBucketRange(analytics.eventsByDay, last7Start, today);
  const previous7Events = sumBucketRange(
    analytics.eventsByDay,
    previous7Start,
    previous7End,
  );
  const trendValue = formatTrendPercent(last7Events, previous7Events);
  const ctaClicks = getEventCount(analytics.eventCounts, "cta_click");
  const orderCreated = getEventCount(analytics.eventCounts, "order_created");
  const latestDay = analytics.eventsByDay.at(-1);
  const previousDays = analytics.eventsByDay.slice(-8, -1);
  const previousAverage =
    previousDays.length > 0
      ? previousDays.reduce((total, item) => total + item.value, 0) / previousDays.length
      : 0;
  const anomalyRatio =
    latestDay && previousAverage > 0 ? latestDay.value / previousAverage : 1;
  const topService = analytics.servicePerformance[0];
  const topCreator = analytics.creatorPerformance[0];
  const insights: AnalyticsInsight[] = [
    {
      detail:
        analytics.summary.totalEvents < 20
          ? "Data masih tipis. Tunggu lebih banyak event sebelum mengambil keputusan besar."
          : `7 hari terakhir ${last7Events} event dibanding ${previous7Events} event sebelumnya.`,
      label: "Prediksi traffic",
      tone:
        analytics.summary.totalEvents < 20
          ? "neutral"
          : last7Events >= previous7Events
            ? "good"
            : "warning",
      value:
        analytics.summary.totalEvents < 20
          ? "Data awal"
          : `${trendValue} tren`,
    },
    {
      detail:
        anomalyRatio >= 2
          ? "Event terbaru melonjak dibanding rata-rata. Cek source/referrer dan halaman teratas."
          : anomalyRatio <= 0.45 && latestDay
            ? "Event terbaru turun tajam. Cek tracking, campaign, dan akses halaman publik."
            : "Belum ada spike atau drop ekstrem pada 7 hari terakhir.",
      label: "Anomaly warning",
      tone: anomalyRatio >= 2 || (anomalyRatio <= 0.45 && latestDay) ? "warning" : "good",
      value:
        anomalyRatio >= 2
          ? "Spike"
          : anomalyRatio <= 0.45 && latestDay
            ? "Drop"
            : "Stabil",
    },
    {
      detail:
        analytics.summary.totalPageViews > 20 && ctaClicks === 0
          ? "Page view sudah ada, tetapi CTA belum bergerak. Perkuat CTA di katalog dan detail layanan."
          : `CTA click ${ctaClicks}, order created ${orderCreated}.`,
      label: "CTA performance",
      tone: analytics.summary.totalPageViews > 20 && ctaClicks === 0 ? "warning" : "neutral",
      value: `${ctaClicks} klik`,
    },
    {
      detail: topService
        ? `${topService.label} paling sering dilihat. Pertimbangkan kurasi posisi dan kualitas paketnya.`
        : "Belum ada service_view yang cukup untuk rekomendasi layanan.",
      label: "Layanan potensial",
      tone: topService ? "good" : "neutral",
      value: topService ? `${topService.value} view` : "Belum cukup",
    },
    {
      detail: topCreator
        ? `${topCreator.label} paling sering dilihat. Cek portofolio dan CTA profil kreator ini.`
        : "Belum ada creator_view yang cukup untuk rekomendasi kreator.",
      label: "Kreator potensial",
      tone: topCreator ? "good" : "neutral",
      value: topCreator ? `${topCreator.value} view` : "Belum cukup",
    },
  ];

  return insights;
}

export async function getAdminAnalyticsDashboard(
  filters: AdminAnalyticsFilters = {},
): Promise<AdminAnalyticsDashboard> {
  const supabase = await getAdminSupabase();

  if (!supabase) return emptyAnalyticsDashboard;

  try {
    const limit = clampLimit(filters.limit);
    const offset = toOffset(filters.offset);
    const query = normalizeQuery(filters.query);
    let recentQuery = supabase
      .from("analytics_events")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit);

    if (filters.eventType && filters.eventType !== "all") {
      recentQuery = recentQuery.eq("event_type", filters.eventType);
    }

    if (query) {
      const searchTerms = [
        `path.ilike.%${query}%`,
        `referrer.ilike.%${query}%`,
      ];

      if (isUuid(query)) {
        searchTerms.push(`user_id.eq.${query}`);
      }

      recentQuery = recentQuery.or(searchTerms.join(","));
    }

    const since = new Date();
    since.setDate(since.getDate() - 29);
    const [eventsResult, recentResult, umkmGrowth, creatorGrowth, categoryPerformance] =
      await Promise.all([
        supabase
          .from("analytics_events")
          .select("*")
          .gte("created_at", since.toISOString())
          .order("created_at", { ascending: false })
          .limit(1000),
        recentQuery,
        getGrowthBuckets(supabase, "umkm"),
        getGrowthBuckets(supabase, "creator"),
        getCategoryPerformance(supabase),
      ]);

    if (eventsResult.error || recentResult.error) {
      return emptyAnalyticsDashboard;
    }

    const events = eventsResult.data ?? [];
    const recentEvents = (recentResult.data ?? []).slice(0, limit).map(createRecentEvent);
    const eventCountMap = new Map<string, number>();
    const deviceMap = new Map<string, number>();
    const sourceMap = new Map<string, number>();
    const pageMap = new Map<string, number>();
    const serviceMap = new Map<string, number>();
    const creatorMap = new Map<string, number>();
    const activeUsers = new Set<string>();

    for (const event of events) {
      increment(eventCountMap, event.event_type);
      increment(deviceMap, event.device_type);
      increment(sourceMap, event.source);
      increment(pageMap, getPathLabel(event.path));

      if (event.user_id) {
        activeUsers.add(event.user_id);
      }

      if (event.event_type === "service_view") {
        increment(serviceMap, getEntityLabel(event.path));
      }

      if (event.event_type === "creator_view") {
        increment(creatorMap, getEntityLabel(event.path));
      }
    }

    const totalPageViews = eventCountMap.get("page_view") ?? 0;
    const orderCreated = eventCountMap.get("order_created") ?? 0;
    const conversionRate = totalPageViews > 0 ? (orderCreated / totalPageViews) * 100 : 0;

    return {
      categoryPerformance,
      conversionFunnel: createFunnel(events),
      creatorPerformance: toBuckets(creatorMap, 6),
      creatorGrowth,
      deviceBreakdown: toBuckets(deviceMap, 5),
      eventCounts: toBuckets(eventCountMap, 10),
      eventsByDay: createDayBuckets(events),
      hasMoreRecentEvents: (recentResult.data ?? []).length > limit,
      recentEvents,
      servicePerformance: toBuckets(serviceMap, 6),
      sourceBreakdown: toBuckets(sourceMap, 6),
      summary: {
        activeVisitors: activeUsers.size,
        conversionRate,
        totalEvents: events.length,
        totalPageViews,
      },
      topPages: toBuckets(pageMap, 8),
      umkmGrowth,
    };
  } catch {
    return emptyAnalyticsDashboard;
  }
}
