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
          },
          licenseLocked: false,
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
          const trackingCode = 'BHD-' + Math.floor(100000 + Math.random() * 900000);
          if (env.DB) {
            try {
              await env.DB.prepare(
                'INSERT INTO requests (name, phone, service_id, status) VALUES (?, ?, ?, ?)'
              )
                .bind(data.customerName || data.name || '', data.phone || '', data.serviceId || data.service_id || 'hvac', 'pending')
                .run();
            } catch {}
          }
          return jsonResponse({ trackingCode, success: true });
        } catch (err: any) {
          return jsonResponse({ error: err.message }, 500);
        }
      }

      if ((pathname === '/api/admin/requests' || pathname === '/api/requests') && request.method === 'GET') {
        let requestsList: any[] = [];
        if (env.DB) {
          try {
            const { results } = await env.DB.prepare('SELECT * FROM requests ORDER BY id DESC').all();
            if (results && results.length > 0) {
              requestsList = results.map((r: any) => ({
                id: r.id,
                trackingCode: 'BHD-' + (1000 + r.id),
                customerName: r.name,
                serviceId: r.service_id,
                serviceLabel: r.service_id,
                originProvince: 'تهران',
                originCity: 'تهران',
                phone: r.phone,
                status: r.status || 'pending',
                scheduledDate: '1405/06/28',
                scheduledTime: '10:00 - 12:00',
                estimateAvg: 1800000,
                createdAt: r.created_at || new Date().toISOString(),
                updatedAt: r.created_at || new Date().toISOString(),
              }));
            }
          } catch {}
        }
        return jsonResponse({ requests: requestsList });
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
            { name: 'مدیر کل بهدون', role: 'super_admin', role_label: 'مدیر کل سیستم', total: 28, completed: 5 },
          ],
        });
      }
    }

    // --- HTML Routes & Exact Asset Rewrites (with html_handling: "none") ---
    if (
      pathname === '/management' ||
      pathname.startsWith('/management/') ||
      pathname === '/admin' ||
      pathname.startsWith('/admin/')
    ) {
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
