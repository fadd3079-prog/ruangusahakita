import type { Metadata } from "next";
import Link from "next/link";
import { BriefcaseBusiness, CheckCircle2, FileText, Sparkles, Trash2 } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { SubmitButton } from "@/components/common/submit-button";
import { Button } from "@/components/ui/button";
import { clearCart } from "@/features/cart/actions/cart-actions";
import { CartGuidanceCards } from "@/features/cart/components/cart-guidance-cards";
import { CartPaymentSummary } from "@/features/cart/components/cart-payment-summary";
import { CartServiceSummary } from "@/features/cart/components/cart-service-summary";
import { getCurrentCart } from "@/features/cart/data/cart-queries";

export const metadata: Metadata = {
  title: "Keranjang Layanan - Ruang Usaha Kita",
  description:
    "Tinjau paket jasa digital, add-on, biaya admin, dan total pembayaran sebelum melanjutkan ke checkout brief campaign.",
};

type UmkmCartPageProps = {
  searchParams: Promise<{
    added?: string;
    cleared?: string;
    error?: string;
    removed?: string;
    updated?: string;
  }>;
};

const errorMessages = {
  addon: "Add-on belum bisa diproses.",
  cart: "Keranjang belum bisa disiapkan.",
  clear: "Keranjang belum bisa dikosongkan.",
  item: "Item keranjang tidak ditemukan.",
  remove: "Item keranjang belum bisa dihapus.",
  save: "Paket jasa belum bisa disimpan ke keranjang.",
};

function getErrorMessage(error?: string) {
  if (!error) {
    return null;
  }

  return errorMessages[error as keyof typeof errorMessages] ?? "Keranjang belum bisa diproses.";
}

function getSuccessMessage(params: Awaited<UmkmCartPageProps["searchParams"]>) {
  if (params.added) {
    return "Paket jasa berhasil ditambahkan ke keranjang.";
  }

  if (params.removed) {
    return "Paket jasa berhasil dihapus dari keranjang.";
  }

  if (params.cleared) {
    return "Keranjang berhasil dikosongkan.";
  }

  if (params.updated) {
    return "Keranjang berhasil diperbarui.";
  }

  return null;
}

export default async function UmkmCartPage({ searchParams }: UmkmCartPageProps) {
  const [cart, params] = await Promise.all([getCurrentCart(), searchParams]);
  const errorMessage = getErrorMessage(params.error);
  const successMessage = getSuccessMessage(params);

  if (cart.items.length === 0) {
    return <CartEmptyState errorMessage={errorMessage} successMessage={successMessage} />;
  }

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
                  revisi, add-on, dan total sebelum menyusun brief campaign.
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
                    "Add-on dihitung ulang dari database.",
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

          {errorMessage ? <StatusPanel tone="error" message={errorMessage} /> : null}
          {successMessage ? <StatusPanel tone="success" message={successMessage} /> : null}

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <div className="flex justify-end">
                <form action={clearCart}>
                  <SubmitButton
                    pendingLabel="Mengosongkan..."
                    variant="outline"
                    className="bg-background"
                    icon={<Trash2 className="size-4" aria-hidden="true" />}
                  >
                    Kosongkan Keranjang
                  </SubmitButton>
                </form>
              </div>
              <CartServiceSummary items={cart.items} />
              <CartGuidanceCards />
            </div>
            <CartPaymentSummary
              serviceSubtotal={cart.serviceSubtotal}
              addonTotal={cart.addonTotal}
              adminFee={cart.adminFee}
              totalPayment={cart.totalPayment}
              ctaHref="/umkm/checkout"
              ctaLabel="Lanjut Checkout"
            />
          </div>
        </div>
      </PageContainer>
    </main>
  );
}

function CartEmptyState({
  errorMessage,
  successMessage,
}: {
  errorMessage: string | null;
  successMessage: string | null;
}) {
  return (
    <main>
      <PageContainer>
        <div className="space-y-4">
          {errorMessage ? <StatusPanel tone="error" message={errorMessage} /> : null}
          {successMessage ? <StatusPanel tone="success" message={successMessage} /> : null}
          <section className="rounded-lg border border-dashed border-border bg-card p-8 text-center shadow-xs">
            <div className="mx-auto grid size-12 place-items-center rounded-lg bg-primary/10 text-primary">
              <BriefcaseBusiness className="size-6" aria-hidden="true" />
            </div>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
              Belum ada layanan di keranjang
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Pilih kreator dan paket jasa digital dari katalog untuk mulai
              menyusun brief campaign.
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

function StatusPanel({ message, tone }: { message: string; tone: "error" | "success" }) {
  return (
    <div
      className={
        tone === "error"
          ? "rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive"
          : "rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm font-medium text-primary"
      }
    >
      {message}
    </div>
  );
}
