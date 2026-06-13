"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

async function getOrigin() {
  const headerStore = await headers();
  return (
    headerStore.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000"
  );
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = getText(formData, "email").toLowerCase();

  if (!email) {
    redirect("/forgot-password?error=email_required");
  }

  const supabase = await createClient();
  const origin = await getOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/callback?next=/reset-password`,
  });

  if (error) {
    redirect("/forgot-password?error=reset_failed");
  }

  redirect("/forgot-password?sent=1");
}

export async function updatePasswordAction(formData: FormData) {
  const password = getText(formData, "password");
  const confirmPassword = getText(formData, "confirmPassword");

  if (!password || password.length < 8) {
    redirect("/reset-password?error=password_short");
  }

  if (password !== confirmPassword) {
    redirect("/reset-password?error=password_mismatch");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect("/reset-password?error=update_failed");
  }

  await supabase.auth.signOut().catch(() => undefined);
  redirect("/login?password_reset=1");
}
