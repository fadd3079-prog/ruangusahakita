import Link from "next/link";
import { Clock, FileCheck2, Layers3 } from "lucide-react";

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
import type { DummyServiceCategory, DummyServicePackage } from "@/lib/dummy";

type ServiceCardProps = {
  service: DummyServicePackage;
  category?: DummyServiceCategory;
  ctaLabel?: string;
};

export function ServiceCard({
  service,
  category,
  ctaLabel = "Lihat Detail",
}: ServiceCardProps) {
  return (
    <Card className="rounded-lg border-border/70 bg-card/85 shadow-xs transition-colors hover:border-primary/30">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            {category ? (
              <Badge variant="secondary" className="mb-3 rounded-lg">
                {category.name}
              </Badge>
            ) : null}
            <CardTitle className="text-lg">{service.title}</CardTitle>
          </div>
          {service.isFeatured ? (
            <Badge variant="outline" className="rounded-lg text-primary">
              Unggulan
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
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
        <div className="rounded-lg border border-border/70 bg-muted/40 p-3 text-sm">
          <PriceText value={service.basePrice} />
        </div>
      </CardContent>
      <CardFooter className="bg-transparent">
        <Button asChild className="w-full">
          <Link href={`/layanan/${service.id}`}>{ctaLabel}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
