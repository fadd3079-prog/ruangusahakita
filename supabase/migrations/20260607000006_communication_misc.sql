create table messages (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  message text not null,
  attachment_urls text[],
  is_internal boolean not null default false,
  created_at timestamptz not null default now()
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  notification_type notification_type not null default 'system',
  title text not null,
  message text,
  action_url text,
  is_read boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);

create table saved_creators (
  id uuid primary key default gen_random_uuid(),
  umkm_id uuid not null references umkm_profiles(id) on delete cascade,
  creator_id uuid not null references creator_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (umkm_id, creator_id)
);

create table platform_settings (
  key text primary key,
  value jsonb not null,
  description text,
  updated_by uuid references profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);
create trigger update_platform_settings_updated_at before update on platform_settings for each row execute procedure set_updated_at();

create table activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references profiles(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);