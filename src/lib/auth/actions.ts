"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { createAdminClient } from "../supabase/admin";
import { getDashboardPathByRole } from "./guards";
import type { UserRole } from "./roles";
import {
  getOnboardingPathByRole,
  shouldStartOnboarding,
} from "@/features/onboarding/lib/profile-completion";

type PublicRegisterRole = Exclude<UserRole, "admin">;
type RegisterStep =
  | "admin create user"
  | "profiles insert"
  | "umkm_profiles insert"
  | "creator_profiles insert"
  | "cleanup delete user"
  | "signIn after bootstrap";
type LoginStep = "profiles select";

function getRequiredText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isPublicRegisterRole(role: string): role is PublicRegisterRole {
  return role === "umkm" || role === "creator";
}

function getErrorValue(error: unknown, key: "message" | "code" | "status") {
  if (!error || typeof error !== "object" || !(key in error)) {
    return "-";
  }

  const value = (error as Record<string, unknown>)[key];
  return typeof value === "string" || typeof value === "number" ? String(value) : "-";
}

function getRegisterError(step: RegisterStep, error: unknown, fallback: string) {
  if (process.env.NODE_ENV !== "development") {
    return { error: fallback };
  }

  return {
    error: `${fallback} Detail dev: step=${step}; message=${getErrorValue(error, "message")}; code=${getErrorValue(error, "code")}; status=${getErrorValue(error, "status")}.`,
  };
}

function getLoginProfileError(step: LoginStep, userId: string, error: unknown) {
  const fallback = "Profil akun belum tersedia. Hubungi admin.";

  if (process.env.NODE_ENV !== "development") {
    return { error: fallback };
  }

  return {
    error: `${fallback} Detail dev: userId=${userId}; step=${step}; table=profiles; message=${getErrorValue(error, "message")}; code=${getErrorValue(error, "code")}; status=${getErrorValue(error, "status")}.`,
  };
}

export async function loginAction(formData: FormData) {
  const email = getRequiredText(formData, "email").toLowerCase();
  const password = getRequiredText(formData, "password");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Email atau password tidak valid." };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, account_status, onboarding_completed, onboarding_skipped_at")
    .eq("id", data.user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    return getLoginProfileError("profiles select", data.user.id, profileError);
  }

  if (profile.account_status !== "active") {
    await supabase.auth.signOut();
    return { error: "Akun belum aktif atau sedang dibatasi. Hubungi admin." };
  }

  await supabase
    .from("profiles")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", data.user.id);

  revalidatePath("/", "layout");
  if (shouldStartOnboarding(profile)) {
    redirect(getOnboardingPathByRole(profile.role));
  }

  redirect(getDashboardPathByRole(profile.role));
}

export async function registerAction(formData: FormData) {
  const email = getRequiredText(formData, "email").toLowerCase();
  const password = getRequiredText(formData, "password");
  const fullName = getRequiredText(formData, "name");
  const roleValue = getRequiredText(formData, "role");

  if (!email || !password || !fullName || !roleValue) {
    return { error: "Semua field wajib diisi." };
  }

  if (password.length < 8) {
    return { error: "Password minimal 8 karakter." };
  }

  if (!isPublicRegisterRole(roleValue)) {
    return { error: "Role tidak valid." };
  }

  const role = roleValue;
  const supabase = await createClient();
  let adminClient: ReturnType<typeof createAdminClient>;

  try {
    adminClient = createAdminClient();
  } catch {
    return { error: "Registrasi belum dapat diproses karena konfigurasi server belum lengkap." };
  }

  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
    },
  });

  if (authError) {
    return getRegisterError("admin create user", authError, "Registrasi gagal. Periksa email dan password lalu coba lagi.");
  }

  if (!authData.user) {
    return { error: "Akun belum dapat dibuat. Coba lagi beberapa saat." };
  }

  const { error: profileError } = await adminClient.from("profiles").insert({
    id: authData.user.id,
    role,
    full_name: fullName,
    email,
  });

  if (profileError) {
    const { error: cleanupError } = await adminClient.auth.admin.deleteUser(authData.user.id);

    if (cleanupError) {
      return getRegisterError("cleanup delete user", cleanupError, "Gagal membersihkan akun sementara.");
    }

    return getRegisterError("profiles insert", profileError, "Gagal membuat profil pengguna.");
  }

  let roleProfileError: { message: string } | null = null;
  let roleProfileStep: Extract<RegisterStep, "umkm_profiles insert" | "creator_profiles insert"> = "umkm_profiles insert";

  if (role === "umkm") {
    const { error } = await adminClient.from("umkm_profiles").insert({
      user_id: authData.user.id,
      business_name: fullName,
      owner_name: fullName,
    });
    roleProfileError = error;
    roleProfileStep = "umkm_profiles insert";
  }

  if (role === "creator") {
    const { error } = await adminClient.from("creator_profiles").insert({
      user_id: authData.user.id,
      display_name: fullName,
    });
    roleProfileError = error;
    roleProfileStep = "creator_profiles insert";
  }

  if (roleProfileError) {
    const { error: cleanupError } = await adminClient.auth.admin.deleteUser(authData.user.id);

    if (cleanupError) {
      return getRegisterError("cleanup delete user", cleanupError, "Gagal membersihkan akun sementara.");
    }

    return getRegisterError(roleProfileStep, roleProfileError, "Gagal menyiapkan profil role pengguna.");
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return getRegisterError("signIn after bootstrap", signInError, "Akun berhasil dibuat, tetapi sesi login belum dapat dibuat. Silakan masuk dari halaman login.");
  }

  revalidatePath("/", "layout");

  redirect(getOnboardingPathByRole(role));
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login?logged_out=1");
}
