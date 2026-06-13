insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-results',
  'project-results',
  false,
  52428800,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'text/plain',
    'text/html',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip',
    'application/x-zip-compressed',
    'application/vnd.rar',
    'application/x-rar-compressed',
    'application/postscript',
    'application/octet-stream'
  ]::text[]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Creators can upload own project result objects" on storage.objects;
create policy "Creators can upload own project result objects"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'project-results'
    and (storage.foldername(name))[1] = 'creators'
    and (storage.foldername(name))[2] = public.current_creator_profile_id()::text
    and (storage.foldername(name))[3] = 'orders'
  );

drop policy if exists "Creators can update own project result objects" on storage.objects;
create policy "Creators can update own project result objects"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'project-results'
    and (storage.foldername(name))[1] = 'creators'
    and (storage.foldername(name))[2] = public.current_creator_profile_id()::text
    and (storage.foldername(name))[3] = 'orders'
  )
  with check (
    bucket_id = 'project-results'
    and (storage.foldername(name))[1] = 'creators'
    and (storage.foldername(name))[2] = public.current_creator_profile_id()::text
    and (storage.foldername(name))[3] = 'orders'
  );

drop policy if exists "Creators can delete own project result objects" on storage.objects;
create policy "Creators can delete own project result objects"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'project-results'
    and (storage.foldername(name))[1] = 'creators'
    and (storage.foldername(name))[2] = public.current_creator_profile_id()::text
    and (storage.foldername(name))[3] = 'orders'
  );

drop policy if exists "Participants can read project result objects" on storage.objects;
create policy "Participants can read project result objects"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'project-results'
    and exists (
      select 1
      from file_assets
      left join orders on orders.id = file_assets.order_id
      where file_assets.bucket_name = storage.objects.bucket_id
        and file_assets.storage_path = storage.objects.name
        and file_assets.deleted_at is null
        and (
          file_assets.owner_id = auth.uid()
          or file_assets.creator_id = public.current_creator_profile_id()
          or file_assets.umkm_id = public.current_umkm_profile_id()
          or orders.creator_id = public.current_creator_profile_id()
          or orders.umkm_id = public.current_umkm_profile_id()
          or public.is_admin()
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
    and deleted_at is null
    and (
      public.is_admin()
      or creator_id is null
      or creator_id = public.current_creator_profile_id()
    )
    and (
      public.is_admin()
      or umkm_id is null
      or umkm_id = public.current_umkm_profile_id()
    )
    and (
      public.is_admin()
      or order_id is null
      or exists (
        select 1
        from orders
        where orders.id = file_assets.order_id
          and (
            orders.creator_id = public.current_creator_profile_id()
            or orders.umkm_id = public.current_umkm_profile_id()
          )
      )
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
    (
      owner_id = auth.uid()
      or uploaded_by = auth.uid()
      or creator_id = public.current_creator_profile_id()
      or umkm_id = public.current_umkm_profile_id()
      or public.is_admin()
    )
    and (
      public.is_admin()
      or creator_id is null
      or creator_id = public.current_creator_profile_id()
    )
    and (
      public.is_admin()
      or umkm_id is null
      or umkm_id = public.current_umkm_profile_id()
    )
    and (
      public.is_admin()
      or order_id is null
      or exists (
        select 1
        from orders
        where orders.id = file_assets.order_id
          and (
            orders.creator_id = public.current_creator_profile_id()
            or orders.umkm_id = public.current_umkm_profile_id()
          )
      )
    )
  );

create or replace function submit_creator_delivery(
  target_order_id uuid,
  submission_title text,
  submission_description text,
  external_links text[],
  caption_text text,
  file_asset_ids uuid[]
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_creator_id uuid;
  v_order_status order_status;
  v_new_status order_status;
  v_submission_id uuid;
  v_revision_id uuid;
  v_version integer;
  v_asset_ids uuid[] := coalesce(file_asset_ids, '{}'::uuid[]);
  v_updated_assets integer := 0;
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

  select order_status
  into v_order_status
  from orders
  where id = target_order_id
    and creator_id = v_creator_id
    and payment_status = 'paid'
    and order_status in ('in_progress', 'revision_requested')
  for update;

  if v_order_status is null then
    raise exception 'order_not_submittable';
  end if;

  if cardinality(v_asset_ids) = 0
    and coalesce(array_length(coalesce(external_links, '{}'::text[]), 1), 0) = 0
    and nullif(trim(coalesce(submission_description, '')), '') is null
    and nullif(trim(coalesce(caption_text, '')), '') is null then
    raise exception 'submission_empty';
  end if;

  select count(*) + 1
  into v_version
  from submissions
  where order_id = target_order_id;

  if v_order_status = 'revision_requested' then
    select id
    into v_revision_id
    from revisions
    where order_id = target_order_id
      and revision_status in ('requested', 'in_progress')
    order by created_at desc
    limit 1
    for update;

    if v_revision_id is null then
      raise exception 'revision_not_found';
    end if;

    v_new_status := 'revised';
  else
    v_new_status := 'submitted';
  end if;

  insert into submissions (
    order_id,
    creator_id,
    title,
    description,
    file_urls,
    external_links,
    caption_text,
    submission_type,
    version_number
  )
  values (
    target_order_id,
    v_creator_id,
    coalesce(nullif(trim(submission_title), ''), 'Hasil konten'),
    nullif(trim(coalesce(submission_description, '')), ''),
    null,
    coalesce(external_links, '{}'::text[]),
    nullif(trim(coalesce(caption_text, '')), ''),
    case when v_revision_id is null then 'initial' else 'revision' end,
    v_version
  )
  returning id into v_submission_id;

  if cardinality(v_asset_ids) > 0 then
    update file_assets
    set submission_id = v_submission_id
    where id = any(v_asset_ids)
      and owner_id = v_user_id
      and uploaded_by = v_user_id
      and creator_id = v_creator_id
      and order_id = target_order_id
      and bucket_name = 'project-results'
      and deleted_at is null;

    get diagnostics v_updated_assets = row_count;

    if v_updated_assets <> cardinality(v_asset_ids) then
      raise exception 'asset_not_allowed';
    end if;
  end if;

  if v_revision_id is not null then
    update revisions
    set revision_status = 'submitted',
        submission_id = v_submission_id,
        response_note = nullif(trim(coalesce(submission_description, caption_text, '')), ''),
        resolved_at = now(),
        updated_at = now()
    where id = v_revision_id;
  end if;

  update orders
  set order_status = v_new_status
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
    v_order_status,
    v_new_status,
    v_user_id,
    case when v_new_status = 'revised' then 'Kreator mengirim hasil revisi' else 'Kreator mengirim hasil konten' end
  );

  return v_submission_id;
end;
$$;

create or replace function request_order_revision(
  target_order_id uuid,
  revision_note text,
  reference_urls text[]
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_umkm_id uuid;
  v_order_status order_status;
  v_revision_id uuid;
  v_revision_limit integer := 0;
  v_revision_used integer := 0;
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

  select order_status
  into v_order_status
  from orders
  where id = target_order_id
    and umkm_id = v_umkm_id
    and payment_status = 'paid'
    and order_status in ('submitted', 'revised')
  for update;

  if v_order_status is null then
    raise exception 'order_not_revisable';
  end if;

  if nullif(trim(coalesce(revision_note, '')), '') is null then
    raise exception 'revision_note_required';
  end if;

  select coalesce(max(revision_count), 0)
  into v_revision_limit
  from order_items
  where order_id = target_order_id;

  select count(*)
  into v_revision_used
  from revisions
  where order_id = target_order_id;

  if v_revision_limit <= 0 or v_revision_used >= v_revision_limit then
    raise exception 'revision_limit_reached';
  end if;

  insert into revisions (
    order_id,
    requested_by,
    revision_status,
    revision_note,
    reference_urls
  )
  values (
    target_order_id,
    v_user_id,
    'requested',
    trim(revision_note),
    coalesce(reference_urls, '{}'::text[])
  )
  returning id into v_revision_id;

  update orders
  set order_status = 'revision_requested'
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
    v_order_status,
    'revision_requested',
    v_user_id,
    'UMKM meminta revisi hasil konten'
  );

  return v_revision_id;
end;
$$;

create or replace function approve_order_delivery(target_order_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_umkm_id uuid;
  v_order_status order_status;
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

  select order_status
  into v_order_status
  from orders
  where id = target_order_id
    and umkm_id = v_umkm_id
    and payment_status = 'paid'
    and order_status in ('submitted', 'revised')
  for update;

  if v_order_status is null then
    raise exception 'order_not_approvable';
  end if;

  update revisions
  set revision_status = 'approved',
      resolved_at = coalesce(resolved_at, now()),
      updated_at = now()
  where id = (
    select id
    from revisions
    where order_id = target_order_id
      and revision_status = 'submitted'
    order by created_at desc
    limit 1
  );

  update orders
  set order_status = 'completed',
      completed_at = now()
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
    v_order_status,
    'completed',
    v_user_id,
    'UMKM menyetujui hasil konten'
  );

  return target_order_id;
end;
$$;

revoke execute on function submit_creator_delivery(uuid, text, text, text[], text, uuid[]) from public;
revoke execute on function request_order_revision(uuid, text, text[]) from public;
revoke execute on function approve_order_delivery(uuid) from public;
grant execute on function submit_creator_delivery(uuid, text, text, text[], text, uuid[]) to authenticated;
grant execute on function request_order_revision(uuid, text, text[]) to authenticated;
grant execute on function approve_order_delivery(uuid) to authenticated;
