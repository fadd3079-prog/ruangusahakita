"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function untypedAdmin() {
  return createAdminClient() as any;
}

type SettingUpdate = {
  key: string;
  newValue: Json;
  oldValue: Json;
};

function parseNumber(raw: string | null, fallback: number): number {
  if (raw === null || raw === "") return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return n;
}

function parseBoolean(raw: string | null): boolean {
  return raw === "true" || raw === "on";
}

function getText(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

async function requireAdmin() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user.user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, account_status, full_name, email")
    .eq("id", user.user.id)
    .maybeSingle();

  if (!profile || profile.role !== "admin" || profile.account_status !== "active") {
    return null;
  }

  return profile;
}

async function upsertSettings(
  adminId: string,
  updates: SettingUpdate[],
) {
  const db = untypedAdmin();
  const errors: string[] = [];

  for (const update of updates) {
    const { error } = await db
      .from("platform_settings")
      .upsert(
        {
          key: update.key,
          updated_at: new Date().toISOString(),
          updated_by: adminId,
          value: update.newValue,
        },
        { onConflict: "key" },
      );

    if (error) {
      errors.push(`${update.key}: ${error.message}`);
    }
  }

  if (updates.length > 0) {
    await db.from("activity_logs").insert({
      action: "admin_updated_settings",
      actor_id: adminId,
      entity_type: "platform_settings",
      metadata: {
        changes: updates.map((u) => ({
          key: u.key,
          new_value: u.newValue,
          old_value: u.oldValue,
        })),
        count: updates.length,
      },
    });
  }

  return errors;
}

export type SaveSettingsResult = {
  error?: string;
  success: boolean;
};

export async function savePlatformFeeSettingsAction(
  formData: FormData,
): Promise<SaveSettingsResult> {
  const admin = await requireAdmin();

  if (!admin) {
    return { error: "Anda tidak memiliki izin untuk mengubah pengaturan.", success: false };
  }

  const percentage = parseNumber(getText(formData, "platformFeePercentage"), -1);
  const flatFee = parseNumber(getText(formData, "adminFeeFlat"), -1);
  const minFee = parseNumber(getText(formData, "adminFeeMin"), 0);
  const maxFee = parseNumber(getText(formData, "adminFeeMax"), 50000);

  if (percentage < 0 || percentage > 100) {
    return { error: "Persentase komisi harus antara 0 dan 100.", success: false };
  }

  if (flatFee < 0) {
    return { error: "Biaya admin tidak boleh negatif.", success: false };
  }

  if (minFee < 0) {
    return { error: "Minimum biaya admin tidak boleh negatif.", success: false };
  }

  if (maxFee < 0) {
    return { error: "Maksimum biaya admin tidak boleh negatif.", success: false };
  }

  if (minFee > maxFee && maxFee > 0) {
    return { error: "Minimum biaya admin tidak boleh lebih besar dari maksimum.", success: false };
  }

  const updates: SettingUpdate[] = [
    { key: "platform_fee_percentage", newValue: { percentage }, oldValue: {} },
    { key: "admin_fee_flat", newValue: { amount: flatFee }, oldValue: {} },
    { key: "admin_fee_min", newValue: { amount: minFee }, oldValue: {} },
    { key: "admin_fee_max", newValue: { amount: maxFee }, oldValue: {} },
  ];

  const errors = await upsertSettings(admin.id, updates);

  if (errors.length > 0) {
    return { error: errors.join(", "), success: false };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/umkm/cart");
  revalidatePath("/umkm/checkout");
  return { success: true };
}

export async function saveCatalogSettingsAction(
  formData: FormData,
): Promise<SaveSettingsResult> {
  const admin = await requireAdmin();

  if (!admin) {
    return { error: "Anda tidak memiliki izin untuk mengubah pengaturan.", success: false };
  }

  const updates: SettingUpdate[] = [
    {
      key: "default_service_status",
      newValue: { status: getText(formData, "defaultServiceStatus") || "active" },
      oldValue: {},
    },
    {
      key: "default_creator_visibility",
      newValue: { visible: parseBoolean(getText(formData, "defaultCreatorVisibility")) },
      oldValue: {},
    },
    {
      key: "catalog_only_active_creators",
      newValue: { enabled: parseBoolean(getText(formData, "catalogOnlyActiveCreators")) },
      oldValue: {},
    },
    {
      key: "catalog_only_active_services",
      newValue: { enabled: parseBoolean(getText(formData, "catalogOnlyActiveServices")) },
      oldValue: {},
    },
    {
      key: "catalog_only_visible_reviews",
      newValue: { enabled: parseBoolean(getText(formData, "catalogOnlyVisibleReviews")) },
      oldValue: {},
    },
  ];

  const errors = await upsertSettings(admin.id, updates);

  if (errors.length > 0) {
    return { error: errors.join(", "), success: false };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/katalog");
  return { success: true };
}

export async function saveReviewSettingsAction(
  formData: FormData,
): Promise<SaveSettingsResult> {
  const admin = await requireAdmin();

  if (!admin) {
    return { error: "Anda tidak memiliki izin untuk mengubah pengaturan.", success: false };
  }

  const minRating = parseNumber(getText(formData, "reviewMinRatingHighlight"), 4);

  if (minRating < 1 || minRating > 5) {
    return { error: "Rating minimum harus antara 1 dan 5.", success: false };
  }

  const updates: SettingUpdate[] = [
    {
      key: "review_auto_visible",
      newValue: { enabled: parseBoolean(getText(formData, "reviewAutoVisible")) },
      oldValue: {},
    },
    {
      key: "review_min_rating_highlight",
      newValue: { rating: minRating },
      oldValue: {},
    },
    {
      key: "complaint_default_status",
      newValue: { status: getText(formData, "complaintDefaultStatus") || "open" },
      oldValue: {},
    },
  ];

  const errors = await upsertSettings(admin.id, updates);

  if (errors.length > 0) {
    return { error: errors.join(", "), success: false };
  }

  revalidatePath("/admin/settings");
  return { success: true };
}

export async function saveNotificationSettingsAction(
  formData: FormData,
): Promise<SaveSettingsResult> {
  const admin = await requireAdmin();

  if (!admin) {
    return { error: "Anda tidak memiliki izin untuk mengubah pengaturan.", success: false };
  }

  const updates: SettingUpdate[] = [
    { key: "notif_order_created", newValue: { enabled: parseBoolean(getText(formData, "notifOrderCreated")) }, oldValue: {} },
    { key: "notif_payment_paid", newValue: { enabled: parseBoolean(getText(formData, "notifPaymentPaid")) }, oldValue: {} },
    { key: "notif_result_submitted", newValue: { enabled: parseBoolean(getText(formData, "notifResultSubmitted")) }, oldValue: {} },
    { key: "notif_revision_requested", newValue: { enabled: parseBoolean(getText(formData, "notifRevisionRequested")) }, oldValue: {} },
    { key: "notif_review_created", newValue: { enabled: parseBoolean(getText(formData, "notifReviewCreated")) }, oldValue: {} },
    { key: "notif_complaint_created", newValue: { enabled: parseBoolean(getText(formData, "notifComplaintCreated")) }, oldValue: {} },
    { key: "notif_message_new", newValue: { enabled: parseBoolean(getText(formData, "notifMessageNew")) }, oldValue: {} },
  ];

  const errors = await upsertSettings(admin.id, updates);

  if (errors.length > 0) {
    return { error: errors.join(", "), success: false };
  }

  revalidatePath("/admin/settings");
  return { success: true };
}

export async function saveContactSettingsAction(
  formData: FormData,
): Promise<SaveSettingsResult> {
  const admin = await requireAdmin();

  if (!admin) {
    return { error: "Anda tidak memiliki izin untuk mengubah pengaturan.", success: false };
  }

  const updates: SettingUpdate[] = [
    { key: "support_email", newValue: { value: getText(formData, "supportEmail") }, oldValue: {} },
    { key: "support_whatsapp", newValue: { value: getText(formData, "supportWhatsapp") }, oldValue: {} },
    { key: "support_text", newValue: { value: getText(formData, "supportText") }, oldValue: {} },
    { key: "social_instagram", newValue: { value: getText(formData, "socialInstagram") }, oldValue: {} },
    { key: "social_tiktok", newValue: { value: getText(formData, "socialTiktok") }, oldValue: {} },
  ];

  const errors = await upsertSettings(admin.id, updates);

  if (errors.length > 0) {
    return { error: errors.join(", "), success: false };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/bantuan");
  return { success: true };
}

export async function saveAppearanceSettingsAction(
  formData: FormData,
): Promise<SaveSettingsResult> {
  const admin = await requireAdmin();

  if (!admin) {
    return { error: "Anda tidak memiliki izin untuk mengubah pengaturan.", success: false };
  }

  const updates: SettingUpdate[] = [
    { key: "site_name", newValue: { value: getText(formData, "siteName") || "Ruang Usaha Kita" }, oldValue: {} },
    { key: "site_tagline", newValue: { value: getText(formData, "siteTagline") }, oldValue: {} },
    { key: "site_url", newValue: { value: getText(formData, "siteUrl") }, oldValue: {} },
    { key: "maintenance_mode", newValue: { enabled: parseBoolean(getText(formData, "maintenanceMode")) }, oldValue: {} },
    { key: "maintenance_message", newValue: { value: getText(formData, "maintenanceMessage") }, oldValue: {} },
  ];

  const errors = await upsertSettings(admin.id, updates);

  if (errors.length > 0) {
    return { error: errors.join(", "), success: false };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { success: true };
}
