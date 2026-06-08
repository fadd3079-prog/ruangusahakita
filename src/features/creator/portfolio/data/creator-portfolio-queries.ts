import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type Tables = Database["public"]["Tables"];

export type CreatorPortfolioRow = Tables["portfolios"]["Row"];
export type CreatorPortfolioCategory = Pick<
  Tables["service_categories"]["Row"],
  "id" | "name" | "slug"
>;
export type CreatorPortfolioItem = CreatorPortfolioRow & {
  category: CreatorPortfolioCategory | null;
};

export type CreatorPortfolioPageData = {
  categories: readonly CreatorPortfolioCategory[];
  portfolios: readonly CreatorPortfolioItem[];
};

async function getCurrentCreatorContext() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    return null;
  }

  const { data: account, error: accountError } = await supabase
    .from("profiles")
    .select("role, account_status")
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

  const { data: creator, error: creatorError } = await supabase
    .from("creator_profiles")
    .select("id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (creatorError || !creator) {
    return null;
  }

  return { creator, supabase };
}

export async function getCurrentCreatorPortfolioData(): Promise<CreatorPortfolioPageData> {
  try {
    const context = await getCurrentCreatorContext();

    if (!context) {
      return { categories: [], portfolios: [] };
    }

    const [portfolioResult, categoryResult] = await Promise.all([
      context.supabase
        .from("portfolios")
        .select("*")
        .eq("creator_id", context.creator.id)
        .is("deleted_at", null)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false }),
      context.supabase
        .from("service_categories")
        .select("id, name, slug")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
    ]);

    const categories = categoryResult.data ?? [];
    const categoryById = new Map(categories.map((category) => [category.id, category]));

    return {
      categories,
      portfolios: (portfolioResult.data ?? []).map((portfolio) => ({
        ...portfolio,
        category: portfolio.category_id
          ? categoryById.get(portfolio.category_id) ?? null
          : null,
      })),
    };
  } catch {
    return { categories: [], portfolios: [] };
  }
}
