const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const newFooterHTML = `
    <footer class="bg-slate-900 text-slate-300 py-12 pb-28 md:pb-12 border-t-[4px] border-slate-800 relative overflow-hidden">
        <div class="container mx-auto px-4 max-w-4xl text-center flex flex-col gap-10 relative z-10">
            
            <!-- Row 1: Links -->
            <div class="flex flex-wrap justify-center gap-6 text-sm font-bold">
                <a href="/#services" class="hover:text-white transition-colors">انواع خدمات</a>
                <a href="/magazine" class="hover:text-white transition-colors">دانشنامه</a>
                <a href="/#about-us" class="hover:text-white transition-colors">درباره بهدون</a>
            </div>

            <!-- Row 2: Phone & WhatsApp -->
            <div class="flex flex-wrap justify-center items-center gap-4">
                <a href="tel:\${PHONE}" class="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-2xl transition-colors shadow-sm">
                    <svg class="w-5 h-5 text-success-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    <span dir="ltr" class="font-bold tracking-widest">\${PHONE_DISPLAY}</span>
                </a>
                <a href="https://wa.me/\${WHATSAPP}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-2xl transition-colors shadow-sm">
                    <svg class="w-5 h-5 text-success-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    <span dir="ltr" class="font-bold">WhatsApp</span>
                </a>
            </div>

            <!-- Row 3: Behdoon Description & Logo -->
            <div class="flex flex-col items-center gap-4">
                <div class="flex items-center gap-3 opacity-80 grayscale">
                    <div class="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-inner">ب</div>
                    <span class="font-black text-2xl text-white tracking-tight">بهدون</span>
                </div>
                <p class="text-slate-400 text-sm leading-loose max-w-2xl mx-auto">
                    ما با کادری مجرب و تجهیزات پیشرفته، آرامش را به خانه شما بازمی‌گردانیم. تمامی خدمات ما با ضمانت و ارائه فاکتور رسمی انجام می‌پذیرد.
                </p>
            </div>

        </div>
        
        <div class="mt-10 pt-6 border-t border-slate-800 text-center text-slate-500 text-xs flex justify-center items-center gap-4 container mx-auto max-w-4xl px-4 relative z-10">
            <p>تمام حقوق برای گروه خدماتی بهدون محفوظ است. &copy; 1403</p>
        </div>
    </footer>`;

// 1. Replace the footerHTML template literal
const footerHTMLLocalRegex = /<footer class="bg-brand-600 text-brand-100 py-12[\s\S]*?<\/footer>/;
content = content.replace(footerHTMLLocalRegex, newFooterHTML.trim());

// 2. We also need to check the homeHTML block in const html = `...` 
// If it contains a footer block, replace it there too.
let homeHTMLStartIndex = content.indexOf('const html = `');
if (homeHTMLStartIndex !== -1) {
    let nextBacktickIndex = content.indexOf('`;', homeHTMLStartIndex);
    if (nextBacktickIndex !== -1) {
        let originalHomeHTML = content.substring(homeHTMLStartIndex, nextBacktickIndex);
        let updatedHomeHTML = originalHomeHTML.replace(footerHTMLLocalRegex, newFooterHTML.trim());
        content = content.substring(0, homeHTMLStartIndex) + updatedHomeHTML + content.substring(nextBacktickIndex);
    }
}

fs.writeFileSync('worker.js', content);
console.log('Footer updated successfully in all places.');
