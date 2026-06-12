import Image from "next/image";
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

const categoryImages = {
  caption: "/images/Kategori-layanan-section/Copywriting.webp",
  campaign: "/images/Kategori-layanan-section/Digital Marketing.webp",
  content: "/images/Kategori-layanan-section/Content Creator.webp",
  design: "/images/Kategori-layanan-section/Desain Grafis.webp",
  video: "/images/Kategori-layanan-section/Video Editing.webp",
  web: "/images/Kategori-layanan-section/Web Development.webp",
} as const;

function getCategoryImage(name: string) {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes("caption")) {
    return categoryImages.caption;
  }

  if (normalizedName.includes("campaign") || normalizedName.includes("marketing")) {
    return categoryImages.campaign;
  }

  if (normalizedName.includes("desain") || normalizedName.includes("grafis")) {
    return categoryImages.design;
  }

  if (normalizedName.includes("video") || normalizedName.includes("reels")) {
    return categoryImages.video;
  }

  if (normalizedName.includes("web")) {
    return categoryImages.web;
  }

  return categoryImages.content;
}

export async function ServiceCategorySection() {
  const categories = await getPublicCategories();

  return (
    <section className="section-y bg-background">
      <PageContainer>
        <SectionHeading
          eyebrow="Kategori layanan"
          title="Pilih layanan sesuai kebutuhan campaign."
          description="Kategori membantu UMKM memahami output sebelum memilih kreator."
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
        {categories.length > 0 ? (
          <div className="mt-10 grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = categoryIcons[category.iconName] ?? Megaphone;
              const imageUrl = getCategoryImage(category.name);

              return (
                <article
                  key={category.id}
                  className="marketplace-card group flex h-full flex-col overflow-hidden transition-colors hover:border-primary/35"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    <Image
                      src={imageUrl}
                      alt={category.name}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,17,31,0.02),rgba(6,17,31,0.5))]" />
                    <div className="absolute bottom-4 left-4 grid size-11 place-items-center rounded-2xl bg-white/92 text-primary shadow-sm">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="line-clamp-2 text-lg font-semibold tracking-tight text-foreground">
                      {category.name}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {category.description}
                    </p>
                    <Link
                      href="/katalog"
                      className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-primary"
                    >
                      Cari paket jasa
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              Kategori layanan belum tersedia.
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Kategori akan muncul setelah data layanan digital aktif tersedia
              di Supabase.
            </p>
          </div>
        )}
      </PageContainer>
    </section>
  );
}
