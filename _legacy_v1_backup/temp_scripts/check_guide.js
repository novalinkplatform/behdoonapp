const fs = require('fs');

const files = ['hvac_data.json', 'plumbing_data.json', 'electrical_data.json', 'renovation_data.json'];
for (const f of files) {
    const data = JSON.parse(fs.readFileSync(f, 'utf8'));
    console.log(f, {
        guideLen: (data.comprehensiveGuide || '').length,
        faqCount: (data.faq || []).length,
        subServicesCount: (data.subServices || []).length
    });
}
