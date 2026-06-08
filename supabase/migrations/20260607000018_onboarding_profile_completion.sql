alter table profiles
  add column if not exists onboarding_completed boolean not null default false,
  add column if not exists onboarding_skipped_at timestamptz;

create or replace function is_public_creator_profile(target_user_id uuid)
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
      and onboarding_completed = true
  );
$$;

drop policy if exists "Public can view active creators" on creator_profiles;
create policy "Public can view active creators"
  on creator_profiles for select
  to anon, authenticated
  using (is_public_creator_profile(user_id));

drop policy if exists "Public can view active service packages" on service_packages;
create policy "Public can view active service packages"
  on service_packages for select
  to anon, authenticated
  using (
    is_active = true
    and deleted_at is null
    and exists (
      select 1
      from creator_profiles
      where creator_profiles.id = service_packages.creator_id
        and is_public_creator_profile(creator_profiles.user_id)
    )
  );

drop policy if exists "Public can view active service package tiers" on service_package_tiers;
create policy "Public can view active service package tiers"
  on service_package_tiers for select
  to anon, authenticated
  using (
    is_active = true
    and exists (
      select 1
      from service_packages
      join creator_profiles on creator_profiles.id = service_packages.creator_id
      where service_packages.id = service_package_tiers.service_package_id
        and service_packages.is_active = true
        and service_packages.deleted_at is null
        and is_public_creator_profile(creator_profiles.user_id)
    )
  );

drop policy if exists "Public can view active service addons" on service_addons;
create policy "Public can view active service addons"
  on service_addons for select
  to anon, authenticated
  using (
    is_active = true
    and exists (
      select 1
      from service_packages
      join creator_profiles on creator_profiles.id = service_packages.creator_id
      where service_packages.id = service_addons.service_package_id
        and service_packages.is_active = true
        and service_packages.deleted_at is null
        and is_public_creator_profile(creator_profiles.user_id)
    )
  );

drop policy if exists "Public can view non-deleted portfolios" on portfolios;
create policy "Public can view non-deleted portfolios"
  on portfolios for select
  to anon, authenticated
  using (
    deleted_at is null
    and exists (
      select 1
      from creator_profiles
      where creator_profiles.id = portfolios.creator_id
        and is_public_creator_profile(creator_profiles.user_id)
    )
  );
