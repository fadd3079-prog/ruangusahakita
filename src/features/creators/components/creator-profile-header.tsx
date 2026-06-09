import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  Star,
  Tag,
} from "lucide-react";

import { PriceText } from "@/components/common/price-text";
import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  PublicAvailabilityStatus,
  PublicCreatorProfile,
  PublicServicePackage,
} from "@/features/catalog/data/catalog-types";

const availabilityLabels: Record<PublicAvailabilityStatus, string> = {
  available: "Tersedia",
  limited: "Jadwal terbatas",
  busy: "Penuh sementara",
  unavailable: "Belum tersedia",
};

type CreatorProfileHeaderProps = {
  creator: PublicCreatorProfile;
  primaryService?: PublicServicePackage;
};

export function CreatorProfileHeader({
  creator,
  primaryService,
}: CreatorProfileHeaderProps) {
  const visualUrl = creator.bannerUrl;
  const initials = creator.displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <section className="border-b border-border/70 bg-background">
      <PageContainer className="grid gap-8 py-12 sm:py-14 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:py-16">
        <div>
          <div
            className="mb-6 grid aspect-[16/6] min-h-52 place-items-center rounded-[22px] bg-muted/50 bg-cover bg-center"
            style={
              visualUrl ? { backgroundImage: `url("${visualUrl}")` } : undefined
            }
          >
            {visualUrl ? null : (
              <span className="text-5xl font-semibold text-primary/25">
                {initials}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div
              className="-mt-12 grid size-20 shrink-0 place-items-center rounded-full bg-white bg-cover bg-center text-2xl font-semibold text-primary shadow-[var(--shadow-card)] ring-4 ring-background sm:mt-0"
              style={
                creator.avatarUrl
                  ? { backgroundImage: `url("${creator.avatarUrl}")` }
                  : undefined
              }
            >
              {creator.avatarUrl ? null : initials}
            </div>
            <div>
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
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {creator.displayName}
              </h1>
              <p className="mt-4 line-clamp-3 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {creator.bio}
              </p>
            </div>
          </div>

          <dl className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric
              icon={Tag}
              label="Niche"
              value={creator.niche}
            />
            <Metric
              icon={MapPin}
              label="Lokasi"
              value={`${creator.city}, ${creator.province}`}
            />
            <Metric
              icon={Star}
              label="Rating"
              value={`${creator.averageRating.toFixed(1)} rata-rata`}
            />
            <Metric
              icon={Clock}
              label="Respons"
              value={`Sekitar ${creator.responseTimeHours} jam`}
            />
          </dl>
        </div>

        <aside className="marketplace-card p-5 lg:sticky lg:top-24">
          <p className="text-sm font-medium text-muted-foreground">
            {creator.completedOrdersCount} pesanan selesai
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
            <PriceText value={creator.startingPrice} prefix="Mulai" />
          </p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Mulai dari paket jasa yang tersedia, lalu isi brief campaign dengan
            kebutuhan promosi UMKM Anda.
          </p>
          <div className="mt-5 grid gap-2">
            {primaryService ? (
              <Button asChild className="h-11 rounded-full">
                <Link href={`/layanan/${primaryService.id}`}>Pilih Paket Jasa</Link>
              </Button>
            ) : null}
            <Button asChild variant="outline" className="h-11 rounded-full">
              <Link href="/katalog">
                <MessageCircle aria-hidden="true" />
                Kembali ke Katalog
              </Link>
            </Button>
          </div>
        </aside>
      </PageContainer>
    </section>
  );
}

type MetricProps = {
  icon: typeof Tag;
  label: string;
  value: string;
};

function Metric({ icon: Icon, label, value }: MetricProps) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-xs">
      <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        <Icon className="size-4 text-primary" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-2 text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}
