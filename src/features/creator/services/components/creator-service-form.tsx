import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Image as ImageIcon,
  Info,
  Save,
} from "lucide-react";

import { FileDropzone } from "@/components/common/file-dropzone";
import { SubmitButton } from "@/components/common/submit-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
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
import type {
  CreatorServiceCategory,
  CreatorServiceEditData,
  CreatorServiceTier,
} from "@/features/creator/services/data/creator-service-queries";
import { formatCurrency } from "@/lib/formatters/currency";

type CreatorServiceFormProps = {
  action: (formData: FormData) => Promise<void>;
  categories: readonly CreatorServiceCategory[];
  createIntentId?: string;
  description: string;
  error?: string;
  errorDetail?: string;
  service?: CreatorServiceEditData | null;
  submitLabel: string;
  success?: string;
  title: string;
};

type TierKey = CreatorServiceTier["tier_key"];

const tierKeys: readonly TierKey[] = ["basic", "medium", "premium"];

const tierLabels: Record<TierKey, string> = {
  basic: "Basic",
  medium: "Medium",
  premium: "Premium",
};

const tierDescriptions: Record<TierKey, string> = {
  basic: "Paket awal yang wajib tersedia untuk UMKM.",
  medium: "Paket menengah opsional untuk kebutuhan lebih lengkap.",
  premium: "Paket paling lengkap untuk campaign yang lebih serius.",
};

const briefRequirementOptions = [
  "nama usaha",
  "produk/jasa yang dipromosikan",
  "target audiens",
  "platform konten",
  "referensi konten",
  "catatan tambahan",
] as const;

const errorMessages = {
  addon_delete: "Add-on belum bisa dihapus.",
  addon_missing: "Data add-on tidak lengkap.",
  addon_not_found: "Add-on tidak ditemukan atau bukan bagian dari layanan ini.",
  addon_price: "Harga add-on tidak boleh negatif.",
  addon_required: "Nama add-on wajib diisi.",
  addon_save: "Add-on belum bisa disimpan.",
  addon_update: "Add-on belum bisa diperbarui.",
  category: "Kategori layanan tidak tersedia atau sudah tidak aktif.",
  delete: "Layanan belum bisa dihapus.",
  media_limit: "Maksimal 5 gambar katalog untuk satu layanan.",
  media_save: "Gambar sudah diunggah, tetapi belum bisa disimpan.",
  media_size: "Ukuran gambar maksimal 5 MB.",
  media_type: "Gambar katalog harus berupa JPG, PNG, atau WebP.",
  media_upload: "Gambar katalog belum bisa diunggah.",
  missing: "Data layanan tidak lengkap.",
  not_found: "Layanan tidak ditemukan atau bukan milik akun kreator ini.",
  price: "Harga paket aktif wajib lebih dari nol.",
  profile: "Profil kreator belum lengkap.",
  required: "Nama layanan, kategori, dan paket Basic wajib diisi.",
  save: "Layanan belum bisa disimpan. Coba lagi setelah data diperiksa.",
  scope: "Estimasi pengerjaan minimal 1 hari dan revisi tidak boleh negatif.",
  tier: "Paket harga belum berhasil disimpan.",
  tier_last_active: "Paket Basic wajib tetap aktif.",
  tier_not_found: "Paket harga tidak ditemukan.",
  tier_required: "Data paket harga belum lengkap.",
  tier_update: "Paket harga belum bisa diperbarui.",
  unauthorized: "Akun ini tidak memiliki akses kreator aktif.",
};

const successMessages = {
  addon_created: "Add-on berhasil ditambahkan.",
  addon_deleted: "Add-on berhasil dihapus.",
  addon_updated: "Add-on berhasil diperbarui.",
  tier_created: "Paket harga berhasil ditambahkan.",
  tier_toggled: "Status paket harga berhasil diperbarui.",
  tier_updated: "Paket harga berhasil diperbarui.",
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

function toTextareaValue(value: readonly string[] | null | undefined) {
  return value?.join("\n") ?? "";
}

function getTier(service: CreatorServiceEditData | null | undefined, key: TierKey) {
  return service?.tiersByKey[key] ?? null;
}

function getCoverMedia(service: CreatorServiceEditData | null | undefined) {
  return (
    service?.media.find((item) => item.is_cover) ??
    service?.media[0] ??
    null
  );
}

function getStartingPrice(service: CreatorServiceEditData | null | undefined) {
  const activePrices =
    service?.tiers
      .filter((tier) => tier.is_active)
      .map((tier) => Number(tier.price))
      .filter((price) => price > 0) ?? [];

  return activePrices.length > 0 ? Math.min(...activePrices) : 0;
}

export function CreatorServiceForm({
  action,
  categories,
  createIntentId,
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
  const servicePackage = service?.service ?? null;
  const hasCategories = categories.length > 0;
  const formId = servicePackage
    ? "creator-service-edit-form"
    : "creator-service-create-form";
  const coverMedia = getCoverMedia(service);
  const selectedRequirements =
    servicePackage?.requirements ??
    briefRequirementOptions;

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
          <p className="mt-2 max-w-3xl text-muted-foreground">{description}</p>
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
            Aktifkan kategori layanan terlebih dahulu sebelum membuat paket jasa digital.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <form id={formId} action={action} className="space-y-8">
          {servicePackage ? (
            <input type="hidden" name="serviceId" value={servicePackage.id} />
          ) : createIntentId ? (
            <input type="hidden" name="serviceId" value={createIntentId} />
          ) : null}

          <StepCard step="01" title="Info Layanan">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(220px,0.7fr)]">
              <div className="space-y-2">
                <Label htmlFor="title">Nama layanan</Label>
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
                <Label htmlFor="isActive">Status</Label>
                <select
                  id="isActive"
                  name="isActive"
                  defaultValue={servicePackage?.is_active === false ? "false" : "true"}
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="false">Draft</option>
                  <option value="true">Aktif</option>
                </select>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div className="space-y-2">
                <Label htmlFor="shortDescription">Deskripsi singkat</Label>
                <Textarea
                  id="shortDescription"
                  name="shortDescription"
                  defaultValue={servicePackage?.short_description ?? ""}
                  placeholder="Jelaskan manfaat utama layanan dalam 1-2 kalimat."
                  className="min-h-28 resize-y"
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
                    {hasCategories ? "Pilih kategori" : "Kategori belum tersedia"}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="space-y-2 pt-3">
                  <Label htmlFor="tags">Tag layanan</Label>
                  <Input
                    id="tags"
                    name="tags"
                    defaultValue={servicePackage?.tags?.join(", ") ?? ""}
                    placeholder="reels, kuliner, caption"
                    className="h-11"
                  />
                </div>
              </div>
            </div>
          </StepCard>

          <StepCard step="02" title="Paket Harga">
            <div className="grid gap-5 xl:grid-cols-3">
              {tierKeys.map((key) => (
                <TierCard
                  key={key}
                  tierKey={key}
                  tier={getTier(service, key)}
                />
              ))}
            </div>
          </StepCard>

          <StepCard step="03" title="Media Katalog">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
              <div>
                <div
                  className="grid aspect-[16/9] place-items-center overflow-hidden rounded-2xl border border-border/70 bg-muted/50 bg-cover bg-center"
                  style={
                    coverMedia?.image_url
                      ? { backgroundImage: `url("${coverMedia.image_url}")` }
                      : undefined
                  }
                >
                  {coverMedia?.image_url ? null : (
                    <div className="text-center text-muted-foreground">
                      <ImageIcon className="mx-auto size-10 opacity-45" />
                      <p className="mt-2 text-sm">Cover katalog belum tersedia</p>
                    </div>
                  )}
                </div>
                {service?.media.length ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {service.media.map((media) => (
                      <div
                        key={media.id}
                        className="group overflow-hidden rounded-2xl border border-border/70 bg-background"
                      >
                        <div
                          className="aspect-[16/10] bg-muted bg-cover bg-center"
                          style={{ backgroundImage: `url("${media.image_url}")` }}
                        />
                        <div className="space-y-2 p-3 text-sm">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="coverMediaId"
                              value={media.id}
                              defaultChecked={media.is_cover}
                              className="size-4 accent-primary"
                            />
                            Jadikan cover
                          </label>
                          <label className="flex items-center gap-2 text-muted-foreground">
                            <input
                              type="checkbox"
                              name="removeMediaIds"
                              value={media.id}
                              className="size-4 accent-destructive"
                            />
                            Hapus gambar
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="rounded-2xl border border-border/70 bg-muted/35 p-4">
                <h3 className="mt-3 font-semibold text-foreground">
                  Upload gambar katalog
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Gunakan 1-5 gambar WebP, JPG, atau PNG. Gambar pertama akan dipakai sebagai cover jika belum ada cover.
                </p>
                <FileDropzone
                  id="mediaFiles"
                  name="mediaFiles"
                  label="Seret gambar katalog"
                  description="Klik atau drag gambar WebP, JPG, atau PNG. Maksimal 5 gambar."
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  maxFiles={5}
                  className="mt-4"
                />
              </div>
            </div>
          </StepCard>

          <StepCard step="04" title="Kebutuhan Brief">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-2xl border border-border/70 bg-muted/35 p-4">
                <h3 className="font-semibold text-foreground">
                  Checklist data dari UMKM
                </h3>
                <div className="mt-4 grid gap-3">
                  {briefRequirementOptions.map((item) => (
                    <label key={item} className="flex items-center gap-3 text-sm">
                      <input
                        type="checkbox"
                        name="briefRequirements"
                        value={item}
                        defaultChecked={selectedRequirements.includes(item)}
                        className="size-4 accent-primary"
                      />
                      <span className="capitalize">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customBriefRequirements">Kebutuhan tambahan</Label>
                <Textarea
                  id="customBriefRequirements"
                  name="customBriefRequirements"
                  defaultValue={toTextareaValue(
                    servicePackage?.requirements?.filter(
                      (item) => !briefRequirementOptions.includes(item as (typeof briefRequirementOptions)[number]),
                    ) ?? [],
                  )}
                  placeholder="Tambahkan kebutuhan brief khusus, satu item per baris."
                  className="min-h-44 resize-y"
                />
              </div>
            </div>
          </StepCard>
        </form>

        <aside className="space-y-5">
          <Card className="sticky top-24 rounded-2xl border-primary/20 bg-primary/5 shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="text-lg text-brand-navy">Preview & Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="grid aspect-[16/9] place-items-center rounded-2xl bg-muted/50 bg-cover bg-center text-muted-foreground ring-1 ring-border"
                style={
                  coverMedia?.image_url
                    ? { backgroundImage: `url("${coverMedia.image_url}")` }
                    : undefined
                }
              >
                {coverMedia?.image_url ? null : (
                  <ImageIcon className="size-8 opacity-40" />
                )}
              </div>
              <div>
                <Badge variant={servicePackage?.is_active ? "default" : "secondary"} className="rounded-full">
                  {servicePackage?.is_active ? "Aktif" : "Draft"}
                </Badge>
                <h3 className="mt-3 line-clamp-2 text-lg font-semibold tracking-tight text-foreground">
                  {servicePackage?.title ?? "Nama layanan akan tampil di sini"}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {servicePackage?.short_description ??
                    "Isi informasi layanan agar UMKM memahami output, estimasi, dan revisi sejak awal."}
                </p>
              </div>
              <div className="rounded-2xl border border-border/70 bg-background p-4">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Mulai dari
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-brand-navy">
                  {formatCurrency(getStartingPrice(service))}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Basic wajib, Medium dan Premium opsional.
                </p>
              </div>
              <SubmitButton
                pendingLabel="Menyimpan..."
                form={formId}
                disabled={!hasCategories}
                className="h-11 w-full"
                icon={<Save className="size-4" />}
              >
                {submitLabel}
              </SubmitButton>
              <Button asChild variant="outline" className="h-11 w-full bg-background">
                <Link href="/creator/services">Batal</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

type StepCardProps = {
  children: ReactNode;
  step: string;
  title: string;
};

function StepCard({ children, step, title }: StepCardProps) {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95 shadow-[var(--shadow-soft)]">
      <CardHeader className="flex-row items-center gap-3 space-y-0">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
          {step}
        </span>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">{children}</CardContent>
    </Card>
  );
}

type TierCardProps = {
  tier: CreatorServiceTier | null;
  tierKey: TierKey;
};

function TierCard({ tier, tierKey }: TierCardProps) {
  const isBasic = tierKey === "basic";
  const activeByDefault = isBasic || Boolean(tier?.is_active);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border/70 bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Badge variant={isBasic ? "default" : "secondary"} className="rounded-full">
            {isBasic ? "Wajib" : "Opsional"}
          </Badge>
          <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
            {tierLabels[tierKey]}
          </h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {tierDescriptions[tierKey]}
          </p>
        </div>
        {!isBasic ? (
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              name={`${tierKey}Enabled`}
              value="true"
              defaultChecked={activeByDefault}
              className="size-4 accent-primary"
            />
            Aktif
          </label>
        ) : (
          <input type="hidden" name="basicEnabled" value="true" />
        )}
      </div>

      <div className="mt-5 space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`${tierKey}Name`}>Nama paket</Label>
          <Input
            id={`${tierKey}Name`}
            name={`${tierKey}Name`}
            required={isBasic}
            defaultValue={tier?.name ?? tierLabels[tierKey]}
            className="h-11"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
          <div className="space-y-2">
            <Label htmlFor={`${tierKey}Price`}>Harga</Label>
            <Input
              id={`${tierKey}Price`}
              name={`${tierKey}Price`}
              type="number"
              min="1"
              required={isBasic}
              defaultValue={tier?.price ?? ""}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${tierKey}EstimatedDays`}>Estimasi pengerjaan</Label>
            <Input
              id={`${tierKey}EstimatedDays`}
              name={`${tierKey}EstimatedDays`}
              type="number"
              min="1"
              required={isBasic}
              defaultValue={tier?.estimated_days ?? 3}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${tierKey}RevisionCount`}>Jumlah revisi</Label>
            <Input
              id={`${tierKey}RevisionCount`}
              name={`${tierKey}RevisionCount`}
              type="number"
              min="0"
              required={isBasic}
              defaultValue={tier?.revision_count ?? 1}
              className="h-11"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${tierKey}Description`}>Deskripsi paket</Label>
          <Textarea
            id={`${tierKey}Description`}
            name={`${tierKey}Description`}
            defaultValue={tier?.description ?? ""}
            placeholder="Jelaskan cakupan paket ini secara singkat."
            className="min-h-24 resize-y"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${tierKey}Deliverables`}>Output yang didapat</Label>
          <Textarea
            id={`${tierKey}Deliverables`}
            name={`${tierKey}Deliverables`}
            defaultValue={toTextareaValue(tier?.deliverables ?? null)}
            placeholder="Satu output per baris."
            className="min-h-28 resize-y"
          />
        </div>
      </div>

      <div className="mt-auto flex items-center gap-2 pt-5 text-sm text-muted-foreground">
        <CheckCircle2 className="size-4 text-primary" />
        <span>{activeByDefault ? "Siap dipakai" : "Tidak tampil sampai diaktifkan"}</span>
      </div>
    </div>
  );
}
