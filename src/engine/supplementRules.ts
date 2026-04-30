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
      partnerOptions: [
        {
          partner: 'thorne',
          productSlug: '5-mthf-1-mg',
          productName: '5-MTHF 1 mg',
          productUrl: 'https://www.thorne.com/products/dp/5-mthf-1-mg',
          priceDisplay: '$24',
          imageUrl: 'https://d1vo8zfysxy97v.cloudfront.net/media/product/b129__v9e2dcbdfca9045f29cc531eca894e0722dd58f27.png',
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
      partnerOptions: [
        {
          partner: 'thorne',
          productSlug: 'methylcobalamin',
          productName: 'Vitamin B12',
          productUrl: 'https://www.thorne.com/products/dp/methylcobalamin',
          priceDisplay: '$24',
          imageUrl: 'https://d1vo8zfysxy97v.cloudfront.net/media/product/b125__vdc2295bdfd7f57713849ab8693465dc3ee2e45a0.png',
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
      partnerOptions: [
        {
          partner: 'thorne',
          productSlug: 'vitamin-d-k2-liquid',
          productName: 'Vitamin D + K2 Liquid',
          productUrl: 'https://www.thorne.com/products/dp/vitamin-d-k2-liquid',
          priceDisplay: '$34',
          imageUrl: 'https://d1vo8zfysxy97v.cloudfront.net/media/product/kd500__v1f2f6991180c90d1d7e83b441748f077d3d853d8.png',
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
      partnerOptions: [
        {
          partner: 'thorne',
          productSlug: 'super-epa-sp608nc',
          productName: 'Super EPA - 90 Servings',
          productUrl: 'https://www.thorne.com/products/dp/super-epa-sp608nc',
          priceDisplay: '$41',
          imageUrl: 'https://d1vo8zfysxy97v.cloudfront.net/media/product/sp608nc__v85ffd3158c5fcd199d35f8f66966125217d62306.png',
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
      partnerOptions: [
        {
          partner: 'thorne',
          productSlug: 'cysteplus-reg',
          productName: 'NAC - N-Acetylcysteine - 90 Servings',
          productUrl: 'https://www.thorne.com/products/dp/cysteplus-reg',
          priceDisplay: '$33',
          imageUrl: 'https://d1vo8zfysxy97v.cloudfront.net/media/product/sa560__v9249e43d5234140b60ada72238c5fb10f53ee558.png',
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
      partnerOptions: [
        {
          partner: 'thorne',
          productSlug: 'berberine-500',
          productName: 'Berberine',
          productUrl: 'https://www.thorne.com/products/dp/berberine-500',
          priceDisplay: '$44',
          imageUrl: 'https://d1vo8zfysxy97v.cloudfront.net/media/product/sf800__vd424273289116ed602cb97bcef5ca314e2b9ff03.png',
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
      partnerOptions: [
        {
          partner: 'thorne',
          productSlug: 'magnesium-glycinate',
          productName: 'Magnesium Glycinate',
          productUrl: 'https://www.thorne.com/products/dp/magnesium-glycinate',
          priceDisplay: '$26',
          imageUrl: 'https://d1vo8zfysxy97v.cloudfront.net/media/product/m284__v722511088310a527d9bd4f32ff1f8a38e3e4fa0f.png',
        },
        {
          partner: 'biotrust',
          productSlug: 'ageless-multi-magnesium',
          productName: 'Ageless Multi Magnesium',
          productUrl: 'https://www.biotrust.com/products/ageless-multi-magnesium',
          priceDisplay: '$37',
          originalPriceDisplay: '$39',
          imageUrl: 'https://www.biotrust.com/cdn/shop/files/ageless_magnesium-primary_thumbnail.png',
        },
        {
          partner: 'organifi',
          productSlug: 'magnesium',
          productName: 'Essential Magnesium',
          productUrl: 'https://www.organifishop.com/products/magnesium',
          priceDisplay: '$30',
          imageUrl: 'https://www.organifishop.com/cdn/shop/products/Organifi-Magnesium-3DRender-Mast_533x.png?v=1681857279',
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
      partnerOptions: [
        {
          partner: 'thorne',
          productSlug: 'crucera-sgs',
          productName: 'Broccoli Seed Extract',
          productUrl: 'https://www.thorne.com/products/dp/crucera-sgs',
          priceDisplay: '$67',
          imageUrl: 'https://d1vo8zfysxy97v.cloudfront.net/media/product/sp660__v0bc92c7bbc38958c3e6b1cf6d7516e9133de907f.png',
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
      partnerOptions: [
        {
          partner: 'thorne',
          productSlug: 'q-best-100',
          productName: 'CoQ10',
          productUrl: 'https://www.thorne.com/products/dp/q-best-100',
          priceDisplay: '$53',
          imageUrl: 'https://d1vo8zfysxy97v.cloudfront.net/media/product/sp624__v0e9c43db03041def65f6aef69118044fc2cc0839.png',
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
      partnerOptions: [
        {
          partner: 'thorne',
          productSlug: 'iso-phos-reg',
          productName: 'Phosphatidylserine',
          productUrl: 'https://www.thorne.com/products/dp/iso-phos-reg',
          priceDisplay: '$68',
          imageUrl: 'https://d1vo8zfysxy97v.cloudfront.net/media/product/sf715__va829b08aa2703b779ace7a4b83e7c2bc143e1d06.png',
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
      partnerOptions: [
        {
          partner: 'thorne',
          productSlug: 'niacel-400',
          productName: 'NiaCel® 400',
          productUrl: 'https://www.thorne.com/products/dp/niacel-400',
          priceDisplay: '$74',
          imageUrl: 'https://d1vo8zfysxy97v.cloudfront.net/media/product/sp654__va5a0653d7b868a8ef96b8912e5dc924178efd56f.png',
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

  // ── BODY OPTIMIZATION ──────────────────────────────────────────────────
  {
    supplement: {
      name: 'Creatine monohydrate',
      category: 'body-optimization',
      defaultDosage: '3–5 g daily',
      partnerOptions: [
        {
          partner: 'thorne',
          productSlug: 'creatine',
          productName: 'Creatine - 90 Servings',
          productUrl: 'https://www.thorne.com/products/dp/creatine',
          priceDisplay: '$44',
          imageUrl: 'https://d1vo8zfysxy97v.cloudfront.net/media/product/sf903__ve8382489c6ce9fb7f28cdddef00e6f1ece146591.png',
        },
        {
          partner: 'organifi',
          productSlug: 'creatine-cherry-chews',
          productName: 'Creatine Cherry Chews',
          productUrl: 'https://www.organifishop.com/products/creatine-cherry-chews',
          priceDisplay: '$42.99',
          imageUrl: 'https://www.organifishop.com/cdn/shop/files/Organifi_Cherry_Chews_TP_533x.png?v=1736450167',
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
      category: 'body-optimization',
      defaultDosage: '1–2 g daily',
      partnerOptions: [
        {
          partner: 'thorne',
          productSlug: 'carnityl-reg',
          productName: 'Acetyl-L-Carnitine',
          productUrl: 'https://www.thorne.com/products/dp/carnityl-reg',
          priceDisplay: '$32',
          imageUrl: 'https://d1vo8zfysxy97v.cloudfront.net/media/product/sa520__v9e769c15ab53497dd06ad1359dd34903eba54714.png',
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
      category: 'body-optimization',
      defaultDosage: '10–20 mg daily',
      partnerOptions: [],
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
      partnerOptions: [],
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
      partnerOptions: [
        {
          partner: 'thorne',
          productSlug: 'dicalcium-malate',
          productName: 'Calcium',
          productUrl: 'https://www.thorne.com/products/dp/dicalcium-malate',
          priceDisplay: '$28',
          imageUrl: 'https://d1vo8zfysxy97v.cloudfront.net/media/product/m281__v0eba4b643c65deb5775ba03a5b2644494e4918b7.png',
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
      partnerOptions: [],
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
      partnerOptions: [],
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
