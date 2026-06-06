export type DummyUserRole = "umkm" | "creator" | "admin";

export type DummyAvailabilityStatus =
  | "available"
  | "limited"
  | "busy"
  | "unavailable";

export type DummyOrderStatus =
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

export type DummyPaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "expired"
  | "refunded";

export type DummyPaymentMethod =
  | "qris"
  | "virtual_account"
  | "bank_transfer"
  | "e_wallet";

export type DummyPaymentProvider = "dummy";

export type DummyComplaintStatus =
  | "open"
  | "under_review"
  | "resolved"
  | "rejected";

export type DummyNotificationType =
  | "order"
  | "payment"
  | "brief"
  | "result"
  | "revision"
  | "review"
  | "complaint"
  | "system";

export type DummyServiceTierName = "Basic" | "Standard" | "Premium";

export type DummyCartStatus = "active" | "checked_out";

export type DummyBriefStatus = "draft" | "submitted" | "linked_to_order";

export interface DummyUser {
  readonly id: string;
  readonly role: DummyUserRole;
  readonly name: string;
  readonly email: string;
  readonly avatarUrl: string;
  readonly createdAt: string;
}

export interface DummyUmkmProfile {
  readonly id: string;
  readonly userId: string;
  readonly businessName: string;
  readonly businessCategory: string;
  readonly ownerName: string;
  readonly city: string;
  readonly province: string;
  readonly description: string;
  readonly instagramUrl: string;
  readonly whatsappNumber: string;
  readonly targetAudience: readonly string[];
  readonly contentPreference: readonly string[];
}

export interface DummyCreatorProfile {
  readonly id: string;
  readonly userId: string;
  readonly displayName: string;
  readonly niche: string;
  readonly city: string;
  readonly province: string;
  readonly bio: string;
  readonly skills: readonly string[];
  readonly avatarUrl: string;
  readonly bannerUrl: string;
  readonly instagramUrl: string;
  readonly tiktokUrl: string;
  readonly availabilityStatus: DummyAvailabilityStatus;
  readonly startingPrice: number;
  readonly averageRating: number;
  readonly completedOrdersCount: number;
  readonly responseTimeHours: number;
  readonly isVerified: boolean;
  readonly isFeatured: boolean;
}

export interface DummyServiceCategory {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly description: string;
  readonly iconName: string;
}

export interface DummyServicePackage {
  readonly id: string;
  readonly creatorId: string;
  readonly categoryId: string;
  readonly title: string;
  readonly slug: string;
  readonly shortDescription: string;
  readonly description: string;
  readonly coverImageUrl: string;
  readonly basePrice: number;
  readonly estimatedDays: number;
  readonly revisionCount: number;
  readonly deliverables: readonly string[];
  readonly requirements: readonly string[];
  readonly tags: readonly string[];
  readonly isActive: boolean;
  readonly isFeatured: boolean;
}

export interface DummyServiceTier {
  readonly id: string;
  readonly servicePackageId: string;
  readonly name: DummyServiceTierName;
  readonly description: string;
  readonly price: number;
  readonly estimatedDays: number;
  readonly revisionCount: number;
  readonly deliverables: readonly string[];
  readonly sortOrder: number;
}

export interface DummyServiceAddon {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly compatibleServiceIds: readonly string[];
}

export interface DummyPortfolioItem {
  readonly id: string;
  readonly creatorId: string;
  readonly categoryId: string;
  readonly title: string;
  readonly description: string;
  readonly thumbnailUrl: string;
  readonly externalUrl: string;
  readonly clientName: string;
  readonly isFeatured: boolean;
}

export interface DummyCartAddon {
  readonly id: string;
  readonly name: string;
  readonly price: number;
}

export interface DummyCartItem {
  readonly id: string;
  readonly servicePackageId: string;
  readonly tierId: string;
  readonly creatorId: string;
  readonly serviceTitle: string;
  readonly creatorName: string;
  readonly tierName: DummyServiceTierName;
  readonly unitPrice: number;
  readonly addonTotal: number;
  readonly subtotal: number;
  readonly estimatedDays: number;
  readonly revisionCount: number;
  readonly addons: readonly DummyCartAddon[];
}

export interface DummyCart {
  readonly id: string;
  readonly umkmId: string;
  readonly status: DummyCartStatus;
  readonly items: readonly DummyCartItem[];
  readonly subtotalAmount: number;
  readonly addonAmount: number;
  readonly adminFee: number;
  readonly totalAmount: number;
  readonly updatedAt: string;
}

export interface DummyCampaignBrief {
  readonly id: string;
  readonly umkmId: string;
  readonly orderId: string | null;
  readonly businessName: string;
  readonly businessCategory: string;
  readonly promotedFocus: string;
  readonly campaignGoal: string;
  readonly targetAudience: readonly string[];
  readonly contentPlatforms: readonly string[];
  readonly contentStyle: readonly string[];
  readonly referenceLinks: readonly string[];
  readonly deadline: string;
  readonly additionalNotes: string;
  readonly assetUrls: readonly string[];
  readonly status: DummyBriefStatus;
}

export interface DummyOrder {
  readonly id: string;
  readonly orderNumber: string;
  readonly umkmId: string;
  readonly creatorId: string;
  readonly campaignBriefId: string;
  readonly servicePackageId: string;
  readonly tierId: string;
  readonly paymentId: string;
  readonly reviewId: string | null;
  readonly orderStatus: DummyOrderStatus;
  readonly paymentStatus: DummyPaymentStatus;
  readonly subtotalAmount: number;
  readonly addonAmount: number;
  readonly adminFee: number;
  readonly platformFee: number;
  readonly discountAmount: number;
  readonly totalAmount: number;
  readonly deadline: string;
  readonly createdAt: string;
  readonly completedAt: string | null;
}

export interface DummyPayment {
  readonly id: string;
  readonly orderId: string;
  readonly paymentNumber: string;
  readonly paymentStatus: DummyPaymentStatus;
  readonly paymentMethod: DummyPaymentMethod;
  readonly amount: number;
  readonly provider: DummyPaymentProvider;
  readonly providerTransactionId: string;
  readonly providerPaymentUrl: string;
  readonly paidAt: string | null;
  readonly expiredAt: string;
  readonly createdAt: string;
}

export interface DummyReview {
  readonly id: string;
  readonly orderId: string;
  readonly umkmId: string;
  readonly creatorId: string;
  readonly rating: number;
  readonly qualityRating: number;
  readonly communicationRating: number;
  readonly timelinessRating: number;
  readonly comment: string;
  readonly isVisible: boolean;
  readonly createdAt: string;
}

export interface DummyComplaint {
  readonly id: string;
  readonly orderId: string;
  readonly openedBy: string;
  readonly assignedAdminId: string;
  readonly complaintStatus: DummyComplaintStatus;
  readonly subject: string;
  readonly description: string;
  readonly resolutionNote: string | null;
  readonly resolvedAt: string | null;
  readonly createdAt: string;
}

export interface DummyNotification {
  readonly id: string;
  readonly userId: string;
  readonly notificationType: DummyNotificationType;
  readonly title: string;
  readonly message: string;
  readonly actionUrl: string;
  readonly isRead: boolean;
  readonly createdAt: string;
}

export interface DummyMonthlyReport {
  readonly month: string;
  readonly orders: number;
  readonly grossTransactionValue: number;
  readonly platformFeeRevenue: number;
  readonly adminFeeRevenue: number;
  readonly platformRevenue: number;
}

export interface DummyUmkmDashboardReport {
  readonly umkmId: string;
  readonly activeOrders: number;
  readonly completedOrders: number;
  readonly awaitingReview: number;
  readonly totalSpend: number;
}

export interface DummyCreatorDashboardReport {
  readonly creatorId: string;
  readonly activeOrders: number;
  readonly completedOrders: number;
  readonly averageRating: number;
  readonly estimatedEarnings: number;
}

export interface DummyAdminDashboardReport {
  readonly totalUsers: number;
  readonly totalUmkm: number;
  readonly totalCreators: number;
  readonly activeOrders: number;
  readonly grossTransactionValue: number;
  readonly platformRevenue: number;
}
