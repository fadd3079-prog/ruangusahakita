# Database Analysis – Ruang Usaha Kita

## 1. Executive Summary

**Current Architecture:**  
The project uses **Supabase (PostgreSQL + Auth)** as the database backend, with a normalized relational model designed for a two-sided marketplace connecting UMKM (small businesses) and Kreators (content creators).

**Data Maturity:**  
- **Backend:** Production-ready database schema with RLS policies, triggers, and constraints (migration date: 2026-04-13).
- **Frontend:** Currently uses mock data; backend APIs are partially implemented. Frontend expects Supabase data shapes but falls back to mock data.
- **Integration:** Hybrid approach — backend services are fully database-backed; frontend services use mock data locally while APIs exist on the backend.

**Database Scope:**  
The schema models seven core entities with clear ownership hierarchies. The data model is normalized and ownership is enforced at both the schema level (foreign keys + unique constraints) and the Supabase RLS (Row Level Security) policies.

---

## 2. Files Reviewed

### **Database & Schema (Confirmed)**
- [supabase/migrations/20260413143000_backend_mvp_schema.sql](supabase/migrations/20260413143000_backend_mvp_schema.sql) – Primary source of truth for all confirmed entity structure, constraints, indexes, and RLS policies.

### **Backend Services (Backend Data Model)**
- [server/src/services/auth.service.js](server/src/services/auth.service.js) – Authentication and profile bootstrap logic; defines signup/login data flow.
- [server/src/services/profile.service.js](server/src/services/profile.service.js) – Profile retrieval and update; defines mapping functions for base, creator, and business profiles.
- [server/src/services/discovery.service.js](server/src/services/discovery.service.js) – Creator discovery queries; defines creator card and detail data shapes for the public marketplace.
- [server/src/services/favorite.service.js](server/src/services/favorite.service.js) – Favorites management; adds/removes creator favorites for logged-in users.
- [server/src/services/request.service.js](server/src/services/request.service.js) – Request (brief) creation and retrieval; defines request data mapping and relationships.

### **Backend Validation & Controllers**
- [server/src/validators/auth.validators.js](server/src/validators/auth.validators.js) – Auth payload schemas (signup/login).
- [server/src/validators/profile.validators.js](server/src/validators/profile.validators.js) – Update payload schemas for profiles.
- [server/src/controllers/request.controller.js](server/src/controllers/request.controller.js) – Request CRUD endpoints.

### **Frontend Services (Frontend Data Expectations)**
- [client/src/services/creatorService.js](client/src/services/creatorService.js) – Mock-based creator discovery (currently local; expects eventual backend integration).
- [client/src/services/favoriteService.js](client/src/services/favoriteService.js) – Mock-based favorites (local version).
- [client/src/services/portfolioService.js](client/src/services/portfolioService.js) – Mock-based portfolio items.

### **Frontend State & Constants**
- [client/src/store/authStore.js](client/src/store/authStore.js) – Auth state shape.
- [client/src/constants/roles.js](client/src/constants/roles.js) – Role definitions and options.
- [client/src/constants/filters.js](client/src/constants/filters.js) – Filter options for discovery (niche, city, platform, price, rating).

### **Frontend Mock Data (Data Shape Reference)**
- [client/src/data/mockData.js](client/src/data/mockData.js) – Mock creator, service, portfolio, review, and request shapes; reveals expected frontend data contracts.

---

## 3. Database Technology Context

| Component | Technology | Notes |
|-----------|-----------|-------|
| **Database** | PostgreSQL (Supabase) | Fully managed SQL database with built-in auth integration. |
| **Auth** | Supabase Auth (JWT) | Managed authentication; `auth.users` is the source of truth for user identity. |
| **Storage** | Supabase Storage (for media) | Only referenced in code, not explicitly modeled in current schema. |
| **RLS** | Supabase Row Level Security | Policies enforce data access at the database level (e.g., users can only see their own profiles). |
| **Frontend ORM** | Direct Supabase client (supabase-js) | Frontend makes direct calls or via backend APIs. |
| **Backend ORM** | Direct SQL via Supabase client (Node.js) | Backend uses Supabase admin client for server-side operations. |

**Ownership & Access Control:**
- Data ownership is enforced via foreign keys (e.g., `profiles.id` references `auth.users.id`).
- RLS policies prevent unauthorized access (e.g., users can only see published creator profiles or their own data).
- Triggers maintain `updated_at` timestamps automatically.

---

## 4. Database-Related Variables and Configuration

### **Environment Variables & Config**
All are in Supabase configuration; no environment variable names found in code (assumed to be in `.env`):

| Name | File | Purpose | Data Model Impact |
|------|------|---------|-------------------|
| `SUPABASE_URL` | Assumed `.env` | Supabase project URL. | Determines database endpoint. |
| `SUPABASE_ANON_KEY` | Assumed `.env` | Public JWT key for browser clients. | Used by frontend for RLS-protected queries. |
| `SUPABASE_SERVICE_ROLE_KEY` | Assumed `.env` | Server admin key for backend operations. | Used by backend for unrestricted queries. |

### **Supabase Clients**
| Name | File | Purpose | Model Role |
|------|------|---------|-----------|
| `supabase` | [client/src/lib/supabase.js](client/src/lib/supabase.js) | Frontend Supabase client (includes RLS). | Direct queries from frontend. |
| `supabaseAdmin` | [server/src/lib/supabase.js](server/src/lib/supabase.js) | Backend admin client (bypasses RLS). | Server-side restricted queries. |

### **Role Constants**
| Name | File | Values | Purpose |
|------|------|--------|---------|
| `ROLES` | [client/src/constants/roles.js](client/src/constants/roles.js) | `umkm`, `creator` | Defines the two user types in the system. Stored in `profiles.role`. |

### **Filter Constants**
| Name | File | Values | Purpose |
|------|------|--------|---------|
| `nicheOptions` | [client/src/constants/filters.js](client/src/constants/filters.js) | Kuliner, Fashion, Kecantikan, Edukasi, Lifestyle, Travel | Discovery filter values for `creator_profiles.niche`. |
| `cityOptions` | [client/src/constants/filters.js](client/src/constants/filters.js) | Jakarta, Bandung, Surabaya, Yogyakarta, Semarang, Denpasar | Discovery filter values for `creator_profiles.city`. |
| `platformOptions` | [client/src/constants/filters.js](client/src/constants/filters.js) | Instagram, TikTok, YouTube, X | Filter values for `creator_profiles.platforms` (array). |
| `priceOptions` | [client/src/constants/filters.js](client/src/constants/filters.js) | Ranges: 0-500k, 500k-1M, 1M-2M, 2M+ | Filter values for `creator_profiles.price_from`. |
| `ratingOptions` | [client/src/constants/filters.js](client/src/constants/filters.js) | 4.8+, 4.5+, 4.0+ | Discovery filter values; calculated from `reviews` aggregation. |

### **Status Constants**
| Name | File | Values | Purpose |
|------|------|--------|---------|
| `REQUEST_STATUS` | Implied from schema | draft, submitted, reviewed, accepted, in_progress, done | Values for `requests.status`. |

### **Slug Helpers**
| Name | File | Purpose |
|------|------|---------|
| `buildSlug()` | [client/src/utils/buildSlug.js](client/src/utils/buildSlug.js) | Generates URL-safe slugs for creator profiles and services on the frontend. |
| `buildUniqueSlug()` | [server/src/utils/slug.js](server/src/utils/slug.js) | Generates unique slugs for entities on the backend (appends UUID suffix if needed). |

---

## 5. Entity Inventory

### **Confirmed Entities (From SQL Migration)**

| Entity | Table Name | Purpose | Presence | Status |
|--------|-----------|---------|----------|--------|
| **User Profile** | `profiles` | Base user record linked to Supabase auth. | Confirmed in schema | Implemented |
| **Creator Profile** | `creator_profiles` | Extended profile for users with role='creator'. | Confirmed in schema | Implemented |
| **Business Profile** | `business_profiles` | Extended profile for users with role='umkm'. | Confirmed in schema | Implemented |
| **Service** | `services` | Service offering created by creators. | Confirmed in schema | Implemented |
| **Portfolio** | `portfolios` | Portfolio items (examples of past work) by creators. | Confirmed in schema | Implemented |
| **Favorite** | `favorites` | Many-to-many mapping: user likes creator. | Confirmed in schema | Implemented |
| **Request (Brief)** | `requests` | Request/brief from UMKM to creator for work. | Confirmed in schema | Implemented |
| **Review** | `reviews` | Review/rating for a creator or service. | Confirmed in schema | Implemented |

### **Implied but Not Explicitly Modeled**

| Concept | Representation | Notes |
|---------|----------------|-------|
| **Service Category** | `services.title` field only | No separate category table; categories are inferred from service title. |
| **Portfolio Category** | `portfolios.category` field | Stores category name as text (e.g., "Kuliner", "Lifestyle"). |
| **Platform Association** | `creator_profiles.platforms` array | Array of platform names, not a separate join table. |
| **Media Storage** | Not modeled | `*_url` fields reference external storage (Supabase Storage), not modeled in schema. |
| **Social Links** | `creator_profiles.social_links` JSONB | Stores key-value pairs (e.g., `{"instagram": "url", "tiktok": "url"}`). |

---

## 6. Entity Detail Analysis

### **profiles (User Base Profile)**

**Confirmed Facts:**
- **Table:** `public.profiles`
- **Primary Key:** `id` (UUID) – References `auth.users(id)` with `ON DELETE CASCADE`.
- **Role:** Discriminator field; determines which extended profile (creator_profiles or business_profiles) applies.
- **Ownership:** Owned by the logged-in auth user. RLS ensures users can only view/update their own profile.

| Field | Type | Required | Inferred Business Meaning |
|-------|------|----------|--------------------------|
| `id` | UUID (PK) | ✓ | Unique identifier; matches Supabase `auth.users.id`. |
| `role` | TEXT, CHECK ('umkm' \| 'creator') | ✓ | Determines user type and which extended profile they own. |
| `name` | TEXT | ✓ | User's display name; used across the platform. |
| `email` | TEXT | ✗ | Optional; may not always be populated at schema level. |
| `avatar_url` | TEXT | ✗ | URL to user's avatar image (Supabase Storage reference). |
| `created_at` | TIMESTAMPTZ | ✓ (auto) | Record creation timestamp. |
| `updated_at` | TIMESTAMPTZ | ✓ (auto, trigger) | Last modification timestamp; maintained by trigger. |

**Timestamps:** Auto-managed by Supabase auth and database trigger `set_profiles_updated_at`.

---

### **creator_profiles (Extended Creator Profile)**

**Confirmed Facts:**
- **Table:** `public.creator_profiles`
- **Primary Key:** `id` (UUID, generated).
- **Foreign Key:** `profile_id` (UUID) – References `profiles(id)` with `ON DELETE CASCADE`; **unique** (one creator profile per base profile).
- **Slug:** Unique, URL-safe identifier for public routes (e.g., `/creator/nadia-konten-kuliner`).
- **Published State:** `is_published` boolean controls visibility in discovery.
- **Ownership Chain:** `auth.users.id` → `profiles.id` → `creator_profiles.profile_id`.

| Field | Type | Required | Inferred Business Meaning |
|-------|------|----------|--------------------------|
| `id` | UUID (PK) | ✓ | Internal id for this creator profile. |
| `profile_id` | UUID (FK, unique) | ✓ | Links to the base profile; ensures one creator profile per user. |
| `slug` | TEXT (unique) | ✓ | URL-friendly identifier; e.g., "nadia-konten-kuliner". |
| `brand_name` | TEXT | ✓ | Creator's brand/public name (e.g., "Nadia Konten Kuliner"). |
| `city` | TEXT | ✗ | City where creator is based; used for discovery filtering. |
| `niche` | TEXT | ✗ | Creator's specialty (e.g., "Kuliner", "Fashion", "Kecantikan"). |
| `platforms` | TEXT[] | ✗ | Array of social platforms used (e.g., '{"Instagram", "TikTok"}'; default empty). |
| `short_bio` | TEXT | ✗ | Brief description for discovery cards. |
| `full_bio` | TEXT | ✗ | Longer biography for detail pages. |
| `price_from` | NUMERIC(12,2) | ✓ (default 0) | Minimum service price; used for filtering. |
| `banner_url` | TEXT | ✗ | Cover/banner image URL. |
| `portfolio_url` | TEXT | ✗ | Optional external portfolio link. |
| `social_links` | JSONB | ✓ (default {}) | Key-value map of social platform handles/URLs. |
| `is_published` | BOOLEAN | ✓ (default true) | Controls public visibility; unpublished profiles hidden from discovery. |
| `created_at` | TIMESTAMPTZ | ✓ (auto) | Record creation timestamp. |
| `updated_at` | TIMESTAMPTZ | ✓ (auto, trigger) | Last modification timestamp. |

**Indexes:**
- `creator_profiles_slug_idx` on `slug` (unique).
- `creator_profiles_niche_idx` on `niche` (for discovery filtering).
- `creator_profiles_city_idx` on `city` (for discovery filtering).
- `creator_profiles_price_from_idx` on `price_from` (for range filtering).

---

### **business_profiles (Extended UMKM Profile)**

**Confirmed Facts:**
- **Table:** `public.business_profiles`
- **Primary Key:** `id` (UUID, generated).
- **Foreign Key:** `profile_id` (UUID) – References `profiles(id)` with `ON DELETE CASCADE`; **unique** (one business profile per base profile).
- **Ownership Chain:** `auth.users.id` → `profiles.id` → `business_profiles.profile_id`.

| Field | Type | Required | Inferred Business Meaning |
|-------|------|----------|--------------------------|
| `id` | UUID (PK) | ✓ | Internal id for this business profile. |
| `profile_id` | UUID (FK, unique) | ✓ | Links to base profile; ensures one business profile per UMKM user. |
| `business_name` | TEXT | ✓ | Name of the UMKM business. |
| `category` | TEXT | ✗ | Business category (e.g., "Kuliner", "Fashion"). |
| `city` | TEXT | ✗ | City where the business is located. |
| `description` | TEXT | ✗ | Description of the business. |
| `main_product` | TEXT | ✗ | The primary product/service offered by the business. |
| `promotion_target` | TEXT | ✗ | Target audience for promotion efforts. |
| `contact` | TEXT | ✗ | Contact information (phone, email, etc.). |
| `created_at` | TIMESTAMPTZ | ✓ (auto) | Record creation timestamp. |
| `updated_at` | TIMESTAMPTZ | ✓ (auto, trigger) | Last modification timestamp. |

---

### **services (Creator Service Offerings)**

**Confirmed Facts:**
- **Table:** `public.services`
- **Primary Key:** `id` (UUID, generated).
- **Foreign Key:** `creator_profile_id` (UUID) – References `creator_profiles(id)` with `ON DELETE CASCADE`.
- **Slug:** Unique identifier for public service routes.
- **Active State:** `is_active` controls visibility in marketplace.
- **Ownership Chain:** `auth.users.id` → `profiles.id` → `creator_profiles.id` → `services.creator_profile_id`.

| Field | Type | Required | Inferred Business Meaning |
|-------|------|----------|--------------------------|
| `id` | UUID (PK) | ✓ | Unique service id. |
| `creator_profile_id` | UUID (FK) | ✓ | Creator who owns this service. |
| `slug` | TEXT (unique) | ✓ | URL-friendly identifier (e.g., "video-reels-kuliner-umkm"). |
| `title` | TEXT | ✓ | Service title/name. |
| `short_description` | TEXT | ✗ | Brief description for cards. |
| `description` | TEXT | ✗ | Full description for detail pages. |
| `price` | NUMERIC(12,2) | ✓ (default 0) | Service price. |
| `delivery_days` | INTEGER | ✓ (default 1, CHECK > 0) | Number of days for delivery/completion. |
| `revision_count` | INTEGER | ✓ (default 0, CHECK >= 0) | Number of allowed revisions. |
| `outputs` | TEXT[] | ✓ (default {}) | Array of deliverables (e.g., '{"1 video Reels 30-45 detik", "Caption sederhana"}). |
| `platforms` | TEXT[] | ✓ (default {}) | Array of platforms this service targets (e.g., '{"Instagram", "TikTok"}). |
| `is_active` | BOOLEAN | ✓ (default true) | Controls public visibility. |
| `created_at` | TIMESTAMPTZ | ✓ (auto) | Record creation timestamp. |
| `updated_at` | TIMESTAMPTZ | ✓ (auto, trigger) | Last modification timestamp. |

**Indexes:**
- `services_slug_idx` on `slug` (unique).
- `services_creator_profile_idx` on `creator_profile_id` (for filtering by creator).

---

### **portfolios (Creator Portfolio Items / Examples)**

**Confirmed Facts:**
- **Table:** `public.portfolios`
- **Primary Key:** `id` (UUID, generated).
- **Foreign Keys:**
  - `creator_profile_id` (UUID, required) – References `creator_profiles(id)` with `ON DELETE CASCADE`.
  - `service_id` (UUID, optional) – References `services(id)` with `ON DELETE SET NULL` (may not be linked to a specific service).
- **Ownership Chain:** `auth.users.id` → `profiles.id` → `creator_profiles.id` → `portfolios.creator_profile_id`.

| Field | Type | Required | Inferred Business Meaning |
|-------|------|----------|--------------------------|
| `id` | UUID (PK) | ✓ | Unique portfolio item id. |
| `creator_profile_id` | UUID (FK) | ✓ | Creator who owns this portfolio item. |
| `service_id` | UUID (FK) | ✗ | Optional link to a specific service where this portfolio item applies. |
| `title` | TEXT | ✓ | Portfolio item title (e.g., "Video Reels menu kopi literan"). |
| `thumbnail_url` | TEXT | ✗ | URL to thumbnail/preview image. |
| `category` | TEXT | ✗ | Category of the work (e.g., "Kuliner", "Lifestyle", "Kecantikan"). |
| `platform` | TEXT | ✗ | Platform where the work was published (e.g., "Instagram", "TikTok"). |
| `caption` | TEXT | ✗ | Description or caption of the work. |
| `created_at` | TIMESTAMPTZ | ✓ (auto) | Record creation timestamp. |
| `updated_at` | TIMESTAMPTZ | ✓ (auto, trigger) | Last modification timestamp. |

**Indexes:**
- `portfolios_creator_profile_idx` on `creator_profile_id` (for retrieving creator's portfolio).

---

### **favorites (Many-to-Many: User ↔ Creator)**

**Confirmed Facts:**
- **Table:** `public.favorites`
- **Primary Key:** `id` (UUID, generated).
- **Foreign Keys:**
  - `profile_id` (UUID, required) – References `profiles(id)` with `ON DELETE CASCADE` (the user who favorited).
  - `creator_profile_id` (UUID, required) – References `creator_profiles(id)` with `ON DELETE CASCADE` (the favorited creator).
- **Constraint:** `UNIQUE (profile_id, creator_profile_id)` – Prevents duplicate favorites (a user can only favorite a creator once).
- **Meaning:** Many-to-many join table; represents "user X has favorited creator Y".
- **Ownership Chain:** `auth.users.id` → `profiles.id` → `favorites.profile_id` (user side owns the favorite).

| Field | Type | Required | Inferred Business Meaning |
|-------|------|----------|--------------------------|
| `id` | UUID (PK) | ✓ | Unique favorite record id. |
| `profile_id` | UUID (FK) | ✓ | User who favorited (owning user). |
| `creator_profile_id` | UUID (FK) | ✓ | Creator who was favorited. |
| `created_at` | TIMESTAMPTZ | ✓ (auto) | When the favorite was added. |

**Indexes:**
- `favorites_profile_idx` on `profile_id` (for retrieving a user's favorite creators).
- Implicit index on `(profile_id, creator_profile_id)` for the unique constraint.

---

### **requests (Brief / Collaboration Requests - UMKM to Creator)**

**Confirmed Facts:**
- **Table:** `public.requests`
- **Primary Key:** `id` (UUID, generated).
- **Foreign Keys:**
  - `business_profile_id` (UUID, required) – References `business_profiles(id)` with `ON DELETE CASCADE` (the requesting UMKM).
  - `creator_profile_id` (UUID, optional) – References `creator_profiles(id)` with `ON DELETE SET NULL` (the targeted or assigned creator).
  - `service_id` (UUID, optional) – References `services(id)` with `ON DELETE SET NULL` (specific service if request is service-specific).
- **Status:** Enum-like TEXT field with CHECK constraint; valid values: draft, submitted, reviewed, accepted, in_progress, done.
- **Ownership Chain (UMKM):** `auth.users.id` → `profiles.id` → `business_profiles.id` → `requests.business_profile_id`.
- **Participation:** Both UMKM owner and assigned creator can view/update the request (enforced by RLS).

| Field | Type | Required | Inferred Business Meaning |
|-------|------|----------|--------------------------|
| `id` | UUID (PK) | ✓ | Unique request id. |
| `business_profile_id` | UUID (FK) | ✓ | UMKM who created the request. |
| `creator_profile_id` | UUID (FK) | ✗ | Targeted/assigned creator (optional; may be unassigned initially). |
| `service_id` | UUID (FK) | ✗ | Specific service if request ties to one. |
| `title` | TEXT | ✓ | Request title/summary (e.g., "Promosi menu kopi literan bulan puasa"). |
| `business_name` | TEXT | ✓ | UMKM business name (denormalized for convenience). |
| `business_category` | TEXT | ✗ | Business category. |
| `product_name` | TEXT | ✓ | Product/service being promoted. |
| `promotion_goal` | TEXT | ✓ | Goal of the promotion effort. |
| `target_audience` | TEXT | ✓ | Description of target audience. |
| `budget_range` | TEXT | ✗ | Budget range for the project (e.g., "Rp500 rb - Rp1 jt"). |
| `deadline` | DATE | ✗ | Project deadline. |
| `notes` | TEXT | ✗ | Additional notes/requirements from UMKM. |
| `ai_draft` | TEXT | ✗ | Auto-generated AI draft (if generated). |
| `status` | TEXT, CHECK ('draft' \| 'submitted' \| 'reviewed' \| 'accepted' \| 'in_progress' \| 'done') | ✓ | Current status of the request. |
| `created_at` | TIMESTAMPTZ | ✓ (auto) | When the request was created. |
| `updated_at` | TIMESTAMPTZ | ✓ (auto, trigger) | Last modification timestamp. |

**Indexes:**
- `requests_business_profile_idx` on `business_profile_id` (for UMKM to find their own requests).
- `requests_creator_profile_idx` on `creator_profile_id` (for creator to find assigned requests).

---

### **reviews (Ratings / Feedback for Creators or Services)**

**Confirmed Facts:**
- **Table:** `public.reviews`
- **Primary Key:** `id` (UUID, generated).
- **Foreign Keys:**
  - `creator_profile_id` (UUID, required) – References `creator_profiles(id)` with `ON DELETE CASCADE`.
  - `service_id` (UUID, optional) – References `services(id)` with `ON DELETE SET NULL`.
  - `reviewer_profile_id` (UUID, optional) – References `profiles(id)` with `ON DELETE SET NULL` (the user who left the review; only set if reviewer auth is tracked).
- **Rating:** Numeric constraint: 0 to 5.0.
- **Aggregation:** Frontend queries calculate `ratingAvg` and `reviewCount` from reviews (no pre-aggregated column).
- **Public Access:** Reviewable by anyone; insertable only by authenticated users (RLS policy).

| Field | Type | Required | Inferred Business Meaning |
|-------|------|----------|--------------------------|
| `id` | UUID (PK) | ✓ | Unique review id. |
| `creator_profile_id` | UUID (FK) | ✓ | Creator being reviewed. |
| `service_id` | UUID (FK) | ✗ | Optional link to specific service being reviewed. |
| `reviewer_profile_id` | UUID (FK) | ✗ | User who left the review (optional). |
| `reviewer_name` | TEXT | ✓ | Display name of the reviewer. |
| `rating` | NUMERIC(2,1), CHECK (0 ≤ rating ≤ 5) | ✓ | Star rating (precision: 0.1; e.g., 4.8). |
| `comment` | TEXT | ✗ | Review text/feedback. |
| `created_at` | TIMESTAMPTZ | ✓ (auto) | When the review was posted. |

**Indexes:**
- `reviews_creator_profile_idx` on `creator_profile_id` (for fetching reviews of a creator).

**Aggregates (Inferred, not stored):**
- `ratingAvg` = AVG(rating) grouped by creator_profile_id.
- `reviewCount` = COUNT(*) grouped by creator_profile_id.

---

## 7. Primary Key Analysis

| Entity | PK Field | Type | Source | Ownership Path | Confidence |
|--------|----------|------|--------|-----------------|------------|
| **profiles** | `id` | UUID | Supabase `auth.users.id` (via foreign key ref) | Base; all other entities trace back here | **100% Confirmed** |
| **creator_profiles** | `id` | UUID (generated) | `gen_random_uuid()` | Owned by profile; linked via `profile_id` | **100% Confirmed** |
| **business_profiles** | `id` | UUID (generated) | `gen_random_uuid()` | Owned by profile; linked via `profile_id` | **100% Confirmed** |
| **services** | `id` | UUID (generated) | `gen_random_uuid()` | Owned by creator_profile via `creator_profile_id` | **100% Confirmed** |
| **portfolios** | `id` | UUID (generated) | `gen_random_uuid()` | Owned by creator_profile via `creator_profile_id` | **100% Confirmed** |
| **favorites** | `id` | UUID (generated) | `gen_random_uuid()` | Many-to-many join; no single owner | **100% Confirmed** |
| **requests** | `id` | UUID (generated) | `gen_random_uuid()` | Owned by business_profile via `business_profile_id` | **100% Confirmed** |
| **reviews** | `id` | UUID (generated) | `gen_random_uuid()` | Many-to-one; attached to creator_profile | **100% Confirmed** |

**Primary Key Strategy:**
- All PKs are UUIDs generated either by Supabase Auth (`profiles.id`) or PostgreSQL's `gen_random_uuid()` function.
- No sequential integers; all distributed UUIDs for multi-tenant scalability.

---

## 8. Foreign Key Analysis

### **Confirmed Foreign Keys (from SQL schema)**

| Source | FK Field | Target | REL | Meaning | Confidence |
|--------|----------|--------|-----|---------|-----------|
| `creator_profiles` | `profile_id` | `profiles(id)` | 1:1 | Creator's base profile | **100% Confirmed** |
| `business_profiles` | `profile_id` | `profiles(id)` | 1:1 | UMKM's base profile | **100% Confirmed** |
| `services` | `creator_profile_id` | `creator_profiles(id)` | N:1 | Service belongs to creator | **100% Confirmed** |
| `portfolios` | `creator_profile_id` | `creator_profiles(id)` | N:1 | Portfolio item belongs to creator | **100% Confirmed** |
| `portfolios` | `service_id` | `services(id)` | N:1 (optional) | Portfolio item linked to service (optional) | **100% Confirmed** |
| `favorites` | `profile_id` | `profiles(id)` | N:M | User who favorited | **100% Confirmed** |
| `favorites` | `creator_profile_id` | `creator_profiles(id)` | N:M | Creator being favorited | **100% Confirmed** |
| `requests` | `business_profile_id` | `business_profiles(id)` | N:1 | Request belongs to UMKM | **100% Confirmed** |
| `requests` | `creator_profile_id` | `creator_profiles(id)` | N:1 (optional) | Request assigned to creator (optional) | **100% Confirmed** |
| `requests` | `service_id` | `services(id)` | N:1 (optional) | Request tied to service (optional) | **100% Confirmed** |
| `reviews` | `creator_profile_id` | `creator_profiles(id)` | N:1 | Review for creator | **100% Confirmed** |
| `reviews` | `service_id` | `services(id)` | N:1 (optional) | Review for service (optional) | **100% Confirmed** |
| `reviews` | `reviewer_profile_id` | `profiles(id)` | N:1 (optional) | User who left the review (optional, mostly denormalized to `reviewer_name`) | **100% Confirmed** |

### **Cascading Behavior**

- **ON DELETE CASCADE:**
  - When a `profiles` record is deleted, all related `creator_profiles`, `business_profiles`, `services`, `portfolios`, `favorites` (both sides), and `requests` are deleted.
  - When a `creator_profiles` record is deleted, its `services`, `portfolios`, and `reviews` are deleted.
  - When a `business_profiles` record is deleted, its `requests` are deleted.
  - When a `services` record is deleted, its `portfolios` are deleted; `reviews` are deleted; `requests` referencing it are cleared.

- **ON DELETE SET NULL:**
  - `portfolios.service_id` → SET NULL (portfolio can exist without service link).
  - `requests.creator_profile_id` and `requests.service_id` → SET NULL (request can be unassigned or unlinked).
  - `reviews.service_id` and `reviews.reviewer_profile_id` → SET NULL (review persists but loses reference).

### **Unique Constraints**

| Table | Constraint | Meaning |
|-------|-----------|---------|
| `profiles` | PK (`id`) | One profile per auth user. |
| `creator_profiles` | UNIQUE (`profile_id`) | One creator profile per user. |
| `creator_profiles` | UNIQUE (`slug`) | Slug is globally unique (used in URLs). |
| `business_profiles` | UNIQUE (`profile_id`) | One business profile per user. |
| `services` | UNIQUE (`slug`) | Service slug is globally unique. |
| `favorites` | UNIQUE (`profile_id`, `creator_profile_id`) | User can favorite a creator only once. |

---

## 9. Relationship Map

### **One-to-One Relationships**

```
auth.users (1) ←→ (1) profiles
    ↓
    ├─→ (1) creator_profiles  [if role='creator']
    └─→ (1) business_profiles [if role='umkm']
```

- **Meaning:** Every authenticated user has one `profiles` record and one extended profile (either creator or business).
- **Enforcement:** Foreign key + unique constraint on `profile_id` in both extended tables.
- **Ownership:** User owns their own profile and extended profile only.

---

### **One-to-Many Relationships**

```
creator_profiles (1) ←→ (N) services
```
- **Meaning:** A creator can offer many services; each service belongs to exactly one creator.
- **Ownership Chain:** `auth.users` → `profiles` → `creator_profiles` → `services`.

```
creator_profiles (1) ←→ (N) portfolios
```
- **Meaning:** A creator can have many portfolio items; each item belongs to exactly one creator.
- **Ownership Chain:** Same as services.

```
creator_profiles (1) ←→ (N) reviews
```
- **Meaning:** A creator can have many reviews; each review is about exactly one creator.
- **Aggregation:** `ratingAvg` and `reviewCount` are computed across reviews for a creator.

```
business_profiles (1) ←→ (N) requests
```
- **Meaning:** A UMKM can create many requests/briefs; each request belongs to one business.
- **Ownership Chain:** `auth.users` → `profiles` → `business_profiles` → `requests`.

---

### **Many-to-Many Relationships**

```
profiles (N) ←→ (N) creator_profiles
    via: favorites table
```
- **Meaning:** A user (any profile) can favorite many creators; a creator can be favorited by many users.
- **Join Table:** `favorites` with unique constraint preventing duplicates.
- **Semantics:** Represents a saved/bookmarked relationship (one-sided; only the user initiates).

---

### **Optional Relationships (Nullability)**

```
portfolios (N) -?→ (1) services
    (service_id nullable)
```
- **Meaning:** A portfolio item may or may not be linked to a specific service. Example: a portfolio item showing a moodboard might not tie to a commercial service.
- **On Service Delete:** Portfolio loses the link (SET NULL); portfolio persists.

```
requests (N) -?→ (1) creator_profiles
    (creator_profile_id nullable)
```
- **Meaning:** A request may be unassigned (no creator yet) at creation.
- **Scenario:** UMKM submits a brief without specifying a creator; creator browses incoming requests and self-assigns.

```
requests (N) -?→ (1) services
    (service_id nullable)
```
- **Meaning:** A request may not reference a specific service; it's a custom brief.

```
reviews (N) -?→ (1) services
    (service_id nullable)
```
- **Meaning:** A review targets the creator but may not reference a specific service.

```
reviews (N) -?→ (1) profiles
    (reviewer_profile_id nullable)
```
- **Meaning:** The reviewer's auth profile is not always stored; `reviewer_name` is denormalized.

---

### **Ownership Paths Summary**

**For a UMKM (role='umkm'):**
```
auth.users:id ──→ profiles:id ──→ business_profiles:profile_id ──→ requests:business_profile_id
```

**For a Creator (role='creator'):**
```
auth.users:id ──→ profiles:id ──→ creator_profiles:profile_id ──→ (services, portfolios, reviews)
```

**For Favorites (user → creator):**
```
auth.users:id ──→ profiles:id (as profile_id) ←── favorites ──→ creator_profiles:id
```

---

## 10. Entity Relationship Breakdown by Feature

### **Auth / Identity**

**Entities:** `profiles`, `auth.users` (external)

**Structure:**
- `auth.users` (managed by Supabase Auth) is the single source of truth for user identity.
- `profiles` is a denormalized copy/extension of auth data in the application database.
- Contains user's display name, email, avatar, and role discriminator.

**Data Flow:**
1. User signs up via Supabase Auth API with email/password.
2. Backend creates a `profiles` record with `role='creator'` or `'umkm'`.
3. Role determines which extended profile (creator_profiles or business_profiles) is bootstrapped.

**RLS:**
- Users can only view/modify their own profile.

---

### **UMKM / Business**

**Entities:** `profiles`, `business_profiles`, `requests`

**Structure:**
```
UMKM User
    ├─ profiles (role='umkm')
    ├─ business_profiles (extended profile)
    └─ requests (briefs/collaboration requests)
```

**Data Shape Examples:**
- `profile:{ id, role: 'umkm', name, email, avatar_url, ... }`
- `businessProfile:{ id, profileId, businessName, category, city, mainProduct, promotionTarget, contact, ... }`
- `request:{ id, businessProfileId, creatorProfileId?, serviceId?, title, productName, promotionGoal, targetAudience, budgetRange, deadline, status, ... }`

**Relationships:**
- UMKM owns one business profile (1:1 via `profiles`).
- UMKM can create many requests (1:N).
- Each request can be assigned to a creator (optional, N:1) or tied to a service (optional, N:1).

**Access Control (RLS):**
- UMKM can only see/update their own business profile.
- Business requests are visible to the UMKM owner and the assigned creator.

---

### **Creator / Content Creator**

**Entities:** `profiles`, `creator_profiles`, `services`, `portfolios`, `reviews`

**Structure:**
```
Creator User
    ├─ profiles (role='creator')
    ├─ creator_profiles (extended profile with slug, brand, bio, niche, etc.)
    ├─ services (service offerings)
    ├─ portfolios (portfolio items/examples)
    └─ reviews (ratings/feedback)
```

**Data Shape Examples:**
- `profile:{ id, role: 'creator', name, email, avatar_url, ... }`
- `creatorProfile:{ id, profileId, slug, brandName, city, niche, platforms[], pricFrom, bannerUrl, shortBio, fullBio, socialLinks, isPublished, ... }`
- `service:{ id, creatorProfileId, slug, title, description, price, deliveryDays, revisionCount, outputs[], platforms[], isActive, ... }`
- `portfolio:{ id, creatorProfileId, serviceId?, title, thumbnailUrl, category, platform, caption, ... }`
- `review:{ id, creatorProfileId, serviceId?, reviewerName, rating, comment, createdAt }`

**Relationships:**
- Creator owns one creator profile (1:1 via `profiles`).
- Creator can offer many services (1:N).
- Creator can have many portfolio items (1:N); portfolio may link to a service (optional N:1).
- Creator can receive many reviews (1:N).

**Derived Data:**
- `ratingAvg` and `reviewCount` are aggregated from reviews table.

**Access Control (RLS):**
- Creator can only see/update their own creator profile and services.
- Public discovery sees only published creator profiles and active services.

---

### **Services (Service Marketplace)**

**Entities:** `services`, `creator_profiles`, `portfolios`, `reviews`, `requests`

**Structure:**
```
Creator Profile
    └─ Service
        ├─ Portfolio Items (examples)
        ├─ Reviews (ratings for this service)
        └─ Requests (briefs referencing this service)
```

**Data Flow:**
1. Creator lists a service.
2. UMKM discovers the service in the marketplace.
3. UMKM can favorite the creator or submit a request (optionally tied to this service).
4. Creator receives requests; may include this service as context.

**Key Fields:**
- `slug` (unique, for public URLs).
- `price`, `deliveryDays`, `revisionCount`, `outputs`, `platforms` (service details).
- `is_active` (visibility toggle).

**Relationships:**
- Each service belongs to one creator (N:1).
- A service can have many portfolios (1:N, optional link).
- A service can have many reviews (1:N, optional).
- A service can be referenced in requests (1:N, optional).

---

### **Portfolio / Examples**

**Entities:** `portfolios`, `creator_profiles`, `services` (optional link)

**Purpose:**
- Showcase past work to build credibility and demonstrate capability.
- Can be linked to a specific service or standalone examples.

**Data:**
- `title`, `thumbnailUrl`, `category`, `platform`, `caption`.
- Optional `serviceId` link.

**Relationships:**
- Portfolios belong to creator (N:1).
- Portfolios may associate with services (optional N:1).

---

### **Favorites / Bookmarks**

**Entities:** `favorites`, `profiles`, `creator_profiles`

**Purpose:**
- Let UMKMs bookmark creators for later reference.
- Denormalized into discovery queries as `isFavorite` flag.

**Data:**
- `favorites.profileId` (user who favorited).
- `favorites.creatorProfileId` (creator being favorited).
- `created_at` (timestamp of favoriting).

**Relationships:**
- Many-to-many: user ↔ creator (join table).
- Unique constraint prevents duplicate saves.

**Access Control (RLS):**
- User can only see/modify their own favorites.

---

### **Requests / Briefs (Collaboration)**

**Entities:** `requests`, `business_profiles`, `creator_profiles`, `services`

**Purpose:**
- UMKM submits a brief/request for a creator to work on.
- Tracks collaboration status from submission to completion.

**Data Fields:**
- **From UMKM:** `businessProfileId`, `title`, `businessName`, `productName`, `promotionGoal`, `targetAudience`, `budgetRange`, `deadline`, `notes`.
- **Targeting:** `creatorProfileId` (optional), `serviceId` (optional).
- **Status:** draft → submitted → reviewed → accepted → in_progress → done.
- **AI Support:** `aiDraft` (auto-generated initial brief).

**Relationships:**
- Requests owned by business (N:1).
- Can optionally reference a creator (N:1, nullable).
- Can optionally reference a service (N:1, nullable).

**Lifecycle:**
1. UMKM creates request (draft or submitted).
2. Creator discovers incoming requests or UMKM sends to them.
3. Creator accepts; creator_profile_id is set/updated.
4. Status progresses through workflow.

**Access Control (RLS):**
- Only UMKM owner and assigned creator can view/update.

---

### **Reviews / Ratings (Feedback)**

**Entities:** `reviews`, `creator_profiles`, `services`, `profiles`

**Purpose:**
- Collect feedback and star ratings for creators.
- Aggregate ratings for discovery filtering and display.

**Data:**
- `rating` (0.0 to 5.0, precision 0.1).
- `comment` (optional review text).
- `reviewerName` (denormalized display name).
- Optional `serviceId` (review for specific service) and `reviewerProfileId` (auth if tracked).

**Relationships:**
- Reviews attached to creator (N:1).
- Optional service reference (N:1).
- Optional reviewer profile reference (N:1).

**Aggregates (Computed):**
- `ratingAvg = AVG(rating)` per creator.
- `reviewCount = COUNT(*)` per creator.

**Access Control (RLS):**
- Public read access.
- Authenticated users can insert reviews.

---

## 11. Frontend Data Shape Expectations

### **From Mock Data (`client/src/data/mockData.js`)**

The mock data defines expected object shapes that the frontend anticipates from the backend:

#### **Creator Card (Discovery)**
```javascript
{
  id: string,                    // UUID
  slug: string,                  // URL identifier
  name: string,                  // brandName
  avatarUrl: string,             // URL or null
  niche: string,                 // Category
  city: string,                  // Location
  priceFrom: number,             // Numeric
  ratingAvg: number,             // Aggregated avg rating
  reviewCount: number,           // Count of reviews
  shortBio: string,              // Brief description
  isFavorite: boolean,           // Denormalized favorite flag
}
```

**Mapping to Database:**
- `id` ← `creator_profiles.id`
- `slug` ← `creator_profiles.slug`
- `name` ← `creator_profiles.brand_name`
- `avatarUrl` ← `profiles.avatar_url` (joined)
- `rating*` ← Aggregated from `reviews` table
- `isFavorite` ← Presence in `favorites` table for current user

---

#### **Creator Detail**
```javascript
{
  id: string,
  slug: string,
  name: string,
  avatarUrl: string,
  bannerUrl: string,
  niche: string,
  city: string,
  platforms: string[],
 "priceFrom: number,
  ratingAvg: number,
  reviewCount: number,
  shortBio: string,
  fullBio: string,
  services: [
    { id, slug, title, shortDescription, price, deliveryDays, revisionCount }
  ],
  portfolioItems: [
    { id, title, thumbnailUrl, category, platform, caption }
  ],
  reviews: [
    { id, reviewerName, rating, comment, createdAt }
  ],
}
```

**Mapping:**
- All base fields same as creator card.
- `services` ← JOIN with `services` table, filtered by `is_active=true`.
- `portfolioItems` ← JOIN with `portfolios` table.
- `reviews` ← JOIN with `reviews` table.

---

#### **Service Card**
```javascript
{
  id: string,
  slug: string,
  title: string,
  shortDescription: string,
  price: number,
  deliveryDays: number,
  revisionCount: number,
}
```

**Mapping:**
- Direct from `services` table.

---

#### **Service Detail**
```javascript
{
  id: string,
  slug: string,
  title: string,
  description: string,
  shortDescription: string,
  price: number,
  deliveryDays: number,
  revisionCount: number,
  outputs: string[],
  platforms: string[],
  examples: [
    { id, title, thumbnailUrl, category, platform, caption }
  ],
  creator: {
    id: string,
    slug: string,
    name: string,
    avatarUrl: string,
  },
}
```

**Mapping:**
- Service fields from `services`.
- `examples` ← `portfolios` linked via `service_id` (or creator's portfolios).
- `creator` ← Joined `creator_profiles` + `profiles`.

---

#### **Portfolio Item**
```javascript
{
  id: string,
  title: string,
  thumbnailUrl: string,
  category: string,
  platform: string,
  caption: string,
}
```

**Mapping:**
- Direct from `portfolios` table (fields renamed: `thumbnail_url` → `thumbnailUrl`, etc.).

---

#### **Review**
```javascript
{
  id: string,
  reviewerName: string,
  rating: number,
  comment: string,
  createdAt: string (date),
}
```

**Mapping:**
- Direct from `reviews` table.

---

#### **Request / Brief**
```javascript
{
  id: string,
  title: string,
  status: string,
  createdAt: string,
  creatorName: string,                  // Joined creator_profiles.brand_name or null
  businessName: string,
  businessCategory: string,
  productName: string,
  promotionGoal: string,
  targetAudience: string,
  budgetRange: string,
  deadline: string (date),
  notes: string,
  aiDraft: string,
  service: {
    id: string,
    slug: string,
    title: string,
  } | null,
}
```

**Mapping:**
- Most fields from `requests` table.
- `creatorName` ← Joined `creator_profiles.brand_name` (via `creator_profile_id`).
- `service` ← Joined `services` (via `service_id`).

---

#### **Profile / Dashboard**
```javascript
{
  name: string,
  email: string,
}
```

**Mapping:**
- From `profiles` table.

---

### **Data Shape Mismatches**

| Frontend Shape | Backend Reality | Issue | Severity |
|---|---|---|---|
| `avatarUrl` always present | `profiles.avatar_url` is nullable | Frontend may not handle null | Low – can default to placeholder |
| `isFavorite` in card | Not in DB; requires extra query for each user | Performance: N+1 queries | Medium – needs denormalization or single joined query |
| `ratingAvg`, `reviewCount` in card | Not stored; computed from reviews | Multiple queries needed per card | Medium – could be cached/aggregated on read |
| `creatorName` in request detail | Joined from `creator_profiles`; named `brand_name` in DB | Field name differs | Low – service layer maps it |
| `service` object in request | Joined `services`; optional (`serviceId` nullable) | Handled in backend mapping | None – correctly optional |

---

## 12. Backend Data Model Expectations

### **From `server/src/services/profile.service.js`**

Backend defines mapping functions that transform raw database rows into the API response shape:

#### **Base Profile Response**
```javascript
{
  id: string (UUID),
  role: string ('umkm' | 'creator'),
  name: string,
  email: string,
  avatarUrl: string,            // maps from avatar_url
  createdAt: string (ISO date),
  updatedAt: string (ISO date),
}
```

---

#### **Creator Profile Response**
```javascript
{
  id: string (UUID),
  profileId: string (UUID),     // maps from profile_id
  slug: string,
  brandName: string,            // maps from brand_name
  city: string,
  niche: string,
  platforms: string[],
  shortBio: string,
  fullBio: string,
  priceFrom: number,            // maps from price_from
  bannerUrl: string,
  portfolioUrl: string,
  socialLinks: object,          // JSONB from DB
  isPublished: boolean,
  createdAt: string,
  updatedAt: string,
}
```

---

#### **Business Profile Response**
```javascript
{
  id: string (UUID),
  profileId: string (UUID),
  businessName: string,
  category: string,
  city: string,
  description: string,
  mainProduct: string,
  promotionTarget: string,
  contact: string,
  createdAt: string,
  updatedAt: string,
}
```

---

#### **Request Response** (from `request.service.js`)
```javascript
{
  id: string,
  title: string,
  status: string,
  createdAt: string,
  creatorName: string (or null),
  businessName: string,
  businessCategory: string,
  productName: string,
  promotionGoal: string,
  targetAudience: string,
  budgetRange: string,
  deadline: string (or null),
  notes: string,
  aiDraft: string,
  service: {
    id: string,
    slug: string,
    title: string,
  } | null,
}
```

---

### **Expected Request Payloads**

#### **Signup Payload** (from `server/src/validators/auth.validators.js`)
```javascript
{
  name: string (min 2 chars),
  email: string (email format),
  password: string (min 6 chars),
  role: 'umkm' | 'creator',
}
```

**Backend Processing:**
1. Supabase Auth creates `auth.users` record.
2. Backend creates `profiles` record with given role.
3. Backend bootstraps extended profile (`creator_profiles` or `business_profiles`).

---

#### **Update Profile Payload** (from `server/src/validators/profile.validators.js`)
```javascript
// Base Profile Update
{
  name: string (optional),
  avatarUrl: string (URL, optional),
}

// Creator Profile Update
{
  brandName: string (optional),
  city: string (optional),
  niche: string (optional),
  platforms: string[] (optional),
  shortBio: string (optional),
  fullBio: string (optional),
  priceFrom: number (optional, >= 0),
  bannerUrl: string (URL, optional),
  portfolioUrl: string (URL, optional),
  socialLinks: Record<string, string> (optional),
  isPublished: boolean (optional),
}

// Business Profile Update
{
  businessName: string (optional),
  category: string (optional),
  city: string (optional),
  description: string (optional),
  mainProduct: string (optional),
  promotionTarget: string (optional),
  contact: string (optional),
}
```

---

#### **Create Request Payload** (from `request.service.js`)
```javascript
{
  title: string (optional; auto-generated if not provided),
  businessName: string,
  businessCategory: string (optional),
  productName: string,
  promotionGoal: string,
  targetAudience: string,
  budgetRange: string (optional),
  deadline: date (optional),
  notes: string (optional),
  aiDraft: string (optional),
  status: string (optional; defaults to 'submitted'),
  creatorProfileId: string (UUID, optional),
  creatorSlug: string (optional; resolved to ID if provided),
  serviceId: string (UUID, optional),
  serviceSlug: string (optional; resolved to service details if provided),
}
```

**Backend Logic:**
- Auto-generates `title` if not provided: `"Promosi ${productName}"`.
- Resolves creator by ID or slug.
- Resolves service by ID or slug; extracts `creator_profile_id` from service if present.

---

### **Backend Ownership Enforcement**

Backend services enforce ownership via explicit checks before allowing operations:

| Operation | Check | Source |
|-----------|-------|--------|
| Update base profile | `userId == profile.id` | `profile.service.js` |
| Update creator profile | `userId == creatorProfile.profileId` | `profile.service.js` + RLS |
| Create service | Verify user is creator & owns creator_profile | RLS |
| Create request | Verify user is UMKM & owns business_profile | `request.service.js` |
| Update request status | Verify user is UMKM owner OR assigned creator | RLS |
| Add favorite | Verify user is the profile adding favorite | RLS |
| Create review | Verify user is authenticated | RLS |

---

### **Data Validation Constraints**

| Field | Constraint | Source |
|-------|-----------|--------|
| `role` | CHECK ('umkm' \| 'creator') | SQL schema |
| `delivery_days` | CHECK (> 0) | SQL schema |
| `revision_count` | CHECK (>= 0) | SQL schema |
| `rating` | CHECK (0 <= rating <= 5) | SQL schema |
| `request.status` | CHECK in (draft, submitted, reviewed, accepted, in_progress, done) | SQL schema |
| `price`, `price_from` | NUMERIC(12,2) | SQL schema |
| Name fields | min 2 chars | Zod validators |
| Email | email format | Zod validators |
| Password | min 6 chars | Zod validators |
| URLs | URL format | Zod validators |

---

## 13. Auth, Roles, and Ownership

### **Role System**

The system defines two mutually exclusive user roles:

| Role | Meaning | Extended Profile | Owns | Can Create/Browse |
|------|---------|------------------|------|------------------|
| **creator** | Content creator / freelancer | `creator_profiles` (1:1) | Services, Portfolio, Reviews | Services, Portfolio items, Requests (incoming) |
| **umkm** | Small business looking for promotion | `business_profiles` (1:1) | Requests/Briefs, Favorites | Requests, Favorites |

---

### **Ownership Paths**

#### **Creator Ownership**
```
auth.users (authenticated user)
    ↓ (id)
profiles (role='creator', id from auth.users)
    ↓ (profile_id)
creator_profiles (slug, brand, niche, etc.)
    ↓ (id)
    ├─ services (offerings)
    ├─ portfolios (examples)
    └─ reviews (ratings received)
```

**Ownership Semantics:**
- Creator owns their profile, services, and portfolio.
- Reviews are received (owned by the reviewer/UMKM conceptually, but attached to the creator).
- Creator can view/respond to requests assigned to them.

---

#### **UMKM Ownership**
```
auth.users (authenticated user)
    ↓ (id)
profiles (role='umkm', id from auth.users)
    ↓ (profile_id)
business_profiles (business name, category, etc.)
    ↓ (id)
    ├─ requests (briefs created)
    └─ favorites (creators bookmarked)
```

**Ownership Semantics:**
- UMKM owns their business profile and requests they create.
- UMKM can favorite any published creator.
- UMKM can see requests they created and responses from creators.

---

### **Shared / Dual Ownership**

**Requests (Special Case):**
```
Owned by: business_profiles (UMKM who created it)
Can be viewed/edited by: creator_profiles (if assigned)
```
- UMKM creates request (owns `business_profile_id`).
- Creator may be assigned (`creator_profile_id` optional).
- Once assigned, both parties can view/update.
- RLS enforces: query allowed if `(business_profile.profile_id == auth.uid()) OR (creator_profile.profile_id == auth.uid())`.

---

### **Public vs. Private Data**

| Entity | Public? | Visible To | Hidden From |
|--------|---------|-----------|-------------|
| `creator_profiles` (published) | ✓ Yes | Everyone | Only if `is_published=false` |
| `creator_profiles` (unpublished) | ✗ No | Creator only | Public, other users |
| `business_profiles` | ✗ No | UMKM owner only | Public, other users, creators |
| `services` (active) | ✓ Yes | Everyone | Only if `is_active=false` |
| `portfolios` (published creator) | ✓ Yes | Everyone | Only if creator unpublished |
| `requests` | ✗ No | UMKM owner + assigned creator | Public |
| `reviews` | ✓ Yes | Everyone | N/A |
| `favorites` | ✗ No | UMKM owner only | Other users |

---

### **Missing or Unclear Ownership**

| Issue | Description |
|-------|-------------|
| **Admin Role** | Not defined. No `admin` role entity in schema. Could be needed for moderation/support. |
| **Review Ownership** | `reviewer_profile_id` is optional; mostly denormalized to `reviewer_name`. Unclear if reviews can be edited/deleted by reviewer. |
| **Service Categories** | No separate category table. Categories inferred from service title or portfolio category. Should be normalized? |
| **Slugs** | Both `creator_profiles.slug` and `services.slug` are globally unique, but naming strategy is unclear. Conflict possible if not careful. |

---

## 14. Slugs, Statuses, and Derived Fields

### **Slug Fields**

| Table | Field | Scope | Example | Purpose |
|-------|-------|-------|---------|---------|
| `creator_profiles` | `slug` | Globally unique | `nadia-konten-kuliner` | Public URL identifier for creator profile. |
| `services` | `slug` | Globally unique | `video-reels-kuliner-umkm` | Public URL identifier for service detail page. |

**Slug Generation:**
- **Backend:** `buildUniqueSlug()` in [server/src/utils/slug.js](server/src/utils/slug.js) appends UUID suffix if default slug is taken.
- **Frontend:** `buildSlug()` in [client/src/utils/buildSlug.js](client/src/utils/buildSlug.js) converts name to slug format.

**Unique Constraint:** Both slugs have `UNIQUE` constraints in the database; no duplicates allowed globally.

---

### **Status Fields**

#### **Creator Profile Status**
| Field | Type | Values | Meaning |
|-------|------|--------|---------|
| `is_published` | BOOLEAN | TRUE / FALSE | Controls public visibility of creator profile in discovery. |

---

#### **Service Status**
| Field | Type | Values | Meaning |
|-------|------|--------|---------|
| `is_active` | BOOLEAN | TRUE / FALSE | Controls public visibility of service in marketplace. |

---

#### **Request Status**
| Field | Type | Values | Meaning |
|-------|------|--------|---------|
| `status` | TEXT | draft, submitted, reviewed, accepted, in_progress, done | Workflow state of the request/brief. |

**Status Lifecycle:**
```
draft → submitted → reviewed → accepted → in_progress → done
```

- **draft:** Initial state; UMKM saving a request that is not yet sent.
- **submitted:** UMKM has sent the request to the creator (or broadcast to all).
- **reviewed:** Creator has reviewed the request (optional intermediate state).
- **accepted:** Creator has accepted the request; work will begin.
- **in_progress:** Work is underway.
- **done:** Work is complete.

---

### **Derived / Aggregated Fields (Computed, Not Stored)**

| Field | Source | Calculation | Usage |
|-------|--------|-------------|-------|
| `ratingAvg` | `reviews` table | AVG(rating) grouped by creator_profile_id | Discovery filtering & creator card display. |
| `reviewCount` | `reviews` table | COUNT(*) grouped by creator_profile_id | Creator card display, trust signal. |

**Backend Implementation:**
- Computed in [server/src/services/discovery.service.js](server/src/services/discovery.service.js) via `ratingSummary()` function.
- Not pre-aggregated; computed on each query.

**Potential Issue:** High query overhead if many reviews exist per creator. Could benefit from materialized view or denormalization.

---

### **Denormalized Fields**

| Field | Table | Denormalized From | Reason | Consistency Risk |
|-------|-------|-------------------|--------|------------------|
| `business_name` | `requests` | `business_profiles.business_name` | Convenience; historically snapshot at request creation. | Could become stale if UMKM updates business name. |
| `reviewer_name` | `reviews` | `profiles.name` (or implicit) | Reviewer identity not always tracked; name stored directly. | If reviewer deletes account, name persists. |
| `platforms` | `creator_profiles` | N/A (primary data) | Array stored directly; not normalized to separate table. | Simpler queries but less normalized. |

---

## 15. Media and Asset-Linked Fields

### **Image/URL Fields Referencing External Storage**

| Field | Table | Format | Storage Backend | Nullable | Usage |
|-------|-------|--------|-----------------|----------|-------|
| `avatar_url` | `profiles` | String (URL) | Supabase Storage (inferred) | ✓ Yes | User avatar image. |
| `banner_url` | `creator_profiles` | String (URL) | Supabase Storage (inferred) | ✓ Yes | Creator profile banner/cover image. |
| `portfolio_url` | `creator_profiles` | String (URL) | Supabase Storage or external | ✓ Yes | Link to external portfolio site. |
| `thumbnail_url` | `portfolios` | String (URL) | Supabase Storage (inferred) | ✓ Yes | Portfolio item thumbnail/preview. |

**Storage Strategy:**
- URLs stored as strings in database.
- Actual file storage assumed to be Supabase Storage (not modeled in schema).
- No explicit foreign key to storage records.
- Frontend and backend treat URLs as opaque strings.

**Upload Flow (Inferred):**
1. Frontend uploads file to Supabase Storage.
2. Supabase returns public URL.
3. Frontend sends URL to backend API.
4. Backend stores URL in corresponding table field.

---

### **No Direct Media Table**

**Finding:** There is no `media`, `uploads`, `assets`, or `files` table in the schema. 

**Implication:**
- Media is managed entirely via Supabase Storage (external to the relational schema).
- Database only stores URLs.
- No relationship between users and uploaded files at the schema level.
- No usage tracking, quotas, or permissions for individual uploads in the schema.

**Potential Issue:**
- If media links break or storage is reorganized, database records become inconsistent.
- No audit trail of file uploads.
- Cannot enforce usage limits or storage quotas at the database level.

---

## 16. Inconsistencies and Model Gaps

### **Model Issues**

| Issue | Severity | Description | Impact |
|-------|----------|-------------|--------|
| **No Service Categories Table** | Medium | Services have titles but no normalized category. Portfolio has `category` field, but service category is implicit. | Discovery filters need to parse titles or unify categories elsewhere. |
| **Slug Naming Conflicts** | Low | Both `creator_profiles.slug` and `services.slug` are globally unique. Possible collision in URL routing if not careful. | Router must distinguish resource type from slug alone. |
| **Review Reviewer Tracking** | Medium | `reviewer_profile_id` is optional; most reviewers denormalized to `reviewer_name`. Cannot track who left which review. | If reviewer deletion happens, review orphaned but persists. Cannot enforce reviewer uniqueness. |
| **Missing Admin Entity** | Medium | No `admin` role or admin profile entity. Moderation, support, or administrative functions not modeled. | Would need separate admin tables or privileges system. |
| **Aggregate Rating Not Cached** | Low | `ratingAvg` and `reviewCount` computed per query. Could become slow with many reviews. | May need materialized view or denormalized aggregate column as data scales. |
| **Service-Portfolio Link Optional** | Low | Portfolios can exist without `service_id`. Unclear categorization of portfolio items. | Ambiguity in whether portfolio is tied to a specific service offering or just general examples. |
| **Request Status Enum as Text** | Low | Status stored as TEXT with CHECK constraint, not as ENUM type. Works but less type-safe. | Risk of invalid status values if constraint not enforced. |
| **No Request Workflow Timestamps** | Medium | Only `created_at` and `updated_at` tracked. No timestamp for when status changed or who changed it. | Cannot audit request workflow history. |
| **Platform Array Not Normalized** | Low | `creator_profiles.platforms` and `services.platforms` are TEXT arrays, not join tables. | Queries by platform require array containment checks; less efficient than joins. |
| **Budget Range as Text** | Low | `requests.budget_range` stored as text (e.g., "Rp500 rb - Rp1 jt"), not numeric range. | Cannot range-filter requests by budget; text parsing required. |

---

### **Frontend-Backend Mismatches**

| Mismatch | Frontend | Backend | Severity |
|----------|----------|---------|----------|
| **Mock vs. Real Data** | Frontend services use mock data. | Backend services query real Supabase. | High – Frontend not integrated; uses fallback data. |
| **isFavorite Denormalization** | Frontend expects `isFavorite` boolean in creator card. | Must join `favorites` table per user; not in base query. | Medium – Requires extra query; N+1 risk if not batched. |
| **Avatar URL Nullable** | Frontend may assume non-null. | `profiles.avatar_url` is nullable. | Low – Frontend should handle null with placeholder. |
| **Reviewer Identity** | Backend doesn't formally track reviewer. | `reviews.reviewer_profile_id` mostly null; `reviewer_name` used. | Medium – Cannot definitively link reviews to users. |

---

### **Candidate Normalization Issues**

| Denormalization | Benefit | Cost | Recommendation |
|---|---|---|---|
| `creator_profiles.platforms` (TEXT array) | Simple data model; fewer queries. | Less efficient filtering; manual parsing. | Consider separate `creator_platforms` join table if filtering is frequent. |
| `requests.business_name` (snapshot) | Audit trail of original request context. | Stale if business name changes; inconsistency. | Consider reference or versioning if consistency is critical. |
| `reviews.reviewer_name` (denormalized) | Review persists even if reviewer deleted. | Cannot track reviewer or enforce uniqueness. | Consider enforcing `reviewer_profile_id` as required FK for better data integrity. |
| `ratingAvg`, `reviewCount` (computed) | Saves storage; always fresh. | Expensive per-query computation. | Consider materialized view or trigger-maintained denormalized column. |

---

## 17. Recommended Canonical Data Model

### **Recommended Entity Structure (No Changes Needed for MVP)**

The current schema is already well-normalized and production-ready. For an MVP, **no changes recommended** to the core entity structure. However, the following clarifications and potential enhancements are suggested for future iterations:

#### **Current Core Model (Recommended As-Is)**

```
auth.users (Supabase Auth)
    ↓ (id)
profiles {
    id (PK, FK → auth.users.id)
    role (discriminator: 'umkm' | 'creator')
    name
    email
    avatar_url
    created_at
    updated_at
}
    ↓
    ├─→ creator_profiles {
    │       id (PK)
    │       profile_id (FK, unique → profiles.id)
    │       slug (unique)
    │       brand_name
    │       city
    │       niche
    │       platforms (TEXT array)
    │       short_bio
    │       full_bio
    │       price_from
    │       banner_url
    │       portfolio_url
    │       social_links (JSONB)
    │       is_published
    │       created_at
    │       updated_at
    │   }
    │       ├─→ services {
    │       │       id (PK)
    │       │       creator_profile_id (FK → creator_profiles.id)
    │       │       slug (unique)
    │       │       title
    │       │       short_description
    │       │       description
    │       │       price
    │       │       delivery_days
    │       │       revision_count
    │       │       outputs (TEXT array)
    │       │       platforms (TEXT array)
    │       │       is_active
    │       │       created_at
    │       │       updated_at
    │       │   }
    │       │
    │       ├─→ portfolios {
    │       │       id (PK)
    │       │       creator_profile_id (FK → creator_profiles.id)
    │       │       service_id (FK, optional → services.id)
    │       │       title
    │       │       thumbnail_url
    │       │       category
    │       │       platform
    │       │       caption
    │       │       created_at
    │       │       updated_at
    │       │   }
    │       │
    │       └─→ reviews {
    │               id (PK)
    │               creator_profile_id (FK → creator_profiles.id)
    │               service_id (FK, optional → services.id)
    │               reviewer_profile_id (FK, optional → profiles.id)
    │               reviewer_name
    │               rating (numeric, 0-5)
    │               comment
    │               created_at
    │           }
    │
    └─→ business_profiles {
            id (PK)
            profile_id (FK, unique → profiles.id)
            business_name
            category
            city
            description
            main_product
            promotion_target
            contact
            created_at
            updated_at
        }
            ├─→ requests {
            │       id (PK)
            │       business_profile_id (FK → business_profiles.id)
            │       creator_profile_id (FK, optional → creator_profiles.id)
            │       service_id (FK, optional → services.id)
            │       title
            │       business_name (denormalized snapshot)
            │       business_category
            │       product_name
            │       promotion_goal
            │       target_audience
            │       budget_range
            │       deadline
            │       notes
            │       ai_draft
            │       status (CHECK: draft, submitted, reviewed, accepted, in_progress, done)
            │       created_at
            │       updated_at
            │   }
            │
            └─→ favorites {
                    id (PK)
                    profile_id (FK → profiles.id)
                    creator_profile_id (FK → creator_profiles.id)
                    UNIQUE(profile_id, creator_profile_id)
                    created_at
                }
```

---

### **Recommended Future Enhancements (Post-MVP)**

#### **1. Separate Service Categories Table** (Optional but Recommended)

```sql
CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE services ADD COLUMN category_id UUID REFERENCES service_categories(id) ON DELETE RESTRICT;
```

**Benefit:** Normalized categories; enable category-based filtering.

---

#### **2. Separate Platform Tables** (Optional but Recommended)

```sql
CREATE TABLE platforms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE
);

CREATE TABLE creator_platforms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_profile_id UUID NOT NULL REFERENCES creator_profiles(id) ON DELETE CASCADE,
    platform_id UUID NOT NULL REFERENCES platforms(id) ON DELETE CASCADE,
    UNIQUE(creator_profile_id, platform_id)
);

CREATE TABLE service_platforms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
    platform_id UUID NOT NULL REFERENCES platforms(id) ON DELETE CASCADE,
    UNIQUE(service_id, platform_id)
);
```

**Benefit:** Normalized platforms; efficient filtering; consistent platform list.

---

#### **3. Better Reviewer Tracking** (Recommended Soon)

```sql
ALTER TABLE reviews
    ALTER COLUMN reviewer_profile_id SET NOT NULL,
    ADD CONSTRAINT reviews_unique_reviewer_per_creator UNIQUE(creator_profile_id, reviewer_profile_id);
```

**Benefit:** Enforce unique reviews per reviewer-creator pair; better audit trail.

---

#### **4. Request History / Audit Trail** (Optional)

```sql
CREATE TABLE request_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES requests(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Benefit:** Track request workflow history; who changed what and when.

---

#### **5. Materialized Rating Aggregates** (If Performance Becomes Issue)

```sql
CREATE TABLE creator_rating_summary (
    creator_profile_id UUID PRIMARY KEY REFERENCES creator_profiles(id) ON DELETE CASCADE,
    avg_rating NUMERIC(2,1),
    review_count INTEGER,
    last_updated TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Refresh via trigger on review insert/update/delete
```

**Benefit:** O(1) fetch of ratings instead of O(n reviews); significant performance gain at scale.

---

#### **6. Budget Range Normalization** (Optional)

```sql
ALTER TABLE requests
    ADD COLUMN budget_min NUMERIC(12,2),
    ADD COLUMN budget_max NUMERIC(12,2);
```

**Benefit:** Range queries on budget; remove text parsing.

---

#### **7. Admin Role & Moderation Tables** (Post-MVP)

```sql
-- Add admin role to profiles
ALTER TABLE profiles DROP CONSTRAINT profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('umkm', 'creator', 'admin'));

-- Moderation table
CREATE TABLE moderation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_table TEXT,
    target_id UUID,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

**Benefit:** Track administrative actions; support moderation workflows.

---

## 18. Recommended Relationship Structure

### **Core One-to-One Relationships**

```
auth.users (Supabase managed)
    ‖ 1:1
profiles (discriminator: role='creator' or 'umkm')
    ├─ creator_profiles (if role='creator')
    │  └─ Each creator has exactly one creator profile
    │
    └─ business_profiles (if role='umkm')
       └─ Each UMKM has exactly one business profile
```

**Enforcement:** Unique FK constraint on `profile_id` in both extended tables.

---

### **Standard One-to-Many Relationships**

```
creator_profiles (1)
    ├──→ (N) services
    │   └─ Creator offers many services; each service belongs to one creator
    │
    ├──→ (N) portfolios
    │   └─ Creator can upload many portfolio items; each belongs to one creator
    │
    └──→ (N) reviews
        └─ Creator receives many reviews; each review is about one creator

business_profiles (1)
    └──→ (N) requests
        └─ UMKM creates many requests; each request belongs to one UMKM
```

**Enforcement:** Non-nullable FK without unique constraint.

---

### **Optional (Nullable) One-to-Many Relationships**

```
services (1)
    └──?→ (N) portfolios
    │   └─ Portfolio MAY link to a specific service (optional)
    │
    └──?→ (N) requests
        └─ Request MAY reference a specific service (optional)

creator_profiles (1)
    └──?→ (N) requests
        └─ Request MAY be assigned to a creator (optional; initially unassigned)
```

**Enforcement:** Nullable FK.

---

### **Many-to-Many Relationships**

```
profiles (N)
    ║
    ║ favorites (join table)
    ║
    (N) creator_profiles

Semantics:
    - User can favorite many creators
    - Creator can be favorited by many users
    - Unique(profile_id, creator_profile_id) prevents duplicate favorites
```

**Enforcement:** Join table with unique constraint.

---

### **Ownership Chains (For Access Control)**

**UMKM Ownership Path:**
```
auth.users (id=X) →[1:1]→ profiles (id=X, role='umkm')
    →[1:1]→ business_profiles (profile_id=X)
    →[1:N]→ requests (business_profile_id=*)
    →[N:M]→ favorites (profile_id=X)
```

**Creator Ownership Path:**
```
auth.users (id=Y) →[1:1]→ profiles (id=Y, role='creator')
    →[1:1]→ creator_profiles (profile_id=Y)
    →[1:N]→ services (creator_profile_id=*)
    →[1:N]→ portfolios (creator_profile_id=*)
    →[1:N]→ reviews (creator_profile_id=*)
```

**RLS Enforcement:**
- Queries check if `profiles.id == auth.uid()` before returning data.
- Complex queries for shared entities (e.g., requests visible to both UMKM and creator) use OR conditions.

---

### **Dependency Graph (What Cascades)**

```
auth.users deletion
    ↓ ON DELETE CASCADE
    profiles
        ├─ ON DELETE CASCADE
        │   ├─ creator_profiles
        │   │   ├─ services
        │   │   │   ├─ portfolios
        │   │   │   ├─ reviews (SET NULL for service_id)
        │   │   │   └─ requests (SET NULL for service_id)
        │   │   ├─ portfolios
        │   │   ├─ reviews (creator_profile_id)
        │   │   └─ requests (creator_profile_id → SET NULL)
        │   │
        │   ├─ business_profiles
        │   │   ├─ requests
        │   │   └─ favorites (profile_id side)
        │   │
        │   └─ favorites (profile_id side)
```

---

## 19. Priority Fix List for the Data Model

### **Must Fix Now (Blocking Issues)**

| Issue | Why | Fix | Effort |
|-------|-----|-----|--------|
| **Frontend Mock Data Integration** | Frontend is not calling backend APIs; still using mock data. | Integrate frontend `creatorService.js`, `favoriteService.js`, `portfolioService.js` to call backend. | High |
| **Rate Limiting / Aggregation** | Computing `ratingAvg` and `reviewCount` on every query is expensive. | Add materialized aggregate table or trigger-maintained denormalized column. | Medium |

---

### **Should Fix Soon (Within 1-2 Sprints)**

| Issue | Why | Fix | Effort |
|-------|-----|-----|--------|
| **Reviewer Tracking** | `reviewer_profile_id` mostly null; denormalized `reviewer_name` is weak. | Enforce `reviewer_profile_id` FK; enforce unique constraint per reviewer-creator pair. | Low |
| **Request Workflow Audit** | No history of status changes; cannot track who changed what when. | Add `request_status_history` table with timestamp and user tracking. | Medium |
| **Budget Range Normalization** | `requests.budget_range` is text; cannot range-filter efficiently. | Split into `budget_min` and `budget_max` numeric columns. | Low |
| **Admin Role** | System has no supervisory capability; cannot moderate content. | Add `admin` role; create moderation tables and RLS policies. | Medium |

---

### **Can Wait / Polish (Post-MVP)**

| Issue | Why | Fix | Effort |
|-------|-----|-----|--------|
| **Service Categories Table** | Categories inferred from titles; no separate entity. | Normalize categories into own table; reference from `services`. | Low |
| **Separate Platform Tables** | Platforms stored as TEXT arrays; less normalized. | Create `platforms` and join tables for consistency and efficient filtering. | Low |
| **Slug Naming Conflict Resolution** | Global slug uniqueness; possible routing conflicts. | Implement slug namespace per resource type or ensure URL router distinguishes context. | Low |
| **Media Tracking** | URLs stored in DB; no relationship to actual storage files. | Consider adding `media` or `assets` table if storage management becomes critical. | Medium |

---

## 20. Appendix: Database Reference Index

### **Table Names (Entities)**

- `auth.users` – Supabase managed users (external).
- `profiles` – Base user profile with role discriminator.
- `creator_profiles` – Extended profile for creators.
- `business_profiles` – Extended profile for UMKMs.
- `services` – Creator service offerings.
- `portfolios` – Portfolio items / examples.
- `reviews` – Ratings and feedback.
- `requests` – Collaboration briefs from UMKM to creator.
- `favorites` – Many-to-many: UMKM bookmarks creator.

---

### **Column Names (Fields)**

| Field | Table | Type | Notes |
|-------|-------|------|-------|
| `id` | All | UUID (PK) | Unique identifier. |
| `role` | profiles | TEXT CHECK | 'umkm' \| 'creator' |
| `name` | profiles | TEXT | User display name. |
| `email` | profiles | TEXT | User email (nullable). |
| `avatar_url` | profiles | TEXT | User avatar URL (nullable). |
| `profile_id` | creator_profiles, business_profiles | UUID (FK, unique) | Reference to profiles.id |
| `slug` | creator_profiles, services | TEXT (unique) | URL-friendly identifier. |
| `brand_name` | creator_profiles | TEXT | Creator's brand name. |
| `city` | creator_profiles, business_profiles | TEXT | Location. |
| `niche` | creator_profiles | TEXT | Creator's specialty. |
| `platforms` | creator_profiles, services | TEXT[] | Array of platform names. |
| `short_bio` | creator_profiles | TEXT | Brief bio. |
| `full_bio` | creator_profiles | TEXT | Extended bio. |
| `price_from` | creator_profiles | NUMERIC | Minimum service price. |
| `banner_url` | creator_profiles | TEXT | Creator profile banner. |
| `portfolio_url` | creator_profiles | TEXT | External portfolio link. |
| `social_links` | creator_profiles | JSONB | Social platform map. |
| `is_published` | creator_profiles | BOOLEAN | Public visibility flag. |
| `business_name` | business_profiles, requests (denorm) | TEXT | Business name. |
| `category` | business_profiles, portfolios | TEXT | Category name. |
| `description` | business_profiles, services | TEXT | Description text. |
| `main_product` | business_profiles | TEXT | Primary product. |
| `promotion_target` | business_profiles | TEXT | Promotion target. |
| `contact` | business_profiles | TEXT | Contact info. |
| `title` | services, portfolios, requests | TEXT | Title/name. |
| `short_description` | services | TEXT | Brief description. |
| `price` | services | NUMERIC | Service price. |
| `delivery_days` | services | INTEGER CHECK > 0 | Delivery time. |
| `revision_count` | services | INTEGER CHECK >= 0 | Allowed revisions. |
| `outputs` | services | TEXT[] | Deliverables list. |
| `is_active` | services | BOOLEAN | Visibility flag. |
| `creator_profile_id` | services, portfolios, reviews, requests (opt) | UUID (FK) | Creator reference. |
| `service_id` | portfolios, reviews, requests | UUID (FK, opt) | Service reference. |
| `thumbnail_url` | portfolios | TEXT | Portfolio preview image. |
| `platform` | portfolios | TEXT | Social platform. |
| `caption` | portfolios | TEXT | Description/caption. |
| `rating` | reviews | NUMERIC(2,1) CHECK 0-5 | Star rating (0.1 precision). |
| `comment` | reviews | TEXT | Review text. |
| `reviewer_profile_id` | reviews | UUID (FK, opt) | Reviewer reference (mostly unused). |
| `reviewer_name` | reviews | TEXT | Reviewer display name (denormalized). |
| `business_profile_id` | requests | UUID (FK) | Creating UMKM. |
| `product_name` | requests | TEXT | Product being promoted. |
| `promotion_goal` | requests | TEXT | Goal statement. |
| `target_audience` | requests | TEXT | Audience description. |
| `budget_range` | requests | TEXT | Budget text (e.g., "Rp500k-1M"). |
| `deadline` | requests | DATE | Project deadline. |
| `notes` | requests | TEXT | Additional notes. |
| `ai_draft` | requests | TEXT | AI-generated draft. |
| `status` | requests | TEXT CHECK | 'draft', 'submitted', 'reviewed', 'accepted', 'in_progress', 'done' |
| `created_at` | All | TIMESTAMPTZ (auto) | Creation timestamp. |
| `updated_at` | All | TIMESTAMPTZ (trigger) | Last update timestamp. |
| `profile_id` | favorites | UUID (FK) | User who favorited. |
| `creator_profile_id` | favorites | UUID (FK) | Creator being favorited. |

---

### **Constants and Enumerations**

| Name | File | Values | Usage |
|------|------|--------|-------|
| `ROLES.umkm` | [client/src/constants/roles.js](client/src/constants/roles.js) | 'umkm' | User role selector. |
| `ROLES.creator` | [client/src/constants/roles.js](client/src/constants/roles.js) | 'creator' | User role selector. |
| `nicheOptions` | [client/src/constants/filters.js](client/src/constants/filters.js) | Kuliner, Fashion, Kecantikan, Edukasi, Lifestyle, Travel | Creator niche filter. |
| `cityOptions` | [client/src/constants/filters.js](client/src/constants/filters.js) | Jakarta, Bandung, Surabaya, Yogyakarta, Semarang, Denpasar | Location filter. |
| `platformOptions` | [client/src/constants/filters.js](client/src/constants/filters.js) | Instagram, TikTok, YouTube, X | Platform filter. |
| `priceOptions` | [client/src/constants/filters.js](client/src/constants/filters.js) | 0-500k, 500k-1M, 1M-2M, 2M+ | Price range filter. |
| `ratingOptions` | [client/src/constants/filters.js](client/src/constants/filters.js) | 4.8, 4.5, 4.0 | Rating threshold filter. |
| `REQUEST_STATUS_*` | Inferred from schema | draft, submitted, reviewed, accepted, in_progress, done | Request workflow states. |

---

### **Helper Functions / Utilities**

| Name | File | Purpose |
|------|------|---------|
| `buildSlug()` | [client/src/utils/buildSlug.js](client/src/utils/buildSlug.js) | Generate URL slugs on frontend. |
| `buildUniqueSlug()` | [server/src/utils/slug.js](server/src/utils/slug.js) | Generate unique slugs on backend (appends UUID if collision). |
| `ratingSummary()` | [server/src/services/discovery.service.js](server/src/services/discovery.service.js) | Compute avg rating and count from reviews array. |
| `mapCreatorCard()` | [server/src/services/discovery.service.js](server/src/services/discovery.service.js) | Transform DB row to API response shape. |
| `mapCreatorDetail()` | [server/src/services/discovery.service.js](server/src/services/discovery.service.js) | Transform creator + services + portfolio + reviews to detail shape. |
| `mapServiceDetail()` | [server/src/services/discovery.service.js](server/src/services/discovery.service.js) | Transform service + creator + portfolio examples. |
| `mapBaseProfile()` | [server/src/services/profile.service.js](server/src/services/profile.service.js) | Transform profiles row to API response. |
| `mapCreatorProfile()` | [server/src/services/profile.service.js](server/src/services/profile.service.js) | Transform creator_profiles row to API response. |
| `mapBusinessProfile()` | [server/src/services/profile.service.js](server/src/services/profile.service.js) | Transform business_profiles row to API response. |
| `mapRequest()` | [server/src/services/request.service.js](server/src/services/request.service.js) | Transform requests row + joins to API response. |

---

### **RLS Policies**

| Table | Policy | Effect |
|-------|--------|--------|
| `profiles` | `profiles_select_own` | SELECT: `auth.uid() = id` |
| `profiles` | `profiles_insert_own` | INSERT: `auth.uid() = id` |
| `profiles` | `profiles_update_own` | UPDATE: `auth.uid() = id` |
| `creator_profiles` | `creator_profiles_public_select` | SELECT: `is_published = true OR profile_id = auth.uid()` |
| `creator_profiles` | `creator_profiles_insert_own` | INSERT: `profile_id = auth.uid()` |
| `creator_profiles` | `creator_profiles_update_own` | UPDATE: `profile_id = auth.uid()` |
| `business_profiles` | `business_profiles_select_own` | SELECT: `profile_id = auth.uid()` |
| `business_profiles` | `business_profiles_insert_own` | INSERT: `profile_id = auth.uid()` |
| `business_profiles` | `business_profiles_update_own` | UPDATE: `profile_id = auth.uid()` |
| `services` | `services_public_select` | SELECT: `is_active = true OR creator owns` |
| `services` | `services_manage_own` | ALL: Creator can only manage own |
| `portfolios` | `portfolios_public_select` | SELECT: Published creator or owner |
| `portfolios` | `portfolios_manage_own` | ALL: Creator can only manage own |
| `favorites` | `favorites_select_own` | SELECT: `profile_id = auth.uid()` |
| `favorites` | `favorites_insert_own` | INSERT/DELETE: `profile_id = auth.uid()` |
| `requests` | `requests_select_participants` | SELECT: UMKM owner OR assigned creator |
| `requests` | `requests_insert_business_owner` | INSERT: UMKM owner |
| `requests` | `requests_update_participants` | UPDATE: UMKM owner OR assigned creator |
| `reviews` | `reviews_public_select` | SELECT: All (public) |
| `reviews` | `reviews_insert_authenticated` | INSERT: Authenticated users only |

---

### **Key RLS Semantic Rules**

| Rule | Implementation | Data Protection |
|------|---|---|
| User can only see own profile | FK check + RLS SELECT policy | Prevents profile enumeration. |
| UMKM cannot see other UMKM's business profile | FK + RLS SELECT policy | Business info confidential. |
| Published creators are public discoverable | RLS with `is_published = true` OR owner check | Open marketplace discovery. |
| Favorites are personal; not visible to others | Profile FK + RLS SELECT on profile_id | Privacy of bookmarks. |
| Requests visible only to UMKM owner + assigned creator | OR condition in RLS UPDATE policy | Secure collaboration space. |
| Reviews are public | No ownership check in SELECT | Transparency for trust. |

---

### **Trigger Functions**

| Trigger | Table | Action | Effect |
|---------|-------|--------|--------|
| `set_profiles_updated_at` | profiles | BEFORE UPDATE | Sets `updated_at` to now(). |
| `set_creator_profiles_updated_at` | creator_profiles | BEFORE UPDATE | Sets `updated_at` to now(). |
| `set_business_profiles_updated_at` | business_profiles | BEFORE UPDATE | Sets `updated_at` to now(). |
| `set_services_updated_at` | services | BEFORE UPDATE | Sets `updated_at` to now(). |
| `set_portfolios_updated_at` | portfolios | BEFORE UPDATE | Sets `updated_at` to now(). |
| `set_requests_updated_at` | requests | BEFORE UPDATE | Sets `updated_at` to now(). |

---

### **Index Summary**

| Index | Table | Columns | Purpose |
|-------|-------|---------|---------|
| PK | profiles | id | Primary key. |
| PK | creator_profiles | id | Primary key. |
| UNIQUE FK | creator_profiles | profile_id | One creator profile per user. |
| UNIQUE | creator_profiles | slug | Slug uniqueness for URLs. |
| IDX | creator_profiles | niche | Niche discovery filtering. |
| IDX | creator_profiles | city | City discovery filtering. |
| IDX | creator_profiles | price_from | Price range filtering. |
| PK | business_profiles | id | Primary key. |
| UNIQUE FK | business_profiles | profile_id | One business profile per user. |
| PK | services | id | Primary key. |
| UNIQUE | services | slug | Slug uniqueness for URLs. |
| IDX | services | creator_profile_id | Services by creator. |
| PK | portfolios | id | Primary key. |
| IDX | portfolios | creator_profile_id | Portfolios by creator. |
| PK | favorites | id | Primary key. |
| IDX | favorites | profile_id | User's favorites list. |
| UNIQUE | favorites | (profile_id, creator_profile_id) | No duplicate favorites. |
| PK | requests | id | Primary key. |
| IDX | requests | business_profile_id | Requests by UMKM. |
| IDX | requests | creator_profile_id | Requests to creator. |
| PK | reviews | id | Primary key. |
| IDX | reviews | creator_profile_id | Reviews for creator. |

---

### **Ownership Terminology**

| Term | Meaning | Enforcement |
|------|---------|-------------|
| **Owned By** | User has full CRUD rights; RLS enforces single-owner access | FK to profiles.id + RLS policies |
| **Associated With** | Entity links to another but not exclusively owned | FK without unique constraint |
| **Bookmarked** | User has saved/favorited reference (many-to-many) | Join table in `favorites` |
| **Public** | Anyone can view (authenticated or not) | RLS allows all SELECTs |
| **Private** | Only owner can view | RLS allows SELECT if owner |
| **Unassigned** | Optional reference; may be null initially | Nullable FK |

---

### **File Path Quick Reference**

| Artifact | File Path |
|----------|-----------|
| SQL Schema | [supabase/migrations/20260413143000_backend_mvp_schema.sql](supabase/migrations/20260413143000_backend_mvp_schema.sql) |
| Role Constants | [client/src/constants/roles.js](client/src/constants/roles.js) |
| Filter Constants | [client/src/constants/filters.js](client/src/constants/filters.js) |
| Mock Data | [client/src/data/mockData.js](client/src/data/mockData.js) |
| Auth Service | [server/src/services/auth.service.js](server/src/services/auth.service.js) |
| Profile Service | [server/src/services/profile.service.js](server/src/services/profile.service.js) |
| Discovery Service | [server/src/services/discovery.service.js](server/src/services/discovery.service.js) |
| Favorite Service | [server/src/services/favorite.service.js](server/src/services/favorite.service.js) |
| Request Service | [server/src/services/request.service.js](server/src/services/request.service.js) |
| Auth Validators | [server/src/validators/auth.validators.js](server/src/validators/auth.validators.js) |
| Profile Validators | [server/src/validators/profile.validators.js](server/src/validators/profile.validators.js) |
| Frontend Slug Util | [client/src/utils/buildSlug.js](client/src/utils/buildSlug.js) |
| Backend Slug Util | [server/src/utils/slug.js](server/src/utils/slug.js) |

---

**End of Database Analysis**
