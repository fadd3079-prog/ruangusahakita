export type PublicAvailabilityStatus =
  | "available"
  | "limited"
  | "busy"
  | "unavailable";

export type PublicServiceTierName = "Basic" | "Standard" | "Premium";

export type PublicCreatorProfile = {
  readonly availabilityStatus: PublicAvailabilityStatus;
  readonly averageRating: number;
  readonly avatarUrl: string;
  readonly bannerUrl: string;
  readonly bio: string;
  readonly city: string;
  readonly completedOrdersCount: number;
  readonly displayName: string;
  readonly id: string;
  readonly instagramUrl: string;
  readonly isFeatured: boolean;
  readonly isVerified: boolean;
  readonly niche: string;
  readonly province: string;
  readonly responseTimeHours: number;
  readonly skills: readonly string[];
  readonly startingPrice: number;
  readonly tiktokUrl: string;
  readonly userId: string;
};

export type PublicServiceCategory = {
  readonly description: string;
  readonly iconName: string;
  readonly id: string;
  readonly name: string;
  readonly slug: string;
};

export type PublicServicePackage = {
  readonly basePrice: number;
  readonly categoryId: string;
  readonly coverImageUrl: string;
  readonly creatorId: string;
  readonly deliverables: readonly string[];
  readonly description: string;
  readonly estimatedDays: number;
  readonly id: string;
  readonly isActive: boolean;
  readonly isFeatured: boolean;
  readonly requirements: readonly string[];
  readonly revisionCount: number;
  readonly shortDescription: string;
  readonly slug: string;
  readonly tags: readonly string[];
  readonly title: string;
};

export type PublicServiceTier = {
  readonly deliverables: readonly string[];
  readonly description: string;
  readonly estimatedDays: number;
  readonly id: string;
  readonly name: PublicServiceTierName;
  readonly price: number;
  readonly revisionCount: number;
  readonly servicePackageId: string;
  readonly sortOrder: number;
};

export type PublicServiceAddon = {
  readonly compatibleServiceIds: readonly string[];
  readonly description: string;
  readonly id: string;
  readonly name: string;
  readonly price: number;
};

export type PublicPortfolioItem = {
  readonly categoryId: string;
  readonly clientName: string;
  readonly creatorId: string;
  readonly description: string;
  readonly externalUrl: string;
  readonly id: string;
  readonly isFeatured: boolean;
  readonly thumbnailUrl: string;
  readonly title: string;
};

export type PublicReview = {
  readonly comment: string;
  readonly communicationRating: number;
  readonly createdAt: string;
  readonly creatorId: string;
  readonly id: string;
  readonly isVisible: boolean;
  readonly orderId: string;
  readonly qualityRating: number;
  readonly rating: number;
  readonly timelinessRating: number;
  readonly umkmId: string;
};

export type PublicUmkmProfile = {
  readonly businessCategory: string;
  readonly businessName: string;
  readonly city: string;
  readonly contentPreference: readonly string[];
  readonly description: string;
  readonly id: string;
  readonly instagramUrl: string;
  readonly ownerName: string;
  readonly province: string;
  readonly targetAudience: readonly string[];
  readonly userId: string;
  readonly whatsappNumber: string;
};
