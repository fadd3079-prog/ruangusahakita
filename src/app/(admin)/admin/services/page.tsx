import type { Metadata } from "next";
import Link from "next/link";
import { BriefcaseBusiness, Search } from "lucide-react";

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
import { updateAdminServiceModerationAction } from "@/features/admin/actions/admin-management-actions";
import { getAdminServices } from "@/features/admin/data/admin-management-queries";
import type { AdminServiceRow } from "@/features/admin/data/admin-management-queries";
import { formatCurrency } from "@/lib/formatters/currency";

export const metadata: Metadata = {
  title: "Kelola Layanan — Ruang Usaha Kita",
  description: "Daftar paket layanan digital yang tersedia di platform.",
};

type AdminServicesPageProps = {
  searchParams: Promise<{
    error?: string;
    updated?: string;
  }>;
};

const errorMessages = {
  invalid: "Data layanan tidak valid.",
  not_found: "Layanan tidak ditemukan.",
  save: "Status layanan belum bisa diperbarui.",
  unauthorized: "Akun ini tidak memiliki akses admin aktif.",
} as const;

function getErrorMessage(error?: string) {
  if (!error) {
    return null;
  }

  return errorMessages[error as keyof typeof errorMessages] ?? "Status layanan belum bisa diperbarui.";
}

export default async function AdminServicesPage({
  searchParams,
}: AdminServicesPageProps) {
  const params = await searchParams;
  const services = await getAdminServices();
  const errorMessage = getErrorMessage(params.error);

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">
            Katalog Layanan Digital
          </h1>
          <p className="mt-2 text-muted-foreground">
            Tinjau paket jasa digital yang dibuat oleh kreator.
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
            <AlertTitle>Status layanan diperbarui</AlertTitle>
            <AlertDescription>
              Moderasi layanan sudah tersimpan dan katalog akan memakai status terbaru.
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Cari judul layanan..." className="h-11 bg-card pl-9" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]">
          {services.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>Judul layanan</TableHead>
                  <TableHead>Kreator & kategori</TableHead>
                  <TableHead>Harga mulai</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Moderasi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div className="flex max-w-[320px] items-start gap-3">
                        <div className="mt-1 grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                          <BriefcaseBusiness className="size-4" />
                        </div>
                        <div>
                          <Link
                            href={`/layanan/${service.id}`}
                            className="line-clamp-2 font-semibold text-foreground transition-colors hover:text-primary"
                          >
                            {service.title}
                          </Link>
                          {service.is_featured ? (
                            <Badge variant="secondary" className="mt-1 h-5 text-[10px]">
                              Unggulan
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-foreground">
                        {service.creatorName ?? "Kreator belum tersedia"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {service.categoryName ?? "Kategori belum dipilih"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="font-semibold text-brand-navy">
                        {formatCurrency(Number(service.base_price))}
                      </p>
                    </TableCell>
                    <TableCell className="text-center">
                      {service.is_active ? (
                        <Badge
                          variant="outline"
                          className="border-primary/20 bg-primary/5 text-primary"
                        >
                          Aktif
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Tidak aktif</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap justify-end gap-2">
                        <ServiceModerationForm
                          service={service}
                          field="active"
                          label={service.is_active ? "Nonaktifkan" : "Aktifkan"}
                          variant={service.is_active ? "outline" : "default"}
                        />
                        <ServiceModerationForm
                          service={service}
                          field="featured"
                          label={service.is_featured ? "Cabut Unggulan" : "Unggulkan"}
                          variant="secondary"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center text-sm text-muted-foreground">
              Belum ada layanan
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

function ServiceModerationForm({
  field,
  label,
  service,
  variant,
}: {
  field: "active" | "featured";
  label: string;
  service: AdminServiceRow;
  variant: "default" | "outline" | "secondary";
}) {
  const nextActive = field === "active" ? !service.is_active : service.is_active;
  const nextFeatured = field === "featured" ? !service.is_featured : service.is_featured;

  return (
    <form action={updateAdminServiceModerationAction}>
      <input type="hidden" name="serviceId" value={service.id} />
      <input type="hidden" name="isActive" value={String(nextActive)} />
      <input type="hidden" name="isFeatured" value={String(nextFeatured)} />
      <SubmitButton
        pendingLabel="Memproses..."
        variant={variant}
        size="sm"
        className="h-8 rounded-full"
      >
        {label}
      </SubmitButton>
    </form>
  );
}
