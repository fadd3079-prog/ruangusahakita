import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, ListChecks, PlusCircle } from "lucide-react";

import { PortfolioCard } from "@/components/cards/portfolio-card";
import { ReviewCard } from "@/components/cards/review-card";
import { SectionHeading } from "@/components/common/section-heading";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { addServiceToCart } from "@/features/cart/actions/cart-actions";
import { ServiceDetailHeader } from "@/features/services/components/service-detail-header";
import { ServiceTierOptions } from "@/features/services/components/service-tier-options";
import { formatCurrency } from "@/lib/formatters/currency";
import { getPublicServiceDetail } from "@/features/catalog/data/catalog-queries";
import type { PublicServiceAddon, PublicPortfolioItem } from "@/features/catalog/data/catalog-types";

type ServicePageProps = {
  params: Promise<{
    serviceId: string;
  }>;
};

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { serviceId } = await params;
  const detail = await getPublicServiceDetail(serviceId);

  if (!detail) {
    return {
      title: "Paket jasa tidak ditemukan - Ruang Usaha Kita",
    };
  }

  const { service, creator } = detail;

  return {
    title: `${service.title} - Ruang Usaha Kita`,
    description: `${service.title} oleh ${creator?.displayName ?? "kreator"} untuk kebutuhan promosi UMKM. Lihat harga, tier, output, estimasi pengerjaan, revisi, dan add-on.`,
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { serviceId } = await params;
  const detail = await getPublicServiceDetail(serviceId);

  if (!detail) {
    notFound();
  }

  const { 
    service, 
    creator, 
    category, 
    tiers, 
    addons, 
    portfolios, 
    reviews, 
    umkmProfiles 
  } = detail;
  const primaryTier = tiers[0] ?? null;

  return (
    <main>
      <ServiceDetailHeader
        service={service}
        creator={creator}
        category={category}
      />

      <section className="bg-muted/30 py-12 sm:py-16">
        <PageContainer>
          <SectionHeading
            eyebrow="Pilihan tier"
            title="Bandingkan tier sebelum memilih."
            description="Harga, estimasi, revisi, dan output terlihat sejak awal."
          />
          <div className="mt-8">
            <ServiceTierOptions tiers={tiers} />
          </div>
        </PageContainer>
      </section>

      <section className="bg-background py-12 sm:py-16">
        <PageContainer>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            <article className="marketplace-card p-5 sm:p-6">
              <p className="text-sm font-semibold text-primary">
                Detail paket jasa
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                Output dan kebutuhan brief
              </h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <Checklist
                  title="Output layanan"
                  items={service.deliverables}
                />
                <Checklist
                  title="Kebutuhan brief"
                  items={service.requirements}
                />
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="rounded-full">
                    {tag}
                  </Badge>
                ))}
              </div>
            </article>

            <aside className="marketplace-card p-5">
              <PlusCircle className="size-5 text-primary" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
                Add-on layanan
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Add-on dapat membantu UMKM menyesuaikan brief campaign, caption,
                atau kebutuhan revisi tambahan sesuai paket.
              </p>
              {addons.length > 0 ? (
                <div className="mt-5 space-y-3">
                  {addons.map((addon: PublicServiceAddon) => (
                    <div
                      key={addon.id}
                      className="rounded-2xl border border-border/70 bg-muted/35 p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-semibold text-foreground">
                          {addon.name}
                        </p>
                        <p className="shrink-0 text-sm font-semibold text-primary">
                          {formatCurrency(addon.price)}
                        </p>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {addon.description}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-5 rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                  Belum ada add-on untuk paket jasa ini.
                </p>
              )}
            </aside>
          </div>
        </PageContainer>
      </section>

      <section className="border-y border-border/70 bg-muted/30 py-12 sm:py-16">
        <PageContainer>
          <SectionHeading
            eyebrow="Portofolio terkait"
            title="Contoh karya yang relevan dengan kategori layanan ini."
            description="Portofolio membantu UMKM menilai gaya visual, nada konten, dan kecocokan kreator."
          />
          {portfolios.length > 0 ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {portfolios.map((portfolio: PublicPortfolioItem) => (
                <PortfolioCard
                  key={portfolio.id}
                  portfolio={portfolio}
                  category={category}
                />
              ))}
            </div>
          ) : (
            <EmptyPanel
              title="Belum ada portofolio terkait."
              description="Portofolio untuk paket jasa ini belum tersedia."
            />
          )}
        </PageContainer>
      </section>

      <section className="bg-background py-12 sm:py-16">
        <PageContainer>
          <SectionHeading
            eyebrow="Review terkait"
            title="Ulasan dari pesanan yang memakai paket jasa ini."
            description="Ulasan dari UMKM yang telah menggunakan paket jasa ini."
          />
          {reviews.length > 0 ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  umkm={umkmProfiles.find(
                    (profile) => profile.id === review.umkmId,
                  )}
                />
              ))}
            </div>
          ) : (
            <EmptyPanel
              title="Belum ada review untuk paket jasa ini."
              description="Review akan tampil setelah ada pesanan selesai."
            />
          )}
        </PageContainer>
      </section>

      <section className="bg-primary/5 py-12 sm:py-16">
        <PageContainer>
          <div className="marketplace-card flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <CheckCircle2 className="size-4" aria-hidden="true" />
                Siap menyusun brief campaign?
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                Pilih paket jasa ini sebagai langkah awal sebelum checkout.
              </h2>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <form action={addServiceToCart}>
                <input type="hidden" name="serviceId" value={service.id} />
                {primaryTier ? (
                  <input type="hidden" name="tierId" value={primaryTier.id} />
                ) : null}
                <input type="hidden" name="redirectTo" value="/umkm/cart" />
                <Button type="submit" size="lg" className="h-11 w-full rounded-full px-5">
                  Tambah ke Keranjang
                </Button>
              </form>
              <form action={addServiceToCart}>
                <input type="hidden" name="serviceId" value={service.id} />
                {primaryTier ? (
                  <input type="hidden" name="tierId" value={primaryTier.id} />
                ) : null}
                <input type="hidden" name="redirectTo" value="/umkm/checkout" />
                <Button
                  type="submit"
                  size="lg"
                  variant="outline"
                  className="h-11 w-full rounded-full px-5"
                >
                  Pesan Sekarang
                  <ArrowRight aria-hidden="true" />
                </Button>
              </form>
            </div>
          </div>
        </PageContainer>
      </section>
    </main>
  );
}

type ChecklistProps = {
  title: string;
  items: readonly string[];
};

function Checklist({ title, items }: ChecklistProps) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-base font-semibold tracking-tight text-foreground">
        <ListChecks className="size-4 text-primary" aria-hidden="true" />
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
          >
            <CheckCircle2
              className="mt-1 size-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

type EmptyPanelProps = {
  title: string;
  description: string;
};

function EmptyPanel({ title, description }: EmptyPanelProps) {
  return (
    <div className="mt-8 rounded-2xl border border-dashed border-border bg-card p-6 text-center">
      <h3 className="text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
