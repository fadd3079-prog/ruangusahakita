import { AdminMonitoringCard } from "@/features/orders/components/admin-monitoring-card";
import type { OrderDetailData } from "@/features/orders/components/order-data";
import { OrderActionPanel } from "@/features/orders/components/order-action-panel";
import { OrderDetailHero } from "@/features/orders/components/order-detail-hero";
import { OrderPaymentSummaryCard } from "@/features/orders/components/order-payment-summary-card";
import { OrderTimeline } from "@/features/orders/components/order-timeline";
import { BriefPreviewCard } from "@/features/briefs/components/brief-preview-card";
import { RevisionPanel } from "@/features/revisions/components/revision-panel";
import { OrderReviewCard } from "@/features/reviews/components/order-review-card";
import {
  CreatorSubmissionForm,
  ResultSubmissionCard,
} from "@/features/submissions/components/result-submission-card";

type OrderDetailContentProps = {
  actions: readonly string[];
  actionNote: string;
  actionTitle: string;
  data: OrderDetailData;
  viewer: "admin" | "creator" | "umkm";
};

export function OrderDetailContent({
  actions,
  actionNote,
  actionTitle,
  data,
  viewer,
}: OrderDetailContentProps) {
  return (
    <div className="space-y-8">
      <OrderDetailHero
        creator={data.creator}
        order={data.order}
        payment={data.payment}
        service={data.service}
        umkm={data.umkm}
        viewer={viewer}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          <BriefPreviewCard
            brief={data.brief}
            title={viewer === "creator" ? "Brief dari UMKM" : "Brief campaign"}
          />
          <ResultSubmissionCard
            order={data.order}
            service={data.service}
            viewer={viewer}
          />
          {viewer === "creator" ? (
            <CreatorSubmissionForm mode="result" />
          ) : null}
          <RevisionPanel
            complaint={data.complaint}
            order={data.order}
            showRequestForm={viewer === "umkm"}
          />
          {viewer === "creator" ? (
            <CreatorSubmissionForm mode="revision" />
          ) : null}
          <OrderReviewCard
            creator={data.creator}
            review={data.review}
            service={data.service}
            showPlaceholder={
              viewer === "umkm" && data.order.orderStatus === "completed"
            }
          />
        </div>

        <div className="space-y-6">
          <OrderPaymentSummaryCard order={data.order} payment={data.payment} />
          <OrderTimeline order={data.order} />
          <OrderActionPanel
            actions={actions}
            note={actionNote}
            title={actionTitle}
          />
          {viewer === "admin" ? (
            <AdminMonitoringCard
              complaint={data.complaint}
              creator={data.creator}
              order={data.order}
              payment={data.payment}
              umkm={data.umkm}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
