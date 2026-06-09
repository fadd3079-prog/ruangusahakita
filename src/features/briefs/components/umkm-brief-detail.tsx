import Link from "next/link";
import type { ReactNode } from "react";
import {
  CalendarDays,
  ExternalLink,
  FileText,
  FileUp,
  Image as ImageIcon,
  LockKeyhole,
  Save,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateUmkmBrief } from "@/features/briefs/actions/brief-actions";
import type { UmkmBriefDetail } from "@/features/briefs/data/brief-queries";
import { formatDate } from "@/lib/formatters/date";
import { cn } from "@/lib/utils";

const briefStatusLabels: Record<string, string> = {
  draft: "Draft",
  linked_to_order: "Aktif di Pesanan",
  submitted: "Diajukan",
};

const briefStatusClasses: Record<string, string> = {
  draft: "border-muted-foreground text-muted-foreground bg-muted",
  linked_to_order: "border-primary text-primary bg-primary/10",
  submitted: "border-amber-500/30 text-amber-700 bg-amber-500/10",
};

type UmkmBriefDetailProps = {
  brief: UmkmBriefDetail;
  error?: string;
  updated?: boolean;
};

export function UmkmBriefDetailView({
  brief,
  error,
  updated = false,
}: UmkmBriefDetailProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-card)]">
        <div className="border-b border-border/70 bg-[linear-gradient(135deg,var(--brand-navy),var(--brand-teal-dark))] p-5 text-primary-foreground sm:p-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <Badge
                variant="outline"
                className="border-white/25 bg-white/10 text-white"
              >
                {briefStatusLabels[brief.status] ?? brief.status}
              </Badge>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                {brief.promotedFocus}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
                {brief.businessName} · {brief.businessCategory ?? "Kategori belum diisi"}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm text-white/85">
              <CalendarDays className="size-4" aria-hidden="true" />
              {brief.deadline ? formatDate(brief.deadline) : "Deadline belum tersedia"}
            </div>
          </div>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          {updated ? (
            <Alert className="border-primary/20 bg-primary/5 text-primary">
              <AlertTitle>Brief campaign tersimpan</AlertTitle>
              <AlertDescription>
                Perubahan draft brief sudah disimpan untuk checkout berikutnya.
              </AlertDescription>
            </Alert>
          ) : null}

          {error ? <BriefErrorAlert error={error} /> : null}

          {brief.isEditable ? (
            <BriefEditForm brief={brief} />
          ) : (
            <BriefReadOnlyContent brief={brief} />
          )}
        </div>
      </section>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]">
          <div className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
            {brief.isEditable ? (
              <FileText className="size-5" aria-hidden="true" />
            ) : (
              <LockKeyhole className="size-5" aria-hidden="true" />
            )}
          </div>
          <h2 className="mt-4 text-lg font-semibold tracking-tight text-foreground">
            {brief.isEditable ? "Draft masih bisa diedit" : "Brief sudah terkunci"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {brief.isEditable
              ? "Perbarui arahan sebelum membuat pesanan agar kreator menerima konteks yang jelas."
              : "Brief yang sudah masuk pesanan disimpan sebagai konteks kerja kreator."}
          </p>
          {brief.order ? (
            <Button asChild variant="outline" className="mt-5 w-full bg-background">
              <Link href={`/umkm/orders/${brief.order.id}`}>
                Lihat Pesanan
                <ExternalLink className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline" className="mt-5 w-full bg-background">
              <Link href="/umkm/checkout">Lanjut Checkout</Link>
            </Button>
          )}
        </section>

        <section className="rounded-2xl border border-border/70 bg-[linear-gradient(135deg,var(--surface-soft),var(--surface-elevated))] p-5">
          <h2 className="text-sm font-semibold text-foreground">Ringkasan status</h2>
          <div className="mt-4 space-y-3 text-sm">
            <SummaryRow
              label="Status brief"
              value={briefStatusLabels[brief.status] ?? brief.status}
            />
            <SummaryRow
              label="Terakhir diperbarui"
              value={formatDate(brief.updatedAt)}
            />
            <SummaryRow
              label="Pesanan"
              value={brief.order?.orderNumber ?? "Belum terhubung"}
            />
          </div>
        </section>
      </aside>
    </div>
  );
}

function BriefEditForm({ brief }: { brief: UmkmBriefDetail }) {
  return (
    <form action={updateUmkmBrief} encType="multipart/form-data" className="space-y-6">
      <input type="hidden" name="briefId" value={brief.id} />

      <FormGroup
        title="Profil usaha"
        description="Pastikan konteks UMKM dan fokus promosi mudah dipahami kreator."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            id="businessName"
            label="Nama usaha"
            defaultValue={brief.businessName}
            required
          />
          <TextField
            id="businessCategory"
            label="Kategori usaha"
            defaultValue={brief.businessCategory ?? ""}
            required
          />
        </div>
        <TextField
          id="promotedFocus"
          label="Produk/jasa yang dipromosikan"
          defaultValue={brief.promotedFocus}
          required
        />
      </FormGroup>

      <FormGroup
        title="Arah campaign"
        description="Gunakan satu tujuan utama dan target audiens yang spesifik."
      >
        <TextAreaField
          id="campaignGoal"
          label="Tujuan campaign"
          defaultValue={brief.campaignGoal}
          required
        />
        <TextAreaField
          id="targetAudience"
          label="Target audiens"
          defaultValue={brief.targetAudience ?? ""}
        />
      </FormGroup>

      <FormGroup
        title="Format konten"
        description="Tentukan platform, gaya, dan referensi agar hasil konten lebih terarah."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextAreaField
            id="contentPlatforms"
            label="Platform konten"
            defaultValue={brief.contentPlatforms.join(", ")}
          />
          <TextAreaField
            id="contentStyle"
            label="Gaya konten"
            defaultValue={brief.contentStyle ?? ""}
          />
        </div>
        <TextAreaField
          id="referenceLinks"
          label="Referensi konten"
          defaultValue={brief.referenceLinks.join("\n")}
        />
      </FormGroup>

      <FormGroup
        title="Waktu dan catatan"
        description="Tambahkan deadline dan catatan yang membantu kreator menyiapkan hasil konten."
      >
        <TextField
          id="deadline"
          label="Deadline"
          type="date"
          defaultValue={brief.deadline ?? ""}
        />
        <TextAreaField
          id="additionalNotes"
          label="Catatan tambahan"
          defaultValue={brief.additionalNotes ?? ""}
        />
      </FormGroup>

      <FormGroup
        title="Gambar pendukung"
        description="Kelola gambar referensi kecil yang membantu kreator memahami konteks visual."
      >
        <BriefAssetsEditor assets={brief.assetFiles} />
      </FormGroup>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button asChild variant="outline" className="bg-background">
          <Link href="/umkm/briefs">Kembali</Link>
        </Button>
        <Button type="submit">
          Simpan Perubahan
          <Save className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}

function BriefReadOnlyContent({ brief }: { brief: UmkmBriefDetail }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-6 text-amber-900">
        Brief campaign ini sudah masuk ke alur pesanan sehingga tidak bisa diedit dari
        halaman draft.
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <DetailBlock label="Tujuan campaign" value={brief.campaignGoal} />
        <DetailBlock
          label="Target audiens"
          value={brief.targetAudience ?? "Belum diisi"}
        />
        <DetailBlock
          label="Platform konten"
          value={
            brief.contentPlatforms.length > 0
              ? brief.contentPlatforms.join(", ")
              : "Belum diisi"
          }
        />
        <DetailBlock
          label="Gaya konten"
          value={brief.contentStyle ?? "Belum diisi"}
        />
        <DetailBlock
          label="Referensi konten"
          value={
            brief.referenceLinks.length > 0
              ? brief.referenceLinks.join(", ")
              : "Belum diisi"
          }
        />
        <DetailBlock
          label="Catatan tambahan"
          value={brief.additionalNotes ?? "Belum diisi"}
        />
      </div>

      <BriefAssetsReadOnly brief={brief} />
    </div>
  );
}

function BriefErrorAlert({ error }: { error: string }) {
  return (
    <Alert variant="destructive">
      <AlertTitle>Brief belum tersimpan</AlertTitle>
      <AlertDescription>{getErrorMessage(error)}</AlertDescription>
    </Alert>
  );
}

function getErrorMessage(error: string) {
  if (error === "required") {
    return "Nama usaha, kategori usaha, fokus promosi, dan tujuan campaign wajib diisi.";
  }

  if (error === "locked") {
    return "Brief ini sudah terhubung ke pesanan dan tidak bisa diedit dari halaman draft.";
  }

  if (error === "date") {
    return "Format deadline tidak valid.";
  }

  if (error === "asset_size") {
    return "Gambar pendukung maksimal 5 MB per file.";
  }

  if (error === "asset_type") {
    return "Gambar pendukung harus berupa JPG, PNG, atau WebP.";
  }

  if (error === "asset_upload") {
    return "Gambar pendukung belum dapat diunggah. Coba lagi beberapa saat.";
  }

  return "Brief campaign gagal disimpan. Periksa kembali data lalu coba lagi.";
}

function BriefAssetsEditor({
  assets,
}: {
  assets: UmkmBriefDetail["assetFiles"];
}) {
  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="briefAssetFiles" className="text-sm font-medium leading-none text-foreground">
          Tambah gambar
        </label>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Unggah JPG, PNG, atau WebP. Maksimal 5 MB per gambar.
        </p>
        <Input
          id="briefAssetFiles"
          name="briefAssetFiles"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="mt-2 h-11 bg-card"
        />
      </div>

      {assets.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="overflow-hidden rounded-2xl border border-border/70 bg-card"
            >
              <div
                className="grid aspect-[16/9] place-items-center bg-muted/60 bg-cover bg-center text-muted-foreground"
                style={asset.url ? { backgroundImage: `url("${asset.url}")` } : undefined}
              >
                {asset.url ? null : (
                  <ImageIcon className="size-8 opacity-50" aria-hidden="true" />
                )}
              </div>
              <label className="flex items-start gap-2 p-3 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  name="removeBriefAssetIds"
                  value={asset.id}
                  className="mt-0.5 size-4 rounded border-border"
                />
                <span>
                  <span className="block font-medium text-foreground">{asset.name}</span>
                  Hapus saat menyimpan
                </span>
              </label>
            </div>
          ))}
        </div>
      ) : (
        <BriefAssetsEmptyState />
      )}
    </div>
  );
}

function BriefAssetsReadOnly({ brief }: { brief: UmkmBriefDetail }) {
  if (brief.assetFiles.length === 0 && brief.assetUrls.length === 0) {
    return (
      <DetailBlock
        label="Gambar pendukung"
        value="Belum ada gambar pendukung."
      />
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-foreground">Gambar pendukung</h2>
      {brief.assetFiles.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {brief.assetFiles.map((asset) => (
            <div
              key={asset.id}
              className="overflow-hidden rounded-2xl border border-border/70 bg-background"
            >
              <div
                className="grid aspect-[16/9] place-items-center bg-muted/60 bg-cover bg-center text-muted-foreground"
                style={asset.url ? { backgroundImage: `url("${asset.url}")` } : undefined}
              >
                {asset.url ? null : (
                  <ImageIcon className="size-8 opacity-50" aria-hidden="true" />
                )}
              </div>
              <p className="truncate p-3 text-sm font-medium text-foreground">
                {asset.name}
              </p>
            </div>
          ))}
        </div>
      ) : null}
      {brief.assetUrls.length > 0 ? (
        <div className="space-y-2 rounded-2xl border border-border/70 bg-background p-4">
          {brief.assetUrls.map((url) => (
            <Link
              key={url}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              <ExternalLink className="size-4" aria-hidden="true" />
              {url}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function BriefAssetsEmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
          <FileUp className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            Belum ada gambar pendukung.
          </p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Tambahkan gambar referensi jika kreator perlu melihat konteks visual.
          </p>
        </div>
      </div>
    </div>
  );
}

type FormGroupProps = {
  children: ReactNode;
  description: string;
  title: string;
};

function FormGroup({ children, description, title }: FormGroupProps) {
  return (
    <fieldset className="rounded-2xl border border-border/70 bg-background p-4 sm:p-5">
      <legend className="px-1 text-base font-semibold tracking-tight text-foreground">
        {title}
      </legend>
      <p className="mb-5 mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}

type TextFieldProps = {
  defaultValue?: string;
  id: string;
  label: string;
  required?: boolean;
  type?: "date" | "text";
};

function TextField({
  defaultValue,
  id,
  label,
  required = false,
  type = "text",
}: TextFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium leading-none text-foreground">
        {label}
      </label>
      <Input
        id={id}
        name={id}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="mt-2 h-11 bg-card"
      />
    </div>
  );
}

type TextAreaFieldProps = {
  defaultValue?: string;
  id: string;
  label: string;
  required?: boolean;
};

function TextAreaField({
  defaultValue,
  id,
  label,
  required = false,
}: TextAreaFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium leading-none text-foreground">
        {label}
      </label>
      <Textarea
        id={id}
        name={id}
        defaultValue={defaultValue}
        required={required}
        className="mt-2 min-h-28 bg-card"
      />
    </div>
  );
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background p-4">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-sm leading-6 text-foreground">{value}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value}</span>
    </div>
  );
}

export function BriefStatusBadge({ status }: { status: string }) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-md", briefStatusClasses[status] ?? "bg-muted")}
    >
      {briefStatusLabels[status] ?? status}
    </Badge>
  );
}
