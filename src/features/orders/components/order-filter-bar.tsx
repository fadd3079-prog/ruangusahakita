const orderStatusFilters = [
  "Semua",
  "Menunggu Pembayaran",
  "Konten Diproduksi",
  "Hasil Dikirim",
  "Revisi Diminta",
  "Selesai",
] as const;

const paymentStatusFilters = [
  "Semua Pembayaran",
  "Dibayar",
  "Menunggu Pembayaran",
  "Kedaluwarsa",
] as const;

type OrderFilterBarProps = {
  showPaymentFilter?: boolean;
};

export function OrderFilterBar({ showPaymentFilter = false }: OrderFilterBarProps) {
  return (
    <section
      aria-label="Filter status pesanan"
      className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]"
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Filter UI</p>
          <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
            Pilih status untuk monitoring
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Filter ini masih tampilan dummy dan belum terhubung ke query data.
          </p>
        </div>
        <div className="space-y-3">
          <FilterButtonGroup labels={orderStatusFilters} />
          {showPaymentFilter ? <FilterButtonGroup labels={paymentStatusFilters} /> : null}
        </div>
      </div>
    </section>
  );
}

type FilterButtonGroupProps = {
  labels: readonly string[];
};

function FilterButtonGroup({ labels }: FilterButtonGroupProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {labels.map((label, index) => (
        <button
          key={label}
          type="button"
          className={
            index === 0
              ? "rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
              : "rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted"
          }
        >
          {label}
        </button>
      ))}
    </div>
  );
}
