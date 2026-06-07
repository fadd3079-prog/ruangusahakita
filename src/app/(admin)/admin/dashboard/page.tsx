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

import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/layout/page-container";
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
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
import {
  dummyAdminDashboardReport,
  dummyComplaints,
  dummyCreators,
  dummyMonthlyReports,
  dummyOrders,
  dummyPayments,
  dummyServicePackages,
  dummyUmkmProfiles,
} from "@/lib/dummy";
import type { DummyComplaintStatus, DummyOrderStatus } from "@/lib/dummy";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard Admin — Ruang Usaha Kita",
  description:
    "Ringkasan pengguna, pesanan, pembayaran, komplain, dan laporan marketplace jasa digital Ruang Usaha Kita.",
};

const activeOrderStatuses: readonly DummyOrderStatus[] = [
  "paid",
  "waiting_creator_confirmation",
  "brief_accepted",
  "in_progress",
  "submitted",
  "revision_requested",
  "revised",
] as const;

const complaintStatusLabels = {
  open: "Terbuka",
  rejected: "Ditolak",
  resolved: "Selesai",
  under_review: "Ditinjau",
} satisfies Record<DummyComplaintStatus, string>;

const complaintStatusClasses = {
  open: "border-sky-200 bg-sky-50 text-sky-700",
  rejected: "border-slate-200 bg-slate-50 text-slate-700",
  resolved: "border-emerald-200 bg-emerald-50 text-emerald-700",
  under_review: "border-amber-200 bg-amber-50 text-amber-800",
} satisfies Record<DummyComplaintStatus, string>;

export default function AdminDashboardPage() {
  const activeOrders = dummyOrders.filter((order) =>
    activeOrderStatuses.includes(order.orderStatus),
  );
  const pendingPayments = dummyPayments.filter(
    (payment) => payment.paymentStatus === "pending",
  );
  const activeComplaints = dummyComplaints.filter(
    (complaint) =>
      complaint.complaintStatus === "open" ||
      complaint.complaintStatus === "under_review",
  );
  const latestReport = dummyMonthlyReports[dummyMonthlyReports.length - 1];
  const paidPayments = dummyPayments.filter(
    (payment) => payment.paymentStatus === "paid",
  );

  const metrics: readonly DashboardMetric[] = [
    {
      label: "Total users",
      value: String(dummyAdminDashboardReport.totalUsers),
      description: "Gabungan akun UMKM, kreator, dan admin dalam dummy data.",
      icon: Users,
    },
    {
      label: "Total UMKM",
      value: String(dummyAdminDashboardReport.totalUmkm),
      description: "Profil UMKM yang tersedia untuk simulasi marketplace.",
      icon: Building2,
    },
    {
      label: "Total kreator",
      value: String(dummyAdminDashboardReport.totalCreators),
      description: "Kreator dan marketer yang dapat tampil di katalog.",
      icon: UserRoundCheck,
    },
    {
      label: "Total pesanan",
      value: String(dummyOrders.length),
      description: "Seluruh status pesanan dummy lintas role.",
      icon: ListChecks,
    },
    {
      label: "Pesanan aktif",
      value: String(activeOrders.length),
      description: "Pesanan yang masih dalam proses layanan digital.",
      icon: LayoutDashboard,
    },
    {
      label: "Pembayaran pending",
      value: String(pendingPayments.length),
      description: "Status pembayaran dummy yang belum paid.",
      icon: CreditCard,
    },
    {
      label: "Komplain aktif",
      value: String(activeComplaints.length),
      description: "Komplain yang memerlukan pemantauan admin.",
      icon: FileWarning,
    },
    {
      label: "Platform revenue",
      value: formatCurrency(dummyAdminDashboardReport.platformRevenue),
      description: "Akumulasi platform fee dan admin fee dari laporan dummy.",
      icon: BarChart3,
    },
  ];

  const recentOrderItems: readonly DashboardListItem[] = [...dummyOrders]
    .sort(
      (first, second) =>
        new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime(),
    )
    .slice(0, 5)
    .map((order) => {
      const umkm = dummyUmkmProfiles.find((item) => item.id === order.umkmId);
      const creator = dummyCreators.find((item) => item.id === order.creatorId);
      const service = dummyServicePackages.find(
        (item) => item.id === order.servicePackageId,
      );

      return {
        title: order.orderNumber,
        description: `${umkm?.businessName ?? "UMKM"} · ${
          creator?.displayName ?? "kreator"
        } · ${service?.title ?? "Paket jasa digital"}`,
        meta: `${formatDate(order.createdAt)} · ${formatCurrency(order.totalAmount)}`,
        href: `/admin/orders/${order.id}`,
        badge: <OrderStatusBadge status={order.orderStatus} />,
      };
    });

  const complaintItems: readonly DashboardListItem[] = activeComplaints.map(
    (complaint) => {
      const order = dummyOrders.find((item) => item.id === complaint.orderId);

      return {
        title: complaint.subject,
        description: complaint.description,
        meta: order
          ? `${order.orderNumber} · dibuat ${formatDate(complaint.createdAt)}`
          : formatDate(complaint.createdAt),
        href: `/admin/complaints`,
        badge: <ComplaintStatusBadge status={complaint.complaintStatus} />,
      };
    },
  );

  const reportItems: readonly DashboardListItem[] = dummyMonthlyReports
    .slice(-4)
    .reverse()
    .map((report) => ({
      title: `Laporan ${report.month}`,
      description: `${report.orders} pesanan · GTV ${formatCurrency(
        report.grossTransactionValue,
      )}`,
      meta: `Platform revenue ${formatCurrency(report.platformRevenue)}`,
      href: "/admin/reports",
      badge: (
        <Badge variant="secondary" className="rounded-lg">
          Report
        </Badge>
      ),
    }));

  return (
    <PageContainer>
      <div className="space-y-6">
        <DashboardHero
          eyebrow="Dashboard Admin"
          title="Pantau kesehatan marketplace jasa digital dari satu tempat."
          description="Ringkasan dummy ini membantu admin melihat pengguna, pesanan, pembayaran, komplain, dan pendapatan platform tanpa menjalankan logika backend nyata."
          actions={[
            { href: "/admin/orders", label: "Pantau Pesanan" },
            { href: "/admin/payments", label: "Pembayaran", variant: "outline" },
            { href: "/admin/reports", label: "Laporan", variant: "secondary" },
          ]}
          highlights={[
            {
              label: "Gross transaction value",
              value: formatCurrency(dummyAdminDashboardReport.grossTransactionValue),
            },
            {
              label: "GTV bulan ini",
              value: formatCurrency(latestReport.grossTransactionValue),
            },
            {
              label: "Paid dummy",
              value: formatCurrency(
                paidPayments.reduce((total, payment) => total + payment.amount, 0),
              ),
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
            <DashboardList items={recentOrderItems} />
          </DashboardPanel>

          <DashboardPanel
            title="Laporan bulanan"
            description="Platform revenue bukan seluruh nilai transaksi."
            action={{ href: "/admin/reports", label: "Lihat laporan" }}
          >
            <DashboardList items={reportItems} />
          </DashboardPanel>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <DashboardPanel
            title="Monitoring pembayaran"
            description="Provider masih dummy; status pembayaran tetap berdiri sendiri."
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
                  {dummyPayments.slice(0, 5).map((payment) => {
                    const order = dummyOrders.find(
                      (item) => item.id === payment.orderId,
                    );

                    return (
                      <TableRow key={payment.id}>
                        <TableCell>
                          <Link
                            href="/admin/payments"
                            className="font-medium text-foreground hover:text-primary"
                          >
                            {payment.paymentNumber}
                          </Link>
                        </TableCell>
                        <TableCell>{order?.orderNumber ?? "-"}</TableCell>
                        <TableCell className="capitalize">
                          {payment.paymentMethod.replace("_", " ")}
                        </TableCell>
                        <TableCell>
                          <PaymentStatusBadge status={payment.paymentStatus} />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(payment.amount)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </DashboardPanel>

          <DashboardPanel
            title="Komplain aktif"
            description="Konteks awal untuk pemantauan admin."
            action={{ href: "/admin/complaints", label: "Buka komplain" }}
          >
            <DashboardList
              items={complaintItems}
              emptyText="Tidak ada komplain aktif dalam dummy data."
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
                description: "Review invoice dan status pembayaran dummy.",
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

function ComplaintStatusBadge({ status }: { status: DummyComplaintStatus }) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-lg", complaintStatusClasses[status])}
    >
      {complaintStatusLabels[status]}
    </Badge>
  );
}
