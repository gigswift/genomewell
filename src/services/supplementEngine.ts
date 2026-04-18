import type {
  Genotype,
  SNPReference,
  SupplementConfidence,
  SupplementPriorityTier,
  SupplementRecommendation,
  SupplementRule,
} from '../types';

function firedRsids(
  refs: SNPReference[],
  snpMap: Map<string, Genotype>,
): { rsids: string[]; effects: string[] } {
  const rsids: string[] = [];
  const effects: string[] = [];
  for (const ref of refs) {
    const genotype = snpMap.get(ref.rsid);
    if (genotype && ref.riskGenotypes.includes(genotype)) {
      rsids.push(ref.rsid);
      effects.push(`${ref.gene} (${ref.rsid}, ${genotype}): ${ref.effect}`);
    }
  }
  return { rsids, effects };
}

function priorityFromCount(firedPrimaryCount: number): SupplementPriorityTier {
  if (firedPrimaryCount >= 2) return 'essential';
  if (firedPrimaryCount === 1) return 'recommended';
  return 'consider';
}

function confidenceFromTier(rule: SupplementRule): SupplementConfidence {
  return rule.evidenceTier === 'SNP-driven' ? 'high' : 'medium';
}

export function evaluate(
  rule: SupplementRule,
  snpMap: Map<string, Genotype>,
): SupplementRecommendation | null {
  const primary = firedRsids(rule.primarySNPs, snpMap);
  const supporting = firedRsids(rule.supportingSNPs, snpMap);

  // Haplotype gate (e.g. PS requires APOE E4): if present and fails, never recommend.
  if (rule.customGate && !rule.customGate(snpMap)) {
    return null;
  }

  // Default firing rule: if no gate is set, require at least one primary SNP fired.
  if (primary.rsids.length === 0 && !rule.customGate) {
    return null;
  }

  const dosage = rule.doseModulator
    ? rule.doseModulator(snpMap, rule.supplement.defaultDosage)
    : rule.supplement.defaultDosage;

  // Avoidance rules (Iron + HFE) always emit with priority='skip' regardless of fired count.
  const priority: SupplementPriorityTier = rule.avoidanceRule
    ? 'skip'
    : priorityFromCount(primary.rsids.length);

  const reasoning = [...primary.effects, ...supporting.effects];

  return {
    supplement: rule.supplement,
    priority,
    dosage,
    reasoning,
    firedPrimary: primary.rsids,
    firedSupporting: supporting.rsids,
    confidence: confidenceFromTier(rule),
    partnerOptions: rule.supplement.partnerOptions,
  };
}
