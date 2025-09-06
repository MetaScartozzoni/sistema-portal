// Role-based portal accessibility & default routing
// Each portal front-end should provide its URL via environment variables.
// Expected env vars (frontend-safe):
//  VITE_PORTAL_LOGIN_URL
//  VITE_PORTAL_ADMIN_URL
//  VITE_PORTAL_MEDICO_URL
//  VITE_PORTAL_ORCAMENTO_URL
//  VITE_PORTAL_SECRETARIA_URL
//  VITE_PORTAL_BOT_URL
//
// Roles: admin, medico, secretaria, paciente, guest
// Access rules (current specification):
//  admin: admin, medico, orcamento, bot
//  medico: admin, medico, orcamento, bot
//  secretaria: admin?, bot (explicit: not orcamento; assuming can view admin minimal)
//  paciente: (none cross-navigation; stays in patient portal)
//  guest: only login
// Adjust as business rules evolve.

const getEnv = () => {
  try {
    return (typeof import.meta !== 'undefined' && import.meta.env) || undefined;
  } catch { return undefined; }
};

const env = (key, fallback = undefined) => (getEnv()?.[key]) ?? fallback;
const envAny = (keys = [], fallback = undefined) => {
  const e = getEnv() || {};
  for (const k of keys) {
    if (e[k]) return e[k];
  }
  return fallback;
};

export const PORTAL_URLS = {
  login: envAny(['VITE_PORTAL_LOGIN_URL', 'VITE_LOGIN_PORTAL_URL'], 'https://portal.marcioplasticsurgery.com/portal-login'),
  admin: env('VITE_PORTAL_ADMIN_URL'),
  medico: env('VITE_PORTAL_MEDICO_URL'),
  orcamento: env('VITE_PORTAL_ORCAMENTO_URL'),
  secretaria: env('VITE_PORTAL_SECRETARIA_URL'),
  bot: env('VITE_PORTAL_BOT_URL')
};

// Mapping of role -> accessible portals (keys from PORTAL_URLS)
export const ROLE_PORTAL_ACCESS = {
  admin: ['admin', 'medico', 'orcamento', 'bot'],
  medico: ['admin', 'medico', 'orcamento', 'bot'],
  secretaria: ['admin', 'bot'], // assumindo admin visível para secretaria (ajustar se necessário)
  paciente: [],
  guest: ['login']
};

export function getAccessiblePortals(role) {
  const key = role || 'guest';
  const list = ROLE_PORTAL_ACCESS[key] || [];
  return list
    .map(code => ({ code, url: PORTAL_URLS[code] }))
    .filter(p => !!p.url);
}

export function getDefaultPortalForRole(role) {
  const portals = getAccessiblePortals(role);
  if (!portals.length) return PORTAL_URLS.login;
  // heuristic: prefer the first in access list that is not login
  const first = portals.find(p => p.code !== 'login');
  return (first || portals[0]).url;
}

export function resolvePostLoginRedirect({ role, explicitRedirect }) {
  if (explicitRedirect) return explicitRedirect;
  return getDefaultPortalForRole(role);
}
