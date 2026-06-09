insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
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
  'portfolios',
  'portfolios',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

alter table profiles
  add column if not exists avatar_storage_path text;

alter table creator_profiles
  add column if not exists avatar_storage_path text;

alter table portfolios
  add column if not exists thumbnail_storage_path text;

create index if not exists profiles_avatar_storage_path_idx
  on profiles(avatar_storage_path)
  where avatar_storage_path is not null;

create index if not exists creator_profiles_avatar_storage_path_idx
  on creator_profiles(avatar_storage_path)
  where avatar_storage_path is not null;

create index if not exists portfolios_thumbnail_storage_path_idx
  on portfolios(thumbnail_storage_path)
  where thumbnail_storage_path is not null;

drop policy if exists "Public can read avatar objects" on storage.objects;
create policy "Public can read avatar objects"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'avatars');

drop policy if exists "Creators can upload own avatar objects" on storage.objects;
create policy "Creators can upload own avatar objects"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'avatars'
    and owner = auth.uid()
    and (storage.foldername(name))[1] = auth.uid()::text
    and exists (
      select 1
      from profiles
      where id = auth.uid()
        and role = 'creator'
        and account_status = 'active'
    )
  );

drop policy if exists "Creators can update own avatar objects" on storage.objects;
create policy "Creators can update own avatar objects"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'avatars'
    and owner = auth.uid()
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and owner = auth.uid()
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Creators can delete own avatar objects" on storage.objects;
create policy "Creators can delete own avatar objects"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'avatars'
    and owner = auth.uid()
    and (storage.foldername(name))[1] = auth.uid()::text
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
      where portfolios.thumbnail_storage_path = storage.objects.name
        and portfolios.deleted_at is null
        and is_public_creator_profile(creator_profiles.user_id)
    )
  );

drop policy if exists "Creators can read own portfolio thumbnail objects" on storage.objects;
create policy "Creators can read own portfolio thumbnail objects"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'portfolios'
    and (storage.foldername(name))[1] = public.current_creator_profile_id()::text
  );

drop policy if exists "Creators can upload own portfolio thumbnail objects" on storage.objects;
create policy "Creators can upload own portfolio thumbnail objects"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'portfolios'
    and (storage.foldername(name))[1] = public.current_creator_profile_id()::text
  );

drop policy if exists "Creators can update own portfolio thumbnail objects" on storage.objects;
create policy "Creators can update own portfolio thumbnail objects"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'portfolios'
    and (storage.foldername(name))[1] = public.current_creator_profile_id()::text
  )
  with check (
    bucket_id = 'portfolios'
    and (storage.foldername(name))[1] = public.current_creator_profile_id()::text
  );

drop policy if exists "Creators can delete own portfolio thumbnail objects" on storage.objects;
create policy "Creators can delete own portfolio thumbnail objects"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'portfolios'
    and (storage.foldername(name))[1] = public.current_creator_profile_id()::text
  );
