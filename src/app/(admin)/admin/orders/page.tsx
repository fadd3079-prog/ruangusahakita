import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3 } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAdminOrders } from "@/features/admin/data/admin-management-queries";
import {
  OrderFilterBar,
  type OrderListFilters,
} from "@/features/orders/components/order-filter-bar";
import { OrderPageHero } from "@/features/orders/components/order-page-hero";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";
import type { Database } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Manajemen Pesanan - Admin Ruang Usaha Kita",
  description:
    "Overview semua pesanan untuk admin, termasuk status pesanan, pembayaran, UMKM, kreator, dan brief campaign.",
};

type OrderStatus = Database["public"]["Enums"]["order_status"];
type PaymentStatus = Database["public"]["Enums"]["payment_status"];

type AdminOrdersPageProps = {
  searchParams: Promise<{
    payment?: string;
    q?: string;
    sort?: string;
    status?: string;
  }>;
};

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const params = await searchParams;
  const orders = await getAdminOrders();
  const filters = getFilters(params);
  const filteredOrders = orders
    .filter((order) => {
      const searchable = `${order.order_number} ${order.serviceTitle ?? ""} ${order.tierName ?? ""} ${order.creatorName ?? ""} ${order.umkmName ?? ""}`.toLowerCase();
      const matchesQuery = filters.query ? searchable.includes(filters.query) : true;
      const matchesStatus = filters.status === "all" ? true : order.order_status === filters.status;
      const matchesPayment =
        filters.paymentStatus === "all" ? true : order.payment_status === filters.paymentStatus;

      return matchesQuery && matchesStatus && matchesPayment;
    })
    .toSorted((left, right) => {
      if (filters.sort === "deadline") {
        return new Date(left.deadline ?? left.created_at).getTime() - new Date(right.deadline ?? right.created_at).getTime();
      }

      if (filters.sort === "total") {
        return Number(right.total_amount) - Number(left.total_amount);
      }

      return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
    });
  const totalValue = orders.reduce(
    (total, order) => total + Number(order.total_amount),
    0,
  );

  return (
    <PageContainer>
      <div className="space-y-8">
        <OrderPageHero
          icon={BarChart3}
          eyebrow="Admin order monitoring"
          title="Pantau seluruh pesanan marketplace."
          description="Admin melihat konteks UMKM, kreator, pembayaran, brief campaign, dan status pesanan pada tampilan monitoring read-only."
          metricLabel="Total nilai pesanan"
          metricValue={totalValue}
        />
        <OrderFilterBar filters={filters} showPaymentFilter />
        <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-card)]">
          {filteredOrders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>Pesanan</TableHead>
                  <TableHead>UMKM & kreator</TableHead>
                  <TableHead>Status pesanan</TableHead>
                  <TableHead>Pembayaran</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <p className="max-w-[220px] truncate font-semibold text-foreground">
                        {order.order_number}
                      </p>
                      <p className="mt-1 max-w-[260px] truncate text-sm text-muted-foreground">
                        {order.serviceTitle ?? "Paket jasa digital"}
                      </p>
                      {order.tierName ? (
                        <p className="mt-1 max-w-[220px] truncate text-xs font-medium text-primary">
                          {order.tierName}
                        </p>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <p className="max-w-[200px] truncate font-medium text-foreground">
                        {order.umkmName ?? "UMKM"}
                      </p>
                      <p className="mt-1 max-w-[200px] truncate text-xs text-muted-foreground">
                        {order.creatorName ?? "Kreator"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.order_status} />
                    </TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={order.payment_status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.deadline ? formatDate(order.deadline) : "Belum tersedia"}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-foreground">
                      {formatCurrency(Number(order.total_amount))}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline">
                        <Link href={`/admin/orders/${order.id}`}>Detail</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center text-sm text-muted-foreground">
              Belum ada pesanan yang sesuai
            </div>
          )}
        </section>
      </div>
    </PageContainer>
  );
}

function getFilters(params: Awaited<AdminOrdersPageProps["searchParams"]>): OrderListFilters {
  const status = isOrderStatusFilter(params.status) ? params.status : "all";
  const paymentStatus = isPaymentStatusFilter(params.payment) ? params.payment : "all";
  const sort = isSortFilter(params.sort) ? params.sort : "latest";

  return {
    paymentStatus,
    query: params.q?.trim().toLowerCase() ?? "",
    sort,
    status,
  };
}

function isOrderStatusFilter(value?: string): value is OrderStatus | "all" {
  return (
    value === "all" ||
    value === "awaiting_payment" ||
    value === "paid" ||
    value === "waiting_creator_confirmation" ||
    value === "brief_accepted" ||
    value === "in_progress" ||
    value === "submitted" ||
    value === "revision_requested" ||
    value === "revised" ||
    value === "completed" ||
    value === "cancelled" ||
    value === "refunded"
  );
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

function isSortFilter(value?: string): value is OrderListFilters["sort"] {
  return value === "latest" || value === "deadline" || value === "total";
}
