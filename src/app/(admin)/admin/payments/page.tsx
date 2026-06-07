import type { Metadata } from "next";
import { CreditCard, ShieldCheck } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { AdminPaymentSummaryCards } from "@/features/payments/components/admin-payment-summary-cards";
import {
  AdminPaymentTable,
  type AdminPaymentRow,
} from "@/features/payments/components/admin-payment-table";
import {
  dummyAdminDashboardReport,
  dummyCreators,
  dummyMonthlyReports,
  dummyOrders,
  dummyPayments,
  dummyServicePackages,
  dummyUmkmProfiles,
} from "@/lib/dummy";
import { formatCurrency } from "@/lib/formatters/currency";

export const metadata: Metadata = {
  title: "Monitoring Pembayaran - Admin Ruang Usaha Kita",
  description:
    "Monitoring pembayaran dummy untuk admin, termasuk status pembayaran, invoice, konteks UMKM, kreator, dan laporan revenue platform.",
};

const orderById = new Map(dummyOrders.map((order) => [order.id, order]));
const creatorById = new Map(dummyCreators.map((creator) => [creator.id, creator]));
const serviceById = new Map(
  dummyServicePackages.map((service) => [service.id, service]),
);
const umkmById = new Map(dummyUmkmProfiles.map((profile) => [profile.id, profile]));

const paymentRows: readonly AdminPaymentRow[] = dummyPayments.map((payment) => {
  const order = orderById.get(payment.orderId) ?? null;

  return {
    payment,
    order,
    creator: order ? creatorById.get(order.creatorId) ?? null : null,
    service: order ? serviceById.get(order.servicePackageId) ?? null : null,
    umkm: order ? umkmById.get(order.umkmId) ?? null : null,
  };
});

const paidPayments = dummyPayments.filter(
  (payment) => payment.paymentStatus === "paid",
);
const pendingPayments = dummyPayments.filter(
  (payment) => payment.paymentStatus === "pending",
);
const failedOrExpiredPayments = dummyPayments.filter(
  (payment) =>
    payment.paymentStatus === "failed" || payment.paymentStatus === "expired",
);
const latestMonthlyReport = dummyMonthlyReports.at(-1);

export default function AdminPaymentsPage() {
  return (
    <main>
      <PageContainer maxWidth="full" className="px-0 sm:px-0 lg:px-0">
        <div className="space-y-8">
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,var(--brand-navy-950),var(--brand-teal-900))] text-white shadow-[var(--shadow-card)]">
            <div className="grid gap-8 p-6 sm:p-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-end">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-semibold text-white/80">
                  <CreditCard className="size-4" aria-hidden="true" />
                  Monitoring pembayaran admin
                </p>
                <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Monitoring pembayaran dummy
                </h1>
                <p className="mt-5 max-w-3xl text-sm leading-6 text-white/72 sm:text-base">
                  Pantau invoice, status pembayaran, metode, provider, dan
                  konteks order tanpa mengubah status dari sisi client.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <ShieldCheck className="size-5 text-white" aria-hidden="true" />
                <h2 className="mt-4 text-xl font-semibold tracking-tight text-white">
                  Revenue platform
                </h2>
                <p className="mt-3 text-4xl font-semibold tracking-tight text-white">
                  {formatCurrency(dummyAdminDashboardReport.platformRevenue)}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Ringkasan ini berasal dari dummy reports. Bulan terbaru:{" "}
                  {latestMonthlyReport?.month ?? "-"}.
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
            platformRevenue={dummyAdminDashboardReport.platformRevenue}
          />

          <AdminPaymentTable rows={paymentRows} />
        </div>
      </PageContainer>
    </main>
  );
}

function sumPaymentAmount(payments: typeof dummyPayments) {
  return payments.reduce((total, payment) => total + payment.amount, 0);
}
