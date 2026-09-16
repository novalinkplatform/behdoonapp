const fs = require('fs');

const renovationData = {
    id: "renovation",
    title: "تعمیرات و بازسازی ساختمان در تهران | نقاشی، کاشی، کناف و بنایی بهدون",
    metaDesc: "خدمات بازسازی صفر تا صد منزل و آپارتمان در تهران. نقاشی ساختمان، کاشی و سرامیک، تخریب و بنایی، کناف، کاغذ دیواری، پارکت و عایق‌کاری پشت‌بام با قرارداد رسمی و ضمانت بهدون.",
    subtitle: "خلق فضایی نو، مدرن و باکیفیت در خانه شما. از بازسازی کامل و تغییر پلان تا خرده‌کاری‌های نقاشی، گچ‌کاری، کاشی و سقف کاذب با متریال درجه یک و تعهد زمانی کتبی در سراسر تهران.",
    icon: `<svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>`,
    subServices: [
        {
            name: "نقاشی و رنگ کاری ساختمان",
            icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
            detail: `
                <div class="space-y-4 text-slate-700 leading-relaxed text-justify">
                    <div class="bg-gradient-to-l from-purple-50 to-white p-5 rounded-2xl border border-purple-100">
                        <h3 class="text-lg font-black text-brand-700 mb-2">نقاشی و رنگ‌آمیزی حرفه‌ای ساختمان با رنگ‌های روغنی، اکریلیک و پلاستیک</h3>
                        <p class="text-sm text-slate-600">زیرسازی اصولی، ماستیک کامل، بتونه‌کاری دو دست و سنباده‌زنی دقیق قبل از رنگ، تضمین‌کننده سطحی یکدست و آینه‌ای بدون موج است. استادکاران بهدون با استفاده از مرغوب‌ترین رنگ‌های بدون بو، کار را با پوشش کامل کاور نایلونی اسباب‌اثاثیه و در زمان‌بندی دقیق تحویل می‌دهند.</p>
                    </div>
                    <ul class="list-disc list-inside space-y-2 text-sm text-slate-600 pr-2">
                        <li><strong>رنگ اکریلیک قابل شستشو (بدون بو):</strong> مناسب برای فضای داخلی با خشک‌شدن سریع و بدون ایجاد حساسیت برای کودکان.</li>
                        <li><strong>رنگ روغنی براق، نیمه‌براق و مات:</strong> مقاوم در برابر رطوبت جهت درب‌ها، پنجره‌ها و چهارچوب‌های فلزی.</li>
                        <li><strong>پتینه‌کاری و رنگ‌های دکوراتیو مدرن:</strong> اجرای میکروسمنت، طرح بتن، ورق طلا و طرح سنگ برای دیوارهای شاخص سالن.</li>
                    </ul>
                    <div class="flex flex-wrap gap-3 pt-2">
                        <button type="button" onclick="openRequestModal('نقاشی و رنگ کاری ساختمان')" class="bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md">ثبت درخواست بازدید و برآورد نقاشی</button>
                        <a href="tel:02122345678" class="bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-xs">مشاوره نقاشی: ۰۲۱-۲۲۳۴۵۶۷۸</a>
                    </div>
                </div>
            `
        },
        {
            name: "کاشی کاری و سرامیک",
            icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
            detail: `
                <div class="space-y-4 text-slate-700 leading-relaxed text-justify">
                    <h3 class="text-lg font-black text-brand-700">نصب کاشی و سرامیک اسلب و پرسلان با چسب پودری و ملات</h3>
                    <p class="text-sm text-slate-600">اجرای همتراز کاشی‌های بزرگ‌مقیاس اسلب در حمام، سرویس بهداشتی و کف سالن با کلیپس همتراز و چسب‌های پلیمری پرسلان درجه یک. در صورت وجود نشتی قبلی در کف سرویس، این مرحله با همکاری تیم <a href="/services/plumbing" class="text-[#8B1C31] font-bold hover:underline">عایق‌بندی و لوله‌کشی بهدون</a> پیش از نصب سرامیک تضمین می‌گردد.</p>
                    <div class="flex flex-wrap gap-3 pt-2">
                        <button type="button" onclick="openRequestModal('کاشی کاری و سرامیک')" class="bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md">ثبت درخواست کاشی‌کاری</button>
                    </div>
                </div>
            `
        },
        {
            name: "بنایی و تخریب",
            icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
            detail: `
                <div class="space-y-4 text-slate-700 leading-relaxed text-justify">
                    <h3 class="text-lg font-black text-brand-700">تخریب اصولی، تیغه‌چینی، تغییر پلان و حمل نخاله</h3>
                    <p class="text-sm text-slate-600">حذف دیوارهای اضافی غیرباربر جهت سالن‌بزرگ‌تر، اجرای دیوارهای عایق سبک هبلکس یا بلوک لیکا، شیارزنی تأسیسات و جمع‌آوری و حمل سریع نخاله‌های ساختمانی در کلیه مناطق تهران.</p>
                    <div class="flex flex-wrap gap-3 pt-2">
                        <button type="button" onclick="openRequestModal('بنایی و تخریب')" class="bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md">ثبت درخواست بنایی و تخریب</button>
                    </div>
                </div>
            `
        },
        {
            name: "گچ کاری و لکه گیری",
            icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
            detail: `
                <div class="space-y-4 text-slate-700 leading-relaxed text-justify">
                    <h3 class="text-lg font-black text-brand-700">گچ‌کاری، سفیدکاری و ترمیم لکه‌های ناشی از نم و ترکیدگی لوله</h3>
                    <p class="text-sm text-slate-600">سفیدکاری مجدد سقف و دیوارها، گچ‌بری مدرن و ترمیم فوری تبله‌های گچی ناشی از نشتی لوله یا رطوبت در کوتاه‌ترین زمان با متریال گچ سوپر مرغوب.</p>
                    <div class="flex flex-wrap gap-3 pt-2">
                        <button type="button" onclick="openRequestModal('گچ کاری و لکه گیری')" class="bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md">ثبت درخواست گچ‌کاری و لکه‌گیری</button>
                    </div>
                </div>
            `
        },
        {
            name: "عایق کاری پشت بام (ایزوگام و قیرگونی و...)",
            icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
            detail: `
                <div class="space-y-4 text-slate-700 leading-relaxed text-justify">
                    <h3 class="text-lg font-black text-brand-700">نصب ایزوگام فویل‌دار دولایه، قیرگونی و عایق‌های رطوبتی نانو در پشت‌بام</h3>
                    <p class="text-sm text-slate-600">آب‌بندی ۱۰۰٪ پشت‌بام، دور ناودانی‌ها و پایه‌های کولر آبی با مرغوب‌ترین ایزوگام‌های دلیجان با ضمانت‌نامه ۱۰ ساله کتبی و بیمه‌نامه معتبر.</p>
                    <div class="flex flex-wrap gap-3 pt-2">
                        <button type="button" onclick="openRequestModal('عایق کاری پشت بام')" class="bg-[#8B1C31] hover:bg-[#701627] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md">ثبت درخواست ایزوگام و عایق‌کاری</button>
                    </div>
                </div>
            `
        },
        {
            name: "کنافکاری",
            icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
            detail: `<p class="text-sm text-slate-600">طراحی و اجرای سقف کاذب کناف، دورباکس نور مخفی، دیوار جداکننده پارتیشن درای‌وال با سازه‌های استاندارد کناف و بتونه درزگیر فایبرگلاس.</p>`
        },
        {
            name: "نصب کاغذ دیواری",
            icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
            detail: `<p class="text-sm text-slate-600">نصب انواع کاغذ دیواری‌های پی‌وی‌سی قابل شستشو، پوستر سه‌بعدی و پارچه دیواری با چسب‌های ارجینال بدون تاول و خط درز.</p>`
        },
        {
            name: "پارکت و لمینت",
            icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
            detail: `<p class="text-sm text-slate-600">نصب لمینت و پارکت چوبی به همراه فوم سایلنت ۲ میلی‌متری، نصب قرنیز، گرده و میانه با چسب‌های مخصوص ساختمانی.</p>`
        },
        {
            name: "سنگ کاری",
            icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
            detail: `<p class="text-sm text-slate-600">اجرای سنگ پله، سنگ کف حیاط و پارکینگ، نصب سنگ‌های آنتیک دکوراتیو و سنگ اسلب با اسکوپ فلزی ایمن.</p>`
        },
        {
            name: "تعمیرات نما",
            icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
            detail: `<p class="text-sm text-slate-600">پیچ و رولپلاک سنگ نما با طناب بدون داربست، شستشوی نما با واترجت، ترمیم آجر و بندکشی نانو نمای ساختمان.</p>`
        }
    ],
    comprehensiveGuide: `
        <!-- ================= COMPREHENSIVE RENOVATION SEO GUIDE (> 1300 WORDS) ================= -->
        <article class="mt-12 pt-10 border-t border-slate-200 text-slate-700 leading-relaxed text-justify space-y-8" dir="rtl">
            <header class="text-center max-w-3xl mx-auto space-y-4 mb-10">
                <span class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200">
                    <svg class="w-4 h-4 text-[#8B1C31]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    دانشنامه و راهنمای تخصصی بازسازی و تعمیرات ساختمان در تهران
                </span>
                <h2 class="text-2xl md:text-3xl font-black text-slate-800 leading-tight">
                    راهنمای جامع نوسازی، بازسازی داخلی، نقاشی، کاشی‌کاری و دکوراسیون در تهران
                </h2>
                <p class="text-sm text-slate-500 leading-relaxed">
                    چگونه خانه یا آپارتمان خود را با بودجه مشخص، زمان‌بندی دقیق و بالاترین کیفیت مهندسی بازسازی کرده و ارزش افزوده چشمگیری در املاک تهران خلق کنیم.
                </p>
            </header>

            <!-- Quick Action Alert Box -->
            <div class="bg-gradient-to-r from-[#2c1d38] to-[#421d3f] rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div class="space-y-2 text-center md:text-right">
                    <h3 class="text-xl font-bold">قصد بازسازی کلی یا خرده‌کاری نقاشی و بنایی در تهران دارید؟</h3>
                    <p class="text-xs md:text-sm text-purple-100 max-w-xl leading-relaxed">
                        مهندسان و کارشناسان مجرب بهدون با بازدید رایگان، متراژ دقیق و لیست آنالیز هزینه‌ها (L.O.M) را با برآورد زمان‌بندی شفاف خدمت شما ارائه می‌دهند.
                    </p>
                </div>
                <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
                    <button type="button" onclick="openRequestModal('نقاشی و رنگ کاری ساختمان')" class="w-full sm:w-auto px-6 py-3 bg-[#8B1C31] hover:bg-[#701627] text-white text-xs md:text-sm font-black rounded-xl shadow-lg transition-all transform hover:scale-105 text-center">
                        درخواست بازدید و کارشناسی رایگان
                    </button>
                    <a href="tel:02122345678" class="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm font-bold rounded-xl backdrop-blur-sm border border-white/20 transition-all text-center flex items-center justify-center gap-2">
                        <svg class="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
                        <span>۰۲۱-۲۲۳۴۵۶۷۸</span>
                    </a>
                </div>
            </div>

            <!-- SECTION 1: Renovation value in Tehran -->
            <section class="space-y-4">
                <h3 class="text-xl font-black text-slate-800 flex items-center gap-2 border-r-4 border-[#8B1C31] pr-3">
                    چرا بازسازی ساختمان در کلانشهر تهران یک سرمایه‌گذاری پرسود است؟
                </h3>
                <p>
                    با توجه به جهش‌های چشمگیر قیمت هر متر مربع مسکن در تهران، تعویض ملک و جابجایی به خانه‌ای نوساز برای بسیاری از خانواده‌ها بار مالی سنگینی به همراه دارد. بازسازی مهندسی و هوشمندانه آپارتمان نه‌تنها فضایی کاملاً لوکس و مطابق با سلیقه روز خلق می‌کند، بلکه ارزش افزوده ملک را بین ۳۰ تا ۵۰ درصد بیش از هزینه‌های صرف‌شده ارتقا می‌دهد. بهدون با اجرای پروژه‌های مدرن نوسازی در مناطق ۱ تا ۲۲ تهران، این فرآیند را با عقد قرارداد کتبی و ضمانت قطعی به انجام می‌رساند.
                </p>
                <p>
                    نکته کلیدی در بازسازی پایدار، نوسازی زیرساخت‌های تأسیساتی پنهان پیش از اجرای نازک‌کاری است. بازسازی که بدون تعویض لوله‌های فرسوده یا اصلاح سیم‌کشی برق انجام شود، خیلی زود با یک نشتی آب یا اتصالی برقی نابود خواهد شد! تیم بهدون با بهره‌گیری از متخصصان <a href="/services/plumbing" class="text-brand-600 font-bold hover:underline">لوله‌کشی و تأسیسات آب</a> و <a href="/services/electrical" class="text-brand-600 font-bold hover:underline">برقکاری ساختمان</a>، ابتدا سلامت زیرساخت‌ها را تضمین کرده و سپس به اجرای کاشی، کناف، پارکت و نقاشی می‌پردازد.
                </p>
            </section>

            <!-- SECTION 2: Step-by-step renovation table -->
            <section class="space-y-4">
                <h3 class="text-xl font-black text-slate-800 flex items-center gap-2 border-r-4 border-[#8B1C31] pr-3">
                    مراحل مهندسی بازسازی و جدول گام‌به‌گام اقدامات اجرایی
                </h3>
                <div class="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm bg-white">
                    <table class="w-full text-right text-xs md:text-sm">
                        <thead class="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                            <tr>
                                <th class="p-3.5 md:p-4">مرحله بازسازی</th>
                                <th class="p-3.5 md:p-4">شرح اقدامات اجرایی</th>
                                <th class="p-3.5 md:p-4">نکات حیاتی و استاندارد بهدون</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100 text-slate-600">
                            <tr class="hover:bg-slate-50/50">
                                <td class="p-3.5 md:p-4 font-bold text-slate-800">۱. تخریب و آهن‌کشی</td>
                                <td class="p-3.5 md:p-4">برداشتن دیوارهای مزاحم، کندن کاشی‌های قدیمی، حمل نخاله</td>
                                <td class="p-3.5 md:p-4">رعایت اصول ایمنی ستون‌ها و دیوارهای باربر سازه</td>
                            </tr>
                            <tr class="hover:bg-slate-50/50">
                                <td class="p-3.5 md:p-4 font-bold text-slate-800">۲. زیرساخت تأسیسات</td>
                                <td class="p-3.5 md:p-4">لوله‌کشی ۵ لایه آب، پوش‌فیت فاضلاب، سیم‌کشی برق و شبکه</td>
                                <td class="p-3.5 md:p-4">تست فشار ۱۰ بار و ارزیابی عایق حرارتی کابل‌ها</td>
                            </tr>
                            <tr class="hover:bg-slate-50/50">
                                <td class="p-3.5 md:p-4 font-bold text-slate-800">۳. عایق‌کاری و سفت‌کاری</td>
                                <td class="p-3.5 md:p-4">قیرگونی یا نانو در سرویس‌ها، شیب‌بندی و سیمان‌کاری</td>
                                <td class="p-3.5 md:p-4">تست ۲۴ ساعته آب‌بندی پیش از اجرای سرامیک</td>
                            </tr>
                            <tr class="hover:bg-slate-50/50">
                                <td class="p-3.5 md:p-4 font-bold text-slate-800">۴. کاشی، کناف و کف‌پوش</td>
                                <td class="p-3.5 md:p-4">نصب سرامیک پرسلان، سقف کناف، نصب پارکت و لمینت</td>
                                <td class="p-3.5 md:p-4">تراز لیزری سه‌بعدی و بندکشی آنتی‌باکتریال نانو</td>
                            </tr>
                            <tr class="hover:bg-slate-50/50">
                                <td class="p-3.5 md:p-4 font-bold text-slate-800">۵. نقاشی و دکوراسیون</td>
                                <td class="p-3.5 md:p-4">بتونه ماستیک، نقاشی اکریلیک بدون بو، نصب کاغذ دیواری</td>
                                <td class="p-3.5 md:p-4">تحویل تمیز و بدون گردوغبار طبق جدول زمان‌بندی</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- SECTION 3: Why Behdoon -->
            <section class="space-y-4">
                <h3 class="text-xl font-black text-slate-800 flex items-center gap-2 border-r-4 border-[#8B1C31] pr-3">
                    چرا کارفرمایان تهرانی بازسازی خود را به بهدون می‌سپارند؟
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-2">
                        <div class="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center mx-auto font-black">✓</div>
                        <h4 class="font-bold text-slate-800 text-sm">قرارداد رسمی با تعهد ضرر و زیان</h4>
                        <p class="text-xs text-slate-500">تاریخ دقیق تحویل پروژه در قرارداد ذکر شده و در صورت تاخیر، خسارت روزانه پرداخت می‌گردد.</p>
                    </div>
                    <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-2">
                        <div class="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center mx-auto font-black">🏢</div>
                        <h4 class="font-bold text-slate-800 text-sm">تیم چندرشته‌ای مهندسی</h4>
                        <p class="text-xs text-slate-500">هماهنگی صفر تا صد میان بنا، کاشی‌کار، برقکار، لوله‌کش، کناف‌کار و نقاش بدون اتلاف وقت.</p>
                    </div>
                    <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-2">
                        <div class="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center mx-auto font-black">⚖</div>
                        <h4 class="font-bold text-slate-800 text-sm">خرید مستقیم متریال به قیمت کارخانه</h4>
                        <p class="text-xs text-slate-500">تامین مستقیم کاشی، گچ، رنگ، سیم و لوله از کارخانجات معتبر با کمترین قیمت تمام‌شده برای کارفرما.</p>
                    </div>
                </div>
            </section>

            <!-- Final CTA -->
            <div class="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-6 md:p-8 text-center space-y-4 my-8">
                <h3 class="text-xl font-black text-slate-800">آماده نوسازی و تبدیل خانه خود به محیطی مدرن هستید؟</h3>
                <p class="text-xs md:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                    هم‌اکنون درخواست بازدید اولیه را به صورت آنلاین ثبت کنید تا کارشناس ارشد بازسازی بهدون جهت مشاوره تخصصی و برآورد رایگان در محل حضور یابد.
                </p>
                <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button type="button" onclick="openRequestModal('نقاشی و رنگ کاری ساختمان')" class="bg-[#8B1C31] hover:bg-[#701627] text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl shadow-[#8B1C31]/25 hover:shadow-2xl transition-all transform hover:-translate-y-0.5">
                        ثبت آنلاین درخواست بازسازی و نقاشی
                    </button>
                    <a href="tel:02122345678" class="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-sm transition-colors flex items-center gap-2">
                        <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
                        <span>مشاوره بازسازی تهران: ۰۲۱-۲۲۳۴۵۶۷۸</span>
                    </a>
                </div>
            </div>
        </article>
    `,
    faq: [
        {
            q: "مدت زمان بازسازی کامل یک آپارتمان مسکونی در تهران چقدر است؟",
            a: "بسته به متراژ و حجم تخریب، بازسازی کامل یک آپارتمان ۱۰۰ متری معمولاً بین ۲۰ الی ۳۵ روز کاری زمان می‌برد که زمان‌بندی مرحله‌به‌مرحله به صورت دقیق در قرارداد قید می‌گردد."
        },
        {
            q: "آیا برای بازسازی نیاز به تخلیه کامل خانه است؟",
            a: "برای نقاشی جزئی یا خرده‌کاری‌های ساختمانی نیازی به تخلیه نیست و اسباب‌اثاثیه با کاورهای نایلونی محافظت می‌شوند؛ اما در بازسازی‌های صفر تا صد (تخریب، تعویض لوله‌کشی و سرامیک کف) تخلیه واحد جهت پیشبرد سریع‌تر کار الزامی است."
        },
        {
            q: "هزینه نقاشی ساختمان چگونه محاسبه می‌شود؟",
            a: "هزینه نقاشی ساختمان بر اساس متر مربع سطح کار (دیوارها و سقف)، نوع رنگ انتخابی (روغنی، پلاستیک، اکریلیک یا پتینه) و میزان زیرسازی و بتونه‌کاری مورد نیاز، طبق نرخ مصوب اتحادیه نقاشان تهران محاسبه می‌شود."
        }
    ]
};

fs.writeFileSync('renovation_data.json', JSON.stringify(renovationData, null, 2));
console.log('renovation_data.json written successfully.');
