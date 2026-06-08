import type { Metadata } from "next";
import { CheckCircle2, Search, UserCircle } from "lucide-react";

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
import { getAdminUsers } from "@/features/admin/data/admin-management-queries";
import { formatDate } from "@/lib/formatters/date";

export const metadata: Metadata = {
  title: "Kelola Pengguna — Ruang Usaha Kita",
  description: "Daftar semua pengguna yang terdaftar di platform.",
};

const roleLabels = {
  admin: "Admin",
  creator: "Kreator",
  umkm: "UMKM",
} as const;

const statusLabels = {
  active: "Aktif",
  inactive: "Tidak Aktif",
  pending_verification: "Menunggu Verifikasi",
  suspended: "Dibatasi",
} as const;

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">
            Kelola Pengguna
          </h1>
          <p className="mt-2 text-muted-foreground">
            Tinjau akun yang terdaftar di Ruang Usaha Kita.
          </p>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Cari nama atau email..." className="h-11 bg-card pl-9" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]">
          {users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead>Pengguna</TableHead>
                  <TableHead>Peran</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Bergabung Sejak</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary">
                          <UserCircle className="size-5" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {user.full_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-medium">
                        {roleLabels[user.role]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.account_status === "active"
                            ? "border-primary/20 bg-primary/5 text-primary"
                            : "bg-muted"
                        }
                      >
                        <CheckCircle2 className="mr-1 size-3.5" />
                        {statusLabels[user.account_status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(user.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyAdminState title="Belum ada pengguna" />
          )}
        </div>
      </div>
    </PageContainer>
  );
}

function EmptyAdminState({ title }: { title: string }) {
  return (
    <div className="p-12 text-center text-sm text-muted-foreground">
      {title}
    </div>
  );
}
