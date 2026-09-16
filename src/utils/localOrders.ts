const PHONE_STORAGE_KEY = 'behbar_last_phone';
const NAME_STORAGE_KEY = 'behbar_last_name';

export function saveLastPhone(phone: string): void {
  try {
    localStorage.setItem(PHONE_STORAGE_KEY, phone);
  } catch {
    /* localStorage unavailable (private mode etc.) — non-critical */
  }
}

export function getLastPhone(): string | null {
  try {
    return localStorage.getItem(PHONE_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveLastName(name: string): void {
  try {
    localStorage.setItem(NAME_STORAGE_KEY, name);
  } catch {
    /* localStorage unavailable (private mode etc.) — non-critical */
  }
}

export function getLastName(): string | null {
  try {
    return localStorage.getItem(NAME_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function clearLastUser(): void {
  try {
    localStorage.removeItem(PHONE_STORAGE_KEY);
    localStorage.removeItem(NAME_STORAGE_KEY);
  } catch {
    /* localStorage unavailable (private mode etc.) — non-critical */
  }
}
