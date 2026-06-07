import Link from "next/link";
import type { ReactNode } from "react";
import {
  CheckCircle2,
  Clock,
  Layers3,
  MapPin,
  Star,
  Trophy,
  type LucideIcon,
} from "lucide-react";

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
  primaryService?: {
    id: string;
    title: string;
    categoryName: string;
    estimatedDays: number;
  } | null;
};

export function CreatorCard({ creator, primaryService }: CreatorCardProps) {
  return (
    <Card className="h-full rounded-xl border-border/70 bg-card/95 shadow-[var(--shadow-soft)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_16px_36px_rgba(12,41,73,0.1)]">
      <CardHeader className="pb-1">
        <div className="flex items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[linear-gradient(135deg,rgba(22,113,99,0.14),rgba(12,41,73,0.08))] text-sm font-semibold text-primary ring-1 ring-primary/10">
            {creator.displayName
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="truncate text-base">
              {creator.displayName}
            </CardTitle>
            <p className="mt-1 line-clamp-1 text-sm leading-5 text-muted-foreground">
              {creator.niche}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-3">
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
        <div className="grid gap-1.5 text-sm text-muted-foreground">
          <CreatorMeta icon={MapPin}>
            {creator.city}, {creator.province}
          </CreatorMeta>
          <CreatorMeta icon={Star} emphasized>
            {creator.averageRating.toFixed(1)} rating rata-rata
          </CreatorMeta>
          <CreatorMeta icon={Clock}>
            Respons sekitar {creator.responseTimeHours} jam
          </CreatorMeta>
        </div>
        {primaryService ? (
          <div className="rounded-xl border border-border/70 bg-muted/40 p-3">
            <div className="flex items-start gap-2">
              <Layers3
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-foreground">
                  {primaryService.title}
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {primaryService.categoryName} - estimasi{" "}
                  {primaryService.estimatedDays} hari
                </p>
              </div>
            </div>
          </div>
        ) : null}
        <div className="mt-auto grid grid-cols-2 overflow-hidden rounded-xl border border-border/70 bg-background">
          <div className="border-r border-border/70 p-2.5">
            <p className="text-xs text-muted-foreground">Mulai dari</p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              <PriceText value={creator.startingPrice} prefix="" />
            </p>
          </div>
          <div className="p-2.5">
            <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <Trophy className="size-3.5 text-primary" aria-hidden="true" />
              Selesai
            </p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              {creator.completedOrdersCount} pesanan
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter
        className={
          primaryService
            ? "mt-auto grid gap-2 bg-muted/35 p-3 sm:grid-cols-2"
            : "mt-auto bg-muted/35 p-3"
        }
      >
        <Button
          asChild
          variant={primaryService ? "outline" : "default"}
          className="h-9 w-full"
        >
          <Link href={`/kreator/${creator.id}`}>Lihat Profil</Link>
        </Button>
        {primaryService ? (
          <Button asChild className="h-9 w-full">
            <Link href={`/layanan/${primaryService.id}`}>Pilih Layanan</Link>
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}

type CreatorMetaProps = {
  children: ReactNode;
  emphasized?: boolean;
  icon: LucideIcon;
};

function CreatorMeta({
  children,
  emphasized = false,
  icon: Icon,
}: CreatorMetaProps) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <Icon
        className={
          emphasized ? "size-4 fill-primary text-primary" : "size-4 text-primary"
        }
        aria-hidden="true"
      />
      <span className="truncate">{children}</span>
    </span>
  );
}
