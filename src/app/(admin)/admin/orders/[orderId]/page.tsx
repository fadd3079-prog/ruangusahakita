import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/page-container";
import { getOrderDetail, getOrdersForRole } from "@/features/orders/components/order-data";
import { OrderDetailContent } from "@/features/orders/components/order-detail-content";

type OrderPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

const adminOrders = getOrdersForRole("admin");

export function generateStaticParams() {
  return adminOrders.map((order) => ({
    orderId: order.id,
  }));
}

export async function generateMetadata({
  params,
}: OrderPageProps): Promise<Metadata> {
  const { orderId } = await params;
  const data = getOrderDetail(orderId);

  if (!data) {
    return {
      title: "Pesanan tidak ditemukan - Ruang Usaha Kita",
    };
  }

  return {
    title: `${data.order.orderNumber} - Detail Pesanan Admin`,
    description:
      "Detail monitoring pesanan dummy admin, termasuk UMKM, kreator, pembayaran, brief, timeline, komplain, dan revisi.",
  };
}

export default async function AdminOrderDetailPage({ params }: OrderPageProps) {
  const { orderId } = await params;
  const data = getOrderDetail(orderId);

  if (!data) {
    notFound();
  }

  return (
    <main>
      <PageContainer maxWidth="full" className="px-0 sm:px-0 lg:px-0">
        <OrderDetailContent
          data={data}
          viewer="admin"
          actionTitle="Aksi monitoring admin"
          actionNote="Tombol ini hanya placeholder UI. Mediasi, override status, dan audit log belum diimplementasikan."
          actions={[
            "Tinjau Komplain",
            "Catat Mediasi",
            "Lihat Invoice",
            "Buka Activity Log",
          ]}
        />
      </PageContainer>
    </main>
  );
}
