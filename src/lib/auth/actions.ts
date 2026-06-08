"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "../supabase/server";
import { createAdminClient } from "../supabase/admin";
import { getDashboardPathByRole } from "./guards";
import type { UserRole } from "./roles";

type PublicRegisterRole = Exclude<UserRole, "admin">;

function getRequiredText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function isPublicRegisterRole(role: string): role is PublicRegisterRole {
  return role === "umkm" || role === "creator";
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
    .select("role, account_status")
    .eq("id", data.user.id)
    .single();

  if (profileError || !profile) {
    await supabase.auth.signOut();
    return { error: "Profil akun belum tersedia. Hubungi admin." };
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
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: "Akun belum dapat dibuat. Coba lagi beberapa saat." };
  }

  let adminClient: ReturnType<typeof createAdminClient>;

  try {
    adminClient = createAdminClient();
  } catch {
    await supabase.auth.signOut();
    return { error: "Registrasi belum dapat diproses karena konfigurasi server belum lengkap." };
  }

  const { error: profileError } = await adminClient.from("profiles").insert({
    id: authData.user.id,
    role,
    full_name: fullName,
    email,
  });

  if (profileError) {
    await adminClient.auth.admin.deleteUser(authData.user.id);
    await supabase.auth.signOut();
    return { error: "Gagal membuat profil pengguna." };
  }

  let roleProfileError: { message: string } | null = null;

  if (role === "umkm") {
    const { error } = await adminClient.from("umkm_profiles").insert({
      user_id: authData.user.id,
      business_name: fullName,
      owner_name: fullName,
    });
    roleProfileError = error;
  }

  if (role === "creator") {
    const { error } = await adminClient.from("creator_profiles").insert({
      user_id: authData.user.id,
      display_name: fullName,
    });
    roleProfileError = error;
  }

  if (roleProfileError) {
    await adminClient.auth.admin.deleteUser(authData.user.id);
    await supabase.auth.signOut();
    return { error: "Gagal menyiapkan profil role pengguna." };
  }

  revalidatePath("/", "layout");

  if (!authData.session) {
    redirect("/login?registered=1");
  }

  redirect(getDashboardPathByRole(role));
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login?logged_out=1");
}
