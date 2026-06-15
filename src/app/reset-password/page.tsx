import type { Metadata } from "next";
import Link from "next/link";
import { KeyRound } from "lucide-react";

import { AppLogo } from "@/components/common/app-logo";
import { SubmitButton } from "@/components/common/submit-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePasswordAction } from "@/features/auth/actions/password-actions";
import { getCurrentUser } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Buat Password Baru — Ruang Usaha Kita",
  description: "Buat password baru untuk akun Ruang Usaha Kita.",
};

type ResetPasswordPageProps = {
  searchParams?: Promise<{
    debug?: string;
    error?: string;
  }>;
};

type ResetPasswordSearchParams = Awaited<
  NonNullable<ResetPasswordPageProps["searchParams"]>
>;

const errorMessages = {
  password_mismatch: "Konfirmasi password belum sama.",
  password_same: "Password baru harus berbeda dari password sebelumnya.",
  password_short: "Password minimal 8 karakter.",
  update_failed: "Password belum bisa diperbarui. Buka ulang link reset dari email.",
} as const;

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const [user, params] = await Promise.all([
    getCurrentUser(),
    searchParams ??
      Promise.resolve<ResetPasswordSearchParams>({
        debug: undefined,
        error: undefined,
      }),
  ]);
  const errorMessage = params.error
    ? errorMessages[params.error as keyof typeof errorMessages] ?? errorMessages.update_failed
    : null;
  const debugMessage =
    process.env.NODE_ENV === "development" && params.debug ? params.debug : null;

  return (
    <main className="grid min-h-svh place-items-center bg-background px-5 py-10">
      <section className="w-full max-w-md rounded-3xl border border-border/70 bg-card p-6 shadow-[var(--shadow-card)] sm:p-8">
        <div className="mb-8 flex justify-center">
          <AppLogo />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">
            Buat password baru
          </h1>
          <p className="text-sm leading-6 text-muted-foreground">
            Gunakan password baru untuk masuk kembali ke dashboard.
          </p>
        </div>

        {!user ? (
          <Alert variant="destructive" className="mt-6">
            <AlertTitle>Link reset belum aktif</AlertTitle>
            <AlertDescription>
              Buka link reset terbaru dari email atau minta ulang link pemulihan.
            </AlertDescription>
          </Alert>
        ) : null}

        {errorMessage ? (
          <Alert variant="destructive" className="mt-6">
            <AlertTitle>Password belum diperbarui</AlertTitle>
            <AlertDescription>
              {errorMessage}
              {debugMessage ? (
                <span className="mt-2 block text-xs opacity-80">
                  Dev detail: {debugMessage}
                </span>
              ) : null}
            </AlertDescription>
          </Alert>
        ) : null}

        <form action={updatePasswordAction} className="mt-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password">Password baru</Label>
            <Input
              id="password"
              name="password"
              type="password"
              className="h-11"
              required
              minLength={8}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfirmasi password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="h-11"
              required
              minLength={8}
            />
          </div>
          <SubmitButton
            pendingLabel="Menyimpan..."
            disabled={!user}
            className="h-11 w-full"
            icon={<KeyRound className="size-4" aria-hidden="true" />}
          >
            Simpan Password Baru
          </SubmitButton>
        </form>

        <Link
          href="/forgot-password"
          className="mt-6 inline-flex text-sm font-medium text-primary hover:text-brand-navy"
        >
          Minta ulang link reset
        </Link>
      </section>
    </main>
  );
}
