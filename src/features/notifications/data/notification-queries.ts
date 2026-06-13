import { createClient } from "@/lib/supabase/server";

export async function getCurrentUnreadNotificationCount() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return 0;
    }

    const { count, error } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_read", false)
      .is("deleted_at", null);

    if (error || typeof count !== "number") {
      return 0;
    }

    return count;
  } catch {
    return 0;
  }
}
