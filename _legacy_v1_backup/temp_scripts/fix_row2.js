const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const regex = /<!-- ROW 2: Contact Info -->[\s\S]*?<!-- ROW 3: SEO Intro -->/g;

const newRow2 = `<!-- ROW 2: Contact Info -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10 w-full max-w-4xl mx-auto">
                    <!-- Phone -->
                    <a href="tel:09333256885" class="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center gap-4 hover:border-brand-300 hover:shadow-md transition-all group">
                        <div class="w-14 h-14 shrink-0 rounded-xl bg-brand-100 flex items-center justify-center text-brand-600 group-hover:bg-brand-500 group-hover:text-white transition-all">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs text-slate-500 mb-0.5">تماس تلفنی</span>
                            <span class="font-black text-lg text-slate-800 dir-ltr group-hover:text-brand-600 transition-colors">0933 325 6885</span>
                        </div>
                    </a>
                    
                    <!-- WhatsApp -->
                    <a href="https://wa.me/989333256885" target="_blank" rel="noopener noreferrer" class="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center gap-4 hover:border-green-300 hover:shadow-md transition-all group">
                        <div class="w-14 h-14 shrink-0 rounded-xl bg-green-100 flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-all">
                            <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.662-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs text-slate-500 mb-0.5">پشتیبانی آنلاین</span>
                            <span class="font-bold text-base text-slate-800 group-hover:text-green-600 transition-colors">ارتباط در واتساپ</span>
                        </div>
                    </a>
                    
                    <!-- Instagram -->
                    <a href="https://instagram.com/behdoon.ir" target="_blank" rel="noopener noreferrer" class="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center gap-4 hover:border-pink-300 hover:shadow-md transition-all group">
                        <div class="w-14 h-14 shrink-0 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600 group-hover:bg-gradient-to-tr group-hover:from-yellow-400 group-hover:via-pink-500 group-hover:to-purple-600 group-hover:text-white transition-all">
                            <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs text-slate-500 mb-0.5">شبکه‌های اجتماعی</span>
                            <span class="font-bold text-base text-slate-800 group-hover:text-pink-600 transition-colors">اینستاگرام بهدون</span>
                        </div>
                    </a>
                </div>

                <!-- ROW 3: SEO Intro -->`;

content = content.replace(regex, newRow2);
fs.writeFileSync('worker.js', content);
console.log('Row 2 updated to cards!');
