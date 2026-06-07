import Link from "next/link";
import { ArrowRight, ReceiptText, WalletCards } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters/currency";

type CartPaymentSummaryProps = {
  addonTotal: number;
  adminFee: number;
  ctaHref: string;
  ctaLabel: string;
  serviceSubtotal: number;
  totalPayment: number;
};

export function CartPaymentSummary({
  addonTotal,
  adminFee,
  ctaHref,
  ctaLabel,
  serviceSubtotal,
  totalPayment,
}: CartPaymentSummaryProps) {
  return (
    <aside
      aria-labelledby="cart-payment-summary-title"
      className="overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(150deg,var(--brand-navy-950),var(--brand-teal-900))] text-white shadow-[var(--shadow-card)] lg:sticky lg:top-24"
    >
      <div className="p-5">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-2xl border border-white/10 bg-white/10 text-white">
            <ReceiptText className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white/75">Ringkasan</p>
            <h2
              id="cart-payment-summary-title"
              className="text-xl font-semibold tracking-tight text-white"
            >
              Total pembayaran
            </h2>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur">
          <p className="flex items-center gap-2 text-sm font-medium text-white/70">
            <WalletCards className="size-4 text-white" aria-hidden="true" />
            Nominal yang akan dilanjutkan
          </p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-white">
            {formatCurrency(totalPayment)}
          </p>
        </div>

        <dl className="mt-6 space-y-3">
          <SummaryRow label="Subtotal layanan" value={serviceSubtotal} />
          <SummaryRow label="Add-on" value={addonTotal} />
          <SummaryRow label="Biaya admin" value={adminFee} />
        </dl>

        <p className="mt-5 text-sm leading-6 text-white/68">
          Pastikan detail layanan dan brief sudah sesuai sebelum melanjutkan ke
          pembayaran. Nominal ini masih berasal dari dummy data.
        </p>

        <Button
          asChild
          size="lg"
          className="mt-5 h-11 w-full bg-white text-brand-navy hover:bg-white/90"
        >
          <Link href={ctaHref}>
            {ctaLabel}
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </aside>
  );
}

type SummaryRowProps = {
  label: string;
  value: number;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 text-sm last:border-b-0 last:pb-0">
      <dt className="text-white/65">{label}</dt>
      <dd className="font-semibold text-white">{formatCurrency(value)}</dd>
    </div>
  );
}
