alter table service_packages
  add column if not exists brief_requirements jsonb not null default '[]'::jsonb,
  add column if not exists published_at timestamptz;

alter table service_package_tiers
  add column if not exists tier_key text;

update service_package_tiers
set tier_key = case
  when lower(name) = 'basic' then 'basic'
  when lower(name) in ('medium', 'standard') then 'medium'
  when lower(name) = 'premium' then 'premium'
  else case
    when sort_order <= 1 then 'basic'
    when sort_order = 2 then 'medium'
    else 'premium'
  end
end
where tier_key is null;

update service_package_tiers
set name = 'Medium'
where tier_key = 'medium'
  and lower(name) = 'standard';

alter table service_package_tiers
  alter column tier_key set default 'basic',
  alter column tier_key set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'service_package_tiers_tier_key_check'
  ) then
    alter table service_package_tiers
      add constraint service_package_tiers_tier_key_check
      check (tier_key in ('basic', 'medium', 'premium'));
  end if;
end $$;

create unique index if not exists service_package_tiers_service_package_id_tier_key_idx
  on service_package_tiers(service_package_id, tier_key);

insert into service_package_tiers (
  service_package_id,
  tier_key,
  name,
  description,
  price,
  estimated_days,
  revision_count,
  deliverables,
  sort_order,
  is_active
)
select
  service_packages.id,
  'basic',
  'Basic',
  service_packages.short_description,
  greatest(service_packages.base_price, 1),
  greatest(service_packages.estimated_days, 1),
  greatest(service_packages.revision_count, 0),
  coalesce(service_packages.deliverables, array[]::text[]),
  1,
  true
from service_packages
where not exists (
  select 1
  from service_package_tiers
  where service_package_tiers.service_package_id = service_packages.id
    and service_package_tiers.tier_key = 'basic'
);

create table if not exists service_media (
  id uuid primary key default gen_random_uuid(),
  service_package_id uuid not null references service_packages(id) on delete cascade,
  file_asset_id uuid references file_assets(id) on delete set null,
  image_url text not null,
  alt_text text,
  is_cover boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'update_service_media_updated_at'
  ) then
    create trigger update_service_media_updated_at
    before update on service_media
    for each row execute procedure set_updated_at();
  end if;
end $$;

create index if not exists service_media_service_package_id_idx
  on service_media(service_package_id)
  where deleted_at is null;

create unique index if not exists service_media_one_cover_per_service_idx
  on service_media(service_package_id)
  where is_cover = true and deleted_at is null;

insert into service_media (
  service_package_id,
  file_asset_id,
  image_url,
  alt_text,
  is_cover,
  sort_order
)
select
  service_packages.id,
  service_packages.cover_file_asset_id,
  service_packages.cover_image_url,
  service_packages.title,
  true,
  0
from service_packages
where service_packages.cover_image_url is not null
  and service_packages.cover_image_url <> ''
  and not exists (
    select 1
    from service_media
    where service_media.service_package_id = service_packages.id
      and service_media.deleted_at is null
  );

alter table service_media enable row level security;

drop policy if exists "Public can read active service media" on service_media;
create policy "Public can read active service media"
  on service_media for select
  to anon, authenticated
  using (
    deleted_at is null
    and exists (
      select 1
      from service_packages
      join creator_profiles on creator_profiles.id = service_packages.creator_id
      join profiles on profiles.id = creator_profiles.user_id
      where service_packages.id = service_media.service_package_id
        and service_packages.is_active = true
        and service_packages.deleted_at is null
        and profiles.account_status = 'active'
        and profiles.onboarding_completed = true
    )
  );

drop policy if exists "Creators can read own service media" on service_media;
create policy "Creators can read own service media"
  on service_media for select
  to authenticated
  using (
    exists (
      select 1
      from service_packages
      where service_packages.id = service_media.service_package_id
        and service_packages.creator_id = public.current_creator_profile_id()
    )
    or public.is_admin()
  );

drop policy if exists "Creators can create own service media" on service_media;
create policy "Creators can create own service media"
  on service_media for insert
  to authenticated
  with check (
    exists (
      select 1
      from service_packages
      where service_packages.id = service_media.service_package_id
        and service_packages.creator_id = public.current_creator_profile_id()
    )
    or public.is_admin()
  );

drop policy if exists "Creators can update own service media" on service_media;
create policy "Creators can update own service media"
  on service_media for update
  to authenticated
  using (
    exists (
      select 1
      from service_packages
      where service_packages.id = service_media.service_package_id
        and service_packages.creator_id = public.current_creator_profile_id()
    )
    or public.is_admin()
  )
  with check (
    exists (
      select 1
      from service_packages
      where service_packages.id = service_media.service_package_id
        and service_packages.creator_id = public.current_creator_profile_id()
    )
    or public.is_admin()
  );

drop policy if exists "Creators can delete own service media" on service_media;
create policy "Creators can delete own service media"
  on service_media for delete
  to authenticated
  using (
    exists (
      select 1
      from service_packages
      where service_packages.id = service_media.service_package_id
        and service_packages.creator_id = public.current_creator_profile_id()
    )
    or public.is_admin()
  );

drop policy if exists "Creators can soft delete own service packages" on service_packages;
create policy "Creators can soft delete own service packages"
  on service_packages for update
  to authenticated
  using (creator_id = public.current_creator_profile_id())
  with check (creator_id = public.current_creator_profile_id());
