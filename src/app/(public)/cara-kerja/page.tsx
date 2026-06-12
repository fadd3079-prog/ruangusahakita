import type { Metadata } from "next";
import Link from "next/link";
import { Search, Layers3, FileText, CreditCard, PenTool, Star, ArrowRight, CheckCircle2 } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Cara Kerja — Ruang Usaha Kita",
  description: "Pelajari bagaimana UMKM dan Kreator berkolaborasi di platform Ruang Usaha Kita.",
};

const steps = [
  {
    icon: Search,
    title: "1. UMKM Mencari Kreator",
    description: "Jelajahi katalog kreator terverifikasi. Filter berdasarkan niche, rating, lokasi, atau harga untuk menemukan mitra yang tepat untuk campaign Anda."
  },
  {
    icon: Layers3,
    title: "2. Memilih Paket Jasa",
    description: "Pilih paket layanan digital yang sesuai (Basic, Medium, Premium). Tiap paket memiliki kejelasan output dan estimasi pengerjaan."
  },
  {
    icon: FileText,
    title: "3. Mengisi Brief Campaign",
    description: "UMKM memberikan panduan detail (brief) kepada kreator. Termasuk tujuan campaign, target audiens, preferensi platform, dan catatan gaya konten."
  },
  {
    icon: CreditCard,
    title: "4. Pembayaran Sandbox",
    description: "UMKM melakukan pembayaran melalui sistem yang aman. Dana ditahan oleh sistem sampai hasil konten disetujui. Pada tahap MVP, alur ini masih memakai mode sandbox."
  },
  {
    icon: PenTool,
    title: "5. Kreator Memproduksi Konten",
    description: "Kreator mulai bekerja setelah pembayaran dikonfirmasi dan brief disetujui. Kreator akan mengirimkan hasil (draft/final) sesuai deadline."
  },
  {
    icon: Star,
    title: "6. Revisi dan Review",
    description: "UMKM meninjau hasil. Jika perlu, minta revisi sesuai batas paket. Setelah selesai, UMKM memberikan review untuk membantu reputasi kreator."
  }
];

export default function CaraKerjaPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-brand-navy pt-24 pb-32 text-white">
        <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-teal via-brand-navy to-transparent"></div>
        <PageContainer className="relative z-10 text-center">
          <Badge className="mb-6 bg-white/10 text-white hover:bg-white/20 border-white/20 px-3 py-1">Panduan Platform</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-4xl mx-auto">
            Kolaborasi Mudah, Konten Berkualitas.
          </h1>
          <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto leading-relaxed font-medium">
            Ruang Usaha Kita mempertemukan UMKM yang butuh promosi digital dengan Kreator berbakat melalui proses yang terstruktur, transparan, dan aman.
          </p>
        </PageContainer>
      </section>

      <section className="py-20">
        <PageContainer>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold tracking-tight text-brand-navy">Bagaimana Prosesnya?</h2>
            <p className="mt-4 text-muted-foreground">Enam langkah sederhana dari pencarian hingga hasil konten siap tayang.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {steps.map((step, idx) => (
              <div key={idx} className="relative rounded-2xl border border-border/70 bg-card p-8 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group">
                <div className="mb-6 grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 group-hover:bg-primary group-hover:text-white transition-colors">
                  <step.icon className="size-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </PageContainer>
      </section>

      <section className="py-24 bg-surface-soft border-y border-border/50">
        <PageContainer>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-brand-navy tracking-tight mb-4">Untuk Pelaku UMKM</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Tingkatkan visibilitas brand Anda tanpa perlu merekrut tim in-house. Platform kami melindungi transaksi Anda hingga Anda puas dengan hasil kerja kreator.
                </p>
              </div>
              <ul className="space-y-4">
                {[
                  "Katalog kreator yang terverifikasi dan transparan",
                  "Pembayaran ditahan sistem (Escrow) hingga selesai",
                  "Sistem brief yang memastikan konten on-target"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 font-medium text-foreground">
                    <CheckCircle2 className="size-5 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button asChild size="lg" className="h-12 px-8 text-base">
                <Link href="/register">Daftar sebagai UMKM</Link>
              </Button>
            </div>

            <div className="rounded-3xl bg-white p-8 sm:p-12 shadow-[var(--shadow-card)] border border-border/70">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-brand-navy tracking-tight mb-4">Untuk Kreator Digital</h2>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    Fokus pada kreativitas Anda, kami urus sisanya. Dapatkan klien dari seluruh Indonesia dengan sistem manajemen pesanan yang rapi.
                  </p>
                </div>
                <ul className="space-y-4">
                  {[
                    "Etalase portofolio dan paket jasa kustom",
                    "Jaminan pembayaran atas pekerjaan yang selesai",
                    "Manajemen revisi yang jelas dan terukur"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 font-medium text-foreground">
                      <CheckCircle2 className="size-5 text-brand-teal shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base border-primary/20 text-primary hover:bg-primary/5">
                  <Link href="/register">Daftar sebagai Kreator</Link>
                </Button>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      <section className="py-24 text-center">
        <PageContainer>
          <h2 className="text-3xl font-bold tracking-tight text-brand-navy max-w-2xl mx-auto">
            Siap untuk memulai kolaborasi pertama Anda?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Eksplorasi ribuan layanan digital dari kreator terbaik atau daftarkan diri Anda sekarang.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link href="/katalog">
                Jelajahi Katalog Layanan
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="h-12 px-8 text-base font-semibold">
              <Link href="/login">Masuk ke Akun</Link>
            </Button>
          </div>
        </PageContainer>
      </section>
    </main>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>
      {children}
    </span>
  );
}
