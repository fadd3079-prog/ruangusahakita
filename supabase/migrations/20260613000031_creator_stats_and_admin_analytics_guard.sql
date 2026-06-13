create or replace function public.get_creator_public_stats(target_creator_ids uuid[])
returns table (
  creator_id uuid,
  completed_orders_count integer,
  average_rating numeric,
  review_count integer,
  completed_revenue numeric
)
language sql
stable
security definer
set search_path = public
as $$
  with requested as (
    select distinct unnest(target_creator_ids) as creator_id
  ),
  completed_orders as (
    select
      orders.creator_id,
      count(*)::integer as completed_orders_count,
      coalesce(
        sum(orders.subtotal_amount + orders.addon_amount - orders.platform_fee),
        0
      )::numeric as completed_revenue
    from public.orders
    join requested on requested.creator_id = orders.creator_id
    where orders.order_status = 'completed'
    group by orders.creator_id
  ),
  visible_reviews as (
    select
      reviews.creator_id,
      count(*)::integer as review_count,
      coalesce(round(avg(reviews.rating)::numeric, 2), 0)::numeric as average_rating
    from public.reviews
    join requested on requested.creator_id = reviews.creator_id
    where reviews.is_visible = true
      and reviews.deleted_at is null
    group by reviews.creator_id
  )
  select
    requested.creator_id,
    coalesce(completed_orders.completed_orders_count, 0) as completed_orders_count,
    coalesce(visible_reviews.average_rating, 0) as average_rating,
    coalesce(visible_reviews.review_count, 0) as review_count,
    coalesce(completed_orders.completed_revenue, 0) as completed_revenue
  from requested
  left join completed_orders on completed_orders.creator_id = requested.creator_id
  left join visible_reviews on visible_reviews.creator_id = requested.creator_id;
$$;

grant execute on function public.get_creator_public_stats(uuid[]) to anon, authenticated;

create or replace function public.refresh_creator_profile_stats(target_creator_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  stats record;
begin
  select *
  into stats
  from public.get_creator_public_stats(array[target_creator_id])
  limit 1;

  update public.creator_profiles
  set
    completed_orders_count = coalesce(stats.completed_orders_count, 0),
    average_rating = coalesce(stats.average_rating, 0),
    updated_at = now()
  where id = target_creator_id;
end;
$$;

create or replace function public.refresh_creator_profile_stats_trigger()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_table_name = 'orders' then
    if tg_op = 'INSERT' and new.creator_id is not null then
      perform public.refresh_creator_profile_stats(new.creator_id);
    elsif tg_op = 'UPDATE' then
      if new.creator_id is not null then
        perform public.refresh_creator_profile_stats(new.creator_id);
      end if;
      if old.creator_id is not null and old.creator_id is distinct from new.creator_id then
        perform public.refresh_creator_profile_stats(old.creator_id);
      end if;
    elsif tg_op = 'DELETE' and old.creator_id is not null then
      perform public.refresh_creator_profile_stats(old.creator_id);
    end if;
  end if;

  if tg_table_name = 'reviews' then
    if tg_op = 'INSERT' and new.creator_id is not null then
      perform public.refresh_creator_profile_stats(new.creator_id);
    elsif tg_op = 'UPDATE' then
      if new.creator_id is not null then
        perform public.refresh_creator_profile_stats(new.creator_id);
      end if;
      if old.creator_id is not null and old.creator_id is distinct from new.creator_id then
        perform public.refresh_creator_profile_stats(old.creator_id);
      end if;
    elsif tg_op = 'DELETE' and old.creator_id is not null then
      perform public.refresh_creator_profile_stats(old.creator_id);
    end if;
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;

  return new;
end;
$$;

drop trigger if exists refresh_creator_profile_stats_on_orders on public.orders;
create trigger refresh_creator_profile_stats_on_orders
after insert or update or delete on public.orders
for each row
execute function public.refresh_creator_profile_stats_trigger();

drop trigger if exists refresh_creator_profile_stats_on_reviews on public.reviews;
create trigger refresh_creator_profile_stats_on_reviews
after insert or update or delete on public.reviews
for each row
execute function public.refresh_creator_profile_stats_trigger();

select public.refresh_creator_profile_stats(id)
from public.creator_profiles;

drop policy if exists "Anyone can create privacy safe analytics events" on public.analytics_events;

create policy "Anyone can create privacy safe analytics events"
  on public.analytics_events for insert
  to anon, authenticated
  with check (
    role in ('umkm', 'creator', 'guest')
    and char_length(path) between 1 and 500
    and path !~ '^/admin(/|$)'
    and (referrer is null or referrer not ilike '%/admin%')
    and octet_length(metadata::text) <= 2048
    and (
      (
        auth.uid() is null
        and user_id is null
        and role = 'guest'
      )
      or (
        auth.uid() is not null
        and user_id = auth.uid()
        and exists (
          select 1
          from public.profiles p
          where p.id = auth.uid()
            and p.role::text = analytics_events.role
            and p.role <> 'admin'
            and p.account_status = 'active'
        )
      )
    )
  );
