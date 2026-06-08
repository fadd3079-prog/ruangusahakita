drop policy if exists "Creators can create own portfolios" on portfolios;
create policy "Creators can create own portfolios"
  on portfolios for insert
  to authenticated
  with check (creator_id = current_creator_profile_id());

drop policy if exists "Creators can update own portfolios" on portfolios;
create policy "Creators can update own portfolios"
  on portfolios for update
  to authenticated
  using (creator_id = current_creator_profile_id())
  with check (creator_id = current_creator_profile_id());
