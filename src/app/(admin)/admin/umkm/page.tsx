import type { Metadata } from "next";
import { Building2, Search } from "lucide-react";

import { TruncateText } from "@/components/common/truncate-text";
import { PageContainer } from "@/components/layout/page-container";
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
import { getAdminUmkmProfiles } from "@/features/admin/data/admin-management-queries";

export const metadata: Metadata = {
  title: "Kelola UMKM — Ruang Usaha Kita",
  description: "Daftar dan profil UMKM yang terdaftar di platform.",
};

type AdminUmkmPageProps = {
  searchParams: Promise<{
    q?: string;
    sort?: string;
  }>;
};

export default async function AdminUmkmPage({ searchParams }: AdminUmkmPageProps) {
  const params = await searchParams;
  const umkmProfiles = await getAdminUmkmProfiles();
  const filters = getFilters(params);
  const filteredProfiles = umkmProfiles
    .filter((umkm) => {
      const searchable = `${umkm.business_name} ${umkm.business_category ?? ""} ${umkm.city ?? ""} ${umkm.province ?? ""} ${umkm.target_audience ?? ""}`.toLowerCase();

      return filters.query ? searchable.includes(filters.query) : true;
    })
    .toSorted((left, right) => {
      if (filters.sort === "name") {
        return left.business_name.localeCompare(right.business_name);
      }

      if (filters.sort === "active_orders") {
        return right.activeOrdersCount - left.activeOrdersCount;
      }

      return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
    });

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">
            Direktori UMKM
          </h1>
          <p className="mt-2 text-muted-foreground">
            Pantau profil usaha dan aktivitas pesanan dari sisi UMKM.
          </p>
        </div>

        <form className="grid gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-[var(--shadow-soft)] md:grid-cols-[minmax(240px,1fr)_180px_auto] md:items-end">
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase text-muted-foreground">
              Cari
            </span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={filters.query}
                placeholder="Nama usaha, kategori, lokasi"
                className="h-11 bg-card pl-9"
              />
            </div>
          </label>
          <SelectField
            label="Urutkan"
            name="sort"
            options={[
              { label: "Terbaru", value: "latest" },
              { label: "Nama usaha", value: "name" },
              { label: "Pesanan aktif", value: "active_orders" },
            ]}
            value={filters.sort}
          />
          <div className="grid grid-cols-2 gap-2 md:flex">
            <Button type="submit" className="h-11">
              Terapkan
            </Button>
            <Button asChild type="button" variant="outline" className="h-11">
              <a href="?">Reset</a>
            </Button>
          </div>
        </form>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]">
          {filteredProfiles.length > 0 ? (
            <Table className="table-fixed">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[42%]">Nama usaha</TableHead>
                  <TableHead className="w-[24%]">Kategori & lokasi</TableHead>
                  <TableHead className="w-[22%]">Target audiens</TableHead>
                  <TableHead className="w-[12%] text-center">Aktif</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfiles.map((umkm) => (
                  <TableRow key={umkm.id}>
                    <TableCell className="min-w-0">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                          <Building2 className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <TruncateText
                            text={umkm.business_name}
                            className="font-semibold text-foreground"
                          />
                          <TruncateText
                            text={umkm.business_description ?? "Deskripsi usaha belum diisi"}
                            className="text-sm text-muted-foreground"
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-0">
                      <Badge variant="outline" className="mb-1 rounded-md">
                        {umkm.business_category ?? "Kategori belum diisi"}
                      </Badge>
                      <TruncateText
                        text={
                          [umkm.city, umkm.province].filter(Boolean).join(", ") ||
                          "Lokasi belum diisi"
                        }
                        className="text-sm text-muted-foreground"
                      />
                    </TableCell>
                    <TableCell className="min-w-0 text-sm text-muted-foreground">
                      <TruncateText text={umkm.target_audience ?? "Belum diisi"} />
                    </TableCell>
                    <TableCell className="text-center">
                      {umkm.activeOrdersCount > 0 ? (
                        <span className="inline-flex items-center justify-center rounded-full bg-brand-navy/10 px-2.5 py-0.5 text-xs font-semibold text-brand-navy">
                          {umkm.activeOrdersCount}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center text-sm text-muted-foreground">
              Belum ada UMKM yang sesuai
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

function getFilters(params: Awaited<AdminUmkmPageProps["searchParams"]>) {
  const sort = isSortFilter(params.sort) ? params.sort : "latest";

  return {
    query: params.q?.trim().toLowerCase() ?? "",
    sort,
  };
}

function isSortFilter(value?: string): value is "latest" | "name" | "active_orders" {
  return value === "latest" || value === "name" || value === "active_orders";
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
