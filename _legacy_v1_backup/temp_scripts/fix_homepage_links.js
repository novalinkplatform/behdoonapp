const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

// Replace category 1 (Tasisat)
content = content.replace(/<a href="#services-detail"([\s\S]*?)تأسیسات ساختمان/g, '<a href="/services/tasisat"$1تأسیسات ساختمان');

// Replace category 2 (Electrical)
content = content.replace(/<a href="#services-detail"([\s\S]*?)برق‌کشی و روشنایی/g, '<a href="/services/electrical"$1برق‌کشی و روشنایی');

// Replace category 3 (Renovation)
content = content.replace(/<a href="#services-detail"([\s\S]*?)بازسازی و دکوراسیون/g, '<a href="/services/renovation"$1بازسازی و دکوراسیون');

// Replace category 4 (Construction)
content = content.replace(/<a href="#services-detail"([\s\S]*?)خدمات بنایی و عمرانی/g, '<a href="/services/construction"$1خدمات بنایی و عمرانی');

fs.writeFileSync('worker.js', content);
console.log('Homepage Links Fixed.');
