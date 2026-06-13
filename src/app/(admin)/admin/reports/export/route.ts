import { NextResponse, type NextRequest } from "next/server";

import {
  createAnalyticsInsights,
  getAdminAnalyticsDashboard,
  type AnalyticsBucket,
  type AnalyticsInsight,
  type AnalyticsRecentEvent,
} from "@/features/admin/data/admin-analytics-queries";
import { getAdminReportMetrics } from "@/features/admin/data/admin-management-queries";
import { formatCurrency } from "@/lib/formatters/currency";
import { createClient } from "@/lib/supabase/server";

async function isAdminRequest() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, account_status")
    .eq("id", user.id)
    .maybeSingle();

  return profile?.role === "admin" && profile.account_status === "active";
}

function csvCell(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function createCsv(rows: readonly (readonly (string | number)[])[]) {
  return rows.map((row) => row.map(csvCell).join(",")).join("\n");
}

function escapeHtml(value: string | number) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function createHtmlReport({
  analytics,
  insights,
  report,
}: {
  analytics: Awaited<ReturnType<typeof getAdminAnalyticsDashboard>>;
  insights: readonly AnalyticsInsight[];
  report: Awaited<ReturnType<typeof getAdminReportMetrics>>;
}) {
  const rows = [
    ["Gross Transaction Value", formatCurrency(report.grossTransactionValue)],
    ["Platform Revenue", formatCurrency(report.platformRevenue)],
    ["Pembayaran Paid", formatCurrency(report.paidAmount)],
    ["Total Pesanan", String(report.totalOrders)],
    ["Event 30 Hari", String(analytics.summary.totalEvents)],
    ["Page Views", String(analytics.summary.totalPageViews)],
    ["Conversion", `${analytics.summary.conversionRate.toFixed(1)}%`],
  ];

  return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Laporan Admin Ruang Usaha Kita</title>
<style>
body{font-family:Inter,Arial,sans-serif;margin:40px;color:#0C2949;background:#fff}
.shell{max-width:960px;margin:0 auto}
h1{font-size:28px;margin:0 0 8px}
p{color:#475569;margin:0 0 24px}
table{width:100%;border-collapse:collapse;margin-top:16px}
th,td{border-bottom:1px solid #e2e8f0;padding:12px;text-align:left;font-size:14px}
th{background:#f8fafc;color:#114955}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:24px 0}
.card{border:1px solid #e2e8f0;border-radius:16px;padding:16px}
.value{font-size:22px;font-weight:700;margin-top:6px}
@media print{body{margin:18px}.no-print{display:none}}
</style>
</head>
<body>
<main class="shell">
<button class="no-print" onclick="window.print()">Cetak / simpan PDF</button>
<h1>Laporan Admin Ruang Usaha Kita</h1>
<p>Ringkasan marketplace jasa digital, analytics, dan revenue platform.</p>
<section class="grid">
${rows
  .slice(0, 6)
  .map((row) => `<div class="card"><div>${escapeHtml(row[0])}</div><div class="value">${escapeHtml(row[1])}</div></div>`)
  .join("")}
</section>
<h2>Ringkasan</h2>
<table>
<tbody>
${rows.map((row) => `<tr><th>${escapeHtml(row[0])}</th><td>${escapeHtml(row[1])}</td></tr>`).join("")}
</tbody>
</table>
${createHtmlSection("Funnel", analytics.conversionFunnel)}
${createHtmlSection("Device", analytics.deviceBreakdown)}
${createHtmlSection("Source / Referrer", analytics.sourceBreakdown)}
<h2>Top Pages</h2>
<table>
<thead><tr><th>Path</th><th>Event</th></tr></thead>
<tbody>
${analytics.topPages.map((item) => `<tr><td>${escapeHtml(item.label)}</td><td>${escapeHtml(item.value)}</td></tr>`).join("")}
</tbody>
</table>
${createHtmlSection("Top Layanan", analytics.servicePerformance)}
${createHtmlSection("Top Kreator", analytics.creatorPerformance)}
${createHtmlSection("Order Trend", analytics.orderTrend)}
${createHtmlSection("Revenue Trend", analytics.revenueTrend)}
<h2>Insight</h2>
<table>
<thead><tr><th>Insight</th><th>Nilai</th><th>Detail</th></tr></thead>
<tbody>
${insights.map((item) => `<tr><td>${escapeHtml(item.label)}</td><td>${escapeHtml(item.value)}</td><td>${escapeHtml(item.detail)}</td></tr>`).join("")}
</tbody>
</table>
<h2>Recent Activity</h2>
<table>
<thead><tr><th>Event</th><th>Role</th><th>Path</th><th>Source</th><th>Device</th><th>Waktu</th></tr></thead>
<tbody>
${analytics.recentEvents.map(createHtmlEventRow).join("")}
</tbody>
</table>
</main>
</body>
</html>`;
}

function createHtmlSection(title: string, items: readonly AnalyticsBucket[]) {
  return `<h2>${escapeHtml(title)}</h2>
<table>
<thead><tr><th>Label</th><th>Value</th></tr></thead>
<tbody>
${items.map((item) => `<tr><td>${escapeHtml(item.label)}</td><td>${escapeHtml(item.value)}</td></tr>`).join("")}
</tbody>
</table>`;
}

function createHtmlEventRow(event: AnalyticsRecentEvent) {
  return `<tr><td>${escapeHtml(event.eventType)}</td><td>${escapeHtml(event.role)}</td><td>${escapeHtml(event.path)}</td><td>${escapeHtml(event.source ?? "direct")}</td><td>${escapeHtml([event.deviceType, event.browserName].filter(Boolean).join(" / ") || "-")}</td><td>${escapeHtml(event.createdAt)}</td></tr>`;
}

function sectionRows(
  title: string,
  items: readonly AnalyticsBucket[],
): readonly (readonly (string | number)[])[] {
  return [
    [],
    [title, "Value"],
    ...items.map((item) => [item.label, item.value] as const),
  ];
}

export async function GET(request: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const format = request.nextUrl.searchParams.get("format") ?? "csv";
  const [report, analytics] = await Promise.all([
    getAdminReportMetrics(),
    getAdminAnalyticsDashboard({ limit: 25 }),
  ]);
  const insights = createAnalyticsInsights(analytics);

  if (format === "html" || format === "print") {
    return new NextResponse(createHtmlReport({ analytics, insights, report }), {
      headers: {
        "content-type": "text/html; charset=utf-8",
      },
    });
  }

  const rows = [
    ["Metric", "Value"],
    ["Gross Transaction Value", report.grossTransactionValue],
    ["Platform Revenue", report.platformRevenue],
    ["Pembayaran Paid", report.paidAmount],
    ["Total Pesanan", report.totalOrders],
    ["Pesanan Selesai", report.completedOrders],
    ["Komplain Aktif", report.activeComplaints],
    ["Event 30 Hari", analytics.summary.totalEvents],
    ["Page Views", analytics.summary.totalPageViews],
    ["Conversion", `${analytics.summary.conversionRate.toFixed(1)}%`],
    ...sectionRows("Funnel", analytics.conversionFunnel),
    ...sectionRows("Device", analytics.deviceBreakdown),
    ...sectionRows("Source / Referrer", analytics.sourceBreakdown),
    ...sectionRows("Top Pages", analytics.topPages),
    ...sectionRows("Top Layanan", analytics.servicePerformance),
    ...sectionRows("Top Kreator", analytics.creatorPerformance),
    ...sectionRows("Order Trend", analytics.orderTrend),
    ...sectionRows("Completed Order Trend", analytics.completedOrderTrend),
    ...sectionRows("Revenue Trend", analytics.revenueTrend),
    ...sectionRows("Event Type", analytics.eventCounts),
    [],
    ["Insight", "Value", "Detail"],
    ...insights.map((item) => [item.label, item.value, item.detail] as const),
    [],
    ["Recent Event", "Role", "Path", "Source", "Device", "Browser", "Created At"],
    ...analytics.recentEvents.map((event) => [
      event.eventType,
      event.role,
      event.path,
      event.source ?? "direct",
      event.deviceType ?? "-",
      event.browserName ?? "-",
      event.createdAt,
    ] as const),
  ];

  return new NextResponse(createCsv(rows), {
    headers: {
      "content-disposition": `attachment; filename="ruang-usaha-kita-admin-report.csv"`,
      "content-type": "text/csv; charset=utf-8",
    },
  });
}
