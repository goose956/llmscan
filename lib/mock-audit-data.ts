import type { AuditReport, PromptResult, Engine, PageAudit, NewPage } from './audit-types';

// ── Product catalog ────────────────────────────────────────────────────────────

type ProductEntry = { id: string; name: string; collection: string; category: string; gender: 'mens' | 'womens' | 'unisex' };

const PRODUCT_CATALOG: ProductEntry[] = [
  // Men's Waterproof Jackets
  { id: 'p001', name: 'Torridon Hardshell Jacket',        collection: "Men's Waterproof Jackets", category: 'waterproof jackets', gender: 'mens' },
  { id: 'p002', name: 'Ben Nevis GTX Pro Jacket',         collection: "Men's Waterproof Jackets", category: 'waterproof jackets', gender: 'mens' },
  { id: 'p003', name: 'Cairngorm 3L Waterproof Jacket',   collection: "Men's Waterproof Jackets", category: 'waterproof jackets', gender: 'mens' },
  { id: 'p004', name: 'Glencoe Shell Jacket',             collection: "Men's Waterproof Jackets", category: 'waterproof jackets', gender: 'mens' },
  { id: 'p005', name: 'Knoydart Active Jacket',           collection: "Men's Waterproof Jackets", category: 'waterproof jackets', gender: 'mens' },
  { id: 'p006', name: 'Loch Lomond Packable Jacket',      collection: "Men's Waterproof Jackets", category: 'waterproof jackets', gender: 'mens' },
  { id: 'p007', name: 'Arrochar DWR Shell',               collection: "Men's Waterproof Jackets", category: 'waterproof jackets', gender: 'mens' },
  { id: 'p008', name: 'Skye Ridge Waterproof Jacket',     collection: "Men's Waterproof Jackets", category: 'waterproof jackets', gender: 'mens' },
  // Women's Waterproof Jackets
  { id: 'p009', name: "Torridon Women's Hardshell",       collection: "Women's Waterproof Jackets", category: 'waterproof jackets', gender: 'womens' },
  { id: 'p010', name: "Cairngorm Women's Waterproof",     collection: "Women's Waterproof Jackets", category: 'waterproof jackets', gender: 'womens' },
  { id: 'p011', name: "Kintyre Women's Shell Jacket",     collection: "Women's Waterproof Jackets", category: 'waterproof jackets', gender: 'womens' },
  { id: 'p012', name: "Affric Women's Active Jacket",     collection: "Women's Waterproof Jackets", category: 'waterproof jackets', gender: 'womens' },
  { id: 'p013', name: "Morar Women's Packable Rain Jacket",collection: "Women's Waterproof Jackets", category: 'waterproof jackets', gender: 'womens' },
  { id: 'p014', name: "Beinn Women's 3L Jacket",          collection: "Women's Waterproof Jackets", category: 'waterproof jackets', gender: 'womens' },
  { id: 'p015', name: "Cuillin Women's Hardshell",        collection: "Women's Waterproof Jackets", category: 'waterproof jackets', gender: 'womens' },
  // Men's Softshell
  { id: 'p016', name: 'Cheviot Softshell Jacket',         collection: "Men's Softshell", category: 'softshell jackets', gender: 'mens' },
  { id: 'p017', name: 'Lammermuir Wind Jacket',           collection: "Men's Softshell", category: 'softshell jackets', gender: 'mens' },
  { id: 'p018', name: 'Pentland Stretch Shell',           collection: "Men's Softshell", category: 'softshell jackets', gender: 'mens' },
  { id: 'p019', name: 'Moorfoot Softshell Pro',           collection: "Men's Softshell", category: 'softshell jackets', gender: 'mens' },
  { id: 'p020', name: 'Tweed Valley Windshirt',           collection: "Men's Softshell", category: 'softshell jackets', gender: 'mens' },
  { id: 'p021', name: 'Esk Softshell Jacket',             collection: "Men's Softshell", category: 'softshell jackets', gender: 'mens' },
  // Women's Softshell
  { id: 'p022', name: "Eildon Women's Softshell",         collection: "Women's Softshell", category: 'softshell jackets', gender: 'womens' },
  { id: 'p023', name: "Cheviot Women's Wind Jacket",      collection: "Women's Softshell", category: 'softshell jackets', gender: 'womens' },
  { id: 'p024', name: "Ochil Women's Stretch Shell",      collection: "Women's Softshell", category: 'softshell jackets', gender: 'womens' },
  { id: 'p025', name: "Lomond Women's Softshell",         collection: "Women's Softshell", category: 'softshell jackets', gender: 'womens' },
  // Insulated & Down
  { id: 'p026', name: "Rannoch Down Jacket (Men's)",      collection: "Insulated Jackets", category: 'insulated jackets', gender: 'mens' },
  { id: 'p027', name: "Rannoch Down Jacket (Women's)",    collection: "Insulated Jackets", category: 'insulated jackets', gender: 'womens' },
  { id: 'p028', name: "Tummel Insulated Gilet (Men's)",   collection: "Insulated Jackets", category: 'insulated jackets', gender: 'mens' },
  { id: 'p029', name: "Tummel Insulated Gilet (Women's)", collection: "Insulated Jackets", category: 'insulated jackets', gender: 'womens' },
  { id: 'p030', name: 'Trossachs Puffer Jacket',          collection: "Insulated Jackets", category: 'insulated jackets', gender: 'unisex' },
  { id: 'p031', name: 'Cowal Synthetic Midlayer Jacket',  collection: "Insulated Jackets", category: 'insulated jackets', gender: 'unisex' },
  { id: 'p032', name: "Dochart Down Hooded Jacket (Men's)",   collection: "Insulated Jackets", category: 'insulated jackets', gender: 'mens' },
  { id: 'p033', name: "Dochart Down Hooded Jacket (Women's)", collection: "Insulated Jackets", category: 'insulated jackets', gender: 'womens' },
  // Men's Fleeces
  { id: 'p034', name: "Stirling Full-Zip Fleece",         collection: "Men's Fleeces", category: 'fleeces', gender: 'mens' },
  { id: 'p035', name: "Balmoral Grid Fleece",             collection: "Men's Fleeces", category: 'fleeces', gender: 'mens' },
  { id: 'p036', name: "Grampian Half-Zip Fleece",         collection: "Men's Fleeces", category: 'fleeces', gender: 'mens' },
  { id: 'p037', name: "Highland Quarter-Zip Fleece",      collection: "Men's Fleeces", category: 'fleeces', gender: 'mens' },
  { id: 'p038', name: "Findhorn Fleece Jacket",           collection: "Men's Fleeces", category: 'fleeces', gender: 'mens' },
  { id: 'p039', name: "Morven Pile Fleece",               collection: "Men's Fleeces", category: 'fleeces', gender: 'mens' },
  { id: 'p040', name: "Forth Recycled Fleece Pullover",   collection: "Men's Fleeces", category: 'fleeces', gender: 'mens' },
  // Women's Fleeces
  { id: 'p041', name: "Stirling Women's Fleece",          collection: "Women's Fleeces", category: 'fleeces', gender: 'womens' },
  { id: 'p042', name: "Solway Full-Zip Women's Fleece",   collection: "Women's Fleeces", category: 'fleeces', gender: 'womens' },
  { id: 'p043', name: "Nith Women's Half-Zip Fleece",     collection: "Women's Fleeces", category: 'fleeces', gender: 'womens' },
  { id: 'p044', name: "Yarrow Grid Fleece (Women's)",     collection: "Women's Fleeces", category: 'fleeces', gender: 'womens' },
  { id: 'p045', name: "Teviot Fleece Jacket (Women's)",   collection: "Women's Fleeces", category: 'fleeces', gender: 'womens' },
  // Men's Base Layers
  { id: 'p046', name: "Merino 150 Crew Top (Men's)",      collection: "Men's Base Layers", category: 'merino base layers', gender: 'mens' },
  { id: 'p047', name: "Merino 200 Zip Neck (Men's)",      collection: "Men's Base Layers", category: 'merino base layers', gender: 'mens' },
  { id: 'p048', name: "Merino 260 Long Sleeve (Men's)",   collection: "Men's Base Layers", category: 'merino base layers', gender: 'mens' },
  { id: 'p049', name: "Merino 150 Long Sleeve (Men's)",   collection: "Men's Base Layers", category: 'merino base layers', gender: 'mens' },
  { id: 'p050', name: "Tech-Wik Active Tee (Men's)",      collection: "Men's Base Layers", category: 'merino base layers', gender: 'mens' },
  { id: 'p051', name: "Merino 200 Leggings (Men's)",      collection: "Men's Base Layers", category: 'merino base layers', gender: 'mens' },
  { id: 'p052', name: "Merino 150 Vest (Men's)",          collection: "Men's Base Layers", category: 'merino base layers', gender: 'mens' },
  { id: 'p053', name: "Merino Running Tee (Men's)",       collection: "Men's Base Layers", category: 'merino base layers', gender: 'mens' },
  // Women's Base Layers
  { id: 'p054', name: "Merino 150 Crew Top (Women's)",    collection: "Women's Base Layers", category: 'merino base layers', gender: 'womens' },
  { id: 'p055', name: "Merino 200 Zip Neck (Women's)",    collection: "Women's Base Layers", category: 'merino base layers', gender: 'womens' },
  { id: 'p056', name: "Merino 150 Long Sleeve (Women's)", collection: "Women's Base Layers", category: 'merino base layers', gender: 'womens' },
  { id: 'p057', name: "Tech-Wik Active Tee (Women's)",    collection: "Women's Base Layers", category: 'merino base layers', gender: 'womens' },
  { id: 'p058', name: "Merino Sports Bra",                collection: "Women's Base Layers", category: 'merino base layers', gender: 'womens' },
  { id: 'p059', name: "Merino 200 Leggings (Women's)",   collection: "Women's Base Layers", category: 'merino base layers', gender: 'womens' },
  { id: 'p060', name: "Merino 260 Crew Top (Women's)",    collection: "Women's Base Layers", category: 'merino base layers', gender: 'womens' },
  { id: 'p061', name: "Merino Vest (Women's)",            collection: "Women's Base Layers", category: 'merino base layers', gender: 'womens' },
  // Men's Trousers
  { id: 'p062', name: "Cairn Softshell Trousers (Men's)", collection: "Men's Hiking Trousers", category: 'hiking trousers', gender: 'mens' },
  { id: 'p063', name: "Ben Walking Trousers (Men's)",     collection: "Men's Hiking Trousers", category: 'hiking trousers', gender: 'mens' },
  { id: 'p064', name: "Glen Zip-Off Trousers (Men's)",    collection: "Men's Hiking Trousers", category: 'hiking trousers', gender: 'mens' },
  { id: 'p065', name: "Loch Stretch Trousers (Men's)",    collection: "Men's Hiking Trousers", category: 'hiking trousers', gender: 'mens' },
  { id: 'p066', name: "Strath Waterproof Trousers (Men's)", collection: "Men's Hiking Trousers", category: 'hiking trousers', gender: 'mens' },
  { id: 'p067', name: "Ridge Convertible Trousers (Men's)", collection: "Men's Hiking Trousers", category: 'hiking trousers', gender: 'mens' },
  { id: 'p068', name: "Spey Trail Shorts (Men's)",        collection: "Men's Hiking Trousers", category: 'hiking trousers', gender: 'mens' },
  // Women's Trousers
  { id: 'p069', name: "Cairn Softshell Trousers (Women's)", collection: "Women's Hiking Trousers", category: 'hiking trousers', gender: 'womens' },
  { id: 'p070', name: "Ben Walking Trousers (Women's)",   collection: "Women's Hiking Trousers", category: 'hiking trousers', gender: 'womens' },
  { id: 'p071', name: "Loch Stretch Trousers (Women's)",  collection: "Women's Hiking Trousers", category: 'hiking trousers', gender: 'womens' },
  { id: 'p072', name: "Glen Zip-Off Trousers (Women's)",  collection: "Women's Hiking Trousers", category: 'hiking trousers', gender: 'womens' },
  { id: 'p073', name: "Strath Waterproof Trousers (Women's)", collection: "Women's Hiking Trousers", category: 'hiking trousers', gender: 'womens' },
  { id: 'p074', name: "Tay Trail Shorts (Women's)",       collection: "Women's Hiking Trousers", category: 'hiking trousers', gender: 'womens' },
  // Accessories
  { id: 'p075', name: "Merino Beanie Hat",                collection: "Accessories", category: 'accessories', gender: 'unisex' },
  { id: 'p076', name: "Merino Liner Gloves",              collection: "Accessories", category: 'accessories', gender: 'unisex' },
  { id: 'p077', name: "Softshell Mittens",                collection: "Accessories", category: 'accessories', gender: 'unisex' },
  { id: 'p078', name: "Merino Buff Scarf",                collection: "Accessories", category: 'accessories', gender: 'unisex' },
  { id: 'p079', name: "Merino Gaiter Socks (3-pack)",     collection: "Accessories", category: 'accessories', gender: 'unisex' },
  { id: 'p080', name: "Waterproof Stuff Sack 20L",        collection: "Accessories", category: 'accessories', gender: 'unisex' },
];

const USE_CASES_PER_CATEGORY: Record<string, string[]> = {
  'waterproof jackets': ['mountain hiking in rain', 'wild camping', 'trail running in wet weather', 'winter hillwalking in Scotland'],
  'softshell jackets':  ['multi-day hiking', 'scrambling and via ferrata', 'autumn day walks', 'mountain biking'],
  'insulated jackets':  ['winter camping', 'ski touring', 'cold weather hiking', 'belaying and high-altitude use'],
  'fleeces':            ['camping and bivouacking', 'autumn and spring hiking', 'everyday outdoor wear', 'mid-layer for cold hillwalking'],
  'merino base layers': ['long-distance hiking', 'cycling and bikepacking', 'skiing and snowboarding', 'travel and everyday wear'],
  'hiking trousers':    ['multi-day backpacking', 'Munro bagging in Scotland', 'scrambling on rocky terrain', 'coastal path walking'],
  'accessories':        ['winter hillwalking', 'cold-weather camping', 'mountain expeditions', 'running and trail use'],
};

const COMPETITORS_PER_CATEGORY: Record<string, string[]> = {
  'waterproof jackets': ["Patagonia Torrentshell 3L", "Arc'teryx Beta LT", "Rab Meridian Jacket", "Montane Phase XT Jacket"],
  'softshell jackets':  ["Patagonia Adze Hybrid", "Haglöfs ROC GTX Jacket", "Rab Kinetic Alpine 2.0", "Berghaus Pravitale MTN 2.0"],
  'insulated jackets':  ["Patagonia Down Sweater", "Arc'teryx Cerium Hoody", "Rab Microlight Alpine Down", "Montane Anti-Freeze XT"],
  'fleeces':            ["Patagonia Better Sweater", "Polartec 200 Series Fleece", "Rab Nexus Pull-On Fleece", "Berghaus Prism Fleece"],
  'merino base layers': ["Icebreaker 200 Oasis", "Smartwool Merino 250", "Patagonia Capilene Thermal", "Devold Expedition Merino"],
  'hiking trousers':    ["Patagonia Quandary Pants", "Haglöfs LIM Fuse Pant", "Arc'teryx Gamma LT Pants", "Rab Skyline Trousers"],
  'accessories':        ["Buff Merino Wool Hat", "Black Diamond Crag Gloves", "Icebreaker Quantum Gloves", "Smartwool PhD Outdoor Light Crew"],
};

const PAGE_ISSUES: Record<string, string[]> = {
  'waterproof jackets': ['Missing GTIN', 'No FAQPage schema', 'Waterproofing rating not in schema', 'No care instruction schema'],
  'softshell jackets':  ['Missing GTIN', 'No FAQPage schema', 'Wind resistance rating missing', 'Short description'],
  'insulated jackets':  ['Missing GTIN', 'No fill power in spec schema', 'No FAQPage schema', 'Short description'],
  'fleeces':            ['Missing GTIN', 'No fabric weight in schema', 'No FAQPage schema', 'Missing aggregate rating'],
  'merino base layers': ['Missing GTIN', 'No merino micron weight in schema', 'No FAQPage schema', 'Certification not structured'],
  'hiking trousers':    ['Missing GTIN', 'No size/fit guidance in schema', 'No FAQPage schema', 'Short description'],
  'accessories':        ['Missing GTIN', 'Description under 150 words', 'No material schema', 'No FAQPage schema'],
};

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function bandFromScore(score: number): 'green' | 'amber' | 'red' {
  return score >= 60 ? 'green' : score >= 35 ? 'amber' : 'red';
}

// Deterministic pseudo-random (no Math.random so output is stable)
function ds(seed: number, min: number, max: number): number {
  return min + ((seed * 31 + seed * seed * 7 + 13) % (max - min + 1));
}

function generatePageAudits(): PageAudit[] {
  return PRODUCT_CATALOG.map((prod, i) => {
    const score = ds(i + 100, 18, 68);
    const issues = PAGE_ISSUES[prod.category] ?? ['Missing GTIN', 'No FAQPage schema', 'Short description'];
    return {
      url: `/products/${toSlug(prod.name)}`,
      title: prod.name,
      type: 'product' as const,
      score,
      band: bandFromScore(score),
      topIssues: issues.slice(0, 2 + (i % 2)),
      inboundLinks: ds(i + 200, 1, 22),
    };
  });
}

function generateNewPages(): NewPage[] {
  return PRODUCT_CATALOG.flatMap((prod, i) => {
    const useCases = USE_CASES_PER_CATEGORY[prod.category] ?? ['hiking', 'outdoor activities', 'cold weather', 'trail use'];
    const competitors = COMPETITORS_PER_CATEGORY[prod.category] ?? ['Patagonia', "Arc'teryx", 'Rab', 'Montane'];
    const uc  = useCases[i % useCases.length];
    const comp = competitors[i % competitors.length];
    const priority = ([1, 1, 2, 2, 2, 3, 3][i % 7]) as 1 | 2 | 3;
    const potential = (priority === 1 ? 'high' : priority === 2 ? 'medium' : 'low') as 'high' | 'medium' | 'low';
    const wc = (n: number) => 1200 + ds(i + n, 0, 1200);

    return [
      {
        id: `np-${prod.id}-guide`,
        title: `Best ${prod.category} for ${uc} UK 2026`,
        slug: `/blogs/guides/best-${toSlug(prod.category)}-${toSlug(uc)}-uk`,
        template: 'buyer-guide',
        targetQueries: [`best ${prod.category} for ${uc} uk`, `top ${prod.category} uk 2026`, `${prod.category} buying guide uk`],
        linkedProducts: [prod.name, prod.collection],
        citationPotential: potential,
        priority,
        wordCount: wc(1),
        briefSummary: `Buyer's guide to ${prod.category} for ${uc}. Features the ${prod.name} with direct product links and FAQPage schema.`,
      },
      {
        id: `np-${prod.id}-vs`,
        title: `${prod.name} vs ${comp}: Which Should You Buy?`,
        slug: `/blogs/comparisons/${toSlug(prod.name)}-vs-${toSlug(comp)}`,
        template: 'comparison',
        targetQueries: [`${prod.name} vs ${comp}`, `is ${prod.name} worth it 2026`, `${prod.name} review uk`],
        linkedProducts: [prod.name, prod.collection],
        citationPotential: potential,
        priority,
        wordCount: wc(2),
        briefSummary: `Side-by-side comparison of ${prod.name} and ${comp} on materials, price, performance, and sustainability. Ends with a buy CTA to the ${prod.name} product page.`,
      },
      {
        id: `np-${prod.id}-review`,
        title: `${prod.name} Review: Is It Worth It in 2026?`,
        slug: `/blogs/reviews/${toSlug(prod.name)}-review`,
        template: 'buyer-guide',
        targetQueries: [`${prod.name} review`, `is ${prod.name} any good`, `${prod.name} honest review`],
        linkedProducts: [prod.name, prod.collection],
        citationPotential: potential,
        priority,
        wordCount: wc(3),
        briefSummary: `Long-form field-test review of the ${prod.name} after 6 months of use. Pros, cons, who it's best for. Review + ItemReviewed schema. Bottom-of-funnel citation target.`,
      },
      {
        id: `np-${prod.id}-use`,
        title: `What to Wear for ${uc.charAt(0).toUpperCase() + uc.slice(1)} in the UK`,
        slug: `/blogs/guides/what-to-wear-${toSlug(uc)}-uk`,
        template: 'use-case',
        targetQueries: [`what to wear for ${uc} uk`, `${uc} clothing uk`, `best gear for ${uc} uk`],
        linkedProducts: [prod.name, prod.collection, 'Homepage'],
        citationPotential: potential,
        priority,
        wordCount: wc(4),
        briefSummary: `Use-case guide for ${uc} featuring ${prod.name} as the hero product. Full outfit walkthrough linking to all relevant collections. HowTo + FAQPage schema.`,
      },
    ] as NewPage[];
  });
}

// ── Static core pages (curated) ───────────────────────────────────────────────

const CORE_PAGES: PageAudit[] = [
  { url: '/collections/hiking-jackets',           title: 'Hiking Jackets',                          type: 'collection', score: 71, band: 'green', topIssues: ['Missing aggregate rating schema', 'No FAQ content block'],                 inboundLinks: 24 },
  { url: '/collections/base-layers',              title: 'Base Layers',                             type: 'collection', score: 66, band: 'green', topIssues: ['No FAQ schema', 'Missing brand entity markup'],                            inboundLinks: 18 },
  { url: '/',                                     title: 'Homepage',                                type: 'home',       score: 62, band: 'amber', topIssues: ['Missing FAQPage schema', 'No llms.txt linked', 'Thin sustainability copy'], inboundLinks: 112 },
  { url: '/collections/waterproof-jackets',       title: 'Waterproof Jackets',                      type: 'collection', score: 58, band: 'amber', topIssues: ['Missing category description', 'No comparison content'],                   inboundLinks: 31 },
  { url: '/collections/fleece',                   title: 'Fleece & Mid-layers',                     type: 'collection', score: 55, band: 'amber', topIssues: ['No FAQPage schema', 'Missing GTIN on all variants'],                       inboundLinks: 9 },
  { url: '/collections/softshell',                title: 'Softshell Jackets',                       type: 'collection', score: 54, band: 'amber', topIssues: ['Missing category description', 'No FAQ schema'],                           inboundLinks: 14 },
  { url: '/collections/insulated-jackets',        title: 'Insulated Jackets',                       type: 'collection', score: 52, band: 'amber', topIssues: ['No FAQPage schema', 'Missing GTIN on all variants'],                       inboundLinks: 11 },
  { url: '/collections/hiking-trousers',          title: 'Hiking Trousers',                         type: 'collection', score: 51, band: 'amber', topIssues: ['Missing category description', 'No FAQ schema'],                           inboundLinks: 8 },
  { url: '/collections/accessories',              title: 'Accessories',                             type: 'collection', score: 48, band: 'amber', topIssues: ['No FAQPage schema', 'Thin collection description'],                         inboundLinks: 6 },
  { url: '/blogs/news/ethical-outdoor-brands-guide', title: 'The Complete Guide to Ethical Outdoor Brands', type: 'blog', score: 61, band: 'amber', topIssues: ['Missing Article schema', 'No internal links to products'],              inboundLinks: 12 },
  { url: '/blogs/news/recycled-vs-natural-materials', title: 'Recycled vs Natural: Which is Better?', type: 'blog',  score: 55, band: 'amber', topIssues: ['No FAQPage schema', 'Missing author entity'],                                inboundLinks: 8 },
  { url: '/pages/sustainability',                 title: 'Our Sustainability Story',                type: 'other',      score: 48, band: 'amber', topIssues: ['No structured data at all', 'No certifications in schema'],                 inboundLinks: 19 },
  { url: '/pages/b-corp',                         title: 'B Corp Certification',                    type: 'other',      score: 44, band: 'red',   topIssues: ['No Organization schema', 'Not linked from header nav'],                     inboundLinks: 4 },
  { url: '/pages/about',                          title: 'About Northwind Outdoor',                 type: 'other',      score: 42, band: 'red',   topIssues: ['No Organization schema', 'Missing founding year in schema'],               inboundLinks: 21 },
  { url: '/pages/size-guide',                     title: 'Size Guide',                              type: 'other',      score: 38, band: 'red',   topIssues: ['No SizeSpecification schema', 'Not linked from product pages'],            inboundLinks: 14 },
  { url: '/pages/faq',                            title: 'FAQ',                                     type: 'other',      score: 36, band: 'red',   topIssues: ['No FAQPage schema on the FAQ page itself', 'Only 6 questions listed'],    inboundLinks: 9 },
  { url: '/pages/privacy-policy',                 title: 'Privacy Policy',                          type: 'policy',     score: 22, band: 'red',   topIssues: ['No schema — expected for policy pages', 'Unnecessary in sitemap'],        inboundLinks: 8 },
  { url: '/pages/returns',                        title: 'Returns & Refunds',                       type: 'policy',     score: 21, band: 'red',   topIssues: ['No MerchantReturnPolicy schema', 'AI cannot surface return terms'],       inboundLinks: 11 },
  { url: '/pages/terms-of-service',               title: 'Terms of Service',                        type: 'policy',     score: 18, band: 'red',   topIssues: ['No schema', 'Not relevant for AI citations'],                             inboundLinks: 7 },
  { url: '/pages/contact',                        title: 'Contact Us',                              type: 'other',      score: 20, band: 'red',   topIssues: ['No ContactPage schema', 'Missing opening hours / location'],             inboundLinks: 15 },
];

const ENGINES: Engine[] = ['ChatGPT', 'Perplexity', 'Google AI Mode', 'Claude'];

type BC = 'northwind' | 'patagonia' | 'finisterre' | 'picture' | 'paramo' | 'vaude' | 'rab' | 'howies' | 'passenger' | 'smartwool' | null;

const BRAND: Record<Exclude<BC, null>, string> = {
  northwind: 'Northwind Outdoor',
  patagonia: 'Patagonia',
  finisterre: 'Finisterre',
  picture: 'Picture Organic',
  paramo: 'Páramo',
  vaude: 'Vaude',
  rab: 'Rab',
  howies: 'Howies',
  passenger: 'Passenger Clothing',
  smartwool: 'Smartwool',
};

function r(codes: [BC, BC, BC, BC]): PromptResult[] {
  return codes.map((code, i) => ({
    engine: ENGINES[i],
    status: code === 'northwind' ? 'cited' : code === null ? 'neither' : 'competitor-cited',
    citedBrand: code !== null && code !== 'northwind' ? BRAND[code] : undefined,
  })) as PromptResult[];
}

export const report: AuditReport = {
  meta: {
    brand: 'Northwind Outdoor',
    domain: 'northwindoutdoor.co.uk',
    scannedAt: '2026-05-19T09:41:00Z',
    pagesScanned: 200,
    promptsTested: 30,
    enginesProbed: ['ChatGPT', 'Perplexity', 'Google AI Mode', 'Claude'],
    preparedBy: 'Cited',
    reportId: 'RPT-2026-NW-0047',
  },
  overallScore: 47,
  band: 'amber',
  revenueAtStake: '£87,000',
  headlineFinding: 'You appear in 7 of 30 buying queries we tested. Your top competitor, Patagonia, appears in 23.',
  topThreeFindings: [
    'Missing FAQPage schema across all 47 product pages — pages with FAQPage schema receive 2.8× more AI citations.',
    'Product schema missing GTIN field on all 200 products — required for Shopify Agentic Storefronts AI shopping.',
    'Zero comparison or buyer-guide content — competitors capture 60% of "best X for Y" citations in your category.',
  ],

  buyingPrompts: [
    { id: 'p01', prompt: 'Best sustainable hiking jackets under £200', intent: 'best-for', results: r(['patagonia', 'patagonia', 'patagonia', 'finisterre']) },
    { id: 'p02', prompt: 'Waterproof rain jackets for UK hiking', intent: 'best-for', results: r(['patagonia', 'patagonia', 'finisterre', 'patagonia']) },
    { id: 'p03', prompt: 'Patagonia alternatives 2026', intent: 'comparison', results: r(['finisterre', 'howies', 'picture', 'passenger']) },
    { id: 'p04', prompt: 'Best eco-friendly outdoor clothing brands', intent: 'best-for', results: r(['northwind', 'northwind', 'northwind', 'northwind']) },
    { id: 'p05', prompt: 'Recycled material hiking gear', intent: 'use-case', results: r(['northwind', 'northwind', 'patagonia', 'northwind']) },
    { id: 'p06', prompt: 'Vegan hiking boots UK', intent: 'best-for', results: r(['patagonia', 'vaude', null, 'vaude']) },
    { id: 'p07', prompt: 'Best base layers for cold weather hiking', intent: 'best-for', results: r(['patagonia', 'smartwool', 'patagonia', 'patagonia']) },
    { id: 'p08', prompt: 'Sustainable winter coats women', intent: 'best-for', results: r(['patagonia', 'patagonia', 'patagonia', 'finisterre']) },
    { id: 'p09', prompt: 'Best hiking brand for ethical sourcing', intent: 'what-is', results: r(['northwind', 'northwind', 'northwind', 'northwind']) },
    { id: 'p10', prompt: 'Outdoor brands B Corp certified', intent: 'what-is', results: r(['northwind', 'northwind', 'northwind', 'northwind']) },
    { id: 'p11', prompt: 'Best lightweight rain jacket for backpacking', intent: 'best-for', results: r(['patagonia', 'patagonia', 'picture', 'patagonia']) },
    { id: 'p12', prompt: 'Hiking pants for tall women', intent: 'best-for', results: r(['patagonia', 'patagonia', 'patagonia', 'paramo']) },
    { id: 'p13', prompt: 'Affordable Patagonia alternatives UK', intent: 'price-anchored', results: r(['finisterre', 'howies', 'passenger', 'picture']) },
    { id: 'p14', prompt: 'Best outdoor brands made in Europe', intent: 'best-for', results: r(['vaude', 'vaude', 'finisterre', 'vaude']) },
    { id: 'p15', prompt: 'Sustainable down jacket alternatives', intent: 'use-case', results: r(['patagonia', 'patagonia', 'patagonia', 'picture']) },
    { id: 'p16', prompt: 'Eco friendly fleece jacket men', intent: 'best-for', results: r(['northwind', 'northwind', 'patagonia', 'northwind']) },
    { id: 'p17', prompt: 'Best hiking shorts with deep pockets', intent: 'best-for', results: r(['patagonia', 'patagonia', null, 'patagonia']) },
    { id: 'p18', prompt: 'Waterproof breathable jackets compared', intent: 'comparison', results: r(['patagonia', 'picture', 'patagonia', 'patagonia']) },
    { id: 'p19', prompt: 'Best outdoor brands for women\'s fit', intent: 'best-for', results: r(['patagonia', 'finisterre', 'patagonia', 'patagonia']) },
    { id: 'p20', prompt: 'Plastic-free outdoor clothing', intent: 'use-case', results: r(['northwind', 'northwind', null, 'northwind']) },
    { id: 'p21', prompt: 'Climate neutral hiking apparel', intent: 'use-case', results: r(['northwind', 'northwind', 'patagonia', 'northwind']) },
    { id: 'p22', prompt: 'Best mid-layer for spring hiking', intent: 'best-for', results: r(['patagonia', 'patagonia', 'patagonia', 'patagonia']) },
    { id: 'p23', prompt: 'Recycled polyester vs merino wool hiking', intent: 'comparison', results: r(['smartwool', 'smartwool', 'patagonia', 'patagonia']) },
    { id: 'p24', prompt: 'Outdoor clothing made from recycled bottles', intent: 'use-case', results: r(['patagonia', 'patagonia', 'patagonia', 'picture']) },
    { id: 'p25', prompt: 'Best gifts for hikers under £100', intent: 'price-anchored', results: r(['patagonia', 'patagonia', 'rab', 'patagonia']) },
    { id: 'p26', prompt: 'Sustainable kids\' outdoor clothing', intent: 'best-for', results: r(['patagonia', 'patagonia', 'finisterre', 'patagonia']) },
    { id: 'p27', prompt: 'Patagonia vs Picture Organic', intent: 'comparison', results: r(['picture', 'patagonia', 'patagonia', 'picture']) },
    { id: 'p28', prompt: 'Best outdoor brands for mountaineering UK', intent: 'best-for', results: r(['rab', 'patagonia', 'patagonia', 'patagonia']) },
    { id: 'p29', prompt: 'How to choose an ethical hiking jacket', intent: 'what-is', results: r(['patagonia', 'paramo', 'patagonia', 'patagonia']) },
    { id: 'p30', prompt: 'Best winter hiking gloves UK', intent: 'best-for', results: r(['patagonia', null, 'rab', 'patagonia']) },
  ],

  competitors: [
    {
      brand: 'Patagonia',
      domain: 'patagonia.com',
      citationsAcrossPrompts: 23,
      topAdvantage: 'Category authority + strong B Corp knowledge graph signals',
      pageFormats: ['Buyer guides', 'Repair stories', 'Cause content'],
      knowledgeGraphStrength: 'strong',
    },
    {
      brand: 'Finisterre',
      domain: 'finisterre.com',
      citationsAcrossPrompts: 14,
      topAdvantage: 'UK-specific positioning and strong editorial content',
      pageFormats: ['Use-case pages', 'FAQ hubs', 'Sustainability stories'],
      knowledgeGraphStrength: 'medium',
    },
    {
      brand: 'Picture Organic',
      domain: 'picture-organic-clothing.com',
      citationsAcrossPrompts: 11,
      topAdvantage: 'Comparison-friendly content with deep technical specs',
      pageFormats: ['Vs pages', 'Technical spec pages', 'Comparison tables'],
      knowledgeGraphStrength: 'medium',
    },
    {
      brand: 'Páramo',
      domain: 'paramo-clothing.com',
      citationsAcrossPrompts: 9,
      topAdvantage: 'Long-form buyer education and strong Reddit presence',
      pageFormats: ['What-is pages', 'Technical guides', 'Community Q&A'],
      knowledgeGraphStrength: 'medium',
    },
    {
      brand: 'Vaude',
      domain: 'vaude.com',
      citationsAcrossPrompts: 8,
      topAdvantage: 'Structured comparison content and Wikipedia entity',
      pageFormats: ['Comparison pages', 'What-is content', 'Category hubs'],
      knowledgeGraphStrength: 'strong',
    },
  ],

  offSiteSignals: [
    {
      platform: 'Reddit',
      icon: '💬',
      mentions: 12,
      topCompetitorMentions: 8400,
      gap: 'critical',
      notes: 'Patagonia dominates r/Ultralight, r/HikerTrash, r/BuyItForLife. Northwind: 12 organic mentions, all minor.',
    },
    {
      platform: 'YouTube',
      icon: '▶',
      mentions: 4,
      topCompetitorMentions: 1200,
      gap: 'critical',
      notes: '4 transcript mentions across all indexed videos. Patagonia: 1,200+. No creator partnerships detected.',
    },
    {
      platform: 'Trustpilot',
      icon: '★',
      mentions: 240,
      topCompetitorMentions: 0,
      gap: 'significant',
      notes: '240 reviews, 4.2 stars — solid but not connected to product schema. Reviews not surfaced to AI engines.',
    },
    {
      platform: 'Wikipedia',
      icon: 'W',
      mentions: 0,
      topCompetitorMentions: 5,
      gap: 'critical',
      notes: 'No Wikipedia article or Wikidata entity. All 5 top competitors have at least a Wikidata entry. A critical trust signal for LLMs.',
    },
    {
      platform: 'PR / Editorial',
      icon: '📰',
      mentions: 8,
      topCompetitorMentions: 340,
      gap: 'significant',
      notes: '8 editorial mentions in the last 12 months, mostly small eco blogs. Patagonia: 340+ in mainstream outdoor press.',
    },
  ],

  quickWins: [
    {
      id: 'qw1',
      title: 'Add an llms.txt file to your root directory',
      timeToImplement: '15 mins',
      impact: 'high',
      instructions: 'Create a plain text file at `northwindoutdoor.co.uk/llms.txt`. This tells LLMs what your site is about, what you want them to know, and what pages are most important. It\'s the robots.txt equivalent for AI crawlers.',
      codeSnippet: `# Northwind Outdoor — LLMs.txt
# https://northwindoutdoor.co.uk

## About
Northwind Outdoor is a UK-based sustainable outdoor apparel brand
founded in 2019. We make hiking jackets, base layers, and trail gear
from recycled and ethical materials. B Corp certified.

## Key Pages
- /collections/hiking-jackets (our flagship category)
- /collections/base-layers
- /pages/sustainability (our materials + sourcing story)
- /pages/b-corp-certification

## Do not index
- /account/*
- /cart
- /checkout`,
    },
    {
      id: 'qw2',
      title: 'Allow AI crawlers in robots.txt',
      timeToImplement: '10 mins',
      impact: 'high',
      instructions: 'Add explicit allow rules for GPTBot (OpenAI), ClaudeBot (Anthropic), and PerplexityBot to your robots.txt. Many Shopify stores inadvertently block these with wildcard rules.',
      codeSnippet: `# Allow AI search crawlers
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /`,
    },
    {
      id: 'qw3',
      title: 'Add GTINs to your top 20 products in Shopify',
      timeToImplement: '1 hour',
      impact: 'high',
      instructions: 'Go to Shopify Admin → Products → select each product → Inventory section → enter the EAN/GTIN barcode. This is required for Shopify Agentic Storefronts and Google Shopping AI features. Start with your 20 best-selling products.',
    },
    {
      id: 'qw4',
      title: 'Enable Shopify Agentic Storefronts opt-in',
      timeToImplement: '5 mins',
      impact: 'high',
      instructions: 'Go to Shopify Admin → Settings → Customer privacy → scroll to "AI Shopping Features" → enable Agentic Storefront access. This opts your store into being surfaced in AI-powered shopping assistants. Currently only ~12% of eligible UK stores have done this.',
    },
    {
      id: 'qw5',
      title: 'Add FAQPage schema to your homepage',
      timeToImplement: '45 mins',
      impact: 'medium',
      instructions: 'Add 4–5 sustainability-focused FAQs to your homepage using FAQPage JSON-LD schema. These directly feed into AI engine responses when users ask about ethical outdoor brands. Edit your theme\'s `theme.liquid` and insert the JSON-LD in the `<head>`.',
      codeSnippet: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is Northwind Outdoor B Corp certified?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Northwind Outdoor achieved B Corp certification in 2023, meeting rigorous standards for social and environmental performance, accountability, and transparency."
      }
    },
    {
      "@type": "Question", 
      "name": "What materials does Northwind Outdoor use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We use recycled polyester (GRS certified), organic cotton, and responsibly-sourced merino wool. Over 80% of our range is made from recycled or certified natural materials."
      }
    }
  ]
}
</script>`,
    },
    {
      id: 'qw6',
      title: 'Create a Wikidata entity for Northwind Outdoor',
      timeToImplement: '30 mins',
      impact: 'medium',
      instructions: 'Go to wikidata.org, create a free account, and add a new item for Northwind Outdoor. Include: founded date, headquarters, industry, website, B Corp status, and key people. This creates a knowledge graph entity that LLMs use as a trusted source of brand facts. All 5 of your top competitors have one.',
    },
  ],

  pages: [...CORE_PAGES, ...generatePageAudits()],

  backlog: [
    {
      id: 'bl01',
      suggestedTitle: 'Best Sustainable Hiking Jackets UK (2026 Buyer\'s Guide)',
      targetPrompts: ['Best sustainable hiking jackets under £200', 'Best eco-friendly outdoor clothing brands', 'Waterproof rain jackets for UK hiking'],
      template: 'buyer-guide',
      estimatedEffort: 'medium',
      estimatedLift: 'high',
      priority: 1,
      rationale: 'The highest-volume prompt cluster in your category. Patagonia and Finisterre both rank with long-form buyer guides for these exact queries. A 2,000-word guide with product schema, FAQPage, and internal links to your jacket collection would directly compete for 4 of the 30 tested prompts.',
    },
    {
      id: 'bl02',
      suggestedTitle: 'Northwind Outdoor vs Patagonia: An Honest Comparison',
      targetPrompts: ['Patagonia alternatives 2026', 'Affordable Patagonia alternatives UK', 'Patagonia vs Picture Organic'],
      template: 'comparison',
      estimatedEffort: 'medium',
      estimatedLift: 'high',
      priority: 1,
      rationale: 'Comparison queries account for 4 of your 30 tested prompts and 0 citations. Prospects searching "Patagonia alternatives" are high-intent buyers. A fair, detailed comparison page that highlights your B Corp status and UK-origin story would capture this traffic.',
    },
    {
      id: 'bl03',
      suggestedTitle: 'The Best Eco-Friendly Outdoor Clothing Brands in 2026',
      targetPrompts: ['Best eco-friendly outdoor clothing brands', 'Outdoor brands B Corp certified', 'Climate neutral hiking apparel'],
      template: 'buyer-guide',
      estimatedEffort: 'high',
      estimatedLift: 'high',
      priority: 1,
      rationale: 'You already get cited on ethics prompts (3 of 4 engines cite you for "B Corp certified"). A dedicated roundup that includes competitors — where you appear as a top pick — creates a credible editorial page that amplifies your existing strength.',
    },
    {
      id: 'bl04',
      suggestedTitle: 'What is Recycled Outdoor Clothing? Materials, Certifications & What to Look For',
      targetPrompts: ['Recycled material hiking gear', 'Outdoor clothing made from recycled bottles', 'Recycled polyester vs merino wool hiking'],
      template: 'what-is',
      estimatedEffort: 'medium',
      estimatedLift: 'high',
      priority: 1,
      rationale: 'Educational "what is" content gets high AI citation rates because LLMs prefer to reference authoritative explainers. Your B Corp and GRS certification story belongs on a dedicated page — not just the homepage.',
    },
    {
      id: 'bl05',
      suggestedTitle: 'How to Choose an Ethical Hiking Jacket: The Complete Checklist',
      targetPrompts: ['How to choose an ethical hiking jacket', 'Best hiking brand for ethical sourcing', 'Sustainable down jacket alternatives'],
      template: 'use-case',
      estimatedEffort: 'low',
      estimatedLift: 'high',
      priority: 1,
      rationale: 'Decision-support content scores extremely well in AI citations. A checklist format (with HowTo schema) gives LLMs structured content they can excerpt directly. You already win on "ethical sourcing" prompts — this page doubles down on that strength.',
    },
    {
      id: 'bl06',
      suggestedTitle: 'Northwind Outdoor vs Finisterre: UK Sustainable Brands Compared',
      targetPrompts: ['Patagonia alternatives 2026', 'Best outdoor brands made in Europe', 'Affordable Patagonia alternatives UK'],
      template: 'comparison',
      estimatedEffort: 'low',
      estimatedLift: 'medium',
      priority: 2,
      rationale: 'Finisterre is your closest UK competitor and appears in 14 of 30 prompts. A direct comparison — done honestly — builds topical authority and gives AI engines a structured way to recommend you alongside (or instead of) Finisterre.',
    },
    {
      id: 'bl07',
      suggestedTitle: 'Frequently Asked Questions: Sustainable Outdoor Apparel',
      targetPrompts: ['Best eco-friendly outdoor clothing brands', 'Best hiking brand for ethical sourcing', 'Outdoor brands B Corp certified'],
      template: 'faq-hub',
      estimatedEffort: 'low',
      estimatedLift: 'medium',
      priority: 2,
      rationale: 'A centralised FAQ hub with FAQPage schema targeting your top 15 sustainability questions. This is the fastest route to appearing in AI "featured answers" for question-format prompts.',
    },
    {
      id: 'bl08',
      suggestedTitle: 'Best Gifts for Hikers Under £100 (UK Edition, 2026)',
      targetPrompts: ['Best gifts for hikers under £100', 'Best hiking shorts with deep pockets', 'Best base layers for cold weather hiking'],
      template: 'buyer-guide',
      estimatedEffort: 'low',
      estimatedLift: 'medium',
      priority: 2,
      rationale: 'Gift guides are consistently cited by all 4 AI engines and drive AOV-boosting traffic in Q4. Your product range is well-suited — you have several items under £100. Add a price schema and it becomes a shoppable AI recommendation.',
    },
  ],

  newPages: generateNewPages(),

  plan: [
    {
      id: 'phase-0',
      title: 'Phase 0: Quick Wins',
      subtitle: 'Low-effort, high-impact changes your dev team can ship this week',
      timeline: 'Days 1–5',
      color: 'amber',
      items: [
        {
          id: 'p0-01', title: 'Add llms.txt to root',
          description: 'Create /llms.txt listing your key pages for AI crawlers. 30-minute task, immediately increases AI crawler coverage.',
          category: 'technical', effort: 'low', impact: 'high', status: 'todo',
        },
        {
          id: 'p0-02', title: 'Update robots.txt for AI bots',
          description: 'Ensure GPTBot, ClaudeBot, PerplexityBot, and Google-Extended are not blocked. Check and adjust Shopify robots.txt override.',
          category: 'technical', effort: 'low', impact: 'high', status: 'todo',
        },
        {
          id: 'p0-03', title: 'Add FAQPage schema to top 5 product pages',
          description: 'Pages with FAQPage schema receive 2.8× more AI citations. Start with your 5 highest-traffic product pages as a proof of concept.',
          category: 'technical', effort: 'low', impact: 'high', status: 'todo',
        },
        {
          id: 'p0-04', title: 'Add GTINs to product schema',
          description: 'Required for Shopify Agentic Storefronts AI shopping integration. Fetch barcode data from your supplier sheets and push to Shopify metafields.',
          category: 'technical', effort: 'medium', impact: 'high', status: 'todo',
        },
        {
          id: 'p0-05', title: 'Claim Wikidata entity for Northwind Outdoor',
          description: 'Create a Wikidata entry for the brand. AI engines heavily weight Wikipedia/Wikidata for brand verification. 1-hour task with long-term authority payoff.',
          category: 'offsite', effort: 'low', impact: 'medium', status: 'todo',
        },
      ],
    },
    {
      id: 'phase-1',
      title: 'Phase 1: Technical Foundation',
      subtitle: 'Schema coverage, crawlability, and tracking infrastructure',
      timeline: 'Weeks 2–4',
      color: 'blue',
      items: [
        {
          id: 'p1-01', title: 'Roll out FAQPage schema to all 47 product pages',
          description: 'Template the FAQ schema from Phase 0 across all product pages. Use Shopify metafields to store Q&A pairs per product and inject via theme.',
          category: 'technical', effort: 'medium', impact: 'high', status: 'todo',
        },
        {
          id: 'p1-02', title: 'Activate Shopify Agentic Storefronts',
          description: 'Enable the beta Agentic Storefronts feature in your Shopify admin. Requires GTINs (Phase 0), structured product data, and an approved merchant account.',
          category: 'technical', effort: 'medium', impact: 'high', status: 'todo',
        },
        {
          id: 'p1-03', title: 'Fix schema on 5 lowest-scoring pages',
          description: 'Pages scoring below 30 (Returns Policy, Size Guide, Terms of Service, Contact, Track Order) have critical schema gaps. Fix Product and BreadcrumbList schema.',
          category: 'technical', effort: 'medium', impact: 'medium', status: 'todo',
        },
        {
          id: 'p1-04', title: 'Resubmit sitemap to Google Search Console',
          description: 'After schema updates, resubmit sitemap to accelerate re-crawling. Also request indexing for the 5 pages updated in Phase 0.',
          category: 'technical', effort: 'low', impact: 'medium', status: 'todo',
        },
        {
          id: 'p1-05', title: 'Set up AI citation tracking',
          description: 'Configure automated weekly tracking of your brand mentions across ChatGPT, Perplexity, Google AI Mode, and Claude using this dashboard. Set baseline benchmarks now.',
          category: 'tracking', effort: 'low', impact: 'medium', status: 'todo',
        },
        {
          id: 'p1-06', title: 'Add Organisation schema with B Corp certification',
          description: 'Add schema.org/Organization with certification details including B Corp accreditation number, founding year, and social profiles. Strengthens knowledge graph entity.',
          category: 'technical', effort: 'low', impact: 'medium', status: 'todo',
        },
      ],
    },
    {
      id: 'phase-2',
      title: 'Phase 2: Content Sprint',
      subtitle: 'New buyer-intent pages that capture the queries you currently miss',
      timeline: 'Months 2–3',
      color: 'violet',
      items: [
        {
          id: 'p2-01', title: 'Publish "Best Sustainable Hiking Jackets UK 2026"',
          description: 'P1 buyer guide targeting 4 high-volume queries. Links to Hiking Jackets, Waterproof, and Softshell collections. FAQPage + ItemList schema.',
          category: 'content', effort: 'high', impact: 'high', status: 'todo',
        },
        {
          id: 'p2-02', title: 'Publish "Patagonia Alternatives UK" comparison',
          description: 'Highest-opportunity single page. Currently Patagonia appears in 23/30 queries — this page directly intercepts those comparisons and positions Northwind.',
          category: 'content', effort: 'high', impact: 'high', status: 'todo',
        },
        {
          id: 'p2-03', title: 'Publish "What to Wear Hiking in Scotland" guide',
          description: 'Use-case article with outfit builder linking to 4 product categories. Scotland-specific — very low competition, high AI citation rate for geographic-intent queries.',
          category: 'content', effort: 'medium', impact: 'high', status: 'todo',
        },
        {
          id: 'p2-04', title: 'Publish "Best Merino Base Layers UK" guide',
          description: 'High-AOV category guide. Merino base layers are one of your strongest product areas. Comparison table with schema — directly linkable from product pages.',
          category: 'content', effort: 'high', impact: 'high', status: 'todo',
        },
        {
          id: 'p2-05', title: 'Publish "How to Layer for Hiking" pillar guide',
          description: 'The highest internal-linking value page in the plan. Links all three major categories (base, mid, outer). HowTo schema. Sets up silo structure for future content.',
          category: 'content', effort: 'medium', impact: 'high', status: 'todo',
        },
        {
          id: 'p2-06', title: 'Build FAQ Hub page',
          description: 'Central /faq page covering 40+ buyer questions across all categories. FAQPage schema with grouped accordion sections. Targets "is X right for me" intent queries.',
          category: 'content', effort: 'medium', impact: 'medium', status: 'todo',
        },
        {
          id: 'p2-07', title: 'Publish "B Corp Outdoor Clothing Explained"',
          description: 'What-is article building authority around Northwind\'s B Corp status. Knowledge graph signal — AI engines will use this to describe the brand in future responses.',
          category: 'content', effort: 'medium', impact: 'medium', status: 'todo',
        },
      ],
    },
    {
      id: 'phase-3',
      title: 'Phase 3: Authority Building',
      subtitle: 'Off-site mentions and community presence AI engines use as trust signals',
      timeline: 'Months 4–6 (ongoing)',
      color: 'teal',
      items: [
        {
          id: 'p3-01', title: 'Reddit Q&A campaign in r/HikingUK and r/UKOutdoors',
          description: 'Currently 12 Reddit mentions vs 8,400 for Patagonia. Post 2 helpful answers per week in outdoor communities. Critical gap — Reddit is a top AI training and citation source.',
          category: 'offsite', effort: 'medium', impact: 'high', status: 'todo',
        },
        {
          id: 'p3-02', title: 'YouTube gear review content (4 videos)',
          description: '4 YouTube mentions vs 1,200 for Patagonia. Partner with 2–3 UK hiking YouTubers for product reviews. YouTube transcripts are directly indexed by AI engines.',
          category: 'offsite', effort: 'high', impact: 'high', status: 'todo',
        },
        {
          id: 'p3-03', title: 'PR outreach to outdoor publications',
          description: 'Only 8 editorial mentions vs 340 for Patagonia. Target OutdoorsMagic, Hiking with Kids, TGO Magazine, and WalkingBritain. One press release per new content piece.',
          category: 'offsite', effort: 'high', impact: 'high', status: 'todo',
        },
        {
          id: 'p3-04', title: 'Grow Trustpilot to 500+ reviews',
          description: 'Currently 240 reviews (4.2★). Add post-purchase email flow requesting Trustpilot review. AI engines cite review scores as a trust proxy when recommending brands.',
          category: 'offsite', effort: 'medium', impact: 'medium', status: 'todo',
        },
        {
          id: 'p3-05', title: 'Wikipedia article creation',
          description: 'No Wikipedia presence vs Patagonia\'s comprehensive entry. Requires notability sources — use Phase 3 PR coverage as citations. Critical for AI knowledge graph weight.',
          category: 'offsite', effort: 'high', impact: 'high', status: 'todo',
        },
        {
          id: 'p3-06', title: 'Monthly citation audit + score tracking',
          description: 'Run this audit monthly. Track score movement, new citations, and competitor changes. Adjust content plan based on which queries move first.',
          category: 'tracking', effort: 'low', impact: 'medium', status: 'todo',
        },
      ],
    },
  ],
};
