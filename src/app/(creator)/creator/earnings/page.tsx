import type { Metadata } from "next";
import Link from "next/link";
import { Clock, FileCheck2, TrendingUp, WalletCards } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import {
  DashboardMetricGrid,
  type DashboardMetric,
} from "@/features/dashboard/components/dashboard-overview";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
import { getCurrentCreatorEarnings } from "@/features/creator/earnings/data/creator-earnings-queries";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";

export const metadata: Metadata = {
  title: "Pendapatan — Ruang Usaha Kita",
  description: "Pantau estimasi pendapatan dari order jasa digital Anda.",
};

export default async function CreatorEarningsPage() {
  const data = await getCurrentCreatorEarnings();
  const metrics: DashboardMetric[] = [
    {
      description: "Estimasi bersih dari order completed dan pembayaran paid.",
      icon: WalletCards,
      label: "Pendapatan selesai",
      value: formatCurrency(data.metrics.completedIncome),
    },
    {
      description: "Estimasi bersih dari order aktif yang sudah dibayar.",
      icon: Clock,
      label: "Menunggu penyelesaian",
      value: formatCurrency(data.metrics.pendingIncome),
    },
    {
      description: "Total nilai order aktif yang sudah dibayar.",
      icon: TrendingUp,
      label: "Nilai order aktif",
      value: formatCurrency(data.metrics.activeOrderValue),
    },
    {
      description: "Order selesai dari seluruh order milik kreator.",
      icon: FileCheck2,
      label: "Order selesai",
      value: String(data.metrics.completedOrders),
    },
  ];

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">
            Pendapatan
          </h1>
          <p className="mt-2 text-muted-foreground">
            Pantau estimasi pendapatan dari order real yang sudah masuk ke akun kreator Anda.
          </p>
        </div>

        <DashboardMetricGrid metrics={metrics} />

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]">
          <div className="border-b border-border/70 p-6">
            <h2 className="text-xl font-semibold">Riwayat pendapatan</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Hanya order dengan pembayaran paid yang dihitung sebagai estimasi pendapatan kreator.
            </p>
          </div>

          {data.transactions.length > 0 ? (
            <div className="divide-y divide-border/70">
              {data.transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col gap-4 p-6 transition-colors hover:bg-muted/20 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">
                      {transaction.orderNumber}
                    </p>
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                      {transaction.serviceTitle}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(transaction.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:items-end">
                    <p className="font-bold text-brand-navy">
                      {formatCurrency(transaction.amount)}
                    </p>
                    <div className="flex flex-wrap gap-2 sm:justify-end">
                      <OrderStatusBadge status={transaction.orderStatus} />
                      <PaymentStatusBadge status={transaction.paymentStatus} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                <WalletCards className="size-7" aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold tracking-tight">
                Pendapatan belum tersedia
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Pendapatan akan muncul setelah ada order berbayar yang terkait dengan layanan Anda.
              </p>
              <Button asChild className="mt-5">
                <Link href="/creator/orders">Lihat Order Masuk</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
