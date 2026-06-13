import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CheckCircle2, Download, FileText, Link2, RotateCcw, Send, UploadCloud } from "lucide-react";

import { FileDropzone } from "@/components/common/file-dropzone";
import { SubmitButton } from "@/components/common/submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  approveOrderDelivery,
  requestOrderRevision,
  submitCreatorDelivery,
} from "@/features/submissions/actions/submission-actions";
import type {
  DeliveryFileAsset,
  OrderDeliveryData,
} from "@/features/submissions/data/submission-queries";
import { formatDate } from "@/lib/formatters/date";

const projectResultAccept =
  "image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime,text/plain,text/html,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/zip,application/x-zip-compressed,application/vnd.rar,application/x-rar-compressed,application/postscript,application/octet-stream,.psd,.ai,.rar,.zip,.pdf,.doc,.docx,.html,.txt,.mp4,.mov,.webm,.jpg,.jpeg,.png,.webp,.gif";

type DeliveryHistoryPanelProps = {
  delivery: OrderDeliveryData;
  emptyTitle?: string;
};

export function DeliveryHistoryPanel({
  delivery,
  emptyTitle = "Belum ada hasil konten",
}: DeliveryHistoryPanelProps) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
          <FileText className="size-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Hasil konten
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            File dan link hasil tersimpan private untuk participant order.
          </p>
        </div>
      </div>

      {delivery.submissions.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-border bg-background p-5 text-sm text-muted-foreground">
          {emptyTitle}
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {delivery.submissions.map((submission) => (
            <article
              key={submission.id}
              className="rounded-2xl border border-border/70 bg-background p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="rounded-lg bg-blue-600 text-white hover:bg-blue-600">
                      Versi {submission.versionNumber}
                    </Badge>
                    {submission.submissionType ? (
                      <Badge variant="secondary" className="rounded-lg">
                        {submission.submissionType === "revision" ? "Revisi" : "Awal"}
                      </Badge>
                    ) : null}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
                    {submission.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(submission.createdAt)}
                  </p>
                </div>
              </div>

              {submission.description ? (
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {submission.description}
                </p>
              ) : null}

              {submission.captionText ? (
                <div className="mt-4 rounded-xl border border-border/70 bg-muted/30 p-3">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Catatan caption
                  </p>
                  <p className="mt-2 text-sm leading-6 text-foreground">
                    {submission.captionText}
                  </p>
                </div>
              ) : null}

              {submission.externalLinks.length > 0 ? (
                <div className="mt-4 grid gap-2">
                  {submission.externalLinks.map((url) => (
                    <Button key={url} asChild variant="outline" className="justify-start">
                      <Link href={url} target="_blank" rel="noreferrer">
                        <Link2 className="size-4" aria-hidden="true" />
                        <span className="truncate">{url}</span>
                      </Link>
                    </Button>
                  ))}
                </div>
              ) : null}

              {submission.files.length > 0 ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {submission.files.map((file) => (
                    <DeliveryFileCard key={file.id} file={file} />
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export function RevisionHistoryPanel({ delivery }: { delivery: OrderDeliveryData }) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700">
          <RotateCcw className="size-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Riwayat revisi
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {delivery.revisionUsed} dari {delivery.revisionLimit} revisi terpakai.
          </p>
        </div>
      </div>

      {delivery.revisions.length === 0 ? (
        <p className="mt-5 rounded-2xl border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
          Belum ada revisi.
        </p>
      ) : (
        <div className="mt-5 space-y-3">
          {delivery.revisions.map((revision) => (
            <article
              key={revision.id}
              className="rounded-2xl border border-border/70 bg-background p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-lg bg-amber-500 text-white hover:bg-amber-500">
                  {formatRevisionStatus(revision.revisionStatus)}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDate(revision.createdAt)}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-foreground">
                {revision.revisionNote}
              </p>
              {revision.responseNote ? (
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Respons kreator: {revision.responseNote}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export function CreatorDeliveryForm({
  canSubmit,
  orderId,
}: {
  canSubmit: boolean;
  orderId: string;
}) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
          <UploadCloud className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-blue-700">Kirim hasil</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
            Upload hasil project
          </h2>
        </div>
      </div>

      <form action={submitCreatorDelivery} className="mt-5 space-y-4">
        <input type="hidden" name="orderId" value={orderId} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Judul hasil">
            <input
              name="title"
              type="text"
              placeholder="Contoh: Hasil konten versi 1"
              disabled={!canSubmit}
              className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-[3px] focus:ring-ring/20 disabled:opacity-60"
            />
          </Field>
          <Field label="Link hasil atau preview">
            <textarea
              name="externalLinks"
              rows={1}
              placeholder="Satu link per baris"
              disabled={!canSubmit}
              className="min-h-11 w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-ring focus:ring-[3px] focus:ring-ring/20 disabled:opacity-60"
            />
          </Field>
        </div>

        <Field label="Catatan hasil">
          <Textarea
            name="description"
            placeholder="Ringkas isi file/link yang dikirim."
            disabled={!canSubmit}
            className="min-h-24"
          />
        </Field>

        <Field label="Caption atau catatan publik">
          <Textarea
            name="captionText"
            placeholder="Opsional, jika kreator juga menyiapkan caption."
            disabled={!canSubmit}
            className="min-h-20"
          />
        </Field>

        <FileDropzone
          id="projectFiles"
          name="projectFiles"
          label="Upload file hasil"
          description="Maksimal 5 file, 50MB per file. Gambar/video dipreview lokal sebelum dikirim."
          accept={projectResultAccept}
          multiple
          maxFiles={5}
          disabled={!canSubmit}
        />

        {!canSubmit ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            Hasil hanya bisa dikirim saat status pesanan sedang dikerjakan atau revisi diminta.
          </p>
        ) : null}

        <SubmitButton
          pendingLabel="Mengunggah..."
          disabled={!canSubmit}
          className="h-11 w-full bg-blue-600 text-white hover:bg-blue-700"
          icon={<Send className="size-4" aria-hidden="true" />}
        >
          Kirim Hasil
        </SubmitButton>
      </form>
    </section>
  );
}

export function UmkmDeliveryReviewPanel({
  canReview,
  delivery,
  orderId,
}: {
  canReview: boolean;
  delivery: OrderDeliveryData;
  orderId: string;
}) {
  const revisionRemaining = Math.max(0, delivery.revisionLimit - delivery.revisionUsed);

  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]">
      <p className="text-sm font-semibold text-primary">Review hasil</p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
        Terima atau minta revisi
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Kreator tidak bisa menyelesaikan pesanan tanpa persetujuan UMKM.
      </p>

      <form action={approveOrderDelivery} className="mt-5">
        <input type="hidden" name="orderId" value={orderId} />
        <SubmitButton
          pendingLabel="Memproses..."
          disabled={!canReview}
          confirmMessage="Terima hasil konten dan selesaikan pesanan?"
          className="h-11 w-full bg-emerald-600 text-white hover:bg-emerald-700"
          icon={<CheckCircle2 className="size-4" aria-hidden="true" />}
        >
          Terima Hasil
        </SubmitButton>
      </form>

      <form action={requestOrderRevision} className="mt-4 space-y-3">
        <input type="hidden" name="orderId" value={orderId} />
        <Textarea
          name="revisionNote"
          placeholder="Tulis catatan revisi singkat dan spesifik."
          disabled={!canReview || revisionRemaining === 0}
          className="min-h-24"
        />
        <Textarea
          name="referenceUrls"
          placeholder="Link referensi tambahan, opsional."
          disabled={!canReview || revisionRemaining === 0}
          className="min-h-16"
        />
        <SubmitButton
          pendingLabel="Memproses..."
          disabled={!canReview || revisionRemaining === 0}
          variant="outline"
          confirmMessage="Kirim permintaan revisi ke kreator?"
          className="h-11 w-full border-amber-300 text-amber-900 hover:bg-amber-50"
          icon={<RotateCcw className="size-4" aria-hidden="true" />}
        >
          Minta Revisi
        </SubmitButton>
      </form>

      <p className="mt-3 text-xs text-muted-foreground">
        Sisa revisi: {revisionRemaining}
      </p>
    </section>
  );
}

function DeliveryFileCard({ file }: { file: DeliveryFileAsset }) {
  const isImage = file.mimeType?.startsWith("image/");
  const isVideo = file.mimeType?.startsWith("video/");

  return (
    <article className="overflow-hidden rounded-2xl border border-border/70 bg-card">
      {file.signedUrl && isImage ? (
        <div className="relative aspect-video bg-muted">
          <Image
            src={file.signedUrl}
            alt={file.fileName}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
      ) : file.signedUrl && isVideo ? (
        <video
          src={file.signedUrl}
          controls
          className="aspect-video w-full bg-muted object-cover"
        />
      ) : (
        <div className="grid aspect-video place-items-center bg-muted/50">
          <FileText className="size-8 text-muted-foreground" aria-hidden="true" />
        </div>
      )}

      <div className="space-y-3 p-3">
        <div>
          <p className="truncate text-sm font-semibold text-foreground">
            {file.fileName}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatFileSize(file.fileSize)}
          </p>
        </div>
        {file.signedUrl ? (
          <Button asChild size="sm" variant="outline" className="w-full">
            <Link href={file.signedUrl} target="_blank" rel="noreferrer">
              <Download className="size-4" aria-hidden="true" />
              Unduh
            </Link>
          </Button>
        ) : null}
      </div>
    </article>
  );
}

function Field({ children, label }: { children: ReactNode; label: string }) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

function formatFileSize(value: number | null) {
  if (!value) {
    return "Ukuran tidak tersedia";
  }

  if (value >= 1024 * 1024) {
    return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(value / 1024))} KB`;
}

function formatRevisionStatus(status: string) {
  const labels: Record<string, string> = {
    approved: "Disetujui",
    in_progress: "Diproses",
    rejected: "Ditolak",
    requested: "Diminta",
    submitted: "Dikirim",
  };

  return labels[status] ?? status;
}
