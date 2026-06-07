create table carts (
  id uuid primary key default gen_random_uuid(),
  umkm_id uuid not null references umkm_profiles(id) on delete cascade,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger update_carts_updated_at before update on carts for each row execute procedure set_updated_at();

create table cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references carts(id) on delete cascade,
  service_package_id uuid not null references service_packages(id) on delete cascade,
  tier_id uuid references service_package_tiers(id) on delete set null,
  creator_id uuid not null references creator_profiles(id) on delete cascade,
  quantity integer not null default 1,
  unit_price numeric(12,2) not null,
  addon_total numeric(12,2) not null default 0,
  subtotal numeric(12,2) not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger update_cart_items_updated_at before update on cart_items for each row execute procedure set_updated_at();

create table cart_item_addons (
  id uuid primary key default gen_random_uuid(),
  cart_item_id uuid not null references cart_items(id) on delete cascade,
  addon_id uuid not null references service_addons(id) on delete cascade,
  price numeric(12,2) not null,
  created_at timestamptz not null default now()
);