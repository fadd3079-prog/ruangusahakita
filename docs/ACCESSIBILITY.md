# Accessibility Review Guide

Ruang Usaha Kita should be usable by UMKM, creators, admins, and maintainers across public pages and dashboard workflows. Accessibility work should protect the main service-commerce flow, not only isolated components.

## Priority Flows

Review accessibility on:

- Public landing and catalog
- Creator and service detail pages
- Login, register, forgot password, and reset password
- UMKM cart, checkout, payment, order detail, invoice, and receipt
- Creator services, orders, delivery, revision, profile, and portfolio pages
- Admin tables, filters, analytics, settings, moderation, and reports

## Keyboard Navigation

Check that:

- Header navigation is reachable by keyboard
- Dashboard drawer and sidebar controls are reachable
- Dialogs, sheets, dropdowns, and selects can be opened and closed by keyboard
- Payment modal focus does not escape unexpectedly
- Chat input and send button are reachable without pointer input
- Destructive actions require a clear confirmation path

## Labels and Names

Every meaningful control should have a visible label or accessible name.

Pay special attention to:

- Search inputs
- Filter selects
- Upload controls
- Payment method buttons
- Icon-only buttons
- Delete and moderation actions
- Notification and cart buttons
- Print invoice and receipt buttons

## Color and Status

Do not rely on color alone for status.

Use text labels for:

- Pembayaran pending, paid, failed, expired, refunded
- Status pesanan such as awaiting payment, in progress, submitted, revision requested, revised, completed, cancelled
- Complaint states
- Review moderation states
- Upload and validation errors

Color usage should support meaning:

- Green for success, paid, completed, approved
- Blue for information or active process
- Amber for pending, revision, warning
- Red for failed, rejected, destructive
- Neutral slate for draft or empty state

## Text and Layout

- Long creator names, service titles, emails, paths, and notes should truncate or wrap intentionally
- Cards and tables must not overflow horizontally on mobile
- Heading levels should follow page structure
- Form errors should appear near the affected field
- Empty states should explain the next useful action without long copy

## Images and Media

- Public images need meaningful alt text when they communicate content
- Decorative images can use empty alt text
- Uploaded media previews should not be the only way to understand selected files
- Non-preview file types should show filename, type, and size when available

## Manual Review Checklist

- Navigate `/`, `/katalog`, `/layanan/[serviceId]`, and `/kreator/[creatorId]` with keyboard
- Submit auth forms with invalid input and confirm errors are understandable
- Open and close mobile navigation
- Use catalog filters on mobile
- Open payment modal and switch payment methods
- Send a chat message without route refresh
- Use dashboard table filters at desktop and mobile widths
- Print invoice or receipt

