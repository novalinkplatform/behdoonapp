const fs = require('fs');

let code = fs.readFileSync('src/frontend.js', 'utf8');

const target1 = "let customHeader = headerHTML\n        .replace('<title>بهدون؛ خدمات حرفه ای ساختمان در تهران</title>', '<title>' + data.title + '</title>')";
const targetIdx = code.indexOf(target1);
const heroSectionIdx = code.indexOf('const heroSection = `\n        <div class="pt-8 pb-4 bg-gradient-to-b from-brand-50/60 to-transparent">', targetIdx);

console.log('targetIdx:', targetIdx, 'heroSectionIdx:', heroSectionIdx);

const cleanBridge = `let customHeader = headerHTML
        .replace('<title>بهدون؛ خدمات حرفه ای ساختمان در تهران</title>', '<title>' + data.title + '</title>')
        .replace('content="تشخیص ترکیدگی لوله با دستگاه نقطه زن، لوله بازکنی و تعمیرات تاسیسات با ضمانت کتبی در تهران."', 'content="' + data.metaDesc + '"');

    return customHeader + heroSection + subServicesHtml + contentSection + footerHTML;
}

export function renderSubServicePage(categoryId, subIndex) {
    const data = servicesData[categoryId];
    if (!data) return '404';
    const sub = data.subServices && data.subServices[subIndex];
    if (!sub) return '404';

    const subTitle = \`\${sub.name} در تهران | خدمات فوری با ضمانت بهدون\`;
    const subMetaDesc = \`ارائه تخصصی \${sub.name} در تمام مناطق ۲۲ گانه تهران توسط تکنسین‌های مجرب بهدون با قطعات اصلی، اعزام فوری زیر ۴۵ دقیقه و ضمانت کتبی کیفیت.\`;
    const canonicalUrl = \`https://behdoon.ir/services/\${categoryId}/\${sub.slug}\`;

    const breadcrumbs = \`
        <nav class="hidden md:flex text-xs text-slate-500 mb-4 justify-start overflow-x-auto hide-scrollbar" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 space-x-reverse md:space-x-2 bg-white/80 backdrop-blur-sm border border-slate-200/80 shadow-sm rounded-xl px-4 py-2 whitespace-nowrap text-xs">
                <li class="inline-flex items-center">
                    <a href="/" class="inline-flex items-center hover:text-brand-600 transition-colors">
                        <svg class="w-3.5 h-3.5 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                        خانه
                    </a>
                </li>
                <li>
                    <div class="flex items-center">
                        <svg class="w-3.5 h-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                        <a href="/#services" class="mr-1 hover:text-brand-600 transition-colors">خدمات</a>
                    </div>
                </li>
                <li>
                    <div class="flex items-center">
                        <svg class="w-3.5 h-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                        <a href="/services/\${categoryId}" class="mr-1 hover:text-brand-600 transition-colors">\${data.title.split('|')[0].trim()}</a>
                    </div>
                </li>
                <li aria-current="page">
                    <div class="flex items-center">
                        <svg class="w-3.5 h-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                        <span class="mr-1 text-[#8B1C31] font-bold">\${sub.name}</span>
                    </div>
                </li>
            </ol>
        </nav>
    \`;

    `;

code = code.substring(0, targetIdx) + cleanBridge + code.substring(heroSectionIdx);
fs.writeFileSync('src/frontend.js', code, 'utf8');
console.log('Successfully fixed bridge in frontend.js!');
