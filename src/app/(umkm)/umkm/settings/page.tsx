import type { Metadata } from "next";
import { Bell, Shield, Save, Building2, Phone, PenTool } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { dummyUmkmProfiles } from "@/lib/dummy";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Pengaturan UMKM — Ruang Usaha Kita",
  description: "Atur profil bisnis, kontak, dan preferensi konten Anda.",
};

export default function UmkmSettingsPage() {
  const currentUmkm = dummyUmkmProfiles[0];

  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <div className="border-b border-border pb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">Pengaturan Akun</h1>
          <p className="mt-2 text-muted-foreground">Kelola informasi bisnis, kontak representatif, dan preferensi konten.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-2">
            <nav className="flex flex-col gap-1">
              <a href="#business" className="flex items-center gap-2 rounded-lg bg-primary/10 text-primary px-3 py-2 text-sm font-semibold">
                <Building2 className="size-4" />
                Profil Bisnis
              </a>
              <a href="#contact" className="flex items-center gap-2 rounded-lg hover:bg-muted px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="size-4" />
                Kontak & Sosial
              </a>
              <a href="#content" className="flex items-center gap-2 rounded-lg hover:bg-muted px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <PenTool className="size-4" />
                Preferensi Konten
              </a>
              <a href="#notifications" className="flex items-center gap-2 rounded-lg hover:bg-muted px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="size-4" />
                Notifikasi
              </a>
              <a href="#security" className="flex items-center gap-2 rounded-lg hover:bg-muted px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <Shield className="size-4" />
                Keamanan
              </a>
            </nav>
          </aside>

          <div className="space-y-8">
            <section id="business" className="rounded-2xl border border-border/70 bg-card p-6 shadow-[var(--shadow-soft)]">
              <h2 className="text-xl font-semibold mb-6">Profil Bisnis</h2>
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Nama Usaha</Label>
                    <Input id="businessName" defaultValue={currentUmkm.businessName} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessCategory">Kategori Industri</Label>
                    <Input id="businessCategory" defaultValue={currentUmkm.businessCategory} className="h-11" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi Usaha</Label>
                  <Textarea id="description" defaultValue={currentUmkm.description} className="min-h-32 resize-y" />
                </div>
                
                <Button>
                  <Save className="size-4 mr-2" />
                  Simpan Profil Bisnis
                </Button>
              </div>
            </section>

            <section id="contact" className="rounded-2xl border border-border/70 bg-card p-6 shadow-[var(--shadow-soft)]">
              <h2 className="text-xl font-semibold mb-6">Informasi Kontak & Sosial</h2>
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Nama Pemilik/Perwakilan</Label>
                    <Input id="ownerName" defaultValue={currentUmkm.ownerName} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
                    <Input id="whatsapp" defaultValue={currentUmkm.whatsappNumber} className="h-11" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="city">Kota</Label>
                    <Input id="city" defaultValue={currentUmkm.city} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Provinsi</Label>
                    <Input id="province" defaultValue={currentUmkm.province} className="h-11" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instagram">Tautan Instagram Usaha</Label>
                  <Input id="instagram" defaultValue={currentUmkm.instagramUrl} className="h-11" />
                </div>

                <Button>
                  <Save className="size-4 mr-2" />
                  Simpan Kontak
                </Button>
              </div>
            </section>

            <section id="content" className="rounded-2xl border border-border/70 bg-card p-6 shadow-[var(--shadow-soft)]">
              <h2 className="text-xl font-semibold mb-6">Preferensi Konten Default</h2>
              <p className="text-sm text-muted-foreground mb-4">Informasi ini akan menjadi isian default saat Anda membuat Brief Campaign baru.</p>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Target Audiens</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {currentUmkm.targetAudience.map((audience, idx) => (
                       <Badge key={idx} variant="secondary" className="px-3 py-1">
                         {audience}
                       </Badge>
                    ))}
                    <Badge variant="outline" className="px-3 py-1 border-dashed cursor-pointer hover:bg-muted">
                      + Tambah Audiens
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label>Preferensi Platform Konten</Label>
                   <div className="flex flex-wrap gap-2 mb-2">
                    {currentUmkm.contentPreference.map((pref, idx) => (
                       <Badge key={idx} variant="secondary" className="px-3 py-1">
                         {pref}
                       </Badge>
                    ))}
                     <Badge variant="outline" className="px-3 py-1 border-dashed cursor-pointer hover:bg-muted">
                      + Tambah Platform
                    </Badge>
                  </div>
                </div>

                <Button>
                  <Save className="size-4 mr-2" />
                  Simpan Preferensi
                </Button>
              </div>
            </section>

            <section id="notifications" className="rounded-2xl border border-border/70 bg-card p-6 shadow-[var(--shadow-soft)]">
              <h2 className="text-xl font-semibold mb-6">Preferensi Notifikasi</h2>
              <div className="space-y-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <div>
                      <p className="font-medium">Pembaruan Pesanan</p>
                      <p className="text-sm text-muted-foreground">Pemberitahuan saat kreator menerima atau menyelesaikan pesanan.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="notif-order" defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-b border-border/50 pb-4">
                    <div>
                      <p className="font-medium">File Hasil Konten</p>
                      <p className="text-sm text-muted-foreground">Saat kreator mengirimkan draft atau hasil akhir untuk direview.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="notif-result" defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Promo & Rekomendasi Kreator</p>
                      <p className="text-sm text-muted-foreground">Info kreator unggulan terbaru yang relevan dengan bisnis Anda.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="notif-promo" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                    </div>
                  </div>
                </div>
                <Button>
                  <Save className="size-4 mr-2" />
                  Simpan Notifikasi
                </Button>
              </div>
            </section>
            
            <section id="security" className="rounded-2xl border border-border/70 bg-card p-6 shadow-[var(--shadow-soft)]">
               <h2 className="text-xl font-semibold mb-6">Keamanan Akun</h2>
               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">Password Akun</p>
                      <p className="text-sm text-muted-foreground mt-1">Ganti password secara berkala untuk menjaga keamanan akun Anda.</p>
                    </div>
                    <Button variant="outline">Ubah Password</Button>
                  </div>
               </div>
            </section>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
