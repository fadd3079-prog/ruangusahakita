import {
  Activity,
  CreditCard,
  FileCheck2,
  FileText,
  Layers3,
  Search,
  Star,
} from "lucide-react";

import { SectionHeading } from "@/components/common/section-heading";
import { PageContainer } from "@/components/layout/page-container";

const steps = [
  {
    title: "Cari kreator",
    description: "Temukan kreator berdasarkan niche, kota, rating, dan portofolio.",
    icon: Search,
  },
  {
    title: "Pilih paket jasa",
    description: "Bandingkan output, estimasi hari pengerjaan, harga, dan batas revisi.",
    icon: Layers3,
  },
  {
    title: "Isi brief campaign",
    description: "Tuliskan tujuan campaign, target audiens, gaya konten, dan referensi.",
    icon: FileText,
  },
  {
    title: "Lakukan pembayaran",
    description: "Selesaikan pembayaran agar kreator dapat mulai memproses pesanan.",
    icon: CreditCard,
  },
  {
    title: "Pantau proses konten",
    description: "Ikuti status pesanan dari brief diterima sampai hasil konten dikirim.",
    icon: Activity,
  },
  {
    title: "Terima hasil dan beri review",
    description: "Review hasil konten, ajukan revisi bila perlu, lalu beri ulasan.",
    icon: Star,
  },
] as const;

export function HowItWorksSection() {
  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <PageContainer>
        <SectionHeading
          eyebrow="Cara kerja"
          title="Alur sederhana dari menemukan kreator sampai menerima hasil konten."
          description="Homepage ini hanya memperkenalkan alur. Implementasi fitur detail dapat dibangun bertahap setelah struktur data dan UI dasar siap."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article
                key={step.title}
                className="rounded-lg border border-border/70 bg-card p-5 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-semibold text-primary">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </article>
            );
          })}
        </div>
        <div className="mt-8 rounded-lg border border-primary/20 bg-primary/5 p-5 text-sm leading-7 text-muted-foreground">
          <FileCheck2 className="mb-3 size-5 text-primary" aria-hidden="true" />
          Status pesanan dan pembayaran dipisahkan agar UMKM, kreator, dan admin
          dapat membaca progress layanan digital dengan lebih jelas.
        </div>
      </PageContainer>
    </section>
  );
}
