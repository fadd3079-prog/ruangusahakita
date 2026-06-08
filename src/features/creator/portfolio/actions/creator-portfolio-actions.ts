"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getNullableText(formData: FormData, key: string) {
  const value = getText(formData, key);
  return value.length > 0 ? value : null;
}

function getBoolean(formData: FormData, key: string) {
  return getText(formData, key) === "true";
}

function getInteger(formData: FormData, key: string) {
  const value = getText(formData, key).replace(/[^\d-]/g, "");
  return value.length > 0 ? Number(value) : 0;
}

async function getCreatorContext() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    redirect("/login");
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
    redirect("/creator/portfolio?error=unauthorized");
  }

  const { data: creator, error: creatorError } = await supabase
    .from("creator_profiles")
    .select("id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (creatorError || !creator) {
    redirect("/creator/portfolio?error=profile");
  }

  return { creator, supabase };
}

export async function createCreatorPortfolioAction(formData: FormData) {
  const title = getText(formData, "title");

  if (!title) {
    redirect("/creator/portfolio?error=required");
  }

  const { creator, supabase } = await getCreatorContext();
  const { error } = await supabase.from("portfolios").insert({
    category_id: getNullableText(formData, "categoryId"),
    client_type: getNullableText(formData, "clientType"),
    creator_id: creator.id,
    description: getNullableText(formData, "description"),
    external_url: getNullableText(formData, "externalUrl"),
    is_featured: getBoolean(formData, "isFeatured"),
    media_url: getNullableText(formData, "mediaUrl"),
    sort_order: getInteger(formData, "sortOrder"),
    thumbnail_url: getNullableText(formData, "thumbnailUrl"),
    title,
  });

  if (error) {
    redirect("/creator/portfolio?error=save");
  }

  revalidatePath("/creator/portfolio");
  revalidatePath("/creator/profile");
  revalidatePath("/creator/dashboard");
  redirect("/creator/portfolio?created=1");
}

export async function updateCreatorPortfolioAction(formData: FormData) {
  const portfolioId = getText(formData, "portfolioId");
  const title = getText(formData, "title");

  if (!portfolioId || !title) {
    redirect("/creator/portfolio?error=required");
  }

  const { creator, supabase } = await getCreatorContext();
  const { error } = await supabase
    .from("portfolios")
    .update({
      category_id: getNullableText(formData, "categoryId"),
      client_type: getNullableText(formData, "clientType"),
      description: getNullableText(formData, "description"),
      external_url: getNullableText(formData, "externalUrl"),
      is_featured: getBoolean(formData, "isFeatured"),
      media_url: getNullableText(formData, "mediaUrl"),
      sort_order: getInteger(formData, "sortOrder"),
      thumbnail_url: getNullableText(formData, "thumbnailUrl"),
      title,
    })
    .eq("id", portfolioId)
    .eq("creator_id", creator.id)
    .is("deleted_at", null);

  if (error) {
    redirect("/creator/portfolio?error=save");
  }

  revalidatePath("/creator/portfolio");
  revalidatePath("/creator/profile");
  revalidatePath("/creator/dashboard");
  redirect("/creator/portfolio?updated=1");
}

export async function deleteCreatorPortfolioAction(formData: FormData) {
  const portfolioId = getText(formData, "portfolioId");

  if (!portfolioId) {
    redirect("/creator/portfolio?error=required");
  }

  const { creator, supabase } = await getCreatorContext();
  const { error } = await supabase
    .from("portfolios")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", portfolioId)
    .eq("creator_id", creator.id)
    .is("deleted_at", null);

  if (error) {
    redirect("/creator/portfolio?error=delete");
  }

  revalidatePath("/creator/portfolio");
  revalidatePath("/creator/profile");
  revalidatePath("/creator/dashboard");
  redirect("/creator/portfolio?deleted=1");
}
