const fs = require('fs');
let code = fs.readFileSync('worker.js', 'utf8');

// replace export default
code = code.replace(/export default {[\s\S]*?async fetch\(request, env, ctx\) {/, 'async function workerFetch(request, env, ctx) {');

// remove trailing }, };
code = code.replace(/},\s*};\s*$/, '');

code += `
(async () => {
  const req = { url: 'https://behdoon.ir/services/hvac' };
  try {
    const res = await workerFetch(req, {}, {});
    console.log('Status:', res.status);
    const text = await res.text();
    console.log(text.substring(0, 100));
  } catch (e) {
    console.log('WORKER ERROR:', e);
  }
})();
`;
fs.writeFileSync('test_worker_2.js', code);
