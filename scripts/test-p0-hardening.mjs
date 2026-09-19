import { DatabaseSync } from 'node:sqlite';
import worker from '../worker/index.ts';

console.log('===============================================================');
console.log('--- Behdoon P0 Hardening & Production Safety Gate Test Suite ---');
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

async function runP0HardeningTests() {
  const adminHeaders = { Authorization: 'Bearer behdoon_admin_p0_super' };

  // -------------------------------------------------------------
  // [Section 1] Setup Customers, Providers & Initial Orders
  // -------------------------------------------------------------
  console.log('--- [Section 1] Setup: Auth & Orders ---');

  // Customer A
  await worker.fetch(new Request('https://behdoon.ir/api/customer/otp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: '09121110001' }),
  }), env);
  let res = await worker.fetch(new Request('https://behdoon.ir/api/customer/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: '09121110001', code: '1234' }),
  }), env);
  let body = await res.json();
  const customerAToken = body.token;
  const customerAId = body.customer.id;
  assert(customerAToken && customerAId, 'Customer A authenticated');

  // Customer B
  await worker.fetch(new Request('https://behdoon.ir/api/customer/otp/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: '09121110002' }),
  }), env);
  res = await worker.fetch(new Request('https://behdoon.ir/api/customer/otp/verify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: '09121110002', code: '1234' }),
  }), env);
  body = await res.json();
  const customerBToken = body.token;
  const customerBId = body.customer.id;
  assert(customerBToken && customerBId, 'Customer B authenticated');

  // Create Order for Customer A
  res = await worker.fetch(new Request('https://behdoon.ir/api/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerAToken}` },
    body: JSON.stringify({
      customerName: 'مشتری الف',
      phone: '09121110001',
      serviceId: 'hvac',
      serviceLabel: 'سرمایش و گرمایش',
      originProvince: 'تهران',
      originCity: 'تهران',
      originNotes: 'سرویس کولر',
      scheduledDate: '1405-02-01',
      scheduledTime: '14:00',
    }),
  }), env);
  body = await res.json();
  const orderAId = body.orderId;
  assert(orderAId > 0, `Order A created with ID ${orderAId}`);

  // Create Order for Customer B
  res = await worker.fetch(new Request('https://behdoon.ir/api/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerBToken}` },
    body: JSON.stringify({
      customerName: 'مشتری ب',
      phone: '09121110002',
      serviceId: 'hvac',
      serviceLabel: 'سرمایش و گرمایش',
      originProvince: 'تهران',
      originCity: 'تهران',
      originNotes: 'تعمیر چیلر',
      scheduledDate: '1405-02-01',
      scheduledTime: '16:00',
    }),
  }), env);
  body = await res.json();
  const orderBId = body.orderId;
  assert(orderBId > 0, `Order B created with ID ${orderBId}`);

  // -------------------------------------------------------------
  // [Section 2] Security: Authorization & Anti-IDOR (P0-3)
  // -------------------------------------------------------------
  console.log('\n--- [Section 2] Security: RBAC & IDOR Protection (P0-3) ---');

  // Assign Order A to Provider 1
  res = await worker.fetch(new Request('https://behdoon.ir/api/matching/auto-assign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestId: orderAId, providerId: 1, selectionMode: 'auto' }),
  }), env);
  body = await res.json();
  assert(res.status === 200 && body.success, 'Order A assigned to Provider 1');

  // Issue Quote for Order A by Provider 1
  res = await worker.fetch(new Request('https://behdoon.ir/api/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer behdoon_provider_1_09351112233',
    },
    body: JSON.stringify({
      requestId: orderAId,
      providerId: 1,
      pricingModel: 'fixed',
      baseAmount: 500000,
      finalAmount: 500000,
      description: 'تعمیر کولر گازی',
    }),
  }), env);
  body = await res.json();
  assert(res.status === 201 && body.quote.id > 0, `Quote issued for Order A with ID ${body.quote.id}`);
  const quoteAId = body.quote.id;

  // Test 2.1: Provider Impersonation Blocked (Provider 2 token submitting quote for Provider 1)
  res = await worker.fetch(new Request('https://behdoon.ir/api/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer behdoon_provider_2_09124445566',
    },
    body: JSON.stringify({
      requestId: orderAId,
      providerId: 1, // Impersonation!
      finalAmount: 450000,
    }),
  }), env);
  assert(res.status === 403, 'Provider impersonation blocked with 403 Forbidden');

  // Test 2.2: Customer B attempts to accept Customer A\'s quote (IDOR Protection)
  res = await worker.fetch(new Request(`https://behdoon.ir/api/quotes/${quoteAId}/accept`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${customerBToken}`,
    },
  }), env);
  assert(res.status === 403, 'Customer B blocked from accepting Customer A\'s quote (403 Forbidden)');

  // Test 2.3: Customer B attempts to reject Customer A\'s quote (IDOR Protection)
  res = await worker.fetch(new Request(`https://behdoon.ir/api/quotes/${quoteAId}/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${customerBToken}`,
    },
  }), env);
  assert(res.status === 403, 'Customer B blocked from rejecting Customer A\'s quote (403 Forbidden)');

  // Test 2.4: Customer A accepts own quote (Allowed)
  res = await worker.fetch(new Request(`https://behdoon.ir/api/quotes/${quoteAId}/accept`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${customerAToken}`,
    },
  }), env);
  body = await res.json();
  assert(res.status === 200 && body.status === 'confirmed', 'Customer A accepts own quote successfully');

  // Test 2.5: Customer B attempts to rate Customer A\'s order (IDOR Protection)
  res = await worker.fetch(new Request(`https://behdoon.ir/api/requests/${orderAId}/rate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${customerBToken}`,
    },
    body: JSON.stringify({ score: 5, comment: 'عالی' }),
  }), env);
  assert(res.status === 403, 'Customer B blocked from rating Customer A\'s order (403 Forbidden)');

  // Test 2.6: Customer B attempts to dispute Customer A\'s order (IDOR Protection)
  res = await worker.fetch(new Request(`https://behdoon.ir/api/requests/${orderAId}/disputes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${customerBToken}`,
    },
    body: JSON.stringify({ description: 'شکایت غیرمجاز' }),
  }), env);
  assert(res.status === 403, 'Customer B blocked from disputing Customer A\'s order (403 Forbidden)');

  // -------------------------------------------------------------
  // [Section 3] State Machine & Payment Decoupling (P0-1 & P0-8)
  // -------------------------------------------------------------
  console.log('\n--- [Section 3] State Machine & Status Decoupling (P0-1 & P0-8) ---');

  // Test 3.1: Illegal State Transition Blocked (submitted -> completed)
  res = await worker.fetch(new Request(`https://behdoon.ir/api/admin/requests/${orderBId}/status`, {
    method: 'PATCH',
    headers: { ...adminHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'completed' }),
  }), env);
  body = await res.json();
  assert(res.status === 400 && body.code === 'INVALID_STATE_TRANSITION', 'Direct jump from submitted -> completed rejected (400)');

  // Move Order B through legitimate state machine to in_progress
  await worker.fetch(new Request(`https://behdoon.ir/api/admin/requests/${orderBId}/status`, {
    method: 'PATCH',
    headers: { ...adminHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'provider_assigned' }),
  }), env);
  await worker.fetch(new Request(`https://behdoon.ir/api/admin/requests/${orderBId}/status`, {
    method: 'PATCH',
    headers: { ...adminHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'in_progress' }),
  }), env);

  const reqBBeforePay = sqlite.prepare('SELECT status, payment_status FROM requests WHERE id = ?').get(orderBId);
  assert(reqBBeforePay.status === 'in_progress' && reqBBeforePay.payment_status === 'unpaid', 'Order B in in_progress state');

  // Test 3.2: Rating in_progress order is blocked
  res = await worker.fetch(new Request(`https://behdoon.ir/api/requests/${orderBId}/rate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${customerBToken}`,
    },
    body: JSON.stringify({ score: 5, comment: 'کار هنوز تمام نشده' }),
  }), env);
  assert(res.status === 400, 'Rating incomplete order is strictly blocked (400 Bad Request)');

  // Test 3.3: Payment while in_progress decouples payment from service completion
  res = await worker.fetch(new Request('https://behdoon.ir/api/payments/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requestId: orderBId,
      customerId: customerBId,
      amount: 600000,
      paymentMethod: 'online',
      markServiceCompleted: false,
    }),
  }), env);
  body = await res.json();
  assert(res.status === 200 && body.success, 'Checkout processed while service in progress');

  const reqBAfterPay = sqlite.prepare('SELECT status, payment_status FROM requests WHERE id = ?').get(orderBId);
  assert(reqBAfterPay.payment_status === 'paid', 'payment_status transitioned to paid');
  assert(reqBAfterPay.status === 'in_progress', 'Order status remained in_progress (Payment strictly decoupled from service completion)');

  // -------------------------------------------------------------
  // [Section 4] Dynamic Commission Engine (P0-2)
  // -------------------------------------------------------------
  console.log('\n--- [Section 4] Dynamic Commission Engine (P0-2) ---');

  // Test 4.1: Configure category-based commission rule with labor_only exemption
  res = await worker.fetch(new Request('https://behdoon.ir/api/admin/commission-rules', {
    method: 'POST',
    headers: { ...adminHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      categoryId: 'renovation',
      tier: 'standard',
      rate: 0.20, // 20% platform commission on labor
      calculationBasis: 'labor_only',
      minFee: 10000,
      maxFee: 500000,
    }),
  }), env);
  body = await res.json();
  assert(res.status === 200 && body.success, 'Dynamic commission rule configured for renovation: 20% on labor_only');

  // Create Order C with serviceId 'renovation'
  res = await worker.fetch(new Request('https://behdoon.ir/api/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${customerAToken}` },
    body: JSON.stringify({
      customerName: 'مشتری الف',
      phone: '09121110001',
      serviceId: 'renovation',
      serviceLabel: 'بازسازی ساختمان',
      originProvince: 'تهران',
      originCity: 'تهران',
      originNotes: 'نقاشی و گچکاری',
      scheduledDate: '1405-02-05',
      scheduledTime: '09:00',
    }),
  }), env);
  body = await res.json();
  const orderCId = body.orderId;

  // Auto assign Provider 4 (renovation specialist)
  await worker.fetch(new Request('https://behdoon.ir/api/matching/auto-assign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestId: orderCId, providerId: 4, selectionMode: 'auto' }),
  }), env);

  // Issue quote with explicit breakdown: Labor = 500,000, Materials = 300,000, Discount = 100,000 -> Total = 700,000
  res = await worker.fetch(new Request('https://behdoon.ir/api/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer behdoon_provider_4_09128889900',
    },
    body: JSON.stringify({
      requestId: orderCId,
      providerId: 4,
      pricingModel: 'fixed',
      baseAmount: 500000,
      laborAmount: 500000,
      materialsAmount: 300000,
      discountAmount: 100000,
      finalAmount: 700000,
      description: 'رنگ‌آمیزی دیوارها با مصالح درجه یک',
    }),
  }), env);
  body = await res.json();
  const quoteCId = body.quote.id;

  // Accept Quote C
  await worker.fetch(new Request(`https://behdoon.ir/api/quotes/${quoteCId}/accept`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${customerAToken}`, 'Content-Type': 'application/json' },
  }), env);

  // Pay Checkout for Order C: Total = 700,000
  // Formula: net_labor = (labor 500,000 - discount 100,000) = 400,000
  // Materials (300,000) 100% exempt from platform commission!
  // Commission = 20% of 400,000 = 80,000
  // Net Payable to provider = 700,000 - 80,000 = 620,000
  res = await worker.fetch(new Request('https://behdoon.ir/api/payments/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requestId: orderCId,
      customerId: customerAId,
      amount: 700000,
      paymentMethod: 'online',
    }),
  }), env);
  body = await res.json();
  assert(res.status === 200 && body.success, 'Order C checkout processed');

  const settlementC = sqlite.prepare('SELECT * FROM provider_settlements WHERE request_id = ?').get(orderCId);
  assert(settlementC !== null, 'Settlement record created');
  assert(settlementC.gross_amount === 700000, 'Gross amount is 700,000');
  assert(settlementC.labor_amount === 500000, 'Labor amount recorded as 500,000');
  assert(settlementC.materials_amount === 300000, 'Materials amount recorded as 300,000');
  assert(settlementC.commission_amount === 80000, 'Commission correctly computed on labor_only: (500k-100k)*20% = 80,000');
  assert(settlementC.net_payable === 620000, 'Net payable to technician is 620,000 (materials fully preserved)');

  // -------------------------------------------------------------
  // [Section 5] Financial Ledger & Refunds (P0-6)
  // -------------------------------------------------------------
  console.log('\n--- [Section 5] Financial Ledger & Refunds (P0-6) ---');

  // Verify Ledger records for Order C
  const ledgerRows = sqlite.prepare('SELECT * FROM financial_ledger WHERE order_id = ? ORDER BY id ASC').all(orderCId);
  assert(ledgerRows.length >= 3, `Financial ledger recorded ${ledgerRows.length} entries for order`);
  const paymentEntry = ledgerRows.find((e) => e.entry_type === 'payment');
  const settlementEntry = ledgerRows.find((e) => e.entry_type === 'settlement');
  const commissionEntry = ledgerRows.find((e) => e.entry_type === 'commission');
  assert(paymentEntry && paymentEntry.amount === 700000 && paymentEntry.direction === 'credit', 'Platform credited for customer payment');
  assert(settlementEntry && settlementEntry.amount === 620000 && settlementEntry.direction === 'credit', 'Provider credited for net payable');
  assert(commissionEntry && commissionEntry.amount === 80000 && commissionEntry.direction === 'credit', 'Platform revenue credited for commission');

  // Test 5.1: Non-staff refund attempt returns 401
  res = await worker.fetch(new Request('https://behdoon.ir/api/payments/refund', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestId: orderCId, amount: 200000 }),
  }), env);
  assert(res.status === 401, 'Unauthorized refund attempt returns 401 Unauthorized');

  // Test 5.2: Refund exceeding total amount returns 400
  res = await worker.fetch(new Request('https://behdoon.ir/api/payments/refund', {
    method: 'POST',
    headers: { ...adminHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestId: orderCId, amount: 999999 }),
  }), env);
  assert(res.status === 400, 'Refund exceeding payable balance rejected with 400 Bad Request');

  // Test 5.3: Partial Refund (200,000 Toman)
  res = await worker.fetch(new Request('https://behdoon.ir/api/payments/refund', {
    method: 'POST',
    headers: { ...adminHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestId: orderCId, amount: 200000, reason: 'عدم رضایت جزئی' }),
  }), env);
  body = await res.json();
  assert(res.status === 200 && body.paymentStatus === 'partially_refunded', 'Partial refund of 200,000 recorded');
  assert(body.remainingRefundable === 500000, 'Remaining refundable is 500,000');

  // Verify debit ledger entry for partial refund
  const refundEntry = sqlite.prepare("SELECT * FROM financial_ledger WHERE order_id = ? AND entry_type = 'refund'").get(orderCId);
  assert(refundEntry && refundEntry.amount === 200000 && refundEntry.direction === 'debit', 'Debit refund entry logged in financial ledger');

  // Test 5.4: Full refund of remainder (500,000 Toman)
  res = await worker.fetch(new Request('https://behdoon.ir/api/payments/refund', {
    method: 'POST',
    headers: { ...adminHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestId: orderCId, reason: 'استرداد کامل مانده' }),
  }), env);
  body = await res.json();
  assert(res.status === 200 && body.paymentStatus === 'refunded', 'Payment fully refunded');
  assert(body.remainingRefundable === 0, 'Remaining refundable balance is now 0');

  // Test 5.5: Attempting further refund after full refund returns 400
  res = await worker.fetch(new Request('https://behdoon.ir/api/payments/refund', {
    method: 'POST',
    headers: { ...adminHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestId: orderCId, amount: 10000 }),
  }), env);
  assert(res.status === 400, 'Refund on already refunded transaction blocked (400)');

  // -------------------------------------------------------------
  // [Section 6] Idempotency Engine (P0-7)
  // -------------------------------------------------------------
  console.log('\n--- [Section 6] Idempotency Engine (P0-7) ---');

  const idempKey = 'idemp-checkout-test-999';
  const payPayload = {
    requestId: orderAId,
    customerId: customerAId,
    amount: 500000,
    paymentMethod: 'online',
    transactionRef: 'TX-IDEMP-P0-UNIQUE-1',
  };

  // First call with Idempotency-Key
  const firstPayRes = await worker.fetch(new Request('https://behdoon.ir/api/payments/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempKey },
    body: JSON.stringify(payPayload),
  }), env);
  const firstBody = await firstPayRes.json();
  assert(firstPayRes.status === 200 && firstBody.success, 'First checkout with Idempotency-Key succeeds');

  // 5 Subsequent Retries with identical Idempotency-Key
  let idempSuccessCount = 0;
  for (let i = 1; i <= 5; i++) {
    const retryRes = await worker.fetch(new Request('https://behdoon.ir/api/payments/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempKey },
      body: JSON.stringify(payPayload),
    }), env);
    const retryBody = await retryRes.json();
    if (retryRes.status === 200 && retryBody.paymentId === firstBody.paymentId && retryBody.transactionRef === firstBody.transactionRef) {
      idempSuccessCount++;
    }
  }
  assert(idempSuccessCount === 5, '5 consecutive retries with Idempotency-Key returned identical cached response without re-executing');

  // Verify only 1 payment was inserted into the payments table
  const paymentsCount = sqlite.prepare("SELECT COUNT(*) as cnt FROM payments WHERE transaction_ref = 'TX-IDEMP-P0-UNIQUE-1'").get();
  assert(paymentsCount.cnt === 1, 'Exactly 1 payment record exists for idempotency key (no duplicate charging)');

  // -------------------------------------------------------------
  // [Section 7] Scheduling & Concurrency Lock (P0-4)
  // -------------------------------------------------------------
  console.log('\n--- [Section 7] Scheduling Concurrency Collision Lock (P0-4) ---');

  // Create two separate orders requesting the same provider at the exact same time slot
  const slotDate = '1405-03-10';
  const slotTime = '11:00';

  const o1Res = await worker.fetch(new Request('https://behdoon.ir/api/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: '09123330001',
      serviceId: 'electrical',
      scheduledDate: slotDate,
      scheduledTime: slotTime,
    }),
  }), env);
  const o1 = await o1Res.json();

  const o2Res = await worker.fetch(new Request('https://behdoon.ir/api/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone: '09123330002',
      serviceId: 'electrical',
      scheduledDate: slotDate,
      scheduledTime: slotTime,
    }),
  }), env);
  const o2 = await o2Res.json();

  // Run simultaneous assignment of Provider 3 to both orders
  const [assign1, assign2] = await Promise.all([
    worker.fetch(new Request('https://behdoon.ir/api/matching/auto-assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId: o1.orderId, providerId: 3 }),
    }), env),
    worker.fetch(new Request('https://behdoon.ir/api/matching/auto-assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId: o2.orderId, providerId: 3 }),
    }), env),
  ]);

  const statuses = [assign1.status, assign2.status];
  assert(statuses.includes(200), 'One concurrent assignment successfully acquired the schedule lock (200 OK)');
  assert(statuses.includes(409), 'Concurrent conflicting assignment blocked by DB constraint with 409 Conflict');

  // -------------------------------------------------------------
  // [Section 8] Cancellation Attribution (P0-5)
  // -------------------------------------------------------------
  console.log('\n--- [Section 8] Cancellation Attribution (P0-5) ---');

  const prov3Before = sqlite.prepare('SELECT cancelled_jobs FROM providers WHERE id = 3').get();

  // Customer cancels order 1 -> Provider fault is false, should NOT increment provider's cancelled_jobs
  await worker.fetch(new Request(`https://behdoon.ir/api/admin/requests/${o1.orderId}/status`, {
    method: 'PATCH',
    headers: { ...adminHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'cancelled',
      cancellationActor: 'customer',
      cancellationType: 'customer_cancelled',
      cancellationReason: 'منصرف شدم',
    }),
  }), env);

  const prov3AfterCustCancel = sqlite.prepare('SELECT cancelled_jobs FROM providers WHERE id = 3').get();
  assert(prov3AfterCustCancel.cancelled_jobs === prov3Before.cancelled_jobs, 'Provider cancelled_jobs NOT penalized on customer cancellation');

  // Assign and then cancel due to provider no show
  const o3Res = await worker.fetch(new Request('https://behdoon.ir/api/requests', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: '09123330003', serviceId: 'electrical', scheduledDate: '1405-03-12', scheduledTime: '15:00' }),
  }), env);
  const o3 = await o3Res.json();

  await worker.fetch(new Request('https://behdoon.ir/api/matching/auto-assign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestId: o3.orderId, providerId: 3 }),
  }), env);

  await worker.fetch(new Request(`https://behdoon.ir/api/admin/requests/${o3.orderId}/status`, {
    method: 'PATCH',
    headers: { ...adminHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      status: 'cancelled',
      cancellationActor: 'provider',
      cancellationType: 'provider_no_show',
      cancellationReason: 'عدم حضور متخصص در محل',
    }),
  }), env);

  const prov3AfterProvFault = sqlite.prepare('SELECT cancelled_jobs FROM providers WHERE id = 3').get();
  assert(prov3AfterProvFault.cancelled_jobs === prov3Before.cancelled_jobs + 1, 'Provider cancelled_jobs incremented on provider fault cancellation');

  // Final Summary
  console.log('\n===============================================================');
  console.log(`P0 Hardening Test Results: ${passed} passed, ${failed} failed.`);
  console.log('===============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runP0HardeningTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
