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
import { OrderFilterBar } from "@/features/orders/components/order-filter-bar";
import { OrderPageHero } from "@/features/orders/components/order-page-hero";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";

export const metadata: Metadata = {
  title: "Manajemen Pesanan - Admin Ruang Usaha Kita",
  description:
    "Overview semua pesanan untuk admin, termasuk status pesanan, pembayaran, UMKM, kreator, dan brief campaign.",
};

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();
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
        <OrderFilterBar showPaymentFilter />
        <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-card)]">
          {orders.length > 0 ? (
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
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <p className="font-semibold text-foreground">
                        {order.order_number}
                      </p>
                      <p className="mt-1 max-w-[260px] truncate text-sm text-muted-foreground">
                        {order.serviceTitle ?? "Paket jasa digital"}
                      </p>
                      {order.tierName ? (
                        <p className="mt-1 text-xs font-medium text-primary">
                          {order.tierName}
                        </p>
                      ) : null}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-foreground">
                        {order.umkmName ?? "UMKM"}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
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
              Belum ada pesanan
            </div>
          )}
        </section>
      </div>
    </PageContainer>
  );
}
