const fs = require('fs');
const content = fs.readFileSync('worker.js', 'utf8');

const sIdx = content.indexOf('const servicesData = {');
const eIdx = content.indexOf('};\n\n// --- INJECTED SERVICE PAGES ---');
console.log('ServicesData bounds:', sIdx, eIdx);

const cardsStart = content.indexOf('<section id="services" class="py-16 md:py-24 bg-white relative">');
const cardsEnd = content.indexOf('<!-- Features -->');
console.log('Cards bounds:', cardsStart, cardsEnd);
