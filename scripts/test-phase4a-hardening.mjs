import { DatabaseSync } from 'node:sqlite';
import worker from '../worker/index.ts';

console.log('======================================================================');
console.log('--- Behdoon Phase 4A: Production Hardening & E2E Validation Suite ---');
console.log('======================================================================\n');

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
  const now = new Date().toISOString();

  // -------------------------------------------------------------
  // [Section 1] Production Configuration & Security Headers
  // -------------------------------------------------------------
  console.log('\n--- [Section 1] Production Configuration & Secure Headers ---');

  // 1.1 CORS allowed origin
  let res = await worker.fetch(new Request('https://behdoon.ir/api/settings', {
    headers: { Origin: 'https://behdoon.ir' },
  }), env);
  assert(res.status === 200, 'Settings endpoint returns 200');
  assert(res.headers.get('Access-Control-Allow-Origin') === 'https://behdoon.ir', 'CORS origin dynamically mirrors allowed domain https://behdoon.ir');
  assert(res.headers.get('Vary') === 'Origin', 'CORS includes Vary: Origin header');

  // 1.2 Subdomain www.behdoon.ir allowed
  res = await worker.fetch(new Request('https://behdoon.ir/api/settings', {
    headers: { Origin: 'https://www.behdoon.ir' },
  }), env);
  assert(res.headers.get('Access-Control-Allow-Origin') === 'https://www.behdoon.ir', 'CORS allows https://www.behdoon.ir');

  // 1.3 Disallowed origin falls back to default domain
  res = await worker.fetch(new Request('https://behdoon.ir/api/settings', {
    headers: { Origin: 'https://malicious-attacker.com' },
  }), env);
  assert(res.headers.get('Access-Control-Allow-Origin') === 'https://behdoon.ir', 'Disallowed origin defaults safely to https://behdoon.ir');

  // 1.4 Secure HTTP Response Headers
  assert(res.headers.get('X-Content-Type-Options') === 'nosniff', 'X-Content-Type-Options: nosniff present');
  assert(res.headers.get('X-Frame-Options') === 'DENY', 'X-Frame-Options: DENY present (anti-clickjacking)');
  assert(res.headers.get('Strict-Transport-Security')?.includes('max-age'), 'Strict-Transport-Security (HSTS) enforced');
  assert(res.headers.get('Referrer-Policy') === 'strict-origin-when-cross-origin', 'Referrer-Policy present');

  // 1.5 OPTIONS Preflight response (204 No Content)
  res = await worker.fetch(new Request('https://behdoon.ir/api/customer/orders', {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://behdoon.ir',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type, Authorization',
    },
  }), env);
  assert(res.status === 204, 'OPTIONS preflight returns 204 No Content');
  assert(res.headers.get('Access-Control-Allow-Origin') === 'https://behdoon.ir', 'OPTIONS includes allowed origin');

  // -------------------------------------------------------------
  // [Section 2] Authentication Hardening, OTP Abuse & Rate Limiting
  // -------------------------------------------------------------
  console.log('\n--- [Section 2] Authentication Hardening & Rate Limiting ---');

  const prodEnv = { ...env, ENVIRONMENT: 'production' };
  const targetPhone = '09128889900';

  // 2.1 Production OTP Send Shields devCode
  res = await worker.fetch(new Request('https://behdoon.ir/api/customer/otp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: targetPhone }),
  }), prodEnv);
  let body = await res.json();
  assert(res.status === 200 && body.success === true, 'Production OTP request succeeds (200)');
  assert(body.devCode === undefined, 'CRITICAL: devCode is NEVER returned in production API response');

  // 2.2 Production OTP Verify rejects test bypass codes (1234, 12345)
  res = await worker.fetch(new Request('https://behdoon.ir/api/customer/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: targetPhone, code: '1234' }),
  }), prodEnv);
  assert(res.status === 400, 'CRITICAL: Test bypass code 1234 rejected in production environment');

  // 2.3 Rate Limiting: OTP Send Abuse (Max 3 requests / 5 minutes)
  const spamPhone = '09197771122';
  for (let i = 0; i < 3; i++) {
    await worker.fetch(new Request('https://behdoon.ir/api/customer/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: spamPhone }),
    }), env);
  }
  // 4th send attempt
  res = await worker.fetch(new Request('https://behdoon.ir/api/customer/otp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: spamPhone }),
  }), env);
  body = await res.json();
  assert(res.status === 429, '4th OTP send within window blocked with HTTP 429 (Too Many Requests)');
  assert(body.code === 'RATE_LIMIT_EXCEEDED', 'Rate limit error code is RATE_LIMIT_EXCEEDED');

  // 2.4 Rate Limiting: OTP Brute Force Protection (Lockout after 5 failed attempts)
  const brutePhone = '09198882233';
  await worker.fetch(new Request('https://behdoon.ir/api/customer/otp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: brutePhone }),
  }), env);

  for (let attempt = 1; attempt <= 4; attempt++) {
    res = await worker.fetch(new Request('https://behdoon.ir/api/customer/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: brutePhone, code: '99999' }),
    }), prodEnv);
    body = await res.json();
    assert(res.status === 400 && body.remainingAttempts === 5 - attempt, `Wrong OTP attempt ${attempt} shows remaining attempts: ${5 - attempt}`);
  }

  // 5th failed attempt -> Triggers 15-minute lockout
  res = await worker.fetch(new Request('https://behdoon.ir/api/customer/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: brutePhone, code: '99999' }),
  }), prodEnv);
  body = await res.json();
  assert(res.status === 429, '5th failed OTP attempt triggers lockout with HTTP 429');
  assert(body.code === 'ACCOUNT_LOCKED', 'Lockout returns error code ACCOUNT_LOCKED');

  // Subsequent attempt while locked
  res = await worker.fetch(new Request('https://behdoon.ir/api/customer/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: brutePhone, code: '99999' }),
  }), prodEnv);
  assert(res.status === 429, 'Subsequent attempts while locked remain blocked with 429');

  // -------------------------------------------------------------
  // [Section 3] Scheduling Concurrency & Manual Admin Collision Lock
  // -------------------------------------------------------------
  console.log('\n--- [Section 3] Scheduling Concurrency & Collision Lock ---');

  const superAdminHeaders = {
    Authorization: 'Bearer behdoon_admin_token_super',
    'Content-Type': 'application/json',
  };

  // Seed provider 20
  sqlite.exec(`
    INSERT INTO providers (id, full_name, phone, districts, service_categories, bio, status, is_online, performance_score, total_jobs, completed_jobs, created_at, updated_at)
    VALUES (20, 'تکنسین زمان‌بندی', '09120003344', '["all"]', '["plumbing"]', 'تست تقویم', 'active', 1, 5.0, 5, 5, '${now}', '${now}');
  `);

  // Seed request 501 and request 502 for the SAME date and time slot
  sqlite.exec(`
    INSERT INTO requests (id, tracking_code, name, phone, service_id, scheduled_date, scheduled_time, status, created_at, updated_at)
    VALUES (501, 'BD-501', 'مشتری ۱', '09121115566', 'plumbing', '1405/07/15', '10:00 - 12:00', 'submitted', '${now}', '${now}');

    INSERT INTO requests (id, tracking_code, name, phone, service_id, scheduled_date, scheduled_time, status, created_at, updated_at)
    VALUES (502, 'BD-502', 'مشتری ۲', '09121117788', 'plumbing', '1405/07/15', '10:00 - 12:00', 'submitted', '${now}', '${now}');
  `);

  // Assign request 501 to provider 20
  res = await worker.fetch(new Request('https://behdoon.ir/api/admin/requests/501/assign', {
    method: 'POST',
    headers: superAdminHeaders,
    body: JSON.stringify({ providerId: 20 }),
  }), env);
  assert(res.status === 200, 'First admin assignment to slot 1405/07/15 10:00-12:00 succeeds');

  // Attempt manual admin assignment of request 502 to provider 20 at conflicting slot
  res = await worker.fetch(new Request('https://behdoon.ir/api/admin/requests/502/assign', {
    method: 'POST',
    headers: superAdminHeaders,
    body: JSON.stringify({ providerId: 20 }),
  }), env);
  body = await res.json();
  assert(res.status === 409, 'Conflicting admin assignment rejected with HTTP 409 Conflict');
  assert(body.code === 'SCHEDULE_COLLISION', 'Conflict code is SCHEDULE_COLLISION');

  // -------------------------------------------------------------
  // [Section 4] Financial Integrity & Atomic Anti-Double Refund
  // -------------------------------------------------------------
  console.log('\n--- [Section 4] Financial Integrity & Atomic Anti-Double Refund ---');

  // Seed Payment for request 601
  sqlite.exec(`
    INSERT INTO requests (id, tracking_code, name, phone, service_id, status, payment_status, created_at, updated_at)
    VALUES (601, 'BD-601', 'مشتری مالی', '09129990011', 'plumbing', 'in_progress', 'paid', '${now}', '${now}');

    INSERT INTO payments (id, request_id, amount, status, refunded_amount, created_at)
    VALUES (901, 601, 1000000, 'completed', 0, '${now}');
  `);

  // First partial refund of 400,000
  res = await worker.fetch(new Request('https://behdoon.ir/api/payments/refund', {
    method: 'POST',
    headers: superAdminHeaders,
    body: JSON.stringify({ paymentId: 901, amount: 400000, reason: 'تست استرداد اتمیک ۱' }),
  }), env);
  body = await res.json();
  assert(res.status === 200, 'First partial refund of 400,000 succeeds');
  assert(body.remainingRefundable === 600000, 'Remaining balance accurately computed: 600,000');

  // Attempting concurrent / double refund exceeding remaining balance (e.g. 700,000 when 600,000 remaining)
  res = await worker.fetch(new Request('https://behdoon.ir/api/payments/refund', {
    method: 'POST',
    headers: superAdminHeaders,
    body: JSON.stringify({ paymentId: 901, amount: 700000, reason: 'تجاوز از سقف' }),
  }), env);
  assert(res.status === 400, 'Refund exceeding remaining balance blocked with 400');

  // Second legitimate refund of remaining 600,000
  res = await worker.fetch(new Request('https://behdoon.ir/api/payments/refund', {
    method: 'POST',
    headers: superAdminHeaders,
    body: JSON.stringify({ paymentId: 901, amount: 600000, reason: 'تسویه نهایی استرداد' }),
  }), env);
  body = await res.json();
  assert(res.status === 200, 'Second refund of remaining 600,000 succeeds');
  assert(body.paymentStatus === 'refunded', 'Payment status marked fully refunded');
  assert(body.remainingRefundable === 0, 'Remaining balance is now exactly 0');

  // Double refund after completion strictly blocked
  res = await worker.fetch(new Request('https://behdoon.ir/api/payments/refund', {
    method: 'POST',
    headers: superAdminHeaders,
    body: JSON.stringify({ paymentId: 901, amount: 50000 }),
  }), env);
  assert(res.status === 400, 'Further refund on fully refunded payment blocked with 400');

  // -------------------------------------------------------------
  // [Section 5] Admin KPI Separation (openDisputes vs openSupportTickets)
  // -------------------------------------------------------------
  console.log('\n--- [Section 5] Admin KPI Metric Decoupling ---');

  // Seed 2 active disputes and 3 active support tickets
  sqlite.exec(`
    DELETE FROM disputes;
    DELETE FROM support_tickets;

    INSERT INTO disputes (id, request_id, opened_by, description, reason, status, created_at)
    VALUES
      (1, 501, 'customer', 'اختلاف اول', 'poor_quality', 'open', '${now}'),
      (2, 502, 'provider', 'اختلاف دوم', 'price_dispute', 'under_review', '${now}');

    INSERT INTO support_tickets (id, subject, category, priority, status, created_at, updated_at)
    VALUES
      (1, 'تیکت مشکل فنی', 'technical', 'high', 'open', '${now}', '${now}'),
      (2, 'تیکت مالی', 'billing', 'normal', 'in_progress', '${now}', '${now}'),
      (3, 'تیکت عمومی', 'general', 'low', 'pending', '${now}', '${now}');
  `);

  res = await worker.fetch(new Request('https://behdoon.ir/api/admin/dashboard', { headers: superAdminHeaders }), env);
  body = await res.json();
  assert(res.status === 200, 'Dashboard KPIs fetched successfully');
  assert(body.kpis.openDisputes === 2, `openDisputes strictly counts active disputes (expected: 2, got: ${body.kpis.openDisputes})`);
  assert(body.kpis.openSupportTickets === 3, `openSupportTickets strictly counts active support tickets (expected: 3, got: ${body.kpis.openSupportTickets})`);

  // -------------------------------------------------------------
  // [Section 6] Complete 15-Step End-to-End Order Lifecycle Flow
  // -------------------------------------------------------------
  console.log('\n--- [Section 6] Complete 15-Step End-to-End Pilot Flow ---');

  const pilotCustomerPhone = '09361112233';
  const pilotProviderPhone = '09374445566';

  // Step 1: Customer registers / authenticates via OTP
  console.log('[Step 1] Customer Auth via OTP');
  await worker.fetch(new Request('https://behdoon.ir/api/customer/otp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: pilotCustomerPhone }),
  }), env);
  res = await worker.fetch(new Request('https://behdoon.ir/api/customer/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: pilotCustomerPhone, code: '1234' }),
  }), env);
  body = await res.json();
  const customerToken = body.token;
  const customerId = body.customer.id;
  assert(customerToken && customerId, 'Step 1: Customer authenticated with token');

  const customerHeaders = {
    Authorization: `Bearer ${customerToken}`,
    'Content-Type': 'application/json',
  };

  // Step 2: Customer creates service request with address
  console.log('[Step 2] Customer Submits Order Request');
  res = await worker.fetch(new Request('https://behdoon.ir/api/requests', {
    method: 'POST',
    headers: customerHeaders,
    body: JSON.stringify({
      serviceId: 'plumbing',
      serviceLabel: 'تعمیرات تاسیسات',
      name: 'خلبان پایلوت',
      phone: pilotCustomerPhone,
      city: 'تهران',
      district: '2',
      address: 'ستارخان، خسرو جنوبی، پلاک ۱۰',
      scheduledDate: '1405/08/01',
      scheduledTime: '14:00 - 16:00',
    }),
  }), env);
  body = await res.json();
  const pilotOrderId = body.orderId || body.id || body.requestId;
  const pilotTrackingCode = body.trackingCode;
  assert(res.status === 200 && pilotOrderId, `Step 2: Service order submitted (ID: ${pilotOrderId}, Code: ${pilotTrackingCode})`);

  // Step 3: Provider registers & matching candidates identified
  console.log('[Step 3] Matching Engine Evaluates Candidates');
  sqlite.exec(`
    INSERT INTO providers (id, full_name, phone, districts, service_categories, bio, status, is_online, performance_score, total_jobs, completed_jobs, created_at, updated_at)
    VALUES (88, 'مهندس پایلوت', '${pilotProviderPhone}', '["2","3"]', '["plumbing"]', 'تکنسین ارشد بهدون', 'active', 1, 4.9, 30, 29, '${now}', '${now}');
  `);
  const providerToken = `behdoon_provider_88_${pilotProviderPhone}`;
  const providerHeaders = {
    Authorization: `Bearer ${providerToken}`,
    'Content-Type': 'application/json',
  };

  res = await worker.fetch(new Request('https://behdoon.ir/api/matching/candidates', {
    method: 'POST',
    headers: customerHeaders,
    body: JSON.stringify({ requestId: pilotOrderId }),
  }), env);
  body = await res.json();
  assert(res.status === 200 && body.candidates?.length > 0, `Step 3: Matching engine computed candidates (found: ${body.candidates.length})`);

  // Step 4: Provider assigned & slot booked
  console.log('[Step 4] Auto-Assign Provider & Book Schedule');
  res = await worker.fetch(new Request('https://behdoon.ir/api/matching/auto-assign', {
    method: 'POST',
    headers: customerHeaders,
    body: JSON.stringify({ requestId: pilotOrderId, providerId: 88, selectionMode: 'customer_choice' }),
  }), env);
  assert(res.status === 200, 'Step 4: Provider assigned to order and slot booked');

  // Step 5: Provider issues quote with labor and parts breakdown
  console.log('[Step 5] Provider Issues Itemized Quote');
  res = await worker.fetch(new Request('https://behdoon.ir/api/quotes', {
    method: 'POST',
    headers: providerHeaders,
    body: JSON.stringify({
      requestId: pilotOrderId,
      providerId: 88,
      pricingModel: 'provider_quote',
      baseAmount: 100000,
      laborAmount: 600000,
      materialsAmount: 400000,
      discountAmount: 100000,
      finalAmount: 1000000,
      description: 'تعویض مغزی و آب‌بندی لوله‌کشی اصلی',
    }),
  }), env);
  body = await res.json();
  const pilotQuoteId = body.quote.id;
  assert(res.status === 201 && pilotQuoteId, `Step 5: Itemized quote created (ID: ${pilotQuoteId}, Total: 1,000,000)`);

  // Step 6: Customer reviews and accepts quote
  console.log('[Step 6] Customer Accepts Quote');
  res = await worker.fetch(new Request(`https://behdoon.ir/api/quotes/${pilotQuoteId}/accept`, {
    method: 'POST',
    headers: customerHeaders,
  }), env);
  body = await res.json();
  assert(res.status === 200, 'Step 6: Quote accepted and order moved to confirmed');

  // Step 7: Official invoice issued
  console.log('[Step 7] Verify Official Invoice Generation');
  res = await worker.fetch(new Request(`https://behdoon.ir/api/requests/${pilotOrderId}/invoice`, {
    headers: customerHeaders,
  }), env);
  body = await res.json();
  assert(res.status === 200 && body.invoice, 'Step 7: Official invoice generated and accessible');
  const invoiceId = body.invoice.id;

  // Step 8: Provider moves to en_route
  console.log('[Step 8] Provider Moves En Route');
  res = await worker.fetch(new Request(`https://behdoon.ir/api/provider/orders/${pilotOrderId}/action`, {
    method: 'POST',
    headers: providerHeaders,
    body: JSON.stringify({ action: 'en_route' }),
  }), env);
  assert(res.status === 200, 'Step 8: Provider marked en_route');

  // Step 9: Provider arrived on site
  console.log('[Step 9] Provider Arrives on Site');
  res = await worker.fetch(new Request(`https://behdoon.ir/api/provider/orders/${pilotOrderId}/action`, {
    method: 'POST',
    headers: providerHeaders,
    body: JSON.stringify({ action: 'arrived' }),
  }), env);
  assert(res.status === 200, 'Step 9: Provider marked arrived');

  // Step 10: Provider starts service -> in_progress
  console.log('[Step 10] Provider Starts Service Execution');
  res = await worker.fetch(new Request(`https://behdoon.ir/api/provider/orders/${pilotOrderId}/action`, {
    method: 'POST',
    headers: providerHeaders,
    body: JSON.stringify({ action: 'start_service' }),
  }), env);
  assert(res.status === 200, 'Step 10: Service execution in_progress');

  // Step 11: Decoupled online payment (payment_status: paid, order remains in_progress!)
  console.log('[Step 11] Customer Executes Decoupled Payment');
  res = await worker.fetch(new Request('https://behdoon.ir/api/payments/checkout', {
    method: 'POST',
    headers: customerHeaders,
    body: JSON.stringify({
      requestId: pilotOrderId,
      invoiceId,
      customerId,
      amount: 1000000,
      paymentMethod: 'online',
    }),
  }), env);
  body = await res.json();
  assert(res.status === 200 && body.success === true, 'Step 11: Payment processed successfully');

  // Verify strict decoupling in database
  const orderAfterPay = sqlite.prepare('SELECT status, payment_status FROM requests WHERE id = ?').get(pilotOrderId);
  assert(orderAfterPay.payment_status === 'paid', 'Step 11: payment_status updated to paid');
  assert(orderAfterPay.status === 'in_progress', 'CRITICAL DECOUPLING: Order remains in_progress (service not completed yet)');

  // Step 12: Provider finishes physical service
  console.log('[Step 12] Provider Completes Physical Labor');
  res = await worker.fetch(new Request(`https://behdoon.ir/api/provider/orders/${pilotOrderId}/action`, {
    method: 'POST',
    headers: providerHeaders,
    body: JSON.stringify({ action: 'complete_service' }),
  }), env);
  assert(res.status === 200, 'Step 12: Provider marked service_completed / completed');

  // Step 13: Verify settlement calculations & material exemption
  console.log('[Step 13] Verify Platform Commission & Settlement');
  const settlement = sqlite.prepare('SELECT * FROM provider_settlements WHERE request_id = ?').get(pilotOrderId);
  assert(settlement !== null, 'Step 13: Provider settlement recorded');
  assert(settlement.gross_amount === 1000000, 'Gross amount is 1,000,000');
  assert(settlement.commission_amount > 0, `Commission recorded: ${settlement.commission_amount}`);
  assert(settlement.net_payable > 0, `Technician net payable: ${settlement.net_payable}`);

  // Step 14: Customer submits verified rating
  console.log('[Step 14] Customer Submits Quality Rating');
  res = await worker.fetch(new Request(`https://behdoon.ir/api/requests/${pilotOrderId}/rate`, {
    method: 'POST',
    headers: customerHeaders,
    body: JSON.stringify({
      customerId,
      overallScore: 5,
      punctualityScore: 5,
      cleanlinessScore: 5,
      skillScore: 5,
      comment: 'خدمت عالی، تمیز و کاملاً حرفه‌ای در زمان مقرر.',
    }),
  }), env);
  body = await res.json();
  assert(res.status === 200 && body.success === true, 'Step 14: Verified rating registered');

  // Verify provider privacy masking after completion
  res = await worker.fetch(new Request(`https://behdoon.ir/api/customer/orders/${pilotOrderId}`, {
    headers: customerHeaders,
  }), env);
  body = await res.json();
  assert(body.provider?.phone?.includes('***'), `Provider phone is privacy-masked after job completion: ${body.provider?.phone}`);

  // Step 15: Double-entry financial ledger and audit logs verified
  console.log('[Step 15] Audit Trail & Double-Entry Ledger Verification');
  const ledgerEntries = sqlite.prepare('SELECT * FROM financial_ledger WHERE order_id = ?').all(pilotOrderId);
  assert(ledgerEntries.length >= 2, `Step 15: Double-entry financial ledger recorded ${ledgerEntries.length} entries`);

  const statusLogs = sqlite.prepare('SELECT * FROM order_status_logs WHERE request_id = ?').all(pilotOrderId);
  assert(statusLogs.length >= 4, `Step 15: Order audit trail recorded ${statusLogs.length} state transitions`);

  // -------------------------------------------------------------
  // Test Suite Summary
  // -------------------------------------------------------------
  console.log('\n======================================================================');
  console.log(`Phase 4A Production Hardening Results: ${passed} PASSED, ${failed} FAILED.`);
  console.log('======================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
