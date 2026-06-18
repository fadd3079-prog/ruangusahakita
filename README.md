# Ruang Usaha Kita

Ruang Usaha Kita is an open-source full-stack marketplace project for UMKM digital services. The platform connects UMKM with creators, content creators, and marketers for digital promotion needs through service packages, campaign briefs, checkout, sandbox payment, order management, revision flow, file delivery, reviews, and role-based dashboards.

This repository is maintained as a practical and educational case study for building a service-based marketplace with modern web technologies, clear domain rules, Supabase integration, and a real application structure.

Ruang Usaha Kita is not designed as a physical goods store. The domain focuses on digital services, creative work, campaign briefs, content delivery, and service revisions.

## Project Status

Ruang Usaha Kita is currently in an early-stage full-stack MVP phase.

The project already includes authentication, onboarding, public catalog, service detail pages, cart, campaign brief checkout, sandbox payment, order lifecycle, delivery and revision flow, dashboard per role, admin monitoring, internal analytics foundation, and Supabase integration.

Current maintenance focus:

* Stabilizing the core marketplace flow
* Improving frontend performance and loading speed
* Reviewing Supabase RLS, authentication, and storage security
* Improving documentation and setup guide
* Preparing stronger test coverage
* Cleaning unused code and improving maintainability

This project is still under active development. Some flows may change as the marketplace model becomes more stable.

## Table of Contents

* [Project Overview](#project-overview)
* [Core Concept](#core-concept)
* [Main Features](#main-features)
* [User Roles](#user-roles)
* [Tech Stack](#tech-stack)
* [Project Structure](#project-structure)
* [Route Groups](#route-groups)
* [Getting Started](#getting-started)
* [Environment Variables](#environment-variables)
* [Supabase Workflow](#supabase-workflow)
* [Available Scripts](#available-scripts)
* [Architecture Notes](#architecture-notes)
* [Domain Rules](#domain-rules)
* [Testing](#testing)
* [Deployment](#deployment)
* [Troubleshooting](#troubleshooting)
* [Development Workflow](#development-workflow)
* [Roadmap](#roadmap)
* [License](#license)

## Project Overview

Ruang Usaha Kita is built as a marketplace for digital service transactions between UMKM and creators.

The platform helps UMKM find digital service providers, choose service packages, submit campaign briefs, complete sandbox payment, track order progress, request revisions, receive final files, and review completed work.

On the creator side, the platform provides profile management, service package management, portfolio showcase, order handling, delivery submission, and earning overview.

On the admin side, the platform provides monitoring tools for users, creators, services, orders, payments, complaints, reports, and basic analytics.

## Core Concept

The project models a service-commerce workflow.

Instead of buying physical products, users order creative digital services such as:

* Social media content
* Design services
* Copywriting
* Digital marketing support
* Campaign material
* Promotional content
* Creator-based service packages

A typical UMKM flow:

1. UMKM opens the marketplace.
2. UMKM browses creators or service packages.
3. UMKM reviews service details.
4. UMKM adds a service to cart or starts direct checkout.
5. UMKM fills a campaign brief.
6. UMKM completes sandbox payment.
7. Creator receives and works on the order.
8. Creator submits delivery files.
9. UMKM reviews the result.
10. UMKM can approve the delivery or request revision.
11. Completed orders can receive reviews.

## Main Features

### Public Marketplace

* Landing page
* Creator catalog
* Creator detail page
* Service detail page
* Marketplace search and filter foundation
* How it works page
* Help page
* Public-facing service discovery flow

### Authentication

* Login
* Register
* Forgot password
* Reset password
* Supabase Auth callback
* Role-aware redirect
* Public registration for `umkm` and `creator`
* Admin role is not created from public registration

### UMKM Area

* UMKM dashboard
* Cart
* Checkout brief
* Direct checkout
* Campaign brief submission
* Payment sandbox flow
* Order list
* Order detail
* Invoice page
* Receipt page
* Result and delivery review
* Revision request flow
* Settings page

### Creator Area

* Creator dashboard
* Creator onboarding
* Creator profile management
* Service package CRUD
* Service tier and add-on foundation
* Portfolio management
* Incoming order management
* Delivery submission
* Revision handling
* Earnings overview
* Creator settings

### Admin Area

* Admin dashboard
* Internal analytics foundation
* User monitoring
* UMKM monitoring
* Creator monitoring
* Service monitoring
* Order monitoring
* Payment monitoring
* Complaint and report handling
* Platform settings foundation

### Backend and Data Layer

* Supabase Auth
* PostgreSQL database
* Row Level Security
* Server Actions
* API routes
* Supabase Storage foundation
* Payment sandbox RPC
* Role-based access model
* Order and payment status separation

## User Roles

### Guest

Guest users can:

* Access public pages
* Browse marketplace information
* View catalog and service information
* Open login and registration pages

Guest users cannot access dashboards or protected order data.

### UMKM

UMKM users can:

* Access UMKM dashboard
* Browse creators and services
* Add services to cart
* Fill campaign briefs
* Create orders
* Open sandbox payment flow
* Track order progress
* View invoices and receipts
* Review submitted results
* Request revisions
* Manage account settings

Default redirect:

```txt
/umkm/dashboard
```

### Creator

Creator users can:

* Access creator dashboard
* Complete onboarding
* Manage creator profile
* Create and update service packages
* Manage portfolio items
* Review incoming orders
* Submit delivery files
* Handle revision requests
* View earnings overview
* Manage account settings

Default redirect:

```txt
/creator/dashboard
```

### Admin

Admin users can:

* Access admin dashboard
* Monitor users, UMKM, creators, services, orders, and payments
* Review complaints and reports
* Access internal analytics foundation
* Manage platform-level settings

Default redirect:

```txt
/admin/dashboard
```

## Tech Stack

### Frontend

* Next.js 16 App Router
* React 19
* TypeScript
* Tailwind CSS v4
* shadcn/ui
* Radix UI
* Lucide React
* Sonner
* React Hook Form
* Zod
* TanStack Table
* Recharts
* Zustand

### Backend and Database

* Supabase Auth
* Supabase PostgreSQL
* Supabase Row Level Security
* Supabase Storage
* Supabase Realtime foundation
* Server Actions
* Route Handlers
* SQL migrations
* RPC-based backend flow for selected operations

### Tooling and Deployment

* npm
* ESLint
* TypeScript
* Vitest
* React Testing Library
* Playwright foundation
* Vercel

## Project Structure

```txt
src/
  app/
    (public)/
    (auth)/
    (umkm)/
    (creator)/
    (admin)/
    api/
  components/
    common/
    dashboard/
    layout/
    ui/
  features/
    admin/
    auth/
    briefs/
    cart/
    catalog/
    checkout/
    creator/
    dashboard/
    invoices/
    notifications/
    onboarding/
    orders/
    payments/
    public/
    services/
    submissions/
    umkm/
  lib/
    auth/
    config/
    constants/
    formatters/
    payment/
    storage/
    supabase/
    utils.ts
scripts/
supabase/
  migrations/
  query/
docs/
public/
```

## Route Groups

This project uses route groups to separate public pages, authentication pages, and protected dashboards.

```txt
(public)   public marketplace pages
(auth)     authentication pages
(umkm)     UMKM dashboard area
(creator)  creator dashboard area
(admin)    admin dashboard area
api        internal API routes
```

Important routes:

```txt
/
 /katalog
 /kreator/[creatorId]
 /layanan/[serviceId]
 /cara-kerja
 /bantuan
 /login
 /register
 /forgot-password
 /reset-password
 /umkm/dashboard
 /creator/dashboard
 /admin/dashboard
```

## Getting Started

### Prerequisites

Make sure you have:

* Node.js 20 or newer
* npm
* Git
* Supabase account
* Supabase CLI, if you want to manage database migrations locally

Check installed versions:

```bash
node -v
npm -v
git --version
```

### Clone the Repository

```bash
git clone https://github.com/fadd3079-prog/ruangusahakita.git
cd ruangusahakita
```

### Install Dependencies

```bash
npm install
```

### Create Environment File

Create `.env.local` from `.env.example`.

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Or create it manually:

```bash
cp .env.example .env.local
```

### Configure Environment Variables

Fill the required environment values:

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
APP_DEMO_MODE=false
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Run Development Server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Environment Variables

| Variable                        | Required                         | Description                                                     |
| ------------------------------- | -------------------------------- | --------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Yes                              | Supabase project URL                                            |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes                              | Public anon key for client and session-aware server usage       |
| `SUPABASE_SERVICE_ROLE_KEY`     | Required for seed or admin tasks | Server-only key. Never expose it to the browser                 |
| `APP_DEMO_MODE`                 | Optional                         | Enables selected read-only demo behavior                        |
| `NEXT_PUBLIC_APP_URL`           | Yes                              | Application base URL for redirects, sitemap, and internal links |

Environment rules:

* Do not commit `.env.local`
* Do not expose service role key to the client
* Do not add `NEXT_PUBLIC_` prefix to private secrets
* Do not import admin Supabase client into client components
* Keep production and local environment values separated

## Supabase Workflow

This repository uses SQL migrations stored in:

```txt
supabase/migrations/
```

Do not edit old migrations that have already been applied. Create a new migration for new database changes.

### Apply Migrations

```bash
npx supabase db push
```

### Reset Local Database

Use this only for local development databases that are safe to reset.

```bash
npx supabase db reset
```

### Seed Real Creator Demo Accounts

The project includes a script for creating creator demo accounts and related marketplace data.

```bash
npm run seed:real-creators
```

This script reads environment variables and creates demo creator accounts, creator profiles, service packages, tiers, and related data.

## SQL Helper Files

Useful SQL helper files are stored in:

```txt
docs/sql/set-admin-role.sql
supabase/query/admin_query.sql
supabase/query/verify_seed_creators.sql
supabase/query/cleanup_admin_analytics.sql
```

Use them carefully in Supabase SQL Editor when needed.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run typecheck
npm run check
npm run seed:real-creators
```

Script description:

| Script                       | Description                                        |
| ---------------------------- | -------------------------------------------------- |
| `npm run dev`                | Run Next.js development server                     |
| `npm run build`              | Build the application for production               |
| `npm run start`              | Run the production build                           |
| `npm run lint`               | Run ESLint                                         |
| `npm run test`               | Run Vitest                                         |
| `npm run typecheck`          | Run TypeScript check without emitting files        |
| `npm run check`              | Run typecheck, lint, and build                     |
| `npm run seed:real-creators` | Seed creator accounts and related marketplace data |

## Architecture Notes

Important rules in this project:

* Default to Server Components.
* Use Client Components only when the UI needs browser-side interaction.
* Use import alias `@/*`.
* Keep `src/lib/utils.ts` as a file, not a `src/lib/utils/` folder.
* Do not modify `src/components/ui/*` unless there is a clear compatibility reason.
* Avoid `any` unless there is a justified migration or integration edge case.
* Keep `payment_status` and `order_status` separated.
* Do not trust sensitive data from the client.
* Use Server Actions, Route Handlers, or RPC for sensitive operations.
* Keep role-based behavior explicit and traceable.
* Do not weaken RLS only to make the UI look functional.
* Do not use admin client for regular user operations.

## Domain Rules

Ruang Usaha Kita uses a digital service marketplace model.

Use these terms consistently:

* `UMKM`
* `kreator`
* `content creator`
* `marketer`
* `paket jasa`
* `layanan digital`
* `brief campaign`
* `hasil konten`
* `revisi`
* `status pesanan`
* `pembayaran`
* `invoice`
* `portofolio`
* `review`

Avoid physical goods marketplace concepts such as:

* `stock`
* `inventory barang`
* `warehouse`
* `shipping`
* `courier`
* `tracking number`
* `delivery address`
* `packing`
* `shipment`
* `resi`
* `ongkir`
* `gudang`
* `kurir`
* `alamat pengiriman barang`

The product domain should remain focused on creative services, campaign work, content delivery, and revision flow.

## Feature Map

### Public

* Landing page
* Catalog search foundation
* Catalog filter and sort foundation
* Creator detail page
* Service detail page
* Help page
* How it works page

### Auth

* Register as UMKM or creator
* Login with role-aware redirect
* Forgot password
* Reset password
* Auth callback

### UMKM

* Dashboard overview
* Cart
* Checkout brief
* Direct checkout
* Payment sandbox
* Order list
* Order detail
* Invoice page
* Receipt page
* Results page
* Revision request
* Settings

### Creator

* Dashboard overview
* Onboarding
* Profile management
* Service package management
* Portfolio management
* Order handling
* Delivery submission
* Revision handling
* Earnings overview
* Settings

### Admin

* Dashboard command center
* Internal analytics
* User monitoring
* UMKM monitoring
* Creator monitoring
* Service monitoring
* Order monitoring
* Payment monitoring
* Complaint handling
* Reports and export foundation
* Platform settings

## Validation Before Push

Run the main check command before pushing changes:

```bash
npm run check
```

If you modify database schema, migrations, seed logic, or Supabase policies, also check the relevant Supabase workflow:

```bash
npx supabase db push
npm run seed:real-creators
```

If you modify search, filter, auth, order, payment, dashboard, delivery, or revision flow, also perform manual QA on related routes.

## Testing

Testing tools included or prepared in this repository:

* TypeScript
* ESLint
* Vitest
* React Testing Library
* Playwright foundation

Related documentation:

```txt
docs/architecture/testing-strategy.md
docs/architecture/auth-smoke-test.md
```

Testing priorities:

* Auth and role redirect
* Creator catalog and service detail
* Cart and checkout brief
* Order creation
* Payment sandbox flow
* Delivery submission
* Revision request and approval flow
* Admin monitoring pages
* RLS-sensitive user access

## Deployment

The main deployment target is Vercel.

Before deployment:

```bash
npm run check
```

Deployment checklist:

* Vercel environment variables are configured correctly
* Supabase Auth redirect URLs match the deployed domain
* Supabase policies are not relaxed for production
* Payment sandbox URLs point to the correct deployment
* No secret values are committed to the repository
* Public pages can load without demo-only assumptions
* Protected routes redirect correctly based on user role

Detailed deployment documentation:

```txt
docs/architecture/deployment.md
```

## Email and Reset Password

Forgot password and reset password flow use Supabase Auth.

Important routes:

```txt
/forgot-password
/callback?next=/reset-password
/reset-password
```

Related documentation:

```txt
docs/architecture/email-notifications.md
```

Check these items if reset password does not work:

* `NEXT_PUBLIC_APP_URL`
* Supabase Auth redirect allowlist
* Callback route behavior
* Email template redirect target

## Important Documentation

Start from these files to understand the project more deeply:

```txt
AGENTS.md
docs/architecture/overview.md
docs/architecture/route-map.md
docs/architecture/data-model.md
docs/architecture/roles-permissions.md
docs/architecture/order-flow.md
docs/architecture/payment-flow.md
docs/architecture/storage-policy.md
docs/architecture/supabase-setup.md
docs/architecture/testing-strategy.md
docs/architecture/deployment.md
docs/architecture/email-notifications.md
docs/architecture/implementation-roadmap.md
docs/product/feature-list.md
docs/product/mvp-scope.md
docs/uiux/design-system.md
docs/uiux/fiverr-reference.md
```

## Troubleshooting

### `npm install` fails

PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

Use this only when dependency installation is broken and you understand the effect.

### Port 3000 is already in use

```bash
npm run dev -- -p 3001
```

Then open:

```txt
http://localhost:3001
```

### Build fails when fetching Google Fonts

The project may use `next/font` for font loading. If the build fails because of Google Fonts network access, retry with a stable connection or prepare a self-hosted font strategy.

### Auth redirect or reset password fails

Check:

* `NEXT_PUBLIC_APP_URL`
* Supabase Auth redirect allowlist
* `/callback` route
* Email template redirect URL

### Dashboard or catalog does not show data

Check:

* Database migrations have been applied
* RLS policies allow the correct role access
* Account status is active
* Creator seed data exists
* Service packages are published or available for the current view

### Payment sandbox does not update order state

Check:

* Payment RPC or route handler
* `payment_status`
* `order_status`
* Related order record
* User role and ownership access

## Development Workflow

Recommended daily workflow:

```bash
git pull origin main
npm install
npm run dev
```

Before committing:

```bash
npm run check
git status
git diff --stat
```

Example branch names:

```txt
feature/creator-services
feature/payment-sandbox
feature/order-revision-flow
fix/auth-redirect
fix/rls-policy
docs/update-readme
perf/optimize-bundle-size
```

Example commit style:

```txt
feat: add creator service management
fix: correct auth redirect for creator users
docs: update Supabase setup guide
perf: optimize catalog image loading
test: add order flow tests
```

## Roadmap

### Short Term

* Improve frontend performance and bundle size
* Review heavy client components
* Optimize images and static assets
* Improve setup and deployment documentation
* Add more tests for order, payment, delivery, and revision flow

### Mid Term

* Strengthen Supabase RLS and storage policy review
* Improve admin monitoring experience
* Improve creator service management UX
* Improve UMKM order tracking UX
* Add clearer error handling and empty states
* Improve accessibility and responsive behavior

### Long Term

* Add stronger marketplace analytics
* Improve notification flow
* Prepare better release workflow
* Expand automated testing coverage
* Improve documentation for contributors
* Harden production security assumptions

## Performance Notes

This project uses Next.js and React, but performance still depends on implementation details.

Current optimization focus:

* Reducing unnecessary client-side JavaScript
* Reviewing bundle size
* Optimizing images and static assets
* Lazy loading heavy sections when appropriate
* Reviewing data fetching strategy
* Improving loading states and perceived performance
* Testing pages on lower-end devices and slower networks

## Security Notes

Security-sensitive areas:

* Supabase RLS policies
* Authentication callback
* Role-based dashboard access
* Admin-only operations
* Private file delivery
* Payment sandbox status update
* Service role usage
* Storage bucket access

Rules:

* Never expose service role key
* Never use admin client in client components
* Never trust user role from client input only
* Do not bypass RLS for regular user flows
* Keep order, payment, delivery, and revision access scoped to the correct user

## Contributing

Contributions are welcome through issues, documentation improvements, bug reports, and pull requests.

Recommended contribution flow:

1. Fork the repository.
2. Create a new branch.
3. Make a focused change.
4. Run checks before submitting.
5. Open a pull request with a clear explanation.

```bash
npm run check
```

Areas that are useful for contribution:

* Documentation
* Testing
* UI/UX polish
* Accessibility
* Performance
* Supabase RLS review
* Marketplace flow improvements

## Maintainer

Maintained by Mufaddhol.

This project is part of a learning-focused open-source workflow around full-stack development, UI/UX, digital service platforms, and UMKM marketplace systems.

## License

This project is licensed under the MIT License.
