"use server";

import { redirect } from "next/navigation";

import {
  getPasswordResetUrl,
  getPasswordUpdateErrorCode,
  isValidResetEmail,
  requestDefaultPasswordReset,
  type AuthErrorDetail,
} from "@/features/auth/lib/password-reset";
import { isDemoMode } from "@/lib/config/demo-mode";
import { createClient } from "@/lib/supabase/server";

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getErrorRedirect(path: string, error: AuthErrorDetail) {
  if (process.env.NODE_ENV !== "development") {
    return path;
  }

  const detail = encodeURIComponent(
    [error.code, error.status, error.message].filter(Boolean).join(" | "),
  );

  return path + (detail.length > 0 ? `&debug=${detail}` : "");
}

function normalizeAuthError(error: unknown): AuthErrorDetail {
  if (!error || typeof error !== "object") {
    return { message: "Auth request failed" };
  }

  const record = error as Record<string, unknown>;
  return {
    code: typeof record.code === "string" ? record.code : undefined,
    message: typeof record.message === "string" ? record.message : undefined,
    status:
      typeof record.status === "string" || typeof record.status === "number"
        ? record.status
        : undefined,
  };
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = getText(formData, "email").toLowerCase();

  if (!email) {
    redirect("/forgot-password?error=email_required");
  }

  if (!isValidResetEmail(email)) {
    redirect("/forgot-password?error=email_invalid");
  }

  if (isDemoMode()) {
    redirect(
      getErrorRedirect("/forgot-password?error=reset_failed", {
        code: "demo_mode",
        message: "Supabase Auth is disabled in demo mode",
      }),
    );
  }

  let resetError: AuthErrorDetail | null = null;

  try {
    const supabase = await createClient();
    const result = await requestDefaultPasswordReset(
      email,
      supabase.auth.resetPasswordForEmail.bind(supabase.auth),
      getPasswordResetUrl(),
    );
    resetError = result.error;
  } catch (error) {
    resetError = normalizeAuthError(error);
  }

  if (resetError) {
    redirect(
      getErrorRedirect(
        "/forgot-password?error=reset_failed",
        resetError,
      ),
    );
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

  let updateError: AuthErrorDetail | null = null;

  try {
    const supabase = await createClient();
    const result = await supabase.auth.updateUser({ password });
    updateError = result.error;

    if (!updateError) {
      await supabase.auth.signOut().catch(() => undefined);
    }
  } catch (error) {
    updateError = normalizeAuthError(error);
  }

  if (updateError) {
    const code = getPasswordUpdateErrorCode(updateError);
    redirect(
      getErrorRedirect(`/reset-password?error=${code}`, updateError),
    );
  }

  redirect("/login?password_reset=1");
}
