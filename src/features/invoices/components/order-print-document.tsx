import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock3, ReceiptText } from "lucide-react";

import { PrintButton } from "@/components/common/print-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import type { UmkmOrderDetail } from "@/features/orders/data/order-queries";
import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";

type OrderPrintDocumentProps = {
  data: UmkmOrderDetail;
  mode: "invoice" | "receipt";
};

export function OrderPrintDocument({ data, mode }: OrderPrintDocumentProps) {
  const isReceipt = mode === "receipt";
  const isPaid = data.order.payment_status === "paid";
  const documentNumber =
    data.invoice?.invoice_number ??
    data.payment?.payment_number ??
    data.order.order_number;
  const primaryItem = data.items[0] ?? null;

  return (
    <main className="min-h-screen bg-[#f7f9fa] px-5 py-6 text-[#06111f] print:bg-white print:px-0 print:py-0">
      <div className="mx-auto max-w-4xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Button asChild variant="outline">
            <Link href={`/umkm/orders/${data.order.id}`}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              Kembali ke Pesanan
            </Link>
          </Button>
          <PrintButton label={isReceipt ? "Cetak Receipt" : "Cetak Invoice"} />
        </div>

        <article className="min-w-0 overflow-hidden rounded-3xl border border-[#e5eaf0] bg-white shadow-[0_18px_60px_rgba(12,41,73,0.08)] print:rounded-none print:border-0 print:shadow-none">
          <header className="bg-[#0c2949] p-7 text-white print:bg-white print:text-[#06111f]">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70 print:text-[#167163]">
                  Ruang Usaha Kita
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight">
                  {isReceipt ? "Receipt Pembayaran" : "Invoice Pembayaran"}
                </h1>
                <p className="mt-2 text-sm text-white/70 print:text-[#4b5563]">
                  Marketplace jasa digital untuk UMKM dan kreator
                </p>
              </div>
              <div className="min-w-0 overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-4 text-sm print:border-[#e5eaf0] print:bg-[#f7f9fa]">
                <p className="text-white/70 print:text-[#4b5563]">Nomor dokumen</p>
                <p className="mt-1 break-words font-semibold">{documentNumber}</p>
                <p className="mt-3 text-white/70 print:text-[#4b5563]">Tanggal</p>
                <p className="mt-1 font-semibold">
                  {formatDate(data.invoice?.issued_at ?? data.order.created_at)}
                </p>
              </div>
            </div>
          </header>

          <section className="grid gap-4 border-b border-[#e5eaf0] p-7 sm:grid-cols-2">
            <InfoBlock label="Kode order" value={data.order.order_number} />
            <InfoBlock
              label={isReceipt ? "Tanggal dibayar" : "Status invoice"}
              value={
                isReceipt
                  ? data.payment?.paid_at
                    ? formatDate(data.payment.paid_at)
                    : "Belum tersedia"
                  : isPaid
                    ? "Lunas"
                    : "Belum dibayar"
              }
            />
            <InfoBlock label="UMKM" value={data.brief?.businessName ?? "UMKM"} />
            <InfoBlock label="Kreator" value={data.creatorName} />
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <OrderStatusBadge status={data.order.order_status} />
              <PaymentStatusBadge status={data.order.payment_status} />
              <Badge variant="secondary" className="rounded-lg">
                {data.payment?.payment_method ?? "Sandbox"}
              </Badge>
            </div>
          </section>

          <section className="p-7">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-[#e9f5f2] text-[#167163]">
                {isReceipt && isPaid ? (
                  <CheckCircle2 className="size-5" aria-hidden="true" />
                ) : (
                  <ReceiptText className="size-5" aria-hidden="true" />
                )}
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-semibold tracking-tight">
                  Rincian layanan
                </h2>
                <p className="line-clamp-2 break-words text-sm text-[#4b5563]">
                  {primaryItem?.serviceTitle ?? "Paket jasa digital"}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#e5eaf0]">
              <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                <thead className="bg-[#f3f6f7] text-[#4b5563]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Layanan</th>
                    <th className="px-4 py-3 font-semibold">Paket</th>
                    <th className="px-4 py-3 text-right font-semibold">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item) => (
                    <tr key={item.id} className="border-t border-[#e5eaf0]">
                      <td className="px-4 py-4 align-top">
                        <p className="line-clamp-2 break-words font-semibold">{item.serviceTitle}</p>
                        <p className="mt-1 text-xs text-[#6b7280]">
                          Estimasi {item.estimatedDays ?? 0} hari · {item.revisionCount ?? 0} revisi
                        </p>
                        {item.addons.length > 0 ? (
                          <ul className="mt-2 space-y-1 text-xs text-[#6b7280]">
                            {item.addons.map((addon) => (
                              <li key={addon.id} className="line-clamp-2 break-words">
                                {addon.addonName} · {formatCurrency(addon.price)}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </td>
                      <td className="px-4 py-4 align-top text-[#4b5563]">
                        {item.tierName ?? "Paket"}
                      </td>
                      <td className="px-4 py-4 text-right font-semibold">
                        {formatCurrency(item.subtotal)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="ml-auto mt-6 max-w-sm space-y-3 text-sm">
              <MoneyRow label="Subtotal layanan" value={Number(data.order.subtotal_amount)} />
              <MoneyRow label="Add-on" value={Number(data.order.addon_amount)} />
              <MoneyRow label="Biaya admin" value={Number(data.order.admin_fee)} />
              <MoneyRow label="Diskon" value={Number(data.order.discount_amount) * -1} />
              <div className="flex min-w-0 items-end justify-between gap-4 rounded-2xl bg-[#0c2949] px-4 py-4 text-white">
                <span className="min-w-0 truncate">Total</span>
                <strong className="shrink-0 text-xl tracking-tight sm:text-2xl">
                  {formatCurrency(Number(data.order.total_amount))}
                </strong>
              </div>
            </div>
          </section>

          <footer className="border-t border-[#e5eaf0] p-7">
            <div className="flex items-start gap-3 rounded-2xl bg-[#f7f9fa] p-4 text-sm text-[#4b5563]">
              <Clock3 className="mt-0.5 size-4 shrink-0 text-[#167163]" aria-hidden="true" />
              <p>
                {isReceipt && isPaid
                  ? "Receipt ini menandakan pembayaran sudah tercatat paid. Status pesanan tetap mengikuti proses pengerjaan hasil konten."
                  : "Invoice ini mengikuti status pembayaran. Receipt valid tersedia setelah pembayaran tercatat paid."}
              </p>
            </div>
          </footer>
        </article>
      </div>
    </main>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-[#e5eaf0] bg-[#f7f9fa] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6b7280]">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-semibold text-[#06111f]">{value}</p>
    </div>
  );
}

function MoneyRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[#4b5563]">{label}</span>
      <span className="font-semibold text-[#06111f]">{formatCurrency(value)}</span>
    </div>
  );
}
