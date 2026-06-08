create policy "Creators can read paid assigned briefs"
  on campaign_briefs for select
  using (
    exists (
      select 1
      from orders
      where orders.campaign_brief_id = campaign_briefs.id
        and orders.creator_id = current_creator_profile_id()
        and orders.payment_status = 'paid'
    )
  );

create or replace function accept_creator_order(target_order_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_creator_id uuid;
  v_order_id uuid;
begin
  if v_user_id is null then
    raise exception 'not_authenticated';
  end if;

  select cp.id
  into v_creator_id
  from creator_profiles cp
  join profiles p on p.id = cp.user_id
  where cp.user_id = v_user_id
    and p.role = 'creator'
    and p.account_status = 'active'
  limit 1;

  if v_creator_id is null then
    raise exception 'not_creator';
  end if;

  select id
  into v_order_id
  from orders
  where id = target_order_id
    and creator_id = v_creator_id
    and payment_status = 'paid'
    and order_status = 'waiting_creator_confirmation'
  for update;

  if v_order_id is null then
    raise exception 'order_not_acceptable';
  end if;

  update orders
  set order_status = 'brief_accepted'
  where id = target_order_id;

  insert into order_status_history (
    order_id,
    previous_status,
    new_status,
    changed_by,
    note
  )
  values (
    target_order_id,
    'waiting_creator_confirmation',
    'brief_accepted',
    v_user_id,
    'Brief diterima oleh kreator'
  );

  return target_order_id;
end;
$$;

create or replace function start_creator_order(target_order_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_creator_id uuid;
  v_order_id uuid;
begin
  if v_user_id is null then
    raise exception 'not_authenticated';
  end if;

  select cp.id
  into v_creator_id
  from creator_profiles cp
  join profiles p on p.id = cp.user_id
  where cp.user_id = v_user_id
    and p.role = 'creator'
    and p.account_status = 'active'
  limit 1;

  if v_creator_id is null then
    raise exception 'not_creator';
  end if;

  select id
  into v_order_id
  from orders
  where id = target_order_id
    and creator_id = v_creator_id
    and payment_status = 'paid'
    and order_status = 'brief_accepted'
  for update;

  if v_order_id is null then
    raise exception 'order_not_startable';
  end if;

  update orders
  set order_status = 'in_progress'
  where id = target_order_id;

  insert into order_status_history (
    order_id,
    previous_status,
    new_status,
    changed_by,
    note
  )
  values (
    target_order_id,
    'brief_accepted',
    'in_progress',
    v_user_id,
    'Kreator mulai mengerjakan konten'
  );

  return target_order_id;
end;
$$;

revoke execute on function accept_creator_order(uuid) from public;
revoke execute on function start_creator_order(uuid) from public;
grant execute on function accept_creator_order(uuid) to authenticated;
grant execute on function start_creator_order(uuid) to authenticated;
