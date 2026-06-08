import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { CatalogFilter } from "@/features/catalog/components/catalog-filter";
import { CatalogHero } from "@/features/catalog/components/catalog-hero";
import type { CatalogCreator } from "@/features/catalog/components/creator-grid";
import { getPublicCatalogData } from "@/features/catalog/data/catalog-queries";

export const metadata: Metadata = {
  title: "Katalog Kreator — Ruang Usaha Kita",
  description:
    "Cari kreator dan paket jasa digital untuk kebutuhan promosi UMKM berdasarkan kategori layanan, niche, lokasi, harga, dan rating.",
};

export default async function CatalogPage() {
  const { creators, services, categories } = await getPublicCatalogData();

  const categoryById = new Map(
    categories.map((category) => [category.id, category]),
  );

  const catalogCreators: readonly CatalogCreator[] = creators.map(
    (creator) => {
      const primaryService =
        services.find((service) => service.creatorId === creator.id) ??
        null;
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
    },
  );

  const locations = [
    ...new Set(
      creators
        .map((creator) => creator.city.trim())
        .filter((location) => location.length > 0),
    ),
  ].sort();
  const niches = [
    ...new Set(
      creators
        .map((creator) => creator.niche.trim())
        .filter((niche) => niche.length > 0),
    ),
  ].sort();

  return (
    <main>
      <CatalogHero
        creatorCount={creators.length}
        categoryCount={categories.length}
        serviceCount={services.length}
      />
      <section className="bg-muted/30 py-10 sm:py-12 lg:py-14">
        <PageContainer>
          <CatalogFilter
            items={catalogCreators}
            categories={categories
              .filter((category) => category.id.trim().length > 0)
              .map((category) => ({
                id: category.id,
                name: category.name,
              }))}
            locations={locations}
            niches={niches}
          />
        </PageContainer>
      </section>
    </main>
  );
}
