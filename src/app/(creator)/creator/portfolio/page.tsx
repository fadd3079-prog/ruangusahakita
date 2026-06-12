import type { Metadata } from "next";
import {
  ExternalLink,
  Image as ImageIcon,
  PlusCircle,
  Save,
  Trash2,
  Upload,
} from "lucide-react";

import { FileDropzone } from "@/components/common/file-dropzone";
import { SubmitButton } from "@/components/common/submit-button";
import { PageContainer } from "@/components/layout/page-container";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  createCreatorPortfolioAction,
  deleteCreatorPortfolioAction,
  updateCreatorPortfolioAction,
} from "@/features/creator/portfolio/actions/creator-portfolio-actions";
import {
  getCurrentCreatorPortfolioData,
  type CreatorPortfolioCategory,
  type CreatorPortfolioItem,
} from "@/features/creator/portfolio/data/creator-portfolio-queries";

export const metadata: Metadata = {
  title: "Portofolio Saya — Ruang Usaha Kita",
  description: "Kelola portofolio karya terbaik Anda.",
};

type CreatorPortfolioPageProps = {
  searchParams: Promise<{
    created?: string;
    deleted?: string;
    error?: string;
    updated?: string;
  }>;
};

const errorMessages = {
  delete: "Portofolio belum bisa dihapus.",
  profile: "Profil kreator belum tersedia.",
  required: "Judul portofolio wajib diisi.",
  save: "Portofolio belum bisa disimpan.",
  thumbnail_required: "Pilih gambar portofolio terlebih dahulu.",
  thumbnail_size: "Ukuran gambar portofolio maksimal 5 MB.",
  thumbnail_type: "Gambar portofolio harus berupa JPG, PNG, atau WebP.",
  thumbnail_upload: "Gambar portofolio belum bisa diunggah ke storage.",
  unauthorized: "Akun ini tidak memiliki akses kreator aktif.",
};

function getErrorMessage(error?: string) {
  if (!error) {
    return null;
  }

  return errorMessages[error as keyof typeof errorMessages] ?? "Terjadi kendala pada portofolio.";
}

function getSuccessMessage(params: Awaited<CreatorPortfolioPageProps["searchParams"]>) {
  if (params.created) {
    return "Portofolio baru berhasil ditambahkan.";
  }

  if (params.updated) {
    return "Portofolio berhasil diperbarui.";
  }

  if (params.deleted) {
    return "Portofolio berhasil dihapus dari daftar aktif.";
  }

  return null;
}

export default async function CreatorPortfolioPage({
  searchParams,
}: CreatorPortfolioPageProps) {
  const [params, data] = await Promise.all([
    searchParams,
    getCurrentCreatorPortfolioData(),
  ]);
  const errorMessage = getErrorMessage(params.error);
  const successMessage = getSuccessMessage(params);

  return (
    <PageContainer>
      <div className="space-y-6 pb-10">
        <section className="rounded-[22px] border border-primary/15 bg-[linear-gradient(135deg,var(--brand-navy-950),var(--brand-teal-900))] p-6 text-white shadow-[0_20px_56px_rgba(12,41,73,0.16)] sm:p-7">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/70">
              Creator Portfolio
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              Portofolio Saya
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/72">
              Tampilkan karya terbaik agar UMKM cepat memahami gaya dan kualitas pekerjaan.
            </p>
          </div>
        </section>

        {successMessage ? (
          <Alert>
            <AlertTitle>Perubahan tersimpan</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        ) : null}

        {errorMessage ? (
          <Alert variant="destructive">
            <AlertTitle>Portofolio belum diproses</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        <section className="dashboard-surface p-5 sm:p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary">
              <PlusCircle className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                Tambah portofolio
              </h2>
              <p className="text-sm text-muted-foreground">
                Unggah gambar portofolio dan lengkapi link eksternal jika karya sudah tayang.
              </p>
            </div>
          </div>
          <PortfolioForm
            action={createCreatorPortfolioAction}
            categories={data.categories}
            submitLabel="Tambah Portofolio"
          />
        </section>

        {data.portfolios.length > 0 ? (
          <div className="grid gap-5 xl:grid-cols-2">
            {data.portfolios.map((item) => (
              <PortfolioEditor
                key={item.id}
                categories={data.categories}
                item={item}
              />
            ))}
          </div>
        ) : (
          <section className="dashboard-surface border-dashed p-12 text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-primary/10 text-primary">
              <ImageIcon className="size-8" aria-hidden="true" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
              Belum ada portofolio
            </h2>
            <p className="mx-auto mt-2 max-w-md text-muted-foreground">
              Tambahkan contoh hasil konten digital agar UMKM dapat melihat gaya kerja Anda.
            </p>
          </section>
        )}
      </div>
    </PageContainer>
  );
}

function PortfolioEditor({
  categories,
  item,
}: {
  categories: readonly CreatorPortfolioCategory[];
  item: CreatorPortfolioItem;
}) {
  const previewUrl = item.thumbnailPreviewUrl;

  return (
    <article className="marketplace-card overflow-hidden">
      <div className="grid gap-0 lg:grid-cols-[220px_1fr]">
        <div
          className="grid min-h-56 place-items-center bg-muted/50 bg-cover bg-center p-5 text-center text-muted-foreground"
          style={
            previewUrl
              ? { backgroundImage: `url(${previewUrl})` }
              : undefined
          }
        >
          {previewUrl ? null : (
            <div>
              <ImageIcon className="mx-auto size-10 opacity-40" />
              <p className="mt-3 text-sm">Belum ada gambar portofolio.</p>
            </div>
          )}
        </div>
        <div className="space-y-5 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.category?.name ?? "Kategori belum dipilih"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {item.is_featured ? (
                <Badge variant="secondary" className="rounded-lg">
                  Unggulan
                </Badge>
              ) : null}
              {item.external_url ? (
                <Button asChild size="sm" variant="outline" className="rounded-full">
                  <a href={item.external_url} target="_blank" rel="noreferrer">
                    <ExternalLink className="size-4" />
                    Buka
                  </a>
                </Button>
              ) : null}
            </div>
          </div>

          <PortfolioForm
            action={updateCreatorPortfolioAction}
            categories={categories}
            item={item}
            submitLabel="Simpan Perubahan"
          />

          <form action={deleteCreatorPortfolioAction}>
            <input type="hidden" name="portfolioId" value={item.id} />
            <SubmitButton
              pendingLabel="Menghapus..."
              variant="outline"
              className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
              icon={<Trash2 className="size-4" />}
            >
              Hapus dari portofolio aktif
            </SubmitButton>
          </form>
        </div>
      </div>
    </article>
  );
}

function PortfolioForm({
  action,
  categories,
  item,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  categories: readonly CreatorPortfolioCategory[];
  item?: CreatorPortfolioItem;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-5">
      {item ? <input type="hidden" name="portfolioId" value={item.id} /> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="title" label="Judul" required value={item?.title} />
        <div className="space-y-2">
          <Label htmlFor={item ? `category-${item.id}` : "categoryId"}>
            Kategori
          </Label>
          <select
            id={item ? `category-${item.id}` : "categoryId"}
            name="categoryId"
            defaultValue={item?.category_id ?? ""}
            className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Belum dipilih</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={item ? `description-${item.id}` : "description"}>
          Deskripsi
        </Label>
        <Textarea
          id={item ? `description-${item.id}` : "description"}
          name="description"
          defaultValue={item?.description ?? ""}
          className="min-h-24 resize-y"
        />
      </div>

      <div className="space-y-2">
        <FileDropzone
          id={item ? `thumbnailFile-${item.id}` : "thumbnailFile"}
          name="thumbnailFile"
          label="Seret gambar portofolio"
          description="JPG, PNG, atau WebP. Maksimal 5 MB."
          accept="image/jpeg,image/png,image/webp"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="clientType" label="Jenis klien" value={item?.client_type} />
        <Field id="mediaUrl" label="URL media" value={item?.media_url} />
        <Field id="externalUrl" label="URL eksternal" value={item?.external_url} />
        <Field id="sortOrder" label="Urutan" type="number" value={String(item?.sort_order ?? 0)} />
        <div className="space-y-2">
          <Label htmlFor={item ? `isFeatured-${item.id}` : "isFeatured"}>
            Status unggulan
          </Label>
          <select
            id={item ? `isFeatured-${item.id}` : "isFeatured"}
            name="isFeatured"
            defaultValue={item?.is_featured ? "true" : "false"}
            className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="false">Biasa</option>
            <option value="true">Unggulan</option>
          </select>
        </div>
      </div>

      <SubmitButton
        pendingLabel={item ? "Menyimpan..." : "Mengunggah..."}
        className="rounded-full"
        icon={item ? <Save className="size-4" /> : <Upload className="size-4" />}
      >
        {submitLabel}
      </SubmitButton>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  type = "text",
  value,
}: {
  id: string;
  label: string;
  required?: boolean;
  type?: string;
  value?: string | null;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        required={required}
        type={type}
        defaultValue={value ?? ""}
        className="h-11"
      />
    </div>
  );
}
