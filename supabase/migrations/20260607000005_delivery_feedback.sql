create table submissions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  creator_id uuid not null references creator_profiles(id) on delete restrict,
  title text not null,
  description text,
  file_urls text[],
  external_links text[],
  caption_text text,
  submission_type text,
  version_number integer not null default 1,
  submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table revisions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  submission_id uuid references submissions(id) on delete set null,
  requested_by uuid not null references profiles(id) on delete restrict,
  revision_status revision_status not null default 'requested',
  revision_note text not null,
  reference_urls text[],
  response_note text,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger update_revisions_updated_at before update on revisions for each row execute procedure set_updated_at();

create table reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references orders(id) on delete cascade,
  umkm_id uuid not null references umkm_profiles(id) on delete restrict,
  creator_id uuid not null references creator_profiles(id) on delete restrict,
  rating integer not null check (rating >= 1 and rating <= 5),
  quality_rating integer check (quality_rating >= 1 and quality_rating <= 5),
  communication_rating integer check (communication_rating >= 1 and communication_rating <= 5),
  timeliness_rating integer check (timeliness_rating >= 1 and timeliness_rating <= 5),
  comment text,
  is_visible boolean not null default true,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index reviews_creator_id_idx on reviews(creator_id);
create index reviews_rating_idx on reviews(rating);
create trigger update_reviews_updated_at before update on reviews for each row execute procedure set_updated_at();

create table complaints (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  opened_by uuid not null references profiles(id) on delete restrict,
  assigned_admin_id uuid references profiles(id) on delete set null,
  complaint_status complaint_status not null default 'open',
  subject text not null,
  description text not null,
  resolution_note text,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger update_complaints_updated_at before update on complaints for each row execute procedure set_updated_at();