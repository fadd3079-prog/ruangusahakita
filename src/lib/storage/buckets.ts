export const STORAGE_BUCKETS = {
  AVATARS: "avatars",
  PORTFOLIOS: "portfolios",
} as const;

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];
