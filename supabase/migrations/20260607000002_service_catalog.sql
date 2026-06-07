create table service_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  icon_name text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger update_service_categories_updated_at before update on service_categories for each row execute procedure set_updated_at();

create table service_packages (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references creator_profiles(id) on delete cascade,
  category_id uuid references service_categories(id) on delete set null,
  title text not null,
  slug text not null,
  short_description text,
  description text,
  cover_image_url text,
  base_price numeric(12,2) not null default 0,
  estimated_days integer not null default 3,
  revision_count integer not null default 1,
  deliverables text[],
  requirements text[],
  tags text[],
  is_active boolean not null default true,
  is_featured boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (creator_id, slug)
);
create index service_packages_creator_id_idx on service_packages(creator_id);
create index service_packages_category_id_idx on service_packages(category_id);
create index service_packages_active_idx on service_packages(is_active);
create index service_packages_base_price_idx on service_packages(base_price);
create trigger update_service_packages_updated_at before update on service_packages for each row execute procedure set_updated_at();

create table service_package_tiers (
  id uuid primary key default gen_random_uuid(),
  service_package_id uuid not null references service_packages(id) on delete cascade,
  name text not null,
  description text,
  price numeric(12,2) not null,
  estimated_days integer not null,
  revision_count integer not null default 1,
  deliverables text[],
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger update_service_package_tiers_updated_at before update on service_package_tiers for each row execute procedure set_updated_at();

create table service_addons (
  id uuid primary key default gen_random_uuid(),
  service_package_id uuid not null references service_packages(id) on delete cascade,
  name text not null,
  description text,
  price numeric(12,2) not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger update_service_addons_updated_at before update on service_addons for each row execute procedure set_updated_at();

create table portfolios (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references creator_profiles(id) on delete cascade,
  title text not null,
  description text,
  category_id uuid references service_categories(id) on delete set null,
  thumbnail_url text,
  media_url text,
  external_url text,
  client_type text,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger update_portfolios_updated_at before update on portfolios for each row execute procedure set_updated_at();