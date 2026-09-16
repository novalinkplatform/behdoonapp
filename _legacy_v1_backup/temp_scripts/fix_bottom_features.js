const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const sIdx = content.indexOf('<!-- ================= FEATURES');
if (sIdx !== -1) {
    const eIdx = content.indexOf('</section>', sIdx) + 10;
    const oldSection = content.substring(sIdx, eIdx);

    const newSection = `<!-- ================= FEATURES (Why Choose Us) ================= -->
        <section class="py-12 md:py-16 relative overflow-hidden bg-slate-50 z-20">
            <!-- Decorative Background Blob -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[800px] h-[300px] bg-purple-500/10 blur-[80px] rounded-full -z-10"></div>
            
            <div class="container mx-auto px-4">
                
                <div class="flex items-center justify-center gap-4 mb-10">
                    <div class="h-[2px] bg-gradient-to-r from-transparent to-brand-300 w-12 md:w-24 rounded-full"></div>
                    <h2 class="text-2xl md:text-3xl font-black text-slate-800">چرا بهدون رو انتخاب کنیم؟</h2>
                    <div class="h-[2px] bg-gradient-to-l from-transparent to-brand-300 w-12 md:w-24 rounded-full"></div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 max-w-4xl mx-auto">
                    
                    <div class="flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300 group">
                        <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
                        </div>
                        <h4 class="text-[16px] md:text-lg font-black text-purple-950">خدمات حرفه‌ای</h4>
                    </div>

                    <div class="flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300 group">
                        <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        </div>
                        <h4 class="text-[16px] md:text-lg font-black text-purple-950">نیروی متخصص و ماهر</h4>
                    </div>

                    <div class="flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300 group">
                        <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h4 class="text-[16px] md:text-lg font-black text-purple-950">قیمت منصفانه</h4>
                    </div>

                </div>
            </div>
        </section>`;

    content = content.replace(oldSection, newSection);
    fs.writeFileSync('worker.js', content);
    console.log('Successfully updated features section!');
} else {
    console.log('Features section not found!');
}
