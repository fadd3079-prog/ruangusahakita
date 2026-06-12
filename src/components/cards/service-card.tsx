import Link from "next/link";
import { Clock, FileCheck2, Image as ImageIcon, Layers3 } from "lucide-react";

import { PriceText } from "@/components/common/price-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  PublicServiceCategory,
  PublicServicePackage,
} from "@/features/catalog/data/catalog-types";

type ServiceCardProps = {
  service: PublicServicePackage;
  category?: PublicServiceCategory;
  ctaLabel?: string;
};

export function ServiceCard({
  service,
  category,
  ctaLabel = "Lihat Detail",
}: ServiceCardProps) {
  const visualUrl = service.coverImageUrl;

  return (
    <Card className="marketplace-card group flex h-full flex-col overflow-hidden p-0 transition-[border-color,box-shadow] duration-200 hover:border-primary/30 hover:shadow-[var(--shadow-marketplace)]">
      <div
        className="grid aspect-[16/9] shrink-0 place-items-center bg-muted/50 bg-cover bg-center text-muted-foreground"
        style={visualUrl ? { backgroundImage: `url("${visualUrl}")` } : undefined}
      >
        {visualUrl ? null : <ImageIcon className="size-10 opacity-40" aria-hidden="true" />}
      </div>

      <CardHeader className="px-4 pb-2 pt-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {category ? (
              <Badge variant="secondary" className="mb-3 rounded-full">
                {category.name}
              </Badge>
            ) : null}
            <CardTitle className="line-clamp-2 min-h-11 text-lg">
              {service.title}
            </CardTitle>
          </div>
          {service.isFeatured ? (
            <Badge variant="outline" className="shrink-0 rounded-full text-primary">
              Unggulan
            </Badge>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col space-y-4 px-4">
        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          {service.shortDescription}
        </p>
        <div className="grid gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Clock className="size-4 text-primary" aria-hidden="true" />
            Estimasi {service.estimatedDays} hari
          </span>
          <span className="inline-flex items-center gap-2">
            <FileCheck2 className="size-4 text-primary" aria-hidden="true" />
            {service.revisionCount} kali revisi
          </span>
          <span className="inline-flex items-center gap-2">
            <Layers3 className="size-4 text-primary" aria-hidden="true" />
            {service.deliverables.length} output layanan digital
          </span>
        </div>
        <div className="mt-auto rounded-2xl border border-border/70 bg-muted/35 p-3 text-sm">
          <PriceText value={service.basePrice} />
        </div>
      </CardContent>

      <CardFooter className="border-t border-border/70 bg-muted/25 p-3">
        <Button asChild className="h-10 w-full rounded-full">
          <Link href={`/layanan/${service.id}`}>{ctaLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
