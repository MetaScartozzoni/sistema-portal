export const mapRawUser = (raw) => ({
  id: raw.id,
  email: raw.email,
  name: raw.name || raw.full_name || raw.username,
  role: raw.role,
});
export const isUser = (obj) => obj && typeof obj === 'object' && 'email' in obj;
