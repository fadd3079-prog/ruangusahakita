import type { SupabaseClient } from "@supabase/supabase-js";

import type { StorageBucket } from "@/lib/storage/buckets";
import type { Database } from "@/lib/supabase/types";

type SupabaseDatabaseClient = SupabaseClient<Database>;
type FileAssetInsert = Database["public"]["Tables"]["file_assets"]["Insert"];
type FileAssetRow = Database["public"]["Tables"]["file_assets"]["Row"];

export type FileAssetVisibility = "public" | "private" | "restricted" | "internal";

type UploadFileAssetInput = {
  bucket: StorageBucket;
  context: string;
  creatorId?: string | null;
  extension: string;
  file: File;
  ownerId: string;
  storagePath: string;
  supabase: SupabaseDatabaseClient;
  uploadedBy: string;
  visibility: FileAssetVisibility;
  umkmId?: string | null;
  servicePackageId?: string | null;
  portfolioId?: string | null;
  orderId?: string | null;
  briefId?: string | null;
  submissionId?: string | null;
  revisionId?: string | null;
  invoiceId?: string | null;
  complaintId?: string | null;
};

export type UploadedFileAsset = {
  asset: FileAssetRow;
  storagePath: string;
};

function getStorageFileName(storagePath: string) {
  return storagePath.split("/").pop() ?? storagePath;
}

export async function uploadFileAsset({
  bucket,
  context,
  creatorId = null,
  extension,
  file,
  ownerId,
  storagePath,
  supabase,
  uploadedBy,
  visibility,
  umkmId = null,
  servicePackageId = null,
  portfolioId = null,
  orderId = null,
  briefId = null,
  submissionId = null,
  revisionId = null,
  invoiceId = null,
  complaintId = null,
}: UploadFileAssetInput) {
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(storagePath, file, {
      cacheControl: "3600",
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    return { asset: null, error: uploadError, storagePath };
  }

  const payload: FileAssetInsert = {
    bucket_name: bucket,
    context,
    creator_id: creatorId,
    file_extension: extension,
    file_name: getStorageFileName(storagePath),
    file_size: file.size,
    mime_type: file.type || "application/octet-stream",
    owner_id: ownerId,
    original_filename: file.name,
    storage_path: storagePath,
    uploaded_by: uploadedBy,
    visibility,
    umkm_id: umkmId,
    service_package_id: servicePackageId,
    portfolio_id: portfolioId,
    order_id: orderId,
    brief_id: briefId,
    submission_id: submissionId,
    revision_id: revisionId,
    invoice_id: invoiceId,
    complaint_id: complaintId,
  };

  const { data: asset, error: metadataError } = await supabase
    .from("file_assets")
    .insert(payload)
    .select("*")
    .single();

  if (metadataError || !asset) {
    await supabase.storage.from(bucket).remove([storagePath]);
    return { asset: null, error: metadataError, storagePath };
  }

  return {
    asset,
    error: null,
    storagePath,
  };
}
