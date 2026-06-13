import type { Metadata } from "next";
import { CheckCircle2, Search, UserCircle } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { SubmitButton } from "@/components/common/submit-button";
import { TruncateText } from "@/components/common/truncate-text";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { updateAdminUserStatusAction } from "@/features/admin/actions/admin-management-actions";
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

type AdminUsersPageProps = {
  searchParams: Promise<{
    error?: string;
    updated?: string;
  }>;
};

const errorMessages = {
  invalid: "Data status akun tidak valid.",
  not_found: "Akun tidak ditemukan.",
  save: "Status akun belum bisa diperbarui.",
  self: "Admin tidak dapat mengubah status akunnya sendiri.",
  unauthorized: "Akun ini tidak memiliki akses admin aktif.",
} as const;

function getErrorMessage(error?: string) {
  if (!error) {
    return null;
  }

  return errorMessages[error as keyof typeof errorMessages] ?? "Status akun belum bisa diperbarui.";
}

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const params = await searchParams;
  const users = await getAdminUsers();
  const errorMessage = getErrorMessage(params.error);

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

        {errorMessage ? (
          <Alert variant="destructive">
            <AlertTitle>Perubahan belum tersimpan</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        {params.updated ? (
          <Alert>
            <AlertTitle>Status akun diperbarui</AlertTitle>
            <AlertDescription>
              Perubahan status akun sudah tersimpan di database.
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Cari nama atau email..." className="h-11 bg-card pl-9" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]">
          {users.length > 0 ? (
            <Table className="table-fixed">
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[38%]">Pengguna</TableHead>
                  <TableHead className="w-[12%]">Peran</TableHead>
                  <TableHead className="w-[16%]">Status</TableHead>
                  <TableHead className="w-[16%]">Bergabung</TableHead>
                  <TableHead className="w-[18%] text-right">Moderasi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                          <UserCircle className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <TruncateText
                            text={user.full_name}
                            className="font-medium text-foreground"
                          />
                          <TruncateText
                            text={user.email}
                            className="text-sm text-muted-foreground"
                          />
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
                    <TableCell>
                      <div className="flex flex-col items-end gap-1.5">
                        {user.account_status !== "active" ? (
                          <StatusForm
                            profileId={user.id}
                            status="active"
                            label="Aktifkan"
                          />
                        ) : null}
                        {user.account_status !== "suspended" ? (
                          <StatusForm
                            profileId={user.id}
                            status="suspended"
                            label="Batasi"
                            variant="outline"
                          />
                        ) : null}
                        {user.account_status !== "inactive" ? (
                          <StatusForm
                            profileId={user.id}
                            status="inactive"
                            label="Nonaktifkan"
                            variant="secondary"
                          />
                        ) : null}
                      </div>
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

function StatusForm({
  label,
  profileId,
  status,
  variant = "default",
}: {
  label: string;
  profileId: string;
  status: keyof typeof statusLabels;
  variant?: "default" | "outline" | "secondary";
}) {
  return (
    <form action={updateAdminUserStatusAction}>
      <input type="hidden" name="profileId" value={profileId} />
      <input type="hidden" name="accountStatus" value={status} />
      <SubmitButton
        pendingLabel="Memproses..."
        variant={variant}
        size="sm"
        className="h-8 w-[112px] rounded-full text-xs"
      >
        {label}
      </SubmitButton>
    </form>
  );
}

function EmptyAdminState({ title }: { title: string }) {
  return (
    <div className="p-12 text-center text-sm text-muted-foreground">
      {title}
    </div>
  );
}
