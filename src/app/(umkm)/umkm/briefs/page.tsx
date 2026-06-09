import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Eye, FileText, PencilLine, PlusCircle } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BriefStatusBadge } from "@/features/briefs/components/umkm-brief-detail";
import { getCurrentUmkmRecentBriefs } from "@/features/dashboard/data/dashboard-queries";
import { formatDate } from "@/lib/formatters/date";

export const metadata: Metadata = {
  title: "Brief Campaign — Ruang Usaha Kita",
  description: "Kelola panduan campaign untuk kreator agar konten sesuai ekspektasi.",
};

type UmkmBriefsPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function UmkmBriefsPage({
  searchParams,
}: UmkmBriefsPageProps) {
  const [briefs, params] = await Promise.all([
    getCurrentUmkmRecentBriefs(50),
    searchParams ?? Promise.resolve({ error: undefined }),
  ]);

  const errorMessage =
    params.error === "not_found"
      ? "Brief campaign tidak ditemukan atau bukan milik akun yang sedang login."
      : null;

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">
              Brief Campaign
            </h1>
            <p className="mt-2 text-muted-foreground">
              Kelola panduan produksi konten agar kreator memahami ekspektasi Anda.
            </p>
          </div>
          <Button asChild>
            <Link href="/umkm/checkout">
              <PlusCircle className="mr-2 size-4" />
              Buat Brief Baru
            </Link>
          </Button>
        </div>

        {errorMessage ? (
          <Alert variant="destructive">
            <AlertTitle>Brief tidak bisa dibuka</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        {briefs.length > 0 ? (
          <div className="grid gap-6">
            {briefs.map((brief) => (
              <article
                key={brief.id}
                className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)] transition-colors hover:border-primary/30"
              >
                <div className="p-6 sm:p-8">
                  <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-foreground">
                          {brief.promotedFocus}
                        </h2>
                        <BriefStatusBadge status={brief.status} />
                      </div>
                      <p className="text-muted-foreground">
                        {brief.businessName} · {brief.businessCategory ?? "Kategori belum diisi"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-brand-navy/5 px-3 py-1.5 text-sm font-medium text-brand-navy">
                      <CalendarDays className="size-4" />
                      Deadline:{" "}
                      {brief.deadline ? formatDate(brief.deadline) : "Belum tersedia"}
                    </div>
                  </div>

                  <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-6">
                      <DetailBlock label="Tujuan campaign" value={brief.campaignGoal} />
                      <DetailBlock
                        label="Platform konten"
                        value={
                          brief.contentPlatforms.length > 0
                            ? brief.contentPlatforms.join(", ")
                            : "Belum diisi"
                        }
                      />
                    </div>
                    <div className="space-y-6">
                      <DetailBlock
                        label="Target audiens"
                        value="Tersimpan pada detail brief campaign"
                      />
                      <DetailBlock
                        label="Status"
                        value={brief.status === "draft" ? "Draft" : "Tersimpan"}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-4 border-t border-border/70 bg-muted/30 px-6 py-4 sm:flex-row sm:items-center">
                  <p className="text-sm text-muted-foreground">
                    Brief campaign berasal dari data akun UMKM yang sedang login.
                  </p>
                  <Button asChild variant="outline" size="sm" className="bg-background">
                    <Link href={`/umkm/briefs/${brief.id}`}>
                      {brief.status === "draft" ? "Edit Brief" : "Buka Detail"}
                      {brief.status === "draft" ? (
                        <PencilLine className="ml-2 size-3" />
                      ) : (
                        <Eye className="ml-2 size-3" />
                      )}
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <section className="rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-sm">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
              <FileText className="size-8" aria-hidden="true" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
              Belum ada Brief Campaign
            </h2>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              Brief yang jelas membantu kreator memahami tujuan campaign dan mengurangi revisi.
            </p>
            <Button asChild className="mt-6">
              <Link href="/umkm/checkout">
                <PlusCircle className="mr-2 size-4" />
                Buat Brief Pertama
              </Link>
            </Button>
          </section>
        )}
      </div>
    </PageContainer>
  );
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}
