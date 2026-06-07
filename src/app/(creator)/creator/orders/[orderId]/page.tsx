import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/page-container";
import {
  currentDummyCreatorId,
  getOrderDetail,
  getOrdersForRole,
} from "@/features/orders/components/order-data";
import { OrderDetailContent } from "@/features/orders/components/order-detail-content";

type OrderPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

const creatorOrders = getOrdersForRole("creator");

export function generateStaticParams() {
  return creatorOrders.map((order) => ({
    orderId: order.id,
  }));
}

export async function generateMetadata({
  params,
}: OrderPageProps): Promise<Metadata> {
  const { orderId } = await params;
  const data = getOrderDetail(orderId);

  if (!data || data.order.creatorId !== currentDummyCreatorId) {
    return {
      title: "Order tidak ditemukan - Ruang Usaha Kita",
    };
  }

  return {
    title: `${data.order.orderNumber} - Detail Order Kreator`,
    description:
      "Detail order dummy kreator, termasuk brief UMKM, scope layanan, status pesanan, pembayaran, hasil konten, dan revisi.",
  };
}

export default async function CreatorOrderDetailPage({ params }: OrderPageProps) {
  const { orderId } = await params;
  const data = getOrderDetail(orderId);

  if (!data || data.order.creatorId !== currentDummyCreatorId) {
    notFound();
  }

  return (
    <main>
      <PageContainer maxWidth="full" className="px-0 sm:px-0 lg:px-0">
        <OrderDetailContent
          data={data}
          viewer="creator"
          actionTitle="Aksi kreator"
          actionNote="Tombol ini hanya placeholder UI. Perubahan status produksi harus dibuat server-side pada tahap integrasi."
          actions={[
            "Terima Order",
            "Mulai Pengerjaan",
            "Kirim Hasil",
            "Kirim Revisi",
          ]}
        />
      </PageContainer>
    </main>
  );
}
