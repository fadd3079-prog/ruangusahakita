do $$
declare
  selected_role text;
begin
  select
    case
      when exists (
        select 1
        from pg_enum
        join pg_type on pg_type.oid = pg_enum.enumtypid
        join pg_namespace on pg_namespace.oid = pg_type.typnamespace
        where pg_namespace.nspname = 'public'
          and pg_type.typname = 'user_role'
          and pg_enum.enumlabel = 'super_admin'
      )
      then 'super_admin'
      else 'admin'
    end
  into selected_role;

  execute format(
    $sql$
      insert into public.profiles (
        id,
        role,
        full_name,
        email,
        account_status,
        created_at,
        updated_at
      )
      select
        auth_users.id,
        %L::public.user_role,
        coalesce(
          nullif(auth_users.raw_user_meta_data ->> 'full_name', ''),
          nullif(auth_users.raw_user_meta_data ->> 'name', ''),
          split_part(auth_users.email, '@', 1),
          'Super Admin'
        ),
        auth_users.email,
        'active'::public.account_status,
        coalesce(auth_users.created_at, now()),
        now()
      from auth.users auth_users
      where auth_users.id = any (
        array[
          'b9d1e610-d296-48aa-998a-13afd8b793db',
          '75b790ce-80e1-4fa3-9375-d3b2a41daa12',
          '9d64f2db-c290-4706-8b8b-5f61353f65d7',
          '3801f724-6b46-49d5-ac83-286fea988ad2',
          'e87f9707-d63d-440b-9292-e68a91213c1d'
        ]::uuid[]
      )
        and auth_users.email is not null
      on conflict (id) do update
      set
        role = excluded.role,
        account_status = 'active'::public.account_status,
        email = excluded.email,
        full_name = coalesce(nullif(public.profiles.full_name, ''), excluded.full_name),
        updated_at = now()
    $sql$,
    selected_role
  );
exception
  when others then
    raise exception 'admin_profile_upsert_failed: %', sqlerrm;
end $$;

select
  pg_enum.enumlabel as available_role
from pg_enum
join pg_type on pg_type.oid = pg_enum.enumtypid
join pg_namespace on pg_namespace.oid = pg_type.typnamespace
where pg_namespace.nspname = 'public'
  and pg_type.typname = 'user_role'
order by pg_enum.enumsortorder;

select
  auth_users.id as user_id,
  auth_users.email as auth_email,
  profiles.id as profile_id,
  profiles.email as profile_email,
  profiles.full_name,
  profiles.role::text as profile_role,
  profiles.account_status::text as account_status,
  profiles.created_at,
  profiles.updated_at
from auth.users auth_users
left join public.profiles profiles on profiles.id = auth_users.id
where auth_users.id = any (
  array[
    'b9d1e610-d296-48aa-998a-13afd8b793db',
    '75b790ce-80e1-4fa3-9375-d3b2a41daa12',
    '9d64f2db-c290-4706-8b8b-5f61353f65d7',
    '3801f724-6b46-49d5-ac83-286fea988ad2',
    'e87f9707-d63d-440b-9292-e68a91213c1d'
  ]::uuid[]
)
order by auth_users.email;
