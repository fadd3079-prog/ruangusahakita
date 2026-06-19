# Testing Guide

This guide turns the broader testing strategy into a practical maintainer checklist for Ruang Usaha Kita.

## Current Test Coverage

The repository currently has focused Vitest coverage for:

- Auth route mapping and redirect behavior
- Password reset URL and validation behavior
- Checkout source parsing
- Sandbox payment action success behavior

These tests are useful guardrails, but they do not yet cover the full marketplace workflow.

## Required Local Checks

Run before opening or reviewing a pull request:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

`npm run check` runs typecheck, lint, and build.

## High-Risk Areas to Test

Prioritize tests around:

- Auth and role redirects for Guest, UMKM, creator, and admin
- Order ownership checks
- Payment sandbox idempotency
- Separation of `payment_status` and `order_status`
- Creator delivery and revision actions
- Review creation after completed orders
- Complaint access and admin moderation
- Private storage access
- Upload validation
- Public catalog visibility for active and published services

## Manual Smoke Test

Use a development Supabase project and test accounts.

### Public Marketplace

- Open `/`
- Open `/katalog`
- Search and filter catalog results
- Open `/kreator/[creatorId]`
- Open `/layanan/[serviceId]`
- Confirm public pages do not expose private order, payment, brief, invoice, or hasil konten data

### UMKM Flow

- Login as UMKM
- Open `/umkm/dashboard`
- Add a service to cart
- Open `/umkm/cart`
- Open `/umkm/checkout`
- Fill brief campaign
- Create order
- Open payment page
- Complete sandbox payment
- Open order detail
- Request revision or approve result when the order status allows it

### Creator Flow

- Login as creator
- Open `/creator/dashboard`
- Manage profile and service packages
- Open assigned order
- Accept order after payment is paid
- Start work
- Submit hasil konten
- Respond to revision request

### Admin Flow

- Login as admin
- Open `/admin/dashboard`
- Review users, UMKM, creators, services, orders, payments, complaints, reports, and analytics
- Confirm admin routes are not available to UMKM or creator accounts

## SQL and RLS Review

When a change affects schema, RLS, storage, or sensitive data access, run or inspect:

```txt
supabase/query/rls_security_review.sql
```

Use the output to confirm:

- RLS is enabled on sensitive tables
- Public or anon policies are intentional
- Authenticated write policies include role or ownership checks
- Storage bucket visibility matches the file context
- Security-definer functions are expected and reviewed

## Future Test Backlog

Useful next tests:

- Order status transition utility tests
- File validation tests
- Review creation permission tests
- Complaint ownership tests
- Realtime chat participant access tests
- Invoice and receipt rendering tests
- Admin moderation action tests

