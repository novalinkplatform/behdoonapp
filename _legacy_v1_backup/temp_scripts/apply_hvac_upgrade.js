const fs = require('fs');

// Read hvac_data.json
const hvacData = JSON.parse(fs.readFileSync('hvac_data.json', 'utf8'));

let frontendCode = fs.readFileSync('src/frontend.js', 'utf8');

// 1. Update servicesData["hvac"]
// Find start and end of "hvac": { ... }, inside servicesData
const hvacStart = frontendCode.indexOf('  "hvac": {');
const plumbingStart = frontendCode.indexOf('  "plumbing": {');

if (hvacStart !== -1 && plumbingStart !== -1) {
    const hvacString = '  "hvac": ' + JSON.stringify(hvacData, null, 4) + ',\n';
    frontendCode = frontendCode.substring(0, hvacStart) + hvacString + frontendCode.substring(plumbingStart);
    console.log('servicesData.hvac successfully replaced.');
} else {
    console.error('Could not find hvac boundaries in servicesData.');
}

// 2. Enhance renderServicePage
// Find heroSection in renderServicePage
const oldHero = `    const heroSection = \`
        <div class="pt-8 pb-4">
            <div class="container mx-auto px-4 max-w-5xl">
                \${breadcrumbs}
            </div>
        </div>
    \`;`;

const newHero = `    const heroSection = \`
        <div class="pt-8 pb-4 bg-gradient-to-b from-brand-50/60 to-transparent">
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
    \`;`;

// Update heroSection if matched
if (frontendCode.includes('<div class="pt-8 pb-4">')) {
    const hStart = frontendCode.indexOf('    const heroSection = `');
    const hEnd = frontendCode.indexOf('    let subServicesHtml = \'\';', hStart);
    if (hStart !== -1 && hEnd !== -1) {
        frontendCode = frontendCode.substring(0, hStart) + newHero + '\n\n' + frontendCode.substring(hEnd);
        console.log('Hero section enhanced.');
    }
}

// 3. Update tabContents to render sub.detail and CTA
const oldTabMapStart = frontendCode.indexOf('tabContents = data.subServices.map((sub, index) => `');
const oldTabMapEnd = frontendCode.indexOf('`).join(\'\');', oldTabMapStart);

if (oldTabMapStart !== -1 && oldTabMapEnd !== -1) {
    const newTabMap = `tabContents = data.subServices.map((sub, index) => \`
            <div id="tab-content-\${index}" class="tab-content \${index === 0 ? 'block' : 'hidden'}">
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
        \``;
    frontendCode = frontendCode.substring(0, oldTabMapStart) + newTabMap + frontendCode.substring(oldTabMapEnd + 11);
    console.log('tabContents mapping updated to render sub.detail and CTA.');
}

// 4. Inject data.comprehensiveGuide below tabContents
if (!frontendCode.includes('${data.comprehensiveGuide || \'\'}')) {
    frontendCode = frontendCode.replace(
        '${tabContents}\n            </div>',
        '${tabContents}\n                ${data.comprehensiveGuide || \'\'}\n            </div>'
    );
    console.log('Injected data.comprehensiveGuide into contentSection.');
}

fs.writeFileSync('src/frontend.js', frontendCode);
console.log('All HVAC upgrades written to src/frontend.js');
