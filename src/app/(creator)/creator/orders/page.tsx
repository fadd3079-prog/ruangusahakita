import type { Metadata } from "next";
import { Inbox } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import {
  getOrderListItems,
  getOrdersForRole,
} from "@/features/orders/components/order-data";
import { OrderFilterBar } from "@/features/orders/components/order-filter-bar";
import { OrderListTable } from "@/features/orders/components/order-list-table";
import { OrderPageHero } from "@/features/orders/components/order-page-hero";

export const metadata: Metadata = {
  title: "Order Masuk - Kreator Ruang Usaha Kita",
  description:
    "Daftar order dummy untuk kreator, termasuk brief campaign, status pesanan, pembayaran, deadline, dan CTA placeholder.",
};

const orders = getOrdersForRole("creator");
const orderItems = getOrderListItems(orders, "creator");

export default function CreatorOrdersPage() {
  return (
    <main>
      <PageContainer maxWidth="full" className="px-0 sm:px-0 lg:px-0">
        <div className="space-y-8">
          <OrderPageHero
            icon={Inbox}
            eyebrow="Order kreator"
            title="Order masuk dan proses konten aktif."
            description="Kreator dapat membaca brief, melihat scope layanan, memantau pembayaran, dan menyiapkan hasil konten pada UI dummy ini."
            metricLabel="Order aktif"
            metricValue={`${orders.length} pesanan`}
          />
          <OrderFilterBar showPaymentFilter />
          <OrderListTable items={orderItems} role="creator" />
        </div>
      </PageContainer>
    </main>
  );
}
