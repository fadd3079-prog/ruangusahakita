import { z } from "zod";

export const requestStatusSchema = z.enum([
  "draft",
  "submitted",
  "reviewed",
  "accepted",
  "in_progress",
  "done",
]);

export const createRequestSchema = z.object({
  creatorProfileId: z.string().uuid().optional(),
  creatorSlug: z.string().optional(),
  serviceId: z.string().uuid().optional(),
  serviceSlug: z.string().optional(),
  title: z.string().optional(),
  businessName: z.string().min(2),
  businessCategory: z.string().optional(),
  productName: z.string().min(2),
  promotionGoal: z.string().min(2),
  targetAudience: z.string().min(2),
  budgetRange: z.string().optional(),
  deadline: z.string().optional(),
  notes: z.string().optional(),
  aiDraft: z.string().optional(),
  status: requestStatusSchema.optional(),
});

export const updateRequestStatusSchema = z.object({
  status: requestStatusSchema,
});
