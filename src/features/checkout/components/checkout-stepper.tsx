import { CheckCircle2 } from "lucide-react";

const checkoutSteps = [
  {
    label: "Detail Pesanan",
    description: "Layanan sudah ditinjau",
    state: "complete",
  },
  {
    label: "Brief Campaign",
    description: "Isi arahan konten",
    state: "active",
  },
  {
    label: "Pembayaran",
    description: "Simulasi tahap berikutnya",
    state: "upcoming",
  },
] as const;

export function CheckoutStepper() {
  return (
    <nav aria-label="Tahap checkout">
      <ol className="grid gap-3 sm:grid-cols-3">
        {checkoutSteps.map((step, index) => {
          const isComplete = step.state === "complete";
          const isActive = step.state === "active";

          return (
            <li
              key={step.label}
              className={
                isActive
                  ? "rounded-2xl border border-primary/25 bg-[linear-gradient(135deg,var(--surface-elevated),var(--accent))] p-4 shadow-[var(--shadow-soft)]"
                  : "rounded-2xl border border-border/70 bg-card/80 p-4 shadow-[var(--shadow-soft)]"
              }
            >
              <div className="flex items-center gap-3">
                <span
                  className={
                    isComplete || isActive
                      ? "grid size-9 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-sm"
                      : "grid size-9 place-items-center rounded-full bg-muted text-sm font-semibold text-muted-foreground"
                  }
                >
                  {isComplete ? (
                    <CheckCircle2 className="size-4" aria-hidden="true" />
                  ) : (
                    index + 1
                  )}
                </span>
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Tahap {index + 1}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {step.label}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
