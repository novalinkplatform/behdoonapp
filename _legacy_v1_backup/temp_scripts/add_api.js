const fs = require('fs');
let currentWorker = fs.readFileSync('worker.js', 'utf8');

const apiHandler = `
    // Handle API requests
    const url = new URL(request.url);
    if (url.pathname === '/api/requests' && request.method === 'POST') {
        try {
            const body = await request.json();
            const { name, phone, service_id } = body;
            
            if (!name || !phone || !service_id) {
                return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
            }
            
            if (env.DB) {
                const result = await env.DB.prepare(
                    "INSERT INTO requests (name, phone, service_id) VALUES (?, ?, ?)"
                ).bind(name, phone, service_id).run();
                return new Response(JSON.stringify({ success: true, id: result.lastRowId }), { status: 200, headers: { 'Content-Type': 'application/json' } });
            } else {
                return new Response(JSON.stringify({ error: 'DB not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
            }
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
    }
    
    if (url.pathname === '/api/requests' && request.method === 'GET') {
        try {
            if (env.DB) {
                const { results } = await env.DB.prepare("SELECT * FROM requests ORDER BY id DESC LIMIT 50").all();
                return new Response(JSON.stringify(results), { status: 200, headers: { 'Content-Type': 'application/json' } });
            } else {
                return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
    }
`;

const insertPos = currentWorker.indexOf('let htmlResponse = \'\';');
currentWorker = currentWorker.substring(0, insertPos) + apiHandler + '\n    ' + currentWorker.substring(insertPos);
fs.writeFileSync('worker.js', currentWorker);
console.log('API handlers added.');
