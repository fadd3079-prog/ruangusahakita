# Architecture Summary

Ruang Usaha Kita is a full-stack marketplace MVP for UMKM digital service workflows. The architecture is organized around public discovery, role-based dashboards, Supabase-backed persistence, and server-side control of sensitive operations.

## Public Marketplace

The public area includes the landing page, catalog, creator detail, service detail, help, and how-it-works pages. These routes are used by guests and authenticated users to understand the platform and browse active creators or service packages.

## Auth

Authentication uses Supabase Auth. The application stores role and account metadata in profile tables and redirects users to the correct dashboard for UMKM, creator, or admin access. Public registration supports UMKM and creator accounts, while admin accounts are promoted manually through trusted database or maintainer workflows.

## UMKM Area

The UMKM area includes dashboard, cart, checkout brief, payments, orders, invoice, receipt, results, briefs, and settings. UMKM users can manage their own service ordering flow and review submitted work.

## Creator Area

The creator area includes dashboard, onboarding, profile, services, portfolio, orders, earnings, and settings. Creators manage their public marketplace presence and process assigned orders.

## Admin Area

The admin area includes dashboard, analytics, users, UMKM, creators, services, orders, payments, complaints, reports, and platform settings. Admin routes are intended for monitoring and moderation, not normal UMKM or creator activity.

## Supabase

Supabase provides authentication, PostgreSQL storage, RLS, storage, and realtime-ready infrastructure. The application uses server clients for session-aware queries and a server-only admin client for trusted administrative or seed operations.

## PostgreSQL and RLS

Database structure is managed through SQL migrations in `supabase/migrations/`. RLS is a major security boundary. UMKM, creator, admin, and public access must remain scoped by ownership, role, and visibility.

## Storage

Storage is used for assets such as creator media, portfolio-related files, and service workflow files. Public files and private delivery files should remain separate in policy and access behavior.

## Server Actions and Route Handlers

Sensitive operations use Server Actions, Route Handlers, or database RPC functions. This includes checkout, payment sandbox behavior, service management, admin actions, order transitions, delivery, revision, and upload handling.

## Payment Sandbox

The project includes a sandbox-style payment flow for MVP development. It is not a production payment gateway claim. Payment status and order status are intentionally separate.

## Order, Delivery, and Revision Flow

Orders connect UMKM, creators, service packages, campaign briefs, payment records, delivery results, revision requests, reviews, and admin monitoring. Creator delivery and UMKM revision or approval are part of the service workflow.

