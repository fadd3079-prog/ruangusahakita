import { Star } from "lucide-react";

import type {
  DummyCreatorProfile,
  DummyReview,
  DummyServicePackage,
} from "@/lib/dummy";
import { formatDate } from "@/lib/formatters/date";

type OrderReviewCardProps = {
  creator: DummyCreatorProfile;
  review: DummyReview | null;
  service: DummyServicePackage;
  showPlaceholder?: boolean;
};

export function OrderReviewCard({
  creator,
  review,
  service,
  showPlaceholder = false,
}: OrderReviewCardProps) {
  if (!review && !showPlaceholder) {
    return null;
  }

  return (
    <section
      aria-labelledby="order-review-title"
      className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]"
    >
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <Star className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-primary">Review</p>
          <h2
            id="order-review-title"
            className="mt-1 text-xl font-semibold tracking-tight text-foreground"
          >
            Ulasan hasil konten
          </h2>
        </div>
      </div>

      {review ? (
        <article className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {creator.displayName} · {service.title}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Review dibuat {formatDate(review.createdAt)}
              </p>
            </div>
            <RatingPill label="Rating" value={review.rating} />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <RatingPill label="Kualitas" value={review.qualityRating} />
            <RatingPill label="Komunikasi" value={review.communicationRating} />
            <RatingPill label="Ketepatan waktu" value={review.timelinessRating} />
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            {review.comment}
          </p>
        </article>
      ) : (
        <div className="mt-5 rounded-2xl border border-dashed border-border p-4">
          <p className="text-sm font-semibold text-foreground">
            Review belum tersedia.
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Setelah pesanan selesai, UMKM dapat memberi rating kualitas,
            komunikasi, ketepatan waktu, dan komentar untuk kreator.
          </p>
        </div>
      )}
    </section>
  );
}

type RatingPillProps = {
  label: string;
  value: number;
};

function RatingPill({ label, value }: RatingPillProps) {
  return (
    <div className="rounded-xl border border-border/70 bg-card px-3 py-2">
      <p className="text-xs font-medium uppercase text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-foreground">
        <Star className="size-4 fill-primary text-primary" aria-hidden="true" />
        {value.toFixed(1)}
      </p>
    </div>
  );
}
