export async function handleApiRequest(request, env, path) {
    const method = request.method;
    const url = new URL(request.url);

    try {
        if (path === '/api/requests' && method === 'POST') {
            const data = await request.json();
            const trackingCode = 'BEH-' + Math.floor(1000 + Math.random() * 9000);
            
            if (env.DB) {
                await env.DB.prepare("INSERT INTO requests (name, phone, service_id, tracking_code, lat, lng, description) VALUES (?, ?, ?, ?, ?, ?, ?)")
                    .bind(data.name || '', data.phone, data.service_id, trackingCode, data.lat || '', data.lng || '', data.description || '').run();
            }
            return new Response(JSON.stringify({ success: true, tracking_code: trackingCode }), { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0', 'Pragma': 'no-cache', 'Expires': '0', 'Surrogate-Control': 'no-store' } });
        }
        if (path === '/api/requests' && method === 'GET') {
            if (env.DB) {
                const { results } = await env.DB.prepare("SELECT * FROM requests ORDER BY id DESC").all();
                return new Response(JSON.stringify(results), { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0', 'Pragma': 'no-cache', 'Expires': '0', 'Surrogate-Control': 'no-store' } });
            }
            return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0', 'Pragma': 'no-cache', 'Expires': '0', 'Surrogate-Control': 'no-store' } });
        }
        if (path === '/api/requests/update' && method === 'POST') {
            const data = await request.json();
            if (env.DB) {
                await env.DB.prepare("UPDATE requests SET status = ? WHERE id = ?").bind(data.status, data.id).run();
            }
            return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0', 'Pragma': 'no-cache', 'Expires': '0', 'Surrogate-Control': 'no-store' } });
        }
        if (path === '/api/requests/track' && method === 'GET') {
            const phone = url.searchParams.get('phone');
            if (!phone) {
                return new Response(JSON.stringify({ error: 'شماره موبایل الزامی است' }), { status: 400, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0', 'Pragma': 'no-cache', 'Expires': '0', 'Surrogate-Control': 'no-store' } });
            }
            if (env.DB) {
                // Now check tracking code OR phone
                const { results } = await env.DB.prepare("SELECT * FROM requests WHERE phone = ? OR tracking_code = ? ORDER BY id DESC").bind(phone, phone).all();
                return new Response(JSON.stringify(results), { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0', 'Pragma': 'no-cache', 'Expires': '0', 'Surrogate-Control': 'no-store' } });
            }
            return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0', 'Pragma': 'no-cache', 'Expires': '0', 'Surrogate-Control': 'no-store' } });
        }
        if (path === '/api/settings' && method === 'GET') {
            if (env.DB) {
                const { results } = await env.DB.prepare("SELECT key, value FROM settings").all();
                let settings = {};
                results.forEach(row => settings[row.key] = row.value);
                return new Response(JSON.stringify(settings), { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0', 'Pragma': 'no-cache', 'Expires': '0', 'Surrogate-Control': 'no-store' } });
            }
            return new Response(JSON.stringify({}), { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0', 'Pragma': 'no-cache', 'Expires': '0', 'Surrogate-Control': 'no-store' } });
        }
        if (path === '/api/settings' && method === 'POST') {
            const authHeader = request.headers.get('Authorization');
            if (authHeader !== 'Basic YWRtaW46MTIz') {
                return new Response('Unauthorized', { status: 401 });
            }
            const data = await request.json();
            if (env.DB) {
                for (const [k, v] of Object.entries(data)) {
                    await env.DB.prepare("INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").bind(k, v).run();
                }
            }
            return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0', 'Pragma': 'no-cache', 'Expires': '0', 'Surrogate-Control': 'no-store' } });
        }
        return new Response('Not Found', { status: 404 });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0', 'Pragma': 'no-cache', 'Expires': '0', 'Surrogate-Control': 'no-store' } });
    }
}
