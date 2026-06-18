# CONTRIBUTING.md

# Contributing to Ruang Usaha Kita

Thank you for your interest in contributing to Ruang Usaha Kita.

Ruang Usaha Kita is an open-source full-stack marketplace project for UMKM digital services. The project is still early-stage, but it already has a structured domain model, role-based dashboards, Supabase integration, payment sandbox, order lifecycle, delivery flow, and revision workflow.

Contributions are welcome, especially in documentation, testing, accessibility, performance, UI/UX polish, and security review.

## Before Contributing

Please read the main `README.md` first to understand:

* Project scope
* Domain rules
* User roles
* Environment setup
* Supabase workflow
* Testing and deployment notes

This project is a digital service marketplace, not a physical goods marketplace. Avoid introducing physical-commerce concepts such as stock, warehouse, courier, shipping, tracking number, or delivery address.

## Contribution Areas

Useful contribution areas include:

* Documentation improvements
* Bug reports
* UI/UX improvements
* Accessibility improvements
* Performance optimization
* Supabase RLS review
* Storage policy review
* Authentication and role access review
* Test coverage for order, payment, delivery, and revision flow
* Refactoring for maintainability

## Development Setup

Clone the repository:

```bash
git clone https://github.com/fadd3079-prog/ruangusahakita.git
cd ruangusahakita
```

Install dependencies:

```bash
npm install
```

Create environment file:

```bash
cp .env.example .env.local
```

Run the development server:

```bash
npm run dev
```

Before opening a pull request, run:

```bash
npm run check
```

If you modify tests, also run:

```bash
npm run test
```

## Branch Naming

Use clear branch names:

```txt
feature/creator-services
feature/order-revision-flow
fix/auth-redirect
fix/rls-policy
docs/update-readme
perf/optimize-bundle-size
test/order-flow
```

## Commit Style

Use short and specific commit messages:

```txt
feat: add creator service management
fix: correct auth redirect for creator users
docs: update Supabase setup guide
perf: optimize catalog image loading
test: add order flow tests
chore: update dependencies
```

## Pull Request Guidelines

A good pull request should include:

* Clear summary of the change
* Reason for the change
* Screenshots for UI changes
* Testing notes
* Any migration or environment changes
* Known limitations, if any

Avoid large mixed changes. Prefer small and focused pull requests.

## Security-Sensitive Changes

Be careful when changing:

* Supabase RLS policies
* Authentication callback
* Role-based dashboard access
* Storage bucket policies
* Payment sandbox logic
* Order ownership checks
* Admin-only actions
* Service role usage

Do not weaken RLS just to make the UI work. Fix the access logic properly.

## Maintainer Note

This project is maintained as a learning-focused open-source project. Contributions should improve clarity, safety, maintainability, or real product behavior.














