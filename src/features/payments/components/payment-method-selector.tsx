"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Building2,
  CreditCard,
  QrCode,
  ShieldCheck,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

import type { Database } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

type PaymentMethod = Database["public"]["Enums"]["payment_method"];
type DisplayPaymentMethod = PaymentMethod | "card";

export const paymentMethodLabels = {
  bank_transfer: "Transfer Bank",
  card: "Kartu debit/kredit",
  ewallet: "E-wallet",
  manual: "Manual",
  qris: "QRIS",
  virtual_account: "Virtual Account",
} satisfies Record<DisplayPaymentMethod, string>;

const paymentMethodOptions: readonly {
  badge: string;
  description: string;
  icon: LucideIcon;
  instructions: readonly string[];
  method: DisplayPaymentMethod;
  tone: "amber" | "blue" | "green" | "slate";
}[] = [
  {
    badge: "Paling cepat",
    description: "Scan kode QR dan konfirmasi pembayaran sandbox.",
    icon: QrCode,
    instructions: [
      "Scan QRIS menggunakan aplikasi pembayaran pilihan Anda.",
      "Pastikan nominal sesuai ringkasan invoice.",
      "Klik Saya Sudah Bayar untuk memproses status sandbox.",
    ],
    method: "qris",
    tone: "green",
  },
  {
    badge: "Populer",
    description: "Gunakan dompet digital untuk alur presentasi pembayaran.",
    icon: WalletCards,
    instructions: [
      "Pilih aplikasi e-wallet yang ingin digunakan.",
      "Gunakan nomor transaksi sandbox yang ditampilkan pada invoice.",
      "Klik Saya Sudah Bayar setelah proses presentasi selesai.",
    ],
    method: "ewallet",
    tone: "blue",
  },
  {
    badge: "Akun bisnis",
    description: "Gunakan nomor virtual untuk transfer terarah.",
    icon: CreditCard,
    instructions: [
      "Gunakan virtual account sandbox 8808 2400 1122.",
      "Masukkan nominal sesuai total pembayaran.",
      "Status baru berubah setelah tombol sandbox diproses.",
    ],
    method: "virtual_account",
    tone: "amber",
  },
  {
    badge: "Alternatif",
    description: "Transfer manual untuk kebutuhan uji alur UMKM.",
    icon: Building2,
    instructions: [
      "Gunakan rekening sandbox RUK 1122 3344 5566.",
      "Simpan bukti pembayaran sebagai catatan internal.",
      "Klik Saya Sudah Bayar untuk melanjutkan status pembayaran.",
    ],
    method: "bank_transfer",
    tone: "slate",
  },
  {
    badge: "Preview UI",
    description: "Tampilan kartu untuk mode sandbox payment gateway.",
    icon: CreditCard,
    instructions: [
      "Masukkan data kartu hanya pada gateway resmi saat sudah terintegrasi.",
      "Pada halaman ini tidak ada data kartu yang disimpan.",
      "Gunakan tombol sandbox untuk menyelesaikan proses pengujian.",
    ],
    method: "card",
    tone: "blue",
  },
];

type PaymentMethodSelectorProps = {
  selectedMethod: PaymentMethod | null;
};

export function PaymentMethodSelector({
  selectedMethod,
}: PaymentMethodSelectorProps) {
  const initialMethod = selectedMethod ?? "qris";
  const [activeMethod, setActiveMethod] = useState<DisplayPaymentMethod>(
    initialMethod === "manual" ? "qris" : initialMethod,
  );
  const activeOption =
    paymentMethodOptions.find((option) => option.method === activeMethod) ??
    paymentMethodOptions[0];
  const ActiveIcon = activeOption.icon;

  return (
    <section
      aria-labelledby="payment-method-selector-title"
      className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-[var(--shadow-card)]"
    >
      <div className="border-b border-border/70 bg-[linear-gradient(135deg,var(--surface-elevated),var(--surface-soft))] p-5">
        <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
          <ShieldCheck className="size-4" aria-hidden="true" />
          Gateway sandbox
        </p>
        <h2
          id="payment-method-selector-title"
          className="mt-4 text-2xl font-semibold tracking-tight text-foreground"
        >
          Pilih metode pembayaran
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Pilih metode, ikuti instruksi singkat, lalu konfirmasi pembayaran sandbox.
        </p>
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="grid gap-3">
          {paymentMethodOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = option.method === activeMethod;

            return (
              <button
                key={option.method}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setActiveMethod(option.method)}
                className={cn(
                  "rounded-2xl border p-4 text-left transition-colors",
                  isSelected
                    ? getSelectedMethodClass(option.tone)
                    : "border-border/70 bg-background hover:border-primary/25 hover:bg-muted/45",
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "grid size-11 shrink-0 place-items-center rounded-xl",
                      isSelected
                        ? getSelectedIconClass(option.tone)
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {paymentMethodLabels[option.method]}
                      </p>
                      <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[0.68rem] font-semibold", getBadgeClass(option.tone))}>
                        {option.badge}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="rounded-2xl border border-border/70 bg-background p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Metode dipilih
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                {paymentMethodLabels[activeOption.method]}
              </h3>
            </div>
            <div className={cn("grid size-12 place-items-center rounded-2xl", getSelectedIconClass(activeOption.tone))}>
              <ActiveIcon className="size-5" aria-hidden="true" />
            </div>
          </div>

          {activeOption.method === "qris" ? (
            <div className="mt-5 rounded-2xl border border-border/70 bg-white p-4">
              <Image
                src="/qris/qris.png"
                alt="Kode QRIS sandbox Ruang Usaha Kita"
                width={360}
                height={360}
                className="mx-auto h-auto w-full max-w-64 rounded-xl"
                priority={false}
              />
            </div>
          ) : (
            <div className={cn("mt-5 rounded-2xl border p-4", getInstructionPanelClass(activeOption.tone))}>
              <p className="text-sm font-semibold">Instruksi pembayaran</p>
              <p className="mt-1 text-sm opacity-80">
                Tidak ada transaksi nyata pada mode sandbox ini.
              </p>
            </div>
          )}

          <ol className="mt-5 space-y-3">
            {activeOption.instructions.map((item, index) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                <span className={cn("grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold", getNumberClass(activeOption.tone))}>
                  {index + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function getSelectedMethodClass(tone: "amber" | "blue" | "green" | "slate") {
  const classes = {
    amber: "border-amber-300 bg-amber-50",
    blue: "border-blue-300 bg-blue-50",
    green: "border-emerald-300 bg-emerald-50",
    slate: "border-slate-300 bg-slate-50",
  };

  return classes[tone];
}

function getSelectedIconClass(tone: "amber" | "blue" | "green" | "slate") {
  const classes = {
    amber: "bg-amber-500 text-white",
    blue: "bg-blue-600 text-white",
    green: "bg-emerald-600 text-white",
    slate: "bg-slate-800 text-white",
  };

  return classes[tone];
}

function getBadgeClass(tone: "amber" | "blue" | "green" | "slate") {
  const classes = {
    amber: "bg-amber-100 text-amber-800",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-emerald-100 text-emerald-800",
    slate: "bg-slate-100 text-slate-700",
  };

  return classes[tone];
}

function getInstructionPanelClass(tone: "amber" | "blue" | "green" | "slate") {
  const classes = {
    amber: "border-amber-200 bg-amber-50 text-amber-900",
    blue: "border-blue-200 bg-blue-50 text-blue-900",
    green: "border-emerald-200 bg-emerald-50 text-emerald-900",
    slate: "border-slate-200 bg-slate-50 text-slate-900",
  };

  return classes[tone];
}

function getNumberClass(tone: "amber" | "blue" | "green" | "slate") {
  const classes = {
    amber: "bg-amber-100 text-amber-800",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-emerald-100 text-emerald-800",
    slate: "bg-slate-100 text-slate-700",
  };

  return classes[tone];
}
