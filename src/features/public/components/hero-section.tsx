import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  CreditCard,
  FileCheck2,
  PlayCircle,
  Search,
  Sparkles,
} from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

const flowItems = [
  {
    label: "Cari kreator",
    description: "Bandingkan niche, portofolio, dan rating.",
    icon: Search,
  },
  {
    label: "Isi brief campaign",
    description: "Tuliskan tujuan promosi dan arahan konten.",
    icon: ClipboardList,
  },
  {
    label: "Lakukan pembayaran",
    description: "Gunakan alur pembayaran sandbox untuk tahap MVP.",
    icon: CreditCard,
  },
  {
    label: "Terima hasil konten",
    description: "Review hasil, ajukan revisi, lalu beri review.",
    icon: FileCheck2,
  },
] as const;

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-[url('/images/hero-background.webp')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,15,25,0.78),rgba(4,15,25,0.52),rgba(4,15,25,0.46))]" aria-hidden="true" />
      <PageContainer className="relative z-10 grid min-h-[100svh] items-center gap-10 py-24 sm:py-28 lg:grid-cols-[minmax(0,0.96fr)_minmax(360px,0.62fr)] lg:py-32">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/12 px-4 py-2 text-sm font-semibold text-white/86 shadow-sm backdrop-blur-md">
            <Sparkles className="size-4 text-white" aria-hidden="true" />
            Marketplace jasa digital untuk UMKM
          </div>
          <h1 className="mt-7 max-w-5xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Temukan Kreator yang Tepat untuk Promosi UMKM Anda
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
            Cari kreator, pilih paket jasa, susun brief campaign, dan pantau
            status pesanan dalam satu alur yang rapi.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-full bg-white px-6 text-brand-navy hover:bg-white/90">
              <Link href="/katalog">
                Cari Kreator
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 rounded-full border-white/24 bg-white/10 px-6 text-white hover:bg-white/16 hover:text-white"
            >
              <Link href="/cara-kerja">Lihat Cara Kerja</Link>
            </Button>
          </div>
          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3 text-white">
            {[
              ["Kreator", "aktif"],
              ["Paket jasa", "terstruktur"],
              ["Brief", "terarah"],
            ].map(([value, label]) => (
              <div key={value} className="rounded-2xl border border-white/14 bg-white/10 px-4 py-3 backdrop-blur-md">
                <p className="text-base font-semibold">{value}</p>
                <p className="mt-1 text-xs text-white/62">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="marketplace-card border-white/16 bg-white/92 p-4 shadow-2xl shadow-black/20 backdrop-blur-md">
          <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background px-4 py-3">
            <Search className="size-5 text-primary" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-muted-foreground">
              Cari kreator, layanan, atau niche
            </span>
            <Button asChild size="sm" className="rounded-full">
              <Link href="/katalog">Cari</Link>
            </Button>
          </div>
          <div className="mt-4 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,var(--brand-navy-950),var(--brand-teal-900))] p-5 text-white">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white/70">
                  Alur marketplace
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  Dari brief sampai hasil konten.
                </h2>
              </div>
              <div className="grid size-11 place-items-center rounded-full bg-white/12 ring-1 ring-white/14">
                <PlayCircle className="size-5 text-white" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-5 grid gap-2">
              {flowItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl bg-white/8 px-3 py-2.5"
                  >
                    <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-white/12 text-white">
                      <Icon className="size-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">
                        {index + 1}. {item.label}
                      </p>
                      <p className="truncate text-xs text-white/62">{item.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
