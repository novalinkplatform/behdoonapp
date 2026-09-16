const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const startIdx = content.indexOf('function renderServicePage(serviceId) {');
const endIdx = content.indexOf('return customHeader + heroSection + subServicesHtml + contentSection + footerHTML;\n}') + 'return customHeader + heroSection + subServicesHtml + contentSection + footerHTML;\n}'.length;

if (startIdx === -1 || endIdx === -1) {
    console.error('Could not find renderServicePage bounds');
    process.exit(1);
}

const newFunc = `function renderServicePage(serviceId) {
    const data = servicesData[serviceId];
    if (!data) return '404';

    const breadcrumbs = \`
        <nav class="flex text-sm text-slate-500 mb-6 justify-center" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 space-x-reverse md:space-x-3">
                <li class="inline-flex items-center">
                    <a href="/" class="inline-flex items-center hover:text-brand-600 transition-colors">
                        <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
                        خانه
                    </a>
                </li>
                <li>
                    <div class="flex items-center">
                        <svg class="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                        <a href="/#services" class="mr-1 md:mr-2 hover:text-brand-600 transition-colors">خدمات</a>
                    </div>
                </li>
                <li aria-current="page">
                    <div class="flex items-center">
                        <svg class="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
                        <span class="mr-1 md:mr-2 text-slate-700 font-bold" id="breadcrumb-current">\${data.title}</span>
                    </div>
                </li>
            </ol>
        </nav>
    \`;

    const heroSection = \`
        <div class="bg-slate-50 pt-12 md:pt-16 pb-8 md:pb-12 border-b border-slate-200 relative overflow-hidden">
            <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNlMmU4ZjAiLz48L3N2Zz4=')] opacity-50"></div>
            <div class="container mx-auto px-4 max-w-5xl relative z-10 text-center">
                \${breadcrumbs}
                <div class="inline-flex items-center justify-center p-4 bg-brand-100 text-brand-600 rounded-2xl mb-6 shadow-sm border border-brand-200">
                    \${data.icon}
                </div>
                <h1 class="text-2xl md:text-4xl font-black text-slate-800 mb-4 md:mb-6 leading-snug tracking-tight">\${data.title}</h1>
                <p class="text-slate-600 md:text-lg max-w-3xl mx-auto leading-relaxed mb-6 md:mb-8">\${data.subtitle}</p>
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
    let tabContents = '';

    if (data.subServices && data.subServices.length > 0) {
        let cardsHtml = \`
            <div onclick="switchTab('overview', '\${data.title}')" id="tab-btn-overview" class="tab-btn cursor-pointer bg-brand-50 border border-brand-500 p-4 md:p-5 rounded-2xl shadow-sm transition-all group text-center flex flex-col items-center justify-center">
                <div class="tab-icon-container w-10 h-10 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center mb-3 md:mb-4 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 class="font-black text-brand-700 text-sm">معرفی کلی</h3>
            </div>
        \`;
        
        cardsHtml += data.subServices.map((sub, index) => \`
            <div onclick="switchTab('\${index}', '\${sub.name}')" id="tab-btn-\${index}" class="tab-btn cursor-pointer bg-white border border-slate-100 p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-300 transition-all group text-center flex flex-col items-center justify-center">
                <div class="tab-icon-container w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="\${sub.icon}"></path></svg>
                </div>
                <h3 class="font-bold text-slate-600 text-sm group-hover:text-brand-600 transition-colors">\${sub.name}</h3>
            </div>
        \`).join('');

        subServicesHtml = \`
            <div class="container mx-auto px-4 max-w-6xl -mt-4 md:-mt-6 relative z-20 mb-8 md:mb-12">
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 pb-2">
                    \${cardsHtml}
                </div>
            </div>
        \`;
        
        tabContents = \`
            <div id="tab-content-overview" class="tab-content block">
                \${data.content}
            </div>
        \`;
        
        tabContents += data.subServices.map((sub, index) => \`
            <div id="tab-content-\${index}" class="tab-content hidden">
                <h2 class="text-xl md:text-2xl font-black text-slate-800 mb-6 flex items-center gap-2"><span class="w-2 h-6 bg-brand-500 rounded-full inline-block"></span> \${sub.name}</h2>
                <div class="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 md:p-12 text-center">
                    <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-400">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="\${sub.icon}"></path></svg>
                    </div>
                    <h3 class="text-lg font-bold text-slate-700 mb-2">محتوای «\${sub.name}» در حال آماده‌سازی است</h3>
                    <p class="text-sm text-slate-500">به زودی اطلاعات کامل و تخصصی این خدمت در این بخش قرار خواهد گرفت.</p>
                </div>
            </div>
        \`).join('');
    } else {
        tabContents = \`<div class="tab-content block">\${data.content}</div>\`;
    }

    const contentSection = \`
        <div class="container mx-auto px-4 max-w-5xl mb-8 md:mb-12 mt-2 md:mt-6">
            <div class="bg-white border border-slate-200 shadow-md rounded-[2rem] p-6 md:p-10 text-slate-700 leading-loose">
                \${tabContents}
            </div>
            
            <div class="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 md:p-10 mt-8 md:mt-12">
                <h2 class="text-xl font-black text-slate-800 mb-6 flex items-center gap-2"><span class="w-2 h-6 bg-slate-800 rounded-full inline-block"></span> سؤالات متداول</h2>
                <div class="space-y-4">
                    \${data.faq.map(f => \`
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
            function switchTab(tabId, tabName) {
                // 1. Hide all contents
                document.querySelectorAll('.tab-content').forEach(el => {
                    el.classList.remove('block');
                    el.classList.add('hidden');
                });
                
                // 2. Show the active content
                const activeContent = document.getElementById('tab-content-' + tabId);
                if(activeContent) {
                    activeContent.classList.remove('hidden');
                    activeContent.classList.add('block');
                }
                
                // 3. Reset all tab styles
                document.querySelectorAll('.tab-btn').forEach(el => {
                    el.className = 'tab-btn cursor-pointer bg-white border border-slate-100 p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-300 transition-all group text-center flex flex-col items-center justify-center';
                    
                    const h3 = el.querySelector('h3');
                    if(h3) h3.className = 'font-bold text-slate-600 text-sm group-hover:text-brand-600 transition-colors';
                    
                    const iconBox = el.querySelector('.tab-icon-container');
                    if(iconBox) iconBox.className = 'tab-icon-container w-10 h-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center mb-3 md:mb-4 group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors';
                });
                
                // 4. Set active tab styles
                const activeTab = document.getElementById('tab-btn-' + tabId);
                if(activeTab) {
                    activeTab.className = 'tab-btn cursor-pointer bg-brand-50 border border-brand-500 p-4 md:p-5 rounded-2xl shadow-sm transition-all group text-center flex flex-col items-center justify-center';
                    
                    const activeH3 = activeTab.querySelector('h3');
                    if(activeH3) activeH3.className = 'font-black text-brand-700 text-sm';
                    
                    const activeIconBox = activeTab.querySelector('.tab-icon-container');
                    if(activeIconBox) activeIconBox.className = 'tab-icon-container w-10 h-10 bg-brand-100 text-brand-600 rounded-xl flex items-center justify-center mb-3 md:mb-4 transition-colors';
                }
                
                // 5. Update Breadcrumb dynamically
                const breadcrumb = document.getElementById('breadcrumb-current');
                if(breadcrumb) {
                    const originalTitle = "\${data.title}";
                    if (tabId === 'overview') {
                        breadcrumb.innerHTML = originalTitle;
                    } else {
                        breadcrumb.innerHTML = originalTitle + ' <span class="mx-1 text-slate-300">/</span> <span class="text-brand-600">' + tabName + '</span>';
                    }
                }
            }
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
}`;

content = content.substring(0, startIdx) + newFunc + content.substring(endIdx);
fs.writeFileSync('worker.js', content);
console.log('Successfully injected Breadcrumbs and Tabs!');
