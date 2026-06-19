# Project Governance

Ruang Usaha Kita is an early-stage open-source project maintained primarily by the repository owner. The governance model is intentionally simple and should grow only when the contributor base needs it.

## Maintainer Model

The primary maintainer is responsible for repository direction, review decisions, release notes, security handling, and final merge approval.

Contributors are welcome to propose improvements through issues and pull requests, especially in documentation, testing, accessibility, performance, Supabase safety review, and marketplace flow clarity.

## Issue Triage

Issues are reviewed by affected area:

- Public marketplace
- Auth
- UMKM dashboard
- Creator dashboard
- Admin dashboard
- Cart and checkout brief
- Payment sandbox
- Order flow
- Delivery and revision flow
- Supabase RLS
- Storage
- Documentation
- Performance

Security-sensitive issues should follow `SECURITY.md` instead of normal public issue discussion.

## Pull Request Review

Pull requests should be focused and explain the reason for the change. Changes that affect authentication, payment, order lifecycle, storage, RLS, or admin-only behavior need extra review.

The maintainer may request smaller PRs if one change mixes documentation, UI, database, and runtime behavior without a clear reason.

## Release Approach

The project uses lightweight release notes in `CHANGELOG.md`. Tags should only be created when the repository is in a reviewable state and setup instructions are still accurate.

This repository does not claim production readiness unless a future release explicitly documents hardening work, deployment assumptions, and operational limits.

## Security Handling

Security reports should avoid public exploit details. The maintainer will review, reproduce, scope, and patch valid reports when possible. Sensitive areas include Supabase RLS, role access, payment sandbox transitions, private files, service role usage, and admin behavior.

## Project Status

Ruang Usaha Kita is an educational and practical full-stack marketplace MVP. It is suitable for code review, learning, and staged OSS improvement. It should not be treated as a mature commercial platform without additional hardening.

