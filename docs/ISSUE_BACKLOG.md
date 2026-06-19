# Maintainer Issue Backlog

GitHub CLI was not available in the local environment. This file prepares meaningful issues that can be created manually by the maintainer.

Suggested milestone:

```txt
v0.3.0 - Stability, security, and performance
```

Suggested labels:

```txt
security, performance, documentation, maintenance, testing, good first issue, help wanted, supabase, accessibility, frontend, backend, release, auth, payment, orders, storage, admin, creator, umkm
```

## Security: review Supabase RLS, storage, and role-based access

Labels: `security`, `supabase`, `backend`

Milestone: `v0.3.0 - Stability, security, and performance`

Scope:

- Review RLS policies for profiles, UMKM profiles, creator profiles, carts, briefs, orders, payments, submissions, revisions, reviews, complaints, notifications, analytics, and file assets
- Review public and anon policies
- Review storage bucket visibility
- Review service-role usage
- Review admin-only actions

Checklist:

- [ ] Run or inspect `supabase/query/rls_security_review.sql`
- [ ] Confirm private order, payment, brief, invoice, hasil konten, revision, and complaint data is not public
- [ ] Confirm public catalog policies only expose active or published public data
- [ ] Confirm admin access is intentional and server-side
- [ ] Document any follow-up migrations separately

Expected outcome:

- A short security review note with any required fixes split into focused issues or pull requests

## Performance: audit bundle size and critical page loading

Labels: `performance`, `frontend`

Milestone: `v0.3.0 - Stability, security, and performance`

Scope:

- Public landing page
- Catalog
- Creator detail
- Service detail
- Dashboard shell
- Admin analytics
- Payment modal
- Chat panel

Checklist:

- [ ] Review image usage and `next/image` sizing
- [ ] Review unnecessary Client Components
- [ ] Review chart and analytics payload sizes
- [ ] Review mobile layout cost
- [ ] Record LCP, CLS, and INP observations for priority pages

Expected outcome:

- A measured list of performance work with route names, symptoms, and recommended fixes

## Testing: expand coverage for order, payment, delivery, and revision flow

Labels: `testing`, `orders`, `payment`, `backend`

Milestone: `v0.3.0 - Stability, security, and performance`

Scope:

- Order creation
- Sandbox payment idempotency
- Creator accept/start flow
- Creator delivery
- UMKM revision request
- UMKM approve completion
- Review creation

Checklist:

- [ ] Add unit tests for status transition helpers where available
- [ ] Add tests for payment action duplicate handling
- [ ] Add tests for checkout source and order ownership assumptions
- [ ] Add tests for file validation
- [ ] Keep tests independent from production Supabase data

Expected outcome:

- Focused tests that protect the marketplace lifecycle without requiring production credentials

## Accessibility: review public marketplace and dashboard navigation

Labels: `accessibility`, `frontend`

Milestone: `v0.3.0 - Stability, security, and performance`

Scope:

- Public header and mobile navigation
- Catalog filters
- Auth forms
- Dashboard sidebar and topbar
- Payment modal
- Chat panel
- Admin tables and filters

Checklist:

- [ ] Keyboard navigation works for major menus and dialogs
- [ ] Icon-only actions have accessible names
- [ ] Form fields have labels
- [ ] Status badges include text, not only color
- [ ] Mobile navigation is usable without horizontal scroll

Expected outcome:

- A route-by-route accessibility review with actionable fixes

## Docs: improve deployment and Supabase setup verification

Labels: `documentation`, `supabase`

Milestone: `v0.3.0 - Stability, security, and performance`

Scope:

- Local setup
- Environment variables
- Supabase migrations
- Auth redirect URLs
- Storage buckets
- Seed scripts
- Admin account promotion

Checklist:

- [ ] Verify README setup steps against a fresh clone
- [ ] Verify Supabase migration instructions
- [ ] Verify reset-password redirect documentation
- [ ] Verify seed creator instructions
- [ ] Verify admin setup SQL references

Expected outcome:

- Clear setup notes that reduce maintainer and contributor confusion

## Maintenance: review Dependabot PRs and dependency update policy

Labels: `maintenance`, `dependencies`

Milestone: `v0.3.0 - Stability, security, and performance`

Scope:

- npm dependencies
- GitHub Actions dependencies
- Security advisories
- Next.js, React, Supabase, and testing dependencies

Checklist:

- [ ] Review Dependabot configuration
- [ ] Group dependency updates by risk where appropriate
- [ ] Run `npm run check` after dependency changes
- [ ] Confirm no production secrets are needed in CI
- [ ] Record any blocked updates in `CHANGELOG.md` or maintainer notes

Expected outcome:

- Dependency updates stay reviewable and do not silently break marketplace flows

## Release: prepare v0.3.0 stability roadmap

Labels: `release`, `maintenance`, `documentation`

Milestone: `v0.3.0 - Stability, security, and performance`

Scope:

- Release checklist
- Known limitations
- Security review status
- Test coverage status
- Documentation accuracy

Checklist:

- [ ] Review `CHANGELOG.md`
- [ ] Review `docs/ROADMAP.md`
- [ ] Confirm CI is green
- [ ] Confirm migrations are documented
- [ ] Confirm issue backlog is triaged
- [ ] Confirm no production-readiness overclaim is present

Expected outcome:

- A realistic release note and roadmap entry for the next public review milestone

