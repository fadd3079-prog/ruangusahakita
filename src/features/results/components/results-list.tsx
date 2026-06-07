import Link from "next/link";
import { FileCheck2, LinkIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  DummyCreatorProfile,
  DummyOrder,
  DummyServicePackage,
} from "@/lib/dummy";
import { formatDate } from "@/lib/formatters/date";
import { cn } from "@/lib/utils";

export type ResultListItem = {
  readonly creator: DummyCreatorProfile;
  readonly order: DummyOrder;
  readonly service: DummyServicePackage;
};

type ResultsListProps = {
  items: readonly ResultListItem[];
};

export function ResultsList({ items }: ResultsListProps) {
  return (
    <section
      aria-labelledby="results-list-title"
      className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-card)]"
    >
      <div className="border-b border-border/70 bg-[linear-gradient(135deg,var(--surface-elevated),var(--surface-soft))] p-5">
        <p className="text-sm font-semibold text-primary">File hasil</p>
        <h2
          id="results-list-title"
          className="mt-2 text-2xl font-semibold tracking-tight text-foreground"
        >
          Hasil konten diterima
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Daftar ini dibuat dari status pesanan dummy yang sudah memiliki hasil
          konten atau konteks revisi.
        </p>
      </div>

      <div className="grid gap-4 p-5 lg:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.order.id}
            className="rounded-2xl border border-border/70 bg-background p-4 shadow-[var(--shadow-soft)]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Badge className="rounded-lg">{getResultStatusLabel(item.order)}</Badge>
                <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
                  Draft hasil - {item.service.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.order.orderNumber} · Kreator {item.creator.displayName}
                </p>
              </div>
              <ResultStatusBadge status={getResultStatusLabel(item.order)} />
            </div>

            <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <LinkIcon className="size-4 text-primary" aria-hidden="true" />
                Link hasil placeholder
              </p>
              <p className="mt-2 break-all text-sm leading-6 text-muted-foreground">
                https://example.com/hasil-konten/{item.order.id}
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Catatan hasil: konten mengikuti brief campaign dan siap direview
                sesuai status pesanan.
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                Deadline {formatDate(item.order.deadline)}
              </p>
              <Button asChild className="h-10">
                <Link href={`/umkm/orders/${item.order.id}`}>Buka Detail</Link>
              </Button>
            </div>
          </article>
        ))}

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-6 text-center lg:col-span-2">
            <FileCheck2 className="mx-auto size-8 text-primary" aria-hidden="true" />
            <h3 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
              Belum ada hasil konten.
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Hasil konten akan tampil setelah kreator mengirim submission dummy.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

type ResultStatus = "Menunggu Review" | "Revisi Diminta" | "Selesai";

type ResultStatusBadgeProps = {
  status: ResultStatus;
};

function ResultStatusBadge({ status }: ResultStatusBadgeProps) {
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

function getResultStatusLabel(order: DummyOrder): ResultStatus {
  if (order.orderStatus === "completed") {
    return "Selesai";
  }

  if (order.orderStatus === "revision_requested") {
    return "Revisi Diminta";
  }

  return "Menunggu Review";
}
