import type { Metadata } from "next";
import { CreditCard, ShieldCheck } from "lucide-react";

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
  getAdminPayments,
  getAdminReportMetrics,
} from "@/features/admin/data/admin-management-queries";
import { AdminPaymentSummaryCards } from "@/features/payments/components/admin-payment-summary-cards";
import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";

export const metadata: Metadata = {
  title: "Monitoring Pembayaran - Admin Ruang Usaha Kita",
  description:
    "Monitoring pembayaran untuk admin, termasuk status pembayaran, invoice, konteks UMKM, kreator, dan revenue platform.",
};

export default async function AdminPaymentsPage() {
  const [payments, reportMetrics] = await Promise.all([
    getAdminPayments(),
    getAdminReportMetrics(),
  ]);
  const paidPayments = payments.filter((payment) => payment.payment_status === "paid");
  const pendingPayments = payments.filter(
    (payment) => payment.payment_status === "pending",
  );
  const failedOrExpiredPayments = payments.filter(
    (payment) =>
      payment.payment_status === "failed" || payment.payment_status === "expired",
  );
  const platformRevenue = reportMetrics.platformRevenue;

  return (
    <main>
      <PageContainer>
        <div className="space-y-8">
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,var(--brand-navy-950),var(--brand-teal-900))] text-white shadow-[var(--shadow-card)]">
            <div className="grid gap-8 p-6 sm:p-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-end">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-semibold text-white/80">
                  <CreditCard className="size-4" aria-hidden="true" />
                  Monitoring pembayaran admin
                </p>
                <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Monitoring pembayaran
                </h1>
                <p className="mt-5 max-w-3xl text-sm leading-6 text-white/72 sm:text-base">
                  Pantau invoice, status pembayaran, metode, provider, dan konteks order tanpa mengubah status dari sisi client.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <ShieldCheck className="size-5 text-white" aria-hidden="true" />
                <h2 className="mt-4 text-xl font-semibold tracking-tight text-white">
                  Revenue platform
                </h2>
                <p className="mt-3 text-4xl font-semibold tracking-tight text-white">
                  {formatCurrency(platformRevenue)}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Estimasi dari pembayaran paid yang sudah tercatat.
                </p>
              </div>
            </div>
          </section>

          <AdminPaymentSummaryCards
            paidAmount={sumPaymentAmount(paidPayments)}
            paidCount={paidPayments.length}
            pendingAmount={sumPaymentAmount(pendingPayments)}
            pendingCount={pendingPayments.length}
            failedOrExpiredAmount={sumPaymentAmount(failedOrExpiredPayments)}
            failedOrExpiredCount={failedOrExpiredPayments.length}
            platformRevenue={platformRevenue}
          />

          <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-card)]">
            {payments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead>Pembayaran</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>UMKM & kreator</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <p className="font-semibold text-foreground">
                          {payment.payment_number}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDate(payment.created_at)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-foreground">
                          {payment.orderNumber ?? "Order belum tersedia"}
                        </p>
                        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                          {payment.serviceTitle ?? "Paket jasa digital belum tersedia"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-foreground">
                          {payment.umkmName ?? "UMKM"}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {payment.creatorName ?? "Kreator"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <PaymentStatusBadge status={payment.payment_status} />
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="rounded-lg">
                          {payment.provider ?? "Belum tersedia"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-foreground">
                        {formatCurrency(Number(payment.amount))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-12 text-center text-sm text-muted-foreground">
                Belum ada pembayaran
              </div>
            )}
          </section>
        </div>
      </PageContainer>
    </main>
  );
}

function sumPaymentAmount(payments: readonly { amount: number }[]) {
  return payments.reduce((total, payment) => total + Number(payment.amount), 0);
}
