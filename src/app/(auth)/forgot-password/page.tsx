import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

import { SubmitButton } from "@/components/common/submit-button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordResetAction } from "@/features/auth/actions/password-actions";

export const metadata: Metadata = {
  title: "Lupa Password — Ruang Usaha Kita",
  description: "Atur ulang password akun Ruang Usaha Kita Anda.",
};

type ForgotPasswordPageProps = {
  searchParams?: Promise<{
    error?: string;
    sent?: string;
  }>;
};

const errorMessages = {
  email_required: "Email wajib diisi.",
  reset_failed: "Instruksi pemulihan belum bisa dikirim. Coba beberapa saat lagi.",
} as const;

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const params = await (searchParams ?? Promise.resolve({ error: undefined, sent: undefined }));
  const errorMessage = params.error
    ? errorMessages[params.error as keyof typeof errorMessages] ?? errorMessages.reset_failed
    : null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-brand-navy">
          Lupa password?
        </h1>
        <p className="text-muted-foreground">
          Masukkan email akun. Link reset akan dikirim lewat Supabase Auth.
        </p>
      </div>

      {params.sent === "1" ? (
        <Alert>
          <Mail className="size-4" aria-hidden="true" />
          <AlertTitle>Email pemulihan dikirim</AlertTitle>
          <AlertDescription>
            Cek inbox email Anda lalu buka link untuk membuat password baru.
          </AlertDescription>
        </Alert>
      ) : null}

      {errorMessage ? (
        <Alert variant="destructive">
          <AlertTitle>Reset belum berhasil</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      <form action={requestPasswordResetAction} className="space-y-6">
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

        <SubmitButton
          pendingLabel="Mengirim..."
          className="h-11 w-full text-base font-semibold"
          size="lg"
          icon={<Mail className="size-4" aria-hidden="true" />}
        >
          Kirim Link Reset
        </SubmitButton>

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-brand-navy"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Kembali ke halaman masuk
          </Link>
        </div>
      </form>
    </div>
  );
}
