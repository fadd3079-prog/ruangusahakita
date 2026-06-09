import type { SupabaseClient } from "@supabase/supabase-js";

import { STORAGE_BUCKETS } from "@/lib/storage/buckets";
import type { StorageBucket } from "@/lib/storage/buckets";
import type { Database } from "@/lib/supabase/types";

type SupabaseDatabaseClient = SupabaseClient<Database>;

export function getAvatarPublicUrl(
  supabase: SupabaseDatabaseClient,
  storagePath: string,
) {
  return getPublicStorageUrl(supabase, STORAGE_BUCKETS.AVATARS, storagePath);
}

export function getPublicStorageUrl(
  supabase: SupabaseDatabaseClient,
  bucket: StorageBucket,
  storagePath: string,
) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(storagePath);

  return data.publicUrl;
}

export function getPublicAssetUrl(
  supabase: SupabaseDatabaseClient,
  storagePath: string,
) {
  return getPublicStorageUrl(supabase, STORAGE_BUCKETS.PUBLIC_ASSETS, storagePath);
}

export async function createPortfolioThumbnailSignedUrl(
  supabase: SupabaseDatabaseClient,
  storagePath: string | null,
) {
  return createStorageSignedUrl(
    supabase,
    STORAGE_BUCKETS.PORTFOLIOS,
    storagePath,
    60 * 60,
  );
}

export async function createStorageSignedUrl(
  supabase: SupabaseDatabaseClient,
  bucket: StorageBucket,
  storagePath: string | null,
  expiresIn = 60 * 60,
) {
  if (!storagePath) {
    return null;
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(storagePath, expiresIn);

  if (error || !data?.signedUrl) {
    return null;
  }

  return data.signedUrl;
}
