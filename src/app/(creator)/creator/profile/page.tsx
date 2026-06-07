import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Star,
  Clock,
  BriefcaseBusiness,
  Images,
  CheckCircle2,
  Settings,
  ShieldCheck
} from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardPanel } from "@/features/dashboard/components/dashboard-overview";
import { dummyCreators, dummyReviews, dummyServicePackages, dummyPortfolios } from "@/lib/dummy";
import { formatCurrency } from "@/lib/formatters/currency";

export const metadata: Metadata = {
  title: "Profil Saya — Ruang Usaha Kita",
  description: "Kelola profil kreator Anda di Ruang Usaha Kita.",
};

const availabilityLabels = {
  available: "Tersedia",
  limited: "Terbatas",
  busy: "Penuh Sementara",
  unavailable: "Belum Tersedia",
} as const;

export default function CreatorProfilePage() {
  const currentCreator = dummyCreators.find((creator) => creator.id === "creator_003") ?? dummyCreators[0];
  const reviewCount = dummyReviews.filter((review) => review.creatorId === currentCreator.id).length;
  const activeServices = dummyServicePackages.filter(service => service.creatorId === currentCreator.id && service.isActive).length;
  const portfolioCount = dummyPortfolios.filter(port => port.creatorId === currentCreator.id).length;

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">Profil Publik</h1>
            <p className="mt-2 text-muted-foreground">Bagaimana UMKM melihat profil dan keahlian Anda.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/creator/settings">
                <Settings className="size-4 mr-2" />
                Edit Profil
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/kreator/${currentCreator.id}`}>Lihat Publik</Link>
            </Button>
          </div>
        </div>

        <section className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[var(--shadow-card)]">
          <div className="h-48 w-full bg-[linear-gradient(135deg,var(--brand-navy-950),var(--brand-teal-900))]" />
          <div className="px-6 pb-8 sm:px-10">
            <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 -mt-16 mb-6">
              <div className="flex items-end gap-5">
                <div className="grid size-32 shrink-0 place-items-center rounded-2xl bg-white text-4xl font-semibold text-primary ring-4 ring-background shadow-sm">
                  {currentCreator.displayName.split(" ").map(p => p[0]).join("").slice(0, 2)}
                </div>
                <div className="mb-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-foreground">{currentCreator.displayName}</h2>
                    {currentCreator.isVerified && (
                      <ShieldCheck className="size-5 text-primary" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mt-1">{currentCreator.niche}</p>
                </div>
              </div>
              <div className="flex gap-2 sm:mb-2">
                <Badge variant={currentCreator.availabilityStatus === "available" ? "default" : "secondary"} className="rounded-lg h-8 px-3">
                  <CheckCircle2 className="size-4 mr-1.5" />
                  {availabilityLabels[currentCreator.availabilityStatus]}
                </Badge>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Tentang Saya</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {currentCreator.bio}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Keahlian (Skills)</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentCreator.skills.map(skill => (
                      <Badge key={skill} variant="outline" className="rounded-md bg-muted/40">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-border/70 bg-surface-soft p-5 space-y-4">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="size-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Lokasi</p>
                      <p className="text-muted-foreground">{currentCreator.city}, {currentCreator.province}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Star className="size-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Rating & Ulasan</p>
                      <p className="text-muted-foreground">{currentCreator.averageRating.toFixed(1)} ({reviewCount} ulasan)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <BriefcaseBusiness className="size-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Pesanan Selesai</p>
                      <p className="text-muted-foreground">{currentCreator.completedOrdersCount} pesanan</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="size-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Waktu Respons</p>
                      <p className="text-muted-foreground">Sekitar {currentCreator.responseTimeHours} jam</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Harga Mulai Dari</p>
                  <p className="text-2xl font-bold text-brand-navy">{formatCurrency(currentCreator.startingPrice)}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <DashboardPanel
            title="Layanan Aktif"
            description="Paket jasa yang saat ini ditawarkan ke UMKM."
            action={{ label: "Kelola Layanan", href: "/creator/services" }}
          >
            <div className="flex items-center gap-4 p-4 rounded-xl border border-border/70 bg-muted/20">
              <div className="grid size-12 place-items-center rounded-lg bg-primary/10 text-primary">
                <BriefcaseBusiness className="size-6" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{activeServices} Paket Tersedia</p>
                <p className="text-sm text-muted-foreground">Siap dipesan oleh UMKM</p>
              </div>
            </div>
          </DashboardPanel>

          <DashboardPanel
            title="Karya Portofolio"
            description="Hasil konten terbaik untuk menarik klien."
            action={{ label: "Kelola Portofolio", href: "/creator/portfolio" }}
          >
             <div className="flex items-center gap-4 p-4 rounded-xl border border-border/70 bg-muted/20">
              <div className="grid size-12 place-items-center rounded-lg bg-primary/10 text-primary">
                <Images className="size-6" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{portfolioCount} Karya Publik</p>
                <p className="text-sm text-muted-foreground">Tampil di halaman profil</p>
              </div>
            </div>
          </DashboardPanel>
        </section>
      </div>
    </PageContainer>
  );
}
