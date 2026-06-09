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
  PublicAvailabilityStatus,
  PublicCreatorProfile,
} from "@/features/catalog/data/catalog-types";

const availabilityLabels: Record<PublicAvailabilityStatus, string> = {
  available: "Tersedia",
  limited: "Terbatas",
  busy: "Penuh sementara",
  unavailable: "Belum tersedia",
};

type CreatorCardProps = {
  creator: PublicCreatorProfile;
  primaryService?: {
    id: string;
    title: string;
    categoryName: string;
    estimatedDays: number;
  } | null;
};

export function CreatorCard({ creator, primaryService }: CreatorCardProps) {
  const visualUrl = creator.bannerUrl;
  const initials = creator.displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <Card className="marketplace-card h-full overflow-hidden p-0 transition-[border-color,box-shadow] duration-200 hover:border-primary/30 hover:shadow-[var(--shadow-marketplace)]">
      <div
        className="relative aspect-[16/9] bg-muted/50 bg-cover bg-center"
        style={
          visualUrl ? { backgroundImage: `url("${visualUrl}")` } : undefined
        }
      >
        {visualUrl ? (
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,17,31,0.04),rgba(6,17,31,0.58))]" />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(135deg,var(--surface-soft),var(--background))] text-4xl font-semibold text-primary/40">
            {initials}
          </div>
        )}
        <div className="absolute bottom-3 left-3 flex min-w-0 items-center gap-2 pr-3">
          <div
            className="grid size-10 shrink-0 place-items-center rounded-full bg-white bg-cover bg-center text-sm font-semibold text-primary shadow-sm ring-1 ring-white/40"
            style={
              creator.avatarUrl
                ? { backgroundImage: `url("${creator.avatarUrl}")` }
                : undefined
            }
          >
            {creator.avatarUrl ? null : initials}
          </div>
          <div className="min-w-0 rounded-full bg-white/88 px-3 py-1.5 backdrop-blur-sm">
            <p className="truncate text-xs font-semibold text-brand-navy">
              {creator.displayName}
            </p>
          </div>
        </div>
      </div>

      <CardHeader className="px-4 pb-1 pt-4">
        <CardTitle className="line-clamp-1 text-base">
          {creator.displayName}
        </CardTitle>
        <p className="line-clamp-1 text-sm leading-5 text-muted-foreground">
          {creator.niche || "Kreator digital"}
        </p>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col space-y-3 px-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="rounded-full">
            <CheckCircle2 aria-hidden="true" />
            {availabilityLabels[creator.availabilityStatus]}
          </Badge>
          {creator.isVerified ? (
            <Badge variant="outline" className="rounded-full text-primary">
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
          <div className="rounded-2xl border border-border/70 bg-muted/35 p-3">
            <div className="flex items-start gap-2">
              <Layers3
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="line-clamp-2 min-h-10 text-sm font-medium leading-5 text-foreground">
                  {primaryService.title}
                </p>
                <p className="mt-1 truncate text-xs leading-5 text-muted-foreground">
                  {primaryService.categoryName} · {primaryService.estimatedDays} hari
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-auto grid grid-cols-2 overflow-hidden rounded-2xl border border-border/70 bg-background">
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
            ? "mt-auto grid gap-2 border-t border-border/70 bg-muted/25 p-3 sm:grid-cols-2"
            : "mt-auto border-t border-border/70 bg-muted/25 p-3"
        }
      >
        <Button
          asChild
          variant={primaryService ? "outline" : "default"}
          className="h-10 w-full rounded-full"
        >
          <Link href={`/kreator/${creator.id}`}>Lihat Profil</Link>
        </Button>
        {primaryService ? (
          <Button asChild className="h-10 w-full rounded-full">
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
