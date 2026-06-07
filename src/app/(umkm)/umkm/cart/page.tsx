import type { Metadata } from "next";
import Link from "next/link";
import { BriefcaseBusiness, CheckCircle2, FileText, Sparkles } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { CartGuidanceCards } from "@/features/cart/components/cart-guidance-cards";
import { CartPaymentSummary } from "@/features/cart/components/cart-payment-summary";
import {
  CartServiceSummary,
  type CartDisplayItem,
} from "@/features/cart/components/cart-service-summary";
import {
  dummyCarts,
  dummyServiceCategories,
  dummyServicePackages,
  dummyServiceTiers,
  type DummyCart,
} from "@/lib/dummy";

export const metadata: Metadata = {
  title: "Keranjang Layanan - Ruang Usaha Kita",
  description:
    "Tinjau paket jasa digital, add-on, biaya admin, dan total pembayaran sebelum melanjutkan ke checkout brief campaign.",
};

const activeCart = dummyCarts.find((cart) => cart.status === "active") ?? null;

export default function UmkmCartPage() {
  if (!activeCart) {
    return <CartEmptyState />;
  }

  const displayItems = getCartDisplayItems(activeCart);

  return (
    <main>
      <PageContainer>
        <div className="space-y-8">
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,var(--brand-navy-950),var(--brand-teal-900))] text-white shadow-[var(--shadow-card)]">
            <div className="grid gap-8 p-6 sm:p-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-end">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-semibold text-white/80">
                  <Sparkles className="size-4" aria-hidden="true" />
                  UMKM Checkout
                </p>
                <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Keranjang layanan untuk brief campaign yang lebih terarah.
                </h1>
                <p className="mt-5 max-w-3xl text-sm leading-6 text-white/72 sm:text-base">
                  Tinjau paket jasa digital, kreator, output, estimasi pengerjaan,
                  revisi, add-on, dan total pembayaran sebelum menyusun brief
                  campaign.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <FileText className="size-5 text-white" aria-hidden="true" />
                <h2 className="mt-4 text-xl font-semibold tracking-tight text-white">
                  Ringkas sebelum lanjut
                </h2>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-white/72">
                  {[
                    "Paket jasa dan tier sudah dipilih.",
                    "Add-on ditampilkan terpisah dari biaya admin.",
                    "Checkout berikutnya fokus pada brief campaign.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2
                        className="mt-1 size-4 shrink-0 text-white"
                        aria-hidden="true"
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <CartServiceSummary items={displayItems} />
              <CartGuidanceCards />
            </div>
            <CartPaymentSummary
              serviceSubtotal={activeCart.subtotalAmount}
              addonTotal={activeCart.addonAmount}
              adminFee={activeCart.adminFee}
              totalPayment={activeCart.totalAmount}
              ctaHref="/umkm/checkout"
              ctaLabel="Lanjut Checkout"
            />
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

function CartEmptyState() {
  return (
    <main>
      <PageContainer>
        <section className="rounded-lg border border-dashed border-border bg-card p-8 text-center shadow-xs">
          <div className="mx-auto grid size-12 place-items-center rounded-lg bg-primary/10 text-primary">
            <BriefcaseBusiness className="size-6" aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
            Belum ada paket jasa di keranjang.
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Pilih kreator dan paket jasa digital dari katalog untuk mulai
            menyusun brief campaign.
          </p>
          <Button asChild className="mt-5">
            <Link href="/katalog">Cari Kreator</Link>
          </Button>
        </section>
      </PageContainer>
    </main>
  );
}
