import Link from "next/link";
import type { Metadata } from "next";
import {
  BarChart3,
  Building2,
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
  type DashboardPaymentStatus,
} from "@/features/dashboard/data/dashboard-queries";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
import type { DummyPaymentStatus } from "@/lib/dummy";
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

function getPaymentBadgeStatus(status: DashboardPaymentStatus): DummyPaymentStatus {
  return status === "partially_refunded" ? "refunded" : status;
}

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
      <div className="space-y-6">
        <DashboardHero
          eyebrow="Dashboard Admin"
          title="Pantau kesehatan marketplace jasa digital dari satu tempat."
          description="Ringkasan read-only ini membantu admin melihat pengguna, pesanan, pembayaran, komplain, dan pendapatan platform tanpa menjalankan mutasi backend."
          actions={[
            { href: "/admin/orders", label: "Pantau Pesanan" },
            { href: "/admin/payments", label: "Pembayaran", variant: "outline" },
            { href: "/admin/reports", label: "Laporan", variant: "secondary" },
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
              label: "Layanan aktif",
              value: String(dashboard.serviceStats.activeServices),
            },
          ]}
        />

        <DashboardMetricGrid metrics={metrics} />

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
                            status={getPaymentBadgeStatus(payment.status)}
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
          title="Aksi cepat admin"
          description="Shortcut ke area monitoring utama."
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
