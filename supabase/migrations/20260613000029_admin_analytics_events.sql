do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'analytics_event_type'
      and typnamespace = 'public'::regnamespace
  ) then
    create type public.analytics_event_type as enum (
      'page_view',
      'catalog_view',
      'service_view',
      'creator_view',
      'portfolio_view',
      'cta_click',
      'add_to_cart',
      'checkout_start',
      'brief_submit',
      'order_created',
      'payment_opened',
      'payment_paid',
      'creator_accept_order',
      'creator_start_order',
      'outbound_click'
    );
  end if;
end $$;

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type public.analytics_event_type not null,
  user_id uuid references public.profiles(id) on delete set null,
  role text not null default 'guest',
  path text not null,
  referrer text,
  source text,
  device_type text,
  browser_name text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint analytics_events_role_check check (role in ('admin', 'umkm', 'creator', 'guest')),
  constraint analytics_events_path_length_check check (char_length(path) between 1 and 500),
  constraint analytics_events_referrer_length_check check (referrer is null or char_length(referrer) <= 500),
  constraint analytics_events_source_length_check check (source is null or char_length(source) <= 120),
  constraint analytics_events_device_type_length_check check (device_type is null or char_length(device_type) <= 80),
  constraint analytics_events_browser_name_length_check check (browser_name is null or char_length(browser_name) <= 80),
  constraint analytics_events_metadata_size_check check (octet_length(metadata::text) <= 2048)
);

create index if not exists analytics_events_created_at_idx
  on public.analytics_events(created_at desc);

create index if not exists analytics_events_type_created_at_idx
  on public.analytics_events(event_type, created_at desc);

create index if not exists analytics_events_path_created_at_idx
  on public.analytics_events(path, created_at desc);

create index if not exists analytics_events_role_created_at_idx
  on public.analytics_events(role, created_at desc);

alter table public.analytics_events enable row level security;

drop policy if exists "Anyone can create privacy safe analytics events" on public.analytics_events;
drop policy if exists "Admins can read analytics events" on public.analytics_events;

create policy "Anyone can create privacy safe analytics events"
  on public.analytics_events for insert
  to anon, authenticated
  with check (
    role in ('admin', 'umkm', 'creator', 'guest')
    and char_length(path) between 1 and 500
    and octet_length(metadata::text) <= 2048
    and (
      (
        auth.uid() is null
        and user_id is null
        and role = 'guest'
      )
      or (
        auth.uid() is not null
        and (user_id is null or user_id = auth.uid())
        and (
          role = 'guest'
          or exists (
            select 1
            from public.profiles p
            where p.id = auth.uid()
              and p.role::text = analytics_events.role
              and p.account_status = 'active'
          )
        )
      )
    )
  );

create policy "Admins can read analytics events"
  on public.analytics_events for select
  to authenticated
  using (public.is_admin());
