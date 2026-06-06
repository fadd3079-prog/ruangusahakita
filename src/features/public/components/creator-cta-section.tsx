import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, Images, LayoutList } from "lucide-react";

import { AppLogo } from "@/components/common/app-logo";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

const creatorHighlights = [
  {
    label: "Tampilkan portofolio",
    icon: Images,
  },
  {
    label: "Buat paket layanan",
    icon: LayoutList,
  },
  {
    label: "Terima order dari UMKM",
    icon: BriefcaseBusiness,
  },
] as const;

export function CreatorCtaSection() {
  return (
    <section className="border-y border-primary/15 bg-primary/5 py-16 sm:py-20 lg:py-24">
      <PageContainer className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-3xl">
          <AppLogo href={null} showText={false} className="mb-6" />
          <p className="text-sm font-semibold text-primary">Untuk kreator</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Tempat menampilkan portofolio dan menerima order layanan digital.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Untuk kreator, Ruang Usaha Kita menjadi tempat menampilkan
            portofolio, membuat paket layanan, dan menerima order dari UMKM.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {creatorHighlights.map((highlight) => {
              const Icon = highlight.icon;

              return (
                <div
                  key={highlight.label}
                  className="flex items-center gap-3 rounded-lg border border-border/70 bg-background px-3 py-3 text-sm text-muted-foreground shadow-xs"
                >
                  <Icon className="size-4 text-primary" aria-hidden="true" />
                  <span>{highlight.label}</span>
                </div>
              );
            })}
          </div>
        </div>
        <Button asChild size="lg" className="h-11 px-5">
          <Link href="/register">
            Daftar sebagai Kreator
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </PageContainer>
    </section>
  );
}
