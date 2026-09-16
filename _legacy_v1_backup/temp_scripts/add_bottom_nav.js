const fs = require('fs');
let code = fs.readFileSync('worker.js', 'utf8');

const bottomNav = `
    <!-- Mobile Bottom Navigation (Visible only on md and smaller) -->
    <nav class="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-xl border-t border-slate-200 shadow-[0_-10px_30px_rgba(23,22,20,0.05)] z-50 flex justify-between px-6 py-3 pb-[env(safe-area-inset-bottom,12px)]">
        <a href="/" id="bn-home" class="flex flex-col items-center gap-1 text-slate-500 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span class="text-[10px] font-bold">خانه</span>
        </a>
        <a href="/track" id="bn-track" class="flex flex-col items-center gap-1 text-slate-500 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            <span class="text-[10px] font-bold">پیگیری</span>
        </a>
        <a href="/magazine" id="bn-mag" class="flex flex-col items-center gap-1 text-slate-500 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
            <span class="text-[10px] font-bold">مجله</span>
        </a>
        <a href="/#about-us" id="bn-about" class="flex flex-col items-center gap-1 text-slate-500 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span class="text-[10px] font-bold">درباره ما</span>
        </a>
    </nav>
    
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const path = window.location.pathname;
            const setBtn = (id) => {
                const el = document.getElementById(id);
                if(el) {
                    el.classList.remove('text-slate-500');
                    el.classList.add('text-[#8B1C31]');
                }
            };
            if(path === '/') setBtn('bn-home');
            else if(path.startsWith('/track')) setBtn('bn-track');
            else if(path.startsWith('/magazine')) setBtn('bn-mag');
        });
    </script>
`;

code = code.replace('</footer>', '</footer>\n' + bottomNav);
fs.writeFileSync('worker.js', code);
console.log('Bottom Nav added');
