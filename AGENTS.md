# Ruang Usaha Kita - Agent Instructions

## Read This First

- This project uses a newer Next.js version with changed APIs and conventions. Before writing code, read the relevant guide in `node_modules/next/dist/docs/`.
- For substantial work, also check the relevant docs under `docs/architecture`, `docs/product`, `docs/prompts` if present, and `docs/uiux`.
- Keep work staged and scoped. Do not build broad flows unless the user explicitly asks for that phase.

## Product Domain

- Always treat Ruang Usaha Kita as a digital service marketplace for UMKM and content creators/marketers.
- Never treat it as a physical product store.
- Use domain terms: UMKM, kreator, content creator, marketer, paket jasa, layanan digital, brief campaign, hasil konten, revisi, status pesanan, pembayaran, invoice, portofolio, review.
- Avoid physical-store terms and concepts: stock, inventory barang, warehouse, shipping, courier, tracking number, delivery address, packing, shipment, resi, ongkir, gudang, kurir, alamat pengiriman barang.
- Order flow is about digital service production: find kreator, choose paket jasa, fill brief campaign, make pembayaran, monitor status pesanan, receive hasil konten, request revisi, then give review.
- Keep payment status separate from status pesanan. Do not let client code become the source of truth for payment or order status.

## Tech Stack

- Use Next.js App Router, TypeScript, Tailwind CSS v4, shadcn/ui, Radix UI, Lucide React, and Inter.
- Supabase, Midtrans, real auth, payment gateway, storage, cart, checkout, and dashboards are staged later. Do not implement them unless explicitly requested.
- Use `@/*` imports.
- Do not create a `src/lib/utils` folder. `src/lib/utils.ts` already exists and should remain the utility entry.
- Do not modify `src/components/ui/*` unless there is a clear setup or compatibility issue.

## Architecture And Code

- Use Server Components by default. Use Client Components only for required interactivity such as search/filter state, forms, dialogs, sheets, tabs, or router hooks.
- Keep client boundaries small and avoid putting `"use client"` on large page or layout trees.
- Keep TypeScript strict. Avoid `any`; use explicit types, unions for roles/statuses, and `unknown` with validation when needed.
- Keep components small, reusable, semantic, and domain-oriented. Put feature-specific UI under `src/features/*` and shared UI under `src/components/*`.
- Prefer existing helpers, constants, dummy data, formatters, and components before adding new abstractions.
- Do not add dependencies unless they are necessary and appropriate for the current phase.
- Do not expose secrets. Never put server keys in client code or `NEXT_PUBLIC_*`. Do not touch `.env.local` unless explicitly asked.

## UI And UX

- Follow the Apple-like direction from the UI/UX docs: clean, calm, premium, spacious, modern, accessible, and not noisy.
- Use dominant white/off-white surfaces, deep navy text, teal accents, subtle borders, minimal shadows, and refined typography.
- Brand colors: `#167163`, `#114955`, `#0C2949`.
- Use Inter globally. Keep headings tight and body text readable.
- Use the `PageContainer` spacing rule for page-level layout: mobile around 20px, tablet around 32px, desktop 100px.
- Use Lucide React icons where useful. Use shadcn/ui components as the base for buttons, badges, sheets, dialogs, inputs, selects, cards, tabs, tables, and separators.
- Use semantic HTML, accessible labels, responsive layouts, clear empty/loading/error states, and natural formal Indonesian copy.
- Avoid exaggerated claims and generic marketing language.

## Data, Roles, And Security

- Respect the three role model: UMKM, kreator, admin. Guests may browse public marketplace pages only.
- Orders are the core entity and connect UMKM, kreator, paket jasa, brief campaign, pembayaran, invoice, hasil konten, revisi, review, and complaints.
- Dummy data is acceptable before integration, but it must be realistic, internally consistent, and clearly not claimed as real traction.
- Private files such as brief assets, hasil konten, revisi assets, invoices, and complaint files must not be public by default when storage is implemented.
- Server-side logic is required for sensitive operations: calculating payment totals, creating payments, handling webhooks, changing payment/status pesanan, uploads, role guards, and admin actions.

## Routes And Scope

- Use App Router route groups consistently: `(public)`, `(auth)`, `(umkm)`, `(creator)`, `(admin)`.
- Public routes include `/`, `/katalog`, `/kreator/[creatorId]`, `/layanan/[serviceId]`, `/cara-kerja`, and `/bantuan`.
- Auth routes include `/login`, `/register`, `/forgot-password`, and `/callback`.
- UMKM, creator, admin, API, payment, Supabase, cart, checkout, and dashboard work must only be changed when the user asks for that scope.

## Verification

- After code changes, run or expect `npm run check` (`typecheck`, `lint`, and `build`).
- For UI work, also verify responsiveness, terminology, links, empty states, and that no physical-product terms were introduced.
- Keep existing shadcn/ui setup intact and avoid unrelated refactors.
