/**
 * CLI Tool to generate PBKDF2-HMAC-SHA256 password hash for Behdoon Admin Users
 * Usage: node scripts/seed-admin.mjs [username] [password]
 */

import crypto from 'node:crypto';

const PBKDF2_ITERATIONS = 100000;
const PBKDF2_KEY_LEN = 32;

function hashPasswordSync(password) {
  const salt = crypto.randomBytes(32);
  const derivedKey = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEY_LEN, 'sha256');
  return `pbkdf2:sha256:${PBKDF2_ITERATIONS}$${salt.toString('hex')}$${derivedKey.toString('hex')}`;
}

const username = process.argv[2] || 'admin';
const password = process.argv[3] || 'Admin@Behdoon2026!';

const hash = hashPasswordSync(password);

console.log('\n==========================================================');
console.log('🔐 [Behdoon Enterprise Security] Admin Password Hashed:');
console.log(`👤 Username: ${username}`);
console.log(`🔑 Raw Password: ${password}`);
console.log(`🛡️ Algorithm: PBKDF2-HMAC-SHA256 (100,000 iterations, 32-byte salt)`);
console.log(`📦 Stored Hash:\n${hash}`);
console.log('==========================================================');
console.log('\nSQL Query to update in database:');
console.log(`UPDATE admin_users SET password_hash = '${hash}' WHERE username = '${username}';\n`);
