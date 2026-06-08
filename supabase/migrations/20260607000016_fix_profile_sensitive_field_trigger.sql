create or replace function protect_profile_sensitive_fields()
returns trigger
language plpgsql
as $$
begin
  if current_setting('role', true) in ('service_role', 'postgres', 'supabase_admin')
    or current_user in ('postgres', 'supabase_admin')
  then
    return new;
  end if;

  if old.role <> new.role then
    raise exception 'You are not allowed to change your role.';
  end if;

  if old.account_status <> new.account_status then
    raise exception 'You are not allowed to change your account status.';
  end if;

  if old.email <> new.email then
    raise exception 'Email changes must be handled via Supabase Auth.';
  end if;

  return new;
end;
$$;
