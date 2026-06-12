import {
  CheckCircle2,
  Clock3,
  FileText,
  Layers3,
  PenLine,
  PlusCircle,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SubmitButton } from "@/components/common/submit-button";
import { removeCartItem } from "@/features/cart/actions/cart-actions";
import { formatCurrency } from "@/lib/formatters/currency";

export type CartDisplayItem = {
  readonly id: string;
  readonly serviceTitle: string;
  readonly creatorName: string;
  readonly tierName: string;
  readonly tierPrice: number;
  readonly addonTotal: number;
  readonly categoryName: string;
  readonly categoryDescription: string;
  readonly subtotal: number;
  readonly estimatedDays: number;
  readonly revisionCount: number;
  readonly deliverables: readonly string[];
  readonly addons: readonly {
    readonly id: string;
    readonly name: string;
    readonly price: number;
  }[];
};

type CartServiceSummaryProps = {
  items: readonly CartDisplayItem[];
};

export function CartServiceSummary({ items }: CartServiceSummaryProps) {
  return (
    <section
      aria-labelledby="cart-service-summary-title"
      className="min-w-0 overflow-hidden rounded-2xl border border-border/70 bg-card/90 shadow-[var(--shadow-card)]"
    >
      <div className="flex flex-col gap-3 border-b border-border/70 bg-[linear-gradient(135deg,var(--surface-elevated),var(--surface-soft))] p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
        <div>
          <p className="text-sm font-semibold text-primary">Keranjang UMKM</p>
          <h2
            id="cart-service-summary-title"
            className="mt-2 text-2xl font-semibold tracking-tight text-foreground"
          >
            Paket jasa digital terpilih
          </h2>
        </div>
        <Badge variant="secondary" className="w-fit rounded-lg">
          Server-side
        </Badge>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        {items.length > 0 ? (
          items.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-2xl border border-border/70 bg-background shadow-[var(--shadow-soft)]"
            >
              <div className="flex flex-col gap-4 bg-[linear-gradient(135deg,var(--brand-navy-950),var(--brand-teal-900))] p-4 text-white lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2">
                    <Badge className="rounded-lg bg-white/15 text-white hover:bg-white/20">
                      {item.tierName}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="rounded-lg border-white/10 bg-white/10 text-white"
                    >
                      {item.categoryName}
                    </Badge>
                  </div>
                  <h3 className="mt-3 break-words text-xl font-semibold tracking-tight text-white">
                    {item.serviceTitle}
                  </h3>
                  <p className="mt-3 flex items-center gap-2 text-sm text-white/75">
                    <UserRound className="size-4 text-white/70" aria-hidden="true" />
                    Kreator: {item.creatorName}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-left backdrop-blur lg:text-right">
                  <p className="text-xs font-medium uppercase text-white/65">
                    Harga tier
                  </p>
                  <p className="mt-1 text-xl font-semibold text-white">
                    {formatCurrency(item.tierPrice)}
                  </p>
                </div>
              </div>

              <div className="p-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  <ServiceMetric
                    icon={Layers3}
                    label="Kategori layanan"
                    value={item.categoryName}
                  />
                  <ServiceMetric
                    icon={Clock3}
                    label="Estimasi pengerjaan"
                    value={`${item.estimatedDays} hari`}
                  />
                  <ServiceMetric
                    icon={PenLine}
                    label="Batas revisi"
                    value={`${item.revisionCount} kali revisi`}
                  />
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
                  <div className="rounded-2xl border border-border/70 bg-muted/25 p-4">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <FileText className="size-4 text-primary" aria-hidden="true" />
                      Output paket jasa
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.categoryDescription}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {item.deliverables.map((deliverable) => (
                        <li
                          key={deliverable}
                          className="flex items-start gap-2 text-sm leading-6 text-muted-foreground"
                        >
                          <CheckCircle2
                            className="mt-1 size-4 shrink-0 text-primary"
                            aria-hidden="true"
                          />
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-border/70 bg-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <PlusCircle className="size-4 text-primary" aria-hidden="true" />
                        Add-on terpilih
                      </h4>
                      <form action={removeCartItem}>
                        <input type="hidden" name="itemId" value={item.id} />
                        <SubmitButton
                          pendingLabel="Menghapus..."
                          variant="outline"
                          size="sm"
                          className="h-8 bg-background"
                        >
                          Hapus
                        </SubmitButton>
                      </form>
                    </div>
                    {item.addons.length > 0 ? (
                      <div className="mt-4 space-y-2">
                        {item.addons.map((addon) => (
                          <div
                            key={addon.id}
                            className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-muted/30 px-3 py-2 text-sm"
                          >
                            <span className="font-medium text-foreground">
                              {addon.name}
                            </span>
                            <span className="shrink-0 font-semibold text-primary">
                              {formatCurrency(addon.price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 rounded-xl border border-dashed border-border px-3 py-3 text-sm text-muted-foreground">
                        Tidak ada add-on terpilih.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-background p-6 text-center">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">
              Belum ada paket jasa di keranjang.
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Pilih paket jasa dari katalog kreator untuk mulai menyusun brief campaign.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

type ServiceMetricProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function ServiceMetric({ icon: Icon, label, value }: ServiceMetricProps) {
  return (
    <div className="flex min-h-20 items-center gap-3 rounded-2xl border border-border/70 bg-muted/30 p-3">
      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="size-4" aria-hidden="true" />
      </div>
      <div>
        <p className="text-xs font-medium uppercase text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
