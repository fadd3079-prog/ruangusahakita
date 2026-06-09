import { randomUUID } from "node:crypto";

import type { AllowedImageExtension } from "@/lib/storage/file-types";

function createFileName(prefix: string, extension: AllowedImageExtension) {
  const suffix = randomUUID().replace(/-/g, "").slice(0, 12);
  return `${prefix}-${Date.now()}-${suffix}.${extension}`;
}

export function createAvatarStoragePath(
  userId: string,
  extension: AllowedImageExtension,
) {
  return `${userId}/${createFileName("avatar", extension)}`;
}

export function createPortfolioThumbnailStoragePath(
  creatorId: string,
  portfolioId: string,
  extension: AllowedImageExtension,
) {
  return `${creatorId}/${portfolioId}/${createFileName("portfolio", extension)}`;
}
