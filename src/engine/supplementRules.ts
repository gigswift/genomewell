import type {
  Genotype,
  SNPReference,
  SupplementRule,
} from '../types';

function snp(
  rsid: string,
  gene: string,
  role: 'primary' | 'supporting',
  effect: string,
  riskGenotypes: readonly string[],
): SNPReference {
  return { rsid, gene, role, effect, riskGenotypes };
}

function has(map: Map<string, Genotype>, rsid: string, alleles: readonly string[]): boolean {
  const g = map.get(rsid);
  return g !== undefined && alleles.includes(g);
}

// APOE E4 carrier = rs429358 has at least one C AND rs7412 is CC.
// Without phasing this is the accepted approximation (E4 = C at rs429358 on a chromosome
// where rs7412 is also C; requiring rs7412 CC excludes E2 dominance).
function isApoeE4Carrier(snpMap: Map<string, Genotype>): boolean {
  return (
    has(snpMap, 'rs429358', ['CT', 'TC', 'CC']) &&
    has(snpMap, 'rs7412', ['CC'])
  );
}

export const SUPPLEMENT_RULES: SupplementRule[] = [
  // ── DAILY WELLNESS ─────────────────────────────────────────────────────
  {
    supplement: {
      name: 'Methylfolate (L-5-MTHF)',
      category: 'daily-wellness',
      defaultDosage: '400–1000 mcg daily',
      partnerOptions: [{ partner: 'thorne', productSlug: '5-mthf' }],
    },
    evidenceTier: 'SNP-driven',
    primarySNPs: [
      snp('rs1801133', 'MTHFR', 'primary', 'MTHFR C677T — T allele reduces enzyme activity; methylated folate bypasses the blocked step', ['CT', 'TC', 'TT']),
      snp('rs1801131', 'MTHFR', 'primary', 'MTHFR A1298C — C allele reduces BH4 pathway function', ['AC', 'CA', 'CC']),
      snp('rs2236225', 'MTHFD1', 'primary', 'MTHFD1 G1958A — reduces folate pathway flux', ['AA', 'AG', 'GA']),
    ],
    supportingSNPs: [
      snp('rs1805087', 'MTR', 'supporting', 'B12-dependent methionine synthase — G allele slows methylation cycle', ['AG', 'GA', 'GG']),
      snp('rs1801394', 'MTRR', 'supporting', 'MTRR A66G — reduced B12 recycling', ['AG', 'GA', 'GG']),
      snp('rs4680', 'COMT', 'supporting', 'COMT slow metabolizer — methylation load interacts with dopamine clearance', ['AG', 'GA', 'AA']),
      snp('rs234706', 'CBS', 'supporting', 'CBS variant — downstream homocysteine transsulfuration', ['CT', 'TC', 'TT']),
      snp('rs3733890', 'BHMT', 'supporting', 'BHMT — alternate remethylation pathway', ['AA', 'AG', 'GA']),
      snp('rs601338', 'FUT2', 'supporting', 'FUT2 non-secretor — reduces B12 absorption, compounds folate demand', ['AA', 'AG', 'GA']),
    ],
  },
  {
    supplement: {
      name: 'Methyl-B12 (methylcobalamin)',
      category: 'daily-wellness',
      defaultDosage: '1000 mcg daily',
      partnerOptions: [{ partner: 'thorne', productSlug: 'methyl-b12' }],
    },
    evidenceTier: 'SNP-driven',
    primarySNPs: [
      snp('rs601338', 'FUT2', 'primary', 'FUT2 non-secretor — reduced gut B12 absorption via altered mucin glycosylation', ['AA', 'AG', 'GA']),
      snp('rs1805087', 'MTR', 'primary', 'MTR A2756G — reduced methionine synthase activity, higher B12 demand', ['AG', 'GA', 'GG']),
      snp('rs1801394', 'MTRR', 'primary', 'MTRR A66G — reduced recycling of oxidized B12', ['AG', 'GA', 'GG']),
    ],
    supportingSNPs: [
      snp('rs1801133', 'MTHFR', 'supporting', 'MTHFR C677T — B12 pairs with methylfolate for homocysteine control', ['CT', 'TC', 'TT']),
      snp('rs234706', 'CBS', 'supporting', 'CBS — homocysteine downstream handling', ['CT', 'TC', 'TT']),
      snp('rs1801198', 'TCN2', 'supporting', 'TCN2 C776G — altered transcobalamin II, reduced B12 delivery', ['CG', 'GC', 'GG']),
    ],
  },
  {
    supplement: {
      name: 'Vitamin D3 + K2',
      category: 'daily-wellness',
      defaultDosage: '2000 IU D3 + 100 mcg MK-7 daily, with fat',
      partnerOptions: [{ partner: 'thorne', productSlug: 'd3-k2' }],
    },
    evidenceTier: 'SNP-driven',
    primarySNPs: [
      snp('rs1544410', 'VDR', 'primary', 'VDR BsmI — receptor efficiency; minor allele reduces cellular vitamin D utilization', ['AA', 'AG', 'GA']),
      snp('rs2282679', 'GC', 'primary', 'GC binding protein — minor allele reduces circulating 25(OH)D; effect amplified in African ancestry', ['AC', 'CA', 'AA']),
      snp('rs10741657', 'CYP2R1', 'primary', '25-hydroxylase — variants reduce hepatic conversion of D3 to 25(OH)D', ['AG', 'GA', 'AA']),
    ],
    supportingSNPs: [
      snp('rs12785878', 'DHCR7', 'supporting', 'DHCR7 — affects cutaneous D3 synthesis; reinforces supplementation case', ['GT', 'TG', 'TT']),
      snp('rs4988235', 'LCT', 'supporting', 'Lactase non-persistence — reduced dairy/calcium intake, K2 pairing more relevant', ['AG', 'GA', 'GG']),
      snp('rs1800795', 'IL6', 'supporting', 'Pro-inflammatory IL6 genotype — vitamin D immunomodulation becomes higher-value', ['CG', 'GC', 'CC']),
      snp('rs7903146', 'TCF7L2', 'supporting', 'TCF7L2 T2D risk — vitamin D insulin-sensitivity contribution matters more', ['CT', 'TC', 'TT']),
    ],
    doseModulator: (snpMap, defaultDosage) => {
      // GC minor allele (African-ancestry context) → bump D3 dose.
      if (has(snpMap, 'rs2282679', ['AC', 'CA', 'AA'])) {
        return '5000 IU D3 + 100 mcg MK-7 daily, with fat';
      }
      return defaultDosage;
    },
  },
  {
    supplement: {
      name: 'Omega-3 (EPA/DHA, marine)',
      category: 'daily-wellness',
      defaultDosage: '2 g combined EPA/DHA daily, with food',
      partnerOptions: [{ partner: 'thorne', productSlug: 'omega-3' }],
    },
    evidenceTier: 'SNP-driven',
    primarySNPs: [
      snp('rs174537', 'FADS1', 'primary', 'FADS1 — ALA→EPA conversion; minor allele = poor converter, plant omega-3 insufficient', ['GT', 'TG', 'TT']),
      snp('rs1535', 'FADS2', 'primary', 'FADS2 — same desaturase pathway, reinforces FADS1 signal', ['AG', 'GA', 'GG']),
      snp('rs953413', 'ELOVL2', 'primary', 'ELOVL2 — EPA→DHA elongation step', ['AG', 'GA', 'GG']),
    ],
    supportingSNPs: [
      snp('rs429358', 'APOE', 'supporting', 'APOE E4 carriers benefit more (neuro + lipid) — increases priority', ['CT', 'TC', 'CC']),
      snp('rs7412', 'APOE', 'supporting', 'APOE E4 haplotype context', ['CC']),
      snp('rs7903146', 'TCF7L2', 'supporting', 'T2D risk — omega-3 improves insulin sensitivity', ['CT', 'TC', 'TT']),
      snp('rs1801282', 'PPARG', 'supporting', 'PPARG — insulin sensitivity context', ['CG', 'GC', 'GG']),
      snp('rs1800795', 'IL6', 'supporting', 'Pro-inflammatory IL6 genotype — omega-3 anti-inflammatory value rises', ['CG', 'GC', 'CC']),
      snp('rs1800629', 'TNF', 'supporting', 'TNFA pro-inflammatory — omega-3 cytokine modulation', ['AG', 'GA', 'AA']),
      snp('rs17238540', 'HMGCR', 'supporting', 'HMGCR — omega-3 triglyceride-lowering effect', ['CT', 'TC', 'TT']),
      snp('rs708272', 'CETP', 'supporting', 'CETP — HDL metabolism context', ['AG', 'GA', 'GG']),
      snp('rs1042713', 'ADRB2', 'supporting', 'ADRB2 — reduced fat oxidation; omega-3 supports fat metabolism', ['AG', 'GA', 'GG']),
      snp('rs8192678', 'PPARGC1A', 'supporting', 'PPARGC1A — mitochondrial biogenesis; omega-3 supports membranes', ['AG', 'GA', 'AA']),
    ],
  },
  {
    supplement: {
      name: 'NAC (N-acetyl cysteine)',
      category: 'daily-wellness',
      defaultDosage: '600 mg twice daily',
      partnerOptions: [{ partner: 'thorne', productSlug: 'nac' }],
    },
    evidenceTier: 'SNP-driven',
    primarySNPs: [
      snp('rs1695', 'GSTP1', 'primary', 'GSTP1 I105V — Val allele reduces glutathione-S-transferase activity', ['AG', 'GA', 'GG']),
    ],
    supportingSNPs: [
      snp('rs4880', 'SOD2', 'supporting', 'SOD2 — mitochondrial superoxide dismutase; supports redox balance NAC feeds into', ['CC', 'CT', 'TC']),
      snp('rs1050450', 'GPX1', 'supporting', 'GPX1 — glutathione peroxidase capacity', ['CT', 'TC', 'TT']),
      snp('rs1799930', 'NAT2', 'supporting', 'NAT2 slow acetylator — detox burden on glutathione pathway rises', ['AA', 'AG', 'GA']),
    ],
  },
  {
    supplement: {
      name: 'Berberine',
      category: 'daily-wellness',
      defaultDosage: '500 mg 2–3× daily with meals',
      partnerOptions: [{ partner: 'thorne', productSlug: 'berberine' }],
    },
    evidenceTier: 'SNP-driven',
    primarySNPs: [
      snp('rs7903146', 'TCF7L2', 'primary', 'TCF7L2 — strongest genetic T2D risk factor; berberine activates AMPK', ['CT', 'TC', 'TT']),
      snp('rs1801282', 'PPARG', 'primary', 'PPARG P12A — insulin sensitivity regulation', ['CG', 'GC', 'GG']),
    ],
    supportingSNPs: [
      snp('rs9939609', 'FTO', 'supporting', 'FTO — obesity risk; metabolic syndrome context', ['AA', 'AT', 'TA']),
      snp('rs1801278', 'IRS1', 'supporting', 'IRS1 G972R — insulin receptor signaling', ['AA', 'AG', 'GA']),
      snp('rs5400', 'SLC2A2', 'supporting', 'SLC2A2 — glucose transport in pancreas/liver', ['CT', 'TC', 'TT']),
    ],
  },
  {
    supplement: {
      name: 'Magnesium (glycinate)',
      category: 'daily-wellness',
      defaultDosage: '200–400 mg elemental daily',
      partnerOptions: [{ partner: 'thorne', productSlug: 'magnesium-bisglycinate' }],
    },
    evidenceTier: 'SNP-informed',
    primarySNPs: [
      snp('rs11144134', 'TRPM6', 'primary', 'TRPM6 — magnesium transporter variant affects intestinal Mg uptake', ['AC', 'CA', 'CC']),
    ],
    supportingSNPs: [
      snp('rs4680', 'COMT', 'supporting', 'COMT — Mg is a cofactor; slow metabolizers benefit from Mg support', ['AG', 'GA', 'AA']),
      snp('rs1801133', 'MTHFR', 'supporting', 'MTHFR — Mg cofactor for enzyme function', ['CT', 'TC', 'TT']),
      snp('rs1544410', 'VDR', 'supporting', 'VDR — Mg required for vitamin D receptor binding', ['AA', 'AG', 'GA']),
    ],
  },
  {
    supplement: {
      name: 'Sulforaphane (broccoli sprout)',
      category: 'daily-wellness',
      defaultDosage: '10–30 mg SGS daily',
      partnerOptions: [{ partner: 'thorne', productSlug: 'tbd' }],
    },
    evidenceTier: 'SNP-informed',
    primarySNPs: [
      snp('rs1695', 'GSTP1', 'primary', 'GSTP1 — phase II detox capacity; sulforaphane upregulates GST family', ['AG', 'GA', 'GG']),
    ],
    supportingSNPs: [
      snp('rs6721961', 'NFE2L2', 'supporting', 'NFE2L2 (NRF2) — sulforaphane activates NRF2 antioxidant response', ['AA', 'AC', 'CA']),
    ],
  },

  // ── HEALTHY AGING ──────────────────────────────────────────────────────
  {
    supplement: {
      name: 'CoQ10 (ubiquinol)',
      category: 'healthy-aging',
      defaultDosage: '100–200 mg ubiquinol daily with fat',
      partnerOptions: [{ partner: 'thorne', productSlug: 'coq10' }],
    },
    evidenceTier: 'SNP-driven',
    primarySNPs: [
      snp('rs1800566', 'NQO1', 'primary', 'NQO1 P187S — reduced ubiquinone recycling capacity', ['CT', 'TC', 'TT']),
      snp('rs4880', 'SOD2', 'primary', 'SOD2 — mitochondrial oxidative stress defense', ['CC', 'CT', 'TC']),
    ],
    supportingSNPs: [
      snp('rs17238540', 'HMGCR', 'supporting', 'HMGCR — statin pathway; CoQ10 depletion context', ['CT', 'TC', 'TT']),
      snp('rs4693570', 'COQ2', 'supporting', 'COQ2 — CoQ10 biosynthesis pathway', ['AG', 'GA', 'AA']),
      snp('rs8192678', 'PPARGC1A', 'supporting', 'PPARGC1A — mitochondrial biogenesis', ['AG', 'GA', 'AA']),
    ],
  },
  {
    supplement: {
      name: 'Phosphatidylserine (PS)',
      category: 'healthy-aging',
      defaultDosage: '100 mg 3× daily (E4 carriers)',
      partnerOptions: [{ partner: 'thorne', productSlug: 'tbd' }],
    },
    evidenceTier: 'SNP-driven',
    primarySNPs: [
      snp('rs429358', 'APOE', 'primary', 'APOE E4 marker — E4 carriers show cognitive-protective response to PS', ['CT', 'TC', 'CC']),
      snp('rs7412', 'APOE', 'primary', 'APOE E4 haplotype requires rs7412 CC (excludes E2 allele)', ['CC']),
    ],
    supportingSNPs: [
      snp('rs6265', 'BDNF', 'supporting', 'BDNF Val66Met — reduced neuroplasticity, PS supports membrane integrity', ['AG', 'GA', 'AA']),
      snp('rs1800795', 'IL6', 'supporting', 'IL6 — neuroinflammation context', ['CG', 'GC', 'CC']),
    ],
    customGate: isApoeE4Carrier,
  },
  {
    supplement: {
      name: 'NMN / NR (NAD⁺ precursor)',
      category: 'healthy-aging',
      defaultDosage: '300 mg NR or 500 mg NMN daily',
      partnerOptions: [{ partner: 'thorne', productSlug: 'tbd' }],
    },
    evidenceTier: 'SNP-informed',
    primarySNPs: [
      snp('rs1800566', 'NQO1', 'primary', 'NQO1 — NAD(P)H:quinone oxidoreductase; redox balance depends on NAD+ pool', ['CT', 'TC', 'TT']),
    ],
    supportingSNPs: [
      snp('rs4880', 'SOD2', 'supporting', 'SOD2 — mitochondrial oxidative stress', ['CC', 'CT', 'TC']),
      snp('rs2802292', 'FOXO3', 'supporting', 'FOXO3 longevity allele — G carriers benefit more from NAD+ precursors', ['TG', 'GT', 'GG']),
      snp('rs3758391', 'SIRT1', 'supporting', 'SIRT1 — NAD+-dependent deacetylase', ['CT', 'TC', 'TT']),
    ],
  },

  // ── BODY OPTIMIZATION ──────────────────────────────────────────────────
  {
    supplement: {
      name: 'Creatine monohydrate',
      category: 'body-optimization',
      defaultDosage: '3–5 g daily',
      partnerOptions: [{ partner: 'thorne', productSlug: 'creatine' }],
    },
    evidenceTier: 'SNP-driven',
    primarySNPs: [
      snp('rs1815739', 'ACTN3', 'primary', 'ACTN3 R577X — XX (TT) genotype lacks alpha-actinin-3, benefits most from creatine', ['CT', 'TC', 'TT']),
    ],
    supportingSNPs: [
      snp('rs4343', 'ACE', 'supporting', 'ACE — I/D polymorphism; power/endurance context', ['AG', 'GA', 'GG']),
      snp('rs8192678', 'PPARGC1A', 'supporting', 'PPARGC1A — mitochondrial biogenesis, training response', ['AG', 'GA', 'AA']),
    ],
  },
  {
    supplement: {
      name: 'L-carnitine (tartrate)',
      category: 'body-optimization',
      defaultDosage: '1–2 g daily',
      partnerOptions: [{ partner: 'thorne', productSlug: 'tbd' }],
    },
    evidenceTier: 'SNP-driven',
    primarySNPs: [
      snp('rs1042713', 'ADRB2', 'primary', 'ADRB2 R16G — Gly allele reduces β2-adrenergic fat oxidation', ['AG', 'GA', 'GG']),
    ],
    supportingSNPs: [
      snp('rs8192678', 'PPARGC1A', 'supporting', 'PPARGC1A — mitochondrial fat oxidation capacity', ['AG', 'GA', 'AA']),
      snp('rs4343', 'ACE', 'supporting', 'ACE — exercise response context', ['AG', 'GA', 'GG']),
      snp('rs762551', 'CYP1A2', 'supporting', 'CYP1A2 slow metabolizer — caffeine/exercise timing context', ['AC', 'CA', 'CC']),
    ],
  },
  {
    supplement: {
      name: 'PQQ',
      category: 'body-optimization',
      defaultDosage: '10–20 mg daily',
      partnerOptions: [{ partner: 'thorne', productSlug: 'tbd' }],
    },
    evidenceTier: 'SNP-informed',
    primarySNPs: [
      snp('rs8192678', 'PPARGC1A', 'primary', 'PPARGC1A G482S — reduced mitochondrial biogenesis; PQQ stimulates PGC-1α', ['AG', 'GA', 'AA']),
    ],
    supportingSNPs: [
      snp('rs4880', 'SOD2', 'supporting', 'SOD2 — mitochondrial ROS handling', ['CC', 'CT', 'TC']),
    ],
  },

  // ── FOOD SENSITIVITY ───────────────────────────────────────────────────
  {
    supplement: {
      name: 'Lactase enzyme',
      category: 'food-sensitivity',
      defaultDosage: '3000–9000 FCC units with dairy meals',
      partnerOptions: [{ partner: 'thorne', productSlug: 'tbd' }],
    },
    evidenceTier: 'SNP-driven',
    primarySNPs: [
      snp('rs4988235', 'LCT', 'primary', 'LCT −13910 — GG genotype = non-persistence (lactose intolerance)', ['AG', 'GA', 'GG']),
    ],
    supportingSNPs: [],
  },
  {
    supplement: {
      name: 'Non-dairy calcium (citrate)',
      category: 'food-sensitivity',
      defaultDosage: '500–1000 mg daily',
      partnerOptions: [{ partner: 'thorne', productSlug: 'tbd' }],
    },
    evidenceTier: 'SNP-driven',
    primarySNPs: [
      snp('rs4988235', 'LCT', 'primary', 'LCT non-persistence reduces dairy intake → calcium gap from non-dairy sources', ['AG', 'GA', 'GG']),
    ],
    supportingSNPs: [
      snp('rs1544410', 'VDR', 'supporting', 'VDR — calcium absorption efficiency depends on vitamin D receptor function', ['AA', 'AG', 'GA']),
      snp('rs2282679', 'GC', 'supporting', 'GC — vitamin D binding affects calcium handling', ['AC', 'CA', 'AA']),
    ],
  },
  {
    supplement: {
      name: 'DAO enzyme (histamine intolerance)',
      category: 'food-sensitivity',
      defaultDosage: '10,000 HDU before histamine-rich meals',
      partnerOptions: [],
    },
    evidenceTier: 'SNP-driven',
    primarySNPs: [
      snp('rs10156191', 'AOC1', 'primary', 'AOC1 — diamine oxidase activity; T allele reduces DAO', ['CT', 'TC', 'TT']),
      snp('rs1049742', 'AOC1', 'primary', 'AOC1 — second DAO-reducing variant', ['CT', 'TC', 'TT']),
    ],
    supportingSNPs: [
      snp('rs1800629', 'TNF', 'supporting', 'TNFA pro-inflammatory — histamine load compounds inflammation signal', ['AG', 'GA', 'AA']),
    ],
  },
  {
    supplement: {
      name: 'Iron — SKIP if HFE carrier',
      category: 'food-sensitivity',
      defaultDosage: 'Skip iron supplementation',
      partnerOptions: [],
    },
    evidenceTier: 'SNP-driven',
    avoidanceRule: true,
    primarySNPs: [
      snp('rs1799945', 'HFE', 'primary', 'HFE H63D — hemochromatosis risk; iron overload threat, avoid supplementation', ['CG', 'GC', 'GG']),
      snp('rs1800562', 'HFE', 'primary', 'HFE C282Y — strongest hemochromatosis allele; iron supplementation contraindicated', ['AG', 'GA', 'AA']),
    ],
    supportingSNPs: [],
  },
];

// Union of every rsid referenced (primary OR supporting) by any rule.
// Used by the parser to know which genotypes the engine actually consumes.
export const ENGINE_RSIDS: ReadonlySet<string> = new Set(
  SUPPLEMENT_RULES.flatMap((rule) => [
    ...rule.primarySNPs.map((s) => s.rsid),
    ...rule.supportingSNPs.map((s) => s.rsid),
  ]),
);
