const fs = require('fs');
let toml = fs.readFileSync('wrangler.toml', 'utf8');
toml = toml.replace('main = "worker.js"', 'main = "src/index.js"');
fs.writeFileSync('wrangler.toml', toml);
