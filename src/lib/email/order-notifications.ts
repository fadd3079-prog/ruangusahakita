import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email/adapter";
import { formatCurrency } from "@/lib/formatters/currency";
import type { Database } from "@/lib/supabase/types";

type Tables = Database["public"]["Tables"];

type OrderRow = Tables["orders"]["Row"];
type ProfileRow = Tables["profiles"]["Row"];
type CreatorRow = Tables["creator_profiles"]["Row"];
type UmkmRow = Tables["umkm_profiles"]["Row"];
type OrderItemRow = Tables["order_items"]["Row"];
type PaymentRow = Tables["payments"]["Row"];

type OrderEmailEvent =
  | "complaint_created"
  | "creator_accepted"
  | "creator_started"
  | "order_completed"
  | "payment_paid"
  | "result_submitted"
  | "review_created"
  | "revision_requested";

type OrderEmailContext = {
  creator: CreatorRow | null;
  creatorProfile: ProfileRow | null;
  item: OrderItemRow | null;
  order: OrderRow;
  payment: PaymentRow | null;
  umkm: UmkmRow | null;
  umkmProfile: ProfileRow | null;
};

const eventContent: Record<
  OrderEmailEvent,
  {
    ctaLabel: string;
    subject: string;
    title: string;
  }
> = {
  complaint_created: {
    ctaLabel: "Lihat Komplain",
    subject: "Komplain order perlu ditinjau",
    title: "Komplain order dibuat",
  },
  creator_accepted: {
    ctaLabel: "Lihat Pesanan",
    subject: "Brief campaign diterima kreator",
    title: "Brief campaign diterima",
  },
  creator_started: {
    ctaLabel: "Lihat Pesanan",
    subject: "Kreator mulai mengerjakan pesanan",
    title: "Konten mulai diproduksi",
  },
  order_completed: {
    ctaLabel: "Lihat Pesanan",
    subject: "Pesanan selesai",
    title: "Pesanan sudah selesai",
  },
  payment_paid: {
    ctaLabel: "Lihat Pesanan",
    subject: "Pembayaran berhasil",
    title: "Pembayaran berhasil diproses",
  },
  result_submitted: {
    ctaLabel: "Review Hasil",
    subject: "Hasil konten sudah dikirim",
    title: "Hasil konten siap direview",
  },
  review_created: {
    ctaLabel: "Lihat Review",
    subject: "Review baru diterima",
    title: "Review baru untuk pesanan",
  },
  revision_requested: {
    ctaLabel: "Lihat Revisi",
    subject: "UMKM meminta revisi",
    title: "Permintaan revisi baru",
  },
};

export async function sendOrderEventEmail(orderId: string, event: OrderEmailEvent) {
  try {
    const context = await getOrderEmailContext(orderId);

    if (!context) {
      return;
    }

    if (event === "payment_paid") {
      await sendPaymentPaidEmails(context);
      return;
    }

    const recipients = getRecipients(context, event);

    if (event === "complaint_created") {
      recipients.push(...(await getAdminEmails()));
    }

    const content = eventContent[event];
    const orderUrl = getOrderUrl(context.order.id, event);
    const serviceTitle = context.item?.service_title ?? "Paket jasa digital";
    const creatorName = context.creator?.display_name ?? "Kreator";
    const umkmName = context.umkm?.business_name ?? "UMKM";
    const total = formatCurrency(Number(context.order.total_amount));
    const html = renderEmailHtml({
      content,
      creatorName,
      orderNumber: context.order.order_number,
      orderUrl,
      serviceTitle,
      total,
      umkmName,
    });
    const text = [
      content.title,
      `Order: ${context.order.order_number}`,
      `UMKM: ${umkmName}`,
      `Kreator: ${creatorName}`,
      `Layanan: ${serviceTitle}`,
      `Total: ${total}`,
      orderUrl,
    ].join("\n");

    await sendEmail({
      html,
      subject: `${content.subject} — ${context.order.order_number}`,
      text,
      to: recipients,
    });
  } catch {
    return;
  }
}

async function getOrderEmailContext(orderId: string): Promise<OrderEmailContext | null> {
  const supabase = createAdminClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (!order) {
    return null;
  }

  const [umkmResult, creatorResult, itemResult, paymentResult] = await Promise.all([
    supabase.from("umkm_profiles").select("*").eq("id", order.umkm_id).maybeSingle(),
    supabase
      .from("creator_profiles")
      .select("*")
      .eq("id", order.creator_id)
      .maybeSingle(),
    supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("payments")
      .select("*")
      .eq("order_id", order.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);
  const profileIds = [
    umkmResult.data?.user_id ?? null,
    creatorResult.data?.user_id ?? null,
  ].filter((value): value is string => Boolean(value));
  const { data: profiles } =
    profileIds.length > 0
      ? await supabase.from("profiles").select("*").in("id", profileIds)
      : { data: [] as ProfileRow[] };
  const profileById = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

  return {
    creator: creatorResult.data ?? null,
    creatorProfile: creatorResult.data?.user_id
      ? profileById.get(creatorResult.data.user_id) ?? null
      : null,
    item: itemResult.data ?? null,
    order,
    payment: paymentResult.data ?? null,
    umkm: umkmResult.data ?? null,
    umkmProfile: umkmResult.data?.user_id
      ? profileById.get(umkmResult.data.user_id) ?? null
      : null,
  };
}

async function sendPaymentPaidEmails(context: OrderEmailContext) {
  const serviceTitle = context.item?.service_title ?? "Paket jasa digital";
  const creatorName = context.creator?.display_name ?? "Kreator";
  const umkmName = context.umkm?.business_name ?? "UMKM";
  const total = formatCurrency(Number(context.order.total_amount));
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const receiptUrl = `${appUrl}/umkm/orders/${context.order.id}/receipt`;
  const creatorOrderUrl = `${appUrl}/creator/orders/${context.order.id}`;
  const paymentMethod = context.payment?.payment_method ?? "sandbox";
  const paidAt = context.payment?.paid_at ?? context.order.updated_at;

  if (context.umkmProfile?.email) {
    await sendEmail({
      html: renderPaymentReceiptHtml({
        creatorName,
        orderNumber: context.order.order_number,
        paidAt,
        paymentMethod,
        receiptUrl,
        serviceTitle,
        total,
        umkmName,
      }),
      subject: `Receipt pembayaran — ${context.order.order_number}`,
      text: [
        "Pembayaran berhasil diproses.",
        `Order: ${context.order.order_number}`,
        `Layanan: ${serviceTitle}`,
        `Kreator: ${creatorName}`,
        `Total: ${total}`,
        `Receipt: ${receiptUrl}`,
      ].join("\n"),
      to: [context.umkmProfile.email],
    });
  }

  if (context.creatorProfile?.email) {
    const content = {
      ctaLabel: "Lihat Pesanan",
      subject: "Pembayaran order berhasil",
      title: "Order sudah paid",
    };

    await sendEmail({
      html: renderEmailHtml({
        content,
        creatorName,
        orderNumber: context.order.order_number,
        orderUrl: creatorOrderUrl,
        serviceTitle,
        total,
        umkmName,
      }),
      subject: `Order paid — ${context.order.order_number}`,
      text: [
        "Pembayaran order sudah paid.",
        `Order: ${context.order.order_number}`,
        `UMKM: ${umkmName}`,
        `Layanan: ${serviceTitle}`,
        creatorOrderUrl,
      ].join("\n"),
      to: [context.creatorProfile.email],
    });
  }
}

async function getAdminEmails() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("profiles")
    .select("email")
    .eq("role", "admin")
    .eq("account_status", "active");

  return (data ?? []).map((profile) => profile.email);
}

function getRecipients(context: OrderEmailContext, event: OrderEmailEvent) {
  if (event === "revision_requested") {
    return context.creatorProfile?.email ? [context.creatorProfile.email] : [];
  }

  if (
    event === "creator_accepted" ||
    event === "creator_started" ||
    event === "result_submitted"
  ) {
    return context.umkmProfile?.email ? [context.umkmProfile.email] : [];
  }

  if (event === "review_created") {
    return context.creatorProfile?.email ? [context.creatorProfile.email] : [];
  }

  return [context.umkmProfile?.email, context.creatorProfile?.email].filter(
    (value): value is string => Boolean(value),
  );
}

function getOrderUrl(orderId: string, event: OrderEmailEvent) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (
    event === "revision_requested" ||
    event === "review_created" ||
    event === "creator_accepted" ||
    event === "creator_started"
  ) {
    return `${appUrl}/creator/orders/${orderId}`;
  }

  if (event === "complaint_created") {
    return `${appUrl}/admin/complaints`;
  }

  return `${appUrl}/umkm/orders/${orderId}`;
}

function renderEmailHtml({
  content,
  creatorName,
  orderNumber,
  orderUrl,
  serviceTitle,
  total,
  umkmName,
}: {
  content: (typeof eventContent)[OrderEmailEvent];
  creatorName: string;
  orderNumber: string;
  orderUrl: string;
  serviceTitle: string;
  total: string;
  umkmName: string;
}) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;background:#f7f9fa;padding:32px;color:#06111f">
      <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5eaf0;border-radius:24px;padding:28px">
        <p style="margin:0 0 12px;color:#167163;font-size:13px;font-weight:700">Ruang Usaha Kita</p>
        <h1 style="margin:0;color:#0c2949;font-size:24px;line-height:1.2">${content.title}</h1>
        <div style="margin-top:20px;padding:16px;border-radius:16px;background:#f3f6f7">
          <p style="margin:0 0 8px;font-size:14px"><strong>Order:</strong> ${orderNumber}</p>
          <p style="margin:0 0 8px;font-size:14px"><strong>UMKM:</strong> ${umkmName}</p>
          <p style="margin:0 0 8px;font-size:14px"><strong>Kreator:</strong> ${creatorName}</p>
          <p style="margin:0 0 8px;font-size:14px"><strong>Layanan:</strong> ${serviceTitle}</p>
          <p style="margin:0;font-size:14px"><strong>Total:</strong> ${total}</p>
        </div>
        <a href="${orderUrl}" style="display:inline-block;margin-top:22px;background:#0c2949;color:#ffffff;text-decoration:none;border-radius:999px;padding:12px 18px;font-size:14px;font-weight:700">${content.ctaLabel}</a>
        <p style="margin:22px 0 0;color:#6b7280;font-size:12px;line-height:1.5">Email ini dikirim untuk update penting terkait order Anda.</p>
      </div>
    </div>
  `;
}

function renderPaymentReceiptHtml({
  creatorName,
  orderNumber,
  paidAt,
  paymentMethod,
  receiptUrl,
  serviceTitle,
  total,
  umkmName,
}: {
  creatorName: string;
  orderNumber: string;
  paidAt: string;
  paymentMethod: string;
  receiptUrl: string;
  serviceTitle: string;
  total: string;
  umkmName: string;
}) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;background:#f7f9fa;padding:32px;color:#06111f">
      <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5eaf0;border-radius:24px;overflow:hidden">
        <div style="background:#0c2949;padding:28px;color:#ffffff">
          <p style="margin:0 0 12px;color:#9fe0d4;font-size:13px;font-weight:700">Ruang Usaha Kita</p>
          <h1 style="margin:0;font-size:26px;line-height:1.2">Pembayaran berhasil</h1>
          <p style="margin:10px 0 0;color:#d7e7ea;font-size:14px;line-height:1.6">Receipt pembayaran untuk paket jasa digital Anda sudah tersedia.</p>
        </div>
        <div style="padding:28px">
          <div style="display:grid;gap:12px">
            <div style="padding:14px 16px;border:1px solid #e5eaf0;border-radius:16px;background:#f8faf9">
              <p style="margin:0;color:#6b7280;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em">Order</p>
              <p style="margin:6px 0 0;font-size:15px;font-weight:700">${orderNumber}</p>
            </div>
            <div style="padding:14px 16px;border:1px solid #e5eaf0;border-radius:16px;background:#f8faf9">
              <p style="margin:0;color:#6b7280;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em">Status pembayaran</p>
              <p style="margin:6px 0 0;color:#167163;font-size:15px;font-weight:800">Paid</p>
            </div>
          </div>
          <table style="width:100%;margin-top:22px;border-collapse:collapse;font-size:14px">
            <tbody>
              <tr><td style="padding:9px 0;color:#6b7280">UMKM</td><td style="padding:9px 0;text-align:right;font-weight:700">${umkmName}</td></tr>
              <tr><td style="padding:9px 0;color:#6b7280">Kreator</td><td style="padding:9px 0;text-align:right;font-weight:700">${creatorName}</td></tr>
              <tr><td style="padding:9px 0;color:#6b7280">Layanan</td><td style="padding:9px 0;text-align:right;font-weight:700">${serviceTitle}</td></tr>
              <tr><td style="padding:9px 0;color:#6b7280">Metode</td><td style="padding:9px 0;text-align:right;font-weight:700">${paymentMethod}</td></tr>
              <tr><td style="padding:9px 0;color:#6b7280">Tanggal</td><td style="padding:9px 0;text-align:right;font-weight:700">${paidAt}</td></tr>
            </tbody>
          </table>
          <div style="margin-top:20px;padding:18px;border-radius:18px;background:#e9f5f2;color:#0c2949">
            <p style="margin:0;color:#526977;font-size:13px">Total pembayaran</p>
            <p style="margin:6px 0 0;font-size:28px;font-weight:800">${total}</p>
          </div>
          <a href="${receiptUrl}" style="display:inline-block;margin-top:22px;background:#167163;color:#ffffff;text-decoration:none;border-radius:999px;padding:12px 18px;font-size:14px;font-weight:800">Lihat Receipt</a>
          <p style="margin:22px 0 0;color:#6b7280;font-size:12px;line-height:1.6">Status pesanan tetap mengikuti proses pengerjaan hasil konten dan revisi.</p>
        </div>
      </div>
    </div>
  `;
}
