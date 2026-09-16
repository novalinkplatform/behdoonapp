const fs = require('fs');
const content = fs.readFileSync('src/frontend.js', 'utf8');

const heroSectionIdx = content.indexOf('<!-- ================= HERO SECTION (Clear & Legible) ================= -->');
const heroSnippet = content.substring(heroSectionIdx, heroSectionIdx + 1200);

console.log('Hero section snippet:\n', heroSnippet);
console.log('Contains "خدمات حرفه‌ای ساختمان در تهران":', heroSnippet.includes('خدمات حرفه‌ای ساختمان در تهران'));
console.log('Contains "خدمات حرفه‌ای ساختمان":', heroSnippet.includes('خدمات حرفه‌ای ساختمان'));
