import {
  isAllowedImageExtension,
  isAllowedImageMimeType,
  isAllowedProjectResultExtension,
  isAllowedProjectResultMimeType,
  type AllowedImageExtension,
  type AllowedProjectResultExtension,
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

export type ProjectResultFileValidationResult =
  | {
      file: File;
      extension: AllowedProjectResultExtension;
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

function getProjectResultExtension(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  return isAllowedProjectResultExtension(extension) ? extension : null;
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

export function validateProjectResultFile(
  value: FormDataEntryValue,
  options: { maxSizeBytes: number },
): ProjectResultFileValidationResult {
  if (!(value instanceof File) || value.size === 0) {
    return { code: "missing", ok: false };
  }

  if (value.size > options.maxSizeBytes) {
    return { code: "size", ok: false };
  }

  if (!isAllowedProjectResultMimeType(value.type || "application/octet-stream")) {
    return { code: "type", ok: false };
  }

  const extension = getProjectResultExtension(value.name);

  if (!extension) {
    return { code: "extension", ok: false };
  }

  return {
    extension,
    file: value,
    ok: true,
  };
}
