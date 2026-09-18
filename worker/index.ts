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
              await env.DB.prepare(
                'CREATE TABLE IF NOT EXISTS daily_order_counters (day_key TEXT PRIMARY KEY, count INTEGER NOT NULL DEFAULT 1)'
              ).run();

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

          const counterStr = dailyCount < 100 ? String(dailyCount).padStart(2, '0') : String(dailyCount);
          const trackingCode = `${datePrefix}${counterStr}`;

          if (env.DB) {
            try {
              await env.DB.prepare(
                `CREATE TABLE IF NOT EXISTS requests (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  tracking_code TEXT UNIQUE,
                  name TEXT,
                  phone TEXT,
                  service_id TEXT,
                  service_label TEXT,
                  origin_province TEXT,
                  origin_city TEXT,
                  origin_notes TEXT,
                  origin_property_type TEXT,
                  origin_lat REAL,
                  origin_lng REAL,
                  scheduled_date TEXT,
                  scheduled_time TEXT,
                  estimate_avg INTEGER,
                  status TEXT DEFAULT 'pending',
                  created_at TEXT
                )`
              ).run();

              await env.DB.prepare(
                `INSERT INTO requests (
                  tracking_code, name, phone, service_id, service_label,
                  origin_province, origin_city, origin_notes, origin_property_type,
                  origin_lat, origin_lng, scheduled_date, scheduled_time, estimate_avg,
                  status, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
              )
                .bind(
                  trackingCode,
                  data.customerName || data.name || '',
                  data.phone || '',
                  data.serviceId || 'hvac',
                  data.serviceLabel || 'سرمایش و گرمایش',
                  'تهران',
                  'تهران',
                  data.originNotes || data.locationNotes || data.address || '',
                  data.originPropertyType || data.propertyType || 'residential',
                  data.originLat ?? data.lat ?? 35.7219,
                  data.originLng ?? data.lng ?? 51.3347,
                  data.scheduledDate || 'امروز',
                  data.scheduledTime || 'فوری',
                  data.estimateAvg || 1800000,
                  'pending',
                  new Date().toISOString()
                )
                .run();
            } catch {}
          }
          return jsonResponse({ trackingCode, success: true });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }

      if ((pathname === '/api/admin/requests' || pathname === '/api/requests') && request.method === 'GET') {
        const phoneParam = url.searchParams.get('phone');
        let requestsList: any[] = [];
        if (env.DB) {
          try {
            let results: any[] = [];
            if (phoneParam) {
              const queryRes = await env.DB.prepare('SELECT * FROM requests WHERE phone = ? ORDER BY id DESC').bind(phoneParam).all();
              results = (queryRes?.results as any[]) || [];
            } else {
              const queryRes = await env.DB.prepare('SELECT * FROM requests ORDER BY id DESC').all();
              results = (queryRes?.results as any[]) || [];
            }
            if (results && results.length > 0) {
              requestsList = results.map((r: any) => ({
                id: r.id,
                trackingCode: r.tracking_code || `${getShahanshahiDatePrefix()}${String(r.id < 100 ? r.id : r.id).padStart(2, '0')}`,
                customerName: r.name,
                serviceId: r.service_id,
                serviceLabel: r.service_label || r.service_id,
                originProvince: 'تهران',
                originCity: 'تهران',
                originNotes: r.origin_notes || '',
                originLat: r.origin_lat,
                originLng: r.origin_lng,
                originPropertyType: r.origin_property_type || 'residential',
                phone: r.phone,
                status: r.status || 'pending',
                scheduledDate: r.scheduled_date || '1405/06/28',
                scheduledTime: r.scheduled_time || '10:00 - 12:00',
                estimateAvg: r.estimate_avg || 1800000,
                createdAt: r.created_at || new Date().toISOString(),
                updatedAt: r.created_at || new Date().toISOString(),
              }));
            }
          } catch {}
        }
        return jsonResponse({ requests: requestsList });
      }

      // --- Plugins Endpoints ---
      if (pathname === '/api/admin/plugins' && request.method === 'GET') {
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

      if (pathname === '/api/customer/me') {
        const authHeader = request.headers.get('Authorization') || '';
        const token = authHeader.replace(/^Bearer\s+/i, '').trim();
        const phoneMatch = token.match(/(09\d{9})/);
        const phone = phoneMatch ? phoneMatch[1] : '09123456789';
        let fullName = 'مشتری گرامی بهدون';
        if (env.DB) {
          try {
            const row = await env.DB.prepare('SELECT name FROM requests WHERE phone = ? ORDER BY id DESC LIMIT 1').bind(phone).first();
            if (row?.name) fullName = String(row.name);
          } catch {}
        }
        return jsonResponse({
          customer: {
            id: 1,
            phone,
            fullName,
          },
        });
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
        return jsonResponse({ staff: BEHDOON_STAFF_MEMBERS });
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

      if (pathname.startsWith('/api/admin/requests/') && request.method === 'PATCH') {
        const parts = pathname.split('/');
        const id = Number(parts[parts.length - 1]);
        try {
          const data = (await request.json().catch(() => ({}))) as Record<string, any>;
          if (env.DB && id && data.status) {
            try {
              await env.DB.prepare('UPDATE requests SET status = ? WHERE id = ?')
                .bind(data.status, id)
                .run();
            } catch {}
          }
          return jsonResponse({ success: true });
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
