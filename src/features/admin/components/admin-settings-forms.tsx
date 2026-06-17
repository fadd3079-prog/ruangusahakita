"use client";

import { useTransition, useState, type FormEvent } from "react";
import {
  Calculator,
  CreditCard,
  Loader2,
  Save,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters/currency";
import type { ExtractedSettings } from "@/features/admin/data/platform-settings-queries";
import type { SaveSettingsResult } from "@/features/admin/actions/platform-settings-actions";

type ToggleProps = {
  defaultChecked: boolean;
  id: string;
  label: string;
  name: string;
};

function ToggleSwitch({ defaultChecked, id, label, name }: ToggleProps) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center justify-between gap-3 py-1.5">
      <span className="text-sm text-foreground">{label}</span>
      <input type="hidden" name={name} value={checked ? "true" : "false"} />
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => setChecked(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors ${checked ? "bg-primary" : "bg-muted-foreground/30"}`}
      >
        <span
          className={`pointer-events-none block size-5 rounded-full bg-white shadow-md transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
        />
      </button>
    </label>
  );
}

type SectionFormProps = {
  action: (formData: FormData) => Promise<SaveSettingsResult>;
  buttonLabel: string;
  children: React.ReactNode;
  id: string;
  successMessage: string;
};

function SectionForm({ action, buttonLabel, children, id, successMessage }: SectionFormProps) {
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await action(formData);
      if (result.success) {
        toast.success(successMessage);
      } else {
        toast.error(result.error ?? "Gagal menyimpan pengaturan.");
      }
    });
  }

  return (
    <form id={id} onSubmit={handleSubmit} className="space-y-5">
      {children}
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="mr-2 size-4" aria-hidden="true" />
          )}
          {isPending ? "Menyimpan..." : buttonLabel}
        </Button>
      </div>
    </form>
  );
}

type PlatformFeeFormProps = {
  action: (formData: FormData) => Promise<SaveSettingsResult>;
  settings: ExtractedSettings;
};

export function PlatformFeeForm({ action, settings }: PlatformFeeFormProps) {
  const [percentage, setPercentage] = useState(settings.platformFeePercentage);
  const [flatFee, setFlatFee] = useState(settings.adminFeeFlat);
  const [minFee, setMinFee] = useState(settings.adminFeeMin);
  const [maxFee, setMaxFee] = useState(settings.adminFeeMax);

  const sampleServicePrice = 500000;
  const computedCommission = Math.round((sampleServicePrice * percentage) / 100);
  const totalForUmkm = sampleServicePrice + flatFee;
  const creatorEarnings = sampleServicePrice - computedCommission;

  return (
    <SectionForm
      id="fee-settings-form"
      action={action}
      buttonLabel="Simpan Biaya"
      successMessage="Pengaturan biaya platform berhasil disimpan."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="platformFeePercentage">Persentase komisi platform (%)</Label>
          <Input
            id="platformFeePercentage"
            name="platformFeePercentage"
            type="number"
            min={0}
            max={100}
            step={0.1}
            value={percentage}
            onChange={(e) => setPercentage(Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            Komisi yang dipotong dari harga layanan kreator
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="adminFeeFlat">Biaya admin tetap per transaksi (Rp)</Label>
          <Input
            id="adminFeeFlat"
            name="adminFeeFlat"
            type="number"
            min={0}
            step={500}
            value={flatFee}
            onChange={(e) => setFlatFee(Number(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            Biaya tetap yang ditambahkan ke total pembayaran UMKM
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="adminFeeMin">Minimum biaya admin (Rp)</Label>
          <Input
            id="adminFeeMin"
            name="adminFeeMin"
            type="number"
            min={0}
            step={500}
            value={minFee}
            onChange={(e) => setMinFee(Number(e.target.value))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="adminFeeMax">Maksimum biaya admin (Rp)</Label>
          <Input
            id="adminFeeMax"
            name="adminFeeMax"
            type="number"
            min={0}
            step={500}
            value={maxFee}
            onChange={(e) => setMaxFee(Number(e.target.value))}
          />
        </div>
      </div>

      <Separator />

      <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
          <Calculator className="size-4 text-primary" aria-hidden="true" />
          Simulasi perhitungan biaya
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          Contoh: harga layanan {formatCurrency(sampleServicePrice)}
        </p>
        <div className="space-y-2 text-sm">
          <SimRow label="Harga layanan" value={formatCurrency(sampleServicePrice)} />
          <SimRow label="Biaya admin" value={formatCurrency(flatFee)} />
          <SimRow label={`Komisi platform (${percentage}%)`} value={formatCurrency(computedCommission)} />
          <Separator className="my-1.5" />
          <SimRow label="Total dibayar UMKM" value={formatCurrency(totalForUmkm)} bold />
          <SimRow label="Estimasi pendapatan kreator" value={formatCurrency(creatorEarnings)} bold />
        </div>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50/60 px-4 py-3 text-xs text-amber-900">
        <Shield className="mr-1.5 inline-block size-3.5 -translate-y-px" aria-hidden="true" />
        Perubahan biaya hanya berlaku untuk pesanan baru. Pesanan yang sudah dibuat tidak terpengaruh.
      </div>
    </SectionForm>
  );
}

function SimRow({ bold, label, value }: { bold?: boolean; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={bold ? "font-medium text-foreground" : "text-muted-foreground"}>{label}</span>
      <span className={`tabular-nums ${bold ? "font-semibold text-foreground" : "text-foreground"}`}>{value}</span>
    </div>
  );
}

type PaymentSettingsDisplayProps = {
  settings: ExtractedSettings;
};

export function PaymentSettingsDisplay({ settings }: PaymentSettingsDisplayProps) {
  const methodLabels: Record<string, string> = {
    card: "Kartu kredit/debit",
    ewallet: "E-Wallet",
    manual_transfer: "Transfer manual",
    qris_sandbox: "QRIS (Sandbox)",
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-foreground">
          <CreditCard className="size-4 text-primary" aria-hidden="true" />
          Status mode pembayaran
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="rounded-lg border-amber-200 bg-amber-50 text-amber-700">
            {settings.paymentMode === "sandbox" ? "Sandbox / Manual" : "Production"}
          </Badge>
          {settings.paymentMode === "sandbox" && (
            <span className="text-xs text-muted-foreground">Midtrans production belum aktif</span>
          )}
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-medium text-foreground">Metode pembayaran tersedia</h4>
        <div className="space-y-1.5">
          {settings.paymentMethodsAvailable.map((method) => (
            <div key={method} className="flex items-center gap-2 text-sm">
              <div className="size-2 rounded-full bg-emerald-500" />
              <span>{methodLabels[method] ?? method}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-sky-200 bg-sky-50/60 px-4 py-3 text-xs text-sky-900">
        Pengaturan gateway pembayaran production (Midtrans) belum diaktifkan.
        Saat ini sistem menggunakan mode sandbox dan transfer manual.
      </div>
    </div>
  );
}

type CatalogSettingsFormProps = {
  action: (formData: FormData) => Promise<SaveSettingsResult>;
  settings: ExtractedSettings;
};

export function CatalogSettingsForm({ action, settings }: CatalogSettingsFormProps) {
  return (
    <SectionForm
      id="catalog-settings-form"
      action={action}
      buttonLabel="Simpan Katalog"
      successMessage="Pengaturan katalog berhasil disimpan."
    >
      <div className="space-y-2">
        <Label htmlFor="defaultServiceStatus">Default status layanan baru</Label>
        <Select name="defaultServiceStatus" defaultValue={settings.defaultServiceStatus}>
          <SelectTrigger id="defaultServiceStatus">
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active (langsung tampil)</SelectItem>
            <SelectItem value="draft">Draft (perlu approval)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-1">
        <ToggleSwitch
          id="defaultCreatorVisibility"
          name="defaultCreatorVisibility"
          label="Default visibility kreator baru"
          defaultChecked={settings.defaultCreatorVisibility}
        />
        <ToggleSwitch
          id="catalogOnlyActiveCreators"
          name="catalogOnlyActiveCreators"
          label="Hanya tampilkan kreator aktif di katalog"
          defaultChecked={settings.catalogOnlyActiveCreators}
        />
        <ToggleSwitch
          id="catalogOnlyActiveServices"
          name="catalogOnlyActiveServices"
          label="Hanya tampilkan layanan aktif di katalog"
          defaultChecked={settings.catalogOnlyActiveServices}
        />
        <ToggleSwitch
          id="catalogOnlyVisibleReviews"
          name="catalogOnlyVisibleReviews"
          label="Hanya tampilkan review visible di katalog"
          defaultChecked={settings.catalogOnlyVisibleReviews}
        />
      </div>
    </SectionForm>
  );
}

type ReviewSettingsFormProps = {
  action: (formData: FormData) => Promise<SaveSettingsResult>;
  settings: ExtractedSettings;
};

export function ReviewSettingsForm({ action, settings }: ReviewSettingsFormProps) {
  return (
    <SectionForm
      id="review-settings-form"
      action={action}
      buttonLabel="Simpan Review"
      successMessage="Pengaturan review berhasil disimpan."
    >
      <ToggleSwitch
        id="reviewAutoVisible"
        name="reviewAutoVisible"
        label="Review otomatis tampil tanpa moderasi"
        defaultChecked={settings.reviewAutoVisible}
      />

      <div className="space-y-2">
        <Label htmlFor="reviewMinRatingHighlight">Rating minimum untuk highlight (1-5)</Label>
        <Input
          id="reviewMinRatingHighlight"
          name="reviewMinRatingHighlight"
          type="number"
          min={1}
          max={5}
          defaultValue={settings.reviewMinRatingHighlight}
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="complaintDefaultStatus">Status default komplain baru</Label>
        <Select name="complaintDefaultStatus" defaultValue={settings.complaintDefaultStatus}>
          <SelectTrigger id="complaintDefaultStatus">
            <SelectValue placeholder="Pilih status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="under_review">Under review</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-sky-200 bg-sky-50/60 px-4 py-3 text-xs text-sky-900">
        Perubahan moderasi review tidak menghapus review yang sudah ada.
        Admin tetap dapat menyembunyikan review melalui halaman komplain.
      </div>
    </SectionForm>
  );
}

type NotificationSettingsFormProps = {
  action: (formData: FormData) => Promise<SaveSettingsResult>;
  settings: ExtractedSettings;
};

export function NotificationSettingsForm({ action, settings }: NotificationSettingsFormProps) {
  return (
    <SectionForm
      id="notification-settings-form"
      action={action}
      buttonLabel="Simpan Notifikasi"
      successMessage="Pengaturan notifikasi berhasil disimpan."
    >
      <p className="text-sm text-muted-foreground">
        Aktifkan atau nonaktifkan notifikasi internal untuk setiap jenis event.
      </p>

      <div className="space-y-1">
        <ToggleSwitch id="notifOrderCreated" name="notifOrderCreated" label="Order dibuat" defaultChecked={settings.notifOrderCreated} />
        <ToggleSwitch id="notifPaymentPaid" name="notifPaymentPaid" label="Pembayaran berhasil" defaultChecked={settings.notifPaymentPaid} />
        <ToggleSwitch id="notifResultSubmitted" name="notifResultSubmitted" label="Hasil konten dikirim" defaultChecked={settings.notifResultSubmitted} />
        <ToggleSwitch id="notifRevisionRequested" name="notifRevisionRequested" label="Revisi diminta" defaultChecked={settings.notifRevisionRequested} />
        <ToggleSwitch id="notifReviewCreated" name="notifReviewCreated" label="Review dibuat" defaultChecked={settings.notifReviewCreated} />
        <ToggleSwitch id="notifComplaintCreated" name="notifComplaintCreated" label="Komplain dibuat" defaultChecked={settings.notifComplaintCreated} />
        <ToggleSwitch id="notifMessageNew" name="notifMessageNew" label="Pesan baru" defaultChecked={settings.notifMessageNew} />
      </div>

      <Separator />

      <div className="rounded-lg border border-slate-200 bg-slate-50/60 px-4 py-3 text-xs text-slate-600">
        Email notification custom saat ini tidak aktif. Forgot password menggunakan flow bawaan Supabase Auth.
      </div>
    </SectionForm>
  );
}

type ContactSettingsFormProps = {
  action: (formData: FormData) => Promise<SaveSettingsResult>;
  settings: ExtractedSettings;
};

export function ContactSettingsForm({ action, settings }: ContactSettingsFormProps) {
  return (
    <SectionForm
      id="contact-settings-form"
      action={action}
      buttonLabel="Simpan Kontak"
      successMessage="Pengaturan kontak berhasil disimpan."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="supportEmail">Email bantuan</Label>
          <Input
            id="supportEmail"
            name="supportEmail"
            type="email"
            defaultValue={settings.supportEmail}
            placeholder="bantuan@ruangusahakita.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supportWhatsapp">Nomor WhatsApp</Label>
          <Input
            id="supportWhatsapp"
            name="supportWhatsapp"
            type="text"
            defaultValue={settings.supportWhatsapp}
            placeholder="6281234567890"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="supportText">Teks bantuan singkat</Label>
        <Textarea
          id="supportText"
          name="supportText"
          defaultValue={settings.supportText}
          rows={3}
        />
      </div>

      <Separator />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="socialInstagram">Link Instagram</Label>
          <Input
            id="socialInstagram"
            name="socialInstagram"
            type="url"
            defaultValue={settings.socialInstagram}
            placeholder="https://instagram.com/..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="socialTiktok">Link TikTok</Label>
          <Input
            id="socialTiktok"
            name="socialTiktok"
            type="url"
            defaultValue={settings.socialTiktok}
            placeholder="https://tiktok.com/@..."
          />
        </div>
      </div>
    </SectionForm>
  );
}

type AppearanceSettingsFormProps = {
  action: (formData: FormData) => Promise<SaveSettingsResult>;
  settings: ExtractedSettings;
};

export function AppearanceSettingsForm({ action, settings }: AppearanceSettingsFormProps) {
  return (
    <SectionForm
      id="appearance-settings-form"
      action={action}
      buttonLabel="Simpan Tampilan"
      successMessage="Pengaturan tampilan berhasil disimpan."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="siteName">Nama website</Label>
          <Input
            id="siteName"
            name="siteName"
            type="text"
            defaultValue={settings.siteName}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="siteUrl">URL website</Label>
          <Input
            id="siteUrl"
            name="siteUrl"
            type="url"
            defaultValue={settings.siteUrl}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="siteTagline">Tagline pendek</Label>
        <Input
          id="siteTagline"
          name="siteTagline"
          type="text"
          defaultValue={settings.siteTagline}
        />
      </div>

      <Separator />

      <ToggleSwitch
        id="maintenanceMode"
        name="maintenanceMode"
        label="Mode maintenance"
        defaultChecked={settings.maintenanceMode}
      />

      <div className="space-y-2">
        <Label htmlFor="maintenanceMessage">Pesan maintenance</Label>
        <Textarea
          id="maintenanceMessage"
          name="maintenanceMessage"
          defaultValue={settings.maintenanceMessage}
          rows={2}
        />
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50/60 px-4 py-3 text-xs text-amber-900">
        <Shield className="mr-1.5 inline-block size-3.5 -translate-y-px" aria-hidden="true" />
        Mode maintenance tidak mengunci akses admin. Hanya pengguna non-admin yang terpengaruh jika fitur ini diimplementasikan di middleware.
      </div>
    </SectionForm>
  );
}
