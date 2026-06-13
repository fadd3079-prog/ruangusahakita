import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Database } from "@/lib/supabase/types";

type OrderStatus = Database["public"]["Enums"]["order_status"];
type PaymentStatus = Database["public"]["Enums"]["payment_status"];

export type OrderListFilters = {
  paymentStatus: PaymentStatus | "all";
  query: string;
  sort: "latest" | "deadline" | "total";
  status: OrderStatus | "all";
};

type OrderFilterBarProps = {
  filters?: OrderListFilters;
  showPaymentFilter?: boolean;
};

const orderStatusOptions: readonly { label: string; value: OrderStatus | "all" }[] = [
  { label: "Semua status", value: "all" },
  { label: "Menunggu pembayaran", value: "awaiting_payment" },
  { label: "Menunggu kreator", value: "waiting_creator_confirmation" },
  { label: "Dikerjakan", value: "in_progress" },
  { label: "Hasil dikirim", value: "submitted" },
  { label: "Revisi diminta", value: "revision_requested" },
  { label: "Selesai", value: "completed" },
];

const paymentStatusOptions: readonly { label: string; value: PaymentStatus | "all" }[] = [
  { label: "Semua pembayaran", value: "all" },
  { label: "Dibayar", value: "paid" },
  { label: "Menunggu", value: "pending" },
  { label: "Gagal", value: "failed" },
  { label: "Kedaluwarsa", value: "expired" },
];

const sortOptions: readonly { label: string; value: OrderListFilters["sort"] }[] = [
  { label: "Terbaru", value: "latest" },
  { label: "Deadline", value: "deadline" },
  { label: "Total tertinggi", value: "total" },
];

export function OrderFilterBar({
  filters = {
    paymentStatus: "all",
    query: "",
    sort: "latest",
    status: "all",
  },
  showPaymentFilter = false,
}: OrderFilterBarProps) {
  return (
    <section
      aria-label="Filter status pesanan"
      className="rounded-2xl border border-border/70 bg-card p-4 shadow-[var(--shadow-soft)]"
    >
      <form className="grid gap-3 lg:grid-cols-[minmax(220px,1fr)_180px_180px_160px_auto] lg:items-end">
        <label className="grid gap-2">
          <span className="text-xs font-semibold uppercase text-muted-foreground">
            Cari
          </span>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="q"
              defaultValue={filters.query}
              placeholder="Nomor, layanan, atau nama"
              className="h-11 pl-9"
            />
          </div>
        </label>
        <SelectField
          label="Status pesanan"
          name="status"
          options={orderStatusOptions}
          value={filters.status}
        />
        {showPaymentFilter ? (
          <SelectField
            label="Pembayaran"
            name="payment"
            options={paymentStatusOptions}
            value={filters.paymentStatus}
          />
        ) : (
          <input type="hidden" name="payment" value="all" />
        )}
        <SelectField
          label="Urutkan"
          name="sort"
          options={sortOptions}
          value={filters.sort}
        />
        <div className="grid grid-cols-2 gap-2 lg:flex">
          <Button type="submit" className="h-11">
            Terapkan
          </Button>
          <Button asChild type="button" variant="outline" className="h-11">
            <a href="?">Reset</a>
          </Button>
        </div>
      </form>
    </section>
  );
}

function SelectField<TValue extends string>({
  label,
  name,
  options,
  value,
}: {
  label: string;
  name: string;
  options: readonly { label: string; value: TValue }[];
  value: TValue;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-semibold uppercase text-muted-foreground">
        {label}
      </span>
      <select
        name={name}
        defaultValue={value}
        className="h-11 rounded-xl border border-input bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-[3px] focus:ring-ring/20"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
