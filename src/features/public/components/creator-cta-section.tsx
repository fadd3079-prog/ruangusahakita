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
      <PageContainer className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,0.7fr)] lg:items-center">
        <div className="max-w-3xl">
          <AppLogo href={null} showText={false} className="mb-6" />
          <p className="text-sm font-semibold text-primary">Untuk kreator</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Tampilkan portofolio. Kelola paket jasa. Terima order UMKM.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
            Bangun profil kreator yang rapi dan mudah dinilai oleh UMKM.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {creatorHighlights.map((highlight) => {
              const Icon = highlight.icon;

              return (
                <div
                  key={highlight.label}
                  className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background px-3 py-3 text-sm text-muted-foreground shadow-xs"
                >
                  <Icon className="size-4 text-primary" aria-hidden="true" />
                  <span>{highlight.label}</span>
                </div>
              );
            })}
          </div>
          <Button asChild size="lg" className="mt-7 h-12 rounded-full px-6">
            <Link href="/register">
              Daftar sebagai Kreator
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="grid gap-3">
            {creatorHighlights.map((highlight) => {
              const Icon = highlight.icon;

              return (
                <div
                  key={highlight.label}
                  className="flex items-center gap-3 rounded-xl border border-border/70 bg-background px-4 py-3"
                >
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {highlight.label}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-5 border-t border-border/70 pt-5">
            <p className="text-sm font-semibold text-foreground">
              Workspace kreator digital
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Satu tempat untuk profil, paket jasa, portofolio, dan pesanan masuk.
            </p>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
