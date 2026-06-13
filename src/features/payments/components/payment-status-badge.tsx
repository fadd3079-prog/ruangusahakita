import { Badge } from "@/components/ui/badge";
import type { Database } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

type PaymentStatus = Database["public"]["Enums"]["payment_status"];

const paymentStatusLabels = {
  expired: "Kedaluwarsa",
  failed: "Gagal",
  partially_refunded: "Refund Sebagian",
  paid: "Dibayar",
  pending: "Menunggu Pembayaran",
  refunded: "Refund",
} satisfies Record<PaymentStatus, string>;

const paymentStatusClasses = {
  expired: "border-amber-200 bg-amber-50 text-amber-800",
  failed: "border-red-200 bg-red-50 text-red-700",
  partially_refunded: "border-slate-200 bg-slate-50 text-slate-700",
  paid: "border-emerald-200 bg-emerald-50 text-emerald-800",
  pending: "border-sky-200 bg-sky-50 text-sky-700",
  refunded: "border-slate-200 bg-slate-50 text-slate-700",
} satisfies Record<PaymentStatus, string>;

type PaymentStatusBadgeProps = {
  status: PaymentStatus;
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

export function getPaymentStatusLabel(status: PaymentStatus) {
  return paymentStatusLabels[status];
}
