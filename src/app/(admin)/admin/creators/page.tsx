import type { Metadata } from "next";
import { CheckCircle2, Search, ShieldCheck, Star } from "lucide-react";

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
import { getAdminCreators } from "@/features/admin/data/admin-management-queries";

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

export default async function AdminCreatorsPage() {
  const creators = await getAdminCreators();

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

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau niche..."
            className="h-11 bg-card pl-9"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]">
          {creators.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>Kreator & niche</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Ketersediaan</TableHead>
                  <TableHead>Rating & selesai</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creators.map((creator) => (
                  <TableRow key={creator.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="grid size-10 place-items-center rounded-full bg-[linear-gradient(135deg,rgba(22,113,99,0.14),rgba(12,41,73,0.08))] font-semibold text-primary ring-1 ring-primary/10">
                          {creator.display_name
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-foreground">
                              {creator.display_name}
                            </p>
                            {creator.is_verified ? (
                              <ShieldCheck className="size-4 text-primary" />
                            ) : null}
                            {creator.is_featured ? (
                              <Badge variant="secondary" className="ml-1 h-5 text-[10px]">
                                Unggulan
                              </Badge>
                            ) : null}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {creator.niche ?? "Niche belum diisi"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {[creator.city, creator.province].filter(Boolean).join(", ") ||
                        "Belum diisi"}
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
                          {Number(creator.average_rating ?? 0).toFixed(1)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {creator.completed_orders_count} pesanan selesai
                      </p>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center text-sm text-muted-foreground">
              Belum ada kreator
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
