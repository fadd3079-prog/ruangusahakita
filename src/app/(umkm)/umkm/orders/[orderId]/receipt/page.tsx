import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { OrderPrintDocument } from "@/features/invoices/components/order-print-document";
import { getCurrentUmkmOrderDetail } from "@/features/orders/data/order-queries";

type ReceiptPageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export async function generateMetadata({
  params,
}: ReceiptPageProps): Promise<Metadata> {
  const { orderId } = await params;
  const data = await getCurrentUmkmOrderDetail(orderId);

  if (!data || data.order.payment_status !== "paid") {
    return {
      title: "Receipt tidak tersedia — Ruang Usaha Kita",
    };
  }

  return {
    title: `${data.invoice?.invoice_number ?? data.order.order_number} — Receipt`,
  };
}

export default async function UmkmOrderReceiptPage({ params }: ReceiptPageProps) {
  const { orderId } = await params;
  const data = await getCurrentUmkmOrderDetail(orderId);

  if (!data || data.order.payment_status !== "paid") {
    notFound();
  }

  return <OrderPrintDocument data={data} mode="receipt" />;
}
