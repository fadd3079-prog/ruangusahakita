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
- `supabase/query/rls_security_review.sql` has been run or reviewed for schema/RLS changes
- Any `anon` policy is limited to public marketplace data, public assets, or safe event insertion
- Any `authenticated` write policy has an ownership or role check in `using` and `with check`

## Storage and File Access

- Private files remain private by default
- Public assets are explicitly intended to be public
- Upload validation still limits unsupported file types and sizes
- Signed URL or private access flow remains scoped correctly
- Storage bucket visibility matches the intended file context
- Hasil konten, brief campaign assets, invoice files, revision files, and complaint files are not exposed as public objects

## Payment and Order Flow

- `payment_status` and `order_status` remain separate
- Client input cannot mark payment as paid directly
- Creator cannot complete an order unilaterally
- Sensitive transitions still happen through trusted server paths
- Sandbox payment RPC/action is idempotent for already-paid payments
- Order completion still requires UMKM approval or an explicitly reviewed admin path

## Repository Hygiene

- No secret values were committed
- `.env.local` was not modified or added
- Placeholder workflow env values remain placeholders
- Documentation does not overclaim security posture or production readiness
- CI uses existing package scripts and does not require production secrets
- New documentation links use the current repository URL
