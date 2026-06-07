import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

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
import { dummyServiceCategories } from "@/lib/dummy";

export const metadata: Metadata = {
  title: "Tambah Layanan Baru — Ruang Usaha Kita",
  description: "Buat paket jasa digital baru untuk ditawarkan kepada UMKM.",
};

export default function NewServicePage() {
  return (
    <PageContainer>
      <div className="space-y-8 pb-10">
        <div className="flex items-center gap-4 border-b border-border pb-6">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/creator/services">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">Tambah Paket Layanan</h1>
            <p className="mt-2 text-muted-foreground">Buat detail paket jasa digital baru yang menarik bagi UMKM.</p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-8">
            <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Informasi Dasar</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Layanan</Label>
                  <Input id="title" placeholder="Contoh: Pembuatan Video Konten TikTok & Reels" className="h-11" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Select>
                    <SelectTrigger id="category" className="h-11">
                      <SelectValue placeholder="Pilih kategori layanan" />
                    </SelectTrigger>
                    <SelectContent>
                      {dummyServiceCategories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi Singkat</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Jelaskan secara singkat apa yang UMKM dapatkan dari layanan ini..." 
                    className="min-h-24 resize-y"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Detail Paket & Output</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="deliverables">Output Layanan (Deliverables)</Label>
                  <Textarea 
                    id="deliverables" 
                    placeholder="Contoh: 1 Video vertikal 60 detik, 2 opsi hook, source file... (Pisahkan dengan baris baru)" 
                    className="min-h-24 resize-y"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Kebutuhan dari UMKM (Requirements)</Label>
                  <Textarea 
                    id="requirements" 
                    placeholder="Contoh: Logo brand resolusi tinggi, pedoman warna brand, referensi gaya..." 
                    className="min-h-24 resize-y"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="estimatedDays">Estimasi Pengerjaan (Hari)</Label>
                    <Input id="estimatedDays" type="number" min="1" placeholder="Contoh: 7" className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="revisions">Jumlah Revisi Maksimal</Label>
                    <Input id="revisions" type="number" min="0" placeholder="Contoh: 2" className="h-11" />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Harga Paket</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Tetapkan harga dasar (Basic). Anda juga bisa menawarkan opsi berjenjang agar UMKM bisa menyesuaikan budget mereka.
              </p>
              
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-[1fr_200px] items-end p-4 rounded-xl border border-border bg-muted/20">
                  <div className="space-y-2">
                    <Label className="font-semibold text-primary">Paket Basic (Wajib)</Label>
                    <p className="text-xs text-muted-foreground">Harga standar untuk paket layanan ini.</p>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-sm font-medium text-muted-foreground">Rp</span>
                    <Input type="number" className="pl-9 h-11 bg-background" placeholder="0" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-[1fr_200px] items-end p-4 rounded-xl border border-border bg-muted/20 opacity-60 hover:opacity-100 transition-opacity">
                  <div className="space-y-2">
                    <Label className="font-semibold text-foreground">Paket Standard (Opsional)</Label>
                    <p className="text-xs text-muted-foreground">Kualitas/output lebih tinggi dari Basic.</p>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-sm font-medium text-muted-foreground">Rp</span>
                    <Input type="number" className="pl-9 h-11 bg-background" placeholder="0" />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-[1fr_200px] items-end p-4 rounded-xl border border-border bg-muted/20 opacity-60 hover:opacity-100 transition-opacity">
                  <div className="space-y-2">
                    <Label className="font-semibold text-foreground">Paket Premium (Opsional)</Label>
                    <p className="text-xs text-muted-foreground">Layanan paling komprehensif.</p>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-sm font-medium text-muted-foreground">Rp</span>
                    <Input type="number" className="pl-9 h-11 bg-background" placeholder="0" />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 sticky top-24">
              <h3 className="font-semibold text-brand-navy mb-2">Simpan Layanan</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Pastikan semua detail sudah sesuai. Layanan ini akan langsung terlihat di katalog publik jika status aktif.
              </p>
              
              <div className="space-y-3">
                <Button className="w-full h-11" asChild>
                  <Link href="/creator/services">
                    <Save className="mr-2 size-4" />
                    Simpan Paket
                  </Link>
                </Button>
                <Button variant="outline" className="w-full h-11 bg-background" asChild>
                  <Link href="/creator/services">
                    Batal
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
