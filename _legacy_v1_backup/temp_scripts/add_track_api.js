const fs = require('fs');
let code = fs.readFileSync('worker.js', 'utf8');

const trackApiLogic = `
    if (url.pathname === '/api/requests/track' && request.method === 'GET') {
        try {
            const phone = url.searchParams.get('phone');
            if (!phone) {
                return new Response(JSON.stringify({ error: 'شماره موبایل الزامی است' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
            }
            if (env.DB) {
                const { results } = await env.DB.prepare("SELECT * FROM requests WHERE phone = ? ORDER BY id DESC").bind(phone).all();
                return new Response(JSON.stringify(results), { status: 200, headers: { 'Content-Type': 'application/json' } });
            } else {
                return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
    }
`;

const insertPosStr = "if (url.pathname === '/api/requests' && request.method === 'GET') {";
const insertIdx = code.indexOf(insertPosStr);

if(insertIdx !== -1) {
    code = code.substring(0, insertIdx) + trackApiLogic + '\n    ' + code.substring(insertIdx);
    fs.writeFileSync('worker.js', code);
    console.log('Track API added');
} else {
    console.log('Could not find insert pos');
}
