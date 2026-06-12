select
  id,
  email,
  created_at,
  updated_at
from auth.users
where id = '9d64f2db-c290-4706-8b8b-5f61353f65d7'::uuid
  and lower(email) = lower('adminfadhol@ruang.usaha');

select
  id,
  email,
  full_name,
  role,
  account_status,
  onboarding_completed,
  created_at,
  updated_at
from public.profiles
where id = '9d64f2db-c290-4706-8b8b-5f61353f65d7'::uuid;

with target_auth_user as (
  select
    id,
    email
  from auth.users
  where id = '9d64f2db-c290-4706-8b8b-5f61353f65d7'::uuid
    and lower(email) = lower('adminfadhol@ruang.usaha')
)
insert into public.profiles (
  id,
  email,
  full_name,
  role,
  account_status,
  onboarding_completed,
  onboarding_skipped_at
)
select
  id,
  email,
  'Super Admin Fadhol',
  'admin'::public.user_role,
  'active'::public.account_status,
  true,
  null
from target_auth_user
on conflict (id) do update
set
  email = excluded.email,
  full_name = coalesce(nullif(public.profiles.full_name, ''), excluded.full_name),
  role = 'admin'::public.user_role,
  account_status = 'active'::public.account_status,
  onboarding_completed = true,
  onboarding_skipped_at = null,
  updated_at = now()
returning
  id,
  email,
  full_name,
  role,
  account_status,
  onboarding_completed,
  created_at,
  updated_at;

select
  auth.users.id as user_id,
  auth.users.email,
  public.profiles.role as profile_role,
  public.profiles.account_status,
  public.profiles.full_name,
  public.profiles.created_at,
  public.profiles.updated_at
from auth.users
left join public.profiles on public.profiles.id = auth.users.id
where auth.users.id = '9d64f2db-c290-4706-8b8b-5f61353f65d7'::uuid
  and lower(auth.users.email) = lower('adminfadhol@ruang.usaha');
