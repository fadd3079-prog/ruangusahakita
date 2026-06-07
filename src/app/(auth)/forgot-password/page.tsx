import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const metadata: Metadata = {
  title: "Lupa Password — Ruang Usaha Kita",
  description: "Atur ulang password akun Ruang Usaha Kita Anda.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">Lupa Password?</h1>
        <p className="text-muted-foreground">
          Masukkan email Anda dan kami akan mengirimkan instruksi untuk mengatur ulang password Anda.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Alamat Email</Label>
          <Input id="email" type="email" placeholder="nama@email.com" className="h-11 px-4" />
        </div>

        <Button className="w-full h-11 text-base font-semibold shadow-sm" size="lg">
          Kirim Instruksi Pemulihan
        </Button>

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-brand-navy transition-colors"
          >
            <ArrowLeft className="size-4" />
            Kembali ke halaman masuk
          </Link>
        </div>
      </div>
    </div>
  );
}
