import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { SubmitButton } from "@/components/common/submit-button";
import { Button } from "@/components/ui/button";
import { CampaignBriefForm } from "@/features/briefs/components/campaign-brief-form";
import { CheckoutGuidanceCard } from "@/features/checkout/components/checkout-guidance-card";
import { CheckoutOrderSummary } from "@/features/checkout/components/checkout-order-summary";
import { CheckoutStepper } from "@/features/checkout/components/checkout-stepper";
import { getCurrentCheckoutData } from "@/features/cart/data/cart-queries";
import { createOrderFromCheckout } from "@/features/orders/actions/order-actions";

export const metadata: Metadata = {
  title: "Checkout Brief Campaign - Ruang Usaha Kita",
  description:
    "Lengkapi brief campaign untuk paket jasa digital UMKM sebelum masuk tahap order dan pembayaran.",
};

type UmkmCheckoutPageProps = {
  searchParams: Promise<{
    error?: string;
    saved?: string;
  }>;
};

const errorMessages = {
  addon_unavailable: "Add-on layanan tidak tersedia. Periksa ulang keranjang Anda.",
  brief_asset_size: "Gambar aset brief maksimal 5 MB per file.",
  brief_asset_type: "Aset brief harus berupa gambar JPG, PNG, atau WebP.",
  brief_asset_upload: "Aset brief belum bisa diunggah. Coba lagi beberapa saat.",
  brief_required: "Nama usaha, kategori usaha, fokus promosi, dan tujuan campaign wajib diisi.",
  brief_save: "Brief campaign belum bisa disimpan.",
  cart_empty: "Keranjang layanan masih kosong.",
  not_authenticated: "Silakan masuk terlebih dahulu untuk membuat pesanan.",
  not_umkm: "Hanya akun UMKM aktif yang dapat membuat pesanan.",
  order_create: "Pesanan belum bisa dibuat. Periksa kembali keranjang dan brief campaign.",
  service_unavailable: "Paket jasa atau tier yang dipilih sedang tidak tersedia.",
  single_creator_required: "Checkout saat ini hanya mendukung layanan dari satu kreator.",
};

function getErrorMessage(error?: string) {
  if (!error) {
    return null;
  }

  return errorMessages[error as keyof typeof errorMessages] ?? "Checkout brief belum bisa diproses.";
}

export default async function UmkmCheckoutPage({
  searchParams,
}: UmkmCheckoutPageProps) {
  const [checkoutData, params] = await Promise.all([
    getCurrentCheckoutData(),
    searchParams,
  ]);
  const selectedItem = checkoutData.cart.items[0] ?? null;
  const errorMessage = getErrorMessage(params.error);

  if (!selectedItem) {
    return <CheckoutEmptyState errorMessage={errorMessage} />;
  }

  return (
    <main>
      <PageContainer>
        <div className="space-y-8">
          <section className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[var(--shadow-card)]">
            <div className="grid gap-6 bg-[linear-gradient(135deg,var(--surface-elevated),var(--surface-soft))] p-6 sm:p-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-end">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  <Sparkles className="size-4" aria-hidden="true" />
                  Checkout UMKM
                </p>
                <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  Checkout brief campaign
                </h1>
                <p className="mt-5 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                  Lengkapi arahan campaign agar kreator memahami tujuan promosi,
                  target audiens, gaya konten, dan kebutuhan revisi sejak awal.
                </p>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  Fokus tahap ini
                </h2>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                  {[
                    "Pastikan detail layanan sudah sesuai.",
                    "Isi brief campaign secara natural dan jelas.",
                    "Order dan pembayaran pending sandbox dibuat setelah brief siap.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2
                        className="mt-1 size-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {errorMessage ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive">
              {errorMessage}
            </div>
          ) : null}

          <CheckoutStepper />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <CheckoutGuidanceCard />
              <CampaignBriefForm
                brief={checkoutData.brief}
                saved={params.saved === "1"}
                umkm={checkoutData.umkm}
              />
            </div>
            <div className="space-y-6">
              <CheckoutOrderSummary
                item={selectedItem}
                businessName={checkoutData.umkm?.businessName ?? "UMKM"}
                serviceSubtotal={checkoutData.cart.serviceSubtotal}
                addonTotal={checkoutData.cart.addonTotal}
                adminFee={checkoutData.cart.adminFee}
                totalPayment={checkoutData.cart.totalPayment}
              />
              <CreateOrderPanel hasBrief={Boolean(checkoutData.brief)} />
            </div>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}

function CreateOrderPanel({ hasBrief }: { hasBrief: boolean }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-primary/20 bg-[linear-gradient(135deg,var(--brand-navy-950),var(--brand-teal-900))] p-5 text-white shadow-[var(--shadow-card)]">
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-white">
          <ShieldCheck className="size-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Buat pesanan dari brief ini
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/72">
            Sistem akan menghitung ulang total dari database, membuat status
            pesanan awal, pembayaran pending sandbox, dan invoice awal.
          </p>
        </div>
      </div>

      <form action={createOrderFromCheckout} className="mt-5">
        <SubmitButton
          pendingLabel="Melanjutkan..."
          disabled={!hasBrief}
          className="w-full bg-white text-primary hover:bg-white/90"
          icon={<ArrowRight className="size-4" aria-hidden="true" />}
        >
          Buat Pesanan
        </SubmitButton>
      </form>

      {!hasBrief ? (
        <p className="mt-3 text-xs leading-5 text-white/64">
          Simpan brief campaign terlebih dahulu sebelum membuat pesanan.
        </p>
      ) : null}
    </section>
  );
}

function CheckoutEmptyState({ errorMessage }: { errorMessage: string | null }) {
  return (
    <main>
      <PageContainer>
        <div className="space-y-4">
          {errorMessage ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive">
              {errorMessage}
            </div>
          ) : null}
          <section className="rounded-lg border border-dashed border-border bg-card p-8 text-center shadow-xs">
            <div className="mx-auto grid size-12 place-items-center rounded-lg bg-primary/10 text-primary">
              <BriefcaseBusiness className="size-6" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
              Belum ada layanan di keranjang
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Pilih paket jasa digital terlebih dahulu agar brief campaign dapat
              disusun dengan konteks yang jelas.
            </p>
            <Button asChild className="mt-5">
              <Link href="/katalog">Cari Kreator</Link>
            </Button>
          </section>
        </div>
      </PageContainer>
    </main>
  );
}
