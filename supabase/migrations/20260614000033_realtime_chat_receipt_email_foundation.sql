alter table public.messages
  add column if not exists read_at timestamptz;

create index if not exists messages_order_created_idx
  on public.messages(order_id, created_at);

create or replace function public.mark_order_messages_read(target_order_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_order_id uuid;
begin
  if v_user_id is null then
    raise exception 'not_authenticated';
  end if;

  select orders.id
  into v_order_id
  from orders
  where orders.id = target_order_id
    and (
      orders.umkm_id = current_umkm_profile_id()
      or orders.creator_id = current_creator_profile_id()
    )
  limit 1;

  if v_order_id is null then
    raise exception 'order_not_accessible';
  end if;

  update messages
  set read_at = coalesce(read_at, now())
  where order_id = target_order_id
    and sender_id <> v_user_id
    and is_internal = false
    and read_at is null;

  return target_order_id;
end;
$$;

do $$
begin
  if exists (
    select 1
    from pg_publication
    where pubname = 'supabase_realtime'
  )
  and not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end;
$$;

revoke execute on function public.mark_order_messages_read(uuid) from public;
grant execute on function public.mark_order_messages_read(uuid) to authenticated;
