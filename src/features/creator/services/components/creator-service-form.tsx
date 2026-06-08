import Link from "next/link";
import { ArrowLeft, Info, Save } from "lucide-react";

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
import type {
  CreatorServiceCategory,
  CreatorServiceEditData,
} from "@/features/creator/services/data/creator-service-queries";

type CreatorServiceFormProps = {
  action: (formData: FormData) => Promise<void>;
  categories: readonly CreatorServiceCategory[];
  description: string;
  error?: string;
  service?: CreatorServiceEditData | null;
  submitLabel: string;
  title: string;
};

const errorMessages = {
  missing: "Data layanan tidak lengkap.",
  not_found: "Layanan tidak ditemukan atau bukan milik akun kreator ini.",
  price: "Harga layanan dan harga tier wajib lebih dari nol.",
  profile: "Profil kreator belum lengkap.",
  required: "Judul, kategori, dan nama tier wajib diisi.",
  save: "Layanan belum bisa disimpan. Coba lagi setelah data diperiksa.",
  scope: "Estimasi hari minimal 1 dan jumlah revisi tidak boleh negatif.",
  tier: "Layanan tersimpan, tetapi tier belum berhasil disimpan.",
  toggle: "Status layanan belum bisa diperbarui.",
  unauthorized: "Akun ini tidak memiliki akses kreator aktif.",
};

function getErrorMessage(error?: string) {
  if (!error) {
    return null;
  }

  return errorMessages[error as keyof typeof errorMessages] ?? "Terjadi kendala saat menyimpan layanan.";
}

function toTextareaValue(value: readonly string[] | null) {
  return value?.join("\n") ?? "";
}

export function CreatorServiceForm({
  action,
  categories,
  description,
  error,
  service,
  submitLabel,
  title,
}: CreatorServiceFormProps) {
  const errorMessage = getErrorMessage(error);
  const primaryTier = service?.primaryTier ?? null;
  const servicePackage = service?.service ?? null;

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
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <form action={action} className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {servicePackage ? (
          <input type="hidden" name="serviceId" value={servicePackage.id} />
        ) : null}
        {primaryTier ? (
          <input type="hidden" name="tierId" value={primaryTier.id} />
        ) : null}

        <div className="space-y-8">
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
                  defaultValue={servicePackage?.category_id ?? ""}
                  className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="" disabled>
                    Pilih kategori layanan
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
        </div>

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
              <Button type="submit" className="h-11 w-full">
                <Save className="size-4" />
                {submitLabel}
              </Button>
              <Button asChild variant="outline" className="h-11 w-full bg-background">
                <Link href="/creator/services">Batal</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/70 bg-card/95 shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="text-lg">Add-on layanan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                Add-on akan dikelola pada fase berikutnya. Untuk saat ini, fokuskan
                layanan pada satu tier utama yang jelas.
              </p>
            </CardContent>
          </Card>
        </aside>
      </form>
    </div>
  );
}
