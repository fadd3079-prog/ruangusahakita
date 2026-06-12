import type { ReactNode } from "react";
import { AppLogo } from "@/components/common/app-logo";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-svh bg-background">
      <div
        className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-brand-navy bg-cover bg-center p-12 text-white lg:flex"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(12, 41, 73, 0.88), rgba(17, 73, 85, 0.72)), url('/images/abstract%20(8).webp')",
        }}
      >
        <div className="relative z-10">
          <AppLogo className="brightness-0 invert" />
          <div className="mt-24 max-w-lg">
            <h2 className="text-4xl font-semibold leading-tight tracking-tight">
              Marketplace jasa digital untuk UMKM dan kreator.
            </h2>
            <p className="mt-6 text-lg text-white/80 leading-relaxed font-medium">
              Masuk untuk mengelola brief campaign, paket jasa, status pesanan,
              pembayaran, portofolio, dan review dalam alur yang rapi.
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-6 text-sm font-medium text-white/60">
            <p>© 2026 Ruang Usaha Kita</p>
            <div className="flex gap-4">
              <span className="cursor-pointer transition-colors hover:text-white">Syarat & Ketentuan</span>
              <span className="cursor-pointer transition-colors hover:text-white">Privasi</span>
            </div>
          </div>
        </div>
      </div>

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
