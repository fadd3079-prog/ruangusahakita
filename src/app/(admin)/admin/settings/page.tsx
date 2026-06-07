import type { Metadata } from "next";
import { Shield, CreditCard, Bell, Save, Info } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
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

export const metadata: Metadata = {
  title: "Pengaturan Platform — Ruang Usaha Kita",
  description: "Konfigurasi global platform marketplace.",
};

export default function AdminSettingsPage() {
  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">Pengaturan Platform</h1>
          <p className="mt-2 text-muted-foreground">Konfigurasi fee, mode pembayaran, dan aturan moderasi sistem.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-2">
            <nav className="flex flex-col gap-1">
              <a href="#financial" className="flex items-center gap-2 rounded-lg bg-primary/10 text-primary px-3 py-2 text-sm font-semibold">
                <CreditCard className="size-4" />
                Finansial & Fee
              </a>
              <a href="#moderation" className="flex items-center gap-2 rounded-lg hover:bg-muted px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Shield className="size-4" />
                Moderasi
              </a>
              <a href="#notifications" className="flex items-center gap-2 rounded-lg hover:bg-muted px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="size-4" />
                Notifikasi Global
              </a>
            </nav>
          </aside>

          <div className="space-y-8">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
              <Info className="size-5 text-primary shrink-0 mt-0.5" />
              <div className="text-sm text-brand-navy">
                <span className="font-semibold block mb-1">Mode UI/Statis</span>
                Nilai pengaturan di halaman ini tidak tersimpan ke database. Formulir hanya berupa rancangan (placeholder) untuk implementasi admin backend di masa mendatang.
              </div>
            </div>

            <section id="financial" className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Pengaturan Finansial</h2>
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Platform Fee (%)</Label>
                    <div className="relative">
                      <Input defaultValue="5" type="number" className="pl-4 pr-10 h-11" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Potongan dari total pendapatan kreator per transaksi.</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Biaya Layanan UMKM (Rp)</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">Rp</span>
                      <Input defaultValue="2500" type="number" className="pl-10 h-11" />
                    </div>
                    <p className="text-xs text-muted-foreground">Biaya tambahan flat yang dibebankan kepada UMKM saat checkout.</p>
                  </div>
                </div>

                <div className="space-y-2 max-w-md">
                  <Label>Mode Payment Gateway (Midtrans)</Label>
                  <Select defaultValue="sandbox">
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dummy">Dummy / Lokal (Simulasi UI)</SelectItem>
                      <SelectItem value="sandbox">Sandbox (Testing Midtrans)</SelectItem>
                      <SelectItem value="production">Production (Live)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button>
                  <Save className="size-4 mr-2" />
                  Simpan Finansial
                </Button>
              </div>
            </section>

            <section id="moderation" className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Aturan Moderasi</h2>
              <div className="space-y-5">
                <div className="space-y-2 max-w-md">
                  <Label>Verifikasi Kreator Baru</Label>
                  <Select defaultValue="manual">
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Otomatis Terverifikasi</SelectItem>
                      <SelectItem value="manual">Membutuhkan Persetujuan Admin (Manual)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 max-w-md">
                  <Label>Layanan Baru</Label>
                  <Select defaultValue="auto">
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Langsung Tayang (Otomatis)</SelectItem>
                      <SelectItem value="manual">Tinjauan Admin Dahulu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button>
                  <Save className="size-4 mr-2" />
                  Simpan Moderasi
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
