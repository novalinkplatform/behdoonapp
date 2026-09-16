const fs = require('fs');
const content = fs.readFileSync('src/frontend.js', 'utf8');

// Check what categories are defined in servicesData
const cats = ['hvac', 'plumbing', 'electrical', 'renovation'];
for (const cat of cats) {
    const idx = content.indexOf(`"${cat}":`);
    const idx2 = content.indexOf(`'${cat}':`);
    const idx3 = content.indexOf(`  ${cat}:`);
    console.log(`Category ${cat}:`, { idx, idx2, idx3 });
}
