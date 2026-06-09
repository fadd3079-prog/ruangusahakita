import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type Tables = Database["public"]["Tables"];
type BriefRow = Tables["campaign_briefs"]["Row"];
type OrderRow = Tables["orders"]["Row"];

export type UmkmBriefDetail = {
  additionalNotes: string | null;
  assetUrls: readonly string[];
  businessCategory: string | null;
  businessName: string;
  campaignGoal: string;
  contentPlatforms: readonly string[];
  contentStyle: string | null;
  createdAt: string;
  deadline: string | null;
  id: string;
  isEditable: boolean;
  order: {
    id: string;
    orderNumber: string;
    orderStatus: Database["public"]["Enums"]["order_status"];
  } | null;
  promotedFocus: string;
  referenceLinks: readonly string[];
  status: string;
  targetAudience: string | null;
  updatedAt: string;
};

async function getCurrentUmkmProfile(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, account_status")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (
    profileError ||
    !profile ||
    profile.role !== "umkm" ||
    profile.account_status !== "active"
  ) {
    return null;
  }

  const { data: umkm, error: umkmError } = await supabase
    .from("umkm_profiles")
    .select("*")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (umkmError || !umkm) {
    return null;
  }

  return umkm;
}

export async function getCurrentUmkmBriefDetail(briefId: string) {
  try {
    const supabase = await createClient();
    const umkm = await getCurrentUmkmProfile(supabase);

    if (!umkm) {
      return null;
    }

    const { data: brief, error } = await supabase
      .from("campaign_briefs")
      .select("*")
      .eq("id", briefId)
      .eq("umkm_id", umkm.id)
      .maybeSingle();

    if (error || !brief) {
      return null;
    }

    const order = await getBriefOrder(supabase, brief);

    return mapBriefDetail(brief, order);
  } catch {
    return null;
  }
}

async function getBriefOrder(
  supabase: Awaited<ReturnType<typeof createClient>>,
  brief: BriefRow,
) {
  if (!brief.order_id) {
    return null;
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", brief.order_id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

function mapBriefDetail(brief: BriefRow, order: OrderRow | null): UmkmBriefDetail {
  return {
    additionalNotes: brief.additional_notes,
    assetUrls: brief.asset_urls ?? [],
    businessCategory: brief.business_category,
    businessName: brief.business_name,
    campaignGoal: brief.campaign_goal,
    contentPlatforms: brief.content_platforms ?? [],
    contentStyle: brief.content_style,
    createdAt: brief.created_at,
    deadline: brief.deadline,
    id: brief.id,
    isEditable: brief.order_id === null && brief.status === "draft",
    order: order
      ? {
          id: order.id,
          orderNumber: order.order_number,
          orderStatus: order.order_status,
        }
      : null,
    promotedFocus: brief.promoted_product,
    referenceLinks: brief.reference_links ?? [],
    status: brief.status,
    targetAudience: brief.target_audience,
    updatedAt: brief.updated_at,
  };
}
