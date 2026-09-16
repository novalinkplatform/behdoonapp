const fs = require('fs');
const servicesData = require('./service_data.js');

let contentStr = fs.readFileSync('worker.js', 'utf8');

// The code we want to inject into worker.js
const renderServicePageLogic = `
// --- INJECTED SERVICE PAGES ---
const servicesData = ${JSON.stringify(servicesData, null, 2)};

function renderServicePage(serviceId) {
    const data = servicesData[serviceId];
    if (!data) return '404';

    const heroSection = \`
        <div class="bg-slate-50 pt-20 pb-16 border-b border-slate-200 relative overflow-hidden">
            <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNlMmU4ZjAiLz48L3N2Zz4=')] opacity-50"></div>
            <div class="container mx-auto px-4 max-w-5xl relative z-10 text-center">
                <div class="inline-flex items-center justify-center p-4 bg-brand-100 text-brand-600 rounded-2xl mb-6 shadow-sm border border-brand-200">
                    \${data.icon}
                </div>
                <h1 class="text-2xl md:text-4xl font-black text-slate-800 mb-6 leading-snug tracking-tight">\${data.title}</h1>
                <p class="text-slate-600 md:text-lg max-w-3xl mx-auto leading-relaxed mb-10">\${data.subtitle}</p>
                <div class="flex justify-center">
                    <a href="tel:\${PHONE}" class="inline-flex items-center gap-2 bg-success-500 hover:bg-success-600 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-1">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        تماس و ثبت درخواست
                    </a>
                </div>
            </div>
        </div>
    \`;

    let subServicesHtml = '';
    if (data.subServices && data.subServices.length > 0) {
        let cardsHtml = data.subServices.map(sub => \`
            <div class="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-300 transition-all group flex-none w-48 md:w-auto cursor-default">
                <div class="w-10 h-10 bg-slate-50 text-brand-500 rounded-xl flex items-center justify-center mb-4 group-hover:bg-brand-500 group-hover:text-white transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="\${sub.icon}"></path></svg>
                </div>
                <h3 class="font-bold text-slate-800 text-sm group-hover:text-brand-600 transition-colors">\${sub.name}</h3>
            </div>
        \`).join('');

        subServicesHtml = \`
            <div class="container mx-auto px-4 max-w-6xl -mt-6 relative z-20 mb-16">
                <div class="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar md:grid md:grid-cols-3 lg:grid-cols-4">
                    \${cardsHtml}
                </div>
            </div>
        \`;
    }

    const contentSection = \`
        <div class="container mx-auto px-4 max-w-4xl mb-16 text-slate-700 leading-loose">
            \${data.content}
            
            <div class="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 mt-12">
                <h2 class="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><span class="w-2 h-6 bg-slate-800 rounded-full inline-block"></span> سؤالات متداول</h2>
                <div class="space-y-4">
                    \${data.faq.map(f => \`
                        <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                            <h3 class="font-bold text-slate-800 mb-2 flex items-start gap-2">
                                <svg class="w-5 h-5 text-brand-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                \${f.q}
                            </h3>
                            <p class="text-sm text-slate-600 pr-7">\${f.a}</p>
                        </div>
                    \`).join('')}
                </div>
            </div>
        </div>
        
        <style>
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        </style>
    \`;

    let customHeader = headerHTML
        .replace('<title>بهدون؛ خدمات حرفه ای ساختمان در تهران</title>', '<title>' + data.title + '</title>')
        .replace('content="تشخیص ترکیدگی لوله با دستگاه نقطه زن، لوله بازکنی و تعمیرات تاسیسات با ضمانت کتبی در تهران."', 'content="' + data.metaDesc + '"');

    return customHeader + heroSection + subServicesHtml + contentSection + footerHTML;
}
// --- END INJECTED SERVICE PAGES ---
`;

const routerMarker = 'const url = new URL(request.url);';
if (contentStr.includes('// --- INJECTED SERVICE PAGES ---')) {
    console.log('Service logic already injected! Will replace it.');
    const startStr = '// --- INJECTED SERVICE PAGES ---';
    const endStr = '// --- END INJECTED SERVICE PAGES ---';
    const startIndex = contentStr.indexOf(startStr);
    const endIndex = contentStr.indexOf(endStr) + endStr.length;
    contentStr = contentStr.substring(0, startIndex) + renderServicePageLogic + contentStr.substring(endIndex);
} else {
    contentStr = contentStr.replace(routerMarker, renderServicePageLogic + '\n    ' + routerMarker);
    
    const routerReplacement = `
    let htmlResponse = '';
    if (path === '/magazine' || path === '/magazine/') {
        htmlResponse = headerHTML + magazineHTML + footerHTML;
    } else if (path.startsWith('/magazine/')) {
        htmlResponse = headerHTML + singleArticleHTML + footerHTML;
    } else if (path.startsWith('/services/')) {
        const parts = path.split('/');
        const serviceId = parts[2];
        const pageContent = renderServicePage(serviceId);
        if (pageContent === '404') {
            htmlResponse = html; // fallback
        } else {
            htmlResponse = pageContent;
        }
    } else {
        htmlResponse = html;
    }
`;

    // String replacement for the router block
    const oldRouterRegex = /let htmlResponse = '';\s*if \(path === '\/magazine'[\s\S]*?\} else \{\s*htmlResponse = html;\s*\}/s;
    
    if (oldRouterRegex.test(contentStr)) {
        contentStr = contentStr.replace(oldRouterRegex, routerReplacement.trim());
        console.log('Successfully injected routing!');
    } else {
        console.log('Failed to find the router regex to replace.');
    }
}

// We also need to update the links in the home page and footer to point to the new pages
contentStr = contentStr.replace(/href="\/#services"/g, 'href="/services/tasisat"'); 
// A bit brutal, let's fix them manually in the next step if needed, or better, we know the home categories need proper links.

fs.writeFileSync('worker.js', contentStr);
console.log('Script completed.');
