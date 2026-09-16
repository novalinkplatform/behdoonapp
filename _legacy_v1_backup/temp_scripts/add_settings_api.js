const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const newApis = `
    if (url.pathname === '/api/settings' && request.method === 'GET') {
        try {
            if (env.DB) {
                const { results } = await env.DB.prepare("SELECT key, value FROM settings").all();
                const settings = {};
                results.forEach(row => settings[row.key] = row.value);
                return new Response(JSON.stringify(settings), { status: 200, headers: { 'Content-Type': 'application/json' } });
            } else {
                return new Response(JSON.stringify({}), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
    }

    if (url.pathname === '/api/settings' && request.method === 'POST') {
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== 'Basic YWRtaW46MTIz') return new Response('Unauthorized', { status: 401 });
        try {
            const body = await request.json();
            if (env.DB) {
                const stmt = env.DB.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
                const batch = [];
                for (const [key, value] of Object.entries(body)) {
                    batch.push(stmt.bind(key, value));
                }
                await env.DB.batch(batch);
                return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
    }
`;

const insertPointStr = "    if (url.pathname === '/api/requests' && request.method === 'POST') {";
const insertIdx = content.indexOf(insertPointStr);
content = content.substring(0, insertIdx) + newApis + '\n' + content.substring(insertIdx);
fs.writeFileSync('worker.js', content);
console.log('API added');
