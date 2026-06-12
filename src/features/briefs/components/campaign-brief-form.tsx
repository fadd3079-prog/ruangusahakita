import type { ReactNode } from "react";
import { FileUp, Image as ImageIcon, Info, Save, Sparkles } from "lucide-react";

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
  const businessName = brief?.businessName ?? umkm?.businessName ?? "";
  const businessCategory = brief?.businessCategory ?? umkm?.businessCategory ?? "";

  return (
    <section
      aria-labelledby="campaign-brief-form-title"
      className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-card)]"
    >
      <div className="border-b border-border/70 bg-[linear-gradient(135deg,var(--surface-elevated),var(--surface-soft))] p-4 sm:p-5">
        <div className="flex items-start gap-4">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">Brief Campaign</p>
            <h2
              id="campaign-brief-form-title"
              className="mt-1.5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
            >
              Lengkapi arahan konten untuk kreator
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Beri arahan singkat dan jelas untuk kreator.
            </p>
          </div>
        </div>
      </div>

      <form
        action={createOrUpdateCampaignBrief}
        className="space-y-6 p-4 sm:p-5"
      >
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
        <FormGroup
          title="Profil usaha"
          description="Bagian ini membantu kreator memahami konteks UMKM dan fokus promosi."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <TextField
              id="businessName"
              label="Nama usaha"
              defaultValue={businessName}
              placeholder="Contoh: Bakso Mas Adi"
            />
            <TextField
              id="businessCategory"
              label="Kategori usaha"
              defaultValue={businessCategory}
              placeholder="Contoh: Kuliner"
            />
          </div>

          <TextField
            id="promotedFocus"
            label="Produk/jasa yang dipromosikan"
            helperText="Tuliskan fokus utama yang perlu terlihat dalam konten."
            defaultValue={brief?.promotedFocus ?? ""}
            placeholder="Contoh: menu bakso urat dan promo paket keluarga"
          />
        </FormGroup>

        <FormGroup
          title="Arah campaign"
          description="Semakin jelas tujuan dan audiens, semakin mudah kreator memilih sudut konten."
        >
          <TextAreaField
            id="campaignGoal"
            label="Tujuan campaign"
            helperText="Gunakan satu tujuan utama agar arahan tidak melebar."
            defaultValue={brief?.campaignGoal ?? ""}
            placeholder="Jelaskan tujuan utama campaign secara singkat."
          />

          <TextAreaField
            id="targetAudience"
            label="Target audiens"
            defaultValue={brief?.targetAudience ?? umkm?.targetAudience ?? ""}
            placeholder="Contoh: pekerja kantor, keluarga muda"
          />
        </FormGroup>

        <FormGroup
          title="Format dan gaya konten"
          description="Tentukan kanal, rasa visual, dan referensi agar hasil konten punya arah yang konsisten."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <TextAreaField
              id="contentPlatforms"
              label="Platform konten"
              defaultValue={joinValues(brief?.contentPlatforms)}
              placeholder="Contoh: Instagram Reels, TikTok"
            />
            <TextAreaField
              id="contentStyle"
              label="Gaya konten"
              defaultValue={brief?.contentStyle ?? ""}
              placeholder="Contoh: hangat, natural, elegan"
            />
          </div>

          <TextAreaField
            id="referenceLinks"
            label="Referensi konten"
            helperText="Tambahkan tautan contoh konten, mood, atau gaya visual jika ada."
            defaultValue={joinLines(brief?.referenceLinks)}
            placeholder="Masukkan tautan referensi jika ada."
          />
        </FormGroup>

        <FormGroup
          title="Waktu, catatan, dan aset"
          description="Tambahkan deadline, arahan khusus, dan gambar pendukung campaign."
        >
          <TextField
            id="deadline"
            label="Deadline"
            helperText="Tanggal ini disimpan sebagai arahan waktu untuk kreator."
            type="date"
            defaultValue={brief?.deadline ?? ""}
          />

          <TextAreaField
            id="additionalNotes"
            label="Catatan tambahan"
            defaultValue={brief?.additionalNotes ?? ""}
            placeholder="Tambahkan arahan khusus untuk kreator."
          />

          <BriefAssetsField assets={brief?.assets ?? []} />
        </FormGroup>

        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <p className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
            <Info className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
            Brief disimpan sebagai draft checkout. Order, invoice, dan pembayaran
            belum dibuat pada fase ini.
          </p>
        </div>

        {saved ? (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm font-medium text-primary">
            Brief campaign berhasil disimpan sebagai draft checkout.
          </div>
        ) : null}

        <div className="flex justify-end">
          <SubmitButton
            pendingLabel="Menyimpan..."
            size="lg"
            className="h-11 px-5"
            icon={<Save aria-hidden="true" />}
          >
            Simpan Brief Campaign
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
        label="Seret gambar pendukung brief"
        description="JPG, PNG, atau WebP. Maksimal 5 MB per gambar."
        accept="image/jpeg,image/png,image/webp"
        multiple
      />

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
      )}
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
    <fieldset className="border-0 border-t border-border/70 pt-5 first:border-t-0 first:pt-0">
      <legend className="text-base font-semibold tracking-tight text-foreground">
        {title}
      </legend>
      <p className="mb-4 mt-1.5 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}

type TextFieldProps = {
  defaultValue?: string;
  helperText?: string;
  id: string;
  label: string;
  placeholder?: string;
  type?: "date" | "text";
};

function TextField({
  defaultValue,
  helperText,
  id,
  label,
  placeholder,
  type = "text",
}: TextFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium leading-none text-foreground">
        {label}
      </label>
      {helperText ? (
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{helperText}</p>
      ) : null}
      <Input
        id={id}
        name={id}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-2 h-11 bg-card"
      />
    </div>
  );
}

type TextAreaFieldProps = {
  defaultValue?: string;
  helperText?: string;
  id: string;
  label: string;
  placeholder?: string;
};

function TextAreaField({
  defaultValue,
  helperText,
  id,
  label,
  placeholder,
}: TextAreaFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium leading-none text-foreground">
        {label}
      </label>
      {helperText ? (
        <p className="mt-1 text-xs leading-5 text-muted-foreground">{helperText}</p>
      ) : null}
      <Textarea
        id={id}
        name={id}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-2 min-h-28 bg-card"
      />
    </div>
  );
}

function joinValues(values: readonly string[] | undefined) {
  return values?.join(", ") ?? "";
}

function joinLines(values: readonly string[] | undefined) {
  return values?.join("\n") ?? "";
}
