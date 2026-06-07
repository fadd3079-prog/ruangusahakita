import type { Metadata } from "next";

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

const categoryById = new Map(
  dummyServiceCategories.map((category) => [category.id, category]),
);

const catalogCreators: readonly CatalogCreator[] = dummyCreators.map(
  (creator) => {
    const primaryService =
      dummyServicePackages.find((service) => service.creatorId === creator.id) ??
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
  ...new Set(dummyCreators.map((creator) => creator.city)),
].sort();
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
        <PageContainer maxWidth="wide">
          <CatalogFilter
            items={catalogCreators}
            categories={dummyServiceCategories.map((category) => ({
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
