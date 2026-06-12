alter type public.user_role add value if not exists 'admin';

alter table public.profiles
  add column if not exists role public.user_role not null default 'umkm';

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_role_account_status_idx on public.profiles(role, account_status);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and account_status = 'active'
  );
$$;

create or replace function public.protect_profile_sensitive_fields()
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

do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'profile_protection_trigger'
  ) then
    create trigger profile_protection_trigger
    before update on public.profiles
    for each row execute function public.protect_profile_sensitive_fields();
  end if;
end $$;

alter table public.profiles enable row level security;
alter table public.umkm_profiles enable row level security;
alter table public.creator_profiles enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can update own profile fields" on public.profiles;
drop policy if exists "Admins can read profiles" on public.profiles;

create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update own profile fields"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Admins can read profiles"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Users can view own umkm profile" on public.umkm_profiles;
drop policy if exists "Users can update own umkm profile" on public.umkm_profiles;
drop policy if exists "Admins can read umkm profiles" on public.umkm_profiles;

create policy "Users can view own umkm profile"
  on public.umkm_profiles for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can update own umkm profile"
  on public.umkm_profiles for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Admins can read umkm profiles"
  on public.umkm_profiles for select
  to authenticated
  using (public.is_admin());

drop policy if exists "Public can view active creators" on public.creator_profiles;
drop policy if exists "Creators can read own creator profile" on public.creator_profiles;
drop policy if exists "Creators can update own profile" on public.creator_profiles;
drop policy if exists "Admins can read creator profiles" on public.creator_profiles;

create policy "Public can view active creators"
  on public.creator_profiles for select
  to anon, authenticated
  using (public.is_public_creator_profile(user_id));

create policy "Creators can read own creator profile"
  on public.creator_profiles for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Creators can update own profile"
  on public.creator_profiles for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Admins can read creator profiles"
  on public.creator_profiles for select
  to authenticated
  using (public.is_admin());

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
