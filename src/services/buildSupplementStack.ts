import type { SNPResult, SupplementItem } from '../types';

export function buildSupplementStack(snps: SNPResult[]): SupplementItem[] {
  const supplements: SupplementItem[] = [];
  const added = new Set<string>();

  const moderateOrElevated = new Set(
    snps.filter((s) => s.riskLevel !== 'normal').map((s) => s.rsid),
  );

  function add(item: SupplementItem) {
    if (!added.has(item.name)) {
      added.add(item.name);
      supplements.push(item);
    }
  }

  // ── Vitamin D stack ─────────────────────────────────────────────────
  const vitDVariants = ['rs2282679', 'rs10741657', 'rs12785878'];
  const hasVitDRisk = vitDVariants.some((r) => moderateOrElevated.has(r));
  if (hasVitDRisk) {
    const severe = vitDVariants.some(
      (r) => snps.find((s) => s.rsid === r)?.riskLevel === 'elevated',
    );
    add({
      name: 'Vitamin D3',
      dosage: severe ? '4,000-5,000 IU' : '2,000-3,000 IU',
      timing: 'Morning with fat-containing meal',
      priority: 'essential',
      reason:
        'Your genetic variants reduce vitamin D synthesis and/or binding — supplementation is more reliable than sun exposure.',
    });
    add({
      name: 'Vitamin K2 (MK-7)',
      dosage: '100-200 mcg',
      timing: 'With vitamin D and fat',
      priority: 'essential',
      reason:
        'K2 directs calcium to bones rather than arteries when supplementing vitamin D — essential pairing.',
    });
  }

  // ── MTHFR / Methylation ────────────────────────────────────────────
  const hasMTHFR = ['rs1801133', 'rs1801131'].some((r) =>
    moderateOrElevated.has(r),
  );
  if (hasMTHFR) {
    add({
      name: 'Methylated Folate (5-MTHF)',
      dosage: '400-800 mcg',
      timing: 'Morning with water',
      priority: 'essential',
      reason:
        'Your MTHFR variant reduces ability to convert synthetic folic acid — methylated folate bypasses this enzyme step.',
    });
    add({
      name: 'Methylated B12 (Methylcobalamin)',
      dosage: '1,000 mcg',
      timing: 'Morning, sublingual or capsule',
      priority: 'essential',
      reason:
        'Methylated B12 works synergistically with 5-MTHF for healthy homocysteine metabolism and DNA synthesis.',
    });
  }

  // ── Cardiovascular / Magnesium ─────────────────────────────────────
  const hasCardio = ['rs1799983', 'rs662', 'rs699', 'rs4961'].some((r) =>
    moderateOrElevated.has(r),
  );
  if (hasCardio) {
    add({
      name: 'Magnesium Glycinate',
      dosage: '300-400 mg',
      timing: 'Evening with dinner',
      priority: 'essential',
      reason:
        'Magnesium supports blood pressure regulation, vascular relaxation, and is commonly depleted in modern diets.',
    });
  }

  // ── NOS3 / Nitric oxide support ────────────────────────────────────
  if (moderateOrElevated.has('rs1799983')) {
    add({
      name: 'L-Citrulline',
      dosage: '3,000-6,000 mg',
      timing: 'Pre-workout or morning',
      priority: 'beneficial',
      reason:
        'L-citrulline is a nitric oxide precursor that helps compensate for reduced NOS3 enzyme activity.',
    });
  }

  // ── Omega-3 (PON1 or inflammation) ─────────────────────────────────
  const hasInflammation = ['rs1800629', 'rs1800587', 'rs1800795'].some((r) =>
    moderateOrElevated.has(r),
  );
  if (moderateOrElevated.has('rs662') || hasInflammation) {
    add({
      name: 'Omega-3 (EPA/DHA)',
      dosage: '2,000-3,000 mg',
      timing: 'With largest meal',
      priority: 'essential',
      reason:
        'EPA/DHA reduce oxidized LDL, support PON1 activity, and lower pro-inflammatory cytokine production.',
    });
  }

  // ── Curcumin (inflammation) ────────────────────────────────────────
  if (hasInflammation) {
    add({
      name: 'Curcumin (with Piperine)',
      dosage: '500-1,000 mg curcumin',
      timing: 'With fat-containing meal',
      priority: 'beneficial',
      reason:
        'Curcumin is a potent NF-kB inhibitor that helps modulate TNF-alpha and IL-1 inflammatory pathways.',
    });
  }

  // ── APOE / Cognitive ───────────────────────────────────────────────
  if (
    moderateOrElevated.has('rs429358') ||
    moderateOrElevated.has('rs7412')
  ) {
    add({
      name: 'Phosphatidylserine',
      dosage: '100 mg (3x daily)',
      timing: 'With meals',
      priority: 'beneficial',
      reason:
        'Supports neuronal membrane integrity and cognitive function — FDA allows a qualified health claim.',
    });
    add({
      name: "Lion's Mane Mushroom",
      dosage: '500-1,000 mg',
      timing: 'Morning',
      priority: 'beneficial',
      reason:
        'Stimulates NGF (nerve growth factor) production, supporting neuroplasticity independent of APOE status.',
    });
  }

  // ── BDNF / DHA ─────────────────────────────────────────────────────
  if (moderateOrElevated.has('rs6265')) {
    add({
      name: 'Omega-3 DHA (high-dose)',
      dosage: '1,000-2,000 mg DHA',
      timing: 'With largest meal',
      priority: 'beneficial',
      reason:
        'DHA is a structural component of neuronal membranes and supports BDNF expression — important with Val66Met variant.',
    });
  }

  // ── COMT ───────────────────────────────────────────────────────────
  if (moderateOrElevated.has('rs4680')) {
    add({
      name: 'Magnesium L-Threonate',
      dosage: '2,000 mg (144 mg elemental)',
      timing: 'Evening before bed',
      priority: 'optional',
      reason:
        'Crosses the blood-brain barrier and supports prefrontal cortex dopamine regulation relevant to COMT genotype.',
    });
  }

  // ── TCF7L2 / Metabolic ────────────────────────────────────────────
  if (moderateOrElevated.has('rs7903146')) {
    add({
      name: 'Berberine',
      dosage: '500 mg (2-3x daily)',
      timing: 'Before meals',
      priority: 'beneficial',
      reason:
        'Activates AMPK and supports insulin sensitivity — relevant for TCF7L2-associated diabetes risk.',
    });
    add({
      name: 'Chromium Picolinate',
      dosage: '200-400 mcg',
      timing: 'With meals',
      priority: 'optional',
      reason:
        'Enhances insulin receptor sensitivity, supporting blood sugar regulation.',
    });
  }

  // ── Probiotics (inflammation or MTHFR) ─────────────────────────────
  if (hasInflammation || hasMTHFR) {
    add({
      name: 'Probiotic (Multi-strain)',
      dosage: '10-50 billion CFU',
      timing: 'Morning on empty stomach',
      priority: 'beneficial',
      reason:
        'Gut microbiome health modulates systemic inflammation and B-vitamin synthesis from diet.',
    });
  }

  return supplements;
}
