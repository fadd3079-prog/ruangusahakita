import { Star } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { PublicReview, PublicUmkmProfile } from "@/features/catalog/data/catalog-types";

type ReviewCardProps = {
  review: PublicReview;
  umkm?: PublicUmkmProfile;
};

export function ReviewCard({ review, umkm }: ReviewCardProps) {
  return (
    <Card className="marketplace-card h-full">
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-base">
            {umkm?.businessName ?? "UMKM pengguna"}
          </CardTitle>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-foreground">
            <Star className="size-4 fill-primary text-primary" aria-hidden="true" />
            {review.rating.toFixed(1)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-4 text-sm leading-6 text-muted-foreground">
          {review.comment}
        </p>
        <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center text-xs text-muted-foreground">
          <div>
            <dt>Kualitas</dt>
            <dd className="mt-1 font-semibold text-foreground">
              {review.qualityRating}
            </dd>
          </div>
          <div>
            <dt>Komunikasi</dt>
            <dd className="mt-1 font-semibold text-foreground">
              {review.communicationRating}
            </dd>
          </div>
          <div>
            <dt>Ketepatan</dt>
            <dd className="mt-1 font-semibold text-foreground">
              {review.timelinessRating}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
