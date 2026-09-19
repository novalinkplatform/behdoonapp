import { DatabaseSync } from 'node:sqlite';
import worker from '../worker/index.ts';

console.log('--- Starting Behdoon Phase 3A: Provider Operations Integration Tests ---');

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
  console.log('\n[1] Initialize Database & Setup Providers');
  // Trigger table creation via OTP endpoint
  await worker.fetch(
    new Request('https://behdoon.ir/api/customer/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '09121112233' }),
    }),
    env
  );

  const now = new Date().toISOString();

  // Clear seed tables to ensure clean test state
  sqlite.exec(`
    DELETE FROM providers;
    DELETE FROM requests;
    DELETE FROM customers;
  `);

  // Seed Providers in D1 providers table
  sqlite.exec(`
    INSERT INTO providers (id, full_name, phone, districts, service_categories, bio, years_experience, status, is_online, performance_score, total_jobs, completed_jobs, created_at, updated_at)
    VALUES (1, 'علی تکنسین', '09121112233', '["all"]', '["plumbing"]', 'تکنسین تاسیسات', 8, 'active', 1, 4.8, 12, 10, '${now}', '${now}');

    INSERT INTO providers (id, full_name, phone, districts, service_categories, bio, years_experience, status, is_online, performance_score, total_jobs, completed_jobs, created_at, updated_at)
    VALUES (2, 'رضا متخصص', '09129998877', '["all"]', '["electrical"]', 'برق‌کار مجرب', 6, 'active', 0, 4.5, 8, 5, '${now}', '${now}');
  `);

  // Seed Customers & Orders
  sqlite.exec(`
    INSERT INTO customers (id, phone, full_name, created_at, updated_at)
    VALUES (1, '09123456789', 'مشتری آزمایشی', '${now}', '${now}');

    INSERT INTO requests (id, tracking_code, customer_id, phone, service_id, service_label, status, provider_id, scheduled_date, scheduled_time, origin_city, origin_notes, created_at)
    VALUES (1, 'BD-2026-000001', 1, '09123456789', 'plumbing', 'لوله‌کشی', 'provider_assigned', 1, '2026-09-19', '10:00', 'تهران', 'تعمیر شیرآلات', '${now}');

    INSERT INTO requests (id, tracking_code, customer_id, phone, service_id, service_label, status, provider_id, scheduled_date, scheduled_time, origin_city, origin_notes, created_at)
    VALUES (2, 'BD-2026-000002', 1, '09123456789', 'electrical', 'برق‌کاری', 'provider_assigned', 2, '2026-09-19', '14:00', 'تهران', 'سیم‌کشی هال', '${now}');

    INSERT INTO requests (id, tracking_code, customer_id, phone, service_id, service_label, status, provider_id, scheduled_date, scheduled_time, origin_city, origin_notes, created_at)
    VALUES (3, 'BD-2026-000003', 1, '09123456789', 'cleaning', 'نظافت', 'provider_assigned', 2, '2026-09-20', '09:00', 'تهران', 'نظافت راه‌پله', '${now}');
  `);

  console.log('\n[2] Provider Authentication & Profile Endpoints');
  // Provider 1 Login
  let res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '09121112233' }),
    }),
    env
  );
  let body = await res.json();
  assert(res.status === 200, 'Provider 1 login returns 200');
  assert(body.token && body.token.includes('provider_1'), 'Provider 1 token correctly formatted');
  const prov1Token = body.token;

  // Provider 2 Login
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '09129998877' }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200, 'Provider 2 login returns 200');
  const prov2Token = body.token;

  // GET /api/provider/me
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/me', {
      headers: { Authorization: `Bearer ${prov1Token}` },
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200, 'GET /api/provider/me returns 200');
  assert(body.provider?.id === 1 && body.provider?.name === 'علی تکنسین', 'Provider 1 profile verified');

  // PATCH /api/provider/status (Toggle online/offline)
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/status', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${prov1Token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ isOnline: false }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.isOnline === false, 'Provider 1 toggles offline successfully');

  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/status', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${prov1Token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ isOnline: true }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.isOnline === true, 'Provider 1 toggles online successfully');

  // PATCH /api/provider/profile
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/profile', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${prov1Token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ bio: 'تکنسین باتجربه بهدون', city: 'تهران' }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.success === true, 'Provider 1 profile updated');

  console.log('\n[3] IDOR Protection & Authorization Isolation');
  // Unauthenticated access
  res = await worker.fetch(new Request('https://behdoon.ir/api/provider/dashboard'), env);
  assert(res.status === 401, 'Unauthenticated request to provider dashboard rejected with 401');

  // Provider 1 tries to view Order 2 (Belongs to Provider 2) -> MUST BE 403 FORBIDDEN
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/orders/2', {
      headers: { Authorization: `Bearer ${prov1Token}` },
    }),
    env
  );
  assert(res.status === 403, 'IDOR Protection: Provider 1 viewing Provider 2 order returns 403 Forbidden');

  // Provider 1 tries to act on Order 2 -> MUST BE 403 FORBIDDEN
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/orders/2/action', {
      method: 'POST',
      headers: { Authorization: `Bearer ${prov1Token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'accept' }),
    }),
    env
  );
  assert(res.status === 403, 'IDOR Protection: Provider 1 action on Provider 2 order returns 403 Forbidden');

  // Provider 1 requests schedule of Provider 2 -> MUST BE 403 FORBIDDEN
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/schedule?provider_id=2', {
      headers: { Authorization: `Bearer ${prov1Token}` },
    }),
    env
  );
  assert(res.status === 403, 'IDOR Protection: Provider 1 querying Provider 2 schedule returns 403 Forbidden');

  // Provider 1 requests earnings of Provider 2 -> MUST BE 403 FORBIDDEN
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/earnings?provider_id=2', {
      headers: { Authorization: `Bearer ${prov1Token}` },
    }),
    env
  );
  assert(res.status === 403, 'IDOR Protection: Provider 1 querying Provider 2 earnings returns 403 Forbidden');

  // Provider 1 requests performance of Provider 2 -> MUST BE 403 FORBIDDEN
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/performance?provider_id=2', {
      headers: { Authorization: `Bearer ${prov1Token}` },
    }),
    env
  );
  assert(res.status === 403, 'IDOR Protection: Provider 1 querying Provider 2 performance returns 403 Forbidden');

  console.log('\n[4] State Machine Operational Actions & Schedule Collision Check');
  // Order 1: Initial status is 'provider_assigned'
  // Step A: Accept order -> should move to 'confirmed' and book schedule
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/orders/1/action', {
      method: 'POST',
      headers: { Authorization: `Bearer ${prov1Token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'accept' }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.status === 'confirmed', 'Provider 1 accepted order 1 -> status: confirmed');

  // Verify schedule slot created and booked
  const schedRow = sqlite.prepare("SELECT * FROM provider_schedules WHERE provider_id = 1 AND request_id = 1").get();
  assert(schedRow && schedRow.is_booked === 1, 'Schedule slot automatically booked for Provider 1');

  // Step B: Attempt illegal transition (e.g. complete_service from confirmed) -> MUST FAIL (400)
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/orders/1/action', {
      method: 'POST',
      headers: { Authorization: `Bearer ${prov1Token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'complete_service' }),
    }),
    env
  );
  assert(res.status === 400, 'Invalid transition (complete_service from confirmed) rejected with 400');

  // Step C: en_route
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/orders/1/action', {
      method: 'POST',
      headers: { Authorization: `Bearer ${prov1Token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'en_route', note: 'در حال حرکت' }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.status === 'en_route', 'Action en_route successful');

  // Step D: arrived
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/orders/1/action', {
      method: 'POST',
      headers: { Authorization: `Bearer ${prov1Token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'arrived' }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.status === 'arrived', 'Action arrived successful');

  // Step E: start_inspection
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/orders/1/action', {
      method: 'POST',
      headers: { Authorization: `Bearer ${prov1Token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'start_inspection' }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.status === 'inspection', 'Action start_inspection successful');

  // Step F: start_service
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/orders/1/action', {
      method: 'POST',
      headers: { Authorization: `Bearer ${prov1Token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'start_service' }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.status === 'in_progress', 'Action start_service successful -> in_progress');

  // Step G: waiting_for_parts
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/orders/1/action', {
      method: 'POST',
      headers: { Authorization: `Bearer ${prov1Token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'waiting_for_parts', note: 'نیاز به خرید واشر و مغزی' }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.status === 'waiting_for_parts', 'Action waiting_for_parts successful');

  // Step H: resume_service
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/orders/1/action', {
      method: 'POST',
      headers: { Authorization: `Bearer ${prov1Token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'resume_service' }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.status === 'in_progress', 'Action resume_service successful -> in_progress');

  // Verify phone is NOT masked while active
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/orders/1', {
      headers: { Authorization: `Bearer ${prov1Token}` },
    }),
    env
  );
  body = await res.json();
  assert(body.order?.canCallCustomer === true && body.order?.phone === '09123456789', 'Active order allows technician to call customer');

  // Step I: complete_service
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/orders/1/action', {
      method: 'POST',
      headers: { Authorization: `Bearer ${prov1Token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'complete_service', note: 'تعویض کامل شیرآلات انجام شد' }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.status === 'completed', 'Action complete_service successful -> completed');

  // Verify phone IS masked after completion
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/orders/1', {
      headers: { Authorization: `Bearer ${prov1Token}` },
    }),
    env
  );
  body = await res.json();
  assert(body.order?.canCallCustomer === false, 'Completed order disables call');
  assert(body.order?.customerPhoneMasked.includes('***'), 'Completed order customer phone is masked for privacy');

  // Verify timeline logs in order_status_logs
  assert(body.order?.timeline?.length >= 8, 'Full operational audit trail recorded in order_status_logs');

  console.log('\n[5] Reject Action & Schedule Release');
  // Order 3: Provider 2 rejects order
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/orders/3/action', {
      method: 'POST',
      headers: { Authorization: `Bearer ${prov2Token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject', note: 'تداخل با کار دیگر' }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.status === 'under_review', 'Provider 2 rejects order 3 -> moved to under_review');

  // Verify provider_id cleared in DB
  const o3Row = sqlite.prepare("SELECT provider_id, status FROM requests WHERE id = 3").get();
  assert(o3Row.provider_id === null && o3Row.status === 'under_review', 'Order 3 provider_id cleared and status set to under_review');

  console.log('\n[6] Real Earnings, Settlements & Ledger Calculations');
  // Create settlement & ledger entry for Provider 1
  sqlite.exec(`
    INSERT INTO provider_settlements (id, request_id, provider_id, gross_amount, commission_rate, commission_amount, net_payable, status, created_at)
    VALUES (1, 1, 1, 1000000, 0.15, 150000, 850000, 'pending', '2026-09-19 12:00:00');

    INSERT INTO financial_ledger (id, entry_type, amount, balance_after, description, reference_type, reference_id, created_at)
    VALUES (1, 'provider_earning', 850000, 850000, 'طلب متخصص از سفارش #BD-2026-000001', 'settlement', 1, '2026-09-19 12:00:00');
  `);

  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/earnings', {
      headers: { Authorization: `Bearer ${prov1Token}` },
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200, 'GET /api/provider/earnings returns 200');
  assert(body.summary?.unsettledBalance === 850000, 'Unsettled balance matches DB settlement: 850,000 Toman');
  assert(body.summary?.totalEarnings === 1000000, 'Gross earnings matches DB: 1,000,000 Toman');
  assert(body.settlements?.length === 1 && body.settlements[0].netPayable === 850000, 'Settlement item list verified');
  assert(body.ledger?.length === 1 && body.ledger[0].amount === 850000, 'Financial ledger history verified');

  console.log('\n[7] Provider Dashboard & Performance Endpoints');
  // GET /api/provider/dashboard
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/dashboard', {
      headers: { Authorization: `Bearer ${prov1Token}` },
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200, 'GET /api/provider/dashboard returns 200');
  assert(body.metrics?.completedOrders === 1, 'Dashboard metrics: completedOrders = 1');
  assert(body.metrics?.unsettledBalance === 850000, 'Dashboard metrics: unsettledBalance = 850,000');
  assert(body.provider?.performanceScore === 95, 'Dashboard provider PPS score = 95');

  // GET /api/provider/performance
  // Insert a rating for Order 1
  sqlite.exec(`
    INSERT INTO ratings (id, request_id, customer_id, provider_id, overall_score, punctuality_score, cleanliness_score, skill_score, comment, created_at)
    VALUES (1, 1, 1, 1, 5, 5, 5, 5, 'بسیار کاربلد، منظم و مؤدب بودند.', '2026-09-19 13:00:00');
  `);

  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/performance', {
      headers: { Authorization: `Bearer ${prov1Token}` },
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200, 'GET /api/provider/performance returns 200');
  assert(body.ratingAvg === 5 && body.breakdown?.punctuality === 5, 'Performance ratings and breakdown calculated');

  console.log('\n[8] Provider Notifications Center');
  // Provider 1 has notification from order assignment/action
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/notifications', {
      headers: { Authorization: `Bearer ${prov1Token}` },
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200, 'GET /api/provider/notifications returns 200');
  assert(body.notifications?.length > 0, 'Notifications found for Provider 1');
  const notifId = body.notifications[0].id;

  // Mark notification read
  res = await worker.fetch(
    new Request(`https://behdoon.ir/api/provider/notifications/${notifId}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${prov1Token}` },
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.success === true, 'Notification marked as read');

  // Verify unread count decreased
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/notifications', {
      headers: { Authorization: `Bearer ${prov1Token}` },
    }),
    env
  );
  body = await res.json();
  assert(body.unreadCount === 0 || body.unreadCount < body.notifications.length, 'Unread count updated');

  console.log('\n=======================================================');
  console.log(`Phase 3A Provider Operations Summary: ${passed} passed, ${failed} failed`);
  console.log('=======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
