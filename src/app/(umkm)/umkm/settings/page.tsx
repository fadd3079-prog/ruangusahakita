import type { Metadata } from "next";
import { Bell, Building2, Image as ImageIcon, PenTool, Phone, Shield } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { getCurrentUmkmOnboardingData } from "@/features/onboarding/data/onboarding-queries";
import { UmkmSettingsForm } from "@/features/umkm/settings/components/umkm-settings-form";

export const metadata: Metadata = {
  title: "Pengaturan UMKM — Ruang Usaha Kita",
  description: "Atur profil bisnis, kontak, dan preferensi konten Anda.",
};

type UmkmSettingsPageProps = {
  searchParams: Promise<{
    updated?: string;
  }>;
};

export default async function UmkmSettingsPage({
  searchParams,
}: UmkmSettingsPageProps) {
  const [{ updated }, data] = await Promise.all([
    searchParams,
    getCurrentUmkmOnboardingData(),
  ]);

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <div className="flex flex-col justify-between gap-4 border-b border-border pb-6 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">
              Pengaturan Akun
            </h1>
            <p className="mt-2 text-muted-foreground">
              Perbarui informasi bisnis, kontak representatif, dan preferensi konten.
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-2">
            <nav className="flex flex-col gap-1">
              <a href="#logo" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <ImageIcon className="size-4" />
                Logo UMKM
              </a>
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
            <UmkmSettingsForm data={data} updated={updated === "1"} />

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
