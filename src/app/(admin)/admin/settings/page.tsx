import type { Metadata } from "next";
import {
  BadgeDollarSign,
  Bell,
  BookOpen,
  CreditCard,
  Eye,
  History,
  LifeBuoy,
  MessageSquareWarning,
  Paintbrush,
  ShieldCheck,
} from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlatformFeeForm,
  PaymentSettingsDisplay,
  CatalogSettingsForm,
  ReviewSettingsForm,
  NotificationSettingsForm,
  ContactSettingsForm,
  AppearanceSettingsForm,
} from "@/features/admin/components/admin-settings-forms";
import {
  savePlatformFeeSettingsAction,
  saveCatalogSettingsAction,
  saveReviewSettingsAction,
  saveNotificationSettingsAction,
  saveContactSettingsAction,
  saveAppearanceSettingsAction,
} from "@/features/admin/actions/platform-settings-actions";
import {
  getAllPlatformSettings,
  extractSettingsValues,
  getSettingsAuditLog,
} from "@/features/admin/data/platform-settings-queries";
import { formatDate } from "@/lib/formatters/date";
import type { Json } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Pengaturan Platform — Ruang Usaha Kita",
  description: "Konfigurasi global platform Ruang Usaha Kita untuk admin.",
};

function getChangeSummary(metadata: Json): string {
  if (metadata && typeof metadata === "object" && !Array.isArray(metadata)) {
    const meta = metadata as Record<string, Json | undefined>;
    const count = typeof meta.count === "number" ? meta.count : 0;

    if (Array.isArray(meta.changes)) {
      const keys = meta.changes
        .map((c) => {
          if (c && typeof c === "object" && !Array.isArray(c)) {
            return (c as Record<string, Json | undefined>).key;
          }
          return null;
        })
        .filter(Boolean);

      if (keys.length > 0) {
        return `${count} setting diubah: ${keys.join(", ")}`;
      }
    }

    return `${count} setting diubah`;
  }

  return "Pengaturan diperbarui";
}

export default async function AdminSettingsPage() {
  const [rawSettings, auditLog] = await Promise.all([
    getAllPlatformSettings(),
    getSettingsAuditLog(),
  ]);

  const settings = extractSettingsValues(rawSettings);

  return (
    <PageContainer>
      <div className="space-y-6 pb-10">
        <header>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Pengaturan Platform
            </h1>
            <Badge variant="outline" className="rounded-lg border-primary/30 bg-primary/5 text-primary">
              <ShieldCheck className="mr-1 size-3" aria-hidden="true" />
              Admin
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Kelola konfigurasi global, biaya transaksi, katalog, notifikasi, dan tampilan platform Ruang Usaha Kita.
          </p>
        </header>

        <Tabs defaultValue="fee" className="w-full">
          <div className="overflow-x-auto -mx-1 px-1">
            <TabsList className="inline-flex h-auto flex-nowrap gap-1 bg-muted/50 p-1">
              <TabsTrigger value="fee" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
                <BadgeDollarSign className="size-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Biaya</span> Platform
              </TabsTrigger>
              <TabsTrigger value="payment" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
                <CreditCard className="size-3.5" aria-hidden="true" />
                Pembayaran
              </TabsTrigger>
              <TabsTrigger value="catalog" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
                <BookOpen className="size-3.5" aria-hidden="true" />
                Katalog
              </TabsTrigger>
              <TabsTrigger value="review" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
                <MessageSquareWarning className="size-3.5" aria-hidden="true" />
                Review
              </TabsTrigger>
              <TabsTrigger value="notification" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
                <Bell className="size-3.5" aria-hidden="true" />
                Notifikasi
              </TabsTrigger>
              <TabsTrigger value="contact" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
                <LifeBuoy className="size-3.5" aria-hidden="true" />
                Kontak
              </TabsTrigger>
              <TabsTrigger value="appearance" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
                <Paintbrush className="size-3.5" aria-hidden="true" />
                Tampilan
              </TabsTrigger>
              <TabsTrigger value="audit" className="gap-1.5 text-xs sm:text-sm whitespace-nowrap">
                <History className="size-3.5" aria-hidden="true" />
                Audit
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-5">
            <TabsContent value="fee">
              <SettingsSection
                title="Pengaturan Biaya Platform"
                description="Atur persentase komisi dan biaya admin yang berlaku untuk transaksi baru."
                icon={<BadgeDollarSign className="size-5 text-primary" aria-hidden="true" />}
              >
                <PlatformFeeForm action={savePlatformFeeSettingsAction} settings={settings} />
              </SettingsSection>
            </TabsContent>

            <TabsContent value="payment">
              <SettingsSection
                title="Pengaturan Pembayaran"
                description="Status dan konfigurasi metode pembayaran platform."
                icon={<CreditCard className="size-5 text-primary" aria-hidden="true" />}
              >
                <PaymentSettingsDisplay settings={settings} />
              </SettingsSection>
            </TabsContent>

            <TabsContent value="catalog">
              <SettingsSection
                title="Pengaturan Katalog"
                description="Atur default status layanan, visibility kreator, dan aturan tampilan katalog."
                icon={<BookOpen className="size-5 text-primary" aria-hidden="true" />}
              >
                <CatalogSettingsForm action={saveCatalogSettingsAction} settings={settings} />
              </SettingsSection>
            </TabsContent>

            <TabsContent value="review">
              <SettingsSection
                title="Pengaturan Review & Komplain"
                description="Atur moderasi review dan status default komplain."
                icon={<MessageSquareWarning className="size-5 text-primary" aria-hidden="true" />}
              >
                <ReviewSettingsForm action={saveReviewSettingsAction} settings={settings} />
              </SettingsSection>
            </TabsContent>

            <TabsContent value="notification">
              <SettingsSection
                title="Pengaturan Notifikasi"
                description="Aktifkan atau nonaktifkan notifikasi internal untuk setiap jenis event."
                icon={<Bell className="size-5 text-primary" aria-hidden="true" />}
              >
                <NotificationSettingsForm action={saveNotificationSettingsAction} settings={settings} />
              </SettingsSection>
            </TabsContent>

            <TabsContent value="contact">
              <SettingsSection
                title="Pengaturan Kontak & Bantuan"
                description="Kelola informasi kontak dan media sosial platform."
                icon={<LifeBuoy className="size-5 text-primary" aria-hidden="true" />}
              >
                <ContactSettingsForm action={saveContactSettingsAction} settings={settings} />
              </SettingsSection>
            </TabsContent>

            <TabsContent value="appearance">
              <SettingsSection
                title="Pengaturan Tampilan"
                description="Atur nama website, tagline, dan mode maintenance."
                icon={<Paintbrush className="size-5 text-primary" aria-hidden="true" />}
              >
                <AppearanceSettingsForm action={saveAppearanceSettingsAction} settings={settings} />
              </SettingsSection>
            </TabsContent>

            <TabsContent value="audit">
              <SettingsSection
                title="Riwayat Perubahan Pengaturan"
                description="Log perubahan pengaturan platform oleh admin."
                icon={<History className="size-5 text-primary" aria-hidden="true" />}
              >
                {auditLog.length > 0 ? (
                  <div className="space-y-3">
                    {auditLog.map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-lg border border-border/70 bg-background px-4 py-3"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground line-clamp-2">
                              {getChangeSummary(entry.metadata)}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              oleh {entry.actorName ?? entry.actorEmail ?? "Admin"}
                            </p>
                          </div>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {formatDate(entry.createdAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/20 px-5 py-8">
                    <Eye className="size-5 text-muted-foreground" aria-hidden="true" />
                    <p className="text-sm text-muted-foreground">
                      Belum ada riwayat perubahan pengaturan.
                    </p>
                  </div>
                )}
              </SettingsSection>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </PageContainer>
  );
}

type SettingsSectionProps = {
  children: React.ReactNode;
  description: string;
  icon: React.ReactNode;
  title: string;
};

function SettingsSection({ children, description, icon, title }: SettingsSectionProps) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/80 shadow-sm">
      <div className="px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          {icon}
          <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <Separator />
      <div className="px-5 py-5 sm:px-6">
        {children}
      </div>
    </div>
  );
}
