-- wrap db/040_storage_patient_photos.sql
create policy if not exists so_patient_photos_read_self_staff on storage.objects
  for select to authenticated
  using (
    bucket_id = 'patient-photos'
    and (
      (split_part(name, '/', 2))::uuid = auth.uid()
      or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','secretary','doctor'))
    )
  );

create policy if not exists so_patient_photos_insert_self_staff on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'patient-photos'
    and (
      (split_part(name, '/', 2))::uuid = auth.uid()
      or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','secretary','doctor'))
    )
  );

create policy if not exists so_patient_photos_delete_admin_staff on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'patient-photos'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','secretary','doctor'))
  );

