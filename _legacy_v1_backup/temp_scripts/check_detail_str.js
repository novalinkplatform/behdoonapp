const fs = require('fs');
const hvac = JSON.parse(fs.readFileSync('hvac_data.json', 'utf8'));
console.log('detail string snippet:');
console.log(hvac.subServices[0].detail.slice(0, 500));
