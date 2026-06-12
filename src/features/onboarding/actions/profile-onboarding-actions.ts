"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getDashboardPathByRole } from "@/lib/auth/routing";
import type { UserRole } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";

export type OnboardingActionState = {
  error?: string;
};

type ActiveRole = Exclude<UserRole, "admin">;

const availabilityValues = ["available", "limited", "busy", "unavailable"] as const;
type AvailabilityValue = (typeof availabilityValues)[number];

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalText(formData: FormData, key: string) {
  const value = getText(formData, key);
  return value.length > 0 ? value : null;
}

function getList(formData: FormData, key: string) {
  const value = getText(formData, key);
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function isActiveRole(role: UserRole): role is ActiveRole {
  return role === "umkm" || role === "creator";
}

function isAvailabilityValue(value: string): value is AvailabilityValue {
  return availabilityValues.some((item) => item === value);
}

async function getActiveAccountForAction(expectedRole: ActiveRole) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sesi tidak ditemukan. Silakan masuk kembali.", supabase: null, userId: null, role: null };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, role, account_status")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return { error: "Profil akun belum tersedia.", supabase: null, userId: null, role: null };
  }

  if (profile.account_status !== "active") {
    return { error: "Akun belum aktif atau sedang dibatasi.", supabase: null, userId: null, role: null };
  }

  if (!isActiveRole(profile.role) || profile.role !== expectedRole) {
    return { error: "Anda tidak memiliki akses untuk menyimpan profil ini.", supabase: null, userId: null, role: null };
  }

  return { error: null, supabase, userId: user.id, role: profile.role };
}

export async function saveUmkmOnboardingAction(
  _state: OnboardingActionState,
  formData: FormData,
): Promise<OnboardingActionState> {
  const account = await getActiveAccountForAction("umkm");

  if (account.error || !account.supabase || !account.userId) {
    return { error: account.error ?? "Profil belum dapat disimpan." };
  }

  const businessName = getText(formData, "businessName");
  const ownerName = getText(formData, "ownerName");
  const businessCategory = getText(formData, "businessCategory");
  const businessDescription = getText(formData, "businessDescription");
  const city = getText(formData, "city");
  const province = getText(formData, "province");

  if (!businessName || !ownerName || !businessCategory || !businessDescription || !city || !province) {
    return { error: "Nama usaha, pemilik, kategori, deskripsi, kota, dan provinsi wajib diisi." };
  }

  const { data: umkmProfile, error: profileError } = await account.supabase
    .from("umkm_profiles")
    .select("id")
    .eq("user_id", account.userId)
    .maybeSingle();

  if (profileError || !umkmProfile) {
    return { error: "Profil UMKM belum tersedia. Silakan hubungi admin." };
  }

  const { error: updateError } = await account.supabase
    .from("umkm_profiles")
    .update({
      business_name: businessName,
      owner_name: ownerName,
      business_category: businessCategory,
      business_description: businessDescription,
      city,
      province,
      location: [city, province].join(", "),
      whatsapp_number: getOptionalText(formData, "whatsappNumber"),
      instagram_url: getOptionalText(formData, "instagramUrl"),
      target_audience: getOptionalText(formData, "targetAudience"),
      content_preference: getOptionalText(formData, "contentPreference"),
    })
    .eq("user_id", account.userId);

  if (updateError) {
    return { error: "Profil UMKM belum dapat disimpan. Coba lagi beberapa saat." };
  }

  const { error: accountError } = await account.supabase
    .from("profiles")
    .update({
      full_name: ownerName,
      onboarding_completed: true,
      onboarding_skipped_at: null,
    })
    .eq("id", account.userId);

  if (accountError) {
    return { error: "Status onboarding belum dapat diperbarui." };
  }

  revalidatePath("/", "layout");
  redirect("/umkm/dashboard");
}

export async function saveCreatorOnboardingAction(
  _state: OnboardingActionState,
  formData: FormData,
): Promise<OnboardingActionState> {
  const account = await getActiveAccountForAction("creator");

  if (account.error || !account.supabase || !account.userId) {
    return { error: account.error ?? "Profil belum dapat disimpan." };
  }

  const displayName = getText(formData, "displayName");
  const niche = getText(formData, "niche");
  const bio = getText(formData, "bio");
  const city = getText(formData, "city");
  const province = getText(formData, "province");
  const availabilityStatus = getText(formData, "availabilityStatus");

  if (!displayName || !niche || !bio || !city || !province) {
    return { error: "Nama kreator, niche, bio, kota, dan provinsi wajib diisi." };
  }

  if (!isAvailabilityValue(availabilityStatus)) {
    return { error: "Status ketersediaan kreator tidak valid." };
  }

  const { data: creatorProfile, error: profileError } = await account.supabase
    .from("creator_profiles")
    .select("id")
    .eq("user_id", account.userId)
    .maybeSingle();

  if (profileError || !creatorProfile) {
    return { error: "Profil kreator belum tersedia. Silakan hubungi admin." };
  }

  const { error: updateError } = await account.supabase
    .from("creator_profiles")
    .update({
      display_name: displayName,
      niche,
      bio,
      city,
      province,
      location: [city, province].join(", "),
      availability_status: availabilityStatus,
      skills: getList(formData, "skills"),
      instagram_url: getOptionalText(formData, "instagramUrl"),
      tiktok_url: getOptionalText(formData, "tiktokUrl"),
      portfolio_url: getOptionalText(formData, "portfolioUrl"),
    })
    .eq("user_id", account.userId);

  if (updateError) {
    return { error: "Profil kreator belum dapat disimpan. Coba lagi beberapa saat." };
  }

  const { error: accountError } = await account.supabase
    .from("profiles")
    .update({
      full_name: displayName,
      onboarding_completed: true,
      onboarding_skipped_at: null,
    })
    .eq("id", account.userId);

  if (accountError) {
    return { error: "Status onboarding belum dapat diperbarui." };
  }

  revalidatePath("/", "layout");
  redirect("/creator/dashboard");
}

export async function skipOnboardingAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role, account_status")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    redirect("/login?error=profile");
  }

  if (profile.account_status !== "active") {
    redirect("/login?error=inactive");
  }

  if (profile.role === "admin") {
    redirect("/admin/dashboard");
  }

  await supabase
    .from("profiles")
    .update({
      onboarding_skipped_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  revalidatePath("/", "layout");
  redirect(getDashboardPathByRole(profile.role));
}
