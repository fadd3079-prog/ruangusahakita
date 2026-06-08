import { CheckCircle2, Clock, FilePenLine } from "lucide-react";

import { PriceText } from "@/components/common/price-text";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PublicServiceTier } from "@/features/catalog/data/catalog-types";

type ServiceTierOptionsProps = {
  tiers: readonly PublicServiceTier[];
};

export function ServiceTierOptions({ tiers }: ServiceTierOptionsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {tiers.map((tier) => (
        <Card
          key={tier.id}
          className="rounded-lg border-border/70 bg-card/85 shadow-xs"
        >
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge
                  variant={tier.name === "Standard" ? "default" : "secondary"}
                  className="mb-3 rounded-lg"
                >
                  {tier.name}
                </Badge>
                <CardTitle className="text-xl">{tier.name}</CardTitle>
              </div>
              <p className="text-sm">
                <PriceText value={tier.price} prefix="" />
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-6 text-muted-foreground">
              {tier.description}
            </p>
            <div className="grid gap-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Clock className="size-4 text-primary" aria-hidden="true" />
                Estimasi {tier.estimatedDays} hari
              </span>
              <span className="inline-flex items-center gap-2">
                <FilePenLine className="size-4 text-primary" aria-hidden="true" />
                {tier.revisionCount} kali revisi
              </span>
            </div>
            <ul className="space-y-2 border-t border-border pt-4">
              {tier.deliverables.map((deliverable) => (
                <li
                  key={deliverable}
                  className="flex items-start gap-2 text-sm leading-6 text-muted-foreground"
                >
                  <CheckCircle2
                    className="mt-1 size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  {deliverable}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
