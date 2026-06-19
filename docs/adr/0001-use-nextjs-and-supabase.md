# ADR 0001: Use Next.js and Supabase

## Status

Accepted

## Context

Ruang Usaha Kita needs a full-stack foundation for a service marketplace MVP. The project includes public marketplace pages, role-based dashboards, authentication, order workflows, payment sandbox behavior, file delivery, revision handling, and admin monitoring.

The stack needs to support server-rendered pages, secure server-side actions, database-backed auth, RLS, storage, and incremental deployment without requiring a large backend team.

## Decision

Use Next.js App Router for the application layer and Supabase for authentication, PostgreSQL, Row Level Security, storage, and realtime-ready features.

Next.js provides route groups for public, auth, UMKM, creator, admin, and API areas. Supabase provides a managed backend that fits the project's current MVP scope while still allowing explicit SQL migrations and RLS review.

## Consequences

The application can keep most sensitive operations server-side through Server Actions and Route Handlers. Supabase RLS remains a core security boundary, so database policies must be reviewed carefully whenever ownership or role behavior changes.

The project also depends on keeping generated or handwritten Supabase types aligned with migrations. Schema changes should go through new migrations, not edits to old applied files.

