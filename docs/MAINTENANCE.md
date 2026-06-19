# Maintenance Guide

This file is for repository maintainers and frequent contributors.

## Maintenance Priorities

- Keep runtime behavior stable
- Keep repository documentation aligned with the actual codebase
- Avoid stale setup instructions
- Keep Supabase workflow explicit and safe
- Review auth, RLS, payment sandbox, and storage-sensitive changes carefully

## Routine Checks

Review regularly:

- `README.md`
- `CHANGELOG.md`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `.github/workflows/ci.yml`
- `.github/dependabot.yml`
- `docs/architecture/*`
- `supabase/query/rls_security_review.sql`

## Before Merging

- Confirm the change is scoped
- Confirm the affected area is documented clearly in the PR
- Run `npm run check`
- Review whether docs also need updates
- Check whether any new environment variables are documented
- Verify no secret or local-only values entered the diff

## For Schema or RLS Changes

- Never edit old applied migrations
- Add a new migration instead
- Confirm naming stays sequential and descriptive
- Confirm README or docs need not claim behavior that is not yet applied
- Review ownership and role assumptions before merge
- Run or inspect `supabase/query/rls_security_review.sql` against a safe development database
- Confirm any public or `anon` access is intentional and limited to public marketplace data

## For Documentation Changes

- Keep claims specific and grounded
- Avoid calling the project production-ready without evidence
- Prefer repository URLs that match the current owner
- Keep examples aligned with existing package scripts and route structure

## For Community Files

Refresh when needed:

- issue templates
- pull request template
- support flow
- security contact guidance
- release notes and changelog structure
