import type { Metadata } from "next";
import Link from "next/link";
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  Images,
  MapPin,
  Settings,
  ShieldCheck,
  Star,
} from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { DashboardPanel } from "@/features/dashboard/components/dashboard-overview";
import { getCurrentCreatorProfilePageData } from "@/features/creator/profile/data/creator-profile-queries";
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

export default async function CreatorProfilePage() {
  const data = await getCurrentCreatorProfilePageData();
  const profile = data.profile;

  if (!profile) {
    return (
      <PageContainer>
        <div className="space-y-8 pb-10">
          <PageHeader />
          <Card className="rounded-3xl border-dashed border-border bg-card/95 p-8 text-center shadow-[var(--shadow-soft)]">
            <CardContent className="mx-auto max-w-xl space-y-4">
              <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Settings className="size-7" aria-hidden="true" />
              </div>
              <CardTitle className="text-2xl">Profil belum lengkap</CardTitle>
              <p className="text-sm leading-6 text-muted-foreground">
                Lengkapi profil kreator agar UMKM dapat memahami niche, bio,
                lokasi, dan ketersediaan Anda.
              </p>
              <Button asChild>
                <Link href="/creator/settings">Lengkapi Profil</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }

  const initials = profile.display_name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <PageHeader creatorId={profile.id} />

        <section className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[var(--shadow-card)]">
          <div
            className="h-48 w-full bg-[linear-gradient(135deg,var(--brand-navy-950),var(--brand-teal-900))] bg-cover bg-center"
            style={
              profile.banner_url
                ? { backgroundImage: `url(${profile.banner_url})` }
                : undefined
            }
          />
          <div className="px-6 pb-8 sm:px-10">
            <div className="-mt-16 mb-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex min-w-0 items-end gap-5">
                <div
                  className="grid size-32 shrink-0 place-items-center rounded-2xl bg-white bg-cover bg-center text-4xl font-semibold text-primary ring-4 ring-background shadow-sm"
                  style={
                    profile.avatar_url
                      ? { backgroundImage: `url(${profile.avatar_url})` }
                      : undefined
                  }
                >
                  {profile.avatar_url ? null : initials}
                </div>
                <div className="mb-2 min-w-0">
                  <div className="flex min-w-0 items-center gap-2">
                    <h2 className="truncate text-2xl font-bold text-foreground">
                      {profile.display_name}
                    </h2>
                    {profile.is_verified ? (
                      <ShieldCheck className="size-5 text-primary" />
                    ) : null}
                  </div>
                  <p className="mt-1 truncate text-sm font-medium text-muted-foreground">
                    {profile.niche ?? "Niche belum diisi"}
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  profile.availability_status === "available" ? "default" : "secondary"
                }
                className="h-8 rounded-lg px-3 sm:mb-2"
              >
                <CheckCircle2 className="mr-1.5 size-4" />
                {availabilityLabels[profile.availability_status]}
              </Badge>
            </div>

            <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
              <div className="space-y-8">
                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Tentang Saya</h3>
                  <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground">
                    {profile.bio ?? "Bio kreator belum diisi."}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-foreground">Keahlian</h3>
                  {profile.skills && profile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <Badge key={skill} variant="outline" className="max-w-full truncate rounded-md bg-muted/40">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Keahlian belum ditambahkan.
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4 rounded-2xl border border-border/70 bg-surface-soft p-5">
                  <ProfileFact
                    icon={MapPin}
                    label="Lokasi"
                    value={
                      profile.city || profile.province
                        ? [profile.city, profile.province].filter(Boolean).join(", ")
                        : "Belum diisi"
                    }
                  />
                  <ProfileFact
                    icon={Star}
                    label="Rating & review"
                    value={`${data.averageRating.toFixed(1)} (${data.reviewCount} review)`}
                  />
                  <ProfileFact
                    icon={BriefcaseBusiness}
                    label="Pesanan selesai"
                    value={`${data.completedOrdersCount} pesanan`}
                  />
                  <ProfileFact
                    icon={Clock}
                    label="Waktu respons"
                    value={
                      profile.response_time_hours
                        ? `Sekitar ${profile.response_time_hours} jam`
                        : "Belum diisi"
                    }
                  />
                </div>

                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
                    Harga mulai dari
                  </p>
                  <p className="text-2xl font-bold text-brand-navy">
                    {formatCurrency(Number(profile.starting_price ?? 0))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <DashboardPanel
            title="Layanan aktif"
            description="Paket jasa yang saat ini ditawarkan ke UMKM."
            action={{ label: "Kelola Layanan", href: "/creator/services" }}
          >
            <SummaryCard
              icon={BriefcaseBusiness}
              title={`${data.activeServicesCount} paket tersedia`}
              description={
                data.activeServicesCount > 0
                  ? "Layanan Anda siap tampil di katalog."
                  : "Belum ada layanan aktif."
              }
            />
          </DashboardPanel>

          <DashboardPanel
            title="Karya portofolio"
            description="Contoh hasil konten untuk membantu UMKM menilai gaya kerja."
            action={{ label: "Kelola Portofolio", href: "/creator/portfolio" }}
          >
            <SummaryCard
              icon={Images}
              title={`${data.portfolioCount} karya tersimpan`}
              description={
                data.portfolioCount > 0
                  ? "Portofolio tampil pada profil publik jika akun sudah siap."
                  : "Belum ada portofolio."
              }
            />
          </DashboardPanel>
        </section>
      </div>
    </PageContainer>
  );
}

function PageHeader({ creatorId }: { creatorId?: string }) {
  return (
    <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">
          Profil Publik
        </h1>
        <p className="mt-2 text-muted-foreground">
          Bagaimana UMKM melihat profil, keahlian, dan ketersediaan Anda.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" asChild>
          <Link href="/creator/settings">
            <Settings className="mr-2 size-4" />
            Edit Profil
          </Link>
        </Button>
        {creatorId ? (
          <Button asChild>
            <Link href={`/kreator/${creatorId}`}>Lihat Publik</Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
}

function ProfileFact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon className="size-5 text-primary" aria-hidden="true" />
      <div>
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-muted-foreground">{value}</p>
      </div>
    </div>
  );
}

function SummaryCard({
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: typeof BriefcaseBusiness;
  title: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border/70 bg-muted/20 p-4">
      <div className="grid size-12 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-6" />
      </div>
      <div>
        <p className="font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
