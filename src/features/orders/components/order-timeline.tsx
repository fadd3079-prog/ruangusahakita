import { CheckCircle2, CircleDot } from "lucide-react";

import { orderStatusLabels } from "@/features/orders/components/order-status-badge";
import type { DummyOrder, DummyOrderStatus } from "@/lib/dummy";
import { formatDate } from "@/lib/formatters/date";

const timelineSteps: readonly DummyOrderStatus[] = [
  "awaiting_payment",
  "paid",
  "waiting_creator_confirmation",
  "brief_accepted",
  "in_progress",
  "submitted",
  "revision_requested",
  "revised",
  "completed",
];

type OrderTimelineProps = {
  order: DummyOrder;
};

export function OrderTimeline({ order }: OrderTimelineProps) {
  const currentIndex = timelineSteps.indexOf(order.orderStatus);
  const isTerminal =
    order.orderStatus === "cancelled" || order.orderStatus === "refunded";

  return (
    <section
      aria-labelledby="order-timeline-title"
      className="rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]"
    >
      <p className="text-sm font-semibold text-primary">Timeline</p>
      <h2
        id="order-timeline-title"
        className="mt-2 text-xl font-semibold tracking-tight text-foreground"
      >
        Status pesanan
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Timeline mengikuti alur produksi jasa digital dari pembayaran sampai
        review hasil konten.
      </p>

      <ol className="mt-6 space-y-4">
        {isTerminal ? (
          <TimelineStep
            active
            complete
            description="Pesanan berada pada status akhir non-produksi."
            label={orderStatusLabels[order.orderStatus]}
          />
        ) : (
          timelineSteps.map((status, index) => {
            const complete = currentIndex >= index;
            const active = order.orderStatus === status;

            return (
              <TimelineStep
                key={status}
                active={active}
                complete={complete}
                description={getTimelineDescription(status, order)}
                label={orderStatusLabels[status]}
              />
            );
          })
        )}
      </ol>
    </section>
  );
}

type TimelineStepProps = {
  active: boolean;
  complete: boolean;
  description: string;
  label: string;
};

function TimelineStep({ active, complete, description, label }: TimelineStepProps) {
  const Icon = complete ? CheckCircle2 : CircleDot;

  return (
    <li className="flex gap-3">
      <div
        className={
          complete
            ? "grid size-8 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground"
            : "grid size-8 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground"
        }
      >
        <Icon className="size-4" aria-hidden="true" />
      </div>
      <div className="min-w-0 pb-2">
        <p
          className={
            active
              ? "text-sm font-semibold text-primary"
              : "text-sm font-semibold text-foreground"
          }
        >
          {label}
        </p>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
    </li>
  );
}

function getTimelineDescription(status: DummyOrderStatus, order: DummyOrder) {
  switch (status) {
    case "awaiting_payment":
      return "Checkout selesai dan menunggu pembayaran valid.";
    case "paid":
      return "Pembayaran sudah tercatat; pesanan siap masuk proses kreator.";
    case "waiting_creator_confirmation":
      return "Kreator perlu membaca brief dan mengonfirmasi order.";
    case "brief_accepted":
      return "Brief diterima dan arahan campaign sudah dipahami.";
    case "in_progress":
      return "Kreator sedang memproduksi konten sesuai scope layanan.";
    case "submitted":
      return "Hasil konten dikirim untuk direview UMKM.";
    case "revision_requested":
      return "UMKM meminta revisi berdasarkan hasil konten.";
    case "revised":
      return "Kreator mengirim hasil revisi untuk direview kembali.";
    case "completed":
      return order.completedAt
        ? `Pesanan selesai pada ${formatDate(order.completedAt)}.`
        : "Pesanan selesai dan siap diberi review.";
    default:
      return "Status pesanan dummy.";
  }
}
