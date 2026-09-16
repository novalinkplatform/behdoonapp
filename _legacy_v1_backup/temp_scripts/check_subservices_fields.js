const fs = require('fs');

const hvac = JSON.parse(fs.readFileSync('hvac_data.json', 'utf8'));
console.log('HVAC sub[0] keys:', Object.keys(hvac.subServices[0]));
console.log('HVAC sub[0] sample:', {
    name: hvac.subServices[0].name,
    desc: hvac.subServices[0].desc ? hvac.subServices[0].desc.substring(0, 50) + '...' : null,
    slug: hvac.subServices[0].slug,
    persianSlug: hvac.subServices[0].persianSlug,
    stepsCount: (hvac.subServices[0].steps || []).length
});
console.log('HVAC full content length:', (hvac.article || hvac.content || hvac.fullContent || '').length);
console.log('HVAC root keys:', Object.keys(hvac));
