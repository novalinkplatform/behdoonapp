const fs = require('fs');

let indexCode = fs.readFileSync('src/index.js', 'utf8');
indexCode = indexCode.replace(/"Cache-Control":.*/, 
  `"Cache-Control": "public, s-maxage=0, max-age=0, no-cache, no-store, must-revalidate",`);
fs.writeFileSync('src/index.js', indexCode);

console.log("Edge Cache busting added.");
