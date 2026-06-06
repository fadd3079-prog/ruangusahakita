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
    description: "Gunakan simulasi pembayaran untuk tahap MVP.",
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
    <section className="relative overflow-hidden border-b border-border/70 bg-background">
      <PageContainer className="grid min-h-[calc(100svh-5rem)] items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.04fr_0.96fr] lg:py-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-muted-foreground shadow-xs">
            <Sparkles className="size-4 text-primary" aria-hidden="true" />
            Marketplace jasa digital untuk UMKM
          </div>
          <h1 className="mt-7 max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Temukan Kreator yang Tepat untuk Promosi UMKM Anda
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
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
            <Button asChild variant="outline" size="lg" className="h-11 px-5">
              <Link href="/cara-kerja">Lihat Cara Kerja</Link>
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-border/80 bg-card/80 p-4 shadow-sm sm:p-5">
          <div className="rounded-lg border border-border bg-background p-4">
            <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Alur marketplace
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Simulasi awal pemesanan layanan digital
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
