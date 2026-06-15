export type AuthErrorDetail = {
  code?: string;
  message?: string;
  status?: number | string;
};

type ResetPasswordForEmail = (
  email: string,
  options: { redirectTo: string },
) => Promise<{ error: AuthErrorDetail | null }>;

export const localPasswordResetUrl = "http://localhost:3000/reset-password";
export const productionPasswordResetUrl =
  "https://www.ruangusahakita.my.id/reset-password";

export function getPasswordResetUrl(nodeEnv = process.env.NODE_ENV) {
  return nodeEnv === "production"
    ? productionPasswordResetUrl
    : localPasswordResetUrl;
}

export function isValidResetEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function requestDefaultPasswordReset(
  email: string,
  resetPasswordForEmail: ResetPasswordForEmail,
  redirectTo: string,
) {
  return resetPasswordForEmail(email, { redirectTo });
}

export function getPasswordUpdateErrorCode(error: AuthErrorDetail) {
  return error.code === "same_password" ? "password_same" : "update_failed";
}
