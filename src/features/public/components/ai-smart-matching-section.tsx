"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight, Mic, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

export function AiSmartMatchingSection() {
  const [prompt, setPrompt] = useState("");

  function handleSubmit() {
    toast.info("Fitur AI Smart Matching akan segera tersedia.");
  }

  return (
    <section className="bg-background py-14 sm:py-20 lg:py-24">
      <PageContainer>
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#0C2949_0%,#114955_50%,#167163_100%)] px-6 py-12 shadow-[0_24px_80px_rgba(12,41,73,0.18)] sm:px-10 lg:grid lg:grid-cols-[1fr_380px] lg:items-center lg:gap-10 lg:px-14 lg:py-16 xl:grid-cols-[1fr_440px]">
          <div className="absolute -right-32 -top-32 size-[400px] rounded-full bg-[radial-gradient(circle,rgba(22,113,99,0.25),transparent_70%)]" />
          <div className="absolute -bottom-20 -left-20 size-[300px] rounded-full bg-[radial-gradient(circle,rgba(17,73,85,0.3),transparent_70%)]" />

          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/16 bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-[#9fe0d4] backdrop-blur-sm">
              <Sparkles className="size-3.5" aria-hidden="true" />
              AI Smart Matching
            </div>

            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              Tidak Tahu Harus Memilih Siapa?{" "}
              <span className="text-[#9fe0d4]">Biarkan AI Membantu.</span>
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
              Ceritakan kebutuhan promosi usaha Anda. Sistem akan membantu
              merekomendasikan kreator yang paling relevan berdasarkan kategori
              usaha, niche, lokasi, anggaran, dan performa layanan.
            </p>

            <div className="mt-8 overflow-hidden rounded-2xl border border-white/12 bg-white/8 backdrop-blur-md">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Contoh: Saya punya bisnis kedai kopi dan butuh kreator untuk membuat konten TikTok agar lebih dikenal. Budget sekitar Rp 1 juta per bulan."
                rows={3}
                className="w-full resize-none bg-transparent px-5 pt-4 pb-2 text-sm leading-6 text-white placeholder:text-white/40 focus:outline-none"
              />
              <div className="flex items-center justify-between gap-3 px-4 pb-3">
                <button
                  type="button"
                  aria-label="Input suara"
                  className="grid size-8 place-items-center rounded-lg text-white/40 transition-colors hover:bg-white/10 hover:text-white/70"
                >
                  <Mic className="size-4" />
                </button>
                <Button
                  type="button"
                  size="lg"
                  onClick={handleSubmit}
                  className="h-10 rounded-xl bg-white px-5 text-[#0C2949] hover:bg-white/90"
                >
                  Cari Rekomendasi
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>

          <div className="relative mt-10 hidden lg:mt-0 lg:block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
              <Image
                src="/images/abstract (3).webp"
                alt="Visual AI Smart Matching untuk marketplace jasa digital"
                fill
                sizes="(min-width: 1280px) 440px, 380px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,41,73,0.15),rgba(17,73,85,0.5))]" />
              <div className="absolute inset-0 bg-[linear-gradient(270deg,transparent_50%,rgba(12,41,73,0.6))]" />

              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/14 bg-white/12 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#167163]/80 text-white">
                    <Sparkles className="size-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      3 kreator ditemukan
                    </p>
                    <p className="mt-0.5 truncate text-xs text-white/60">
                      Relevansi tinggi berdasarkan brief Anda
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
