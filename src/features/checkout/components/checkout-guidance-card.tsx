import { CheckCircle2, FileText } from "lucide-react";

const guidanceItems = [
  "Tentukan satu tujuan utama.",
  "Tambahkan gaya dan referensi.",
  "Simpan brief sebelum membuat pesanan.",
] as const;

export function CheckoutGuidanceCard() {
  return (
    <aside className="rounded-2xl border border-primary/20 bg-[linear-gradient(135deg,var(--accent),var(--surface-elevated))] p-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-3">
        <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
          <FileText className="size-4" aria-hidden="true" />
        </div>
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Brief yang efektif
        </h2>
      </div>
      <ul className="mt-4 grid gap-2 text-sm leading-5 text-muted-foreground sm:grid-cols-3">
        {guidanceItems.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <CheckCircle2
              className="mt-0.5 size-4 shrink-0 text-primary"
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </aside>
  );
}
