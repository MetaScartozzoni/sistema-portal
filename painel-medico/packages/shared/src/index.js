export * from './types/index.js';
export { createAuthStore } from './auth/store.js';
export { PORTAL_URLS, ROLE_PORTAL_ACCESS, getAccessiblePortals, getDefaultPortalForRole, resolvePostLoginRedirect } from './auth/portalAccess.js';
export { PortalSwitcher } from './components/PortalSwitcher.jsx';
