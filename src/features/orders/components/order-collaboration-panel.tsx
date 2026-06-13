import { MessageCircle, ShieldAlert, Star } from "lucide-react";

import { SubmitButton } from "@/components/common/submit-button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  createOrderComplaintAction,
  submitOrderReviewAction,
} from "@/features/orders/actions/order-collaboration-actions";
import type {
  OrderCollaborationData,
} from "@/features/orders/data/order-collaboration-queries";
import { RealtimeOrderChat } from "@/features/orders/components/realtime-order-chat";
import { formatDate } from "@/lib/formatters/date";

type OrderCollaborationPanelProps = {
  canReview: boolean;
  collaboration: OrderCollaborationData;
  orderId: string;
  returnPath: string;
  variant: "creator" | "umkm";
};

const complaintStatusLabels = {
  open: "Terbuka",
  rejected: "Ditolak",
  resolved: "Selesai",
  under_review: "Ditinjau",
  waiting_creator: "Menunggu Kreator",
  waiting_umkm: "Menunggu UMKM",
} as const;

export function OrderCollaborationPanel({
  canReview,
  collaboration,
  orderId,
  returnPath,
  variant,
}: OrderCollaborationPanelProps) {
  return (
    <section className="grid gap-5">
      {variant === "umkm" ? (
        <ReviewPanel
          canReview={canReview}
          collaboration={collaboration}
          orderId={orderId}
          returnPath={returnPath}
        />
      ) : null}
      <ComplaintPanel
        collaboration={collaboration}
        orderId={orderId}
        returnPath={returnPath}
      />
      <MessagePanel
        collaboration={collaboration}
        orderId={orderId}
      />
    </section>
  );
}

function ReviewPanel({
  canReview,
  collaboration,
  orderId,
  returnPath,
}: {
  canReview: boolean;
  collaboration: OrderCollaborationData;
  orderId: string;
  returnPath: string;
}) {
  const review = collaboration.review;

  if (review) {
    return (
      <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-950 shadow-[var(--shadow-soft)]">
        <div className="flex items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white">
            <Star className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Review sudah diberikan</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">
              {review.rating.toFixed(1)} dari 5
            </h2>
            {review.comment ? (
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-emerald-900">
                {review.comment}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700">
          <Star className="size-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Beri review
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review hanya tersedia setelah pesanan selesai.
          </p>
        </div>
      </div>

      <form action={submitOrderReviewAction} className="mt-5 space-y-4">
        <input type="hidden" name="orderId" value={orderId} />
        <input type="hidden" name="returnPath" value={returnPath} />
        <div className="grid gap-3 sm:grid-cols-2">
          <RatingField name="rating" label="Rating utama" disabled={!canReview} />
          <RatingField name="qualityRating" label="Kualitas hasil" disabled={!canReview} />
          <RatingField
            name="communicationRating"
            label="Komunikasi"
            disabled={!canReview}
          />
          <RatingField
            name="timelinessRating"
            label="Ketepatan waktu"
            disabled={!canReview}
          />
        </div>
        <Textarea
          name="comment"
          placeholder="Tulis review singkat tentang hasil konten dan proses kerja."
          disabled={!canReview}
          className="min-h-24"
        />
        <SubmitButton
          pendingLabel="Menyimpan..."
          disabled={!canReview}
          className="h-11 w-full bg-emerald-600 text-white hover:bg-emerald-700"
          icon={<Star className="size-4" aria-hidden="true" />}
        >
          Kirim Review
        </SubmitButton>
      </form>
    </section>
  );
}

function ComplaintPanel({
  collaboration,
  orderId,
  returnPath,
}: {
  collaboration: OrderCollaborationData;
  orderId: string;
  returnPath: string;
}) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-red-50 text-red-700">
          <ShieldAlert className="size-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Komplain order
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gunakan jika ada kendala yang perlu ditinjau admin.
          </p>
        </div>
      </div>

      {collaboration.complaints.length > 0 ? (
        <div className="mt-5 space-y-3">
          {collaboration.complaints.slice(0, 3).map((complaint) => (
            <article
              key={complaint.id}
              className="rounded-xl border border-border/70 bg-background p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="rounded-lg">
                  {complaintStatusLabels[complaint.status]}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDate(complaint.createdAt)}
                </span>
              </div>
              <h3 className="mt-3 line-clamp-1 text-sm font-semibold text-foreground">
                {complaint.subject}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {complaint.description}
              </p>
            </article>
          ))}
        </div>
      ) : null}

      <form action={createOrderComplaintAction} className="mt-5 space-y-3">
        <input type="hidden" name="orderId" value={orderId} />
        <input type="hidden" name="returnPath" value={returnPath} />
        <Input name="subject" placeholder="Subjek komplain" required />
        <Textarea
          name="description"
          placeholder="Jelaskan kendala secara singkat."
          required
          className="min-h-24"
        />
        <SubmitButton
          pendingLabel="Mengirim..."
          variant="outline"
          confirmMessage="Kirim komplain untuk order ini?"
          className="h-11 w-full border-red-200 text-red-700 hover:bg-red-50"
          icon={<ShieldAlert className="size-4" aria-hidden="true" />}
        >
          Kirim Komplain
        </SubmitButton>
      </form>
    </section>
  );
}

function MessagePanel({
  collaboration,
  orderId,
}: {
  collaboration: OrderCollaborationData;
  orderId: string;
}) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
          <MessageCircle className="size-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Chat order
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Percakapan ringkas terkait brief, hasil konten, dan revisi.
          </p>
        </div>
      </div>

      <div className="mt-5">
        <RealtimeOrderChat collaboration={collaboration} orderId={orderId} />
      </div>
    </section>
  );
}

function RatingField({
  disabled,
  label,
  name,
}: {
  disabled?: boolean;
  label: string;
  name: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <select
        name={name}
        defaultValue="5"
        disabled={disabled}
        className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-[3px] focus:ring-ring/20 disabled:opacity-60"
      >
        {[5, 4, 3, 2, 1].map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
    </label>
  );
}
