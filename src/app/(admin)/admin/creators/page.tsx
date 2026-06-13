import type { Metadata } from "next";
import { CheckCircle2, Search, ShieldCheck, Star } from "lucide-react";

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
import { updateAdminCreatorModerationAction } from "@/features/admin/actions/admin-management-actions";
import { getAdminCreators } from "@/features/admin/data/admin-management-queries";
import type { AdminCreatorRow } from "@/features/admin/data/admin-management-queries";

export const metadata: Metadata = {
  title: "Kelola Kreator — Ruang Usaha Kita",
  description: "Daftar dan status verifikasi kreator di platform.",
};

const availabilityLabels = {
  available: "Tersedia",
  busy: "Penuh",
  limited: "Terbatas",
  unavailable: "Belum Tersedia",
} as const;

type AdminCreatorsPageProps = {
  searchParams: Promise<{
    error?: string;
    featured?: string;
    q?: string;
    sort?: string;
    verified?: string;
    updated?: string;
  }>;
};

const errorMessages = {
  invalid: "Data kreator tidak valid.",
  not_found: "Kreator tidak ditemukan.",
  save: "Status kreator belum bisa diperbarui.",
  unauthorized: "Akun ini tidak memiliki akses admin aktif.",
} as const;

function getErrorMessage(error?: string) {
  if (!error) {
    return null;
  }

  return errorMessages[error as keyof typeof errorMessages] ?? "Status kreator belum bisa diperbarui.";
}

export default async function AdminCreatorsPage({
  searchParams,
}: AdminCreatorsPageProps) {
  const params = await searchParams;
  const creators = await getAdminCreators();
  const errorMessage = getErrorMessage(params.error);
  const filters = getFilters(params);
  const filteredCreators = creators
    .filter((creator) => {
      const searchable = `${creator.display_name} ${creator.niche ?? ""} ${creator.city ?? ""} ${creator.province ?? ""}`.toLowerCase();
      const matchesQuery = filters.query ? searchable.includes(filters.query) : true;
      const matchesVerified =
        filters.verified === "all"
          ? true
          : creator.is_verified === (filters.verified === "verified");
      const matchesFeatured =
        filters.featured === "all"
          ? true
          : creator.is_featured === (filters.featured === "featured");

      return matchesQuery && matchesVerified && matchesFeatured;
    })
    .toSorted((left, right) => {
      if (filters.sort === "rating") {
        return right.realAverageRating - left.realAverageRating;
      }

      if (filters.sort === "completed") {
        return right.realCompletedOrdersCount - left.realCompletedOrdersCount;
      }

      return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
    });

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">
            Direktori Kreator
          </h1>
          <p className="mt-2 text-muted-foreground">
            Pantau profil kreator, status unggulan, dan metrik kinerja.
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
            <AlertTitle>Status kreator diperbarui</AlertTitle>
            <AlertDescription>
              Verifikasi atau status unggulan kreator sudah tersimpan.
            </AlertDescription>
          </Alert>
        ) : null}

        <form className="grid gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-[var(--shadow-soft)] lg:grid-cols-[minmax(240px,1fr)_170px_170px_170px_auto] lg:items-end">
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase text-muted-foreground">
              Cari
            </span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={filters.query}
                placeholder="Nama, niche, lokasi"
                className="h-11 bg-card pl-9"
              />
            </div>
          </label>
          <SelectField
            label="Verifikasi"
            name="verified"
            options={[
              { label: "Semua", value: "all" },
              { label: "Terverifikasi", value: "verified" },
              { label: "Belum", value: "unverified" },
            ]}
            value={filters.verified}
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
              { label: "Rating", value: "rating" },
              { label: "Selesai", value: "completed" },
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
          {filteredCreators.length > 0 ? (
            <Table className="table-fixed">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[32%]">Kreator</TableHead>
                  <TableHead className="w-[18%]">Lokasi</TableHead>
                  <TableHead className="w-[15%]">Status</TableHead>
                  <TableHead className="w-[15%]">Kinerja</TableHead>
                  <TableHead className="w-[20%] text-right">Moderasi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCreators.map((creator) => (
                  <TableRow key={creator.id}>
                    <TableCell className="min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,rgba(22,113,99,0.14),rgba(12,41,73,0.08))] font-semibold text-primary ring-1 ring-primary/10">
                          {creator.display_name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <TruncateText
                              text={creator.display_name}
                              className="font-semibold text-foreground"
                            />
                            {creator.is_verified ? (
                              <ShieldCheck className="size-4 text-primary" />
                            ) : null}
                            {creator.is_featured ? (
                              <Badge variant="secondary" className="ml-1 h-5 text-[10px]">
                                Unggulan
                              </Badge>
                            ) : null}
                          </div>
                          <TruncateText
                            text={creator.niche ?? "Niche belum diisi"}
                            className="text-sm text-muted-foreground"
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-0 text-sm text-muted-foreground">
                      <TruncateText
                        text={
                          [creator.city, creator.province].filter(Boolean).join(", ") ||
                          "Belum diisi"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-muted/50 text-foreground">
                        <CheckCircle2 className="mr-1 size-3 text-primary" />
                        {availabilityLabels[creator.availability_status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="mb-1 flex items-center gap-2">
                        <Star className="size-4 fill-primary text-primary" />
                        <span className="font-semibold">
                          {creator.realAverageRating.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {creator.realCompletedOrdersCount} pesanan selesai
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col items-end gap-1.5">
                        <CreatorModerationForm
                          creator={creator}
                          field="verified"
                          label={creator.is_verified ? "Cabut Verifikasi" : "Verifikasi"}
                          variant={creator.is_verified ? "outline" : "default"}
                        />
                        <CreatorModerationForm
                          creator={creator}
                          field="featured"
                          label={creator.is_featured ? "Cabut Unggulan" : "Jadikan Unggulan"}
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
              Belum ada kreator yang sesuai
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

function getFilters(params: Awaited<AdminCreatorsPageProps["searchParams"]>) {
  const verified = isVerifiedFilter(params.verified) ? params.verified : "all";
  const featured = isFeaturedFilter(params.featured) ? params.featured : "all";
  const sort = isSortFilter(params.sort) ? params.sort : "latest";

  return {
    featured,
    query: params.q?.trim().toLowerCase() ?? "",
    sort,
    verified,
  };
}

function isVerifiedFilter(value?: string): value is "all" | "verified" | "unverified" {
  return value === "all" || value === "verified" || value === "unverified";
}

function isFeaturedFilter(value?: string): value is "all" | "featured" | "regular" {
  return value === "all" || value === "featured" || value === "regular";
}

function isSortFilter(value?: string): value is "latest" | "rating" | "completed" {
  return value === "latest" || value === "rating" || value === "completed";
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

function CreatorModerationForm({
  creator,
  field,
  label,
  variant,
}: {
  creator: AdminCreatorRow;
  field: "featured" | "verified";
  label: string;
  variant: "default" | "outline" | "secondary";
}) {
  const nextVerified = field === "verified" ? !creator.is_verified : creator.is_verified;
  const nextFeatured = field === "featured" ? !creator.is_featured : creator.is_featured;

  return (
    <form action={updateAdminCreatorModerationAction}>
      <input type="hidden" name="creatorId" value={creator.id} />
      <input type="hidden" name="isVerified" value={String(nextVerified)} />
      <input type="hidden" name="isFeatured" value={String(nextFeatured)} />
      <SubmitButton
        pendingLabel="Memproses..."
        variant={variant}
        size="sm"
        className="h-8 w-[130px] rounded-full text-xs"
      >
        {label}
      </SubmitButton>
    </form>
  );
}
