import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CheckCircle2, ShieldCheck } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { SubmitButton } from "@/components/common/submit-button";
import { Button } from "@/components/ui/button";
import { AiSmartBriefPanel } from "@/features/briefs/components/ai-smart-brief-panel";
import { CampaignBriefForm } from "@/features/briefs/components/campaign-brief-form";
import { CheckoutOrderSummary } from "@/features/checkout/components/checkout-order-summary";
import { CheckoutStepper } from "@/features/checkout/components/checkout-stepper";
import { getCurrentCheckoutData } from "@/features/cart/data/cart-queries";
import { createOrderFromCheckout } from "@/features/orders/actions/order-actions";
import {
  parseCheckoutSelection,
  type CheckoutSelection,
} from "@/features/checkout/lib/checkout-source";

export const metadata: Metadata = {
  title: "Checkout Brief Campaign - Ruang Usaha Kita",
  description:
    "Lengkapi brief campaign untuk paket jasa digital UMKM sebelum masuk tahap order dan pembayaran.",
};

type UmkmCheckoutPageProps = {
  searchParams: Promise<{
    addonIds?: string | string[];
    error?: string;
    saved?: string;
    serviceId?: string;
    source?: string;
    tierId?: string;
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
  const params = await searchParams;
  const checkoutSelection = parseCheckoutSelection(params);
  const checkoutData = await getCurrentCheckoutData(checkoutSelection);
  const selectedItem = checkoutData.cart.items[0] ?? null;
  const resolvedCheckoutSelection =
    checkoutSelection.source === "direct" && selectedItem?.tierId
      ? { ...checkoutSelection, tierId: selectedItem.tierId }
      : checkoutSelection;
  const errorMessage = getErrorMessage(params.error);

  if (!selectedItem) {
    return (
      <CheckoutEmptyState
        errorMessage={errorMessage}
        source={checkoutSelection.source}
      />
    );
  }

  return (
    <main>
      <PageContainer>
        <div className="mx-auto max-w-[1180px] space-y-5 pb-6">
          <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-primary">
                  {checkoutSelection.source === "direct" ? "Pesan sekarang" : "Checkout"}
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Isi brief campaign
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Simpan brief, lalu buat pesanan untuk masuk ke pembayaran.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900">
                <CheckCircle2 className="size-4" aria-hidden="true" />
                Total dihitung server
              </div>
            </div>
          </section>

          {errorMessage ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive">
              {errorMessage}
            </div>
          ) : null}

          <CheckoutStepper />

          <details className="rounded-2xl border border-border/70 bg-card p-4 shadow-[var(--shadow-soft)] lg:hidden">
            <summary className="cursor-pointer text-sm font-semibold text-foreground">
              Lihat ringkasan layanan dan biaya
            </summary>
            <div className="mt-4">
              <CheckoutOrderSummary
                item={selectedItem}
                businessName={checkoutData.umkm?.businessName ?? "UMKM"}
                serviceSubtotal={checkoutData.cart.serviceSubtotal}
                addonTotal={checkoutData.cart.addonTotal}
                adminFee={checkoutData.cart.adminFee}
                totalPayment={checkoutData.cart.totalPayment}
              />
            </div>
          </details>

          <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="min-w-0 space-y-6">
              <AiSmartBriefPanel />
              <CampaignBriefForm
                brief={checkoutData.brief}
                checkoutSelection={resolvedCheckoutSelection}
                saved={params.saved === "1"}
                umkm={checkoutData.umkm}
              />
            </div>
            <div className="hidden min-w-0 space-y-4 lg:block lg:sticky lg:top-6 lg:self-start">
              <CheckoutOrderSummary
                item={selectedItem}
                businessName={checkoutData.umkm?.businessName ?? "UMKM"}
                serviceSubtotal={checkoutData.cart.serviceSubtotal}
                addonTotal={checkoutData.cart.addonTotal}
                adminFee={checkoutData.cart.adminFee}
                totalPayment={checkoutData.cart.totalPayment}
              />
              <CreateOrderPanel
                checkoutSelection={resolvedCheckoutSelection}
                hasBrief={Boolean(checkoutData.brief)}
              />
            </div>
          </div>

          <div className="lg:hidden">
            <CreateOrderPanel
              checkoutSelection={resolvedCheckoutSelection}
              hasBrief={Boolean(checkoutData.brief)}
            />
          </div>
        </div>
      </PageContainer>
    </main>
  );
}

function CreateOrderPanel({
  checkoutSelection,
  hasBrief,
}: {
  checkoutSelection: CheckoutSelection;
  hasBrief: boolean;
}) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
          <ShieldCheck className="size-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Buat pesanan
          </h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Pesanan dan invoice dibuat setelah brief tersimpan.
          </p>
        </div>
      </div>

      <form action={createOrderFromCheckout} className="mt-5">
        <input type="hidden" name="checkoutSource" value={checkoutSelection.source} />
        {checkoutSelection.source === "direct" ? (
          <>
            <input type="hidden" name="serviceId" value={checkoutSelection.serviceId} />
            {checkoutSelection.tierId ? (
              <input type="hidden" name="tierId" value={checkoutSelection.tierId} />
            ) : null}
            {checkoutSelection.addonIds.map((addonId) => (
              <input key={addonId} type="hidden" name="addonIds" value={addonId} />
            ))}
          </>
        ) : null}
        <SubmitButton
          pendingLabel="Melanjutkan..."
          disabled={!hasBrief}
          className="h-11 w-full bg-blue-600 text-white hover:bg-blue-700"
          icon={<ArrowRight className="size-4" aria-hidden="true" />}
        >
          Buat Pesanan
        </SubmitButton>
      </form>

      {!hasBrief ? (
        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          Simpan brief campaign terlebih dahulu sebelum membuat pesanan.
        </p>
      ) : null}
    </section>
  );
}

function CheckoutEmptyState({
  errorMessage,
  source,
}: {
  errorMessage: string | null;
  source: CheckoutSelection["source"];
}) {
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
              {source === "direct"
                ? "Layanan tidak tersedia"
                : "Belum ada layanan di keranjang"}
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              {source === "direct"
                ? "Pilih kembali layanan dan tier yang tersedia."
                : "Pilih layanan terlebih dahulu agar brief memiliki konteks yang jelas."}
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
