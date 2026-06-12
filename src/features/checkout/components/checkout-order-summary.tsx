import {
  Clock3,
  Layers3,
  PenLine,
  UserRound,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { CartDisplayItem } from "@/features/cart/components/cart-service-summary";
import { formatCurrency } from "@/lib/formatters/currency";

type CheckoutOrderSummaryProps = {
  addonTotal: number;
  adminFee: number;
  businessName: string;
  item: CartDisplayItem;
  serviceSubtotal: number;
  totalPayment: number;
};

export function CheckoutOrderSummary({
  addonTotal,
  adminFee,
  businessName,
  item,
  serviceSubtotal,
  totalPayment,
}: CheckoutOrderSummaryProps) {
  return (
    <aside
      aria-labelledby="checkout-order-summary-title"
      className="min-w-0 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-card)]"
    >
      <div className="bg-[linear-gradient(135deg,var(--brand-navy-950),var(--brand-teal-900))] p-5 text-white">
        <p className="text-sm font-semibold text-white/75">
          Ringkasan layanan
        </p>
        <h2
          id="checkout-order-summary-title"
          className="mt-2 text-xl font-semibold tracking-tight text-white"
        >
          {businessName}
        </h2>
        <p className="mt-3 text-sm leading-6 text-white/70">
          Pastikan pilihan layanan sudah sesuai sebelum brief campaign
          dilanjutkan ke pembayaran.
        </p>
      </div>

      <div className="p-5">
        <article className="rounded-2xl border border-border/70 bg-background p-4">
          <div className="flex flex-wrap gap-2">
            <Badge className="rounded-lg">{item.tierName}</Badge>
            <Badge variant="secondary" className="rounded-lg">
              {item.categoryName}
            </Badge>
          </div>
          <h3 className="mt-3 break-words text-lg font-semibold tracking-tight text-foreground">
            {item.serviceTitle}
          </h3>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <UserRound className="size-4 text-primary" aria-hidden="true" />
            Kreator: {item.creatorName}
          </p>

          <div className="mt-4 grid gap-2">
            <MiniMetric
              icon={Layers3}
              label="Kategori"
              value={item.categoryName}
            />
            <MiniMetric
              icon={Clock3}
              label="Estimasi"
              value={`${item.estimatedDays} hari`}
            />
            <MiniMetric
              icon={PenLine}
              label="Revisi"
              value={`${item.revisionCount} kali revisi`}
            />
          </div>
        </article>

        <dl className="mt-5 space-y-3 text-sm">
          <SummaryRow label="Subtotal layanan" value={serviceSubtotal} />
          <SummaryRow label="Add-on" value={addonTotal} />
          <SummaryRow label="Biaya admin" value={adminFee} />
        </dl>

        <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <WalletCards className="size-4 text-primary" aria-hidden="true" />
            Total pembayaran
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {formatCurrency(totalPayment)}
          </p>
        </div>
      </div>
    </aside>
  );
}

type MiniMetricProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function MiniMetric({ icon: Icon, label, value }: MiniMetricProps) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl bg-muted/35 px-3 py-2 text-sm">
      <span className="inline-flex min-w-0 items-center gap-2 text-muted-foreground">
        <Icon className="size-4 text-primary" aria-hidden="true" />
        {label}
      </span>
      <span className="min-w-0 text-right font-semibold text-foreground">{value}</span>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: number;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-foreground">{formatCurrency(value)}</dd>
    </div>
  );
}
