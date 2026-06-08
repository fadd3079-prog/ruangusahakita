import type { ReactNode } from "react";
import { FileUp, Info, Save, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createOrUpdateCampaignBrief } from "@/features/cart/actions/cart-actions";
import type {
  CheckoutBriefData,
  CheckoutUmkmData,
} from "@/features/cart/data/cart-queries";

type CampaignBriefFormProps = {
  brief: CheckoutBriefData | null;
  saved?: boolean;
  umkm: CheckoutUmkmData | null;
};

export function CampaignBriefForm({
  brief,
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
      <div className="border-b border-border/70 bg-[linear-gradient(135deg,var(--surface-elevated),var(--surface-soft))] p-5 sm:p-6">
        <div className="flex items-start gap-4">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Sparkles className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-primary">Brief Campaign</p>
            <h2
              id="campaign-brief-form-title"
              className="mt-2 text-2xl font-semibold tracking-tight text-foreground"
            >
              Lengkapi arahan konten untuk kreator
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              Simpan arahan campaign agar kreator memahami tujuan promosi,
              target audiens, gaya konten, dan referensi sejak awal.
            </p>
          </div>
        </div>
      </div>

      <form action={createOrUpdateCampaignBrief} className="space-y-6 p-5 sm:p-6">
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
          description="Tambahkan deadline, arahan khusus, dan placeholder aset campaign."
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

          <div>
            <p className="text-sm font-medium leading-none text-foreground">
              Upload aset placeholder
            </p>
            <div className="mt-2 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <FileUp className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Aset campaign akan ditambahkan pada tahap integrasi storage.
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Untuk sementara, tuliskan tautan aset atau referensi pada
                    catatan tambahan sampai integrasi storage tersedia.
                  </p>
                </div>
              </div>
            </div>
          </div>
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
          <Button type="submit" size="lg" className="h-11 px-5">
            Simpan Brief Campaign
            <Save aria-hidden="true" />
          </Button>
        </div>
      </form>
    </section>
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
