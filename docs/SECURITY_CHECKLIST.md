# Security Checklist

Use this checklist before merging changes that affect sensitive flows.

## Authentication and Roles

- Session behavior is still server-trusted
- Role redirect remains based on profile data, not client claims
- Public registration still cannot create admin users
- Account status checks still gate protected flows

## RLS and Data Ownership

- Users can only read and mutate records they should own
- Creator access is scoped to creator-owned services, portfolio, and assigned orders
- UMKM access is scoped to UMKM-owned cart, brief, order, payment, review, and complaint data
- Admin access changes are intentional and documented
- No broad `using true` style policy was introduced for private data

## Storage and File Access

- Private files remain private by default
- Public assets are explicitly intended to be public
- Upload validation still limits unsupported file types and sizes
- Signed URL or private access flow remains scoped correctly

## Payment and Order Flow

- `payment_status` and `order_status` remain separate
- Client input cannot mark payment as paid directly
- Creator cannot complete an order unilaterally
- Sensitive transitions still happen through trusted server paths

## Repository Hygiene

- No secret values were committed
- `.env.local` was not modified or added
- Placeholder workflow env values remain placeholders
- Documentation does not overclaim security posture or production readiness
