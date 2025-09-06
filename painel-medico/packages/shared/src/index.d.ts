export interface AccessiblePortal { code: string; url: string; }
export interface AuthUser { id?: string; role?: string; email?: string; [k: string]: any }
export interface AuthStoreExports {
  useAuthStore: any;
  api: any;
}
export function createAuthStore(config?: {
  apiBaseUrl?: string;
  loginPortalUrl?: string;
  guestRole?: string;
  persistKey?: string;
}): AuthStoreExports;
export const PORTAL_URLS: Record<string, string | undefined>;
export const ROLE_PORTAL_ACCESS: Record<string, string[]>;
export function getAccessiblePortals(role?: string | null): AccessiblePortal[];
export function getDefaultPortalForRole(role?: string | null): string | undefined;
export function resolvePostLoginRedirect(opts: { role?: string; explicitRedirect?: string | null }): string | undefined;
export const PortalSwitcher: any;