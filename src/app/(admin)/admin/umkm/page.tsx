import type { Metadata } from "next";
import { Building2, Search } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
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
import { getAdminUmkmProfiles } from "@/features/admin/data/admin-management-queries";

export const metadata: Metadata = {
  title: "Kelola UMKM — Ruang Usaha Kita",
  description: "Daftar dan profil UMKM yang terdaftar di platform.",
};

export default async function AdminUmkmPage() {
  const umkmProfiles = await getAdminUmkmProfiles();

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

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari nama usaha atau kota..."
            className="h-11 bg-card pl-9"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]">
          {umkmProfiles.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>Nama usaha</TableHead>
                  <TableHead>Kategori & lokasi</TableHead>
                  <TableHead>Target audiens</TableHead>
                  <TableHead className="text-center">Pesanan aktif</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {umkmProfiles.map((umkm) => (
                  <TableRow key={umkm.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                          <Building2 className="size-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {umkm.business_name}
                          </p>
                          <p className="line-clamp-1 text-sm text-muted-foreground">
                            {umkm.business_description ?? "Deskripsi usaha belum diisi"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="mb-1 rounded-md">
                        {umkm.business_category ?? "Kategori belum diisi"}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {[umkm.city, umkm.province].filter(Boolean).join(", ") ||
                          "Lokasi belum diisi"}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {umkm.target_audience ?? "Belum diisi"}
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
              Belum ada UMKM
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
