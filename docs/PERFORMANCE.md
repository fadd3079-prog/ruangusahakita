# Performance Review Guide

Ruang Usaha Kita is a marketplace workflow application. Performance review should focus on the public discovery path, dashboard responsiveness, image usage, and heavy data views.

## Priority Pages

Review these routes first:

- `/`
- `/katalog`
- `/kreator/[creatorId]`
- `/layanan/[serviceId]`
- `/login`
- `/register`
- `/umkm/dashboard`
- `/creator/dashboard`
- `/admin/dashboard`
- `/admin/analytics`
- `/umkm/orders/[orderId]`
- `/creator/orders/[orderId]`
- `/umkm/payments/[paymentId]`

## Core Metrics

Track:

- LCP for landing, catalog, and service detail pages
- CLS for image-heavy public pages and dashboard cards
- INP for catalog filters, dashboard filters, chat, and payment modal interactions
- Build time in CI
- Amount of client-side JavaScript on public pages

## Image Rules

- Use `next/image` for local/public images where practical
- Set `sizes` for responsive images
- Use `priority` only for above-the-fold hero or critical brand imagery
- Avoid loading full-size visual assets inside small cards
- Keep dashboard thumbnails compact
- Prefer signed or optimized URLs for protected media previews

## Client Component Review

Default to Server Components. Use Client Components for:

- Forms with pending state
- Search, filter, sort, tabs, dialogs, sheets, and modals
- Realtime chat
- Toast and action feedback
- Upload preview

Avoid turning entire pages into Client Components when only a small control needs interactivity.

## Data Loading Review

Check that pages do not fetch the same data repeatedly in multiple child components. Prefer feature data helpers and pass shaped data into UI components.

For admin analytics and long lists:

- Limit initial rows
- Keep pagination or load more
- Keep filters scoped
- Avoid fetching full event history for a summary card

## Dashboard Performance

Dashboard layouts should keep sidebar and topbar stable while main content scrolls. Avoid nested scroll areas unless they serve a clear local interaction such as chat or a compact event stream.

Tables should switch to compact card lists on mobile when the column count becomes hard to read.

## Review Checklist

- Public catalog search and filters stay responsive
- Creator and service cards do not cause layout shift
- Dashboard charts fit their containers
- Payment modal opens without blocking the page
- Chat updates without hard-refreshing the route
- Upload preview does not freeze large forms
- No route loads private data just to discard it in the UI
- No production secret is needed for public performance checks

