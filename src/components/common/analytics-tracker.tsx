"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type AnalyticsEventType =
  | "page_view"
  | "catalog_view"
  | "service_view"
  | "creator_view"
  | "portfolio_view"
  | "cta_click"
  | "add_to_cart"
  | "checkout_start"
  | "brief_submit"
  | "order_created"
  | "payment_opened"
  | "payment_paid"
  | "creator_accept_order"
  | "creator_start_order"
  | "outbound_click";

type AnalyticsPayload = {
  eventType: AnalyticsEventType;
  path: string;
  referrer?: string | null;
  metadata?: Record<string, string | number | boolean | null>;
};

const analyticsEventTypes = [
  "page_view",
  "catalog_view",
  "service_view",
  "creator_view",
  "portfolio_view",
  "cta_click",
  "add_to_cart",
  "checkout_start",
  "brief_submit",
  "order_created",
  "payment_opened",
  "payment_paid",
  "creator_accept_order",
  "creator_start_order",
  "outbound_click",
] as const satisfies readonly AnalyticsEventType[];

const routeEventPatterns: readonly {
  eventType: AnalyticsEventType;
  pattern: RegExp;
}[] = [
  { eventType: "catalog_view", pattern: /^\/katalog\/?$/ },
  { eventType: "service_view", pattern: /^\/layanan\/[^/]+\/?$/ },
  { eventType: "creator_view", pattern: /^\/kreator\/[^/]+\/?$/ },
  { eventType: "checkout_start", pattern: /^\/umkm\/checkout\/?$/ },
  { eventType: "payment_opened", pattern: /^\/umkm\/payments\/[^/]+\/?$/ },
];

const labelEventPatterns: readonly {
  eventType: AnalyticsEventType;
  pattern: RegExp;
}[] = [
  { eventType: "add_to_cart", pattern: /tambah ke keranjang/i },
  { eventType: "checkout_start", pattern: /lanjut checkout/i },
  { eventType: "brief_submit", pattern: /brief campaign berhasil|simpan brief|lanjut ke pembayaran/i },
  { eventType: "order_created", pattern: /buat pesanan|lanjut ke pembayaran/i },
  { eventType: "payment_paid", pattern: /pembayaran berhasil|proses pembayaran|bayar/i },
  { eventType: "creator_accept_order", pattern: /terima order/i },
  { eventType: "creator_start_order", pattern: /mulai pengerjaan/i },
];

function normalizePath(pathname: string, searchParams: URLSearchParams) {
  const search = searchParams.toString();
  return search ? `${pathname}?${search}` : pathname;
}

function sendAnalyticsEvent(payload: AnalyticsPayload) {
  const body = JSON.stringify(payload);

  try {
    if (navigator.sendBeacon) {
      const sent = navigator.sendBeacon(
        "/api/analytics",
        new Blob([body], { type: "application/json" }),
      );

      if (sent) return;
    }

    void fetch("/api/analytics", {
      body,
      cache: "no-store",
      headers: {
        "content-type": "application/json",
      },
      keepalive: true,
      method: "POST",
    }).catch(() => undefined);
  } catch {
    return;
  }
}

function getElementLabel(element: Element) {
  const ariaLabel = element.getAttribute("aria-label");

  if (ariaLabel) return ariaLabel.trim();

  return (element.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 140);
}

function getEventFromLabel(label: string): AnalyticsEventType | null {
  for (const item of labelEventPatterns) {
    if (item.pattern.test(label)) return item.eventType;
  }

  return null;
}

function getExplicitEvent(element: Element): AnalyticsEventType | null {
  const value = element.getAttribute("data-analytics-event");

  if (!value) return null;

  return analyticsEventTypes.some((eventType) => eventType === value)
    ? (value as AnalyticsEventType)
    : null;
}

function getAnchorUrl(element: Element) {
  const anchor = element.closest("a");

  if (!anchor) return null;

  return anchor instanceof HTMLAnchorElement ? anchor.href : null;
}

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const path = normalizePath(pathname, searchParams);
    const referrer = document.referrer || null;

    sendAnalyticsEvent({
      eventType: "page_view",
      path,
      referrer,
    });

    for (const item of routeEventPatterns) {
      if (item.pattern.test(pathname)) {
        sendAnalyticsEvent({
          eventType: item.eventType,
          path,
          referrer,
        });
      }
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target : null;

      if (!target) return;

      const trackable = target.closest("[data-analytics-event],a,button");

      if (!trackable) return;

      const label = getElementLabel(trackable);
      const href = getAnchorUrl(trackable);
      const isOutbound =
        typeof href === "string" &&
        href.startsWith("http") &&
        !href.startsWith(window.location.origin);
      const eventType =
        getExplicitEvent(trackable) ??
        (isOutbound ? "outbound_click" : getEventFromLabel(label)) ??
        (!trackable.closest("header,nav,aside") &&
        (trackable.closest("a") || trackable.closest("button"))
          ? "cta_click"
          : null);

      if (!eventType) return;

      sendAnalyticsEvent({
        eventType,
        path: normalizePath(window.location.pathname, new URLSearchParams(window.location.search)),
        referrer: document.referrer || null,
        metadata: {
          href: href ? href.slice(0, 240) : null,
          label,
        },
      });
    }

    document.addEventListener("click", handleClick, { capture: true });

    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, []);

  return null;
}
