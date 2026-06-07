import { FileCheck2, FileText, LinkIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { DummyOrder, DummyServicePackage } from "@/lib/dummy";
import { formatDate } from "@/lib/formatters/date";

type ResultSubmissionCardProps = {
  order: DummyOrder;
  service: DummyServicePackage;
  viewer: "admin" | "creator" | "umkm";
};

export function ResultSubmissionCard({
  order,
  service,
  viewer,
}: ResultSubmissionCardProps) {
  const hasSubmittedResult = [
    "submitted",
    "revision_requested",
    "revised",
    "completed",
  ].includes(order.orderStatus);

  return (
    <section
      aria-labelledby="result-submission-title"
      className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]"
    >
      <div className="border-b border-border/70 bg-[linear-gradient(135deg,var(--surface-elevated),var(--surface-soft))] p-5">
        <div className="flex items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            {hasSubmittedResult ? (
              <FileCheck2 className="size-5" aria-hidden="true" />
            ) : (
              <FileText className="size-5" aria-hidden="true" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">Hasil konten</p>
            <h2
              id="result-submission-title"
              className="mt-1 text-xl font-semibold tracking-tight text-foreground"
            >
              Preview hasil dan submission
            </h2>
          </div>
        </div>
      </div>

      <div className="p-5">
        {hasSubmittedResult ? (
          <div className="space-y-4">
            <article className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm font-semibold text-foreground">
                Draft hasil konten - {service.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Hasil konten dummy tersedia untuk direview. File hasil, link
                unggahan, dan catatan kreator akan menjadi data tersimpan pada
                tahap integrasi storage.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <ResultMeta label="Order" value={order.orderNumber} />
                <ResultMeta label="Deadline" value={formatDate(order.deadline)} />
              </div>
            </article>

            <div className="rounded-2xl border border-border/70 bg-background p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <LinkIcon className="size-4 text-primary" aria-hidden="true" />
                File/link hasil placeholder
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                https://example.com/hasil-konten/{order.id}
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Catatan kreator: hasil konten mengikuti brief campaign dan siap
                direview oleh UMKM.
              </p>
            </div>
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-border p-4 text-sm leading-6 text-muted-foreground">
            {viewer === "creator"
              ? "Belum ada hasil yang dikirim. Gunakan form placeholder di bawah saat tahap produksi siap."
              : "Hasil konten belum tersedia pada status pesanan saat ini."}
          </p>
        )}
      </div>
    </section>
  );
}

type CreatorSubmissionFormProps = {
  mode: "result" | "revision";
};

export function CreatorSubmissionForm({ mode }: CreatorSubmissionFormProps) {
  const isRevision = mode === "revision";

  return (
    <section
      aria-labelledby={`${mode}-submission-form-title`}
      className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]"
    >
      <p className="text-sm font-semibold text-primary">
        {isRevision ? "Kirim revisi" : "Kirim hasil"}
      </p>
      <h2
        id={`${mode}-submission-form-title`}
        className="mt-2 text-xl font-semibold tracking-tight text-foreground"
      >
        {isRevision ? "Form revisi placeholder" : "Form hasil konten placeholder"}
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Form ini hanya UI dummy. Upload file/link hasil akan menggunakan storage
        pada tahap integrasi.
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label
            htmlFor={`${mode}-title`}
            className="text-sm font-medium text-foreground"
          >
            Judul submission
          </label>
          <Input
            id={`${mode}-title`}
            placeholder={
              isRevision
                ? "Contoh: Revisi video final"
                : "Contoh: Draft video Reels final"
            }
            className="mt-2 h-11 bg-background"
          />
        </div>
        <div>
          <label
            htmlFor={`${mode}-link`}
            className="text-sm font-medium text-foreground"
          >
            Link hasil placeholder
          </label>
          <Input
            id={`${mode}-link`}
            placeholder="https://example.com/hasil-konten"
            className="mt-2 h-11 bg-background"
          />
        </div>
        <div>
          <label
            htmlFor={`${mode}-note`}
            className="text-sm font-medium text-foreground"
          >
            Catatan untuk UMKM
          </label>
          <Textarea
            id={`${mode}-note`}
            placeholder="Tambahkan catatan singkat tentang hasil konten."
            className="mt-2 min-h-28 bg-background"
          />
        </div>
        <Button type="button" className="h-11 w-full justify-start">
          {isRevision ? "Kirim Revisi" : "Kirim Hasil"}
        </Button>
      </div>
    </section>
  );
}

type ResultMetaProps = {
  label: string;
  value: string;
};

function ResultMeta({ label, value }: ResultMetaProps) {
  return (
    <div>
      <p className="text-xs font-medium uppercase text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
