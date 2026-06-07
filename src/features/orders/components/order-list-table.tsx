import Link from "next/link";

import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import type {
  DummyCreatorProfile,
  DummyOrder,
  DummyPayment,
  DummyServicePackage,
  DummyServiceTier,
  DummyUmkmProfile,
} from "@/lib/dummy";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";

export type OrderListItem = {
  readonly creator: DummyCreatorProfile | null;
  readonly detailHref: string;
  readonly order: DummyOrder;
  readonly payment: DummyPayment | null;
  readonly service: DummyServicePackage | null;
  readonly tier: DummyServiceTier | null;
  readonly umkm: DummyUmkmProfile | null;
};

type OrderListTableProps = {
  items: readonly OrderListItem[];
  role: "admin" | "creator" | "umkm";
};

export function OrderListTable({ items, role }: OrderListTableProps) {
  return (
    <section
      aria-labelledby="order-list-title"
      className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-card)]"
    >
      <div className="border-b border-border/70 bg-[linear-gradient(135deg,var(--surface-elevated),var(--surface-soft))] p-5">
        <p className="text-sm font-semibold text-primary">Daftar pesanan</p>
        <h2
          id="order-list-title"
          className="mt-2 text-2xl font-semibold tracking-tight text-foreground"
        >
          Status pesanan dan pembayaran
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Status pesanan dan pembayaran ditampilkan terpisah agar alur produksi
          konten tetap jelas.
        </p>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border/70 bg-muted/30 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-5 py-4 font-semibold">Order</th>
              <th className="px-5 py-4 font-semibold">
                {role === "umkm" ? "Kreator" : role === "creator" ? "UMKM" : "UMKM / Kreator"}
              </th>
              <th className="px-5 py-4 font-semibold">Paket jasa</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold">Deadline</th>
              <th className="px-5 py-4 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.order.id}
                className="border-b border-border/70 last:border-b-0"
              >
                <td className="px-5 py-4 align-top">
                  <Link
                    href={item.detailHref}
                    className="font-semibold text-foreground hover:text-primary"
                  >
                    {item.order.orderNumber}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Dibuat {formatDate(item.order.createdAt)}
                  </p>
                </td>
                <td className="px-5 py-4 align-top">
                  {role === "umkm" ? (
                    <PersonBlock name={item.creator?.displayName ?? "-"} meta="Kreator" />
                  ) : role === "creator" ? (
                    <PersonBlock name={item.umkm?.businessName ?? "-"} meta="UMKM" />
                  ) : (
                    <div className="space-y-2">
                      <PersonBlock name={item.umkm?.businessName ?? "-"} meta="UMKM" />
                      <PersonBlock name={item.creator?.displayName ?? "-"} meta="Kreator" />
                    </div>
                  )}
                </td>
                <td className="max-w-[280px] px-5 py-4 align-top">
                  <p className="font-medium text-foreground">
                    {item.service?.title ?? "-"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Tier {item.tier?.name ?? "-"}
                  </p>
                </td>
                <td className="px-5 py-4 align-top">
                  <div className="space-y-2">
                    <OrderStatusBadge status={item.order.orderStatus} />
                    {item.payment ? (
                      <PaymentStatusBadge status={item.payment.paymentStatus} />
                    ) : null}
                  </div>
                </td>
                <td className="px-5 py-4 align-top text-muted-foreground">
                  {formatDate(item.order.deadline)}
                </td>
                <td className="px-5 py-4 text-right align-top font-semibold text-foreground">
                  {formatCurrency(item.order.totalAmount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 p-4 lg:hidden">
        {items.map((item) => (
          <article
            key={item.order.id}
            className="rounded-2xl border border-border/70 bg-background p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link
                  href={item.detailHref}
                  className="font-semibold text-foreground hover:text-primary"
                >
                  {item.order.orderNumber}
                </Link>
                <p className="mt-1 text-xs text-muted-foreground">
                  Deadline {formatDate(item.order.deadline)}
                </p>
              </div>
              <OrderStatusBadge status={item.order.orderStatus} />
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">
              {item.service?.title ?? "-"}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {item.umkm?.businessName ?? "-"} · {item.creator?.displayName ?? "-"}
            </p>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/70 pt-3">
              {item.payment ? (
                <PaymentStatusBadge status={item.payment.paymentStatus} />
              ) : (
                <span className="text-xs text-muted-foreground">
                  Pembayaran belum tersedia
                </span>
              )}
              <p className="font-semibold text-foreground">
                {formatCurrency(item.order.totalAmount)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

type PersonBlockProps = {
  meta: string;
  name: string;
};

function PersonBlock({ meta, name }: PersonBlockProps) {
  return (
    <div>
      <p className="font-semibold text-foreground">{name}</p>
      <p className="mt-1 text-xs text-muted-foreground">{meta}</p>
    </div>
  );
}
