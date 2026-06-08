import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  CreditCard,
  FileCheck2,
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
    <section className="relative min-h-[100svh] overflow-hidden border-b border-white/10 bg-[url('/images/hero-background.webp')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-[#061723]/55" aria-hidden="true" />
      <PageContainer className="relative z-10 grid min-h-[100svh] items-center gap-12 py-24 sm:py-28 lg:grid-cols-[1.04fr_0.96fr] lg:py-32">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/12 px-3 py-2 text-sm font-medium text-white/82 shadow-xs backdrop-blur-md">
            <Sparkles className="size-4 text-white" aria-hidden="true" />
            Marketplace jasa digital untuk UMKM
          </div>
          <h1 className="mt-7 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Temukan Kreator yang Tepat untuk Promosi UMKM Anda
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 sm:text-lg">
            Ruang Usaha Kita membantu UMKM mencari kreator, memilih paket jasa
            digital, mengisi brief campaign, dan memantau proses pembuatan
            konten secara lebih mudah dan terarah.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-11 px-5">
              <Link href="/katalog">
                Cari Kreator
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 border-white/25 bg-white/10 px-5 text-white hover:bg-white/18 hover:text-white"
            >
              <Link href="/cara-kerja">Lihat Cara Kerja</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-white/18 bg-white/12 p-4 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-5">
          <div className="rounded-lg border border-white/15 bg-white/90 p-4 text-foreground shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-border/80 pb-4">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Alur marketplace
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Alur awal pemesanan layanan digital
                </p>
              </div>
              <div className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                MVP
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {flowItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.label}
                    className="flex gap-4 rounded-lg border border-border/70 bg-muted/35 p-4"
                  >
                    <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        Langkah {index + 1}
                      </p>
                      <h2 className="mt-1 text-base font-semibold tracking-tight text-foreground">
                        {item.label}
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
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
