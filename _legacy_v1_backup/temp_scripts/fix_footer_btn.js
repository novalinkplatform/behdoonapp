const fs = require('fs');
let content = fs.readFileSync('worker.js', 'utf8');

const submitRequestBox = `
                    <!-- Submit Request -->
                    <a href="/#services" class="bg-rose-50 border border-rose-100 rounded-2xl p-5 flex items-center gap-4 hover:border-rose-300 hover:shadow-md transition-all group">
                        <div class="w-14 h-14 shrink-0 rounded-xl bg-white border border-rose-100 flex items-center justify-center text-[#8B1C31] group-hover:scale-110 group-hover:bg-[#8B1C31] group-hover:text-white transition-all">
                            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs text-rose-600/70 mb-0.5">سریع و آسان</span>
                            <span class="font-bold text-base text-[#8B1C31] transition-colors">ثبت درخواست</span>
                        </div>
                    </a>
`;

// Insert after Instagram
const instaStart = content.indexOf('<!-- Instagram -->');
if (instaStart !== -1) {
    const instaEnd = content.indexOf('</a>', instaStart) + 4;
    content = content.substring(0, instaEnd) + submitRequestBox + content.substring(instaEnd);
    fs.writeFileSync('worker.js', content);
    console.log("Footer button injected.");
} else {
    console.log("Instagram not found.");
}
