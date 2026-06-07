import { CalendarClock, ReceiptText, UserRound } from "lucide-react";

import { PaymentStatusBadge } from "@/features/payments/components/payment-status-badge";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import type {
  DummyCreatorProfile,
  DummyOrder,
  DummyPayment,
  DummyServicePackage,
  DummyUmkmProfile,
} from "@/lib/dummy";
import { formatCurrency } from "@/lib/formatters/currency";
import { formatDate } from "@/lib/formatters/date";

type OrderDetailHeroProps = {
  creator: DummyCreatorProfile;
  order: DummyOrder;
  payment: DummyPayment | null;
  service: DummyServicePackage;
  umkm: DummyUmkmProfile;
  viewer: "admin" | "creator" | "umkm";
};

export function OrderDetailHero({
  creator,
  order,
  payment,
  service,
  umkm,
  viewer,
}: OrderDetailHeroProps) {
  const primaryName = viewer === "creator" ? umkm.businessName : creator.displayName;
  const primaryMeta = viewer === "creator" ? "UMKM" : "Kreator";

  return (
    <section className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,var(--brand-navy-950),var(--brand-teal-900))] text-white shadow-[var(--shadow-card)]">
      <div className="grid gap-8 p-6 sm:p-8 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-end">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-sm font-semibold text-white/80">
            <ReceiptText className="size-4" aria-hidden="true" />
            {order.orderNumber}
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {service.title}
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-6 text-white/72 sm:text-base">
            Detail pesanan jasa digital dengan brief campaign, pembayaran,
            timeline status pesanan, hasil konten, dan revisi sebagai tampilan
            dummy.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <OrderStatusBadge status={order.orderStatus} />
            {payment ? <PaymentStatusBadge status={payment.paymentStatus} /> : null}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
          <p className="flex items-center gap-2 text-sm font-medium text-white/70">
            <UserRound className="size-4 text-white" aria-hidden="true" />
            {primaryMeta}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-white">
            {primaryName}
          </p>
          <div className="mt-5 grid gap-3 text-sm">
            <HeroMetric
              icon={CalendarClock}
              label="Deadline"
              value={formatDate(order.deadline)}
            />
            <HeroMetric
              icon={ReceiptText}
              label="Total pembayaran"
              value={formatCurrency(order.totalAmount)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

type HeroMetricProps = {
  icon: typeof CalendarClock;
  label: string;
  value: string;
};

function HeroMetric({ icon: Icon, label, value }: HeroMetricProps) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3 first:border-t-0 first:pt-0">
      <span className="inline-flex items-center gap-2 text-white/65">
        <Icon className="size-4 text-white" aria-hidden="true" />
        {label}
      </span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
