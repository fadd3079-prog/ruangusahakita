import Link from "next/link";
import { Clock, FileCheck2, Layers3, MapPin, Star } from "lucide-react";

import { PriceText } from "@/components/common/price-text";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  PublicCreatorProfile,
  PublicServiceCategory,
  PublicServicePackage,
} from "@/features/catalog/data/catalog-types";

type ServiceDetailHeaderProps = {
  service: PublicServicePackage;
  creator: PublicCreatorProfile;
  category?: PublicServiceCategory;
};

export function ServiceDetailHeader({
  service,
  creator,
  category,
}: ServiceDetailHeaderProps) {
  return (
    <section className="border-b border-border/70 bg-background">
      <PageContainer className="grid gap-8 py-14 sm:py-16 lg:grid-cols-[1fr_360px] lg:items-end lg:py-20">
        <div>
          <div className="flex flex-wrap gap-2">
            {category ? (
              <Badge variant="secondary" className="rounded-lg">
                {category.name}
              </Badge>
            ) : null}
            {service.isFeatured ? (
              <Badge variant="outline" className="rounded-lg text-primary">
                Paket unggulan
              </Badge>
            ) : null}
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {service.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            {service.description}
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric icon={Clock} label="Estimasi" value={`${service.estimatedDays} hari`} />
            <Metric icon={FileCheck2} label="Revisi" value={`${service.revisionCount} kali`} />
            <Metric icon={Layers3} label="Output" value={`${service.deliverables.length} item`} />
            <Metric icon={Star} label="Rating kreator" value={creator.averageRating.toFixed(1)} />
          </div>
        </div>

        <aside className="rounded-lg border border-border/70 bg-card p-5 shadow-xs">
          <p className="text-sm font-medium text-muted-foreground">
            Kreator layanan
          </p>
          <Link
            href={`/kreator/${creator.id}`}
            className="mt-3 flex items-start gap-3 rounded-lg border border-border/70 bg-muted/35 p-3 transition-colors hover:border-primary/30"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
              {creator.displayName
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </span>
            <span>
              <span className="block font-semibold text-foreground">
                {creator.displayName}
              </span>
              <span className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="size-3.5 text-primary" aria-hidden="true" />
                {creator.city}
              </span>
            </span>
          </Link>
          <div className="mt-5 rounded-lg border border-border/70 bg-muted/35 p-3 text-sm">
            <PriceText value={service.basePrice} />
          </div>
          <div className="mt-5 grid gap-2">
            <Button asChild>
              <Link href={`/umkm/cart?serviceId=${service.id}`}>
                Tambah ke Keranjang
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/umkm/checkout?serviceId=${service.id}`}>
                Pesan Sekarang
              </Link>
            </Button>
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            Tombol ini masih berupa tautan placeholder. Logika keranjang dan
            checkout belum diaktifkan pada tahap ini.
          </p>
        </aside>
      </PageContainer>
    </section>
  );
}

type MetricProps = {
  icon: typeof Clock;
  label: string;
  value: string;
};

function Metric({ icon: Icon, label, value }: MetricProps) {
  return (
    <div className="rounded-lg border border-border/70 bg-card px-4 py-3 shadow-xs">
      <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        <Icon className="size-4 text-primary" aria-hidden="true" />
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
