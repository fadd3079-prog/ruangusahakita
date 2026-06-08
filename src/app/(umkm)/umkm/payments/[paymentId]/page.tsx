import type { Metadata } from "next";
import Link from "next/link";
import { WalletCards } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import {
  InvoiceSummary,
  PaymentContextCard,
  PaymentDetailSummary,
} from "@/features/payments/components/payment-detail-summary";
import { PaymentMethodSelector } from "@/features/payments/components/payment-method-selector";
import { getCurrentUmkmPaymentDetail } from "@/features/payments/data/payment-queries";

type PaymentPageProps = {
  params: Promise<{
    paymentId: string;
  }>;
  searchParams?: Promise<{
    error?: string;
  }>;
};

const errorMessages = {
  not_authenticated: "Silakan masuk terlebih dahulu untuk memproses pembayaran.",
  not_umkm: "Hanya akun UMKM aktif yang dapat memproses pembayaran.",
  payment_amount_mismatch:
    "Nominal pembayaran tidak cocok dengan total pesanan. Hubungi admin untuk pengecekan.",
  payment_not_payable:
    "Pembayaran ini tidak dapat disimulasikan karena statusnya sudah berubah atau pesanan tidak lagi menunggu pembayaran.",
  payment_update: "Pembayaran belum bisa diproses saat ini.",
};

function getErrorMessage(error?: string) {
  if (!error) {
    return null;
  }

  return errorMessages[error as keyof typeof errorMessages] ?? errorMessages.payment_update;
}

export async function generateMetadata({
  params,
}: PaymentPageProps): Promise<Metadata> {
  const { paymentId } = await params;
  const detail = await getCurrentUmkmPaymentDetail(paymentId);

  if (!detail) {
    return {
      title: "Pembayaran tidak ditemukan - Ruang Usaha Kita",
    };
  }

  return {
    title: `${detail.payment.payment_number} - Pembayaran Ruang Usaha Kita`,
    description:
      "Detail pembayaran dummy untuk paket jasa digital UMKM, termasuk invoice, status pembayaran, dan ringkasan pesanan.",
  };
}

export default async function UmkmPaymentDetailPage({
  params,
  searchParams,
}: PaymentPageProps) {
  const [{ paymentId }, query] = await Promise.all([
    params,
    searchParams ?? Promise.resolve({ error: undefined }),
  ]);
  const [detail] = await Promise.all([getCurrentUmkmPaymentDetail(paymentId)]);
  const errorMessage = getErrorMessage(query.error);

  if (!detail) {
    return <PaymentEmptyState errorMessage={errorMessage} />;
  }

  return (
    <main>
      <PageContainer>
        <div className="space-y-8">
          {errorMessage ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive">
              {errorMessage}
            </div>
          ) : null}

          <PaymentDetailSummary detail={detail} />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-6">
              <PaymentMethodSelector selectedMethod={detail.payment.payment_method} />
              <PaymentContextCard detail={detail} />
            </div>
            <InvoiceSummary detail={detail} />
          </div>
        </div>
      </PageContainer>
    </main>
  );
}

function PaymentEmptyState({ errorMessage }: { errorMessage: string | null }) {
  return (
    <main>
      <PageContainer>
        <div className="space-y-4">
          {errorMessage ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive">
              {errorMessage}
            </div>
          ) : null}
          <section className="rounded-2xl border border-dashed border-border bg-card p-8 text-center shadow-xs">
            <div className="mx-auto grid size-12 place-items-center rounded-xl bg-primary/10 text-primary">
              <WalletCards className="size-6" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
              Pembayaran tidak ditemukan
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Data pembayaran mungkin belum tersedia, sudah tidak bisa diakses,
              atau bukan bagian dari akun UMKM ini.
            </p>
            <Button asChild className="mt-5">
              <Link href="/umkm/orders">Lihat Pesanan</Link>
            </Button>
          </section>
        </div>
      </PageContainer>
    </main>
  );
}
