import type { Metadata } from "next";
import { Bell, Image as ImageIcon, Save, Shield, Trash2, Upload, User } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { SubmitButton } from "@/components/common/submit-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteCreatorAvatarAction,
  deleteCreatorBannerAction,
  updateCreatorProfileAction,
  uploadCreatorAvatarAction,
  uploadCreatorBannerAction,
} from "@/features/creator/profile/actions/creator-profile-actions";
import { getCurrentCreatorProfilePageData } from "@/features/creator/profile/data/creator-profile-queries";

export const metadata: Metadata = {
  title: "Pengaturan — Ruang Usaha Kita",
  description: "Atur preferensi akun dan profil kreator Anda.",
};

type CreatorSettingsPageProps = {
  searchParams: Promise<{
    error?: string;
    saved?: string;
  }>;
};

const errorMessages = {
  account: "Profil akun belum bisa diperbarui.",
  availability: "Status ketersediaan tidak valid.",
  avatar_account: "Avatar sudah diunggah, tetapi profil akun belum bisa diperbarui.",
  avatar_required: "Pilih file avatar terlebih dahulu.",
  avatar_save: "Avatar sudah diunggah, tetapi profil kreator belum bisa diperbarui.",
  avatar_size: "Ukuran avatar maksimal 2 MB.",
  avatar_type: "Avatar harus berupa JPG, PNG, atau WebP.",
  avatar_upload: "Avatar belum bisa diunggah ke storage.",
  banner_required: "Pilih file banner terlebih dahulu.",
  banner_save: "Banner belum bisa disimpan ke profil kreator.",
  banner_size: "Ukuran banner maksimal 5 MB.",
  banner_type: "Banner harus berupa JPG, PNG, atau WebP.",
  banner_upload: "Banner belum bisa diunggah ke storage.",
  profile: "Profil kreator belum tersedia.",
  required: "Nama tampilan wajib diisi.",
  save: "Profil kreator belum bisa disimpan.",
  unauthorized: "Akun ini tidak memiliki akses kreator aktif.",
};

function getErrorMessage(error?: string) {
  if (!error) {
    return null;
  }

  return errorMessages[error as keyof typeof errorMessages] ?? "Terjadi kendala saat menyimpan pengaturan.";
}

function toListValue(value: readonly string[] | null) {
  return value?.join(", ") ?? "";
}

function getInitials(value: string) {
  return value
    .split(" ")
    .map((part) => part.at(0))
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default async function CreatorSettingsPage({
  searchParams,
}: CreatorSettingsPageProps) {
  const [{ error, saved }, data] = await Promise.all([
    searchParams,
    getCurrentCreatorProfilePageData(),
  ]);
  const profile = data.profile;
  const account = data.account;
  const errorMessage = getErrorMessage(error);
  const displayName = profile?.display_name ?? account?.full_name ?? "Kreator";
  const avatarUrl = profile?.avatar_url ?? account?.avatar_url ?? null;
  const bannerUrl = profile?.banner_url ?? null;
  const initials = getInitials(displayName) || "KR";

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">
            Pengaturan Akun
          </h1>
          <p className="mt-2 text-muted-foreground">
            Kelola profil publik, kontak, dan ketersediaan kreator.
          </p>
        </div>

        {saved ? (
          <Alert>
            <AlertTitle>Pengaturan tersimpan</AlertTitle>
            <AlertDescription>
              Profil kreator Anda sudah diperbarui.
            </AlertDescription>
          </Alert>
        ) : null}

        {errorMessage ? (
          <Alert variant="destructive">
            <AlertTitle>Pengaturan belum tersimpan</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-2">
            <nav className="flex flex-col gap-1">
              <a
                href="#avatar"
                className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-semibold text-primary"
              >
                <User className="size-4" />
                Avatar
              </a>
              <a
                href="#profile"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <User className="size-4" />
                Profil Publik
              </a>
              <a
                href="#banner"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ImageIcon className="size-4" />
                Banner
              </a>
              <a
                href="#availability"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Shield className="size-4" />
                Ketersediaan
              </a>
              <a
                href="#notifications"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Bell className="size-4" />
                Notifikasi
              </a>
            </nav>
          </aside>

          <div className="space-y-8">
            <section
              id="avatar"
              className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className="grid size-24 shrink-0 place-items-center rounded-2xl bg-primary/10 bg-cover bg-center text-2xl font-semibold text-primary ring-1 ring-border"
                    style={
                      avatarUrl
                        ? { backgroundImage: `url("${avatarUrl}")` }
                        : undefined
                    }
                  >
                    {avatarUrl ? null : initials}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Avatar kreator</h2>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {avatarUrl
                        ? "Avatar ini tampil di profil kreator dan dashboard."
                        : "Belum ada avatar. Unggah gambar agar profil lebih mudah dikenali."}
                    </p>
                  </div>
                </div>
                <form action={uploadCreatorAvatarAction} className="grid gap-3 sm:min-w-72">
                  <input type="hidden" name="redirectTo" value="/creator/settings" />
                  <Label htmlFor="avatarFile">File avatar</Label>
                  <Input
                    id="avatarFile"
                    name="avatarFile"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="h-11"
                    required
                  />
                  <SubmitButton
                    pendingLabel="Mengunggah..."
                    className="rounded-full"
                    icon={<Upload className="size-4" />}
                  >
                    Unggah Avatar
                  </SubmitButton>
                </form>
              </div>
              {avatarUrl ? (
                <form action={deleteCreatorAvatarAction} className="mt-4 flex justify-end">
                  <input type="hidden" name="redirectTo" value="/creator/settings" />
                  <SubmitButton
                    pendingLabel="Menghapus..."
                    variant="outline"
                    className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                    icon={<Trash2 className="size-4" />}
                  >
                    Hapus Avatar
                  </SubmitButton>
                </form>
              ) : null}
            </section>

            <section
              id="banner"
              className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm"
            >
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
                <div>
                  <div
                    className="grid aspect-[16/6] min-h-44 place-items-center rounded-2xl bg-muted/50 bg-cover bg-center text-muted-foreground ring-1 ring-border"
                    style={
                      bannerUrl
                        ? { backgroundImage: `url("${bannerUrl}")` }
                        : undefined
                    }
                  >
                    {bannerUrl ? null : (
                      <div className="text-center">
                        <ImageIcon className="mx-auto size-9 opacity-50" />
                        <p className="mt-2 text-sm">Banner belum tersedia</p>
                      </div>
                    )}
                  </div>
                  <h2 className="mt-5 text-xl font-semibold">Banner profil</h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {bannerUrl
                      ? "Banner ini tampil pada profil publik kreator."
                      : "Unggah banner jika ingin memberi konteks visual pada profil publik."}
                  </p>
                </div>
                <div className="grid gap-3">
                  <form action={uploadCreatorBannerAction} className="grid gap-3">
                    <input type="hidden" name="redirectTo" value="/creator/settings" />
                    <Label htmlFor="bannerFile">File banner</Label>
                    <Input
                      id="bannerFile"
                      name="bannerFile"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="h-11"
                      required
                    />
                    <SubmitButton
                      pendingLabel="Mengunggah..."
                      className="rounded-full"
                      icon={<Upload className="size-4" />}
                    >
                      Unggah Banner
                    </SubmitButton>
                  </form>
                  {bannerUrl ? (
                    <form action={deleteCreatorBannerAction}>
                      <input type="hidden" name="redirectTo" value="/creator/settings" />
                      <SubmitButton
                        pendingLabel="Menghapus..."
                        variant="outline"
                        className="w-full rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                        icon={<Trash2 className="size-4" />}
                      >
                        Hapus Banner
                      </SubmitButton>
                    </form>
                  ) : null}
                </div>
              </div>
            </section>

            <form
              action={updateCreatorProfileAction}
              className="space-y-8"
            >
              <input type="hidden" name="redirectTo" value="/creator/settings" />

              <section
                id="profile"
                className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm"
              >
                <h2 className="mb-6 text-xl font-semibold">Profil Publik</h2>
                <div className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Nama tampilan</Label>
                      <Input
                        id="displayName"
                        name="displayName"
                        required
                        defaultValue={profile?.display_name ?? account?.full_name ?? ""}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nama akun</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        defaultValue={account?.full_name ?? ""}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="niche">Niche</Label>
                      <Input
                        id="niche"
                        name="niche"
                        defaultValue={profile?.niche ?? ""}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor WhatsApp</Label>
                      <Input
                        id="phone"
                        name="phone"
                        defaultValue={account?.phone ?? ""}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="city">Kota</Label>
                      <Input
                        id="city"
                        name="city"
                        defaultValue={profile?.city ?? ""}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="province">Provinsi</Label>
                      <Input
                        id="province"
                        name="province"
                        defaultValue={profile?.province ?? ""}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      defaultValue={profile?.bio ?? ""}
                      className="min-h-32 resize-y"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Keahlian</Label>
                    <Input
                      id="skills"
                      name="skills"
                      defaultValue={toListValue(profile?.skills ?? null)}
                      placeholder="Video pendek, desain feed, caption promosi"
                      className="h-11"
                    />
                  </div>
                </div>
              </section>

              <section
                id="availability"
                className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm"
              >
                <h2 className="mb-6 text-xl font-semibold">
                  Ketersediaan dan tautan publik
                </h2>
                <div className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="availabilityStatus">Status ketersediaan</Label>
                      <select
                        id="availabilityStatus"
                        name="availabilityStatus"
                        defaultValue={profile?.availability_status ?? "available"}
                        className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        <option value="available">Tersedia</option>
                        <option value="limited">Terbatas</option>
                        <option value="busy">Penuh Sementara</option>
                        <option value="unavailable">Belum Tersedia</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startingPrice">Harga mulai</Label>
                      <Input
                        id="startingPrice"
                        name="startingPrice"
                        type="number"
                        min="0"
                        defaultValue={profile?.starting_price ?? 0}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="responseTimeHours">Estimasi respons</Label>
                      <Input
                        id="responseTimeHours"
                        name="responseTimeHours"
                        type="number"
                        min="0"
                        defaultValue={profile?.response_time_hours ?? ""}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <UrlField id="instagramUrl" label="Instagram" value={profile?.instagram_url} />
                    <UrlField id="tiktokUrl" label="TikTok" value={profile?.tiktok_url} />
                    <UrlField id="youtubeUrl" label="YouTube" value={profile?.youtube_url} />
                    <UrlField id="portfolioUrl" label="Portofolio eksternal" value={profile?.portfolio_url} />
                  </div>

                  <SubmitButton
                    pendingLabel="Menyimpan..."
                    icon={<Save className="mr-2 size-4" />}
                  >
                    Simpan Profil
                  </SubmitButton>
                </div>
              </section>
            </form>

            <section
              id="notifications"
              className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm"
            >
              <h2 className="mb-3 text-xl font-semibold">Preferensi Notifikasi</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Pengaturan notifikasi detail belum tersedia. Notifikasi akun akan
                mengikuti event penting dari order masuk, revisi, hasil konten,
                dan pembayaran.
              </p>
            </section>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

function UrlField({
  id,
  label,
  value,
}: {
  id: string;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} name={id} defaultValue={value ?? ""} className="h-11" />
    </div>
  );
}
