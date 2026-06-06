# Ruang Usaha Kita — Coding Standards

## 1. Tujuan Dokumen

Dokumen ini menjelaskan standar coding untuk project Ruang Usaha Kita. Standar ini dibuat agar proses pengembangan tidak hanya cepat, tetapi juga rapi, aman, efisien, mudah dirawat, SEO-friendly, dan siap dikembangkan menjadi sistem marketplace jasa digital yang lebih serius.

Ruang Usaha Kita adalah marketplace jasa digital yang menghubungkan UMKM dengan content creator atau marketer untuk kebutuhan promosi digital. Karena sistem ini memiliki banyak area seperti katalog, cart, checkout, payment, order, revisi, review, dashboard creator, dashboard UMKM, dashboard admin, dan integrasi Supabase, maka struktur kode harus dirancang dengan disiplin sejak awal.

Standar ini menjadi acuan untuk:

1. Menulis kode React/Next.js.
2. Membuat komponen UI.
3. Mengatur folder dan file.
4. Menentukan kapan memakai Server Component dan Client Component.
5. Menulis TypeScript yang aman.
6. Menulis styling Tailwind yang konsisten.
7. Menjaga SEO dan semantic HTML.
8. Menjaga performa.
9. Menjaga keamanan.
10. Menyiapkan integrasi Supabase dan payment gateway.
11. Menjaga project agar tidak berantakan saat vibe coding.

## 2. Prinsip Utama

### 2.1 Clarity Over Cleverness

Kode harus jelas lebih dulu, baru pintar. Jangan membuat kode terlalu “tricky” hanya agar terlihat canggih.

Kode yang baik:

- mudah dibaca
- mudah dilacak
- mudah diubah
- mudah dites
- tidak menyembunyikan logic penting
- tidak membuat developer lain menebak-nebak

Hindari:

- one-liner berlebihan
- abstraction terlalu dini
- generic function yang tidak jelas
- custom hook yang tidak perlu
- library tambahan untuk masalah kecil

### 2.2 Server First, Client When Needed

Dalam Next.js App Router, gunakan Server Component sebagai default. Client Component hanya dipakai jika benar-benar butuh interaktivitas.

Gunakan Server Component untuk:

- layout
- page yang hanya render data
- data fetching
- detail page
- static section
- SEO metadata
- page composition
- dashboard data yang dibaca dari server

Gunakan Client Component untuk:

- form interaktif
- modal
- dropdown yang butuh state
- cart interaction
- filter katalog client-side
- tab interaktif
- sheet mobile menu
- upload progress
- payment button dengan browser SDK
- local state seperti Zustand
- komponen yang memakai `useState`, `useEffect`, `usePathname`, `useRouter`

Aturan penting:

Jangan menaruh `"use client"` di semua file. Itu membuat bundle JavaScript membesar dan mengurangi manfaat Server Component.

### 2.3 Type-Safe by Default

Semua data penting harus punya type.

Wajib type untuk:

- user role
- order status
- payment status
- service package
- creator profile
- UMKM profile
- cart item
- checkout brief
- payment response
- API response
- dashboard metric

Hindari `any`.

Boleh memakai `unknown` jika data memang belum diketahui, lalu validasi dengan Zod atau type guard.

### 2.4 Domain-Oriented Structure

Kode harus dipisah berdasarkan domain bisnis, bukan hanya berdasarkan jenis file.

Contoh domain:

- auth
- catalog
- creators
- services
- cart
- checkout
- orders
- payments
- briefs
- submissions
- revisions
- reviews
- admin
- reports

Tujuannya agar fitur tidak saling bercampur.

### 2.5 UI Reusable, Logic Isolated

Komponen UI tidak boleh terlalu banyak membawa logic bisnis.

Contoh:

`CreatorCard` cukup menerima data dan menampilkan.

Logic fetch data kreator sebaiknya berada di:

- query function
- server component
- feature-level data function

Bukan di dalam card.

### 2.6 Security First

Semua logic sensitif harus berada di server.

Wajib server-side:

- create order
- calculate total payment
- create payment transaction
- update payment status
- webhook
- upload private file
- update order status
- admin action
- role guard
- access check

Tidak boleh di client:

- service role key
- payment server key
- update payment status final
- update order status tanpa validasi
- logic ownership sensitif

### 2.7 SEO and Semantics First

Public page harus SEO-ready sejak awal.

Wajib:

- title metadata
- description metadata
- canonical URL jika perlu
- Open Graph image
- semantic HTML
- heading hierarchy
- sitemap
- robots
- alt text untuk gambar
- struktur URL jelas
- copywriting natural

### 2.8 Performance Is a Feature

Performa bukan bonus. Untuk marketplace, user harus cepat melihat katalog, detail layanan, dan checkout.

Prinsip:

- kurangi Client Component
- jangan import library berat sembarangan
- gunakan Server Component untuk data
- image harus dioptimasi
- gunakan loading state
- gunakan skeleton
- hindari re-render tidak perlu
- hindari fetching berulang
- gunakan pagination atau limit data
- jangan render semua data besar sekaligus

### 2.9 Consistency Beats Personal Style

Semua developer harus mengikuti standar yang sama.

Konsisten dalam:

- naming
- file structure
- component pattern
- import order
- error handling
- status label
- currency format
- UI spacing
- color token
- copywriting
- route naming

## 3. Tech Stack Standard

Stack utama:

| Area | Teknologi |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript |
| UI Library | React |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Radix UI |
| Icons | Lucide React |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Payment | Dummy Payment → Midtrans Sandbox → Production |
| Hosting | Vercel |
| State Client | Zustand |
| Forms | React Hook Form |
| Validation | Zod |
| Testing | Vitest, React Testing Library, Playwright |
| Formatting | Prettier |
| Linting | ESLint |

## 4. Project Structure Standard

Struktur utama:

```txt
src
├── app
│   ├── (public)
│   ├── (auth)
│   ├── (umkm)
│   ├── (creator)
│   ├── (admin)
│   └── api
├── components
│   ├── ui
│   ├── layout
│   ├── common
│   ├── cards
│   ├── forms
│   ├── tables
│   └── dashboard
├── features
│   ├── auth
│   ├── catalog
│   ├── creators
│   ├── services
│   ├── cart
│   ├── checkout
│   ├── orders
│   ├── payments
│   ├── briefs
│   ├── submissions
│   ├── revisions
│   ├── reviews
│   ├── notifications
│   ├── reports
│   └── admin
├── hooks
├── stores
├── types
└── lib
    ├── supabase
    ├── auth
    ├── payment
    ├── constants
    ├── formatters
    ├── helpers
    ├── security
    ├── storage
    ├── analytics
    └── email
````

## 5. Folder Responsibility

### 5.1 `src/app`

Berisi route Next.js.

Aturan:

* hanya untuk page, layout, loading, error, not-found, route handler
* jangan taruh komponen besar langsung di page jika bisa dipisah
* page bertugas menyusun komponen dan mengambil data server
* route group dipakai untuk memisahkan area role

Contoh:

```txt
src/app/(public)/katalog/page.tsx
src/app/(umkm)/umkm/orders/page.tsx
src/app/api/payments/create/route.ts
```

### 5.2 `src/components/ui`

Berisi komponen dari shadcn/ui.

Aturan:

* jangan edit sembarangan
* jika perlu custom, buat wrapper di folder lain
* jangan masukkan logic bisnis ke `ui`
* `ui` harus tetap generic

Contoh:

```txt
src/components/ui/button.tsx
src/components/ui/card.tsx
src/components/ui/dialog.tsx
```

### 5.3 `src/components/layout`

Berisi komponen layout global.

Contoh:

```txt
site-header.tsx
site-footer.tsx
dashboard-sidebar.tsx
dashboard-topbar.tsx
page-container.tsx
dashboard-shell.tsx
```

### 5.4 `src/components/common`

Berisi komponen kecil yang reusable lintas fitur.

Contoh:

```txt
app-logo.tsx
status-badge.tsx
price-text.tsx
empty-state.tsx
loading-state.tsx
error-state.tsx
section-heading.tsx
```

### 5.5 `src/components/cards`

Berisi kartu reusable.

Contoh:

```txt
creator-card.tsx
service-card.tsx
order-card.tsx
metric-card.tsx
portfolio-card.tsx
```

### 5.6 `src/features`

Berisi fitur berdasarkan domain bisnis.

Struktur feature yang disarankan:

```txt
src/features/orders
├── components
├── actions
├── queries
├── schemas
├── utils
├── types.ts
└── constants.ts
```

Gunakan struktur ini jika fitur mulai besar.

### 5.7 `src/lib`

Berisi utility dan integrasi.

Aturan:

* `src/lib/utils.ts` tetap untuk utility bawaan shadcn seperti `cn`
* jangan buat folder `src/lib/utils` karena bentrok konsep dengan `utils.ts`
* helper besar dipisah ke folder spesifik

Contoh:

```txt
src/lib/formatters/currency.ts
src/lib/payment/fees.ts
src/lib/storage/validate-file.ts
src/lib/auth/guards.ts
```

### 5.8 `src/types`

Berisi type global.

Contoh:

```txt
app.ts
order.ts
service.ts
supabase.ts
```

Jika type hanya dipakai dalam satu fitur, simpan di feature folder.

### 5.9 `src/stores`

Berisi Zustand store.

Contoh:

```txt
cart-store.ts
ui-store.ts
```

Jangan gunakan store global untuk semua hal. Store hanya untuk state client yang memang perlu lintas komponen.

## 6. Naming Convention

### 6.1 File Name

Gunakan kebab-case.

Benar:

```txt
creator-card.tsx
payment-summary-card.tsx
order-status-timeline.tsx
campaign-brief-form.tsx
```

Salah:

```txt
CreatorCard.tsx
paymentSummaryCard.tsx
order_status_timeline.tsx
```

### 6.2 Component Name

Gunakan PascalCase.

```tsx
export function CreatorCard() {}
export function PaymentSummaryCard() {}
export function OrderStatusTimeline() {}
```

### 6.3 Function Name

Gunakan camelCase.

```ts
calculatePlatformFee()
formatCurrency()
getOrderStatusLabel()
createPaymentPayload()
```

### 6.4 Constant Name

Gunakan UPPER_SNAKE_CASE untuk constant global.

```ts
export const ORDER_STATUS = {}
export const PAYMENT_STATUS = {}
export const USER_ROLES = {}
```

Gunakan camelCase untuk object kecil yang bukan global constant.

```ts
const navigationItems = []
const creatorStats = []
```

### 6.5 Type Name

Gunakan PascalCase.

```ts
type UserRole = "admin" | "umkm" | "creator"
type OrderStatus = "awaiting_payment" | "completed"
type ServicePackage = {}
```

### 6.6 Route Segment

Gunakan kebab-case untuk route public.

```txt
/cara-kerja
/katalog
```

Gunakan English hanya jika sudah menjadi istilah teknis umum atau lebih ringkas.

Route role tetap:

```txt
/umkm/dashboard
/creator/dashboard
/admin/dashboard
```

## 7. Import Standard

Gunakan alias `@/*`.

Benar:

```ts
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/formatters/currency"
import type { OrderStatus } from "@/types/app"
```

Hindari import relatif terlalu panjang:

```ts
import { Button } from "../../../../components/ui/button"
```

### 7.1 Import Order

Urutan import:

1. React/Next
2. Third-party library
3. UI components
4. Internal components
5. Lib/utils
6. Types

Contoh:

```tsx
import Link from "next/link"

import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import { CreatorCard } from "@/components/cards/creator-card"
import { formatCurrency } from "@/lib/formatters/currency"

import type { ServicePackage } from "@/types/service"
```

## 8. TypeScript Standard

### 8.1 No `any`

Hindari:

```ts
function handleData(data: any) {}
```

Gunakan:

```ts
function handleData(data: unknown) {
  // validate first
}
```

atau type yang jelas:

```ts
function handleData(data: ServicePackage) {}
```

### 8.2 Use Type for Object Shape

Gunakan `type` untuk data shape.

```ts
export type CreatorProfile = {
  id: string
  displayName: string
  niche: string
  rating: number
}
```

Interface boleh dipakai untuk object yang memang akan di-extend, tetapi default gunakan `type`.

### 8.3 Strict Null Handling

Jangan anggap data selalu ada.

Buruk:

```tsx
creator.avatarUrl.toString()
```

Baik:

```tsx
creator.avatarUrl ? (
  <img src={creator.avatarUrl} alt={creator.displayName} />
) : (
  <AvatarFallback>{creator.displayName[0]}</AvatarFallback>
)
```

### 8.4 Use Union Types for Status

Jangan pakai string bebas untuk status.

Buruk:

```ts
status: string
```

Baik:

```ts
type OrderStatus =
  | "awaiting_payment"
  | "paid"
  | "in_progress"
  | "submitted"
  | "completed"
```

### 8.5 API Response Type

Gunakan response type yang konsisten.

```ts
export type ApiSuccess<T> = {
  ok: true
  data: T
  message?: string
}

export type ApiError = {
  ok: false
  error: string
  code?: string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError
```

## 9. React and Next.js Standard

### 9.1 Default to Server Component

Page default tidak perlu `"use client"`.

```tsx
export default async function CatalogPage() {
  const creators = await getFeaturedCreators()

  return <CatalogView creators={creators} />
}
```

### 9.2 Client Component Only for Interaction

Gunakan `"use client"` hanya jika perlu.

Contoh yang benar:

```tsx
"use client"

import { useState } from "react"

export function CatalogFilter() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  return <div>{/* interactive filter */}</div>
}
```

### 9.3 Keep Client Boundary Small

Jangan membuat seluruh page client hanya karena satu tombol butuh state.

Buruk:

```tsx
"use client"

export default function CatalogPage() {
  // semua page jadi client
}
```

Lebih baik:

```tsx
export default function CatalogPage() {
  return (
    <>
      <CatalogHero />
      <CatalogFilterClient />
      <CreatorGrid />
    </>
  )
}
```

### 9.4 Avoid Unnecessary `useEffect`

Jangan memakai `useEffect` untuk data yang bisa diambil server.

Buruk:

```tsx
useEffect(() => {
  fetch("/api/creators")
}, [])
```

Lebih baik:

```tsx
const creators = await getCreators()
```

Gunakan `useEffect` untuk:

* browser API
* event listener
* analytics client event
* local storage
* third-party client SDK
* payment popup
* upload progress

### 9.5 Page Responsibility

Page harus ringkas.

Buruk:

```tsx
export default function Page() {
  // 500 baris JSX
}
```

Baik:

```tsx
export default function Page() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <FeaturedCreatorsSection />
      <HowItWorksSection />
      <FinalCtaSection />
    </>
  )
}
```

## 10. Component Standard

### 10.1 Component Anatomy

Struktur komponen:

```tsx
type CreatorCardProps = {
  name: string
  niche: string
  rating: number
  startingPrice: number
}

export function CreatorCard({
  name,
  niche,
  rating,
  startingPrice,
}: CreatorCardProps) {
  return (
    <article>
      {/* content */}
    </article>
  )
}
```

### 10.2 Props Should Be Explicit

Jangan menerima object besar jika hanya butuh sebagian field.

Boleh jika komponennya memang domain-specific.

Baik:

```tsx
type PriceTextProps = {
  value: number
}
```

Untuk card domain:

```tsx
type CreatorCardProps = {
  creator: CreatorSummary
}
```

### 10.3 Avoid Huge Components

Jika komponen lebih dari 150–200 baris, evaluasi ulang.

Pecah menjadi:

* header
* content
* actions
* empty state
* table
* form section

### 10.4 Semantic Wrapper

Gunakan semantic HTML.

Creator card:

```tsx
<article>
  <h3>{creator.name}</h3>
</article>
```

Section:

```tsx
<section aria-labelledby="featured-creators-title">
  <h2 id="featured-creators-title">Kreator Unggulan</h2>
</section>
```

Navigation:

```tsx
<nav aria-label="Navigasi utama">
```

Footer:

```tsx
<footer>
```

## 11. UI Styling Standard

### 11.1 Tailwind First

Gunakan Tailwind utility classes untuk styling.

Namun, jangan membuat class terlalu liar.

Buruk:

```tsx
<div className="mt-[37px] px-[19px] text-[17.3px]">
```

Baik:

```tsx
<div className="mt-10 px-6 text-base">
```

Custom arbitrary value hanya jika benar-benar perlu.

### 11.2 Design Tokens

Warna brand harus berasal dari token, bukan random hex di JSX.

Gunakan token:

```css
--brand-navy-950: #0c2949;
--brand-teal-900: #114955;
--brand-teal-600: #167163;
```

Hindari:

```tsx
<div className="bg-[#167163]">
```

Kecuali token belum tersedia dan sedang tahap awal.

### 11.3 Use `cn()`

Gunakan `cn()` dari `src/lib/utils.ts` untuk conditional class.

```tsx
import { cn } from "@/lib/utils"

export function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs",
        active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
      )}
    />
  )
}
```

### 11.4 Apple-like Styling Rules

Gunakan:

* whitespace besar
* typography kuat
* border halus
* shadow minimal
* background putih/off-white
* radius lembut
* warna aksen sedikit
* animasi halus

Hindari:

* gradient ramai
* warna terlalu banyak
* shadow tebal
* card terlalu padat
* animasi berlebihan
* font terlalu banyak
* layout terlalu penuh

## 12. Typography Standard

Font global:

```txt
Inter family
```

Prinsip:

* heading besar dengan tracking rapat
* line-height agak compact
* body tetap nyaman dibaca
* jangan semua teks kecil
* jangan terlalu banyak font weight

Contoh class:

```tsx
<h1 className="text-5xl font-semibold tracking-[-0.06em] leading-[0.98]">
```

Body:

```tsx
<p className="text-base leading-[1.45] tracking-[-0.012em] text-muted-foreground">
```

Section title:

```tsx
<h2 className="text-3xl font-semibold tracking-[-0.045em] leading-tight">
```

## 13. Color Standard

Warna utama:

```txt
#167163
#114955
#0C2949
```

Gunakan sebagai:

* navy untuk brand kuat
* teal untuk aksen
* putih/off-white untuk background
* hitam/ink untuk teks
* gray untuk secondary text

Hindari memakai warna random seperti:

* merah cerah tanpa konteks
* kuning neon
* ungu random
* gradient pelangi
* warna badge yang terlalu ramai

Semantic color boleh untuk status:

* success
* warning
* danger
* info

Tetapi tetap halus.

## 14. Semantic HTML Standard

Public page harus semantic.

### 14.1 Homepage

Struktur:

```tsx
<main>
  <section aria-labelledby="hero-title">
    <h1 id="hero-title">...</h1>
  </section>

  <section aria-labelledby="categories-title">
    <h2 id="categories-title">...</h2>
  </section>
</main>
```

### 14.2 Katalog

Gunakan:

```tsx
<main>
  <header>
    <h1>Katalog Kreator</h1>
  </header>

  <aside aria-label="Filter katalog">
  </aside>

  <section aria-label="Daftar kreator">
  </section>
</main>
```

### 14.3 Card

Gunakan `article` untuk item yang berdiri sendiri.

```tsx
<article aria-labelledby={`creator-${creator.id}`}>
  <h3 id={`creator-${creator.id}`}>{creator.name}</h3>
</article>
```

### 14.4 Dashboard

Gunakan heading jelas.

```tsx
<main>
  <header>
    <h1>Dashboard UMKM</h1>
  </header>
</main>
```

## 15. SEO Standard

SEO difokuskan pada public pages.

Halaman yang perlu SEO serius:

* homepage
* katalog
* detail kreator
* detail layanan
* cara kerja
* bantuan

Halaman dashboard tidak perlu SEO dan sebaiknya tidak diindex.

### 15.1 Metadata

Setiap public page wajib punya:

* title
* description
* openGraph
* twitter card jika perlu
* canonical jika perlu

Contoh:

```ts
export const metadata = {
  title: "Ruang Usaha Kita — Marketplace Jasa Digital untuk UMKM",
  description:
    "Temukan content creator dan marketer untuk membantu promosi digital UMKM melalui paket jasa, brief campaign, dan alur pesanan yang terarah.",
}
```

### 15.2 Dynamic Metadata

Untuk detail kreator:

```ts
export async function generateMetadata({ params }: PageProps) {
  const creator = await getCreatorById(params.creatorId)

  return {
    title: `${creator.displayName} — Kreator di Ruang Usaha Kita`,
    description: creator.bio,
  }
}
```

Untuk detail layanan:

```ts
export async function generateMetadata({ params }: PageProps) {
  const service = await getServiceById(params.serviceId)

  return {
    title: `${service.title} — Paket Jasa Digital`,
    description: service.shortDescription,
  }
}
```

### 15.3 Sitemap

Sitemap perlu mencakup:

* homepage
* katalog
* cara kerja
* bantuan
* detail kreator public
* detail layanan public

Tidak perlu memasukkan:

* dashboard
* checkout
* payment
* order detail
* admin page

### 15.4 Robots

Robots harus mengizinkan public page dan menolak area private.

Contoh konsep:

```txt
Allow: /
Disallow: /umkm/
Disallow: /creator/
Disallow: /admin/
Disallow: /api/
```

### 15.5 Structured Data

Untuk public page tahap lanjutan, bisa tambah JSON-LD.

Jenis yang relevan:

* Organization
* WebSite
* BreadcrumbList
* Service
* Review

Jangan memalsukan rating atau review. Jika masih dummy, jangan tampilkan sebagai data real untuk SEO production.

## 16. Accessibility Standard

Website harus bisa dipakai dengan baik.

Wajib:

* tombol punya label jelas
* link punya teks bermakna
* input punya label
* error form terbaca
* focus state terlihat
* kontras teks cukup
* heading berurutan
* alt text untuk gambar
* icon penting didampingi teks
* dialog bisa ditutup
* keyboard navigation dasar aman

Buruk:

```tsx
<button>
  <Search />
</button>
```

Baik:

```tsx
<button aria-label="Cari kreator">
  <Search aria-hidden="true" />
</button>
```

Jika icon hanya dekoratif:

```tsx
<Star aria-hidden="true" />
```

## 17. Form Standard

Gunakan:

* React Hook Form
* Zod
* shadcn form jika diperlukan

### 17.1 Schema First

Buat schema sebelum form.

```ts
import { z } from "zod"

export const campaignBriefSchema = z.object({
  businessName: z.string().min(2, "Nama usaha wajib diisi"),
  promotedProduct: z.string().min(2, "Produk atau jasa wajib diisi"),
  campaignGoal: z.string().min(5, "Tujuan campaign perlu dijelaskan"),
  deadline: z.string().min(1, "Deadline wajib diisi"),
})

export type CampaignBriefInput = z.infer<typeof campaignBriefSchema>
```

### 17.2 Error Message Natural

Gunakan pesan error yang jelas.

Baik:

```txt
Nama usaha wajib diisi.
Deadline campaign wajib dipilih.
Tujuan campaign perlu dijelaskan agar kreator memahami kebutuhan Anda.
```

Buruk:

```txt
Invalid input.
Field required.
Error.
```

### 17.3 Form Submit

Jangan percaya client validation saja. Server tetap wajib validasi.

Client validation untuk UX.

Server validation untuk keamanan.

## 18. State Management Standard

### 18.1 Local State

Gunakan `useState` untuk state lokal kecil.

Contoh:

* tab aktif
* modal terbuka
* filter sementara
* step checkout saat belum server

### 18.2 Zustand

Gunakan Zustand untuk state client lintas komponen.

Contoh:

* cart item count
* temporary cart
* UI drawer state
* compare/favorite dummy

Jangan gunakan Zustand untuk data yang seharusnya berasal dari database server seperti order real dan payment real.

### 18.3 Server State

Data dari database sebaiknya diambil di server atau query layer.

Contoh:

* creator list
* service detail
* order detail
* payment status
* dashboard metrics

## 19. Data Fetching Standard

### 19.1 Query Function

Buat function query terpisah.

```ts
export async function getFeaturedCreators() {
  // database query later
}
```

### 19.2 Do Not Fetch Randomly in Components

Jangan setiap komponen kecil melakukan fetch sendiri tanpa alasan.

Buruk:

```tsx
function CreatorCard() {
  const creator = await fetchCreator()
}
```

Baik:

```tsx
function CreatorCard({ creator }: CreatorCardProps) {
  return <article>{creator.name}</article>
}
```

### 19.3 Server-Only for Sensitive Query

Query yang memakai service role key harus berada di server only.

Jangan dipanggil dari client.

## 20. API Route Standard

Route handler harus:

1. Validasi method.
2. Validasi auth.
3. Validasi role.
4. Validasi ownership.
5. Validasi input dengan Zod.
6. Jalankan logic server.
7. Return response konsisten.
8. Jangan bocorkan error internal.
9. Log error penting.
10. Jangan percaya data client.

Contoh response:

```ts
return Response.json({
  ok: true,
  data: result,
})
```

Error:

```ts
return Response.json(
  {
    ok: false,
    error: "Anda tidak memiliki akses ke data ini.",
  },
  { status: 403 }
)
```

## 21. Payment Coding Standard

Payment harus sangat disiplin.

### 21.1 Server Calculates Total

Tidak boleh:

```ts
const total = body.total
```

Harus:

```ts
const total = calculateOrderTotalFromDatabase(order)
```

### 21.2 Payment Status Server Only

Tidak boleh client langsung update:

```ts
paymentStatus: "paid"
```

Harus melalui:

* webhook
* server route
* admin verified action

### 21.3 Midtrans Key

`MIDTRANS_SERVER_KEY` hanya server.

`NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` hanya jika Snap client butuh.

### 21.4 Webhook

Webhook harus:

* validate signature
* validate amount
* validate order id
* idempotent
* update payment
* update order
* write activity log

## 22. Supabase Standard

### 22.1 Client Separation

Gunakan file terpisah:

```txt
src/lib/supabase/client.ts
src/lib/supabase/server.ts
src/lib/supabase/admin.ts
```

### 22.2 Browser Client

Dipakai untuk operasi aman dari browser dengan RLS.

### 22.3 Server Client

Dipakai untuk server component, route handler, server action.

### 22.4 Admin Client

Dipakai hanya di server untuk aksi service role.

Tidak boleh import admin client di Client Component.

### 22.5 RLS First

Sebelum data real:

* enable RLS
* policy per role
* test negative access
* jangan mengandalkan frontend

## 23. Storage Coding Standard

Upload harus melalui validasi.

Wajib cek:

* login
* role
* ownership
* bucket
* file type
* file size
* extension
* context order/brief/submission

Jangan membuat semua bucket public.

File private harus pakai:

* signed URL
* server-mediated access
* RLS policy

## 24. Error Handling Standard

### 24.1 User-Facing Error

Pesan ke user harus jelas.

Baik:

```txt
Pembayaran belum berhasil. Silakan cek kembali metode pembayaran Anda.
```

Buruk:

```txt
Something went wrong.
```

### 24.2 Developer Error

Log teknis boleh detail di server, tetapi jangan bocorkan ke user.

Jangan tampilkan:

* stack trace
* SQL error mentah
* API key
* raw webhook secret
* internal provider response

### 24.3 Error Boundary

Gunakan `error.tsx` untuk route penting.

Route yang butuh error boundary:

* catalog
* checkout
* payment
* order detail
* admin dashboard

## 25. Loading and Empty State Standard

Setiap halaman data harus punya:

* loading state
* empty state
* error state

Contoh empty state:

```txt
Belum ada pesanan.
Pesanan yang Anda buat akan muncul di sini.
```

Jangan:

```txt
No data.
```

## 26. Status Standard

Status harus konsisten.

### 26.1 Order Status

Gunakan constant:

```ts
export const ORDER_STATUS = {
  AWAITING_PAYMENT: "awaiting_payment",
  PAID: "paid",
  IN_PROGRESS: "in_progress",
  SUBMITTED: "submitted",
  REVISION_REQUESTED: "revision_requested",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  REFUNDED: "refunded",
} as const
```

### 26.2 Payment Status

```ts
export const PAYMENT_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  EXPIRED: "expired",
  REFUNDED: "refunded",
} as const
```

### 26.3 Status Label

Label harus bahasa Indonesia natural:

* Menunggu Pembayaran
* Dibayar
* Konten Diproduksi
* Hasil Dikirim
* Revisi Diminta
* Selesai
* Dibatalkan
* Refund

## 27. Currency and Date Standard

### 27.1 Currency

Gunakan formatter global.

```ts
export function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value)
}
```

Jangan format manual:

```ts
"Rp" + value
```

### 27.2 Date

Gunakan formatter global.

```ts
export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(new Date(date))
}
```

## 28. SEO URL Standard

URL harus bersih.

Baik:

```txt
/katalog
/kreator/raka-visual
/layanan/video-reels-standard
/cara-kerja
```

Kurang baik:

```txt
/product?id=123
/seller_detail.php?id=9
/page1
```

Untuk MVP, dynamic ID masih boleh:

```txt
/kreator/[creatorId]
/layanan/[serviceId]
```

Tahap lanjutan lebih baik pakai slug.

## 29. Copywriting Standard

Gaya bahasa UI:

* formal natural
* jelas
* tidak berlebihan
* tidak terlalu korporat
* mudah dipahami UMKM
* tidak generik AI

Gunakan:

```txt
Ruang Usaha Kita membantu UMKM mencari kreator, membuat brief promosi, dan memantau proses pembuatan konten secara lebih mudah dan terarah.
```

Hindari:

```txt
Platform revolusioner yang mendisrupsi ekosistem digital masa depan.
```

## 30. Terminology Standard

Gunakan:

* UMKM
* kreator
* content creator
* marketer
* paket jasa
* layanan
* brief campaign
* hasil konten
* revisi
* status pesanan
* pembayaran
* invoice
* portofolio
* rating
* review
* dashboard

Hindari:

* stok
* gudang
* ongkir
* kurir
* resi
* alamat pengiriman
* packing
* shipping
* barang dikirim
* COD barang

## 31. Performance Standard

### 31.1 Client JS Minimal

Jangan membuat semua komponen client.

### 31.2 Lazy Load Heavy Components

Komponen berat seperti chart, payment SDK, atau rich editor dimuat hanya saat dibutuhkan.

### 31.3 Image

Gunakan:

* ukuran gambar sesuai kebutuhan
* alt text
* placeholder jika perlu
* hindari image terlalu besar di card

### 31.4 List Rendering

Untuk katalog:

* gunakan pagination atau limit
* jangan render ratusan item sekaligus
* gunakan skeleton saat loading

### 31.5 Avoid Unnecessary Dependencies

Jangan install library untuk hal yang bisa diselesaikan sederhana.

Contoh:

* format currency tidak perlu library tambahan
* date sederhana bisa pakai Intl
* class merge cukup `cn`

## 32. Security Standard

Wajib:

1. Jangan commit `.env.local`.
2. Jangan hardcode secret.
3. Jangan pakai service role di client.
4. Jangan expose payment server key.
5. Jangan percaya total dari client.
6. Jangan izinkan update payment dari client.
7. Jangan jadikan file private public.
8. Validasi semua input server-side.
9. Gunakan RLS untuk data sensitif.
10. Gunakan role guard untuk dashboard.
11. Catat admin action penting.
12. Jangan tampilkan error internal ke user.

## 33. Testing Standard

Minimal sebelum commit besar:

```bash
npm run typecheck
npm run lint
npm run build
```

Jika test sudah ada:

```bash
npm run test
npm run test:e2e
```

Test wajib untuk:

* fee calculation
* status mapping
* permission helper
* file validation
* payment logic
* order transition
* component penting
* route utama

## 34. Commit Standard

Gunakan Conventional Commits.

Format:

```txt
type: message
```

Contoh:

```txt
feat: add public layout foundation
fix: correct payment status label
docs: add coding standards
refactor: split order timeline component
chore: update dependencies
style: adjust homepage spacing
test: add payment fee tests
```

Tipe commit:

| Type     | Fungsi                             |
| -------- | ---------------------------------- |
| feat     | fitur baru                         |
| fix      | perbaikan bug                      |
| docs     | dokumentasi                        |
| refactor | ubah struktur tanpa mengubah fitur |
| style    | perubahan style/format             |
| test     | test                               |
| chore    | maintenance                        |

## 35. Branch Standard

Gunakan branch:

```txt
main
dev
feature/*
fix/*
docs/*
```

Contoh:

```txt
feature/public-layout
feature/catalog-page
feature/payment-dummy
fix/mobile-navbar
docs/coding-standards
```

Jangan coding langsung di `main` untuk fitur besar.

## 36. Code Review Checklist

Sebelum merge, cek:

1. Apakah build aman?
2. Apakah TypeScript aman?
3. Apakah route tidak 404?
4. Apakah komponen terlalu besar?
5. Apakah ada `any`?
6. Apakah ada `"use client"` tidak perlu?
7. Apakah ada secret di client?
8. Apakah payment logic aman?
9. Apakah status order benar?
10. Apakah UI memakai istilah jasa digital?
11. Apakah SEO metadata ada untuk public page?
12. Apakah responsive aman?
13. Apakah error/empty/loading state ada?
14. Apakah file ditempatkan di folder yang benar?
15. Apakah naming konsisten?

## 37. AI/Vibe Coding Rules

Saat memakai Codex atau AI coding:

### 37.1 Selalu Beri Konteks

Prompt harus menyebut:

* project Ruang Usaha Kita
* marketplace jasa digital
* bukan toko barang fisik
* stack yang dipakai
* folder target
* file yang boleh diubah
* file yang tidak boleh diubah
* acceptance criteria

### 37.2 Jangan Minta AI Mengubah Semua Sekaligus

Buruk:

```txt
Buat semua website sampai selesai.
```

Baik:

```txt
Buat public layout foundation: site-header, site-footer, page-container, dan update public layout. Jangan ubah dashboard, payment, atau Supabase.
```

### 37.3 Batasi Scope

Setiap prompt harus punya batas:

* satu fitur
* satu folder
* satu flow
* satu jenis komponen

### 37.4 Selalu Minta Build Safety

Prompt harus menyertakan:

```txt
Ensure TypeScript compiles and imports use @/* alias.
Do not modify shadcn/ui files unless necessary.
Do not create src/lib/utils folder because src/lib/utils.ts already exists.
```

### 37.5 Review Output AI

Jangan langsung percaya hasil AI.

Cek:

* file yang berubah
* import
* route
* TypeScript
* istilah
* client/server boundary
* security
* build

## 38. Anti-Patterns yang Harus Dihindari

### 38.1 Semua Jadi Client Component

Masalah:

* bundle besar
* performa turun
* SEO kurang optimal

### 38.2 Semua Logic di Page

Masalah:

* page sulit dirawat
* sulit test
* sulit refactor

### 38.3 UI dan Business Logic Campur

Masalah:

* komponen card jadi terlalu berat
* logic susah dipakai ulang

### 38.4 Magic String Status

Masalah:

* rawan typo
* status tidak konsisten

Gunakan constants.

### 38.5 Hardcoded Currency

Masalah:

* format tidak konsisten

Gunakan formatter.

### 38.6 Secret di Client

Fatal.

### 38.7 Payment Dummy Dianggap Real

Fatal secara bisnis.

### 38.8 Dashboard Admin Terbuka Tanpa Guard

Fatal saat data real.

### 38.9 Istilah Barang Fisik

Salah konsep untuk project ini.

### 38.10 Overengineering

Contoh:

* membuat microservice sebelum MVP
* membuat chat real-time sebelum order flow
* membuat AI matching sebelum data ada
* membuat escrow production sebelum legal jelas

## 39. Minimum Quality Bar

Satu fitur minimal harus memenuhi:

1. Kode TypeScript valid.
2. Route bisa dibuka.
3. UI responsive dasar.
4. Copywriting sesuai konteks.
5. Tidak ada istilah barang fisik.
6. Komponen tidak terlalu besar.
7. Import rapi.
8. Tidak ada secret.
9. Loading/empty/error state jika perlu.
10. Build tidak rusak.

## 40. Definition of Professional Code

Kode dianggap profesional jika:

1. Mudah dibaca.
2. Mudah dirawat.
3. Tidak overcomplicated.
4. Type-safe.
5. Server/client boundary jelas.
6. Secure by default.
7. SEO-aware.
8. Accessible.
9. Performant.
10. Konsisten dengan design system.
11. Konsisten dengan domain bisnis.
12. Memiliki struktur folder jelas.
13. Memiliki error handling.
14. Bisa dites.
15. Tidak bergantung pada trik.
16. Tidak mencampur konsep e-commerce barang fisik.
17. Siap dikembangkan bertahap.

## 41. Implementation Priority

Urutan implementasi coding:

1. Global styles dan design tokens.
2. Layout public.
3. Layout auth.
4. Dashboard shell.
5. Common components.
6. Homepage.
7. Katalog.
8. Detail kreator.
9. Detail layanan.
10. Cart.
11. Checkout brief.
12. Payment dummy.
13. Order detail.
14. Dashboard UMKM.
15. Dashboard creator.
16. Dashboard admin.
17. Supabase Auth.
18. Database schema.
19. RLS.
20. Payment sandbox.
21. Storage.
22. Testing.
23. Deployment preview.
24. Production readiness.

## 42. Kesimpulan

Standar coding Ruang Usaha Kita harus mengutamakan kualitas nyata, bukan sekadar tampilan bagus. Kode yang baik harus rapi, aman, efisien, semantic, SEO-ready, dan sesuai konteks marketplace jasa digital.

Standar ini menjadi aturan utama sebelum memulai coding besar dengan Codex atau AI lain. Setiap fitur harus mengikuti prinsip server-first, type-safe, secure, semantic, reusable, dan tidak keluar dari konsep utama Ruang Usaha Kita.

Target akhirnya bukan hanya website yang terlihat bagus, tetapi sistem e-commerce jasa digital yang struktur kodenya kuat, mudah dikembangkan, dan tidak rapuh saat fitur bertambah.