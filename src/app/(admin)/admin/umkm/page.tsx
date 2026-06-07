import type { Metadata } from "next";
import { Search, MoreHorizontal, Building2 } from "lucide-react";

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
import { dummyUmkmProfiles, dummyOrders } from "@/lib/dummy";

export const metadata: Metadata = {
  title: "Kelola UMKM — Ruang Usaha Kita",
  description: "Daftar dan profil UMKM yang terdaftar di platform.",
};

export default function AdminUmkmPage() {
  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">Direktori UMKM</h1>
          <p className="mt-2 text-muted-foreground">Pantau profil bisnis dan aktivitas pemesanan dari sisi UMKM.</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Cari nama usaha atau kota..." className="pl-9 h-11 bg-card" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-11 bg-card">Kategori</Button>
            <Button variant="outline" className="h-11 bg-card">Lokasi</Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Nama Usaha</TableHead>
                <TableHead>Kategori & Lokasi</TableHead>
                <TableHead>Target Audiens</TableHead>
                <TableHead className="text-center">Pesanan Aktif</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyUmkmProfiles.map((umkm) => {
                const activeOrdersCount = dummyOrders.filter(
                  o => o.umkmId === umkm.id && !['completed', 'cancelled'].includes(o.orderStatus)
                ).length;

                return (
                  <TableRow key={umkm.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
                          <Building2 className="size-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{umkm.businessName}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{umkm.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="mb-1 rounded-md">{umkm.businessCategory}</Badge>
                      <p className="text-sm text-muted-foreground">{umkm.city}, {umkm.province}</p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {umkm.targetAudience.slice(0, 2).map((target, idx) => (
                        <div key={idx}>• {target}</div>
                      ))}
                      {umkm.targetAudience.length > 2 && <div className="text-xs text-muted-foreground/60">+{umkm.targetAudience.length - 2} lainnya</div>}
                    </TableCell>
                    <TableCell className="text-center">
                      {activeOrdersCount > 0 ? (
                        <span className="inline-flex items-center justify-center rounded-full bg-brand-navy/10 px-2.5 py-0.5 text-xs font-semibold text-brand-navy">
                          {activeOrdersCount}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </PageContainer>
  );
}
