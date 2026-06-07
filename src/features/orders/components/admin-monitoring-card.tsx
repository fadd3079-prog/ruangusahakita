import { ShieldCheck } from "lucide-react";

import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import type {
  DummyComplaint,
  DummyCreatorProfile,
  DummyOrder,
  DummyPayment,
  DummyUmkmProfile,
} from "@/lib/dummy";

type AdminMonitoringCardProps = {
  complaint: DummyComplaint | null;
  creator: DummyCreatorProfile;
  order: DummyOrder;
  payment: DummyPayment | null;
  umkm: DummyUmkmProfile;
};

export function AdminMonitoringCard({
  complaint,
  creator,
  order,
  payment,
  umkm,
}: AdminMonitoringCardProps) {
  return (
    <section
      aria-labelledby="admin-monitoring-title"
      className="rounded-2xl border border-white/10 bg-[linear-gradient(135deg,var(--brand-navy-950),var(--brand-teal-900))] p-5 text-white shadow-[var(--shadow-card)]"
    >
      <ShieldCheck className="size-5 text-white" aria-hidden="true" />
      <h2
        id="admin-monitoring-title"
        className="mt-4 text-xl font-semibold tracking-tight text-white"
      >
        Monitoring admin
      </h2>
      <p className="mt-3 text-sm leading-6 text-white/70">
        Area ini hanya menampilkan konteks dummy. Override status, mediasi, dan
        audit log harus dibuat server-side pada tahap integrasi.
      </p>

      <div className="mt-5 grid gap-3">
        <AdminLine label="UMKM" value={umkm.businessName} />
        <AdminLine label="Kreator" value={creator.displayName} />
        <div className="flex flex-wrap gap-2 border-t border-white/10 pt-3">
          <OrderStatusBadge status={order.orderStatus} />
          {payment ? <PaymentStatusBadge status={payment.paymentStatus} /> : null}
        </div>
        <AdminLine
          label="Komplain"
          value={complaint ? complaint.complaintStatus : "Tidak ada komplain"}
        />
      </div>
    </section>
  );
}

type AdminLineProps = {
  label: string;
  value: string;
};

function AdminLine({ label, value }: AdminLineProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-3 first:border-t-0 first:pt-0">
      <span className="text-sm text-white/65">{label}</span>
      <span className="text-right text-sm font-semibold text-white">{value}</span>
    </div>
  );
}
