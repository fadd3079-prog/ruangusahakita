with target_emails as (
  select unnest(array[
    'creator24@ruang.usaha',
    'creator25@ruang.usaha',
    'creator26@ruang.usaha',
    'creator27@ruang.usaha',
    'creator28@ruang.usaha',
    'creator29@ruang.usaha',
    'creator30@ruang.usaha',
    'creator31@ruang.usaha',
    'creator32@ruang.usaha',
    'creator33@ruang.usaha',
    'creator34@ruang.usaha',
    'creator35@ruang.usaha',
    'creator36@ruang.usaha',
    'creator37@ruang.usaha',
    'creator38@ruang.usaha',
    'creator39@ruang.usaha',
    'creator40@ruang.usaha',
    'creator41@ruang.usaha',
    'creator42@ruang.usaha',
    'creator43@ruang.usaha',
    'creator44@ruang.usaha',
    'creator45@ruang.usaha',
    'creator46@ruang.usaha',
    'creator47@ruang.usaha',
    'creator48@ruang.usaha',
    'creator49@ruang.usaha',
    'creator50@ruang.usaha'
  ]) as email
)
select target_emails.email, auth.users.id, auth.users.email_confirmed_at, auth.users.created_at
from target_emails
left join auth.users on auth.users.email = target_emails.email
order by target_emails.email;

with target_emails as (
  select unnest(array[
    'creator24@ruang.usaha',
    'creator25@ruang.usaha',
    'creator26@ruang.usaha',
    'creator27@ruang.usaha',
    'creator28@ruang.usaha',
    'creator29@ruang.usaha',
    'creator30@ruang.usaha',
    'creator31@ruang.usaha',
    'creator32@ruang.usaha',
    'creator33@ruang.usaha',
    'creator34@ruang.usaha',
    'creator35@ruang.usaha',
    'creator36@ruang.usaha',
    'creator37@ruang.usaha',
    'creator38@ruang.usaha',
    'creator39@ruang.usaha',
    'creator40@ruang.usaha',
    'creator41@ruang.usaha',
    'creator42@ruang.usaha',
    'creator43@ruang.usaha',
    'creator44@ruang.usaha',
    'creator45@ruang.usaha',
    'creator46@ruang.usaha',
    'creator47@ruang.usaha',
    'creator48@ruang.usaha',
    'creator49@ruang.usaha',
    'creator50@ruang.usaha'
  ]) as email
)
select profiles.id, profiles.email, profiles.role, profiles.account_status, profiles.onboarding_completed, profiles.updated_at
from target_emails
join profiles on profiles.email = target_emails.email
order by profiles.email;

with target_emails as (
  select unnest(array[
    'creator24@ruang.usaha',
    'creator25@ruang.usaha',
    'creator26@ruang.usaha',
    'creator27@ruang.usaha',
    'creator28@ruang.usaha',
    'creator29@ruang.usaha',
    'creator30@ruang.usaha',
    'creator31@ruang.usaha',
    'creator32@ruang.usaha',
    'creator33@ruang.usaha',
    'creator34@ruang.usaha',
    'creator35@ruang.usaha',
    'creator36@ruang.usaha',
    'creator37@ruang.usaha',
    'creator38@ruang.usaha',
    'creator39@ruang.usaha',
    'creator40@ruang.usaha',
    'creator41@ruang.usaha',
    'creator42@ruang.usaha',
    'creator43@ruang.usaha',
    'creator44@ruang.usaha',
    'creator45@ruang.usaha',
    'creator46@ruang.usaha',
    'creator47@ruang.usaha',
    'creator48@ruang.usaha',
    'creator49@ruang.usaha',
    'creator50@ruang.usaha'
  ]) as email
)
select profiles.email, creator_profiles.id, creator_profiles.display_name, creator_profiles.niche, creator_profiles.city, creator_profiles.availability_status, creator_profiles.starting_price
from target_emails
join profiles on profiles.email = target_emails.email
join creator_profiles on creator_profiles.user_id = profiles.id
order by profiles.email;

with target_emails as (
  select unnest(array[
    'creator24@ruang.usaha',
    'creator25@ruang.usaha',
    'creator26@ruang.usaha',
    'creator27@ruang.usaha',
    'creator28@ruang.usaha',
    'creator29@ruang.usaha',
    'creator30@ruang.usaha',
    'creator31@ruang.usaha',
    'creator32@ruang.usaha',
    'creator33@ruang.usaha',
    'creator34@ruang.usaha',
    'creator35@ruang.usaha',
    'creator36@ruang.usaha',
    'creator37@ruang.usaha',
    'creator38@ruang.usaha',
    'creator39@ruang.usaha',
    'creator40@ruang.usaha',
    'creator41@ruang.usaha',
    'creator42@ruang.usaha',
    'creator43@ruang.usaha',
    'creator44@ruang.usaha',
    'creator45@ruang.usaha',
    'creator46@ruang.usaha',
    'creator47@ruang.usaha',
    'creator48@ruang.usaha',
    'creator49@ruang.usaha',
    'creator50@ruang.usaha'
  ]) as email
)
select profiles.email, creator_profiles.display_name, service_categories.name as category_name, service_packages.id, service_packages.title, service_packages.is_active, service_packages.published_at, service_packages.deleted_at
from target_emails
join profiles on profiles.email = target_emails.email
join creator_profiles on creator_profiles.user_id = profiles.id
join service_packages on service_packages.creator_id = creator_profiles.id
left join service_categories on service_categories.id = service_packages.category_id
order by profiles.email, service_packages.title;

with target_emails as (
  select unnest(array[
    'creator24@ruang.usaha',
    'creator25@ruang.usaha',
    'creator26@ruang.usaha',
    'creator27@ruang.usaha',
    'creator28@ruang.usaha',
    'creator29@ruang.usaha',
    'creator30@ruang.usaha',
    'creator31@ruang.usaha',
    'creator32@ruang.usaha',
    'creator33@ruang.usaha',
    'creator34@ruang.usaha',
    'creator35@ruang.usaha',
    'creator36@ruang.usaha',
    'creator37@ruang.usaha',
    'creator38@ruang.usaha',
    'creator39@ruang.usaha',
    'creator40@ruang.usaha',
    'creator41@ruang.usaha',
    'creator42@ruang.usaha',
    'creator43@ruang.usaha',
    'creator44@ruang.usaha',
    'creator45@ruang.usaha',
    'creator46@ruang.usaha',
    'creator47@ruang.usaha',
    'creator48@ruang.usaha',
    'creator49@ruang.usaha',
    'creator50@ruang.usaha'
  ]) as email
)
select profiles.email, service_packages.title, count(service_package_tiers.id) as tier_count, min(service_package_tiers.price) as starting_price
from target_emails
join profiles on profiles.email = target_emails.email
join creator_profiles on creator_profiles.user_id = profiles.id
join service_packages on service_packages.creator_id = creator_profiles.id
join service_package_tiers on service_package_tiers.service_package_id = service_packages.id
where service_package_tiers.tier_key in ('basic', 'medium', 'premium')
group by profiles.email, service_packages.title
order by profiles.email, service_packages.title;

with target_emails as (
  select unnest(array[
    'creator24@ruang.usaha',
    'creator25@ruang.usaha',
    'creator26@ruang.usaha',
    'creator27@ruang.usaha',
    'creator28@ruang.usaha',
    'creator29@ruang.usaha',
    'creator30@ruang.usaha',
    'creator31@ruang.usaha',
    'creator32@ruang.usaha',
    'creator33@ruang.usaha',
    'creator34@ruang.usaha',
    'creator35@ruang.usaha',
    'creator36@ruang.usaha',
    'creator37@ruang.usaha',
    'creator38@ruang.usaha',
    'creator39@ruang.usaha',
    'creator40@ruang.usaha',
    'creator41@ruang.usaha',
    'creator42@ruang.usaha',
    'creator43@ruang.usaha',
    'creator44@ruang.usaha',
    'creator45@ruang.usaha',
    'creator46@ruang.usaha',
    'creator47@ruang.usaha',
    'creator48@ruang.usaha',
    'creator49@ruang.usaha',
    'creator50@ruang.usaha'
  ]) as email
)
select profiles.email, service_packages.title, count(service_addons.id) as addon_count
from target_emails
join profiles on profiles.email = target_emails.email
join creator_profiles on creator_profiles.user_id = profiles.id
join service_packages on service_packages.creator_id = creator_profiles.id
left join service_addons on service_addons.service_package_id = service_packages.id and service_addons.is_active = true
group by profiles.email, service_packages.title
order by profiles.email, service_packages.title;

with target_emails as (
  select unnest(array[
    'creator24@ruang.usaha',
    'creator25@ruang.usaha',
    'creator26@ruang.usaha',
    'creator27@ruang.usaha',
    'creator28@ruang.usaha',
    'creator29@ruang.usaha',
    'creator30@ruang.usaha',
    'creator31@ruang.usaha',
    'creator32@ruang.usaha',
    'creator33@ruang.usaha',
    'creator34@ruang.usaha',
    'creator35@ruang.usaha',
    'creator36@ruang.usaha',
    'creator37@ruang.usaha',
    'creator38@ruang.usaha',
    'creator39@ruang.usaha',
    'creator40@ruang.usaha',
    'creator41@ruang.usaha',
    'creator42@ruang.usaha',
    'creator43@ruang.usaha',
    'creator44@ruang.usaha',
    'creator45@ruang.usaha',
    'creator46@ruang.usaha',
    'creator47@ruang.usaha',
    'creator48@ruang.usaha',
    'creator49@ruang.usaha',
    'creator50@ruang.usaha'
  ]) as email
)
select profiles.email, count(portfolios.id) as portfolio_count
from target_emails
join profiles on profiles.email = target_emails.email
join creator_profiles on creator_profiles.user_id = profiles.id
left join portfolios on portfolios.creator_id = creator_profiles.id and portfolios.deleted_at is null
group by profiles.email
order by profiles.email;

with target_emails as (
  select unnest(array[
    'creator24@ruang.usaha',
    'creator25@ruang.usaha',
    'creator26@ruang.usaha',
    'creator27@ruang.usaha',
    'creator28@ruang.usaha',
    'creator29@ruang.usaha',
    'creator30@ruang.usaha',
    'creator31@ruang.usaha',
    'creator32@ruang.usaha',
    'creator33@ruang.usaha',
    'creator34@ruang.usaha',
    'creator35@ruang.usaha',
    'creator36@ruang.usaha',
    'creator37@ruang.usaha',
    'creator38@ruang.usaha',
    'creator39@ruang.usaha',
    'creator40@ruang.usaha',
    'creator41@ruang.usaha',
    'creator42@ruang.usaha',
    'creator43@ruang.usaha',
    'creator44@ruang.usaha',
    'creator45@ruang.usaha',
    'creator46@ruang.usaha',
    'creator47@ruang.usaha',
    'creator48@ruang.usaha',
    'creator49@ruang.usaha',
    'creator50@ruang.usaha'
  ]) as email
)
select profiles.email, creator_profiles.display_name, service_packages.title, service_categories.name as category_name, min(service_package_tiers.price) as starting_price
from target_emails
join profiles on profiles.email = target_emails.email
join creator_profiles on creator_profiles.user_id = profiles.id
join service_packages on service_packages.creator_id = creator_profiles.id
join service_package_tiers on service_package_tiers.service_package_id = service_packages.id
left join service_categories on service_categories.id = service_packages.category_id
where profiles.role = 'creator'
  and profiles.account_status = 'active'
  and profiles.onboarding_completed = true
  and service_packages.is_active = true
  and service_packages.deleted_at is null
  and service_package_tiers.is_active = true
group by profiles.email, creator_profiles.display_name, service_packages.title, service_categories.name
order by profiles.email, service_packages.title;
