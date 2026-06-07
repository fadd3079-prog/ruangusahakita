import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageContainer } from "@/components/layout/page-container";
import {
  InvoiceSummary,
  PaymentContextCard,
  PaymentDetailSummary,
} from "@/features/payments/components/payment-detail-summary";
import { PaymentMethodSelector } from "@/features/payments/components/payment-method-selector";
import {
  dummyCreators,
  dummyOrders,
  dummyPayments,
  dummyServicePackages,
  dummyUmkmProfiles,
} from "@/lib/dummy";

type PaymentPageProps = {
  params: Promise<{
    paymentId: string;
  }>;
};

const orderById = new Map(dummyOrders.map((order) => [order.id, order]));
const creatorById = new Map(dummyCreators.map((creator) => [creator.id, creator]));
const serviceById = new Map(
  dummyServicePackages.map((service) => [service.id, service]),
);
const umkmById = new Map(dummyUmkmProfiles.map((profile) => [profile.id, profile]));

export function generateStaticParams() {
  return dummyPayments.map((payment) => ({
    paymentId: payment.id,
  }));
}

export async function generateMetadata({
  params,
}: PaymentPageProps): Promise<Metadata> {
  const { paymentId } = await params;
  const payment = dummyPayments.find((item) => item.id === paymentId);

  if (!payment) {
    return {
      title: "Pembayaran tidak ditemukan - Ruang Usaha Kita",
    };
  }

  return {
    title: `${payment.paymentNumber} - Pembayaran Ruang Usaha Kita`,
    description:
      "Detail pembayaran dummy untuk paket jasa digital UMKM, termasuk invoice, status pembayaran, dan ringkasan pesanan.",
  };
}

export default async function UmkmPaymentDetailPage({
  params,
}: PaymentPageProps) {
  const { paymentId } = await params;
  const payment = dummyPayments.find((item) => item.id === paymentId);

  if (!payment) {
    notFound();
  }

  const order = orderById.get(payment.orderId);

  if (!order) {
    notFound();
  }

  const creator = creatorById.get(order.creatorId);
  const service = serviceById.get(order.servicePackageId);
  const umkm = umkmById.get(order.umkmId);

  if (!creator || !service || !umkm) {
    notFound();
  }

  return (
    <main>
      <PageContainer maxWidth="full" className="px-0 sm:px-0 lg:px-0">
        <div className="space-y-8">
          <PaymentDetailSummary
            payment={payment}
            order={order}
            service={service}
            creator={creator}
            umkm={umkm}
          />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-6">
              <PaymentMethodSelector selectedMethod={payment.paymentMethod} />
              <PaymentContextCard payment={payment} order={order} />
            </div>
            <InvoiceSummary
              payment={payment}
              order={order}
              service={service}
              creator={creator}
            />
          </div>
        </div>
      </PageContainer>
    </main>
  );
}
