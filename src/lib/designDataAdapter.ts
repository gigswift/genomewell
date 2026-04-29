import { CATEGORY_LABELS } from './supplementLabels';
import { getPartnerDisplayName } from './affiliateLinks';
import type {
  PartnerOption,
  PrimarySNPReference,
  SupplementRecommendation,
} from '../types';
import type { DesignPriority } from '../components/ui';

export interface DesignCardVariant {
  variantLabel: string;
  description: string;
  citationUrl: string;
  referenceGenotype: string;
  firedGenotype: string;
}

export interface DesignCardSupplement {
  name: string;
  tag: string;
  priority: DesignPriority;
  dose: string;
  variants: DesignCardVariant[];
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

// For dual-strand SNPs (TRPM6, VDR BsmI), the parser may report either strand
// orientation. Pick whichever stored reference shares a strand with the user's
// matched genotype so the card's "Normal: X · Yours: Y" line renders consistently.
function pickReference(ref: PrimarySNPReference, firedGenotype: string): string {
  const alt = ref.referenceGenotypeAlt;
  if (!alt) return ref.referenceGenotype;
  const firedAlleles = new Set(firedGenotype.split(''));
  const primaryAlleles = new Set(ref.referenceGenotype.split(''));
  const altAlleles = new Set(alt.split(''));
  // Primary ref shares a strand with the fired genotype if any allele overlaps.
  for (const a of firedAlleles) {
    if (primaryAlleles.has(a)) return ref.referenceGenotype;
    if (altAlleles.has(a)) return alt;
  }
  return ref.referenceGenotype;
}

function buildVariants(rec: SupplementRecommendation): DesignCardVariant[] {
  const seen = new Set<string>();
  const variants: DesignCardVariant[] = [];
  for (const detail of rec.firedPrimaryDetails) {
    const { ref, firedGenotype } = detail;
    if (seen.has(ref.rsid)) continue;
    seen.add(ref.rsid);
    variants.push({
      variantLabel: ref.variantLabel,
      description: ref.description,
      citationUrl: ref.citationUrl,
      referenceGenotype: pickReference(ref, firedGenotype),
      firedGenotype,
    });
  }
  return variants;
}

export function toDesignCard(rec: SupplementRecommendation): DesignCardSupplement {
  return {
    name: rec.supplement.name,
    tag: CATEGORY_LABELS[rec.supplement.category],
    priority: mapPriority(rec),
    dose: rec.dosage,
    variants: buildVariants(rec),
    healthEffect: rec.supplement.healthEffect,
    culturalContext: rec.supplement.culturalContext,
    partners: rec.partnerOptions.map((p) => getPartnerDisplayName(p.partner)),
    partnerOptions: rec.partnerOptions,
  };
}

export function toDesignCards(recs: SupplementRecommendation[]): DesignCardSupplement[] {
  return recs.map((r) => toDesignCard(r));
}
