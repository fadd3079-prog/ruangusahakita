drop policy if exists "Admins can read carts" on carts;
drop policy if exists "Admins can read cart items" on cart_items;
drop policy if exists "Admins can read cart item addons" on cart_item_addons;
drop policy if exists "Creators can read assigned briefs" on campaign_briefs;
drop policy if exists "Admins can read briefs" on campaign_briefs;

create policy "UMKM can create own carts"
  on carts for insert
  with check (umkm_id = current_umkm_profile_id());

create policy "UMKM can update own carts"
  on carts for update
  using (umkm_id = current_umkm_profile_id())
  with check (umkm_id = current_umkm_profile_id());

create policy "UMKM can delete own carts"
  on carts for delete
  using (umkm_id = current_umkm_profile_id());

create policy "UMKM can create own cart items"
  on cart_items for insert
  with check (
    exists (
      select 1
      from carts
      where carts.id = cart_items.cart_id
        and carts.umkm_id = current_umkm_profile_id()
        and carts.status = 'active'
    )
    and exists (
      select 1
      from service_packages
      where service_packages.id = cart_items.service_package_id
        and service_packages.creator_id = cart_items.creator_id
        and service_packages.is_active = true
        and service_packages.deleted_at is null
    )
    and (
      cart_items.tier_id is null
      or exists (
        select 1
        from service_package_tiers
        where service_package_tiers.id = cart_items.tier_id
          and service_package_tiers.service_package_id = cart_items.service_package_id
          and service_package_tiers.is_active = true
      )
    )
  );

create policy "UMKM can update own cart items"
  on cart_items for update
  using (
    exists (
      select 1
      from carts
      where carts.id = cart_items.cart_id
        and carts.umkm_id = current_umkm_profile_id()
        and carts.status = 'active'
    )
  )
  with check (
    exists (
      select 1
      from carts
      where carts.id = cart_items.cart_id
        and carts.umkm_id = current_umkm_profile_id()
        and carts.status = 'active'
    )
    and exists (
      select 1
      from service_packages
      where service_packages.id = cart_items.service_package_id
        and service_packages.creator_id = cart_items.creator_id
        and service_packages.is_active = true
        and service_packages.deleted_at is null
    )
    and (
      cart_items.tier_id is null
      or exists (
        select 1
        from service_package_tiers
        where service_package_tiers.id = cart_items.tier_id
          and service_package_tiers.service_package_id = cart_items.service_package_id
          and service_package_tiers.is_active = true
      )
    )
  );

create policy "UMKM can delete own cart items"
  on cart_items for delete
  using (
    exists (
      select 1
      from carts
      where carts.id = cart_items.cart_id
        and carts.umkm_id = current_umkm_profile_id()
        and carts.status = 'active'
    )
  );

create policy "UMKM can create own cart item addons"
  on cart_item_addons for insert
  with check (
    exists (
      select 1
      from cart_items
      join carts on carts.id = cart_items.cart_id
      join service_addons on service_addons.id = cart_item_addons.addon_id
      where cart_items.id = cart_item_addons.cart_item_id
        and carts.umkm_id = current_umkm_profile_id()
        and carts.status = 'active'
        and service_addons.service_package_id = cart_items.service_package_id
        and service_addons.is_active = true
    )
  );

create policy "UMKM can update own cart item addons"
  on cart_item_addons for update
  using (
    exists (
      select 1
      from cart_items
      join carts on carts.id = cart_items.cart_id
      where cart_items.id = cart_item_addons.cart_item_id
        and carts.umkm_id = current_umkm_profile_id()
        and carts.status = 'active'
    )
  )
  with check (
    exists (
      select 1
      from cart_items
      join carts on carts.id = cart_items.cart_id
      join service_addons on service_addons.id = cart_item_addons.addon_id
      where cart_items.id = cart_item_addons.cart_item_id
        and carts.umkm_id = current_umkm_profile_id()
        and carts.status = 'active'
        and service_addons.service_package_id = cart_items.service_package_id
        and service_addons.is_active = true
    )
  );

create policy "UMKM can delete own cart item addons"
  on cart_item_addons for delete
  using (
    exists (
      select 1
      from cart_items
      join carts on carts.id = cart_items.cart_id
      where cart_items.id = cart_item_addons.cart_item_id
        and carts.umkm_id = current_umkm_profile_id()
        and carts.status = 'active'
    )
  );

create policy "UMKM can create own briefs"
  on campaign_briefs for insert
  with check (
    umkm_id = current_umkm_profile_id()
    and order_id is null
  );

create policy "UMKM can update own draft briefs"
  on campaign_briefs for update
  using (
    umkm_id = current_umkm_profile_id()
    and order_id is null
  )
  with check (
    umkm_id = current_umkm_profile_id()
    and order_id is null
  );
