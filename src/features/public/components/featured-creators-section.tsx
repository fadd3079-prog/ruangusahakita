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
          title="Kreator dan marketer yang siap membantu campaign UMKM."
          description="Gunakan data awal ini untuk melihat bagaimana profil kreator, harga mulai, rating, dan ketersediaan dapat ditampilkan nanti."
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
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredCreators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
