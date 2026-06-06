import type { Metadata } from "next";
import { ClipboardList, FileCheck2, ListChecks, Sparkles, Star } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { CatalogFilter } from "@/features/catalog/components/catalog-filter";
import { CatalogHero } from "@/features/catalog/components/catalog-hero";
import type { CatalogCreator } from "@/features/catalog/components/creator-grid";
import {
  dummyCreators,
  dummyServiceCategories,
  dummyServicePackages,
} from "@/lib/dummy";

export const metadata: Metadata = {
  title: "Katalog Kreator — Ruang Usaha Kita",
  description:
    "Cari kreator dan paket jasa digital untuk kebutuhan promosi UMKM berdasarkan kategori layanan, niche, lokasi, harga, dan rating.",
};

const guidanceItems = [
  {
    title: "Sesuaikan niche dengan jenis usaha",
    icon: Sparkles,
  },
  {
    title: "Cek portofolio dan gaya konten kreator",
    icon: Star,
  },
  {
    title: "Cek output paket jasa sebelum memilih",
    icon: ListChecks,
  },
  {
    title: "Perhatikan estimasi pengerjaan dan revisi",
    icon: FileCheck2,
  },
  {
    title: "Isi brief campaign dengan jelas saat checkout",
    icon: ClipboardList,
  },
] as const;

const categoryById = new Map(
  dummyServiceCategories.map((category) => [category.id, category]),
);

const catalogCreators: readonly CatalogCreator[] = dummyCreators.map((creator) => {
  const primaryService =
    dummyServicePackages.find((service) => service.creatorId === creator.id) ?? null;
  const category = primaryService
    ? categoryById.get(primaryService.categoryId) ?? null
    : null;

  return {
    creator,
    primaryService:
      primaryService && category
        ? {
            id: primaryService.id,
            title: primaryService.title,
            categoryId: category.id,
            categoryName: category.name,
            estimatedDays: primaryService.estimatedDays,
            basePrice: primaryService.basePrice,
          }
        : null,
    searchText: [
      creator.displayName,
      creator.niche,
      creator.city,
      creator.province,
      creator.skills.join(" "),
      primaryService?.title,
      primaryService?.shortDescription,
      primaryService?.tags.join(" "),
      category?.name,
    ]
      .filter(Boolean)
      .join(" "),
  };
});

const locations = [...new Set(dummyCreators.map((creator) => creator.city))].sort();
const niches = [...new Set(dummyCreators.map((creator) => creator.niche))].sort();

export default function CatalogPage() {
  return (
    <main>
      <CatalogHero
        creatorCount={dummyCreators.length}
        categoryCount={dummyServiceCategories.length}
        serviceCount={dummyServicePackages.length}
      />
      <section className="bg-muted/30 py-10 sm:py-12 lg:py-14">
        <PageContainer>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <CatalogFilter
              items={catalogCreators}
              categories={dummyServiceCategories.map((category) => ({
                id: category.id,
                name: category.name,
              }))}
              locations={locations}
              niches={niches}
            />
            <aside className="xl:sticky xl:top-24 xl:self-start">
              <article className="rounded-lg border border-border/70 bg-card p-5 shadow-xs">
                <p className="text-sm font-semibold text-primary">
                  Panduan memilih kreator
                </p>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
                  Pilih berdasarkan kebutuhan campaign, bukan hanya harga.
                </h2>
                <div className="mt-5 space-y-3">
                  {guidanceItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div key={item.title} className="flex items-start gap-3">
                        <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                          <Icon className="size-4" aria-hidden="true" />
                        </div>
                        <p className="pt-1 text-sm leading-6 text-muted-foreground">
                          {item.title}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </article>
            </aside>
          </div>
        </PageContainer>
      </section>
    </main>
  );
}
