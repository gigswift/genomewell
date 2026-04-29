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
        'Heterozygous slow methylator — folate conversion runs at roughly 65% of typical efficiency; supplementing the methylated form bypasses the partial bottleneck.',
        ['CT', 'TC'],
        'MTHFR C677T (CT)',
        'https://www.pharmgkb.org/clinicalAnnotation/1450814430',
        'CC',
      ),
      primarySnp(
        'rs1801133',
        'MTHFR',
        'Homozygous slow methylator — folate conversion runs at roughly 35% of typical efficiency, the strongest signal in this lane; methylated folate bypasses the bottleneck entirely.',
        ['TT'],
        'MTHFR C677T (TT)',
        'https://www.pharmgkb.org/clinicalAnnotation/1450814430',
        'CC',
      ),
      primarySnp(
        'rs1801131',
        'MTHFR',
        "Heterozygous regulatory variant in MTHFR's regulatory region — modest reduction in folate-handling capacity, more relevant when stacked with C677T.",
        ['AC', 'CA'],
        'MTHFR A1298C (AC)',
        'https://www.pharmgkb.org/clinicalAnnotation/1450814424',
        'AA',
      ),
      primarySnp(
        'rs1801131',
        'MTHFR',
        "Homozygous regulatory variant — fuller reduction in folate-handling capacity, most relevant when stacked with C677T; methylated folate is the form that reaches the methylation cycle.",
        ['CC'],
        'MTHFR A1298C (CC)',
        'https://www.pharmgkb.org/clinicalAnnotation/1450814424',
        'AA',
      ),
      primarySnp(
        'rs2236225',
        'MTHFD1',
        'Heterozygous variant — mild destabilization of MTHFD1, the upstream folate-cycle enzyme, modestly raising methylation load.',
        ['AG', 'GA'],
        'MTHFD1 G1958A (AG)',
        'https://www.snpedia.com/index.php/Rs2236225',
        'GG',
      ),
      primarySnp(
        'rs2236225',
        'MTHFD1',
        'Homozygous variant — fuller destabilization of MTHFD1, increasing the burden on the methyl cycle and the case for pre-converted methylfolate.',
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
        'Non-secretor — gut mucosal glycosylation is altered and holo-haptocorrin handling shifts, raising B12 intra-organismal recycling demand and the case for direct methylcobalamin supplementation. (W143X is recessive — only the homozygous AA genotype produces the non-secretor phenotype.)',
        ['AA'],
        'FUT2 W143X (AA)',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC2673801/',
        'GG',
      ),
      primarySnp(
        'rs1805087',
        'MTR',
        'Heterozygous variant — modest acceleration of B12 turnover at the homocysteine→methionine step.',
        ['AG', 'GA'],
        'MTR A2756G (AG)',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC3990204/',
        'AA',
      ),
      primarySnp(
        'rs1805087',
        'MTR',
        'Homozygous variant — accelerated B12 turnover at the homocysteine→methionine step, raising the ongoing methylcobalamin requirement.',
        ['GG'],
        'MTR A2756G (GG)',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC3990204/',
        'AA',
      ),
      primarySnp(
        'rs1801394',
        'MTRR',
        'Heterozygous variant — modestly slower B12 cofactor reactivation by methionine synthase reductase.',
        ['AG', 'GA'],
        'MTRR A66G (AG)',
        'https://pubmed.ncbi.nlm.nih.gov/24261678/',
        'AA',
      ),
      primarySnp(
        'rs1801394',
        'MTRR',
        'Homozygous variant — slower B12 cofactor reactivation, depleting methylcobalamin reserves faster; direct supplementation eases the recycling load.',
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
        "Heterozygous BsmI carrier — modest reduction in vitamin-D-receptor mRNA stability.",
        ['AG', 'GA', 'TC', 'CT'],
        'VDR BsmI (het)',
        'https://pubmed.ncbi.nlm.nih.gov/23134477/',
        'GG',
        'CC',
      ),
      primarySnp(
        'rs1544410',
        'VDR',
        "Homozygous BsmI — fuller reduction in receptor stability, raising the 25(OH)D level needed for the same biological effect; higher target dose.",
        ['AA', 'TT'],
        'VDR BsmI (hom)',
        'https://pubmed.ncbi.nlm.nih.gov/23134477/',
        'GG',
        'CC',
      ),
      primarySnp(
        'rs2282679',
        'GC',
        'Heterozygous minor-allele carrier — modestly lower circulating 25(OH)D and blunted response to standard supplementation; effect amplified in African ancestry.',
        ['AC', 'CA'],
        'GC DBP (AC)',
        'https://pubmed.ncbi.nlm.nih.gov/30661702/',
        'CC',
      ),
      primarySnp(
        'rs2282679',
        'GC',
        'Homozygous minor-allele — strongest reduction in circulating 25(OH)D in this gene; effect amplified in African ancestry.',
        ['AA'],
        'GC DBP (AA)',
        'https://pubmed.ncbi.nlm.nih.gov/30661702/',
        'CC',
      ),
      primarySnp(
        'rs10741657',
        'CYP2R1',
        'Heterozygous variant — modest reduction in hepatic 25-hydroxylation of D3.',
        ['AG', 'GA'],
        'CYP2R1 rs10741657 (AG)',
        'https://pubmed.ncbi.nlm.nih.gov/30120973/',
        'GG',
      ),
      primarySnp(
        'rs10741657',
        'CYP2R1',
        'Homozygous variant — strongest reduction in 25-hydroxylation of D3, dampening response to fixed-dose supplementation.',
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
        'Heterozygous T-carrier — Δ-5 desaturase activity reduced ~30%, slowing ALA→EPA conversion.',
        ['GT', 'TG'],
        'FADS1 rs174537 (GT)',
        'https://www.mdpi.com/2072-6643/9/3/240',
        'GG',
      ),
      primarySnp(
        'rs174537',
        'FADS1',
        'Homozygous T — Δ-5 desaturase activity reduced ~50%, severely limiting ALA-to-EPA conversion and making marine-sourced EPA/DHA the practical route.',
        ['TT'],
        'FADS1 rs174537 (TT)',
        'https://www.mdpi.com/2072-6643/9/3/240',
        'GG',
      ),
      primarySnp(
        'rs1535',
        'FADS2',
        'Heterozygous G-carrier — modest reduction in Δ-6 desaturase activity, the upstream step in long-chain omega-3 synthesis.',
        ['AG', 'GA'],
        'FADS2 rs1535 (AG)',
        'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0222061',
        'AA',
      ),
      primarySnp(
        'rs1535',
        'FADS2',
        'Homozygous G — fuller reduction in Δ-6 desaturase activity; preferential response to direct EPA/DHA supplementation.',
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
        'Heterozygous A-carrier — modestly reduced ELOVL2 expression and EPA→DPA→DHA elongation; benefits from direct EPA/DHA supplementation.',
        ['AG', 'GA'],
        'ELOVL2 rs953413 (AG)',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC7033636/',
        'GG',
      ),
      primarySnp(
        'rs953413',
        'ELOVL2',
        'Homozygous A — strongest reduction in ELOVL2 expression and EPA→DHA elongation; less endogenous DHA from EPA.',
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
        "Heterozygous Val carrier — modestly reduced GSTP1 catalytic activity for glutathione conjugation; NAC supplies cysteine to replenish the glutathione substrate.",
        ['AG', 'GA'],
        'GSTP1 Ile105Val (AG)',
        'https://www.pharmgkb.org/vip/PA166169438',
        'AA',
      ),
      primarySnp(
        'rs1695',
        'GSTP1',
        "Homozygous Val — fuller reduction in glutathione conjugation, lowering xenobiotic clearance; NAC supplies cysteine to replenish the glutathione substrate this enzyme depends on.",
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
        'Heterozygous T-carrier — partial impairment of incretin-driven insulin secretion, moderate T2D risk; berberine targets the same pathway via AMPK activation.',
        ['CT', 'TC'],
        'TCF7L2 rs7903146 (CT)',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC2809956/',
        'CC',
      ),
      primarySnp(
        'rs7903146',
        'TCF7L2',
        'Homozygous T — fuller impairment of incretin-driven insulin secretion; strongest T2D-risk allele in our catalog. Berberine targets the same pathway via AMPK activation.',
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
        "One Pro12 risk copy plus one protective Ala12 copy — partial benefit from berberine's PPAR-γ–insulin-sensitizing effect.",
        ['CG', 'GC'],
        'PPARG Pro12Ala (CG)',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC7391673/',
        'GG',
      ),
      primarySnp(
        'rs1801282',
        'PPARG',
        "Homozygous Pro12 — full risk-allele dose with no protective Ala12; berberine's PPAR-γ–insulin-sensitizing effect carries the most weight here.",
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
        'Heterozygous minor-allele carrier — modestly reduced intestinal/renal magnesium handling.',
        ['CT', 'TC', 'AG', 'GA'],
        'TRPM6 rs11144134 (het)',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC4462077/',
        'TT',
        'AA',
      ),
      primarySnp(
        'rs11144134',
        'TRPM6',
        'Homozygous minor-allele — fuller reduction in TRPM6-mediated Mg reabsorption; latent hypomagnesemia risk and rationale for daily supplementation.',
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
        'Heterozygous Val carrier — modestly reduced GSTP1 baseline activity; sulforaphane induces Phase II antioxidant enzymes including GSTP1, partially compensating.',
        ['AG', 'GA'],
        'GSTP1 Ile105Val (AG)',
        'https://pubmed.ncbi.nlm.nih.gov/19028145/',
        'AA',
      ),
      primarySnp(
        'rs1695',
        'GSTP1',
        'Homozygous Val — fuller reduction in GSTP1 baseline activity; sulforaphane induces Phase II antioxidant enzymes including GSTP1 itself, partially compensating for the lower-activity variant.',
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
        'Heterozygous T-carrier — modestly reduced NQO1 activity at the ubiquinone→ubiquinol step.',
        ['CT', 'TC'],
        'NQO1 C609T (CT)',
        'https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2017.00595/full',
        'CC',
      ),
      primarySnp(
        'rs1800566',
        'NQO1',
        'Homozygous T — strongest reduction in NQO1 activity; direct ubiquinol bypasses the conversion step entirely.',
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
        "Heterozygous Val carrier — modestly reduced mitochondrial SOD2 import.",
        ['CT', 'TC'],
        'SOD2 Ala16Val (CT)',
        'https://pubmed.ncbi.nlm.nih.gov/36552556/',
        'TT',
      ),
      primarySnp(
        'rs4880',
        'SOD2',
        "Homozygous Val — fuller reduction in mitochondrial SOD2 import; strongest mitochondrial-redox case for CoQ10 support, which protects the same axis SOD2 maintains.",
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
        'Single ε4 allele — altered neuronal phospholipid handling and modestly accelerated cognitive aging; phosphatidylserine + omega-3 supplementation has shown memory benefit in this risk group.',
        ['CT', 'TC'],
        'APOE ε4 (one copy)',
        'https://pubmed.ncbi.nlm.nih.gov/20523044/',
        'TT',
      ),
      primarySnp(
        'rs429358',
        'APOE',
        'Two ε4 alleles — strongest cognitive-aging risk profile in our catalog; phosphatidylserine + omega-3 most relevant here.',
        ['CC'],
        'APOE ε4 (two copies)',
        'https://pubmed.ncbi.nlm.nih.gov/20523044/',
        'TT',
      ),
      primarySnp(
        'rs7412',
        'APOE',
        'Confirms ε4 (not ε2) by excluding any T allele at rs7412. Single-genotype gate co-condition for the APOE ε4 carrier rule.',
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
        "Heterozygous T-carrier — modestly reduced NAD(P)H-dependent quinone reduction.",
        ['CT', 'TC'],
        'NQO1 C609T (CT)',
        'https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2017.00595/full',
        'CC',
      ),
      primarySnp(
        'rs1800566',
        'NQO1',
        "Homozygous T — strongest reduction in NAD redox cycling; raising the case for NMN/NR to replenish NAD⁺ supply.",
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
        'One nonfunctional α-actinin-3 copy — modest additional creatine benefit over baseline, since fast-twitch fibers have partial phosphocreatine-buffering demand.',
        ['CT', 'TC'],
        'ACTN3 R577X (CT)',
        'https://pubmed.ncbi.nlm.nih.gov/31145768/',
        'CC',
      ),
      primarySnp(
        'rs1815739',
        'ACTN3',
        'Both α-actinin-3 copies nonfunctional (XX genotype) — strongest creatine benefit in our catalog, partly compensating for the deficit in fast-twitch fibers.',
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
        'Heterozygous Gly carrier — modestly blunted β2-adrenergic lipolytic signaling.',
        ['AG', 'GA'],
        'ADRB2 Arg16Gly (AG)',
        'https://pubmed.ncbi.nlm.nih.gov/24960039/',
        'AA',
      ),
      primarySnp(
        'rs1042713',
        'ADRB2',
        'Homozygous Gly16 — fuller blunting of lipolytic response, slowing fat mobilization during exercise; L-carnitine supports fatty-acid transport into mitochondria for oxidation.',
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
        'Heterozygous Ser carrier — modestly reduced PGC-1α coactivator activity at the mitochondrial-biogenesis program.',
        ['AG', 'GA'],
        'PPARGC1A Gly482Ser (AG)',
        'https://pubmed.ncbi.nlm.nih.gov/39766897/',
        'GG',
      ),
      primarySnp(
        'rs8192678',
        'PPARGC1A',
        'Homozygous Ser — fuller reduction in PGC-1α coactivator activity; PQQ stimulates the same mitochondrial-biogenesis axis.',
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
        'Lactase non-persistent — the lactase gene stays downregulated past childhood; supplemental lactase replaces what the gut no longer makes.',
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
        'Lactase non-persistent — adult lactose maldigestion typically reduces dairy intake; non-dairy calcium fills the calcium gap this dietary pattern creates.',
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
        'Heterozygous Met carrier — modestly reduced DAO enzymatic activity in plasma.',
        ['CT', 'TC'],
        'AOC1 Thr16Met (CT)',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC11054051/',
        'CC',
      ),
      primarySnp(
        'rs10156191',
        'AOC1',
        'Homozygous Met — fuller reduction in plasma DAO activity, slowing histamine clearance after histamine-rich meals.',
        ['TT'],
        'AOC1 Thr16Met (TT)',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC11054051/',
        'CC',
      ),
      primarySnp(
        'rs1049742',
        'AOC1',
        'Heterozygous Phe carrier — modestly reduced DAO production.',
        ['CT', 'TC'],
        'AOC1 Ser332Phe (CT)',
        'https://pmc.ncbi.nlm.nih.gov/articles/PMC11054051/',
        'CC',
      ),
      primarySnp(
        'rs1049742',
        'AOC1',
        'Homozygous Phe — fuller reduction in DAO production, compounding histamine-clearance deficiency when stacked with other AOC1 variants; supplemental DAO compensates pre-meal.',
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
        'Heterozygous H63D — mildly elevated intestinal iron absorption; supplemental iron not advised as a precaution.',
        ['CG', 'GC'],
        'HFE H63D (CG)',
        'https://www.nejm.org/doi/full/10.1056/NEJMoa073286',
        'CC',
      ),
      primarySnp(
        'rs1799945',
        'HFE',
        'Homozygous H63D — fuller elevation in iron absorption; long-term accumulation risk and clear case for avoiding supplemental iron.',
        ['GG'],
        'HFE H63D (GG)',
        'https://www.nejm.org/doi/full/10.1056/NEJMoa073286',
        'CC',
      ),
      primarySnp(
        'rs1800562',
        'HFE',
        'Heterozygous C282Y carrier — modestly elevated iron absorption; supplemental iron not advised as a precaution.',
        ['AG', 'GA'],
        'HFE C282Y (AG)',
        'https://www.nejm.org/doi/full/10.1056/NEJMoa073286',
        'GG',
      ),
      primarySnp(
        'rs1800562',
        'HFE',
        'Homozygous C282Y — overt hemochromatosis risk; supplemental iron must be avoided.',
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
