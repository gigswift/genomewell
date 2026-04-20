import { SUPPLEMENT_RULES } from '../engine/supplementRules';
import { CATEGORY_LABELS } from './supplementLabels';
import { getPartnerDisplayName } from './affiliateLinks';
import type {
  Genotype,
  PartnerOption,
  SNPReference,
  SupplementRecommendation,
} from '../types';
import type { DesignPriority } from '../components/ui';

export interface DesignCardSupplement {
  name: string;
  tag: string;
  priority: DesignPriority;
  dose: string;
  snps: string[];
  reason: string;
  partners: string[];
  partnerOptions: PartnerOption[];
}

const RULE_INDEX: Map<string, SNPReference[]> = new Map(
  SUPPLEMENT_RULES.map((r) => [r.supplement.name, r.primarySNPs]),
);

function mapPriority(
  rec: SupplementRecommendation,
): DesignPriority {
  if (rec.priority === 'skip') return 'avoid';
  if (rec.priority === 'gap') return 'gap';
  if (rec.partnerOptions.length === 0) return 'gap';
  if (rec.priority === 'essential') return 'essential';
  if (rec.priority === 'recommended') return 'recommended';
  return 'optional';
}

function shortEffect(effect: string): string {
  const emDash = effect.indexOf('—');
  if (emDash !== -1) return effect.slice(0, emDash).trim();
  if (effect.length <= 40) return effect;
  return effect.slice(0, 40).trim();
}

function labelSnp(
  rsid: string,
  primarySNPs: SNPReference[],
  snpMap: Map<string, Genotype>,
): string {
  const ref = primarySNPs.find((s) => s.rsid === rsid);
  const genotype = snpMap.get(rsid) ?? '';
  if (!ref) {
    return genotype ? `${rsid} (${genotype})` : rsid;
  }
  const label = shortEffect(ref.effect) || ref.gene;
  return genotype ? `${label} (${genotype})` : label;
}

function buildReason(rec: SupplementRecommendation): string {
  if (rec.reasoning.length === 0) {
    return 'Based on your matched variants in this pathway.';
  }
  const first = rec.reasoning[0];
  const colon = first.indexOf(':');
  if (colon !== -1) {
    return first.slice(colon + 1).trim();
  }
  return first;
}

export function toDesignCard(
  rec: SupplementRecommendation,
  snpMap: Map<string, Genotype>,
): DesignCardSupplement {
  const primarySNPs = RULE_INDEX.get(rec.supplement.name) ?? [];
  const snpLabels = rec.firedPrimary.length > 0
    ? rec.firedPrimary.map((rsid) => labelSnp(rsid, primarySNPs, snpMap))
    : primarySNPs.slice(0, 2).map((s) => s.gene);

  const priority = mapPriority(rec);
  const reason = priority === 'avoid'
    ? `Avoid — ${buildReason(rec)}`
    : buildReason(rec);

  return {
    name: rec.supplement.name,
    tag: CATEGORY_LABELS[rec.supplement.category],
    priority,
    dose: rec.dosage,
    snps: snpLabels,
    reason,
    partners: rec.partnerOptions.map((p) => getPartnerDisplayName(p.partner)),
    partnerOptions: rec.partnerOptions,
  };
}

export function toDesignCards(
  recs: SupplementRecommendation[],
  snpMap: Map<string, Genotype>,
): DesignCardSupplement[] {
  return recs.map((r) => toDesignCard(r, snpMap));
}
