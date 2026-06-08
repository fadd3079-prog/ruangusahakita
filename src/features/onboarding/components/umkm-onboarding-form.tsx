"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  saveUmkmOnboardingAction,
  type OnboardingActionState,
} from "@/features/onboarding/actions/profile-onboarding-actions";
import type { UmkmOnboardingData } from "@/features/onboarding/data/onboarding-queries";

type UmkmOnboardingFormProps = {
  data: UmkmOnboardingData;
};

const initialState: OnboardingActionState = {};

export function UmkmOnboardingForm({ data }: UmkmOnboardingFormProps) {
  const [state, formAction, isPending] = useActionState(
    saveUmkmOnboardingAction,
    initialState,
  );
  const profile = data.profile;

  return (
    <form action={formAction} className="space-y-7">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Lengkapi profil UMKM
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Data usaha membantu kreator memahami konteks campaign sebelum membuat hasil konten.
        </p>
      </div>

      {state.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {state.error}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nama usaha" htmlFor="businessName">
          <Input
            id="businessName"
            name="businessName"
            defaultValue={profile?.business_name ?? ""}
            className="h-11"
            required
          />
        </Field>
        <Field label="Nama pemilik atau kontak utama" htmlFor="ownerName">
          <Input
            id="ownerName"
            name="ownerName"
            defaultValue={profile?.owner_name ?? data.account.full_name}
            className="h-11"
            required
          />
        </Field>
        <Field label="Kategori usaha" htmlFor="businessCategory">
          <Input
            id="businessCategory"
            name="businessCategory"
            defaultValue={profile?.business_category ?? ""}
            placeholder="Contoh: Kuliner, Fashion, Edukasi"
            className="h-11"
            required
          />
        </Field>
        <Field label="Nomor WhatsApp" htmlFor="whatsappNumber">
          <Input
            id="whatsappNumber"
            name="whatsappNumber"
            defaultValue={profile?.whatsapp_number ?? ""}
            className="h-11"
          />
        </Field>
        <Field label="Kota" htmlFor="city">
          <Input
            id="city"
            name="city"
            defaultValue={profile?.city ?? ""}
            className="h-11"
            required
          />
        </Field>
        <Field label="Provinsi" htmlFor="province">
          <Input
            id="province"
            name="province"
            defaultValue={profile?.province ?? ""}
            className="h-11"
            required
          />
        </Field>
      </div>

      <Field label="Deskripsi singkat usaha" htmlFor="businessDescription">
        <Textarea
          id="businessDescription"
          name="businessDescription"
          defaultValue={profile?.business_description ?? ""}
          className="min-h-28"
          required
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Instagram usaha" htmlFor="instagramUrl">
          <Input
            id="instagramUrl"
            name="instagramUrl"
            defaultValue={profile?.instagram_url ?? ""}
            placeholder="https://instagram.com/namausaha"
            className="h-11"
          />
        </Field>
        <Field label="Target audiens" htmlFor="targetAudience">
          <Input
            id="targetAudience"
            name="targetAudience"
            defaultValue={profile?.target_audience ?? ""}
            placeholder="Contoh: mahasiswa, keluarga muda"
            className="h-11"
          />
        </Field>
      </div>

      <Field label="Preferensi gaya konten" htmlFor="contentPreference">
        <Textarea
          id="contentPreference"
          name="contentPreference"
          defaultValue={profile?.content_preference ?? ""}
          placeholder="Contoh: natural, hangat, informatif, tidak terlalu formal"
          className="min-h-24"
        />
      </Field>

      <Button type="submit" disabled={isPending} className="h-11 w-full sm:w-auto">
        {isPending ? "Menyimpan..." : "Simpan dan buka dashboard"}
      </Button>
    </form>
  );
}

type FieldProps = {
  children: ReactNode;
  htmlFor: string;
  label: string;
};

function Field({ children, htmlFor, label }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
