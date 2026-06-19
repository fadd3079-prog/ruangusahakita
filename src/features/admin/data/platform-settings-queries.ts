import "server-only";

import { unstable_noStore as noStore } from "next/cache";

import { isDemoMode } from "@/lib/config/demo-mode";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/types";

export type PlatformSettingRow = {
  description: string | null;
  key: string;
  updated_at: string;
  updated_by: string | null;
  value: Json;
};

export type PlatformSettingsMap = Record<string, Json>;

export type PlatformFeeConfig = {
  adminFeeFlat: number;
  adminFeeMax: number;
  adminFeeMin: number;
  platformFeePercentage: number;
};

export type SettingsAuditEntry = {
  action: string;
  actorEmail: string | null;
  actorName: string | null;
  createdAt: string;
  id: string;
  metadata: Json;
};

type RawSettingRow = {
  key: string;
  value: Json;
};

type RawAuditRow = {
  action: string;
  actor_id: string | null;
  created_at: string;
  id: string;
  metadata: Json;
};

type RawProfileRow = {
  email: string;
  full_name: string;
  id: string;
};

type QueryResult<T> = Promise<{
  data: T[] | null;
  error: {
    message: string;
  } | null;
}>;

type PlatformSettingsSelectBuilder = {
  select: (columns: "key, value") => QueryResult<RawSettingRow>;
};

type ActivityLogsSelectBuilder = {
  select: (columns: "id, actor_id, action, metadata, created_at") => {
    eq: (column: "entity_type", value: "platform_settings") => {
      order: (
        column: "created_at",
        options: {
          ascending: false;
        },
      ) => {
        limit: (count: 50) => QueryResult<RawAuditRow>;
      };
    };
  };
};

type UntypedAdminClient = {
  from(table: "activity_logs"): ActivityLogsSelectBuilder;
  from(table: "platform_settings"): PlatformSettingsSelectBuilder;
};

function untypedAdmin() {
  return createAdminClient() as unknown as UntypedAdminClient;
}

function toNumber(json: Json | undefined, field: string, fallback: number): number {
  if (json && typeof json === "object" && !Array.isArray(json)) {
    const val = (json as Record<string, Json | undefined>)[field];
    if (typeof val === "number") return val;
  }
  return fallback;
}

function toString(json: Json | undefined, field: string, fallback: string): string {
  if (json && typeof json === "object" && !Array.isArray(json)) {
    const val = (json as Record<string, Json | undefined>)[field];
    if (typeof val === "string") return val;
  }
  return fallback;
}

function toBoolean(json: Json | undefined, field: string, fallback: boolean): boolean {
  if (json && typeof json === "object" && !Array.isArray(json)) {
    const val = (json as Record<string, Json | undefined>)[field];
    if (typeof val === "boolean") return val;
  }
  return fallback;
}

function toStringArray(json: Json | undefined, field: string, fallback: string[]): string[] {
  if (json && typeof json === "object" && !Array.isArray(json)) {
    const val = (json as Record<string, Json | undefined>)[field];
    if (Array.isArray(val)) {
      return val.filter((v): v is string => typeof v === "string");
    }
  }
  return fallback;
}

const DEFAULT_SETTINGS: PlatformSettingsMap = {
  admin_fee_flat: { amount: 5000 },
  admin_fee_max: { amount: 50000 },
  admin_fee_min: { amount: 0 },
  catalog_only_active_creators: { enabled: true },
  catalog_only_active_services: { enabled: true },
  catalog_only_visible_reviews: { enabled: true },
  complaint_default_status: { status: "open" },
  default_creator_visibility: { visible: true },
  default_service_status: { status: "active" },
  email_notification_enabled: { enabled: false },
  maintenance_message: { value: "Platform sedang dalam pemeliharaan. Silakan coba beberapa saat lagi." },
  maintenance_mode: { enabled: false },
  notif_complaint_created: { enabled: true },
  notif_message_new: { enabled: true },
  notif_order_created: { enabled: true },
  notif_payment_paid: { enabled: true },
  notif_result_submitted: { enabled: true },
  notif_review_created: { enabled: true },
  notif_revision_requested: { enabled: true },
  payment_methods_available: { methods: ["qris_sandbox", "manual_transfer"] },
  payment_mode: { mode: "sandbox" },
  platform_fee_percentage: { percentage: 10 },
  review_auto_visible: { enabled: true },
  review_min_rating_highlight: { rating: 4 },
  site_name: { value: "Ruang Usaha Kita" },
  site_tagline: { value: "Marketplace jasa digital untuk UMKM dan kreator" },
  site_url: { value: "https://ruangusahakita.com" },
  social_instagram: { value: "" },
  social_tiktok: { value: "" },
  support_email: { value: "bantuan@ruangusahakita.com" },
  support_text: { value: "Hubungi tim kami jika Anda membutuhkan bantuan terkait layanan di Ruang Usaha Kita." },
  support_whatsapp: { value: "" },
};

export async function getAllPlatformSettings(): Promise<PlatformSettingsMap> {
  noStore();

  if (isDemoMode()) {
    return { ...DEFAULT_SETTINGS };
  }

  try {
    const { data, error } = await untypedAdmin()
      .from("platform_settings")
      .select("key, value");

    if (error || !data || data.length === 0) {
      return { ...DEFAULT_SETTINGS };
    }

    const map: PlatformSettingsMap = { ...DEFAULT_SETTINGS };

    for (const row of data) {
      map[row.key] = row.value;
    }

    return map;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function getPlatformFeeConfig(): Promise<PlatformFeeConfig> {
  const settings = await getAllPlatformSettings();

  return {
    adminFeeFlat: toNumber(settings.admin_fee_flat, "amount", 5000),
    adminFeeMax: toNumber(settings.admin_fee_max, "amount", 50000),
    adminFeeMin: toNumber(settings.admin_fee_min, "amount", 0),
    platformFeePercentage: toNumber(settings.platform_fee_percentage, "percentage", 10),
  };
}

export function extractSettingsValues(settings: PlatformSettingsMap) {
  return {
    adminFeeFlat: toNumber(settings.admin_fee_flat, "amount", 5000),
    adminFeeMax: toNumber(settings.admin_fee_max, "amount", 50000),
    adminFeeMin: toNumber(settings.admin_fee_min, "amount", 0),
    catalogOnlyActiveCreators: toBoolean(settings.catalog_only_active_creators, "enabled", true),
    catalogOnlyActiveServices: toBoolean(settings.catalog_only_active_services, "enabled", true),
    catalogOnlyVisibleReviews: toBoolean(settings.catalog_only_visible_reviews, "enabled", true),
    complaintDefaultStatus: toString(settings.complaint_default_status, "status", "open"),
    defaultCreatorVisibility: toBoolean(settings.default_creator_visibility, "visible", true),
    defaultServiceStatus: toString(settings.default_service_status, "status", "active"),
    emailNotificationEnabled: toBoolean(settings.email_notification_enabled, "enabled", false),
    maintenanceMessage: toString(settings.maintenance_message, "value", ""),
    maintenanceMode: toBoolean(settings.maintenance_mode, "enabled", false),
    notifComplaintCreated: toBoolean(settings.notif_complaint_created, "enabled", true),
    notifMessageNew: toBoolean(settings.notif_message_new, "enabled", true),
    notifOrderCreated: toBoolean(settings.notif_order_created, "enabled", true),
    notifPaymentPaid: toBoolean(settings.notif_payment_paid, "enabled", true),
    notifResultSubmitted: toBoolean(settings.notif_result_submitted, "enabled", true),
    notifReviewCreated: toBoolean(settings.notif_review_created, "enabled", true),
    notifRevisionRequested: toBoolean(settings.notif_revision_requested, "enabled", true),
    paymentMethodsAvailable: toStringArray(settings.payment_methods_available, "methods", ["qris_sandbox", "manual_transfer"]),
    paymentMode: toString(settings.payment_mode, "mode", "sandbox"),
    platformFeePercentage: toNumber(settings.platform_fee_percentage, "percentage", 10),
    reviewAutoVisible: toBoolean(settings.review_auto_visible, "enabled", true),
    reviewMinRatingHighlight: toNumber(settings.review_min_rating_highlight, "rating", 4),
    siteName: toString(settings.site_name, "value", "Ruang Usaha Kita"),
    siteTagline: toString(settings.site_tagline, "value", ""),
    siteUrl: toString(settings.site_url, "value", ""),
    socialInstagram: toString(settings.social_instagram, "value", ""),
    socialTiktok: toString(settings.social_tiktok, "value", ""),
    supportEmail: toString(settings.support_email, "value", ""),
    supportText: toString(settings.support_text, "value", ""),
    supportWhatsapp: toString(settings.support_whatsapp, "value", ""),
  };
}

export type ExtractedSettings = ReturnType<typeof extractSettingsValues>;

export async function getSettingsAuditLog(): Promise<SettingsAuditEntry[]> {
  noStore();

  if (isDemoMode()) {
    return [];
  }

  try {
    const { data, error } = await untypedAdmin()
      .from("activity_logs")
      .select("id, actor_id, action, metadata, created_at")
      .eq("entity_type", "platform_settings")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error || !data) {
      return [];
    }

    const actorIds = [...new Set(data.map((d) => d.actor_id).filter(Boolean))] as string[];

    let actorMap = new Map<string, { email: string; full_name: string }>();

    if (actorIds.length > 0) {
      const { data: profiles } = await createAdminClient()
        .from("profiles")
        .select("id, full_name, email")
        .in("id", actorIds) as { data: RawProfileRow[] | null };

      if (profiles) {
        actorMap = new Map(profiles.map((p) => [p.id, { email: p.email, full_name: p.full_name }]));
      }
    }

    return data.map((entry) => {
      const actor = entry.actor_id ? actorMap.get(entry.actor_id) : null;
      return {
        action: entry.action,
        actorEmail: actor?.email ?? null,
        actorName: actor?.full_name ?? null,
        createdAt: entry.created_at,
        id: entry.id,
        metadata: entry.metadata ?? {},
      };
    });
  } catch {
    return [];
  }
}
