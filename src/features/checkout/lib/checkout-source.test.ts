import { describe, expect, it } from "vitest";

import { buildCheckoutPath, parseCheckoutSelection } from "./checkout-source";

describe("checkout source", () => {
  it("uses cart when direct parameters are incomplete", () => {
    expect(parseCheckoutSelection({ source: "direct" })).toEqual({
      source: "cart",
    });
  });

  it("parses a direct service selection", () => {
    expect(
      parseCheckoutSelection({
        addonIds: ["addon-1", "addon-1", "addon-2"],
        serviceId: "service-1",
        source: "direct",
        tierId: "tier-1",
      }),
    ).toEqual({
      addonIds: ["addon-1", "addon-2"],
      serviceId: "service-1",
      source: "direct",
      tierId: "tier-1",
    });
  });

  it("preserves direct selection when adding checkout feedback", () => {
    expect(
      buildCheckoutPath(
        {
          addonIds: ["addon-1"],
          serviceId: "service-1",
          source: "direct",
          tierId: "tier-1",
        },
        { saved: "1" },
      ),
    ).toBe(
      "/umkm/checkout?source=direct&serviceId=service-1&tierId=tier-1&addonIds=addon-1&saved=1",
    );
  });
});
