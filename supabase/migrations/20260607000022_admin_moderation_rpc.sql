create or replace function admin_set_profile_account_status(
  target_profile_id uuid,
  next_status account_status
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_admin_id uuid := auth.uid();
  v_target_id uuid;
begin
  if not is_admin() then
    raise exception 'not_admin';
  end if;

  if target_profile_id is null or next_status is null then
    raise exception 'invalid_input';
  end if;

  if target_profile_id = v_admin_id then
    raise exception 'self_status_change_not_allowed';
  end if;

  select id
  into v_target_id
  from profiles
  where id = target_profile_id
  for update;

  if v_target_id is null then
    raise exception 'profile_not_found';
  end if;

  update profiles
  set account_status = next_status
  where id = target_profile_id;

  return target_profile_id;
end;
$$;

create or replace function admin_set_creator_moderation(
  target_creator_id uuid,
  next_verified boolean,
  next_featured boolean
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_creator_id uuid;
begin
  if not is_admin() then
    raise exception 'not_admin';
  end if;

  if target_creator_id is null or next_verified is null or next_featured is null then
    raise exception 'invalid_input';
  end if;

  update creator_profiles
  set is_verified = next_verified,
      is_featured = next_featured
  where id = target_creator_id
  returning id into v_creator_id;

  if v_creator_id is null then
    raise exception 'creator_not_found';
  end if;

  return v_creator_id;
end;
$$;

create or replace function admin_set_service_moderation(
  target_service_id uuid,
  next_active boolean,
  next_featured boolean
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_service_id uuid;
begin
  if not is_admin() then
    raise exception 'not_admin';
  end if;

  if target_service_id is null or next_active is null or next_featured is null then
    raise exception 'invalid_input';
  end if;

  update service_packages
  set is_active = next_active,
      is_featured = next_featured
  where id = target_service_id
    and deleted_at is null
  returning id into v_service_id;

  if v_service_id is null then
    raise exception 'service_not_found';
  end if;

  return v_service_id;
end;
$$;

revoke execute on function admin_set_profile_account_status(uuid, account_status) from public;
revoke execute on function admin_set_creator_moderation(uuid, boolean, boolean) from public;
revoke execute on function admin_set_service_moderation(uuid, boolean, boolean) from public;
grant execute on function admin_set_profile_account_status(uuid, account_status) to authenticated;
grant execute on function admin_set_creator_moderation(uuid, boolean, boolean) to authenticated;
grant execute on function admin_set_service_moderation(uuid, boolean, boolean) to authenticated;
