import type { Metadata } from "next";
import { Search, FileWarning, ArrowRight, ExternalLink } from "lucide-react";
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
import { dummyComplaints, dummyOrders } from "@/lib/dummy";
import { formatDate } from "@/lib/formatters/date";
import { cn } from "@/lib/utils";
import type { DummyComplaintStatus } from "@/lib/dummy";

export const metadata: Metadata = {
  title: "Komplain — Ruang Usaha Kita",
  description: "Pusat mediasi komplain antara UMKM dan kreator.",
};

const complaintStatusLabels: Record<DummyComplaintStatus, string> = {
  open: "Terbuka",
  under_review: "Dalam Tinjauan",
  resolved: "Selesai",
  rejected: "Ditolak",
};

const complaintStatusClasses: Record<DummyComplaintStatus, string> = {
  open: "border-destructive text-destructive bg-destructive/10",
  under_review: "border-amber-500 text-amber-700 bg-amber-500/10",
  resolved: "border-primary text-primary bg-primary/10",
  rejected: "border-muted-foreground text-muted-foreground bg-muted",
};

export default function AdminComplaintsPage() {
  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">Mediasi Komplain</h1>
          <p className="mt-2 text-muted-foreground">Tinjau keluhan pengguna dan fasilitasi penyelesaian sengketa transaksi.</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Cari berdasarkan tiket atau subjek..." className="pl-9 h-11 bg-card" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-11 bg-card">Status</Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]">
          {dummyComplaints.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>Subjek Komplain</TableHead>
                  <TableHead>Terkait Pesanan</TableHead>
                  <TableHead>Dibuka Oleh</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dummyComplaints.map((complaint) => {
                  const order = dummyOrders.find(o => o.id === complaint.orderId);
                  const isUmkm = complaint.openedBy.includes('umkm'); // Simple check based on dummy IDs

                  return (
                    <TableRow key={complaint.id}>
                      <TableCell>
                        <p className="font-semibold text-foreground line-clamp-1">{complaint.subject}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(complaint.createdAt)}
                        </p>
                      </TableCell>
                      <TableCell>
                        {order ? (
                          <Link href={`/admin/orders/${order.id}`} className="font-medium text-brand-navy hover:text-primary transition-colors inline-flex items-center gap-1">
                            {order.orderNumber}
                            <ExternalLink className="size-3" />
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={isUmkm ? "border-brand-teal/30 bg-brand-teal/5 text-brand-teal-900" : "border-brand-navy/30 bg-brand-navy/5 text-brand-navy"}>
                          {isUmkm ? 'UMKM' : 'Kreator'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("rounded-lg font-medium", complaintStatusClasses[complaint.complaintStatus])}>
                          {complaintStatusLabels[complaint.complaintStatus]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="font-medium text-primary">
                          Tinjau
                          <ArrowRight className="ml-1 size-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
             <div className="p-16 text-center">
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-primary/10 text-primary mb-4">
                <FileWarning className="size-6" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Tidak ada komplain aktif</h3>
              <p className="mt-1 text-sm text-muted-foreground">Saat ini tidak ada sengketa transaksi dalam sistem dummy.</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

