const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const regexPlumbing = /<div class="w-16 h-16 shrink-0 bg-slate-50 rounded-full flex items-center justify-center shadow-inner group-hover:bg-brand-50 transition-colors duration-300 p-3">\s*<img src="https:\/\/img\.icons8\.com\/color\/96\/plumbing\.png"[^>]+>\s*<\/div>/;
content = content.replace(regexPlumbing, 
    `<div class="w-16 h-16 shrink-0 bg-purple-50 rounded-[1.2rem] flex items-center justify-center shadow-sm border border-purple-100 group-hover:bg-purple-600 group-hover:scale-105 transition-all duration-300 p-4">
        <svg class="w-8 h-8 text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
    </div>`
);

const regexIdea = /<div class="w-16 h-16 shrink-0 bg-slate-50 rounded-full flex items-center justify-center shadow-inner group-hover:bg-amber-50 transition-colors duration-300 p-3">\s*<img src="https:\/\/img\.icons8\.com\/color\/96\/idea\.png"[^>]+>\s*<\/div>/;
content = content.replace(regexIdea, 
    `<div class="w-16 h-16 shrink-0 bg-purple-50 rounded-[1.2rem] flex items-center justify-center shadow-sm border border-purple-100 group-hover:bg-purple-600 group-hover:scale-105 transition-all duration-300 p-4">
        <svg class="w-8 h-8 text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
    </div>`
);

const regexRoller = /<div class="w-16 h-16 shrink-0 bg-slate-50 rounded-full flex items-center justify-center shadow-inner group-hover:bg-success-50 transition-colors duration-300 p-3">\s*<img src="https:\/\/img\.icons8\.com\/color\/96\/roller-brush\.png"[^>]+>\s*<\/div>/;
content = content.replace(regexRoller, 
    `<div class="w-16 h-16 shrink-0 bg-purple-50 rounded-[1.2rem] flex items-center justify-center shadow-sm border border-purple-100 group-hover:bg-purple-600 group-hover:scale-105 transition-all duration-300 p-4">
        <svg class="w-8 h-8 text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.813-6.841m-8.577 11.489a15.99 15.99 0 00-4.648-4.764L1.75 3.125m19.125 19.125l-3.813-6.841m3.813 6.841l-6.841-3.813" /></svg>
    </div>`
);

const regexBrick = /<div class="w-16 h-16 shrink-0 bg-slate-50 rounded-full flex items-center justify-center shadow-inner group-hover:bg-indigo-50 transition-colors duration-300 p-3">\s*<img src="https:\/\/img\.icons8\.com\/color\/96\/brick-wall\.png"[^>]+>\s*<\/div>/;
content = content.replace(regexBrick, 
    `<div class="w-16 h-16 shrink-0 bg-purple-50 rounded-[1.2rem] flex items-center justify-center shadow-sm border border-purple-100 group-hover:bg-purple-600 group-hover:scale-105 transition-all duration-300 p-4">
        <svg class="w-8 h-8 text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    </div>`
);

// Update magazine section
const oldMagHeader = `
                <div class="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                    <div>
                        <span class="text-brand-500 font-bold bg-brand-50 border border-brand-100 px-3 py-1 rounded-full text-xs mb-3 inline-block">دانشنامه</span>
                        <h2 class="text-2xl md:text-3xl font-black text-brand-500 mt-2">مجله تخصصی تاسیسات</h2>
                    </div>
                    <a href="#" class="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-5 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-colors text-sm shadow-sm">
                        مشاهده همه مقالات
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </a>
                </div>
`;

const newMagHeader = `
                <div class="flex flex-col mb-10 text-center items-center">
                    <span class="text-purple-600 font-bold bg-purple-50 border border-purple-100 px-3 py-1 rounded-full text-xs mb-3 inline-block">آموزش و مقالات</span>
                    <h2 class="text-2xl md:text-3xl font-black text-brand-500 mt-2">دانشنامه</h2>
                </div>
`;

const oldMagFooter = `
                    </article>
                </div>
            </div>
        </section>
`;

const newMagFooter = `
                    </article>
                </div>
                <div class="mt-10 flex justify-center">
                    <a href="/magazine" class="inline-flex items-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors text-sm shadow-md hover:shadow-lg">
                        مشاهده دانشنامه
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    </a>
                </div>
            </div>
        </section>
`;

content = content.replace(oldMagHeader.trim(), newMagHeader.trim());
content = content.replace(oldMagFooter.trim(), newMagFooter.trim());

fs.writeFileSync('worker.js', content);
console.log('Script completed.');
