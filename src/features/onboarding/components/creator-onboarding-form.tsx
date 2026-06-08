"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  saveCreatorOnboardingAction,
  type OnboardingActionState,
} from "@/features/onboarding/actions/profile-onboarding-actions";
import type { CreatorOnboardingData } from "@/features/onboarding/data/onboarding-queries";

type CreatorOnboardingFormProps = {
  data: CreatorOnboardingData;
};

const initialState: OnboardingActionState = {};

const availabilityOptions = [
  { value: "available", label: "Tersedia" },
  { value: "limited", label: "Terbatas" },
  { value: "busy", label: "Sibuk" },
  { value: "unavailable", label: "Tidak tersedia" },
] as const;

export function CreatorOnboardingForm({ data }: CreatorOnboardingFormProps) {
  const [state, formAction, isPending] = useActionState(
    saveCreatorOnboardingAction,
    initialState,
  );
  const profile = data.profile;

  return (
    <form action={formAction} className="space-y-7">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Lengkapi profil kreator
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Profil yang lengkap membantu UMKM menilai niche, gaya kerja, dan kesiapan layanan digital Anda.
        </p>
      </div>

      {state.error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {state.error}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nama display kreator" htmlFor="displayName">
          <Input
            id="displayName"
            name="displayName"
            defaultValue={profile?.display_name ?? data.account.full_name}
            className="h-11"
            required
          />
        </Field>
        <Field label="Niche utama" htmlFor="niche">
          <Input
            id="niche"
            name="niche"
            defaultValue={profile?.niche ?? ""}
            placeholder="Contoh: Kuliner, Fashion, Brand Lokal"
            className="h-11"
            required
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

      <Field label="Bio singkat" htmlFor="bio">
        <Textarea
          id="bio"
          name="bio"
          defaultValue={profile?.bio ?? ""}
          className="min-h-28"
          required
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Ketersediaan kreator" htmlFor="availabilityStatus">
          <Select
            name="availabilityStatus"
            defaultValue={profile?.availability_status ?? "available"}
          >
            <SelectTrigger id="availabilityStatus" className="h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availabilityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Skill utama" htmlFor="skills">
          <Input
            id="skills"
            name="skills"
            defaultValue={(profile?.skills ?? []).join(", ")}
            placeholder="Contoh: Reels, Copywriting, Foto"
            className="h-11"
          />
        </Field>
        <Field label="Instagram" htmlFor="instagramUrl">
          <Input
            id="instagramUrl"
            name="instagramUrl"
            defaultValue={profile?.instagram_url ?? ""}
            placeholder="https://instagram.com/namakreator"
            className="h-11"
          />
        </Field>
        <Field label="TikTok" htmlFor="tiktokUrl">
          <Input
            id="tiktokUrl"
            name="tiktokUrl"
            defaultValue={profile?.tiktok_url ?? ""}
            placeholder="https://tiktok.com/@namakreator"
            className="h-11"
          />
        </Field>
      </div>

      <Field label="Link portofolio awal" htmlFor="portfolioUrl">
        <Input
          id="portfolioUrl"
          name="portfolioUrl"
          defaultValue={profile?.portfolio_url ?? ""}
          placeholder="Google Drive, Behance, Instagram, atau website pribadi"
          className="h-11"
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
