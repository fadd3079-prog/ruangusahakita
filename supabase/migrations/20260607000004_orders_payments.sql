create table campaign_briefs (
  id uuid primary key default gen_random_uuid(),
  umkm_id uuid not null references umkm_profiles(id) on delete cascade,
  order_id uuid, -- Can be null initially before order is confirmed
  business_name text not null,
  business_category text,
  promoted_product text not null,
  campaign_goal text not null,
  target_audience text,
  content_platforms text[],
  content_style text,
  reference_links text[],
  deadline date,
  additional_notes text,
  asset_urls text[],
  status text not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger update_campaign_briefs_updated_at before update on campaign_briefs for each row execute procedure set_updated_at();

create table orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  umkm_id uuid not null references umkm_profiles(id) on delete restrict,
  creator_id uuid not null references creator_profiles(id) on delete restrict,
  campaign_brief_id uuid references campaign_briefs(id) on delete set null,
  order_status order_status not null default 'awaiting_payment',
  payment_status payment_status not null default 'pending',
  subtotal_amount numeric(12,2) not null default 0,
  addon_amount numeric(12,2) not null default 0,
  admin_fee numeric(12,2) not null default 0,
  platform_fee numeric(12,2) not null default 0,
  discount_amount numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null default 0,
  deadline date,
  completed_at timestamptz,
  cancelled_at timestamptz,
  cancellation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_umkm_id_idx on orders(umkm_id);
create index orders_creator_id_idx on orders(creator_id);
create index orders_order_status_idx on orders(order_status);
create index orders_payment_status_idx on orders(payment_status);
create index orders_created_at_idx on orders(created_at);
create trigger update_orders_updated_at before update on orders for each row execute procedure set_updated_at();

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  service_package_id uuid references service_packages(id) on delete set null,
  tier_id uuid references service_package_tiers(id) on delete set null,
  service_title text not null,
  tier_name text,
  unit_price numeric(12,2) not null,
  addon_total numeric(12,2) not null default 0,
  subtotal numeric(12,2) not null,
  estimated_days integer,
  revision_count integer,
  deliverables text[],
  created_at timestamptz not null default now()
);

create table order_item_addons (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid not null references order_items(id) on delete cascade,
  addon_name text not null,
  price numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create table payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  payment_number text not null unique,
  payment_status payment_status not null default 'pending',
  payment_method payment_method,
  amount numeric(12,2) not null,
  provider text,
  provider_transaction_id text,
  provider_payment_url text,
  paid_at timestamptz,
  expired_at timestamptz,
  raw_response jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index payments_order_id_idx on payments(order_id);
create index payments_payment_status_idx on payments(payment_status);
create index payments_provider_transaction_id_idx on payments(provider_transaction_id);
create trigger update_payments_updated_at before update on payments for each row execute procedure set_updated_at();

create table invoices (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  payment_id uuid references payments(id) on delete set null,
  invoice_number text not null unique,
  subtotal_amount numeric(12,2) not null,
  addon_amount numeric(12,2) not null default 0,
  admin_fee numeric(12,2) not null default 0,
  platform_fee numeric(12,2) not null default 0,
  discount_amount numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null,
  issued_at timestamptz not null default now(),
  paid_at timestamptz,
  invoice_url text,
  created_at timestamptz not null default now()
);

create table order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  previous_status order_status,
  new_status order_status not null,
  changed_by uuid references profiles(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);