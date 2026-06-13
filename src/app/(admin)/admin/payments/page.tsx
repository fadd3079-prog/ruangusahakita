import type { Metadata } from "next";
import { CreditCard, Search, ShieldCheck } from "lucide-react";

import { TruncateText } from "@/components/common/truncate-text";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import type { Database } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Monitoring Pembayaran - Admin Ruang Usaha Kita",
  description:
    "Monitoring pembayaran untuk admin, termasuk status pembayaran, invoice, konteks UMKM, kreator, dan revenue platform.",
};

type PaymentStatus = Database["public"]["Enums"]["payment_status"];

type AdminPaymentsPageProps = {
  searchParams: Promise<{
    payment?: string;
    q?: string;
    sort?: string;
  }>;
};

export default async function AdminPaymentsPage({
  searchParams,
}: AdminPaymentsPageProps) {
  const params = await searchParams;
  const [payments, reportMetrics] = await Promise.all([
    getAdminPayments(),
    getAdminReportMetrics(),
  ]);
  const filters = getFilters(params);
  const filteredPayments = payments
    .filter((payment) => {
      const searchable = `${payment.payment_number} ${payment.orderNumber ?? ""} ${payment.serviceTitle ?? ""} ${payment.umkmName ?? ""} ${payment.creatorName ?? ""} ${payment.provider ?? ""}`.toLowerCase();
      const matchesQuery = filters.query ? searchable.includes(filters.query) : true;
      const matchesStatus =
        filters.paymentStatus === "all"
          ? true
          : payment.payment_status === filters.paymentStatus;

      return matchesQuery && matchesStatus;
    })
    .toSorted((left, right) => {
      if (filters.sort === "amount") {
        return Number(right.amount) - Number(left.amount);
      }

      return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
    });
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

          <form className="grid gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-[var(--shadow-soft)] md:grid-cols-[minmax(240px,1fr)_180px_180px_auto] md:items-end">
            <label className="grid gap-2">
              <span className="text-xs font-semibold uppercase text-muted-foreground">
                Cari
              </span>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  name="q"
                  defaultValue={filters.query}
                  placeholder="Invoice, order, UMKM, kreator"
                  className="h-11 bg-card pl-9"
                />
              </div>
            </label>
            <SelectField
              label="Status"
              name="payment"
              options={[
                { label: "Semua", value: "all" },
                { label: "Dibayar", value: "paid" },
                { label: "Menunggu", value: "pending" },
                { label: "Gagal", value: "failed" },
                { label: "Kedaluwarsa", value: "expired" },
              ]}
              value={filters.paymentStatus}
            />
            <SelectField
              label="Urutkan"
              name="sort"
              options={[
                { label: "Terbaru", value: "latest" },
                { label: "Total tertinggi", value: "amount" },
              ]}
              value={filters.sort}
            />
            <div className="grid grid-cols-2 gap-2 md:flex">
              <Button type="submit" className="h-11">
                Terapkan
              </Button>
              <Button asChild type="button" variant="outline" className="h-11">
                <a href="?">Reset</a>
              </Button>
            </div>
          </form>

          <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-card)]">
            {filteredPayments.length > 0 ? (
              <Table className="table-fixed">
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="w-[20%]">Pembayaran</TableHead>
                    <TableHead className="w-[24%]">Order</TableHead>
                    <TableHead className="w-[24%]">UMKM & kreator</TableHead>
                    <TableHead className="w-[12%]">Status</TableHead>
                    <TableHead className="w-[10%]">Provider</TableHead>
                    <TableHead className="w-[10%] text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="min-w-0">
                        <TruncateText
                          text={payment.payment_number}
                          className="font-semibold text-foreground"
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDate(payment.created_at)}
                        </p>
                      </TableCell>
                      <TableCell className="min-w-0">
                        <TruncateText
                          text={payment.orderNumber ?? "Order belum tersedia"}
                          className="font-medium text-foreground"
                        />
                        <TruncateText
                          text={payment.serviceTitle ?? "Paket jasa digital belum tersedia"}
                          className="mt-1 text-xs text-muted-foreground"
                        />
                      </TableCell>
                      <TableCell className="min-w-0">
                        <TruncateText
                          text={payment.umkmName ?? "UMKM"}
                          className="font-medium text-foreground"
                        />
                        <TruncateText
                          text={payment.creatorName ?? "Kreator"}
                          className="mt-1 text-xs text-muted-foreground"
                        />
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
                Belum ada pembayaran yang sesuai
              </div>
            )}
          </section>
        </div>
      </PageContainer>
    </main>
  );
}

function getFilters(params: Awaited<AdminPaymentsPageProps["searchParams"]>) {
  const paymentStatus = isPaymentStatusFilter(params.payment) ? params.payment : "all";
  const sort = isSortFilter(params.sort) ? params.sort : "latest";

  return {
    paymentStatus,
    query: params.q?.trim().toLowerCase() ?? "",
    sort,
  };
}

function isPaymentStatusFilter(value?: string): value is PaymentStatus | "all" {
  return (
    value === "all" ||
    value === "pending" ||
    value === "paid" ||
    value === "failed" ||
    value === "expired"
  );
}

function isSortFilter(value?: string): value is "latest" | "amount" {
  return value === "latest" || value === "amount";
}

function SelectField<TValue extends string>({
  label,
  name,
  options,
  value,
}: {
  label: string;
  name: string;
  options: readonly { label: string; value: TValue }[];
  value: TValue;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-semibold uppercase text-muted-foreground">
        {label}
      </span>
      <select
        name={name}
        defaultValue={value}
        className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-[3px] focus:ring-ring/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function sumPaymentAmount(payments: readonly { amount: number }[]) {
  return payments.reduce((total, payment) => total + Number(payment.amount), 0);
}
