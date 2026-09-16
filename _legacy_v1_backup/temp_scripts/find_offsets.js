const fs = require('fs');
const code = fs.readFileSync('src/frontend.js', 'utf8');
const pIdx = code.indexOf('"plumbing": {');
const eIdx = code.indexOf('"electrical": {');
const rIdx = code.indexOf('"renovation": {');
const endIdx = code.indexOf('export function renderServicePage');
console.log({ pIdx, eIdx, rIdx, endIdx });
