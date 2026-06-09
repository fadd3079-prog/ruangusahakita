export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"] as const;

export type AllowedImageMimeType = (typeof ALLOWED_IMAGE_MIME_TYPES)[number];
export type AllowedImageExtension = (typeof ALLOWED_IMAGE_EXTENSIONS)[number];

export function isAllowedImageMimeType(value: string): value is AllowedImageMimeType {
  return ALLOWED_IMAGE_MIME_TYPES.includes(value as AllowedImageMimeType);
}

export function isAllowedImageExtension(value: string): value is AllowedImageExtension {
  return ALLOWED_IMAGE_EXTENSIONS.includes(value.toLowerCase() as AllowedImageExtension);
}
