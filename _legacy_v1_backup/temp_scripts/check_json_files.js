const fs = require('fs');

const files = ['hvac_data.json', 'plumbing_data.json', 'electrical_data.json', 'renovation_data.json'];
for (const f of files) {
    if (fs.existsSync(f)) {
        try {
            const data = JSON.parse(fs.readFileSync(f, 'utf8'));
            console.log(f, 'is valid JSON:', {
                id: data.id,
                title: data.title ? data.title.substring(0, 30) + '...' : null,
                subServicesCount: (data.subServices || []).length,
                subServiceNames: (data.subServices || []).map(s => s.name),
                contentLength: (data.content || '').length
            });
        } catch (e) {
            console.error(f, 'JSON parse error:', e.message);
        }
    } else {
        console.log(f, 'does not exist');
    }
}
