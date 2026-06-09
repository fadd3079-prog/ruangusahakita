"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";
import { STORAGE_BUCKETS } from "@/lib/storage/buckets";
import { FILE_SIZE_LIMITS } from "@/lib/storage/file-limits";
import { createAvatarStoragePath } from "@/lib/storage/file-paths";
import { validateImageFile, type FileValidationErrorCode } from "@/lib/storage/validate-file";
import { getAvatarPublicUrl } from "@/lib/storage/urls";

type AvailabilityStatus =
  Database["public"]["Enums"]["creator_availability_status"];

const availabilityValues = [
  "available",
  "limited",
  "busy",
  "unavailable",
] as const satisfies readonly AvailabilityStatus[];

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getNullableText(formData: FormData, key: string) {
  const value = getText(formData, key);
  return value.length > 0 ? value : null;
}

function getTextList(formData: FormData, key: string) {
  return getText(formData, key)
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getNumber(formData: FormData, key: string) {
  const value = getText(formData, key).replace(/[^\d]/g, "");
  return value.length > 0 ? Number(value) : null;
}

function isAvailabilityStatus(value: string): value is AvailabilityStatus {
  return availabilityValues.includes(value as AvailabilityStatus);
}

function getSafeRedirectPath(formData: FormData) {
  const value = getText(formData, "redirectTo");

  if (value === "/creator/settings" || value === "/creator/profile") {
    return value;
  }

  return "/creator/profile";
}

function getAvatarUploadError(code: FileValidationErrorCode) {
  switch (code) {
    case "missing":
      return "avatar_required";
    case "size":
      return "avatar_size";
    case "extension":
    case "type":
      return "avatar_type";
  }
}

async function getCreatorContext() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    redirect("/login");
  }

  const { data: account, error: accountError } = await supabase
    .from("profiles")
    .select("id, role, account_status")
    .eq("id", userData.user.id)
    .maybeSingle();

  if (
    accountError ||
    !account ||
    account.role !== "creator" ||
    account.account_status !== "active"
  ) {
    redirect("/creator/settings?error=unauthorized");
  }

  const { data: creator, error: creatorError } = await supabase
    .from("creator_profiles")
    .select("id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (creatorError || !creator) {
    redirect("/creator/settings?error=profile");
  }

  return {
    creator,
    supabase,
    userId: userData.user.id,
  };
}

export async function updateCreatorProfileAction(formData: FormData) {
  const displayName = getText(formData, "displayName");
  const availabilityStatusValue = getText(formData, "availabilityStatus");
  const redirectTo = getSafeRedirectPath(formData);

  if (!displayName) {
    redirect(`${redirectTo}?error=required`);
  }

  if (!isAvailabilityStatus(availabilityStatusValue)) {
    redirect(`${redirectTo}?error=availability`);
  }

  const { supabase, userId } = await getCreatorContext();
  const responseTimeHours = getNumber(formData, "responseTimeHours");
  const startingPrice = getNumber(formData, "startingPrice");

  const { error: creatorError } = await supabase
    .from("creator_profiles")
    .update({
      availability_status: availabilityStatusValue,
      banner_url: getNullableText(formData, "bannerUrl"),
      bio: getNullableText(formData, "bio"),
      city: getNullableText(formData, "city"),
      display_name: displayName,
      instagram_url: getNullableText(formData, "instagramUrl"),
      location: getNullableText(formData, "location"),
      niche: getNullableText(formData, "niche"),
      portfolio_url: getNullableText(formData, "portfolioUrl"),
      province: getNullableText(formData, "province"),
      response_time_hours: responseTimeHours,
      skills: getTextList(formData, "skills"),
      starting_price: startingPrice,
      tiktok_url: getNullableText(formData, "tiktokUrl"),
      youtube_url: getNullableText(formData, "youtubeUrl"),
    })
    .eq("user_id", userId);

  if (creatorError) {
    redirect(`${redirectTo}?error=save`);
  }

  const fullName = getNullableText(formData, "fullName");
  const phone = getNullableText(formData, "phone");

  const { error: accountError } = await supabase
    .from("profiles")
    .update({
      full_name: fullName ?? displayName,
      phone,
    })
    .eq("id", userId);

  if (accountError) {
    redirect(`${redirectTo}?error=account`);
  }

  revalidatePath("/creator/profile");
  revalidatePath("/creator/settings");
  revalidatePath("/creator/dashboard");
  redirect(`${redirectTo}?saved=1`);
}

export async function uploadCreatorAvatarAction(formData: FormData) {
  const redirectTo = getSafeRedirectPath(formData);
  const validation = validateImageFile(formData.get("avatarFile"), {
    maxSizeBytes: FILE_SIZE_LIMITS.avatar,
    required: true,
  });

  if (!validation.ok) {
    redirect(`${redirectTo}?error=${getAvatarUploadError(validation.code)}`);
  }

  if (validation.file === null || validation.extension === null) {
    redirect(`${redirectTo}?error=avatar_required`);
  }

  const avatarFile = validation.file;
  const avatarExtension = validation.extension;
  const { creator, supabase, userId } = await getCreatorContext();
  const storagePath = createAvatarStoragePath(userId, avatarExtension);
  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.AVATARS)
    .upload(storagePath, avatarFile, {
      cacheControl: "3600",
      contentType: avatarFile.type,
      upsert: false,
    });

  if (uploadError) {
    redirect(`${redirectTo}?error=avatar_upload`);
  }

  const avatarUrl = getAvatarPublicUrl(supabase, storagePath);
  const { error: creatorError } = await supabase
    .from("creator_profiles")
    .update({
      avatar_storage_path: storagePath,
      avatar_url: avatarUrl,
    })
    .eq("id", creator.id)
    .eq("user_id", userId);

  if (creatorError) {
    await supabase.storage.from(STORAGE_BUCKETS.AVATARS).remove([storagePath]);
    redirect(`${redirectTo}?error=avatar_save`);
  }

  const { error: accountError } = await supabase
    .from("profiles")
    .update({
      avatar_storage_path: storagePath,
      avatar_url: avatarUrl,
    })
    .eq("id", userId);

  if (accountError) {
    redirect(`${redirectTo}?error=avatar_account`);
  }

  revalidatePath("/creator/profile");
  revalidatePath("/creator/settings");
  revalidatePath("/creator/dashboard");
  revalidatePath("/katalog");
  revalidatePath(`/kreator/${creator.id}`);
  redirect(`${redirectTo}?saved=1`);
}
