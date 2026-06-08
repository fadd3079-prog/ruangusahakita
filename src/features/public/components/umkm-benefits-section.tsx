import {
  ClipboardCheck,
  Eye,
  FilePenLine,
  Gauge,
  ListChecks,
  MessagesSquare,
} from "lucide-react";

import { SectionHeading } from "@/components/common/section-heading";
import { PageContainer } from "@/components/layout/page-container";

const benefits = [
  {
    title: "Lebih mudah menemukan kreator",
    description:
      "UMKM dapat melihat niche, lokasi, rating, portofolio, dan harga mulai sebelum memilih kreator.",
    icon: Eye,
  },
  {
    title: "Harga dan output lebih jelas",
    description:
      "Paket jasa menampilkan deliverables, estimasi hari, dan jumlah revisi sejak awal.",
    icon: ListChecks,
  },
  {
    title: "Brief campaign lebih terarah",
    description:
      "UMKM dapat menyusun tujuan campaign, target audiens, dan preferensi konten dengan lebih rapi.",
    icon: ClipboardCheck,
  },
  {
    title: "Status pesanan mudah dipantau",
    description:
      "Proses pengerjaan konten dapat dipahami melalui status pesanan yang sesuai alur layanan digital.",
    icon: Gauge,
  },
  {
    title: "Hasil konten bisa direvisi",
    description:
      "Revisi mengikuti batas paket jasa sehingga ekspektasi UMKM dan kreator tetap jelas.",
    icon: FilePenLine,
  },
  {
    title: "Review membantu memilih kreator",
    description:
      "Rating dan review memberi konteks tambahan sebelum UMKM memesan layanan digital berikutnya.",
    icon: MessagesSquare,
  },
] as const;

export function UmkmBenefitsSection() {
  return (
    <section className="border-y border-border/70 bg-muted/30 py-16 sm:py-20 lg:py-24">
      <PageContainer>
        <SectionHeading
          eyebrow="Untuk UMKM"
          title="Keputusan promosi lebih mudah dibaca."
          description="Informasi layanan dibuat ringkas agar UMKM bisa memilih dengan tenang."
          align="center"
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <article
                key={benefit.title}
                className="marketplace-card p-5"
              >
                <Icon className="size-5 text-primary" aria-hidden="true" />
                <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">
                  {benefit.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {benefit.description}
                </p>
              </article>
            );
          })}
        </div>
      </PageContainer>
    </section>
  );
}
