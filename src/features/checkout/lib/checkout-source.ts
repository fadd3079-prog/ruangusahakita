export type CartCheckoutSelection = {
  source: "cart";
};

export type DirectCheckoutSelection = {
  addonIds: readonly string[];
  serviceId: string;
  source: "direct";
  tierId: string | null;
};

export type CheckoutSelection = CartCheckoutSelection | DirectCheckoutSelection;

type CheckoutParamValue = string | readonly string[] | undefined;

type CheckoutParamInput = {
  addonIds?: CheckoutParamValue;
  serviceId?: CheckoutParamValue;
  source?: CheckoutParamValue;
  tierId?: CheckoutParamValue;
};

function getSingleValue(value: CheckoutParamValue) {
  return typeof value === "string"
    ? value.trim()
    : value?.[0]?.trim() ?? "";
}

function getMultipleValues(value: CheckoutParamValue) {
  const values = typeof value === "string" ? [value] : value ?? [];
  return Array.from(new Set(values.map((item) => item.trim()).filter(Boolean))).slice(0, 20);
}

export function parseCheckoutSelection(input: CheckoutParamInput): CheckoutSelection {
  const source = getSingleValue(input.source);
  const serviceId = getSingleValue(input.serviceId);

  if (source !== "direct" || !serviceId) {
    return { source: "cart" };
  }

  return {
    addonIds: getMultipleValues(input.addonIds),
    serviceId,
    source: "direct",
    tierId: getSingleValue(input.tierId) || null,
  };
}

export function buildCheckoutPath(
  selection: CheckoutSelection,
  values: Record<string, string | undefined> = {},
) {
  const params = new URLSearchParams();

  if (selection.source === "direct") {
    params.set("source", "direct");
    params.set("serviceId", selection.serviceId);
    if (selection.tierId) {
      params.set("tierId", selection.tierId);
    }
    selection.addonIds.forEach((addonId) => params.append("addonIds", addonId));
  }

  Object.entries(values).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });

  const query = params.toString();
  return query ? `/umkm/checkout?${query}` : "/umkm/checkout";
}
