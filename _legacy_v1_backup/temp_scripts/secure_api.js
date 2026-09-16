const fs = require('fs');
let currentWorker = fs.readFileSync('worker.js', 'utf8');

const targetApi = `if (url.pathname === '/api/requests' && request.method === 'GET') {
        try {`;

const replacementApi = `if (url.pathname === '/api/requests' && request.method === 'GET') {
        const authHeader = request.headers.get('Authorization');
        if (authHeader !== 'Basic YWRtaW46MTIz') {
            return new Response('Unauthorized', { status: 401 });
        }
        try {`;

currentWorker = currentWorker.replace(targetApi, replacementApi);
fs.writeFileSync('worker.js', currentWorker);
console.log('API Auth added');
