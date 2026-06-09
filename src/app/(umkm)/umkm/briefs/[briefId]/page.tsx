import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { UmkmBriefDetailView } from "@/features/briefs/components/umkm-brief-detail";
import { getCurrentUmkmBriefDetail } from "@/features/briefs/data/brief-queries";

type UmkmBriefDetailPageProps = {
  params: Promise<{
    briefId: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    updated?: string;
  }>;
};

export async function generateMetadata({
  params,
}: UmkmBriefDetailPageProps): Promise<Metadata> {
  const { briefId } = await params;
  const brief = await getCurrentUmkmBriefDetail(briefId);

  return {
    title: brief
      ? `${brief.promotedFocus} — Brief Campaign`
      : "Brief Campaign — Ruang Usaha Kita",
    description: "Detail brief campaign UMKM untuk kebutuhan layanan digital kreator.",
  };
}

export default async function UmkmBriefDetailPage({
  params,
  searchParams,
}: UmkmBriefDetailPageProps) {
  const [{ briefId }, query] = await Promise.all([
    params,
    searchParams ?? Promise.resolve({ error: undefined, updated: undefined }),
  ]);
  const brief = await getCurrentUmkmBriefDetail(briefId);

  return (
    <PageContainer>
      <div className="space-y-6 pb-10">
        <Button asChild variant="ghost" className="-ml-3 w-fit">
          <Link href="/umkm/briefs">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Kembali ke Brief Campaign
          </Link>
        </Button>

        {brief ? (
          <UmkmBriefDetailView
            brief={brief}
            error={query.error}
            updated={query.updated === "1"}
          />
        ) : (
          <section className="rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-sm">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
              <FileText className="size-8" aria-hidden="true" />
            </div>
            <h1 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
              Brief tidak ditemukan
            </h1>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              Brief campaign ini tidak tersedia atau bukan milik akun UMKM yang sedang
              login.
            </p>
            <Button asChild className="mt-6">
              <Link href="/umkm/briefs">Lihat Brief Campaign</Link>
            </Button>
          </section>
        )}
      </div>
    </PageContainer>
  );
}
