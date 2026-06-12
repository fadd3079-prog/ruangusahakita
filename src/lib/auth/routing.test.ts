import { describe, expect, it } from "vitest";

import type { Profile } from "./roles";
import {
  getDashboardPathByRole,
  getNonLoopingRedirect,
  getPostLoginDestination,
  getPostLoginPath,
  getRouteRedirect,
  shouldBypassDashboardAuth,
} from "./routing";

function profile(overrides: Partial<Profile> = {}): Profile {
  return {
    account_status: "active",
    id: "user-1",
    onboarding_completed: true,
    onboarding_skipped_at: null,
    role: "umkm",
    ...overrides,
  };
}

describe("auth routing", () => {
  it("maps every role to its dashboard", () => {
    expect(getDashboardPathByRole("admin")).toBe("/admin/dashboard");
    expect(getDashboardPathByRole("umkm")).toBe("/umkm/dashboard");
    expect(getDashboardPathByRole("creator")).toBe("/creator/dashboard");
  });

  it("never sends admins to onboarding", () => {
    expect(
      getPostLoginPath(
        profile({ role: "admin", onboarding_completed: false }),
      ),
    ).toBe("/admin/dashboard");
  });

  it("keeps onboarding for incomplete UMKM and creator accounts", () => {
    expect(
      getPostLoginPath(profile({ onboarding_completed: false, role: "umkm" })),
    ).toBe("/umkm/onboarding");
    expect(
      getPostLoginPath(
        profile({ onboarding_completed: false, role: "creator" }),
      ),
    ).toBe("/creator/onboarding");
  });

  it("keeps a role-safe checkout destination after login", () => {
    expect(
      getPostLoginDestination(
        profile({ role: "umkm" }),
        "/umkm/checkout?source=direct&serviceId=service-1&tierId=tier-1",
      ),
    ).toBe(
      "/umkm/checkout?source=direct&serviceId=service-1&tierId=tier-1",
    );
    expect(
      getPostLoginDestination(
        profile({ role: "creator" }),
        "/umkm/checkout?source=direct",
      ),
    ).toBe("/creator/dashboard");
    expect(
      getPostLoginDestination(profile({ role: "umkm" }), "https://bad.test"),
    ).toBe("/umkm/dashboard");
  });

  it("keeps onboarding ahead of requested dashboard routes", () => {
    expect(
      getPostLoginDestination(
        profile({ onboarding_completed: false, role: "umkm" }),
        "/umkm/checkout?source=direct",
      ),
    ).toBe("/umkm/onboarding");
  });

  it("redirects guests and wrong roles once", () => {
    expect(getRouteRedirect("/admin/dashboard", { kind: "guest" })).toBe(
      "/login",
    );
    expect(
      getRouteRedirect("/admin/dashboard", {
        kind: "profile",
        profile: profile({ role: "creator" }),
      }),
    ).toBe("/creator/dashboard");
  });

  it("allows guests on public and auth pages", () => {
    expect(getRouteRedirect("/", { kind: "guest" })).toBeNull();
    expect(getRouteRedirect("/katalog", { kind: "guest" })).toBeNull();
    expect(getRouteRedirect("/login", { kind: "guest" })).toBeNull();
  });

  it("keeps UMKM and creator accounts inside their own route groups", () => {
    const umkm = profile({ role: "umkm" });
    const creator = profile({ role: "creator" });

    expect(
      getRouteRedirect("/umkm/dashboard", { kind: "profile", profile: umkm }),
    ).toBeNull();
    expect(
      getRouteRedirect("/creator/dashboard", {
        kind: "profile",
        profile: umkm,
      }),
    ).toBe("/umkm/dashboard");
    expect(
      getRouteRedirect("/umkm/dashboard", {
        kind: "profile",
        profile: creator,
      }),
    ).toBe("/creator/dashboard");
    expect(
      getRouteRedirect("/login", { kind: "profile", profile: creator }),
    ).toBe("/creator/dashboard");
  });

  it("routes incomplete real accounts to onboarding without looping there", () => {
    const incompleteUmkm = profile({
      onboarding_completed: false,
      role: "umkm",
    });

    expect(
      getRouteRedirect("/umkm/dashboard", {
        kind: "profile",
        profile: incompleteUmkm,
      }),
    ).toBe("/umkm/onboarding");
    expect(
      getRouteRedirect("/umkm/onboarding", {
        kind: "profile",
        profile: incompleteUmkm,
      }),
    ).toBeNull();
  });

  it("redirects authenticated users with missing profiles only once", () => {
    expect(
      getRouteRedirect("/admin/dashboard", { kind: "missing-profile" }),
    ).toBe("/login?error=profile");
    expect(getRouteRedirect("/login", { kind: "missing-profile" })).toBeNull();
  });

  it("redirects active admins away from public and auth pages", () => {
    const admin = profile({ role: "admin" });
    for (const pathname of ["/", "/katalog", "/cara-kerja", "/bantuan"]) {
      expect(
        getRouteRedirect(pathname, { kind: "profile", profile: admin }),
      ).toBe("/admin/dashboard");
    }
    expect(
      getRouteRedirect("/login", { kind: "profile", profile: admin }),
    ).toBe("/admin/dashboard");
    expect(
      getRouteRedirect("/admin/dashboard", {
        kind: "profile",
        profile: admin,
      }),
    ).toBeNull();
  });

  it("routes inactive accounts to login without a same-path loop", () => {
    const inactive = profile({ account_status: "inactive" });
    expect(
      getRouteRedirect("/umkm/dashboard", {
        kind: "profile",
        profile: inactive,
      }),
    ).toBe("/login?error=inactive");
    expect(
      getRouteRedirect("/login", { kind: "profile", profile: inactive }),
    ).toBeNull();
  });

  it("bypasses only dashboard routes in demo mode", () => {
    expect(shouldBypassDashboardAuth(true, "/admin/dashboard")).toBe(true);
    expect(shouldBypassDashboardAuth(true, "/creator/services")).toBe(true);
    expect(shouldBypassDashboardAuth(true, "/login")).toBe(false);
    expect(shouldBypassDashboardAuth(false, "/admin/dashboard")).toBe(false);
  });

  it("prevents redirects to the current pathname", () => {
    expect(
      getNonLoopingRedirect("/admin/dashboard", "/admin/dashboard"),
    ).toBeNull();
    expect(getNonLoopingRedirect("/login", "/login?error=profile")).toBeNull();
  });
});
