import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarClock, CheckCircle2, FileText, ReceiptText, WalletCards } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderCollaborationPanel } from "@/features/orders/components/order-collaboration-panel";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
import {
  DeliveryHistoryPanel,
  RevisionHistoryPanel,
  UmkmDeliveryReviewPanel,
} from "@/features/submissions/components/delivery-panels";
import {
  getCurrentUmkmOrderDetail,
  type UmkmOrderBrief,
  type UmkmOrderDetail,
  type UmkmOrderDetailItem,
} from "@/features/orders/data/order-queries";
import { getOrderCollaborationData } from "@/features/orders/data/order-collaboration-queries";
import { getOrderDeliveryData } from "@/features/submissions/data/submission-queries";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";
import type { Database } from "@/lib/supabase/types";

type OrderStatus = Database["public"]["Enums"]["order_status"];

type OrderPageProps = {
  params: Promise<{
    orderId: string;
  }>;
  searchParams?: Promise<{
    already_paid?: string;
    completed?: string;
    created?: string;
    error?: string;
    complaint_created?: string;
    message_sent?: string;
    paid?: string;
    reviewed?: string;
    revision_requested?: string;
  }>;
};

export async function generateMetadata({
  params,
}: OrderPageProps): Promise<Metadata> {
  const { orderId } = await params;
  const data = await getCurrentUmkmOrderDetail(orderId);

  if (!data) {
    return {
      title: "Pesanan tidak ditemukan - Ruang Usaha Kita",
    };
  }

  return {
    title: `${data.order.order_number} - Pesanan UMKM`,
    description:
      "Detail pesanan UMKM, termasuk brief campaign, pembayaran, status pesanan, hasil konten, dan revisi.",
  };
}

export default async function UmkmOrderDetailPage({
  params,
  searchParams,
}: OrderPageProps) {
  const [{ orderId }, query] = await Promise.all([
    params,
    searchParams ??
      Promise.resolve({
        already_paid: undefined,
        completed: undefined,
        complaint_created: undefined,
        created: undefined,
        error: undefined,
        message_sent: undefined,
        paid: undefined,
        reviewed: undefined,
        revision_requested: undefined,
      }),
  ]);
  const [data, delivery, collaboration] = await Promise.all([
    getCurrentUmkmOrderDetail(orderId),
    getOrderDeliveryData(orderId),
    getOrderCollaborationData(orderId),
  ]);

  if (!data) {
    notFound();
  }

  const errorMessage = getDeliveryErrorMessage(query.error);
  const canReview =
    Boolean(delivery.latestSubmission) &&
    (data.order.order_status === "submitted" || data.order.order_status === "revised");
  const showResults =
    delivery.submissions.length > 0 ||
    ["submitted", "revision_requested", "revised", "completed"].includes(
      data.order.order_status,
    );
  const showRevisions =
    delivery.revisions.length > 0 || data.order.order_status === "revision_requested";

  return (
    <main>
      <PageContainer>
        <div className="mx-auto max-w-[1180px] space-y-5 pb-6">
          <PageNotice query={query} errorMessage={errorMessage} />
          <OrderHeader data={data} />
          <OrderProgress status={data.order.order_status} />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-5">
              <ServiceSnapshot items={data.items} />
              <BriefSummary brief={data.brief} />
              {showResults ? <DeliveryHistoryPanel delivery={delivery} /> : null}
              {showRevisions ? <RevisionHistoryPanel delivery={delivery} /> : null}
              <StatusTimeline data={data} />
              <OrderCollaborationPanel
                canReview={data.order.order_status === "completed"}
                collaboration={collaboration}
                orderId={data.order.id}
                returnPath={`/umkm/orders/${data.order.id}`}
                variant="umkm"
              />
            </div>

            <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
              <PaymentPanel data={data} />
              {canReview ? (
                <UmkmDeliveryReviewPanel
                  canReview={canReview}
                  delivery={delivery}
                  orderId={data.order.id}
                />
              ) : null}
              <OrderCostPanel data={data} />
            </aside>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}

function PageNotice({
  errorMessage,
  query,
}: {
  errorMessage: string | null;
  query: Awaited<NonNullable<OrderPageProps["searchParams"]>>;
}) {
  if (errorMessage) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive">
        {errorMessage}
      </div>
    );
  }

  if (query.completed === "1") {
    return <SuccessNotice message="Hasil konten diterima dan pesanan selesai." />;
  }

  if (query.revision_requested === "1") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900">
        Permintaan revisi sudah dikirim ke kreator.
      </div>
    );
  }

  if (query.reviewed === "1") {
    return <SuccessNotice message="Review berhasil dikirim." />;
  }

  if (query.complaint_created === "1") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900">
        Komplain sudah dikirim untuk ditinjau.
      </div>
    );
  }

  if (query.message_sent === "1") {
    return <SuccessNotice message="Pesan berhasil dikirim." />;
  }

  if (query.paid === "1" || query.already_paid === "1") {
    return <SuccessNotice message="Pembayaran berhasil diproses." />;
  }

  if (query.created === "1") {
    return (
      <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm font-medium text-blue-900">
        Pesanan berhasil dibuat. Lanjutkan pembayaran agar kreator dapat memproses brief.
      </div>
    );
  }

  return null;
}

function SuccessNotice({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-900">
      {message}
    </div>
  );
}

function OrderHeader({ data }: { data: UmkmOrderDetail }) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)] sm:p-6">
      <Button asChild variant="ghost" className="-ml-2 mb-4">
        <Link href="/umkm/orders">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Kembali
        </Link>
      </Button>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-semibold text-primary">
            <ReceiptText className="size-4" aria-hidden="true" />
            {data.order.order_number}
          </p>
          <h1 className="mt-2 line-clamp-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {data.items[0]?.serviceTitle ?? "Paket jasa digital"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Kreator: {data.creatorName}
            {data.creatorCity ? `, ${data.creatorCity}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <OrderStatusBadge status={data.order.order_status} />
          <PaymentStatusBadge status={data.order.payment_status} />
        </div>
      </div>
    </section>
  );
}

function OrderProgress({ status }: { status: OrderStatus }) {
  const steps = [
    { key: "payment", label: "Menunggu Pembayaran" },
    { key: "work", label: "Dikerjakan Kreator" },
    { key: "review", label: "Review Hasil" },
    { key: "revision", label: "Revisi" },
    { key: "done", label: "Selesai" },
  ] as const;
  const activeIndex = getProgressIndex(status);

  return (
    <section className="rounded-2xl border border-border/70 bg-card p-4 shadow-[var(--shadow-soft)]">
      <div className="grid gap-3 md:grid-cols-5">
        {steps.map((step, index) => {
          const state =
            index < activeIndex ? "done" : index === activeIndex ? "active" : "idle";

          return (
            <div key={step.key} className="flex items-center gap-3 md:block">
              <span
                className={
                  state === "done"
                    ? "grid size-8 place-items-center rounded-full bg-emerald-600 text-white md:mx-auto"
                    : state === "active"
                      ? "grid size-8 place-items-center rounded-full bg-blue-600 text-sm font-semibold text-white md:mx-auto"
                      : "grid size-8 place-items-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600 md:mx-auto"
                }
              >
                {state === "done" ? (
                  <CheckCircle2 className="size-4" aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </span>
              <p
                className={
                  state === "active"
                    ? "text-sm font-semibold text-foreground md:mt-2 md:text-center"
                    : "text-sm text-muted-foreground md:mt-2 md:text-center"
                }
              >
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ServiceSnapshot({ items }: { items: readonly UmkmOrderDetailItem[] }) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        Layanan dipilih
      </h2>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl border border-border/70 bg-background p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap gap-2">
                  {item.tierName ? <Badge className="rounded-lg">{item.tierName}</Badge> : null}
                  <Badge variant="secondary" className="rounded-lg">
                    {item.revisionCount ?? 0} revisi
                  </Badge>
                </div>
                <h3 className="mt-3 line-clamp-2 text-lg font-semibold tracking-tight text-foreground">
                  {item.serviceTitle}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Estimasi {item.estimatedDays ?? 0} hari
                </p>
              </div>
              <p className="shrink-0 text-lg font-semibold tracking-tight text-foreground">
                {formatCurrency(item.subtotal)}
              </p>
            </div>
            {item.deliverables.length > 0 ? (
              <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                {item.deliverables.slice(0, 6).map((deliverable) => (
                  <li key={deliverable} className="line-clamp-1 rounded-lg bg-muted/35 px-3 py-2">
                    {deliverable}
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function BriefSummary({ brief }: { brief: UmkmOrderBrief | null }) {
  if (!brief) {
    return (
      <section className="rounded-2xl border border-dashed border-border bg-card p-5 text-sm text-muted-foreground">
        Brief campaign belum tersedia.
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-700">
          <FileText className="size-5" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Brief campaign
        </h2>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <InfoItem label="Nama usaha" value={brief.businessName} />
        <InfoItem label="Fokus promosi" value={brief.promotedProduct} />
        <InfoItem label="Tujuan" value={brief.campaignGoal} />
        <InfoItem label="Audiens" value={brief.targetAudience ?? "Belum diisi"} />
        <InfoItem
          label="Platform"
          value={brief.contentPlatforms.length > 0 ? brief.contentPlatforms.join(", ") : "Belum diisi"}
        />
        <InfoItem label="Gaya" value={brief.contentStyle ?? "Belum diisi"} />
      </div>
    </section>
  );
}

function PaymentPanel({ data }: { data: UmkmOrderDetail }) {
  const isAwaitingPayment =
    data.order.order_status === "awaiting_payment" || data.order.payment_status === "pending";

  if (isAwaitingPayment && data.payment) {
    return (
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950 shadow-[var(--shadow-soft)]">
        <div className="flex items-start gap-3">
          <WalletCards className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Pembayaran menunggu
            </h2>
            <p className="mt-1 text-sm leading-6 text-amber-900">
              Selesaikan pembayaran agar brief diteruskan ke kreator.
            </p>
          </div>
        </div>
        <Button asChild className="mt-4 h-11 w-full bg-amber-600 text-white hover:bg-amber-700">
          <Link href={`/umkm/payments/${data.payment.id}`}>
            Bayar Sekarang
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">
        Pembayaran
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        <PaymentStatusBadge status={data.order.payment_status} />
        {data.invoice?.invoice_number ? (
          <Badge variant="secondary" className="rounded-lg">
            {data.invoice.invoice_number}
          </Badge>
        ) : null}
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <Button asChild variant="outline" className="h-10">
          <Link href={`/umkm/orders/${data.order.id}/invoice`}>
            Lihat Invoice
          </Link>
        </Button>
        {data.order.payment_status === "paid" ? (
          <Button asChild className="h-10">
            <Link href={`/umkm/orders/${data.order.id}/receipt`}>
              Lihat Receipt
            </Link>
          </Button>
        ) : null}
      </div>
    </section>
  );
}

function OrderCostPanel({ data }: { data: UmkmOrderDetail }) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">
        Ringkasan biaya
      </h2>
      <div className="mt-4 space-y-3 text-sm">
        <MoneyRow label="Subtotal layanan" value={Number(data.order.subtotal_amount)} />
        <MoneyRow label="Add-on" value={Number(data.order.addon_amount)} />
        <MoneyRow label="Biaya admin" value={Number(data.order.admin_fee)} />
        <div className="flex items-end justify-between gap-4 rounded-xl bg-slate-950 px-4 py-3 text-white">
          <span className="text-sm text-white/70">Total</span>
          <strong className="text-xl tracking-tight">
            {formatCurrency(Number(data.order.total_amount))}
          </strong>
        </div>
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <CalendarClock className="size-4" aria-hidden="true" />
        Deadline {data.order.deadline ? formatDate(data.order.deadline) : "belum tersedia"}
      </p>
    </section>
  );
}

function StatusTimeline({ data }: { data: UmkmOrderDetail }) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        Timeline
      </h2>
      {data.history.length > 0 ? (
        <div className="mt-4 space-y-3">
          {data.history.map((history) => (
            <div key={history.id} className="flex gap-3">
              <div className="mt-2 size-2 rounded-full bg-primary" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <OrderStatusBadge status={history.new_status} />
                  <span className="text-xs text-muted-foreground">
                    {formatDate(history.created_at)}
                  </span>
                </div>
                {history.note ? (
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {history.note}
                  </p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-xl border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
          Timeline belum tersedia.
        </p>
      )}
    </section>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/35 px-3 py-2">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 line-clamp-2 text-sm font-semibold text-foreground">{value}</p>
    </div>
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

function getProgressIndex(status: OrderStatus) {
  if (status === "completed") {
    return 4;
  }

  if (status === "revision_requested" || status === "revised") {
    return 3;
  }

  if (status === "submitted") {
    return 2;
  }

  if (
    status === "waiting_creator_confirmation" ||
    status === "brief_accepted" ||
    status === "in_progress"
  ) {
    return 1;
  }

  return 0;
}

function getDeliveryErrorMessage(error?: string) {
  if (!error) {
    return null;
  }

  const messages: Record<string, string> = {
    not_authenticated: "Silakan masuk terlebih dahulu.",
    not_umkm: "Hanya akun UMKM aktif yang dapat memproses hasil.",
    order_not_approvable: "Hasil belum bisa diterima pada status pesanan ini.",
    order_not_revisable: "Revisi belum bisa diminta pada status pesanan ini.",
    revision_limit_reached: "Batas revisi paket sudah terpakai.",
    revision_note_required: "Catatan revisi wajib diisi.",
  };

  return messages[error] ?? "Aksi hasil konten belum berhasil diproses.";
}
