import type { Metadata } from "next";
import { FileCheck2 } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { OrderPageHero } from "@/features/orders/components/order-page-hero";
import {
  ResultsList,
  type ResultListItem,
} from "@/features/results/components/results-list";
import {
  dummyCreators,
  dummyOrders,
  dummyServicePackages,
  type DummyOrderStatus,
} from "@/lib/dummy";

export const metadata: Metadata = {
  title: "File Hasil Konten - Ruang Usaha Kita",
  description:
    "Daftar hasil konten dummy untuk UMKM, termasuk order, kreator, paket jasa, status review, revisi, dan tautan hasil placeholder.",
};

const resultStatuses = [
  "submitted",
  "revision_requested",
  "revised",
  "completed",
] satisfies readonly DummyOrderStatus[];

const resultStatusSet = new Set<DummyOrderStatus>(resultStatuses);

const creatorById = new Map(dummyCreators.map((creator) => [creator.id, creator]));
const serviceById = new Map(
  dummyServicePackages.map((service) => [service.id, service]),
);

const resultItems: readonly ResultListItem[] = dummyOrders
  .filter((order) => resultStatusSet.has(order.orderStatus))
  .flatMap((order) => {
    const creator = creatorById.get(order.creatorId);
    const service = serviceById.get(order.servicePackageId);

    if (!creator || !service) {
      return [];
    }

    return [
      {
        creator,
        order,
        service,
      },
    ];
  });

export default function UmkmResultsPage() {
  return (
    <main>
      <PageContainer maxWidth="full" className="px-0 sm:px-0 lg:px-0">
        <div className="space-y-8">
          <OrderPageHero
            icon={FileCheck2}
            eyebrow="File hasil UMKM"
            title="Hasil konten yang sudah masuk."
            description="Lihat hasil konten dummy dari kreator, status review, revisi, dan tautan placeholder untuk membuka detail pesanan."
            metricLabel="Hasil konten"
            metricValue={`${resultItems.length} submission`}
          />
          <ResultsList items={resultItems} />
        </div>
      </PageContainer>
    </main>
  );
}
