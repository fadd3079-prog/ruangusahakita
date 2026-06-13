import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  BriefcaseBusiness,
  CreditCard,
  FileText,
  HelpCircle,
  LifeBuoy,
  Mail,
  MessageCircle,
  RotateCcw,
  Store,
  UserCircle,
} from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pusat Bantuan — Ruang Usaha Kita",
  description: "FAQ dan kontak admin Ruang Usaha Kita untuk UMKM dan kreator.",
};

const faqSections = [
  {
    category: "Akun",
    icon: UserCircle,
    items: [
      {
        answer: "UMKM dan kreator dapat membuat akun dari halaman daftar. Admin dibuat manual dari database.",
        question: "Siapa yang bisa mendaftar?",
      },
      {
        answer: "Gunakan halaman lupa password. Link reset akan dikirim lewat email akun.",
        question: "Bagaimana jika lupa password?",
      },
    ],
  },
  {
    category: "UMKM",
    icon: Store,
    items: [
      {
        answer: "Cari kreator, pilih paket jasa, isi brief campaign, lalu lanjutkan pembayaran.",
        question: "Bagaimana UMKM mulai memesan?",
      },
      {
        answer: "Brief berisi tujuan campaign, target audiens, platform konten, gaya, referensi, dan catatan tambahan.",
        question: "Apa yang perlu disiapkan?",
      },
    ],
  },
  {
    category: "Kreator",
    icon: BriefcaseBusiness,
    items: [
      {
        answer: "Lengkapi profil, buat paket layanan, atur tier harga, dan tampilkan portofolio.",
        question: "Bagaimana kreator mulai menerima order?",
      },
      {
        answer: "Kreator memproses order setelah pembayaran UMKM berhasil dan brief diterima.",
        question: "Kapan kreator mulai bekerja?",
      },
    ],
  },
  {
    category: "Order",
    icon: FileText,
    items: [
      {
        answer: "Status pesanan menunjukkan proses jasa digital. Status pembayaran tetap terpisah.",
        question: "Apa bedanya status pesanan dan pembayaran?",
      },
      {
        answer: "UMKM dan kreator dapat berkomunikasi di chat order untuk konteks brief dan hasil konten.",
        question: "Di mana komunikasi order dilakukan?",
      },
    ],
  },
  {
    category: "Pembayaran",
    icon: CreditCard,
    items: [
      {
        answer: "MVP memakai sandbox payment. Integrasi gateway produksi dapat disiapkan setelah alur utama stabil.",
        question: "Apakah pembayaran sudah gateway produksi?",
      },
      {
        answer: "Invoice dan receipt menampilkan layanan, add-on, biaya admin, total, dan status pembayaran.",
        question: "Apa isi invoice?",
      },
    ],
  },
  {
    category: "Revisi",
    icon: RotateCcw,
    items: [
      {
        answer: "UMKM dapat meminta revisi saat hasil konten dikirim dan masih ada kuota revisi paket.",
        question: "Kapan revisi bisa diajukan?",
      },
      {
        answer: "Kreator mengirim versi revisi, lalu UMKM meninjau kembali sebelum menyelesaikan pesanan.",
        question: "Bagaimana alur revisi?",
      },
    ],
  },
  {
    category: "Komplain",
    icon: AlertTriangle,
    items: [
      {
        answer: "Buka komplain dari detail order. Admin akan meninjau konteks order, chat, hasil, dan revisi.",
        question: "Bagaimana mengajukan komplain?",
      },
      {
        answer: "Admin dapat memberi keputusan dan menutup komplain sesuai data order yang tersedia.",
        question: "Siapa yang menyelesaikan komplain?",
      },
    ],
  },
];

export default function BantuanPage() {
  return (
    <main className="bg-background pb-16">
      <section className="bg-[linear-gradient(135deg,var(--brand-navy-950),var(--brand-teal-900))] py-16 text-white">
        <PageContainer>
          <div className="max-w-3xl">
            <div className="grid size-12 place-items-center rounded-2xl bg-white/10 text-white">
              <LifeBuoy className="size-6" aria-hidden="true" />
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              Pusat Bantuan
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/76">
              FAQ singkat untuk akun, order, pembayaran, revisi, komplain, UMKM, dan kreator.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild className="bg-white text-brand-navy hover:bg-white/90">
                <Link href="mailto:support@ruang.usaha">
                  <Mail className="size-4" aria-hidden="true" />
                  Email Admin
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Link href="/cara-kerja">
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Lihat Cara Kerja
                </Link>
              </Button>
            </div>
          </div>
        </PageContainer>
      </section>

      <PageContainer>
        <section className="mt-10 grid gap-5 lg:grid-cols-2">
          {faqSections.map((section) => (
            <article
              key={section.category}
              className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <section.icon className="size-5" aria-hidden="true" />
                </div>
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                  {section.category}
                </h2>
              </div>
              <div className="mt-5 grid gap-4">
                {section.items.map((item) => (
                  <div key={item.question} className="rounded-xl border border-border/60 bg-background p-4">
                    <div className="flex gap-3">
                      <HelpCircle className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                      <div className="min-w-0">
                        <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
                          {item.question}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-3xl border border-primary/20 bg-primary/10 p-6 text-center sm:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Butuh bantuan langsung?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Hubungi admin dengan nomor order, email akun, dan ringkasan kendala agar pengecekan lebih cepat.
          </p>
          <Button asChild className="mt-5">
            <Link href="mailto:support@ruang.usaha">Hubungi Admin</Link>
          </Button>
        </section>
      </PageContainer>
    </main>
  );
}
