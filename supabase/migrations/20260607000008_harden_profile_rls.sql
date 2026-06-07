-- 1. Drop the loose update policy
drop policy "Users can update own profile" on profiles;

-- 2. Create a more restrictive update policy for profiles
-- This policy allows updates only if the user is the owner.
-- To prevent role/status changes, we use a trigger (see below) because RLS 'with check' 
-- cannot easily compare OLD vs NEW values for specific columns without complex subqueries or functions.
create policy "Users can update own profile fields" 
  on profiles for update 
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 3. Add a trigger to prevent unauthorized role/status changes on the profiles table
create or replace function protect_profile_sensitive_fields()
returns trigger as $$
begin
  -- Prevent role change
  if old.role <> new.role then
    new.role = old.role;
  end if;

  -- Prevent account_status change (except by admin via service role which bypasses this if configured, 
  -- but actually service role also triggers this. If admin needs to change it, they can but usually 
  -- we want to be strict. For now, let's just log or prevent.)
  -- We allow the change if it's the service role (bypass RLS doesn't bypass triggers).
  -- In Supabase, service role has 'current_setting('role')' as 'service_role' or 'authenticated'.
  -- However, we'll keep it simple: only allow change if it's not a user-initiated change 
  -- that violates our rules.
  
  -- Actually, let's just make it so only specific columns can be updated via this trigger for non-admins.
  if (current_setting('role') <> 'service_role') then
    if old.role <> new.role then
      raise exception 'You are not allowed to change your role.';
    end if;
    if old.account_status <> new.account_status then
      raise exception 'You are not allowed to change your account status.';
    end if;
    if old.email <> new.email then
      raise exception 'Email changes must be handled via Supabase Auth.';
    end if;
  end if;

  return new;
end;
$$ language plpgsql;

create trigger profile_protection_trigger
before update on profiles
for each row execute function protect_profile_sensitive_fields();

-- 4. Harden Creator Profiles
-- We already have "Public can view active creators" using (true).
-- Let's make it more professional: only allow viewing if account is active.
drop policy "Public can view active creators" on creator_profiles;
create policy "Public can view active creators" 
  on creator_profiles for select 
  using (
    exists (
      select 1 from profiles 
      where profiles.id = creator_profiles.user_id 
      and profiles.account_status = 'active'
    )
  );

-- 5. Ensure UMKM and Creator profiles cannot change user_id
create or replace function protect_user_id_fk()
returns trigger as $$
begin
  if old.user_id <> new.user_id then
    raise exception 'Changing user_id is not allowed.';
  end if;
  return new;
end;
$$ language plpgsql;

create trigger umkm_profile_user_id_protection
before update on umkm_profiles
for each row execute function protect_user_id_fk();

create trigger creator_profile_user_id_protection
before update on creator_profiles
for each row execute function protect_user_id_fk();
