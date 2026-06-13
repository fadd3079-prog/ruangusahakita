import { NextResponse, type NextRequest } from "next/server";

import {
  createAnalyticsInsights,
  getAdminAnalyticsDashboard,
  parseAnalyticsEventType,
} from "@/features/admin/data/admin-analytics-queries";
import { createClient } from "@/lib/supabase/server";

async function isAdminRequest() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, account_status")
    .eq("id", user.id)
    .maybeSingle();

  return profile?.role === "admin" && profile.account_status === "active";
}

function getNumberParam(value: string | null) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
}

export async function GET(request: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const eventType = parseAnalyticsEventType(request.nextUrl.searchParams.get("event") ?? undefined);
  const query = request.nextUrl.searchParams.get("q") ?? "";
  const offset = getNumberParam(request.nextUrl.searchParams.get("offset")) ?? 0;
  const analytics = await getAdminAnalyticsDashboard({
    eventType,
    limit: 25,
    offset,
    query,
  });

  return NextResponse.json({
    analytics,
    insights: createAnalyticsInsights(analytics),
    ok: true,
  });
}
