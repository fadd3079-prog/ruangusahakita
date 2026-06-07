import Link from "next/link";
import { ArrowRight, FileText, Info, ReceiptText, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
import type {
  DummyCreatorProfile,
  DummyOrder,
  DummyPayment,
  DummyServicePackage,
  DummyUmkmProfile,
} from "@/lib/dummy";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";

type PaymentDetailSummaryProps = {
  creator: DummyCreatorProfile;
  order: DummyOrder;
  payment: DummyPayment;
  service: DummyServicePackage;
  umkm: DummyUmkmProfile;
};

export function PaymentDetailSummary({
  creator,
  order,
  payment,
  service,
  umkm,
}: PaymentDetailSummaryProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,var(--brand-navy-950),var(--brand-teal-900))] text-white shadow-[var(--shadow-card)]">
      <div className="grid gap-8 p-6 sm:p-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-end">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-semibold text-white/80">
            <ReceiptText className="size-4" aria-hidden="true" />
            Detail pembayaran dummy
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {payment.paymentNumber}
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-white/72 sm:text-base">
            Pembayaran untuk {service.title} oleh {creator.displayName}. Status
            pembayaran dan status pesanan ditampilkan terpisah agar alur jasa
            digital tetap jelas.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <PaymentStatusBadge status={payment.paymentStatus} />
            <span className="rounded-lg border border-white/10 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80">
              Order {order.orderNumber}
            </span>
            <span className="rounded-lg border border-white/10 bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80">
              Invoice dummy
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
          <p className="flex items-center gap-2 text-sm font-medium text-white/70">
            <FileText className="size-4 text-white" aria-hidden="true" />
            Total pembayaran
          </p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-white">
            {formatCurrency(payment.amount)}
          </p>
          <dl className="mt-5 space-y-3 text-sm">
            <InfoRow label="UMKM" value={umkm.businessName} />
            <InfoRow label="Kreator" value={creator.displayName} />
            <InfoRow label="Dibuat" value={formatDate(payment.createdAt)} />
          </dl>
        </div>
      </div>
    </section>
  );
}

type InvoiceSummaryProps = {
  creator: DummyCreatorProfile;
  order: DummyOrder;
  payment: DummyPayment;
  service: DummyServicePackage;
};

export function InvoiceSummary({
  creator,
  order,
  payment,
  service,
}: InvoiceSummaryProps) {
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
          {payment.paymentNumber}
        </h2>
      </div>

      <div className="p-5">
        <article className="rounded-2xl border border-border/70 bg-background p-4">
          <p className="text-xs font-medium uppercase text-muted-foreground">
            Paket jasa
          </p>
          <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
            {service.title}
          </h3>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <UserRound className="size-4 text-primary" aria-hidden="true" />
            Kreator: {creator.displayName}
          </p>
        </article>

        <dl className="mt-5 space-y-3 text-sm">
          <SummaryRow label="Subtotal layanan" value={order.subtotalAmount} />
          <SummaryRow label="Add-on" value={order.addonAmount} />
          <SummaryRow label="Biaya admin" value={order.adminFee} />
        </dl>

        <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-medium text-muted-foreground">
            Total pembayaran
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {formatCurrency(order.totalAmount)}
          </p>
        </div>

        <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <p className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
            <Info className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
            Pembayaran pada halaman ini masih dummy dan siap menjadi dasar
            integrasi sandbox. Tombol simulasi tidak mengubah status apa pun.
          </p>
        </div>

        <div className="mt-5 grid gap-2">
          <Button type="button" className="h-11 w-full">
            Simulasikan Pembayaran Berhasil
          </Button>
          <Button asChild variant="outline" className="h-11 w-full">
            <Link href={`/umkm/orders/${order.id}`}>
              Lihat Pesanan
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </aside>
  );
}

type PaymentContextCardProps = {
  order: DummyOrder;
  payment: DummyPayment;
};

export function PaymentContextCard({ order, payment }: PaymentContextCardProps) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]">
      <p className="text-sm font-semibold text-primary">Catatan pembayaran</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        Status pembayaran berbeda dari status pesanan
      </h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <ContextPill label="Status pembayaran" value={payment.paymentStatus} />
        <ContextPill label="Status pesanan" value={order.orderStatus} />
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        Pada integrasi nyata, perubahan status pembayaran hanya boleh berasal
        dari server atau webhook. Halaman ini hanya menampilkan simulasi alur.
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
