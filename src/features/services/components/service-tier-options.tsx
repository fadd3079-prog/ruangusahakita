import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, FilePenLine } from "lucide-react";

import { PriceText } from "@/components/common/price-text";
import { SubmitButton } from "@/components/common/submit-button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { addServiceToCart } from "@/features/cart/actions/cart-actions";
import type { PublicServiceTier } from "@/features/catalog/data/catalog-types";
import { buildCheckoutPath } from "@/features/checkout/lib/checkout-source";
import { Button } from "@/components/ui/button";

type ServiceTierOptionsProps = {
  serviceId: string;
  tiers: readonly PublicServiceTier[];
};

export function ServiceTierOptions({ serviceId, tiers }: ServiceTierOptionsProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {tiers.map((tier) => (
        <Card
          key={tier.id}
          className="marketplace-card h-full"
        >
          <CardHeader className="p-5 pb-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge
                  variant={tier.name === "Medium" ? "default" : "secondary"}
                  className="mb-3 rounded-full"
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
          <CardContent className="space-y-4 p-5 pt-0">
            <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
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
              {tier.deliverables.length > 0 ? tier.deliverables.map((deliverable) => (
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
              )) : (
                <li className="text-sm leading-6 text-muted-foreground">
                  Output paket akan dikonfirmasi dalam brief campaign.
                </li>
              )}
            </ul>
          </CardContent>
          <CardFooter className="grid gap-2 border-t border-border/70 bg-muted/25 p-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <form action={addServiceToCart}>
              <input type="hidden" name="serviceId" value={serviceId} />
              <input type="hidden" name="tierId" value={tier.id} />
              <input type="hidden" name="redirectTo" value={`/layanan/${serviceId}`} />
              <SubmitButton pendingLabel="Menambahkan..." className="h-10 w-full rounded-full">
                Tambah ke Keranjang
              </SubmitButton>
            </form>
            <Button asChild variant="outline" className="h-10 w-full rounded-full bg-background">
              <Link
                href={buildCheckoutPath({
                  addonIds: [],
                  serviceId,
                  source: "direct",
                  tierId: tier.id,
                })}
              >
                Pesan Sekarang
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
