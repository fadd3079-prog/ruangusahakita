import { Badge } from "@/components/ui/badge";
import type { DummyOrderStatus } from "@/lib/dummy";
import { cn } from "@/lib/utils";

export const orderStatusLabels = {
  awaiting_payment: "Menunggu Pembayaran",
  brief_accepted: "Brief Diterima",
  cancelled: "Dibatalkan",
  completed: "Selesai",
  draft: "Draft",
  in_progress: "Konten Diproduksi",
  paid: "Dibayar",
  refunded: "Refund",
  revised: "Revisi Dikirim",
  revision_requested: "Revisi Diminta",
  submitted: "Hasil Dikirim",
  waiting_creator_confirmation: "Menunggu Konfirmasi Kreator",
} satisfies Record<DummyOrderStatus, string>;

const orderStatusClasses = {
  awaiting_payment: "border-sky-200 bg-sky-50 text-sky-700",
  brief_accepted: "border-primary/20 bg-primary/10 text-primary",
  cancelled: "border-slate-200 bg-slate-50 text-slate-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  draft: "border-slate-200 bg-slate-50 text-slate-700",
  in_progress: "border-primary/20 bg-primary/10 text-primary",
  paid: "border-primary/20 bg-primary/10 text-primary",
  refunded: "border-slate-200 bg-slate-50 text-slate-700",
  revised: "border-violet-200 bg-violet-50 text-violet-700",
  revision_requested: "border-amber-200 bg-amber-50 text-amber-800",
  submitted: "border-indigo-200 bg-indigo-50 text-indigo-700",
  waiting_creator_confirmation: "border-cyan-200 bg-cyan-50 text-cyan-700",
} satisfies Record<DummyOrderStatus, string>;

type OrderStatusBadgeProps = {
  status: DummyOrderStatus;
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-lg", orderStatusClasses[status])}
    >
      {orderStatusLabels[status]}
    </Badge>
  );
}
