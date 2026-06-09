import type { SupabaseClient } from "@supabase/supabase-js";

import { STORAGE_BUCKETS } from "@/lib/storage/buckets";
import type { Database } from "@/lib/supabase/types";

type SupabaseDatabaseClient = SupabaseClient<Database>;

export function getAvatarPublicUrl(
  supabase: SupabaseDatabaseClient,
  storagePath: string,
) {
  const { data } = supabase.storage
    .from(STORAGE_BUCKETS.AVATARS)
    .getPublicUrl(storagePath);

  return data.publicUrl;
}

export async function createPortfolioThumbnailSignedUrl(
  supabase: SupabaseDatabaseClient,
  storagePath: string | null,
) {
  if (!storagePath) {
    return null;
  }

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.PORTFOLIOS)
    .createSignedUrl(storagePath, 60 * 60);

  if (error || !data?.signedUrl) {
    return null;
  }

  return data.signedUrl;
}
