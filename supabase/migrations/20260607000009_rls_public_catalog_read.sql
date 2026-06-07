-- Migration: RLS Public Catalog Read
-- Objective: Allow public (anon/guest) users to read active catalog data.

-- 1. Service Categories
alter table service_categories enable row level security;
create policy "Public can view active service categories"
  on service_categories for select
  using (is_active = true);

-- 2. Service Packages
alter table service_packages enable row level security;
create policy "Public can view active service packages"
  on service_packages for select
  using (is_active = true and deleted_at is null);

-- 3. Service Package Tiers
alter table service_package_tiers enable row level security;
create policy "Public can view active service package tiers"
  on service_package_tiers for select
  using (is_active = true);

-- 4. Service Add-ons
alter table service_addons enable row level security;
create policy "Public can view active service addons"
  on service_addons for select
  using (is_active = true);

-- 5. Portfolios
alter table portfolios enable row level security;
create policy "Public can view non-deleted portfolios"
  on portfolios for select
  using (deleted_at is null);

-- Note: Policies for Profiles and Creator Profiles were already handled in previous migrations 
-- (000007 and 000008). 
-- Public can already read active creators whose account_status is 'active'.
