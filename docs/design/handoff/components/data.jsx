// Mock genomic result data for GenomeWell
// Framed as "what the parsed SNP file produced"

const GW_ARCHETYPE = {
  name: 'Slow Methylator, Quick Responder',
  subtitle: 'Your body is efficient at detoxifying but works harder to convert folate and certain fats. Small, targeted nutrients move the needle quickly for you.',
  stats: [
    { k: 'SNPs analyzed', v: '637,294' },
    { k: 'Variants matched', v: '48' },
    { k: 'Essential picks', v: '4' },
    { k: 'Processed locally', v: '100%' },
  ],
};

const GW_TABS = [
  { id: 'daily', label: 'Daily Wellness', glyph: '◐' },
  { id: 'aging', label: 'Healthy Aging', glyph: '◔' },
  { id: 'body', label: 'Body Optimization', glyph: '◉' },
  { id: 'food', label: 'Food Sensitivity', glyph: '◑' },
];

// Supplement cards — mixed priorities, gaps, 1–3 partners per card.
// Partners are generic labels; we do not use real brand logos.
const GW_SUPPLEMENTS = {
  daily: [
    {
      name: 'Methylated Folate',
      tag: 'B-Vitamin',
      priority: 'essential',
      dose: '800 mcg daily, with food',
      snps: ['MTHFR C677T (TT)', 'MTRR A66G'],
      reason: 'Your MTHFR variant reduces your ability to convert folic acid into its active form. The methylated version skips that step — you\'ll feel this one first, usually in energy and mood within 2–3 weeks.',
      partners: ['Thorne', 'BioTrust', 'Organifi'],
    },
    {
      name: 'Vitamin D3 + K2',
      tag: 'Fat-Soluble',
      priority: 'essential',
      dose: '5,000 IU D3 · 100 mcg K2',
      snps: ['VDR FokI (ff)', 'GC rs2282679'],
      reason: 'Two variants in how you bind and transport vitamin D. Higher melanin slows cutaneous synthesis too — pair that with winter indoor hours and most folks in your profile sit well below optimal.',
      partners: ['Thorne', 'BioTrust'],
    },
    {
      name: 'Algal Omega-3 (EPA/DHA)',
      tag: 'Essential Fat',
      priority: 'recommended',
      dose: '1,000 mg combined EPA + DHA',
      snps: ['FADS1 rs174537'],
      reason: 'Your FADS1 variant cuts conversion of plant ALA to usable EPA/DHA roughly in half. Pre-formed marine or algal sources bypass the bottleneck entirely.',
      partners: ['Thorne', 'Organifi'],
    },
    {
      name: 'Magnesium Glycinate',
      tag: 'Mineral',
      priority: 'recommended',
      dose: '300–400 mg at night',
      snps: ['TRPM6 rs11144134'],
      reason: 'Lower intestinal magnesium absorption on your profile. Glycinate is the gentlest form and doubles as a mild nervous-system quieter before sleep.',
      partners: ['BioTrust', 'Organifi'],
    },
    {
      name: 'Zinc Picolinate',
      tag: 'Mineral',
      priority: 'optional',
      dose: '15 mg, alternate days',
      snps: ['SLC30A8 rs13266634'],
      reason: 'Mild variant in zinc transport. Most people get enough from diet — consider this only if you eat little red meat or shellfish.',
      partners: ['Thorne'],
    },
  ],
  aging: [
    {
      name: 'CoQ10 (Ubiquinol)',
      tag: 'Mitochondrial',
      priority: 'essential',
      dose: '100 mg with a fat-containing meal',
      snps: ['NQO1 rs1800566', 'COQ2 rs4693570'],
      reason: 'Two variants that slow your body\'s own CoQ10 regeneration. Ubiquinol is the reduced, ready-to-use form — preferable for your profile over plain CoQ10.',
      partners: ['Thorne', 'BioTrust'],
    },
    {
      name: 'NAC (N-Acetyl Cysteine)',
      tag: 'Antioxidant',
      priority: 'recommended',
      dose: '600 mg, twice daily',
      snps: ['GSTM1 (null)', 'GSTT1 (null)'],
      reason: 'You\'re missing both copies of two glutathione-S-transferase genes — common, and it means your baseline detox and antioxidant capacity is lower than average. NAC is the precursor.',
      partners: ['Thorne'],
    },
    {
      name: 'Resveratrol',
      tag: 'Polyphenol',
      priority: 'gap',
      dose: '—',
      snps: ['SIRT1 rs7895833'],
      reason: 'Your SIRT1 profile suggests a small but real benefit. None of our current partners carry a form we trust at a clean dose — we\'ll surface options when one does.',
      partners: [],
    },
  ],
  body: [
    {
      name: 'Creatine Monohydrate',
      tag: 'Performance',
      priority: 'essential',
      dose: '5 g daily, any time',
      snps: ['CKM rs4884'],
      reason: 'Your CKM variant means lower baseline phosphocreatine in muscle. Creatine is among the most-studied supplements on the market and it matters more for your profile than most.',
      partners: ['Thorne', 'BioTrust', 'Organifi'],
    },
    {
      name: 'Beta-Alanine',
      tag: 'Performance',
      priority: 'recommended',
      dose: '3.2 g split across the day',
      snps: ['CARNS1 rs10427199'],
      reason: 'Lower muscle carnosine buffering on your profile. Helpful for high-intensity intervals and repeat-effort work — less relevant if you mostly train long and steady.',
      partners: ['BioTrust'],
    },
    {
      name: 'Ashwagandha (KSM-66)',
      tag: 'Adaptogen',
      priority: 'optional',
      dose: '600 mg at night',
      snps: ['ADRB2 rs1042713'],
      reason: 'Mild cortisol-response variant. Optional — only consider if recovery or sleep is the bottleneck, and skip during pregnancy or thyroid medication.',
      partners: ['Organifi', 'Thorne'],
    },
  ],
  food: [
    {
      name: 'Lactase Enzyme',
      tag: 'Digestive',
      priority: 'recommended',
      dose: 'As needed before dairy',
      snps: ['MCM6 rs4988235 (CC)'],
      reason: 'You carry the ancestral lactase-non-persistent genotype — roughly 70% of adults globally, and the majority in your ancestry group. Enzyme support turns "avoid" into "occasional" for most people.',
      partners: ['BioTrust'],
    },
    {
      name: 'DAO (Diamine Oxidase)',
      tag: 'Enzyme',
      priority: 'optional',
      dose: '10,000 HDU before aged foods',
      snps: ['AOC1 rs10156191'],
      reason: 'Lower histamine-breakdown capacity. Worth trying only if aged cheese, wine, or cured meats consistently leave you flushed or stuffy.',
      partners: ['Thorne'],
    },
    {
      name: 'Berberine',
      tag: 'Metabolic',
      priority: 'gap',
      dose: '—',
      snps: ['TCF7L2 rs7903146'],
      reason: 'Your TCF7L2 variant nudges insulin response. Berberine has strong evidence but none of our partners carry a third-party-tested form we\'re willing to recommend yet.',
      partners: [],
    },
  ],
};

Object.assign(window, { GW_ARCHETYPE, GW_TABS, GW_SUPPLEMENTS });
