import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink, FileWarning, Search, Star } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { SubmitButton } from "@/components/common/submit-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  updateAdminComplaintStatusAction,
  updateAdminReviewVisibilityAction,
} from "@/features/admin/actions/admin-management-actions";
import {
  getAdminComplaints,
  getAdminReviews,
} from "@/features/admin/data/admin-management-queries";
import type {
  AdminComplaintRow,
  AdminReviewRow,
} from "@/features/admin/data/admin-management-queries";
import type { Database } from "@/lib/supabase/types";
import { formatDate } from "@/lib/formatters/date";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Komplain — Ruang Usaha Kita",
  description: "Pusat mediasi komplain antara UMKM dan kreator.",
};

type ComplaintStatus = Database["public"]["Enums"]["complaint_status"];

const complaintStatusLabels: Record<ComplaintStatus, string> = {
  open: "Terbuka",
  rejected: "Ditolak",
  resolved: "Selesai",
  under_review: "Dalam Tinjauan",
  waiting_creator: "Menunggu Kreator",
  waiting_umkm: "Menunggu UMKM",
};

const complaintStatusClasses: Record<ComplaintStatus, string> = {
  open: "border-destructive text-destructive bg-destructive/10",
  rejected: "border-muted-foreground text-muted-foreground bg-muted",
  resolved: "border-primary text-primary bg-primary/10",
  under_review: "border-amber-500 text-amber-700 bg-amber-500/10",
  waiting_creator: "border-amber-500 text-amber-700 bg-amber-500/10",
  waiting_umkm: "border-amber-500 text-amber-700 bg-amber-500/10",
};

const roleLabels = {
  admin: "Admin",
  creator: "Kreator",
  umkm: "UMKM",
} as const;

const errorMessages = {
  invalid: "Data komplain tidak valid.",
  not_found: "Komplain tidak ditemukan.",
  resolution_required: "Catatan resolusi wajib diisi untuk status selesai atau ditolak.",
  save: "Status komplain belum bisa diperbarui.",
  unauthorized: "Akun ini tidak memiliki akses admin aktif.",
} as const;

type AdminComplaintsPageProps = {
  searchParams: Promise<{
    error?: string;
    q?: string;
    review_updated?: string;
    updated?: string;
  }>;
};

function getErrorMessage(error?: string) {
  if (!error) {
    return null;
  }

  return errorMessages[error as keyof typeof errorMessages] ?? "Status komplain belum bisa diperbarui.";
}

export default async function AdminComplaintsPage({
  searchParams,
}: AdminComplaintsPageProps) {
  const params = await searchParams;
  const [complaints, reviews] = await Promise.all([
    getAdminComplaints(),
    getAdminReviews(),
  ]);
  const query = params.q?.trim().toLowerCase() ?? "";
  const visibleComplaints = filterComplaints(complaints, query);
  const visibleReviews = filterReviews(reviews, query);
  const errorMessage = getErrorMessage(params.error);

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">
            Mediasi Komplain
          </h1>
          <p className="mt-2 text-muted-foreground">
            Tinjau keluhan pengguna dan fasilitasi penyelesaian masalah layanan digital.
          </p>
        </div>

        {errorMessage ? (
          <Alert variant="destructive">
            <AlertTitle>Perubahan belum tersimpan</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        {params.updated ? (
          <Alert>
            <AlertTitle>Status komplain diperbarui</AlertTitle>
            <AlertDescription>
              Perubahan status dan catatan resolusi sudah tersimpan.
            </AlertDescription>
          </Alert>
        ) : null}

        {params.review_updated ? (
          <Alert>
            <AlertTitle>Moderasi review diperbarui</AlertTitle>
            <AlertDescription>
              Status tampil review berhasil disimpan.
            </AlertDescription>
          </Alert>
        ) : null}

        <form className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Cari subjek, pesanan, kreator, atau UMKM"
            className="h-11 bg-card pl-9"
          />
        </form>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]">
          {visibleComplaints.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>Subjek komplain</TableHead>
                  <TableHead>Terkait pesanan</TableHead>
                  <TableHead>Dibuka oleh</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="min-w-[320px] text-right">Moderasi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleComplaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell className="min-w-0">
                      <p className="max-w-[280px] truncate font-semibold text-foreground">
                        {complaint.subject}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDate(complaint.created_at)}
                      </p>
                    </TableCell>
                    <TableCell>
                      {complaint.orderNumber ? (
                        <Link
                          href={`/admin/orders/${complaint.order_id}`}
                          className="inline-flex max-w-[180px] items-center gap-1 font-medium text-brand-navy transition-colors hover:text-primary"
                        >
                          <span className="truncate">{complaint.orderNumber}</span>
                          <ExternalLink className="size-3 shrink-0" />
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">Belum tersedia</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {complaint.openedByRole
                          ? roleLabels[complaint.openedByRole]
                          : "Akun"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-lg font-medium",
                          complaintStatusClasses[complaint.complaint_status],
                        )}
                      >
                        {complaintStatusLabels[complaint.complaint_status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <ComplaintModerationForm complaint={complaint} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-16 text-center">
              <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
                <FileWarning className="size-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Tidak ada komplain aktif
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Belum ada komplain yang perlu dimonitor admin.
              </p>
            </div>
          )}
        </div>

        <ReviewModerationTable reviews={visibleReviews} />
      </div>
    </PageContainer>
  );
}

function filterComplaints(
  complaints: readonly AdminComplaintRow[],
  query: string,
) {
  if (!query) {
    return complaints;
  }

  return complaints.filter((complaint) =>
    [
      complaint.subject,
      complaint.description,
      complaint.orderNumber,
      complaint.openedByRole,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query),
  );
}

function filterReviews(reviews: readonly AdminReviewRow[], query: string) {
  if (!query) {
    return reviews;
  }

  return reviews.filter((review) =>
    [review.comment, review.creatorName, review.orderNumber, review.umkmName]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(query),
  );
}

function ReviewModerationTable({ reviews }: { reviews: readonly AdminReviewRow[] }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]">
      <div className="border-b border-border/70 bg-muted/40 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-xl bg-amber-50 text-amber-700">
            <Star className="size-4" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              Moderasi Review
            </h2>
            <p className="text-sm text-muted-foreground">
              Tampilkan atau sembunyikan review publik.
            </p>
          </div>
        </div>
      </div>

      {reviews.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>Review</TableHead>
              <TableHead>Kreator</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell className="max-w-[360px] whitespace-normal">
                  <div className="flex items-center gap-2">
                    <Star className="size-4 fill-amber-400 text-amber-500" aria-hidden="true" />
                    <span className="font-semibold text-foreground">
                      {review.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {review.comment ?? "Review tanpa catatan tambahan."}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="max-w-[180px] truncate font-medium text-foreground">
                    {review.creatorName ?? "Kreator"}
                  </p>
                  <p className="mt-1 max-w-[180px] truncate text-xs text-muted-foreground">
                    {review.umkmName ?? "UMKM"}
                  </p>
                </TableCell>
                <TableCell>
                  {review.orderNumber ? (
                    <Link
                      href={`/admin/orders/${review.order_id}`}
                      className="font-medium text-brand-navy hover:text-primary"
                    >
                      {review.orderNumber}
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">Belum tersedia</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={review.is_visible ? "secondary" : "outline"}>
                    {review.is_visible ? "Tampil" : "Disembunyikan"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <form action={updateAdminReviewVisibilityAction}>
                    <input type="hidden" name="reviewId" value={review.id} />
                    <input
                      type="hidden"
                      name="isVisible"
                      value={review.is_visible ? "false" : "true"}
                    />
                    <SubmitButton pendingLabel="Memproses..." size="sm" variant="outline">
                      {review.is_visible ? "Sembunyikan" : "Tampilkan"}
                    </SubmitButton>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="p-10 text-center text-sm text-muted-foreground">
          Belum ada review yang perlu dimoderasi.
        </div>
      )}
    </section>
  );
}

function ComplaintModerationForm({
  complaint,
}: {
  complaint: AdminComplaintRow;
}) {
  return (
    <form action={updateAdminComplaintStatusAction} className="ml-auto grid max-w-sm gap-2">
      <input type="hidden" name="complaintId" value={complaint.id} />
      <div className="grid gap-2 sm:grid-cols-[150px_1fr]">
        <select
          name="complaintStatus"
          defaultValue={complaint.complaint_status}
          className="h-9 rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {Object.entries(complaintStatusLabels).map(([status, label]) => (
            <option key={status} value={status}>
              {label}
            </option>
          ))}
        </select>
        <Input
          name="resolutionNote"
          defaultValue={complaint.resolution_note ?? ""}
          placeholder="Catatan resolusi"
          className="h-9 bg-background"
        />
      </div>
      <SubmitButton
        pendingLabel="Memproses..."
        size="sm"
        className="ml-auto h-8 rounded-full"
        icon={<ArrowRight className="ml-1 size-3" />}
      >
        Simpan Status
      </SubmitButton>
    </form>
  );
}
