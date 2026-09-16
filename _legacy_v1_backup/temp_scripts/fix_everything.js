const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

let c1 = (content.match(/انواع خدمات ساختمان/g) || []).length;
console.log('Old Title Count before replace:', c1);

content = content.replace(/انواع خدمات ساختمان/g, 'خدمات بهدون');

const targetText1 = /<svg class="w-5 h-5 text-success-500"[^>]+>[\\s\\S]*?خدمات حرفه‌ای/g;
const replaceText1 = `<svg class="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"></path></svg>
                            خدمات حرفه‌ای`;

const targetText2 = /<svg class="w-5 h-5 text-success-500"[^>]+>[\\s\\S]*?نیروی متخصص و ماهر/g;
const replaceText2 = `<svg class="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path></svg>
                            نیروی متخصص و ماهر`;

const targetText3 = /<svg class="w-5 h-5 text-success-500"[^>]+>[\\s\\S]*?قیمت منصفانه/g;
const replaceText3 = `<svg class="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z"></path></svg>
                            قیمت منصفانه`;

const targetText4 = /<svg class="w-5 h-5 text-success-500"[^>]+>[\\s\\S]*?شفافیت و تعهد بالا/g;
const replaceText4 = `<svg class="w-5 h-5 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9.003 9.003 0 00-8.25-8.985V3.015a9.003 9.003 0 00-8.25 8.985c0 5.088 3.52 9.387 8.25 10.457 4.73-1.07 8.25-5.369 8.25-10.457z"></path></svg>
                            شفافیت و تعهد بالا`;

content = content.replace(targetText1, replaceText1);
content = content.replace(targetText2, replaceText2);
content = content.replace(targetText3, replaceText3);
content = content.replace(targetText4, replaceText4);

fs.writeFileSync('worker.js', content);
console.log('Successfully replaced everything.');
