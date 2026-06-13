import { Badge } from "@/components/ui/badge";
import type { Database } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

type OrderStatus = Database["public"]["Enums"]["order_status"];

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
} satisfies Record<OrderStatus, string>;

const orderStatusClasses = {
  awaiting_payment: "border-sky-200 bg-sky-50 text-sky-700",
  brief_accepted: "border-emerald-200 bg-emerald-50 text-emerald-800",
  cancelled: "border-slate-200 bg-slate-50 text-slate-700",
  completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  draft: "border-slate-200 bg-slate-50 text-slate-700",
  in_progress: "border-blue-200 bg-blue-50 text-blue-800",
  paid: "border-emerald-200 bg-emerald-50 text-emerald-800",
  refunded: "border-slate-200 bg-slate-50 text-slate-700",
  revised: "border-violet-200 bg-violet-50 text-violet-700",
  revision_requested: "border-amber-200 bg-amber-50 text-amber-800",
  submitted: "border-indigo-200 bg-indigo-50 text-indigo-700",
  waiting_creator_confirmation: "border-cyan-200 bg-cyan-50 text-cyan-700",
} satisfies Record<OrderStatus, string>;

type OrderStatusBadgeProps = {
  status: OrderStatus;
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
