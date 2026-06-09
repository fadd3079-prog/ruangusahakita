import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ExternalLink, FileWarning, Search } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { updateAdminComplaintStatusAction } from "@/features/admin/actions/admin-management-actions";
import { getAdminComplaints } from "@/features/admin/data/admin-management-queries";
import type { AdminComplaintRow } from "@/features/admin/data/admin-management-queries";
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
  const complaints = await getAdminComplaints();
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

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari berdasarkan tiket atau subjek..."
            className="h-11 bg-card pl-9"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]">
          {complaints.length > 0 ? (
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
                {complaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell>
                      <p className="line-clamp-1 font-semibold text-foreground">
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
                          className="inline-flex items-center gap-1 font-medium text-brand-navy transition-colors hover:text-primary"
                        >
                          {complaint.orderNumber}
                          <ExternalLink className="size-3" />
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
      </div>
    </PageContainer>
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
      <Button type="submit" size="sm" className="ml-auto h-8 rounded-full">
        Simpan Status
        <ArrowRight className="ml-1 size-3" />
      </Button>
    </form>
  );
}
