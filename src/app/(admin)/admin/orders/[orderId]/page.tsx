import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BriefcaseBusiness, FileText, ReceiptText } from "lucide-react";

import { PageContainer } from "@/components/layout/page-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getAdminOrderDetail } from "@/features/admin/data/admin-management-queries";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";

type OrderPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function generateMetadata({
  params,
}: OrderPageProps): Promise<Metadata> {
  const { orderId } = await params;
  const data = await getAdminOrderDetail(orderId);

  if (!data) {
    return {
      title: "Pesanan tidak ditemukan - Ruang Usaha Kita",
    };
  }

  return {
    title: `${data.order.order_number} - Detail Pesanan Admin`,
    description:
      "Detail monitoring pesanan admin, termasuk UMKM, kreator, pembayaran, brief, dan timeline.",
  };
}

export default async function AdminOrderDetailPage({ params }: OrderPageProps) {
  const { orderId } = await params;
  const data = await getAdminOrderDetail(orderId);

  if (!data) {
    notFound();
  }

  return (
    <PageContainer>
      <div className="space-y-8">
        <section className="min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,var(--brand-navy-950),var(--brand-teal-900))] text-white shadow-[var(--shadow-card)]">
          <div className="p-6 sm:p-8">
            <Button
              asChild
              variant="ghost"
              className="mb-6 text-white/80 hover:bg-white/10 hover:text-white"
            >
              <Link href="/admin/orders">
                <ArrowLeft className="size-4" aria-hidden="true" />
                Kembali
              </Link>
            </Button>
            <p className="inline-flex max-w-full min-w-0 items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-semibold text-white/80">
              <ReceiptText className="size-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{data.order.order_number}</span>
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Detail pesanan admin
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-6 text-white/72 sm:text-base">
              Monitoring read-only untuk konteks UMKM, kreator, brief campaign,
              pembayaran, dan status pesanan.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <OrderStatusBadge status={data.order.order_status} />
              <PaymentStatusBadge status={data.order.payment_status} />
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Pihak terkait
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <DetailField
                  label="UMKM"
                  value={data.umkm?.business_name ?? "Belum tersedia"}
                />
                <DetailField
                  label="Kreator"
                  value={data.creator?.display_name ?? "Belum tersedia"}
                />
                <DetailField
                  label="Kategori usaha"
                  value={data.umkm?.business_category ?? "Belum diisi"}
                />
                <DetailField
                  label="Niche kreator"
                  value={data.creator?.niche ?? "Belum diisi"}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <FileText className="size-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-primary">Brief campaign</p>
                  <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
                    Arahan UMKM
                  </h2>
                </div>
              </div>
              {data.brief ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <DetailField label="Nama usaha" value={data.brief.business_name} />
                  <DetailField
                    label="Fokus promosi"
                    value={data.brief.promoted_product}
                  />
                  <DetailField
                    label="Target audiens"
                    value={data.brief.target_audience ?? "Belum diisi"}
                  />
                  <DetailField
                    label="Deadline"
                    value={
                      data.brief.deadline
                        ? formatDate(data.brief.deadline)
                        : "Belum tersedia"
                    }
                  />
                  <DetailField
                    className="sm:col-span-2"
                    label="Tujuan campaign"
                    value={data.brief.campaign_goal}
                  />
                </div>
              ) : (
                <p className="mt-5 rounded-2xl border border-dashed border-border bg-background p-4 text-sm text-muted-foreground">
                  Brief campaign belum tersedia.
                </p>
              )}
            </section>

            <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Timeline status
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
                          <p className="mt-2 line-clamp-3 break-words text-sm leading-6 text-muted-foreground">
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
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="flex items-start gap-3">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <BriefcaseBusiness className="size-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    Ringkasan order
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Snapshot layanan dan pembayaran yang tercatat.
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
                <p className="mt-2 truncate text-3xl font-semibold tracking-tight text-foreground">
                  {formatCurrency(Number(data.order.total_amount))}
                </p>
              </div>
            </section>

            <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]">
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                Item layanan
              </h2>
              <div className="mt-4 space-y-3">
                {data.items.length > 0 ? (
                  data.items.map((item) => (
                    <div key={item.id} className="min-w-0 overflow-hidden rounded-xl border border-border/70 bg-background p-4">
                      <p className="line-clamp-2 break-words font-semibold text-foreground">
                        {item.service_title}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {item.tier_name ? (
                          <Badge className="max-w-full truncate">{item.tier_name}</Badge>
                        ) : null}
                        <Badge variant="secondary">
                          {item.revision_count ?? 0} revisi
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Item layanan belum tersedia.
                  </p>
                )}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </PageContainer>
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
    <div className={`min-w-0 overflow-hidden ${className ?? ""}`}>
      <p className="text-xs font-medium uppercase text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 line-clamp-3 break-words text-sm leading-6 text-foreground">{value}</p>
    </div>
  );
}

function MoneyRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-4">
      <dt className="min-w-0 truncate text-muted-foreground">{label}</dt>
      <dd className="shrink-0 font-semibold text-foreground">{formatCurrency(value)}</dd>
    </div>
  );
}
