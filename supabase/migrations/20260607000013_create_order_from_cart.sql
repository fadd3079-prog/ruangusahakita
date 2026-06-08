create or replace function create_order_from_current_cart()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_umkm_id uuid;
  v_cart_id uuid;
  v_brief_id uuid;
  v_order_id uuid := gen_random_uuid();
  v_payment_id uuid := gen_random_uuid();
  v_invoice_id uuid := gen_random_uuid();
  v_creator_id uuid;
  v_item_count integer;
  v_creator_count integer;
  v_subtotal numeric(12,2);
  v_addon_total numeric(12,2);
  v_admin_fee numeric(12,2) := 5000;
  v_platform_fee numeric(12,2);
  v_total numeric(12,2);
  v_deadline date;
  v_order_number text;
  v_payment_number text;
  v_invoice_number text;
  v_item record;
  v_order_item_id uuid;
begin
  if v_user_id is null then
    raise exception 'not_authenticated';
  end if;

  select up.id
  into v_umkm_id
  from umkm_profiles up
  join profiles p on p.id = up.user_id
  where up.user_id = v_user_id
    and p.role = 'umkm'
    and p.account_status = 'active'
  limit 1;

  if v_umkm_id is null then
    raise exception 'not_umkm';
  end if;

  select c.id
  into v_cart_id
  from carts c
  where c.umkm_id = v_umkm_id
    and c.status = 'active'
  order by c.created_at desc
  limit 1
  for update;

  if v_cart_id is null then
    raise exception 'cart_empty';
  end if;

  select count(*), count(distinct ci.creator_id)
  into v_item_count, v_creator_count
  from cart_items ci
  where ci.cart_id = v_cart_id;

  if v_item_count = 0 then
    raise exception 'cart_empty';
  end if;

  if v_creator_count <> 1 then
    raise exception 'single_creator_required';
  end if;

  select ci.creator_id
  into v_creator_id
  from cart_items ci
  where ci.cart_id = v_cart_id
  limit 1;

  select cb.id
  into v_brief_id
  from campaign_briefs cb
  where cb.umkm_id = v_umkm_id
    and cb.order_id is null
    and length(trim(cb.business_name)) > 0
    and length(trim(cb.promoted_product)) > 0
    and length(trim(cb.campaign_goal)) > 0
  order by cb.updated_at desc
  limit 1
  for update;

  if v_brief_id is null then
    raise exception 'brief_required';
  end if;

  if exists (
    select 1
    from cart_items ci
    left join service_packages sp on sp.id = ci.service_package_id
    left join service_package_tiers spt on spt.id = ci.tier_id
    where ci.cart_id = v_cart_id
      and (
        sp.id is null
        or sp.is_active is not true
        or sp.deleted_at is not null
        or sp.creator_id <> ci.creator_id
        or spt.id is null
        or spt.service_package_id <> sp.id
        or spt.is_active is not true
      )
  ) then
    raise exception 'service_unavailable';
  end if;

  if exists (
    select 1
    from cart_item_addons cia
    join cart_items ci on ci.id = cia.cart_item_id
    left join service_addons sa on sa.id = cia.addon_id
    where ci.cart_id = v_cart_id
      and (
        sa.id is null
        or sa.service_package_id <> ci.service_package_id
        or sa.is_active is not true
      )
  ) then
    raise exception 'addon_unavailable';
  end if;

  select coalesce(sum(spt.price), 0), current_date + (coalesce(max(spt.estimated_days), 3)::integer)
  into v_subtotal, v_deadline
  from cart_items ci
  join service_package_tiers spt on spt.id = ci.tier_id
  where ci.cart_id = v_cart_id;

  select coalesce(sum(sa.price), 0)
  into v_addon_total
  from cart_item_addons cia
  join cart_items ci on ci.id = cia.cart_item_id
  join service_addons sa on sa.id = cia.addon_id
  where ci.cart_id = v_cart_id;

  v_platform_fee := round((v_subtotal + v_addon_total) * 0.10, 2);
  v_total := v_subtotal + v_addon_total + v_admin_fee;
  v_order_number := 'RUK-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(replace(v_order_id::text, '-', ''), 1, 8));
  v_payment_number := 'PAY-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(replace(v_payment_id::text, '-', ''), 1, 8));
  v_invoice_number := 'INV-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(replace(v_invoice_id::text, '-', ''), 1, 8));

  insert into orders (
    id,
    order_number,
    umkm_id,
    creator_id,
    campaign_brief_id,
    order_status,
    payment_status,
    subtotal_amount,
    addon_amount,
    admin_fee,
    platform_fee,
    discount_amount,
    total_amount,
    deadline
  )
  values (
    v_order_id,
    v_order_number,
    v_umkm_id,
    v_creator_id,
    v_brief_id,
    'awaiting_payment',
    'pending',
    v_subtotal,
    v_addon_total,
    v_admin_fee,
    v_platform_fee,
    0,
    v_total,
    v_deadline
  );

  for v_item in
    select
      ci.id,
      ci.service_package_id,
      ci.tier_id,
      sp.title as service_title,
      spt.name as tier_name,
      spt.price as tier_price,
      spt.estimated_days,
      spt.revision_count,
      coalesce(spt.deliverables, sp.deliverables, array[]::text[]) as deliverables,
      coalesce((
        select sum(sa.price)
        from cart_item_addons cia
        join service_addons sa on sa.id = cia.addon_id
        where cia.cart_item_id = ci.id
      ), 0) as item_addon_total
    from cart_items ci
    join service_packages sp on sp.id = ci.service_package_id
    join service_package_tiers spt on spt.id = ci.tier_id
    where ci.cart_id = v_cart_id
    order by ci.created_at asc
  loop
    v_order_item_id := gen_random_uuid();

    insert into order_items (
      id,
      order_id,
      service_package_id,
      tier_id,
      service_title,
      tier_name,
      unit_price,
      addon_total,
      subtotal,
      estimated_days,
      revision_count,
      deliverables
    )
    values (
      v_order_item_id,
      v_order_id,
      v_item.service_package_id,
      v_item.tier_id,
      v_item.service_title,
      v_item.tier_name,
      v_item.tier_price,
      v_item.item_addon_total,
      v_item.tier_price + v_item.item_addon_total,
      v_item.estimated_days,
      v_item.revision_count,
      v_item.deliverables
    );

    insert into order_item_addons (
      order_item_id,
      addon_name,
      price
    )
    select
      v_order_item_id,
      sa.name,
      sa.price
    from cart_item_addons cia
    join service_addons sa on sa.id = cia.addon_id
    where cia.cart_item_id = v_item.id;
  end loop;

  insert into payments (
    id,
    order_id,
    payment_number,
    payment_status,
    payment_method,
    amount,
    provider
  )
  values (
    v_payment_id,
    v_order_id,
    v_payment_number,
    'pending',
    'manual',
    v_total,
    'dummy'
  );

  insert into invoices (
    id,
    order_id,
    payment_id,
    invoice_number,
    subtotal_amount,
    addon_amount,
    admin_fee,
    platform_fee,
    discount_amount,
    total_amount
  )
  values (
    v_invoice_id,
    v_order_id,
    v_payment_id,
    v_invoice_number,
    v_subtotal,
    v_addon_total,
    v_admin_fee,
    v_platform_fee,
    0,
    v_total
  );

  insert into order_status_history (
    order_id,
    previous_status,
    new_status,
    changed_by,
    note
  )
  values (
    v_order_id,
    null,
    'awaiting_payment',
    v_user_id,
    'Order dibuat dari cart dan brief campaign'
  );

  update campaign_briefs
  set order_id = v_order_id,
      status = 'linked_to_order'
  where id = v_brief_id
    and umkm_id = v_umkm_id;

  update carts
  set status = 'checked_out'
  where id = v_cart_id
    and umkm_id = v_umkm_id;

  return v_order_id;
end;
$$;

revoke execute on function create_order_from_current_cart() from public;
grant execute on function create_order_from_current_cart() to authenticated;
