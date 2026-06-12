"use client";

import { useState } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { Building2, UserRound, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { registerAction } from "@/lib/auth/actions";

type Role = "umkm" | "creator";

export function RegisterForm() {
  const [role, setRole] = useState<Role>("umkm");

  const [state, formAction, isPending] = useActionState(
    async (_state: unknown, formData: FormData) => {
      const password = formData.get("password");
      const confirm = formData.get("confirmPassword");

      if (password !== confirm) {
        return { error: "Password dan konfirmasi password tidak cocok." };
      }

      return await registerAction(formData);
    },
    null
  );

  return (
    <form action={formAction} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">Buat Akun Baru</h1>
        <p className="text-muted-foreground">
          Buat akun untuk mulai menemukan kreator atau menawarkan layanan digital.
        </p>
      </div>

      {state?.error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
          {state.error}
        </div>
      )}

      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Pilih Peran Anda</Label>
          <input type="hidden" name="role" value={role} />
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setRole("umkm")}
              className={cn(
                "group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-4 text-center transition-all",
                role === "umkm"
                  ? "border-primary bg-primary/5 text-brand-navy shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-muted/50"
              )}
            >
              <div className={cn(
                "flex size-10 items-center justify-center rounded-full transition-colors",
                role === "umkm" ? "bg-primary text-white" : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
              )}>
                <Building2 className="size-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold">UMKM</p>
                <p className="text-[10px] leading-tight">Saya ingin mencari jasa digital</p>
              </div>
              {role === "umkm" && (
                <div className="absolute -right-2 -top-2 rounded-full bg-primary text-white">
                  <CheckCircle2 className="size-5 fill-primary text-white" />
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={() => setRole("creator")}
              className={cn(
                "group relative flex flex-col items-center gap-3 rounded-2xl border-2 p-4 text-center transition-all",
                role === "creator"
                  ? "border-primary bg-primary/5 text-brand-navy shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:bg-muted/50"
              )}
            >
              <div className={cn(
                "flex size-10 items-center justify-center rounded-full transition-colors",
                role === "creator" ? "bg-primary text-white" : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
              )}>
                <UserRound className="size-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold">Kreator</p>
                <p className="text-[10px] leading-tight">Saya ingin menawarkan jasa</p>
              </div>
              {role === "creator" && (
                <div className="absolute -right-2 -top-2 rounded-full bg-primary text-white">
                  <CheckCircle2 className="size-5 fill-primary text-white" />
                </div>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" name="name" placeholder="Nama lengkap Anda" className="h-11 px-4" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="nama@email.com" className="h-11 px-4" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="Min. 8 karakter" className="h-11 px-4" required minLength={8} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Ulangi password" className="h-11 px-4" required minLength={8} />
          </div>
        </div>

        <div className="rounded-2xl border-2 border-primary/10 bg-primary/5 p-4 animate-in fade-in zoom-in-95 duration-300">
          {role === "umkm" ? (
            <div className="space-y-2">
              <p className="text-sm font-bold text-brand-navy">Manfaat Akun UMKM:</p>
              <ul className="grid gap-1.5">
                {[
                  "Temukan kreator sesuai kebutuhan campaign",
                  "Brief campaign lebih terstruktur",
                  "Pantau status pesanan dan pembayaran",
                  "Kelola revisi hasil konten"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="size-3.5 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-bold text-brand-navy">Manfaat Akun Kreator:</p>
              <ul className="grid gap-1.5">
                {[
                  "Tampilkan portofolio dan paket layanan",
                  "Terima order dari UMKM",
                  "Pantau brief dan deadline",
                  "Kelola status pesanan jasa digital"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="size-3.5 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Button type="submit" disabled={isPending} aria-busy={isPending} className="w-full h-11 text-base font-semibold shadow-sm" size="lg">
          {isPending ? "Membuat akun..." : "Daftar Sekarang"}
        </Button>
      </div>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Sudah punya akun?</span>{" "}
        <Link href="/login" className="font-semibold text-primary hover:text-brand-navy transition-colors">
          Masuk di sini
        </Link>
      </div>

      <p className="text-center text-[10px] text-muted-foreground leading-relaxed">
        Dengan mendaftar, Anda menyetujui <span className="underline cursor-pointer">Syarat & Ketentuan</span> dan <span className="underline cursor-pointer">Kebijakan Privasi</span> kami.
      </p>
    </form>
  );
}
