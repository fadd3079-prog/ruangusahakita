drop policy "Public can view active service package tiers" on service_package_tiers;
create policy "Public can view active service package tiers"
  on service_package_tiers for select
  using (
    is_active = true
    and exists (
      select 1
      from service_packages
      where service_packages.id = service_package_tiers.service_package_id
        and service_packages.is_active = true
        and service_packages.deleted_at is null
    )
  );

drop policy "Public can view active service addons" on service_addons;
create policy "Public can view active service addons"
  on service_addons for select
  using (
    is_active = true
    and exists (
      select 1
      from service_packages
      where service_packages.id = service_addons.service_package_id
        and service_packages.is_active = true
        and service_packages.deleted_at is null
    )
  );

create policy "Creators can create own service packages"
  on service_packages for insert
  with check (creator_id = current_creator_profile_id());

create policy "Creators can update own service packages"
  on service_packages for update
  using (creator_id = current_creator_profile_id())
  with check (creator_id = current_creator_profile_id());

create policy "Creators can create tiers for own services"
  on service_package_tiers for insert
  with check (
    exists (
      select 1
      from service_packages
      where service_packages.id = service_package_tiers.service_package_id
        and service_packages.creator_id = current_creator_profile_id()
    )
  );

create policy "Creators can update tiers for own services"
  on service_package_tiers for update
  using (
    exists (
      select 1
      from service_packages
      where service_packages.id = service_package_tiers.service_package_id
        and service_packages.creator_id = current_creator_profile_id()
    )
  )
  with check (
    exists (
      select 1
      from service_packages
      where service_packages.id = service_package_tiers.service_package_id
        and service_packages.creator_id = current_creator_profile_id()
    )
  );
