import { FileUp, Image as ImageIcon, Save } from "lucide-react";

import { FileDropzone } from "@/components/common/file-dropzone";
import { SubmitButton } from "@/components/common/submit-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createOrUpdateCampaignBrief } from "@/features/cart/actions/cart-actions";
import type {
  CheckoutBriefData,
  CheckoutUmkmData,
} from "@/features/cart/data/cart-queries";
import type { CheckoutSelection } from "@/features/checkout/lib/checkout-source";

type CampaignBriefFormProps = {
  brief: CheckoutBriefData | null;
  checkoutSelection?: CheckoutSelection;
  saved?: boolean;
  umkm: CheckoutUmkmData | null;
};

export function CampaignBriefForm({
  brief,
  checkoutSelection = { source: "cart" },
  saved = false,
  umkm,
}: CampaignBriefFormProps) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]">
      <div className="border-b border-border/70 px-5 py-4">
        <p className="text-sm font-semibold text-primary">Brief Campaign</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          Arahan untuk kreator
        </h2>
      </div>

      <form action={createOrUpdateCampaignBrief} className="space-y-6 p-5">
        <input type="hidden" name="checkoutSource" value={checkoutSelection.source} />
        {checkoutSelection.source === "direct" ? (
          <>
            <input type="hidden" name="serviceId" value={checkoutSelection.serviceId} />
            {checkoutSelection.tierId ? (
              <input type="hidden" name="tierId" value={checkoutSelection.tierId} />
            ) : null}
            {checkoutSelection.addonIds.map((addonId) => (
              <input key={addonId} type="hidden" name="addonIds" value={addonId} />
            ))}
          </>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            id="businessName"
            label="Nama usaha"
            defaultValue={brief?.businessName ?? umkm?.businessName ?? ""}
            placeholder="Nama UMKM"
          />
          <TextField
            id="businessCategory"
            label="Kategori usaha"
            defaultValue={brief?.businessCategory ?? umkm?.businessCategory ?? ""}
            placeholder="Kuliner, fashion, jasa, dan lainnya"
          />
        </div>

        <TextField
          id="promotedFocus"
          label="Produk/jasa yang dipromosikan"
          defaultValue={brief?.promotedFocus ?? ""}
          placeholder="Fokus utama konten"
        />

        <TextAreaField
          id="campaignGoal"
          label="Tujuan campaign"
          defaultValue={brief?.campaignGoal ?? ""}
          placeholder="Contoh: memperkenalkan paket baru dan meningkatkan kunjungan profil"
          rows={4}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <TextAreaField
            id="targetAudience"
            label="Target audiens"
            defaultValue={brief?.targetAudience ?? umkm?.targetAudience ?? ""}
            placeholder="Siapa yang ingin dijangkau?"
            rows={3}
          />
          <TextAreaField
            id="contentPlatforms"
            label="Platform konten"
            defaultValue={joinValues(brief?.contentPlatforms)}
            placeholder="Instagram Reels, TikTok, YouTube Shorts"
            rows={3}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <TextAreaField
            id="contentStyle"
            label="Gaya konten"
            defaultValue={brief?.contentStyle ?? ""}
            placeholder="Natural, premium, edukatif, lucu"
            rows={3}
          />
          <TextField
            id="deadline"
            label="Deadline"
            type="date"
            defaultValue={brief?.deadline ?? ""}
          />
        </div>

        <TextAreaField
          id="referenceLinks"
          label="Referensi konten"
          defaultValue={joinLines(brief?.referenceLinks)}
          placeholder="Satu link per baris"
          rows={3}
        />

        <TextAreaField
          id="additionalNotes"
          label="Catatan tambahan"
          defaultValue={brief?.additionalNotes ?? ""}
          placeholder="Hal penting lain yang perlu diketahui kreator"
          rows={4}
        />

        <BriefAssetsField assets={brief?.assets ?? []} />

        {saved ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
            Brief campaign berhasil disimpan.
          </div>
        ) : null}

        <div className="flex justify-end border-t border-border/70 pt-5">
          <SubmitButton
            pendingLabel="Menyimpan..."
            className="h-11 bg-primary px-5 text-primary-foreground hover:bg-primary/90"
            icon={<Save className="size-4" aria-hidden="true" />}
          >
            Simpan Brief
          </SubmitButton>
        </div>
      </form>
    </section>
  );
}

function BriefAssetsField({
  assets,
}: {
  assets: CheckoutBriefData["assets"];
}) {
  return (
    <div className="space-y-3">
      <FileDropzone
        id="briefAssetFiles"
        name="briefAssetFiles"
        label="Upload aset pendukung"
        description="JPG, PNG, atau WebP. Preview tampil sebelum disimpan."
        accept="image/jpeg,image/png,image/webp"
        multiple
      />

      {assets.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="overflow-hidden rounded-xl border border-border/70 bg-background"
            >
              <div
                className="grid aspect-video place-items-center bg-muted/60 bg-cover bg-center text-muted-foreground"
                style={asset.url ? { backgroundImage: `url("${asset.url}")` } : undefined}
              >
                {asset.url ? null : (
                  <ImageIcon className="size-7 opacity-50" aria-hidden="true" />
                )}
              </div>
              <label className="flex items-start gap-2 p-3 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  name="removeBriefAssetIds"
                  value={asset.id}
                  className="mt-0.5 size-4 rounded border-border"
                />
                <span className="min-w-0">
                  <span className="block truncate font-medium text-foreground">
                    {asset.name}
                  </span>
                  Hapus saat menyimpan
                </span>
              </label>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <FileUp className="size-5 text-primary" aria-hidden="true" />
            Aset pendukung opsional.
          </div>
        </div>
      )}
    </div>
  );
}

type TextFieldProps = {
  defaultValue?: string;
  id: string;
  label: string;
  placeholder?: string;
  type?: "date" | "text";
};

function TextField({
  defaultValue,
  id,
  label,
  placeholder,
  type = "text",
}: TextFieldProps) {
  return (
    <label htmlFor={id} className="block space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <Input
        id={id}
        name={id}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-11 bg-background"
      />
    </label>
  );
}

type TextAreaFieldProps = {
  defaultValue?: string;
  id: string;
  label: string;
  placeholder?: string;
  rows: number;
};

function TextAreaField({
  defaultValue,
  id,
  label,
  placeholder,
  rows,
}: TextAreaFieldProps) {
  return (
    <label htmlFor={id} className="block space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <Textarea
        id={id}
        name={id}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={rows}
        className="min-h-0 bg-background"
      />
    </label>
  );
}

function joinValues(values: readonly string[] | undefined) {
  return values?.join(", ") ?? "";
}

function joinLines(values: readonly string[] | undefined) {
  return values?.join("\n") ?? "";
}
