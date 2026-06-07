
create type user_role as enum ('admin', 'umkm', 'creator');
create type account_status as enum ('active', 'inactive', 'suspended', 'pending_verification');
create type creator_availability_status as enum ('available', 'limited', 'busy', 'unavailable');
create type order_status as enum ('draft', 'awaiting_payment', 'paid', 'waiting_creator_confirmation', 'brief_accepted', 'in_progress', 'submitted', 'revision_requested', 'revised', 'completed', 'cancelled', 'refunded');
create type payment_status as enum ('pending', 'paid', 'failed', 'expired', 'refunded', 'partially_refunded');
create type payment_method as enum ('bank_transfer', 'qris', 'ewallet', 'virtual_account', 'manual');
create type revision_status as enum ('requested', 'in_progress', 'submitted', 'approved', 'rejected');
create type complaint_status as enum ('open', 'under_review', 'waiting_umkm', 'waiting_creator', 'resolved', 'rejected');
create type notification_type as enum ('order', 'payment', 'revision', 'submission', 'review', 'complaint', 'system');


create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;