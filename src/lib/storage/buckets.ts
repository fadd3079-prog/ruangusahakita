export const STORAGE_BUCKETS = {
  AVATARS: "avatars",
  BRIEF_ASSETS: "brief-assets",
  BUSINESS_ASSETS: "business-assets",
  PORTFOLIOS: "portfolios",
  PROJECT_RESULTS: "project-results",
  PUBLIC_ASSETS: "public-assets",
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];
