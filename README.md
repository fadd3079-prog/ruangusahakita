# Ruang Usaha Kita

Ruang Usaha Kita is an open-source full-stack marketplace MVP for UMKM digital services. The platform connects UMKM with creators, content creators, and marketers through service packages, campaign briefs, checkout, sandbox payment, order management, revision flow, file delivery, reviews, and role-based dashboards.

This repository is maintained as an educational and practical OSS case study for building a service-based marketplace with Next.js, Supabase, strong domain rules, and real application structure.

## Project Status

Ruang Usaha Kita is actively maintained as an early-stage full-stack marketplace MVP.

The current repository already includes:

- Supabase Auth integration
- role-aware onboarding and dashboard redirect
- public catalog and service discovery flow
- cart and checkout brief flow
- sandbox payment flow
- order lifecycle foundation
- creator delivery and revision flow
- role-based dashboards for UMKM, creator, and admin
- admin monitoring and analytics foundation

The project is stable enough for MVP review and contributor onboarding, but it should not be described as production-ready commerce infrastructure.

## Why This Project Exists

Ruang Usaha Kita focuses on a service-commerce workflow for UMKM promotion needs.

Instead of selling physical products, the platform is designed around:

- service packages
- campaign briefs
- creative delivery
- revision handling
- payment tracking
- reviews
- role-based operations

The domain is intentionally not modeled as a warehouse, shipping, or inventory system.

## Core User Flows

### UMKM

1. Browse creators and services
2. Compare packages
3. Add a service to cart or start direct checkout
4. Fill a campaign brief
5. Complete sandbox payment
6. Track order progress
7. Review delivered files
8. Request revision or approve completion
9. Leave a review

### Creator

1. Complete onboarding
2. Manage profile and service packages
3. Receive and process incoming orders
4. Submit delivery files
5. Respond to revision requests
6. Monitor basic earnings and order activity

### Admin

1. Monitor marketplace activity
2. Review users, creators, services, orders, and payments
3. Inspect complaints and reports
4. Review analytics and platform settings foundation

## Tech Stack

### Application

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Radix UI
- Lucide React
- Sonner
- React Hook Form
- Zod
- Zustand
- Recharts
- TanStack Table

### Backend and Infrastructure

- Supabase Auth
- Supabase PostgreSQL
- Supabase Row Level Security
- Supabase Storage
- Supabase Realtime foundation
- Server Actions
- Route Handlers
- SQL migrations and RPC-based backend flow
- Vercel

## Repository Structure

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
tests/
public/
```

## Route Groups

- `(public)` public marketplace pages
- `(auth)` authentication pages
- `(umkm)` UMKM dashboard area
- `(creator)` creator dashboard area
- `(admin)` admin dashboard area
- `api` internal API routes

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

- Node.js 20 or newer
- npm
- Git
- Supabase account
- Supabase CLI if you want to run migrations locally

Check versions:

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

### Create Local Environment File

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Unix shell:

```bash
cp .env.example .env.local
```

### Required Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
APP_DEMO_MODE=false
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Start Development Server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Public anon key for browser and session-aware server usage |
| `SUPABASE_SERVICE_ROLE_KEY` | Only for server-only admin tasks and seed scripts | Secret server key, never expose to the browser |
| `APP_DEMO_MODE` | Optional | Enables selected read-only demo behavior |
| `NEXT_PUBLIC_APP_URL` | Yes | Base URL for redirects, sitemap, auth, and generated links |

Rules:

- Do not commit `.env.local`
- Do not expose service role credentials
- Do not prefix private secrets with `NEXT_PUBLIC_`
- Do not import admin Supabase clients into browser-facing code

## Supabase Workflow

Database changes are tracked in:

```txt
supabase/migrations/
```

Do not edit old migrations that may already be applied. Create a new migration for each new schema, RLS, or RPC change.

Apply migrations:

```bash
npx supabase db push
```

Reset local database only when safe:

```bash
npx supabase db reset
```

Useful helper SQL files:

```txt
docs/sql/set-admin-role.sql
supabase/query/admin_query.sql
supabase/query/verify_seed_creators.sql
supabase/query/cleanup_admin_analytics.sql
```

## Demo Creator Seed

The repository includes a real seed script for creator marketplace data:

```bash
npm run seed:real-creators
```

This script uses the Supabase Admin API and current schema to create creator auth accounts, profiles, service packages, tiers, and related marketplace data for local or staging review.

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

| Script | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest |
| `npm run typecheck` | Run TypeScript checks without emitting files |
| `npm run check` | Run `typecheck`, `lint`, and `build` |
| `npm run seed:real-creators` | Seed creator accounts and marketplace service data |

## Domain Rules

Use these terms consistently:

- `UMKM`
- `kreator`
- `content creator`
- `marketer`
- `paket jasa`
- `layanan digital`
- `brief campaign`
- `hasil konten`
- `revisi`
- `status pesanan`
- `pembayaran`
- `invoice`
- `portofolio`
- `review`

Avoid physical-goods language such as:

- `stock`
- `warehouse`
- `shipping`
- `courier`
- `tracking number`
- `delivery address`
- `packing`
- `shipment`
- `resi`
- `ongkir`
- `gudang`
- `kurir`

## Architecture Guardrails

- Default to Server Components
- Use Client Components only for real client-side interaction
- Use `@/*` imports
- Keep `src/lib/utils.ts` as a file, not a folder
- Do not modify `src/components/ui/*` casually
- Keep `payment_status` and `order_status` separate
- Do not trust sensitive state transitions from the client
- Use server-side validation for auth, payment, order, delivery, and storage operations
- Do not weaken RLS just to make a page appear functional

## Community Files

Repository maintenance files:

- [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- [`SECURITY.md`](./SECURITY.md)
- [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)
- [`SUPPORT.md`](./SUPPORT.md)
- [`CHANGELOG.md`](./CHANGELOG.md)
- [`LICENSE`](./LICENSE)

GitHub community support:

- Issue templates in `.github/ISSUE_TEMPLATE/`
- Pull request template in `.github/PULL_REQUEST_TEMPLATE.md`
- CI workflow in `.github/workflows/ci.yml`
- Dependabot config in `.github/dependabot.yml`

## Validation Before Opening a Pull Request

Run:

```bash
npm run check
```

If your change affects tests:

```bash
npm run test
```

If your change affects schema, RLS, or seed behavior, also verify the relevant local Supabase workflow.

## Testing

Testing tools already present in the repository:

- TypeScript
- ESLint
- Vitest
- React Testing Library
- Playwright

Related docs:

- `docs/architecture/testing-strategy.md`
- `docs/architecture/auth-smoke-test.md`

## Deployment

The main deployment target is Vercel.

Before deployment:

```bash
npm run check
```

Check these items:

- Vercel environment variables are correct
- Supabase Auth redirect URLs match the deployment URL
- No secret values are committed
- Payment sandbox routes point to the correct deployment
- Protected dashboards redirect correctly by role

Detailed deployment guide:

- `docs/architecture/deployment.md`

## Email and Reset Password

Forgot-password flow uses Supabase Auth with:

```txt
/forgot-password
/callback?next=/reset-password
/reset-password
```

See:

- `docs/architecture/email-notifications.md`

## Useful Documentation

Recommended reading order:

- `AGENTS.md`
- `docs/architecture/overview.md`
- `docs/architecture/route-map.md`
- `docs/architecture/data-model.md`
- `docs/architecture/roles-permissions.md`
- `docs/architecture/order-flow.md`
- `docs/architecture/payment-flow.md`
- `docs/architecture/storage-policy.md`
- `docs/architecture/supabase-setup.md`
- `docs/architecture/testing-strategy.md`
- `docs/architecture/deployment.md`
- `docs/product/feature-list.md`
- `docs/product/mvp-scope.md`
- `docs/uiux/design-system.md`
- `docs/uiux/fiverr-reference.md`

## Troubleshooting

### `npm install` fails

PowerShell:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

Use this only when dependency installation is genuinely broken.

### Port 3000 is already in use

```bash
npm run dev -- -p 3001
```

### Build fails when fetching Google Fonts

If a build environment cannot fetch Google Fonts for `next/font`, retry in a stable network or switch to a self-hosted font strategy during deployment hardening.

### Reset password flow does not work

Check:

- `NEXT_PUBLIC_APP_URL`
- Supabase Auth redirect allowlist
- `/callback` route
- email redirect target

### Catalog or dashboard data does not appear

Check:

- Migrations are applied
- RLS policies allow the intended role
- Account status is active
- Seeded creator and service data exists
- Service or profile visibility flags match the current view

## Development Workflow

Typical local loop:

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
fix/auth-redirect
perf/catalog-loading
docs/repository-maintenance
test/order-flow
```

## License

This project is released under the MIT License.
