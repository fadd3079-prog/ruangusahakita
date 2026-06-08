"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/lib/auth/actions";

type LoginFormProps = {
  notice?: string;
  routeError?: string;
};

export function LoginForm({ notice, routeError }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (_state: unknown, formData: FormData) => {
      return await loginAction(formData);
    },
    null
  );

  const error = state?.error ?? routeError;

  return (
    <form action={formAction} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">Selamat Datang Kembali</h1>
        <p className="text-muted-foreground">
          Masuk untuk mengelola campaign dan kolaborasi Anda di Ruang Usaha Kita.
        </p>
      </div>

      {notice && (
        <div className="rounded-md border border-primary/20 bg-primary/5 p-3 text-sm text-brand-navy">
          {notice}
        </div>
      )}

      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email"
            type="email" 
            placeholder="nama@email.com" 
            className="h-11 px-4"
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-primary hover:text-brand-navy transition-colors"
            >
              Lupa password?
            </Link>
          </div>
          <Input 
            id="password" 
            name="password"
            type="password" 
            placeholder="••••••••"
            className="h-11 px-4"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex items-center justify-center">
            <input 
              type="checkbox" 
              id="remember" 
              name="remember"
              className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-input bg-background transition-all checked:bg-primary checked:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
            />
            <svg
              className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <label 
            htmlFor="remember" 
            className="text-sm font-medium leading-none cursor-pointer select-none"
          >
            Ingat saya di perangkat ini
          </label>
        </div>

        <Button type="submit" disabled={isPending} className="w-full h-11 text-base font-semibold shadow-sm" size="lg">
          {isPending ? "Sedang masuk..." : "Masuk ke Akun"}
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Atau</span>
        </div>
      </div>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">Belum punya akun?</span>{" "}
        <Link href="/register" className="font-semibold text-primary hover:text-brand-navy transition-colors">
          Daftar sekarang gratis
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-muted/30 p-4 shadow-sm">
        <div className="flex gap-3">
          <div className="mt-0.5 size-4 shrink-0 rounded-full bg-primary/20 flex items-center justify-center">
            <div className="size-1.5 rounded-full bg-primary" />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground block mb-0.5">Tips Akses Dasar:</span>
            Gunakan akun UMKM untuk mencari kreator, akun Kreator untuk menawarkan jasa, atau akun Admin untuk pengawasan.
          </p>
        </div>
      </div>
    </form>
  );
}
