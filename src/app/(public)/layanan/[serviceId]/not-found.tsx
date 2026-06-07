import Link from "next/link";
import { PackageX } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ServiceNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-background px-6 text-center">
      <div className="grid size-20 place-items-center rounded-2xl bg-primary/10 text-primary mb-6">
        <PackageX className="size-10" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
        Paket Jasa tidak ditemukan
      </h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground leading-relaxed">
        Maaf, layanan digital yang Anda cari tidak tersedia, sudah ditutup, atau dihapus oleh kreator.
      </p>
      
      <div className="mt-10">
        <Button asChild size="lg" className="h-12 px-8 text-base">
          <Link href="/katalog">Cari Layanan Serupa di Katalog</Link>
        </Button>
      </div>
    </div>
  );
}
