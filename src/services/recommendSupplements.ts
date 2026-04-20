import { SUPPLEMENT_RULES } from '../engine/supplementRules';
import { CATEGORY_ORDER } from '../lib/supplementLabels';
import type {
  Genotype,
  GroupedRecommendations,
  SupplementPriorityTier,
  SupplementRecommendation,
} from '../types';
import { evaluate } from './supplementEngine';

const PRIORITY_ORDER: Record<SupplementPriorityTier, number> = {
  essential: 0,
  recommended: 1,
  consider: 2,
  gap: 3,
  skip: 4,
};

function emptyGrouped(): GroupedRecommendations {
  return {
    'daily-wellness': [],
    'healthy-aging': [],
    'body-optimization': [],
    'food-sensitivity': [],
  };
}

export function recommendSupplements(
  snpMap: Map<string, Genotype>,
): {
  flat: SupplementRecommendation[];
  grouped: GroupedRecommendations;
} {
  const flat: SupplementRecommendation[] = [];
  const grouped = emptyGrouped();

  for (const rule of SUPPLEMENT_RULES) {
    const rec = evaluate(rule, snpMap);
    if (!rec) continue;
    // Remap fired supplements with no partner to 'gap' so the UI shows the
    // "no shop yet" state instead of hiding them. Avoidance ('skip') rules
    // are preserved — they're a warning, not a commerce gap.
    const gapped: SupplementRecommendation =
      rec.priority !== 'skip' && rec.partnerOptions.length === 0
        ? { ...rec, priority: 'gap' }
        : rec;
    flat.push(gapped);
    grouped[gapped.supplement.category].push(gapped);
  }

  for (const cat of CATEGORY_ORDER) {
    grouped[cat].sort(
      (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
    );
  }

  return { flat, grouped };
}
