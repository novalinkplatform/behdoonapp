const fs = require('fs');

const modalHTML = `
<!-- Submit Request Modal -->
<div id="requestModal" class="fixed inset-0 z-[100] hidden flex items-center justify-center p-4">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm modal-backdrop transition-opacity opacity-0" onclick="closeModal()"></div>
    
    <!-- Modal Content -->
    <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 modal-content transform scale-95 opacity-0 transition-all duration-300">
        <button onclick="closeModal()" class="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <div class="p-6 md:p-8">
            <div class="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-[#8B1C31] mb-6">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            </div>
            <h3 class="text-xl font-black text-slate-800 mb-2">ثبت درخواست خدمات</h3>
            <p class="text-sm text-slate-500 mb-8">لطفاً مشخصات خود را وارد کنید تا کارشناسان ما در کمترین زمان با شما تماس بگیرند.</p>
            
            <form id="requestForm" onsubmit="submitRequest(event)">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1.5">نام و نام خانوادگی</label>
                        <input type="text" id="reqName" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8B1C31] focus:ring-2 focus:ring-rose-100 outline-none transition-all text-slate-700 placeholder-slate-400" placeholder="مثال: علی رضایی">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1.5">شماره موبایل</label>
                        <input type="tel" id="reqPhone" required pattern="^09[0-9]{9}$" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8B1C31] focus:ring-2 focus:ring-rose-100 outline-none transition-all text-slate-700 placeholder-slate-400 text-left dir-ltr" placeholder="0912 345 6789">
                    </div>
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-1.5">نوع خدمت</label>
                        <select id="reqService" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8B1C31] focus:ring-2 focus:ring-rose-100 outline-none transition-all text-slate-700 bg-white">
                            <option value="سرمایش و گرمایش">سرمایش و گرمایش</option>
                            <option value="لوله کشی">لوله کشی</option>
                            <option value="برقکاری">برقکاری</option>
                            <option value="تعمیرات و بازسازی">تعمیرات و بازسازی ساختمان</option>
                            <option value="سایر">سایر موارد</option>
                        </select>
                    </div>
                </div>
                
                <button type="submit" id="reqSubmitBtn" class="w-full mt-8 bg-[#8B1C31] hover:bg-[#701627] text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-md shadow-rose-900/20 flex justify-center items-center gap-2">
                    <span>ثبت نهایی درخواست</span>
                    <svg class="w-5 h-5 hidden spinner" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                </button>
            </form>

            <div id="reqSuccessMsg" class="hidden flex-col items-center justify-center text-center py-6">
                <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h4 class="text-xl font-bold text-slate-800 mb-2">درخواست ثبت شد!</h4>
                <p class="text-sm text-slate-500">کارشناسان بهدون به زودی با شما تماس خواهند گرفت.</p>
                <button onclick="closeModal()" class="mt-6 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors">بستن پنجره</button>
            </div>
        </div>
    </div>
</div>

<style>
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.spinner { animation: spin 1s linear infinite; }
</style>

<script>
function openModal(serviceName = null) {
    const modal = document.getElementById('requestModal');
    const backdrop = modal.querySelector('.modal-backdrop');
    const content = modal.querySelector('.modal-content');
    
    // Reset form state
    document.getElementById('requestForm').style.display = 'block';
    document.getElementById('reqSuccessMsg').classList.add('hidden');
    document.getElementById('reqSuccessMsg').classList.remove('flex');
    document.getElementById('requestForm').reset();
    
    if(serviceName) {
        const select = document.getElementById('reqService');
        for(let i=0; i<select.options.length; i++){
            if(select.options[i].value === serviceName) {
                select.selectedIndex = i;
                break;
            }
        }
    }
    
    modal.classList.remove('hidden');
    setTimeout(() => {
        backdrop.classList.remove('opacity-0');
        content.classList.remove('opacity-0', 'scale-95');
    }, 10);
}

function closeModal() {
    const modal = document.getElementById('requestModal');
    const backdrop = modal.querySelector('.modal-backdrop');
    const content = modal.querySelector('.modal-content');
    
    backdrop.classList.add('opacity-0');
    content.classList.add('opacity-0', 'scale-95');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

async function submitRequest(e) {
    e.preventDefault();
    const btn = document.getElementById('reqSubmitBtn');
    const spinner = btn.querySelector('.spinner');
    const span = btn.querySelector('span');
    
    const name = document.getElementById('reqName').value;
    const phone = document.getElementById('reqPhone').value;
    const service = document.getElementById('reqService').value;
    
    span.textContent = 'در حال ثبت...';
    spinner.classList.remove('hidden');
    btn.disabled = true;
    btn.classList.add('opacity-70');
    
    try {
        const res = await fetch('/api/requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, phone, service_id: service })
        });
        
        if (res.ok) {
            document.getElementById('requestForm').style.display = 'none';
            const successMsg = document.getElementById('reqSuccessMsg');
            successMsg.classList.remove('hidden');
            successMsg.classList.add('flex');
        } else {
            alert('خطا در ثبت درخواست. لطفاً مجدداً تلاش کنید.');
        }
    } catch (err) {
        alert('خطای اتصال. لطفاً اینترنت خود را بررسی کنید.');
    } finally {
        span.textContent = 'ثبت نهایی درخواست';
        spinner.classList.add('hidden');
        btn.disabled = false;
        btn.classList.remove('opacity-70');
    }
}

// Intercept all links that contain "ثبت درخواست" or point to /#services to open the modal instead
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        if(link.textContent.includes('ثبت درخواست') || link.getAttribute('href') === '/#services') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                // Find nearest service name if possible (from card title)
                let serviceName = null;
                const card = link.closest('.group');
                if (card) {
                    const title = card.querySelector('h3');
                    if (title) serviceName = title.textContent.trim();
                }
                openModal(serviceName);
            });
        }
    });
});
</script>
`;

let currentWorker = fs.readFileSync('worker.js', 'utf8');

// Insert modalHTML right before </body> in html string
const bodyEndIdx = currentWorker.indexOf('</body>');
if(bodyEndIdx !== -1) {
    // Wait, the HTML string might have </body> multiple times (e.g. adminHTML).
    // Let's find the FIRST </body> which belongs to `const html = `...``
    const firstBodyEnd = currentWorker.indexOf('</body>');
    currentWorker = currentWorker.substring(0, firstBodyEnd) + modalHTML + '\n' + currentWorker.substring(firstBodyEnd);
    fs.writeFileSync('worker.js', currentWorker);
    console.log('Modal injected.');
} else {
    console.log('</body> not found.');
}
