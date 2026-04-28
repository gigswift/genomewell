import type {
  Genotype,
  SNPReference,
  SupplementConfidence,
  SupplementPriorityTier,
  SupplementRecommendation,
  SupplementRule,
} from '../types';

function firedRefs<T extends SNPReference>(
  refs: T[],
  snpMap: Map<string, Genotype>,
): { fired: T[]; rsids: string[]; descriptions: string[] } {
  const fired: T[] = [];
  const rsids: string[] = [];
  const descriptions: string[] = [];
  for (const ref of refs) {
    const genotype = snpMap.get(ref.rsid);
    if (genotype && ref.riskGenotypes.includes(genotype)) {
      fired.push(ref);
      rsids.push(ref.rsid);
      descriptions.push(`${ref.gene} (${ref.rsid}, ${genotype}): ${ref.description}`);
    }
  }
  return { fired, rsids, descriptions };
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
  const primary = firedRefs(rule.primarySNPs, snpMap);
  const supporting = firedRefs(rule.supportingSNPs, snpMap);

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

  const reasoning = [...primary.descriptions, ...supporting.descriptions];

  return {
    supplement: rule.supplement,
    priority,
    dosage,
    reasoning,
    firedPrimary: primary.rsids,
    firedPrimaryDetails: primary.fired,
    firedSupporting: supporting.rsids,
    confidence: confidenceFromTier(rule),
    partnerOptions: rule.supplement.partnerOptions,
  };
}
