import { DatabaseSync } from 'node:sqlite';
import worker from '../worker/index.ts';

console.log('--- Starting Behdoon Phase 3B: Customer Experience & Tracking Integration Tests ---');

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
  console.log('\n[1] Database Initialization & Seed Data');
  // Trigger table creation via OTP endpoint
  await worker.fetch(
    new Request('https://behdoon.ir/api/customer/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '09121111111' }),
    }),
    env
  );

  const now = new Date().toISOString();

  // Clear tables for test reproducibility
  sqlite.exec(`
    DELETE FROM providers;
    DELETE FROM requests;
    DELETE FROM customers;
    DELETE FROM quotes;
    DELETE FROM invoices;
    DELETE FROM payments;
    DELETE FROM ratings;
    DELETE FROM disputes;
    DELETE FROM notifications;
    DELETE FROM provider_notifications;
    DELETE FROM order_status_logs;
    DELETE FROM provider_schedules;
    DELETE FROM financial_ledger;
  `);

  // Seed Customers
  sqlite.exec(`
    INSERT INTO customers (id, phone, full_name, created_at, updated_at)
    VALUES (1, '09121111111', 'مریم احمدی', '${now}', '${now}');

    INSERT INTO customers (id, phone, full_name, created_at, updated_at)
    VALUES (2, '09122222222', 'سهراب سپهری', '${now}', '${now}');
  `);

  // Seed Provider
  sqlite.exec(`
    INSERT INTO providers (id, full_name, phone, districts, service_categories, bio, years_experience, status, is_online, performance_score, total_jobs, completed_jobs, created_at, updated_at)
    VALUES (1, 'علی تکنسین', '09123334455', '["all"]', '["plumbing"]', 'تکنسین باتجربه تاسیسات', 8, 'active', 1, 4.9, 15, 12, '${now}', '${now}');
  `);

  // Seed Request 1 (for Customer 1)
  sqlite.exec(`
    INSERT INTO requests (id, tracking_code, customer_id, phone, name, service_id, service_label, status, payment_status, provider_id, scheduled_date, scheduled_time, origin_city, origin_notes, created_at, updated_at)
    VALUES (1, 'BD-2026-000001', 1, '09121111111', 'مریم احمدی', 'plumbing', 'لوله‌کشی و شیرآلات', 'quote_pending', 'unpaid', 1, '2026-09-20', '10:00', 'تهران', 'تعمیر نشتی لوله آشپزخانه', '${now}', '${now}');
  `);

  // Seed Request 2 (for Customer 2)
  sqlite.exec(`
    INSERT INTO requests (id, tracking_code, customer_id, phone, name, service_id, service_label, status, payment_status, provider_id, scheduled_date, scheduled_time, origin_city, origin_notes, created_at, updated_at)
    VALUES (2, 'BD-2026-000002', 2, '09122222222', 'سهراب سپهری', 'electrical', 'برق‌کاری ساختمان', 'submitted', 'unpaid', NULL, '2026-09-21', '14:00', 'تهران', 'تعویض فیوز اصلی', '${now}', '${now}');
  `);

  // Seed Quote for Request 1
  sqlite.exec(`
    INSERT INTO quotes (id, request_id, provider_id, pricing_model, base_amount, materials_amount, labor_amount, discount_amount, final_amount, description, status, created_at, updated_at)
    VALUES (1, 1, 1, 'fixed', 500000, 200000, 300000, 50000, 650000, 'شامل قطعه اورجینال و دستمزد تخصصی', 'sent', '${now}', '${now}');
  `);

  const tokenCust1 = 'behdoon_customer_1_09121111111';
  const tokenCust2 = 'behdoon_customer_2_09122222222';
  const tokenProv1 = 'behdoon_provider_1';

  console.log('\n[2] Test Customer Orders List (GET /api/customer/orders)');
  // Anonymous should be 401
  let res = await worker.fetch(new Request('https://behdoon.ir/api/customer/orders'), env);
  assert(res.status === 401, 'Anonymous GET /api/customer/orders returns 401 Unauthorized');

  // Customer 1 should see only Order 1
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/customer/orders', {
      headers: { Authorization: `Bearer ${tokenCust1}` },
    }),
    env
  );
  assert(res.status === 200, 'Customer 1 GET /api/customer/orders returns 200');
  let data = await res.json();
  assert(data.orders && data.orders.length === 1 && data.orders[0].id === 1, 'Customer 1 only sees their own order #1');
  assert(data.orders[0].paymentStatus === 'unpaid', 'Order includes decoupled paymentStatus');

  // Customer 2 should see only Order 2
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/customer/orders', {
      headers: { Authorization: `Bearer ${tokenCust2}` },
    }),
    env
  );
  data = await res.json();
  assert(data.orders && data.orders.length === 1 && data.orders[0].id === 2, 'Customer 2 only sees their own order #2 (IDOR isolation)');

  console.log('\n[3] Test Single Order Detail & Anti-IDOR (GET /api/customer/orders/:id)');
  // Anonymous access returns 401
  res = await worker.fetch(new Request('https://behdoon.ir/api/customer/orders/1'), env);
  assert(res.status === 401, 'Anonymous GET /api/customer/orders/1 returns 401 Unauthorized');

  // Customer 2 accessing Customer 1 order returns 403 Forbidden
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/customer/orders/1', {
      headers: { Authorization: `Bearer ${tokenCust2}` },
    }),
    env
  );
  assert(res.status === 403, 'Customer 2 accessing Customer 1 order returns 403 Forbidden (Anti-IDOR)');

  // Customer 1 accessing Order 1 returns 200 with full details, timeline, and provider dossier
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/customer/orders/1', {
      headers: { Authorization: `Bearer ${tokenCust1}` },
    }),
    env
  );
  assert(res.status === 200, 'Customer 1 GET /api/customer/orders/1 returns 200 OK');
  data = await res.json();
  assert(data.order && data.order.id === 1, 'Returns correct order details');
  assert(data.provider && data.provider.id === 1 && data.provider.name === 'علی تکنسین', 'Returns provider dossier');
  assert(Array.isArray(data.timeline) && data.timeline.length > 0, 'Returns customer timeline events');
  assert(Array.isArray(data.quotes) && data.quotes.length === 1, 'Returns quote in order details');
  assert(data.permissions && data.permissions.canAcceptQuote === true, 'Returns canAcceptQuote permission flag');

  console.log('\n[4] Test Quote Acceptance & Anti-IDOR (POST /api/quotes/:id/accept)');
  // Anonymous accept returns 401
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/quotes/1/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }),
    env
  );
  assert(res.status === 401, 'Anonymous quote accept returns 401 Unauthorized');

  // Customer 2 trying to accept Customer 1 quote returns 403 Forbidden
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/quotes/1/accept', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenCust2}`, 'Content-Type': 'application/json' },
    }),
    env
  );
  assert(res.status === 403, 'Customer 2 accepting Customer 1 quote returns 403 Forbidden');

  // Customer 1 accepts quote successfully
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/quotes/1/accept', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenCust1}`, 'Content-Type': 'application/json' },
    }),
    env
  );
  assert(res.status === 200, 'Customer 1 accepts quote successfully (200 OK)');
  data = await res.json();
  assert(data.success === true && data.status === 'confirmed', 'Order status transitioned to confirmed');
  assert(data.invoiceNumber && data.invoiceNumber.startsWith('INV-'), 'Official invoice issued upon quote acceptance');

  // Verify quote status in DB is accepted
  const quoteRow = sqlite.prepare('SELECT status FROM quotes WHERE id = 1').get();
  assert(quoteRow.status === 'accepted', 'Quotes status updated to accepted in DB');

  // Verify invoice exists
  const invRow = sqlite.prepare('SELECT * FROM invoices WHERE quote_id = 1').get();
  assert(invRow && invRow.total_amount === 650000, 'Invoice created with correct total amount 650,000');

  console.log('\n[5] Test Invoice Access & Anti-IDOR (GET /api/requests/:id/invoice)');
  // Anonymous returns 401
  res = await worker.fetch(new Request('https://behdoon.ir/api/requests/1/invoice'), env);
  assert(res.status === 401, 'Anonymous GET /api/requests/1/invoice returns 401');

  // Customer 2 returns 403
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/requests/1/invoice', {
      headers: { Authorization: `Bearer ${tokenCust2}` },
    }),
    env
  );
  assert(res.status === 403, 'Customer 2 accessing Customer 1 invoice returns 403 Forbidden');

  // Customer 1 returns 200 with invoice
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/requests/1/invoice', {
      headers: { Authorization: `Bearer ${tokenCust1}` },
    }),
    env
  );
  assert(res.status === 200, 'Customer 1 accessing invoice returns 200 OK');
  data = await res.json();
  assert(data.invoice && data.invoice.total_amount === 650000, 'Invoice contains correct amount');

  console.log('\n[6] Test Decoupled Payment & Financial Ledger (POST /api/payments/checkout)');
  // Anonymous checkout returns 401
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/payments/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId: 1, amount: 650000 }),
    }),
    env
  );
  assert(res.status === 401, 'Anonymous checkout returns 401 Unauthorized');

  // Customer 2 paying for Customer 1 returns 403
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/payments/checkout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenCust2}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId: 1, amount: 650000 }),
    }),
    env
  );
  assert(res.status === 403, 'Customer 2 paying for Customer 1 returns 403 Forbidden');

  // Customer 1 pays for their invoice (Order 1 is confirmed)
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/payments/checkout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenCust1}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId: 1, amount: 650000, markServiceCompleted: false }),
    }),
    env
  );
  assert(res.status === 200, 'Customer 1 checkout succeeds (200 OK)');
  data = await res.json();
  assert(data.success === true && data.paymentStatus === 'paid', 'Payment status updated to paid');

  // Verify decoupled state in DB
  const reqPayCheck = sqlite.prepare('SELECT status, payment_status FROM requests WHERE id = 1').get();
  assert(reqPayCheck.payment_status === 'paid', 'Payment status is paid in database');
  assert(reqPayCheck.status !== 'cancelled', 'Order status is preserved and decoupled');

  // Verify financial ledger double-entry
  const ledgerEntries = sqlite.prepare('SELECT * FROM financial_ledger WHERE order_id = 1').all();
  assert(ledgerEntries && ledgerEntries.length >= 2, 'Financial ledger recorded double-entry accounting records');

  console.log('\n[7] Test Provider Order Execution & Customer Tracking Updates');
  // Provider advances order: confirmed -> en_route
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/orders/1/action', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenProv1}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'en_route' }),
    }),
    env
  );
  assert(res.status === 200, 'Provider action en_route succeeds (200 OK)');

  // Verify active order reveals phone to customer
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/customer/orders/1', {
      headers: { Authorization: `Bearer ${tokenCust1}` },
    }),
    env
  );
  data = await res.json();
  assert(data.order.status === 'en_route', 'Customer detail shows order in en_route');
  assert(data.provider.canCall === true, 'Provider canCall is true during active en_route');
  assert(data.provider.phone === '09123334455', 'Provider phone is fully visible during active service');

  // Provider advances: arrived -> start_service -> complete_service
  await worker.fetch(
    new Request('https://behdoon.ir/api/provider/orders/1/action', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenProv1}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'arrived' }),
    }),
    env
  );
  await worker.fetch(
    new Request('https://behdoon.ir/api/provider/orders/1/action', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenProv1}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'start_service' }),
    }),
    env
  );
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/provider/orders/1/action', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenProv1}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'complete_service' }),
    }),
    env
  );
  assert(res.status === 200, 'Provider completes service (200 OK)');

  // Check customer view after service completion
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/customer/orders/1', {
      headers: { Authorization: `Bearer ${tokenCust1}` },
    }),
    env
  );
  data = await res.json();
  assert(data.order.status === 'completed', 'Order status is completed in customer view');
  assert(data.provider.canCall === false, 'canCall is false after completion');
  assert(data.provider.phone && data.provider.phone.includes('***'), 'Provider phone is privacy-masked after completion');
  assert(data.permissions.canRate === true, 'canRate permission is true after completion');

  console.log('\n[8] Test Verified Rating & PPS Score Calculation');
  // Anonymous rate returns 401
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/requests/1/rate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ overallScore: 5 }),
    }),
    env
  );
  assert(res.status === 401, 'Anonymous rating returns 401 Unauthorized');

  // Customer 2 rating Customer 1 order returns 403
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/requests/1/rate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenCust2}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ overallScore: 5 }),
    }),
    env
  );
  assert(res.status === 403, 'Customer 2 rating Customer 1 order returns 403 Forbidden');

  // Uncompleted order rating prevention test (Order 2 is still submitted)
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/requests/2/rate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenCust2}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ overallScore: 5 }),
    }),
    env
  );
  assert(res.status === 400, 'Rating uncompleted order returns 400 (ORDER_NOT_COMPLETED)');

  // Customer 1 rates Order 1 with 5 stars
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/requests/1/rate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenCust1}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        overallScore: 5,
        punctualityScore: 5,
        cleanlinessScore: 5,
        skillScore: 5,
        comment: 'کار با کیفیت و برخورد عالی بود.',
      }),
    }),
    env
  );
  assert(res.status === 200, 'Customer 1 successfully submits verified rating (200 OK)');

  // Duplicate rating attempt returns 400
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/requests/1/rate', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenCust1}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ overallScore: 4 }),
    }),
    env
  );
  assert(res.status === 400, 'Duplicate rating attempt returns 400 (DUPLICATE_RATING)');

  console.log('\n[9] Test Disputes / Complaints & Anti-IDOR (POST /api/requests/:id/disputes)');
  // Anonymous dispute returns 401
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/requests/1/disputes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'poor_quality', description: 'تست' }),
    }),
    env
  );
  assert(res.status === 401, 'Anonymous dispute returns 401 Unauthorized');

  // Customer 2 disputing Customer 1 order returns 403
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/requests/1/disputes', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenCust2}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'poor_quality', description: 'تست غیرمجاز' }),
    }),
    env
  );
  assert(res.status === 403, 'Customer 2 disputing Customer 1 order returns 403 Forbidden');

  // Customer 1 files dispute on Order 1
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/requests/1/disputes', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenCust1}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reason: 'damage',
        description: 'شیر آب مقداری چکه دارد و نیاز به بازبینی دارد.',
        claimAmount: 50000,
      }),
    }),
    env
  );
  assert(res.status === 201, 'Customer 1 files dispute successfully (201 Created)');
  data = await res.json();
  assert(data.success === true && data.status === 'disputed', 'Dispute recorded and order marked disputed');

  console.log('\n[10] Test Customer Cancellation & Schedule Release (POST /api/customer/orders/:id/cancel)');
  // Setup Order 3 for Customer 1 with booked schedule
  sqlite.exec(`
    INSERT INTO requests (id, tracking_code, customer_id, phone, name, service_id, service_label, status, payment_status, provider_id, scheduled_date, scheduled_time, origin_city, created_at, updated_at)
    VALUES (3, 'BD-2026-000003', 1, '09121111111', 'مریم احمدی', 'plumbing', 'لوله‌کشی', 'confirmed', 'unpaid', 1, '2026-09-22', '11:00', 'تهران', '${now}', '${now}');

    INSERT INTO provider_schedules (provider_id, date, time_slot, request_id, status, is_booked, created_at)
    VALUES (1, '2026-09-22', '11:00', 3, 'booked', 1, '${now}');
  `);

  // Customer 2 trying to cancel Customer 1 order returns 403
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/customer/orders/3/cancel', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenCust2}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'انصراف' }),
    }),
    env
  );
  assert(res.status === 403, 'Customer 2 cancelling Customer 1 order returns 403 Forbidden');

  // Customer 1 cancels Order 3
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/customer/orders/3/cancel', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenCust1}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'تغییر برنامه شخصی' }),
    }),
    env
  );
  assert(res.status === 200, 'Customer 1 cancels order successfully (200 OK)');
  data = await res.json();
  assert(data.status === 'cancelled' && data.cancellationType === 'customer_cancelled', 'Order status is cancelled with customer_cancelled type');

  // Verify schedule slot was released
  const schedRow = sqlite.prepare('SELECT is_booked, status FROM provider_schedules WHERE request_id = 3').get();
  assert(schedRow && schedRow.is_booked === 0 && schedRow.status === 'cancelled', 'Provider booked schedule slot was released (is_booked = 0)');

  // Verify provider cancelled_jobs was NOT incremented (non-punitive)
  const provRow = sqlite.prepare('SELECT cancelled_jobs FROM providers WHERE id = 1').get();
  assert(provRow.cancelled_jobs === 0, 'Customer cancellation is non-punitive to provider (cancelled_jobs not incremented)');

  // Test cancellation on in_progress order returns 400
  sqlite.exec(`
    INSERT INTO requests (id, tracking_code, customer_id, phone, name, service_id, status, payment_status, created_at, updated_at)
    VALUES (4, 'BD-2026-000004', 1, '09121111111', 'مریم', 'plumbing', 'in_progress', 'unpaid', '${now}', '${now}');
  `);
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/customer/orders/4/cancel', {
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenCust1}`, 'Content-Type': 'application/json' },
    }),
    env
  );
  assert(res.status === 400, 'Cancelling in_progress order returns 400 (ORDER_LOCKED_FOR_CANCELLATION)');

  console.log('\n[11] Test Customer Notifications Center');
  // Customer 1 notifications list
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/customer/notifications', {
      headers: { Authorization: `Bearer ${tokenCust1}` },
    }),
    env
  );
  assert(res.status === 200, 'GET /api/customer/notifications returns 200 OK');
  data = await res.json();
  assert(Array.isArray(data.notifications) && data.notifications.length > 0, 'Customer 1 has event notifications recorded');
  const notifId = data.notifications[0].id;

  // Mark notification read
  res = await worker.fetch(
    new Request(`https://behdoon.ir/api/customer/notifications/${notifId}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${tokenCust1}` },
    }),
    env
  );
  assert(res.status === 200, 'PATCH /api/customer/notifications/:id/read returns 200 OK');

  const readNotif = sqlite.prepare('SELECT is_read FROM notifications WHERE id = ?').get(notifId);
  assert(readNotif.is_read === 1, 'Notification marked as read in database');

  console.log('\n========================================');
  console.log(`Phase 3B Integration Tests Completed:`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log('========================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
