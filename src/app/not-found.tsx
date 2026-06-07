import Link from "next/link";
import { FileSearch } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="grid size-20 place-items-center rounded-2xl bg-primary/10 text-primary mb-6">
        <FileSearch className="size-10" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground leading-relaxed">
        Maaf, halaman yang Anda cari tidak tersedia atau mungkin telah dipindahkan.
      </p>
      
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="h-12 px-8 text-base">
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base bg-background">
          <Link href="/katalog">Lihat Katalog Layanan</Link>
        </Button>
      </div>
    </div>
  );
}
