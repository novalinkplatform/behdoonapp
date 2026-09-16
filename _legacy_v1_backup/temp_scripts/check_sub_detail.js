const fs = require('fs');
const hvac = JSON.parse(fs.readFileSync('hvac_data.json', 'utf8'));
console.log('detail keys of sub[0]:', Object.keys(hvac.subServices[0].detail));
console.log('detail intro:', hvac.subServices[0].detail.intro ? hvac.subServices[0].detail.intro.substring(0, 100) : null);
console.log('detail steps:', hvac.subServices[0].detail.steps);
