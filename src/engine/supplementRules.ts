import type {
  Genotype,
  PrimarySNPReference,
  SNPReference,
  SupplementRule,
} from '../types';

function snp(
  rsid: string,
  gene: string,
  role: 'primary' | 'supporting',
  description: string,
  riskGenotypes: readonly string[],
): SNPReference {
  return { rsid, gene, role, description, riskGenotypes };
}

function primarySnp(
  rsid: string,
  gene: string,
  description: string,
  riskGenotypes: readonly string[],
  variantLabel: string,
  citationUrl: string,
  referenceGenotype: string,
  referenceGenotypeAlt?: string,
): PrimarySNPReference {
  const ref: PrimarySNPReference = {
    rsid,
    gene,
    role: 'primary',
    description,
    riskGenotypes,
    variantLabel,
    citationUrl,
    referenceGenotype,
  };
  if (referenceGenotypeAlt !== undefined) {
    ref.referenceGenotypeAlt = referenceGenotypeAlt;
  }
  return ref;
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
      brandOptions: [
        {
          brand: 'source-naturals',
          productSlug: 'megafolinic-122730',
          productName: 'MegaFolinic 240 Tabs',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.384699482638307641188910&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fmegafolinic-122730%3fvariant%3d32870624198756',
          priceDisplay: '$23.79',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/122730.jpg?v=1776085833',
        },
        {
          brand: 'solgar',
          productSlug: 'folate-as-metafolin-4',
          productName: 'Folate (as Metafolin) 120 Tabs',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.3846911988342757771882316&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2ffolate-as-metafolin-4%3fvariant%3d32870275055716',
          priceDisplay: '$24.74',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/114854.jpg?v=1776084302',
        },
        {
          brand: 'now-foods',
          productSlug: 'methyl-folate-90-tabs',
          productName: 'Methyl Folate 90 Tabs',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.384698514964822525085834&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fmethyl-folate-90-tabs%3fvariant%3d32871196721252',
          priceDisplay: '$13.73',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/141182.jpg?v=1776088464',
        },
        {
          brand: 'life-extension',
          productSlug: 'high-potency-optimized-folate-30-tabs',
          productName: 'High Potency Optimized Folate 30 Vegetarian Tablets',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.3846911470080314615522667&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fhigh-potency-optimized-folate-30-tabs%3fvariant%3d32874536042596',
          priceDisplay: '$13.50',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/94398_b78f940a-c07f-419c-9a2c-ca5fa16834e1.jpg?v=1776081029',
        },
      ],
      healthEffect: "When methylation runs slow, it usually shows up as mood dips you can't pin to anything, stress that lingers longer than the trigger, and a foggy kind of tired that coffee doesn't fix.",
    },
    evidenceTier: 'SNP-driven',
    primarySNPs: [
      primarySnp(
        'rs1801133',
        'MTHFR',
        'One slower copy of the folate-converting variant — your body uses folate at about two-thirds the usual pace, so taking the already-active form (methylfolate) skips the slow step.',
        ['CT', 'TC'],
        'MTHFR C677T (CT)',
        'https://www.pharmgkb.org/clinicalAnnotation/1450814430',
        'CC',
      ),
      primarySnp(
        'rs1801133',
        'MTHFR',
        'Two slower copies of the folate-converting variant — your body uses folate at about a third of the usual pace, the strongest signal in this lane. Methylfolate gives you the form your body is slow to make on its own.',
        ['TT'],
        'MTHFR C677T (TT)',
        'https://www.pharmgkb.org/clinicalAnnotation/1450814430',
        'CC',
      ),
      primarySnp(
        'rs1801131',
        'MTHFR',
        'One copy of a regulatory MTHFR variant — modestly reduced ability to process folate, so the pre-active form (methylfolate) makes the conversion easier. If you also carry the main MTHFR (C677T) variant, the two stack and the combined effect is bigger than either alone.',
        ['AC', 'CA'],
        'MTHFR A1298C (AC)',
        'https://www.pharmgkb.org/clinicalAnnotation/1450814424',
        'AA',
      ),
      primarySnp(
        'rs1801131',
        'MTHFR',
        'Two copies of a regulatory MTHFR variant — fuller drop in your ability to process folate, and methylfolate is the form your body can use directly without the slow step. If you also carry the main MTHFR (C677T) variant, the two stack and the combined effect is meaningfully larger.',
        ['CC'],
        'MTHFR A1298C (CC)',
        'https://www.pharmgkb.org/clinicalAnnotation/1450814424',
        'AA',
      ),
      primarySnp(
        'rs2236225',
        'MTHFD1',
        'One copy of a variant that makes the upstream folate-handling protein (MTHFD1) less stable — a small extra drag on the system that uses folate.',
        ['AG', 'GA'],
        'MTHFD1 G1958A (AG)',
        'https://www.snpedia.com/index.php/Rs2236225',
        'GG',
      ),
      primarySnp(
        'rs2236225',
        'MTHFD1',
        'Two copies of a variant that makes the upstream folate-handling protein (MTHFD1) less stable — a bigger drag on the system, which is why the pre-converted form (methylfolate) is the cleaner fit.',
        ['AA'],
        'MTHFD1 G1958A (AA)',
        'https://www.snpedia.com/index.php/Rs2236225',
        'GG',
      ),
    ],
    supportingSNPs: [
      snp('rs1805087', 'MTR', 'supporting', 'B12-dependent methionine synthase — G allele slows methylation cycle', ['AG', 'GA', 'GG']),
      snp('rs1801394', 'MTRR', 'supporting', 'MTRR A66G — reduced B12 recycling', ['AG', 'GA', 'GG']),
      snp('rs4680', 'COMT', 'supporting', 'COMT slow metabolizer — methylation load interacts with dopamine clearance', ['AG', 'GA', 'AA']),
      snp('rs234706', 'CBS', 'supporting', 'CBS variant — downstream homocysteine transsulfuration', ['CT', 'TC', 'TT']),
      snp('rs3733890', 'BHMT', 'supporting', 'BHMT — alternate remethylation pathway', ['AA', 'AG', 'GA']),
      snp('rs601338', 'FUT2', 'supporting', 'FUT2 non-secretor — reduces B12 absorption, compounds folate demand', ['AA']),
    ],
  },
  {
    supplement: {
      name: 'Methyl-B12 (methylcobalamin)',
      category: 'daily-wellness',
      defaultDosage: '1000 mcg daily',
      brandOptions: [
        {
          brand: 'now-foods',
          productSlug: 'methyl-b-12-100-loz',
          productName: 'Methyl B-12 100 Lozenges',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.384699765850544962546401&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fmethyl-b-12-100-loz%3fvariant%3d32874745102436',
          priceDisplay: '$8.12',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/67750.jpg?v=1776074998',
        },
        {
          brand: 'solaray',
          productSlug: 'methyl-b-12-123350',
          productName: 'Methyl B-12 Mango Peach 60 Lozenges',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.3846916896646670286793741&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fmethyl-b-12-123350%3fvariant%3d32875376050276',
          priceDisplay: '$18.79',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/123350.jpg?v=1776086206',
        },
        {
          brand: 'jarrow-formulas',
          productSlug: 'methyl-b-12-106747',
          productName: 'Methyl B-12 100 loz',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.384691399086501139983112&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fmethyl-b-12-106747%3fvariant%3d32870108233828',
          priceDisplay: '$6.99',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/106747.jpg?v=1776083216',
        },
      ],
      healthEffect: 'Low-functioning B12 tends to read as a slow mental engine — harder to find the right word mid-sentence, heavier fatigue by late afternoon, and over time, occasional numbness or tingling in the hands and feet.',
    },
    evidenceTier: 'SNP-driven',
    primarySNPs: [
      primarySnp(
        'rs601338',
        'FUT2',
        'Non-secretor — your gut lining handles B12 differently and burns through stored B12 faster than usual, so a daily dose of the active form (methylcobalamin) keeps levels steady. (This one only fires when both copies match — one copy isn\'t enough.)',
        ['AA'],
        'FUT2 W143X (AA)',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC2673801/',
        'GG',
      ),
      primarySnp(
        'rs1805087',
        'MTR',
        'One copy of a faster-burning B12 variant — your body uses B12 a bit quicker than typical at the step that recycles homocysteine.',
        ['AG', 'GA'],
        'MTR A2756G (AG)',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC3990204/',
        'AA',
      ),
      primarySnp(
        'rs1805087',
        'MTR',
        'Two copies of a faster-burning B12 variant — your body uses B12 noticeably quicker, so daily methylcobalamin keeps the supply ahead of the demand.',
        ['GG'],
        'MTR A2756G (GG)',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC3990204/',
        'AA',
      ),
      primarySnp(
        'rs1801394',
        'MTRR',
        'One copy of a variant that slows down B12 recycling — your body refreshes used-up B12 a bit slower than typical.',
        ['AG', 'GA'],
        'MTRR A66G (AG)',
        'https://pubmed.ncbi.nlm.nih.gov/24261678/',
        'AA',
      ),
      primarySnp(
        'rs1801394',
        'MTRR',
        'Two copies of a variant that slows down B12 recycling — your reserves drain faster, so a steady daily dose takes the pressure off the recycling system.',
        ['GG'],
        'MTRR A66G (GG)',
        'https://pubmed.ncbi.nlm.nih.gov/24261678/',
        'AA',
      ),
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
      brandOptions: [
        {
          brand: 'solaray',
          productSlug: 'vitamin-d-3-k-2-2',
          productName: 'Vitamin D-3 & K-2 120 Veg Caps',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.3846913754764127153354784&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fvitamin-d-3-k-2-2%3fvariant%3d32871927906404',
          priceDisplay: '$29.59',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/148694.jpg?v=1776089799',
        },
        {
          brand: 'now-foods',
          productSlug: 'vitamin-d-3-k-2',
          productName: 'Vitamin D-3 & K-2 120 Veg Caps',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.3846910294489845128780682&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fvitamin-d-3-k-2%3fvariant%3d32874907172964',
          priceDisplay: '$9.37',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/75313.jpg?v=1776078037',
        },
        {
          brand: 'source-naturals',
          productSlug: 'vitamin-k2-70103',
          productName: 'Vitamin K2 60 Tabs',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.384693075983187859406101&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fvitamin-k2-70103%3fvariant%3d32874808377444',
          priceDisplay: '$13.48',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/70103.jpg?v=1776077190',
        },
      ],
      healthEffect: 'Running low often feels like low-grade immune sluggishness, colds that keep circling back, aches that don\'t tie to a workout, and the flatter mood that creeps in through winter.',
      culturalContext: 'Most people with more melanin run below optimal vitamin D year-round, not just in winter — and the GC variant many in this audience carry stacks on top of that, so standard-dose recommendations usually undershoot.',
    },
    evidenceTier: 'SNP-driven',
    primarySNPs: [
      // VDR BsmI rs1544410 is biallelic A/G on dbSNP forward; some chip exports report the
      // reverse-complement T/C. Trigger covers both strand orientations; reference is picked
      // dynamically by the adapter to match the user's reported strand.
      primarySnp(
        'rs1544410',
        'VDR',
        "One copy of a less-stable vitamin D receptor variant (BsmI) — your body's vitamin D signal runs a bit weaker than typical.",
        ['AG', 'GA', 'TC', 'CT'],
        'VDR BsmI (het)',
        'https://pubmed.ncbi.nlm.nih.gov/23134477/',
        'GG',
        'CC',
      ),
      primarySnp(
        'rs1544410',
        'VDR',
        'Two copies of a less-stable vitamin D receptor variant (BsmI) — your body needs higher blood levels of vitamin D to get the same effect, which usually means a higher daily dose.',
        ['AA', 'TT'],
        'VDR BsmI (hom)',
        'https://pubmed.ncbi.nlm.nih.gov/23134477/',
        'GG',
        'CC',
      ),
      primarySnp(
        'rs2282679',
        'GC',
        'One copy of a variant that lowers how much vitamin D travels in your blood — standard daily doses tend to under-deliver. This often runs more pronounced with African ancestry, though admixture varies person to person.',
        ['AC', 'CA'],
        'GC DBP (AC)',
        'https://pubmed.ncbi.nlm.nih.gov/30661702/',
        'CC',
      ),
      primarySnp(
        'rs2282679',
        'GC',
        'Two copies of a variant that lowers how much vitamin D travels in your blood — the strongest reduction this gene produces. Often runs more pronounced with African ancestry, though admixture varies person to person.',
        ['AA'],
        'GC DBP (AA)',
        'https://pubmed.ncbi.nlm.nih.gov/30661702/',
        'CC',
      ),
      primarySnp(
        'rs10741657',
        'CYP2R1',
        'One copy of a less-efficient vitamin D activator variant (CYP2R1) — your liver turns D3 into the active form modestly less efficiently than typical.',
        ['AG', 'GA'],
        'CYP2R1 rs10741657 (AG)',
        'https://pubmed.ncbi.nlm.nih.gov/30120973/',
        'GG',
      ),
      primarySnp(
        'rs10741657',
        'CYP2R1',
        "Two copies of a less-efficient vitamin D activator variant (CYP2R1) — your liver is the least efficient at turning D3 into the active form, so standard daily doses don't move blood levels as much.",
        ['AA'],
        'CYP2R1 rs10741657 (AA)',
        'https://pubmed.ncbi.nlm.nih.gov/30120973/',
        'GG',
      ),
    ],
    supportingSNPs: [
      snp('rs12785878', 'DHCR7', 'supporting', 'DHCR7 — affects cutaneous D3 synthesis; reinforces supplementation case', ['GT', 'TG', 'TT']),
      snp('rs4988235', 'LCT', 'supporting', 'Lactase non-persistence — reduced dairy/calcium intake, K2 pairing more relevant', ['GG']),
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
      brandOptions: [
        {
          brand: 'solaray',
          productSlug: 'dha-124322',
          productName: 'DHA 60 Softgels',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.3846910944973196629691900&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fdha-124322%3fvariant%3d32870691668068',
          priceDisplay: '$29.69',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/124322.jpg?v=1776086836',
        },
        {
          brand: 'now-foods',
          productSlug: 'dha1000-brain-support-200220',
          productName: 'DHA-1000 Brain Support Extra Strength 90 Softgels',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.3846910321173222708316287&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fdha1000-brain-support-200220%3fvariant%3d41528843501668',
          priceDisplay: '$31.23',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/200220.jpg?v=1776109096',
        },
      ],
      healthEffect: 'Slow conversion tends to show up as joint stiffness, sluggish post-workout recovery, drier skin, and the kind of mid-afternoon mental fog that sneaks up on you.',
    },
    evidenceTier: 'SNP-driven',
    primarySNPs: [
      primarySnp(
        'rs174537',
        'FADS1',
        'One copy of a less-efficient fat-conversion variant (FADS1) — your body converts roughly 30% less plant-based omega-3 (ALA) into the active form (EPA) than typical, not just more slowly but less in total.',
        ['GT', 'TG'],
        'FADS1 rs174537 (GT)',
        'https://www.mdpi.com/2072-6643/9/3/240',
        'GG',
      ),
      primarySnp(
        'rs174537',
        'FADS1',
        'Two copies of a less-efficient fat-conversion variant (FADS1) — your body turns about half as much plant omega-3 (ALA) into EPA as typical, again not just slower but less overall, which is why fish-sourced EPA/DHA is the practical fix.',
        ['TT'],
        'FADS1 rs174537 (TT)',
        'https://www.mdpi.com/2072-6643/9/3/240',
        'GG',
      ),
      primarySnp(
        'rs1535',
        'FADS2',
        'One copy of a less-efficient variant at the upstream omega-3 step (FADS2) — your body builds modestly less long-chain omega-3 from plant sources than typical.',
        ['AG', 'GA'],
        'FADS2 rs1535 (AG)',
        'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0222061',
        'AA',
      ),
      primarySnp(
        'rs1535',
        'FADS2',
        'Two copies of a less-efficient variant at the upstream omega-3 step (FADS2) — your body builds noticeably less long-chain omega-3 from plant sources, so EPA/DHA you take directly works best.',
        ['GG'],
        'FADS2 rs1535 (GG)',
        'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0222061',
        'AA',
      ),
      // ELOVL2 rs953413 strand convention (verified 2026-04-29 via WebSearch):
      // dbSNP forward strand alleles are G/A. G is the major/reference allele; A is the
      // minor allele. Per Pan et al. 2019 (iScience PMC7033636), the G allele has higher
      // FOXA1/HNF4α-mediated enhancer activity → higher ELOVL2 expression → more EPA→DHA
      // elongation. Minor (A) allele carriers have higher EPA, lower DHA, and benefit
      // *more* from direct fish-oil supplementation. Trigger fires on A carriers.
      primarySnp(
        'rs953413',
        'ELOVL2',
        'One copy of a less-efficient omega-3 finishing variant (ELOVL2) — your body builds modestly less DHA from EPA, so direct EPA/DHA supplementation makes up the difference.',
        ['AG', 'GA'],
        'ELOVL2 rs953413 (AG)',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC7033636/',
        'GG',
      ),
      primarySnp(
        'rs953413',
        'ELOVL2',
        'Two copies of a less-efficient omega-3 finishing variant (ELOVL2) — the biggest drop in turning EPA into DHA, so noticeably less DHA gets built from what you eat.',
        ['AA'],
        'ELOVL2 rs953413 (AA)',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC7033636/',
        'GG',
      ),
    ],
    supportingSNPs: [
      snp('rs429358', 'APOE', 'supporting', 'APOE E4 carriers benefit more (neuro + lipid) — increases priority', ['CT', 'TC', 'CC']),
      snp('rs7412', 'APOE', 'supporting', 'APOE E4 haplotype context', ['CC']),
      snp('rs7903146', 'TCF7L2', 'supporting', 'T2D risk — omega-3 improves insulin sensitivity', ['CT', 'TC', 'TT']),
      snp('rs1801282', 'PPARG', 'supporting', 'PPARG — insulin sensitivity context', ['CC', 'CG', 'GC']),
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
      brandOptions: [
        {
          brand: 'now-foods',
          productSlug: 'n-acetyl-l-cysteine-nac-120-tabs',
          productName: 'N-Acetyl-L-Cysteine (NAC) for Immune Support',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.3846910104534315648583770&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fn-acetyl-l-cysteine-nac-120-tabs%3fvariant%3d32870364774500',
          priceDisplay: '$23.12',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/117726.jpg?v=1776084885',
        },
        {
          brand: 'solaray',
          productSlug: 'nac-3',
          productName: 'NAC 60 Caps',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.3846911113032374365230481&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fnac-3%3fvariant%3d32870679773284',
          priceDisplay: '$19.29',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/124011.jpg?v=1776086697',
        },
      ],
      healthEffect: 'Sluggish detox often shows up as hangovers that feel disproportionate to what you drank, feeling wiped out after smoke or fume exposure, and skin that takes longer to bounce back from stress.',
    },
    evidenceTier: 'SNP-driven',
    primarySNPs: [
      primarySnp(
        'rs1695',
        'GSTP1',
        "One copy of a slower detox variant (GSTP1) — your body's main detox helper (glutathione) works a bit less efficiently. NAC supplies the building block (cysteine) your body uses to make more.",
        ['AG', 'GA'],
        'GSTP1 Ile105Val (AG)',
        'https://www.pharmgkb.org/vip/PA166169438',
        'AA',
      ),
      primarySnp(
        'rs1695',
        'GSTP1',
        'Two copies of a slower detox variant (GSTP1) — fuller drop in glutathione function, which slows clearing toxins. NAC keeps glutathione stocked by feeding it the building block (cysteine) it relies on.',
        ['GG'],
        'GSTP1 Ile105Val (GG)',
        'https://www.pharmgkb.org/vip/PA166169438',
        'AA',
      ),
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
      brandOptions: [
        {
          brand: 'source-naturals',
          productSlug: 'berberine-2',
          productName: 'Berberine 60 Veg Caps',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.384698515825426480949032&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fberberine-2%3fvariant%3d32871523975268',
          priceDisplay: '$19.25',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/144443.jpg?v=1776089067',
        },
        {
          brand: 'solaray',
          productSlug: 'berberine-3',
          productName: 'Berberine 60 Count',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.3846917309194963891214582&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fberberine-3%3fvariant%3d32871562870884',
          priceDisplay: '$23.99',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/145029.jpg?v=1776089191',
        },
        {
          brand: 'now-foods',
          productSlug: 'berberine-hcl-327042',
          productName: 'Berberine HCl, 500 mg, 90 Veg Capsules',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.384699916027630292451609&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fberberine-hcl-327042%3fvariant%3d45672846557284',
          priceDisplay: '$23.73',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/327042.jpg?v=1776132026',
        },
      ],
      healthEffect: 'These variants tend to show up as afternoon energy crashes after carb-heavy meals, sweet cravings that aren\'t really hunger, and weight that holds on around the midsection even when the rest is moving.',
    },
    evidenceTier: 'SNP-driven',
    primarySNPs: [
      primarySnp(
        'rs7903146',
        'TCF7L2',
        'One copy of a blood-sugar-risk variant (TCF7L2) — your insulin response after meals runs a bit weaker, raising type 2 diabetes risk. Berberine works on the same blood-sugar pathway.',
        ['CT', 'TC'],
        'TCF7L2 rs7903146 (CT)',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC2809956/',
        'CC',
      ),
      primarySnp(
        'rs7903146',
        'TCF7L2',
        'Two copies of the strongest blood-sugar-risk variant in our catalog (TCF7L2) — your insulin response after meals runs noticeably weaker. Berberine works on the same blood-sugar pathway and matters most here.',
        ['TT'],
        'TCF7L2 rs7903146 (TT)',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC2809956/',
        'CC',
      ),
      // PPARG Pro12Ala — Pro12 (C) is the canonical risk allele per major T2D meta-analyses;
      // Ala12 (G) is protective. Inverted-pattern entry: the trigger fires on C-carriers
      // (the wild-type-as-risk pattern). GG (homozygous protective Ala) does NOT fire.
      primarySnp(
        'rs1801282',
        'PPARG',
        "One risk copy plus one protective copy of an insulin-sensitivity variant (PPARG) — partial benefit from berberine's effect on the same insulin-sensitivity pathway.",
        ['CG', 'GC'],
        'PPARG Pro12Ala (CG)',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC7391673/',
        'GG',
      ),
      primarySnp(
        'rs1801282',
        'PPARG',
        "Two risk copies of an insulin-sensitivity variant (PPARG), no protective copy — berberine's effect on the insulin-sensitivity pathway carries the most weight here.",
        ['CC'],
        'PPARG Pro12Ala (CC)',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC7391673/',
        'GG',
      ),
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
      brandOptions: [
        {
          brand: 'now-foods',
          productSlug: 'magnesium-glycinate-5',
          productName: 'Magnesium Glycinate 180 Tabs',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.384692539868350394078413&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fmagnesium-glycinate-5%3fvariant%3d32872447246436',
          priceDisplay: '$19.98',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/157654.jpg?v=1776091268',
        },
        {
          brand: 'solaray',
          productSlug: 'magnesium-glycinate-220472',
          productName: 'Magnesium Glycinate 120 Count',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.3846917738327000101815945&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fmagnesium-glycinate-220472%3fvariant%3d40478724915300',
          priceDisplay: '$18.39',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/220472.jpg?v=1776110723',
        },
        {
          brand: 'source-naturals',
          productSlug: 'magnesium-glycinate-228463',
          productName: 'Magnesium Glycinate 60 Tabs',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.3846914589288514969974648&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fmagnesium-glycinate-228463%3fvariant%3d41530363379812',
          priceDisplay: '$8.75',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/228463.jpg?v=1776114264',
        },
      ],
      healthEffect: 'Low magnesium tends to show up as trouble falling asleep, muscle tightness or calf cramps at night, and a nervous system that takes longer than it should to come down after stress.',
    },
    evidenceTier: 'SNP-informed',
    primarySNPs: [
      // TRPM6 rs11144134 — biallelic on dbSNP; reported as T/C (plus strand) or A/G
      // (opposite strand). Trigger covers both strand orientations; reference is picked
      // dynamically by the adapter to match the user's reported strand.
      primarySnp(
        'rs11144134',
        'TRPM6',
        'One copy of a magnesium-handling variant (TRPM6) — your gut and kidneys hold onto magnesium a bit less efficiently than typical.',
        ['CT', 'TC', 'AG', 'GA'],
        'TRPM6 rs11144134 (het)',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC4462077/',
        'TT',
        'AA',
      ),
      primarySnp(
        'rs11144134',
        'TRPM6',
        'Two copies of a magnesium-handling variant (TRPM6) — fuller drop in how well your body keeps magnesium, with real risk of running quietly low. Daily supplementation closes the gap.',
        ['CC', 'GG'],
        'TRPM6 rs11144134 (hom)',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC4462077/',
        'TT',
        'AA',
      ),
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
      brandOptions: [
        {
          brand: 'solaray',
          productSlug: 'activated-broccoli-seed-extract',
          productName: 'Activated Broccoli Seed Extract 30 Veg Caps',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.3846910770561670667254332&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2factivated-broccoli-seed-extract%3fvariant%3d32871554416740',
          priceDisplay: '$28.49',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/144923.jpg?v=1776089152',
        },
        {
          brand: 'source-naturals',
          productSlug: 'broccoli-sprouts-6143',
          productName: 'Broccoli Sprouts 60 Tabs',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.3846911157657713743536881&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fbroccoli-sprouts-6143%3fvariant%3d32874255450212',
          priceDisplay: '$13.99',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/6143.jpg?v=1776068638',
        },
      ],
      healthEffect: 'This one\'s more preventative than felt in the moment — steadier recovery from environmental exposures, and a body that handles everyday oxidative load without you having to think about it.',
    },
    evidenceTier: 'SNP-informed',
    primarySNPs: [
      primarySnp(
        'rs1695',
        'GSTP1',
        'One copy of a slower detox variant (GSTP1) — your built-in antioxidant defense runs a bit weaker. Sulforaphane turns up production of these defenses, including the slower one, partly making up the difference.',
        ['AG', 'GA'],
        'GSTP1 Ile105Val (AG)',
        'https://pubmed.ncbi.nlm.nih.gov/19028145/',
        'AA',
      ),
      primarySnp(
        'rs1695',
        'GSTP1',
        'Two copies of a slower detox variant (GSTP1) — fuller drop in your built-in antioxidant defense. Sulforaphane boosts production of those defenses, including the slower variant itself, helping make up the gap.',
        ['GG'],
        'GSTP1 Ile105Val (GG)',
        'https://pubmed.ncbi.nlm.nih.gov/19028145/',
        'AA',
      ),
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
      brandOptions: [
        {
          brand: 'solaray',
          productSlug: 'coq10-8',
          productName: 'CoQ10 30 Caps',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.384697020268376979879812&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fcoq10-8%3fvariant%3d32871178403940',
          priceDisplay: '$11.29',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/140794.jpg?v=1776088406',
        },
        {
          brand: 'now-foods',
          productSlug: 'coq10-with-hawthorn-berry-vegetarian-30-vcaps',
          productName: 'CoQ10 with Hawthorn Berry Vegetarian 30 Vcaps',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.384696213362940558781772&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fcoq10-with-hawthorn-berry-vegetarian-30-vcaps%3fvariant%3d32874753196132',
          priceDisplay: '$9.21',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/67987.jpg?v=1776075473',
        },
      ],
      healthEffect: 'Low CoQ10 usually reads as low-octane energy — workouts that feel harder than they should, recovery that drags, and a heart that works noticeably more on stairs or inclines.',
    },
    evidenceTier: 'SNP-driven',
    primarySNPs: [
      primarySnp(
        'rs1800566',
        'NQO1',
        'One copy of a less-efficient variant (NQO1) at the step that converts CoQ10 into its active form (ubiquinol) — modestly less efficient than typical.',
        ['CT', 'TC'],
        'NQO1 C609T (CT)',
        'https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2017.00595/full',
        'CC',
      ),
      primarySnp(
        'rs1800566',
        'NQO1',
        'Two copies of a less-efficient variant (NQO1) — the strongest drop in efficiency at converting CoQ10 into its active form. Taking ubiquinol directly skips the conversion entirely.',
        ['TT'],
        'NQO1 C609T (TT)',
        'https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2017.00595/full',
        'CC',
      ),
      // SOD2 Ala16Val rs4880: dbSNP forward strand T/C. T = Ala16 (wild-type, efficient
      // mitochondrial import); C = Val16 (variant, reduced mitochondrial-targeting-sequence
      // efficiency, raising mitochondrial oxidative stress). Trigger fires on C carriers.
      primarySnp(
        'rs4880',
        'SOD2',
        'One copy of a variant (SOD2) that delivers a key antioxidant into your cellular power plants (mitochondria) less efficiently than typical.',
        ['CT', 'TC'],
        'SOD2 Ala16Val (CT)',
        'https://pubmed.ncbi.nlm.nih.gov/36552556/',
        'TT',
      ),
      primarySnp(
        'rs4880',
        'SOD2',
        'Two copies of a variant (SOD2) that delivers a key antioxidant into your cellular power plants less efficiently — the strongest case for CoQ10, which protects the same system.',
        ['CC'],
        'SOD2 Ala16Val (CC)',
        'https://pubmed.ncbi.nlm.nih.gov/36552556/',
        'TT',
      ),
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
      brandOptions: [
        {
          brand: 'solgar',
          productSlug: 'phosphatidylserine-200-mg-softgels-100259',
          productName: 'Phosphatidylserine 60 Soft Gels',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.384692873302619326922946&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fphosphatidylserine-200-mg-softgels-100259%3fvariant%3d32869968347236',
          priceDisplay: '$49.49',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/100259.jpg?v=1776082422',
        },
        {
          brand: 'jarrow-formulas',
          productSlug: 'phosphatidyl-serine-ps-100-60-softgel',
          productName: 'Phosphatidyl Serine ( PS-100) 60 Softgel',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.384694150888188125152775&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fphosphatidyl-serine-ps-100-60-softgel%3fvariant%3d32874047635556',
          priceDisplay: '$36.99',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/20987.jpg?v=1776071841',
        },
      ],
      healthEffect: 'When the brain needs more structural support, it tends to show up as names and words slipping mid-conversation, harder-to-hold focus when you\'re juggling things, and more mental friction late in the day.',
    },
    evidenceTier: 'SNP-driven',
    primarySNPs: [
      primarySnp(
        'rs429358',
        'APOE',
        'One copy of the APOE ε4 variant — your brain handles its building-block fats a bit differently, and cognitive aging tends to move a step faster. Read together with the rs7412 row below, which confirms this is the ε4 type and not the protective ε2 type. PS plus omega-3 has shown memory benefit in this group.',
        ['CT', 'TC'],
        'APOE ε4 (one copy)',
        'https://pubmed.ncbi.nlm.nih.gov/20523044/',
        'TT',
      ),
      primarySnp(
        'rs429358',
        'APOE',
        'Two copies of the APOE ε4 variant — the strongest cognitive-aging risk profile in our catalog. Read together with the rs7412 row below, which confirms the APOE type alongside this one. PS plus omega-3 matters most here.',
        ['CC'],
        'APOE ε4 (two copies)',
        'https://pubmed.ncbi.nlm.nih.gov/20523044/',
        'TT',
      ),
      primarySnp(
        'rs7412',
        'APOE',
        'Confirms your APOE type by ruling out the protective ε2 variant. The APOE letter (ε2 / ε3 / ε4) is read from rs429358 and rs7412 together — this CC excludes any ε2 and locks in the ε4 reading from the row above.',
        ['CC'],
        'APOE ε2 absence (CC)',
        'https://pubmed.ncbi.nlm.nih.gov/20523044/',
        'CC',
      ),
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
      brandOptions: [
        {
          brand: 'source-naturals',
          productSlug: 'nictotinamide-riboside-334440',
          productName: 'Nictotinamide Riboside, 300 Mg, 30 Veg Caps',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.384691763404428056554051&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fnictotinamide-riboside-334440%3fvariant%3d47478976020580',
          priceDisplay: '$16.79',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/334440.jpg?v=1776134329',
        },
      ],
      healthEffect: 'Aging mitochondria tend to read as a slower metabolic engine overall — workouts that take longer to recover from, energy that doesn\'t return to baseline the way it used to, and sleep that feels less restorative.',
    },
    evidenceTier: 'SNP-informed',
    primarySNPs: [
      primarySnp(
        'rs1800566',
        'NQO1',
        'One copy of a less-efficient variant (NQO1) at the step that recycles NAD — your cellular energy currency cycles modestly less efficiently than typical.',
        ['CT', 'TC'],
        'NQO1 C609T (CT)',
        'https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2017.00595/full',
        'CC',
      ),
      primarySnp(
        'rs1800566',
        'NQO1',
        'Two copies of a less-efficient variant (NQO1) at the NAD-recycling step — the strongest drop in this gene, which makes the case for NMN/NR to top up your cellular energy supply.',
        ['TT'],
        'NQO1 C609T (TT)',
        'https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2017.00595/full',
        'CC',
      ),
    ],
    supportingSNPs: [
      snp('rs4880', 'SOD2', 'supporting', 'SOD2 — mitochondrial oxidative stress', ['CC', 'CT', 'TC']),
      snp('rs2802292', 'FOXO3', 'supporting', 'FOXO3 longevity allele — G carriers benefit more from NAD+ precursors', ['TG', 'GT', 'GG']),
      snp('rs3758391', 'SIRT1', 'supporting', 'SIRT1 — NAD+-dependent deacetylase', ['CT', 'TC', 'TT']),
    ],
  },

  // ── ATHLETIC PERFORMANCE ───────────────────────────────────────────────
  {
    supplement: {
      name: 'Creatine monohydrate',
      category: 'athletic-performance',
      defaultDosage: '3–5 g daily',
      brandOptions: [
        {
          brand: 'bucked-up',
          productSlug: 'creatine-micro-mono-265669',
          productName: 'Creatine Micro Mono, 250 Grams',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.384695456167397230366769&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fcreatine-micro-mono-265669%3fvariant%3d45683154616420',
          priceDisplay: '$28.39',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/265669.jpg?v=1776123389',
        },
        {
          brand: 'primaforce',
          productSlug: 'creatine-monohydrate-powder-unflavored-320425',
          productName: 'Creatine Monohydrate Powder Unflavored, 300 Grams',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.384691278016852794872251&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fcreatine-monohydrate-powder-unflavored-320425%3fvariant%3d45692232826980',
          priceDisplay: '$15.99',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/320425.jpg?v=1776131034',
        },
        {
          brand: 'nutricost',
          productSlug: 'creatine-monohydrate-powder-313059',
          productName: 'Creatine Monohydrate Powder, 1 Kg',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.3846910799622328127788506&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fcreatine-monohydrate-powder-313059%3fvariant%3d44593377738852',
          priceDisplay: '$39.99',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/313059.jpg?v=1776129108',
        },
      ],
      healthEffect: 'If you carry the XX genotype, creatine tends to show up as a real lift — more reps left in the tank, faster between-set recovery, and strength that builds sooner than you\'d expect for the effort you\'re putting in.',
    },
    evidenceTier: 'SNP-driven',
    primarySNPs: [
      primarySnp(
        'rs1815739',
        'ACTN3',
        'One inactive copy of a power-muscle protein (α-actinin-3) — creatine helps everyone build power and strength, but research suggests the relative gain may run a bit larger here, since your power muscles get a small extra fuel boost from supplementation.',
        ['CT', 'TC'],
        'ACTN3 R577X (CT)',
        'https://pubmed.ncbi.nlm.nih.gov/31145768/',
        'CC',
      ),
      primarySnp(
        'rs1815739',
        'ACTN3',
        'Both copies of a power-muscle protein (α-actinin-3) are inactive in your file (the "XX" genotype). Creatine works regardless of genotype, but research suggests the relative gain runs largest in this group, since your power muscles fully lean on the extra fuel support creatine provides.',
        ['TT'],
        'ACTN3 R577X (TT — XX genotype)',
        'https://pubmed.ncbi.nlm.nih.gov/31145768/',
        'CC',
      ),
    ],
    supportingSNPs: [
      snp('rs4343', 'ACE', 'supporting', 'ACE — I/D polymorphism; power/endurance context', ['AG', 'GA', 'GG']),
      snp('rs8192678', 'PPARGC1A', 'supporting', 'PPARGC1A — mitochondrial biogenesis, training response', ['AG', 'GA', 'AA']),
    ],
  },
  {
    supplement: {
      name: 'L-carnitine (tartrate)',
      category: 'athletic-performance',
      defaultDosage: '1–2 g daily',
      brandOptions: [
        {
          brand: 'solaray',
          productSlug: 'l-carnitine',
          productName: 'L-Carnitine 30 Caps',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.3846911576986761030984497&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fl-carnitine%3fvariant%3d32870671482980',
          priceDisplay: '$18.49',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/123816.jpg?v=1776086587',
        },
        {
          brand: 'now-foods',
          productSlug: 'l-carnitine-180-caps',
          productName: 'L-Carnitine 180 Caps',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.3846915589886082479613766&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fl-carnitine-180-caps%3fvariant%3d32874750476388',
          priceDisplay: '$41.23',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/67895.jpg?v=1776075265',
        },
        {
          brand: 'solgar',
          productSlug: 'lcarnitine-36609',
          productName: 'L-Carnitine 60 Tabs',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.3846915927356804716779959&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2flcarnitine-36609%3fvariant%3d41527964368996',
          priceDisplay: '$26.99',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/36609.jpg?v=1776073115',
        },
      ],
      healthEffect: 'Slower fat oxidation often shows up as exercise that feels like it\'s running on sugar before fat — energy that crashes sooner than expected, and weight that\'s harder to shift even with consistent cardio.',
    },
    evidenceTier: 'SNP-driven',
    primarySNPs: [
      primarySnp(
        'rs1042713',
        'ADRB2',
        "One copy of a variant (ADRB2) that softens your body's signal to break down stored fat — modestly slower fat-burning response than typical.",
        ['AG', 'GA'],
        'ADRB2 Arg16Gly (AG)',
        'https://pubmed.ncbi.nlm.nih.gov/24960039/',
        'AA',
      ),
      primarySnp(
        'rs1042713',
        'ADRB2',
        'Two copies of a variant (ADRB2) that softens the signal to break down stored fat — fat is harder to mobilize during exercise. L-carnitine helps shuttle fat into your cellular power plants where it gets burned.',
        ['GG'],
        'ADRB2 Arg16Gly (GG)',
        'https://pubmed.ncbi.nlm.nih.gov/24960039/',
        'AA',
      ),
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
      category: 'athletic-performance',
      defaultDosage: '10–20 mg daily',
      brandOptions: [],
      healthEffect: 'The payoff here is subtle and slow — more stamina across long days, better-quality sleep, and a brain that doesn\'t hit its afternoon wall as hard.',
    },
    evidenceTier: 'SNP-informed',
    primarySNPs: [
      primarySnp(
        'rs8192678',
        'PPARGC1A',
        'One copy of a variant that softens the master switch (PGC-1α) for building new cellular power plants — runs a bit weaker than typical.',
        ['AG', 'GA'],
        'PPARGC1A Gly482Ser (AG)',
        'https://pubmed.ncbi.nlm.nih.gov/39766897/',
        'GG',
      ),
      primarySnp(
        'rs8192678',
        'PPARGC1A',
        'Two copies of a variant that softens the master switch (PGC-1α) for building new cellular power plants — fuller drop. PQQ pushes on the same switch.',
        ['AA'],
        'PPARGC1A Gly482Ser (AA)',
        'https://pubmed.ncbi.nlm.nih.gov/39766897/',
        'GG',
      ),
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
      brandOptions: [
        {
          brand: 'solaray',
          productSlug: 'lactase',
          productName: 'Lactase 100 Caps',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.38469967371900085600815&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2flactase%3fvariant%3d32870632226916',
          priceDisplay: '$21.69',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/122957.jpg?v=1776085922',
        },
        {
          brand: 'source-naturals',
          productSlug: 'lactase-digest-45-vcaps',
          productName: 'Lactase Digest 45 Vcaps',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.3846917702778805811051773&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2flactase-digest-45-vcaps%3fvariant%3d32875138154596',
          priceDisplay: '$6.65',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/83809.jpg?v=1776079492',
        },
      ],
      healthEffect: 'If dairy reliably gives you bloating, cramping, or looser stools within an hour or two of the meal, that\'s exactly the pattern this targets.',
      culturalContext: 'The LCT persistence genotype — being able to digest dairy into adulthood — is uncommon outside Northern European ancestry, which is why lactose issues are the norm rather than the exception for most of us.',
    },
    evidenceTier: 'SNP-driven',
    primarySNPs: [
      // LCT/MCM6 rs4988235 — parser strand: A = lactase-persistent (dominant), G =
      // lactase non-persistent (recessive). Single-genotype entry: only homozygous GG
      // produces the non-persistent phenotype; heterozygotes are still persistent.
      // variantLabel + reference use parser strand (A/G), not dbSNP forward (C/T).
      primarySnp(
        'rs4988235',
        'LCT/MCM6',
        'Lactase non-persistent — your body stopped making lactase (the enzyme that digests milk sugar) sometime after childhood, which is the typical pattern for most non-Northern-European ancestry. Supplemental lactase fills in for what your gut no longer makes.',
        ['GG'],
        'LCT/MCM6 rs4988235 (GG)',
        'https://pubmed.ncbi.nlm.nih.gov/31405126/',
        'AA',
      ),
    ],
    supportingSNPs: [],
  },
  {
    supplement: {
      name: 'Non-dairy calcium (citrate)',
      category: 'food-sensitivity',
      defaultDosage: '500–1000 mg daily',
      brandOptions: [
        {
          brand: 'now-foods',
          productSlug: 'calcium-citrate-8',
          productName: 'Calcium Citrate 8 OZ',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.384691179220863826862706&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fcalcium-citrate-8%3fvariant%3d32874749624420',
          priceDisplay: '$12.48',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/67883.jpg?v=1776075246',
        },
        {
          brand: 'solgar',
          productSlug: 'calcium-citrate-with-vitamin-d3-tablets-36267',
          productName: 'Calcium Citrate with Vitamin D3 Tablets 120 Tabs',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.38469477142202849487895&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fcalcium-citrate-with-vitamin-d3-tablets-36267%3fvariant%3d32874165403748',
          priceDisplay: '$12.29',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/36267_7b26c8fc-165f-4914-bac8-864414255cc3.jpg?v=1776073040',
        },
        {
          brand: 'solaray',
          productSlug: 'calcium-citrate-3',
          productName: 'Calcium Citrate 180 Caps',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.3846911417800046850544900&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fcalcium-citrate-3%3fvariant%3d32870665289828',
          priceDisplay: '$18.49',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/123678.jpg?v=1776086483',
        },
        {
          brand: 'source-naturals',
          productSlug: 'calcium-citrate-20901',
          productName: 'Calcium Citrate 180 Tabs',
          productUrl: 'https://click.linksynergy.com/link?id=lDiltZ8gZ2U&offerid=295006.384697173460072367349717&type=2&murl=https%3a%2f%2fwww.herbspro.com%2fproducts%2fcalcium-citrate-20901%3fvariant%3d32874045276260',
          priceDisplay: '$14.88',
          imageUrl: 'https://cdn.shopify.com/s/files/1/0196/7092/5412/files/20901.jpg?v=1776071785',
        },
      ],
      healthEffect: 'If you\'ve cut or reduced dairy, the gap usually isn\'t felt day to day — it shows up long-term in bone density, and near-term you might notice more nighttime muscle cramping.',
      culturalContext: 'Because lactose non-persistence is the default for most non-Northern-European populations, many people in this audience have been quietly running below the calcium-intake assumptions that most nutrition guidance is built on.',
    },
    evidenceTier: 'SNP-driven',
    primarySNPs: [
      primarySnp(
        'rs4988235',
        'LCT/MCM6',
        'Lactase non-persistent — most adults with this pattern eat less dairy because of how it sits, which can leave daily calcium intake below the recommended range for some people. Non-dairy calcium covers any gap this dietary pattern creates. (Worth knowing: outright calcium deficiency is uncommon in adults — this is about hitting daily intake targets, not treating a deficit.)',
        ['GG'],
        'LCT/MCM6 rs4988235 (GG)',
        'https://pubmed.ncbi.nlm.nih.gov/31405126/',
        'AA',
      ),
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
      brandOptions: [
        {
          brand: 'solaray',
          productSlug: 'vegan-dao-enzyme-supplying-333754',
          productName: 'Vegan DAO Enzyme Supplying, 30 Veg Caps',
          productUrl: 'https://click.linksynergy.com/deeplink?id=lDiltZ8gZ2U&mid=38469&murl=https%3A%2F%2Fwww.herbspro.com%2Fproducts%2Fvegan-dao-enzyme-supplying-333754',
          priceDisplay: '$21.99',
          imageUrl: '',
        },
      ],
      healthEffect: 'Low DAO tends to show up as flushing after wine or aged cheese, unexplained headaches, hives, or a runny nose that kicks in after meals — histamine building up faster than your body can clear it.',
    },
    evidenceTier: 'SNP-driven',
    primarySNPs: [
      primarySnp(
        'rs10156191',
        'AOC1',
        'One copy of a slower histamine-clearing variant (AOC1) — your body breaks down dietary histamine a bit slower than typical.',
        ['CT', 'TC'],
        'AOC1 Thr16Met (CT)',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC11054051/',
        'CC',
      ),
      primarySnp(
        'rs10156191',
        'AOC1',
        'Two copies of a slower histamine-clearing variant (AOC1) — your body is noticeably slower to clear histamine after meals high in it (aged cheese, wine, fermented foods).',
        ['TT'],
        'AOC1 Thr16Met (TT)',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC11054051/',
        'CC',
      ),
      primarySnp(
        'rs1049742',
        'AOC1',
        'One copy of a variant (AOC1) that lowers how much histamine-clearing enzyme (DAO) your body produces.',
        ['CT', 'TC'],
        'AOC1 Ser332Phe (CT)',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC11054051/',
        'CC',
      ),
      primarySnp(
        'rs1049742',
        'AOC1',
        'Two copies of a variant (AOC1) that lowers how much histamine-clearing enzyme your body makes — compounds when paired with the other AOC1 variant. Supplemental DAO before histamine-rich meals fills the gap.',
        ['TT'],
        'AOC1 Ser332Phe (TT)',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC11054051/',
        'CC',
      ),
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
      brandOptions: [],
      healthEffect: 'If you\'re a carrier, extra iron doesn\'t make you feel anything different in the moment — it quietly accumulates over years. Skipping iron in multis and not "just topping up" is the move.',
      culturalContext: 'HFE hemochromatosis is largely a Northern European founder variant and is much less common in people of African descent, so this card fires for fewer users in our audience than the general population rate would suggest.',
    },
    evidenceTier: 'SNP-driven',
    avoidanceRule: true,
    primarySNPs: [
      primarySnp(
        'rs1799945',
        'HFE',
        'One copy of an iron-loading variant (HFE H63D) — your gut may absorb slightly more iron than typical. Worth a conversation with your doctor before starting iron supplementation, especially given other factors like a vegetarian diet or menstruation that can pull iron the other way.',
        ['CG', 'GC'],
        'HFE H63D (CG)',
        'https://www.nejm.org/doi/full/10.1056/NEJMoa073286',
        'CC',
      ),
      primarySnp(
        'rs1799945',
        'HFE',
        'Two copies of an iron-loading variant (HFE H63D) — your gut may absorb more iron than typical, with risk of buildup over time. Talk to your doctor before taking supplemental iron, especially if you\'ve been told you need it for another reason (low iron from periods, vegetarian or vegan diet).',
        ['GG'],
        'HFE H63D (GG)',
        'https://www.nejm.org/doi/full/10.1056/NEJMoa073286',
        'CC',
      ),
      primarySnp(
        'rs1800562',
        'HFE',
        'One copy of an iron-loading variant (HFE C282Y) — your gut may absorb slightly more iron than typical. Worth a conversation with your doctor before starting iron supplementation, especially given other factors like a vegetarian diet or menstruation that can pull iron the other way.',
        ['AG', 'GA'],
        'HFE C282Y (AG)',
        'https://www.nejm.org/doi/full/10.1056/NEJMoa073286',
        'GG',
      ),
      primarySnp(
        'rs1800562',
        'HFE',
        'Two copies of an iron-loading variant (HFE C282Y) — clear hereditary hemochromatosis risk (iron buildup that can damage organs over time). This needs medical input. Talk to your doctor before taking any iron supplement, even if you\'ve been told you need it for another reason.',
        ['AA'],
        'HFE C282Y (AA)',
        'https://www.nejm.org/doi/full/10.1056/NEJMoa073286',
        'GG',
      ),
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
