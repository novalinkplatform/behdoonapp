const fs = require('fs');

// --- 1. PREPARE THE UNIFIED MULTI-STEP MODAL HTML & JS ---
const requestModalHTML = `
<!-- ================= REQUEST MODAL (MULTI-STEP WIZARD) ================= -->
<div id="requestModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] hidden flex items-center justify-center p-3 sm:p-4 opacity-0 transition-opacity duration-300">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform scale-95 transition-transform duration-300 flex flex-col max-h-[92vh]" id="requestModalContent">
        
        <!-- Modal Header -->
        <div class="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/90 sticky top-0 z-20">
            <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-2xl bg-[#8B1C31]/10 text-[#8B1C31] flex items-center justify-center font-black text-base shadow-sm">
                    ب
                </div>
                <div>
                    <h3 class="font-black text-slate-800 text-sm md:text-base" id="modalTitle">ثبت آنلاین درخواست خدمات</h3>
                    <p class="text-[11px] text-slate-400 font-medium">پوشش تمامی محله‌ها و مناطق تهران</p>
                </div>
            </div>
            <button type="button" onclick="closeRequestModal()" class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200/70 text-slate-500 hover:bg-slate-300 hover:text-slate-800 transition-colors" aria-label="بستن پنجره">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
        
        <!-- Stepper Indicator -->
        <div class="px-5 py-3 border-b border-slate-100 bg-white sticky top-[65px] z-10" id="modalStepperContainer">
            <div class="flex items-center justify-between relative max-w-xs mx-auto">
                <div class="absolute left-0 top-1/2 w-full h-1 bg-slate-100 -z-10 rounded-full -translate-y-1/2"></div>
                <div class="absolute left-0 top-1/2 h-1 bg-[#8B1C31] -z-10 rounded-full -translate-y-1/2 transition-all duration-300" id="modalProgress" style="width: 0%"></div>
                
                <div class="flex flex-col items-center gap-1">
                    <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold step-indicator active bg-[#8B1C31] text-white border-2 border-white ring-2 ring-[#8B1C31]/20" id="step-ind-1">۱</div>
                    <span class="text-[10px] font-bold text-slate-600">خدمت</span>
                </div>
                <div class="flex flex-col items-center gap-1">
                    <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold step-indicator bg-white text-slate-400 border-2 border-slate-200" id="step-ind-2">۲</div>
                    <span class="text-[10px] font-bold text-slate-400">موقعیت</span>
                </div>
                <div class="flex flex-col items-center gap-1">
                    <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold step-indicator bg-white text-slate-400 border-2 border-slate-200" id="step-ind-3">۳</div>
                    <span class="text-[10px] font-bold text-slate-400">جزئیات</span>
                </div>
                <div class="flex flex-col items-center gap-1">
                    <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold step-indicator bg-white text-slate-400 border-2 border-slate-200" id="step-ind-4">۴</div>
                    <span class="text-[10px] font-bold text-slate-400">تماس</span>
                </div>
            </div>
        </div>

        <!-- Modal Body (Scrollable) -->
        <div class="p-5 overflow-y-auto flex-1 hide-scrollbar relative">
            
            <!-- Step 1: Category & Subservices -->
            <div id="step1" class="modal-step block">
                <div class="mb-3">
                    <h4 class="font-bold text-slate-800 text-sm">چه خدمتی در ساختمان نیاز دارید؟</h4>
                    <p class="text-xs text-slate-500 mt-0.5">روی دسته مورد نظر کلیک کنید تا زیردسته‌ها باز شوند:</p>
                </div>
                <div class="space-y-2.5" id="serviceOptions">
                    <!-- HVAC -->
                    <div class="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all">
                        <button type="button" class="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors text-right" onclick="toggleAccordion('cat-hvac')">
                            <div class="flex items-center gap-2.5">
                                <div class="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v18m-4-14h8m-8 10h8M6 8a6 6 0 1112 0 6 6 0 01-12 0z"></path></svg>
                                </div>
                                <span class="font-bold text-slate-800 text-sm">سرمایش و گرمایش</span>
                            </div>
                            <svg class="w-4 h-4 text-slate-400 transform transition-transform" id="icon-cat-hvac" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <div id="content-cat-hvac" class="hidden border-t border-slate-100 bg-slate-50/50 p-2.5 space-y-1.5">
                            <label class="flex items-center p-2.5 border border-slate-200/80 bg-white rounded-xl cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="نصب و سرویس کولر آبی" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-2.5 text-xs font-semibold text-slate-700">نصب و سرویس کولر آبی</span>
                            </label>
                            <label class="flex items-center p-2.5 border border-slate-200/80 bg-white rounded-xl cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="نصب و سرویس پکیج" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-2.5 text-xs font-semibold text-slate-700">نصب و سرویس پکیج</span>
                            </label>
                            <label class="flex items-center p-2.5 border border-slate-200/80 bg-white rounded-xl cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="نصب و سرویس رادیاتور شوفاژ" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-2.5 text-xs font-semibold text-slate-700">نصب و سرویس رادیاتور شوفاژ</span>
                            </label>
                            <label class="flex items-center p-2.5 border border-slate-200/80 bg-white rounded-xl cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="تعمیر و سرویس آبگرمکن" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-2.5 text-xs font-semibold text-slate-700">تعمیر و سرویس آبگرمکن</span>
                            </label>
                        </div>
                    </div>

                    <!-- Plumbing -->
                    <div class="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all">
                        <button type="button" class="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors text-right" onclick="toggleAccordion('cat-plumbing')">
                            <div class="flex items-center gap-2.5">
                                <div class="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                                </div>
                                <span class="font-bold text-slate-800 text-sm">لوله‌کشی و تأسیسات</span>
                            </div>
                            <svg class="w-4 h-4 text-slate-400 transform transition-transform" id="icon-cat-plumbing" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <div id="content-cat-plumbing" class="hidden border-t border-slate-100 bg-slate-50/50 p-2.5 space-y-1.5 max-h-56 overflow-y-auto hide-scrollbar">
                            <label class="flex items-center p-2.5 border border-slate-200/80 bg-white rounded-xl cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="نصب و تعمیر شیرآلات" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-2.5 text-xs font-semibold text-slate-700">نصب و تعمیر شیرآلات</span>
                            </label>
                            <label class="flex items-center p-2.5 border border-slate-200/80 bg-white rounded-xl cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="نصب سینک ظرفشویی" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-2.5 text-xs font-semibold text-slate-700">نصب سینک ظرفشویی</span>
                            </label>
                            <label class="flex items-center p-2.5 border border-slate-200/80 bg-white rounded-xl cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="تشخیص و ترمیم ترکیدگی لوله" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-2.5 text-xs font-semibold text-slate-700">تشخیص و ترمیم ترکیدگی لوله (دستگاه نشت‌یاب)</span>
                            </label>
                            <label class="flex items-center p-2.5 border border-slate-200/80 bg-white rounded-xl cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="رفع نم و نشتی و رطوبت" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-2.5 text-xs font-semibold text-slate-700">رفع نم، بو و رطوبت بدون تخریب</span>
                            </label>
                            <label class="flex items-center p-2.5 border border-slate-200/80 bg-white rounded-xl cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="نصب و سرویس منبع آب" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-2.5 text-xs font-semibold text-slate-700">نصب و سرویس مخزن و پمپ آب</span>
                            </label>
                            <label class="flex items-center p-2.5 border border-slate-200/80 bg-white rounded-xl cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="نصب و تعمیر دستگاه تصفیه آب" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-2.5 text-xs font-semibold text-slate-700">نصب و تعمیر دستگاه تصفیه آب</span>
                            </label>
                            <label class="flex items-center p-2.5 border border-slate-200/80 bg-white rounded-xl cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="نصب و سرویس توالت فرنگی و ایرانی" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-2.5 text-xs font-semibold text-slate-700">نصب و تبدیل توالت فرنگی و ایرانی</span>
                            </label>
                            <label class="flex items-center p-2.5 border border-slate-200/80 bg-white rounded-xl cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="نصب و تعمیر فلاش تانک و سیفون" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-2.5 text-xs font-semibold text-slate-700">نصب و تعمیر فلاش‌تانک و سیفون</span>
                            </label>
                            <label class="flex items-center p-2.5 border border-slate-200/80 bg-white rounded-xl cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="لوله کشی آب و فاضلاب" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-2.5 text-xs font-semibold text-slate-700">لوله‌کشی آب سرد و گرم و فاضلاب</span>
                            </label>
                        </div>
                    </div>

                    <!-- Electrical -->
                    <div class="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all">
                        <button type="button" class="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors text-right" onclick="toggleAccordion('cat-elec')">
                            <div class="flex items-center gap-2.5">
                                <div class="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                </div>
                                <span class="font-bold text-slate-800 text-sm">برقکاری ساختمان</span>
                            </div>
                            <svg class="w-4 h-4 text-slate-400 transform transition-transform" id="icon-cat-elec" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <div id="content-cat-elec" class="hidden border-t border-slate-100 bg-slate-50/50 p-2.5 space-y-1.5 max-h-56 overflow-y-auto hide-scrollbar">
                            <label class="flex items-center p-2.5 border border-slate-200/80 bg-white rounded-xl cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="رفع اتصالی و عیب یابی برق" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-2.5 text-xs font-semibold text-slate-700">رفع اتصالی و عیب‌یابی برق</span>
                            </label>
                            <label class="flex items-center p-2.5 border border-slate-200/80 bg-white rounded-xl cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="سیم کشی و کابل کشی" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-2.5 text-xs font-semibold text-slate-700">سیم‌کشی و کابل‌کشی کلی و جزئی</span>
                            </label>
                            <label class="flex items-center p-2.5 border border-slate-200/80 bg-white rounded-xl cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="نصب لوستر و چراغ" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-2.5 text-xs font-semibold text-slate-700">نصب لوستر، هالوژن، دیوارکوب و نورپردازی</span>
                            </label>
                            <label class="flex items-center p-2.5 border border-slate-200/80 bg-white rounded-xl cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="کلید و پریز و فیوز" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-2.5 text-xs font-semibold text-slate-700">نصب و تعویض کلید، پریز و جعبه فیوز</span>
                            </label>
                            <label class="flex items-center p-2.5 border border-slate-200/80 bg-white rounded-xl cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="نصب و تعمیر آیفون صوتی و تصویری" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-2.5 text-xs font-semibold text-slate-700">تعمیر و سیم‌کشی آیفون صوتی و تصویری</span>
                            </label>
                        </div>
                    </div>

                    <!-- Renovation -->
                    <div class="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-sm transition-all">
                        <button type="button" class="w-full flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors text-right" onclick="toggleAccordion('cat-reno')">
                            <div class="flex items-center gap-2.5">
                                <div class="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                                </div>
                                <span class="font-bold text-slate-800 text-sm">تعمیرات و بازسازی ساختمان</span>
                            </div>
                            <svg class="w-4 h-4 text-slate-400 transform transition-transform" id="icon-cat-reno" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                        </button>
                        <div id="content-cat-reno" class="hidden border-t border-slate-100 bg-slate-50/50 p-2.5 space-y-1.5 max-h-56 overflow-y-auto hide-scrollbar">
                            <label class="flex items-center p-2.5 border border-slate-200/80 bg-white rounded-xl cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="نقاشی و رنگ کاری ساختمان" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-2.5 text-xs font-semibold text-slate-700">نقاشی، رنگ روغن و پلاستیک</span>
                            </label>
                            <label class="flex items-center p-2.5 border border-slate-200/80 bg-white rounded-xl cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="کاشی کاری و سرامیک" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-2.5 text-xs font-semibold text-slate-700">کاشی‌کاری، سرامیک و سنگ</span>
                            </label>
                            <label class="flex items-center p-2.5 border border-slate-200/80 bg-white rounded-xl cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="بنایی و تخریب" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-2.5 text-xs font-semibold text-slate-700">بنایی، دیوارچینی، تخریب و حمل نخاله</span>
                            </label>
                            <label class="flex items-center p-2.5 border border-slate-200/80 bg-white rounded-xl cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="گچ کاری و لکه گیری" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-2.5 text-xs font-semibold text-slate-700">گچ‌کاری، سفیدکاری و لکه‌گیری</span>
                            </label>
                            <label class="flex items-center p-2.5 border border-slate-200/80 bg-white rounded-xl cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="عایق کاری پشت بام (ایزوگام و قیرگونی)" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-2.5 text-xs font-semibold text-slate-700">ایزوگام، قیرگونی و آب‌بندی پشت‌بام</span>
                            </label>
                            <label class="flex items-center p-2.5 border border-slate-200/80 bg-white rounded-xl cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="کنافکاری و سقف کاذب" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-2.5 text-xs font-semibold text-slate-700">کناف‌کاری، سقف کاذب و دورباکس</span>
                            </label>
                            <label class="flex items-center p-2.5 border border-slate-200/80 bg-white rounded-xl cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="نصب کاغذ دیواری" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-2.5 text-xs font-semibold text-slate-700">نصب کاغذ دیواری، پوستر و دیوارپوش</span>
                            </label>
                            <label class="flex items-center p-2.5 border border-slate-200/80 bg-white rounded-xl cursor-pointer hover:border-[#8B1C31] transition-colors">
                                <input type="radio" name="modalService" value="پارکت و لمینت" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                                <span class="mr-2.5 text-xs font-semibold text-slate-700">نصب پارکت، لمینت و قرنیز</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div id="step1Error" class="text-rose-500 text-xs font-bold mt-3 hidden flex items-center gap-1.5">
                    <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
                    <span>لطفاً ابتدا یکی از زیردسته‌های خدمت را انتخاب کنید.</span>
                </div>
            </div>

            <!-- Step 2: Location (Map) -->
            <div id="step2" class="modal-step hidden">
                <div class="mb-3">
                    <h4 class="font-bold text-slate-800 text-sm">موقعیت دقیق در تهران</h4>
                    <p class="text-xs text-slate-500 mt-0.5">محله خود را انتخاب کنید یا مارکر نقشه را جابجا نمایید:</p>
                </div>
                
                <!-- Quick District Chips -->
                <div class="mb-3">
                    <div class="text-[11px] font-bold text-slate-500 mb-1.5">انتخاب سریع محله:</div>
                    <div class="flex flex-wrap gap-1.5" id="districtChips">
                        <button type="button" onclick="setDistrict(35.783, 51.378, 'سعادت‌آباد')" class="district-chip text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-medium transition-all">سعادت‌آباد</button>
                        <button type="button" onclick="setDistrict(35.808, 51.428, 'تجریش و نیاوران')" class="district-chip text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-medium transition-all">تجریش / نیاوران</button>
                        <button type="button" onclick="setDistrict(35.753, 51.365, 'شهرک غرب')" class="district-chip text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-medium transition-all">شهرک غرب</button>
                        <button type="button" onclick="setDistrict(35.757, 51.418, 'ونک و جردن')" class="district-chip text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-medium transition-all">ونک / جردن</button>
                        <button type="button" onclick="setDistrict(35.728, 51.328, 'صادقیه و پونک')" class="district-chip text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-medium transition-all">صادقیه / پونک</button>
                        <button type="button" onclick="setDistrict(35.733, 51.535, 'تهرانپارس')" class="district-chip text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-medium transition-all">تهرانپارس</button>
                        <button type="button" onclick="setDistrict(35.700, 51.488, 'پیروزی و نارمک')" class="district-chip text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-medium transition-all">پیروزی / نارمک</button>
                        <button type="button" onclick="setDistrict(35.701, 51.391, 'مرکز شهر')" class="district-chip text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-medium transition-all">مرکز شهر / انقلاب</button>
                    </div>
                </div>

                <div class="relative w-full h-[220px] rounded-2xl overflow-hidden border border-slate-200 shadow-inner z-0">
                    <div id="requestMap" class="w-full h-full"></div>
                </div>
                <input type="hidden" id="modalLat" value="35.6997">
                <input type="hidden" id="modalLng" value="51.3380">
                <input type="hidden" id="modalDistrict" value="تهران">
                
                <div class="mt-2.5 flex items-center justify-between text-xs text-slate-500">
                    <span id="selectedDistrictBadge" class="font-bold text-[#8B1C31]">موقعیت: تهران</span>
                    <span class="text-[11px] text-slate-400">جابجایی مارکر با لمس یا کشیدن</span>
                </div>
            </div>

            <!-- Step 3: Details & Visit Time -->
            <div id="step3" class="modal-step hidden">
                <div class="mb-3">
                    <h4 class="font-bold text-slate-800 text-sm">زمان پیشنهادی جهت حضور کارشناس</h4>
                    <p class="text-xs text-slate-500 mt-0.5">بازه زمانی مورد نظر خود را مشخص کنید:</p>
                </div>
                <div class="grid grid-cols-2 gap-2 mb-4" id="timeOptions">
                    <label class="flex items-center p-3 border border-slate-200 rounded-xl cursor-pointer hover:border-[#8B1C31] transition-all bg-white">
                        <input type="radio" name="modalVisitTime" value="در اسرع وقت (فوری)" checked class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                        <span class="mr-2 text-xs font-bold text-slate-700">در اسرع وقت (فوری)</span>
                    </label>
                    <label class="flex items-center p-3 border border-slate-200 rounded-xl cursor-pointer hover:border-[#8B1C31] transition-all bg-white">
                        <input type="radio" name="modalVisitTime" value="امروز عصر (۱۶ الی ۲۰)" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                        <span class="mr-2 text-xs font-bold text-slate-700">امروز عصر (۱۶ تا ۲۰)</span>
                    </label>
                    <label class="flex items-center p-3 border border-slate-200 rounded-xl cursor-pointer hover:border-[#8B1C31] transition-all bg-white">
                        <input type="radio" name="modalVisitTime" value="فردا صبح (۹ الی ۱۳)" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                        <span class="mr-2 text-xs font-bold text-slate-700">فردا صبح (۹ تا ۱۳)</span>
                    </label>
                    <label class="flex items-center p-3 border border-slate-200 rounded-xl cursor-pointer hover:border-[#8B1C31] transition-all bg-white">
                        <input type="radio" name="modalVisitTime" value="هماهنگی تلفنی قبل از اعزام" class="w-4 h-4 text-[#8B1C31] focus:ring-[#8B1C31]">
                        <span class="mr-2 text-xs font-bold text-slate-700">هماهنگی تلفنی</span>
                    </label>
                </div>

                <div class="mb-2">
                    <label class="block text-xs font-bold text-slate-700 mb-1.5">شرح درخواست یا جزئیات خرابی (اختیاری):</label>
                    <textarea id="modalDesc" rows="3" class="w-full p-3 text-xs border border-slate-200 rounded-xl focus:border-[#8B1C31] outline-none text-slate-700 resize-none transition-colors" placeholder="مثلاً: نشتی آب از زیر سینک، یا نیاز به سرویس و راه‌اندازی کولر..."></textarea>
                </div>
            </div>

            <!-- Step 4: Phone & Customer Info -->
            <div id="step4" class="modal-step hidden">
                <div class="text-center mb-4">
                    <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-sm">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                    </div>
                    <h4 class="font-bold text-slate-800 text-base">اطلاعات تماس و صدور کد رهگیری</h4>
                    <p class="text-xs text-slate-500 mt-0.5">شماره همراه خود را جهت ثبت و اعزام کارشناس وارد نمایید:</p>
                </div>

                <div class="space-y-3 max-w-sm mx-auto">
                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">شماره همراه <span class="text-rose-500">*</span></label>
                        <input type="tel" id="modalPhone" dir="ltr" placeholder="09123456789" class="w-full text-center px-4 py-3 border border-slate-200 rounded-xl focus:border-[#8B1C31] outline-none text-base font-black tracking-widest text-slate-800 transition-colors">
                        <p id="step4Error" class="text-rose-500 text-xs font-bold mt-1.5 hidden text-center">لطفاً یک شماره موبایل معتبر ۱۱ رقمی (مانند 09121234567) وارد کنید.</p>
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-slate-700 mb-1">نام و نام خانوادگی (اختیاری)</label>
                        <input type="text" id="modalName" placeholder="مثال: علی محمدی" class="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:border-[#8B1C31] outline-none text-xs font-medium text-slate-800 transition-colors">
                    </div>

                    <div class="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-2 text-slate-500 text-[11px]">
                        <svg class="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                        <span>اطلاعات شما کاملاً محرمانه است و هزینه پس از رضایت شما دریافت می‌شود.</span>
                    </div>
                </div>
            </div>
            
            <!-- Step 5: Success Screen with Tracking Code -->
            <div id="stepSuccess" class="modal-step hidden text-center py-5">
                <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h4 class="font-black text-slate-800 text-xl mb-1">درخواست شما با موفقیت ثبت شد!</h4>
                <p class="text-xs text-slate-500 mb-5">تکنسین متخصص بهدون به زودی جهت هماهنگی با شما تماس خواهد گرفت.</p>
                
                <div class="bg-slate-50 border-2 border-dashed border-[#8B1C31]/30 rounded-2xl p-5 inline-block mx-auto max-w-xs w-full shadow-inner mb-5">
                    <p class="text-[11px] text-slate-400 font-bold mb-1">کد پیگیری اختصاصی شما</p>
                    <div class="flex items-center justify-center gap-2">
                        <p class="text-2xl font-black text-[#8B1C31] tracking-widest font-mono" id="successTrackingCode">BEH-0000</p>
                        <button type="button" onclick="copyTrackingCode()" class="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#8B1C31] transition-colors" title="کپی کد">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        </button>
                    </div>
                    <span id="copyNotice" class="text-[10px] text-emerald-600 font-bold hidden block mt-1">کد پیگیری در حافظه کپی شد!</span>
                </div>

                <div class="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-xs mx-auto">
                    <a id="successTrackLink" href="/track" class="w-full py-2.5 px-4 bg-[#8B1C31] hover:bg-[#701627] text-white font-bold text-xs rounded-xl shadow-md transition-colors text-center">
                        پیگیری آنلاین وضعیت درخواست
                    </a>
                    <button type="button" onclick="closeRequestModal()" class="w-full py-2.5 px-4 border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs rounded-xl transition-colors">
                        بازگشت به سایت
                    </button>
                </div>
            </div>

        </div>

        <!-- Modal Footer / Navigation Buttons -->
        <div class="px-5 py-3.5 border-t border-slate-100 bg-slate-50/90 flex gap-2.5 sticky bottom-0 z-20" id="modalFooter">
            <button type="button" id="modalPrevBtn" onclick="prevStep()" class="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors hidden">
                مرحله قبل
            </button>
            <button type="button" id="modalNextBtn" onclick="nextStep()" class="flex-[2] py-2.5 px-4 rounded-xl bg-[#8B1C31] text-white text-xs font-bold hover:bg-[#701627] transition-all shadow-md flex items-center justify-center gap-1.5">
                <span>مرحله بعد</span>
                <svg class="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
        </div>
    </div>
</div>

<script>
    let currentStep = 1;
    let requestMap = null;
    let requestMarker = null;

    function toggleAccordion(catId) {
        document.querySelectorAll('[id^="content-cat-"]').forEach(el => {
            if(el.id !== 'content-' + catId) {
                el.classList.add('hidden');
                const otherIcon = document.getElementById('icon-' + el.id.replace('content-', ''));
                if(otherIcon) otherIcon.classList.remove('rotate-180');
            }
        });
        const content = document.getElementById('content-' + catId);
        const icon = document.getElementById('icon-' + catId);
        if(content) {
            if(content.classList.contains('hidden')) {
                content.classList.remove('hidden');
                if(icon) icon.classList.add('rotate-180');
            } else {
                content.classList.add('hidden');
                if(icon) icon.classList.remove('rotate-180');
            }
        }
    }

    function setDistrict(lat, lng, name) {
        document.getElementById('modalLat').value = lat;
        document.getElementById('modalLng').value = lng;
        document.getElementById('modalDistrict').value = name;
        document.getElementById('selectedDistrictBadge').innerText = 'موقعیت: ' + name;
        
        document.querySelectorAll('.district-chip').forEach(c => {
            if(c.innerText.includes(name.split(' ')[0])) {
                c.className = 'district-chip text-xs bg-[#8B1C31] text-white px-2.5 py-1 rounded-lg font-bold shadow-sm transition-all';
            } else {
                c.className = 'district-chip text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-medium transition-all';
            }
        });

        if(requestMap) {
            requestMap.setView([lat, lng], 14);
            if(requestMarker) requestMarker.setLatLng([lat, lng]);
        }
    }

    function openRequestModal(serviceName = '') {
        const modal = document.getElementById('requestModal');
        const content = document.getElementById('requestModalContent');
        if(!modal) return;
        
        modal.classList.remove('hidden');
        void modal.offsetWidth; // trigger reflow
        modal.classList.remove('opacity-0');
        if(content) content.classList.remove('scale-95');
        
        // Reset state
        currentStep = 1;
        document.getElementById('modalPhone').value = '';
        document.getElementById('modalDesc').value = '';
        document.getElementById('modalName').value = '';
        document.getElementById('stepSuccess').classList.add('hidden');
        document.getElementById('modalFooter').classList.remove('hidden');
        document.getElementById('modalStepperContainer').classList.remove('hidden');
        
        // Auto select service if provided
        if(serviceName) {
            const radios = document.getElementsByName('modalService');
            for(let r of radios) {
                if(r.value === serviceName || r.value.includes(serviceName) || serviceName.includes(r.value)) {
                    r.checked = true;
                    // Open parent accordion
                    const parentCat = r.closest('[id^="content-cat-"]');
                    if(parentCat) {
                        const catId = parentCat.id.replace('content-', '');
                        toggleAccordion(catId);
                    }
                    break;
                }
            }
        }
        
        updateStepsUI();
    }

    function closeRequestModal() {
        const modal = document.getElementById('requestModal');
        const content = document.getElementById('requestModalContent');
        if(!modal) return;
        modal.classList.add('opacity-0');
        if(content) content.classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 280);
    }

    function updateStepsUI() {
        document.querySelectorAll('.modal-step').forEach(el => el.classList.add('hidden'));
        const curStepEl = document.getElementById('step' + currentStep);
        if(curStepEl) curStepEl.classList.remove('hidden');
        
        const progress = ((currentStep - 1) / 3) * 100;
        const progressEl = document.getElementById('modalProgress');
        if(progressEl) progressEl.style.width = progress + '%';
        
        for(let i = 1; i <= 4; i++) {
            const ind = document.getElementById('step-ind-' + i);
            if(!ind) continue;
            if(i < currentStep) {
                ind.className = 'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold step-indicator bg-emerald-500 text-white border-2 border-emerald-500';
                ind.innerHTML = '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>';
            } else if(i === currentStep) {
                ind.className = 'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold step-indicator bg-[#8B1C31] text-white border-2 border-white ring-2 ring-[#8B1C31]/20';
                ind.innerHTML = i.toString();
            } else {
                ind.className = 'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold step-indicator bg-white text-slate-400 border-2 border-slate-200';
                ind.innerHTML = i.toString();
            }
        }
        
        const prevBtn = document.getElementById('modalPrevBtn');
        const nextBtn = document.getElementById('modalNextBtn');
        
        if(currentStep === 1) prevBtn.classList.add('hidden');
        else prevBtn.classList.remove('hidden');
        
        if(currentStep === 4) {
            nextBtn.innerHTML = '<span>ثبت نهایی و صدور کد رهگیری</span>';
            nextBtn.className = 'flex-[2] py-2.5 px-4 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-md flex items-center justify-center gap-1.5';
        } else {
            nextBtn.innerHTML = '<span>مرحله بعد</span><svg class="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>';
            nextBtn.className = 'flex-[2] py-2.5 px-4 rounded-xl bg-[#8B1C31] text-white text-xs font-bold hover:bg-[#701627] transition-all shadow-md flex items-center justify-center gap-1.5';
        }
        
        if(currentStep === 2) {
            setTimeout(() => {
                if(!requestMap) {
                    const tehranBounds = [
                        [35.50, 51.10], // SW
                        [35.90, 51.65]  // NE
                    ];
                    requestMap = L.map('requestMap', {
                        maxBounds: tehranBounds,
                        maxBoundsViscosity: 1.0,
                        minZoom: 11
                    }).setView([35.6997, 51.3380], 12);
                    
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '© OpenStreetMap'
                    }).addTo(requestMap);
                    
                    requestMarker = L.marker([35.6997, 51.3380], {draggable: true}).addTo(requestMap);
                    
                    requestMarker.on('dragend', function(e) {
                        const pos = requestMarker.getLatLng();
                        document.getElementById('modalLat').value = pos.lat.toFixed(4);
                        document.getElementById('modalLng').value = pos.lng.toFixed(4);
                    });
                    
                    requestMap.on('click', function(e) {
                        requestMarker.setLatLng(e.latlng);
                        document.getElementById('modalLat').value = e.latlng.lat.toFixed(4);
                        document.getElementById('modalLng').value = e.latlng.lng.toFixed(4);
                    });
                } else {
                    requestMap.invalidateSize();
                }
            }, 150);
        }
    }

    async function nextStep() {
        if(currentStep === 1) {
            const selected = document.querySelector('input[name="modalService"]:checked');
            if(!selected) {
                document.getElementById('step1Error').classList.remove('hidden');
                return;
            }
            document.getElementById('step1Error').classList.add('hidden');
        }
        else if(currentStep === 4) {
            const phone = document.getElementById('modalPhone').value.trim();
            if(!/^09\\\\d{9}$/.test(phone)) {
                document.getElementById('step4Error').classList.remove('hidden');
                return;
            }
            document.getElementById('step4Error').classList.add('hidden');
            
            await submitModalRequest();
            return;
        }
        
        currentStep++;
        updateStepsUI();
    }

    function prevStep() {
        if(currentStep > 1) {
            currentStep--;
            updateStepsUI();
        }
    }

    async function submitModalRequest() {
        const nextBtn = document.getElementById('modalNextBtn');
        nextBtn.innerHTML = '<span>در حال ثبت...</span>';
        nextBtn.disabled = true;
        
        const visitTime = document.querySelector('input[name="modalVisitTime"]:checked')?.value || 'در اسرع وقت (فوری)';
        const district = document.getElementById('modalDistrict')?.value || 'تهران';
        const userDesc = document.getElementById('modalDesc')?.value || '';
        
        const combinedDesc = [userDesc, 'محله: ' + district, 'زمان مراجعه: ' + visitTime].filter(Boolean).join(' | ');
        
        const payload = {
            service_id: document.querySelector('input[name="modalService"]:checked')?.value || 'خدمات عمومی ساختمان',
            phone: document.getElementById('modalPhone').value.trim(),
            name: document.getElementById('modalName').value.trim() || 'کاربر سایت',
            description: combinedDesc,
            lat: document.getElementById('modalLat').value,
            lng: document.getElementById('modalLng').value
        };
        
        try {
            const res = await fetch('/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            
            if(data.success && data.tracking_code) {
                document.querySelectorAll('.modal-step').forEach(el => el.classList.add('hidden'));
                document.getElementById('stepSuccess').classList.remove('hidden');
                document.getElementById('modalFooter').classList.add('hidden');
                document.getElementById('modalStepperContainer').classList.add('hidden');
                document.getElementById('successTrackingCode').innerText = data.tracking_code;
                document.getElementById('successTrackLink').href = '/track?phone=' + payload.phone;
            } else {
                alert('خطا در ثبت درخواست. لطفاً مجدداً تلاش کنید.');
            }
        } catch(e) {
            alert('خطای اتصال به سرور. اینترنت خود را بررسی کنید.');
        } finally {
            nextBtn.disabled = false;
        }
    }

    function copyTrackingCode() {
        const code = document.getElementById('successTrackingCode').innerText;
        navigator.clipboard.writeText(code).then(() => {
            const notice = document.getElementById('copyNotice');
            notice.classList.remove('hidden');
            setTimeout(() => notice.classList.add('hidden'), 3000);
        });
    }
</script>
`;

// --- 2. LOAD FRONTEND.JS ---
let code = fs.readFileSync('src/frontend.js', 'utf8');

// A. Clean footerHTML:
// In footerHTML, replace everything from '<!-- Request Modal (Multi-step)' up to '</footer>'
const fModalStart = code.indexOf('<!-- Request Modal (Multi-step)');
const fFooterEnd = code.indexOf('</footer>', fModalStart);
if (fModalStart !== -1 && fFooterEnd !== -1) {
    code = code.substring(0, fModalStart) + '</footer>\n' + requestModalHTML + code.substring(fFooterEnd + 9);
    console.log('Cleaned footerHTML modal and injected new unified modal.');
}

// B. Clean html (homepage):
// Find where the old modal was in html:
const hOldModalStart = code.indexOf('<!-- Submit Request Modal -->');
const hBodyEnd = code.indexOf('</body>\n</html>\n    `;', hOldModalStart);
if (hOldModalStart !== -1 && hBodyEnd !== -1) {
    code = code.substring(0, hOldModalStart) + requestModalHTML + '\n</body>\n</html>\n    `;' + code.substring(hBodyEnd + 21);
    console.log('Cleaned html modal and injected new unified modal.');
}

// C. Ensure PWA metadata exists in headerHTML and html <head>
const pwaMeta = `
    <link rel="manifest" href="/manifest.webmanifest">
    <meta name="theme-color" content="#133458">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="بهدون">
`;

if (!code.includes('manifest.webmanifest')) {
    code = code.replace(/<meta name="viewport" content="width=device-width, initial-scale=1.0">/g,
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' + pwaMeta
    );
    console.log('Added PWA meta tags.');
}

fs.writeFileSync('src/frontend.js', code);
console.log('src/frontend.js fully upgraded.');
