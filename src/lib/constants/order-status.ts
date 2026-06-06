export const ORDER_STATUS = {
  DRAFT: "draft",
  AWAITING_PAYMENT: "awaiting_payment",
  PAID: "paid",
  WAITING_CREATOR_CONFIRMATION: "waiting_creator_confirmation",
  BRIEF_ACCEPTED: "brief_accepted",
  IN_PROGRESS: "in_progress",
  SUBMITTED: "submitted",
  REVISION_REQUESTED: "revision_requested",
  REVISED: "revised",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
} as const;
