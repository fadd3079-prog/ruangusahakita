create or replace function submit_order_review(
  target_order_id uuid,
  rating_value integer,
  quality_value integer,
  communication_value integer,
  timeliness_value integer,
  review_comment text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_umkm_id uuid;
  v_order orders%rowtype;
  v_review_id uuid;
begin
  if v_user_id is null then
    raise exception 'not_authenticated';
  end if;

  if rating_value < 1 or rating_value > 5 then
    raise exception 'invalid_rating';
  end if;

  if quality_value is not null and (quality_value < 1 or quality_value > 5) then
    raise exception 'invalid_rating';
  end if;

  if communication_value is not null and (communication_value < 1 or communication_value > 5) then
    raise exception 'invalid_rating';
  end if;

  if timeliness_value is not null and (timeliness_value < 1 or timeliness_value > 5) then
    raise exception 'invalid_rating';
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

  select *
  into v_order
  from orders
  where id = target_order_id
    and umkm_id = v_umkm_id
    and payment_status = 'paid'
    and order_status = 'completed'
  for update;

  if v_order.id is null then
    raise exception 'order_not_reviewable';
  end if;

  if exists (
    select 1
    from reviews
    where order_id = target_order_id
  ) then
    raise exception 'review_exists';
  end if;

  insert into reviews (
    order_id,
    umkm_id,
    creator_id,
    rating,
    quality_rating,
    communication_rating,
    timeliness_rating,
    comment
  )
  values (
    target_order_id,
    v_order.umkm_id,
    v_order.creator_id,
    rating_value,
    quality_value,
    communication_value,
    timeliness_value,
    nullif(trim(coalesce(review_comment, '')), '')
  )
  returning id into v_review_id;

  insert into activity_logs (
    actor_id,
    action,
    entity_type,
    entity_id,
    metadata
  )
  values (
    v_user_id,
    'review_created',
    'reviews',
    v_review_id,
    jsonb_build_object('order_id', target_order_id, 'creator_id', v_order.creator_id)
  );

  return v_review_id;
end;
$$;

create or replace function create_order_complaint(
  target_order_id uuid,
  complaint_subject text,
  complaint_description text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_order orders%rowtype;
  v_existing_id uuid;
  v_complaint_id uuid;
begin
  if v_user_id is null then
    raise exception 'not_authenticated';
  end if;

  if nullif(trim(coalesce(complaint_subject, '')), '') is null
    or nullif(trim(coalesce(complaint_description, '')), '') is null then
    raise exception 'complaint_required';
  end if;

  select *
  into v_order
  from orders
  where id = target_order_id
    and (
      umkm_id = current_umkm_profile_id()
      or creator_id = current_creator_profile_id()
    )
  limit 1;

  if v_order.id is null then
    raise exception 'order_not_accessible';
  end if;

  select id
  into v_existing_id
  from complaints
  where order_id = target_order_id
    and opened_by = v_user_id
    and complaint_status in ('open', 'under_review', 'waiting_umkm', 'waiting_creator')
  order by created_at desc
  limit 1;

  if v_existing_id is not null then
    return v_existing_id;
  end if;

  insert into complaints (
    order_id,
    opened_by,
    subject,
    description
  )
  values (
    target_order_id,
    v_user_id,
    trim(complaint_subject),
    trim(complaint_description)
  )
  returning id into v_complaint_id;

  insert into activity_logs (
    actor_id,
    action,
    entity_type,
    entity_id,
    metadata
  )
  values (
    v_user_id,
    'complaint_created',
    'complaints',
    v_complaint_id,
    jsonb_build_object('order_id', target_order_id)
  );

  return v_complaint_id;
end;
$$;

create or replace function send_order_message(
  target_order_id uuid,
  message_body text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_order orders%rowtype;
  v_message_id uuid;
begin
  if v_user_id is null then
    raise exception 'not_authenticated';
  end if;

  if nullif(trim(coalesce(message_body, '')), '') is null then
    raise exception 'message_required';
  end if;

  select *
  into v_order
  from orders
  where id = target_order_id
    and (
      umkm_id = current_umkm_profile_id()
      or creator_id = current_creator_profile_id()
    )
  limit 1;

  if v_order.id is null then
    raise exception 'order_not_accessible';
  end if;

  insert into messages (
    order_id,
    sender_id,
    message,
    is_internal
  )
  values (
    target_order_id,
    v_user_id,
    trim(message_body),
    false
  )
  returning id into v_message_id;

  insert into activity_logs (
    actor_id,
    action,
    entity_type,
    entity_id,
    metadata
  )
  values (
    v_user_id,
    'message_sent',
    'messages',
    v_message_id,
    jsonb_build_object('order_id', target_order_id)
  );

  return v_message_id;
end;
$$;

create or replace function mark_notification_read(target_notification_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'not_authenticated';
  end if;

  update notifications
  set is_read = true
  where id = target_notification_id
    and user_id = v_user_id
    and deleted_at is null;

  if not found then
    raise exception 'notification_not_found';
  end if;

  return target_notification_id;
end;
$$;

create or replace function admin_set_review_visibility(
  target_review_id uuid,
  next_visible boolean
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if not is_admin() then
    raise exception 'not_admin';
  end if;

  update reviews
  set is_visible = next_visible,
      updated_at = now()
  where id = target_review_id
    and deleted_at is null;

  if not found then
    raise exception 'review_not_found';
  end if;

  insert into activity_logs (
    actor_id,
    action,
    entity_type,
    entity_id,
    metadata
  )
  values (
    v_user_id,
    'review_visibility_updated',
    'reviews',
    target_review_id,
    jsonb_build_object('is_visible', next_visible)
  );

  return target_review_id;
end;
$$;

create or replace function notify_order_message_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_umkm_user_id uuid;
  v_creator_user_id uuid;
  v_target_user_id uuid;
begin
  select up.user_id, cp.user_id
  into v_umkm_user_id, v_creator_user_id
  from orders o
  join umkm_profiles up on up.id = o.umkm_id
  join creator_profiles cp on cp.id = o.creator_id
  where o.id = new.order_id;

  if new.sender_id = v_umkm_user_id then
    v_target_user_id := v_creator_user_id;
  elsif new.sender_id = v_creator_user_id then
    v_target_user_id := v_umkm_user_id;
  else
    v_target_user_id := null;
  end if;

  if v_target_user_id is not null then
    insert into notifications (
      user_id,
      notification_type,
      title,
      message,
      action_url
    )
    values (
      v_target_user_id,
      'system',
      'Pesan baru',
      left(new.message, 140),
      case when v_target_user_id = v_umkm_user_id then '/umkm/orders/' || new.order_id::text else '/creator/orders/' || new.order_id::text end
    );
  end if;

  return new;
end;
$$;

create or replace function notify_review_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_creator_user_id uuid;
begin
  select user_id
  into v_creator_user_id
  from creator_profiles
  where id = new.creator_id;

  if v_creator_user_id is not null then
    insert into notifications (
      user_id,
      notification_type,
      title,
      message,
      action_url
    )
    values (
      v_creator_user_id,
      'review',
      'Review baru diterima',
      'UMKM memberi rating ' || new.rating::text || ' untuk hasil konten.',
      '/creator/orders/' || new.order_id::text
    );
  end if;

  return new;
end;
$$;

create or replace function notify_complaint_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_umkm_user_id uuid;
  v_creator_user_id uuid;
  v_target_user_id uuid;
begin
  select up.user_id, cp.user_id
  into v_umkm_user_id, v_creator_user_id
  from orders o
  join umkm_profiles up on up.id = o.umkm_id
  join creator_profiles cp on cp.id = o.creator_id
  where o.id = new.order_id;

  if new.opened_by = v_umkm_user_id then
    v_target_user_id := v_creator_user_id;
  elsif new.opened_by = v_creator_user_id then
    v_target_user_id := v_umkm_user_id;
  else
    v_target_user_id := null;
  end if;

  if v_target_user_id is not null then
    insert into notifications (
      user_id,
      notification_type,
      title,
      message,
      action_url
    )
    values (
      v_target_user_id,
      'complaint',
      'Komplain order dibuka',
      new.subject,
      case when v_target_user_id = v_umkm_user_id then '/umkm/orders/' || new.order_id::text else '/creator/orders/' || new.order_id::text end
    );
  end if;

  insert into notifications (
    user_id,
    notification_type,
    title,
    message,
    action_url
  )
  select
    profiles.id,
    'complaint',
    'Komplain baru perlu ditinjau',
    new.subject,
    '/admin/complaints'
  from profiles
  where profiles.role = 'admin'
    and profiles.account_status = 'active';

  return new;
end;
$$;

create or replace function notify_submission_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_umkm_user_id uuid;
begin
  select up.user_id
  into v_umkm_user_id
  from orders o
  join umkm_profiles up on up.id = o.umkm_id
  where o.id = new.order_id;

  if v_umkm_user_id is not null then
    insert into notifications (
      user_id,
      notification_type,
      title,
      message,
      action_url
    )
    values (
      v_umkm_user_id,
      'submission',
      case when new.submission_type = 'revision' then 'Hasil revisi dikirim' else 'Hasil konten dikirim' end,
      new.title,
      '/umkm/orders/' || new.order_id::text
    );
  end if;

  return new;
end;
$$;

create or replace function notify_revision_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_creator_user_id uuid;
begin
  select cp.user_id
  into v_creator_user_id
  from orders o
  join creator_profiles cp on cp.id = o.creator_id
  where o.id = new.order_id;

  if v_creator_user_id is not null then
    insert into notifications (
      user_id,
      notification_type,
      title,
      message,
      action_url
    )
    values (
      v_creator_user_id,
      'revision',
      'Revisi diminta',
      left(new.revision_note, 140),
      '/creator/orders/' || new.order_id::text
    );
  end if;

  return new;
end;
$$;

drop trigger if exists notify_order_message_insert on messages;
create trigger notify_order_message_insert
after insert on messages
for each row execute function notify_order_message_insert();

drop trigger if exists notify_review_insert on reviews;
create trigger notify_review_insert
after insert on reviews
for each row execute function notify_review_insert();

drop trigger if exists notify_complaint_insert on complaints;
create trigger notify_complaint_insert
after insert on complaints
for each row execute function notify_complaint_insert();

drop trigger if exists notify_submission_insert on submissions;
create trigger notify_submission_insert
after insert on submissions
for each row execute function notify_submission_insert();

drop trigger if exists notify_revision_insert on revisions;
create trigger notify_revision_insert
after insert on revisions
for each row execute function notify_revision_insert();

drop policy if exists "Users can update own notifications" on notifications;
create policy "Users can update own notifications"
  on notifications for update
  to authenticated
  using (user_id = auth.uid() and deleted_at is null)
  with check (user_id = auth.uid());

drop policy if exists "Public can read visible reviews" on reviews;
create policy "Public can read visible reviews"
  on reviews for select
  using (is_visible = true and deleted_at is null);

revoke execute on function submit_order_review(uuid, integer, integer, integer, integer, text) from public;
revoke execute on function create_order_complaint(uuid, text, text) from public;
revoke execute on function send_order_message(uuid, text) from public;
revoke execute on function mark_notification_read(uuid) from public;
revoke execute on function admin_set_review_visibility(uuid, boolean) from public;

grant execute on function submit_order_review(uuid, integer, integer, integer, integer, text) to authenticated;
grant execute on function create_order_complaint(uuid, text, text) to authenticated;
grant execute on function send_order_message(uuid, text) to authenticated;
grant execute on function mark_notification_read(uuid) to authenticated;
grant execute on function admin_set_review_visibility(uuid, boolean) to authenticated;
