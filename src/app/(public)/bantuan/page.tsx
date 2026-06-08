import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  FileQuestion,
  FileText,
  HelpCircle,
  LifeBuoy,
  MessageCircle,
  Search,
  ShieldCheck,
  UserCircle,
} from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Pusat Bantuan — Ruang Usaha Kita",
  description: "Temukan jawaban untuk pertanyaan umum seputar marketplace jasa digital.",
};

const faqs = [
  {
    category: "Akun & Pendaftaran",
    icon: UserCircle,
    items: [
      {
        q: "Bagaimana cara mendaftar sebagai Kreator?",
        a: "Klik tombol Daftar di pojok kanan atas, pilih peran 'Kreator', lalu lengkapi profil, keahlian, dan unggah portofolio Anda. Setelah disetujui admin, Anda bisa mulai membuat paket layanan."
      },
      {
        q: "Apakah ada biaya pendaftaran?",
        a: "Pendaftaran untuk UMKM maupun Kreator 100% gratis. Ruang Usaha Kita hanya membebankan biaya layanan flat untuk UMKM per transaksi dan komisi persentase dari kreator setelah order selesai."
      }
    ]
  },
  {
    category: "Pesanan & Brief",
    icon: FileText,
    items: [
      {
        q: "Apa itu Brief Campaign?",
        a: "Brief adalah formulir yang harus diisi UMKM sebelum memesan jasa. Isinya mencakup tujuan campaign, target audiens, dan referensi desain agar kreator memahami ekspektasi Anda dengan jelas."
      },
      {
        q: "Bolehkah saya meminta revisi?",
        a: "Tentu. Setiap paket layanan mencantumkan batas maksimal revisi. Anda dapat menggunakan fitur 'Minta Revisi' di halaman detail order jika hasil konten belum sesuai brief."
      }
    ]
  },
  {
    category: "Pembayaran & Keamanan",
    icon: ShieldCheck,
    items: [
      {
        q: "Bagaimana sistem pembayaran bekerja?",
        a: "UMKM mentransfer dana ke rekening penampung (Escrow) Ruang Usaha Kita. Dana tersebut baru akan diteruskan ke Kreator setelah UMKM menyetujui hasil akhir konten."
      },
      {
        q: "Apakah data transaksi saya aman?",
        a: "Ya. Saat ini platform menggunakan alur pembayaran sandbox untuk tujuan MVP. Di tahap produksi, integrasi payment gateway resmi seperti Midtrans dapat disiapkan."
      }
    ]
  },
  {
    category: "Komplain & Penyelesaian",
    icon: AlertTriangle,
    items: [
      {
        q: "Bagaimana jika kreator tidak merespons?",
        a: "Jika kreator melewati batas waktu pengerjaan (deadline) tanpa kabar, Anda dapat membuka tiket komplain. Admin kami akan meninjau dan jika terbukti melanggar, pesanan dapat dibatalkan dan dana dikembalikan."
      },
      {
        q: "Hasil akhir sama sekali tidak sesuai brief, apa solusinya?",
        a: "Gunakan hak revisi terlebih dahulu. Jika kuota revisi habis dan hasil tetap menyimpang jauh dari brief awal, Anda bisa membuka komplain untuk dimediasi oleh tim Admin."
      }
    ]
  }
];

export default function BantuanPage() {
  return (
    <main className="min-h-screen bg-background pb-20">
      <section className="bg-brand-navy pt-20 pb-24 text-center">
        <PageContainer>
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-white/10 text-white mb-6 backdrop-blur-sm">
            <LifeBuoy className="size-8" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Pusat Bantuan
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
            Punya pertanyaan seputar Ruang Usaha Kita? Cari topik bantuan di bawah ini.
          </p>
          
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <Input 
              placeholder="Ketik pertanyaan Anda... (misal: cara pembayaran)" 
              className="pl-12 h-14 rounded-full text-base bg-white border-0 shadow-lg text-foreground placeholder:text-muted-foreground/70 focus-visible:ring-4 focus-visible:ring-brand-teal/50"
            />
          </div>
        </PageContainer>
      </section>

      <section className="relative -mt-10">
        <PageContainer>
          <div className="grid md:grid-cols-3 gap-6 mb-20 max-w-5xl mx-auto">
            <Link href="/cara-kerja" className="rounded-2xl bg-white p-6 shadow-md border border-border/50 hover:border-primary/30 transition-all flex items-center gap-4 group">
               <div className="bg-primary/10 p-3 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                 <FileQuestion className="size-6" />
               </div>
               <div>
                 <h3 className="font-semibold text-brand-navy">Cara Kerja Platform</h3>
                 <p className="text-sm text-muted-foreground mt-1">Pelajari alur transaksi</p>
               </div>
            </Link>
            
            <Link href="/katalog" className="rounded-2xl bg-white p-6 shadow-md border border-border/50 hover:border-primary/30 transition-all flex items-center gap-4 group">
               <div className="bg-primary/10 p-3 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                 <Search className="size-6" />
               </div>
               <div>
                 <h3 className="font-semibold text-brand-navy">Cari Kreator</h3>
                 <p className="text-sm text-muted-foreground mt-1">Jelajahi layanan digital</p>
               </div>
            </Link>

            <div className="rounded-2xl bg-white p-6 shadow-md border border-border/50 flex items-center gap-4 cursor-not-allowed opacity-80">
               <div className="bg-muted p-3 rounded-xl text-muted-foreground">
                 <MessageCircle className="size-6" />
               </div>
               <div>
                 <h3 className="font-semibold text-brand-navy">Live Chat</h3>
                 <p className="text-sm text-muted-foreground mt-1">Segera hadir</p>
               </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-brand-navy tracking-tight">Pertanyaan Populer (FAQ)</h2>
            </div>

            {faqs.map((section, idx) => (
              <div key={idx} className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border/70 pb-3">
                  <section.icon className="size-6 text-primary" />
                  <h3 className="text-2xl font-semibold text-foreground">{section.category}</h3>
                </div>
                
                <div className="grid gap-6 sm:grid-cols-2">
                  {section.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="rounded-2xl border border-border/70 bg-surface-soft p-6">
                      <div className="flex gap-3 mb-3">
                        <HelpCircle className="size-5 text-primary shrink-0 mt-0.5" />
                        <h4 className="font-semibold text-brand-navy leading-snug">{item.q}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed pl-8">
                        {item.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-24 max-w-3xl mx-auto rounded-3xl bg-[linear-gradient(135deg,rgba(22,113,99,0.1),rgba(12,41,73,0.05))] border border-primary/20 p-8 sm:p-12 text-center">
             <h2 className="text-2xl font-bold text-brand-navy mb-4">Masih Butuh Bantuan?</h2>
             <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
               Tim support Ruang Usaha Kita siap membantu kelancaran promosi digital Anda. Jangan ragu untuk menghubungi kami.
             </p>
             <Button asChild size="lg" className="h-12 px-8">
               <Link href="#">
                 Hubungi Support (Placeholder)
               </Link>
             </Button>
          </div>
        </PageContainer>
      </section>
    </main>
  );
}
