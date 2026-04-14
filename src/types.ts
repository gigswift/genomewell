export type RiskLevel = 'normal' | 'moderate' | 'elevated';

export interface SNPResult {
  rsid: string;
  chromosome: string;
  position: string;
  genotype: string;
  gene: string;
  topic: string;
  category: HealthCategory;
  riskLevel: RiskLevel;
  insight: string;
  recommendation: string;
}

export type HealthCategory =
  | 'Blood Disorders'
  | 'Kidney Health'
  | 'Cardiovascular'
  | 'Metabolic'
  | 'Nutrition & Vitamins'
  | 'Drug Metabolism'
  | 'Cancer Risk'
  | 'Cognitive Health'
  | 'Inflammation';

export type AppStep = 'landing' | 'upload' | 'parsing' | 'results';

export type SupplementPriority = 'essential' | 'beneficial' | 'optional';

export interface SupplementItem {
  name: string;
  dosage: string;
  timing: string;
  priority: SupplementPriority;
  reason: string;
}

export type FitnessPriority = 'essential' | 'beneficial' | 'optional';

export interface FitnessProtocol {
  area: string;
  guidance: string;
  priority: FitnessPriority;
  reason: string;
}

export const NARRATIVE_FALLBACK = '__NARRATIVE_FALLBACK__';

export interface RecommendationReport {
  snpResults: SNPResult[];
  supplementStack: SupplementItem[];
  fitnessProtocols: FitnessProtocol[];
  narrativeSummary: string;
}
