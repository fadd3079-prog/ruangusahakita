# Contributing to Ruang Usaha Kita

Thank you for contributing to Ruang Usaha Kita.

Ruang Usaha Kita is an early-stage open-source full-stack marketplace MVP for UMKM digital services. The repository already includes authentication, role-based dashboards, Supabase integration, cart and checkout brief flow, payment sandbox, order lifecycle, delivery, revision, and admin monitoring. Contributions should strengthen the project without blurring its service-marketplace domain.

## Before You Start

Read these files first:

- `README.md`
- `AGENTS.md`
- `docs/architecture/overview.md`
- `docs/architecture/route-map.md`
- `docs/architecture/data-model.md`
- `docs/architecture/roles-permissions.md`
- `docs/architecture/order-flow.md`
- `docs/architecture/payment-flow.md`

This project is a marketplace for digital services, not physical goods. Please avoid introducing physical-commerce concepts such as stock, warehouse, shipping, courier, tracking number, or delivery address.

## Good Contribution Areas

- Documentation clarity
- Setup and deployment guides
- Tests for auth, catalog, checkout, payment sandbox, orders, delivery, and revision flow
- Accessibility improvements
- Performance improvements
- Error, loading, and empty-state polish
- Supabase RLS review
- Storage safety review
- Maintainer tooling and repository maintenance

## Changes That Need Extra Care

Open a focused pull request and explain the impact clearly if you touch:

- Authentication and role redirect
- Supabase RLS or ownership checks
- Storage access rules
- Payment sandbox flow
- Order, delivery, or revision status transitions
- Admin-only behavior
- Seed scripts or SQL helper files

Do not weaken security assumptions just to make a page render.

## Local Setup

```bash
git clone https://github.com/fadd3079-prog/ruangusahakita.git
cd ruangusahakita
npm install
```

Create local environment file:

```powershell
Copy-Item .env.example .env.local
```

Run development server:

```bash
npm run dev
```

## Development Rules

- Keep changes scoped
- Prefer small pull requests over mixed changes
- Use `@/*` imports
- Do not create `src/lib/utils/`; keep `src/lib/utils.ts`
- Do not modify `src/components/ui/*` unless the change is truly necessary
- Do not commit `.env.local`, credentials, or screenshots containing secrets
- Do not edit old Supabase migrations that may already be applied

## Verification

Run before opening a pull request:

```bash
npm run check
```

If you changed tests:

```bash
npm run test
```

If you changed database-related files, also verify the relevant local Supabase workflow.

## Pull Request Expectations

A strong pull request should include:

- A clear summary
- The reason for the change
- Affected area or role
- Screenshots for UI changes
- Manual verification notes
- Environment or migration notes if relevant
- Any known limitations

Please keep documentation changes, UI polish, and backend changes separated unless they are tightly connected.

## Branch and Commit Style

Example branch names:

```txt
feature/creator-services
fix/auth-redirect
perf/catalog-loading
docs/repository-maintenance
test/order-flow
```

Example commit messages:

```txt
feat: improve creator service management
fix: correct UMKM checkout redirect
perf: reduce catalog image cost
docs: refresh repository maintenance docs
test: add payment sandbox coverage
```

## Communication

If you are unsure whether a change affects domain rules, security, or role access, open an issue or draft pull request first. It is better to align early than to submit a large correction later.
