import type {
  Genotype,
  SupplementRecommendation,
  SupplementRule,
} from '../types';

export function evaluate(
  rule: SupplementRule,
  snps: Map<string, Genotype>,
): SupplementRecommendation | null {
  void rule;
  void snps;
  return null;
}
