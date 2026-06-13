import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  FileText,
  Play,
  ReceiptText,
} from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { SubmitButton } from "@/components/common/submit-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  acceptCreatorOrder,
  startCreatorOrder,
} from "@/features/orders/actions/creator-order-actions";
import { OrderCollaborationPanel } from "@/features/orders/components/order-collaboration-panel";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
import {
  CreatorDeliveryForm,
  DeliveryHistoryPanel,
  RevisionHistoryPanel,
} from "@/features/submissions/components/delivery-panels";
import {
  getCurrentCreatorOrderDetail,
  type CreatorOrderDetail,
  type UmkmOrderDetailItem,
} from "@/features/orders/data/order-queries";
import { getOrderCollaborationData } from "@/features/orders/data/order-collaboration-queries";
import { getOrderDeliveryData } from "@/features/submissions/data/submission-queries";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";

type OrderPageProps = {
  params: Promise<{
    orderId: string;
  }>;
  searchParams?: Promise<{
    accepted?: string;
    complaint_created?: string;
    error?: string;
    message_sent?: string;
    started?: string;
    submitted?: string;
  }>;
};

const errorMessages = {
  not_authenticated: "Silakan masuk terlebih dahulu untuk memproses order.",
  not_creator: "Hanya akun kreator aktif yang dapat memproses order.",
  order_lifecycle: "Status order belum bisa diperbarui saat ini.",
  order_not_acceptable:
    "Order belum bisa diterima. Pastikan pembayaran sudah berhasil dan status menunggu konfirmasi kreator.",
  order_not_startable:
    "Order belum bisa dimulai. Terima brief terlebih dahulu sebelum memulai pengerjaan.",
  asset_not_allowed: "File hasil belum bisa disimpan. Coba unggah ulang.",
  delivery_update: "Hasil konten belum bisa dikirim saat ini.",
  file_extension: "Format file belum didukung untuk hasil project.",
  file_size: "Ukuran file terlalu besar. Maksimal 50MB per file.",
  file_type: "Tipe file belum didukung untuk hasil project.",
  order_not_submittable:
    "Hasil hanya bisa dikirim saat status pesanan sedang dikerjakan atau revisi diminta.",
  revision_not_found: "Permintaan revisi aktif tidak ditemukan.",
  submission_empty: "Tambahkan file, link, atau catatan hasil sebelum mengirim.",
};

function getErrorMessage(error?: string) {
  if (!error) {
    return null;
  }

  return errorMessages[error as keyof typeof errorMessages] ?? errorMessages.order_lifecycle;
}

export async function generateMetadata({
  params,
}: OrderPageProps): Promise<Metadata> {
  const { orderId } = await params;
  const data = await getCurrentCreatorOrderDetail(orderId);

  if (!data) {
    return {
      title: "Order tidak ditemukan - Ruang Usaha Kita",
    };
  }

  return {
    title: `${data.order.order_number} - Detail Order Kreator`,
    description:
      "Detail order kreator, termasuk brief UMKM, scope layanan, status pesanan, pembayaran, dan aksi lifecycle awal.",
  };
}

export default async function CreatorOrderDetailPage({
  params,
  searchParams,
}: OrderPageProps) {
  const [{ orderId }, query] = await Promise.all([
    params,
    searchParams ??
      Promise.resolve({
        accepted: undefined,
        complaint_created: undefined,
        error: undefined,
        message_sent: undefined,
        started: undefined,
        submitted: undefined,
      }),
  ]);
  const [data, delivery, collaboration] = await Promise.all([
    getCurrentCreatorOrderDetail(orderId),
    getOrderDeliveryData(orderId),
    getOrderCollaborationData(orderId),
  ]);
  const errorMessage = getErrorMessage(query.error);

  if (!data) {
    notFound();
  }

  return (
    <main>
      <PageContainer>
        <div className="space-y-8">
          {query.accepted === "1" ? (
            <SuccessMessage message="Brief berhasil diterima. Order siap masuk tahap pengerjaan." />
          ) : null}
          {query.started === "1" ? (
            <SuccessMessage message="Order sudah masuk tahap konten diproduksi." />
          ) : null}
          {query.submitted === "1" ? (
            <SuccessMessage message="Hasil konten berhasil dikirim ke UMKM." />
          ) : null}
          {query.complaint_created === "1" ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900">
              Komplain sudah dikirim untuk ditinjau.
            </div>
          ) : null}
          {query.message_sent === "1" ? (
            <SuccessMessage message="Pesan berhasil dikirim." />
          ) : null}
          {errorMessage ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm font-medium text-destructive">
              {errorMessage}
            </div>
          ) : null}

          <CreatorOrderHero data={data} />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <CreatorBriefCard data={data} />
              <CreatorScopeCard items={data.items} />
              <DeliveryHistoryPanel delivery={delivery} />
              <RevisionHistoryPanel delivery={delivery} />
              <CreatorTimelineCard data={data} />
              <OrderCollaborationPanel
                canReview={false}
                collaboration={collaboration}
                orderId={data.order.id}
                returnPath={`/creator/orders/${data.order.id}`}
                variant="creator"
              />
            </div>
            <div className="space-y-6">
              <CreatorLifecyclePanel data={data} />
              <CreatorDeliveryForm
                canSubmit={
                  data.order.order_status === "in_progress" ||
                  data.order.order_status === "revision_requested"
                }
                orderId={data.order.id}
              />
              <CreatorPaymentCard data={data} />
            </div>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}

function SuccessMessage({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm font-medium text-primary">
      {message}
    </div>
  );
}

function CreatorOrderHero({ data }: { data: CreatorOrderDetail }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,var(--brand-navy-950),var(--brand-teal-900))] text-white shadow-[var(--shadow-card)]">
      <div className="p-6 sm:p-8">
        <Button
          asChild
          variant="ghost"
          className="mb-6 text-white/80 hover:bg-white/10 hover:text-white"
        >
          <Link href="/creator/orders">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Kembali
          </Link>
        </Button>

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-semibold text-white/80">
              <ReceiptText className="size-4" aria-hidden="true" />
              {data.order.order_number}
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              {data.items[0]?.serviceTitle ?? "Paket jasa digital"}
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-6 text-white/72 sm:text-base">
              Order dari {data.umkmBusinessName}. Baca brief campaign, pastikan
              scope layanan sesuai, lalu proses status pesanan secara bertahap.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <OrderStatusBadge status={data.order.order_status} />
              <PaymentStatusBadge status={data.order.payment_status} />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm font-medium text-white/68">Nilai order</p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-white">
              {formatCurrency(Number(data.order.total_amount))}
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm text-white/68">
              <CalendarClock className="size-4" aria-hidden="true" />
              Deadline:{" "}
              {data.order.deadline
                ? formatDate(data.order.deadline)
                : "Belum tersedia"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CreatorBriefCard({ data }: { data: CreatorOrderDetail }) {
  if (!data.brief) {
    return (
      <section className="rounded-2xl border border-dashed border-border bg-card p-5 shadow-xs">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Brief campaign belum tersedia
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Brief untuk order ini belum bisa dibaca. Pastikan migration RLS
          creator brief sudah diterapkan.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <FileText className="size-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-primary">Arahan UMKM</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
            Brief campaign
          </h2>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <DetailField label="Nama usaha" value={data.brief.businessName} />
        <DetailField
          label="Kategori usaha"
          value={data.umkmBusinessCategory ?? "Belum diisi"}
        />
        <DetailField label="Fokus promosi" value={data.brief.promotedProduct} />
        <DetailField
          label="Target audiens"
          value={data.brief.targetAudience ?? "Belum diisi"}
        />
        <DetailField
          label="Platform konten"
          value={
            data.brief.contentPlatforms.length > 0
              ? data.brief.contentPlatforms.join(", ")
              : "Belum diisi"
          }
        />
        <DetailField
          label="Gaya konten"
          value={data.brief.contentStyle ?? "Belum diisi"}
        />
      </div>
      <DetailField
        className="mt-4"
        label="Tujuan campaign"
        value={data.brief.campaignGoal}
      />
    </section>
  );
}

function CreatorScopeCard({
  items,
}: {
  items: readonly UmkmOrderDetailItem[];
}) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        Scope layanan
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Scope ini adalah snapshot saat order dibuat, termasuk tier, output,
        estimasi pengerjaan, revisi, dan add-on.
      </p>
      <div className="mt-5 space-y-4">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-border/70 bg-background p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  {item.tierName ? (
                    <Badge className="rounded-lg">{item.tierName}</Badge>
                  ) : null}
                  <Badge variant="secondary" className="rounded-lg">
                    {item.revisionCount ?? 0} revisi
                  </Badge>
                </div>
                <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
                  {item.serviceTitle}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Estimasi {item.estimatedDays ?? 0} hari pengerjaan
                </p>
              </div>
              <p className="text-lg font-semibold tracking-tight text-foreground">
                {formatCurrency(item.subtotal)}
              </p>
            </div>

            {item.deliverables.length > 0 ? (
              <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
                {item.deliverables.map((deliverable) => (
                  <li key={deliverable} className="rounded-xl bg-muted/40 px-3 py-2">
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

function CreatorLifecyclePanel({ data }: { data: CreatorOrderDetail }) {
  const canAccept =
    data.order.payment_status === "paid" &&
    data.order.order_status === "waiting_creator_confirmation";
  const canStart =
    data.order.payment_status === "paid" &&
    data.order.order_status === "brief_accepted";

  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]">
      <p className="text-sm font-semibold text-primary">Lifecycle kreator</p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
        Proses awal pengerjaan
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Terima brief setelah scope sesuai, lalu mulai pengerjaan konten. Status
        pembayaran tidak diubah dari halaman kreator.
      </p>

      <div className="mt-5 grid gap-2">
        <form action={acceptCreatorOrder}>
          <input type="hidden" name="orderId" value={data.order.id} />
          <SubmitButton
            pendingLabel="Memproses..."
            disabled={!canAccept}
            className="h-11 w-full"
            icon={<CheckCircle2 className="size-4" aria-hidden="true" />}
          >
            Terima Brief
          </SubmitButton>
        </form>
        <form action={startCreatorOrder}>
          <input type="hidden" name="orderId" value={data.order.id} />
          <SubmitButton
            pendingLabel="Memproses..."
            disabled={!canStart}
            variant="outline"
            className="h-11 w-full"
            icon={<Play className="size-4" aria-hidden="true" />}
          >
            Mulai Pengerjaan
          </SubmitButton>
        </form>
      </div>

      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Setelah pengerjaan dimulai, kirim hasil melalui panel upload hasil.
      </p>
    </section>
  );
}

function CreatorPaymentCard({ data }: { data: CreatorOrderDetail }) {
  return (
    <aside className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <BriefcaseBusiness className="size-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Ringkasan order
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Order ini sudah melewati tahap pembayaran dan siap diproses sesuai
            status pesanan.
          </p>
        </div>
      </div>

      <dl className="mt-5 space-y-3 text-sm">
        <MoneyRow label="Subtotal layanan" value={Number(data.order.subtotal_amount)} />
        <MoneyRow label="Add-on" value={Number(data.order.addon_amount)} />
        <MoneyRow label="Biaya admin" value={Number(data.order.admin_fee)} />
      </dl>

      <Separator className="my-5" />

      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm font-medium text-muted-foreground">Total order</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          {formatCurrency(Number(data.order.total_amount))}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <OrderStatusBadge status={data.order.order_status} />
        <PaymentStatusBadge status={data.order.payment_status} />
      </div>
    </aside>
  );
}

function CreatorTimelineCard({ data }: { data: CreatorOrderDetail }) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        Timeline status pesanan
      </h2>
      <div className="mt-5 space-y-4">
        {data.history.length > 0 ? (
          data.history.map((history) => (
            <div key={history.id} className="flex gap-3">
              <div className="mt-1 size-2 rounded-full bg-primary" />
              <div className="min-w-0 flex-1 rounded-2xl border border-border/70 bg-background p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <OrderStatusBadge status={history.new_status} />
                  <span className="text-xs text-muted-foreground">
                    {formatDate(history.created_at)}
                  </span>
                </div>
                {history.note ? (
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {history.note}
                  </p>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <p className="rounded-2xl border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
            Timeline status pesanan belum tersedia.
          </p>
        )}
      </div>
    </section>
  );
}

function DetailField({
  className,
  label,
  value,
}: {
  className?: string;
  label: string;
  value: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs font-medium uppercase text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm leading-6 text-foreground">{value}</p>
    </div>
  );
}

function MoneyRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-semibold text-foreground">{formatCurrency(value)}</dd>
    </div>
  );
}
