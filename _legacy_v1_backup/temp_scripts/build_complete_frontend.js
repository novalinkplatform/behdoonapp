const fs = require('fs');

console.log('Reading base components...');
let srcFrontend = fs.readFileSync('src/frontend.js', 'utf8');

function getExportBlock(source, exportName, nextExportName) {
    const start = source.indexOf(`export const ${exportName} = \``);
    if (start === -1) throw new Error(`Could not find export ${exportName}`);
    let end;
    if (nextExportName) {
        end = source.indexOf(`export const ${nextExportName}`, start);
        if (end === -1) end = source.indexOf(`export function ${nextExportName}`, start);
    } else {
        end = source.indexOf('export const servicesData', start);
    }
    return source.substring(start, end).trim();
}

let headerHTML = getExportBlock(srcFrontend, 'headerHTML', 'footerHTML');
let footerHTML = getExportBlock(srcFrontend, 'footerHTML', 'html');
let html = getExportBlock(srcFrontend, 'html', 'trackHTML');
let trackHTML = getExportBlock(srcFrontend, 'trackHTML', 'magazineHTML');
let magazineHTML = getExportBlock(srcFrontend, 'magazineHTML', 'singleArticleHTML');
let singleArticleHTML = getExportBlock(srcFrontend, 'singleArticleHTML', 'servicesData');

console.log('Exports extracted.');

// 1. Ensure logo in headerHTML has the tagline
if (!headerHTML.includes('خدمات حرفه‌ای ساختمان در تهران')) {
    headerHTML = headerHTML.replace(
        /<div class="font-black text-xl text-brand-600 tracking-tight">بهدون<\/div>[\s\S]*?<\/div>/,
        `<div class="flex items-center gap-2">
                        <span class="font-black text-lg md:text-xl text-brand-600 tracking-tight">بهدون</span>
                        <span class="text-slate-300 text-xs">|</span>
                        <span class="text-[10px] md:text-[11px] text-slate-500 font-medium whitespace-nowrap">خدمات حرفه‌ای ساختمان در تهران</span>
                    </div>`
    );
}

// 2. Mobile Menu definition
const cleanMobileMenu = `<div id="mobile-menu" class="hidden absolute top-[120%] left-0 w-full bg-white rounded-3xl shadow-xl border border-slate-200 flex flex-col overflow-hidden p-4 space-y-2.5 z-50">
                <!-- Contact Buttons (Top) -->
                <div class="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
                    <a href="tel:02122345678" class="flex items-center justify-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 py-2.5 px-3 rounded-xl font-bold text-xs hover:bg-emerald-100 transition-colors">
                        <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
                        <span dir="ltr">021-22345678</span>
                    </a>
                    <a href="https://wa.me/989333256885" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center gap-1.5 bg-green-50 border border-green-200 text-green-700 py-2.5 px-3 rounded-xl font-bold text-xs hover:bg-green-100 transition-colors">
                        <svg class="w-4 h-4 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.662-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                        <span>واتساپ</span>
                    </a>
                </div>
                <!-- 4 Navigation Links -->
                <a href="/" class="flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors text-sm" onclick="document.getElementById('mobile-menu').classList.add('hidden')">
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                    <span>خانه</span>
                </a>
                <button type="button" onclick="document.getElementById('mobile-menu').classList.add('hidden'); if(typeof openRequestModal === 'function') openRequestModal(); else window.location.href='/#services';" class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-white bg-[#8B1C31] hover:bg-[#701627] transition-colors text-sm shadow-sm">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                    <span>ثبت درخواست</span>
                </button>
                <a href="/track" class="flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors text-sm" onclick="document.getElementById('mobile-menu').classList.add('hidden')">
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                    <span>پیگیری درخواست‌ها</span>
                </a>
                <a href="/track" class="flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-colors text-sm" onclick="document.getElementById('mobile-menu').classList.add('hidden')">
                    <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    <span>پروفایل من</span>
                </a>
            </div>`;

// Update mobile-menu in headerHTML
headerHTML = headerHTML.replace(/<div id="mobile-menu"[\s\S]*?<\/div>\s*<\/div>\s*<\/header>/, `${cleanMobileMenu}\n        </div>\n    </header>`);

// 3. Update mobile-menu in html (fixing duplicate links)
html = html.replace(/<div id="mobile-menu"[\s\S]*?<\/div>\s*<\/div>\s*<\/header>/, `${cleanMobileMenu}\n            </div>\n        </header>`);

// 4. USER REQUEST: REMOVE "خدمات حرفه‌ای ساختمان در تهران" BELOW HEADER IN HERO!
const heroTitleRegex = /<h1 class="text-\[clamp[\s\S]*?<\/h1>/;
if (heroTitleRegex.test(html)) {
    html = html.replace(heroTitleRegex, '');
    console.log('Successfully removed "خدمات حرفه‌ای ساختمان در تهران" under the header!');
} else {
    console.warn('heroTitleRegex did not match!');
}

// Ensure the section title "خدمات بهدون" is an H1 for SEO
html = html.replace('<h2 class="text-xl md:text-3xl font-black text-slate-800">خدمات بهدون</h2>', '<h1 class="text-xl md:text-3xl font-black text-slate-800">خدمات بهدون</h1>');

// 5. Load all_services_data.json
const allServices = JSON.parse(fs.readFileSync('all_services_data.json', 'utf8'));

// 6. Build renderers code
const renderersCode = `
export function renderServicePage(serviceId) {
    const data = servicesData[serviceId];
    if (!data) return '404';

    const catTitleShort = data.title.split('|')[0].trim();

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
                <li aria-current="page">
                    <div class="flex items-center">
                        <svg class="w-3.5 h-3.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                        <span class="mr-1 text-slate-700 font-bold" id="breadcrumb-current">\${catTitleShort}</span>
                    </div>
                </li>
            </ol>
        </nav>
    \`;

    const heroSection = \`
        <div class="pt-6 pb-4 bg-gradient-to-b from-brand-50/60 to-transparent">
            <div class="container mx-auto px-4 max-w-5xl">
                \${breadcrumbs}
                
                <div class="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm my-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div class="space-y-2 max-w-2xl">
                        <div class="inline-flex items-center gap-2 text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/60">
                            <span>پوشش تمام مناطق تهران</span>
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>اعزام فوری تکنسین</span>
                        </div>
                        <h1 class="text-xl md:text-3xl font-black text-slate-800 leading-tight">\${data.title}</h1>
                        <p class="text-xs md:text-sm text-slate-600 leading-relaxed">\${data.subtitle || ''}</p>
                    </div>
                    
                    <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
                        <button type="button" onclick="openRequestModal('\${data.subServices && data.subServices[0] ? data.subServices[0].name : data.title}')" class="w-full sm:w-auto px-6 py-3.5 bg-[#8B1C31] hover:bg-[#701627] text-white font-bold text-xs md:text-sm rounded-2xl shadow-lg shadow-[#8B1C31]/20 hover:shadow-xl transition-all transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                            <span>ثبت آنلاین درخواست</span>
                        </button>
                        <a href="tel:02122345678" class="w-full sm:w-auto px-5 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs md:text-sm rounded-2xl transition-colors text-center flex items-center justify-center gap-2">
                            <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
                            <span dir="ltr">021 - 22345678</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    \`;

    let subServicesHtml = '';
    let tabContents = '';

    if (data.subServices && data.subServices.length > 0) {
        let cardsHtml = data.subServices.map((sub, index) => {
            const isActive = index === 0;
            const containerClass = isActive 
                ? 'tab-btn cursor-pointer bg-brand-50 border border-brand-500 p-4 md:p-5 rounded-2xl shadow-sm transition-all group text-center flex flex-col items-center justify-center w-[130px] sm:w-[150px]'
                : 'tab-btn cursor-pointer bg-white border border-slate-100 p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-300 transition-all group text-center flex flex-col items-center justify-center w-[130px] sm:w-[150px]';
            
            const iconClass = isActive
                ? 'tab-icon-container w-10 h-10 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center mb-3 md:mb-4 transition-colors'
                : 'tab-icon-container w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors';
                
            const titleClass = isActive
                ? 'font-black text-brand-700 text-sm'
                : 'font-bold text-slate-600 text-sm group-hover:text-brand-600 transition-colors';

            return \`
            <div onclick="switchTab('\${index}', '\${sub.name}', '\${sub.slug || ''}')" id="tab-btn-\${index}" class="\${containerClass}">
                <div class="\${iconClass}">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="\${sub.icon}"></path></svg>
                </div>
                <h3 class="\${titleClass}">\${sub.name}</h3>
            </div>
            \`;
        }).join('');

        subServicesHtml = \`
            <div class="container mx-auto px-4 max-w-6xl mt-4 relative z-20 mb-8 md:mb-12">
                <div class="flex flex-wrap justify-center gap-3 md:gap-4 pb-4">
                    \${cardsHtml}
                </div>
            </div>
        \`;
        
        tabContents = data.subServices.map((sub, index) => \`
            <div id="tab-content-\${index}" class="tab-content \${index === 0 ? 'block' : 'hidden'}">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
                    <h2 class="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2.5">
                        <span class="w-2.5 h-7 bg-[#8B1C31] rounded-full inline-block"></span>
                        \${sub.name}
                    </h2>
                    <div class="flex items-center gap-2">
                        <a href="/services/\${serviceId}/\${sub.slug}" class="inline-flex items-center justify-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 font-bold bg-brand-50 hover:bg-brand-100 px-3.5 py-2.5 rounded-xl border border-brand-200 transition-colors">
                            <span>صفحه اختصاصی \${sub.name}</span>
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        </a>
                        <button type="button" onclick="openRequestModal('\${sub.name}')" class="inline-flex items-center justify-center gap-2 bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all transform hover:-translate-y-0.5">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                            <span>ثبت آنلاین درخواست \${sub.name}</span>
                        </button>
                    </div>
                </div>
                \${sub.detail ? sub.detail : \`
                    <div class="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
                        <h3 class="text-lg font-bold text-slate-700 mb-2">محتوای «\${sub.name}» در حال آماده‌سازی است</h3>
                        <p class="text-sm text-slate-500">به زودی اطلاعات کامل این بخش قرار خواهد گرفت.</p>
                    </div>
                \`}
            </div>
        \`).join('');
    } else {
        tabContents = \`<div class="tab-content block">\${data.content || ''}</div>\`;
    }

    const contentSection = \`
        <div class="container mx-auto px-4 max-w-5xl mb-8 md:mb-12 mt-2 md:mt-6">
            <div class="bg-white border border-slate-200 shadow-md rounded-[2rem] p-6 md:p-10 text-slate-700 leading-loose">
                \${tabContents}
            </div>
            
            <div class="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 md:p-10 mt-8 md:mt-12">
                <h2 class="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><span class="w-2 h-6 bg-slate-800 rounded-full inline-block"></span> سؤالات متداول</h2>
                <div class="space-y-4">
                    \${(data.faq || []).map(f => \`
                        <details class="group bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-brand-300 transition-colors [&_summary::-webkit-details-marker]:hidden">
                            <summary class="flex cursor-pointer items-center justify-between gap-1.5 p-5 md:p-6 text-slate-800 font-bold select-none">
                                <h3 class="text-[15px] md:text-base">\${f.q}</h3>
                                <span class="relative size-5 shrink-0 text-brand-500">
                                    <svg class="absolute inset-0 size-5 opacity-100 group-open:opacity-0 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path></svg>
                                    <svg class="absolute inset-0 size-5 opacity-0 group-open:opacity-100 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15"></path></svg>
                                </span>
                            </summary>
                            <div class="px-5 md:px-6 pb-6 text-slate-600 leading-loose text-[14px]">
                                <p>\${f.a}</p>
                            </div>
                        </details>
                    \`).join('')}
                </div>
            </div>
        </div>
        
        <script>
            function switchTab(tabId, tabName, tabSlug) {
                document.querySelectorAll('.tab-content').forEach(el => {
                    el.classList.remove('block');
                    el.classList.add('hidden');
                });
                
                const activeContent = document.getElementById('tab-content-' + tabId);
                if(activeContent) {
                    activeContent.classList.remove('hidden');
                    activeContent.classList.add('block');
                }
                
                document.querySelectorAll('.tab-btn').forEach(el => {
                    el.className = 'tab-btn cursor-pointer bg-white border border-slate-100 p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-300 transition-all group text-center flex flex-col items-center justify-center w-[130px] sm:w-[150px]';
                    
                    const h3 = el.querySelector('h3');
                    if(h3) h3.className = 'font-bold text-slate-600 text-sm group-hover:text-brand-600 transition-colors';
                    
                    const iconBox = el.querySelector('.tab-icon-container');
                    if(iconBox) iconBox.className = 'tab-icon-container w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors';
                });
                
                const activeTab = document.getElementById('tab-btn-' + tabId);
                if(activeTab) {
                    activeTab.className = 'tab-btn cursor-pointer bg-brand-50 border border-brand-500 p-4 md:p-5 rounded-2xl shadow-sm transition-all group text-center flex flex-col items-center justify-center w-[130px] sm:w-[150px]';
                    
                    const activeH3 = activeTab.querySelector('h3');
                    if(activeH3) activeH3.className = 'font-black text-brand-700 text-sm';
                    
                    const activeIconBox = activeTab.querySelector('.tab-icon-container');
                    if(activeIconBox) activeIconBox.className = 'tab-icon-container w-10 h-10 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center mb-3 md:mb-4 transition-colors';
                }
                
                const breadcrumb = document.getElementById('breadcrumb-current');
                if(breadcrumb) {
                    const originalTitle = "\${catTitleShort}";
                    breadcrumb.innerHTML = originalTitle + ' <span class="mx-1 text-slate-300">/</span> <span class="text-brand-600">' + tabName + '</span>';
                }

                if(tabSlug && window.history && window.history.replaceState) {
                    window.history.replaceState(null, '', '/services/\${serviceId}/' + tabSlug);
                }
            }

            document.addEventListener('DOMContentLoaded', () => {
                const breadcrumb = document.getElementById('breadcrumb-current');
                if(breadcrumb && breadcrumb.innerHTML === "\${catTitleShort}") {
                    const firstTabName = "\${data.subServices && data.subServices[0] ? data.subServices[0].name : ''}";
                    if(firstTabName) {
                        breadcrumb.innerHTML = "\${catTitleShort}" + ' <span class="mx-1 text-slate-300">/</span> <span class="text-brand-600">' + firstTabName + '</span>';
                    }
                }
            });
        </script>
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

export function renderSubServicePage(categoryId, subIndex) {
    const data = servicesData[categoryId];
    if (!data) return '404';
    const sub = data.subServices && data.subServices[subIndex];
    if (!sub) return '404';

    const catTitleShort = data.title.split('|')[0].trim();
    const subTitle = \`\${sub.name} در تهران | خدمات و تعمیرات فوری بهدون\`;
    const subMetaDesc = \`ارائه تخصصی خدمات \${sub.name} در کلیه مناطق ۲۲ گانه تهران توسط تکنسین‌های مجرب بهدون با قطعات فابریک، ضمانت کتبی کیفیت و اعزام فوری زیر ۴۵ دقیقه.\`;

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
                        <a href="/services/\${categoryId}" class="mr-1 hover:text-brand-600 transition-colors">\${catTitleShort}</a>
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

    const heroSection = \`
        <div class="pt-6 pb-4 bg-gradient-to-b from-brand-50/60 to-transparent">
            <div class="container mx-auto px-4 max-w-5xl">
                \${breadcrumbs}
                
                <div class="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-sm my-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div class="space-y-2 max-w-2xl">
                        <div class="inline-flex items-center gap-2 text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/60">
                            <span>پوشش تمام مناطق ۲۲ گانه تهران</span>
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>اعزام فوری زیر ۴۵ دقیقه</span>
                        </div>
                        <h1 class="text-xl md:text-3xl font-black text-slate-800 leading-tight">\${sub.name} در تهران</h1>
                        <p class="text-xs md:text-sm text-slate-600 leading-relaxed">ارائه خدمات تخصصی، فوری و تضمینی \${sub.name} با تکنسین‌های دارای گواهی فنی و حرفه‌ای و قطعات اورجینال در سراسر پایتخت.</p>
                    </div>
                    
                    <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
                        <button type="button" onclick="openRequestModal('\${sub.name}')" class="w-full sm:w-auto px-6 py-3.5 bg-[#8B1C31] hover:bg-[#701627] text-white font-bold text-xs md:text-sm rounded-2xl shadow-lg shadow-[#8B1C31]/20 hover:shadow-xl transition-all transform hover:-translate-y-0.5 text-center flex items-center justify-center gap-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                            <span>ثبت آنلاین درخواست \${sub.name}</span>
                        </button>
                        <a href="tel:02122345678" class="w-full sm:w-auto px-5 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs md:text-sm rounded-2xl transition-colors text-center flex items-center justify-center gap-2">
                            <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
                            <span dir="ltr">021 - 22345678</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    \`;

    const siblings = (data.subServices || []).map((s, idx) => {
        const isCurrent = idx === subIndex;
        return \`
            <a href="/services/\${categoryId}/\${s.slug}" class="\${isCurrent ? 'bg-brand-500 text-white border-brand-500 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300 hover:text-brand-600'} px-4 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap inline-flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="\${s.icon}"></path></svg>
                <span>\${s.name}</span>
            </a>
        \`;
    }).join('');

    const siblingsNav = \`
        <div class="container mx-auto px-4 max-w-5xl my-4">
            <div class="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
                <div class="text-xs font-bold text-slate-500 mb-2.5 flex items-center justify-between">
                    <span>سایر خدمات \${catTitleShort}:</span>
                    <a href="/services/\${categoryId}" class="text-brand-600 hover:underline text-xs">مشاهده همه خدمات &larr;</a>
                </div>
                <div class="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
                    \${siblings}
                </div>
            </div>
        </div>
    \`;

    const contentSection = \`
        <div class="container mx-auto px-4 max-w-5xl mb-8 md:mb-12">
            <div class="bg-white border border-slate-200 shadow-md rounded-[2rem] p-6 md:p-10 text-slate-700 leading-loose">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
                    <h2 class="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2.5">
                        <span class="w-2.5 h-7 bg-[#8B1C31] rounded-full inline-block"></span>
                        \${sub.name}
                    </h2>
                    <button type="button" onclick="openRequestModal('\${sub.name}')" class="inline-flex items-center justify-center gap-2 bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all transform hover:-translate-y-0.5">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                        <span>ثبت آنلاین درخواست \${sub.name}</span>
                    </button>
                </div>
                \${sub.detail ? sub.detail : \`
                    <div class="bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center">
                        <h3 class="text-lg font-bold text-slate-700 mb-2">محتوای «\${sub.name}» در حال آماده‌سازی است</h3>
                        <p class="text-sm text-slate-500">به زودی اطلاعات کامل این بخش قرار خواهد گرفت.</p>
                    </div>
                \`}
            </div>
            
            <div class="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 md:p-10 mt-8 md:mt-12">
                <h2 class="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><span class="w-2 h-6 bg-slate-800 rounded-full inline-block"></span> سؤالات متداول \${sub.name}</h2>
                <div class="space-y-4">
                    \${(data.faq || []).map(f => \`
                        <details class="group bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-brand-300 transition-colors [&_summary::-webkit-details-marker]:hidden">
                            <summary class="flex cursor-pointer items-center justify-between gap-1.5 p-5 md:p-6 text-slate-800 font-bold select-none">
                                <h3 class="text-[15px] md:text-base">\${f.q}</h3>
                                <span class="relative size-5 shrink-0 text-brand-500">
                                    <svg class="absolute inset-0 size-5 opacity-100 group-open:opacity-0 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path></svg>
                                    <svg class="absolute inset-0 size-5 opacity-0 group-open:opacity-100 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15"></path></svg>
                                </span>
                            </summary>
                            <div class="px-5 md:px-6 pb-6 text-slate-600 leading-loose text-[14px]">
                                <p>\${f.a}</p>
                            </div>
                        </details>
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
        .replace('<title>بهدون؛ خدمات حرفه ای ساختمان در تهران</title>', '<title>' + subTitle + '</title>')
        .replace('content="تشخیص ترکیدگی لوله با دستگاه نقطه زن، لوله بازکنی و تعمیرات تاسیسات با ضمانت کتبی در تهران."', 'content="' + subMetaDesc + '"');

    return customHeader + heroSection + siblingsNav + contentSection + footerHTML;
}
`;

const constantsCode = `
export const PHONE = "02122345678";
export const PHONE_DISPLAY = "021 - 22345678";
export const WHATSAPP = "989333256885";
`;

const finalFileContent = `
${constantsCode}

${headerHTML};

${footerHTML};

${html};

${trackHTML};

${magazineHTML};

${singleArticleHTML};

export const servicesData = ${JSON.stringify(allServices, null, 4)};

${renderersCode}
`;

fs.writeFileSync('src/frontend.js', finalFileContent.trim(), 'utf8');
console.log('src/frontend.js successfully updated! Size:', fs.statSync('src/frontend.js').size);
