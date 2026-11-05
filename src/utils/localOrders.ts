const PHONE_STORAGE_KEY = 'behdoon_last_phone';
const LEGACY_PHONE_STORAGE_KEY = 'behbar_last_phone';
const NAME_STORAGE_KEY = 'behdoon_last_name';
const LEGACY_NAME_STORAGE_KEY = 'behbar_last_name';
const ADDRESS_STORAGE_KEY = 'behdoon_last_address';
const SAVED_ADDRESSES_STORAGE_KEY = 'behdoon_saved_addresses';

export function saveLastAddress(address: string): void {
  const clean = (address || '').trim();
  if (!clean) return;
  try {
    localStorage.setItem(ADDRESS_STORAGE_KEY, clean);
    const existing = getSavedAddresses();
    const updated = [clean, ...existing.filter((a) => a !== clean)].slice(0, 5);
    localStorage.setItem(SAVED_ADDRESSES_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    /* localStorage unavailable */
  }
}

export function getLastAddress(): string | null {
  try {
    return localStorage.getItem(ADDRESS_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function getSavedAddresses(): string[] {
  try {
    const raw = localStorage.getItem(SAVED_ADDRESSES_STORAGE_KEY);
    if (!raw) {
      const last = getLastAddress();
      return last ? [last] : [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveLastPhone(phone: string): void {
  try {
    localStorage.setItem(PHONE_STORAGE_KEY, phone);
  } catch {
    /* localStorage unavailable (private mode etc.) — non-critical */
  }
}

export function getLastPhone(): string | null {
  try {
    return localStorage.getItem(PHONE_STORAGE_KEY) || localStorage.getItem(LEGACY_PHONE_STORAGE_KEY);
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
    return localStorage.getItem(NAME_STORAGE_KEY) || localStorage.getItem(LEGACY_NAME_STORAGE_KEY);
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
