import { Building2, CreditCard, QrCode, WalletCards, type LucideIcon } from "lucide-react";

import type { Database } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

type PaymentMethod = Database["public"]["Enums"]["payment_method"];
type DisplayPaymentMethod = PaymentMethod | "e_wallet";

export const paymentMethodLabels = {
  bank_transfer: "Transfer Bank",
  e_wallet: "E-Wallet",
  ewallet: "E-Wallet",
  manual: "Manual",
  qris: "QRIS",
  virtual_account: "Virtual Account",
} satisfies Record<DisplayPaymentMethod, string>;

const paymentMethodOptions: readonly {
  description: string;
  icon: LucideIcon;
  method: PaymentMethod;
}[] = [
  {
    description: "Simulasi kode bayar QR untuk alur pembayaran cepat.",
    icon: QrCode,
    method: "qris",
  },
  {
    description: "Simulasi nomor virtual untuk pembayaran dummy.",
    icon: CreditCard,
    method: "virtual_account",
  },
  {
    description: "Simulasi instruksi transfer untuk kebutuhan presentasi.",
    icon: Building2,
    method: "bank_transfer",
  },
  {
    description: "Simulasi dompet digital untuk tahap MVP.",
    icon: WalletCards,
    method: "ewallet",
  },
  {
    description: "Simulasi verifikasi manual untuk pembayaran dummy.",
    icon: WalletCards,
    method: "manual",
  },
];

type PaymentMethodSelectorProps = {
  selectedMethod: PaymentMethod | null;
};

export function PaymentMethodSelector({
  selectedMethod,
}: PaymentMethodSelectorProps) {
  return (
    <section
      aria-labelledby="payment-method-selector-title"
      className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]"
    >
      <p className="text-sm font-semibold text-primary">Metode pembayaran</p>
      <h2
        id="payment-method-selector-title"
        className="mt-2 text-2xl font-semibold tracking-tight text-foreground"
      >
        Pilih metode simulasi
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Pilihan ini hanya tampilan UI. Integrasi gateway pembayaran akan
        disiapkan pada tahap berikutnya.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {paymentMethodOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = option.method === selectedMethod;

          return (
            <button
              key={option.method}
              type="button"
              className={cn(
                "rounded-2xl border p-4 text-left transition-colors",
                isSelected
                  ? "border-primary/40 bg-primary/10 shadow-[var(--shadow-soft)]"
                  : "border-border/70 bg-background hover:bg-muted/40",
              )}
            >
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-xl",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {paymentMethodLabels[option.method]}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
