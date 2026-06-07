import type { Metadata } from "next";
import { PlusCircle, Image as ImageIcon, ExternalLink } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { dummyCreators, dummyPortfolios } from "@/lib/dummy";

export const metadata: Metadata = {
  title: "Portofolio Saya — Ruang Usaha Kita",
  description: "Kelola portofolio karya terbaik Anda.",
};

export default function CreatorPortfolioPage() {
  const currentCreator = dummyCreators.find((creator) => creator.id === "creator_003") ?? dummyCreators[0];
  const portfolios = dummyPortfolios.filter(
    (port) => port.creatorId === currentCreator.id
  );

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">Portofolio Saya</h1>
            <p className="mt-2 text-muted-foreground">Tampilkan karya terbaik Anda untuk meyakinkan klien UMKM.</p>
          </div>
          <Button>
            <PlusCircle className="mr-2 size-4" />
            Tambah Portofolio
          </Button>
        </div>

        {portfolios.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {portfolios.map(item => (
              <div key={item.id} className="group overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm hover:shadow-md transition-all">
                <div className="aspect-[4/3] w-full bg-muted/50 flex items-center justify-center relative overflow-hidden">
                  <ImageIcon className="size-10 text-muted-foreground/30" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button variant="secondary" size="sm" className="gap-2">
                      <ExternalLink className="size-4" />
                      Lihat Detail
                    </Button>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-foreground line-clamp-1">{item.title}</h3>
                    {item.isFeatured && (
                      <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">Klien: {item.clientName}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <section className="rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-sm">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
              <ImageIcon className="size-8" aria-hidden="true" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
              Belum ada portofolio
            </h2>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">
              Unggah contoh hasil konten digital Anda agar UMKM tahu gaya dan kualitas pekerjaan Anda.
            </p>
            <Button className="mt-6">
              <PlusCircle className="mr-2 size-4" />
              Tambah Karya Pertama
            </Button>
          </section>
        )}
      </div>
    </PageContainer>
  );
}
