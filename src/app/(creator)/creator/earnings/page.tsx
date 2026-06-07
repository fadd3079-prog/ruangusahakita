import type { Metadata } from "next";
import { WalletCards, TrendingUp, Clock, FileCheck2, Info } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { DashboardMetricGrid, type DashboardMetric } from "@/features/dashboard/components/dashboard-overview";
import { dummyCreators, dummyOrders } from "@/lib/dummy";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";

export const metadata: Metadata = {
  title: "Pendapatan — Ruang Usaha Kita",
  description: "Pantau estimasi pendapatan dari order jasa digital Anda.",
};

export default function CreatorEarningsPage() {
  const currentCreator = dummyCreators.find((creator) => creator.id === "creator_003") ?? dummyCreators[0];
  const creatorOrders = dummyOrders.filter(
    (order) => order.creatorId === currentCreator.id
  );

  // Completed & Paid orders
  const completedOrders = creatorOrders.filter(o => o.orderStatus === "completed" && o.paymentStatus === "paid");
  const totalEarned = completedOrders.reduce(
    (total, order) => total + order.subtotalAmount + order.addonAmount - order.platformFee,
    0
  );

  // Active/Pending orders (paid by UMKM but not yet completed)
  const activeOrders = creatorOrders.filter(
    o => o.orderStatus !== "completed" && o.paymentStatus === "paid"
  );
  const pendingClearance = activeOrders.reduce(
    (total, order) => total + order.subtotalAmount + order.addonAmount - order.platformFee,
    0
  );

  const metrics: DashboardMetric[] = [
    {
      label: "Total Pendapatan (Selesai)",
      value: formatCurrency(totalEarned),
      description: "Dari order yang sudah selesai dan dibayar penuh.",
      icon: WalletCards,
    },
    {
      label: "Menunggu Pencairan (Aktif)",
      value: formatCurrency(pendingClearance),
      description: "Dari order aktif yang sedang dalam pengerjaan/revisi.",
      icon: Clock,
    },
    {
      label: "Pesanan Selesai",
      value: String(completedOrders.length),
      description: "Order yang telah direview dan selesai.",
      icon: FileCheck2,
    },
    {
      label: "Rata-rata per Pesanan",
      value: completedOrders.length > 0 ? formatCurrency(totalEarned / completedOrders.length) : "Rp0",
      description: "Estimasi nilai bersih per order.",
      icon: TrendingUp,
    },
  ];

  // Dummy transactions for the list
  const transactions = creatorOrders
    .filter(o => o.paymentStatus === "paid")
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      date: formatDate(order.createdAt),
      status: order.orderStatus === "completed" ? "Selesai" : "Proses",
      amount: order.subtotalAmount + order.addonAmount - order.platformFee,
    }));

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">Pendapatan</h1>
          <p className="mt-2 text-muted-foreground">Pantau estimasi pendapatan dan status pencairan dari order jasa digital Anda.</p>
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
          <Info className="size-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm text-brand-navy">
            <span className="font-semibold block mb-1">Data Simulasi (Dummy)</span>
            Nilai pendapatan di halaman ini adalah estimasi dari dummy order pada tahap MVP. Belum terhubung dengan sistem payment gateway atau mutasi rekening asli.
          </div>
        </div>

        <DashboardMetricGrid metrics={metrics} />

        <div className="rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)] overflow-hidden">
          <div className="p-6 border-b border-border/70">
            <h2 className="text-xl font-semibold">Riwayat Transaksi (Simulasi)</h2>
            <p className="text-sm text-muted-foreground mt-1">Daftar order yang telah dibayar oleh UMKM (dikurangi platform fee).</p>
          </div>
          
          {transactions.length > 0 ? (
            <div className="divide-y divide-border/70">
              {transactions.map((trx) => (
                <div key={trx.id} className="p-6 flex items-center justify-between hover:bg-muted/20 transition-colors">
                  <div>
                    <p className="font-semibold text-foreground">{trx.orderNumber}</p>
                    <p className="text-sm text-muted-foreground mt-1">{trx.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-navy">{formatCurrency(trx.amount)}</p>
                    <p className={`text-xs font-medium mt-1 ${trx.status === "Selesai" ? "text-primary" : "text-amber-600"}`}>
                      {trx.status === "Selesai" ? "Telah Dicairkan" : "Menunggu Selesai"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              Belum ada transaksi pendapatan.
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
