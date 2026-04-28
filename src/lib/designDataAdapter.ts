import { CATEGORY_LABELS } from './supplementLabels';
import { getPartnerDisplayName } from './affiliateLinks';
import type {
  PartnerOption,
  SupplementRecommendation,
} from '../types';
import type { DesignPriority } from '../components/ui';

export interface DesignCardVariant {
  variantLabel: string;
  description: string;
  citationUrl: string;
}

export interface DesignCardSupplement {
  name: string;
  tag: string;
  priority: DesignPriority;
  dose: string;
  variants: DesignCardVariant[];
  reason: string;
  healthEffect: string;
  culturalContext?: string;
  partners: string[];
  partnerOptions: PartnerOption[];
}

function mapPriority(rec: SupplementRecommendation): DesignPriority {
  if (rec.priority === 'skip') return 'avoid';
  if (rec.priority === 'gap') return 'gap';
  if (rec.partnerOptions.length === 0) return 'gap';
  if (rec.priority === 'essential') return 'essential';
  if (rec.priority === 'recommended') return 'recommended';
  return 'optional';
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

function buildVariants(rec: SupplementRecommendation): DesignCardVariant[] {
  const seen = new Set<string>();
  const variants: DesignCardVariant[] = [];
  for (const ref of rec.firedPrimaryDetails) {
    if (seen.has(ref.variantLabel)) continue;
    seen.add(ref.variantLabel);
    variants.push({
      variantLabel: ref.variantLabel,
      description: ref.description,
      citationUrl: ref.citationUrl,
    });
  }
  return variants;
}

export function toDesignCard(rec: SupplementRecommendation): DesignCardSupplement {
  const priority = mapPriority(rec);
  const reason = priority === 'avoid'
    ? `Avoid — ${buildReason(rec)}`
    : buildReason(rec);

  return {
    name: rec.supplement.name,
    tag: CATEGORY_LABELS[rec.supplement.category],
    priority,
    dose: rec.dosage,
    variants: buildVariants(rec),
    reason,
    healthEffect: rec.supplement.healthEffect,
    culturalContext: rec.supplement.culturalContext,
    partners: rec.partnerOptions.map((p) => getPartnerDisplayName(p.partner)),
    partnerOptions: rec.partnerOptions,
  };
}

export function toDesignCards(recs: SupplementRecommendation[]): DesignCardSupplement[] {
  return recs.map((r) => toDesignCard(r));
}
