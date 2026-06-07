import Link from "next/link";
import { CreditCard, ReceiptText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
import type { DummyOrder, DummyPayment } from "@/lib/dummy";
import { formatCurrency } from "@/lib/formatters/currency";

type OrderPaymentSummaryCardProps = {
  order: DummyOrder;
  payment: DummyPayment | null;
};

export function OrderPaymentSummaryCard({
  order,
  payment,
}: OrderPaymentSummaryCardProps) {
  return (
    <aside
      aria-labelledby="order-payment-summary-title"
      className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-card)]"
    >
      <div className="bg-[linear-gradient(135deg,var(--brand-navy-950),var(--brand-teal-900))] p-5 text-white">
        <p className="flex items-center gap-2 text-sm font-medium text-white/70">
          <ReceiptText className="size-4 text-white" aria-hidden="true" />
          Ringkasan pembayaran
        </p>
        <h2
          id="order-payment-summary-title"
          className="mt-2 text-2xl font-semibold tracking-tight text-white"
        >
          {formatCurrency(order.totalAmount)}
        </h2>
        <div className="mt-4">
          {payment ? <PaymentStatusBadge status={payment.paymentStatus} /> : null}
        </div>
      </div>

      <div className="p-5">
        <dl className="space-y-3 text-sm">
          <SummaryRow label="Subtotal layanan" value={order.subtotalAmount} />
          <SummaryRow label="Add-on" value={order.addonAmount} />
          <SummaryRow label="Biaya admin" value={order.adminFee} />
        </dl>

        {payment ? (
          <Button asChild variant="outline" className="mt-5 h-11 w-full">
            <Link href={`/umkm/payments/${payment.id}`}>
              <CreditCard aria-hidden="true" />
              Lihat Invoice
            </Link>
          </Button>
        ) : null}
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
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-foreground">{formatCurrency(value)}</dd>
    </div>
  );
}
