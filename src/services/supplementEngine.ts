import type {
  FiredVariantDetail,
  Genotype,
  PrimarySNPReference,
  SNPReference,
  SupplementConfidence,
  SupplementPriorityTier,
  SupplementRecommendation,
  SupplementRule,
} from '../types';

interface FiredPrimary {
  fired: FiredVariantDetail[];
  rsids: string[];
  uniqueRsids: string[];
  descriptions: string[];
}

function firedPrimary(
  refs: PrimarySNPReference[],
  snpMap: Map<string, Genotype>,
): FiredPrimary {
  const fired: FiredVariantDetail[] = [];
  const rsids: string[] = [];
  const descriptions: string[] = [];
  for (const ref of refs) {
    const genotype = snpMap.get(ref.rsid);
    if (genotype && ref.riskGenotypes.includes(genotype)) {
      fired.push({ ref, firedGenotype: genotype });
      rsids.push(ref.rsid);
      descriptions.push(`${ref.gene} (${ref.rsid}, ${genotype}): ${ref.description}`);
    }
  }
  // Deduplicate by rsid for priority calculation: a single rsid's per-genotype split
  // can only ever fire one entry per user (entries' riskGenotypes are disjoint by
  // construction), but if the catalog ever grows overlapping entries this keeps
  // priority counting correct.
  const uniqueRsids = Array.from(new Set(rsids));
  return { fired, rsids, uniqueRsids, descriptions };
}

function firedSupporting(
  refs: SNPReference[],
  snpMap: Map<string, Genotype>,
): { rsids: string[]; descriptions: string[] } {
  const rsids: string[] = [];
  const descriptions: string[] = [];
  for (const ref of refs) {
    const genotype = snpMap.get(ref.rsid);
    if (genotype && ref.riskGenotypes.includes(genotype)) {
      rsids.push(ref.rsid);
      descriptions.push(`${ref.gene} (${ref.rsid}, ${genotype}): ${ref.description}`);
    }
  }
  return { rsids, descriptions };
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
  const primary = firedPrimary(rule.primarySNPs, snpMap);
  const supporting = firedSupporting(rule.supportingSNPs, snpMap);

  // Haplotype gate (e.g. PS requires APOE E4): if present and fails, never recommend.
  if (rule.customGate && !rule.customGate(snpMap)) {
    return null;
  }

  // Default firing rule: if no gate is set, require at least one primary SNP fired.
  if (primary.uniqueRsids.length === 0 && !rule.customGate) {
    return null;
  }

  const dosage = rule.doseModulator
    ? rule.doseModulator(snpMap, rule.supplement.defaultDosage)
    : rule.supplement.defaultDosage;

  // Avoidance rules (Iron + HFE) always emit with priority='skip' regardless of fired count.
  const priority: SupplementPriorityTier = rule.avoidanceRule
    ? 'skip'
    : priorityFromCount(primary.uniqueRsids.length);

  const reasoning = [...primary.descriptions, ...supporting.descriptions];

  return {
    supplement: rule.supplement,
    priority,
    dosage,
    reasoning,
    firedPrimary: primary.uniqueRsids,
    firedPrimaryDetails: primary.fired,
    firedSupporting: supporting.rsids,
    confidence: confidenceFromTier(rule),
    partnerOptions: rule.supplement.partnerOptions,
  };
}
