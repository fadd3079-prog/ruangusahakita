import type { OrderListItem } from "@/features/orders/components/order-list-table";
import {
  dummyCampaignBriefs,
  dummyComplaints,
  dummyCreators,
  dummyOrders,
  dummyPayments,
  dummyReviews,
  dummyServicePackages,
  dummyServiceTiers,
  dummyUmkmProfiles,
  type DummyCampaignBrief,
  type DummyComplaint,
  type DummyCreatorProfile,
  type DummyOrder,
  type DummyPayment,
  type DummyReview,
  type DummyServicePackage,
  type DummyServiceTier,
  type DummyUmkmProfile,
} from "@/lib/dummy";

export const currentDummyUmkmId = "umkm_001";
export const currentDummyCreatorId = "creator_001";

const briefByOrderId = new Map(
  dummyCampaignBriefs
    .filter((brief) => brief.orderId)
    .map((brief) => [brief.orderId, brief]),
);
const complaintByOrderId = new Map(
  dummyComplaints.map((complaint) => [complaint.orderId, complaint]),
);
const creatorById = new Map(dummyCreators.map((creator) => [creator.id, creator]));
const paymentById = new Map(dummyPayments.map((payment) => [payment.id, payment]));
const reviewByOrderId = new Map(dummyReviews.map((review) => [review.orderId, review]));
const serviceById = new Map(
  dummyServicePackages.map((service) => [service.id, service]),
);
const tierById = new Map(dummyServiceTiers.map((tier) => [tier.id, tier]));
const umkmById = new Map(dummyUmkmProfiles.map((profile) => [profile.id, profile]));

export type OrderDetailData = {
  readonly brief: DummyCampaignBrief | null;
  readonly complaint: DummyComplaint | null;
  readonly creator: DummyCreatorProfile;
  readonly order: DummyOrder;
  readonly payment: DummyPayment | null;
  readonly review: DummyReview | null;
  readonly service: DummyServicePackage;
  readonly tier: DummyServiceTier | null;
  readonly umkm: DummyUmkmProfile;
};

export function getOrderDetail(orderId: string): OrderDetailData | null {
  const order = dummyOrders.find((item) => item.id === orderId);

  if (!order) {
    return null;
  }

  const creator = creatorById.get(order.creatorId);
  const service = serviceById.get(order.servicePackageId);
  const umkm = umkmById.get(order.umkmId);

  if (!creator || !service || !umkm) {
    return null;
  }

  return {
    brief: briefByOrderId.get(order.id) ?? null,
    complaint: complaintByOrderId.get(order.id) ?? null,
    creator,
    order,
    payment: paymentById.get(order.paymentId) ?? null,
    review: reviewByOrderId.get(order.id) ?? null,
    service,
    tier: tierById.get(order.tierId) ?? null,
    umkm,
  };
}

export function getOrderListItems(
  orders: readonly DummyOrder[],
  role: "admin" | "creator" | "umkm",
): readonly OrderListItem[] {
  return orders.map((order) => ({
    creator: creatorById.get(order.creatorId) ?? null,
    detailHref: getOrderHref(order.id, role),
    order,
    payment: paymentById.get(order.paymentId) ?? null,
    service: serviceById.get(order.servicePackageId) ?? null,
    tier: tierById.get(order.tierId) ?? null,
    umkm: umkmById.get(order.umkmId) ?? null,
  }));
}

export function getOrdersForRole(role: "admin" | "creator" | "umkm") {
  if (role === "admin") {
    return dummyOrders;
  }

  if (role === "creator") {
    return dummyOrders.filter((order) => order.creatorId === currentDummyCreatorId);
  }

  return dummyOrders.filter((order) => order.umkmId === currentDummyUmkmId);
}

function getOrderHref(orderId: string, role: "admin" | "creator" | "umkm") {
  if (role === "admin") {
    return `/admin/orders/${orderId}`;
  }

  if (role === "creator") {
    return `/creator/orders/${orderId}`;
  }

  return `/umkm/orders/${orderId}`;
}
