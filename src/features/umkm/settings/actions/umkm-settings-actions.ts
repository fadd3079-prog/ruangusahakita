"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { STORAGE_BUCKETS } from "@/lib/storage/buckets";
import { FILE_SIZE_LIMITS } from "@/lib/storage/file-limits";
import { createUmkmLogoStoragePath } from "@/lib/storage/file-paths";
import { removeImageAssetById, uploadImageAsset } from "@/lib/storage/image-assets";
import { validateImageFile } from "@/lib/storage/validate-file";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type UmkmProfileUpdate = Database["public"]["Tables"]["umkm_profiles"]["Update"];

export type UmkmSettingsActionState = {
  error?: string;
};

function getText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function getOptionalText(formData: FormData, key: string) {
  const value = getText(formData, key);
  return value.length > 0 ? value : null;
}

function getLogoValidationError(code: "missing" | "type" | "extension" | "size") {
  if (code === "size") {
    return "Logo maksimal 2 MB.";
  }

  if (code === "type" || code === "extension") {
    return "Logo harus berupa gambar JPG, PNG, atau WebP.";
  }

  return "Pilih gambar logo terlebih dahulu.";
}

async function getCurrentUmkmAccount() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Sesi tidak ditemukan. Silakan masuk kembali.", supabase: null, userId: null };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, account_status")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return { error: "Profil akun belum tersedia.", supabase: null, userId: null };
  }

  if (profile.role !== "umkm" || profile.account_status !== "active") {
    return { error: "Akun ini tidak memiliki akses UMKM aktif.", supabase: null, userId: null };
  }

  return { error: null, supabase, userId: user.id };
}

export async function saveUmkmSettingsAction(
  _state: UmkmSettingsActionState,
  formData: FormData,
): Promise<UmkmSettingsActionState> {
  const account = await getCurrentUmkmAccount();

  if (account.error || !account.supabase || !account.userId) {
    return { error: account.error ?? "Pengaturan belum dapat disimpan." };
  }

  const businessName = getText(formData, "businessName");
  const ownerName = getText(formData, "ownerName");
  const businessCategory = getText(formData, "businessCategory");
  const businessDescription = getText(formData, "businessDescription");
  const city = getText(formData, "city");
  const province = getText(formData, "province");
  const whatsappNumber = getOptionalText(formData, "whatsappNumber");
  const removeLogo = formData.get("removeLogo") === "on";
  const logoValidation = validateImageFile(formData.get("logoFile"), {
    maxSizeBytes: FILE_SIZE_LIMITS.umkmLogo,
  });

  if (!businessName || !ownerName || !businessCategory || !businessDescription || !city || !province) {
    return { error: "Nama usaha, pemilik, kategori, deskripsi, kota, dan provinsi wajib diisi." };
  }

  if (!logoValidation.ok) {
    return { error: getLogoValidationError(logoValidation.code) };
  }

  const { data: umkmProfile, error: profileError } = await account.supabase
    .from("umkm_profiles")
    .select("id, logo_file_asset_id")
    .eq("user_id", account.userId)
    .maybeSingle();

  if (profileError || !umkmProfile) {
    return { error: "Profil UMKM belum tersedia. Lengkapi onboarding terlebih dahulu." };
  }

  const logoUpload = logoValidation.file
    ? await uploadImageAsset({
        bucket: STORAGE_BUCKETS.BUSINESS_ASSETS,
        context: "umkm_logo",
        extension: logoValidation.extension,
        file: logoValidation.file,
        ownerId: account.userId,
        storagePath: createUmkmLogoStoragePath(
          umkmProfile.id,
          logoValidation.extension,
        ),
        supabase: account.supabase,
        uploadedBy: account.userId,
        visibility: "private",
        umkmId: umkmProfile.id,
      })
    : null;

  if (logoUpload?.error || (logoValidation.file && !logoUpload?.asset)) {
    return { error: "Logo belum dapat diunggah. Coba lagi beberapa saat." };
  }

  const updatePayload: UmkmProfileUpdate = {
    business_category: businessCategory,
    business_description: businessDescription,
    business_name: businessName,
    city,
    content_preference: getOptionalText(formData, "contentPreference"),
    instagram_url: getOptionalText(formData, "instagramUrl"),
    location: [city, province].join(", "),
    owner_name: ownerName,
    province,
    target_audience: getOptionalText(formData, "targetAudience"),
    tiktok_url: getOptionalText(formData, "tiktokUrl"),
    whatsapp_number: whatsappNumber,
  };

  if (logoUpload?.asset) {
    updatePayload.logo_file_asset_id = logoUpload.asset.id;
    updatePayload.logo_url = null;
  } else if (removeLogo) {
    updatePayload.logo_file_asset_id = null;
    updatePayload.logo_url = null;
  }

  const { error: updateError } = await account.supabase
    .from("umkm_profiles")
    .update(updatePayload)
    .eq("user_id", account.userId);

  if (updateError) {
    if (logoUpload?.asset) {
      await removeImageAssetById(account.supabase, logoUpload.asset.id);
    }

    return { error: "Pengaturan UMKM belum dapat disimpan. Coba lagi beberapa saat." };
  }

  if (logoUpload?.asset || removeLogo) {
    await removeImageAssetById(account.supabase, umkmProfile.logo_file_asset_id);
  }

  const { error: accountError } = await account.supabase
    .from("profiles")
    .update({
      full_name: ownerName,
      onboarding_completed: true,
      onboarding_skipped_at: null,
      phone: whatsappNumber,
    })
    .eq("id", account.userId);

  if (accountError) {
    return { error: "Profil akun belum dapat diperbarui." };
  }

  revalidatePath("/umkm/settings");
  revalidatePath("/umkm/dashboard");
  revalidatePath("/umkm/checkout");
  revalidatePath("/umkm/briefs");
  revalidatePath("/", "layout");
  redirect("/umkm/settings?updated=1");
}
