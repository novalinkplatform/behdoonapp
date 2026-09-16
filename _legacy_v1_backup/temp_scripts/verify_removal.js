const fs = require('fs');
const content = fs.readFileSync('src/frontend.js', 'utf8');

// Find header in html
const htmlStart = content.indexOf('export const html = `');
const htmlEnd = content.indexOf('export const trackHTML = `');
const htmlCode = content.substring(htmlStart, htmlEnd);

// Check occurrences of "خدمات حرفه‌ای ساختمان در تهران" in htmlCode
console.log('Total occurrences in html page:', htmlCode.split('خدمات حرفه‌ای ساختمان در تهران').length - 1);

// Find where header ends in htmlCode
const headerEnd = htmlCode.indexOf('</header>');
const belowHeader = htmlCode.substring(headerEnd, htmlCode.indexOf('<!-- ================= TESTIMONIALS SLIDER'));

console.log('Does belowHeader contain "خدمات حرفه‌ای ساختمان در تهران"?', belowHeader.includes('خدمات حرفه‌ای ساختمان در تهران'));
console.log('Snippet of belowHeader:');
console.log(belowHeader.substring(0, 500));
