const fs = require('fs');

const content = fs.readFileSync('src/frontend.js', 'utf8');

const mIdx = content.indexOf('<!-- Submit Request Modal -->');
const mEnd = content.indexOf('</script>', mIdx);

console.log(content.substring(mIdx, mEnd + 1500));
