import Link from "next/link";
import type { ReactNode } from "react";
import {
  CheckCircle2,
  Layers3,
  MapPin,
  Star,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import { PriceText } from "@/components/common/price-text";
import { TruncateText } from "@/components/common/truncate-text";
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
    basePrice?: number;
    id: string;
    title: string;
    categoryName: string;
    estimatedDays: number;
  } | null;
};

export function CreatorCard({ creator, primaryService }: CreatorCardProps) {
  const visualUrl = creator.bannerUrl;
  const startingPrice = primaryService?.basePrice ?? creator.startingPrice;
  const initials = creator.displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <Card className="marketplace-card group flex h-full flex-col overflow-hidden p-0 transition-[border-color,box-shadow] duration-200 hover:border-primary/30 hover:shadow-[var(--shadow-marketplace)]">
      <div
        className="relative aspect-[16/7] shrink-0 bg-muted/50 bg-cover bg-center"
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
        <div className="absolute bottom-2.5 left-3 flex min-w-0 items-center gap-2 pr-3">
          <div
            className="grid size-9 shrink-0 place-items-center rounded-full bg-white bg-cover bg-center text-xs font-semibold text-primary shadow-sm ring-1 ring-white/40"
            style={
              creator.avatarUrl
                ? { backgroundImage: `url("${creator.avatarUrl}")` }
                : undefined
            }
          >
            {creator.avatarUrl ? null : initials}
          </div>
          <div className="min-w-0 rounded-full bg-white/88 px-3 py-1.5 backdrop-blur-sm">
            <TruncateText
              text={creator.displayName}
              className="text-xs font-semibold text-brand-navy"
            />
          </div>
        </div>
      </div>

      <CardHeader className="px-3.5 pb-1 pt-3">
        <CardTitle className="line-clamp-1 text-base">
          {creator.displayName}
        </CardTitle>
        <TruncateText
          text={creator.niche || "Kreator digital"}
          className="text-sm leading-5 text-muted-foreground"
        />
      </CardHeader>

      <CardContent className="flex flex-1 flex-col space-y-2.5 px-3.5">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="rounded-full text-[11px]">
            <CheckCircle2 aria-hidden="true" />
            {availabilityLabels[creator.availabilityStatus]}
          </Badge>
          {creator.isVerified ? (
            <Badge variant="outline" className="rounded-full text-[11px] text-primary">
              Terverifikasi
            </Badge>
          ) : null}
        </div>

        <div className="grid gap-1 text-xs text-muted-foreground">
          <CreatorMeta icon={MapPin}>
            {creator.city}, {creator.province}
          </CreatorMeta>
          <CreatorMeta icon={Star} emphasized>
            {creator.averageRating.toFixed(1)} · {creator.completedOrdersCount} selesai
          </CreatorMeta>
        </div>

        {primaryService ? (
          <div className="rounded-xl border border-border/70 bg-muted/30 p-2.5">
            <div className="flex items-start gap-2">
              <Layers3
                className="mt-0.5 size-4 shrink-0 text-primary"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <TruncateText
                  lines={2}
                  text={primaryService.title}
                  className="text-sm font-medium leading-5 text-foreground"
                />
                <TruncateText
                  text={`${primaryService.categoryName} · ${primaryService.estimatedDays} hari`}
                  className="mt-1 text-xs leading-5 text-muted-foreground"
                />
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-auto grid grid-cols-2 overflow-hidden rounded-xl border border-border/70 bg-background">
          <div className="border-r border-border/70 p-2.5">
            <p className="text-xs text-muted-foreground">Mulai dari</p>
            <p className="mt-1 text-sm font-semibold text-foreground">
              <PriceText value={startingPrice} prefix="" />
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
            ? "mt-auto grid gap-2 border-t border-border/70 bg-muted/25 p-2.5 sm:grid-cols-2"
            : "mt-auto border-t border-border/70 bg-muted/25 p-2.5"
        }
      >
        <Button
          asChild
          variant={primaryService ? "outline" : "default"}
          className="h-9 w-full rounded-full text-xs"
        >
          <Link href={`/kreator/${creator.id}`}>Lihat Profil</Link>
        </Button>
        {primaryService ? (
          <Button asChild className="h-9 w-full rounded-full text-xs">
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
