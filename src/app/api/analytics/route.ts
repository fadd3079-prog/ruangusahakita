import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/lib/supabase/types";

const eventTypes = [
  "page_view",
  "catalog_view",
  "service_view",
  "creator_view",
  "portfolio_view",
  "cta_click",
  "add_to_cart",
  "checkout_start",
  "brief_submit",
  "order_created",
  "payment_opened",
  "payment_paid",
  "creator_accept_order",
  "creator_start_order",
  "outbound_click",
] as const;

const payloadSchema = z.object({
  eventType: z.enum(eventTypes),
  path: z.string().trim().min(1).max(500),
  referrer: z.string().trim().max(500).nullable().optional(),
  metadata: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()])).optional(),
});

type ProfileRole = Database["public"]["Enums"]["user_role"];
type AnalyticsRole = ProfileRole | "guest";

function getBrowserName(userAgent: string) {
  const value = userAgent.toLowerCase();

  if (value.includes("edg/")) return "Edge";
  if (value.includes("chrome/")) return "Chrome";
  if (value.includes("safari/") && !value.includes("chrome/")) return "Safari";
  if (value.includes("firefox/")) return "Firefox";
  return "Browser";
}

function getDeviceType(userAgent: string) {
  const value = userAgent.toLowerCase();

  if (value.includes("tablet") || value.includes("ipad")) return "Tablet";
  if (value.includes("mobile") || value.includes("android") || value.includes("iphone")) return "Mobile";
  return "Desktop";
}

function getSource(referrer: string | null | undefined) {
  if (!referrer) return "direct";

  try {
    const url = new URL(referrer);
    return url.hostname.replace(/^www\./, "").slice(0, 120);
  } catch {
    return "unknown";
  }
}

function toJsonRecord(
  metadata: Record<string, string | number | boolean | null> | undefined,
): Json {
  if (!metadata) return {};

  const entries = Object.entries(metadata)
    .slice(0, 16)
    .map(([key, value]) => [key.slice(0, 60), value] as const);

  return Object.fromEntries(entries);
}

export async function POST(request: NextRequest) {
  let parsedPayload: z.infer<typeof payloadSchema>;

  try {
    parsedPayload = payloadSchema.parse(await request.json());
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const payloadReferrer = parsedPayload.referrer ?? request.headers.get("referer");

  if (
    parsedPayload.path.startsWith("/admin") ||
    (payloadReferrer?.includes("/admin") ?? false)
  ) {
    return NextResponse.json({ ok: true });
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    let role: AnalyticsRole = "guest";

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();

      role = profile?.role ?? "guest";
    }

    if (role === "admin") {
      return NextResponse.json({ ok: true });
    }

    const userAgent = request.headers.get("user-agent") ?? "";
    const referrer = payloadReferrer;
    await supabase.from("analytics_events").insert({
      event_type: parsedPayload.eventType,
      user_id: user?.id ?? null,
      role,
      path: parsedPayload.path,
      referrer: referrer ?? null,
      source: getSource(referrer),
      device_type: getDeviceType(userAgent),
      browser_name: getBrowserName(userAgent),
      metadata: toJsonRecord(parsedPayload.metadata),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 202 });
  }
}
