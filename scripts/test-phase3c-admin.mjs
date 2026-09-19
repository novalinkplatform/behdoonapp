import { DatabaseSync } from 'node:sqlite';
import worker from '../worker/index.ts';

console.log('--- Starting Behdoon Phase 3C: Admin Operations & Platform Governance Integration Tests ---');

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
  console.log('\n[1] Database Initialization & Admin Seeding');
  // Trigger initDb via any health or otp request
  await worker.fetch(
    new Request('https://behdoon.ir/api/customer/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '09121111111' }),
    }),
    env
  );

  const now = new Date().toISOString();

  // Verify admin accounts are seeded in admin_users
  const adminUsers = sqlite.prepare('SELECT * FROM admin_users').all();
  assert(adminUsers.length >= 5, `Admin users table seeded with at least 5 roles (found ${adminUsers.length})`);

  const superAdmin = adminUsers.find(u => u.role === 'super_admin');
  assert(superAdmin && superAdmin.username === 'admin', 'Super admin account exists with proper username');

  // Headers for roles
  const superHeaders = { 'Authorization': 'Bearer behdoon_admin_token_super', 'Content-Type': 'application/json' };
  const opsHeaders = { 'Authorization': 'Bearer behdoon_admin_token_operations', 'Content-Type': 'application/json' };
  const financeHeaders = { 'Authorization': 'Bearer behdoon_admin_token_finance', 'Content-Type': 'application/json' };
  const supportHeaders = { 'Authorization': 'Bearer behdoon_admin_token_support', 'Content-Type': 'application/json' };
  const providerAdminHeaders = { 'Authorization': 'Bearer behdoon_admin_token_provider', 'Content-Type': 'application/json' };

  console.log('\n[2] RBAC & Authorization Verification (5-Role Matrix)');
  // 1. Unauthenticated request to /api/admin/dashboard should fail with 401
  const unauthRes = await worker.fetch(new Request('https://behdoon.ir/api/admin/dashboard'), env);
  assert(unauthRes.status === 401, 'Unauthenticated access to /api/admin/dashboard rejected with 401');

  // 2. Invalid token should fail with 401
  const invalidRes = await worker.fetch(new Request('https://behdoon.ir/api/admin/dashboard', {
    headers: { 'Authorization': 'Bearer invalid_token' }
  }), env);
  assert(invalidRes.status === 401, 'Invalid admin token rejected with 401');

  // 3. Operations admin accessing dashboard (has operations perm)
  const opsDashRes = await worker.fetch(new Request('https://behdoon.ir/api/admin/dashboard', { headers: opsHeaders }), env);
  assert(opsDashRes.status === 200, 'Operations admin can view dashboard (200)');

  // 4. Operations admin attempting refund (finance only) -> 403
  const opsRefundRes = await worker.fetch(new Request('https://behdoon.ir/api/admin/refunds', {
    method: 'POST',
    headers: opsHeaders,
    body: JSON.stringify({ requestId: 1003, amount: 10000, reason: 'test' })
  }), env);
  assert(opsRefundRes.status === 403, 'Operations admin forbidden from issuing refunds (403)');

  // 5. Support admin attempting refund -> 403
  const supportRefundRes = await worker.fetch(new Request('https://behdoon.ir/api/admin/refunds', {
    method: 'POST',
    headers: supportHeaders,
    body: JSON.stringify({ requestId: 1003, amount: 10000, reason: 'test' })
  }), env);
  assert(supportRefundRes.status === 403, 'Support admin forbidden from issuing refunds (403)');

  // 6. Non-super-admin attempting emergency state machine override -> 403
  const opsOverrideRes = await worker.fetch(new Request('https://behdoon.ir/api/admin/requests/1001/override', {
    method: 'POST',
    headers: opsHeaders,
    body: JSON.stringify({ targetStatus: 'completed', reason: 'Ops attempt' })
  }), env);
  assert(opsOverrideRes.status === 403, 'Operations admin forbidden from emergency state machine override (403)');

  const finOverrideRes = await worker.fetch(new Request('https://behdoon.ir/api/admin/requests/1001/override', {
    method: 'POST',
    headers: financeHeaders,
    body: JSON.stringify({ targetStatus: 'completed', reason: 'Finance attempt' })
  }), env);
  assert(finOverrideRes.status === 403, 'Finance admin forbidden from emergency state machine override (403)');

  console.log('\n[3] Seeding Domain Data for KPI & Live Operations Testing');
  // Seed Customer
  sqlite.exec(`
    INSERT INTO customers (id, phone, full_name, created_at, updated_at)
    VALUES (10, '09129998877', 'کاوه آهنگر', '${now}', '${now}');
  `);

  // Seed Providers
  sqlite.exec(`
    INSERT INTO providers (id, full_name, phone, districts, service_categories, bio, status, is_online, performance_score, total_jobs, completed_jobs, created_at, updated_at)
    VALUES (101, 'مهندس رستمی', '09127776655', '["1","2"]', '["plumbing"]', 'تکنسین لوله‌کشی', 'active', 1, 4.8, 20, 18, '${now}', '${now}');
    INSERT INTO providers (id, full_name, phone, districts, service_categories, bio, status, is_online, performance_score, total_jobs, completed_jobs, created_at, updated_at)
    VALUES (102, 'استاد کریمی', '09126665544', '["1","3"]', '["electrical"]', 'برق‌کار مجرب', 'active', 0, 4.5, 10, 8, '${now}', '${now}');
  `);

  // Seed Orders using schema columns
  sqlite.exec(`
    INSERT INTO requests (id, tracking_code, customer_id, name, phone, service_id, service_label, origin_district, origin_notes, status, payment_status, created_at, updated_at)
    VALUES (1001, 'BD-1001', 10, 'کاوه آهنگر', '09129998877', 'plumbing', 'تاسیسات', '1', 'نشت آب لوله اصلی ملاصدرا', 'matching', 'unpaid', '${now}', '${now}');

    INSERT INTO requests (id, tracking_code, customer_id, provider_id, name, phone, service_id, service_label, origin_district, origin_notes, status, payment_status, created_at, updated_at)
    VALUES (1002, 'BD-1002', 10, 101, 'کاوه آهنگر', '09129998877', 'plumbing', 'تاسیسات', '2', 'سعادت‌آباد تعمیر شیرآلات', 'in_progress', 'unpaid', '${now}', '${now}');

    INSERT INTO requests (id, tracking_code, customer_id, provider_id, name, phone, service_id, service_label, origin_district, origin_notes, status, payment_status, created_at, updated_at)
    VALUES (1003, 'BD-1003', 10, 101, 'کاوه آهنگر', '09129998877', 'plumbing', 'تاسیسات', '1', 'میرداماد تعمیر پکیج', 'disputed', 'paid', '${now}', '${now}');
  `);

  // Seed Invoice & Payment for 1003
  sqlite.exec(`
    INSERT INTO invoices (id, invoice_number, request_id, customer_id, provider_id, subtotal, labor_total, materials_total, total_amount, status, created_at)
    VALUES (501, 'INV-1003', 1003, 10, 101, 1200000, 1000000, 200000, 1200000, 'paid', '${now}');

    INSERT INTO payments (id, invoice_id, request_id, customer_id, amount, payment_method, transaction_ref, status, refunded_amount, created_at)
    VALUES (801, 501, 1003, 10, 1200000, 'online', 'TRK-ADMIN-801', 'completed', 0, '${now}');
  `);

  // Seed Dispute for 1003
  sqlite.exec(`
    INSERT INTO disputes (id, request_id, opened_by, opened_by_id, reason, claim_amount, description, status, created_at)
    VALUES (901, 1003, 'customer', 10, 'کار به درستی انجام نشد و نشتی ادامه دارد', 500000, 'توضیحات تکمیلی مشتری', 'open', '${now}');
  `);

  // Seed Support Ticket for 1003
  sqlite.exec(`
    INSERT INTO support_tickets (id, customer_id, request_id, subject, category, priority, status, created_at, updated_at)
    VALUES (701, 10, 1003, 'پیگیری درخواست حل اختلاف و بازرسی', 'dispute', 'normal', 'open', '${now}', '${now}');
  `);

  // Seed Ledger Entry
  sqlite.exec(`
    INSERT INTO financial_ledger (entry_type, order_id, payment_id, invoice_id, customer_id, amount, direction, balance_after, description, created_at)
    VALUES ('payment', 1003, 801, 501, 10, 1200000, 'credit', 1200000, 'Customer payment received for request 1003', '${now}');
    INSERT INTO financial_ledger (entry_type, order_id, payment_id, invoice_id, provider_id, amount, direction, balance_after, description, created_at)
    VALUES ('commission', 1003, 801, 501, 101, 150000, 'credit', 1350000, 'Platform commission for invoice 501', '${now}');
  `);

  // Seed Provider Settlement Liability
  sqlite.exec(`
    INSERT INTO provider_settlements (provider_id, request_id, gross_amount, commission_amount, platform_fee, net_payable, status, created_at)
    VALUES (101, 1003, 1200000, 150000, 150000, 1050000, 'pending', '${now}');
  `);

  console.log('\n[4] 13 Live Admin Dashboard KPIs');
  const dashRes = await worker.fetch(new Request('https://behdoon.ir/api/admin/dashboard', { headers: superHeaders }), env);
  assert(dashRes.status === 200, 'Super admin fetches dashboard KPIs successfully');
  const dashData = await dashRes.json();
  assert(dashData.success === true, 'Dashboard returned success=true');
  const kpis = dashData.kpis;
  assert(kpis !== undefined, 'KPIs payload exists');
  assert(kpis.totalOrders >= 3, `totalOrders is live and accurate (${kpis.totalOrders})`);
  assert(kpis.activeOrders >= 1, `activeOrders is live (${kpis.activeOrders})`);
  assert(kpis.disputedOrders >= 1, `disputedOrders is live (${kpis.disputedOrders})`);
  assert(kpis.openDisputes >= 1, `openDisputes is live (${kpis.openDisputes})`);
  assert(kpis.grossOrderValue >= 1200000, `grossOrderValue computed from ledger (${kpis.grossOrderValue})`);
  assert(kpis.platformRevenue >= 150000, `platformRevenue computed from ledger (${kpis.platformRevenue})`);
  assert(kpis.providerPayable >= 1050000, `providerPayable computed from pending settlements (${kpis.providerPayable})`);
  assert(kpis.openSupportTickets >= 1, `openSupportTickets is live (${kpis.openSupportTickets})`);

  console.log('\n[5] Live Order Monitoring & Filtering');
  // Filter by status=matching
  const matchingOrdersRes = await worker.fetch(new Request('https://behdoon.ir/api/admin/orders?status=matching', { headers: opsHeaders }), env);
  assert(matchingOrdersRes.status === 200, 'Fetch orders with status=matching returns 200');
  const matchingOrders = await matchingOrdersRes.json();
  assert(matchingOrders.orders.every(o => o.orderState === 'matching'), 'All returned orders have matching status');

  // Filter by district=1
  const dist1OrdersRes = await worker.fetch(new Request('https://behdoon.ir/api/admin/orders?district=1', { headers: opsHeaders }), env);
  const dist1Orders = await dist1OrdersRes.json();
  assert(dist1Orders.orders.every(o => o.address.district === '1'), 'All returned orders belong to district 1');

  // Filter by serviceId=plumbing
  const plumbingOrdersRes = await worker.fetch(new Request('https://behdoon.ir/api/admin/orders?serviceId=plumbing', { headers: opsHeaders }), env);
  const plumbingOrders = await plumbingOrdersRes.json();
  assert(plumbingOrders.orders.length >= 2, 'Filtered orders by service plumbing');

  console.log('\n[6] Explainable Matching Engine & Inspector');
  // First, run candidate matching on order 1001 so structured breakdown is persisted
  const matchCandidatesRes = await worker.fetch(new Request('https://behdoon.ir/api/matching/candidates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ requestId: 1001 })
  }), env);
  assert(matchCandidatesRes.status === 200, 'Matching candidates calculated for request 1001');

  // Query explainable matching endpoint
  const explainRes = await worker.fetch(new Request('https://behdoon.ir/api/admin/matching/requests/1001', { headers: opsHeaders }), env);
  assert(explainRes.status === 200, 'Explainable matching endpoint returns 200');
  const explainData = await explainRes.json();
  assert(explainData.order && explainData.order.id === 1001, 'Explainable matching returns requested order');
  assert(explainData.candidates.length >= 1, 'Candidates array populated');
  const firstCand = explainData.candidates[0];
  assert(firstCand.breakdown !== undefined && typeof firstCand.breakdown.skill === 'number', 'Structured breakdown persisted with component scores');
  assert(typeof firstCand.explanation === 'string' && firstCand.explanation.includes('امتیاز کل'), 'Explainable human-readable Persian narrative generated');

  console.log('\n[7] Dispute Resolution Dossier & Case Management');
  // Get 360-degree case dossier
  const dossierRes = await worker.fetch(new Request('https://behdoon.ir/api/admin/disputes/901', { headers: supportHeaders }), env);
  assert(dossierRes.status === 200, 'Support admin can view 360-degree dispute dossier');
  const dossier = await dossierRes.json();
  assert(dossier.dispute && dossier.dispute.id === 901, 'Dossier dispute ID matches 901');
  assert(dossier.order && dossier.order.id === 1003, 'Dossier includes order details');
  assert(dossier.customer && dossier.customer.id === 10, 'Dossier includes customer details');
  assert(dossier.provider && dossier.provider.id === 101, 'Dossier includes provider details');
  assert(dossier.invoice !== undefined, 'Dossier includes invoice history');
  assert(dossier.payments && dossier.payments.length >= 1, 'Dossier includes payment transactions');

  // Update dispute status with internal notes
  const updateDisputeRes = await worker.fetch(new Request('https://behdoon.ir/api/admin/disputes/901', {
    method: 'PATCH',
    headers: supportHeaders,
    body: JSON.stringify({
      status: 'in_investigation',
      note: 'کارشناس فنی در حال بررسی مستندات و تماس با طرفین است.',
      providerCompensation: 0,
      customerCompensation: 500000
    })
  }), env);
  assert(updateDisputeRes.status === 200, 'Dispute status transitioned to in_investigation with internal notes');
  const updatedDispData = await updateDisputeRes.json();
  assert(updatedDispData.status === 'in_investigation', 'Dispute status updated to in_investigation');

  console.log('\n[8] Anti-Double Refund & Financial Integrity');
  // Finance admin issues a partial refund of 500,000 IRR on request 1003
  const refund1Res = await worker.fetch(new Request('https://behdoon.ir/api/admin/refunds', {
    method: 'POST',
    headers: financeHeaders,
    body: JSON.stringify({
      requestId: 1003,
      amount: 500000,
      reason: 'استرداد بخشی از هزینه بابت عدم رضایت از کیفیت کار'
    })
  }), env);
  assert(refund1Res.status === 200, 'First refund of 500,000 IRR succeeds (200)');
  const refund1Data = await refund1Res.json();
  assert(refund1Data.totalRefunded === 500000, 'Payment recorded totalRefunded = 500,000 IRR');

  // Check ledger reflects refund
  const refundLedger = sqlite.prepare("SELECT * FROM financial_ledger WHERE entry_type = 'refund' AND order_id = 1003").get();
  assert(refundLedger !== undefined && refundLedger.amount === 500000 && refundLedger.direction === 'debit', 'Double-entry ledger recorded debit of 500,000 for refund');

  // Attempt second refund of 800,000 IRR (500,000 + 800,000 = 1,300,000 > 1,200,000 original amount) -> Must fail with 400
  const refund2Res = await worker.fetch(new Request('https://behdoon.ir/api/admin/refunds', {
    method: 'POST',
    headers: financeHeaders,
    body: JSON.stringify({
      requestId: 1003,
      amount: 800000,
      reason: 'تلاش مجدد برای استرداد مازاد بر سقف'
    })
  }), env);
  assert(refund2Res.status === 400, 'Second refund exceeding remaining balance rejected with 400');
  const refund2Err = await refund2Res.json();
  assert(refund2Err.code === 'REFUND_EXCEEDS_BALANCE', 'Error code is REFUND_EXCEEDS_BALANCE');

  // Second legitimate refund of remaining 700,000 IRR should succeed
  const refund3Res = await worker.fetch(new Request('https://behdoon.ir/api/admin/refunds', {
    method: 'POST',
    headers: financeHeaders,
    body: JSON.stringify({
      requestId: 1003,
      amount: 700000,
      reason: 'استرداد مابقی کل وجه'
    })
  }), env);
  assert(refund3Res.status === 200, 'Second legitimate refund of 700,000 IRR succeeds exactly reaching 1,200,000 total');

  console.log('\n[9] Dynamic Commission Engine with Hierarchical Precedence & Material Exemption');
  // Configure commission rules:
  // 1. Global default: 15%
  // 2. Category rule for plumbing: 12% (labor_only)
  // 3. Provider rule for provider 101: 10% (labor_only)
  sqlite.exec(`
    DELETE FROM commission_rules;
    INSERT INTO commission_rules (category_id, rate, min_fee, max_fee, scope, calculation_basis, is_active, created_at)
    VALUES ('all', 0.15, 10000, 500000, 'global', 'all', 1, '${now}');

    INSERT INTO commission_rules (category_id, rate, min_fee, max_fee, scope, scope_id, calculation_basis, is_active, created_at)
    VALUES ('plumbing', 0.12, 10000, 500000, 'category', 'plumbing', 'labor_only', 1, '${now}');

    INSERT INTO commission_rules (category_id, rate, min_fee, max_fee, scope, scope_id, calculation_basis, is_active, created_at)
    VALUES ('plumbing', 0.10, 10000, 500000, 'provider', '101', 'labor_only', 1, '${now}');
  `);

  // Create a new request and invoice for Provider 101 with labor: 2,000,000 and parts: 500,000 (Total: 2,500,000)
  sqlite.exec(`
    INSERT INTO requests (id, tracking_code, customer_id, provider_id, name, phone, service_id, service_label, origin_district, origin_notes, status, payment_status, created_at, updated_at)
    VALUES (1004, 'BD-1004', 10, 101, 'کاوه آهنگر', '09129998877', 'plumbing', 'تاسیسات', '1', 'تعویض لوله تهرانپارس', 'work_completed', 'unpaid', '${now}', '${now}');

    INSERT INTO invoices (id, invoice_number, request_id, customer_id, provider_id, subtotal, labor_total, materials_total, total_amount, status, created_at)
    VALUES (504, 'INV-1004', 1004, 10, 101, 2500000, 2000000, 500000, 2500000, 'issued', '${now}');
  `);

  // Checkout payment for order 1004 to test dynamic commission calculation in checkout flow
  const checkoutRes = await worker.fetch(new Request('https://behdoon.ir/api/payments/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer customer_10_09129998877'
    },
    body: JSON.stringify({
      requestId: 1004,
      amount: 2500000,
      paymentMethod: 'online'
    })
  }), env);
  assert(checkoutRes.status === 200, 'Checkout for dynamic commission test succeeds');

  // Verify settlement calculation:
  // Provider rule applies (rate = 0.10, calculation_basis = 'labor_only')
  // Commissionable amount = labor_cost = 2,000,000 (parts 500,000 is 100% exempt!)
  // Commission fee = 2,000,000 * 0.10 = 200,000 IRR.
  // Provider earnings = total (2,500,000) - 200,000 = 2,300,000 IRR.
  const settlement = sqlite.prepare('SELECT * FROM provider_settlements WHERE request_id = 1004').get();
  assert(settlement !== undefined, 'Provider settlement record created for order 1004');
  assert(settlement.platform_fee === 200000, `Parts/materials exempt! Platform fee = ${settlement.platform_fee} (expected 200,000)`);
  assert(settlement.net_payable === 2300000, `Provider net payable = ${settlement.net_payable} (expected 2,300,000)`);

  console.log('\n[10] Provider Governance & Suspension Audit Trail');
  // Provider admin views provider dossier
  const provDossierRes = await worker.fetch(new Request('https://behdoon.ir/api/admin/providers/101', { headers: providerAdminHeaders }), env);
  assert(provDossierRes.status === 200, 'Provider admin fetches provider dossier');
  const provDossier = await provDossierRes.json();
  assert(provDossier.provider && provDossier.provider.id === 101, 'Dossier provider ID is 101');
  assert(provDossier.provider.completed_jobs === 18, 'Dossier metrics computed correctly');

  // Suspend provider with mandatory reason
  const suspendRes = await worker.fetch(new Request('https://behdoon.ir/api/admin/providers/101/status', {
    method: 'PATCH',
    headers: providerAdminHeaders,
    body: JSON.stringify({
      action: 'suspend',
      reason: 'شکایت‌های مکرر در خصوص عدم رعایت استانداردهای کیفی و تاخیر'
    })
  }), env);
  assert(suspendRes.status === 200, 'Provider successfully suspended with mandatory reason');

  // Suspension without reason must fail with 400
  const suspendNoReasonRes = await worker.fetch(new Request('https://behdoon.ir/api/admin/providers/101/status', {
    method: 'PATCH',
    headers: providerAdminHeaders,
    body: JSON.stringify({ action: 'suspend' })
  }), env);
  assert(suspendNoReasonRes.status === 400, 'Suspension without reason rejected with 400');

  // Check audit log was recorded for provider suspension
  const suspendAudit = sqlite.prepare("SELECT * FROM admin_audit_logs WHERE entity_type = 'provider' AND entity_id = '101'").get();
  assert(suspendAudit !== undefined, 'Admin audit log recorded for provider suspension');
  assert(suspendAudit.reason.includes('شکایت‌های مکرر'), 'Audit log records exact suspension reason');

  console.log('\n[11] Customer Governance & Least-Privilege PII Masking');
  // Default customer query: phone number MUST be masked
  const maskedCustRes = await worker.fetch(new Request('https://behdoon.ir/api/admin/customers/10', { headers: opsHeaders }), env);
  assert(maskedCustRes.status === 200, 'Customer details fetched');
  const maskedCust = await maskedCustRes.json();
  assert(maskedCust.customer.phone === '0912***8877', `Phone number is securely masked: ${maskedCust.customer.phone}`);

  // Customer query with view_unmasked=true by admin with view_pii permission
  const unmaskedCustRes = await worker.fetch(new Request('https://behdoon.ir/api/admin/customers/10?view_unmasked=true', { headers: superHeaders }), env);
  const unmaskedCust = await unmaskedCustRes.json();
  assert(unmaskedCust.customer.phone === '09129998877', 'Unmasked phone returned when view_unmasked=true requested with permissions');

  // Verify access to unmasked PII was audit-logged
  const piiAudit = sqlite.prepare("SELECT * FROM admin_audit_logs WHERE action = 'view_customer_pii_unmasked' AND entity_id = '10'").get();
  assert(piiAudit !== undefined, 'Audit log generated for unmasked PII access');

  console.log('\n[12] Emergency State Machine Override (Super Admin Only)');
  // Super admin forces emergency status change on request 1001 from 'matching' to 'cancelled'
  const overrideRes = await worker.fetch(new Request('https://behdoon.ir/api/admin/requests/1001/override', {
    method: 'POST',
    headers: superHeaders,
    body: JSON.stringify({
      targetStatus: 'cancelled',
      reason: 'دستور مراجع نظارتی و توافق با طرفین به دلیل شرایط اضطراری'
    })
  }), env);
  assert(overrideRes.status === 200, 'Super admin successfully executed emergency state override (200)');
  const overrideData = await overrideRes.json();
  assert(overrideData.toStatus === 'cancelled', 'Request status updated to cancelled');

  // Verify both order_status_logs and admin_audit_logs were updated
  const statusLog = sqlite.prepare("SELECT * FROM order_status_logs WHERE request_id = 1001 ORDER BY id DESC LIMIT 1").get();
  assert(statusLog && statusLog.to_status === 'cancelled' && statusLog.changed_by_role === 'admin_override', 'Order status log records admin_override source');

  const overrideAudit = sqlite.prepare("SELECT * FROM admin_audit_logs WHERE action = 'state_machine_override' AND entity_id = '1001'").get();
  assert(overrideAudit !== undefined && overrideAudit.reason.includes('دستور مراجع نظارتی'), 'Admin audit log records emergency override with reason');

  console.log('\n[13] Operational Alerts Engine & Notifications Monitoring');
  const alertsRes = await worker.fetch(new Request('https://behdoon.ir/api/admin/alerts', { headers: opsHeaders }), env);
  assert(alertsRes.status === 200, 'Operational alerts fetched successfully (200)');
  const alertsData = await alertsRes.json();
  assert(Array.isArray(alertsData.alerts), 'Alerts returned as array');

  const notifsRes = await worker.fetch(new Request('https://behdoon.ir/api/admin/notifications', { headers: opsHeaders }), env);
  assert(notifsRes.status === 200, 'Admin notifications monitor returns 200');
  const notifsData = await notifsRes.json();
  assert(Array.isArray(notifsData.notifications), 'Notifications returned as array');

  console.log('\n[14] Admin Audit Stream');
  const auditLogsRes = await worker.fetch(new Request('https://behdoon.ir/api/admin/audit-logs', { headers: superHeaders }), env);
  assert(auditLogsRes.status === 200, 'Audit logs stream returns 200');
  const auditData = await auditLogsRes.json();
  assert(auditData.logs.length >= 3, `Audit logs stream has recorded actions (${auditData.logs.length})`);

  console.log('\n========================================================');
  console.log(`Phase 3C Test Results: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal error during test execution:', err);
  process.exit(1);
});
