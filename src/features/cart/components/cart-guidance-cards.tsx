import { CheckCircle2, FileText, ShieldCheck } from "lucide-react";

export function CartGuidanceCards() {
  return (
    <section
      aria-label="Panduan sebelum checkout"
      className="grid gap-4 md:grid-cols-2"
    >
      <article className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]">
        <div className="h-1.5 bg-[linear-gradient(90deg,var(--brand-teal-600),var(--brand-teal-900))]" />
        <div className="p-5">
          <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
            <FileText className="size-5" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
            Siapkan brief sebelum pembayaran
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Brief yang jelas membantu kreator memahami arah konten sejak awal:
            tujuan campaign, target audiens, gaya visual, platform, dan referensi.
          </p>
        </div>
      </article>

      <article className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,var(--brand-navy-950),var(--brand-teal-900))] p-5 text-white shadow-[var(--shadow-card)]">
        <div className="grid size-10 place-items-center rounded-xl border border-white/10 bg-white/10 text-white">
          <ShieldCheck className="size-5" aria-hidden="true" />
        </div>
        <h2 className="mt-4 text-xl font-semibold tracking-tight text-white">
          Alur jasa digital tetap bertahap
        </h2>
        <ul className="mt-4 space-y-3 text-sm leading-6 text-white/75">
          {[
            "Detail layanan ditinjau sebelum checkout.",
            "Brief campaign diisi sebelum masuk pembayaran.",
            "Status pesanan dan pembayaran dipisahkan pada tahap integrasi.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle2
                className="mt-1 size-4 shrink-0 text-white"
                aria-hidden="true"
              />
              {item}
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
