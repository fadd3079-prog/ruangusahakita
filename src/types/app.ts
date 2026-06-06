export type UserRole = "admin" | "umkm" | "creator";

export type OrderStatus =
  | "draft"
  | "awaiting_payment"
  | "paid"
  | "waiting_creator_confirmation"
  | "brief_accepted"
  | "in_progress"
  | "submitted"
  | "revision_requested"
  | "revised"
  | "completed"
  | "cancelled"
  | "refunded";
