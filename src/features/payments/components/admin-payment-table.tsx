import Link from "next/link";

import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
import { paymentMethodLabels } from "@/features/payments/components/payment-method-selector";
import type {
  DummyCreatorProfile,
  DummyOrder,
  DummyPayment,
  DummyPaymentProvider,
  DummyServicePackage,
  DummyUmkmProfile,
} from "@/lib/dummy";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";

export type AdminPaymentRow = {
  readonly creator: DummyCreatorProfile | null;
  readonly order: DummyOrder | null;
  readonly payment: DummyPayment;
  readonly service: DummyServicePackage | null;
  readonly umkm: DummyUmkmProfile | null;
};

type AdminPaymentTableProps = {
  rows: readonly AdminPaymentRow[];
};

const statusFilterLabels = [
  "Semua",
  "Dibayar",
  "Menunggu Pembayaran",
  "Gagal/Kedaluwarsa",
] as const;

export function AdminPaymentTable({ rows }: AdminPaymentTableProps) {
  return (
    <section
      aria-labelledby="admin-payment-table-title"
      className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-card)]"
    >
      <div className="flex flex-col gap-4 border-b border-border/70 bg-[linear-gradient(135deg,var(--surface-elevated),var(--surface-soft))] p-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Monitoring admin</p>
          <h2
            id="admin-payment-table-title"
            className="mt-2 text-2xl font-semibold tracking-tight text-foreground"
          >
            Daftar pembayaran dummy
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Filter di bawah masih tampilan UI. Data belum terhubung ke query
            server atau database.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {statusFilterLabels.map((label, index) => (
            <button
              key={label}
              type="button"
              className={
                index === 0
                  ? "rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                  : "rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted"
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border/70 bg-muted/30 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-5 py-4 font-semibold">Invoice</th>
              <th className="px-5 py-4 font-semibold">UMKM / kreator</th>
              <th className="px-5 py-4 font-semibold">Paket jasa</th>
              <th className="px-5 py-4 font-semibold">Metode</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.payment.id}
                className="border-b border-border/70 last:border-b-0"
              >
                <td className="px-5 py-4 align-top">
                  <Link
                    href={`/umkm/payments/${row.payment.id}`}
                    className="font-semibold text-foreground hover:text-primary"
                  >
                    {row.payment.paymentNumber}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(row.payment.createdAt)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Order {row.order?.orderNumber ?? "-"}
                  </p>
                </td>
                <td className="px-5 py-4 align-top">
                  <p className="font-semibold text-foreground">
                    {row.umkm?.businessName ?? "-"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Kreator: {row.creator?.displayName ?? "-"}
                  </p>
                </td>
                <td className="max-w-[260px] px-5 py-4 align-top">
                  <p className="font-medium text-foreground">
                    {row.service?.title ?? "-"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Status pesanan: {row.order?.orderStatus ?? "-"}
                  </p>
                </td>
                <td className="px-5 py-4 align-top">
                  <p className="font-medium text-foreground">
                    {paymentMethodLabels[row.payment.paymentMethod]}
                  </p>
                  <p className="mt-1 text-xs uppercase text-muted-foreground">
                    {formatProvider(row.payment.provider)}
                  </p>
                </td>
                <td className="px-5 py-4 align-top">
                  <PaymentStatusBadge status={row.payment.paymentStatus} />
                </td>
                <td className="px-5 py-4 text-right align-top font-semibold text-foreground">
                  {formatCurrency(row.payment.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 p-4 lg:hidden">
        {rows.map((row) => (
          <article
            key={row.payment.id}
            className="rounded-2xl border border-border/70 bg-background p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link
                  href={`/umkm/payments/${row.payment.id}`}
                  className="font-semibold text-foreground hover:text-primary"
                >
                  {row.payment.paymentNumber}
                </Link>
                <p className="mt-1 text-xs text-muted-foreground">
                  Order {row.order?.orderNumber ?? "-"}
                </p>
              </div>
              <PaymentStatusBadge status={row.payment.paymentStatus} />
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">
              {row.service?.title ?? "-"}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {row.umkm?.businessName ?? "-"} · {row.creator?.displayName ?? "-"}
            </p>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-3">
              <p className="text-xs text-muted-foreground">
                {paymentMethodLabels[row.payment.paymentMethod]} ·{" "}
                {formatProvider(row.payment.provider)}
              </p>
              <p className="font-semibold text-foreground">
                {formatCurrency(row.payment.amount)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function formatProvider(provider: DummyPaymentProvider) {
  return provider === "dummy" ? "Dummy Provider" : provider;
}
