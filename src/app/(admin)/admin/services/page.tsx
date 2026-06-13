import type { Metadata } from "next";
import Link from "next/link";
import { BriefcaseBusiness, Search } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { SubmitButton } from "@/components/common/submit-button";
import { TruncateText } from "@/components/common/truncate-text";
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
    featured?: string;
    q?: string;
    sort?: string;
    status?: string;
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
  const filters = getFilters(params);
  const filteredServices = services
    .filter((service) => {
      const searchable = `${service.title} ${service.creatorName ?? ""} ${service.categoryName ?? ""}`.toLowerCase();
      const matchesQuery = filters.query ? searchable.includes(filters.query) : true;
      const matchesStatus =
        filters.status === "all" ? true : service.is_active === (filters.status === "active");
      const matchesFeatured =
        filters.featured === "all"
          ? true
          : service.is_featured === (filters.featured === "featured");

      return matchesQuery && matchesStatus && matchesFeatured;
    })
    .toSorted((left, right) => {
      if (filters.sort === "price") {
        return Number(left.base_price) - Number(right.base_price);
      }

      if (filters.sort === "title") {
        return left.title.localeCompare(right.title);
      }

      return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
    });

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

        <form className="grid gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-[var(--shadow-soft)] lg:grid-cols-[minmax(240px,1fr)_160px_160px_160px_auto] lg:items-end">
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase text-muted-foreground">
              Cari
            </span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={filters.query}
                placeholder="Layanan, kreator, kategori"
                className="h-11 bg-card pl-9"
              />
            </div>
          </label>
          <SelectField
            label="Status"
            name="status"
            options={[
              { label: "Semua", value: "all" },
              { label: "Aktif", value: "active" },
              { label: "Tidak aktif", value: "inactive" },
            ]}
            value={filters.status}
          />
          <SelectField
            label="Unggulan"
            name="featured"
            options={[
              { label: "Semua", value: "all" },
              { label: "Unggulan", value: "featured" },
              { label: "Reguler", value: "regular" },
            ]}
            value={filters.featured}
          />
          <SelectField
            label="Urutkan"
            name="sort"
            options={[
              { label: "Terbaru", value: "latest" },
              { label: "Harga", value: "price" },
              { label: "Judul", value: "title" },
            ]}
            value={filters.sort}
          />
          <div className="grid grid-cols-2 gap-2 lg:flex">
            <Button type="submit" className="h-11">
              Terapkan
            </Button>
            <Button asChild type="button" variant="outline" className="h-11">
              <a href="?">Reset</a>
            </Button>
          </div>
        </form>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]">
          {filteredServices.length > 0 ? (
            <Table className="table-fixed">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[34%]">Judul layanan</TableHead>
                  <TableHead className="w-[24%]">Kreator & kategori</TableHead>
                  <TableHead className="w-[14%]">Harga mulai</TableHead>
                  <TableHead className="w-[12%] text-center">Status</TableHead>
                  <TableHead className="w-[16%] text-right">Moderasi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="min-w-0">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="mt-1 grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                          <BriefcaseBusiness className="size-4" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/layanan/${service.id}`}
                            className="block font-semibold text-foreground transition-colors hover:text-primary"
                          >
                            <TruncateText text={service.title} />
                          </Link>
                          {service.is_featured ? (
                            <Badge variant="secondary" className="mt-1 h-5 text-[10px]">
                              Unggulan
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-0">
                      <TruncateText
                        text={service.creatorName ?? "Kreator belum tersedia"}
                        className="font-medium text-foreground"
                      />
                      <TruncateText
                        text={service.categoryName ?? "Kategori belum dipilih"}
                        className="text-sm text-muted-foreground"
                      />
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
              Belum ada layanan yang sesuai
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

function getFilters(params: Awaited<AdminServicesPageProps["searchParams"]>) {
  const status = isStatusFilter(params.status) ? params.status : "all";
  const featured = isFeaturedFilter(params.featured) ? params.featured : "all";
  const sort = isSortFilter(params.sort) ? params.sort : "latest";

  return {
    featured,
    query: params.q?.trim().toLowerCase() ?? "",
    sort,
    status,
  };
}

function isStatusFilter(value?: string): value is "active" | "inactive" | "all" {
  return value === "active" || value === "inactive" || value === "all";
}

function isFeaturedFilter(value?: string): value is "featured" | "regular" | "all" {
  return value === "featured" || value === "regular" || value === "all";
}

function isSortFilter(value?: string): value is "latest" | "price" | "title" {
  return value === "latest" || value === "price" || value === "title";
}

function SelectField<TValue extends string>({
  label,
  name,
  options,
  value,
}: {
  label: string;
  name: string;
  options: readonly { label: string; value: TValue }[];
  value: TValue;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-semibold uppercase text-muted-foreground">
        {label}
      </span>
      <select
        name={name}
        defaultValue={value}
        className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-[3px] focus:ring-ring/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
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
