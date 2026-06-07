import type { Metadata } from "next";
import Link from "next/link";
import { BriefcaseBusiness, CheckCircle2, Sparkles } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { CampaignBriefForm } from "@/features/briefs/components/campaign-brief-form";
import type { CartDisplayItem } from "@/features/cart/components/cart-service-summary";
import { CheckoutGuidanceCard } from "@/features/checkout/components/checkout-guidance-card";
import { CheckoutOrderSummary } from "@/features/checkout/components/checkout-order-summary";
import { CheckoutStepper } from "@/features/checkout/components/checkout-stepper";
import {
  dummyCampaignBriefs,
  dummyCarts,
  dummyOrders,
  dummyPayments,
  dummyServiceCategories,
  dummyServicePackages,
  dummyServiceTiers,
  dummyUmkmProfiles,
  type DummyCart,
} from "@/lib/dummy";

export const metadata: Metadata = {
  title: "Checkout Brief Campaign - Ruang Usaha Kita",
  description:
    "Lengkapi brief campaign untuk paket jasa digital UMKM sebelum melanjutkan ke pembayaran dummy.",
};

const activeCart = dummyCarts.find((cart) => cart.status === "active") ?? null;

export default function UmkmCheckoutPage() {
  if (!activeCart) {
    return <CheckoutEmptyState />;
  }

  const displayItems = getCartDisplayItems(activeCart);
  const selectedItem = displayItems[0] ?? null;

  if (!selectedItem) {
    return <CheckoutEmptyState />;
  }

  const umkm =
    dummyUmkmProfiles.find((profile) => profile.id === activeCart.umkmId) ??
    null;
  const brief =
    dummyCampaignBriefs.find((entry) => entry.umkmId === activeCart.umkmId) ??
    null;
  const order = brief?.orderId
    ? dummyOrders.find((entry) => entry.id === brief.orderId) ?? null
    : null;
  const payment = order
    ? dummyPayments.find((entry) => entry.id === order.paymentId) ?? null
    : null;
  const paymentHref = `/umkm/payments/${payment?.id ?? "payment_001"}`;

  return (
    <main>
      <PageContainer maxWidth="full" className="px-0 sm:px-0 lg:px-0">
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
                    "Pembayaran masih berupa simulasi alur.",
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

          <CheckoutStepper />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <CheckoutGuidanceCard />
              <CampaignBriefForm
                brief={brief}
                umkm={umkm}
                paymentHref={paymentHref}
              />
            </div>
            <div className="space-y-6">
              <CheckoutOrderSummary
                item={selectedItem}
                businessName={umkm?.businessName ?? "UMKM"}
                serviceSubtotal={activeCart.subtotalAmount}
                addonTotal={activeCart.addonAmount}
                adminFee={activeCart.adminFee}
                totalPayment={activeCart.totalAmount}
              />
            </div>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}

function getCartDisplayItems(cart: DummyCart): readonly CartDisplayItem[] {
  return cart.items.map((item) => {
    const tier = dummyServiceTiers.find((entry) => entry.id === item.tierId);
    const service = dummyServicePackages.find(
      (entry) => entry.id === item.servicePackageId,
    );
    const category = service
      ? dummyServiceCategories.find((entry) => entry.id === service.categoryId)
      : null;

    return {
      id: item.id,
      serviceTitle: item.serviceTitle,
      creatorName: item.creatorName,
      tierName: item.tierName,
      tierPrice: tier?.price ?? item.unitPrice,
      addonTotal: item.addonTotal,
      categoryName: category?.name ?? "Layanan Digital",
      categoryDescription:
        category?.description ??
        "Layanan digital untuk kebutuhan promosi UMKM.",
      subtotal: item.subtotal,
      estimatedDays: item.estimatedDays,
      revisionCount: item.revisionCount,
      deliverables: tier?.deliverables ?? service?.deliverables ?? [],
      addons: item.addons,
    };
  });
}

function CheckoutEmptyState() {
  return (
    <main>
      <PageContainer maxWidth="full" className="px-0 sm:px-0 lg:px-0">
        <section className="rounded-lg border border-dashed border-border bg-card p-8 text-center shadow-xs">
          <div className="mx-auto grid size-12 place-items-center rounded-lg bg-primary/10 text-primary">
            <BriefcaseBusiness className="size-6" aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
            Belum ada paket jasa untuk checkout.
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Pilih paket jasa digital terlebih dahulu agar brief campaign dapat
            disusun dengan konteks yang jelas.
          </p>
          <Button asChild className="mt-5">
            <Link href="/umkm/cart">Kembali ke Keranjang</Link>
          </Button>
        </section>
      </PageContainer>
    </main>
  );
}
