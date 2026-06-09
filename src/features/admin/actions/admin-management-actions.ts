"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type AccountStatus = Database["public"]["Enums"]["account_status"];
type ComplaintStatus = Database["public"]["Enums"]["complaint_status"];

const accountStatuses: readonly AccountStatus[] = [
  "active",
  "inactive",
  "pending_verification",
  "suspended",
];

const complaintStatuses: readonly ComplaintStatus[] = [
  "open",
  "under_review",
  "waiting_umkm",
  "waiting_creator",
  "resolved",
  "rejected",
];

function getText(formData: FormData, key: string) {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function getBoolean(formData: FormData, key: string) {
  return getText(formData, key) === "true";
}

function getAccountStatus(formData: FormData) {
  const value = getText(formData, "accountStatus");

  if (accountStatuses.includes(value as AccountStatus)) {
    return value as AccountStatus;
  }

  return null;
}

function getComplaintStatus(formData: FormData) {
  const value = getText(formData, "complaintStatus");

  if (complaintStatuses.includes(value as ComplaintStatus)) {
    return value as ComplaintStatus;
  }

  return null;
}

function getAdminErrorCode(message: string) {
  if (message.includes("not_admin")) {
    return "unauthorized";
  }

  if (message.includes("self_status_change_not_allowed")) {
    return "self";
  }

  if (message.includes("not_found")) {
    return "not_found";
  }

  if (message.includes("invalid_input")) {
    return "invalid";
  }

  if (message.includes("resolution_note_required")) {
    return "resolution_required";
  }

  return "save";
}

export async function updateAdminUserStatusAction(formData: FormData) {
  const profileId = getText(formData, "profileId");
  const accountStatus = getAccountStatus(formData);

  if (!profileId || !accountStatus) {
    redirect("/admin/users?error=invalid");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_set_profile_account_status", {
    next_status: accountStatus,
    target_profile_id: profileId,
  });

  if (error) {
    redirect(`/admin/users?error=${getAdminErrorCode(error.message)}`);
  }

  revalidatePath("/admin/users");
  revalidatePath("/admin/dashboard");
  redirect("/admin/users?updated=1");
}

export async function updateAdminCreatorModerationAction(formData: FormData) {
  const creatorId = getText(formData, "creatorId");

  if (!creatorId) {
    redirect("/admin/creators?error=invalid");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_set_creator_moderation", {
    next_featured: getBoolean(formData, "isFeatured"),
    next_verified: getBoolean(formData, "isVerified"),
    target_creator_id: creatorId,
  });

  if (error) {
    redirect(`/admin/creators?error=${getAdminErrorCode(error.message)}`);
  }

  revalidatePath("/admin/creators");
  revalidatePath("/admin/dashboard");
  revalidatePath("/katalog");
  redirect("/admin/creators?updated=1");
}

export async function updateAdminServiceModerationAction(formData: FormData) {
  const serviceId = getText(formData, "serviceId");

  if (!serviceId) {
    redirect("/admin/services?error=invalid");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_set_service_moderation", {
    next_active: getBoolean(formData, "isActive"),
    next_featured: getBoolean(formData, "isFeatured"),
    target_service_id: serviceId,
  });

  if (error) {
    redirect(`/admin/services?error=${getAdminErrorCode(error.message)}`);
  }

  revalidatePath("/admin/services");
  revalidatePath("/admin/dashboard");
  revalidatePath("/katalog");
  revalidatePath(`/layanan/${serviceId}`);
  redirect("/admin/services?updated=1");
}

export async function updateAdminComplaintStatusAction(formData: FormData) {
  const complaintId = getText(formData, "complaintId");
  const complaintStatus = getComplaintStatus(formData);
  const resolutionNote = getText(formData, "resolutionNote");

  if (!complaintId || !complaintStatus) {
    redirect("/admin/complaints?error=invalid");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_update_complaint_status", {
    next_resolution_note: resolutionNote || null,
    next_status: complaintStatus,
    target_complaint_id: complaintId,
  });

  if (error) {
    redirect(`/admin/complaints?error=${getAdminErrorCode(error.message)}`);
  }

  revalidatePath("/admin/complaints");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/reports");
  redirect("/admin/complaints?updated=1");
}
