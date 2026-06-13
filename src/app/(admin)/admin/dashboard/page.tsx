import Link from "next/link";
import type { Metadata } from "next";
import {
  BarChart3,
  Building2,
  CircleAlert,
  CreditCard,
  FileWarning,
  LayoutDashboard,
  ListChecks,
  ReceiptText,
  Settings,
  UserRoundCheck,
  Users,
} from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
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
    "Overview admin untuk marketplace jasa digital Ruang Usaha Kita.",
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

function getPaymentMethodLabel(value: string | null) {
  if (!value) {
    return "Belum dipilih";
  }

  return value.replace("_", " ");
}

export default async function AdminDashboardPage() {
  const dashboard = await getAdminDashboardOverview();

  const metrics: readonly DashboardMetric[] = [
    {
      label: "Users",
      value: String(dashboard.userStats.totalUsers),
      icon: Users,
    },
    {
      label: "UMKM",
      value: String(dashboard.userStats.totalUmkm),
      icon: Building2,
    },
    {
      label: "Kreator",
      value: String(dashboard.userStats.totalCreators),
      icon: UserRoundCheck,
    },
    {
      label: "Layanan",
      value: String(dashboard.serviceStats.totalServices),
      icon: LayoutDashboard,
    },
    {
      label: "Aktif",
      value: String(dashboard.serviceStats.activeServices),
      icon: LayoutDashboard,
    },
    {
      label: "Pesanan",
      value: String(dashboard.orderStats.totalOrders),
      icon: ListChecks,
    },
    {
      label: "Pesanan aktif",
      value: String(dashboard.orderStats.activeOrders),
      icon: ListChecks,
    },
    {
      label: "Pending bayar",
      value: String(dashboard.paymentStats.pending),
      icon: CreditCard,
    },
    {
      label: "Paid",
      value: formatCurrency(dashboard.paymentStats.totalPaidAmount),
      icon: CreditCard,
    },
    {
      label: "Komplain",
      value: String(dashboard.activeComplaints),
      icon: FileWarning,
    },
    {
      label: "Platform revenue",
      value: formatCurrency(dashboard.orderStats.platformRevenue),
      icon: BarChart3,
    },
    {
      label: "GTV",
      value: formatCurrency(dashboard.orderStats.grossTransactionValue),
      icon: BarChart3,
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
        ? `Pesanan ${complaint.orderNumber}`
        : "Konteks pesanan belum tersedia.",
      meta: formatDate(complaint.createdAt),
      href: "/admin/complaints",
      badge: <ComplaintStatusBadge status={complaint.status} />,
    }));

  const reportItems: readonly DashboardListItem[] = [
    {
      title: "Gross transaction value",
      description: formatCurrency(dashboard.orderStats.grossTransactionValue),
      href: "/admin/reports",
      badge: <Badge variant="secondary">GTV</Badge>,
    },
    {
      title: "Platform revenue",
      description: formatCurrency(dashboard.orderStats.platformRevenue),
      href: "/admin/reports",
      badge: <Badge variant="secondary">Revenue</Badge>,
    },
    {
      title: "Analytics",
      description: "Buka halaman analytics lengkap.",
      href: "/admin/analytics",
      badge: <Badge variant="secondary">Full</Badge>,
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
                ? "Mode demo aktif"
                : dashboard.dataStatus === "partial"
                  ? "Sebagian data belum tersedia"
                  : "Data belum tersedia"}
            </AlertTitle>
            <AlertDescription className="text-amber-900/80">
              {dashboard.warnings.join(" ")}
            </AlertDescription>
          </Alert>
        ) : null}

        <DashboardHero
          eyebrow="Super Admin"
          title="Overview marketplace jasa digital."
          description="Ringkasan operasional, pembayaran, pesanan, dan laporan utama."
          actions={[
            { href: "/admin/orders", label: "Pesanan" },
            { href: "/admin/payments", label: "Pembayaran", variant: "outline" },
            { href: "/admin/analytics", label: "Analytics", variant: "secondary" },
          ]}
          highlights={[
            {
              label: "GTV",
              value: formatCurrency(dashboard.orderStats.grossTransactionValue),
            },
            {
              label: "Paid",
              value: formatCurrency(dashboard.paymentStats.totalPaidAmount),
            },
            {
              label: "Komplain",
              value: String(dashboard.activeComplaints),
            },
          ]}
        />

        <DashboardMetricGrid
          metrics={metrics}
          showDescriptions={false}
          showIcons={false}
        />

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
          <DashboardPanel
            title="Pesanan terbaru"
            action={{ href: "/admin/orders", label: "Buka" }}
          >
            <DashboardList
              items={recentOrderItems}
              emptyText="Belum ada pesanan."
            />
          </DashboardPanel>

          <DashboardPanel
            title="Ringkasan laporan"
            action={{ href: "/admin/reports", label: "Laporan" }}
          >
            <DashboardList items={reportItems} />
          </DashboardPanel>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
          <DashboardPanel
            title="Pembayaran terbaru"
            action={{ href: "/admin/payments", label: "Buka" }}
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
                          <PaymentStatusBadge status={payment.status} />
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
                        Belum ada pembayaran.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </DashboardPanel>

          <DashboardPanel
            title="Komplain terbaru"
            action={{ href: "/admin/complaints", label: "Buka" }}
          >
            <DashboardList
              items={complaintItems}
              emptyText="Tidak ada komplain aktif."
            />
          </DashboardPanel>
        </section>

        <DashboardPanel title="Aksi cepat">
          <DashboardQuickActions
            actions={[
              {
                href: "/admin/analytics",
                label: "Analytics",
                description: "Buka analytics lengkap.",
                icon: BarChart3,
              },
              {
                href: "/admin/orders",
                label: "Pesanan",
                description: "Pantau status pesanan.",
                icon: ListChecks,
              },
              {
                href: "/admin/payments",
                label: "Pembayaran",
                description: "Review invoice dan status.",
                icon: ReceiptText,
              },
              {
                href: "/admin/complaints",
                label: "Komplain",
                description: "Tinjau komplain aktif.",
                icon: FileWarning,
              },
              {
                href: "/admin/users",
                label: "Users",
                description: "Pantau akun platform.",
                icon: Users,
              },
              {
                href: "/admin/settings",
                label: "Pengaturan",
                description: "Konfigurasi platform.",
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
