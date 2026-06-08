import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CreatorCard } from "@/components/cards/creator-card";
import { SectionHeading } from "@/components/common/section-heading";
import { PageContainer } from "@/components/layout/page-container";

import { getPublicFeaturedCreators } from "@/features/catalog/data/catalog-queries";

export async function FeaturedCreatorsSection() {
  const featuredCreators = await getPublicFeaturedCreators();

  return (
    <section className="bg-muted/30 py-16 sm:py-20 lg:py-24">
      <PageContainer>
        <SectionHeading
          eyebrow="Kreator pilihan"
          title="Kreator yang siap membantu promosi UMKM."
          description="Lihat niche, rating, harga mulai, dan ketersediaan dalam satu kartu."
          action={
            <Link
              href="/katalog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
            >
              Jelajahi semua kreator
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />
        {featuredCreators.length > 0 ? (
          <div className="mt-10 grid auto-rows-fr gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featuredCreators.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              Belum ada kreator pilihan.
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Kreator aktif akan tampil setelah data profil dan layanan tersedia
              di Supabase.
            </p>
          </div>
        )}
      </PageContainer>
    </section>
  );
}
