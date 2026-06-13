import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

const highlights = [
  "Profil kreator",
  "Paket layanan",
  "Portofolio",
  "Order UMKM",
] as const;

export function CreatorCtaSection() {
  return (
    <section className="bg-background py-14 sm:py-20 lg:py-24">
      <PageContainer>
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-[#06111f] px-5 py-12 text-white shadow-[0_24px_80px_rgba(12,41,73,0.18)] sm:px-8 lg:px-12">
          <Image
            src="/images/image (11).webp"
            alt="Visual kreator digital"
            fill
            sizes="(min-width: 1024px) 1200px, 100vw"
            className="absolute inset-0 -z-20 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(3,12,22,0.88),rgba(12,41,73,0.7),rgba(3,12,22,0.34))]" />
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#9fe0d4]">Untuk kreator</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Bangun katalog jasa yang mudah dipilih UMKM.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/74 sm:text-base">
              Tampilkan portofolio, susun paket layanan, dan kelola order dari
              dashboard kreator.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {highlights.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/14 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/82"
                >
                  {item}
                </span>
              ))}
            </div>
            <Button asChild size="lg" className="mt-8 h-12 rounded-full bg-white px-6 text-[#0c2949] hover:bg-white/90">
              <Link href="/register">
                Daftar sebagai Kreator
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
