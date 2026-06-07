import type { ReactNode } from "react";
import { AppLogo } from "@/components/common/app-logo";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Left Panel - Brand/Value (Hidden on mobile) */}
      <div className="hidden w-1/2 flex-col justify-between bg-brand-navy p-12 text-white lg:flex relative overflow-hidden">
        <div className="relative z-10">
          <AppLogo className="brightness-0 invert" />
          <div className="mt-24 max-w-lg">
            <h2 className="text-4xl font-semibold leading-tight tracking-tight">
              Solusi Pemasaran Digital Terpercaya untuk UMKM Indonesia
            </h2>
            <p className="mt-6 text-lg text-white/80 leading-relaxed font-medium">
              Temukan kreator terbaik, kelola campaign dengan mudah, dan tingkatkan visibilitas bisnis Anda dalam satu platform yang terintegrasi.
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-6 text-sm font-medium text-white/60">
            <p>© 2026 Ruang Usaha Kita</p>
            <div className="flex gap-4">
              <span className="hover:text-white transition-colors cursor-pointer">Syarat & Ketentuan</span>
              <span className="hover:text-white transition-colors cursor-pointer">Privasi</span>
            </div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute -bottom-20 -right-20 size-96 rounded-full bg-brand-teal/20 blur-[100px]" />
        <div className="absolute top-1/2 -left-20 size-64 rounded-full bg-brand-teal/10 blur-[80px]" />
      </div>

      {/* Right Panel - Form */}
      <div className="flex w-full flex-col lg:w-1/2">
        <div className="flex flex-1 items-center justify-center p-6 sm:p-12 lg:p-16">
          <div className="w-full max-w-[400px]">
            <div className="lg:hidden mb-10 flex justify-center">
              <AppLogo />
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
