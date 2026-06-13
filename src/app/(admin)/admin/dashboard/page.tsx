import Link from "next/link";
import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowDownToLine,
  BarChart3,
  Building2,
  CircleAlert,
  CreditCard,
  Eye,
  FileWarning,
  LayoutDashboard,
  ListChecks,
  MonitorSmartphone,
  MousePointerClick,
  ReceiptText,
  Settings,
  Target,
  UserRoundCheck,
  Users,
} from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AdminAnalyticsCharts } from "@/features/admin/components/admin-analytics-charts";
import {
  getAdminAnalyticsDashboard,
  getAnalyticsEventTypes,
  parseAnalyticsEventType,
  type AnalyticsEventType,
} from "@/features/admin/data/admin-analytics-queries";
import {
  DashboardHero,
  DashboardList,
  DashboardMetricGrid,
  DashboardPanel,
  DashboardQuickActions,
  type DashboardListItem,
  type DashboardMetric,
} from "@/features/dashboard/components/dashboard-overview";
import {
  getAdminDashboardOverview,
  type DashboardComplaintStatus,
} from "@/features/dashboard/data/dashboard-queries";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard Admin — Ruang Usaha Kita",
  description:
    "Ringkasan pengguna, pesanan, pembayaran, komplain, dan laporan marketplace jasa digital Ruang Usaha Kita.",
};

const complaintStatusLabels = {
  open: "Terbuka",
  rejected: "Ditolak",
  resolved: "Selesai",
  under_review: "Ditinjau",
  waiting_creator: "Menunggu Kreator",
  waiting_umkm: "Menunggu UMKM",
} satisfies Record<DashboardComplaintStatus, string>;

const complaintStatusClasses = {
  open: "border-sky-200 bg-sky-50 text-sky-700",
  rejected: "border-slate-200 bg-slate-50 text-slate-700",
  resolved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  under_review: "border-amber-200 bg-amber-50 text-amber-800",
  waiting_creator: "border-cyan-200 bg-cyan-50 text-cyan-700",
  waiting_umkm: "border-indigo-200 bg-indigo-50 text-indigo-700",
} satisfies Record<DashboardComplaintStatus, string>;

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

type AdminDashboardPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getPaymentMethodLabel(value: string | null) {
  if (!value) {
    return "Belum dipilih";
  }

  return value.replace("_", " ");
}

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
  return search ? `/admin/dashboard?${search}` : "/admin/dashboard";
}

export default async function AdminDashboardPage({
  searchParams,
}: AdminDashboardPageProps) {
  const params = await searchParams;
  const eventType = parseAnalyticsEventType(params.event);
  const query = getSingleParam(params.q)?.trim() ?? "";
  const offset = getNumberParam(params.offset) ?? 0;
  const [dashboard, analytics] = await Promise.all([
    getAdminDashboardOverview(),
    getAdminAnalyticsDashboard({
      eventType,
      limit: 25,
      offset,
      query,
    }),
  ]);

  const metrics: readonly DashboardMetric[] = [
    {
      label: "Total users",
      value: String(dashboard.userStats.totalUsers),
      description: "Gabungan akun UMKM, kreator, dan admin dari database.",
      icon: Users,
    },
    {
      label: "Total UMKM",
      value: String(dashboard.userStats.totalUmkm),
      description: "Profil UMKM yang dapat dipantau admin.",
      icon: Building2,
    },
    {
      label: "Total kreator",
      value: String(dashboard.userStats.totalCreators),
      description: "Kreator dan marketer yang terdaftar di platform.",
      icon: UserRoundCheck,
    },
    {
      label: "Total pesanan",
      value: String(dashboard.orderStats.totalOrders),
      description: "Seluruh status pesanan yang terbaca lewat RLS admin.",
      icon: ListChecks,
    },
    {
      label: "Pesanan aktif",
      value: String(dashboard.orderStats.activeOrders),
      description: "Pesanan yang masih dalam proses layanan digital.",
      icon: LayoutDashboard,
    },
    {
      label: "Pembayaran pending",
      value: String(dashboard.paymentStats.pending),
      description: "Status pembayaran yang belum paid.",
      icon: CreditCard,
    },
    {
      label: "Komplain aktif",
      value: String(dashboard.activeComplaints),
      description: "Komplain yang memerlukan pemantauan admin.",
      icon: FileWarning,
    },
    {
      label: "Platform revenue",
      value: formatCurrency(dashboard.orderStats.platformRevenue),
      description: "Akumulasi platform fee dan admin fee yang terbaca.",
      icon: BarChart3,
    },
    {
      label: "Page views",
      value: String(analytics.summary.totalPageViews),
      description: "Event page_view dari analytics internal 30 hari terakhir.",
      icon: Eye,
    },
    {
      label: "Conversion",
      value: formatPercent(analytics.summary.conversionRate),
      description: "Order created dibanding total page view.",
      icon: Target,
    },
  ];

  const recentOrderItems: readonly DashboardListItem[] =
    dashboard.recentOrders.map((order) => ({
      title: order.orderNumber,
      description: `${order.counterpartName} · ${order.serviceTitle}`,
      meta: `${formatDate(order.createdAt)} · ${formatCurrency(order.totalAmount)}`,
      href: `/admin/orders/${order.id}`,
      badge: <OrderStatusBadge status={order.orderStatus} />,
    }));

  const complaintItems: readonly DashboardListItem[] =
    dashboard.recentComplaints.map((complaint) => ({
      title: complaint.subject,
      description: complaint.orderNumber
        ? `Terkait pesanan ${complaint.orderNumber}`
        : "Konteks pesanan belum tersedia.",
      meta: formatDate(complaint.createdAt),
      href: "/admin/complaints",
      badge: <ComplaintStatusBadge status={complaint.status} />,
    }));

  const reportItems: readonly DashboardListItem[] = [
    {
      title: "Gross transaction value",
      description: "Total nilai transaksi UMKM-kreator yang terbaca dari order.",
      meta: formatCurrency(dashboard.orderStats.grossTransactionValue),
      href: "/admin/reports",
      badge: (
        <Badge variant="secondary" className="rounded-lg">
          GTV
        </Badge>
      ),
    },
    {
      title: "Total paid",
      description: "Akumulasi pembayaran dengan status paid.",
      meta: formatCurrency(dashboard.paymentStats.totalPaidAmount),
      href: "/admin/payments",
      badge: (
        <Badge variant="secondary" className="rounded-lg">
          Paid
        </Badge>
      ),
    },
    {
      title: "Layanan aktif",
      description: "Paket jasa aktif yang masih tampil dalam katalog.",
      meta: `${dashboard.serviceStats.activeServices} dari ${dashboard.serviceStats.totalServices} layanan`,
      href: "/admin/services",
      badge: (
        <Badge variant="secondary" className="rounded-lg">
          Layanan
        </Badge>
      ),
    },
  ];

  return (
    <PageContainer>
      <div className="space-y-5 pb-8">
        {dashboard.dataStatus !== "available" ? (
          <Alert className="border-amber-200 bg-amber-50/80 text-amber-950">
            <CircleAlert aria-hidden="true" />
            <AlertTitle>
              {dashboard.dataStatus === "demo"
                ? "Dashboard berjalan dalam mode demo"
                : dashboard.dataStatus === "partial"
                  ? "Sebagian data admin belum tersedia"
                  : "Data admin belum tersedia"}
            </AlertTitle>
            <AlertDescription className="text-amber-900/80">
              {dashboard.warnings.join(" ")}
            </AlertDescription>
          </Alert>
        ) : null}

        <DashboardHero
          eyebrow="Dashboard Admin"
          title="Command center marketplace jasa digital."
          description="Pantau pertumbuhan pengguna, layanan, pembayaran, status pesanan, komplain, funnel, dan aktivitas katalog dalam satu ruang kerja ringkas."
          actions={[
            { href: "/admin/orders", label: "Pantau Pesanan" },
            { href: "/admin/payments", label: "Pembayaran", variant: "outline" },
            { href: "/admin/reports/export?format=csv", label: "Export CSV", variant: "secondary" },
          ]}
          highlights={[
            {
              label: "Gross transaction value",
              value: formatCurrency(dashboard.orderStats.grossTransactionValue),
            },
            {
              label: "Pembayaran paid",
              value: formatCurrency(dashboard.paymentStats.totalPaidAmount),
            },
            {
              label: "Event 30 hari",
              value: String(analytics.summary.totalEvents),
            },
          ]}
        />

        <DashboardMetricGrid metrics={metrics} />

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <CompactInsightCard
            icon={Activity}
            label="Activity stream"
            value={String(analytics.summary.totalEvents)}
            meta="30 hari terakhir"
          />
          <CompactInsightCard
            icon={MonitorSmartphone}
            label="Active users"
            value={String(analytics.summary.activeVisitors)}
            meta="User login unik"
          />
          <CompactInsightCard
            icon={MousePointerClick}
            label="CTA & outbound"
            value={String(
              (analytics.eventCounts.find((item) => item.label === "cta_click")?.value ?? 0) +
                (analytics.eventCounts.find((item) => item.label === "outbound_click")?.value ?? 0),
            )}
            meta="Klik penting"
          />
          <CompactInsightCard
            icon={ArrowDownToLine}
            label="Export laporan"
            value="CSV/HTML"
            meta="Spreadsheet dan print"
            href="/admin/reports"
          />
        </section>

        <AdminAnalyticsCharts
          categoryPerformance={analytics.categoryPerformance}
          conversionFunnel={analytics.conversionFunnel}
          deviceBreakdown={analytics.deviceBreakdown}
          eventsByDay={analytics.eventsByDay}
          sourceBreakdown={analytics.sourceBreakdown}
          topPages={analytics.topPages}
        />

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
          <DashboardPanel
            title="Recent activity"
            description="25 event terbaru dengan filter ringkas."
          >
            <ActivityToolbar
              eventType={eventType}
              query={query}
            />
            <div className="mt-4 overflow-hidden rounded-2xl border border-border/70 bg-background/80">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Waktu</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analytics.recentEvents.length > 0 ? (
                    analytics.recentEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <Badge variant="outline" className="rounded-lg">
                            {eventLabels[event.eventType]}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[260px] truncate font-medium">
                          {event.path}
                        </TableCell>
                        <TableCell className="capitalize">{event.role}</TableCell>
                        <TableCell>
                          {[event.deviceType, event.browserName]
                            .filter(Boolean)
                            .join(" · ") || "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDate(event.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-24 text-center text-sm text-muted-foreground"
                      >
                        Belum ada event analytics yang cocok.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                Data lama tetap tersimpan di database. Tampilan ini dibatasi agar dashboard tetap ringan.
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
                      Lihat berikutnya
                    </Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </DashboardPanel>

          <DashboardPanel
            title="Top kreator & layanan"
            description="Diambil dari event detail publik."
          >
            <DashboardList
              items={[
                ...analytics.servicePerformance.slice(0, 4).map((item) => ({
                  title: item.label,
                  description: "Layanan paling sering dilihat.",
                  meta: `${item.value} service view`,
                  href: `/layanan/${item.label}`,
                  badge: <Badge variant="secondary">Layanan</Badge>,
                })),
                ...analytics.creatorPerformance.slice(0, 4).map((item) => ({
                  title: item.label,
                  description: "Profil kreator paling sering dilihat.",
                  meta: `${item.value} creator view`,
                  href: `/kreator/${item.label}`,
                  badge: <Badge variant="secondary">Kreator</Badge>,
                })),
              ]}
              emptyText="Belum ada data service_view atau creator_view."
            />
          </DashboardPanel>
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <DashboardPanel
            title="Growth UMKM"
            description="Akun UMKM baru berdasarkan tanggal pembuatan profil."
          >
            <GrowthList
              emptyText="Belum ada pertumbuhan UMKM yang terbaca."
              items={analytics.umkmGrowth}
            />
          </DashboardPanel>
          <DashboardPanel
            title="Growth kreator"
            description="Akun kreator baru berdasarkan tanggal pembuatan profil."
          >
            <GrowthList
              emptyText="Belum ada pertumbuhan kreator yang terbaca."
              items={analytics.creatorGrowth}
            />
          </DashboardPanel>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
          <DashboardPanel
            title="Pesanan terbaru"
            description="Pantau status pesanan tanpa mencampurnya dengan status pembayaran."
            action={{ href: "/admin/orders", label: "Buka pesanan" }}
          >
            <DashboardList
              items={recentOrderItems}
              emptyText="Belum ada pesanan yang terbaca untuk admin."
            />
          </DashboardPanel>

          <DashboardPanel
            title="Ringkasan laporan"
            description="Platform revenue bukan seluruh nilai transaksi."
            action={{ href: "/admin/reports", label: "Lihat laporan" }}
          >
            <DashboardList items={reportItems} />
          </DashboardPanel>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <DashboardPanel
            title="Monitoring pembayaran"
            description="Status pembayaran tetap berdiri sendiri dari status pesanan."
            action={{ href: "/admin/payments", label: "Kelola pembayaran" }}
          >
            <div className="overflow-hidden rounded-2xl border border-border/70 bg-background/80">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Metode</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboard.recentPayments.length > 0 ? (
                    dashboard.recentPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <Link
                            href="/admin/payments"
                            className="font-medium text-foreground hover:text-primary"
                          >
                            {payment.paymentNumber}
                          </Link>
                        </TableCell>
                        <TableCell>{payment.orderNumber ?? "-"}</TableCell>
                        <TableCell className="capitalize">
                          {getPaymentMethodLabel(payment.method)}
                        </TableCell>
                        <TableCell>
                          <PaymentStatusBadge
                            status={payment.status}
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(payment.amount)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="h-24 text-center text-sm text-muted-foreground"
                      >
                        Belum ada pembayaran yang terbaca untuk admin.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </DashboardPanel>

          <DashboardPanel
            title="Komplain terbaru"
            description="Konteks awal untuk pemantauan admin."
            action={{ href: "/admin/complaints", label: "Buka komplain" }}
          >
            <DashboardList
              items={complaintItems}
              emptyText="Tidak ada komplain yang terbaca saat ini."
            />
          </DashboardPanel>
        </section>

        <DashboardPanel
          title="Aksi cepat"
          description="Shortcut ke area operasional utama."
        >
          <DashboardQuickActions
            actions={[
              {
                href: "/admin/orders",
                label: "Pesanan",
                description: "Pantau status pesanan lintas UMKM dan kreator.",
                icon: ListChecks,
              },
              {
                href: "/admin/payments",
                label: "Pembayaran",
                description: "Review invoice dan status pembayaran.",
                icon: ReceiptText,
              },
              {
                href: "/admin/complaints",
                label: "Komplain",
                description: "Tinjau komplain yang membutuhkan mediasi.",
                icon: FileWarning,
              },
              {
                href: "/admin/reports",
                label: "Laporan",
                description: "Lihat gross transaction value dan platform revenue.",
                icon: BarChart3,
              },
              {
                href: "/admin/users",
                label: "Users",
                description: "Pantau akun UMKM, kreator, dan admin.",
                icon: Users,
              },
              {
                href: "/admin/settings",
                label: "Pengaturan",
                description: "Ruang konfigurasi platform pada tahap berikutnya.",
                icon: Settings,
              },
            ]}
          />
        </DashboardPanel>
      </div>
    </PageContainer>
  );
}

function ComplaintStatusBadge({ status }: { status: DashboardComplaintStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-lg", complaintStatusClasses[status])}
    >
      {complaintStatusLabels[status]}
    </Badge>
  );
}

function CompactInsightCard({
  href,
  icon: Icon,
  label,
  meta,
  value,
}: {
  href?: string;
  icon: LucideIcon;
  label: string;
  meta: string;
  value: string;
}) {
  const content = (
    <div className="dashboard-surface flex min-w-0 items-center gap-3 rounded-2xl p-4">
      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 truncate text-xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
        <p className="truncate text-xs text-muted-foreground">{meta}</p>
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block min-w-0">
      {content}
    </Link>
  ) : (
    content
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
    <form className="grid gap-3 rounded-2xl border border-border/70 bg-muted/30 p-3 sm:grid-cols-[1fr_180px_auto]">
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

function GrowthList({
  emptyText,
  items,
}: {
  emptyText: string;
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
      {items.slice(-8).map((item) => (
        <div key={item.label} className="min-w-0">
          <div className="mb-1 flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-foreground">{formatDate(item.label)}</span>
            <span className="text-muted-foreground">{item.value} akun</span>
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
