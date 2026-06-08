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
      <PageContainer className="py-14 sm:py-16 lg:py-20">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold text-primary">Katalog Kreator</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Temukan Kreator untuk Kebutuhan Promosi UMKM
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            Pilih kreator berdasarkan kategori layanan, niche, lokasi, harga,
            rating, dan portofolio yang sesuai dengan kebutuhan campaign usaha
            Anda.
          </p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Katalog menampilkan data layanan digital yang sudah tersedia di
            database. Jika belum ada kreator aktif, halaman akan menampilkan
            empty state.
          </p>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-lg border border-border/70 bg-card px-4 py-3 text-sm text-muted-foreground shadow-xs"
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
