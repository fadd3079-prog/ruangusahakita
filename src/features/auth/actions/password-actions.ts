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
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "";
  const requestOrigin = headerStore.get("origin") ?? "";
  const isLocalRequest = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(
    requestOrigin,
  );
  const siteUrl =
    (isLocalRequest ? requestOrigin : "") ||
    configuredUrl ||
    requestOrigin ||
    "http://localhost:3000";

  return siteUrl.replace(/\/+$/, "");
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getResetErrorRedirect(error: {
  code?: string;
  message?: string;
  status?: number | string;
}) {
  if (process.env.NODE_ENV !== "development") {
    return "/forgot-password?error=reset_failed";
  }

  const detail = encodeURIComponent(
    [error.code, error.status, error.message].filter(Boolean).join(" · "),
  );

  return (
    "/forgot-password?error=reset_failed" +
    (detail.length > 0 ? `&debug=${detail}` : "")
  );
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = getText(formData, "email").toLowerCase();

  if (!email) {
    redirect("/forgot-password?error=email_required");
  }

  if (!isValidEmail(email)) {
    redirect("/forgot-password?error=email_invalid");
  }

  const supabase = await createClient();
  const origin = await getOrigin();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/callback?next=/reset-password`,
  });

  if (error) {
    redirect(getResetErrorRedirect(error));
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
