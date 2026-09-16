const fs = require('fs');
let code = fs.readFileSync('worker.js', 'utf8');

const trackHTML = `
const trackHTML = \`
    <main class="min-h-screen bg-slate-50 pt-10 pb-32" dir="rtl">
        <div class="container mx-auto px-4 max-w-2xl">
            <div class="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                    </div>
                    <h1 class="text-2xl font-black text-slate-800">پیگیری درخواست</h1>
                    <p class="text-slate-500 mt-2 text-sm leading-relaxed">برای مشاهده وضعیت درخواست‌های خود، شماره موبایلی که با آن ثبت سفارش کرده‌اید را وارد کنید.</p>
                </div>
                
                <form id="trackForm" onsubmit="trackOrder(event)" class="flex flex-col gap-4">
                    <div>
                        <label class="block text-sm font-bold text-slate-700 mb-2">شماره موبایل</label>
                        <input type="tel" id="trackPhone" dir="ltr" placeholder="09123456789" required pattern="^09\\d{9}$" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8B1C31] outline-none transition-all text-center tracking-widest text-lg font-bold text-slate-700">
                    </div>
                    <button type="submit" id="trackBtn" class="w-full bg-[#8B1C31] hover:bg-[#701627] text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-md">
                        بررسی وضعیت
                    </button>
                </form>
                
                <div id="trackResults" class="mt-8 space-y-4 hidden">
                    <h3 class="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">لیست درخواست‌های شما</h3>
                    <div id="resultsList" class="space-y-4"></div>
                </div>
            </div>
        </div>
    </main>
    <script>
        async function trackOrder(e) {
            e.preventDefault();
            const phone = document.getElementById('trackPhone').value;
            const btn = document.getElementById('trackBtn');
            const resultsDiv = document.getElementById('trackResults');
            const list = document.getElementById('resultsList');
            
            btn.innerText = 'در حال جستجو...';
            
            try {
                const res = await fetch('/api/requests/track?phone=' + phone);
                const data = await res.json();
                
                list.innerHTML = '';
                resultsDiv.classList.remove('hidden');
                
                if(!data || data.length === 0) {
                    list.innerHTML = '<div class="p-6 bg-slate-50 rounded-2xl text-center text-slate-500 text-sm">هیچ درخواستی با این شماره یافت نشد.</div>';
                } else {
                    data.forEach(req => {
                        let statusColor, statusText;
                        if(req.status === 'pending') { statusColor = 'bg-amber-100 text-amber-700 border-amber-200'; statusText = 'در انتظار بررسی'; }
                        else if(req.status === 'in_progress') { statusColor = 'bg-blue-100 text-blue-700 border-blue-200'; statusText = 'در حال انجام'; }
                        else { statusColor = 'bg-emerald-100 text-emerald-700 border-emerald-200'; statusText = 'تکمیل شده'; }
                        
                        const date = new Date(req.created_at).toLocaleDateString('fa-IR');
                        list.innerHTML += \`
                            <div class="p-4 border border-slate-100 rounded-2xl shadow-sm bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h4 class="font-bold text-slate-800">\${req.service_id}</h4>
                                    <div class="text-xs text-slate-400 mt-1">ثبت شده در: \${date}</div>
                                </div>
                                <div class="px-4 py-1.5 rounded-full text-xs font-bold border \${statusColor} whitespace-nowrap text-center">
                                    \${statusText}
                                </div>
                            </div>
                        \`;
                    });
                }
            } catch(err) {
                alert('خطا در ارتباط با سرور');
            }
            
            btn.innerText = 'بررسی وضعیت';
        }
    </script>
\`;
`;

// Insert the `trackHTML` definition after `magazineHTML`
const insertPos1 = code.indexOf('const adminHTML = `');
if(insertPos1 !== -1) {
    code = code.substring(0, insertPos1) + trackHTML + '\n' + code.substring(insertPos1);
} else {
    console.error('Could not find adminHTML');
}

// Insert the routing logic
const routingStr = "if (path === '/admin' || path === '/admin/') {";
const insertPos2 = code.indexOf(routingStr);
if (insertPos2 !== -1) {
    const routeLogic = `if (path === '/track' || path === '/track/') {
        htmlResponse = headerHTML + trackHTML + footerHTML;
    } else `;
    code = code.substring(0, insertPos2) + routeLogic + code.substring(insertPos2);
} else {
    console.error('Could not find routing string');
}

fs.writeFileSync('worker.js', code);
console.log('Track page added');
