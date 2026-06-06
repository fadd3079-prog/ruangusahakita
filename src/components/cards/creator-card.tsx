import Link from "next/link";
import { CheckCircle2, Clock, MapPin, Star } from "lucide-react";

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
  DummyAvailabilityStatus,
  DummyCreatorProfile,
} from "@/lib/dummy";

const availabilityLabels: Record<DummyAvailabilityStatus, string> = {
  available: "Tersedia",
  limited: "Terbatas",
  busy: "Penuh sementara",
  unavailable: "Belum tersedia",
};

type CreatorCardProps = {
  creator: DummyCreatorProfile;
};

export function CreatorCard({ creator }: CreatorCardProps) {
  return (
    <Card className="rounded-lg border-border/70 bg-card/80 shadow-xs transition-colors hover:border-primary/30">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="grid size-12 shrink-0 place-items-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
            {creator.displayName
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div className="min-w-0">
            <CardTitle className="text-lg">{creator.displayName}</CardTitle>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {creator.niche}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="rounded-lg">
            <CheckCircle2 aria-hidden="true" />
            {availabilityLabels[creator.availabilityStatus]}
          </Badge>
          {creator.isVerified ? (
            <Badge variant="outline" className="rounded-lg text-primary">
              Terverifikasi
            </Badge>
          ) : null}
        </div>
        <div className="grid gap-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <MapPin className="size-4 text-primary" aria-hidden="true" />
            {creator.city}, {creator.province}
          </span>
          <span className="inline-flex items-center gap-2">
            <Star className="size-4 fill-primary text-primary" aria-hidden="true" />
            {creator.averageRating.toFixed(1)} rating rata-rata
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock className="size-4 text-primary" aria-hidden="true" />
            Respons sekitar {creator.responseTimeHours} jam
          </span>
        </div>
        <div className="rounded-lg border border-border/70 bg-muted/40 p-3">
          <p className="text-sm text-muted-foreground">
            {creator.completedOrdersCount} pesanan selesai
          </p>
          <p className="mt-1 text-sm">
            <PriceText value={creator.startingPrice} />
          </p>
        </div>
      </CardContent>
      <CardFooter className="bg-transparent">
        <Button asChild className="w-full">
          <Link href={`/kreator/${creator.id}`}>Lihat Profil Kreator</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
