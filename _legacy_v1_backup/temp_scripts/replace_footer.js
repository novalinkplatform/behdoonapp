const fs = require('fs');

let content = fs.readFileSync('worker.js', 'utf8');

const newFooterHTML = `const footerHTML = \`
    <!-- ================= UNIFIED ISLAND FOOTER ================= -->
    <footer class="bg-slate-50 py-12 md:py-16 border-t border-slate-200">
        <div class="container mx-auto px-4 max-w-6xl">
            <!-- MAIN ISLAND CARD -->
            <div class="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 md:p-10 lg:p-12">
                
                <!-- ROW 1: Main Links -->
                <div class="flex flex-wrap justify-center gap-6 md:gap-10 mb-8 text-slate-700 font-bold text-sm md:text-base">
                    <a href="/" class="hover:text-brand-600 transition-colors flex items-center gap-1.5 group">
                        <svg class="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                        صفحه اصلی
                    </a>
                    <a href="/services/tasisat" class="hover:text-brand-600 transition-colors flex items-center gap-1.5 group">
                        <svg class="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        خدمات
                    </a>
                    <a href="/magazine" class="hover:text-brand-600 transition-colors flex items-center gap-1.5 group">
                        <svg class="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                        دانشنامه
                    </a>
                    <a href="/#about" class="hover:text-brand-600 transition-colors flex items-center gap-1.5 group">
                        <svg class="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        درباره ما
                    </a>
                    <a href="tel:09333256885" class="hover:text-brand-600 transition-colors flex items-center gap-1.5 group">
                        <svg class="w-4 h-4 text-slate-400 group-hover:text-brand-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        تماس با ما
                    </a>
                </div>

                <hr class="border-slate-100 mb-8">

                <!-- ROW 2: Contact Info -->
                <div class="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-16 mb-10">
                    <!-- Phone -->
                    <a href="tel:09333256885" class="flex items-center gap-4 text-slate-800 hover:text-brand-600 transition-all group">
                        <div class="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 group-hover:bg-brand-500 group-hover:text-white transition-all transform group-hover:scale-105 shadow-sm">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs text-slate-500 mb-0.5">تماس تلفنی</span>
                            <span class="font-black text-lg dir-ltr">0933 325 6885</span>
                        </div>
                    </a>
                    
                    <!-- WhatsApp -->
                    <a href="https://wa.me/989333256885" target="_blank" rel="noopener noreferrer" class="flex items-center gap-4 text-slate-800 hover:text-green-600 transition-all group">
                        <div class="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-all transform group-hover:scale-105 shadow-sm">
                            <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.662-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs text-slate-500 mb-0.5">پشتیبانی آنلاین</span>
                            <span class="font-bold text-base">ارتباط در واتساپ</span>
                        </div>
                    </a>
                    
                    <!-- Instagram -->
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="flex items-center gap-4 text-slate-800 hover:text-pink-600 transition-all group">
                        <div class="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-600 group-hover:bg-gradient-to-tr group-hover:from-yellow-500 group-hover:via-pink-500 group-hover:to-purple-500 group-hover:text-white transition-all transform group-hover:scale-105 shadow-sm">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2" stroke="currentColor" stroke-width="2"></circle></svg>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs text-slate-500 mb-0.5">شبکه‌های اجتماعی</span>
                            <span class="font-bold text-base">اینستاگرام بهدون</span>
                        </div>
                    </a>
                </div>

                <!-- ROW 3: SEO Intro -->
                <div class="bg-slate-50 border border-slate-100 rounded-3xl p-6 md:p-8 text-slate-600 text-sm md:text-base leading-loose mb-8">
                    <h2 class="text-lg font-black text-slate-800 mb-4">بهدون؛ خدمات حرفه‌ای ساختمان در تهران</h2>
                    <p class="mb-4">بهدون ارائه‌دهنده خدمات فنی و ساختمانی در تهران است و با هدف ساده‌تر کردن دسترسی به خدمات تخصصی ساختمان فعالیت می‌کند.</p>
                    <p class="mb-4">خدمات بهدون حوزه‌های مختلفی از نیازهای ساختمان را پوشش می‌دهد؛ از جمله <a href="/services/tasisat" class="text-brand-600 hover:underline">تأسیسات ساختمان</a>، لوله‌کشی آب و فاضلاب، رفع نشتی، نشت‌یابی، رفع نم و رطوبت، تعمیرات سیستم‌های گرمایشی و سرمایشی، <a href="/services/electrical" class="text-brand-600 hover:underline">برق‌کشی و روشنایی</a>، <a href="/services/renovation" class="text-brand-600 hover:underline">بازسازی و دکوراسیون</a> و <a href="/services/construction" class="text-brand-600 hover:underline">خدمات بنایی و عمرانی</a>.</p>
                    <p class="mb-4">بهدون تلاش می‌کند فرایند دریافت خدمات ساختمانی را برای ساکنان تهران ساده‌تر کند؛ به‌گونه‌ای که کاربران بتوانند متناسب با نیاز خود، خدمت موردنظرشان را پیدا کرده و برای بررسی و اجرای آن درخواست خود را ثبت کنند.</p>
                    <p class="mb-4">خدمات فنی ساختمان می‌تواند از تعمیرات و نگهداری‌های روزمره تا مشکلات تخصصی‌تر مانند نشتی آب، مشکلات تأسیسات، ایرادات برق، بازسازی بخش‌هایی از ساختمان و خدمات بنایی را شامل شود. انتخاب روش مناسب برای هر کار به شرایط ساختمان و نوع مشکل بستگی دارد و در بسیاری از موارد، بررسی اولیه متخصص می‌تواند از خسارت و هزینه‌های اضافی جلوگیری کند.</p>
                    <p class="mb-5">بهدون خدمات فنی و ساختمانی خود را در مناطق مختلف تهران ارائه می‌دهد و تلاش می‌کند تجربه‌ای ساده، منظم و قابل اعتماد برای دریافت خدمات ساختمان ایجاد کند.</p>
                    <div class="bg-white p-4 rounded-xl border border-slate-200 inline-block">
                        <span class="font-bold text-slate-800 ml-2">برای دریافت خدمات ساختمانی در تهران و ثبت درخواست می‌توانید با بهدون تماس بگیرید:</span>
                        <a href="tel:09333256885" class="text-brand-600 font-black text-lg dir-ltr inline-block hover:text-brand-700 transition-colors">0933 325 6885</a>
                    </div>
                </div>

                <!-- ROW 4: Copyright & Legal -->
                <hr class="border-slate-100 mb-6">
                <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-slate-500">
                    <div class="font-bold text-slate-600">© بهدون | خدمات حرفه‌ای ساختمان در تهران</div>
                    <div class="flex items-center gap-6">
                        <a href="#" class="hover:text-brand-600 transition-colors">حریم خصوصی</a>
                        <a href="#" class="hover:text-brand-600 transition-colors">قوانین و مقررات</a>
                    </div>
                </div>

            </div>
        </div>
        
        <!-- Mobile Bottom Spacing for fixed CTAs if any -->
        <div class="h-24 md:hidden"></div>
    </footer>
\`;`;

// Using regex to replace the entire old footer string definition
const footerRegex = /const footerHTML = `[\s\S]*?`;/;

if (footerRegex.test(content)) {
    content = content.replace(footerRegex, newFooterHTML);
    fs.writeFileSync('worker.js', content);
    console.log('Footer successfully replaced.');
} else {
    console.log('Regex did not match the footer HTML.');
}

