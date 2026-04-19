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
  skip: 3,
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
    flat.push(rec);
    grouped[rec.supplement.category].push(rec);
  }

  for (const cat of CATEGORY_ORDER) {
    grouped[cat].sort(
      (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority],
    );
  }

  return { flat, grouped };
}
