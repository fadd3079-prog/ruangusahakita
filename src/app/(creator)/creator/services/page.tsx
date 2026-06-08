import type { Metadata } from "next";
import Link from "next/link";
import {
  BriefcaseBusiness,
  Clock,
  FileCheck2,
  Layers3,
  Pencil,
  PlusCircle,
  Power,
} from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toggleCreatorServiceStatusAction } from "@/features/creator/services/actions/creator-service-actions";
import { getCurrentCreatorServices } from "@/features/creator/services/data/creator-service-queries";
import { formatCurrency } from "@/lib/formatters/currency";

export const metadata: Metadata = {
  title: "Layanan Saya — Ruang Usaha Kita",
  description: "Kelola paket jasa digital Anda di Ruang Usaha Kita.",
};

type CreatorServicesPageProps = {
  searchParams: Promise<{
    created?: string;
    error?: string;
    toggled?: string;
    updated?: string;
  }>;
};

const errorMessages = {
  missing: "Data layanan tidak lengkap.",
  not_found: "Layanan tidak ditemukan atau bukan milik akun kreator ini.",
  profile: "Profil kreator belum lengkap.",
  save: "Layanan belum bisa disimpan.",
  toggle: "Status layanan belum bisa diperbarui.",
  unauthorized: "Akun ini tidak memiliki akses kreator aktif.",
};

function getErrorMessage(error?: string) {
  if (!error) {
    return null;
  }

  return errorMessages[error as keyof typeof errorMessages] ?? "Terjadi kendala pada layanan kreator.";
}

function getSuccessMessage(params: Awaited<CreatorServicesPageProps["searchParams"]>) {
  if (params.created) {
    return "Layanan baru berhasil dibuat.";
  }

  if (params.updated) {
    return "Layanan berhasil diperbarui.";
  }

  if (params.toggled) {
    return "Status layanan berhasil diperbarui.";
  }

  return null;
}

export default async function CreatorServicesPage({
  searchParams,
}: CreatorServicesPageProps) {
  const params = await searchParams;
  const services = await getCurrentCreatorServices();
  const activeServices = services.filter((item) => item.service.is_active);
  const errorMessage = getErrorMessage(params.error);
  const successMessage = getSuccessMessage(params);

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Creator Services
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-brand-navy">
              Layanan Saya
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Kelola paket jasa digital yang Anda tawarkan kepada UMKM melalui katalog.
            </p>
          </div>
          <Button asChild>
            <Link href="/creator/services/new">
              <PlusCircle className="size-4" />
              Tambah Paket Layanan
            </Link>
          </Button>
        </div>

        {errorMessage ? (
          <Alert variant="destructive">
            <AlertTitle>Layanan belum bisa diproses</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        {successMessage ? (
          <Alert>
            <AlertTitle>Perubahan tersimpan</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-3">
          <Card className="rounded-2xl border-border/70 bg-card/95 shadow-[var(--shadow-soft)]">
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">Total layanan</p>
              <p className="text-3xl font-semibold tracking-tight">
                {services.length}
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/70 bg-card/95 shadow-[var(--shadow-soft)]">
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">Layanan aktif</p>
              <p className="text-3xl font-semibold tracking-tight">
                {activeServices.length}
              </p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/70 bg-card/95 shadow-[var(--shadow-soft)]">
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">Status katalog</p>
              <p className="text-lg font-semibold tracking-tight">
                {activeServices.length > 0 ? "Siap ditampilkan" : "Perlu layanan aktif"}
              </p>
            </CardContent>
          </Card>
        </section>

        {services.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {services.map((item) => {
              const primaryTier = item.tiers[0] ?? null;

              return (
                <Card
                  key={item.service.id}
                  className="h-full rounded-2xl border-border/70 bg-card/95 shadow-[var(--shadow-soft)]"
                >
                  <CardHeader className="gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="mb-3 flex flex-wrap gap-2">
                          <Badge variant="secondary" className="rounded-lg">
                            {item.category?.name ?? "Layanan digital"}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              item.service.is_active
                                ? "rounded-lg border-primary/20 bg-primary/10 text-primary"
                                : "rounded-lg"
                            }
                          >
                            {item.service.is_active ? "Aktif" : "Tidak aktif"}
                          </Badge>
                        </div>
                        <CardTitle className="line-clamp-2 text-xl">
                          {item.service.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-5">
                    <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {item.service.short_description ??
                        "Paket jasa digital kreator untuk kebutuhan promosi UMKM."}
                    </p>

                    <div className="grid gap-2 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-2">
                        <Clock className="size-4 text-primary" aria-hidden="true" />
                        Estimasi {item.service.estimated_days} hari
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <FileCheck2 className="size-4 text-primary" aria-hidden="true" />
                        {item.service.revision_count} kali revisi
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Layers3 className="size-4 text-primary" aria-hidden="true" />
                        {item.tiers.length || 1} tier layanan
                      </span>
                    </div>

                    <div className="mt-auto rounded-2xl border border-border/70 bg-muted/30 p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        Mulai dari
                      </p>
                      <p className="mt-2 text-2xl font-semibold tracking-tight text-brand-navy">
                        {formatCurrency(Number(item.service.base_price))}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {primaryTier?.name ?? "Tier utama"} ·{" "}
                        {item.addons.length > 0
                          ? `${item.addons.length} add-on read-only`
                          : "Add-on belum diatur"}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="grid gap-3 bg-muted/30 sm:grid-cols-3">
                    <Button asChild className="sm:col-span-1">
                      <Link href={`/creator/services/${item.service.id}/edit`}>
                        <Pencil className="size-4" />
                        Edit
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="bg-background sm:col-span-1">
                      <Link href={`/layanan/${item.service.id}`}>Preview</Link>
                    </Button>
                    <form action={toggleCreatorServiceStatusAction}>
                      <input type="hidden" name="serviceId" value={item.service.id} />
                      <Button
                        type="submit"
                        variant="outline"
                        className="w-full bg-background"
                      >
                        <Power className="size-4" />
                        {item.service.is_active ? "Nonaktifkan" : "Aktifkan"}
                      </Button>
                    </form>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <section className="rounded-3xl border border-dashed border-border bg-card/95 p-10 text-center shadow-[var(--shadow-soft)]">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
              <BriefcaseBusiness className="size-8" aria-hidden="true" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
              Belum ada layanan aktif
            </h2>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              Buat paket jasa digital pertama agar UMKM dapat menemukan layanan
              Anda di katalog.
            </p>
            <Button asChild className="mt-6">
              <Link href="/creator/services/new">
                <PlusCircle className="size-4" />
                Tambah Layanan Pertama
              </Link>
            </Button>
          </section>
        )}
      </div>
    </PageContainer>
  );
}
