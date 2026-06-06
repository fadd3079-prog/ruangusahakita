import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeading } from "@/components/common/section-heading";
import { PageContainer } from "@/components/layout/page-container";

const faqs = [
  {
    question: "Apa itu Ruang Usaha Kita?",
    answer:
      "Ruang Usaha Kita adalah marketplace jasa digital yang membantu UMKM menemukan kreator atau marketer untuk kebutuhan promosi digital.",
  },
  {
    question: "Siapa yang bisa menggunakan platform ini?",
    answer:
      "UMKM dapat mencari kreator dan memesan paket jasa, sementara kreator dapat menampilkan portofolio serta layanan digital yang mereka tawarkan.",
  },
  {
    question: "Apa saja layanan yang tersedia?",
    answer:
      "Kategori awal mencakup Video TikTok/Reels, Desain Feed Instagram, Foto Produk, Review Produk, Caption Promosi, dan Campaign UMKM.",
  },
  {
    question: "Apakah pembayaran sudah langsung menggunakan payment gateway?",
    answer:
      "Pada tahap MVP, pembayaran dapat menggunakan simulasi atau sandbox. Integrasi payment gateway seperti Midtrans disiapkan sebagai pengembangan lanjutan.",
  },
  {
    question: "Bagaimana jika hasil konten perlu direvisi?",
    answer:
      "UMKM dapat meminta revisi sesuai batas revisi pada paket jasa yang dipilih, lalu kreator mengirim pembaruan hasil konten untuk direview kembali.",
  },
] as const;

export function FaqPreviewSection() {
  return (
    <section className="bg-muted/30 py-16 sm:py-20 lg:py-24">
      <PageContainer maxWidth="narrow">
        <SectionHeading
          eyebrow="FAQ"
          title="Pertanyaan umum sebelum mulai memakai marketplace."
          description="Jawaban ini menjelaskan ruang lingkup MVP tanpa menjanjikan integrasi yang belum dibangun."
          align="center"
        />
        <div className="mt-10 divide-y divide-border rounded-lg border border-border/70 bg-card">
          {faqs.map((faq) => (
            <details key={faq.question} className="group px-5 py-4 open:bg-muted/30">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-semibold text-foreground">
                {faq.question}
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 pr-10 text-sm leading-6 text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/bantuan"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
          >
            Lihat pusat bantuan
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </PageContainer>
    </section>
  );
}
