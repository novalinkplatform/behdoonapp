import { DatabaseSync } from 'node:sqlite';
import worker from '../worker/index.ts';

console.log('--- Starting Behdoon Phase 1 Integration Tests ---');

// Setup in-memory SQLite database simulating Cloudflare D1
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
  // Test 1: Send SMS OTP
  console.log('\n[Test 1] Customer OTP Send');
  let res = await worker.fetch(
    new Request('https://behdoon.ir/api/customer/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '09121234567' }),
    }),
    env
  );
  let body = await res.json();
  assert(res.status === 200 && body.success === true, 'OTP send returns 200 and success');

  // Test 2: Verify OTP and create Customer
  console.log('\n[Test 2] Customer OTP Verify & Register');
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/customer/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '09121234567', code: '1234' }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.token && body.customer.phone === '09121234567', 'OTP verify succeeds and issues token');
  const customerToken = body.token;
  const customerId = body.customer.id;

  // Test 3: Get Customer Profile
  console.log('\n[Test 3] Customer Profile Fetch');
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/customer/me', {
      headers: { Authorization: `Bearer ${customerToken}` },
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.customer.phone === '09121234567', 'Me endpoint returns customer data');

  // Test 4: Update Customer Profile
  console.log('\n[Test 4] Update Profile');
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/customer/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({ fullName: 'علی رضایی', gender: 'male' }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.customer.fullName === 'علی رضایی', 'Customer profile updated');

  // Test 5: Add Customer Address
  console.log('\n[Test 5] Customer Address Management');
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/customer/addresses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({
        title: 'خانه نیاوران',
        city: 'تهران',
        district: 'نیاوران',
        address: 'خیابان باهنر، پلاک ۱۰',
        hasElevator: true,
      }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.address.title === 'خانه نیاوران', 'Address created');
  const addressId = body.address.id;

  // Fetch addresses
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/customer/addresses', {
      headers: { Authorization: `Bearer ${customerToken}` },
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.addresses.length >= 1, 'Address list contains created address');

  // Test 6: Submit Order with Standard Tracking Code
  console.log('\n[Test 6] Submit Order (Standard BD-2026 Code & State Machine)');
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/requests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`,
      },
      body: JSON.stringify({
        phone: '09121234567',
        name: 'علی رضایی',
        serviceId: 'hvac',
        serviceLabel: 'سرمایش و گرمایش',
        district: 'نیاوران',
        originNotes: 'تعمیر پکیج شوفاژ دیواری',
      }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.trackingCode.startsWith('BD-'), `Order created with tracking code: ${body.trackingCode}`);
  const orderId = body.orderId;
  const trackingCode = body.trackingCode;

  // Test 7: Public Tracking by code
  console.log('\n[Test 7] Public Tracking by BD code');
  res = await worker.fetch(
    new Request(`https://behdoon.ir/api/requests?code=${trackingCode}`),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.requests.length === 1 && body.requests[0].trackingCode === trackingCode, 'Tracking by code retrieves order');

  // Test 8: Admin List Providers
  console.log('\n[Test 8] Admin Providers Management');
  const adminToken = 'behdoon_admin_test_token_123';
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/admin/providers', {
      headers: { Authorization: `Bearer ${adminToken}` },
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && Array.isArray(body.providers) && body.providers.length >= 4, `Providers listed (count: ${body.providers.length})`);
  const firstProvider = body.providers[0];

  // Test 9: Assign Provider to Order
  console.log('\n[Test 9] Assign Provider to Order');
  res = await worker.fetch(
    new Request(`https://behdoon.ir/api/admin/requests/${orderId}/assign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ providerId: firstProvider.id, note: 'اعزام تکنسین منتخب' }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.status === 'provider_assigned' && body.providerId === firstProvider.id, 'Order assigned to provider');

  // Test 10: State Machine Transition (in_progress -> completed)
  console.log('\n[Test 10] State Machine Transition to in_progress and then completed');
  res = await worker.fetch(
    new Request(`https://behdoon.ir/api/admin/requests/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: 'in_progress', note: 'تکنسین در محل شروع به کار کرد' }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.status === 'in_progress', 'Order moved to in_progress');

  res = await worker.fetch(
    new Request(`https://behdoon.ir/api/admin/requests/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ status: 'completed', note: 'تعمیر پکیج با موفقیت خاتمه یافت' }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.status === 'completed', 'Order moved to completed');

  // Test 11: Audit Trail / History Log
  console.log('\n[Test 11] Order History Audit Log');
  res = await worker.fetch(
    new Request(`https://behdoon.ir/api/admin/requests/${orderId}/history`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && Array.isArray(body.history) && body.history.length >= 3, `Order status history contains ${body.history?.length} transitions`);

  // Test 12: Admin CSV Export
  console.log('\n[Test 12] Admin CSV Export');
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/admin/requests/export', {
      headers: { Authorization: `Bearer ${adminToken}` },
    }),
    env
  );
  const csvText = await res.text();
  assert(res.status === 200 && csvText.includes(trackingCode), 'CSV export contains newly created order');

  console.log(`\n========================================`);
  console.log(`Summary: ${passed} passed, ${failed} failed.`);
  console.log(`========================================`);
  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
