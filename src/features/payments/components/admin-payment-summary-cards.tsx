import {
  CircleDollarSign,
  Clock3,
  CreditCard,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { formatCurrency } from "@/lib/formatters/currency";

type AdminPaymentSummaryCardsProps = {
  failedOrExpiredAmount: number;
  failedOrExpiredCount: number;
  paidAmount: number;
  paidCount: number;
  pendingAmount: number;
  pendingCount: number;
  platformRevenue: number;
};

export function AdminPaymentSummaryCards({
  failedOrExpiredAmount,
  failedOrExpiredCount,
  paidAmount,
  paidCount,
  pendingAmount,
  pendingCount,
  platformRevenue,
}: AdminPaymentSummaryCardsProps) {
  return (
    <section
      aria-label="Ringkasan pembayaran admin"
      className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4"
    >
      <MetricCard
        accent="teal"
        icon={CircleDollarSign}
        label="Pembayaran dibayar"
        meta={`${paidCount} invoice`}
        value={formatCurrency(paidAmount)}
      />
      <MetricCard
        accent="blue"
        icon={Clock3}
        label="Menunggu pembayaran"
        meta={`${pendingCount} invoice`}
        value={formatCurrency(pendingAmount)}
      />
      <MetricCard
        accent="amber"
        icon={CreditCard}
        label="Gagal atau kedaluwarsa"
        meta={`${failedOrExpiredCount} invoice`}
        value={formatCurrency(failedOrExpiredAmount)}
      />
      <MetricCard
        accent="dark"
        icon={TrendingUp}
        label="Platform revenue"
        meta="Dari data pembayaran dan pesanan"
        value={formatCurrency(platformRevenue)}
      />
    </section>
  );
}

type MetricCardProps = {
  accent: "amber" | "blue" | "dark" | "teal";
  icon: LucideIcon;
  label: string;
  meta: string;
  value: string;
};

const accentClasses = {
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  blue: "border-sky-200 bg-sky-50 text-sky-700",
  dark: "border-white/10 bg-[linear-gradient(135deg,var(--brand-navy-950),var(--brand-teal-900))] text-white",
  teal: "border-primary/20 bg-primary/10 text-primary",
} as const;

function MetricCard({ accent, icon: Icon, label, meta, value }: MetricCardProps) {
  const isDark = accent === "dark";

  return (
    <article
      className={
        isDark
          ? "rounded-2xl border border-white/10 bg-[linear-gradient(135deg,var(--brand-navy-950),var(--brand-teal-900))] p-5 text-white shadow-[var(--shadow-card)]"
          : "rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]"
      }
    >
      <div
        className={`grid size-11 place-items-center rounded-2xl border ${accentClasses[accent]}`}
      >
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <p
        className={
          isDark
            ? "mt-5 text-sm font-medium text-white/70"
            : "mt-5 text-sm font-medium text-muted-foreground"
        }
      >
        {label}
      </p>
      <p
        className={
          isDark
            ? "mt-2 text-3xl font-semibold tracking-tight text-white"
            : "mt-2 text-3xl font-semibold tracking-tight text-foreground"
        }
      >
        {value}
      </p>
      <p
        className={
          isDark
            ? "mt-2 text-xs font-medium text-white/60"
            : "mt-2 text-xs font-medium text-muted-foreground"
        }
      >
        {meta}
      </p>
    </article>
  );
}
