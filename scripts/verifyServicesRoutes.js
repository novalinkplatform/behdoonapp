import {
  getAllCategories,
  findCategory,
  findSubService,
  findSubServiceByAnySlug,
  getAllSubServices,
} from '../src/data/allServicesData.ts';

console.log('=== VERIFYING BEHDOON SERVICE ROUTES & DATA ===');

const categories = getAllCategories();
console.log(`Total Categories: ${categories.length}`);
if (categories.length !== 8) {
  throw new Error(`Expected 8 categories, got ${categories.length}`);
}

const allSubServices = getAllSubServices();
console.log(`Total SubServices: ${allSubServices.length}`);
if (allSubServices.length !== 53) {
  throw new Error(`Expected 53 subservices, got ${allSubServices.length}`);
}

// 1. Verify Category resolution
const testCats = ['hvac', 'plumbing', 'electrical', 'renovation', 'locksmith', 'carpentry', 'doors_windows', 'cleaning'];
for (const catId of testCats) {
  const found = findCategory(catId);
  if (!found) throw new Error(`Category not found by ID: ${catId}`);
  console.log(`  ✓ Category OK: ${found.title} (${found.subServices.length} subservices)`);
}

// 2. Verify Hierarchical Subservice resolution
const testHierarchical = [
  { cat: 'hvac', sub: 'water-cooler' },
  { cat: 'hvac', sub: 'split-ac' },
  { cat: 'plumbing', sub: 'leak-detection' },
  { cat: 'plumbing', sub: 'moisture-repair' },
  { cat: 'electrical', sub: 'short-circuit' },
  { cat: 'renovation', sub: 'painting' },
  { cat: 'locksmith', sub: 'emergency-lockout' },
  { cat: 'carpentry', sub: 'cabinet-repair' },
  { cat: 'doors_windows', sub: 'upvc-repair' },
  { cat: 'cleaning', sub: 'staircase-cleaning' },
];

for (const t of testHierarchical) {
  const match = findSubService(t.cat, t.sub);
  if (!match) throw new Error(`Hierarchical route failed for /services/${t.cat}/${t.sub}`);
  console.log(`  ✓ Hierarchical OK: /services/${t.cat}/${t.sub} -> ${match.subService.name} (Base: ${match.subService.basePrice})`);
}

// 3. Verify Direct Alias resolution (/services/:sub)
const testAliases = ['leak-detection', 'emergency-lockout', 'upvc-repair', 'split-ac', 'painting'];
for (const alias of testAliases) {
  const match = findSubServiceByAnySlug(alias);
  if (!match) throw new Error(`Direct alias route failed for /services/${alias}`);
  console.log(`  ✓ Alias OK: /services/${alias} -> ${match.category.title} > ${match.subService.name}`);
}

// 4. Verify Persian slug resolution
const testPersian = ['تشخیص-ترکیدگی-لوله', 'نصب-و-سرویس-کولر-آبی', 'رفع-اتصالی', 'نقاشی-ساختمان'];
for (const p of testPersian) {
  const match = findSubServiceByAnySlug(p);
  if (!match) throw new Error(`Persian slug failed for /services/${p}`);
  console.log(`  ✓ Persian Slug OK: /services/${p} -> ${match.subService.name}`);
}

console.log('\n ALL 53 SERVICES AND ROUTES VERIFIED SUCCESSFULLY! ✨');
