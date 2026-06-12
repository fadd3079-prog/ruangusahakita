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

export function createCreatorBannerStoragePath(
  creatorId: string,
  extension: AllowedImageExtension,
) {
  return `creators/${creatorId}/banner/${createFileName("banner", extension)}`;
}

export function createServiceCoverStoragePath(
  creatorId: string,
  serviceId: string,
  extension: AllowedImageExtension,
) {
  return `creators/${creatorId}/services/${serviceId}/${createFileName("cover", extension)}`;
}

export function createServiceMediaStoragePath(
  creatorId: string,
  serviceId: string,
  extension: AllowedImageExtension,
) {
  return `creators/${creatorId}/services/${serviceId}/${createFileName("media", extension)}`;
}

export function createUmkmLogoStoragePath(
  umkmId: string,
  extension: AllowedImageExtension,
) {
  return `umkm/${umkmId}/logo/${createFileName("logo", extension)}`;
}

export function createBriefAssetStoragePath(
  umkmId: string,
  briefId: string,
  extension: AllowedImageExtension,
) {
  return `umkm/${umkmId}/briefs/${briefId}/${createFileName("brief", extension)}`;
}
