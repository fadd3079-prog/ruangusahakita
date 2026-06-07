import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

import { PortfolioCard } from "@/components/cards/portfolio-card";
import { ReviewCard } from "@/components/cards/review-card";
import { ServiceCard } from "@/components/cards/service-card";
import { SectionHeading } from "@/components/common/section-heading";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreatorProfileHeader } from "@/features/creators/components/creator-profile-header";
import { getPublicCreatorDetail } from "@/features/catalog/data/catalog-queries";
import {
  dummyCreators,
} from "@/lib/dummy";
import type { DummyPortfolioItem, DummyServicePackage } from "@/lib/dummy/types";

type CreatorPageProps = {
  params: Promise<{
    creatorId: string;
  }>;
};

export function generateStaticParams() {
  return dummyCreators.map((creator) => ({
    creatorId: creator.id,
  }));
}

export async function generateMetadata({
  params,
}: CreatorPageProps): Promise<Metadata> {
  const { creatorId } = await params;
  const detail = await getPublicCreatorDetail(creatorId);

  if (!detail) {
    return {
      title: "Kreator tidak ditemukan - Ruang Usaha Kita",
    };
  }

  const { creator } = detail;

  return {
    title: `${creator.displayName} - Kreator Ruang Usaha Kita`,
    description: `${creator.displayName} adalah kreator untuk ${creator.niche}. Lihat paket jasa, portofolio, rating, dan review untuk kebutuhan promosi UMKM.`,
  };
}

export default async function CreatorDetailPage({ params }: CreatorPageProps) {
  const { creatorId } = await params;
  const detail = await getPublicCreatorDetail(creatorId);

  if (!detail) {
    notFound();
  }

  const { 
    creator, 
    services, 
    portfolios, 
    categories, 
    reviews, 
    umkmProfiles 
  } = detail;

  const categoryById = new Map(
    categories.map((category) => [category.id, category]),
  );

  const primaryService = services[0];

  return (
    <main>
      <CreatorProfileHeader creator={creator} primaryService={primaryService} />

      <section className="bg-muted/30 py-12 sm:py-16">
        <PageContainer>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <article className="rounded-lg border border-border/70 bg-card p-5 shadow-xs sm:p-6">
              <p className="text-sm font-semibold text-primary">
                Tentang kreator
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                Bio dan keahlian
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                {creator.bio}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {creator.skills.map((skill: string) => (
                  <Badge key={skill} variant="secondary" className="rounded-lg">
                    {skill}
                  </Badge>
                ))}
              </div>
            </article>

            <aside className="rounded-lg border border-border/70 bg-card p-5 shadow-xs">
              <Sparkles className="size-5 text-primary" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
                Cocok untuk UMKM yang butuh arahan jelas.
              </h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Cek portofolio, pilih paket jasa, lalu siapkan brief campaign
                agar kreator dapat memahami tujuan promosi sejak awal.
              </p>
              {primaryService ? (
                <Button asChild className="mt-5 w-full">
                  <Link href={`/layanan/${primaryService.id}`}>
                    Pilih Layanan
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              ) : null}
            </aside>
          </div>
        </PageContainer>
      </section>

      <section className="bg-background py-12 sm:py-16">
        <PageContainer>
          <SectionHeading
            eyebrow="Portofolio"
            title="Contoh hasil konten dan campaign yang pernah dikerjakan."
            description="Preview karya-karya terbaik dari kreator untuk referensi UMKM."
          />
          {portfolios.length > 0 ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {portfolios.map((portfolio: DummyPortfolioItem) => (
                <PortfolioCard
                  key={portfolio.id}
                  portfolio={portfolio}
                  category={categoryById.get(portfolio.categoryId)}
                />
              ))}
            </div>
          ) : (
            <EmptyPanel
              title="Portofolio belum tersedia."
              description="Kreator ini belum memiliki portofolio yang dapat ditampilkan."
            />
          )}
        </PageContainer>
      </section>

      <section className="border-y border-border/70 bg-muted/30 py-12 sm:py-16">
        <PageContainer>
          <SectionHeading
            eyebrow="Paket jasa"
            title="Pilih layanan digital yang sesuai dengan kebutuhan campaign."
            description="Setiap paket menampilkan output, estimasi pengerjaan, dan batas revisi agar ekspektasi UMKM lebih jelas."
          />
          {services.length > 0 ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service: DummyServicePackage) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  category={categoryById.get(service.categoryId)}
                  ctaLabel="Pilih Layanan"
                />
              ))}
            </div>
          ) : (
            <EmptyPanel
              title="Belum ada paket jasa."
              description="Kreator ini belum memiliki paket jasa aktif."
            />
          )}
        </PageContainer>
      </section>

      <section className="bg-background py-12 sm:py-16">
        <PageContainer>
          <SectionHeading
            eyebrow="Review"
            title="Ulasan dari UMKM yang pernah menggunakan layanan kreator."
            description="Review asli dari pesanan yang sudah selesai."
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
              title="Belum ada review."
              description="Review akan tampil setelah ada pesanan selesai."
            />
          )}
        </PageContainer>
      </section>

      <section className="bg-primary/5 py-12 sm:py-16">
        <PageContainer>
          <div className="flex flex-col gap-5 rounded-lg border border-primary/20 bg-background p-5 shadow-xs sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <CheckCircle2 className="size-4" aria-hidden="true" />
                Siap memilih paket jasa?
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                Mulai dari layanan yang paling sesuai dengan brief campaign Anda.
              </h2>
            </div>
            {primaryService ? (
              <Button asChild size="lg" className="h-11 px-5">
                <Link href={`/layanan/${primaryService.id}`}>
                  Pilih Paket Jasa
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            ) : null}
          </div>
        </PageContainer>
      </section>
    </main>
  );
}

type EmptyPanelProps = {
  title: string;
  description: string;
};

function EmptyPanel({ title, description }: EmptyPanelProps) {
  return (
    <div className="mt-8 rounded-lg border border-dashed border-border bg-card p-6 text-center">
      <h3 className="text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
