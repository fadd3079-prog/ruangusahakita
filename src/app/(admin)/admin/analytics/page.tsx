import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { AdminAnalyticsDashboardView } from "@/features/admin/components/admin-analytics-dashboard";
import {
  createAnalyticsInsights,
  getAdminAnalyticsDashboard,
  parseAnalyticsEventType,
} from "@/features/admin/data/admin-analytics-queries";

export const metadata: Metadata = {
  title: "Analytics Admin — Ruang Usaha Kita",
  description:
    "Analytics marketplace jasa digital Ruang Usaha Kita untuk admin.",
};

type AdminAnalyticsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getNumberParam(value: string | string[] | undefined) {
  const singleValue = getSingleParam(value);
  const numberValue = Number(singleValue);
  return Number.isFinite(numberValue) ? numberValue : undefined;
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

  return (
    <PageContainer>
      <AdminAnalyticsDashboardView
        initialAnalytics={analytics}
        initialEventType={eventType}
        initialInsights={createAnalyticsInsights(analytics)}
        initialOffset={offset}
        initialQuery={query}
      />
    </PageContainer>
  );
}
