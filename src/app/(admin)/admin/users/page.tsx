import type { Metadata } from "next";
import { Search, MoreHorizontal, UserCircle, CheckCircle2 } from "lucide-react";

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
import { dummyUsers } from "@/lib/dummy";
import { formatDate } from "@/lib/formatters/date";

export const metadata: Metadata = {
  title: "Kelola Pengguna — Ruang Usaha Kita",
  description: "Daftar semua pengguna yang terdaftar di platform.",
};

const roleLabels: Record<string, string> = {
  admin: "Admin",
  umkm: "UMKM",
  creator: "Kreator",
};

export default function AdminUsersPage() {
  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">Kelola Pengguna</h1>
          <p className="mt-2 text-muted-foreground">Tinjau dan kelola semua akun yang terdaftar di Ruang Usaha Kita.</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Cari nama atau email..." className="pl-9 h-11 bg-card" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-11 bg-card">Filter Role</Button>
            <Button variant="outline" className="h-11 bg-card">Status Akun</Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead>Pengguna</TableHead>
                <TableHead>Peran</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Bergabung Sejak</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary">
                        <UserCircle className="size-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.email.split('@')[0]}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-medium">
                      {roleLabels[user.role] ?? user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                      <CheckCircle2 className="size-3.5 mr-1" />
                      Aktif
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(user.createdAt)}
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
