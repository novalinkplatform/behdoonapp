const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const reviews = [
    { gender: "male", name: "علی محمدی", svc: "تعمیرات لوله‌کشی", text: "کارشون بسیار دقیق و تمیز بود. نشتی لوله رو با دستگاه تشخیص دادن و بدون خرابی زیاد درستش کردن." },
    { gender: "female", name: "مریم رستمی", svc: "سرمایش و گرمایش", text: "تیم بهدون خیلی سریع برای تعمیر پکیج ما آمدند. برخوردشان عالی بود و مشکل کاملاً برطرف شد." },
    { gender: "male", name: "سعید کریمی", svc: "برقکاری ساختمان", text: "برای اتصالی برق تماس گرفتم، در کمتر از یک ساعت رسیدن و مشکل رو با هزینه منصفانه حل کردن." },
    { gender: "female", name: "فاطمه سعیدی", svc: "بازسازی خانه", text: "بازسازی سرویس بهداشتی رو بهشون سپردیم. هم مصالح خوبی استفاده کردن و هم سر وقت تحویل دادن." },
    { gender: "male", name: "رضا ناصری", svc: "نصب و تعمیر کولر", text: "کولر گازی ما مشکل خنک‌کنندگی داشت، سرویس‌کارشون با حوصله گاز کولر رو شارژ کرد و الان عالیه." },
    { gender: "female", name: "زهرا توکلی", svc: "تعمیرات تاسیسات", text: "پشتیبانی عالی داشتن و بعد از کار هم پیگیر بودن که مشکلی نداشته باشیم. واقعا راضیم." },
    { gender: "male", name: "محمد حسینی", svc: "لوله بازکنی", text: "نصف شب لوله آشپزخونه گرفته بود، تماس گرفتیم و فوراً یک متخصص فرستادن. دستشون درد نکنه." },
    { gender: "male", name: "امیر جلالی", svc: "سیم‌کشی و برق", text: "کل سیم‌کشی واحد ما رو تعویض کردن. کارشون حرفه‌ای بود و قیمت‌هاشون هم نسبت به بقیه منصفانه بود." }
];

const stars = `
<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
`.repeat(5);

const maleAvatar = \`<svg viewBox="0 0 100 100" class="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 shadow-sm" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" fill="#e0f2fe"/>
  <circle cx="50" cy="35" r="15" fill="#3b82f6"/>
  <path d="M20 90 Q 50 50 80 90" stroke="#3b82f6" stroke-width="10" fill="none" stroke-linecap="round"/>
</svg>\`;

const femaleAvatar = \`<svg viewBox="0 0 100 100" class="w-10 h-10 rounded-full bg-pink-50 border border-pink-200 shadow-sm" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" fill="#fce7f3"/>
  <path d="M50 20 A 15 15 0 0 0 35 35 V 50 A 15 15 0 0 0 65 50 V 35 A 15 15 0 0 0 50 20 Z" fill="#ec4899"/>
  <path d="M25 90 Q 50 60 75 90" stroke="#ec4899" stroke-width="10" fill="none" stroke-linecap="round"/>
</svg>\`;

const newSliderHtml = `
    <!-- ================= TESTIMONIALS SLIDER ================= -->
    <section class="py-12 bg-white relative border-t border-slate-100 overflow-hidden">
        <div class="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-3xl -z-10 opacity-60"></div>
        <div class="absolute bottom-0 left-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -z-10 opacity-60"></div>

        <div class="container mx-auto px-4 max-w-7xl">
            <div class="flex items-center justify-center gap-4 mb-10 text-center">
                <h2 class="text-2xl md:text-3xl font-black text-slate-800">چرا مشتریان بهدون را برگزیده اند</h2>
            </div>

            <!-- Slider Container -->
            <div class="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 md:gap-6 pb-6 px-4 md:px-8 -mx-4 md:-mx-8 scroll-pl-4 md:scroll-pl-8">
                ${reviews.map(r => `
                <div class="snap-center shrink-0 w-[280px] md:w-[320px] bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col">
                    <div class="text-brand-500 mb-4 opacity-10 absolute top-4 left-4">
                        <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" /></svg>
                    </div>
                    <div class="flex items-center gap-1 text-yellow-400 mb-4">
                        ${stars}
                    </div>
                    <p class="text-slate-600 text-sm leading-relaxed mb-6 flex-grow relative z-10">${r.text}</p>
                    <div class="flex items-center gap-3 mt-auto relative z-10 border-t border-slate-100 pt-4">
                        ${r.gender === 'male' ? maleAvatar : femaleAvatar}
                        <div>
                            <h4 class="text-sm font-bold text-slate-800">${r.name}</h4>
                            <span class="text-xs text-slate-500">${r.svc}</span>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
            
            <div class="mt-4 flex justify-center gap-2 md:hidden">
                <span class="text-xs text-slate-400 flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    برای دیدن نظرات بیشتر بکشید
                </span>
            </div>
        </div>
    </section>
`;

// To replace the old sliders, we can use regex to find them.
// The old slider starts with <!-- ================= TESTIMONIALS SLIDER ================= -->
// and ends with </section> directly before <!-- ================= UNIFIED ISLAND FOOTER ================= -->

// Split the content by the old slider and replace it
const oldSliderRegex = /<!-- ================= TESTIMONIALS SLIDER ================= -->[\s\S]*?<\/section>\s*(?=<!-- ================= UNIFIED ISLAND FOOTER ================= -->)/g;

if (content.match(oldSliderRegex)) {
    content = content.replace(oldSliderRegex, newSliderHtml + '\n    ');
    fs.writeFileSync('worker.js', content);
    console.log('Slider updated successfully.');
} else {
    console.log('Could not find the old sliders!');
}
