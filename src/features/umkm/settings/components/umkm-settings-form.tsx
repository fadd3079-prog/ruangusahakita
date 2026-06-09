"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";
import { Image as ImageIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  saveUmkmSettingsAction,
  type UmkmSettingsActionState,
} from "@/features/umkm/settings/actions/umkm-settings-actions";
import type { UmkmOnboardingData } from "@/features/onboarding/data/onboarding-queries";

type UmkmSettingsFormProps = {
  data: UmkmOnboardingData;
  updated?: boolean;
};

const initialState: UmkmSettingsActionState = {};

export function UmkmSettingsForm({ data, updated }: UmkmSettingsFormProps) {
  const [state, formAction, isPending] = useActionState(
    saveUmkmSettingsAction,
    initialState,
  );
  const profile = data.profile;

  if (!profile) {
    return (
      <section className="rounded-2xl border border-dashed border-border bg-card p-8 text-center shadow-[var(--shadow-soft)]">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Profil belum lengkap
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          Lengkapi onboarding UMKM terlebih dahulu agar pengaturan profil dapat disimpan.
        </p>
      </section>
    );
  }

  return (
    <form action={formAction} encType="multipart/form-data" className="space-y-8">
      {state.error ? (
        <Alert variant="destructive">
          <AlertTitle>Pengaturan belum tersimpan</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}

      {updated ? (
        <Alert>
          <AlertTitle>Pengaturan tersimpan</AlertTitle>
          <AlertDescription>
            Profil UMKM dan preferensi konten sudah diperbarui.
          </AlertDescription>
        </Alert>
      ) : null}

      <section id="logo" className="rounded-2xl border border-border/70 bg-card p-6 shadow-[var(--shadow-soft)]">
        <div className="grid gap-5 md:grid-cols-[180px_1fr] md:items-center">
          <div
            className="grid aspect-square w-full max-w-44 place-items-center rounded-2xl bg-muted/60 bg-cover bg-center text-muted-foreground ring-1 ring-border"
            style={
              data.logoPreviewUrl
                ? { backgroundImage: `url("${data.logoPreviewUrl}")` }
                : undefined
            }
          >
            {data.logoPreviewUrl ? null : (
              <div className="text-center">
                <ImageIcon className="mx-auto size-8 opacity-50" aria-hidden="true" />
                <p className="mt-2 text-xs font-medium">Logo belum tersedia</p>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Logo UMKM</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {data.logoPreviewUrl
                  ? "Logo ini dipakai sebagai identitas visual pada area UMKM."
                  : "Unggah logo agar identitas UMKM tampil lebih jelas di dashboard dan brief campaign."}
              </p>
            </div>
            <Field label="File logo" htmlFor="logoFile">
              <Input
                id="logoFile"
                name="logoFile"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="h-11"
              />
            </Field>
            {data.logoPreviewUrl ? (
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  name="removeLogo"
                  className="size-4 rounded border-border"
                />
                Hapus logo saat menyimpan
              </label>
            ) : null}
          </div>
        </div>
      </section>

      <section id="business" className="rounded-2xl border border-border/70 bg-card p-6 shadow-[var(--shadow-soft)]">
        <h2 className="mb-6 text-xl font-semibold">Profil Bisnis</h2>
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nama usaha" htmlFor="businessName">
              <Input
                id="businessName"
                name="businessName"
                defaultValue={profile.business_name}
                className="h-11"
                required
              />
            </Field>
            <Field label="Kategori usaha" htmlFor="businessCategory">
              <Input
                id="businessCategory"
                name="businessCategory"
                defaultValue={profile.business_category ?? ""}
                className="h-11"
                required
              />
            </Field>
          </div>
          <Field label="Deskripsi usaha" htmlFor="businessDescription">
            <Textarea
              id="businessDescription"
              name="businessDescription"
              defaultValue={profile.business_description ?? ""}
              className="min-h-32 resize-y"
              required
            />
          </Field>
        </div>
      </section>

      <section id="contact" className="rounded-2xl border border-border/70 bg-card p-6 shadow-[var(--shadow-soft)]">
        <h2 className="mb-6 text-xl font-semibold">Informasi Kontak & Sosial</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nama pemilik/perwakilan" htmlFor="ownerName">
            <Input
              id="ownerName"
              name="ownerName"
              defaultValue={profile.owner_name ?? data.account.full_name}
              className="h-11"
              required
            />
          </Field>
          <Field label="Nomor WhatsApp" htmlFor="whatsappNumber">
            <Input
              id="whatsappNumber"
              name="whatsappNumber"
              defaultValue={profile.whatsapp_number ?? ""}
              className="h-11"
            />
          </Field>
          <Field label="Kota" htmlFor="city">
            <Input
              id="city"
              name="city"
              defaultValue={profile.city ?? ""}
              className="h-11"
              required
            />
          </Field>
          <Field label="Provinsi" htmlFor="province">
            <Input
              id="province"
              name="province"
              defaultValue={profile.province ?? ""}
              className="h-11"
              required
            />
          </Field>
          <Field label="Instagram usaha" htmlFor="instagramUrl">
            <Input
              id="instagramUrl"
              name="instagramUrl"
              defaultValue={profile.instagram_url ?? ""}
              className="h-11"
            />
          </Field>
          <Field label="TikTok usaha" htmlFor="tiktokUrl">
            <Input
              id="tiktokUrl"
              name="tiktokUrl"
              defaultValue={profile.tiktok_url ?? ""}
              className="h-11"
            />
          </Field>
        </div>
      </section>

      <section id="content" className="rounded-2xl border border-border/70 bg-card p-6 shadow-[var(--shadow-soft)]">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <h2 className="text-xl font-semibold">Preferensi Konten Default</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Data ini membantu kreator membaca konteks campaign UMKM lebih cepat.
            </p>
          </div>
          <Badge variant="secondary" className="w-fit rounded-full">
            Dipakai di brief campaign
          </Badge>
        </div>
        <div className="space-y-5">
          <Field label="Target audiens" htmlFor="targetAudience">
            <Input
              id="targetAudience"
              name="targetAudience"
              defaultValue={profile.target_audience ?? ""}
              className="h-11"
            />
          </Field>
          <Field label="Preferensi gaya konten" htmlFor="contentPreference">
            <Textarea
              id="contentPreference"
              name="contentPreference"
              defaultValue={profile.content_preference ?? ""}
              className="min-h-28 resize-y"
            />
          </Field>
        </div>
      </section>

      <div className="sticky bottom-4 z-10 rounded-2xl border border-border/70 bg-background/90 p-3 shadow-[var(--shadow-card)] backdrop-blur">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            Simpan perubahan agar dashboard, checkout, dan brief campaign memakai data terbaru.
          </p>
          <Button type="submit" disabled={isPending} className="h-11">
            {isPending ? "Menyimpan..." : "Simpan Pengaturan"}
          </Button>
        </div>
      </div>
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
