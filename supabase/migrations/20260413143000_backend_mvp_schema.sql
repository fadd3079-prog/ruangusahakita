create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('umkm', 'creator')),
  name text not null,
  email text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.creator_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  slug text not null unique,
  brand_name text not null,
  city text,
  niche text,
  platforms text[] not null default '{}',
  short_bio text,
  full_bio text,
  price_from numeric(12, 2) not null default 0,
  banner_url text,
  portfolio_url text,
  social_links jsonb not null default '{}'::jsonb,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles(id) on delete cascade,
  business_name text not null,
  category text,
  city text,
  description text,
  main_product text,
  promotion_target text,
  contact text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  creator_profile_id uuid not null references public.creator_profiles(id) on delete cascade,
  slug text not null unique,
  title text not null,
  short_description text,
  description text,
  price numeric(12, 2) not null default 0,
  delivery_days integer not null default 1 check (delivery_days > 0),
  revision_count integer not null default 0 check (revision_count >= 0),
  outputs text[] not null default '{}',
  platforms text[] not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  creator_profile_id uuid not null references public.creator_profiles(id) on delete cascade,
  service_id uuid references public.services(id) on delete set null,
  title text not null,
  thumbnail_url text,
  category text,
  platform text,
  caption text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  creator_profile_id uuid not null references public.creator_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint favorites_profile_creator_unique unique (profile_id, creator_profile_id)
);

create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  business_profile_id uuid not null references public.business_profiles(id) on delete cascade,
  creator_profile_id uuid references public.creator_profiles(id) on delete set null,
  service_id uuid references public.services(id) on delete set null,
  title text not null,
  business_name text not null,
  business_category text,
  product_name text not null,
  promotion_goal text not null,
  target_audience text not null,
  budget_range text,
  deadline date,
  notes text,
  ai_draft text,
  status text not null default 'submitted' check (status in ('draft', 'submitted', 'reviewed', 'accepted', 'in_progress', 'done')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  creator_profile_id uuid not null references public.creator_profiles(id) on delete cascade,
  service_id uuid references public.services(id) on delete set null,
  reviewer_profile_id uuid references public.profiles(id) on delete set null,
  reviewer_name text not null,
  rating numeric(2, 1) not null check (rating >= 0 and rating <= 5),
  comment text,
  created_at timestamptz not null default now()
);

create index if not exists creator_profiles_slug_idx on public.creator_profiles(slug);
create index if not exists creator_profiles_niche_idx on public.creator_profiles(niche);
create index if not exists creator_profiles_city_idx on public.creator_profiles(city);
create index if not exists creator_profiles_price_from_idx on public.creator_profiles(price_from);
create index if not exists services_slug_idx on public.services(slug);
create index if not exists services_creator_profile_idx on public.services(creator_profile_id);
create index if not exists portfolios_creator_profile_idx on public.portfolios(creator_profile_id);
create index if not exists favorites_profile_idx on public.favorites(profile_id);
create index if not exists requests_business_profile_idx on public.requests(business_profile_id);
create index if not exists requests_creator_profile_idx on public.requests(creator_profile_id);
create index if not exists reviews_creator_profile_idx on public.reviews(creator_profile_id);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_creator_profiles_updated_at on public.creator_profiles;
create trigger set_creator_profiles_updated_at
before update on public.creator_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_business_profiles_updated_at on public.business_profiles;
create trigger set_business_profiles_updated_at
before update on public.business_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_services_updated_at on public.services;
create trigger set_services_updated_at
before update on public.services
for each row execute function public.set_updated_at();

drop trigger if exists set_portfolios_updated_at on public.portfolios;
create trigger set_portfolios_updated_at
before update on public.portfolios
for each row execute function public.set_updated_at();

drop trigger if exists set_requests_updated_at on public.requests;
create trigger set_requests_updated_at
before update on public.requests
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.creator_profiles enable row level security;
alter table public.business_profiles enable row level security;
alter table public.services enable row level security;
alter table public.portfolios enable row level security;
alter table public.favorites enable row level security;
alter table public.requests enable row level security;
alter table public.reviews enable row level security;

create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles for insert
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "creator_profiles_public_select"
on public.creator_profiles for select
using (is_published = true or profile_id = auth.uid());

create policy "creator_profiles_insert_own"
on public.creator_profiles for insert
with check (profile_id = auth.uid());

create policy "creator_profiles_update_own"
on public.creator_profiles for update
using (profile_id = auth.uid())
with check (profile_id = auth.uid());

create policy "business_profiles_select_own"
on public.business_profiles for select
using (profile_id = auth.uid());

create policy "business_profiles_insert_own"
on public.business_profiles for insert
with check (profile_id = auth.uid());

create policy "business_profiles_update_own"
on public.business_profiles for update
using (profile_id = auth.uid())
with check (profile_id = auth.uid());

create policy "services_public_select"
on public.services for select
using (
  is_active = true
  or exists (
    select 1 from public.creator_profiles cp
    where cp.id = services.creator_profile_id
    and cp.profile_id = auth.uid()
  )
);

create policy "services_manage_own"
on public.services for all
using (
  exists (
    select 1 from public.creator_profiles cp
    where cp.id = services.creator_profile_id
    and cp.profile_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.creator_profiles cp
    where cp.id = services.creator_profile_id
    and cp.profile_id = auth.uid()
  )
);

create policy "portfolios_public_select"
on public.portfolios for select
using (
  exists (
    select 1 from public.creator_profiles cp
    where cp.id = portfolios.creator_profile_id
    and (cp.is_published = true or cp.profile_id = auth.uid())
  )
);

create policy "portfolios_manage_own"
on public.portfolios for all
using (
  exists (
    select 1 from public.creator_profiles cp
    where cp.id = portfolios.creator_profile_id
    and cp.profile_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.creator_profiles cp
    where cp.id = portfolios.creator_profile_id
    and cp.profile_id = auth.uid()
  )
);

create policy "favorites_select_own"
on public.favorites for select
using (profile_id = auth.uid());

create policy "favorites_insert_own"
on public.favorites for insert
with check (profile_id = auth.uid());

create policy "favorites_delete_own"
on public.favorites for delete
using (profile_id = auth.uid());

create policy "requests_select_participants"
on public.requests for select
using (
  exists (
    select 1 from public.business_profiles bp
    where bp.id = requests.business_profile_id
    and bp.profile_id = auth.uid()
  )
  or exists (
    select 1 from public.creator_profiles cp
    where cp.id = requests.creator_profile_id
    and cp.profile_id = auth.uid()
  )
);

create policy "requests_insert_business_owner"
on public.requests for insert
with check (
  exists (
    select 1 from public.business_profiles bp
    where bp.id = requests.business_profile_id
    and bp.profile_id = auth.uid()
  )
);

create policy "requests_update_participants"
on public.requests for update
using (
  exists (
    select 1 from public.business_profiles bp
    where bp.id = requests.business_profile_id
    and bp.profile_id = auth.uid()
  )
  or exists (
    select 1 from public.creator_profiles cp
    where cp.id = requests.creator_profile_id
    and cp.profile_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.business_profiles bp
    where bp.id = requests.business_profile_id
    and bp.profile_id = auth.uid()
  )
  or exists (
    select 1 from public.creator_profiles cp
    where cp.id = requests.creator_profile_id
    and cp.profile_id = auth.uid()
  )
);

create policy "reviews_public_select"
on public.reviews for select
using (true);

create policy "reviews_insert_authenticated"
on public.reviews for insert
with check (auth.uid() is not null);
