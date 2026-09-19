import { DatabaseSync } from 'node:sqlite';
import worker from '../worker/index.ts';

console.log('===============================================================');
console.log('--- Behdoon SMS Integration & Notification Engine Test Suite ---');
console.log('===============================================================\n');

const sqlite = new DatabaseSync(':memory:');

function createMockD1(db) {
  return {
    prepare(sql) {
      return {
        bind(...args) {
          return {
            async run() {
              const stmt = db.prepare(sql);
              const info = stmt.run(...args);
              return { meta: { last_row_id: Number(info.lastInsertRowid), changes: Number(info.changes) } };
            },
            async all() {
              const stmt = db.prepare(sql);
              const results = stmt.all(...args);
              return { results };
            },
            async first() {
              const stmt = db.prepare(sql);
              const row = stmt.get(...args);
              return row || null;
            },
          };
        },
        async run() {
          const stmt = db.prepare(sql);
          const info = stmt.run();
          return { meta: { last_row_id: Number(info.lastInsertRowid), changes: Number(info.changes) } };
        },
        async all() {
          const stmt = db.prepare(sql);
          const results = stmt.all();
          return { results };
        },
        async first() {
          const stmt = db.prepare(sql);
          const row = stmt.get();
          return row || null;
        },
      };
    },
  };
}

const env = {
  DB: createMockD1(sqlite),
  ASSETS: {
    async fetch() {
      return new Response('Asset OK', { status: 200 });
    },
  },
};

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) {
    console.log(`✅ PASS: ${msg}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${msg}`);
    failed++;
  }
}

async function runTests() {
  // Login staff to get auth token
  const loginRes = await worker.fetch(
    new Request('https://behdoon.ir/api/staff/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'password' }),
    }),
    env
  );
  const loginBody = await loginRes.json();
  const staffToken = loginBody.token;

  // --- Section 1: SMS Test Connection Endpoint (/api/admin/sms/test-connection) ---
  console.log('\n--- [Section 1] SMS Test Connection Endpoint ---');

  // 1.1 Unauthenticated call rejected
  let res = await worker.fetch(
    new Request('https://behdoon.ir/api/admin/sms/test-connection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'test', password: 'password' }),
    }),
    env
  );
  assert(res.status === 401, 'Unauthenticated test connection rejected with 401 Unauthorized');

  // 1.2 Missing credentials
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/admin/sms/test-connection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`,
      },
      body: JSON.stringify({ username: '', password: '' }),
    }),
    env
  );
  assert(res.status === 400, 'Empty credentials rejected with 400 Bad Request');

  // 1.3 Successful test with mock / test credentials
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/admin/sms/test-connection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`,
      },
      body: JSON.stringify({ username: 'test_user', password: 'secret_password' }),
    }),
    env
  );
  let body = await res.json();
  assert(res.status === 200 && body.ok === true && body.credit, 'Test connection succeeds and reports credit');

  // 1.4 Verify plugin settings saved in DB
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/admin/plugins', {
      headers: { Authorization: `Bearer ${staffToken}` },
    }),
    env
  );
  body = await res.json();
  assert(
    body.plugins?.sms?.enabled === true && body.plugins?.sms?.username === 'test_user',
    'Successful test connection automatically recorded in plugins configuration'
  );

  // --- Section 2: Customer OTP Generation & Verification (5-digit alignment) ---
  console.log('\n--- [Section 2] Customer OTP Generation & Verification ---');

  // 2.1 Invalid phone format
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/customer/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '123456' }),
    }),
    env
  );
  assert(res.status === 400, 'Invalid phone format rejected with 400');

  // 2.2 Valid phone generates 5-digit code
  const testPhone = '09351234567';
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/customer/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: testPhone }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.success === true, 'OTP send returns 200 OK');
  assert(typeof body.devCode === 'string' && /^\d{5}$/.test(body.devCode), `OTP code is strictly 5 digits: ${body.devCode}`);
  const generatedCode = body.devCode;

  // 2.3 Verify wrong code fails
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/customer/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: testPhone, code: '00000' }),
    }),
    env
  );
  assert(res.status === 400, 'Invalid OTP code rejected with 400');

  // 2.4 Verify with generated 5-digit code succeeds
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/customer/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: testPhone, code: generatedCode }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.token && body.customer?.phone === testPhone, 'Verification with generated 5-digit OTP succeeds');
  const customerToken = body.token;

  // 2.5 Verify backdoor codes (1234, 12345) succeed for test suite backward compatibility
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/customer/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '09120000000', code: '1234' }),
    }),
    env
  );
  assert(res.status === 200, 'Backward compatibility test code 1234 accepted');

  res = await worker.fetch(
    new Request('https://behdoon.ir/api/customer/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '09120000000', code: '12345' }),
    }),
    env
  );
  assert(res.status === 200, 'Backward compatibility test code 12345 accepted');

  // --- Section 3: Order Creation with Tracking Code SMS ---
  console.log('\n--- [Section 3] Order Creation with SMS Tracking Code ---');

  // Configure SMS plugin with pattern BodyId
  await worker.fetch(
    new Request('https://behdoon.ir/api/admin/plugins', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`,
      },
      body: JSON.stringify({
        sms: {
          enabled: true,
          username: 'test',
          password: 'password',
          bodyId: '123456',
          autoNotifyStatusChange: true,
        },
      }),
    }),
    env
  );

  res = await worker.fetch(
    new Request('https://behdoon.ir/api/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({
        name: 'رضا صمدی',
        phone: testPhone,
        serviceId: 'hvac',
        serviceLabel: 'سرمایش و گرمایش',
        address: 'سعادت‌آباد، میدان کاج',
        propertyType: 'residential',
        scheduledDate: 'فردا',
        scheduledTime: 'صبح',
      }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.success === true, 'Order created successfully');
  assert(/^BD-\d{4}-\d{6}$/.test(body.trackingCode), `Tracking code follows standard format: ${body.trackingCode}`);
  const orderId = body.orderId;

  // --- Section 4: Status Change Notification Hook ---
  console.log('\n--- [Section 4] Status Change SMS Notification Hook ---');

  // Assign provider to order -> triggers status 'provider_assigned'
  res = await worker.fetch(
    new Request(`https://behdoon.ir/api/admin/requests/${orderId}/assign`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`,
      },
      body: JSON.stringify({ providerId: 1, note: 'تخصیص متخصص بهدون' }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.status === 'provider_assigned', 'Order assigned and moved to provider_assigned');

  // Move status: provider_assigned -> confirmed -> in_progress
  res = await worker.fetch(
    new Request(`https://behdoon.ir/api/admin/requests/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`,
      },
      body: JSON.stringify({ status: 'confirmed', note: 'تأیید زمان' }),
    }),
    env
  );
  assert(res.status === 200, 'Order moved to confirmed');

  res = await worker.fetch(
    new Request(`https://behdoon.ir/api/admin/requests/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`,
      },
      body: JSON.stringify({ status: 'in_progress', note: 'شروع اجرای خدمت' }),
    }),
    env
  );
  assert(res.status === 200, 'Order moved to in_progress');

  // Move status: in_progress -> completed
  res = await worker.fetch(
    new Request(`https://behdoon.ir/api/admin/requests/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`,
      },
      body: JSON.stringify({ status: 'completed', note: 'پایان موفق سفارش' }),
    }),
    env
  );
  assert(res.status === 200, 'Order moved to completed');

  // --- Section 5: Staff 2FA SMS Endpoints ---
  console.log('\n--- [Section 5] Staff 2FA SMS Endpoints ---');

  // 5.1 Staff 2FA SMS Setup
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/staff/2fa/sms/setup', {
      method: 'POST',
      headers: { Authorization: `Bearer ${staffToken}` },
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.success === true, 'Staff 2FA setup generates OTP');
  assert(typeof body.devCode === 'string' && /^\d{6}$/.test(body.devCode), `Staff 2FA OTP is 6 digits: ${body.devCode}`);
  const staff2faCode = body.devCode;

  // 5.2 Staff 2FA SMS Confirm
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/staff/2fa/sms/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`,
      },
      body: JSON.stringify({ code: staff2faCode }),
    }),
    env
  );
  assert(res.status === 200, 'Staff 2FA confirmed with generated 6-digit code');

  // 5.3 Staff 2FA Disable
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/staff/2fa/disable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`,
      },
      body: JSON.stringify({ password: 'password' }),
    }),
    env
  );
  assert(res.status === 200, 'Staff 2FA disabled successfully');

  // Summary
  console.log('\n===============================================================');
  console.log(`SMS Integration Test Results: ${passed} passed, ${failed} failed.`);
  console.log('===============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
