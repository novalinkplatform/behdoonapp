const TOKEN_KEY = 'behdoon_admin_token';
const LEGACY_TOKEN_KEY = 'behbar_admin_token';
const STAFF_KEY = 'behdoon_admin_staff';
const LEGACY_STAFF_KEY = 'behbar_admin_staff';
const SCREEN_KEY = 'behdoon_admin_screen';
const LEGACY_SCREEN_KEY = 'behbar_admin_screen';

export type StaffRole = string;
export type Permission =
  | 'pipeline'
  | 'map'
  | 'dashboard'
  | 'content'
  | 'homepage'
  | 'stories'
  | 'chat'
  | 'recruitment'
  | 'staff'
  | 'roles'
  | 'settings'
  | 'seo'
  | 'ai'
  | 'plugins'
  | 'assignments'
  | 'wallet'
  | '*';

export interface StaffInfo {
  id: number;
  username: string;
  fullName: string;
  role: StaffRole;
  roleLabel: string;
  permissions: Permission[];
  phone: string | null;
  avatarUrl: string | null;
  twoFactorEnabled: boolean;
  licenseLocked?: boolean;
  licenseSummary?: {
    type: 'trial' | 'annual' | 'golden';
    text: string;
    daysRemaining?: number;
  };
}

export function saveSession(token: string, staff: StaffInfo): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(STAFF_KEY, JSON.stringify(staff));
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  localStorage.removeItem(LEGACY_STAFF_KEY);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY) || localStorage.getItem(LEGACY_TOKEN_KEY);
}

export function getStaff(): StaffInfo | null {
  const raw = localStorage.getItem(STAFF_KEY) || localStorage.getItem(LEGACY_STAFF_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<StaffInfo>;
    if (!Array.isArray(parsed.permissions)) {
      clearSession();
      return null;
    }
    return parsed as StaffInfo;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(STAFF_KEY);
  localStorage.removeItem(SCREEN_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
  localStorage.removeItem(LEGACY_STAFF_KEY);
  localStorage.removeItem(LEGACY_SCREEN_KEY);
}

export interface SavedScreenState {
  screen: string;
  extra?: unknown;
}

export function saveScreenState(state: SavedScreenState): void {
  localStorage.setItem(SCREEN_KEY, JSON.stringify(state));
}

export function getScreenState(): SavedScreenState | null {
  const raw = localStorage.getItem(SCREEN_KEY) || localStorage.getItem(LEGACY_SCREEN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SavedScreenState;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getToken() !== null && getStaff() !== null;
}

export function hasPermission(role: StaffInfo, permission: Permission): boolean {
  if (role.role === 'super_admin' || (role.permissions ?? []).includes('*')) return true;
  return (role.permissions ?? []).includes(permission);
}

export function isPanelRole(staff: StaffInfo): boolean {
  return (staff.permissions ?? []).some((p) => p !== 'assignments');
}
