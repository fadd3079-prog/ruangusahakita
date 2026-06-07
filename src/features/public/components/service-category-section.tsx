import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  Camera,
  Clapperboard,
  Megaphone,
  MessageCircleHeart,
  PanelsTopLeft,
  TextQuote,
} from "lucide-react";

import { SectionHeading } from "@/components/common/section-heading";
import { PageContainer } from "@/components/layout/page-container";

import { getPublicCategories } from "@/features/catalog/data/catalog-queries";

const categoryIcons: Record<string, LucideIcon> = {
  Camera,
  Clapperboard,
  Megaphone,
  MessageCircleHeart,
  PanelsTopLeft,
  TextQuote,
};

export async function ServiceCategorySection() {
  const categories = await getPublicCategories();

  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <PageContainer>
        <SectionHeading
          eyebrow="Kategori layanan"
          title="Pilih kebutuhan promosi digital yang paling dekat dengan tujuan UMKM."
          description="Setiap kategori membantu UMKM memahami bentuk output sebelum memilih kreator dan paket jasa yang sesuai."
          action={
            <Link
              href="/katalog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
            >
              Lihat katalog
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          }
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = categoryIcons[category.iconName] ?? Megaphone;

            return (
              <article
                key={category.id}
                className="group rounded-lg border border-border/70 bg-card p-5 shadow-xs transition-colors hover:border-primary/35"
              >
                <div className="grid size-11 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
                  {category.name}
                </h3>
                <p className="mt-3 min-h-18 text-sm leading-6 text-muted-foreground">
                  {category.description}
                </p>
                <Link
                  href="/katalog"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                >
                  Cari paket jasa
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </article>
            );
          })}
        </div>
      </PageContainer>
    </section>
  );
}
