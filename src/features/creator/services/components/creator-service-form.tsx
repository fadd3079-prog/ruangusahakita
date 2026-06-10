import Link from "next/link";
import { ArrowLeft, Image as ImageIcon, Info, Save } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreatorServiceAddonManager } from "@/features/creator/services/components/creator-service-addon-manager";
import { CreatorServiceTierManager } from "@/features/creator/services/components/creator-service-tier-manager";
import type {
  CreatorServiceCategory,
  CreatorServiceEditData,
} from "@/features/creator/services/data/creator-service-queries";

type CreatorServiceFormProps = {
  action: (formData: FormData) => Promise<void>;
  categories: readonly CreatorServiceCategory[];
  description: string;
  error?: string;
  errorDetail?: string;
  service?: CreatorServiceEditData | null;
  submitLabel: string;
  success?: string;
  title: string;
};

const errorMessages = {
  addon_delete: "Add-on belum bisa dihapus.",
  addon_missing: "Data add-on tidak lengkap.",
  addon_not_found: "Add-on tidak ditemukan atau bukan bagian dari layanan ini.",
  addon_price: "Harga add-on tidak boleh negatif.",
  addon_required: "Nama add-on wajib diisi.",
  addon_save: "Add-on belum bisa disimpan.",
  addon_update: "Add-on belum bisa diperbarui.",
  cover_save: "Cover layanan sudah diunggah, tetapi belum bisa disimpan ke layanan.",
  cover_size: "Ukuran cover layanan maksimal 5 MB.",
  cover_type: "Cover layanan harus berupa JPG, PNG, atau WebP.",
  cover_upload: "Cover layanan belum bisa diunggah ke storage.",
  category: "Kategori layanan tidak tersedia atau sudah tidak aktif.",
  missing: "Data layanan tidak lengkap.",
  not_found: "Layanan tidak ditemukan atau bukan milik akun kreator ini.",
  price: "Harga layanan dan harga tier wajib lebih dari nol.",
  profile: "Profil kreator belum lengkap.",
  required: "Judul, kategori, dan nama tier wajib diisi.",
  save: "Layanan belum bisa disimpan. Coba lagi setelah data diperiksa.",
  scope: "Estimasi hari minimal 1 dan jumlah revisi tidak boleh negatif.",
  tier: "Layanan tersimpan, tetapi tier belum berhasil disimpan.",
  tier_last_active: "Minimal satu tier aktif harus tersedia untuk layanan ini.",
  tier_missing: "Data tier tidak lengkap.",
  tier_not_found: "Tier tidak ditemukan atau bukan bagian dari layanan ini.",
  tier_price: "Harga tier wajib lebih dari nol.",
  tier_required: "Nama tier wajib diisi.",
  tier_save: "Tier belum bisa ditambahkan.",
  tier_scope: "Estimasi tier minimal 1 hari dan jumlah revisi tidak boleh negatif.",
  tier_toggle: "Status tier belum bisa diperbarui.",
  tier_update: "Tier belum bisa diperbarui.",
  toggle: "Status layanan belum bisa diperbarui.",
  unauthorized: "Akun ini tidak memiliki akses kreator aktif.",
};

const successMessages = {
  addon_created: "Add-on berhasil ditambahkan.",
  addon_deleted: "Add-on berhasil dihapus.",
  addon_updated: "Add-on berhasil diperbarui.",
  tier_created: "Tier berhasil ditambahkan.",
  tier_toggled: "Status tier berhasil diperbarui.",
  tier_updated: "Tier berhasil diperbarui.",
};

function getErrorMessage(error?: string) {
  if (!error) {
    return null;
  }

  return errorMessages[error as keyof typeof errorMessages] ?? "Terjadi kendala saat menyimpan layanan.";
}

function getSuccessMessage(success?: string) {
  if (!success) {
    return null;
  }

  return successMessages[success as keyof typeof successMessages] ?? null;
}

function toTextareaValue(value: readonly string[] | null) {
  return value?.join("\n") ?? "";
}

export function CreatorServiceForm({
  action,
  categories,
  description,
  error,
  errorDetail,
  service,
  submitLabel,
  success,
  title,
}: CreatorServiceFormProps) {
  const errorMessage = getErrorMessage(error);
  const successMessage = getSuccessMessage(success);
  const primaryTier = service?.primaryTier ?? null;
  const servicePackage = service?.service ?? null;
  const hasCategories = categories.length > 0;
  const formId = servicePackage
    ? "creator-service-edit-form"
    : "creator-service-create-form";

  return (
    <div className="space-y-8 pb-10">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/creator/services">
            <ArrowLeft className="size-5" />
            <span className="sr-only">Kembali</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">
            {title}
          </h1>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </div>
      </div>

      {errorMessage ? (
        <Alert variant="destructive">
          <Info className="size-4" />
          <AlertTitle>Data belum bisa disimpan</AlertTitle>
          <AlertDescription>
            <span>{errorMessage}</span>
            {errorDetail ? (
              <span className="mt-2 block rounded-md bg-destructive/10 px-3 py-2 font-mono text-xs leading-5">
                {errorDetail}
              </span>
            ) : null}
          </AlertDescription>
        </Alert>
      ) : null}

      {successMessage ? (
        <Alert>
          <Info className="size-4" />
          <AlertTitle>Perubahan tersimpan</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      ) : null}

      {!hasCategories ? (
        <Alert variant="destructive">
          <Info className="size-4" />
          <AlertTitle>Kategori layanan belum tersedia</AlertTitle>
          <AlertDescription>
            Tambah atau aktifkan kategori layanan terlebih dahulu sebelum membuat
            paket jasa digital.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <form id={formId} action={action} className="space-y-8">
          {servicePackage ? (
            <input type="hidden" name="serviceId" value={servicePackage.id} />
          ) : null}
          {primaryTier ? (
            <input type="hidden" name="tierId" value={primaryTier.id} />
          ) : null}

          <Card className="rounded-2xl border-border/70 bg-card/95 shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="text-xl">Informasi dasar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Judul layanan</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  defaultValue={servicePackage?.title ?? ""}
                  placeholder="Contoh: Video Reels promosi kuliner"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">Kategori layanan</Label>
                <select
                  id="categoryId"
                  name="categoryId"
                  required
                  disabled={!hasCategories}
                  defaultValue={servicePackage?.category_id ?? ""}
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="" disabled>
                    {hasCategories
                      ? "Pilih kategori layanan"
                      : "Kategori layanan belum tersedia"}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Deskripsi singkat</Label>
                <Textarea
                  id="shortDescription"
                  name="shortDescription"
                  defaultValue={servicePackage?.short_description ?? ""}
                  placeholder="Ringkas manfaat layanan dalam satu atau dua kalimat."
                  className="min-h-24 resize-y"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi lengkap</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={servicePackage?.description ?? ""}
                  placeholder="Jelaskan proses, gaya kerja, dan ruang lingkup layanan digital."
                  className="min-h-32 resize-y"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="isActive">Status layanan</Label>
                  <select
                    id="isActive"
                    name="isActive"
                    defaultValue={servicePackage?.is_active === false ? "false" : "true"}
                    className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <option value="true">Aktif</option>
                    <option value="false">Tidak aktif</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tag layanan</Label>
                  <Input
                    id="tags"
                    name="tags"
                    defaultValue={servicePackage?.tags?.join(", ") ?? ""}
                    placeholder="reels, kuliner, campaign"
                    className="h-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/70 bg-card/95 shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="text-xl">Cover katalog</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div
                className="grid aspect-[16/9] place-items-center rounded-2xl bg-muted/50 bg-cover bg-center text-muted-foreground ring-1 ring-border"
                style={
                  servicePackage?.cover_image_url
                    ? { backgroundImage: `url("${servicePackage.cover_image_url}")` }
                    : undefined
                }
              >
                {servicePackage?.cover_image_url ? null : (
                  <div className="text-center">
                    <ImageIcon className="mx-auto size-10 opacity-50" />
                    <p className="mt-2 text-sm">Cover layanan belum tersedia</p>
                  </div>
                )}
              </div>
              <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="space-y-2">
                  <Label htmlFor="coverFile">File cover layanan</Label>
                  <Input
                    id="coverFile"
                    name="coverFile"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="h-11"
                  />
                  <p className="text-xs leading-5 text-muted-foreground">
                    Kosongkan jika tidak ingin mengganti cover saat menyimpan.
                  </p>
                </div>
                {servicePackage?.cover_image_url ? (
                  <label className="flex h-11 items-center gap-2 rounded-lg border border-border bg-background px-3 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      name="removeCoverImage"
                      value="true"
                      className="size-4 accent-primary"
                    />
                    Hapus cover
                  </label>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/70 bg-card/95 shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="text-xl">Output dan kebutuhan brief</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="deliverables">Output layanan digital</Label>
                <Textarea
                  id="deliverables"
                  name="deliverables"
                  defaultValue={toTextareaValue(servicePackage?.deliverables ?? null)}
                  placeholder="Pisahkan setiap output dengan baris baru."
                  className="min-h-28 resize-y"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Kebutuhan dari UMKM</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  defaultValue={toTextareaValue(servicePackage?.requirements ?? null)}
                  placeholder="Tuliskan data atau arahan yang perlu disiapkan dalam brief campaign."
                  className="min-h-28 resize-y"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="estimatedDays">Estimasi pengerjaan</Label>
                  <Input
                    id="estimatedDays"
                    name="estimatedDays"
                    type="number"
                    min="1"
                    required
                    defaultValue={servicePackage?.estimated_days ?? 3}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="revisionCount">Jumlah revisi</Label>
                  <Input
                    id="revisionCount"
                    name="revisionCount"
                    type="number"
                    min="0"
                    required
                    defaultValue={servicePackage?.revision_count ?? 1}
                    className="h-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/70 bg-card/95 shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="text-xl">Harga dan tier utama</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Harga dasar</Label>
                  <Input
                    id="basePrice"
                    name="basePrice"
                    type="number"
                    min="1"
                    required
                    defaultValue={servicePackage?.base_price ?? ""}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tierName">Nama tier</Label>
                  <Input
                    id="tierName"
                    name="tierName"
                    required
                    defaultValue={primaryTier?.name ?? "Basic"}
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tierDescription">Deskripsi tier</Label>
                <Textarea
                  id="tierDescription"
                  name="tierDescription"
                  defaultValue={primaryTier?.description ?? ""}
                  placeholder="Jelaskan cakupan tier ini secara singkat."
                  className="min-h-24 resize-y"
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="tierPrice">Harga tier</Label>
                  <Input
                    id="tierPrice"
                    name="tierPrice"
                    type="number"
                    min="1"
                    required
                    defaultValue={primaryTier?.price ?? servicePackage?.base_price ?? ""}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tierEstimatedDays">Estimasi tier</Label>
                  <Input
                    id="tierEstimatedDays"
                    name="tierEstimatedDays"
                    type="number"
                    min="1"
                    required
                    defaultValue={
                      primaryTier?.estimated_days ?? servicePackage?.estimated_days ?? 3
                    }
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tierRevisionCount">Revisi tier</Label>
                  <Input
                    id="tierRevisionCount"
                    name="tierRevisionCount"
                    type="number"
                    min="0"
                    required
                    defaultValue={
                      primaryTier?.revision_count ?? servicePackage?.revision_count ?? 1
                    }
                    className="h-11"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tierDeliverables">Output tier</Label>
                <Textarea
                  id="tierDeliverables"
                  name="tierDeliverables"
                  defaultValue={toTextareaValue(primaryTier?.deliverables ?? null)}
                  placeholder="Pisahkan output tier dengan baris baru."
                  className="min-h-24 resize-y"
                />
              </div>
            </CardContent>
          </Card>
        </form>

        <aside className="space-y-6">
          <Card className="sticky top-24 rounded-2xl border-primary/20 bg-primary/5 shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="text-lg text-brand-navy">Simpan layanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-muted-foreground">
                Pastikan harga, output, estimasi, dan revisi sudah sesuai sebelum
                layanan ditampilkan kepada UMKM.
              </p>
              <Button
                type="submit"
                form={formId}
                disabled={!hasCategories}
                className="h-11 w-full"
              >
                <Save className="size-4" />
                {submitLabel}
              </Button>
              <Button asChild variant="outline" className="h-11 w-full bg-background">
                <Link href="/creator/services">Batal</Link>
              </Button>
            </CardContent>
          </Card>

          {servicePackage ? (
            <>
              <CreatorServiceTierManager
                serviceId={servicePackage.id}
                tiers={service?.tiers ?? []}
              />
              <CreatorServiceAddonManager
                addons={service?.addons ?? []}
                serviceId={servicePackage.id}
              />
            </>
          ) : (
            <>
              <Card className="rounded-2xl border-border/70 bg-card/95 shadow-[var(--shadow-soft)]">
                <CardHeader>
                  <CardTitle className="text-lg">Tier paket jasa</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Simpan paket jasa terlebih dahulu, lalu kelola tier dari halaman
                    edit layanan.
                  </p>
                </CardContent>
              </Card>
              <Card className="rounded-2xl border-border/70 bg-card/95 shadow-[var(--shadow-soft)]">
                <CardHeader>
                  <CardTitle className="text-lg">Add-on layanan</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Simpan paket jasa terlebih dahulu, lalu tambahkan add-on dari
                    halaman edit layanan.
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
