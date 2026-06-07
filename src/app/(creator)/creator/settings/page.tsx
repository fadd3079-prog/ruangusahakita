import type { Metadata } from "next";
import { User, Bell, Shield, Save } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { dummyCreators } from "@/lib/dummy";

export const metadata: Metadata = {
  title: "Pengaturan — Ruang Usaha Kita",
  description: "Atur preferensi akun dan profil kreator Anda.",
};

export default function CreatorSettingsPage() {
  const currentCreator = dummyCreators.find((creator) => creator.id === "creator_003") ?? dummyCreators[0];

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">Pengaturan Akun</h1>
          <p className="mt-2 text-muted-foreground">Kelola profil publik, notifikasi, dan ketersediaan Anda.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-2">
            <nav className="flex flex-col gap-1">
              <a href="#profile" className="flex items-center gap-2 rounded-lg bg-primary/10 text-primary px-3 py-2 text-sm font-semibold">
                <User className="size-4" />
                Profil Publik
              </a>
              <a href="#availability" className="flex items-center gap-2 rounded-lg hover:bg-muted px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Shield className="size-4" />
                Ketersediaan
              </a>
              <a href="#notifications" className="flex items-center gap-2 rounded-lg hover:bg-muted px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="size-4" />
                Notifikasi
              </a>
            </nav>
          </aside>

          <div className="space-y-8">
            <section id="profile" className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Profil Publik</h2>
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Nama Tampilan</Label>
                    <Input id="displayName" defaultValue={currentCreator.displayName} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="niche">Spesialisasi (Niche)</Label>
                    <Input id="niche" defaultValue={currentCreator.niche} className="h-11" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="city">Kota</Label>
                    <Input id="city" defaultValue={currentCreator.city} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Provinsi</Label>
                    <Input id="province" defaultValue={currentCreator.province} className="h-11" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio / Tentang Saya</Label>
                  <Textarea id="bio" defaultValue={currentCreator.bio} className="min-h-32 resize-y" />
                </div>
                
                <Button>
                  <Save className="size-4 mr-2" />
                  Simpan Profil
                </Button>
              </div>
            </section>

            <section id="availability" className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Status Ketersediaan</h2>
              <div className="space-y-5">
                <div className="space-y-2 max-w-md">
                  <Label htmlFor="status">Terima Order Baru?</Label>
                  <Select defaultValue={currentCreator.availabilityStatus}>
                    <SelectTrigger id="status" className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Tersedia (Menerima Order)</SelectItem>
                      <SelectItem value="limited">Terbatas (Hanya Order Kecil)</SelectItem>
                      <SelectItem value="busy">Penuh Sementara (Tidak Menerima Order)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">
                    Jika status Penuh, layanan Anda akan disembunyikan sementara dari pencarian UMKM.
                  </p>
                </div>
                <Button>
                  <Save className="size-4 mr-2" />
                  Update Status
                </Button>
              </div>
            </section>

            <section id="notifications" className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Preferensi Notifikasi</h2>
              <div className="space-y-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <div>
                      <p className="font-medium">Order Baru</p>
                      <p className="text-sm text-muted-foreground">Pemberitahuan saat UMKM memesan layanan Anda.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="notif-order" defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <div>
                      <p className="font-medium">Pesan Masuk / Revisi</p>
                      <p className="text-sm text-muted-foreground">Saat ada komentar atau permintaan revisi dari klien.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="notif-msg" defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Pencairan Dana</p>
                      <p className="text-sm text-muted-foreground">Info status pembayaran dari sistem.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="notif-payment" defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    </div>
                  </div>
                </div>
                <Button>
                  <Save className="size-4 mr-2" />
                  Simpan Preferensi
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
