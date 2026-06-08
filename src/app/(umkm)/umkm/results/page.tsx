import type { Metadata } from "next";
import Link from "next/link";
import { FileCheck2, LinkIcon } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderPageHero } from "@/features/orders/components/order-page-hero";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { getCurrentUmkmOrders } from "@/features/orders/data/order-queries";
import type { Database } from "@/lib/supabase/types";
import { formatDate } from "@/lib/formatters/date";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "File Hasil Konten - Ruang Usaha Kita",
  description:
    "Daftar hasil konten untuk UMKM, termasuk order, kreator, paket jasa, status review, dan revisi.",
};

type OrderStatus = Database["public"]["Enums"]["order_status"];

const resultStatuses: readonly OrderStatus[] = [
  "submitted",
  "revision_requested",
  "revised",
  "completed",
];

const resultStatusSet = new Set<OrderStatus>(resultStatuses);

export default async function UmkmResultsPage() {
  const orders = await getCurrentUmkmOrders();
  const resultItems = orders.filter((order) =>
    resultStatusSet.has(order.orderStatus),
  );

  return (
    <main>
      <PageContainer>
        <div className="space-y-8">
          <OrderPageHero
            icon={FileCheck2}
            eyebrow="File hasil UMKM"
            title="Hasil konten yang sudah masuk."
            description="Lihat hasil konten dari kreator, status review, revisi, dan tautan detail pesanan."
            metricLabel="Hasil konten"
            metricValue={`${resultItems.length} order`}
          />

          <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-card)]">
            <div className="border-b border-border/70 bg-[linear-gradient(135deg,var(--surface-elevated),var(--surface-soft))] p-5">
              <p className="text-sm font-semibold text-primary">File hasil</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                Hasil konten diterima
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Daftar ini berasal dari status pesanan real yang sudah memiliki
                konteks hasil atau revisi.
              </p>
            </div>

            <div className="grid gap-4 p-5 lg:grid-cols-2">
              {resultItems.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-border/70 bg-background p-4 shadow-[var(--shadow-soft)]"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <Badge className="rounded-lg">{getResultStatusLabel(item.orderStatus)}</Badge>
                      <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
                        Hasil konten - {item.serviceTitle}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {item.orderNumber} · Kreator {item.creatorName}
                      </p>
                    </div>
                    <ResultStatusBadge status={getResultStatusLabel(item.orderStatus)} />
                  </div>

                  <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <LinkIcon className="size-4 text-primary" aria-hidden="true" />
                      Detail hasil konten
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Buka detail pesanan untuk melihat konteks hasil, revisi, dan review yang tersedia.
                    </p>
                    <div className="mt-3">
                      <OrderStatusBadge status={item.orderStatus} />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-muted-foreground">
                      Deadline{" "}
                      {item.deadline ? formatDate(item.deadline) : "belum tersedia"}
                    </p>
                    <Button asChild className="h-10">
                      <Link href={`/umkm/orders/${item.id}`}>Buka Detail</Link>
                    </Button>
                  </div>
                </article>
              ))}

              {resultItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-6 text-center lg:col-span-2">
                  <FileCheck2 className="mx-auto size-8 text-primary" aria-hidden="true" />
                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
                    Belum ada hasil konten
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Hasil konten akan tampil setelah kreator mengirim hasil pada order Anda.
                  </p>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </PageContainer>
    </main>
  );
}

type ResultStatus = "Menunggu Review" | "Revisi Diminta" | "Selesai";

function ResultStatusBadge({ status }: { status: ResultStatus }) {
  return (
    <span
      className={cn(
        "w-fit rounded-full border px-3 py-1 text-xs font-semibold",
        status === "Selesai"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : status === "Revisi Diminta"
            ? "border-amber-200 bg-amber-50 text-amber-800"
            : "border-primary/20 bg-primary/10 text-primary",
      )}
    >
      {status}
    </span>
  );
}

function getResultStatusLabel(status: OrderStatus): ResultStatus {
  if (status === "completed") {
    return "Selesai";
  }

  if (status === "revision_requested") {
    return "Revisi Diminta";
  }

  return "Menunggu Review";
}
