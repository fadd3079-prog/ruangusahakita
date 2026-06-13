import type { Metadata } from "next";
import Link from "next/link";
import { Inbox } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { OrderFilterBar } from "@/features/orders/components/order-filter-bar";
import type { OrderListFilters } from "@/features/orders/components/order-filter-bar";
import { OrderPageHero } from "@/features/orders/components/order-page-hero";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
import {
  getCurrentCreatorOrders,
  type CreatorOrderListItem,
} from "@/features/orders/data/order-queries";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";
import type { Database } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Order Masuk - Kreator Ruang Usaha Kita",
  description:
    "Daftar order kreator yang sudah dibayar untuk membaca brief campaign, memantau status pesanan, dan memulai pekerjaan jasa digital.",
};

type OrderStatus = Database["public"]["Enums"]["order_status"];
type PaymentStatus = Database["public"]["Enums"]["payment_status"];

type CreatorOrdersPageProps = {
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

export default async function CreatorOrdersPage({
  searchParams,
}: CreatorOrdersPageProps) {
  const [orders, params] = await Promise.all([
    getCurrentCreatorOrders(),
    searchParams ??
      Promise.resolve({
        payment: undefined,
        q: undefined,
        sort: undefined,
        status: undefined,
      }),
  ]);
  const filters = parseFilters(params);
  const visibleOrders = filterOrders(orders, filters);
  const activeOrders = orders.filter(
    (order) =>
      order.orderStatus === "waiting_creator_confirmation" ||
      order.orderStatus === "brief_accepted" ||
      order.orderStatus === "in_progress",
  );

  return (
    <main>
      <PageContainer>
        <div className="space-y-8">
          <OrderPageHero
            icon={Inbox}
            eyebrow="Order kreator"
            title="Order berbayar yang siap diproses."
            description="Baca brief campaign dari UMKM, cek scope layanan, lalu terima brief atau mulai pengerjaan sesuai status pesanan."
            metricLabel="Order aktif"
            metricValue={`${activeOrders.length} pesanan`}
          />
          <OrderFilterBar filters={filters} showPaymentFilter />
          {visibleOrders.length > 0 ? (
            <CreatorOrderList orders={visibleOrders} />
          ) : (
            <EmptyCreatorOrdersState />
          )}
        </div>
      </PageContainer>
    </main>
  );
}

function parseFilters(
  params: Awaited<NonNullable<CreatorOrdersPageProps["searchParams"]>>,
): OrderListFilters {
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
  orders: readonly CreatorOrderListItem[],
  filters: OrderListFilters,
) {
  const query = filters.query.toLowerCase();

  return orders
    .filter((order) => {
      const searchTarget = [
        order.orderNumber,
        order.serviceTitle,
        order.umkmBusinessName,
        order.umkmBusinessCategory,
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

function CreatorOrderList({
  orders,
}: {
  orders: readonly CreatorOrderListItem[];
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-card)]">
      <div className="border-b border-border/70 bg-muted/30 px-5 py-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Daftar order
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Hanya order dengan pembayaran paid yang ditampilkan untuk kreator.
        </p>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border/70 bg-background/60 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-semibold">Order</th>
              <th className="px-5 py-3 font-semibold">UMKM</th>
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
                <td className="px-5 py-4">
                  <p className="font-medium text-foreground">
                    {order.umkmBusinessName}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {order.umkmBusinessCategory ?? "Kategori belum diisi"}
                  </p>
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
                    <Link href={`/creator/orders/${order.id}`}>Buka Brief</Link>
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
              <p>UMKM: {order.umkmBusinessName}</p>
              <p>
                Deadline:{" "}
                {order.deadline ? formatDate(order.deadline) : "Belum tersedia"}
              </p>
            </div>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link href={`/creator/orders/${order.id}`}>Buka Brief</Link>
            </Button>
          </article>
        ))}
      </div>
    </section>
  );
}

function EmptyCreatorOrdersState() {
  return (
    <section className="rounded-2xl border border-dashed border-border bg-card p-8 text-center shadow-xs">
      <div className="mx-auto grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
        <Inbox className="size-6" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
        Belum ada order berbayar
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
        Order akan muncul setelah pembayaran UMKM berhasil dan status pesanan
        menunggu konfirmasi kreator.
      </p>
      <Button asChild className="mt-5">
        <Link href="/creator/dashboard">Kembali ke Dashboard</Link>
      </Button>
    </section>
  );
}
