"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type Supabase = Awaited<ReturnType<typeof createClient>>;

function getText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function getTextList(formData: FormData, key: string) {
  return getText(formData, key)
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function isValidDate(value: string) {
  return !value || /^\d{4}-\d{2}-\d{2}$/.test(value);
}

async function requireCurrentUmkm(supabase: Supabase) {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    redirect("/login");
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
    redirect("/umkm/dashboard?error=unauthorized");
  }

  const { data: umkm, error: umkmError } = await supabase
    .from("umkm_profiles")
    .select("id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (umkmError || !umkm) {
    redirect("/umkm/dashboard?error=profile");
  }

  return umkm;
}

export async function updateUmkmBrief(formData: FormData) {
  const briefId = getText(formData, "briefId");
  const businessName = getText(formData, "businessName");
  const businessCategory = getText(formData, "businessCategory");
  const promotedFocus = getText(formData, "promotedFocus");
  const campaignGoal = getText(formData, "campaignGoal");
  const deadline = getText(formData, "deadline");

  if (!briefId) {
    redirect("/umkm/briefs?error=not_found");
  }

  if (!businessName || !businessCategory || !promotedFocus || !campaignGoal) {
    redirect(`/umkm/briefs/${briefId}?error=required`);
  }

  if (!isValidDate(deadline)) {
    redirect(`/umkm/briefs/${briefId}?error=date`);
  }

  const supabase = await createClient();
  const umkm = await requireCurrentUmkm(supabase);
  const { data: brief, error: briefError } = await supabase
    .from("campaign_briefs")
    .select("id, order_id, status")
    .eq("id", briefId)
    .eq("umkm_id", umkm.id)
    .maybeSingle();

  if (briefError || !brief) {
    redirect("/umkm/briefs?error=not_found");
  }

  if (brief.order_id || brief.status !== "draft") {
    redirect(`/umkm/briefs/${briefId}?error=locked`);
  }

  const { error } = await supabase
    .from("campaign_briefs")
    .update({
      additional_notes: getText(formData, "additionalNotes") || null,
      business_category: businessCategory,
      business_name: businessName,
      campaign_goal: campaignGoal,
      content_platforms: getTextList(formData, "contentPlatforms"),
      content_style: getText(formData, "contentStyle") || null,
      deadline: deadline || null,
      promoted_product: promotedFocus,
      reference_links: getTextList(formData, "referenceLinks"),
      status: "draft",
      target_audience: getText(formData, "targetAudience") || null,
    })
    .eq("id", brief.id)
    .eq("umkm_id", umkm.id)
    .is("order_id", null);

  if (error) {
    redirect(`/umkm/briefs/${briefId}?error=save`);
  }

  revalidatePath("/umkm/briefs");
  revalidatePath(`/umkm/briefs/${briefId}`);
  revalidatePath("/umkm/checkout");
  redirect(`/umkm/briefs/${briefId}?updated=1`);
}
