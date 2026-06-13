import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, Info, ReceiptText, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PaymentGatewayModal } from "@/features/payments/components/payment-gateway-modal";
import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import type { CurrentUmkmPaymentDetail } from "@/features/payments/data/payment-queries";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";

type PaymentDetailSummaryProps = {
  detail: CurrentUmkmPaymentDetail;
};

export function PaymentDetailSummary({ detail }: PaymentDetailSummaryProps) {
  const serviceTitle = detail.primaryItem?.service_title ?? "Paket jasa digital";
  const creatorName = detail.creator?.display_name ?? "Kreator";

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,var(--brand-navy-950),var(--brand-teal-900))] text-white shadow-[var(--shadow-card)]">
      <div className="grid gap-8 p-6 sm:p-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-end">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-semibold text-white/80">
            <ReceiptText className="size-4" aria-hidden="true" />
            Detail pembayaran sandbox
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {detail.payment.payment_number}
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-white/72 sm:text-base">
            Pembayaran untuk {serviceTitle} oleh {creatorName}. Status
            pembayaran dan status pesanan ditampilkan terpisah agar alur jasa
            digital tetap jelas.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <PaymentStatusBadge status={detail.payment.payment_status} />
            <OrderStatusBadge status={detail.order.order_status} />
            <span className="rounded-lg border border-white/10 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80">
              Order {detail.order.order_number}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
          <p className="flex items-center gap-2 text-sm font-medium text-white/70">
            <FileText className="size-4 text-white" aria-hidden="true" />
            Total pembayaran
          </p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-white">
            {formatCurrency(Number(detail.payment.amount))}
          </p>
          <dl className="mt-5 space-y-3 text-sm">
            <InfoRow label="UMKM" value={detail.umkm.business_name} />
            <InfoRow label="Kreator" value={creatorName} />
            <InfoRow label="Dibuat" value={formatDate(detail.payment.created_at)} />
          </dl>
        </div>
      </div>
    </section>
  );
}

export function PaymentFlowSteps({ detail }: PaymentDetailSummaryProps) {
  const paymentDone = detail.payment.payment_status === "paid";
  const steps = [
    { label: "Brief", state: "done" },
    { label: "Pembayaran", state: paymentDone ? "done" : "active" },
    { label: "Selesai", state: paymentDone ? "done" : "waiting" },
  ] as const;

  return (
    <section className="rounded-3xl border border-border/70 bg-card p-4 shadow-[var(--shadow-soft)]">
      <div className="grid gap-3 sm:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.label}
            className={
              step.state === "done"
                ? "rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900"
                : step.state === "active"
                  ? "rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-900"
                  : "rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900"
            }
          >
            <div className="flex items-center gap-3">
              <span
                className={
                  step.state === "done"
                    ? "grid size-8 place-items-center rounded-full bg-emerald-600 text-white"
                    : step.state === "active"
                      ? "grid size-8 place-items-center rounded-full bg-blue-600 text-white"
                      : "grid size-8 place-items-center rounded-full bg-amber-500 text-white"
                }
              >
                {step.state === "done" ? (
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </span>
              <div>
                <p className="text-sm font-semibold">{step.label}</p>
                <p className="mt-0.5 text-xs opacity-75">
                  {step.state === "done"
                    ? "Selesai"
                    : step.state === "active"
                      ? "Sedang berjalan"
                      : "Menunggu"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function InvoiceSummary({ detail }: PaymentDetailSummaryProps) {
  const canPay =
    detail.payment.payment_status === "pending" &&
    detail.order.payment_status === "pending" &&
    detail.order.order_status === "awaiting_payment" &&
    Number(detail.payment.amount) === Number(detail.order.total_amount);
  const serviceTitle = detail.primaryItem?.service_title ?? "Paket jasa digital";
  const creatorName = detail.creator?.display_name ?? "Kreator";

  return (
    <aside
      aria-labelledby="invoice-summary-title"
      className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[var(--shadow-card)] lg:sticky lg:top-24"
    >
      <div className="border-b border-border/70 bg-[linear-gradient(135deg,var(--surface-elevated),var(--surface-soft))] p-5">
        <p className="text-sm font-semibold text-primary">Ringkasan invoice</p>
        <h2
          id="invoice-summary-title"
          className="mt-2 text-xl font-semibold tracking-tight text-foreground"
        >
          {detail.invoice?.invoice_number ?? detail.payment.payment_number}
        </h2>
      </div>

      <div className="p-5">
        <article className="rounded-2xl border border-border/70 bg-background p-4">
          <p className="text-xs font-medium uppercase text-muted-foreground">
            Paket jasa
          </p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
            {serviceTitle}
          </h3>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <UserRound className="size-4 text-primary" aria-hidden="true" />
            Kreator: {creatorName}
          </p>
        </article>

        <dl className="mt-5 space-y-3 text-sm">
          <SummaryRow label="Subtotal layanan" value={Number(detail.order.subtotal_amount)} />
          <SummaryRow label="Add-on" value={Number(detail.order.addon_amount)} />
          <SummaryRow label="Biaya admin" value={Number(detail.order.admin_fee)} />
        </dl>

        <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-medium text-muted-foreground">
            Total pembayaran
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {formatCurrency(Number(detail.order.total_amount))}
          </p>
        </div>

        <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <p className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
            <Info className="mt-1 size-4 shrink-0 text-blue-700" aria-hidden="true" />
            Pembayaran pada halaman ini masih memakai alur sandbox. Status paid
            hanya dibuat lewat Server Action, bukan perubahan langsung dari
            client.
          </p>
        </div>

        <div className="mt-5 grid gap-2">
          <PaymentGatewayModal
            amount={Number(detail.order.total_amount)}
            canPay={canPay}
            orderId={detail.order.id}
            paymentId={detail.payment.id}
            paymentNumber={detail.payment.payment_number}
            serviceTitle={serviceTitle}
          />
          <Button asChild variant="outline" className="h-11 w-full">
            <Link href={`/umkm/orders/${detail.order.id}`}>
              Lihat Pesanan
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>

        {!canPay ? (
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            Aksi sandbox hanya tersedia untuk payment pending pada pesanan yang
            masih menunggu pembayaran dan nominalnya sesuai.
          </p>
        ) : null}
      </div>
    </aside>
  );
}

export function PaymentContextCard({ detail }: PaymentDetailSummaryProps) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]">
      <p className="text-sm font-semibold text-primary">Catatan pembayaran</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        Status pembayaran berbeda dari status pesanan
      </h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <ContextPill
          label="Status pembayaran"
          value={detail.payment.payment_status}
        />
        <ContextPill label="Status pesanan" value={detail.order.order_status} />
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        Pada integrasi nyata, perubahan status pembayaran hanya boleh berasal
        dari server atau webhook. Halaman ini memakai alur sandbox server-side agar
        pola keamanan tetap benar.
      </p>
    </section>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
      <dt className="text-white/65">{label}</dt>
      <dd className="font-semibold text-white">{value}</dd>
    </div>
  );
}

type SummaryRowProps = {
  label: string;
  value: number;
};

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-foreground">{formatCurrency(value)}</dd>
    </div>
  );
}

function ContextPill({ label, value }: InfoRowProps) {
  return (
    <div className="rounded-2xl border border-border/70 bg-muted/30 p-4">
      <p className="text-xs font-medium uppercase text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
