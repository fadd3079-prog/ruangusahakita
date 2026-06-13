"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  CheckCircle2,
  CreditCard,
  Loader2,
  QrCode,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import { SubmitButton } from "@/components/common/submit-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  markSandboxPaymentAsPaidWithState,
  type PaymentActionState,
} from "@/features/payments/actions/payment-actions";
import { formatCurrency } from "@/lib/formatters/currency";
import type { Database } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";

type PaymentMethod = Database["public"]["Enums"]["payment_method"];
type DisplayPaymentMethod = PaymentMethod | "card";

const initialState: PaymentActionState = {
  message: "",
  ok: false,
};

const methods: readonly {
  icon: LucideIcon;
  instructions: readonly string[];
  label: string;
  method: DisplayPaymentMethod;
  tone: "amber" | "blue" | "green" | "slate";
}[] = [
  {
    icon: QrCode,
    instructions: [
      "Scan QRIS sesuai nominal.",
      "Konfirmasi setelah pembayaran.",
    ],
    label: "QRIS",
    method: "qris",
    tone: "green",
  },
  {
    icon: WalletCards,
    instructions: [
      "Pilih e-wallet pilihan Anda.",
      "Gunakan nomor pembayaran sandbox.",
    ],
    label: "E-wallet",
    method: "ewallet",
    tone: "blue",
  },
  {
    icon: Building2,
    instructions: [
      "Gunakan VA sandbox 8808 2400 1122.",
      "Pastikan nominal sesuai.",
    ],
    label: "Transfer/VA",
    method: "virtual_account",
    tone: "amber",
  },
  {
    icon: CreditCard,
    instructions: [
      "Preview kartu hanya untuk UI sandbox.",
      "Tidak ada data kartu yang disimpan.",
    ],
    label: "Kartu",
    method: "card",
    tone: "slate",
  },
];

type PaymentGatewayModalProps = {
  amount: number;
  canPay: boolean;
  orderId: string;
  paymentId: string;
  paymentNumber: string;
  serviceTitle: string;
};

export function PaymentGatewayModal({
  amount,
  canPay,
  orderId,
  paymentId,
  paymentNumber,
  serviceTitle,
}: PaymentGatewayModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<DisplayPaymentMethod>("qris");
  const [state, formAction, isPending] = useActionState(
    markSandboxPaymentAsPaidWithState,
    initialState,
  );
  const selected = methods.find((method) => method.method === selectedMethod) ?? methods[0];
  const SelectedIcon = selected.icon;

  useEffect(() => {
    if (!state.message) {
      return;
    }

    if (!state.ok) {
      toast.error(state.message);
      return;
    }

    toast.success(state.message);

    if (state.redirectTo) {
      const timeout = window.setTimeout(() => {
        router.push(state.redirectTo ?? `/umkm/orders/${orderId}`);
      }, 900);

      return () => window.clearTimeout(timeout);
    }
  }, [orderId, router, state]);

  function openGateway() {
    if (!canPay) {
      return;
    }

    setIsOpen(true);
    setIsPreparing(true);
    window.setTimeout(() => setIsPreparing(false), 650);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          onClick={openGateway}
          disabled={!canPay}
          className="h-11 w-full bg-blue-600 text-white hover:bg-blue-700"
        >
          Bayar Sekarang
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto rounded-3xl p-0 sm:max-w-xl">
        <div className="border-b border-border/70 bg-[linear-gradient(135deg,#0C2949,#114955)] p-5 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-white">
              Pembayaran Sandbox
            </DialogTitle>
            <DialogDescription className="text-white/70">
              Pilih metode, konfirmasi, lalu status diproses server.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/10 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/65">
              {paymentNumber}
            </p>
            <p className="mt-2 line-clamp-1 text-sm font-semibold text-white">
              {serviceTitle}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
              {formatCurrency(amount)}
            </p>
          </div>
        </div>

        <div className="p-5">
          {isPreparing ? (
            <div className="grid min-h-72 place-items-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-900">
              <div className="text-center">
                <Loader2 className="mx-auto size-8 animate-spin" aria-hidden="true" />
                <p className="mt-4 text-sm font-semibold">Mengarahkan ke pembayaran</p>
              </div>
            </div>
          ) : state.ok ? (
            <div className="grid min-h-72 place-items-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-900">
              <div className="text-center">
                <CheckCircle2 className="mx-auto size-12 text-emerald-600" aria-hidden="true" />
                <p className="mt-4 text-lg font-semibold">Pembayaran berhasil</p>
                <p className="mt-1 text-sm text-emerald-800">Pesanan diteruskan ke kreator.</p>
              </div>
            </div>
          ) : (
            <div className="grid gap-5">
              <div className="grid gap-2 sm:grid-cols-4">
                {methods.map((method) => {
                  const Icon = method.icon;
                  const isSelected = selectedMethod === method.method;

                  return (
                    <button
                      key={method.method}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedMethod(method.method)}
                      className={cn(
                        "rounded-2xl border p-3 text-left transition-colors",
                        isSelected
                          ? getSelectedMethodClass(method.tone)
                          : "border-border/70 bg-background hover:border-blue-200 hover:bg-blue-50",
                      )}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                      <span className="mt-3 block truncate text-sm font-semibold">
                        {method.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-border/70 bg-background p-4">
                <div className="flex items-center gap-3">
                  <div className={cn("grid size-10 place-items-center rounded-xl", getIconClass(selected.tone))}>
                    <SelectedIcon className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{selected.label}</p>
                    <p className="text-xs text-muted-foreground">Instruksi singkat sandbox</p>
                  </div>
                </div>

                {selected.method === "qris" ? (
                  <div className="mt-4 rounded-2xl border border-border/70 bg-white p-4">
                    <Image
                      src="/qris/qris.png"
                      alt="QRIS sandbox Ruang Usaha Kita"
                      width={280}
                      height={280}
                      className="mx-auto size-56 rounded-xl object-contain"
                    />
                  </div>
                ) : null}

                <ol className="mt-4 space-y-2">
                  {selected.instructions.map((instruction, index) => (
                    <li key={instruction} className="flex gap-2 text-sm text-muted-foreground">
                      <span className={cn("grid size-5 shrink-0 place-items-center rounded-full text-xs font-bold", getNumberClass(selected.tone))}>
                        {index + 1}
                      </span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <form action={formAction}>
                <input type="hidden" name="paymentId" value={paymentId} />
                <input type="hidden" name="method" value={selectedMethod} />
                <SubmitButton
                  pendingLabel="Memproses pembayaran..."
                  disabled={isPending || !canPay}
                  className="h-11 w-full bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Saya Sudah Bayar
                </SubmitButton>
              </form>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getSelectedMethodClass(tone: "amber" | "blue" | "green" | "slate") {
  const classes = {
    amber: "border-amber-300 bg-amber-50 text-amber-950",
    blue: "border-blue-300 bg-blue-50 text-blue-950",
    green: "border-emerald-300 bg-emerald-50 text-emerald-950",
    slate: "border-slate-300 bg-slate-50 text-slate-950",
  };

  return classes[tone];
}

function getIconClass(tone: "amber" | "blue" | "green" | "slate") {
  const classes = {
    amber: "bg-amber-500 text-white",
    blue: "bg-blue-600 text-white",
    green: "bg-emerald-600 text-white",
    slate: "bg-slate-800 text-white",
  };

  return classes[tone];
}

function getNumberClass(tone: "amber" | "blue" | "green" | "slate") {
  const classes = {
    amber: "bg-amber-100 text-amber-800",
    blue: "bg-blue-100 text-blue-800",
    green: "bg-emerald-100 text-emerald-800",
    slate: "bg-slate-100 text-slate-800",
  };

  return classes[tone];
}
