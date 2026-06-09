import {
  isAllowedImageExtension,
  isAllowedImageMimeType,
  type AllowedImageExtension,
} from "@/lib/storage/file-types";

export type FileValidationErrorCode =
  | "missing"
  | "type"
  | "extension"
  | "size";

export type ImageFileValidationResult =
  | {
      file: File;
      extension: AllowedImageExtension;
      ok: true;
    }
  | {
      file: null;
      extension: null;
      ok: true;
    }
  | {
      code: FileValidationErrorCode;
      ok: false;
    };

type ValidateImageFileOptions = {
  maxSizeBytes: number;
  required?: boolean;
};

function getExtension(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  return isAllowedImageExtension(extension) ? extension : null;
}

export function validateImageFile(
  value: FormDataEntryValue | null,
  options: ValidateImageFileOptions,
): ImageFileValidationResult {
  if (!(value instanceof File) || value.size === 0) {
    return options.required ? { code: "missing", ok: false } : {
      file: null,
      extension: null,
      ok: true,
    };
  }

  if (value.size > options.maxSizeBytes) {
    return { code: "size", ok: false };
  }

  if (!isAllowedImageMimeType(value.type)) {
    return { code: "type", ok: false };
  }

  const extension = getExtension(value.name);

  if (!extension) {
    return { code: "extension", ok: false };
  }

  return {
    file: value,
    extension,
    ok: true,
  };
}
