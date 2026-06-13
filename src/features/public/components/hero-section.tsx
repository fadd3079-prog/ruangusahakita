import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, ShieldCheck, Sparkles, Star } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

const popularSearches = [
  "Video Reels",
  "Desain Grafis",
  "Copywriting",
  "Digital Marketing",
] as const;

const heroStats = [
  {
    label: "kategori",
    value: "6",
  },
  {
    label: "alur order",
    value: "brief",
  },
  {
    label: "review",
    value: "real",
  },
] as const;

export function HeroSection() {
  return (
    <section className="relative isolate min-h-[100svh] overflow-hidden bg-[#06111f]">
      <Image
        src="/images/hero-background.webp"
        alt="Ruang kerja kreatif untuk layanan digital UMKM"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,12,22,0.86),rgba(3,12,22,0.62),rgba(3,12,22,0.48))]" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(180deg,transparent,var(--background))]" />

      <PageContainer className="relative z-10 grid min-h-[100svh] items-center gap-10 py-24 sm:py-28 lg:grid-cols-[minmax(0,1fr)_420px] lg:py-32">
        <div className="min-w-0 max-w-5xl">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/16 bg-white/12 px-4 py-2 text-sm font-semibold text-white/88 shadow-sm backdrop-blur-md">
            <Sparkles className="size-4 shrink-0 text-[#9fe0d4]" aria-hidden="true" />
            <span className="truncate">Marketplace jasa digital untuk UMKM</span>
          </div>

          <h1 className="mt-7 max-w-5xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Temukan kreator untuk campaign yang lebih terarah.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/76 sm:text-lg">
            Cari layanan digital, pilih paket jasa, kirim brief campaign, dan
            pantau hasil konten dari satu ruang kerja.
          </p>

          <div className="mt-8 max-w-3xl rounded-[1.75rem] border border-white/18 bg-white/94 p-2 shadow-2xl shadow-black/25 backdrop-blur-md">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl bg-[#f5f7f7] px-4 py-3 text-sm text-muted-foreground">
                <Search className="size-5 shrink-0 text-primary" aria-hidden="true" />
                <span className="truncate">Cari kreator, layanan, atau kategori</span>
              </div>
              <Button asChild size="lg" className="h-12 rounded-2xl px-6">
                <Link href="/katalog">
                  Cari Kreator
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {popularSearches.map((item) => (
              <Link
                key={item}
                href="/katalog"
                className="rounded-full border border-white/16 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/82 backdrop-blur-sm transition-colors hover:bg-white/16"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>

        <aside className="hidden min-w-0 rounded-[2rem] border border-white/16 bg-white/12 p-4 text-white shadow-2xl shadow-black/20 backdrop-blur-xl lg:block">
          <div className="rounded-[1.5rem] bg-white p-4 text-[#06111f]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-muted">
              <Image
                src="/images/abstract (8).webp"
                alt="Visual marketplace jasa digital"
                fill
                sizes="420px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,17,31,0.04),rgba(6,17,31,0.5))]" />
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/92 p-4 shadow-lg backdrop-blur-md">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#0c2949]">
                      Paket konten promosi
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      Brief, status, revisi, review
                    </p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    <Star className="size-3.5 fill-emerald-600" aria-hidden="true" />
                    4.8
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {heroStats.map((item) => (
                <div key={item.label} className="rounded-2xl bg-[#f5f7f7] p-3">
                  <p className="truncate text-lg font-semibold text-[#0c2949]">
                    {item.value}
                  </p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/12 bg-white/10 p-4">
            <ShieldCheck className="size-5 shrink-0 text-[#9fe0d4]" aria-hidden="true" />
            <p className="line-clamp-2 text-sm leading-6 text-white/76">
              Order, pembayaran, hasil konten, dan review tersusun dalam satu flow.
            </p>
          </div>
        </aside>
      </PageContainer>
    </section>
  );
}
