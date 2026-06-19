# Issue Triage Guide

This guide helps maintainers sort incoming reports without inflating activity or accepting vague work.

## First Pass

For every issue, check:

- Is the affected role clear?
- Is the affected route or feature clear?
- Is the report about public marketplace, auth, UMKM, creator, admin, checkout, payment sandbox, order flow, delivery, revision, storage, analytics, documentation, or repository maintenance?
- Is there enough information to reproduce or review it?
- Is it a security-sensitive report that should move out of public discussion?

## Suggested Labels

Use labels consistently:

- `security`
- `performance`
- `documentation`
- `maintenance`
- `testing`
- `good first issue`
- `help wanted`
- `supabase`
- `accessibility`
- `frontend`
- `backend`
- `release`
- `auth`
- `payment`
- `orders`
- `storage`
- `admin`
- `creator`
- `umkm`

## Severity

### Critical

- Private data exposure
- RLS or ownership bypass
- Service role exposure
- Admin route available to non-admin users
- Payment status can be changed by unauthorized users
- Private files are public
- Build fails on the default branch

### High

- Login or role redirect is broken
- Checkout cannot create orders
- Sandbox payment cannot complete
- Creator cannot process assigned orders
- UMKM cannot see owned orders or hasil konten
- Admin cannot access core monitoring pages

### Medium

- Search, filter, or sort works incorrectly
- Dashboard card or table overflows
- Upload feedback is unclear
- Important empty, loading, or error state is missing
- Accessibility issue blocks common keyboard or screen-reader usage

### Low

- Typo
- Small spacing issue
- Minor documentation clarity issue
- Non-blocking copy improvement

## Milestone Guidance

Use a milestone only when the issue clearly belongs to a planned maintenance or release theme.

Suggested milestone:

```txt
v0.3.0 - Stability, security, and performance
```

Good candidates:

- RLS review
- Performance audit
- Critical flow test coverage
- Accessibility review
- Deployment and Supabase setup verification
- Release readiness checklist

## Closing Issues

Close an issue when:

- The fix is merged
- The report cannot be reproduced and lacks follow-up detail
- The request is outside the project domain
- The report asks for physical-product marketplace behavior that conflicts with the service-marketplace model
- The issue should be handled privately as a security report

When closing without a code change, leave a short reason.

