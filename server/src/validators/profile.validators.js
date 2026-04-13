import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  avatarUrl: z.string().url().nullable().optional(),
});

export const updateBusinessProfileSchema = z.object({
  businessName: z.string().min(2).optional(),
  category: z.string().optional(),
  city: z.string().optional(),
  description: z.string().optional(),
  mainProduct: z.string().optional(),
  promotionTarget: z.string().optional(),
  contact: z.string().optional(),
});

export const updateCreatorProfileSchema = z.object({
  brandName: z.string().min(2).optional(),
  city: z.string().optional(),
  niche: z.string().optional(),
  platforms: z.array(z.string()).optional(),
  shortBio: z.string().optional(),
  fullBio: z.string().optional(),
  priceFrom: z.coerce.number().nonnegative().optional(),
  bannerUrl: z.string().url().nullable().optional(),
  portfolioUrl: z.string().url().nullable().optional(),
  socialLinks: z.record(z.string(), z.string()).optional(),
  isPublished: z.boolean().optional(),
});
