const fs = require('fs');

let currentWorker = fs.readFileSync('worker.js', 'utf8');

const dynamicAdminScript = `
<script>
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const res = await fetch('/api/requests');
        const requests = await res.json();
        
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = '';
        
        if (!requests || requests.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="p-8 text-center text-slate-500">هیچ درخواستی ثبت نشده است.</td></tr>';
            return;
        }
        
        let pending = 0;
        let completed = 0;
        
        requests.forEach(req => {
            if (req.status === 'pending') pending++;
            if (req.status === 'completed') completed++;
            
            const date = new Date(req.created_at).toLocaleString('fa-IR');
            
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-slate-50 border-b border-slate-50 transition-colors';
            
            let statusBadge = '';
            if (req.status === 'pending') statusBadge = '<span class="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold">در انتظار بررسی</span>';
            else if (req.status === 'in_progress') statusBadge = '<span class="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">در حال انجام</span>';
            else statusBadge = '<span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">تکمیل شده</span>';
            
            tr.innerHTML = \`
                <td class="p-4 font-bold text-slate-700">\${req.name}</td>
                <td class="p-4 text-slate-600 dir-ltr text-left">\${req.phone}</td>
                <td class="p-4 text-slate-600">\${req.service_id}</td>
                <td class="p-4 text-slate-500 dir-ltr text-right text-xs">\${date}</td>
                <td class="p-4">\${statusBadge}</td>
                <td class="p-4"><button class="text-[#8B1C31] font-bold hover:underline">بررسی</button></td>
            \`;
            tbody.appendChild(tr);
        });
        
        document.getElementById('totalCount').innerText = requests.length;
        document.getElementById('pendingCount').innerText = pending;
        document.getElementById('completedCount').innerText = completed;
        
    } catch (e) {
        console.error('Error fetching requests', e);
    }
});
</script>
`;

// I need to replace the hardcoded table body and stats in adminHTML
// First, find the stats in adminHTML and give them IDs
currentWorker = currentWorker.replace('<div class="text-3xl font-black text-slate-800">۱۲۸</div>', '<div id="totalCount" class="text-3xl font-black text-slate-800">0</div>');
currentWorker = currentWorker.replace('<div class="text-3xl font-black text-slate-800">۱۲</div>', '<div id="pendingCount" class="text-3xl font-black text-slate-800">0</div>');
currentWorker = currentWorker.replace('<div class="text-3xl font-black text-slate-800">۴۵</div>', '<div id="completedCount" class="text-3xl font-black text-slate-800">0</div>');

// Replace the table body
const tableTarget = /<tbody class="text-sm">[\s\S]*?<\/tbody>/;
currentWorker = currentWorker.replace(tableTarget, '<tbody class="text-sm"><tr><td colspan="6" class="p-8 text-center text-slate-500">در حال دریافت اطلاعات...</td></tr></tbody>');

// Append the script just before the closing tag of adminHTML string
const mainEnd = '</main>';
currentWorker = currentWorker.replace(mainEnd, mainEnd + '\\n' + dynamicAdminScript.replace(/\`/g, '\\`'));

fs.writeFileSync('worker.js', currentWorker);
console.log('Admin JS injected.');
