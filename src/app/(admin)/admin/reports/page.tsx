import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,
  ArrowDownToLine,
  BarChart3,
  CalendarDays,
  FolderCheck,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import {
  DashboardMetricGrid,
  type DashboardMetric,
} from "@/features/dashboard/components/dashboard-overview";
import { getAdminReportMetrics } from "@/features/admin/data/admin-management-queries";
import { formatCurrency } from "@/lib/formatters/currency";

export const metadata: Metadata = {
  title: "Laporan & Metrik — Ruang Usaha Kita",
  description: "Laporan performa platform dan pendapatan dari data real.",
};

export default async function AdminReportsPage() {
  const report = await getAdminReportMetrics();
  const metrics: DashboardMetric[] = [
    {
      description: "Total nilai order yang tercatat di database.",
      icon: TrendingUp,
      label: "Gross Transaction Value",
      value: formatCurrency(report.grossTransactionValue),
    },
    {
      description: "Estimasi pendapatan platform dari admin fee dan platform fee.",
      icon: WalletCards,
      label: "Platform Revenue",
      value: formatCurrency(report.platformRevenue),
    },
    {
      description: "Jumlah pesanan dengan status completed.",
      icon: FolderCheck,
      label: "Pesanan selesai",
      value: String(report.completedOrders),
    },
    {
      description: "Total pembayaran dengan status paid.",
      icon: BarChart3,
      label: "Dana masuk",
      value: formatCurrency(report.paidAmount),
    },
  ];

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <div className="border-b border-border pb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">
                Laporan Operasional
              </h1>
              <p className="mt-2 text-muted-foreground">
                Tinjau metrik pertumbuhan, gross transaction value, dan estimasi pendapatan platform.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link href="/admin/reports/export?format=csv">
                  <ArrowDownToLine aria-hidden="true" />
                  Export CSV
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/admin/reports/export?format=html" target="_blank">
                  HTML report
                </Link>
              </Button>
              <Button asChild>
                <Link href="/admin/reports/export?format=print" target="_blank">
                  Print / PDF
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <DashboardMetricGrid metrics={metrics} />

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
              <CalendarDays className="size-5 text-primary" />
              Ringkasan data saat ini
            </h2>

            <div className="space-y-4">
              <ReportRow
                label="Total order tercatat"
                value={`${report.totalOrders} pesanan`}
              />
              <ReportRow
                label="Gross transaction value"
                value={formatCurrency(report.grossTransactionValue)}
              />
              <ReportRow
                label="Platform revenue"
                value={formatCurrency(report.platformRevenue)}
                highlight
              />
              <ReportRow
                label="Pembayaran paid"
                value={formatCurrency(report.paidAmount)}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-border/70 bg-surface-soft p-6 shadow-[var(--shadow-soft)]">
            <h2 className="mb-6 text-lg font-semibold">Status peringatan</h2>

            <div className="rounded-xl border border-border/50 bg-white p-4 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-amber-500/10 p-2 text-amber-600">
                  <AlertCircle className="size-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {report.activeComplaints} komplain aktif
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Butuh monitoring admin jika status belum resolved.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}

function ReportRow({
  highlight,
  label,
  value,
}: {
  highlight?: boolean;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border/50 p-4">
      <span className="font-medium">{label}</span>
      <span className={highlight ? "text-lg font-bold text-primary" : "text-lg font-bold"}>
        {value}
      </span>
    </div>
  );
}
