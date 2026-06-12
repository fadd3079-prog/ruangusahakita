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
    <section className="border-b border-border/70 bg-[linear-gradient(180deg,var(--background),var(--surface-soft))]">
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
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
            <div className="flex items-center gap-3">
              <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Search className="size-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Jelajahi layanan digital aktif
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Bandingkan kreator, paket jasa, dan portofolio dari katalog aktif.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <CatalogMetric label="Kreator" value={creatorCount} />
            <CatalogMetric label="Layanan" value={serviceCount} />
            <CatalogMetric label="Kategori" value={categoryCount} />
          </div>
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

function CatalogMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border/70 bg-background p-3 text-center">
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
