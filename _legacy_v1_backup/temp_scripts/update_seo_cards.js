const fs = require('fs');

const newHTML = `<!-- SEO CONTENT / ABOUT US -->
        <section class="py-12 md:py-20 relative bg-slate-50 overflow-hidden" id="about-us">
            <!-- Decorative BG -->
            <div class="absolute -right-20 top-20 w-72 h-72 bg-brand-200/20 rounded-full blur-[80px]"></div>
            <div class="absolute -left-20 bottom-20 w-72 h-72 bg-success-200/20 rounded-full blur-[80px]"></div>

            <div class="container mx-auto px-4 relative z-10">
                <!-- Section Title & Intro -->
                <div class="max-w-4xl mx-auto mb-16 text-center">
                    <div class="inline-block px-5 py-2 rounded-full bg-white border border-brand-100 text-brand-600 text-sm font-bold shadow-sm mb-6">
                        راهنمای جامع خدمات تخصصی
                    </div>
                    <h2 class="text-2xl md:text-3xl lg:text-4xl font-black text-slate-800 mb-8 leading-snug">
                        درباره <span class="text-transparent bg-clip-text bg-gradient-to-l from-brand-600 to-blue-500">بهدون</span>؛ خدمات حرفه ای ساختمان در تهران
                    </h2>
                    
                    <div class="bg-white p-6 md:p-8 rounded-[2rem] shadow-card border border-slate-200 relative">
                        <div class="absolute -top-4 -right-4 w-12 h-12 bg-success-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-success-500/30 rotate-12">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <div class="text-slate-600 text-sm md:text-base text-justify leading-loose space-y-4 font-medium">
                            <p>تاسیسات، برق‌کشی و زیرساخت‌های عمرانی به عنوان شریان‌های حیاتی هر ساختمان، نقش بی‌بدیلی در آسایش ساکنین ایفا می‌کنند. با این حال، گذر زمان، استفاده از مصالح نامرغوب، و نوسانات محیطی می‌تواند منجر به بروز مشکلات جدی از جمله قطعی برق، نشتی آب و آسیب به بافت ساختمان شود. در کلانشهر تهران، به دلیل قدمت بسیاری از بافت‌های مسکونی، نیاز به خدمات فوری و تخصصی بیش از پیش احساس می‌شود.</p>
                            <div class="bg-brand-50/50 p-4 rounded-2xl border border-brand-100 flex gap-4 mt-4 text-brand-800">
                                <div class="shrink-0 mt-1 text-brand-500">
                                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                </div>
                                گروه خدماتی بهدون با تکیه بر سال‌ها تجربه و در اختیار داشتن تیمی مجرب و پیشرفته‌ترین تجهیزات روز، این افتخار را دارد که طیف گسترده‌ای از خدمات فنی، تاسیساتی و ساختمانی را با بالاترین کیفیت و سرعت به همشهریان تهرانی ارائه دهد.
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <!-- Card 1 -->
                    <div class="bg-white p-8 rounded-[2rem] shadow-card border border-slate-200 flex flex-col hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300">
                        <h3 class="text-xl font-bold text-brand-500 mb-5 flex items-center gap-3">
                            <span class="w-10 h-10 rounded-xl bg-brand-50 text-brand-500 border border-brand-100 flex items-center justify-center text-base shadow-sm">۱</span>
                            تأسیسات؛ شریان‌های حیاتی ساختمان
                        </h3>
                        <div class="text-slate-600 text-justify leading-relaxed text-sm space-y-3">
                            <p>سیستم لوله‌کشی آب و فاضلاب و موتورخانه ساختمان، مانند قلب تپنده آن عمل می‌کنند. نادیده گرفتن نشتی‌های جزئی یا خرابی پمپ‌ها می‌تواند به سرعت تبدیل به بحران و هزینه‌های میلیونی شود.</p>
                            <p>خدمات تخصصی <strong>بهدون</strong> در این بخش شامل رفع اصولی انواع نشتی، تعمیرات پمپ و موتورخانه، نصب تجهیزات بهداشتی، و سرویس سیستم‌های گرمایش و سرمایش است که با تکیه بر تجهیزات مدرن و دقت بالا انجام می‌گیرد.</p>
                        </div>
                    </div>

                    <!-- Card 2 -->
                    <div class="bg-white p-8 rounded-[2rem] shadow-card border border-slate-200 flex flex-col hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300">
                        <h3 class="text-xl font-bold text-amber-500 mb-5 flex items-center gap-3">
                            <span class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center text-base shadow-sm">۲</span>
                            برق‌کشی و ایمنی ساختمان
                        </h3>
                        <div class="text-slate-600 text-justify leading-relaxed text-sm space-y-3">
                            <p>سیستم‌های برقی غیراستاندارد یکی از اصلی‌ترین عوامل خطرساز و آتش‌سوزی در خانه‌ها هستند. سیم‌کشی فرسوده یا اتصالی‌های پنهان علاوه بر خسارت مالی، خطرات جانی به همراه دارند.</p>
                            <ul class="list-disc list-inside mt-3 space-y-1.5 text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <li><strong>سیم‌کشی کامل:</strong> نوسازی ایمن و اصولی کابل‌کشی‌ها.</li>
                                <li><strong>رفع اتصالی:</strong> تشخیص و برطرف کردن فوری قطعی‌ها.</li>
                                <li><strong>نورپردازی:</strong> نصب اصولی لوستر، هالوژن و کلید و پریز.</li>
                            </ul>
                        </div>
                    </div>

                    <!-- Card 3 -->
                    <div class="bg-white p-8 rounded-[2rem] shadow-card border border-slate-200 flex flex-col hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300">
                        <h3 class="text-xl font-bold text-success-500 mb-5 flex items-center gap-3">
                            <span class="w-10 h-10 rounded-xl bg-success-50 text-success-600 border border-success-100 flex items-center justify-center text-base shadow-sm">۳</span>
                            بازسازی و دکوراسیون خلاقانه
                        </h3>
                        <div class="text-slate-600 text-justify leading-relaxed text-sm space-y-3">
                            <p>یک بازسازی اصولی و دکوراسیون متناسب، نه تنها ارزش ملک شما را افزایش می‌دهد بلکه روح تازه‌ای به فضای زندگی یا کار شما می‌بخشد. ایجاد تغییر در چیدمان داخلی نیاز به تخصص و دقت ظریف دارد.</p>
                            <p>تیم‌های نقاشی و گچ‌کاری ما با استفاده از <strong>بهترین متریال‌های بازار</strong> و مهارت بالای خود، خدماتی شامل رنگ‌آمیزی، کاشی‌کاری، کناف‌کاری و نصب کاغذ دیواری را با حداقل زمان ممکن و کیفیتی بی‌نظیر ارائه می‌دهند.</p>
                        </div>
                    </div>

                    <!-- Card 4 -->
                    <div class="bg-white p-8 rounded-[2rem] shadow-card border border-slate-200 flex flex-col hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300">
                        <h3 class="text-xl font-bold text-indigo-500 mb-5 flex items-center gap-3">
                            <span class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center text-base shadow-sm">۴</span>
                            خدمات بنایی؛ پایه محکم ساختمان
                        </h3>
                        <div class="text-slate-600 text-justify leading-relaxed text-sm space-y-3">
                            <p>در هر پروژه ساختمانی یا تغییر پلان داخلی، انجام تخریب ایمن و بنایی اصولی پایه و اساس کیفیت نهایی کار است. اشتباه در تخریب می‌تواند منجر به آسیب به ستون‌ها و لوله‌های پنهان شود.</p>
                            <p>نیروهای ماهر ما خدمات <strong>تخریب کنترل‌شده، دیوارچینی، سیمان‌کاری و رفع نم پایه‌ای</strong> را با رعایت کامل نکات ایمنی و اصول مهندسی انجام می‌دهند تا خیال شما از استحکام بنا راحت باشد.</p>
                        </div>
                    </div>
                </div>

                <!-- Full Width Card for Coverage -->`;

let content = fs.readFileSync('worker.js', 'utf8');

// I will find the exact bounds to replace.
const startIndex = content.indexOf('<!-- SEO CONTENT / ABOUT US -->');
const endIndex = content.indexOf('<!-- Full Width Card for Coverage -->');

if (startIndex !== -1 && endIndex !== -1) {
    const finalContent = content.substring(0, startIndex) + newHTML + content.substring(endIndex + '<!-- Full Width Card for Coverage -->'.length);
    fs.writeFileSync('worker.js', finalContent);
    console.log('Successfully updated the SEO and Cards content.');
} else {
    console.log('Could not find the target comments to replace.');
}
