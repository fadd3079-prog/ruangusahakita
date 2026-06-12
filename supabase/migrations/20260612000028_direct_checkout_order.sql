create or replace function create_order_from_direct_selection(
  p_service_id uuid,
  p_tier_id uuid,
  p_addon_ids uuid[] default array[]::uuid[]
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_umkm_id uuid;
  v_brief_id uuid;
  v_order_id uuid := gen_random_uuid();
  v_order_item_id uuid := gen_random_uuid();
  v_payment_id uuid := gen_random_uuid();
  v_invoice_id uuid := gen_random_uuid();
  v_creator_id uuid;
  v_service_title text;
  v_tier_name text;
  v_tier_price numeric(12,2);
  v_estimated_days integer;
  v_revision_count integer;
  v_deliverables text[];
  v_addon_ids uuid[] := coalesce(p_addon_ids, array[]::uuid[]);
  v_addon_total numeric(12,2) := 0;
  v_admin_fee numeric(12,2) := 5000;
  v_platform_fee numeric(12,2);
  v_total numeric(12,2);
  v_deadline date;
  v_order_number text;
  v_payment_number text;
  v_invoice_number text;
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

  select
    sp.creator_id,
    sp.title,
    spt.name,
    spt.price,
    spt.estimated_days,
    spt.revision_count,
    coalesce(spt.deliverables, sp.deliverables, array[]::text[])
  into
    v_creator_id,
    v_service_title,
    v_tier_name,
    v_tier_price,
    v_estimated_days,
    v_revision_count,
    v_deliverables
  from service_packages sp
  join service_package_tiers spt on spt.service_package_id = sp.id
  where sp.id = p_service_id
    and sp.is_active is true
    and sp.deleted_at is null
    and spt.id = p_tier_id
    and spt.is_active is true
  limit 1;

  if v_creator_id is null then
    raise exception 'service_unavailable';
  end if;

  if exists (
    select selected.id
    from unnest(v_addon_ids) as selected(id)
    left join service_addons sa
      on sa.id = selected.id
      and sa.service_package_id = p_service_id
      and sa.is_active is true
    where sa.id is null
  ) then
    raise exception 'addon_unavailable';
  end if;

  select coalesce(sum(sa.price), 0)
  into v_addon_total
  from service_addons sa
  where sa.id = any(v_addon_ids)
    and sa.service_package_id = p_service_id
    and sa.is_active is true;

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

  v_platform_fee := round((v_tier_price + v_addon_total) * 0.10, 2);
  v_total := v_tier_price + v_addon_total + v_admin_fee;
  v_deadline := current_date + coalesce(v_estimated_days, 3);
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
    v_tier_price,
    v_addon_total,
    v_admin_fee,
    v_platform_fee,
    0,
    v_total,
    v_deadline
  );

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
    p_service_id,
    p_tier_id,
    v_service_title,
    v_tier_name,
    v_tier_price,
    v_addon_total,
    v_tier_price + v_addon_total,
    v_estimated_days,
    v_revision_count,
    v_deliverables
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
  from service_addons sa
  where sa.id = any(v_addon_ids)
    and sa.service_package_id = p_service_id
    and sa.is_active is true;

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
    'manual'
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
    v_tier_price,
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
    'Order dibuat dari checkout langsung dan brief campaign'
  );

  update campaign_briefs
  set order_id = v_order_id,
      status = 'linked_to_order'
  where id = v_brief_id
    and umkm_id = v_umkm_id;

  return v_order_id;
end;
$$;

revoke execute on function create_order_from_direct_selection(uuid, uuid, uuid[]) from public;
grant execute on function create_order_from_direct_selection(uuid, uuid, uuid[]) to authenticated;
