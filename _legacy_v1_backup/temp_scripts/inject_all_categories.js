const fs = require('fs');

const plumbing = JSON.parse(fs.readFileSync('plumbing_data.json', 'utf8'));
const electrical = JSON.parse(fs.readFileSync('electrical_data.json', 'utf8'));
const renovation = JSON.parse(fs.readFileSync('renovation_data.json', 'utf8'));

let code = fs.readFileSync('src/frontend.js', 'utf8');

// Find boundaries of "plumbing": { ... } up to "renderServicePage"
const pStart = code.indexOf('  "plumbing": {');
const funcStart = code.indexOf('renderServicePage');
const actualFuncStart = code.lastIndexOf('function renderServicePage', funcStart);

if (pStart !== -1 && funcStart !== -1) {
    const newRestOfServices = 
        '  "plumbing": ' + JSON.stringify(plumbing, null, 4) + ',\n' +
        '  "electrical": ' + JSON.stringify(electrical, null, 4) + ',\n' +
        '  "renovation": ' + JSON.stringify(renovation, null, 4) + '\n};\n\n';
    
    code = code.substring(0, pStart) + newRestOfServices + code.substring(funcStart);
    fs.writeFileSync('src/frontend.js', code);
    console.log('All remaining categories (plumbing, electrical, renovation) injected successfully!');
} else {
    console.error('Could not find boundaries:', { pStart, funcStart });
}
