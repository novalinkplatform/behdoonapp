const fs = require('fs');
let testWorker = fs.readFileSync('test_worker_2.js', 'utf8');
let currentWorker = fs.readFileSync('worker.js', 'utf8');

const sIdx = testWorker.indexOf('d="M12 3v18');
const eIdx = testWorker.indexOf('"subServices": [', testWorker.indexOf('"renovation": {'));

console.log('sIdx:', sIdx, 'eIdx:', eIdx, 'Length:', eIdx - sIdx);
if (sIdx !== -1 && eIdx !== -1) {
    const missingPart = testWorker.substring(sIdx, eIdx);
    
    const currSIdx = currentWorker.indexOf('d="M9.53 16.122');
    const currEIdx = currentWorker.indexOf('"subServices": [', currSIdx);
    
    console.log('currSIdx:', currSIdx, 'currEIdx:', currEIdx, 'Curr Length:', currEIdx - currSIdx);
    
    if (currSIdx !== -1 && currEIdx !== -1) {
        let fixedWorker = currentWorker.substring(0, currSIdx) + missingPart + currentWorker.substring(currEIdx);
        fs.writeFileSync('worker_fixed.js', fixedWorker);
        console.log('Fixed worker written to worker_fixed.js');
    }
}
