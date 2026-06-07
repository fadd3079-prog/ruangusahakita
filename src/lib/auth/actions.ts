"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "../supabase/server";
import { createAdminClient } from "../supabase/admin";
import { getDashboardPathByRole } from "./guards";
import type { UserRole } from "./roles";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Fetch role for redirect
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single() as { data: { role: string } | null, error: unknown };

  if (profile) {
    redirect(getDashboardPathByRole(profile.role as UserRole));
  } else {
    redirect("/");
  }
}

export async function registerAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("name") as string;
  const role = formData.get("role") as UserRole;

  if (!email || !password || !fullName || !role) {
    return { error: "Semua field wajib diisi." };
  }

  if (role !== "umkm" && role !== "creator") {
    return { error: "Role tidak valid." };
  }

  // 1. Sign up user
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
    return { error: "Terjadi kesalahan saat mendaftar." };
  }

  // 2. Create profile and specific role profile using Admin Client 
  // We use admin client because RLS might prevent unauthenticated inserts, 
  // and we want this to be secure and guaranteed server-side.
  const adminClient = createAdminClient();

  const { error: profileError } = await adminClient.from("profiles").insert({
    id: authData.user.id,
    role: role,
    full_name: fullName,
    email: email,
  } as never);

  if (profileError) {
    console.error("Profile creation error:", profileError);
    return { error: "Gagal membuat profil pengguna." };
  }

  if (role === "umkm") {
    await adminClient.from("umkm_profiles").insert({
      user_id: authData.user.id,
      business_name: fullName + " Business", // Placeholder, can be edited later
    } as never);
  } else if (role === "creator") {
    await adminClient.from("creator_profiles").insert({
      user_id: authData.user.id,
      display_name: fullName,
    } as never);
  }

  // Revalidate layout to pick up new session
  revalidatePath("/", "layout");
  redirect(getDashboardPathByRole(role));
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
