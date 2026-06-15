import { ClipboardList, type LucideIcon } from "lucide-react";

import { formatCurrency } from "@/lib/formatters/currency";

type OrderPageHeroProps = {
  description: string;
  eyebrow: string;
  metricLabel?: string;
  metricValue?: number | string;
  title: string;
  icon?: LucideIcon;
};

export function OrderPageHero({
  description,
  eyebrow,
  icon: Icon = ClipboardList,
  metricLabel,
  metricValue,
  title,
}: OrderPageHeroProps) {
  const displayMetric =
    typeof metricValue === "number" ? formatCurrency(metricValue) : metricValue;

  return (
    <section className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,var(--brand-navy-950),var(--brand-teal-900))] text-white shadow-[var(--shadow-card)]">
      <div className="grid min-w-0 gap-8 p-6 sm:p-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:items-end">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-semibold text-white/80">
            <Icon className="size-4" aria-hidden="true" />
            {eyebrow}
          </p>
          <h1 className="mt-5 max-w-4xl break-words text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-white/72 sm:text-base">
            {description}
          </p>
        </div>

        {displayMetric && metricLabel ? (
          <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm font-medium text-white/68">{metricLabel}</p>
            <p className="mt-3 truncate text-4xl font-semibold tracking-tight text-white">
              {displayMetric}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
