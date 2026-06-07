import type { Metadata } from "next";
import { Search, MoreHorizontal, BriefcaseBusiness } from "lucide-react";
import Link from "next/link";

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
import { dummyServicePackages, dummyServiceCategories, dummyCreators } from "@/lib/dummy";
import { formatCurrency } from "@/lib/formatters/currency";

export const metadata: Metadata = {
  title: "Kelola Layanan — Ruang Usaha Kita",
  description: "Daftar paket layanan digital yang tersedia di platform.",
};

export default function AdminServicesPage() {
  const categoryById = new Map(dummyServiceCategories.map(c => [c.id, c.name]));
  const creatorById = new Map(dummyCreators.map(c => [c.id, c.displayName]));

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">Katalog Layanan Digital</h1>
          <p className="mt-2 text-muted-foreground">Tinjau dan moderasi paket jasa digital yang dibuat oleh kreator.</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Cari judul layanan..." className="pl-9 h-11 bg-card" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-11 bg-card">Kategori</Button>
            <Button variant="outline" className="h-11 bg-card">Status Aktif</Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Judul Layanan</TableHead>
                <TableHead>Kreator & Kategori</TableHead>
                <TableHead>Harga Dasar</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyServicePackages.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <div className="flex items-start gap-3 max-w-[280px]">
                      <div className="mt-1 grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20">
                        <BriefcaseBusiness className="size-4" />
                      </div>
                      <div>
                        <Link href={`/layanan/${service.id}`} className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                          {service.title}
                        </Link>
                        {service.isFeatured && (
                          <Badge variant="secondary" className="h-5 text-[10px] mt-1">Unggulan</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-foreground">{creatorById.get(service.creatorId)}</p>
                    <p className="text-sm text-muted-foreground">{categoryById.get(service.categoryId)}</p>
                  </TableCell>
                  <TableCell>
                    <p className="font-semibold text-brand-navy">{formatCurrency(service.basePrice)}</p>
                  </TableCell>
                  <TableCell className="text-center">
                    {service.isActive ? (
                      <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">Aktif</Badge>
                    ) : (
                      <Badge variant="secondary">Tidak Aktif</Badge>
                    )}
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
