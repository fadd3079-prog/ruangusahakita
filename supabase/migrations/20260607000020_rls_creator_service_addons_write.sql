drop policy if exists "Creators can create addons for own services" on service_addons;
create policy "Creators can create addons for own services"
  on service_addons for insert
  to authenticated
  with check (
    exists (
      select 1
      from service_packages
      where service_packages.id = service_addons.service_package_id
        and service_packages.creator_id = current_creator_profile_id()
        and service_packages.deleted_at is null
    )
  );

drop policy if exists "Creators can update addons for own services" on service_addons;
create policy "Creators can update addons for own services"
  on service_addons for update
  to authenticated
  using (
    exists (
      select 1
      from service_packages
      where service_packages.id = service_addons.service_package_id
        and service_packages.creator_id = current_creator_profile_id()
        and service_packages.deleted_at is null
    )
  )
  with check (
    exists (
      select 1
      from service_packages
      where service_packages.id = service_addons.service_package_id
        and service_packages.creator_id = current_creator_profile_id()
        and service_packages.deleted_at is null
    )
  );

drop policy if exists "Creators can delete addons for own services" on service_addons;
create policy "Creators can delete addons for own services"
  on service_addons for delete
  to authenticated
  using (
    exists (
      select 1
      from service_packages
      where service_packages.id = service_addons.service_package_id
        and service_packages.creator_id = current_creator_profile_id()
        and service_packages.deleted_at is null
    )
  );
