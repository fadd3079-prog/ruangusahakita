create or replace function mark_sandbox_payment_as_paid(target_payment_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_umkm_id uuid;
  v_order_id uuid;
  v_payment_amount numeric(12,2);
  v_order_total numeric(12,2);
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

  select p.order_id, p.amount, o.total_amount
  into v_order_id, v_payment_amount, v_order_total
  from payments p
  join orders o on o.id = p.order_id
  where p.id = target_payment_id
    and o.umkm_id = v_umkm_id
    and p.payment_status = 'pending'
    and o.payment_status = 'pending'
    and o.order_status = 'awaiting_payment'
  for update of p, o;

  if v_order_id is null then
    raise exception 'payment_not_payable';
  end if;

  if v_payment_amount <> v_order_total then
    raise exception 'payment_amount_mismatch';
  end if;

  update payments
  set payment_status = 'paid',
      paid_at = now()
  where id = target_payment_id;

  update orders
  set payment_status = 'paid',
      order_status = 'waiting_creator_confirmation'
  where id = v_order_id;

  update invoices
  set paid_at = now()
  where payment_id = target_payment_id
    and order_id = v_order_id;

  insert into order_status_history (
    order_id,
    previous_status,
    new_status,
    changed_by,
    note
  )
  values (
    v_order_id,
    'awaiting_payment',
    'waiting_creator_confirmation',
    v_user_id,
    'Pembayaran sandbox berhasil diproses'
  );

  return v_order_id;
end;
$$;

revoke execute on function mark_sandbox_payment_as_paid(uuid) from public;
grant execute on function mark_sandbox_payment_as_paid(uuid) to authenticated;
