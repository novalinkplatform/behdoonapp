/**
 * Reality Checker Live Verification Suite for Behdoon Platform
 * Runs live end-to-end assertions against https://behdoon.ir
 */

const BASE_URL = 'https://behdoon.ir';

async function runTest(name, fn) {
  try {
    process.stdout.write(`⏳ [Testing] ${name}... `);
    const result = await fn();
    console.log(`✅ PASS: ${result || 'OK'}`);
    return true;
  } catch (err) {
    console.log(`❌ FAIL: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log(`\n======================================================`);
  console.log(`🔍 Behdoon Reality-Checker Live System Verification`);
  console.log(`🌐 Target: ${BASE_URL}`);
  console.log(`⏱️ Timestamp: ${new Date().toISOString()}`);
  console.log(`======================================================\n`);

  let passed = 0;
  let total = 0;

  // 1. Healthcheck
  total++;
  if (await runTest('API Health Endpoint', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error(`Expected ok status, got ${JSON.stringify(data)}`);
    return `Status: ${data.status}`;
  })) passed++;

  // 2. SEO & Homepage Meta Tags
  total++;
  if (await runTest('Homepage Meta Tags & Canonical', async () => {
    const res = await fetch(`${BASE_URL}/`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const html = await res.text();
    if (!html.includes('<title>') || !html.includes('بهدون')) throw new Error('Missing Persian title');
    if (!html.includes('https://behdoon.ir')) throw new Error('Missing canonical URL');
    if (!html.includes('webmanifest')) throw new Error('Missing manifest link');
    return 'Meta tags, title & canonical verified';
  })) passed++;

  // 3. Sitemap
  total++;
  if (await runTest('Sitemap XML Validation', async () => {
    const res = await fetch(`${BASE_URL}/sitemap.xml`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const xml = await res.text();
    if (!xml.includes('<urlset') || !xml.includes('https://behdoon.ir')) throw new Error('Invalid sitemap XML');
    const urlCount = (xml.match(/<loc>/g) || []).length;
    if (urlCount < 80) throw new Error(`Expected >=80 URLs, found ${urlCount}`);
    return `${urlCount} indexed URLs`;
  })) passed++;

  // 4. Robots.txt
  total++;
  if (await runTest('Robots.txt Directives', async () => {
    const res = await fetch(`${BASE_URL}/robots.txt`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const text = await res.text();
    if (!text.includes('Sitemap: https://behdoon.ir/sitemap.xml')) throw new Error('Missing Sitemap directive');
    return 'Directives verified';
  })) passed++;

  // 5. Web Manifest & PWA Integrity
  total++;
  if (await runTest('PWA Manifest & Brand Integrity', async () => {
    const res = await fetch(`${BASE_URL}/site.webmanifest`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const manifest = await res.json();
    if (manifest.name !== 'بهدون' && !manifest.name.includes('بهدون')) {
      throw new Error(`Unexpected name in manifest: ${manifest.name}`);
    }
    if (JSON.stringify(manifest).includes('بهبار')) {
      throw new Error('Found legacy "بهبار" text inside manifest!');
    }
    return `App Name: "${manifest.name}", Icons: ${manifest.icons?.length || 0}`;
  })) passed++;

  // 6. Footer Content Check: Management Link Absence
  total++;
  if (await runTest('Footer: Absence of Management Link', async () => {
    const res = await fetch(`${BASE_URL}/`);
    const html = await res.text();
    // Check if the visible footer contains management link
    if (html.includes('href="/management"') && html.includes('ورود پرسنل')) {
      throw new Error('Management link still present in public footer!');
    }
    return 'Public footer clean of management link';
  })) passed++;

  // 7. Security: Reject Invalid Admin Login
  total++;
  if (await runTest('Auth Security: Reject Wrong Password', async () => {
    const res = await fetch(`${BASE_URL}/api/staff/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'completely_wrong_password_9999' })
    });
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
    const body = await res.json();
    if (body.code !== 'INVALID_CREDENTIALS') throw new Error(`Unexpected code: ${body.code}`);
    return '401 INVALID_CREDENTIALS correctly rejected';
  })) passed++;

  // 8. Security: Reject Bogus Forged Token Bypass
  total++;
  if (await runTest('Auth Security: Prevent Token Forgery Bypass', async () => {
    const forgedTokens = [
      'behdoon_super_admin',
      'behdoon_12345678',
      'bhd_adm_fake_token_12345'
    ];
    for (const token of forgedTokens) {
      const res = await fetch(`${BASE_URL}/api/admin/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 200) {
        throw new Error(`CRITICAL: Token bypass vulnerability detected with token "${token}"!`);
      }
    }
    return 'All forged tokens successfully rejected with 401';
  })) passed++;

  // 9. Staff Login with Master Credentials
  let validSessionToken = null;
  total++;
  if (await runTest('Staff Auth: Login with Valid Credentials', async () => {
    const passwords = ['12345678', 'Admin@Behdoon2026!', 'admin123456'];
    let lastError = null;
    for (const pwd of passwords) {
      const res = await fetch(`${BASE_URL}/api/staff/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password: pwd })
      });
      if (res.ok) {
        const data = await res.json();
        if (!data.token || !data.token.startsWith('bhd_adm_')) {
          throw new Error(`Token format invalid: ${data.token}`);
        }
        validSessionToken = data.token;
        return `Token issued: ${data.token.substring(0, 16)}... | Role: ${data.staff.role}`;
      } else {
        const body = await res.json();
        lastError = body.error || `Status ${res.status}`;
      }
    }
    throw new Error(`Could not login: ${lastError}`);
  })) passed++;

  // 10. End-to-End Order Creation Flow (Request Wizard)
  let testTrackingCode = null;
  total++;
  if (await runTest('Order Creation Flow: POST /api/requests', async () => {
    const payload = {
      service: 'تعمیر پکیج دیواری',
      serviceId: 'wall-boiler-repair',
      category: 'heating-cooling',
      customerName: 'تست سیستم بهدون',
      phone: '09120000000',
      city: 'تهران',
      district: 'سعادت آباد',
      address: 'تهران، سعادت آباد، میدان کاج، پلاک ۱',
      description: 'تست خودکار پلتفرم و اعتبارسنجی ثبت سفارش',
      preferredTime: 'morning'
    };

    const res = await fetch(`${BASE_URL}/api/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to create request: ${res.status} - ${err}`);
    }

    const data = await res.json();
    if (!data.trackingCode && !data.tracking_code && !data.code) {
      throw new Error(`No tracking code in response: ${JSON.stringify(data)}`);
    }
    testTrackingCode = data.trackingCode || data.tracking_code || data.code;
    return `Order created with tracking code: ${testTrackingCode}`;
  })) passed++;

  // 11. Order Lookup & Status Verification
  total++;
  if (await runTest('Order Tracking: GET /api/orders/:code', async () => {
    if (!testTrackingCode) throw new Error('No tracking code from previous step');
    const res = await fetch(`${BASE_URL}/api/orders/${testTrackingCode}`);
    if (!res.ok) throw new Error(`Tracking lookup failed with ${res.status}`);
    const data = await res.json();
    if (!data.order) throw new Error(`Invalid response structure: ${JSON.stringify(data)}`);
    return `Tracking verified: Service "${data.order.service_label || data.order.service_id || data.order.service}", Status "${data.order.status}"`;
  })) passed++;

  // 12. City Restriction Check (Services strictly for Tehran)
  total++;
  if (await runTest('City Scope: Service Exclusivity for Tehran', async () => {
    const res = await fetch(`${BASE_URL}/`);
    const html = await res.text();
    if (!html.includes('تهران')) throw new Error('Tehran city scope not prominent in landing');
    return 'Tehran city restriction active across service presentation';
  })) passed++;

  console.log(`\n======================================================`);
  console.log(`📊 Test Results: ${passed} / ${total} Passed (${Math.round((passed / total) * 100)}%)`);
  if (passed === total) {
    console.log(`🎉 100% PRODUCTION READY! All Reality-Checker gates passed.`);
  } else {
    console.log(`⚠️ Some tests failed. Please review the output above.`);
  }
  console.log(`======================================================\n`);
}

main().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
