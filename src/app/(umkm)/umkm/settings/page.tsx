import type { Metadata } from "next";
import Link from "next/link";
import { Bell, Building2, PenTool, Phone, Shield } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getCurrentUmkmOnboardingData } from "@/features/onboarding/data/onboarding-queries";

export const metadata: Metadata = {
  title: "Pengaturan UMKM — Ruang Usaha Kita",
  description: "Atur profil bisnis, kontak, dan preferensi konten Anda.",
};

export default async function UmkmSettingsPage() {
  const data = await getCurrentUmkmOnboardingData();
  const profile = data.profile;

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">
              Pengaturan Akun
            </h1>
            <p className="mt-2 text-muted-foreground">
              Lihat informasi bisnis, kontak representatif, dan preferensi konten.
            </p>
          </div>
          <Button asChild>
            <Link href="/umkm/onboarding">Lengkapi atau perbarui profil</Link>
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-2">
            <nav className="flex flex-col gap-1">
              <a href="#business" className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-semibold text-primary">
                <Building2 className="size-4" />
                Profil Bisnis
              </a>
              <a href="#contact" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <Phone className="size-4" />
                Kontak & Sosial
              </a>
              <a href="#content" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <PenTool className="size-4" />
                Preferensi Konten
              </a>
              <a href="#notifications" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <Bell className="size-4" />
                Notifikasi
              </a>
              <a href="#security" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <Shield className="size-4" />
                Keamanan
              </a>
            </nav>
          </aside>

          <div className="space-y-8">
            {!profile ? (
              <section className="rounded-2xl border border-dashed border-border bg-card p-8 text-center shadow-[var(--shadow-soft)]">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  Profil belum lengkap
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Lengkapi profil UMKM agar brief campaign dan checkout lebih terarah.
                </p>
              </section>
            ) : (
              <>
                <section id="business" className="rounded-2xl border border-border/70 bg-card p-6 shadow-[var(--shadow-soft)]">
                  <h2 className="mb-6 text-xl font-semibold">Profil Bisnis</h2>
                  <div className="space-y-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                      <ReadOnlyField label="Nama usaha" value={profile.business_name} />
                      <ReadOnlyField label="Kategori usaha" value={profile.business_category} />
                    </div>
                    <div className="space-y-2">
                      <Label>Deskripsi usaha</Label>
                      <Textarea
                        readOnly
                        value={profile.business_description ?? ""}
                        className="min-h-32 resize-y"
                      />
                    </div>
                  </div>
                </section>

                <section id="contact" className="rounded-2xl border border-border/70 bg-card p-6 shadow-[var(--shadow-soft)]">
                  <h2 className="mb-6 text-xl font-semibold">Informasi Kontak & Sosial</h2>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <ReadOnlyField label="Nama pemilik/perwakilan" value={profile.owner_name} />
                    <ReadOnlyField label="Nomor WhatsApp" value={profile.whatsapp_number} />
                    <ReadOnlyField label="Kota" value={profile.city} />
                    <ReadOnlyField label="Provinsi" value={profile.province} />
                    <ReadOnlyField label="Instagram usaha" value={profile.instagram_url} />
                    <ReadOnlyField label="TikTok usaha" value={profile.tiktok_url} />
                  </div>
                </section>

                <section id="content" className="rounded-2xl border border-border/70 bg-card p-6 shadow-[var(--shadow-soft)]">
                  <h2 className="mb-6 text-xl font-semibold">Preferensi Konten Default</h2>
                  <div className="space-y-5">
                    <Badge variant="secondary" className="rounded-lg">
                      {profile.target_audience ?? "Target audiens belum diisi"}
                    </Badge>
                    <Badge variant="outline" className="rounded-lg">
                      {profile.content_preference ?? "Preferensi konten belum diisi"}
                    </Badge>
                  </div>
                </section>
              </>
            )}

            <section id="notifications" className="rounded-2xl border border-border/70 bg-card p-6 shadow-[var(--shadow-soft)]">
              <h2 className="mb-3 text-xl font-semibold">Preferensi Notifikasi</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Pengaturan notifikasi detail belum tersedia. Notifikasi akun akan mengikuti event penting dari pembayaran, status pesanan, hasil konten, revisi, dan review.
              </p>
            </section>

            <section id="security" className="rounded-2xl border border-border/70 bg-card p-6 shadow-[var(--shadow-soft)]">
              <h2 className="mb-3 text-xl font-semibold">Keamanan Akun</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Perubahan email dan password tetap dikelola melalui flow autentikasi Supabase.
              </p>
            </section>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

function ReadOnlyField({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input readOnly value={value ?? "Belum diisi"} className="h-11" />
    </div>
  );
}
