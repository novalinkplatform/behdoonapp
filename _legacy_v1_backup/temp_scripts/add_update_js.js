const fs = require('fs');
let currentWorker = fs.readFileSync('worker.js', 'utf8');

const targetScript = `<td class="p-4"><button class="text-[#8B1C31] font-bold hover:underline">بررسی</button></td>`;
const newScript = `<td class="p-4">
                    <select onchange="updateStatus(\${req.id}, this.value)" class="text-sm border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-[#8B1C31]">
                        <option value="pending" \${req.status === 'pending' ? 'selected' : ''}>در انتظار</option>
                        <option value="in_progress" \${req.status === 'in_progress' ? 'selected' : ''}>در حال انجام</option>
                        <option value="completed" \${req.status === 'completed' ? 'selected' : ''}>تکمیل شده</option>
                    </select>
                </td>`;

currentWorker = currentWorker.replace(targetScript, newScript);

const updateFunc = `
async function updateStatus(id, newStatus) {
    try {
        const res = await fetch('/api/requests/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status: newStatus })
        });
        if(res.ok) {
            window.location.reload();
        } else {
            alert('خطا در بروزرسانی وضعیت');
        }
    } catch(e) {
        alert('خطای ارتباط با سرور');
    }
}
</script>
`;
currentWorker = currentWorker.replace('</script>', updateFunc);

fs.writeFileSync('worker.js', currentWorker);
console.log('Update script added.');
