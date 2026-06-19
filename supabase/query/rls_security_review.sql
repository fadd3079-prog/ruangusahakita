select
  pg_namespace.nspname as schemaname,
  pg_class.relname as tablename,
  pg_class.relrowsecurity as rls_enabled,
  pg_class.relforcerowsecurity as rls_forced
from pg_class
join pg_namespace on pg_namespace.oid = pg_class.relnamespace
where pg_namespace.nspname in ('public', 'storage')
  and pg_class.relkind in ('r', 'p')
  and pg_class.relname in (
    'activity_logs',
    'analytics_events',
    'campaign_briefs',
    'cart_item_addons',
    'cart_items',
    'carts',
    'complaints',
    'creator_profiles',
    'file_assets',
    'invoices',
    'messages',
    'notifications',
    'order_item_addons',
    'order_items',
    'order_messages',
    'order_status_history',
    'orders',
    'payments',
    'platform_settings',
    'portfolios',
    'profiles',
    'reviews',
    'revisions',
    'service_addons',
    'service_categories',
    'service_media',
    'service_package_tiers',
    'service_packages',
    'submissions',
    'umkm_profiles',
    'objects',
    'buckets'
  )
order by pg_namespace.nspname, pg_class.relname;

select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname in ('public', 'storage')
order by schemaname, tablename, cmd, policyname;

select
  schemaname,
  tablename,
  policyname,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
where schemaname in ('public', 'storage')
  and (
    coalesce(qual, '') ~* '\btrue\b'
    or coalesce(with_check, '') ~* '\btrue\b'
    or roles::text ilike '%anon%'
  )
order by schemaname, tablename, cmd, policyname;

select
  table_schema,
  table_name,
  privilege_type,
  grantee
from information_schema.role_table_grants
where table_schema in ('public', 'storage')
  and grantee in ('anon', 'authenticated', 'public')
order by table_schema, table_name, grantee, privilege_type;

select
  n.nspname as function_schema,
  p.proname as function_name,
  pg_get_function_identity_arguments(p.oid) as arguments,
  p.prosecdef as security_definer,
  array_to_string(p.proacl, ', ') as grants
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and (
    p.prosecdef = true
    or p.proname ilike '%payment%'
    or p.proname ilike '%order%'
    or p.proname ilike '%admin%'
    or p.proname ilike '%review%'
    or p.proname ilike '%complaint%'
  )
order by p.prosecdef desc, function_schema, function_name;

select
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
from storage.buckets
order by name;
