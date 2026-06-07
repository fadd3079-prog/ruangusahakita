import type { Metadata } from "next";
import { Search, MoreHorizontal, ShieldCheck, CheckCircle2, Star } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
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
import { Badge } from "@/components/ui/badge";
import { dummyCreators } from "@/lib/dummy";

export const metadata: Metadata = {
  title: "Kelola Kreator — Ruang Usaha Kita",
  description: "Daftar dan status verifikasi kreator di platform.",
};

const availabilityLabels = {
  available: "Tersedia",
  limited: "Terbatas",
  busy: "Penuh",
  unavailable: "Tdk Tersedia",
} as const;

export default function AdminCreatorsPage() {
  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">Direktori Kreator</h1>
          <p className="mt-2 text-muted-foreground">Kelola verifikasi, status unggulan, dan pantau metrik kinerja kreator.</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Cari nama atau spesialisasi..." className="pl-9 h-11 bg-card" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-11 bg-card">Status Verifikasi</Button>
            <Button variant="outline" className="h-11 bg-card">Urutkan</Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Kreator & Spesialisasi</TableHead>
                <TableHead>Lokasi</TableHead>
                <TableHead>Ketersediaan</TableHead>
                <TableHead>Rating & Selesai</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyCreators.map((creator) => (
                <TableRow key={creator.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="grid size-10 place-items-center rounded-full bg-[linear-gradient(135deg,rgba(22,113,99,0.14),rgba(12,41,73,0.08))] font-semibold text-primary ring-1 ring-primary/10">
                        {creator.displayName.split(" ").map(p => p[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-semibold text-foreground">{creator.displayName}</p>
                          {creator.isVerified && <ShieldCheck className="size-4 text-primary" />}
                          {creator.isFeatured && (
                            <Badge variant="secondary" className="h-5 text-[10px] ml-1">Featured</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{creator.niche}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {creator.city}, {creator.province}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-muted/50 text-foreground">
                      <CheckCircle2 className="size-3 mr-1 text-primary" />
                      {availabilityLabels[creator.availabilityStatus]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="size-4 fill-primary text-primary" />
                      <span className="font-semibold">{creator.averageRating.toFixed(1)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{creator.completedOrdersCount} pesanan selesai</p>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="size-8">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageContainer>
  );
}
