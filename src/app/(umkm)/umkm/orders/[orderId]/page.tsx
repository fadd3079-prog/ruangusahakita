import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/page-container";
import {
  currentDummyUmkmId,
  getOrderDetail,
  getOrdersForRole,
} from "@/features/orders/components/order-data";
import { OrderDetailContent } from "@/features/orders/components/order-detail-content";

type OrderPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

const umkmOrders = getOrdersForRole("umkm");

export function generateStaticParams() {
  return umkmOrders.map((order) => ({
    orderId: order.id,
  }));
}

export async function generateMetadata({
  params,
}: OrderPageProps): Promise<Metadata> {
  const { orderId } = await params;
  const data = getOrderDetail(orderId);

  if (!data || data.order.umkmId !== currentDummyUmkmId) {
    return {
      title: "Pesanan tidak ditemukan - Ruang Usaha Kita",
    };
  }

  return {
    title: `${data.order.orderNumber} - Pesanan UMKM`,
    description:
      "Detail pesanan dummy UMKM, termasuk brief campaign, pembayaran, status pesanan, hasil konten, dan revisi.",
  };
}

export default async function UmkmOrderDetailPage({ params }: OrderPageProps) {
  const { orderId } = await params;
  const data = getOrderDetail(orderId);

  if (!data || data.order.umkmId !== currentDummyUmkmId) {
    notFound();
  }

  return (
    <main>
      <PageContainer>
        <OrderDetailContent
          data={data}
          viewer="umkm"
          actionTitle="Aksi UMKM"
          actionNote="Semua tombol berikut masih placeholder UI. Revisi, approval, dan review belum mengubah data dummy."
          actions={[
            "Minta Revisi",
            "Setujui Hasil Konten",
            "Beri Review",
          ]}
        />
      </PageContainer>
    </main>
  );
}
