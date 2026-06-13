import { isDemoMode } from "@/lib/config/demo-mode";
import {
  getCreatorStatsFromMap,
  getCreatorStatsMap,
} from "@/features/creators/data/creator-stats";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type Tables = Database["public"]["Tables"];

export type CreatorAccountProfile = Pick<
  Tables["profiles"]["Row"],
  "avatar_url" | "email" | "full_name" | "id" | "phone"
>;
export type CreatorProfileRow = Tables["creator_profiles"]["Row"];

export type CreatorProfilePageData = {
  account: CreatorAccountProfile | null;
  activeServicesCount: number;
  averageRating: number;
  completedOrdersCount: number;
  portfolioCount: number;
  profile: CreatorProfileRow | null;
  reviewCount: number;
};

const emptyCreatorProfilePageData: CreatorProfilePageData = {
  account: null,
  activeServicesCount: 0,
  averageRating: 0,
  completedOrdersCount: 0,
  portfolioCount: 0,
  profile: null,
  reviewCount: 0,
};

async function getCurrentCreatorContext() {
  if (isDemoMode()) {
    return null;
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return null;
  }

  const { data: account, error: accountError } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, avatar_url, role, account_status")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (
    accountError ||
    !account ||
    account.role !== "creator" ||
    account.account_status !== "active"
  ) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("creator_profiles")
    .select("*")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return {
      account: {
        avatar_url: account.avatar_url,
        email: account.email,
        full_name: account.full_name,
        id: account.id,
        phone: account.phone,
      },
      profile: null,
      supabase,
    };
  }

  return {
    account: {
      avatar_url: account.avatar_url,
      email: account.email,
      full_name: account.full_name,
      id: account.id,
      phone: account.phone,
    },
    profile,
    supabase,
  };
}

export async function getCurrentCreatorProfilePageData(): Promise<CreatorProfilePageData> {
  try {
    const context = await getCurrentCreatorContext();

    if (!context) {
      return emptyCreatorProfilePageData;
    }

    if (!context.profile) {
      return {
        ...emptyCreatorProfilePageData,
        account: context.account,
      };
    }

    const [activeServicesCount, portfolioCount, statsMap] = await Promise.all([
      context.supabase
        .from("service_packages")
        .select("id", { count: "exact", head: true })
        .eq("creator_id", context.profile.id)
        .eq("is_active", true)
        .is("deleted_at", null),
      context.supabase
        .from("portfolios")
        .select("id", { count: "exact", head: true })
        .eq("creator_id", context.profile.id)
        .is("deleted_at", null),
      getCreatorStatsMap(
        context.supabase,
        [context.profile.id],
        [
          {
            averageRating: context.profile.average_rating,
            completedOrdersCount: context.profile.completed_orders_count,
            id: context.profile.id,
          },
        ],
      ),
    ]);
    const stats = getCreatorStatsFromMap(statsMap, context.profile.id);

    return {
      account: context.account,
      activeServicesCount:
        activeServicesCount.error || typeof activeServicesCount.count !== "number"
          ? 0
          : activeServicesCount.count,
      averageRating: stats.averageRating,
      completedOrdersCount: stats.completedOrdersCount,
      portfolioCount:
        portfolioCount.error || typeof portfolioCount.count !== "number"
          ? 0
          : portfolioCount.count,
      profile: context.profile,
      reviewCount: stats.reviewCount,
    };
  } catch {
    return emptyCreatorProfilePageData;
  }
}
