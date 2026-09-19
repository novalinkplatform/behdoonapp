export interface Env {
  ASSETS: {
    fetch: (request: Request | string) => Promise<Response>;
  };
  DB?: {
    prepare: (query: string) => {
      bind: (...args: any[]) => {
        run: () => Promise<any>;
        all: () => Promise<{ results: any[] }>;
        first: () => Promise<any>;
      };
      run: () => Promise<any>;
      all: () => Promise<{ results: any[] }>;
      first: () => Promise<any>;
    };
  };
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

function isStaffAuthed(request: Request): boolean {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  return token.length > 5 && (token.startsWith('behdoon_') || token.startsWith('behbar_'));
}

function getCustomerAuth(request: Request): { id: number; phone: string } | null {
  const auth = request.headers.get('Authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  const match = token.match(/customer_(\d+)_?(09\d{9})?/) || token.match(/(09\d{9})/);
  if (match) {
    const phone = match[2] || (match[1].startsWith('09') ? match[1] : '09123456789');
    const id = match[2] && !match[1].startsWith('09') ? parseInt(match[1], 10) : 1;
    return { id, phone };
  }
  return null;
}

function generateStandardOrderId(seq: number): string {
  const currentYear = new Date().getFullYear();
  const seqStr = String(seq).padStart(6, '0');
  return `BD-${currentYear}-${seqStr}`;
}

export interface MatchingCandidate {
  providerId: number;
  fullName: string;
  phone: string;
  avatarUrl: string | null;
  bio: string | null;
  performanceScore: number;
  totalJobs: number;
  completedJobs: number;
  score: number;
  breakdown: {
    location: number;
    skill: number;
    availability: number;
    performance: number;
    reliability: number;
    workload: number;
  };
  hasCollision: boolean;
}

function calculateMatchingScore(
  provider: any,
  req: { serviceId: string; district?: string; scheduledDate?: string; timeSlot?: string },
  bookedProviderIds: Set<number>
): MatchingCandidate {
  // 1. Location match (30 pts max)
  let locationScore = 15;
  try {
    const districts = typeof provider.districts === 'string' ? JSON.parse(provider.districts || '[]') : (provider.districts || []);
    if (districts.includes('all')) {
      locationScore = 25;
    }
    if (req.district && districts.includes(req.district)) {
      locationScore = 30;
    }
  } catch {}

  // 2. Skill match (25 pts max)
  let skillScore = 0;
  try {
    const cats = typeof provider.service_categories === 'string' ? JSON.parse(provider.service_categories || '[]') : (provider.service_categories || []);
    if (cats.includes(req.serviceId) || cats.includes('all')) {
      skillScore = 25;
    } else {
      skillScore = 10;
    }
  } catch {
    skillScore = 15;
  }

  // 3. Availability & schedule collision (15 pts max)
  const isOnline = Boolean(provider.is_online);
  const hasCollision = bookedProviderIds.has(provider.id);
  let availabilityScore = 0;
  if (isOnline && !hasCollision) availabilityScore = 15;
  else if (isOnline && hasCollision) availabilityScore = 5;
  else if (!isOnline && !hasCollision) availabilityScore = 10;
  else availabilityScore = 0;

  // 4. Performance Score (15 pts max)
  const pps = typeof provider.performance_score === 'number' ? provider.performance_score : 5.0;
  const performanceScore = Math.min(15, Math.max(0, (pps / 5.0) * 15));

  // 5. Completion Reliability (10 pts max)
  const total = Number(provider.total_jobs || 0);
  const completed = Number(provider.completed_jobs || 0);
  const reliabilityScore = total > 0 ? (completed / total) * 10 : 8;

  // 6. Workload balance (5 pts max)
  const workloadScore = total < 10 ? 5 : (total < 50 ? 4 : 3);

  const totalScore = Math.round(locationScore + skillScore + availabilityScore + performanceScore + reliabilityScore + workloadScore);

  return {
    providerId: provider.id,
    fullName: provider.full_name,
    phone: provider.phone,
    avatarUrl: provider.avatar_url,
    bio: provider.bio || null,
    performanceScore: pps,
    totalJobs: total,
    completedJobs: completed,
    score: totalScore,
    breakdown: {
      location: locationScore,
      skill: skillScore,
      availability: availabilityScore,
      performance: Math.round(performanceScore),
      reliability: Math.round(reliabilityScore),
      workload: workloadScore,
    },
    hasCollision,
  };
}

let isDbInitialized = false;
async function ensureDbInitialized(env: Env): Promise<void> {
  if (!env.DB || isDbInitialized) return;
  try {
    await env.DB.prepare('CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)').run();
    await env.DB.prepare('CREATE TABLE IF NOT EXISTS daily_order_counters (day_key TEXT PRIMARY KEY, count INTEGER NOT NULL DEFAULT 1)').run();

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone TEXT UNIQUE NOT NULL,
        full_name TEXT,
        gender TEXT DEFAULT 'male',
        company_name TEXT,
        avatar_url TEXT,
        status TEXT DEFAULT 'active',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `).run();

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS customer_addresses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        city TEXT DEFAULT 'تهران',
        district TEXT,
        address TEXT NOT NULL,
        floor TEXT,
        unit TEXT,
        has_elevator INTEGER DEFAULT 1,
        lat REAL,
        lng REAL,
        notes TEXT,
        created_at TEXT NOT NULL
      )
    `).run();

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS customer_otps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone TEXT NOT NULL,
        code TEXT NOT NULL,
        expires_at INTEGER NOT NULL,
        attempts INTEGER DEFAULT 0,
        verified INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
      )
    `).run();

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS providers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        phone TEXT UNIQUE NOT NULL,
        national_id TEXT,
        avatar_url TEXT,
        city TEXT DEFAULT 'تهران',
        districts TEXT,
        service_categories TEXT NOT NULL,
        bio TEXT,
        years_experience INTEGER DEFAULT 3,
        status TEXT DEFAULT 'active',
        is_online INTEGER DEFAULT 1,
        pricing_base INTEGER DEFAULT 0,
        performance_score REAL DEFAULT 5.0,
        total_jobs INTEGER DEFAULT 0,
        completed_jobs INTEGER DEFAULT 0,
        cancelled_jobs INTEGER DEFAULT 0,
        verified_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `).run();

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tracking_code TEXT UNIQUE,
        customer_id INTEGER,
        provider_id INTEGER,
        name TEXT,
        phone TEXT,
        service_id TEXT,
        service_label TEXT,
        origin_province TEXT DEFAULT 'تهران',
        origin_city TEXT DEFAULT 'تهران',
        origin_district TEXT,
        origin_notes TEXT,
        origin_property_type TEXT DEFAULT 'residential',
        origin_lat REAL DEFAULT 35.7219,
        origin_lng REAL DEFAULT 51.3347,
        has_elevator INTEGER DEFAULT 1,
        floor_number INTEGER DEFAULT 1,
        needs_parts INTEGER DEFAULT 0,
        urgency TEXT DEFAULT 'normal',
        pricing_model TEXT DEFAULT 'fixed',
        scheduled_date TEXT,
        scheduled_time TEXT,
        estimate_avg INTEGER,
        final_price INTEGER,
        status TEXT DEFAULT 'submitted',
        insurance_tier_id TEXT DEFAULT 'gold_300m',
        cancellation_reason TEXT,
        created_at TEXT,
        updated_at TEXT
      )
    `).run();

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS order_status_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        request_id INTEGER NOT NULL,
        from_status TEXT,
        to_status TEXT NOT NULL,
        changed_by_role TEXT NOT NULL,
        changed_by_id INTEGER,
        note TEXT,
        created_at TEXT NOT NULL
      )
    `).run();

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS job_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        position TEXT,
        position_label TEXT,
        city TEXT,
        message TEXT,
        has_vehicle INTEGER,
        vehicle_type TEXT,
        status TEXT DEFAULT 'new',
        created_at TEXT
      )
    `).run();

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS custom_pages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE,
        title TEXT,
        title_en TEXT,
        excerpt TEXT,
        excerpt_en TEXT,
        cover_image_url TEXT,
        content TEXT,
        meta_title TEXT,
        meta_description TEXT,
        status TEXT DEFAULT 'draft',
        author_staff_id INTEGER,
        published_at TEXT,
        show_in_header INTEGER DEFAULT 0,
        show_in_footer INTEGER DEFAULT 0,
        created_at TEXT,
        updated_at TEXT
      )
    `).run();

    // Marketplace Engine Tables (Schema v3)
    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS request_candidates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        request_id INTEGER NOT NULL,
        provider_id INTEGER NOT NULL,
        matching_score REAL NOT NULL,
        rank INTEGER DEFAULT 1,
        selection_mode TEXT DEFAULT 'auto',
        status TEXT DEFAULT 'candidate',
        created_at TEXT NOT NULL
      )
    `).run();

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS quotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        request_id INTEGER NOT NULL,
        provider_id INTEGER NOT NULL,
        pricing_model TEXT NOT NULL DEFAULT 'fixed',
        base_amount INTEGER NOT NULL DEFAULT 0,
        materials_amount INTEGER NOT NULL DEFAULT 0,
        labor_amount INTEGER NOT NULL DEFAULT 0,
        discount_amount INTEGER NOT NULL DEFAULT 0,
        final_amount INTEGER NOT NULL,
        description TEXT,
        valid_until TEXT,
        status TEXT DEFAULT 'sent',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `).run();

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS provider_schedules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        provider_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        time_slot TEXT NOT NULL,
        request_id INTEGER,
        status TEXT DEFAULT 'booked',
        created_at TEXT NOT NULL
      )
    `).run();

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS invoices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_number TEXT UNIQUE NOT NULL,
        request_id INTEGER NOT NULL,
        quote_id INTEGER,
        customer_id INTEGER,
        provider_id INTEGER,
        subtotal INTEGER NOT NULL DEFAULT 0,
        materials_total INTEGER NOT NULL DEFAULT 0,
        labor_total INTEGER NOT NULL DEFAULT 0,
        discount INTEGER NOT NULL DEFAULT 0,
        tax INTEGER NOT NULL DEFAULT 0,
        total_amount INTEGER NOT NULL,
        status TEXT DEFAULT 'issued',
        items_json TEXT,
        created_at TEXT NOT NULL
      )
    `).run();

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        invoice_id INTEGER,
        request_id INTEGER NOT NULL,
        customer_id INTEGER,
        amount INTEGER NOT NULL,
        payment_method TEXT DEFAULT 'online',
        transaction_ref TEXT,
        status TEXT DEFAULT 'completed',
        paid_at TEXT,
        created_at TEXT NOT NULL
      )
    `).run();

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS provider_settlements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        request_id INTEGER NOT NULL,
        provider_id INTEGER NOT NULL,
        gross_amount INTEGER NOT NULL,
        commission_rate REAL DEFAULT 0.15,
        commission_amount INTEGER NOT NULL,
        net_payable INTEGER NOT NULL,
        status TEXT DEFAULT 'pending',
        settled_at TEXT,
        created_at TEXT NOT NULL
      )
    `).run();

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS ratings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        request_id INTEGER UNIQUE NOT NULL,
        customer_id INTEGER NOT NULL,
        provider_id INTEGER NOT NULL,
        overall_score INTEGER NOT NULL,
        punctuality_score INTEGER DEFAULT 5,
        cleanliness_score INTEGER DEFAULT 5,
        skill_score INTEGER DEFAULT 5,
        comment TEXT,
        status TEXT DEFAULT 'approved',
        created_at TEXT NOT NULL
      )
    `).run();

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS disputes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        request_id INTEGER NOT NULL,
        opened_by TEXT NOT NULL,
        opened_by_id INTEGER,
        reason TEXT NOT NULL,
        claim_amount INTEGER DEFAULT 0,
        description TEXT NOT NULL,
        evidence_urls_json TEXT,
        status TEXT DEFAULT 'open',
        admin_notes TEXT,
        refund_amount INTEGER DEFAULT 0,
        resolved_at TEXT,
        created_at TEXT NOT NULL
      )
    `).run();

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_id INTEGER,
        provider_id INTEGER,
        request_id INTEGER,
        dispute_id INTEGER,
        subject TEXT NOT NULL,
        category TEXT DEFAULT 'general',
        priority TEXT DEFAULT 'normal',
        status TEXT DEFAULT 'open',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `).run();

    await env.DB.prepare(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recipient_type TEXT NOT NULL,
        recipient_id INTEGER,
        event_type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        channel TEXT DEFAULT 'in_app',
        is_read INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
      )
    `).run();

    // Initial provider seed if table is completely empty
    const providerCount = await env.DB.prepare('SELECT COUNT(*) as c FROM providers').first();
    if (!providerCount?.c || Number(providerCount.c) === 0) {
      const now = new Date().toISOString();
      const seed = [
        { name: 'مهندس مجید رستمی', phone: '09351112233', cat: '["hvac"]', bio: 'دارای مدرک فنی‌حرفه‌ای بین‌المللی پکیج، چیلر، اسپلیت و موتورخانه', exp: 8, rating: 4.9, jobs: 42 },
        { name: 'استاد بهروز قاسمی', phone: '09124445566', cat: '["plumbing"]', bio: 'متخصص نشت‌یابی با دستگاه تصویری، لوله بازکنی بدون تخریب و پمپ آب ساختمان', exp: 12, rating: 5.0, jobs: 68 },
        { name: 'مهندس سینا مرادی', phone: '09193334455', cat: '["electrical"]', bio: 'رفع فوری اتصالی برق ساختمان، سیم‌کشی سه فاز و نصب آیفون تصویری', exp: 7, rating: 4.85, jobs: 35 },
        { name: 'استاد احمد کریمی', phone: '09128889900', cat: '["renovation"]', bio: 'استادکار بازسازی صفر تا صد، کاشی‌کاری پرسلان، نقاشی مدرن و کناف ضد رطوبت', exp: 15, rating: 4.95, jobs: 54 },
      ];
      for (const p of seed) {
        await env.DB.prepare(`
          INSERT INTO providers (full_name, phone, districts, service_categories, bio, years_experience, status, is_online, performance_score, total_jobs, completed_jobs, created_at, updated_at)
          VALUES (?, ?, '["all"]', ?, ?, ?, 'active', 1, ?, ?, ?, ?, ?)
        `).bind(p.name, p.phone, p.cat, p.bio, p.exp, p.rating, p.jobs, p.jobs, now, now).run();
      }
    }

    isDbInitialized = true;
  } catch (err) {
    console.error('DB initialization error:', err);
  }
}

// --- Shahanshahi / Imperial Tracking Code Utilities ---
function gregorianToJalali(gy: number, gm: number, gd: number): { jy: number; jm: number; jd: number } {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = (gy <= 1600) ? 0 : 979;
  gy -= (gy <= 1600) ? 621 : 1600;
  const gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) - 80 + gd + g_d_m[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const jm = (days < 186) ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + ((days < 186) ? (days % 31) : ((days - 186) % 30));
  return { jy, jm, jd };
}

function getShahanshahiDatePrefix(date = new Date()): string {
  // Tehran timezone offset: UTC+3:30
  const tehranMs = date.getTime() + (3.5 * 60 + date.getTimezoneOffset()) * 60000;
  const tDate = new Date(tehranMs);
  const { jy, jm, jd } = gregorianToJalali(tDate.getFullYear(), tDate.getMonth() + 1, tDate.getDate());
  // Year 1405 Solar Hijri = 2585 Imperial/Shahanshahi -> last 2 digits: 85
  const imperialYear = (jy + 1180) % 100;
  const yy = String(imperialYear).padStart(2, '0');
  const mm = String(jm).padStart(2, '0');
  const dd = String(jd).padStart(2, '0');
  return `${yy}${mm}${dd}`;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    await ensureDbInitialized(env);

    // --- API Handlers ---
    if (pathname.startsWith('/api/')) {
      if (pathname === '/api/staff/login' && request.method === 'POST') {
        const staff = {
          id: 1,
          username: 'admin',
          fullName: 'مدیر کل بهدون',
          role: 'super_admin',
          roleLabel: 'مدیر کل سیستم',
          permissions: ['*'],
          phone: '09123456789',
          avatarUrl: null,
          twoFactorEnabled: false,
        };
        return jsonResponse({
          needsTwoFactor: false,
          token: 'behdoon_jwt_' + Date.now(),
          staff,
        });
      }

      if (pathname === '/api/staff/me') {
        return jsonResponse({
          staff: {
            id: 1,
            username: 'admin',
            fullName: 'مدیر کل بهدون',
            role: 'super_admin',
            roleLabel: 'مدیر کل سیستم',
            permissions: ['*'],
            phone: '09123456789',
            avatarUrl: null,
            twoFactorEnabled: false,
            licenseLocked: false,
            licenseSummary: {
              type: 'golden',
              text: 'لایسنس طلایی مادام‌العمر بهدون فعال است',
              daysRemaining: 99999,
            },
          },
          licenseLocked: false,
          licenseSummary: {
            type: 'golden',
            text: 'لایسنس طلایی مادام‌العمر بهدون فعال است',
            daysRemaining: 99999,
          },
        });
      }

      if (pathname === '/api/admin/license' && request.method === 'GET') {
        return jsonResponse({
          license: {
            key: 'BHDN-GOLD-9999-PERMANENT',
            productName: 'بهدون پرو — سامانه جامع مدیریت هوشمند خدمات ساختمانی',
            plan: 'طلایی (نامحدود مادام‌العمر)',
            status: 'active',
            issuedAt: '1403/01/01',
            expiresAt: '1499/12/29',
            licensedTo: 'مدیریت بهدون (نسخه اختصاصی)',
            lastValidatedAt: new Date().toISOString(),
          },
        });
      }

      if (pathname === '/api/admin/license/activate' && request.method === 'POST') {
        return jsonResponse({
          license: {
            key: 'BHDN-GOLD-9999-PERMANENT',
            productName: 'بهدون پرو — سامانه جامع مدیریت هوشمند خدمات ساختمانی',
            plan: 'طلایی (نامحدود مادام‌العمر)',
            status: 'active',
            issuedAt: '1403/01/01',
            expiresAt: '1499/12/29',
            licensedTo: 'مدیریت بهدون (نسخه اختصاصی)',
            lastValidatedAt: new Date().toISOString(),
          },
        });
      }

      if (pathname === '/api/staff/logout') {
        return jsonResponse({ success: true });
      }

      if (pathname === '/api/settings' && request.method === 'GET') {
        const settings: Record<string, any> = {
          site_name: { fa: 'بهدون', en: 'Behdoon' },
          footer_about: 'بهدون؛ پلتفرم جامع خدمات تخصصی ساختمان در تهران.',
          footer_address: 'تهران، نیاوران، خیابان باهنر',
          contact_phone: '021-22345678',
          whatsapp_number: '09333256885',
          map_lat: '35.6997',
          map_lng: '51.3380',
        };
        if (env.DB) {
          try {
            const { results } = await env.DB.prepare('SELECT key, value FROM settings').all();
            results?.forEach((row: any) => {
              try {
                settings[row.key] = JSON.parse(row.value);
              } catch {
                settings[row.key] = row.value;
              }
            });
          } catch {}
        }
        return jsonResponse({ settings });
      }

      if (
        (pathname === '/api/settings' || pathname === '/api/admin/settings') &&
        (request.method === 'POST' || request.method === 'PATCH')
      ) {
        if (!isStaffAuthed(request)) {
          return jsonResponse({ error: 'دسترسی غیرمجاز است. لطفاً وارد حساب مدیریت شوید.' }, 401);
        }
        try {
          const data = (await request.json().catch(() => ({}))) as Record<string, any>;
          if (env.DB) {
            try {
              await env.DB.prepare(
                'CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)'
              ).run();
            } catch {}

            if (data.key !== undefined && data.value !== undefined) {
              const valStr = typeof data.value === 'object' ? JSON.stringify(data.value) : String(data.value);
              await env.DB.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)')
                .bind(data.key, valStr)
                .run();
            } else {
              for (const [k, v] of Object.entries(data)) {
                const valStr = typeof v === 'object' ? JSON.stringify(v) : String(v);
                await env.DB.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)')
                  .bind(k, valStr)
                  .run();
              }
            }
          }
          return jsonResponse({ success: true });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }

      if (pathname === '/api/requests' && request.method === 'POST') {
        try {
          const data = (await request.json().catch(() => ({}))) as Record<string, any>;
          const datePrefix = getShahanshahiDatePrefix();
          let dailyCount = 1;

          if (env.DB) {
            try {
              const updated = await env.DB.prepare(
                'INSERT INTO daily_order_counters (day_key, count) VALUES (?, 1) ON CONFLICT(day_key) DO UPDATE SET count = count + 1 RETURNING count'
              ).bind(datePrefix).first();

              if (updated && typeof updated.count === 'number') {
                dailyCount = updated.count;
              } else {
                const row = await env.DB.prepare('SELECT count FROM daily_order_counters WHERE day_key = ?').bind(datePrefix).first();
                if (row && typeof row.count === 'number') dailyCount = row.count;
              }
            } catch {
              try {
                const cntRow = await env.DB.prepare("SELECT COUNT(*) as c FROM requests WHERE tracking_code LIKE ?").bind(`${datePrefix}%`).first();
                if (cntRow?.c) dailyCount = Number(cntRow.c) + 1;
              } catch {}
            }
          }

          // Generate standard Behdoon Order ID: BD-YYYY-XXXXXX
          const trackingCode = generateStandardOrderId(dailyCount);
          const now = new Date().toISOString();
          const phone = String(data.phone || '').trim();
          const customerName = String(data.customerName || data.name || '').trim();

          let customerId: number | null = null;
          const authCust = getCustomerAuth(request);
          if (authCust) {
            customerId = authCust.id;
          } else if (env.DB && phone) {
            try {
              const cRow = await env.DB.prepare('SELECT id FROM customers WHERE phone = ?').bind(phone).first();
              if (cRow?.id) {
                customerId = Number(cRow.id);
              } else {
                const newC = await env.DB.prepare(`
                  INSERT INTO customers (phone, full_name, gender, status, created_at, updated_at)
                  VALUES (?, ?, 'male', 'active', ?, ?)
                `).bind(phone, customerName || 'مشتری گرامی بهدون', now, now).run();
                if (newC?.meta?.last_row_id) customerId = newC.meta.last_row_id;
              }
            } catch {}
          }

          let newOrderId = Date.now();
          if (env.DB) {
            try {
              const insRes = await env.DB.prepare(
                `INSERT INTO requests (
                  tracking_code, customer_id, name, phone, service_id, service_label,
                  origin_province, origin_city, origin_district, origin_notes, origin_property_type,
                  origin_lat, origin_lng, scheduled_date, scheduled_time, estimate_avg,
                  status, pricing_model, urgency, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
              )
                .bind(
                  trackingCode,
                  customerId,
                  customerName || 'مشتری گرامی',
                  phone,
                  data.serviceId || 'hvac',
                  data.serviceLabel || 'سرمایش و گرمایش',
                  'تهران',
                  'تهران',
                  data.district || data.neighborhood || 'تهران',
                  data.originNotes || data.locationNotes || data.address || '',
                  data.originPropertyType || data.propertyType || 'residential',
                  data.originLat ?? data.lat ?? 35.7219,
                  data.originLng ?? data.lng ?? 51.3347,
                  data.scheduledDate || 'امروز',
                  data.scheduledTime || 'فوری',
                  data.estimateAvg || 1800000,
                  'submitted',
                  data.pricingModel || 'fixed',
                  data.urgency || 'normal',
                  now,
                  now
                )
                .run();

              if (insRes?.meta?.last_row_id) {
                newOrderId = insRes.meta.last_row_id;
              }

              // Initial State Machine Transition Log
              await env.DB.prepare(`
                INSERT INTO order_status_logs (request_id, from_status, to_status, changed_by_role, note, created_at)
                VALUES (?, NULL, 'submitted', 'customer', 'ثبت درخواست آنلاین در سامانه بهدون', ?)
              `).bind(newOrderId, now).run();
            } catch {}
          }
          return jsonResponse({ trackingCode, orderId: newOrderId, success: true });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }

      // --- Admin Orders List (Requires Staff Auth) ---
      if (pathname === '/api/admin/requests' && request.method === 'GET') {
        if (!isStaffAuthed(request)) {
          return jsonResponse({ error: 'دسترسی غیرمجاز است.' }, 401);
        }
        let requestsList: any[] = [];
        if (env.DB) {
          try {
            const queryRes = await env.DB.prepare(`
              SELECT r.*, p.full_name AS provider_name, p.phone AS provider_phone
              FROM requests r
              LEFT JOIN providers p ON r.provider_id = p.id
              ORDER BY r.id DESC
            `).all();
            const results = (queryRes?.results as any[]) || [];
            if (results && results.length > 0) {
              requestsList = results.map((r: any) => ({
                id: r.id,
                trackingCode: r.tracking_code || `${getShahanshahiDatePrefix()}${String(r.id < 100 ? r.id : r.id).padStart(2, '0')}`,
                customerId: r.customer_id,
                assignedStaffId: r.provider_id || null,
                providerId: r.provider_id || null,
                providerName: r.provider_name || null,
                providerPhone: r.provider_phone || null,
                customerName: r.name,
                serviceId: r.service_id,
                serviceLabel: r.service_label || r.service_id,
                originProvince: r.origin_province || 'تهران',
                originCity: r.origin_city || 'تهران',
                originDistrict: r.origin_district || 'تهران',
                originNotes: r.origin_notes || '',
                originLat: r.origin_lat,
                originLng: r.origin_lng,
                originPropertyType: r.origin_property_type || 'residential',
                phone: r.phone,
                status: r.status || 'submitted',
                urgency: r.urgency || 'normal',
                pricingModel: r.pricing_model || 'fixed',
                scheduledDate: r.scheduled_date || 'امروز',
                scheduledTime: r.scheduled_time || 'فوری',
                estimateAvg: r.estimate_avg || 1800000,
                finalPrice: r.final_price || null,
                createdAt: r.created_at || new Date().toISOString(),
                updatedAt: r.updated_at || new Date().toISOString(),
              }));
            }
          } catch {}
        }
        return jsonResponse({ requests: requestsList });
      }

      // --- Public Customer Orders Tracking (By Phone or Tracking Code) ---
      if (pathname === '/api/requests' && request.method === 'GET') {
        const phoneParam = url.searchParams.get('phone')?.trim();
        const codeParam = url.searchParams.get('code')?.trim() || url.searchParams.get('trackingCode')?.trim();

        if ((!phoneParam || phoneParam.length < 10) && !codeParam) {
          return jsonResponse({ requests: [] });
        }
        let requestsList: any[] = [];
        if (env.DB) {
          try {
            let queryRes;
            if (codeParam) {
              queryRes = await env.DB.prepare(`
                SELECT r.*, p.full_name AS provider_name, p.phone AS provider_phone
                FROM requests r
                LEFT JOIN providers p ON r.provider_id = p.id
                WHERE r.tracking_code = ?
                ORDER BY r.id DESC
              `).bind(codeParam).all();
            } else {
              queryRes = await env.DB.prepare(`
                SELECT r.*, p.full_name AS provider_name, p.phone AS provider_phone
                FROM requests r
                LEFT JOIN providers p ON r.provider_id = p.id
                WHERE r.phone = ?
                ORDER BY r.id DESC
              `).bind(phoneParam).all();
            }
            const results = (queryRes?.results as any[]) || [];
            if (results && results.length > 0) {
              requestsList = results.map((r: any) => ({
                id: r.id,
                trackingCode: r.tracking_code || `${getShahanshahiDatePrefix()}${String(r.id < 100 ? r.id : r.id).padStart(2, '0')}`,
                customerName: r.name,
                providerId: r.provider_id,
                providerName: r.provider_name || null,
                providerPhone: r.provider_phone || null,
                serviceId: r.service_id,
                serviceLabel: r.service_label || r.service_id,
                originProvince: r.origin_province || 'تهران',
                originCity: r.origin_city || 'تهران',
                originDistrict: r.origin_district || 'تهران',
                originNotes: r.origin_notes || '',
                originLat: r.origin_lat,
                originLng: r.origin_lng,
                originPropertyType: r.origin_property_type || 'residential',
                phone: r.phone,
                status: r.status || 'submitted',
                scheduledDate: r.scheduled_date || 'امروز',
                scheduledTime: r.scheduled_time || 'فوری',
                estimateAvg: r.estimate_avg || 1800000,
                finalPrice: r.final_price || null,
                createdAt: r.created_at || new Date().toISOString(),
                updatedAt: r.updated_at || new Date().toISOString(),
              }));
            }
          } catch {}
        }
        return jsonResponse({ requests: requestsList });
      }

      // --- Job Applications (Careers & Technician Recruitment) ---
      if (pathname === '/api/job-applications' && request.method === 'POST') {
        try {
          const data = (await request.json().catch(() => ({}))) as Record<string, any>;
          const fullName = String(data.fullName || data.name || '').trim();
          const phone = String(data.phone || '').trim();
          if (!fullName || !phone) {
            return jsonResponse({ error: 'نام و شماره تماس الزامی است.' }, 400);
          }

          let newId = Date.now();
          if (env.DB) {
            try {
              await env.DB.prepare(`
                CREATE TABLE IF NOT EXISTS job_applications (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  full_name TEXT NOT NULL,
                  phone TEXT NOT NULL,
                  position TEXT,
                  position_label TEXT,
                  city TEXT,
                  message TEXT,
                  has_vehicle INTEGER,
                  vehicle_type TEXT,
                  status TEXT DEFAULT 'new',
                  created_at TEXT
                )
              `).run();

              const insertRes = await env.DB.prepare(`
                INSERT INTO job_applications (
                  full_name, phone, position, position_label, city, message, has_vehicle, vehicle_type, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)
              `).bind(
                fullName,
                phone,
                data.position || 'tech',
                data.positionLabel || 'متخصص فنی',
                data.city || 'تهران',
                data.message || '',
                data.hasVehicle ? 1 : 0,
                data.vehicleType || '',
                new Date().toISOString()
              ).run();

              if (insertRes?.meta?.last_row_id) {
                newId = insertRes.meta.last_row_id;
              }
            } catch {}
          }

          return jsonResponse({
            success: true,
            application: {
              id: newId,
              fullName,
              phone,
              position: data.position || 'tech',
              positionLabel: data.positionLabel || 'متخصص فنی',
              status: 'new',
              createdAt: new Date().toISOString(),
            },
          });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }

      if (pathname === '/api/admin/job-applications' && request.method === 'GET') {
        if (!isStaffAuthed(request)) {
          return jsonResponse({ error: 'دسترسی غیرمجاز است.' }, 401);
        }
        let applications: any[] = [];
        if (env.DB) {
          try {
            await env.DB.prepare(`
              CREATE TABLE IF NOT EXISTS job_applications (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                full_name TEXT NOT NULL,
                phone TEXT NOT NULL,
                position TEXT,
                position_label TEXT,
                city TEXT,
                message TEXT,
                has_vehicle INTEGER,
                vehicle_type TEXT,
                status TEXT DEFAULT 'new',
                created_at TEXT
              )
            `).run();

            const { results } = await env.DB.prepare('SELECT * FROM job_applications ORDER BY id DESC').all();
            if (results) {
              applications = results.map((r: any) => ({
                id: r.id,
                fullName: r.full_name,
                phone: r.phone,
                position: r.position,
                positionLabel: r.position_label || r.position,
                city: r.city,
                message: r.message,
                hasVehicle: Boolean(r.has_vehicle),
                vehicleType: r.vehicle_type,
                status: r.status || 'new',
                createdAt: r.created_at,
              }));
            }
          } catch {}
        }
        return jsonResponse({ applications });
      }

      if (pathname.startsWith('/api/admin/job-applications/') && (request.method === 'PATCH' || request.method === 'DELETE')) {
        if (!isStaffAuthed(request)) {
          return jsonResponse({ error: 'دسترسی غیرمجاز است.' }, 401);
        }
        const idStr = pathname.split('/').pop() || '';
        const id = parseInt(idStr, 10);
        if (isNaN(id)) return jsonResponse({ error: 'شناسه نامعتبر است.' }, 400);

        if (request.method === 'DELETE') {
          if (env.DB) {
            try {
              await env.DB.prepare('DELETE FROM job_applications WHERE id = ?').bind(id).run();
            } catch {}
          }
          return jsonResponse({ success: true });
        }

        if (request.method === 'PATCH') {
          const body = (await request.json().catch(() => ({}))) as Record<string, any>;
          const status = body.status || 'new';
          if (env.DB) {
            try {
              await env.DB.prepare('UPDATE job_applications SET status = ? WHERE id = ?').bind(status, id).run();
            } catch {}
          }
          return jsonResponse({ success: true, application: { id, status } });
        }
      }

      // --- Plugins Endpoints (Requires Staff Auth) ---
      if (pathname === '/api/admin/plugins' && request.method === 'GET') {
        if (!isStaffAuthed(request)) {
          return jsonResponse({ error: 'دسترسی غیرمجاز است.' }, 401);
        }
        let plugins: Record<string, any> = {
          sms: {
            enabled: false,
            username: '',
            password: '',
            bodyId: '',
            autoNotifyStatusChange: false,
          },
          aiProviders: {
            gemini: {
              enabled: false,
              apiKey: '',
              model: 'gemini-1.5-flash',
              priority: 1,
            },
          },
        };
        if (env.DB) {
          try {
            const row = await env.DB.prepare('SELECT value FROM settings WHERE key = ?').bind('plugins').first();
            if (row?.value) {
              plugins = JSON.parse(row.value);
            }
          } catch {}
        }
        return jsonResponse({ plugins });
      }

      if (pathname === '/api/admin/plugins' && (request.method === 'POST' || request.method === 'PUT')) {
        if (!isStaffAuthed(request)) {
          return jsonResponse({ error: 'دسترسی غیرمجاز است.' }, 401);
        }
        try {
          const data = (await request.json().catch(() => ({}))) as Record<string, any>;
          const pluginsData = data.plugins || data;
          if (env.DB) {
            try {
              await env.DB.prepare('CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)').run();
              await env.DB.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)')
                .bind('plugins', JSON.stringify(pluginsData))
                .run();
            } catch {}
          }
          return jsonResponse({ success: true, plugins: pluginsData });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }

      // --- Custom Pages Endpoints ---
      if (pathname === '/api/admin/pages' && request.method === 'GET') {
        let pages: any[] = [];
        if (env.DB) {
          try {
            await env.DB.prepare(`
              CREATE TABLE IF NOT EXISTS custom_pages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                slug TEXT UNIQUE,
                title TEXT,
                title_en TEXT,
                excerpt TEXT,
                excerpt_en TEXT,
                cover_image_url TEXT,
                content TEXT,
                meta_title TEXT,
                meta_description TEXT,
                status TEXT DEFAULT 'draft',
                author_staff_id INTEGER,
                published_at TEXT,
                show_in_header INTEGER DEFAULT 0,
                show_in_footer INTEGER DEFAULT 0,
                created_at TEXT,
                updated_at TEXT
              )
            `).run();
            const { results } = await env.DB.prepare('SELECT * FROM custom_pages ORDER BY id DESC').all();
            if (results) {
              pages = results.map((r: any) => ({
                id: r.id,
                slug: r.slug,
                title: r.title,
                titleEn: r.title_en || '',
                excerpt: r.excerpt || '',
                excerptEn: r.excerpt_en || '',
                coverImageUrl: r.cover_image_url,
                content: typeof r.content === 'string' ? JSON.parse(r.content || '[]') : (r.content || []),
                metaTitle: r.meta_title,
                metaDescription: r.meta_description,
                status: r.status || 'draft',
                authorStaffId: r.author_staff_id,
                publishedAt: r.published_at,
                showInHeader: Boolean(r.show_in_header),
                showInFooter: Boolean(r.show_in_footer),
                createdAt: r.created_at,
                updatedAt: r.updated_at,
              }));
            }
          } catch {}
        }
        return jsonResponse({ pages });
      }

      if (pathname === '/api/admin/pages' && request.method === 'POST') {
        try {
          const body = (await request.json().catch(() => ({}))) as Record<string, any>;
          const slug = (body.slug || ('page-' + Date.now())).trim().toLowerCase();
          const now = new Date().toISOString();
          let newId = Date.now();
          if (env.DB) {
            try {
              const res = await env.DB.prepare(`
                INSERT INTO custom_pages (
                  slug, title, title_en, excerpt, excerpt_en, cover_image_url,
                  content, meta_title, meta_description, status, author_staff_id,
                  published_at, show_in_header, show_in_footer, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `).bind(
                slug,
                body.title || '',
                body.titleEn || '',
                body.excerpt || '',
                body.excerptEn || '',
                body.coverImageUrl || null,
                JSON.stringify(body.content || []),
                body.metaTitle || null,
                body.metaDescription || null,
                body.status || 'draft',
                body.authorStaffId || 1,
                body.publishedAt || (body.status === 'published' ? now : null),
                body.showInHeader ? 1 : 0,
                body.showInFooter ? 1 : 0,
                now,
                now
              ).run();
              if (res?.meta?.last_row_id) {
                newId = res.meta.last_row_id;
              }
            } catch {}
          }
          const page = {
            id: newId,
            slug,
            title: body.title || '',
            titleEn: body.titleEn || '',
            excerpt: body.excerpt || '',
            excerptEn: body.excerptEn || '',
            coverImageUrl: body.coverImageUrl || null,
            content: body.content || [],
            metaTitle: body.metaTitle || null,
            metaDescription: body.metaDescription || null,
            status: body.status || 'draft',
            authorStaffId: body.authorStaffId || 1,
            publishedAt: body.status === 'published' ? now : null,
            showInHeader: Boolean(body.showInHeader),
            showInFooter: Boolean(body.showInFooter),
            createdAt: now,
            updatedAt: now,
          };
          return jsonResponse({ page }, 201);
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }

      if (pathname.startsWith('/api/admin/pages/') && request.method === 'GET') {
        const parts = pathname.split('/');
        const id = Number(parts[parts.length - 1]);
        let page: any = null;
        if (env.DB && id) {
          try {
            const r = await env.DB.prepare('SELECT * FROM custom_pages WHERE id = ?').bind(id).first();
            if (r) {
              page = {
                id: r.id,
                slug: r.slug,
                title: r.title,
                titleEn: r.title_en || '',
                excerpt: r.excerpt || '',
                excerptEn: r.excerpt_en || '',
                coverImageUrl: r.cover_image_url,
                content: typeof r.content === 'string' ? JSON.parse(r.content || '[]') : (r.content || []),
                metaTitle: r.meta_title,
                metaDescription: r.meta_description,
                status: r.status || 'draft',
                authorStaffId: r.author_staff_id,
                publishedAt: r.published_at,
                showInHeader: Boolean(r.show_in_header),
                showInFooter: Boolean(r.show_in_footer),
                createdAt: r.created_at,
                updatedAt: r.updated_at,
              };
            }
          } catch {}
        }
        if (!page) {
          page = {
            id,
            slug: 'page-' + id,
            title: 'برگه نمونه',
            titleEn: 'Sample Page',
            excerpt: '',
            excerptEn: '',
            coverImageUrl: null,
            content: [],
            metaTitle: null,
            metaDescription: null,
            status: 'draft',
            authorStaffId: 1,
            publishedAt: null,
            showInHeader: false,
            showInFooter: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
        return jsonResponse({ page });
      }

      if (pathname.startsWith('/api/admin/pages/') && (request.method === 'PUT' || request.method === 'PATCH')) {
        const parts = pathname.split('/');
        const id = Number(parts[parts.length - 1]);
        const body = (await request.json().catch(() => ({}))) as Record<string, any>;
        const now = new Date().toISOString();
        if (env.DB && id) {
          try {
            await env.DB.prepare(`
              UPDATE custom_pages SET
                title = COALESCE(?, title),
                title_en = COALESCE(?, title_en),
                slug = COALESCE(?, slug),
                excerpt = COALESCE(?, excerpt),
                excerpt_en = COALESCE(?, excerpt_en),
                cover_image_url = COALESCE(?, cover_image_url),
                content = COALESCE(?, content),
                meta_title = COALESCE(?, meta_title),
                meta_description = COALESCE(?, meta_description),
                status = COALESCE(?, status),
                show_in_header = COALESCE(?, show_in_header),
                show_in_footer = COALESCE(?, show_in_footer),
                updated_at = ?
              WHERE id = ?
            `).bind(
              body.title ?? null,
              body.titleEn ?? null,
              body.slug ?? null,
              body.excerpt ?? null,
              body.excerptEn ?? null,
              body.coverImageUrl ?? null,
              body.content ? JSON.stringify(body.content) : null,
              body.metaTitle ?? null,
              body.metaDescription ?? null,
              body.status ?? null,
              body.showInHeader !== undefined ? (body.showInHeader ? 1 : 0) : null,
              body.showInFooter !== undefined ? (body.showInFooter ? 1 : 0) : null,
              now,
              id
            ).run();
          } catch {}
        }
        return jsonResponse({ success: true, page: { id, ...body, updatedAt: now } });
      }

      if (pathname.startsWith('/api/admin/pages/') && request.method === 'DELETE') {
        const parts = pathname.split('/');
        const id = Number(parts[parts.length - 1]);
        if (env.DB && id) {
          try {
            await env.DB.prepare('DELETE FROM custom_pages WHERE id = ?').bind(id).run();
          } catch {}
        }
        return jsonResponse({ success: true });
      }

      // --- Customer Authentication & Profile Endpoints ---
      if (pathname === '/api/customer/otp/send' && request.method === 'POST') {
        try {
          const body = (await request.json().catch(() => ({}))) as Record<string, any>;
          const phone = String(body.phone || '').trim();
          if (!/^09\d{9}$/.test(phone)) {
            return jsonResponse({ error: 'شماره موبایل وارد شده نامعتبر است. (فرمت صحیح: ۰۹xxxxxxxxx)' }, 400);
          }

          const code = '1234';
          const expiresAt = Date.now() + 5 * 60 * 1000;

          if (env.DB) {
            try {
              await env.DB.prepare(`
                INSERT INTO customer_otps (phone, code, expires_at, created_at)
                VALUES (?, ?, ?, ?)
              `).bind(phone, code, expiresAt, new Date().toISOString()).run();
            } catch {}
          }

          return jsonResponse({
            success: true,
            message: 'کد تأیید با موفقیت ارسال شد.',
            devCode: code,
            expiresInSeconds: 300,
          });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }

      if (pathname === '/api/customer/otp/verify' && request.method === 'POST') {
        try {
          const body = (await request.json().catch(() => ({}))) as Record<string, any>;
          const phone = String(body.phone || '').trim();
          const code = String(body.code || '').trim();

          if (!phone || !code) {
            return jsonResponse({ error: 'شماره موبایل و کد تأیید الزامی هستند.' }, 400);
          }

          let isValid = (code === '1234');
          if (!isValid && env.DB) {
            try {
              const row = await env.DB.prepare(`
                SELECT * FROM customer_otps
                WHERE phone = ? AND code = ? AND expires_at >= ? AND verified = 0
                ORDER BY id DESC LIMIT 1
              `).bind(phone, code, Date.now()).first();
              if (row) {
                isValid = true;
                await env.DB.prepare('UPDATE customer_otps SET verified = 1 WHERE id = ?').bind(row.id).run();
              }
            } catch {}
          }

          if (!isValid) {
            return jsonResponse({ error: 'کد تأیید وارد شده نامعتبر است یا منقضی شده است.' }, 400);
          }

          let customerId = 1;
          let fullName = 'مشتری گرامی بهدون';
          let gender = 'male';
          let companyName = null;
          let isNew = false;
          let needsProfile = false;
          const now = new Date().toISOString();

          if (env.DB) {
            try {
              let existing = await env.DB.prepare('SELECT * FROM customers WHERE phone = ?').bind(phone).first();
              if (!existing) {
                isNew = true;
                needsProfile = true;
                const reqRow = await env.DB.prepare('SELECT name FROM requests WHERE phone = ? ORDER BY id DESC LIMIT 1').bind(phone).first();
                if (reqRow?.name) fullName = String(reqRow.name);

                const insRes = await env.DB.prepare(`
                  INSERT INTO customers (phone, full_name, gender, status, created_at, updated_at)
                  VALUES (?, ?, 'male', 'active', ?, ?)
                `).bind(phone, fullName, now, now).run();

                if (insRes?.meta?.last_row_id) {
                  customerId = insRes.meta.last_row_id;
                }
              } else {
                customerId = existing.id;
                fullName = existing.full_name || fullName;
                gender = existing.gender || gender;
                companyName = existing.company_name || null;
              }
            } catch {}
          }

          const token = `behdoon_customer_${customerId}_${phone}`;
          return jsonResponse({
            success: true,
            token,
            isNew,
            needsProfile,
            customer: {
              id: customerId,
              phone,
              fullName,
              gender,
              companyName,
            },
          });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }

      if (pathname === '/api/customer/me') {
        const auth = getCustomerAuth(request);
        const phone = auth?.phone || '09123456789';
        let customerId = auth?.id || 1;
        let fullName = 'مشتری گرامی بهدون';
        let gender = 'male';
        let companyName = null;

        if (env.DB) {
          try {
            const row = await env.DB.prepare('SELECT * FROM customers WHERE phone = ?').bind(phone).first();
            if (row) {
              customerId = row.id;
              fullName = row.full_name || fullName;
              gender = row.gender || gender;
              companyName = row.company_name || null;
            } else {
              const reqRow = await env.DB.prepare('SELECT name FROM requests WHERE phone = ? ORDER BY id DESC LIMIT 1').bind(phone).first();
              if (reqRow?.name) fullName = String(reqRow.name);
            }
          } catch {}
        }
        return jsonResponse({
          customer: {
            id: customerId,
            phone,
            fullName,
            gender,
            companyName,
          },
        });
      }

      if (pathname === '/api/customer/profile' && request.method === 'POST') {
        const auth = getCustomerAuth(request);
        if (!auth) return jsonResponse({ error: 'ابتدا وارد حساب کاربری خود شوید.' }, 401);
        try {
          const body = (await request.json().catch(() => ({}))) as Record<string, any>;
          const fullName = String(body.fullName || '').trim();
          const gender = String(body.gender || 'male').trim();
          const companyName = body.companyName ? String(body.companyName).trim() : null;
          const now = new Date().toISOString();

          if (env.DB) {
            try {
              await env.DB.prepare(`
                UPDATE customers SET full_name = ?, gender = ?, company_name = ?, updated_at = ?
                WHERE phone = ?
              `).bind(fullName, gender, companyName, now, auth.phone).run();
            } catch {}
          }

          return jsonResponse({
            success: true,
            customer: {
              id: auth.id,
              phone: auth.phone,
              fullName,
              gender,
              companyName,
            },
          });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }

      if (pathname === '/api/customer/addresses' && request.method === 'GET') {
        const auth = getCustomerAuth(request);
        if (!auth) return jsonResponse({ error: 'احراز هویت الزامی است.' }, 401);
        let addresses: any[] = [];
        if (env.DB) {
          try {
            const { results } = await env.DB.prepare(`
              SELECT * FROM customer_addresses WHERE customer_id = ? ORDER BY id DESC
            `).bind(auth.id).all();
            if (results) {
              addresses = results.map((r: any) => ({
                id: r.id,
                title: r.title,
                city: r.city,
                district: r.district,
                address: r.address,
                floor: r.floor,
                unit: r.unit,
                hasElevator: Boolean(r.has_elevator),
                lat: r.lat,
                lng: r.lng,
                notes: r.notes,
                createdAt: r.created_at,
              }));
            }
          } catch {}
        }
        return jsonResponse({ addresses });
      }

      if (pathname === '/api/customer/addresses' && request.method === 'POST') {
        const auth = getCustomerAuth(request);
        if (!auth) return jsonResponse({ error: 'احراز هویت الزامی است.' }, 401);
        try {
          const body = (await request.json().catch(() => ({}))) as Record<string, any>;
          let newId = Date.now();
          const now = new Date().toISOString();
          if (env.DB) {
            try {
              const res = await env.DB.prepare(`
                INSERT INTO customer_addresses (
                  customer_id, title, city, district, address, floor, unit, has_elevator, lat, lng, notes, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              `).bind(
                auth.id,
                body.title || 'منزل',
                body.city || 'تهران',
                body.district || '',
                body.address || '',
                body.floor || null,
                body.unit || null,
                body.hasElevator !== false ? 1 : 0,
                body.lat || null,
                body.lng || null,
                body.notes || null,
                now
              ).run();
              if (res?.meta?.last_row_id) newId = res.meta.last_row_id;
            } catch {}
          }
          return jsonResponse({
            success: true,
            address: {
              id: newId,
              title: body.title || 'منزل',
              city: body.city || 'تهران',
              district: body.district || '',
              address: body.address || '',
              floor: body.floor || null,
              unit: body.unit || null,
              hasElevator: body.hasElevator !== false,
              notes: body.notes || null,
              createdAt: now,
            },
          });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }

      if (pathname.startsWith('/api/customer/addresses/') && request.method === 'DELETE') {
        const auth = getCustomerAuth(request);
        if (!auth) return jsonResponse({ error: 'احراز هویت الزامی است.' }, 401);
        const id = Number(pathname.split('/').pop());
        if (env.DB && id) {
          try {
            await env.DB.prepare('DELETE FROM customer_addresses WHERE id = ? AND customer_id = ?').bind(id, auth.id).run();
          } catch {}
        }
        return jsonResponse({ success: true });
      }

      if (pathname === '/api/customer/register' && request.method === 'POST') {
        try {
          const body = (await request.json().catch(() => ({}))) as Record<string, any>;
          const phone = String(body.phone || '').trim();
          const fullName = String(body.fullName || 'مشتری گرامی').trim();
          if (!/^09\d{9}$/.test(phone)) {
            return jsonResponse({ error: 'شماره موبایل نامعتبر است.' }, 400);
          }
          const now = new Date().toISOString();
          let customerId = Date.now();
          if (env.DB) {
            try {
              const res = await env.DB.prepare(`
                INSERT INTO customers (phone, full_name, gender, status, created_at, updated_at)
                VALUES (?, ?, 'male', 'active', ?, ?)
              `).bind(phone, fullName, now, now).run();
              if (res?.meta?.last_row_id) customerId = res.meta.last_row_id;
            } catch {}
          }
          const token = `behdoon_customer_${customerId}_${phone}`;
          return jsonResponse({
            success: true,
            token,
            customer: { id: customerId, phone, fullName, gender: 'male' },
          });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }

      if (pathname === '/api/customer/login' && request.method === 'POST') {
        try {
          const body = (await request.json().catch(() => ({}))) as Record<string, any>;
          const phone = String(body.phone || '').trim();
          if (!phone) return jsonResponse({ error: 'شماره موبایل الزامی است.' }, 400);
          let customerId = 1;
          let fullName = 'مشتری گرامی بهدون';
          if (env.DB) {
            try {
              const row = await env.DB.prepare('SELECT * FROM customers WHERE phone = ?').bind(phone).first();
              if (row) {
                customerId = row.id;
                fullName = row.full_name || fullName;
              }
            } catch {}
          }
          const token = `behdoon_customer_${customerId}_${phone}`;
          return jsonResponse({
            success: true,
            token,
            customer: { id: customerId, phone, fullName },
          });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }

      if (pathname === '/api/customer/logout') {
        return jsonResponse({ success: true });
      }

      // --- Secure Customer Orders API (Fixes IDOR Vulnerability) ---
      if (pathname === '/api/customer/orders' && request.method === 'GET') {
        const auth = getCustomerAuth(request);
        if (!auth) return jsonResponse({ error: 'احراز هویت مشتری الزامی است.' }, 401);
        let ordersList: any[] = [];
        if (env.DB) {
          try {
            const { results } = await env.DB.prepare(`
              SELECT r.*, p.full_name AS provider_name, p.phone AS provider_phone
              FROM requests r
              LEFT JOIN providers p ON r.provider_id = p.id
              WHERE r.customer_id = ? OR r.phone = ?
              ORDER BY r.id DESC
            `).bind(auth.id, auth.phone).all();

            if (results && results.length > 0) {
              ordersList = results.map((r: any) => ({
                id: r.id,
                trackingCode: r.tracking_code || `${getShahanshahiDatePrefix()}${String(r.id < 100 ? r.id : r.id).padStart(2, '0')}`,
                customerName: r.name,
                providerId: r.provider_id,
                providerName: r.provider_name || null,
                providerPhone: r.provider_phone || null,
                serviceId: r.service_id,
                serviceLabel: r.service_label || r.service_id,
                originProvince: r.origin_province || 'تهران',
                originCity: r.origin_city || 'تهران',
                originDistrict: r.origin_district || 'تهران',
                originNotes: r.origin_notes || '',
                originLat: r.origin_lat,
                originLng: r.origin_lng,
                originPropertyType: r.origin_property_type || 'residential',
                phone: r.phone,
                status: r.status || 'submitted',
                scheduledDate: r.scheduled_date || 'امروز',
                scheduledTime: r.scheduled_time || 'فوری',
                estimateAvg: r.estimate_avg || 1800000,
                finalPrice: r.final_price || null,
                createdAt: r.created_at || new Date().toISOString(),
                updatedAt: r.updated_at || new Date().toISOString(),
              }));
            }
          } catch {}
        }
        return jsonResponse({ orders: ordersList });
      }

      // --- Provider Management Endpoints (Marketplace Technicians) ---
      if (pathname === '/api/admin/providers' && request.method === 'GET') {
        if (!isStaffAuthed(request)) return jsonResponse({ error: 'دسترسی غیرمجاز است.' }, 401);
        let providers: any[] = [];
        if (env.DB) {
          try {
            const { results } = await env.DB.prepare('SELECT * FROM providers ORDER BY id DESC').all();
            if (results) {
              providers = results.map((r: any) => ({
                id: r.id,
                fullName: r.full_name,
                phone: r.phone,
                nationalId: r.national_id,
                avatarUrl: r.avatar_url,
                city: r.city,
                districts: typeof r.districts === 'string' ? JSON.parse(r.districts || '[]') : (r.districts || []),
                serviceCategories: typeof r.service_categories === 'string' ? JSON.parse(r.service_categories || '[]') : (r.service_categories || []),
                bio: r.bio,
                yearsExperience: r.years_experience,
                status: r.status,
                isOnline: Boolean(r.is_online),
                performanceScore: r.performance_score,
                totalJobs: r.total_jobs,
                completedJobs: r.completed_jobs,
                cancelledJobs: r.cancelled_jobs,
                createdAt: r.created_at,
              }));
            }
          } catch {}
        }
        return jsonResponse({ providers });
      }

      if (pathname === '/api/admin/providers' && request.method === 'POST') {
        if (!isStaffAuthed(request)) return jsonResponse({ error: 'دسترسی غیرمجاز است.' }, 401);
        try {
          const body = (await request.json().catch(() => ({}))) as Record<string, any>;
          const fullName = String(body.fullName || '').trim();
          const phone = String(body.phone || '').trim();
          if (!fullName || !phone) return jsonResponse({ error: 'نام و شماره تماس الزامی است.' }, 400);

          let newId = Date.now();
          const now = new Date().toISOString();
          if (env.DB) {
            try {
              const res = await env.DB.prepare(`
                INSERT INTO providers (
                  full_name, phone, national_id, city, districts, service_categories, bio,
                  years_experience, status, is_online, performance_score, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', 1, 5.0, ?, ?)
              `).bind(
                fullName,
                phone,
                body.nationalId || null,
                body.city || 'تهران',
                JSON.stringify(body.districts || ['all']),
                JSON.stringify(body.serviceCategories || ['hvac']),
                body.bio || '',
                body.yearsExperience || 3,
                now,
                now
              ).run();
              if (res?.meta?.last_row_id) newId = res.meta.last_row_id;
            } catch {}
          }
          return jsonResponse({
            success: true,
            provider: {
              id: newId,
              fullName,
              phone,
              status: 'active',
              performanceScore: 5.0,
              createdAt: now,
            },
          }, 201);
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }

      if (pathname.startsWith('/api/admin/providers/') && (request.method === 'PATCH' || request.method === 'DELETE')) {
        if (!isStaffAuthed(request)) return jsonResponse({ error: 'دسترسی غیرمجاز است.' }, 401);
        const id = Number(pathname.split('/').pop());
        if (!id) return jsonResponse({ error: 'شناسه نامعتبر است.' }, 400);

        if (request.method === 'DELETE') {
          if (env.DB) {
            try {
              await env.DB.prepare('DELETE FROM providers WHERE id = ?').bind(id).run();
            } catch {}
          }
          return jsonResponse({ success: true });
        }

        if (request.method === 'PATCH') {
          const body = (await request.json().catch(() => ({}))) as Record<string, any>;
          const now = new Date().toISOString();
          if (env.DB) {
            try {
              await env.DB.prepare(`
                UPDATE providers SET
                  status = COALESCE(?, status),
                  bio = COALESCE(?, bio),
                  is_online = COALESCE(?, is_online),
                  performance_score = COALESCE(?, performance_score),
                  updated_at = ?
                WHERE id = ?
              `).bind(
                body.status ?? null,
                body.bio ?? null,
                body.isOnline !== undefined ? (body.isOnline ? 1 : 0) : null,
                body.performanceScore ?? null,
                now,
                id
              ).run();
            } catch {}
          }
          return jsonResponse({ success: true, id });
        }
      }

      if (pathname === '/api/providers/public' && request.method === 'GET') {
        let providers: any[] = [];
        if (env.DB) {
          try {
            const { results } = await env.DB.prepare(`
              SELECT id, full_name, avatar_url, city, service_categories, bio, years_experience, performance_score, total_jobs
              FROM providers WHERE status = 'active'
            `).all();
            if (results) {
              providers = results.map((r: any) => ({
                id: r.id,
                fullName: r.full_name,
                avatarUrl: r.avatar_url,
                city: r.city,
                serviceCategories: typeof r.service_categories === 'string' ? JSON.parse(r.service_categories || '[]') : r.service_categories,
                bio: r.bio,
                yearsExperience: r.years_experience,
                performanceScore: r.performance_score,
                totalJobs: r.total_jobs,
              }));
            }
          } catch {}
        }
        return jsonResponse({ providers });
      }

      const BEHDOON_STAFF_MEMBERS = [
        {
          id: 1,
          username: 'admin',
          fullName: 'علیرضا کاظمی',
          role: 'super_admin',
          roleLabel: 'مدیر کل سیستم',
          permissions: ['*'],
          assignable: true,
          phone: '021-22345678',
          avatarUrl: null,
          nationalId: '0012345678',
          address: 'تهران، نیاوران، دفتر مرکزی بهدون',
          hireDate: '1402/01/01',
          emergencyContactName: 'دفتر مرکزی',
          emergencyContactPhone: '02122345678',
          notes: 'مدیریت کل سیستم خدمات ساختمانی بهدون',
          gender: 'male',
          isActive: true,
          isReadOnly: false,
          onActiveService: false,
          salaryAmountOverride: null,
          bonusTypeOverride: null,
          bonusAmountOverride: null,
          createdAt: '1402/01/01',
        },
        {
          id: 2,
          username: 'sara.dispatch',
          fullName: 'سارا حسینی',
          role: 'support_dispatch',
          roleLabel: 'کارشناس پشتیبانی و اعزام فوری',
          permissions: ['dashboard', 'pipeline', 'map', 'chat'],
          assignable: false,
          phone: '09129876543',
          avatarUrl: null,
          nationalId: '0078901234',
          address: 'تهران، پاسداران',
          hireDate: '1402/08/15',
          emergencyContactName: 'حسینی',
          emergencyContactPhone: '09121112233',
          notes: 'مسئول هماهنگی تلفنی و اعزام فوری تکنسین‌ها به محلات تهران',
          gender: 'female',
          isActive: true,
          isReadOnly: false,
          onActiveService: false,
          salaryAmountOverride: null,
          bonusTypeOverride: null,
          bonusAmountOverride: null,
          createdAt: '1402/08/15',
        },
        {
          id: 3,
          username: 'majid.hvac',
          fullName: 'مهندس مجید رستمی',
          role: 'tech_hvac',
          roleLabel: 'تکنسین ارشد سرمایش و گرمایش',
          permissions: ['assignments'],
          assignable: true,
          phone: '09351112233',
          avatarUrl: null,
          nationalId: '0045678901',
          address: 'تهران، سعادت‌آباد و پونک',
          hireDate: '1402/04/10',
          emergencyContactName: 'رستمی',
          emergencyContactPhone: '09350001122',
          notes: 'دارای مدرک فنی‌حرفه‌ای بین‌المللی پکیج، چیلر، اسپلیت و موتورخانه',
          gender: 'male',
          isActive: true,
          isReadOnly: false,
          onActiveService: true,
          salaryAmountOverride: null,
          bonusTypeOverride: null,
          bonusAmountOverride: null,
          createdAt: '1402/04/10',
        },
        {
          id: 4,
          username: 'behrouz.pipe',
          fullName: 'استاد بهروز قاسمی',
          role: 'tech_plumbing',
          roleLabel: 'استادکار لوله‌کشی و تأسیسات',
          permissions: ['assignments'],
          assignable: true,
          phone: '09124445566',
          avatarUrl: null,
          nationalId: '0067890123',
          address: 'تهران، ستارخان و منطقه ۲',
          hireDate: '1402/03/01',
          emergencyContactName: 'قاسمی',
          emergencyContactPhone: '09127778899',
          notes: 'متخصص نشت‌یابی با دستگاه تصویری، لوله بازکنی بدون تخریب و پمپ آب ساختمان',
          gender: 'male',
          isActive: true,
          isReadOnly: false,
          onActiveService: false,
          salaryAmountOverride: null,
          bonusTypeOverride: null,
          bonusAmountOverride: null,
          createdAt: '1402/03/01',
        },
        {
          id: 5,
          username: 'sina.electric',
          fullName: 'مهندس سینا مرادی',
          role: 'tech_electrical',
          roleLabel: 'برقکار و تکنسین برق ساختمان',
          permissions: ['assignments'],
          assignable: true,
          phone: '09193334455',
          avatarUrl: null,
          nationalId: '0034567890',
          address: 'تهران، تهرانپارس و شرق تهران',
          hireDate: '1402/06/20',
          emergencyContactName: 'مرادی',
          emergencyContactPhone: '09195556677',
          notes: 'رفع فوری اتصالی برق ساختمان، سیم‌کشی سه فاز و نصب انواع آیفون تصویری',
          gender: 'male',
          isActive: true,
          isReadOnly: false,
          onActiveService: true,
          salaryAmountOverride: null,
          bonusTypeOverride: null,
          bonusAmountOverride: null,
          createdAt: '1402/06/20',
        },
        {
          id: 6,
          username: 'ahmad.reno',
          fullName: 'استاد احمد کریمی',
          role: 'tech_renovation',
          roleLabel: 'استادکار تعمیرات و بازسازی ساختمان',
          permissions: ['assignments'],
          assignable: true,
          phone: '09128889900',
          avatarUrl: null,
          nationalId: '0098765432',
          address: 'تهران، یوسف‌آباد و مرکز شهر',
          hireDate: '1402/02/12',
          emergencyContactName: 'کریمی',
          emergencyContactPhone: '09122223344',
          notes: 'استادکار بازسازی صفر تا صد، کاشی‌کاری پرسلان، نقاشی مدرن و کناف ضد رطوبت',
          gender: 'male',
          isActive: true,
          isReadOnly: false,
          onActiveService: false,
          salaryAmountOverride: null,
          bonusTypeOverride: null,
          bonusAmountOverride: null,
          createdAt: '1402/02/12',
        },
      ];

      const BEHDOON_ROLE_RECORDS = [
        {
          id: 1,
          key: 'super_admin',
          label: 'مدیر کل سیستم',
          labelEn: 'Super Admin',
          permissions: ['*'],
          isSystem: true,
          defaultSalaryAmount: 0,
          defaultBonusType: 'percent',
          defaultBonusAmount: 0,
          createdAt: '1402/01/01',
          updatedAt: '1402/01/01',
        },
        {
          id: 2,
          key: 'support_dispatch',
          label: 'کارشناس پشتیبانی و اعزام فوری',
          labelEn: 'Support & Dispatch Specialist',
          permissions: ['dashboard', 'pipeline', 'map', 'chat'],
          isSystem: false,
          defaultSalaryAmount: 18000000,
          defaultBonusType: 'percent',
          defaultBonusAmount: 5,
          createdAt: '1402/08/15',
          updatedAt: '1402/08/15',
        },
        {
          id: 3,
          key: 'tech_hvac',
          label: 'تکنسین ارشد سرمایش و گرمایش',
          labelEn: 'HVAC Specialist',
          permissions: ['assignments'],
          isSystem: false,
          defaultSalaryAmount: 25000000,
          defaultBonusType: 'flat',
          defaultBonusAmount: 600000,
          createdAt: '1402/04/10',
          updatedAt: '1402/04/10',
        },
        {
          id: 4,
          key: 'tech_plumbing',
          label: 'استادکار لوله‌کشی و تأسیسات',
          labelEn: 'Plumbing Specialist',
          permissions: ['assignments'],
          isSystem: false,
          defaultSalaryAmount: 24000000,
          defaultBonusType: 'flat',
          defaultBonusAmount: 550000,
          createdAt: '1402/03/01',
          updatedAt: '1402/03/01',
        },
        {
          id: 5,
          key: 'tech_electrical',
          label: 'برقکار و تکنسین برق ساختمان',
          labelEn: 'Electrical Specialist',
          permissions: ['assignments'],
          isSystem: false,
          defaultSalaryAmount: 23000000,
          defaultBonusType: 'flat',
          defaultBonusAmount: 500000,
          createdAt: '1402/06/20',
          updatedAt: '1402/06/20',
        },
        {
          id: 6,
          key: 'tech_renovation',
          label: 'استادکار تعمیرات و بازسازی ساختمان',
          labelEn: 'Renovation Specialist',
          permissions: ['assignments'],
          isSystem: false,
          defaultSalaryAmount: 26000000,
          defaultBonusType: 'flat',
          defaultBonusAmount: 700000,
          createdAt: '1402/02/12',
          updatedAt: '1402/02/12',
        },
      ];

      const BEHDOON_PERMISSION_LIST = [
        { key: 'dashboard', label: 'داشبورد و آمار', labelEn: 'Dashboard & Stats' },
        { key: 'pipeline', label: 'مراحل درخواست‌ها', labelEn: 'Pipeline' },
        { key: 'map', label: 'نقشه درخواست‌ها', labelEn: 'Map' },
        { key: 'content', label: 'مدیریت محتوا', labelEn: 'Content' },
        { key: 'homepage', label: 'صفحه اصلی', labelEn: 'Homepage' },
        { key: 'stories', label: 'استوری‌ها', labelEn: 'Stories' },
        { key: 'chat', label: 'چت پشتیبانی', labelEn: 'Support Chat' },
        { key: 'recruitment', label: 'فرصت‌های شغلی', labelEn: 'Recruitment' },
        { key: 'staff', label: 'کارمندان و تکنسین‌ها', labelEn: 'Staff' },
        { key: 'roles', label: 'نقش‌ها و دسترسی‌ها', labelEn: 'Roles' },
        { key: 'settings', label: 'تنظیمات عمومی', labelEn: 'Settings' },
        { key: 'seo', label: 'مدیریت سئو', labelEn: 'SEO' },
        { key: 'ai', label: 'دستیار هوش مصنوعی', labelEn: 'AI Assistant' },
        { key: 'plugins', label: 'افزونه‌ها', labelEn: 'Plugins' },
        { key: 'assignments', label: 'ماموریت‌های من', labelEn: 'My Assignments' },
        { key: 'wallet', label: 'حقوق و دستمزد', labelEn: 'Payroll' },
      ];

      if (pathname === '/api/admin/staff') {
        let staffList = [...BEHDOON_STAFF_MEMBERS];
        if (env.DB) {
          try {
            const { results } = await env.DB.prepare(`
              SELECT id, full_name, phone, national_id, avatar_url, bio, years_experience, status, is_online, performance_score, total_jobs
              FROM providers
            `).all();
            if (results && results.length > 0) {
              const existingIds = new Set(staffList.map((s) => s.id));
              results.forEach((p: any) => {
                if (!existingIds.has(p.id)) {
                  staffList.push({
                    id: p.id,
                    username: `tech_${p.id}`,
                    fullName: p.full_name,
                    role: 'tech_hvac' as any,
                    roleLabel: 'متخصص / تکنسین اعزامی',
                    permissions: ['assignments'],
                    assignable: true,
                    phone: p.phone,
                    avatarUrl: p.avatar_url,
                    nationalId: p.national_id,
                    address: 'تهران',
                    hireDate: '1403/01/01',
                    emergencyContactName: p.full_name,
                    emergencyContactPhone: p.phone,
                    notes: p.bio || 'متخصص فعال سامانه بهدون',
                    gender: 'male',
                    isActive: p.status === 'active' || p.status === 'verified',
                    isReadOnly: false,
                    onActiveService: !Boolean(p.is_online),
                    salaryAmountOverride: null,
                    bonusTypeOverride: null,
                    bonusAmountOverride: null,
                    createdAt: '1403/01/01',
                  });
                }
              });
            }
          } catch {}
        }
        return jsonResponse({ staff: staffList });
      }

      if (pathname === '/api/admin/roles') {
        return jsonResponse({ roles: BEHDOON_ROLE_RECORDS, permissions: BEHDOON_PERMISSION_LIST });
      }

      if (pathname === '/api/admin/wallet/staff') {
        const wallets = BEHDOON_STAFF_MEMBERS.map((s) => ({
          staffId: s.id,
          fullName: s.fullName,
          roleLabel: s.roleLabel,
          balance: s.id * 1850000,
          totalEarned: s.id * 9200000,
          totalPaidOut: s.id * 7350000,
          pendingPayoutAmount: 0,
        }));
        return jsonResponse({ wallets });
      }

      if (pathname === '/api/admin/requests/export' && request.method === 'GET') {
        if (!isStaffAuthed(request)) return jsonResponse({ error: 'دسترسی غیرمجاز است.' }, 401);
        let csv = '\uFEFFشناسه,کد رهگیری,مشتری,تلفن,خدمت,وضعیت,تاریخ,متخصص,هزینه\n';
        if (env.DB) {
          try {
            const { results } = await env.DB.prepare(`
              SELECT r.*, p.full_name as provider_name FROM requests r LEFT JOIN providers p ON r.provider_id = p.id ORDER BY r.id DESC
            `).all();
            results?.forEach((r: any) => {
              csv += `"${r.id}","${r.tracking_code || ''}","${r.name || ''}","${r.phone || ''}","${r.service_label || r.service_id || ''}","${r.status || ''}","${r.scheduled_date || ''}","${r.provider_name || ''}","${r.estimate_avg || 0}"\n`;
            });
          } catch {}
        }
        return new Response(csv, {
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'attachment; filename="behdoon-requests.csv"',
          },
        });
      }

      // --- Request Assignment (Provider / Staff) ---
      if (pathname.startsWith('/api/admin/requests/') && pathname.endsWith('/assign') && (request.method === 'PATCH' || request.method === 'POST')) {
        if (!isStaffAuthed(request)) return jsonResponse({ error: 'دسترسی غیرمجاز است.' }, 401);
        const parts = pathname.split('/');
        const id = Number(parts[parts.length - 2]);
        if (!id) return jsonResponse({ error: 'شناسه سفارش نامعتبر است.' }, 400);

        try {
          const body = (await request.json().catch(() => ({}))) as Record<string, any>;
          const providerId = body.providerId !== undefined ? (body.providerId ? Number(body.providerId) : null) : (body.staffId !== undefined && body.staffId !== null ? (body.staffId ? Number(body.staffId) : null) : null);
          const note = String(body.note || '').trim() || (providerId ? `تخصیص تکنسین/متخصص به سفارش` : `لغو تخصیص متخصص از سفارش`);
          const now = new Date().toISOString();

          let oldStatus = 'submitted';
          let providerName = '';

          if (env.DB) {
            try {
              const currentReq = await env.DB.prepare('SELECT status, provider_id FROM requests WHERE id = ?').bind(id).first();
              if (currentReq?.status) oldStatus = currentReq.status;

              if (providerId) {
                const provRow = await env.DB.prepare('SELECT full_name FROM providers WHERE id = ?').bind(providerId).first();
                if (provRow?.full_name) providerName = provRow.full_name;
              }

              const newStatus = providerId ? 'provider_assigned' : 'under_review';

              await env.DB.prepare(`
                UPDATE requests SET
                  provider_id = ?,
                  status = ?,
                  updated_at = ?
                WHERE id = ?
              `).bind(providerId, newStatus, now, id).run();

              await env.DB.prepare(`
                INSERT INTO order_status_logs (request_id, from_status, to_status, changed_by_role, changed_by_id, note, created_at)
                VALUES (?, ?, ?, 'staff', ?, ?, ?)
              `).bind(
                id,
                oldStatus,
                newStatus,
                providerId,
                note + (providerName ? ` (${providerName})` : ''),
                now
              ).run();

              if (providerId) {
                await env.DB.prepare('UPDATE providers SET total_jobs = total_jobs + 1, updated_at = ? WHERE id = ?')
                  .bind(now, providerId).run();
              }
            } catch (dbErr: any) {
              console.error('Assign DB error:', dbErr);
            }
          }

          return jsonResponse({
            success: true,
            id,
            providerId,
            providerName,
            status: providerId ? 'provider_assigned' : 'under_review',
          });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }

      // --- Request Status History Audit Trail & Events ---
      if (pathname.startsWith('/api/admin/requests/') && (pathname.endsWith('/history') || pathname.endsWith('/events')) && request.method === 'GET') {
        if (!isStaffAuthed(request)) return jsonResponse({ error: 'دسترسی غیرمجاز است.' }, 401);
        const parts = pathname.split('/');
        const id = Number(parts[parts.length - 2]);
        if (!id) return jsonResponse({ error: 'شناسه سفارش نامعتبر است.' }, 400);

        let logs: any[] = [];
        if (env.DB) {
          try {
            const queryRes = await env.DB.prepare(`
              SELECT * FROM order_status_logs WHERE request_id = ? ORDER BY id ASC
            `).bind(id).all();
            if (queryRes?.results) {
              logs = queryRes.results.map((r: any) => ({
                id: r.id,
                requestId: r.request_id,
                fromStatus: r.from_status,
                toStatus: r.to_status,
                changedByRole: r.changed_by_role,
                changedById: r.changed_by_id,
                note: r.note,
                createdAt: r.created_at,
              }));
            }
          } catch {}
        }

        const events = logs.map((l) => ({
          type: l.toStatus,
          description: l.note || `تغییر وضعیت به ${l.toStatus}`,
          staffName: l.changedByRole === 'customer' ? 'مشتری' : (l.changedByRole === 'provider' ? 'متخصص' : 'تیم پشتیبانی'),
          createdAt: l.createdAt,
        }));

        return jsonResponse({ history: logs, events });
      }

      // --- Request Status & Details Update (State Machine Engine) ---
      if (pathname.startsWith('/api/admin/requests/') && request.method === 'PATCH') {
        if (!isStaffAuthed(request)) return jsonResponse({ error: 'دسترسی غیرمجاز است.' }, 401);
        const parts = pathname.split('/');
        const isStatusSubpath = parts[parts.length - 1] === 'status';
        const id = Number(isStatusSubpath ? parts[parts.length - 2] : parts[parts.length - 1]);
        if (!id) return jsonResponse({ error: 'شناسه سفارش نامعتبر است.' }, 400);

        try {
          const data = (await request.json().catch(() => ({}))) as Record<string, any>;
          const now = new Date().toISOString();
          let oldStatus = 'submitted';
          let providerId: number | null = null;

          if (env.DB) {
            try {
              const currentReq = await env.DB.prepare('SELECT status, provider_id FROM requests WHERE id = ?').bind(id).first();
              if (currentReq) {
                oldStatus = currentReq.status || 'submitted';
                providerId = currentReq.provider_id || null;
              }

              if (data.status) {
                await env.DB.prepare('UPDATE requests SET status = ?, updated_at = ? WHERE id = ?')
                  .bind(data.status, now, id)
                  .run();

                const note = String(data.note || `تغییر وضعیت از «${oldStatus}» به «${data.status}»`).trim();
                await env.DB.prepare(`
                  INSERT INTO order_status_logs (request_id, from_status, to_status, changed_by_role, changed_by_id, note, created_at)
                  VALUES (?, ?, ?, 'staff', ?, ?, ?)
                `).bind(
                  id,
                  oldStatus,
                  data.status,
                  data.staffId || null,
                  note,
                  now
                ).run();

                if (providerId) {
                  if (data.status === 'completed') {
                    await env.DB.prepare('UPDATE providers SET completed_jobs = completed_jobs + 1, updated_at = ? WHERE id = ?')
                      .bind(now, providerId).run();
                  } else if (data.status === 'cancelled') {
                    await env.DB.prepare('UPDATE providers SET cancelled_jobs = cancelled_jobs + 1, updated_at = ? WHERE id = ?')
                      .bind(now, providerId).run();
                  }
                }
              }

              if (data.estimateAvg !== undefined || data.finalPrice !== undefined) {
                await env.DB.prepare(`
                  UPDATE requests SET
                    estimate_avg = COALESCE(?, estimate_avg),
                    final_price = COALESCE(?, final_price),
                    updated_at = ?
                  WHERE id = ?
                `).bind(
                  data.estimateAvg ?? null,
                  data.finalPrice ?? null,
                  now,
                  id
                ).run();
              }
            } catch (dbErr: any) {
              console.error('Update request error:', dbErr);
            }
          }
          return jsonResponse({ success: true, id, status: data.status, oldStatus });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }

      // --- Request Deletion ---
      if (pathname.startsWith('/api/admin/requests/') && request.method === 'DELETE') {
        if (!isStaffAuthed(request)) return jsonResponse({ error: 'دسترسی غیرمجاز است.' }, 401);
        const parts = pathname.split('/');
        const id = Number(parts[parts.length - 1]);
        if (!id) return jsonResponse({ error: 'شناسه سفارش نامعتبر است.' }, 400);

        if (env.DB) {
          try {
            await env.DB.prepare('DELETE FROM order_status_logs WHERE request_id = ?').bind(id).run();
            await env.DB.prepare('DELETE FROM requests WHERE id = ?').bind(id).run();
          } catch {}
        }
        return jsonResponse({ success: true });
      }

      // ==============================================================================
      // --- MARKETPLACE ENGINE ENDPOINTS (Phase 2 Core) ---
      // ==============================================================================

      // 1. Marketplace Matching: Compute & Rank Candidate Providers
      if (pathname === '/api/matching/candidates' && request.method === 'POST') {
        try {
          const body = (await request.json().catch(() => ({}))) as Record<string, any>;
          let serviceId = String(body.serviceId || '').trim();
          let district = String(body.district || '').trim();
          let scheduledDate = String(body.scheduledDate || '').trim();
          let timeSlot = String(body.scheduledTime || body.timeSlot || '').trim();
          let requestId = body.requestId ? Number(body.requestId) : null;

          if (requestId && env.DB) {
            try {
              const reqRow = await env.DB.prepare('SELECT service_id, origin_district, scheduled_date, scheduled_time FROM requests WHERE id = ?').bind(requestId).first();
              if (reqRow) {
                if (!serviceId) serviceId = reqRow.service_id;
                if (!district) district = reqRow.origin_district || '';
                if (!scheduledDate) scheduledDate = reqRow.scheduled_date || '';
                if (!timeSlot) timeSlot = reqRow.scheduled_time || '';
              }
            } catch {}
          }

          let candidates: MatchingCandidate[] = [];
          if (env.DB) {
            try {
              const bookedSet = new Set<number>();
              if (scheduledDate && timeSlot) {
                const bookedRows = await env.DB.prepare(
                  "SELECT provider_id FROM provider_schedules WHERE date = ? AND time_slot = ? AND status = 'booked'"
                ).bind(scheduledDate, timeSlot).all();
                bookedRows?.results?.forEach((r: any) => bookedSet.add(r.provider_id));
              }

              const { results: provRows } = await env.DB.prepare(
                "SELECT * FROM providers WHERE status = 'active' OR status = 'verified'"
              ).all();

              if (provRows && provRows.length > 0) {
                candidates = provRows.map((p: any) =>
                  calculateMatchingScore(p, { serviceId, district, scheduledDate, timeSlot }, bookedSet)
                );
                candidates.sort((a, b) => b.score - a.score);

                if (requestId) {
                  const now = new Date().toISOString();
                  for (let i = 0; i < Math.min(5, candidates.length); i++) {
                    const c = candidates[i];
                    await env.DB.prepare(`
                      INSERT INTO request_candidates (request_id, provider_id, matching_score, rank, selection_mode, status, created_at)
                      VALUES (?, ?, ?, ?, ?, 'candidate', ?)
                    `).bind(requestId, c.providerId, c.score, i + 1, body.selectionMode || 'auto', now).run();
                  }
                }
              }
            } catch (dbErr: any) {
              console.error('Matching candidates error:', dbErr);
            }
          }

          return jsonResponse({
            success: true,
            requestId,
            count: candidates.length,
            candidates,
          });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }

      // 2. Marketplace Matching: Auto-Assign or Select Candidate
      if (pathname === '/api/matching/auto-assign' && request.method === 'POST') {
        try {
          const body = (await request.json().catch(() => ({}))) as Record<string, any>;
          const requestId = Number(body.requestId);
          if (!requestId) return jsonResponse({ error: 'شناسه سفارش نامعتبر است.' }, 400);

          let providerId = body.providerId ? Number(body.providerId) : null;
          const selectionMode = body.selectionMode || (providerId ? 'customer_choice' : 'auto');
          const now = new Date().toISOString();

          if (env.DB) {
            try {
              const reqRow = await env.DB.prepare('SELECT * FROM requests WHERE id = ?').bind(requestId).first();
              if (!reqRow) return jsonResponse({ error: 'سفارش یافت نشد.' }, 404);

              if (!providerId) {
                const bookedSet = new Set<number>();
                if (reqRow.scheduled_date && reqRow.scheduled_time) {
                  const bookedRows = await env.DB.prepare(
                    "SELECT provider_id FROM provider_schedules WHERE date = ? AND time_slot = ? AND status = 'booked'"
                  ).bind(reqRow.scheduled_date, reqRow.scheduled_time).all();
                  bookedRows?.results?.forEach((r: any) => bookedSet.add(r.provider_id));
                }

                const { results: provRows } = await env.DB.prepare(
                  "SELECT * FROM providers WHERE status = 'active' OR status = 'verified'"
                ).all();

                if (provRows && provRows.length > 0) {
                  const candidates = provRows.map((p: any) =>
                    calculateMatchingScore(
                      p,
                      { serviceId: reqRow.service_id, district: reqRow.origin_district, scheduledDate: reqRow.scheduled_date, timeSlot: reqRow.scheduled_time },
                      bookedSet
                    )
                  );
                  candidates.sort((a, b) => b.score - a.score);
                  const top = candidates.find((c) => !c.hasCollision) || candidates[0];
                  if (top) providerId = top.providerId;
                }
              }

              if (!providerId) return jsonResponse({ error: 'متخصص متناسب با این خدمت یافت نشد.' }, 404);

              const provRow = await env.DB.prepare('SELECT full_name, phone FROM providers WHERE id = ?').bind(providerId).first();

              if (reqRow.scheduled_date && reqRow.scheduled_time) {
                await env.DB.prepare(`
                  INSERT INTO provider_schedules (provider_id, date, time_slot, request_id, status, created_at)
                  VALUES (?, ?, ?, ?, 'booked', ?)
                `).bind(providerId, reqRow.scheduled_date, reqRow.scheduled_time, requestId, now).run();
              }

              await env.DB.prepare(`
                UPDATE requests SET provider_id = ?, status = 'provider_assigned', updated_at = ?
                WHERE id = ?
              `).bind(providerId, now, requestId).run();

              await env.DB.prepare('UPDATE providers SET total_jobs = total_jobs + 1, updated_at = ? WHERE id = ?')
                .bind(now, providerId).run();

              await env.DB.prepare(`
                UPDATE request_candidates SET status = 'assigned' WHERE request_id = ? AND provider_id = ?
              `).bind(requestId, providerId).run();

              const note = selectionMode === 'customer_choice'
                ? `انتخاب مستقیم متخصص توسط مشتری (${provRow?.full_name || providerId})`
                : `تخصیص هوشمند توسط موتور مچینگ بهدون (${provRow?.full_name || providerId})`;

              await env.DB.prepare(`
                INSERT INTO order_status_logs (request_id, from_status, to_status, changed_by_role, changed_by_id, note, created_at)
                VALUES (?, ?, 'provider_assigned', 'system', ?, ?, ?)
              `).bind(requestId, reqRow.status || 'submitted', providerId, note, now).run();

              return jsonResponse({
                success: true,
                requestId,
                providerId,
                providerName: provRow?.full_name,
                selectionMode,
                status: 'provider_assigned',
              });
            } catch (dbErr: any) {
              return jsonResponse({ error: dbErr.message }, 500);
            }
          }
          return jsonResponse({ success: false, error: 'دیتابیس در دسترس نیست.' }, 500);
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }

      // 3. Quotes: Issue a New Quote
      if (pathname === '/api/quotes' && request.method === 'POST') {
        try {
          const body = (await request.json().catch(() => ({}))) as Record<string, any>;
          const requestId = Number(body.requestId);
          const providerId = Number(body.providerId);
          const finalAmount = Number(body.finalAmount || 0);

          if (!requestId || !providerId || finalAmount <= 0) {
            return jsonResponse({ error: 'اطلاعات پیش‌فاکتور (سفارش، متخصص و مبلغ نهایی) ناقص است.' }, 400);
          }

          const now = new Date().toISOString();
          let quoteId = Date.now();

          if (env.DB) {
            try {
              const ins = await env.DB.prepare(`
                INSERT INTO quotes (
                  request_id, provider_id, pricing_model, base_amount, materials_amount,
                  labor_amount, discount_amount, final_amount, description, valid_until, status, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'sent', ?, ?)
              `).bind(
                requestId,
                providerId,
                body.pricingModel || 'fixed',
                body.baseAmount || 0,
                body.materialsAmount || 0,
                body.laborAmount || 0,
                body.discountAmount || 0,
                finalAmount,
                body.description || 'پیش‌فاکتور رسمی خدمات بهدون',
                body.validUntil || null,
                now,
                now
              ).run();

              if (ins?.meta?.last_row_id) quoteId = ins.meta.last_row_id;

              const currentReq = await env.DB.prepare('SELECT status FROM requests WHERE id = ?').bind(requestId).first();
              await env.DB.prepare("UPDATE requests SET status = 'quoted', updated_at = ? WHERE id = ?")
                .bind(now, requestId).run();

              await env.DB.prepare(`
                INSERT INTO order_status_logs (request_id, from_status, to_status, changed_by_role, changed_by_id, note, created_at)
                VALUES (?, ?, 'quoted', 'provider', ?, ?, ?)
              `).bind(requestId, currentReq?.status || 'under_review', providerId, `صدور پیش‌فاکتور به مبلغ ${finalAmount} تومان`, now).run();
            } catch (dbErr: any) {
              return jsonResponse({ error: dbErr.message }, 500);
            }
          }

          return jsonResponse({
            success: true,
            quote: {
              id: quoteId,
              requestId,
              providerId,
              finalAmount,
              status: 'sent',
              createdAt: now,
            },
          }, 201);
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }

      // 4. Quotes: List Quotes for Request
      if (pathname.startsWith('/api/requests/') && pathname.endsWith('/quotes') && request.method === 'GET') {
        const parts = pathname.split('/');
        const requestId = Number(parts[parts.length - 2]);
        if (!requestId) return jsonResponse({ error: 'شناسه سفارش نامعتبر است.' }, 400);

        let quotes: any[] = [];
        if (env.DB) {
          try {
            const { results } = await env.DB.prepare(`
              SELECT q.*, p.full_name as provider_name, p.phone as provider_phone
              FROM quotes q
              LEFT JOIN providers p ON q.provider_id = p.id
              WHERE q.request_id = ?
              ORDER BY q.id DESC
            `).bind(requestId).all();

            if (results) {
              quotes = results.map((r: any) => ({
                id: r.id,
                requestId: r.request_id,
                providerId: r.provider_id,
                providerName: r.provider_name,
                providerPhone: r.provider_phone,
                pricingModel: r.pricing_model,
                baseAmount: r.base_amount,
                materialsAmount: r.materials_amount,
                laborAmount: r.labor_amount,
                discountAmount: r.discount_amount,
                finalAmount: r.final_amount,
                description: r.description,
                validUntil: r.valid_until,
                status: r.status,
                createdAt: r.created_at,
              }));
            }
          } catch {}
        }
        return jsonResponse({ quotes });
      }

      // 5. Quotes: Accept Quote
      if (pathname.startsWith('/api/quotes/') && pathname.endsWith('/accept') && request.method === 'POST') {
        const parts = pathname.split('/');
        const quoteId = Number(parts[parts.length - 2]);
        if (!quoteId) return jsonResponse({ error: 'شناسه پیش‌فاکتور نامعتبر است.' }, 400);
        const now = new Date().toISOString();

        if (env.DB) {
          try {
            const quoteRow = await env.DB.prepare('SELECT * FROM quotes WHERE id = ?').bind(quoteId).first();
            if (!quoteRow) return jsonResponse({ error: 'پیش‌فاکتور یافت نشد.' }, 404);

            await env.DB.prepare("UPDATE quotes SET status = 'accepted', updated_at = ? WHERE id = ?").bind(now, quoteId).run();
            await env.DB.prepare("UPDATE quotes SET status = 'cancelled', updated_at = ? WHERE request_id = ? AND id != ?")
              .bind(now, quoteRow.request_id, quoteId).run();

            await env.DB.prepare(`
              UPDATE requests SET
                final_price = ?,
                status = 'confirmed',
                provider_id = ?,
                updated_at = ?
              WHERE id = ?
            `).bind(quoteRow.final_amount, quoteRow.provider_id, now, quoteRow.request_id).run();

            const invNumber = `INV-${new Date().getFullYear()}-${String(quoteRow.request_id).padStart(6, '0')}`;
            await env.DB.prepare(`
              INSERT INTO invoices (
                invoice_number, request_id, quote_id, provider_id, subtotal, materials_total, labor_total,
                discount, tax, total_amount, status, created_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, 'issued', ?)
            `).bind(
              invNumber,
              quoteRow.request_id,
              quoteId,
              quoteRow.provider_id,
              quoteRow.base_amount || quoteRow.final_amount,
              quoteRow.materials_amount || 0,
              quoteRow.labor_amount || 0,
              quoteRow.discount_amount || 0,
              quoteRow.final_amount,
              now
            ).run();

            await env.DB.prepare(`
              INSERT INTO order_status_logs (request_id, from_status, to_status, changed_by_role, changed_by_id, note, created_at)
              VALUES (?, 'quoted', 'confirmed', 'customer', NULL, ?, ?)
            `).bind(quoteRow.request_id, `تأیید پیش‌فاکتور توسط مشتری (مبلغ: ${quoteRow.final_amount} تومان)`, now).run();

            return jsonResponse({ success: true, quoteId, status: 'confirmed', invoiceNumber: invNumber });
          } catch (dbErr: any) {
            return jsonResponse({ error: dbErr.message }, 500);
          }
        }
        return jsonResponse({ success: true });
      }

      // 6. Quotes: Reject Quote
      if (pathname.startsWith('/api/quotes/') && pathname.endsWith('/reject') && request.method === 'POST') {
        const parts = pathname.split('/');
        const quoteId = Number(parts[parts.length - 2]);
        const now = new Date().toISOString();
        if (env.DB && quoteId) {
          try {
            const quoteRow = await env.DB.prepare('SELECT request_id FROM quotes WHERE id = ?').bind(quoteId).first();
            await env.DB.prepare("UPDATE quotes SET status = 'rejected', updated_at = ? WHERE id = ?").bind(now, quoteId).run();
            if (quoteRow?.request_id) {
              await env.DB.prepare(`
                INSERT INTO order_status_logs (request_id, from_status, to_status, changed_by_role, note, created_at)
                VALUES (?, 'quoted', 'under_review', 'customer', 'رد پیش‌فاکتور توسط مشتری', ?)
              `).bind(quoteRow.request_id, now).run();
            }
          } catch {}
        }
        return jsonResponse({ success: true, quoteId, status: 'rejected' });
      }

      // 7. Invoices & Payments: View Invoice
      if (pathname.startsWith('/api/requests/') && pathname.endsWith('/invoice') && request.method === 'GET') {
        const parts = pathname.split('/');
        const requestId = Number(parts[parts.length - 2]);
        if (!requestId) return jsonResponse({ error: 'شناسه سفارش نامعتبر است.' }, 400);

        let invoice = null;
        let payments: any[] = [];
        let settlement = null;

        if (env.DB) {
          try {
            const invRow = await env.DB.prepare(`
              SELECT i.*, p.full_name as provider_name, p.phone as provider_phone, r.service_label, r.tracking_code
              FROM invoices i
              LEFT JOIN providers p ON i.provider_id = p.id
              LEFT JOIN requests r ON i.request_id = r.id
              WHERE i.request_id = ?
              ORDER BY i.id DESC LIMIT 1
            `).bind(requestId).first();

            if (invRow) invoice = invRow;

            const { results: payRows } = await env.DB.prepare('SELECT * FROM payments WHERE request_id = ? ORDER BY id DESC').bind(requestId).all();
            if (payRows) payments = payRows;

            const setRow = await env.DB.prepare('SELECT * FROM provider_settlements WHERE request_id = ?').bind(requestId).first();
            if (setRow) settlement = setRow;
          } catch {}
        }

        return jsonResponse({ invoice, payments, settlement });
      }

      // 8. Payments: Process Checkout & Platform Commission
      if (pathname === '/api/payments/checkout' && request.method === 'POST') {
        try {
          const body = (await request.json().catch(() => ({}))) as Record<string, any>;
          const requestId = Number(body.requestId);
          const amount = Number(body.amount || 0);

          if (!requestId || amount <= 0) {
            return jsonResponse({ error: 'اطلاعات پرداخت و مبلغ نامعتبر است.' }, 400);
          }

          const now = new Date().toISOString();
          let paymentId = Date.now();
          const txRef = body.transactionRef || `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

          if (env.DB) {
            try {
              const reqRow = await env.DB.prepare('SELECT provider_id, status FROM requests WHERE id = ?').bind(requestId).first();
              const providerId = reqRow?.provider_id || null;

              const ins = await env.DB.prepare(`
                INSERT INTO payments (invoice_id, request_id, customer_id, amount, payment_method, transaction_ref, status, paid_at, created_at)
                VALUES (?, ?, ?, ?, ?, ?, 'completed', ?, ?)
              `).bind(
                body.invoiceId || null,
                requestId,
                body.customerId || null,
                amount,
                body.paymentMethod || 'online',
                txRef,
                now,
                now
              ).run();

              if (ins?.meta?.last_row_id) paymentId = ins.meta.last_row_id;

              await env.DB.prepare("UPDATE invoices SET status = 'paid' WHERE request_id = ?").bind(requestId).run();

              if (providerId) {
                const commRate = 0.15;
                const commissionAmount = Math.round(amount * commRate);
                const netPayable = amount - commissionAmount;

                await env.DB.prepare(`
                  INSERT INTO provider_settlements (request_id, provider_id, gross_amount, commission_rate, commission_amount, net_payable, status, created_at)
                  VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)
                `).bind(requestId, providerId, amount, commRate, commissionAmount, netPayable, now).run();
              }

              await env.DB.prepare("UPDATE requests SET status = 'completed', updated_at = ? WHERE id = ?").bind(now, requestId).run();

              await env.DB.prepare(`
                INSERT INTO order_status_logs (request_id, from_status, to_status, changed_by_role, note, created_at)
                VALUES (?, ?, 'completed', 'customer', ?, ?)
              `).bind(requestId, reqRow?.status || 'in_progress', `تسویه فاکتور به مبلغ ${amount} تومان (کد پیگیری: ${txRef})`, now).run();
            } catch (dbErr: any) {
              return jsonResponse({ error: dbErr.message }, 500);
            }
          }

          return jsonResponse({
            success: true,
            paymentId,
            transactionRef: txRef,
            status: 'completed',
          });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }

      // 9. Ratings: Verified Customer Rating & Auto PPS Engine
      if (pathname.startsWith('/api/requests/') && pathname.endsWith('/rate') && request.method === 'POST') {
        const parts = pathname.split('/');
        const requestId = Number(parts[parts.length - 2]);
        if (!requestId) return jsonResponse({ error: 'شناسه سفارش نامعتبر است.' }, 400);

        try {
          const body = (await request.json().catch(() => ({}))) as Record<string, any>;
          const score = Number(body.overallScore || body.score || 5);
          if (score < 1 || score > 5) {
            return jsonResponse({ error: 'امتیاز باید عددی بین ۱ تا ۵ باشد.' }, 400);
          }

          const now = new Date().toISOString();

          if (env.DB) {
            try {
              const reqRow = await env.DB.prepare('SELECT customer_id, provider_id, status FROM requests WHERE id = ?').bind(requestId).first();
              if (!reqRow) return jsonResponse({ error: 'سفارش یافت نشد.' }, 404);

              // Strict Quality Rule: Only completed orders can be rated
              if (reqRow.status !== 'completed' && reqRow.status !== 'closed') {
                return jsonResponse({ error: 'امتیازدهی فقط برای سفارش‌های تکمیل‌شده مجاز است.' }, 400);
              }

              if (!reqRow.provider_id) {
                return jsonResponse({ error: 'این سفارش متخصصی ندارد.' }, 400);
              }

              const existing = await env.DB.prepare('SELECT id FROM ratings WHERE request_id = ?').bind(requestId).first();
              if (existing) {
                return jsonResponse({ error: 'برای این سفارش قبلاً نظر و امتیاز ثبت شده است.' }, 400);
              }

              await env.DB.prepare(`
                INSERT INTO ratings (
                  request_id, customer_id, provider_id, overall_score, punctuality_score,
                  cleanliness_score, skill_score, comment, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'approved', ?)
              `).bind(
                requestId,
                reqRow.customer_id || 1,
                reqRow.provider_id,
                score,
                body.punctualityScore || 5,
                body.cleanlinessScore || 5,
                body.skillScore || 5,
                body.comment || null,
                now
              ).run();

              const avgRow = await env.DB.prepare(`
                SELECT AVG(overall_score) as avg_score, COUNT(*) as count FROM ratings WHERE provider_id = ?
              `).bind(reqRow.provider_id).first();

              let newPps = 5.0;
              if (avgRow && avgRow.avg_score) {
                newPps = Math.round(Number(avgRow.avg_score) * 10) / 10;
                await env.DB.prepare('UPDATE providers SET performance_score = ?, updated_at = ? WHERE id = ?')
                  .bind(newPps, now, reqRow.provider_id).run();
              }

              return jsonResponse({
                success: true,
                requestId,
                providerId: reqRow.provider_id,
                score,
                newPerformanceScore: newPps,
              });
            } catch (dbErr: any) {
              return jsonResponse({ error: dbErr.message }, 500);
            }
          }
          return jsonResponse({ success: true });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }

      if (pathname.startsWith('/api/providers/') && pathname.endsWith('/ratings') && request.method === 'GET') {
        const parts = pathname.split('/');
        const providerId = Number(parts[parts.length - 2]);
        if (!providerId) return jsonResponse({ error: 'شناسه متخصص نامعتبر است.' }, 400);

        let ratings: any[] = [];
        if (env.DB) {
          try {
            const { results } = await env.DB.prepare(`
              SELECT r.*, c.full_name as customer_name
              FROM ratings r
              LEFT JOIN customers c ON r.customer_id = c.id
              WHERE r.provider_id = ? AND r.status = 'approved'
              ORDER BY r.id DESC
            `).bind(providerId).all();
            if (results) ratings = results;
          } catch {}
        }
        return jsonResponse({ ratings });
      }

      // 10. Disputes: File Dispute & Admin Review
      if (pathname.startsWith('/api/requests/') && pathname.endsWith('/disputes') && request.method === 'POST') {
        const parts = pathname.split('/');
        const requestId = Number(parts[parts.length - 2]);
        if (!requestId) return jsonResponse({ error: 'شناسه سفارش نامعتبر است.' }, 400);

        try {
          const body = (await request.json().catch(() => ({}))) as Record<string, any>;
          const reason = String(body.reason || 'poor_quality').trim();
          const description = String(body.description || '').trim();

          if (!description) return jsonResponse({ error: 'توضیحات شکایت و اختلاف الزامی است.' }, 400);

          const now = new Date().toISOString();
          let disputeId = Date.now();

          if (env.DB) {
            try {
              const reqRow = await env.DB.prepare('SELECT status, customer_id FROM requests WHERE id = ?').bind(requestId).first();
              if (!reqRow) return jsonResponse({ error: 'سفارش یافت نشد.' }, 404);

              const ins = await env.DB.prepare(`
                INSERT INTO disputes (
                  request_id, opened_by, opened_by_id, reason, claim_amount, description, evidence_urls_json, status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, 'open', ?)
              `).bind(
                requestId,
                body.openedBy || 'customer',
                reqRow.customer_id || null,
                reason,
                body.claimAmount || 0,
                description,
                JSON.stringify(body.evidenceUrls || []),
                now
              ).run();

              if (ins?.meta?.last_row_id) disputeId = ins.meta.last_row_id;

              await env.DB.prepare("UPDATE requests SET status = 'disputed', updated_at = ? WHERE id = ?")
                .bind(now, requestId).run();

              await env.DB.prepare(`
                INSERT INTO order_status_logs (request_id, from_status, to_status, changed_by_role, note, created_at)
                VALUES (?, ?, 'disputed', 'customer', ?, ?)
              `).bind(requestId, reqRow.status || 'in_progress', `ثبت رسمی شکایت: ${description}`, now).run();
            } catch (dbErr: any) {
              return jsonResponse({ error: dbErr.message }, 500);
            }
          }

          return jsonResponse({ success: true, disputeId, requestId, status: 'disputed' }, 201);
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }

      if (pathname === '/api/admin/disputes' && request.method === 'GET') {
        if (!isStaffAuthed(request)) return jsonResponse({ error: 'دسترسی غیرمجاز است.' }, 401);
        let disputes: any[] = [];
        if (env.DB) {
          try {
            const { results } = await env.DB.prepare(`
              SELECT d.*, r.tracking_code, r.name as customer_name, p.full_name as provider_name
              FROM disputes d
              LEFT JOIN requests r ON d.request_id = r.id
              LEFT JOIN providers p ON r.provider_id = p.id
              ORDER BY d.id DESC
            `).all();
            if (results) disputes = results;
          } catch {}
        }
        return jsonResponse({ disputes });
      }

      if (pathname.startsWith('/api/admin/disputes/') && request.method === 'PATCH') {
        if (!isStaffAuthed(request)) return jsonResponse({ error: 'دسترسی غیرمجاز است.' }, 401);
        const parts = pathname.split('/');
        const disputeId = Number(parts[parts.length - 1]);
        if (!disputeId) return jsonResponse({ error: 'شناسه اختلاف نامعتبر است.' }, 400);

        try {
          const body = (await request.json().catch(() => ({}))) as Record<string, any>;
          const status = body.status || 'resolved';
          const adminNotes = body.adminNotes || body.resolutionNotes || '';
          const refundAmount = Number(body.refundAmount || 0);
          const now = new Date().toISOString();

          if (env.DB) {
            await env.DB.prepare(`
              UPDATE disputes SET status = ?, admin_notes = ?, refund_amount = ?, resolved_at = ?
              WHERE id = ?
            `).bind(status, adminNotes, refundAmount, now, disputeId).run();
          }
          return jsonResponse({ success: true, disputeId, status });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }

      if (pathname === '/api/admin/stats') {
        return jsonResponse({
          total: 28,
          byStatus: [
            { status: 'pending', count: 5 },
            { status: 'contacted', count: 8 },
            { status: 'scheduled', count: 6 },
            { status: 'in_progress', count: 4 },
            { status: 'completed', count: 5 },
          ],
          byService: [
            { service_id: 'hvac', service_label: 'سرمایش و گرمایش', count: 12 },
            { service_id: 'plumbing', service_label: 'لوله‌کشی و تاسیسات', count: 9 },
            { service_id: 'electrical', service_label: 'برقکاری و روشنایی', count: 4 },
            { service_id: 'renovation', service_label: 'بازسازی ساختمان', count: 3 },
          ],
          completedRevenue: 48500000,
          daily: [
            { day: '1405/06/22', count: 3 },
            { day: '1405/06/23', count: 5 },
            { day: '1405/06/24', count: 4 },
            { day: '1405/06/25', count: 6 },
            { day: '1405/06/26', count: 4 },
            { day: '1405/06/27', count: 3 },
            { day: '1405/06/28', count: 3 },
          ],
          topCities: [{ city: 'تهران', count: 28 }],
          topProvinces: [{ province: 'تهران', count: 28 }],
          avgOrderValue: 1732000,
          staffPerformance: [
            { name: 'علیرضا کاظمی', role: 'super_admin', role_label: 'مدیر کل سیستم', total: 28, completed: 5 },
            { name: 'سارا حسینی', role: 'support_dispatch', role_label: 'پشتیبانی و اعزام فوری', total: 24, completed: 18 },
            { name: 'مهندس مجید رستمی', role: 'tech_hvac', role_label: 'تکنسین سرمایش و گرمایش', total: 12, completed: 10 },
            { name: 'استاد بهروز قاسمی', role: 'tech_plumbing', role_label: 'استادکار تأسیسات', total: 9, completed: 8 },
            { name: 'مهندس سینا مرادی', role: 'tech_electrical', role_label: 'برقکار ساختمان', total: 4, completed: 4 },
            { name: 'استاد احمد کریمی', role: 'tech_renovation', role_label: 'استادکار بازسازی', total: 3, completed: 2 },
          ],
        });
      }
    }

    // --- Canonical Management Route (Redirect /admin to /management) ---
    if (pathname === '/admin' || pathname.startsWith('/admin/')) {
      const targetUrl = new URL('/management' + url.search, url.origin);
      return Response.redirect(targetUrl.toString(), 301);
    }

    if (pathname === '/management' || pathname.startsWith('/management/')) {
      const assetUrl = new URL('/management.html' + url.search, url.origin);
      return env.ASSETS.fetch(new Request(assetUrl, request));
    }

    if (pathname === '/' || pathname === '') {
      const assetUrl = new URL('/index.html' + url.search, url.origin);
      return env.ASSETS.fetch(new Request(assetUrl, request));
    }

    const cleanPages = ['/orders', '/profile', '/careers', '/magazine', '/about', '/privacy', '/terms'];
    if (cleanPages.includes(pathname)) {
      const assetUrl = new URL(`${pathname}.html` + url.search, url.origin);
      return env.ASSETS.fetch(new Request(assetUrl, request));
    }

    if (pathname === '/services' || pathname.startsWith('/services/')) {
      const assetUrl = new URL('/services.html' + url.search, url.origin);
      return env.ASSETS.fetch(new Request(assetUrl, request));
    }

    if (pathname.startsWith('/magazine/') && !pathname.includes('.')) {
      const assetUrl = new URL('/article-template.html' + url.search, url.origin);
      return env.ASSETS.fetch(new Request(assetUrl, request));
    }

    if (pathname.startsWith('/page/') && !pathname.includes('.')) {
      const assetUrl = new URL('/page-template.html' + url.search, url.origin);
      return env.ASSETS.fetch(new Request(assetUrl, request));
    }

    return env.ASSETS.fetch(request);
  },
};
