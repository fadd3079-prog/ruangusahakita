export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const ALLOWED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp"] as const;
export const ALLOWED_PROJECT_RESULT_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "text/plain",
  "text/html",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
  "application/x-zip-compressed",
  "application/vnd.rar",
  "application/x-rar-compressed",
  "application/postscript",
  "application/octet-stream",
] as const;
export const ALLOWED_PROJECT_RESULT_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  "mp4",
  "webm",
  "mov",
  "txt",
  "doc",
  "docx",
  "pdf",
  "html",
  "zip",
  "rar",
  "psd",
  "ai",
] as const;

export type AllowedImageMimeType = (typeof ALLOWED_IMAGE_MIME_TYPES)[number];
export type AllowedImageExtension = (typeof ALLOWED_IMAGE_EXTENSIONS)[number];
export type AllowedProjectResultMimeType =
  (typeof ALLOWED_PROJECT_RESULT_MIME_TYPES)[number];
export type AllowedProjectResultExtension =
  (typeof ALLOWED_PROJECT_RESULT_EXTENSIONS)[number];

export function isAllowedImageMimeType(value: string): value is AllowedImageMimeType {
  return ALLOWED_IMAGE_MIME_TYPES.includes(value as AllowedImageMimeType);
}

export function isAllowedImageExtension(value: string): value is AllowedImageExtension {
  return ALLOWED_IMAGE_EXTENSIONS.includes(value.toLowerCase() as AllowedImageExtension);
}

export function isAllowedProjectResultMimeType(
  value: string,
): value is AllowedProjectResultMimeType {
  return ALLOWED_PROJECT_RESULT_MIME_TYPES.includes(
    value as AllowedProjectResultMimeType,
  );
}

export function isAllowedProjectResultExtension(
  value: string,
): value is AllowedProjectResultExtension {
  return ALLOWED_PROJECT_RESULT_EXTENSIONS.includes(
    value.toLowerCase() as AllowedProjectResultExtension,
  );
}
