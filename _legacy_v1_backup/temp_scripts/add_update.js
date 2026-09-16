const fs = require('fs');
let currentWorker = fs.readFileSync('worker.js', 'utf8');

const updateHandler = `
    if (url.pathname === '/api/requests/update' && request.method === 'POST') {
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== 'Basic YWRtaW46MTIz') return new Response('Unauthorized', { status: 401 });
        
        try {
            const body = await request.json();
            const { id, status } = body;
            if (!id || !status) return new Response('Missing fields', { status: 400 });
            
            if (env.DB) {
                await env.DB.prepare("UPDATE requests SET status = ? WHERE id = ?").bind(status, id).run();
                return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500 });
        }
    }
`;

const insertPos = currentWorker.indexOf("if (url.pathname === '/api/requests' && request.method === 'GET') {");
currentWorker = currentWorker.substring(0, insertPos) + updateHandler + '\n    ' + currentWorker.substring(insertPos);
fs.writeFileSync('worker.js', currentWorker);
console.log('Update handler added.');
