# Supabase Setup Architecture

## Current Stage
This document outlines the foundation for Supabase integration. Currently, only the foundation files and types are set up. **Do not connect pages to Supabase, replace dummy data, or write real queries yet.** This is purely structural.

## Environment Variables
The following environment variables are required:
- `NEXT_PUBLIC_SUPABASE_URL`: The URL to the Supabase project. Required for all clients.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The public anonymous key. Safe to expose to the browser. Used by `client.ts` and `server.ts`.
- `SUPABASE_SERVICE_ROLE_KEY`: The admin key. **CRITICAL: NEVER expose this to the browser or in public configs.** It bypasses Row Level Security (RLS) and gives full database access.

## Client Types and Separation

We maintain strict separation of concerns for our Supabase clients to ensure security:

### 1. Browser Client (`src/lib/supabase/client.ts`)
- **Usage**: Used in Client Components (`"use client"`).
- **Security**: Safe for browser usage. Uses `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Respects RLS.

### 2. Server Client (`src/lib/supabase/server.ts`)
- **Usage**: Used in Server Components, Route Handlers, and Server Actions where cookie access is available.
- **Security**: Uses `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Respects RLS based on the user's session stored in cookies.

### 3. Admin Client (`src/lib/supabase/admin.ts`)
- **Usage**: Server-only environments for administrative tasks (e.g., webhook handlers, background jobs).
- **Security**: **Uses `SUPABASE_SERVICE_ROLE_KEY`**. Bypasses RLS. This file must never be imported into client components.

## Planned Auth Flow
- Registration/Login will be handled by Supabase Auth using standard email/password or OAuth (if required later).
- Upon successful authentication, the user will be assigned a role (`umkm`, `creator`, or `admin`).
- Role information will be stored in a `profiles` table linked to the `auth.users` table.

## Planned Role-Based Dashboard Redirect
- After login, the application will determine the user's role by querying their profile.
- Users will be automatically redirected to their respective dashboard:
  - Admin -> `/admin/dashboard`
  - Creator -> `/creator/dashboard`
  - UMKM -> `/umkm/dashboard`
- The `getDashboardPathByRole` utility will manage these redirect paths.

## Row Level Security (RLS)
- **RLS will be strictly required** before any real user data is stored or queried.
- No public tables without policies will be permitted.
- Current UI components must continue using dummy data until RLS and database schemas are fully finalized and migrated.
