import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";

export type CreatorStats = {
  averageRating: number;
  completedOrdersCount: number;
  completedRevenue: number;
  reviewCount: number;
};

export const emptyCreatorStats: CreatorStats = {
  averageRating: 0,
  completedOrdersCount: 0,
  completedRevenue: 0,
  reviewCount: 0,
};

type CreatorStatsFallback = {
  averageRating?: number | null;
  completedOrdersCount?: number | null;
  id: string;
};

export async function getCreatorStatsMap(
  supabase: SupabaseClient<Database>,
  creatorIds: readonly string[],
  fallbacks: readonly CreatorStatsFallback[] = [],
) {
  const uniqueIds = Array.from(new Set(creatorIds.filter(Boolean)));
  const map = new Map<string, CreatorStats>();

  for (const fallback of fallbacks) {
    map.set(fallback.id, {
      averageRating: Number(fallback.averageRating ?? 0),
      completedOrdersCount: Number(fallback.completedOrdersCount ?? 0),
      completedRevenue: 0,
      reviewCount: 0,
    });
  }

  if (uniqueIds.length === 0) {
    return map;
  }

  const { data, error } = await supabase.rpc("get_creator_public_stats", {
    target_creator_ids: uniqueIds,
  });

  if (error || !data) {
    return map;
  }

  for (const item of data) {
    map.set(item.creator_id, {
      averageRating: Number(item.average_rating ?? 0),
      completedOrdersCount: Number(item.completed_orders_count ?? 0),
      completedRevenue: Number(item.completed_revenue ?? 0),
      reviewCount: Number(item.review_count ?? 0),
    });
  }

  return map;
}

export function getCreatorStatsFromMap(
  map: ReadonlyMap<string, CreatorStats>,
  creatorId: string,
) {
  return map.get(creatorId) ?? emptyCreatorStats;
}
