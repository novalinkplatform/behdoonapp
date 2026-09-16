const fs = require('fs');

let frontendCode = fs.readFileSync('src/frontend.js', 'utf8');

const newServiceOptions = `
                <div class="space-y-3" id="serviceOptions">
                    <!-- HVAC -->
                    <div class="border border-slate-200 rounded-xl overflow-hidden bg-white">
                        <button type="button" class="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors" onclick="toggleAccordion('cat-hvac')">
                            <span class="font-bold text-slate-700">سرمایش و گرمایش</span>
                            <svg class="w-5 h-5 text-slate-400 transform transition-transform" id="icon-cat-hvac" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <div id="content-cat-hvac" class="hidden border-t border-slate-100 bg-slate-50 p-3 space-y-2">
                            <label class="flex items-center p-3 border border-slate-200 bg-white rounded-lg cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="نصب و سرویس کولر آبی" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-3 text-sm font-medium text-slate-700">نصب و سرویس کولر آبی</span>
                            </label>
                            <label class="flex items-center p-3 border border-slate-200 bg-white rounded-lg cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="نصب و سرویس پکیج" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-3 text-sm font-medium text-slate-700">نصب و سرویس پکیج</span>
                            </label>
                            <label class="flex items-center p-3 border border-slate-200 bg-white rounded-lg cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="نصب و سرویس رادیاتور شوفاژ" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-3 text-sm font-medium text-slate-700">نصب و سرویس رادیاتور شوفاژ</span>
                            </label>
                            <label class="flex items-center p-3 border border-slate-200 bg-white rounded-lg cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="تعمیر و سرویس آبگرمکن" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-3 text-sm font-medium text-slate-700">تعمیر و سرویس آبگرمکن</span>
                            </label>
                        </div>
                    </div>

                    <!-- Building -->
                    <div class="border border-slate-200 rounded-xl overflow-hidden bg-white">
                        <button type="button" class="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors" onclick="toggleAccordion('cat-build')">
                            <span class="font-bold text-slate-700">تعمیرات و بازسازی ساختمان</span>
                            <svg class="w-5 h-5 text-slate-400 transform transition-transform" id="icon-cat-build" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <div id="content-cat-build" class="hidden border-t border-slate-100 bg-slate-50 p-3 space-y-2 max-h-64 overflow-y-auto hide-scrollbar">
                            <label class="flex items-center p-3 border border-slate-200 bg-white rounded-lg cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="نقاشی و رنگ کاری ساختمان" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-3 text-sm font-medium text-slate-700">نقاشی و رنگ کاری ساختمان</span>
                            </label>
                            <label class="flex items-center p-3 border border-slate-200 bg-white rounded-lg cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="کاشی کاری و سرامیک" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-3 text-sm font-medium text-slate-700">کاشی کاری و سرامیک</span>
                            </label>
                            <label class="flex items-center p-3 border border-slate-200 bg-white rounded-lg cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="بنایی و تخریب" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-3 text-sm font-medium text-slate-700">بنایی و تخریب</span>
                            </label>
                            <label class="flex items-center p-3 border border-slate-200 bg-white rounded-lg cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="گچ کاری و لکه گیری" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-3 text-sm font-medium text-slate-700">گچ کاری و لکه گیری</span>
                            </label>
                            <label class="flex items-center p-3 border border-slate-200 bg-white rounded-lg cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="عایق کاری پشت بام" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-3 text-sm font-medium text-slate-700">عایق کاری پشت بام (ایزوگام و قیرگونی و...)</span>
                            </label>
                            <label class="flex items-center p-3 border border-slate-200 bg-white rounded-lg cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="کنافکاری" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-3 text-sm font-medium text-slate-700">کنافکاری</span>
                            </label>
                            <label class="flex items-center p-3 border border-slate-200 bg-white rounded-lg cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="نصب کاغذ دیواری" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-3 text-sm font-medium text-slate-700">نصب کاغذ دیواری</span>
                            </label>
                            <label class="flex items-center p-3 border border-slate-200 bg-white rounded-lg cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="پارکت و لمینت" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-3 text-sm font-medium text-slate-700">پارکت و لمینت</span>
                            </label>
                            <label class="flex items-center p-3 border border-slate-200 bg-white rounded-lg cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="سنگ کاری" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-3 text-sm font-medium text-slate-700">سنگ کاری</span>
                            </label>
                            <label class="flex items-center p-3 border border-slate-200 bg-white rounded-lg cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="تعمیرات نما" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-3 text-sm font-medium text-slate-700">تعمیرات نما</span>
                            </label>
                        </div>
                    </div>

                    <!-- Plumbing -->
                    <div class="border border-slate-200 rounded-xl overflow-hidden bg-white">
                        <button type="button" class="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors" onclick="toggleAccordion('cat-plumbing')">
                            <span class="font-bold text-slate-700">لوله کشی</span>
                            <svg class="w-5 h-5 text-slate-400 transform transition-transform" id="icon-cat-plumbing" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <div id="content-cat-plumbing" class="hidden border-t border-slate-100 bg-slate-50 p-3 space-y-2 max-h-64 overflow-y-auto hide-scrollbar">
                            <label class="flex items-center p-3 border border-slate-200 bg-white rounded-lg cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="نصب و تعمیر شیرآلات" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-3 text-sm font-medium text-slate-700">نصب و تعمیر شیرآلات</span>
                            </label>
                            <label class="flex items-center p-3 border border-slate-200 bg-white rounded-lg cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="نصب سینک ظرفشویی" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-3 text-sm font-medium text-slate-700">نصب سینک ظرفشویی</span>
                            </label>
                            <label class="flex items-center p-3 border border-slate-200 bg-white rounded-lg cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="تشخیص و ترمیم ترکیدگی لوله" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-3 text-sm font-medium text-slate-700">تشخیص و ترمیم ترکیدگی لوله</span>
                            </label>
                            <label class="flex items-center p-3 border border-slate-200 bg-white rounded-lg cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="رفع نم و نشتی و رطوبت" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-3 text-sm font-medium text-slate-700">رفع نم و نشتی و رطوبت</span>
                            </label>
                            <label class="flex items-center p-3 border border-slate-200 bg-white rounded-lg cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="نصب و سرویس منبع آب" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-3 text-sm font-medium text-slate-700">نصب و سرویس منبع آب</span>
                            </label>
                            <label class="flex items-center p-3 border border-slate-200 bg-white rounded-lg cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="نصب و تعمیر دستگاه تصفیه آب" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-3 text-sm font-medium text-slate-700">نصب و تعمیر دستگاه تصفیه آب</span>
                            </label>
                            <label class="flex items-center p-3 border border-slate-200 bg-white rounded-lg cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="نصب و سرویس توالت فرنگی و ایرانی" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-3 text-sm font-medium text-slate-700">نصب و سرویس توالت فرنگی و ایرانی</span>
                            </label>
                            <label class="flex items-center p-3 border border-slate-200 bg-white rounded-lg cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="نصب و تعمیر فلاش تانک و سیفون" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-3 text-sm font-medium text-slate-700">نصب و تعمیر فلاش تانک و سیفون</span>
                            </label>
                        </div>
                    </div>
                </div>`;

const startOptions = frontendCode.indexOf('<div class="grid grid-cols-1 gap-3" id="serviceOptions">');
const endOptions = frontendCode.indexOf('</div>', startOptions + 100);

const oldBlock = `                <div class="grid grid-cols-1 gap-3" id="serviceOptions">
                    <label class="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <input type="radio" name="modalService" value="سرمایش و گرمایش" class="w-5 h-5 text-[#8B1C31] focus:ring-[#8B1C31]">
                        <span class="mr-3 font-bold text-slate-700">سرمایش و گرمایش</span>
                    </label>
                    <label class="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <input type="radio" name="modalService" value="تعمیرات و بازسازی ساختمان" class="w-5 h-5 text-[#8B1C31] focus:ring-[#8B1C31]">
                        <span class="mr-3 font-bold text-slate-700">تعمیرات و بازسازی ساختمان</span>
                    </label>
                    <label class="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                        <input type="radio" name="modalService" value="لوله کشی" class="w-5 h-5 text-[#8B1C31] focus:ring-[#8B1C31]">
                        <span class="mr-3 font-bold text-slate-700">لوله کشی</span>
                    </label>
                </div>`;

frontendCode = frontendCode.replace(oldBlock, newServiceOptions);

const toggleFunc = `
    function toggleAccordion(catId) {
        document.querySelectorAll('[id^="content-cat-"]').forEach(el => {
            if(el.id !== 'content-' + catId) {
                el.classList.add('hidden');
                document.getElementById('icon-' + el.id.replace('content-', '')).classList.remove('rotate-180');
            }
        });
        const content = document.getElementById('content-' + catId);
        const icon = document.getElementById('icon-' + catId);
        if(content.classList.contains('hidden')) {
            content.classList.remove('hidden');
            icon.classList.add('rotate-180');
        } else {
            content.classList.add('hidden');
            icon.classList.remove('rotate-180');
        }
    }
`;

frontendCode = frontendCode.replace('let currentStep = 1;', toggleFunc + '\n    let currentStep = 1;');

fs.writeFileSync('src/frontend.js', frontendCode);
