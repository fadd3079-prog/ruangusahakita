import { CheckCircle2, FileText } from "lucide-react";

const guidanceItems = [
  "Tuliskan tujuan campaign dalam satu arah utama agar kreator tidak menebak prioritas.",
  "Sertakan gaya konten dan referensi agar hasil konten lebih dekat dengan ekspektasi UMKM.",
  "Pembayaran pada tahap ini masih berupa simulasi alur, belum transaksi nyata.",
] as const;

export function CheckoutGuidanceCard() {
  return (
    <aside className="rounded-2xl border border-primary/20 bg-[linear-gradient(135deg,var(--accent),var(--surface-elevated))] p-5 shadow-[var(--shadow-soft)]">
      <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
        <FileText className="size-5" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
        Brief yang rapi mempercepat proses kreator
      </h2>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
        {guidanceItems.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <CheckCircle2
              className="mt-1 size-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
}
