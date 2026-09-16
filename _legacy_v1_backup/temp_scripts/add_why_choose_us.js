const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const whyChooseUsHTML = `
                <!-- Why Choose Us Banner -->
                <div class="bg-white border border-slate-200 shadow-sm rounded-[2rem] p-5 md:p-6 flex flex-col lg:flex-row items-center justify-between gap-5 mb-8">
                    <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        </div>
                        <h2 class="font-black text-slate-800 text-lg md:text-xl whitespace-nowrap">چرا بهدون رو انتخاب کنیم؟</h2>
                    </div>
                    
                    <div class="flex flex-wrap justify-center lg:justify-end gap-2 md:gap-3">
                        <span class="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-bold px-4 py-2.5 rounded-xl border border-slate-200 transition-colors">
                            <svg class="w-5 h-5 text-success-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                            خدمات حرفه‌ای
                        </span>
                        <span class="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-bold px-4 py-2.5 rounded-xl border border-slate-200 transition-colors">
                            <svg class="w-5 h-5 text-success-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                            نیروی متخصص و ماهر
                        </span>
                        <span class="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-bold px-4 py-2.5 rounded-xl border border-slate-200 transition-colors">
                            <svg class="w-5 h-5 text-success-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                            قیمت منصفانه
                        </span>
                        <span class="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-bold px-4 py-2.5 rounded-xl border border-slate-200 transition-colors">
                            <svg class="w-5 h-5 text-success-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                            شفافیت و تعهد بالا
                        </span>
                    </div>
                </div>`;

const searchString = '<div class="flex flex-wrap justify-center gap-3 md:gap-4 pb-4">';
content = content.replace(searchString, whyChooseUsHTML + '\n                ' + searchString);

fs.writeFileSync('worker.js', content);
console.log('Added Why Choose Us banner above the tabs!');
