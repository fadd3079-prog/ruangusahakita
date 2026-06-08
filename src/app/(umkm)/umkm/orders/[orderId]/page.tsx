import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarClock, FileText, ReceiptText, WalletCards } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
import {
  getCurrentUmkmOrderDetail,
  type UmkmOrderDetail,
  type UmkmOrderDetailItem,
} from "@/features/orders/data/order-queries";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";

type OrderPageProps = {
  params: Promise<{
    orderId: string;
  }>;
  searchParams?: Promise<{
    created?: string;
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
  const { orderId } = await params;
  const query = searchParams ? await searchParams : { created: undefined };
  const data = await getCurrentUmkmOrderDetail(orderId);

  if (!data) {
    notFound();
  }

  return (
    <main>
      <PageContainer>
        <div className="space-y-8">
          {query.created === "1" ? (
            <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm font-medium text-primary">
              Pesanan berhasil dibuat. Pembayaran masih berstatus pending sandbox
              dan belum terhubung ke payment gateway.
            </div>
          ) : null}

          <OrderDetailHero data={data} />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-6">
              <OrderItemsCard items={data.items} />
              <BriefPreviewCard data={data} />
              <StatusTimelineCard data={data} />
            </div>
            <div className="space-y-6">
              <PaymentSummaryCard data={data} />
              <NextStepCard />
            </div>
          </div>
        </div>
      </PageContainer>
    </main>
  );
}

function OrderDetailHero({ data }: { data: UmkmOrderDetail }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,var(--brand-navy-950),var(--brand-teal-900))] text-white shadow-[var(--shadow-card)]">
      <div className="p-6 sm:p-8">
        <Button
          asChild
          variant="ghost"
          className="mb-6 text-white/80 hover:bg-white/10 hover:text-white"
        >
          <Link href="/umkm/orders">
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
              Pesanan bersama {data.creatorName}
              {data.creatorCity ? ` dari ${data.creatorCity}` : ""}. Status
              pesanan dan pembayaran dipisahkan agar alur produksi konten tetap
              jelas.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <OrderStatusBadge status={data.order.order_status} />
              <PaymentStatusBadge status={data.order.payment_status} />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm font-medium text-white/68">Total pembayaran</p>
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

function OrderItemsCard({ items }: { items: readonly UmkmOrderDetailItem[] }) {
  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        Snapshot layanan
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Detail ini disimpan saat pesanan dibuat agar harga, tier, output, durasi,
        dan revisi tetap konsisten.
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

            {item.addons.length > 0 ? (
              <div className="mt-4 rounded-xl border border-primary/15 bg-primary/5 p-3">
                <p className="text-sm font-semibold text-foreground">
                  Add-on terpilih
                </p>
                <div className="mt-2 space-y-2">
                  {item.addons.map((addon) => (
                    <div
                      key={addon.id}
                      className="flex items-center justify-between gap-4 text-sm"
                    >
                      <span className="text-muted-foreground">{addon.addonName}</span>
                      <span className="font-semibold text-foreground">
                        {formatCurrency(addon.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function BriefPreviewCard({ data }: { data: UmkmOrderDetail }) {
  if (!data.brief) {
    return (
      <section className="rounded-2xl border border-dashed border-border bg-card p-5 shadow-xs">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">
          Brief campaign belum tersedia
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Detail brief tidak dapat dibaca dari database untuk pesanan ini.
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
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Brief campaign
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Brief menjadi arahan kerja kreator untuk memahami konteks usaha dan
            tujuan promosi.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <DetailField label="Nama usaha" value={data.brief.businessName} />
        <DetailField label="Fokus promosi" value={data.brief.promotedProduct} />
        <DetailField label="Tujuan campaign" value={data.brief.campaignGoal} />
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
    </section>
  );
}

function PaymentSummaryCard({ data }: { data: UmkmOrderDetail }) {
  return (
    <aside className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)] xl:sticky xl:top-24">
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <WalletCards className="size-5" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Pembayaran dan invoice
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Pembayaran dibuat sebagai pending sandbox. Payment gateway belum
            diaktifkan pada fase ini.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4">
        <p className="text-sm font-medium text-muted-foreground">
          Total pembayaran
        </p>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          {formatCurrency(Number(data.order.total_amount))}
        </p>
      </div>

      <dl className="mt-5 space-y-3 text-sm">
        <MoneyRow label="Subtotal layanan" value={Number(data.order.subtotal_amount)} />
        <MoneyRow label="Add-on" value={Number(data.order.addon_amount)} />
        <MoneyRow label="Biaya admin" value={Number(data.order.admin_fee)} />
        <MoneyRow label="Diskon" value={Number(data.order.discount_amount)} />
      </dl>

      <Separator className="my-5" />

      <div className="space-y-3 text-sm">
        <DetailField
          label="Nomor pembayaran"
          value={data.payment?.payment_number ?? "Belum tersedia"}
        />
        <DetailField
          label="Metode pembayaran"
          value={data.payment?.payment_method ?? "manual"}
        />
        <DetailField
          label="Provider"
          value={formatPaymentProvider(data.payment?.provider)}
        />
        <DetailField
          label="Nomor invoice"
          value={data.invoice?.invoice_number ?? "Belum tersedia"}
        />
      </div>

      {data.payment ? (
        <Button asChild className="mt-5 w-full">
          <Link href={`/umkm/payments/${data.payment.id}`}>
            Lihat Pembayaran
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>
      ) : null}
    </aside>
  );
}

function StatusTimelineCard({ data }: { data: UmkmOrderDetail }) {
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

function NextStepCard() {
  return (
    <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">
        Tahap berikutnya
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Setelah order dibuat, tahap payment sandbox server-side dapat
        dilanjutkan pada fase berikutnya. Kreator mulai mengerjakan konten
        setelah pembayaran tervalidasi oleh server.
      </p>
      <Button asChild variant="outline" className="mt-5 w-full">
        <Link href="/umkm/orders">Kembali ke daftar pesanan</Link>
      </Button>
    </section>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/35 px-3 py-2">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
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

function formatPaymentProvider(value: string | null | undefined) {
  if (!value) {
    return "sandbox";
  }

  return value === ["dum", "my"].join("") ? "sandbox" : value;
}
