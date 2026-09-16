const fs = require('fs');
let frontend = fs.readFileSync('src/frontend.js', 'utf8');

// The modal HTML
const modalHTML = `
<!-- Request Modal (Multi-step) -->
<div id="requestModal" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] hidden flex items-center justify-center p-4 opacity-0 transition-opacity duration-300">
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden transform scale-95 transition-transform duration-300 flex flex-col max-h-[90vh]" id="requestModalContent">
        
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 sticky top-0 z-10">
            <h3 class="font-bold text-slate-800 text-lg" id="modalTitle">ثبت درخواست جدید</h3>
            <button type="button" onclick="closeRequestModal()" class="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 hover:text-slate-700 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
        
        <!-- Progress Steps -->
        <div class="px-6 py-3 border-b border-slate-100 bg-white sticky top-[65px] z-10">
            <div class="flex items-center justify-between relative">
                <div class="absolute left-0 top-1/2 w-full h-1 bg-slate-100 -z-10 rounded-full translate-y-[-50%]"></div>
                <div class="absolute left-0 top-1/2 h-1 bg-[#8B1C31] -z-10 rounded-full translate-y-[-50%] transition-all duration-300" id="modalProgress" style="width: 0%"></div>
                
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold step-indicator active bg-[#8B1C31] text-white border-2 border-white ring-2 ring-[#8B1C31]/20">۱</div>
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold step-indicator bg-white text-slate-400 border-2 border-slate-200">۲</div>
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold step-indicator bg-white text-slate-400 border-2 border-slate-200">۳</div>
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold step-indicator bg-white text-slate-400 border-2 border-slate-200">۴</div>
            </div>
        </div>

        <!-- Scrollable Content Area -->
        <div class="p-6 overflow-y-auto flex-1 hide-scrollbar relative">
            
            <!-- Step 1: Category -->
            <div id="step1" class="modal-step block">
                <h4 class="font-bold text-slate-700 mb-4">چه خدمتی نیاز دارید؟</h4>
                <div class="grid grid-cols-1 gap-3" id="serviceOptions">
                    <!-- Loaded dynamically or statically -->
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
                </div>
                <p id="step1Error" class="text-red-500 text-sm mt-3 hidden">لطفاً یک خدمت را انتخاب کنید.</p>
            </div>

            <!-- Step 2: Location (Map) -->
            <div id="step2" class="modal-step hidden">
                <h4 class="font-bold text-slate-700 mb-2">موقعیت دقیق خود را روی نقشه مشخص کنید</h4>
                <p class="text-slate-500 text-sm mb-4">درحال حاضر خدمات بهدون فقط در محدوده تهران ارائه می‌شود.</p>
                <div class="relative w-full h-[300px] rounded-xl overflow-hidden border border-slate-200 shadow-inner z-0">
                    <div id="requestMap" class="w-full h-full"></div>
                </div>
                <input type="hidden" id="modalLat" value="">
                <input type="hidden" id="modalLng" value="">
                <p id="step2Error" class="text-red-500 text-sm mt-3 hidden">لطفاً موقعیت خود را انتخاب کنید.</p>
            </div>

            <!-- Step 3: Description -->
            <div id="step3" class="modal-step hidden">
                <h4 class="font-bold text-slate-700 mb-4">توضیحات خرابی یا درخواست خود را بنویسید</h4>
                <textarea id="modalDesc" rows="5" class="w-full p-4 border border-slate-200 rounded-xl focus:border-[#8B1C31] outline-none text-slate-700 resize-none" placeholder="مثال: لوله سینک ظرفشویی نشتی دارد..."></textarea>
            </div>

            <!-- Step 4: Phone & Register -->
            <div id="step4" class="modal-step hidden text-center">
                <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                </div>
                <h4 class="font-bold text-slate-800 text-lg mb-2">مرحله نهایی</h4>
                <p class="text-slate-500 text-sm mb-6">برای ثبت نهایی، شماره موبایل خود را وارد کنید.</p>
                <input type="tel" id="modalPhone" dir="ltr" placeholder="09123456789" class="w-full text-center px-4 py-3 border border-slate-200 rounded-xl focus:border-[#8B1C31] outline-none text-lg font-bold tracking-widest text-slate-700">
                <p id="step4Error" class="text-red-500 text-sm mt-3 hidden">شماره موبایل نامعتبر است.</p>
            </div>
            
            <!-- Success Message -->
            <div id="stepSuccess" class="modal-step hidden text-center py-6">
                <div class="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h4 class="font-black text-slate-800 text-2xl mb-2">درخواست ثبت شد!</h4>
                <p class="text-slate-500 mb-6">همکاران ما به زودی با شما تماس می‌گیرند.</p>
                
                <div class="bg-slate-50 border border-slate-200 rounded-2xl p-6 inline-block mx-auto">
                    <p class="text-xs text-slate-400 mb-1 font-bold">کد رهگیری شما</p>
                    <p class="text-3xl font-black text-[#8B1C31] tracking-widest" id="successTrackingCode">BEH-0000</p>
                </div>
                <p class="text-xs text-slate-400 mt-6">از طریق صفحه "پیگیری" می‌توانید وضعیت این درخواست را دنبال کنید.</p>
            </div>

        </div>

        <!-- Footer / Buttons -->
        <div class="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex gap-3 sticky bottom-0 z-10" id="modalFooter">
            <button type="button" id="modalPrevBtn" onclick="prevStep()" class="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-100 transition-colors hidden">
                مرحله قبل
            </button>
            <button type="button" id="modalNextBtn" onclick="nextStep()" class="flex-[2] py-3 px-4 rounded-xl bg-[#8B1C31] text-white font-bold hover:bg-[#701627] transition-colors shadow-md">
                مرحله بعد
            </button>
        </div>
    </div>
</div>

<script>
    let currentStep = 1;
    let requestMap = null;
    let requestMarker = null;
    
    function openRequestModal(serviceName = '') {
        const modal = document.getElementById('requestModal');
        const content = document.getElementById('requestModalContent');
        
        modal.classList.remove('hidden');
        // trigger reflow
        void modal.offsetWidth;
        modal.classList.remove('opacity-0');
        content.classList.remove('scale-95');
        
        // Reset state
        currentStep = 1;
        document.getElementById('modalPhone').value = '';
        document.getElementById('modalDesc').value = '';
        document.getElementById('modalLat').value = '';
        document.getElementById('modalLng').value = '';
        document.getElementById('stepSuccess').classList.add('hidden');
        document.getElementById('modalFooter').classList.remove('hidden');
        
        // Auto select service if provided
        if(serviceName) {
            const radios = document.getElementsByName('modalService');
            for(let r of radios) {
                if(r.value === serviceName) r.checked = true;
            }
        }
        
        updateStepsUI();
    }
    
    function closeRequestModal() {
        const modal = document.getElementById('requestModal');
        const content = document.getElementById('requestModalContent');
        modal.classList.add('opacity-0');
        content.classList.add('scale-95');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    }
    
    function updateStepsUI() {
        // Hide all steps
        document.querySelectorAll('.modal-step').forEach(el => el.classList.add('hidden'));
        
        // Show current
        document.getElementById('step' + currentStep).classList.remove('hidden');
        
        // Update progress bar
        const progress = ((currentStep - 1) / 3) * 100;
        document.getElementById('modalProgress').style.width = progress + '%';
        
        // Update indicators
        const indicators = document.querySelectorAll('.step-indicator');
        indicators.forEach((el, idx) => {
            if(idx + 1 < currentStep) {
                el.className = 'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold step-indicator bg-emerald-500 text-white border-2 border-emerald-500';
                el.innerHTML = '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>';
            } else if(idx + 1 === currentStep) {
                el.className = 'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold step-indicator bg-[#8B1C31] text-white border-2 border-white ring-2 ring-[#8B1C31]/20';
                el.innerHTML = (idx + 1).toString();
            } else {
                el.className = 'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold step-indicator bg-white text-slate-400 border-2 border-slate-200';
                el.innerHTML = (idx + 1).toString();
            }
        });
        
        // Update buttons
        const prevBtn = document.getElementById('modalPrevBtn');
        const nextBtn = document.getElementById('modalNextBtn');
        
        if(currentStep === 1) prevBtn.classList.add('hidden');
        else prevBtn.classList.remove('hidden');
        
        if(currentStep === 4) {
            nextBtn.innerText = 'ثبت نهایی';
            nextBtn.className = 'flex-[2] py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-md';
        } else {
            nextBtn.innerText = 'مرحله بعد';
            nextBtn.className = 'flex-[2] py-3 px-4 rounded-xl bg-[#8B1C31] text-white font-bold hover:bg-[#701627] transition-colors shadow-md';
        }
        
        // Initialize map on step 2
        if(currentStep === 2 && !requestMap) {
            setTimeout(() => {
                const tehranBounds = [
                    [35.5, 51.1], // SouthWest
                    [35.9, 51.6]  // NorthEast
                ];
                requestMap = L.map('requestMap', {
                    maxBounds: tehranBounds,
                    maxBoundsViscosity: 1.0,
                    minZoom: 11
                }).setView([35.6997, 51.3380], 12);
                
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OS'
                }).addTo(requestMap);
                
                requestMarker = L.marker([35.6997, 51.3380], {draggable: true}).addTo(requestMap);
                
                // Save default
                document.getElementById('modalLat').value = 35.6997;
                document.getElementById('modalLng').value = 51.3380;
                
                requestMarker.on('dragend', function(e) {
                    const pos = requestMarker.getLatLng();
                    document.getElementById('modalLat').value = pos.lat;
                    document.getElementById('modalLng').value = pos.lng;
                });
                
                // Allow clicking on map to move marker
                requestMap.on('click', function(e) {
                    requestMarker.setLatLng(e.latlng);
                    document.getElementById('modalLat').value = e.latlng.lat;
                    document.getElementById('modalLng').value = e.latlng.lng;
                });
                
            }, 200);
        } else if (currentStep === 2 && requestMap) {
            setTimeout(() => requestMap.invalidateSize(), 200);
        }
    }
    
    async function nextStep() {
        // Validate current step
        if(currentStep === 1) {
            const selected = document.querySelector('input[name="modalService"]:checked');
            if(!selected) {
                document.getElementById('step1Error').classList.remove('hidden');
                return;
            }
            document.getElementById('step1Error').classList.add('hidden');
        }
        else if(currentStep === 4) {
            const phone = document.getElementById('modalPhone').value;
            if(!/^09\\d{9}$/.test(phone)) {
                document.getElementById('step4Error').classList.remove('hidden');
                return;
            }
            document.getElementById('step4Error').classList.add('hidden');
            
            // Submit!
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
        nextBtn.innerText = 'در حال ثبت...';
        nextBtn.disabled = true;
        
        const payload = {
            service_id: document.querySelector('input[name="modalService"]:checked').value,
            phone: document.getElementById('modalPhone').value,
            desc: document.getElementById('modalDesc').value,
            lat: document.getElementById('modalLat').value,
            lng: document.getElementById('modalLng').value,
            name: 'کاربر سایت'
        };
        
        try {
            const res = await fetch('/api/requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            
            if(data.success) {
                // Show success screen
                document.querySelectorAll('.modal-step').forEach(el => el.classList.add('hidden'));
                document.getElementById('stepSuccess').classList.remove('hidden');
                document.getElementById('modalFooter').classList.add('hidden');
                document.getElementById('successTrackingCode').innerText = data.tracking_code;
                
                // Hide steps header
                document.querySelector('.sticky.top-\\[65px\\]').classList.add('hidden');
            } else {
                alert('خطا در ثبت درخواست');
            }
        } catch(e) {
            alert('خطای ارتباط با سرور');
        }
        
        nextBtn.disabled = false;
    }
</script>
`;

// Insert modalHTML into footerHTML before </footer>
frontend = frontend.replace('</footer>', modalHTML + '</footer>');

// Now let's change all "ثبت درخواست" buttons to open the modal instead of scrolling or navigating.
// They currently probably look like `href="#requestForm"` or similar, or we can just replace the HTML globally.
frontend = frontend.replace(/href="#requestForm"/g, 'href="javascript:void(0);" onclick="openRequestModal()"');

fs.writeFileSync('src/frontend.js', frontend);
