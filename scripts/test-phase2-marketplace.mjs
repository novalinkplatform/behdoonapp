import { DatabaseSync } from 'node:sqlite';
import worker from '../worker/index.ts';

console.log('--- Starting Behdoon Phase 2 Marketplace Integration Tests ---');

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

async function runPhase2Tests() {
  // Setup: Register Customer and Authenticate
  console.log('\n[Setup] Customer Authentication');
  await worker.fetch(
    new Request('https://behdoon.ir/api/customer/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '09129876543' }),
    }),
    env
  );
  let res = await worker.fetch(
    new Request('https://behdoon.ir/api/customer/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '09129876543', code: '1234' }),
    }),
    env
  );
  let body = await res.json();
  const customerToken = body.token;
  const customerId = body.customer.id;
  assert(customerToken && customerId, 'Customer authenticated successfully');

  // Setup: Create Order 1 for Customer
  console.log('\n[Setup] Create Customer Order');
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'سارا رضایی',
        phone: '09129876543',
        serviceId: 'hvac',
        serviceLabel: 'سرمایش و گرمایش',
        originProvince: 'تهران',
        originCity: 'تهران',
        originPropertyType: 'residential',
        originNotes: 'منطقه ۲ - سعادت آباد',
        destinationProvince: 'تهران',
        destinationCity: 'تهران',
        destinationPropertyType: 'residential',
        originFloor: 2,
        originElevator: true,
        destinationFloor: 2,
        destinationElevator: true,
        wantsPacking: false,
        laborChoice: 'none',
        scheduledDate: '1405-01-20',
        scheduledTime: '10:00',
        estimateMin: 500000,
        estimateAvg: 750000,
        estimateMax: 1000000,
      }),
    }),
    env
  );
  body = await res.json();
  const trackingCode1 = body.trackingCode;
  const requestId = body.orderId;
  assert(trackingCode1, `Order 1 created with tracking: ${trackingCode1}`);
  assert(requestId > 0, `Order 1 created with ID: ${requestId}`);

  // Test 1: IDOR Protection on Customer Orders
  console.log('\n[Test 1] IDOR Protection (GET /api/customer/orders)');
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/customer/orders', {
      headers: { Authorization: `Bearer ${customerToken}` },
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && Array.isArray(body.orders) && body.orders.length >= 1, 'Customer orders retrieved via authenticated token');
  assert(body.orders.every((o) => o.phone === '09129876543'), 'All returned orders strictly belong to the authenticated customer');

  // Test unauthenticated access returns 401
  let unauthRes = await worker.fetch(new Request('https://behdoon.ir/api/customer/orders'), env);
  assert(unauthRes.status === 401, 'Unauthenticated call to /api/customer/orders returns 401 Unauthorized');

  // Test 2: Matching Candidates Engine
  console.log('\n[Test 2] Matching Candidates Engine (POST /api/matching/candidates)');
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/matching/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, maxCandidates: 5 }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && Array.isArray(body.candidates) && body.candidates.length > 0, 'Matching candidates computed');
  const topCandidate = body.candidates[0];
  assert(topCandidate.score > 0, `Top candidate score calculated: ${topCandidate.score}`);
  assert(topCandidate.breakdown.skill > 0 && topCandidate.breakdown.location > 0, 'Matching score includes skill and location components');

  // Test 3: Auto-Assignment with Collision Detection
  console.log('\n[Test 3] Provider Auto-Assignment & Collision-Free Scheduling');
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/matching/auto-assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, selectionMode: 'auto' }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.success === true && body.providerId > 0, `Provider ${body.providerId} assigned to order`);
  assert(body.status === 'provider_assigned', 'Order status moved to provider_assigned');
  const assignedProviderId = body.providerId;

  // Verify Schedule is Booked
  const scheduleRow = sqlite.prepare(
    "SELECT * FROM provider_schedules WHERE provider_id = ? AND date = '1405-01-20' AND time_slot = '10:00'"
  ).get(assignedProviderId);
  assert(scheduleRow && scheduleRow.status === 'booked', 'Provider schedule entry created with booked status');

  // Test 4: Collision Prevention on Next Matching
  console.log('\n[Test 4] Schedule Collision Prevention');
  // Create Order 2 at same date and time slot
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName: 'کامران حسینی',
        phone: '09121112233',
        serviceId: 'hvac',
        serviceLabel: 'سرمایش و گرمایش',
        originProvince: 'تهران',
        originCity: 'تهران',
        originPropertyType: 'residential',
        originFloor: 1,
        originElevator: true,
        destinationFloor: 1,
        destinationElevator: true,
        wantsPacking: false,
        laborChoice: 'none',
        scheduledDate: '1405-01-20',
        scheduledTime: '10:00',
        estimateMin: 500000,
        estimateAvg: 750000,
        estimateMax: 1000000,
      }),
    }),
    env
  );
  body = await res.json();
  const requestId2 = body.orderId;
  assert(requestId2 > 0, `Order 2 created with ID: ${requestId2}`);

  res = await worker.fetch(
    new Request('https://behdoon.ir/api/matching/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId: requestId2 }),
    }),
    env
  );
  body = await res.json();
  const collidingCand = body.candidates.find((c) => c.providerId === assignedProviderId);
  assert(collidingCand && collidingCand.hasCollision === true, 'Assigned provider correctly flagged with hasCollision=true');

  // Test 5: Quotes Engine (Issue Quote)
  console.log('\n[Test 5] Quotes Engine (Issue Quote)');
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestId,
        providerId: assignedProviderId,
        pricingModel: 'fixed',
        baseAmount: 600000,
        materialsAmount: 150000,
        laborAmount: 100000,
        discountAmount: 50000,
        finalAmount: 800000,
        description: 'سرویس کامل چیلر و تعویض خازن',
      }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 201 && body.success === true && body.quote.id > 0, `Quote issued with ID: ${body.quote.id}`);
  const quoteId1 = body.quote.id;

  // Issue Competitor Quote for same request
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestId,
        providerId: 2,
        pricingModel: 'fixed',
        finalAmount: 900000,
        description: 'پیش‌فاکتور جایگزین',
      }),
    }),
    env
  );
  body = await res.json();
  const quoteId2 = body.quote.id;

  // Test 6: List Quotes for Request
  console.log('\n[Test 6] List Quotes for Request');
  res = await worker.fetch(new Request(`https://behdoon.ir/api/requests/${requestId}/quotes`), env);
  body = await res.json();
  assert(res.status === 200 && Array.isArray(body.quotes) && body.quotes.length === 2, '2 quotes listed for request');

  // Test 7: Accept Quote & Auto Invoice Generation
  console.log('\n[Test 7] Accept Quote & Auto Invoice');
  res = await worker.fetch(
    new Request(`https://behdoon.ir/api/quotes/${quoteId1}/accept`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}`, 'Content-Type': 'application/json' },
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.success === true && body.status === 'confirmed', 'Quote 1 accepted and order confirmed');
  assert(body.invoiceNumber && body.invoiceNumber.startsWith('INV-'), `Invoice generated: ${body.invoiceNumber}`);

  // Verify Competitor Quote was cancelled
  const compQuote = sqlite.prepare('SELECT status FROM quotes WHERE id = ?').get(quoteId2);
  assert(compQuote && compQuote.status === 'cancelled', 'Competing quote automatically cancelled upon acceptance');

  // Test 8: View Invoice & Payments
  console.log('\n[Test 8] View Invoice (GET /api/requests/:id/invoice)');
  res = await worker.fetch(
    new Request(`https://behdoon.ir/api/requests/${requestId}/invoice`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.invoice && body.invoice.total_amount === 800000, 'Invoice retrieved with correct total amount (800,000 Toman)');

  // Test 9: Payment Checkout & 15% Platform Commission Settlement
  console.log('\n[Test 9] Payment Checkout & 15% Platform Commission');
  res = await worker.fetch(
    new Request('https://behdoon.ir/api/payments/checkout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestId,
        invoiceId: body.invoice.id,
        customerId,
        amount: 800000,
        paymentMethod: 'online_gateway',
        markServiceCompleted: true,
      }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.success === true && body.status === 'completed', 'Payment checkout completed');

  // Verify Provider Settlement (15% Commission)
  const settlementRow = sqlite.prepare('SELECT * FROM provider_settlements WHERE request_id = ?').get(requestId);
  assert(settlementRow !== null, 'Provider settlement record created');
  assert(settlementRow.gross_amount === 800000, 'Gross amount is 800,000');
  assert(settlementRow.commission_amount === 120000, 'Platform 15% commission is exactly 120,000');
  assert(settlementRow.net_payable === 680000, 'Net payable to technician is 680,000');

  // Verify Request Status is Completed
  const reqRow = sqlite.prepare('SELECT status FROM requests WHERE id = ?').get(requestId);
  assert(reqRow && reqRow.status === 'completed', 'Order status transitioned to completed');

  // Test 10: Verified Ratings & Auto PPS Recalculation
  console.log('\n[Test 10] Verified Rating & Provider PPS Score');
  res = await worker.fetch(
    new Request(`https://behdoon.ir/api/requests/${requestId}/rate`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId,
        overallScore: 5,
        punctualityScore: 5,
        cleanlinessScore: 5,
        skillScore: 5,
        comment: 'بسیار حرفه‌ای و سریع بودند.',
      }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.success === true, 'Verified rating recorded for completed order');
  assert(body.newPerformanceScore > 0, `Provider performance score updated: ${body.newPerformanceScore}`);

  // Test duplicate rating blocked
  let dupRateRes = await worker.fetch(
    new Request(`https://behdoon.ir/api/requests/${requestId}/rate`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId, overallScore: 4 }),
    }),
    env
  );
  assert(dupRateRes.status === 400, 'Duplicate rating blocked with 400 Bad Request');

  // Test 11: List Provider Ratings
  console.log('\n[Test 11] List Provider Ratings');
  res = await worker.fetch(new Request(`https://behdoon.ir/api/providers/${assignedProviderId}/ratings`), env);
  body = await res.json();
  assert(res.status === 200 && Array.isArray(body.ratings) && body.ratings.length >= 1, 'Provider ratings retrieved');

  // Test 12: Structured Disputes
  console.log('\n[Test 12] File Dispute & Admin Resolution');
  res = await worker.fetch(
    new Request(`https://behdoon.ir/api/requests/${requestId}/disputes`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${customerToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reason: 'warranty_claim',
        claimAmount: 100000,
        description: 'دستگاه پس از ۲ روز دوباره خنک نمی‌کند.',
      }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 201 && body.success === true && body.disputeId > 0, `Dispute filed with ID: ${body.disputeId}`);
  const disputeId = body.disputeId;

  // Verify Order Status changed to disputed
  const disputedReq = sqlite.prepare('SELECT status FROM requests WHERE id = ?').get(requestId);
  assert(disputedReq && disputedReq.status === 'disputed', 'Order status transitioned to disputed');

  // Test 13: Admin Dispute Resolution
  console.log('\n[Test 13] Admin Disputes List & Resolution');
  const adminHeaders = { Authorization: 'Bearer behdoon_admin_token_super' };
  res = await worker.fetch(new Request('https://behdoon.ir/api/admin/disputes', { headers: adminHeaders }), env);
  body = await res.json();
  assert(res.status === 200 && Array.isArray(body.disputes) && body.disputes.length >= 1, 'Admin dispute list contains open dispute');

  res = await worker.fetch(
    new Request(`https://behdoon.ir/api/admin/disputes/${disputeId}`, {
      method: 'PATCH',
      headers: { ...adminHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'resolved',
        resolutionNotes: 'با هماهنگی متخصص، قطعه رایگان تعویض گردید.',
        refundAmount: 0,
      }),
    }),
    env
  );
  body = await res.json();
  assert(res.status === 200 && body.success === true && body.status === 'resolved', 'Admin resolved dispute successfully');

  // Final summary
  console.log('\n========================================');
  console.log(`Summary: ${passed} passed, ${failed} failed.`);
  console.log('========================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase2Tests().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
