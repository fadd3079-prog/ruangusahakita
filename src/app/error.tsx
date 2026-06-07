"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-6 text-center">
      <div className="grid size-20 place-items-center rounded-2xl bg-destructive/10 text-destructive mb-6">
        <AlertCircle className="size-10" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        Terjadi Kesalahan Sistem
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground leading-relaxed">
        Maaf, kami mengalami kendala teknis saat memproses permintaan Anda. Tim kami telah diberitahu.
      </p>
      
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Button onClick={() => reset()} size="lg" className="h-12 px-8 text-base">
          Coba Lagi
        </Button>
        <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base bg-background">
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
      </div>
    </div>
  );
}
