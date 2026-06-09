insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'public-assets',
  'public-assets',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'business-assets',
  'business-assets',
  false,
  2097152,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'brief-assets',
  'brief-assets',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table if not exists file_assets (
  id uuid primary key default gen_random_uuid(),
  bucket_name text not null,
  storage_path text not null,
  original_filename text,
  file_name text not null,
  file_extension text,
  mime_type text,
  file_size integer,
  visibility text not null default 'private' check (visibility in ('public', 'private', 'restricted', 'internal')),
  context text not null,
  owner_id uuid references profiles(id) on delete set null,
  umkm_id uuid references umkm_profiles(id) on delete set null,
  creator_id uuid references creator_profiles(id) on delete set null,
  service_package_id uuid references service_packages(id) on delete set null,
  portfolio_id uuid references portfolios(id) on delete set null,
  order_id uuid references orders(id) on delete set null,
  brief_id uuid references campaign_briefs(id) on delete set null,
  submission_id uuid references submissions(id) on delete set null,
  revision_id uuid references revisions(id) on delete set null,
  invoice_id uuid references invoices(id) on delete set null,
  complaint_id uuid references complaints(id) on delete set null,
  uploaded_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (bucket_name, storage_path)
);

alter table profiles
  add column if not exists avatar_file_asset_id uuid references file_assets(id) on delete set null;

alter table creator_profiles
  add column if not exists avatar_file_asset_id uuid references file_assets(id) on delete set null,
  add column if not exists banner_file_asset_id uuid references file_assets(id) on delete set null;

alter table umkm_profiles
  add column if not exists logo_file_asset_id uuid references file_assets(id) on delete set null;

alter table service_packages
  add column if not exists cover_file_asset_id uuid references file_assets(id) on delete set null;

alter table portfolios
  add column if not exists thumbnail_file_asset_id uuid references file_assets(id) on delete set null;

create index if not exists file_assets_owner_id_idx on file_assets(owner_id) where deleted_at is null;
create index if not exists file_assets_creator_id_idx on file_assets(creator_id) where deleted_at is null;
create index if not exists file_assets_umkm_id_idx on file_assets(umkm_id) where deleted_at is null;
create index if not exists file_assets_service_package_id_idx on file_assets(service_package_id) where deleted_at is null;
create index if not exists file_assets_portfolio_id_idx on file_assets(portfolio_id) where deleted_at is null;
create index if not exists file_assets_brief_id_idx on file_assets(brief_id) where deleted_at is null;
create index if not exists file_assets_order_id_idx on file_assets(order_id) where deleted_at is null;
create index if not exists profiles_avatar_file_asset_id_idx on profiles(avatar_file_asset_id);
create index if not exists creator_profiles_avatar_file_asset_id_idx on creator_profiles(avatar_file_asset_id);
create index if not exists creator_profiles_banner_file_asset_id_idx on creator_profiles(banner_file_asset_id);
create index if not exists umkm_profiles_logo_file_asset_id_idx on umkm_profiles(logo_file_asset_id);
create index if not exists service_packages_cover_file_asset_id_idx on service_packages(cover_file_asset_id);
create index if not exists portfolios_thumbnail_file_asset_id_idx on portfolios(thumbnail_file_asset_id);

create or replace function public.is_public_creator_profile(target_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from profiles
    join creator_profiles on creator_profiles.user_id = profiles.id
    where profiles.id = target_user_id
      and profiles.account_status = 'active'
      and profiles.onboarding_completed = true
      and exists (
        select 1
        from service_packages
        where service_packages.creator_id = creator_profiles.id
          and service_packages.is_active = true
          and service_packages.deleted_at is null
      )
  );
$$;

alter table file_assets enable row level security;

drop policy if exists "Public can read public file assets" on file_assets;
create policy "Public can read public file assets"
  on file_assets for select
  to anon, authenticated
  using (visibility = 'public' and deleted_at is null);

drop policy if exists "Authenticated users can read related file assets" on file_assets;
create policy "Authenticated users can read related file assets"
  on file_assets for select
  to authenticated
  using (
    deleted_at is null
    and (
      owner_id = auth.uid()
      or uploaded_by = auth.uid()
      or creator_id = public.current_creator_profile_id()
      or umkm_id = public.current_umkm_profile_id()
      or public.is_admin()
      or (
        order_id is not null
        and exists (
          select 1
          from orders
          where orders.id = file_assets.order_id
            and (
              orders.umkm_id = public.current_umkm_profile_id()
              or orders.creator_id = public.current_creator_profile_id()
              or public.is_admin()
            )
        )
      )
    )
  );

drop policy if exists "Authenticated users can create own file assets" on file_assets;
create policy "Authenticated users can create own file assets"
  on file_assets for insert
  to authenticated
  with check (
    owner_id = auth.uid()
    and uploaded_by = auth.uid()
    and (
      public.is_admin()
      or creator_id = public.current_creator_profile_id()
      or umkm_id = public.current_umkm_profile_id()
    )
  );

drop policy if exists "Authenticated users can update own file assets" on file_assets;
create policy "Authenticated users can update own file assets"
  on file_assets for update
  to authenticated
  using (
    owner_id = auth.uid()
    or uploaded_by = auth.uid()
    or creator_id = public.current_creator_profile_id()
    or umkm_id = public.current_umkm_profile_id()
    or public.is_admin()
  )
  with check (
    owner_id = auth.uid()
    or uploaded_by = auth.uid()
    or creator_id = public.current_creator_profile_id()
    or umkm_id = public.current_umkm_profile_id()
    or public.is_admin()
  );

drop policy if exists "Public can read public asset objects" on storage.objects;
create policy "Public can read public asset objects"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'public-assets');

drop policy if exists "Creators can upload own public asset objects" on storage.objects;
create policy "Creators can upload own public asset objects"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'public-assets'
    and (storage.foldername(name))[1] = 'creators'
    and (storage.foldername(name))[2] = public.current_creator_profile_id()::text
  );

drop policy if exists "Creators can update own public asset objects" on storage.objects;
create policy "Creators can update own public asset objects"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'public-assets'
    and (storage.foldername(name))[1] = 'creators'
    and (storage.foldername(name))[2] = public.current_creator_profile_id()::text
  )
  with check (
    bucket_id = 'public-assets'
    and (storage.foldername(name))[1] = 'creators'
    and (storage.foldername(name))[2] = public.current_creator_profile_id()::text
  );

drop policy if exists "Creators can delete own public asset objects" on storage.objects;
create policy "Creators can delete own public asset objects"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'public-assets'
    and (storage.foldername(name))[1] = 'creators'
    and (storage.foldername(name))[2] = public.current_creator_profile_id()::text
  );

drop policy if exists "UMKM can upload own business asset objects" on storage.objects;
create policy "UMKM can upload own business asset objects"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'business-assets'
    and (storage.foldername(name))[1] = 'umkm'
    and (storage.foldername(name))[2] = public.current_umkm_profile_id()::text
  );

drop policy if exists "UMKM can update own business asset objects" on storage.objects;
create policy "UMKM can update own business asset objects"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'business-assets'
    and (storage.foldername(name))[1] = 'umkm'
    and (storage.foldername(name))[2] = public.current_umkm_profile_id()::text
  )
  with check (
    bucket_id = 'business-assets'
    and (storage.foldername(name))[1] = 'umkm'
    and (storage.foldername(name))[2] = public.current_umkm_profile_id()::text
  );

drop policy if exists "UMKM can delete own business asset objects" on storage.objects;
create policy "UMKM can delete own business asset objects"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'business-assets'
    and (storage.foldername(name))[1] = 'umkm'
    and (storage.foldername(name))[2] = public.current_umkm_profile_id()::text
  );

drop policy if exists "Participants can read business asset objects" on storage.objects;
create policy "Participants can read business asset objects"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'business-assets'
    and exists (
      select 1
      from file_assets
      where file_assets.bucket_name = storage.objects.bucket_id
        and file_assets.storage_path = storage.objects.name
        and file_assets.deleted_at is null
        and (
          file_assets.owner_id = auth.uid()
          or file_assets.umkm_id = public.current_umkm_profile_id()
          or public.is_admin()
        )
    )
  );

drop policy if exists "UMKM can upload own brief asset objects" on storage.objects;
create policy "UMKM can upload own brief asset objects"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'brief-assets'
    and (storage.foldername(name))[1] = 'umkm'
    and (storage.foldername(name))[2] = public.current_umkm_profile_id()::text
  );

drop policy if exists "UMKM can update own brief asset objects" on storage.objects;
create policy "UMKM can update own brief asset objects"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'brief-assets'
    and (storage.foldername(name))[1] = 'umkm'
    and (storage.foldername(name))[2] = public.current_umkm_profile_id()::text
  )
  with check (
    bucket_id = 'brief-assets'
    and (storage.foldername(name))[1] = 'umkm'
    and (storage.foldername(name))[2] = public.current_umkm_profile_id()::text
  );

drop policy if exists "UMKM can delete own brief asset objects" on storage.objects;
create policy "UMKM can delete own brief asset objects"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'brief-assets'
    and (storage.foldername(name))[1] = 'umkm'
    and (storage.foldername(name))[2] = public.current_umkm_profile_id()::text
  );

drop policy if exists "Participants can read brief asset objects" on storage.objects;
create policy "Participants can read brief asset objects"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'brief-assets'
    and exists (
      select 1
      from file_assets
      left join orders on orders.id = file_assets.order_id
      left join campaign_briefs on campaign_briefs.id = file_assets.brief_id
      where file_assets.bucket_name = storage.objects.bucket_id
        and file_assets.storage_path = storage.objects.name
        and file_assets.deleted_at is null
        and (
          file_assets.owner_id = auth.uid()
          or file_assets.umkm_id = public.current_umkm_profile_id()
          or orders.umkm_id = public.current_umkm_profile_id()
          or orders.creator_id = public.current_creator_profile_id()
          or exists (
            select 1
            from orders brief_orders
            where brief_orders.campaign_brief_id = campaign_briefs.id
              and (
                brief_orders.umkm_id = public.current_umkm_profile_id()
                or brief_orders.creator_id = public.current_creator_profile_id()
              )
          )
          or public.is_admin()
        )
    )
  );

drop policy if exists "Public can read active portfolio thumbnail objects" on storage.objects;
create policy "Public can read active portfolio thumbnail objects"
  on storage.objects for select
  to anon, authenticated
  using (
    bucket_id = 'portfolios'
    and exists (
      select 1
      from portfolios
      join creator_profiles on creator_profiles.id = portfolios.creator_id
      where (
          portfolios.thumbnail_storage_path = storage.objects.name
          or exists (
            select 1
            from file_assets
            where file_assets.id = portfolios.thumbnail_file_asset_id
              and file_assets.storage_path = storage.objects.name
              and file_assets.deleted_at is null
          )
        )
        and portfolios.deleted_at is null
        and public.is_public_creator_profile(creator_profiles.user_id)
    )
  );
