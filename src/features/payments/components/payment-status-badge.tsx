import { Badge } from "@/components/ui/badge";
import type { DummyPaymentStatus } from "@/lib/dummy";
import { cn } from "@/lib/utils";

const paymentStatusLabels = {
  expired: "Kedaluwarsa",
  failed: "Gagal",
  paid: "Dibayar",
  pending: "Menunggu Pembayaran",
  refunded: "Refund",
} satisfies Record<DummyPaymentStatus, string>;

const paymentStatusClasses = {
  expired: "border-amber-200 bg-amber-50 text-amber-800",
  failed: "border-red-200 bg-red-50 text-red-700",
  paid: "border-primary/20 bg-primary/10 text-primary",
  pending: "border-sky-200 bg-sky-50 text-sky-700",
  refunded: "border-slate-200 bg-slate-50 text-slate-700",
} satisfies Record<DummyPaymentStatus, string>;

type PaymentStatusBadgeProps = {
  status: DummyPaymentStatus;
};

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-lg", paymentStatusClasses[status])}
    >
      {paymentStatusLabels[status]}
    </Badge>
  );
}

export function getPaymentStatusLabel(status: DummyPaymentStatus) {
  return paymentStatusLabels[status];
}
