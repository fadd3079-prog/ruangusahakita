import { CheckCircle2 } from "lucide-react";

const steps = [
  { label: "Detail", state: "done" },
  { label: "Brief", state: "active" },
  { label: "Pembayaran", state: "next" },
] as const;

export function CheckoutStepper() {
  return (
    <nav aria-label="Tahap checkout" className="rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-[var(--shadow-soft)]">
      <ol className="grid grid-cols-3 gap-2">
        {steps.map((step, index) => (
          <li key={step.label} className="flex items-center gap-2">
            <span
              className={
                step.state === "done"
                  ? "grid size-8 shrink-0 place-items-center rounded-full bg-emerald-600 text-white"
                  : step.state === "active"
                    ? "grid size-8 shrink-0 place-items-center rounded-full bg-blue-600 text-sm font-semibold text-white"
                    : "grid size-8 shrink-0 place-items-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600"
              }
            >
              {step.state === "done" ? (
                <CheckCircle2 className="size-4" aria-hidden="true" />
              ) : (
                index + 1
              )}
            </span>
            <span
              className={
                step.state === "active"
                  ? "truncate text-sm font-semibold text-foreground"
                  : "truncate text-sm text-muted-foreground"
              }
            >
              {step.label}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
