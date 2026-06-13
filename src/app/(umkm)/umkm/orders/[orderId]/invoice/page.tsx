import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OrderPrintDocument } from "@/features/invoices/components/order-print-document";
import { getCurrentUmkmOrderDetail } from "@/features/orders/data/order-queries";

type InvoicePageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function generateMetadata({
  params,
}: InvoicePageProps): Promise<Metadata> {
  const { orderId } = await params;
  const data = await getCurrentUmkmOrderDetail(orderId);

  if (!data) {
    return {
      title: "Invoice tidak ditemukan — Ruang Usaha Kita",
    };
  }

  return {
    title: `${data.invoice?.invoice_number ?? data.order.order_number} — Invoice`,
  };
}

export default async function UmkmOrderInvoicePage({ params }: InvoicePageProps) {
  const { orderId } = await params;
  const data = await getCurrentUmkmOrderDetail(orderId);

  if (!data) {
    notFound();
  }

  return <OrderPrintDocument data={data} mode="invoice" />;
}
