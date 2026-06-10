create or replace function public.current_creator_profile_id()
returns uuid
language sql
security definer
set search_path = public
as $$
  select id
  from creator_profiles
  where user_id = auth.uid()
  limit 1;
$$;

alter table service_packages enable row level security;
alter table service_package_tiers enable row level security;

drop policy if exists "Creators can read own service packages" on service_packages;
create policy "Creators can read own service packages"
  on service_packages for select
  to authenticated
  using (creator_id = public.current_creator_profile_id());

drop policy if exists "Creators can create own service packages" on service_packages;
create policy "Creators can create own service packages"
  on service_packages for insert
  to authenticated
  with check (creator_id = public.current_creator_profile_id());

drop policy if exists "Creators can update own service packages" on service_packages;
create policy "Creators can update own service packages"
  on service_packages for update
  to authenticated
  using (creator_id = public.current_creator_profile_id())
  with check (creator_id = public.current_creator_profile_id());

drop policy if exists "Creators can read own service package tiers" on service_package_tiers;
create policy "Creators can read own service package tiers"
  on service_package_tiers for select
  to authenticated
  using (
    exists (
      select 1
      from service_packages
      where service_packages.id = service_package_tiers.service_package_id
        and service_packages.creator_id = public.current_creator_profile_id()
    )
  );

drop policy if exists "Creators can create tiers for own services" on service_package_tiers;
create policy "Creators can create tiers for own services"
  on service_package_tiers for insert
  to authenticated
  with check (
    exists (
      select 1
      from service_packages
      where service_packages.id = service_package_tiers.service_package_id
        and service_packages.creator_id = public.current_creator_profile_id()
    )
  );

drop policy if exists "Creators can update tiers for own services" on service_package_tiers;
create policy "Creators can update tiers for own services"
  on service_package_tiers for update
  to authenticated
  using (
    exists (
      select 1
      from service_packages
      where service_packages.id = service_package_tiers.service_package_id
        and service_packages.creator_id = public.current_creator_profile_id()
    )
  )
  with check (
    exists (
      select 1
      from service_packages
      where service_packages.id = service_package_tiers.service_package_id
        and service_packages.creator_id = public.current_creator_profile_id()
    )
  );
