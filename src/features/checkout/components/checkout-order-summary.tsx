import { Clock3, PenLine, UserRound } from "lucide-react";
import type { ReactNode } from "react";

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
    <aside className="min-w-0 overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-soft)]">
      <div className="min-w-0 border-b border-border/70 px-5 py-4">
        <p className="text-sm font-semibold text-primary">Ringkasan</p>
        <h2 className="mt-1 truncate text-xl font-semibold tracking-tight text-foreground">
          {businessName}
        </h2>
      </div>

      <div className="space-y-5 p-5">
        <section>
          <div className="flex flex-wrap gap-2">
            <Badge className="max-w-full truncate rounded-lg bg-primary text-primary-foreground hover:bg-primary">
              {item.tierName}
            </Badge>
            <Badge variant="secondary" className="max-w-full truncate rounded-lg">
              {item.categoryName}
            </Badge>
          </div>
          <h3 className="mt-3 line-clamp-2 break-words text-lg font-semibold tracking-tight text-foreground">
            {item.serviceTitle}
          </h3>
          <p className="mt-2 flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
            <UserRound className="size-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="truncate">{item.creatorName}</span>
          </p>
        </section>

        <section className="grid gap-2">
          <FactRow
            icon={<Clock3 className="size-4 text-blue-700" aria-hidden="true" />}
            label="Estimasi"
            value={`${item.estimatedDays} hari`}
          />
          <FactRow
            icon={<PenLine className="size-4 text-amber-700" aria-hidden="true" />}
            label="Revisi"
            value={`${item.revisionCount} kali`}
          />
        </section>

        {item.deliverables.length > 0 ? (
          <section>
            <p className="text-sm font-semibold text-foreground">Output</p>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              {item.deliverables.slice(0, 4).map((deliverable) => (
                <li key={deliverable} className="line-clamp-1">
                  {deliverable}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {item.addons.length > 0 ? (
          <section>
            <p className="text-sm font-semibold text-foreground">Add-on</p>
            <div className="mt-2 space-y-2">
              {item.addons.map((addon) => (
                <SummaryRow key={addon.id} label={addon.name} value={addon.price} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-3 border-t border-border/70 pt-4">
          <SummaryRow label="Subtotal layanan" value={serviceSubtotal} />
          <SummaryRow label="Add-on" value={addonTotal} />
          <SummaryRow label="Biaya admin" value={adminFee} />
          <div className="flex min-w-0 items-end justify-between gap-4 rounded-xl bg-slate-950 px-4 py-3 text-white">
            <span className="min-w-0 truncate text-sm font-medium text-white/70">Total pembayaran</span>
            <strong className="shrink-0 text-lg tracking-tight sm:text-xl">{formatCurrency(totalPayment)}</strong>
          </div>
        </section>
      </div>
    </aside>
  );
}

function FactRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-border/70 bg-background px-3 py-2 text-sm">
      <span className="flex min-w-0 items-center gap-2 text-muted-foreground">
        {icon}
        <span className="truncate">{label}</span>
      </span>
      <span className="shrink-0 font-semibold text-foreground">{value}</span>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="min-w-0 truncate text-muted-foreground">{label}</span>
      <span className="shrink-0 font-semibold text-foreground">{formatCurrency(value)}</span>
    </div>
  );
}
