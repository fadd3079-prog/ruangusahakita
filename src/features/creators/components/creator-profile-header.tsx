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
  const initials = creator.displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <section className="border-b border-border/70 bg-background">
      <PageContainer className="grid gap-8 py-14 sm:py-16 lg:grid-cols-[1fr_360px] lg:items-end lg:py-20">
        <div>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="grid size-20 shrink-0 place-items-center rounded-xl bg-primary/10 text-2xl font-semibold text-primary ring-1 ring-primary/15">
              {initials}
            </div>
            <div>
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
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {creator.displayName}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
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

        <aside className="rounded-lg border border-border/70 bg-card p-5 shadow-xs">
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
              <Button asChild>
                <Link href={`/layanan/${primaryService.id}`}>Pilih Paket Jasa</Link>
              </Button>
            ) : null}
            <Button asChild variant="outline">
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
    <div className="rounded-lg border border-border/70 bg-card px-4 py-3 shadow-xs">
      <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        <Icon className="size-4 text-primary" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-2 text-sm font-semibold text-foreground">{value}</dd>
    </div>
  );
}
