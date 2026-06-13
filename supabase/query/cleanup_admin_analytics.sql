select
  'before_cleanup' as stage,
  count(*) as admin_event_count
from public.analytics_events
where role = 'admin'
  or path like '/admin%'
  or coalesce(referrer, '') ilike '%/admin%';

delete from public.analytics_events
where role = 'admin'
  or path like '/admin%'
  or coalesce(referrer, '') ilike '%/admin%';

select
  'after_cleanup' as stage,
  count(*) as admin_event_count
from public.analytics_events
where role = 'admin'
  or path like '/admin%'
  or coalesce(referrer, '') ilike '%/admin%';

select
  role,
  count(*) as remaining_event_count
from public.analytics_events
group by role
order by remaining_event_count desc;
