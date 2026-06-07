import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import {
  getOrderListItems,
  getOrdersForRole,
} from "@/features/orders/components/order-data";
import { OrderFilterBar } from "@/features/orders/components/order-filter-bar";
import { OrderListTable } from "@/features/orders/components/order-list-table";
import { OrderPageHero } from "@/features/orders/components/order-page-hero";

export const metadata: Metadata = {
  title: "Manajemen Pesanan - Admin Ruang Usaha Kita",
  description:
    "Overview semua pesanan dummy untuk admin, termasuk status pesanan, pembayaran, UMKM, kreator, brief, dan komplain.",
};

const orders = getOrdersForRole("admin");
const orderItems = getOrderListItems(orders, "admin");

export default function AdminOrdersPage() {
  return (
    <main>
      <PageContainer maxWidth="full" className="px-0 sm:px-0 lg:px-0">
        <div className="space-y-8">
          <OrderPageHero
            icon={BarChart3}
            eyebrow="Admin order monitoring"
            title="Pantau seluruh pesanan marketplace."
            description="Admin melihat konteks UMKM, kreator, pembayaran, brief campaign, status pesanan, dan komplain pada tampilan monitoring dummy."
            metricLabel="Total nilai pesanan"
            metricValue={orders.reduce((total, order) => total + order.totalAmount, 0)}
          />
          <OrderFilterBar showPaymentFilter />
          <OrderListTable items={orderItems} role="admin" />
        </div>
      </PageContainer>
    </main>
  );
}
