# Security Policy

Ruang Usaha Kita handles authentication, role-based access, order data, payment sandbox transitions, private file delivery, and Supabase-backed persistence. Security review is part of normal maintenance, not a later add-on.

## Supported Versions

Only the latest state of the default branch is actively maintained for security fixes.

| Version | Supported |
| --- | --- |
| Latest default branch | Yes |
| Older snapshots and forks | No |

## Reporting a Vulnerability

Please do not post sensitive vulnerabilities as normal public issues.

Use one of these paths:

1. GitHub private vulnerability reporting, if available for the repository
2. Direct maintainer contact through the repository owner account
3. A public issue only when the report can be safely shared without exploit details

Include:

- Affected route, feature, or flow
- Preconditions and affected role
- Reproduction steps
- Expected behavior
- Actual behavior
- Impact
- Suggested mitigation, if you have one

## Security-Sensitive Areas

- Supabase RLS and ownership policies
- Authentication callback and session handling
- Role-based redirect and route protection
- Admin-only actions and admin dashboards
- Payment sandbox status mutation
- Order, delivery, revision, and review ownership
- Private file upload and download
- Storage bucket visibility
- Server action validation
- Service role usage

## Project Security Expectations

- `SUPABASE_SERVICE_ROLE_KEY` must remain server-only
- Admin clients must not be imported into user-facing client code
- `payment_status` and `order_status` must stay separate
- Public routes must not expose protected order, payment, brief, delivery, or complaint data
- Role checks must come from trusted server-side data
- RLS should not be relaxed to satisfy UI behavior
- Real secrets must never be committed

## Out of Scope for Public Reports

These are usually not treated as security issues by themselves unless they lead to a real exploit path:

- Missing production hardening for deployments that are not publicly claimed as production-ready
- Performance problems without data exposure or privilege bypass
- Generic dependency age without a demonstrated impact in this repo
- Local development-only placeholders that are not reachable in protected runtime flows

## Response Model

The maintainer goal is to:

1. Confirm the report
2. Reproduce the issue
3. Decide scope and severity
4. Prepare a fix or mitigation
5. Credit the reporter when appropriate

No guaranteed response SLA is promised, but clear and reproducible reports will be prioritized.
