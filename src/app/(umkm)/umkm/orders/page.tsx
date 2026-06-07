import type { Metadata } from "next";
import { ClipboardList } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import {
  getOrderListItems,
  getOrdersForRole,
} from "@/features/orders/components/order-data";
import { OrderFilterBar } from "@/features/orders/components/order-filter-bar";
import { OrderListTable } from "@/features/orders/components/order-list-table";
import { OrderPageHero } from "@/features/orders/components/order-page-hero";

export const metadata: Metadata = {
  title: "Pesanan Saya - Ruang Usaha Kita",
  description:
    "Daftar pesanan dummy UMKM untuk memantau status pesanan, pembayaran, brief campaign, hasil konten, dan revisi.",
};

const orders = getOrdersForRole("umkm");
const orderItems = getOrderListItems(orders, "umkm");

export default function UmkmOrdersPage() {
  return (
    <main>
      <PageContainer maxWidth="full" className="px-0 sm:px-0 lg:px-0">
        <div className="space-y-8">
          <OrderPageHero
            icon={ClipboardList}
            eyebrow="Pesanan UMKM"
            title="Pantau pesanan jasa digital Anda."
            description="Lihat kreator, paket jasa, status pesanan, status pembayaran, total, dan deadline dalam satu ruang kerja dummy."
            metricLabel="Total pembayaran"
            metricValue={orders.reduce((total, order) => total + order.totalAmount, 0)}
          />
          <OrderFilterBar showPaymentFilter />
          <OrderListTable items={orderItems} role="umkm" />
        </div>
      </PageContainer>
    </main>
  );
}
