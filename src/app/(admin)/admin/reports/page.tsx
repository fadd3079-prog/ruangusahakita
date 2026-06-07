import type { Metadata } from "next";
import { BarChart3, TrendingUp, FolderCheck, AlertCircle, CalendarDays, WalletCards } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { DashboardMetricGrid, type DashboardMetric } from "@/features/dashboard/components/dashboard-overview";
import { dummyAdminDashboardReport, dummyMonthlyReports, dummyComplaints, dummyPayments, dummyOrders } from "@/lib/dummy";
import { formatCurrency } from "@/lib/formatters/currency";

export const metadata: Metadata = {
  title: "Laporan & Metrik — Ruang Usaha Kita",
  description: "Laporan performa platform dan simulasi pendapatan.",
};

export default function AdminReportsPage() {
  const latestReport = dummyMonthlyReports.at(-1)!;
  const activeComplaints = dummyComplaints.filter(c => c.complaintStatus === "open" || c.complaintStatus === "under_review").length;
  
  const paidPayments = dummyPayments.filter(p => p.paymentStatus === "paid");
  const totalPaid = paidPayments.reduce((acc, curr) => acc + curr.amount, 0);
  
  const totalCompletedOrders = dummyOrders.filter(o => o.orderStatus === "completed").length;

  const metrics: DashboardMetric[] = [
    {
      label: "Gross Transaction Value (GTV)",
      value: formatCurrency(dummyAdminDashboardReport.grossTransactionValue),
      description: "Total nilai semua transaksi sukses.",
      icon: TrendingUp,
    },
    {
      label: "Platform Revenue",
      value: formatCurrency(dummyAdminDashboardReport.platformRevenue),
      description: "Pemasukan bersih platform dari potongan fee.",
      icon: WalletCards,
    },
    {
      label: "Total Pesanan Sukses",
      value: String(totalCompletedOrders),
      description: "Jumlah pesanan yang berstatus completed.",
      icon: FolderCheck,
    },
    {
      label: "Dana Masuk (Paid)",
      value: formatCurrency(totalPaid),
      description: "Total pembayaran dummy yang telah masuk.",
      icon: BarChart3,
    },
  ];

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">Laporan Operasional</h1>
          <p className="mt-2 text-muted-foreground">Tinjau metrik pertumbuhan, gross transaction value, dan estimasi pendapatan platform.</p>
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
          <AlertCircle className="size-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm text-brand-navy">
            <span className="font-semibold block mb-1">Catatan Simulasi</span>
            Grafik dan laporan di halaman ini digenerate dari data dummy (statis) untuk tujuan pratinjau UI. Tidak ada kalkulasi real-time ke database atau payment gateway.
          </div>
        </div>

        <DashboardMetricGrid metrics={metrics} />

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-[var(--shadow-soft)]">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <CalendarDays className="size-5 text-primary" />
              Laporan Bulanan Terakhir
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
                <p className="text-sm text-muted-foreground">Periode</p>
                <p className="text-lg font-bold text-brand-navy mt-1">Desember 2026</p>
              </div>
              <div className="p-4 rounded-xl border border-border/50 bg-muted/30">
                <p className="text-sm text-muted-foreground">Pertumbuhan GTV</p>
                <p className="text-lg font-bold text-primary mt-1">+12.5% vs bulan lalu</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border-b border-border/50">
                <span className="font-medium">Total GTV Bulan Ini</span>
                <span className="font-bold text-lg">{formatCurrency(latestReport.grossTransactionValue)}</span>
              </div>
              <div className="flex justify-between items-center p-4 border-b border-border/50">
                <span className="font-medium">Platform Revenue (Fee)</span>
                <span className="font-bold text-lg text-primary">{formatCurrency(latestReport.platformRevenue)}</span>
              </div>
              <div className="flex justify-between items-center p-4 border-b border-border/50">
                <span className="font-medium">Jumlah Pesanan</span>
                <span className="font-bold text-lg">{latestReport.orders} pesanan</span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border/70 bg-surface-soft p-6 shadow-[var(--shadow-soft)]">
             <h2 className="text-lg font-semibold mb-6">Status Peringatan</h2>
             
             <div className="space-y-4">
               <div className="p-4 rounded-xl bg-white border border-border/50 shadow-sm flex items-start gap-4">
                 <div className="rounded-full bg-amber-500/10 p-2 text-amber-600">
                   <AlertCircle className="size-5" />
                 </div>
                 <div>
                   <p className="font-semibold text-foreground">{activeComplaints} Komplain Aktif</p>
                   <p className="text-xs text-muted-foreground mt-1">Butuh mediasi admin segera</p>
                 </div>
               </div>
             </div>
          </section>
        </div>
      </div>
    </PageContainer>
  );
}
