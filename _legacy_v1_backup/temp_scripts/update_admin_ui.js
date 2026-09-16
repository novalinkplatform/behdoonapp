const fs = require('fs');

const newAdminHTML = `
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <main class="min-h-screen bg-slate-50 flex" dir="rtl">
        <!-- Sidebar -->
        <aside class="w-64 bg-white border-l border-slate-200 flex flex-col hidden md:flex fixed h-full z-10 shadow-sm">
            <div class="p-6 border-b border-slate-100 flex items-center justify-center">
                <span class="text-2xl font-black text-[#8B1C31] tracking-tight">بهدون <span class="text-sm text-slate-400 font-normal">| مدیر</span></span>
            </div>
            <nav class="flex-1 p-4 space-y-2">
                <button onclick="switchAdminTab('requests')" id="nav-requests" class="w-full flex items-center space-x-3 space-x-reverse px-4 py-3 bg-rose-50 text-[#8B1C31] font-bold rounded-xl transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                    <span>درخواست‌ها</span>
                </button>
                <button onclick="switchAdminTab('settings')" id="nav-settings" class="w-full flex items-center space-x-3 space-x-reverse px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-bold rounded-xl transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    <span>تنظیمات سایت</span>
                </button>
            </nav>
            <div class="p-4 border-t border-slate-100">
                <a href="/" target="_blank" class="flex items-center justify-center space-x-2 space-x-reverse text-sm text-slate-500 hover:text-slate-800">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                    <span>مشاهده سایت</span>
                </a>
            </div>
        </aside>

        <!-- Main Content -->
        <div class="flex-1 md:mr-64 flex flex-col h-screen overflow-hidden">
            <!-- Header -->
            <header class="bg-white border-b border-slate-200 p-4 lg:p-6 flex justify-between items-center z-10 sticky top-0 shadow-sm">
                <h1 id="page-title" class="text-2xl font-black text-slate-800">مدیریت درخواست‌ها</h1>
            </header>

            <!-- Scrollable Body -->
            <div class="flex-1 overflow-auto p-4 lg:p-8 relative">
                
                <!-- TAB 1: Requests -->
                <div id="tab-requests" class="block max-w-6xl mx-auto space-y-6">
                    <!-- Stats -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                            <div>
                                <p class="text-slate-500 text-sm font-bold mb-1">کل درخواست‌ها</p>
                                <div id="totalCount" class="text-3xl font-black text-slate-800">0</div>
                            </div>
                            <div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg></div>
                        </div>
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                            <div>
                                <p class="text-slate-500 text-sm font-bold mb-1">در انتظار بررسی</p>
                                <div id="pendingCount" class="text-3xl font-black text-slate-800">0</div>
                            </div>
                            <div class="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
                        </div>
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                            <div>
                                <p class="text-slate-500 text-sm font-bold mb-1">تکمیل شده</p>
                                <div id="completedCount" class="text-3xl font-black text-slate-800">0</div>
                            </div>
                            <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg></div>
                        </div>
                    </div>
                    
                    <!-- Table -->
                    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div class="overflow-x-auto">
                            <table class="w-full text-right">
                                <thead class="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                                    <tr>
                                        <th class="p-4 font-bold">نام مشتری</th>
                                        <th class="p-4 font-bold">موبایل</th>
                                        <th class="p-4 font-bold">نوع خدمت</th>
                                        <th class="p-4 font-bold">تاریخ ثبت</th>
                                        <th class="p-4 font-bold">وضعیت</th>
                                        <th class="p-4 font-bold">عملیات</th>
                                    </tr>
                                </thead>
                                <tbody class="text-sm" id="requests-tbody">
                                    <tr><td colspan="6" class="p-8 text-center text-slate-500">در حال دریافت اطلاعات...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- TAB 2: Settings -->
                <div id="tab-settings" class="hidden max-w-4xl mx-auto space-y-6 pb-20">
                    <form id="settingsForm" onsubmit="saveSettings(event)" class="space-y-6">
                        
                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                            <h3 class="text-lg font-black text-slate-800 border-b border-slate-100 pb-3">تنظیمات فوتر</h3>
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1.5">متن درباره ما (فوتر)</label>
                                <textarea id="set_footer_about" rows="3" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8B1C31] outline-none transition-all text-slate-700"></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-bold text-slate-700 mb-1.5">آدرس (فوتر)</label>
                                <input type="text" id="set_footer_address" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#8B1C31] outline-none transition-all text-slate-700">
                            </div>
                        </div>

                        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                            <h3 class="text-lg font-black text-slate-800 border-b border-slate-100 pb-3 flex justify-between items-center">
                                <span>تنظیمات نقشه (OpenStreetMap)</span>
                                <span class="text-xs text-slate-400 font-normal">برای تغییر لوکیشن، پین را جابجا کنید</span>
                            </h3>
                            <div class="grid grid-cols-2 gap-4 hidden">
                                <div><input type="text" id="set_map_lat" class="w-full"></div>
                                <div><input type="text" id="set_map_lng" class="w-full"></div>
                            </div>
                            <div id="admin-map" class="w-full h-80 rounded-xl border border-slate-200 z-0 relative"></div>
                        </div>

                        <button type="submit" id="saveSettingsBtn" class="w-full bg-[#8B1C31] hover:bg-[#701627] text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-md">
                            ذخیره تنظیمات
                        </button>
                    </form>
                </div>

            </div>
        </div>
    </main>
    <script>
        let adminMap = null;
        let adminMarker = null;

        function switchAdminTab(tab) {
            document.getElementById('tab-requests').classList.add('hidden');
            document.getElementById('tab-requests').classList.remove('block');
            document.getElementById('tab-settings').classList.add('hidden');
            document.getElementById('tab-settings').classList.remove('block');
            
            document.getElementById('nav-requests').className = 'w-full flex items-center space-x-3 space-x-reverse px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-bold rounded-xl transition-colors';
            document.getElementById('nav-settings').className = 'w-full flex items-center space-x-3 space-x-reverse px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-bold rounded-xl transition-colors';
            
            if(tab === 'requests') {
                document.getElementById('tab-requests').classList.add('block');
                document.getElementById('tab-requests').classList.remove('hidden');
                document.getElementById('nav-requests').classList.add('bg-rose-50', 'text-[#8B1C31]');
                document.getElementById('nav-requests').classList.remove('text-slate-600', 'hover:bg-slate-50');
                document.getElementById('page-title').innerText = 'مدیریت درخواست‌ها';
            } else {
                document.getElementById('tab-settings').classList.add('block');
                document.getElementById('tab-settings').classList.remove('hidden');
                document.getElementById('nav-settings').classList.add('bg-rose-50', 'text-[#8B1C31]');
                document.getElementById('nav-settings').classList.remove('text-slate-600', 'hover:bg-slate-50');
                document.getElementById('page-title').innerText = 'تنظیمات سایت';
                
                // init map if not initialized
                if(!adminMap) {
                    setTimeout(() => {
                        let lat = parseFloat(document.getElementById('set_map_lat').value) || 35.6997;
                        let lng = parseFloat(document.getElementById('set_map_lng').value) || 51.3380;
                        adminMap = L.map('admin-map').setView([lat, lng], 12);
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: '© OpenStreetMap contributors'
                        }).addTo(adminMap);
                        adminMarker = L.marker([lat, lng], {draggable: true}).addTo(adminMap);
                        adminMarker.on('dragend', function(e) {
                            const pos = adminMarker.getLatLng();
                            document.getElementById('set_map_lat').value = pos.lat;
                            document.getElementById('set_map_lng').value = pos.lng;
                        });
                        adminMap.invalidateSize();
                    }, 200);
                }
            }
        }

        async function updateStatus(id, newStatus) {
            try {
                const res = await fetch('/api/requests/update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, status: newStatus })
                });
                if(res.ok) window.location.reload();
                else alert('خطا در بروزرسانی وضعیت');
            } catch(e) { alert('خطای ارتباط با سرور'); }
        }

        async function loadRequests() {
            try {
                const res = await fetch('/api/requests');
                const requests = await res.json();
                const tbody = document.getElementById('requests-tbody');
                tbody.innerHTML = '';
                
                if (!requests || requests.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" class="p-8 text-center text-slate-500">هیچ درخواستی ثبت نشده است.</td></tr>';
                    return;
                }
                
                let pending = 0, completed = 0;
                requests.forEach(req => {
                    if (req.status === 'pending') pending++;
                    if (req.status === 'completed') completed++;
                    
                    const date = new Date(req.created_at).toLocaleString('fa-IR');
                    const tr = document.createElement('tr');
                    tr.className = 'hover:bg-slate-50 border-b border-slate-50 transition-colors';
                    
                    let statusBadge = req.status === 'pending' ? '<span class="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">در انتظار</span>'
                        : req.status === 'in_progress' ? '<span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">در حال انجام</span>'
                        : '<span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">تکمیل شده</span>';
                    
                    tr.innerHTML = \`
                        <td class="p-4 font-bold text-slate-700">\${req.name}</td>
                        <td class="p-4 text-slate-600 dir-ltr text-left">\${req.phone}</td>
                        <td class="p-4 text-slate-600">\${req.service_id}</td>
                        <td class="p-4 text-slate-500 dir-ltr text-right text-xs">\${date}</td>
                        <td class="p-4">\${statusBadge}</td>
                        <td class="p-4">
                            <select onchange="updateStatus(\${req.id}, this.value)" class="text-sm border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-[#8B1C31]">
                                <option value="pending" \${req.status === 'pending' ? 'selected' : ''}>در انتظار</option>
                                <option value="in_progress" \${req.status === 'in_progress' ? 'selected' : ''}>در حال انجام</option>
                                <option value="completed" \${req.status === 'completed' ? 'selected' : ''}>تکمیل شده</option>
                            </select>
                        </td>\`;
                    tbody.appendChild(tr);
                });
                
                document.getElementById('totalCount').innerText = requests.length;
                document.getElementById('pendingCount').innerText = pending;
                document.getElementById('completedCount').innerText = completed;
            } catch (e) { console.error(e); }
        }

        async function loadSettings() {
            try {
                const res = await fetch('/api/settings');
                const s = await res.json();
                document.getElementById('set_footer_about').value = s.footer_about || '';
                document.getElementById('set_footer_address').value = s.footer_address || '';
                document.getElementById('set_map_lat').value = s.map_lat || '35.6997';
                document.getElementById('set_map_lng').value = s.map_lng || '51.3380';
            } catch(e) {}
        }

        async function saveSettings(e) {
            e.preventDefault();
            const btn = document.getElementById('saveSettingsBtn');
            btn.innerText = 'در حال ذخیره...';
            
            const payload = {
                footer_about: document.getElementById('set_footer_about').value,
                footer_address: document.getElementById('set_footer_address').value,
                map_lat: document.getElementById('set_map_lat').value,
                map_lng: document.getElementById('set_map_lng').value
            };
            
            try {
                const res = await fetch('/api/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if(res.ok) {
                    btn.innerText = 'ذخیره شد!';
                    setTimeout(() => btn.innerText = 'ذخیره تنظیمات', 2000);
                } else alert('خطا در ذخیره');
            } catch(err) {
                alert('خطا در ذخیره');
                btn.innerText = 'ذخیره تنظیمات';
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            loadRequests();
            loadSettings();
        });
    </script>
`;

let currentWorker = fs.readFileSync('worker.js', 'utf8');

// Find the start of const adminHTML = `
const sIdx = currentWorker.indexOf("const adminHTML = `");
if(sIdx === -1) {
    console.log('adminHTML not found!');
    process.exit(1);
}

// Find the end of it, which is before `        let htmlResponse = '';`
const eIdx = currentWorker.indexOf("let htmlResponse = '';");

currentWorker = currentWorker.substring(0, sIdx) + 'const adminHTML = `' + newAdminHTML + '`;\n\n        ' + currentWorker.substring(eIdx);

fs.writeFileSync('worker.js', currentWorker);
console.log('Admin UI updated.');
