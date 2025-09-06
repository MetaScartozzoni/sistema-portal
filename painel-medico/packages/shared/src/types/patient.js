export const mapRawPatient = (raw) => ({
  id: raw.id,
  full_name: raw.full_name || raw.name,
  email: raw.email,
  phone: raw.phone,
  surgery_date: raw.surgery_date,
  first_contact_date: raw.first_contact_date,
  protocol: raw.protocol,
  current_stage: raw.current_stage,
});
export const isPatient = (obj) => obj && typeof obj === 'object' && 'full_name' in obj;
