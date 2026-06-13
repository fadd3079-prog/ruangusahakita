import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  FileText,
  ReceiptText,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { PaymentGatewayModal } from "@/features/payments/components/payment-gateway-modal";
import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
import type { CurrentUmkmPaymentDetail } from "@/features/payments/data/payment-queries";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";

type PaymentDetailSummaryProps = {
  detail: CurrentUmkmPaymentDetail;
};

export function PaymentFlowSteps({ detail }: PaymentDetailSummaryProps) {
  const paymentDone = detail.payment.payment_status === "paid";
  const steps = [
    { label: "Brief", state: "done" },
    { label: "Pembayaran", state: paymentDone ? "done" : "active" },
    { label: "Selesai", state: paymentDone ? "done" : "idle" },
  ] as const;

  return (
    <section className="rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-[var(--shadow-soft)]">
      <div className="grid gap-2 sm:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.label} className="flex items-center gap-3 rounded-xl bg-muted/30 px-3 py-2">
            <span
              className={
                step.state === "done"
                  ? "grid size-7 shrink-0 place-items-center rounded-full bg-emerald-600 text-white"
                  : step.state === "active"
                    ? "grid size-7 shrink-0 place-items-center rounded-full bg-blue-600 text-sm font-semibold text-white"
                    : "grid size-7 shrink-0 place-items-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700"
              }
            >
              {step.state === "done" ? (
                <CheckCircle2 className="size-4" aria-hidden="true" />
              ) : (
                index + 1
              )}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{step.label}</p>
              <p className="text-xs text-muted-foreground">
                {step.state === "done"
                  ? "Selesai"
                  : step.state === "active"
                    ? "Diproses"
                    : "Menunggu"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PaymentDetailSummary({ detail }: PaymentDetailSummaryProps) {
  const canPay = getCanPay(detail);
  const serviceTitle = detail.primaryItem?.service_title ?? "Paket jasa digital";
  const creatorName = detail.creator?.display_name ?? "Kreator";

  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-800">
            <WalletCards className="size-4" aria-hidden="true" />
            Pembayaran
          </p>
          <h1 className="mt-4 line-clamp-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {detail.payment.payment_number}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Order {detail.order.order_number}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 lg:justify-end">
          <PaymentStatusBadge status={detail.payment.payment_status} />
          <OrderStatusBadge status={detail.order.order_status} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
        <div className="rounded-xl border border-border/70 bg-background p-4">
          <div className="flex items-start gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <FileText className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Layanan digital
              </p>
              <h2 className="mt-1 line-clamp-2 text-lg font-semibold tracking-tight text-foreground">
                {serviceTitle}
              </h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <UserRound className="size-4" aria-hidden="true" />
                {creatorName}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-slate-950 p-4 text-white">
          <p className="text-sm text-white/70">Total pembayaran</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">
            {formatCurrency(Number(detail.payment.amount))}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-950">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-blue-700" aria-hidden="true" />
          <p className="text-sm leading-6">
            Pilih metode pembayaran di modal sandbox. Status pembayaran diproses lewat server agar alur tetap aman.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
        <PaymentGatewayModal
          amount={Number(detail.order.total_amount)}
          canPay={canPay}
          orderId={detail.order.id}
          paymentId={detail.payment.id}
          paymentNumber={detail.payment.payment_number}
          serviceTitle={serviceTitle}
        />
        <Button asChild variant="outline" className="h-11">
          <Link href={`/umkm/orders/${detail.order.id}`}>
            Lihat Pesanan
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>

      {!canPay ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Aksi bayar hanya tersedia saat pembayaran masih pending dan pesanan menunggu pembayaran.
        </p>
      ) : null}
    </section>
  );
}

export function InvoiceSummary({ detail }: PaymentDetailSummaryProps) {
  return (
    <aside className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)] lg:sticky lg:top-24">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-xl bg-muted text-foreground">
          <ReceiptText className="size-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">Ringkasan biaya</p>
          <p className="truncate text-xs text-muted-foreground">
            {detail.invoice?.invoice_number ?? detail.payment.payment_number}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3 text-sm">
        <MoneyRow label="Subtotal layanan" value={Number(detail.order.subtotal_amount)} />
        <MoneyRow label="Add-on" value={Number(detail.order.addon_amount)} />
        <MoneyRow label="Biaya admin" value={Number(detail.order.admin_fee)} />
        <div className="flex items-end justify-between gap-4 rounded-xl bg-muted/45 px-4 py-3">
          <span className="text-muted-foreground">Total</span>
          <strong className="text-xl tracking-tight text-foreground">
            {formatCurrency(Number(detail.order.total_amount))}
          </strong>
        </div>
      </div>

      <div className="mt-5 grid gap-2 text-sm">
        <InfoLine label="UMKM" value={detail.umkm.business_name} />
        <InfoLine
          label="Kreator"
          value={detail.creator?.display_name ?? "Kreator"}
        />
        <InfoLine label="Dibuat" value={formatDate(detail.payment.created_at)} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Badge variant="secondary" className="rounded-lg">
          Sandbox
        </Badge>
        <Badge variant="outline" className="rounded-lg">
          Server Action
        </Badge>
      </div>
      <div className="mt-5 grid gap-2">
        <Button asChild variant="outline" className="h-10 w-full">
          <Link href={`/umkm/orders/${detail.order.id}/invoice`}>
            Lihat Invoice
          </Link>
        </Button>
        {detail.order.payment_status === "paid" ? (
          <Button asChild className="h-10 w-full">
            <Link href={`/umkm/orders/${detail.order.id}/receipt`}>
              Lihat Receipt
            </Link>
          </Button>
        ) : null}
      </div>
    </aside>
  );
}

export function PaymentContextCard({ detail }: PaymentDetailSummaryProps) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-3">
        <CreditCard className="size-5 text-primary" aria-hidden="true" />
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Status terpisah
        </h2>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <StatusPill label="Pembayaran" value={detail.payment.payment_status} />
        <StatusPill label="Pesanan" value={detail.order.order_status} />
      </div>
    </section>
  );
}

function MoneyRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{formatCurrency(value)}</span>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="max-w-40 truncate font-medium text-foreground">{value}</span>
    </div>
  );
}

function StatusPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/40 p-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function getCanPay(detail: CurrentUmkmPaymentDetail) {
  return (
    detail.payment.payment_status === "pending" &&
    detail.order.payment_status === "pending" &&
    detail.order.order_status === "awaiting_payment" &&
    Number(detail.payment.amount) === Number(detail.order.total_amount)
  );
}
