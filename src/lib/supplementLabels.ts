import type { SupplementCategory } from '../types';

export const CATEGORY_LABELS: Record<SupplementCategory, string> = {
  'daily-wellness': 'Daily Wellness',
  'healthy-aging': 'Healthy Aging',
  'athletic-performance': 'Athletic Performance',
  'food-sensitivity': 'Food Sensitivity',
};

export const CATEGORY_ORDER: SupplementCategory[] = [
  'daily-wellness',
  'healthy-aging',
  'athletic-performance',
  'food-sensitivity',
];
