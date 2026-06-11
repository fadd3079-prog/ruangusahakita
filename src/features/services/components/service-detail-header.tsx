import Link from "next/link";
import { Clock, FileCheck2, Image as ImageIcon, Layers3, MapPin, Star } from "lucide-react";

import { PriceText } from "@/components/common/price-text";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  PublicCreatorProfile,
  PublicServiceCategory,
  PublicServicePackage,
} from "@/features/catalog/data/catalog-types";
import { addServiceToCart } from "@/features/cart/actions/cart-actions";

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
      <PageContainer className="grid gap-8 py-12 sm:py-14 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:py-16">
        <div>
          <div className="flex flex-wrap gap-2">
            {category ? (
              <Badge variant="secondary" className="rounded-full">
                {category.name}
              </Badge>
            ) : null}
            {service.isFeatured ? (
              <Badge variant="outline" className="rounded-full text-primary">
                Paket unggulan
              </Badge>
            ) : null}
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {service.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
            {service.description}
          </p>
          <div
            className="mt-8 grid aspect-[16/7] min-h-56 place-items-center rounded-2xl border border-border/70 bg-muted/50 bg-cover bg-center text-muted-foreground"
            style={
              service.coverImageUrl
                ? { backgroundImage: `url("${service.coverImageUrl}")` }
                : undefined
            }
          >
            {service.coverImageUrl ? null : (
              <div className="text-center">
                <ImageIcon className="mx-auto size-10 opacity-40" aria-hidden="true" />
                <p className="mt-2 text-sm">Cover layanan belum tersedia</p>
              </div>
            )}
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric icon={Clock} label="Estimasi" value={`${service.estimatedDays} hari`} />
            <Metric icon={FileCheck2} label="Revisi" value={`${service.revisionCount} kali`} />
            <Metric icon={Layers3} label="Output" value={`${service.deliverables.length} item`} />
            <Metric icon={Star} label="Rating kreator" value={creator.averageRating.toFixed(1)} />
          </div>
        </div>

        <aside className="marketplace-card p-5 lg:sticky lg:top-24">
          <p className="text-sm font-medium text-muted-foreground">
            Kreator layanan
          </p>
          <Link
            href={`/kreator/${creator.id}`}
            className="mt-3 flex items-start gap-3 rounded-2xl border border-border/70 bg-muted/35 p-3 transition-colors hover:border-primary/30"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
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
          <div className="mt-5 rounded-2xl border border-border/70 bg-muted/35 p-3 text-sm">
            <PriceText value={service.basePrice} />
          </div>
          <div className="mt-5 flex flex-col gap-2">
            <form action={addServiceToCart}>
              <input type="hidden" name="serviceId" value={service.id} />
              <input type="hidden" name="redirectTo" value="/umkm/cart" />
              <input type="hidden" name="debug_source" value="TOP_BUTTON" />
              <Button type="submit" className="h-11 w-full rounded-full">
                Tambah ke Keranjang
              </Button>
            </form>
            <form action={addServiceToCart}>
              <input type="hidden" name="serviceId" value={service.id} />
              <input type="hidden" name="redirectTo" value="/umkm/checkout" />
              <input type="hidden" name="debug_source" value="TOP_BUTTON" />
              <Button type="submit" variant="outline" className="h-11 w-full rounded-full">
                Pesan Sekarang
              </Button>
            </form>
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            Pilih tier yang paling sesuai sebelum melanjutkan brief campaign.
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
    <div className="rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-xs">
      <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        <Icon className="size-4 text-primary" aria-hidden="true" />
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
