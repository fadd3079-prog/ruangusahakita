-- Minimum RLS Policies for Profiles
-- This ensures users can only read their own secure data, but public data remains accessible where appropriate.

-- 1. Enable RLS on core profile tables
alter table profiles enable row level security;
alter table umkm_profiles enable row level security;
alter table creator_profiles enable row level security;

-- 2. Profiles Table Policies
-- Users can read their own profile
create policy "Users can view own profile" 
  on profiles for select 
  using (auth.uid() = id);

-- Users can update their own profile (with secure columns only, but for now we allow standard updates)
-- We restrict updating the 'role' column via application logic (admin client).
create policy "Users can update own profile" 
  on profiles for update 
  using (auth.uid() = id);

-- 3. UMKM Profiles Table Policies
-- Users can read their own umkm profile
create policy "Users can view own umkm profile" 
  on umkm_profiles for select 
  using (auth.uid() = user_id);

-- Users can update their own umkm profile
create policy "Users can update own umkm profile" 
  on umkm_profiles for update 
  using (auth.uid() = user_id);

-- 4. Creator Profiles Table Policies
-- Public can view active creator profiles (needed for catalog)
create policy "Public can view active creators" 
  on creator_profiles for select 
  using (true); -- Later we can restrict to is_verified = true or similar, but true is okay for MVP reading

-- Creators can update their own profile
create policy "Creators can update own profile" 
  on creator_profiles for update 
  using (auth.uid() = user_id);

-- Note: Admin access bypasses RLS entirely because the Admin Client uses the service_role key.
-- Insertions during registration also use the Admin Client to bypass RLS, ensuring users
-- cannot tamper with their initial role assignment during the signup phase.
