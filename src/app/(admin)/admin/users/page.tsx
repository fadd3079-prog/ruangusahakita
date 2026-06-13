import type { Metadata } from "next";
import { CheckCircle2, Search, UserCircle } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { SubmitButton } from "@/components/common/submit-button";
import { TruncateText } from "@/components/common/truncate-text";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
    q?: string;
    role?: string;
    sort?: string;
    status?: string;
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
  const filters = getFilters(params);
  const filteredUsers = users
    .filter((user) => {
      const searchable = `${user.full_name} ${user.email} ${user.role} ${user.account_status}`.toLowerCase();
      const matchesQuery = filters.query ? searchable.includes(filters.query) : true;
      const matchesRole = filters.role === "all" ? true : user.role === filters.role;
      const matchesStatus =
        filters.status === "all" ? true : user.account_status === filters.status;

      return matchesQuery && matchesRole && matchesStatus;
    })
    .toSorted((left, right) => {
      if (filters.sort === "name") {
        return left.full_name.localeCompare(right.full_name);
      }

      if (filters.sort === "role") {
        return left.role.localeCompare(right.role);
      }

      return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
    });

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

        <form className="grid gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-[var(--shadow-soft)] lg:grid-cols-[minmax(240px,1fr)_160px_180px_160px_auto] lg:items-end">
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase text-muted-foreground">
              Cari
            </span>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={filters.query}
                placeholder="Nama atau email"
                className="h-11 bg-card pl-9"
              />
            </div>
          </label>
          <SelectField
            label="Peran"
            name="role"
            options={[
              { label: "Semua peran", value: "all" },
              { label: "Admin", value: "admin" },
              { label: "Kreator", value: "creator" },
              { label: "UMKM", value: "umkm" },
            ]}
            value={filters.role}
          />
          <SelectField
            label="Status"
            name="status"
            options={[
              { label: "Semua status", value: "all" },
              { label: "Aktif", value: "active" },
              { label: "Tidak aktif", value: "inactive" },
              { label: "Menunggu", value: "pending_verification" },
              { label: "Dibatasi", value: "suspended" },
            ]}
            value={filters.status}
          />
          <SelectField
            label="Urutkan"
            name="sort"
            options={[
              { label: "Terbaru", value: "latest" },
              { label: "Nama", value: "name" },
              { label: "Peran", value: "role" },
            ]}
            value={filters.sort}
          />
          <div className="grid grid-cols-2 gap-2 lg:flex">
            <Button type="submit" className="h-11">
              Terapkan
            </Button>
            <Button asChild type="button" variant="outline" className="h-11">
              <a href="?">Reset</a>
            </Button>
          </div>
        </form>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]">
          {filteredUsers.length > 0 ? (
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
                {filteredUsers.map((user) => (
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
            <EmptyAdminState title="Belum ada pengguna yang sesuai" />
          )}
        </div>
      </div>
    </PageContainer>
  );
}

function getFilters(params: Awaited<AdminUsersPageProps["searchParams"]>) {
  const role = isRoleFilter(params.role) ? params.role : "all";
  const status = isStatusFilter(params.status) ? params.status : "all";
  const sort = isSortFilter(params.sort) ? params.sort : "latest";

  return {
    query: params.q?.trim().toLowerCase() ?? "",
    role,
    sort,
    status,
  };
}

function isRoleFilter(value?: string): value is "admin" | "creator" | "umkm" | "all" {
  return value === "admin" || value === "creator" || value === "umkm" || value === "all";
}

function isStatusFilter(
  value?: string,
): value is "active" | "inactive" | "pending_verification" | "suspended" | "all" {
  return (
    value === "active" ||
    value === "inactive" ||
    value === "pending_verification" ||
    value === "suspended" ||
    value === "all"
  );
}

function isSortFilter(value?: string): value is "latest" | "name" | "role" {
  return value === "latest" || value === "name" || value === "role";
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
