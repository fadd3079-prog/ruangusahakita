import { describe, expect, it, vi } from "vitest";

import {
  getPasswordResetUrl,
  getPasswordUpdateErrorCode,
  isValidResetEmail,
  localPasswordResetUrl,
  productionPasswordResetUrl,
  requestDefaultPasswordReset,
} from "./password-reset";

describe("password reset", () => {
  it("uses the expected reset page for local and production", () => {
    expect(getPasswordResetUrl("development")).toBe(localPasswordResetUrl);
    expect(getPasswordResetUrl("production")).toBe(
      productionPasswordResetUrl,
    );
  });

  it("accepts a valid email and calls the default Supabase reset method", async () => {
    const resetPasswordForEmail = vi.fn().mockResolvedValue({ error: null });

    expect(isValidResetEmail("user@example.com")).toBe(true);
    await requestDefaultPasswordReset(
      "user@example.com",
      resetPasswordForEmail,
      localPasswordResetUrl,
    );

    expect(resetPasswordForEmail).toHaveBeenCalledWith("user@example.com", {
      redirectTo: localPasswordResetUrl,
    });
  });

  it("keeps the same-password validation distinct", () => {
    expect(getPasswordUpdateErrorCode({ code: "same_password" })).toBe(
      "password_same",
    );
    expect(getPasswordUpdateErrorCode({ code: "unexpected" })).toBe(
      "update_failed",
    );
  });
});
