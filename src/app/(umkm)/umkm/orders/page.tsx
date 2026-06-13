import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { OrderFilterBar } from "@/features/orders/components/order-filter-bar";
import type { OrderListFilters } from "@/features/orders/components/order-filter-bar";
import { OrderPageHero } from "@/features/orders/components/order-page-hero";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
import {
  getCurrentUmkmOrders,
  type UmkmOrderListItem,
} from "@/features/orders/data/order-queries";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";
import type { Database } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Pesanan Saya - Ruang Usaha Kita",
  description:
    "Daftar pesanan UMKM untuk memantau status pesanan, pembayaran, brief campaign, hasil konten, dan revisi.",
};

type OrderStatus = Database["public"]["Enums"]["order_status"];
type PaymentStatus = Database["public"]["Enums"]["payment_status"];

type UmkmOrdersPageProps = {
  searchParams?: Promise<{
    payment?: string;
    q?: string;
    sort?: string;
    status?: string;
  }>;
};

const orderStatuses: readonly OrderStatus[] = [
  "draft",
  "awaiting_payment",
  "paid",
  "waiting_creator_confirmation",
  "brief_accepted",
  "in_progress",
  "submitted",
  "revision_requested",
  "revised",
  "completed",
  "cancelled",
  "refunded",
];

const paymentStatuses: readonly PaymentStatus[] = [
  "pending",
  "paid",
  "failed",
  "expired",
  "refunded",
  "partially_refunded",
];

export default async function UmkmOrdersPage({ searchParams }: UmkmOrdersPageProps) {
  const [orders, params] = await Promise.all([
    getCurrentUmkmOrders(),
    searchParams ?? Promise.resolve({ payment: undefined, q: undefined, sort: undefined, status: undefined }),
  ]);
  const filters = parseFilters(params);
  const visibleOrders = filterOrders(orders, filters);
  const totalPayment = orders.reduce(
    (total, order) => total + order.totalAmount,
    0,
  );

  return (
    <main>
      <PageContainer>
        <div className="space-y-8">
          <OrderPageHero
            icon={ClipboardList}
            eyebrow="Pesanan UMKM"
            title="Pantau pesanan jasa digital Anda."
            description="Lihat kreator, paket jasa, status pesanan, status pembayaran, total, dan deadline dalam satu ruang kerja."
            metricLabel="Total pembayaran"
            metricValue={totalPayment}
          />
          <OrderFilterBar filters={filters} showPaymentFilter />
          {visibleOrders.length > 0 ? (
            <OrderList orders={visibleOrders} />
          ) : (
            <EmptyOrdersState />
          )}
        </div>
      </PageContainer>
    </main>
  );
}

function parseFilters(params: Awaited<NonNullable<UmkmOrdersPageProps["searchParams"]>>): OrderListFilters {
  const status = orderStatuses.includes(params.status as OrderStatus)
    ? (params.status as OrderStatus)
    : "all";
  const paymentStatus = paymentStatuses.includes(params.payment as PaymentStatus)
    ? (params.payment as PaymentStatus)
    : "all";
  const sort = params.sort === "deadline" || params.sort === "total" ? params.sort : "latest";

  return {
    paymentStatus,
    query: params.q?.trim() ?? "",
    sort,
    status,
  };
}

function filterOrders(
  orders: readonly UmkmOrderListItem[],
  filters: OrderListFilters,
) {
  const query = filters.query.toLowerCase();

  return orders
    .filter((order) => {
      const searchTarget = [
        order.orderNumber,
        order.serviceTitle,
        order.creatorName,
        order.tierName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!query || searchTarget.includes(query)) &&
        (filters.status === "all" || order.orderStatus === filters.status) &&
        (filters.paymentStatus === "all" || order.paymentStatus === filters.paymentStatus)
      );
    })
    .sort((first, second) => {
      if (filters.sort === "total") {
        return second.totalAmount - first.totalAmount;
      }

      if (filters.sort === "deadline") {
        return toTime(first.deadline) - toTime(second.deadline);
      }

      return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
    });
}

function toTime(value: string | null) {
  return value ? new Date(value).getTime() : Number.MAX_SAFE_INTEGER;
}

function OrderList({ orders }: { orders: readonly UmkmOrderListItem[] }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-card)]">
      <div className="border-b border-border/70 bg-muted/30 px-5 py-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Daftar pesanan
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Data dibaca dari Supabase sesuai akun UMKM yang sedang login.
        </p>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border/70 bg-background/60 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-semibold">Pesanan</th>
              <th className="px-5 py-3 font-semibold">Kreator</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Pembayaran</th>
              <th className="px-5 py-3 text-right font-semibold">Total</th>
              <th className="px-5 py-3 font-semibold">Deadline</th>
              <th className="px-5 py-3 text-right font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {orders.map((order) => (
              <tr key={order.id} className="align-top">
                <td className="px-5 py-4">
                  <p className="font-semibold text-foreground">
                    {order.orderNumber}
                  </p>
                  <p className="mt-1 max-w-[260px] truncate text-muted-foreground">
                    {order.serviceTitle}
                  </p>
                  {order.tierName ? (
                    <p className="mt-1 text-xs font-medium text-primary">
                      {order.tierName}
                    </p>
                  ) : null}
                </td>
                <td className="px-5 py-4 font-medium text-foreground">
                  {order.creatorName}
                </td>
                <td className="px-5 py-4">
                  <OrderStatusBadge status={order.orderStatus} />
                </td>
                <td className="px-5 py-4">
                  <PaymentStatusBadge status={order.paymentStatus} />
                </td>
                <td className="px-5 py-4 text-right font-semibold text-foreground">
                  {formatCurrency(order.totalAmount)}
                </td>
                <td className="px-5 py-4 text-muted-foreground">
                  {order.deadline ? formatDate(order.deadline) : "Belum tersedia"}
                </td>
                <td className="px-5 py-4 text-right">
                  <Button asChild variant="outline">
                    <Link href={`/umkm/orders/${order.id}`}>Lihat Detail</Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 p-4 lg:hidden">
        {orders.map((order) => (
          <article
            key={order.id}
            className="rounded-2xl border border-border/70 bg-background p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-foreground">
                  {order.orderNumber}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {order.serviceTitle}
                </p>
              </div>
              <p className="text-right text-sm font-semibold text-foreground">
                {formatCurrency(order.totalAmount)}
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <OrderStatusBadge status={order.orderStatus} />
              <PaymentStatusBadge status={order.paymentStatus} />
            </div>
            <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
              <p>Kreator: {order.creatorName}</p>
              <p>
                Deadline:{" "}
                {order.deadline ? formatDate(order.deadline) : "Belum tersedia"}
              </p>
            </div>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link href={`/umkm/orders/${order.id}`}>Lihat Detail</Link>
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}

function EmptyOrdersState() {
  return (
    <section className="rounded-2xl border border-dashed border-border bg-card p-8 text-center shadow-xs">
      <div className="mx-auto grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
        <ClipboardList className="size-6" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
        Belum ada pesanan
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
        Setelah checkout brief campaign selesai, pesanan akan muncul di halaman ini
        dengan status pesanan dan pembayaran yang terpisah.
      </p>
      <Button asChild className="mt-5">
        <Link href="/katalog">Cari Kreator</Link>
      </Button>
    </section>
  );
}
