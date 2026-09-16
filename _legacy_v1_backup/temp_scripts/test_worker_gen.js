const fs = require('fs');
let code = fs.readFileSync('worker.js', 'utf8');
code = code.replace(/export default {[\s\S]*?async fetch\(request, env, ctx\) {/, 'async function fetch(request, env, ctx) {');
code += `
(async () => {
  const req = { url: 'https://behdoon.ir/services/hvac' };
  try {
    const res = await fetch(req, {}, {});
    console.log(res);
  } catch (e) {
    console.log('ERROR:', e);
  }
})();
`;
fs.writeFileSync('test_worker.js', code);
