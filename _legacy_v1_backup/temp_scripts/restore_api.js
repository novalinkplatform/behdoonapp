const fs = require('fs');
let code = fs.readFileSync('worker.js', 'utf8');

const apiLogic = `
    const url = new URL(request.url);
    const path = url.pathname;

    // --- API ROUTES ---
    if (path.startsWith('/api/')) {
        try {
            if (path === '/api/requests' && request.method === 'POST') {
                const data = await request.json();
                if (env.DB) {
                    await env.DB.prepare("INSERT INTO requests (name, phone, service_id) VALUES (?, ?, ?)")
                        .bind(data.name, data.phone, data.service_id).run();
                }
                return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }
            if (path === '/api/requests' && request.method === 'GET') {
                if (env.DB) {
                    const { results } = await env.DB.prepare("SELECT * FROM requests ORDER BY id DESC").all();
                    return new Response(JSON.stringify(results), { status: 200, headers: { 'Content-Type': 'application/json' } });
                }
                return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }
            if (path === '/api/requests/update' && request.method === 'POST') {
                const data = await request.json();
                if (env.DB) {
                    await env.DB.prepare("UPDATE requests SET status = ? WHERE id = ?").bind(data.status, data.id).run();
                }
                return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }
            if (path === '/api/requests/track' && request.method === 'GET') {
                const phone = url.searchParams.get('phone');
                if (!phone) {
                    return new Response(JSON.stringify({ error: 'شماره موبایل الزامی است' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
                }
                if (env.DB) {
                    const { results } = await env.DB.prepare("SELECT * FROM requests WHERE phone = ? ORDER BY id DESC").bind(phone).all();
                    return new Response(JSON.stringify(results), { status: 200, headers: { 'Content-Type': 'application/json' } });
                }
                return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }
            if (path === '/api/settings' && request.method === 'GET') {
                if (env.DB) {
                    const { results } = await env.DB.prepare("SELECT key, value FROM settings").all();
                    let settings = {};
                    results.forEach(row => settings[row.key] = row.value);
                    return new Response(JSON.stringify(settings), { status: 200, headers: { 'Content-Type': 'application/json' } });
                }
                return new Response(JSON.stringify({}), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }
            if (path === '/api/settings' && request.method === 'POST') {
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
                return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }
            return new Response('Not Found', { status: 404 });
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
    }
    // --- END API ROUTES ---
`;

const insertPos = code.indexOf('async fetch(request, env, ctx) {') + 'async fetch(request, env, ctx) {'.length;
code = code.substring(0, insertPos) + '\n' + apiLogic + code.substring(insertPos);
// We also need to remove the duplicate `const url = new URL(request.url); const path = url.pathname;` further down.
code = code.replace('const url = new URL(request.url);\n    const path = url.pathname;', '');
fs.writeFileSync('worker.js', code);
console.log('Restored API routes');
