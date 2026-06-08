alter table profiles enable row level security;
alter table umkm_profiles enable row level security;
alter table creator_profiles enable row level security;

create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from profiles
    where id = auth.uid()
      and role = 'admin'
      and account_status = 'active'
  );
$$;

create or replace function is_active_profile(target_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from profiles
    where id = target_user_id
      and account_status = 'active'
  );
$$;

drop policy if exists "Users can view own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;
drop policy if exists "Users can update own profile fields" on profiles;
drop policy if exists "Admins can read profiles" on profiles;

drop policy if exists "Users can view own umkm profile" on umkm_profiles;
drop policy if exists "Users can update own umkm profile" on umkm_profiles;
drop policy if exists "Admins can read umkm profiles" on umkm_profiles;

drop policy if exists "Public can view active creators" on creator_profiles;
drop policy if exists "Creators can read own creator profile" on creator_profiles;
drop policy if exists "Creators can update own profile" on creator_profiles;
drop policy if exists "Admins can read creator profiles" on creator_profiles;

create policy "Users can view own profile"
  on profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update own profile fields"
  on profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admins can read profiles"
  on profiles for select
  to authenticated
  using (is_admin());

create policy "Users can view own umkm profile"
  on umkm_profiles for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can update own umkm profile"
  on umkm_profiles for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Admins can read umkm profiles"
  on umkm_profiles for select
  to authenticated
  using (is_admin());

create policy "Public can view active creators"
  on creator_profiles for select
  to anon, authenticated
  using (is_active_profile(user_id));

create policy "Creators can read own creator profile"
  on creator_profiles for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Creators can update own profile"
  on creator_profiles for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Admins can read creator profiles"
  on creator_profiles for select
  to authenticated
  using (is_admin());
