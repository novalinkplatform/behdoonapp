/**
 * High-Security Cryptographic & Hashing Utilities for Behdoon Platform
 * Works seamlessly in both Cloudflare Workers runtime and Node.js v18+ (using Web Crypto API)
 */

const PBKDF2_ITERATIONS = 100000;
const PBKDF2_KEY_LEN = 32; // 256 bits

/**
 * Constant-time string comparison to prevent side-channel timing attacks
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Convert byte array to hexadecimal string
 */
function toHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

/**
 * Convert hexadecimal string to byte array
 */
function fromHex(hex: string): Uint8Array {
  const cleanHex = hex.trim();
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Compute SHA-256 hash of a string (useful for hashing session tokens at rest)
 */
export async function hashSha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBytes = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBytes);
  return toHex(hashBuffer);
}

/**
 * Hash a password using PBKDF2-HMAC-SHA256 with 32-byte cryptographic salt and 100,000 iterations
 * Format: pbkdf2:sha256:100000$<saltHex>$<hashHex>
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = new Uint8Array(32);
  crypto.getRandomValues(salt);

  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    PBKDF2_KEY_LEN * 8
  );

  const saltHex = toHex(salt);
  const hashHex = toHex(derivedKey);

  return `pbkdf2:sha256:${PBKDF2_ITERATIONS}$${saltHex}$${hashHex}`;
}

/**
 * Verify a candidate password against a stored PBKDF2 hash
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  if (!storedHash || !storedHash.startsWith('pbkdf2:sha256:')) {
    return false;
  }

  const parts = storedHash.split('$');
  if (parts.length !== 3) return false;

  const header = parts[0]; // pbkdf2:sha256:iterations
  const saltHex = parts[1];
  const expectedHashHex = parts[2];

  const iterMatch = header.match(/:(\d+)$/);
  const iterations = iterMatch ? parseInt(iterMatch[1], 10) : PBKDF2_ITERATIONS;

  const salt = fromHex(saltHex);
  const encoder = new TextEncoder();

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256',
    },
    keyMaterial,
    expectedHashHex.length * 4
  );

  const actualHashHex = toHex(derivedKey);
  return timingSafeEqual(actualHashHex, expectedHashHex);
}

/**
 * Generate a cryptographically secure random session token (64 hex characters / 256 bits of entropy)
 */
export function generateSecureToken(prefix = 'bhd_sec_'): string {
  const randomBytes = new Uint8Array(32);
  crypto.getRandomValues(randomBytes);
  return `${prefix}${toHex(randomBytes)}`;
}

/**
 * Hash a session token before storing it in the database
 */
export async function hashSessionToken(token: string): Promise<string> {
  return hashSha256(`behdoon_sess_v2:${token}`);
}

/**
 * Mask sensitive usernames, phones or emails for logs and audit trails
 */
export function maskSensitive(str: string): string {
  if (!str) return '';
  const s = String(str).trim();
  if (/^09\d{9}$/.test(s)) {
    return `${s.substring(0, 4)}***${s.substring(7)}`;
  }
  if (s.length <= 4) return '***';
  return `${s.substring(0, 2)}***${s.substring(s.length - 2)}`;
}
