import { Layers3, MapPinned, Search, Star } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";

type CatalogHeroProps = {
  creatorCount: number;
  categoryCount: number;
  serviceCount: number;
};

export function CatalogHero({
  creatorCount,
  categoryCount,
  serviceCount,
}: CatalogHeroProps) {
  const highlights = [
    {
      label: `${creatorCount} kreator`,
      icon: Search,
    },
    {
      label: `${categoryCount} kategori layanan`,
      icon: Layers3,
    },
    {
      label: `${serviceCount} paket jasa`,
      icon: Star,
    },
    {
      label: "filter lokasi dan niche",
      icon: MapPinned,
    },
  ] as const;

  return (
    <section className="border-b border-border/70 bg-background">
      <PageContainer className="grid gap-8 py-12 sm:py-14 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end lg:py-16">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold text-primary">Katalog Kreator</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Temukan kreator untuk promosi UMKM.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
            Filter berdasarkan kategori layanan, niche, lokasi, harga, rating,
            dan ketersediaan.
          </p>
        </div>
        <div className="marketplace-card overflow-hidden">
          <div
            className="aspect-[16/9] bg-cover bg-center"
            style={{ backgroundImage: "url('/images/image (1).webp')" }}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 text-sm text-muted-foreground shadow-xs"
              >
                <Icon className="size-4 text-primary" aria-hidden="true" />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </PageContainer>
    </section>
  );
}
