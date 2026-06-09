create or replace function admin_update_complaint_status(
  target_complaint_id uuid,
  next_status complaint_status,
  next_resolution_note text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_complaint_id uuid;
  v_resolution_note text := nullif(btrim(coalesce(next_resolution_note, '')), '');
begin
  if not is_admin() then
    raise exception 'not_admin';
  end if;

  if target_complaint_id is null or next_status is null then
    raise exception 'invalid_input';
  end if;

  if next_status in ('resolved', 'rejected') and v_resolution_note is null then
    raise exception 'resolution_note_required';
  end if;

  update complaints
  set complaint_status = next_status,
      resolution_note = v_resolution_note,
      resolved_at = case
        when next_status in ('resolved', 'rejected') then now()
        else null
      end
  where id = target_complaint_id
  returning id into v_complaint_id;

  if v_complaint_id is null then
    raise exception 'complaint_not_found';
  end if;

  return v_complaint_id;
end;
$$;

revoke execute on function admin_update_complaint_status(uuid, complaint_status, text) from public;
grant execute on function admin_update_complaint_status(uuid, complaint_status, text) to authenticated;
