create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null,
  full_name text not null,
  email text not null unique,
  phone text,
  avatar_url text,
  account_status account_status not null default 'active',
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index profiles_role_idx on profiles(role);
create index profiles_email_idx on profiles(email);
create trigger update_profiles_updated_at before update on profiles for each row execute procedure set_updated_at();

create table umkm_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  business_name text not null,
  business_category text,
  business_description text,
  owner_name text,
  location text,
  city text,
  province text,
  instagram_url text,
  tiktok_url text,
  whatsapp_number text,
  logo_url text,
  target_audience text,
  content_preference text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger update_umkm_profiles_updated_at before update on umkm_profiles for each row execute procedure set_updated_at();

create table creator_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  display_name text not null,
  bio text,
  location text,
  city text,
  province text,
  niche text,
  skills text[],
  instagram_url text,
  tiktok_url text,
  youtube_url text,
  portfolio_url text,
  banner_url text,
  avatar_url text,
  availability_status creator_availability_status not null default 'available',
  starting_price numeric(12,2) default 0,
  average_rating numeric(3,2) default 0,
  completed_orders_count integer not null default 0,
  response_time_hours integer,
  is_verified boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index creator_profiles_user_id_idx on creator_profiles(user_id);
create index creator_profiles_niche_idx on creator_profiles(niche);
create index creator_profiles_city_idx on creator_profiles(city);
create index creator_profiles_rating_idx on creator_profiles(average_rating);
create index creator_profiles_featured_idx on creator_profiles(is_featured);
create trigger update_creator_profiles_updated_at before update on creator_profiles for each row execute procedure set_updated_at();