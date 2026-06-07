import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle, BriefcaseBusiness } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/cards/service-card";
import { dummyCreators, dummyServicePackages, dummyServiceCategories } from "@/lib/dummy";

export const metadata: Metadata = {
  title: "Layanan Saya — Ruang Usaha Kita",
  description: "Kelola paket jasa digital Anda di Ruang Usaha Kita.",
};

export default function CreatorServicesPage() {
  const currentCreator = dummyCreators.find((creator) => creator.id === "creator_003") ?? dummyCreators[0];
  const creatorServices = dummyServicePackages.filter(
    (service) => service.creatorId === currentCreator.id
  );
  const categoryById = new Map(dummyServiceCategories.map(c => [c.id, c]));

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">Layanan Saya</h1>
            <p className="mt-2 text-muted-foreground">Kelola paket jasa digital yang Anda tawarkan kepada UMKM.</p>
          </div>
          <Button asChild>
            <Link href="/creator/services/new">
              <PlusCircle className="mr-2 size-4" />
              Tambah Paket Layanan
            </Link>
          </Button>
        </div>

        {creatorServices.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {creatorServices.map(service => (
              <div key={service.id} className="relative group">
                <ServiceCard 
                  service={service} 
                  category={categoryById.get(service.categoryId)}
                  ctaLabel="Edit Layanan"
                />
                {!service.isActive && (
                  <div className="absolute top-4 right-4 bg-background/90 text-xs font-semibold px-2 py-1 rounded-md border border-border text-muted-foreground backdrop-blur-sm z-10">
                    Tidak Aktif
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <section className="rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-sm">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
              <BriefcaseBusiness className="size-8" aria-hidden="true" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
              Belum ada layanan digital
            </h2>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">
              Buat paket jasa digital pertama Anda agar UMKM dapat mulai memesan jasa Anda.
            </p>
            <Button asChild className="mt-6">
              <Link href="/creator/services/new">
                <PlusCircle className="mr-2 size-4" />
                Tambah Layanan Pertama
              </Link>
            </Button>
          </section>
        )}
      </div>
    </PageContainer>
  );
}
