import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center bg-background px-6">
      <div className="flex flex-col items-center gap-4 text-primary">
        <Loader2 className="size-10 animate-spin" />
        <p className="text-sm font-medium animate-pulse text-muted-foreground">Memuat halaman...</p>
      </div>
    </div>
  );
}
