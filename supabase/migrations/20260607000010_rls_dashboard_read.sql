create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from profiles
    where id = auth.uid()
      and role = 'admin'
      and account_status = 'active'
  );
$$;

create or replace function current_umkm_profile_id()
returns uuid
language sql
security definer
set search_path = public
as $$
  select id
  from umkm_profiles
  where user_id = auth.uid()
  limit 1;
$$;

create or replace function current_creator_profile_id()
returns uuid
language sql
security definer
set search_path = public
as $$
  select id
  from creator_profiles
  where user_id = auth.uid()
  limit 1;
$$;

create policy "Admins can read profiles"
  on profiles for select
  using (is_admin());

create policy "Admins can read umkm profiles"
  on umkm_profiles for select
  using (is_admin());

create policy "Creators can read related umkm profiles"
  on umkm_profiles for select
  using (
    exists (
      select 1
      from orders
      where orders.umkm_id = umkm_profiles.id
        and orders.creator_id = current_creator_profile_id()
    )
  );

create policy "Creators can read own creator profile"
  on creator_profiles for select
  using (auth.uid() = user_id);

create policy "Admins can read creator profiles"
  on creator_profiles for select
  using (is_admin());

create policy "UMKM can read related creator profiles"
  on creator_profiles for select
  using (
    exists (
      select 1
      from orders
      where orders.creator_id = creator_profiles.id
        and orders.umkm_id = current_umkm_profile_id()
    )
  );

create policy "Creators can read own service packages"
  on service_packages for select
  using (creator_id = current_creator_profile_id());

create policy "Admins can read service packages"
  on service_packages for select
  using (is_admin());

create policy "Creators can read own service package tiers"
  on service_package_tiers for select
  using (
    exists (
      select 1
      from service_packages
      where service_packages.id = service_package_tiers.service_package_id
        and service_packages.creator_id = current_creator_profile_id()
    )
  );

create policy "Admins can read service package tiers"
  on service_package_tiers for select
  using (is_admin());

create policy "Creators can read own service addons"
  on service_addons for select
  using (
    exists (
      select 1
      from service_packages
      where service_packages.id = service_addons.service_package_id
        and service_packages.creator_id = current_creator_profile_id()
    )
  );

create policy "Admins can read service addons"
  on service_addons for select
  using (is_admin());

create policy "Admins can read service categories"
  on service_categories for select
  using (is_admin());

create policy "Creators can read own portfolios"
  on portfolios for select
  using (creator_id = current_creator_profile_id());

create policy "Admins can read portfolios"
  on portfolios for select
  using (is_admin());

alter table carts enable row level security;
alter table cart_items enable row level security;
alter table cart_item_addons enable row level security;
alter table campaign_briefs enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table order_item_addons enable row level security;
alter table payments enable row level security;
alter table invoices enable row level security;
alter table order_status_history enable row level security;
alter table submissions enable row level security;
alter table revisions enable row level security;
alter table reviews enable row level security;
alter table complaints enable row level security;
alter table messages enable row level security;
alter table notifications enable row level security;
alter table saved_creators enable row level security;
alter table platform_settings enable row level security;
alter table activity_logs enable row level security;

create policy "UMKM can read own carts"
  on carts for select
  using (umkm_id = current_umkm_profile_id());

create policy "Admins can read carts"
  on carts for select
  using (is_admin());

create policy "UMKM can read own cart items"
  on cart_items for select
  using (
    exists (
      select 1
      from carts
      where carts.id = cart_items.cart_id
        and carts.umkm_id = current_umkm_profile_id()
    )
  );

create policy "Admins can read cart items"
  on cart_items for select
  using (is_admin());

create policy "UMKM can read own cart item addons"
  on cart_item_addons for select
  using (
    exists (
      select 1
      from cart_items
      join carts on carts.id = cart_items.cart_id
      where cart_items.id = cart_item_addons.cart_item_id
        and carts.umkm_id = current_umkm_profile_id()
    )
  );

create policy "Admins can read cart item addons"
  on cart_item_addons for select
  using (is_admin());

create policy "UMKM can read own briefs"
  on campaign_briefs for select
  using (umkm_id = current_umkm_profile_id());

create policy "Creators can read assigned briefs"
  on campaign_briefs for select
  using (
    exists (
      select 1
      from orders
      where orders.campaign_brief_id = campaign_briefs.id
        and orders.creator_id = current_creator_profile_id()
    )
  );

create policy "Admins can read briefs"
  on campaign_briefs for select
  using (is_admin());

create policy "UMKM can read own orders"
  on orders for select
  using (umkm_id = current_umkm_profile_id());

create policy "Creators can read assigned orders"
  on orders for select
  using (creator_id = current_creator_profile_id());

create policy "Admins can read orders"
  on orders for select
  using (is_admin());

create policy "Participants can read order items"
  on order_items for select
  using (
    exists (
      select 1
      from orders
      where orders.id = order_items.order_id
        and (
          orders.umkm_id = current_umkm_profile_id()
          or orders.creator_id = current_creator_profile_id()
        )
    )
  );

create policy "Admins can read order items"
  on order_items for select
  using (is_admin());

create policy "Participants can read order item addons"
  on order_item_addons for select
  using (
    exists (
      select 1
      from order_items
      join orders on orders.id = order_items.order_id
      where order_items.id = order_item_addons.order_item_id
        and (
          orders.umkm_id = current_umkm_profile_id()
          or orders.creator_id = current_creator_profile_id()
        )
    )
  );

create policy "Admins can read order item addons"
  on order_item_addons for select
  using (is_admin());

create policy "Participants can read payments"
  on payments for select
  using (
    exists (
      select 1
      from orders
      where orders.id = payments.order_id
        and (
          orders.umkm_id = current_umkm_profile_id()
          or orders.creator_id = current_creator_profile_id()
        )
    )
  );

create policy "Admins can read payments"
  on payments for select
  using (is_admin());

create policy "Participants can read invoices"
  on invoices for select
  using (
    exists (
      select 1
      from orders
      where orders.id = invoices.order_id
        and (
          orders.umkm_id = current_umkm_profile_id()
          or orders.creator_id = current_creator_profile_id()
        )
    )
  );

create policy "Admins can read invoices"
  on invoices for select
  using (is_admin());

create policy "Participants can read order status history"
  on order_status_history for select
  using (
    exists (
      select 1
      from orders
      where orders.id = order_status_history.order_id
        and (
          orders.umkm_id = current_umkm_profile_id()
          or orders.creator_id = current_creator_profile_id()
        )
    )
  );

create policy "Admins can read order status history"
  on order_status_history for select
  using (is_admin());

create policy "Participants can read submissions"
  on submissions for select
  using (
    creator_id = current_creator_profile_id()
    or exists (
      select 1
      from orders
      where orders.id = submissions.order_id
        and orders.umkm_id = current_umkm_profile_id()
    )
  );

create policy "Admins can read submissions"
  on submissions for select
  using (is_admin());

create policy "Participants can read revisions"
  on revisions for select
  using (
    requested_by = auth.uid()
    or exists (
      select 1
      from orders
      where orders.id = revisions.order_id
        and (
          orders.umkm_id = current_umkm_profile_id()
          or orders.creator_id = current_creator_profile_id()
        )
    )
  );

create policy "Admins can read revisions"
  on revisions for select
  using (is_admin());

create policy "Participants can read reviews"
  on reviews for select
  using (
    umkm_id = current_umkm_profile_id()
    or creator_id = current_creator_profile_id()
  );

create policy "Admins can read reviews"
  on reviews for select
  using (is_admin());

create policy "Participants can read complaints"
  on complaints for select
  using (
    opened_by = auth.uid()
    or assigned_admin_id = auth.uid()
    or exists (
      select 1
      from orders
      where orders.id = complaints.order_id
        and (
          orders.umkm_id = current_umkm_profile_id()
          or orders.creator_id = current_creator_profile_id()
        )
    )
  );

create policy "Admins can read complaints"
  on complaints for select
  using (is_admin());

create policy "Participants can read visible messages"
  on messages for select
  using (
    is_internal = false
    and exists (
      select 1
      from orders
      where orders.id = messages.order_id
        and (
          orders.umkm_id = current_umkm_profile_id()
          or orders.creator_id = current_creator_profile_id()
        )
    )
  );

create policy "Admins can read messages"
  on messages for select
  using (is_admin());

create policy "Users can read own notifications"
  on notifications for select
  using (user_id = auth.uid() and deleted_at is null);

create policy "Admins can read notifications"
  on notifications for select
  using (is_admin());

create policy "UMKM can read own saved creators"
  on saved_creators for select
  using (umkm_id = current_umkm_profile_id());

create policy "Admins can read saved creators"
  on saved_creators for select
  using (is_admin());

create policy "Admins can read platform settings"
  on platform_settings for select
  using (is_admin());

create policy "Admins can read activity logs"
  on activity_logs for select
  using (is_admin());
