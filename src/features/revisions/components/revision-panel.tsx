import { MessageSquareText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { DummyComplaint, DummyOrder } from "@/lib/dummy";
import { formatDate } from "@/lib/formatters/date";

type RevisionPanelProps = {
  complaint: DummyComplaint | null;
  order: DummyOrder;
  showRequestForm?: boolean;
};

export function RevisionPanel({
  complaint,
  order,
  showRequestForm = false,
}: RevisionPanelProps) {
  const hasRevisionContext = [
    "revision_requested",
    "revised",
    "completed",
  ].includes(order.orderStatus);

  return (
    <section
      aria-labelledby="revision-panel-title"
      className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]"
    >
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <MessageSquareText className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-primary">Revisi</p>
          <h2
            id="revision-panel-title"
            className="mt-1 text-xl font-semibold tracking-tight text-foreground"
          >
            Catatan revisi dan komplain
          </h2>
        </div>
      </div>

      {complaint ? (
        <article className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-900">
            {complaint.subject}
          </p>
          <p className="mt-2 text-sm leading-6 text-amber-800">
            {complaint.description}
          </p>
          <p className="mt-3 text-xs font-medium text-amber-800">
            Status komplain: {complaint.complaintStatus} · Dibuat{" "}
            {formatDate(complaint.createdAt)}
          </p>
        </article>
      ) : hasRevisionContext ? (
        <p className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm leading-6 text-muted-foreground">
          Pesanan memiliki konteks revisi pada dummy status, tetapi belum ada
          catatan revisi detail yang tersimpan.
        </p>
      ) : (
        <p className="mt-5 rounded-2xl border border-dashed border-border p-4 text-sm leading-6 text-muted-foreground">
          Belum ada revisi pada pesanan ini.
        </p>
      )}

      {showRequestForm ? (
        <div className="mt-5 rounded-2xl border border-border/70 bg-background p-4">
          <label
            htmlFor="revision-note"
            className="text-sm font-medium text-foreground"
          >
            Catatan revisi placeholder
          </label>
          <Textarea
            id="revision-note"
            placeholder="Tulis bagian hasil konten yang perlu disesuaikan."
            className="mt-2 min-h-28 bg-card"
          />
          <Button type="button" className="mt-4 h-11 w-full justify-start">
            Ajukan Revisi
          </Button>
        </div>
      ) : null}
    </section>
  );
}
