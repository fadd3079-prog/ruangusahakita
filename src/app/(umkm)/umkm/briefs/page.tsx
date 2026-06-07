import type { Metadata } from "next";
import Link from "next/link";
import { PlusCircle, FileText, CalendarDays, ExternalLink, RefreshCcw, LayoutTemplate } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dummyCampaignBriefs, dummyOrders, dummyUmkmProfiles } from "@/lib/dummy";
import { formatDate } from "@/lib/formatters/date";
import type { DummyBriefStatus } from "@/lib/dummy";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Brief Campaign — Ruang Usaha Kita",
  description: "Kelola panduan campaign untuk kreator agar konten sesuai ekspektasi.",
};

const briefStatusLabels: Record<DummyBriefStatus, string> = {
  draft: "Draft",
  submitted: "Diajukan",
  linked_to_order: "Aktif (Pesanan)",
};

const briefStatusClasses: Record<DummyBriefStatus, string> = {
  draft: "border-muted-foreground text-muted-foreground bg-muted",
  submitted: "border-amber-500/30 text-amber-700 bg-amber-500/10",
  linked_to_order: "border-primary text-primary bg-primary/10",
};

export default function UmkmBriefsPage() {
  const currentUmkm = dummyUmkmProfiles[0];
  const myBriefs = dummyCampaignBriefs.filter((brief) => brief.umkmId === currentUmkm.id);

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">Brief Campaign</h1>
            <p className="mt-2 text-muted-foreground">Kelola panduan produksi konten agar kreator memahami ekspektasi Anda.</p>
          </div>
          <Button>
            <PlusCircle className="mr-2 size-4" />
            Buat Brief Baru
          </Button>
        </div>

        {myBriefs.length > 0 ? (
          <div className="grid gap-6">
            {myBriefs.map((brief) => {
              const linkedOrder = brief.orderId ? dummyOrders.find(o => o.id === brief.orderId) : null;

              return (
                <div key={brief.id} className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)] hover:border-primary/30 transition-colors">
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h2 className="text-xl font-bold text-foreground">{brief.promotedFocus}</h2>
                          <Badge variant="outline" className={cn("rounded-md", briefStatusClasses[brief.status])}>
                            {briefStatusLabels[brief.status]}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{brief.businessName} • {brief.businessCategory}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium text-brand-navy bg-brand-navy/5 px-3 py-1.5 rounded-lg">
                        <CalendarDays className="size-4" />
                        Deadline: {formatDate(brief.deadline)}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Tujuan Campaign</p>
                          <p className="text-sm text-foreground">{brief.campaignGoal}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Target Audiens</p>
                          <div className="flex flex-wrap gap-2">
                            {brief.targetAudience.map((audience, idx) => (
                              <Badge key={idx} variant="secondary" className="font-normal rounded-md">
                                {audience}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-2">Platform Konten</p>
                          <div className="flex flex-wrap gap-2">
                            {brief.contentPlatforms.map((platform, idx) => (
                              <Badge key={idx} variant="outline" className="font-normal rounded-md">
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                         <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Gaya Konten</p>
                          <p className="text-sm text-foreground">{brief.contentStyle.join(", ")}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Catatan Tambahan</p>
                          <p className="text-sm text-foreground italic">&quot;{brief.additionalNotes}&quot;</p>
                        </div>
                        
                        {brief.assetUrls.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Aset (Logo/Referensi)</p>
                            <div className="flex gap-2">
                              {brief.assetUrls.map((url, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm bg-muted/50 border border-border/50 rounded-lg px-3 py-1.5">
                                  <FileText className="size-4 text-muted-foreground" />
                                  <span className="text-muted-foreground">asset_{idx + 1}.zip</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 px-6 py-4 border-t border-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      {linkedOrder ? (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Terkait Pesanan: </span>
                          <Link href={`/umkm/orders/${linkedOrder.id}`} className="font-medium text-primary hover:underline inline-flex items-center gap-1">
                            {linkedOrder.orderNumber}
                            <ExternalLink className="size-3" />
                          </Link>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Belum tertaut dengan pesanan manapun.</p>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" className="bg-background">
                        <LayoutTemplate className="size-4 mr-2" />
                        Lihat Detail
                      </Button>
                      <Button variant="secondary" size="sm">
                        <RefreshCcw className="size-4 mr-2" />
                        Gunakan Lagi
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <section className="rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-sm">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
              <FileText className="size-8" aria-hidden="true" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
              Belum ada Brief Campaign
            </h2>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">
              Brief yang jelas sangat membantu kreator memahami tujuan campaign Anda dan meminimalkan revisi.
            </p>
            <Button className="mt-6">
              <PlusCircle className="mr-2 size-4" />
              Buat Brief Pertama
            </Button>
          </section>
        )}
      </div>
    </PageContainer>
  );
}
