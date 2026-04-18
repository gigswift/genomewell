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

export type Genotype = string;

export interface SNPInput {
  rsid: string;
  genotype: Genotype;
}

export type Partner = 'thorne' | 'biotrust' | 'organifi';

export interface PartnerOption {
  partner: Partner;
  productSlug: string;
  displayName?: string;
}

export type SupplementCategory =
  | 'daily-wellness'
  | 'healthy-aging'
  | 'body-optimization'
  | 'food-sensitivity';

export type SupplementPriorityTier =
  | 'essential'
  | 'recommended'
  | 'consider'
  | 'skip';

export type SupplementConfidence =
  | 'high'
  | 'medium'
  | 'flagged-conflict'
  | 'insufficient-data';

export interface SNPReference {
  rsid: string;
  gene: string;
  role: 'primary' | 'supporting';
  effect: string;
}

export interface Supplement {
  name: string;
  category: SupplementCategory;
  defaultDosage: string;
  partnerOptions: PartnerOption[];
}

export interface SupplementRule {
  supplement: Supplement;
  primarySNPs: SNPReference[];
  supportingSNPs: SNPReference[];
  evaluate(snpMap: Map<string, Genotype>): SupplementRecommendation | null;
}

export interface SupplementRecommendation {
  supplement: Supplement;
  priority: SupplementPriorityTier;
  dosage: string;
  reasoning: string[];
  firedPrimary: string[];
  firedSupporting: string[];
  confidence: SupplementConfidence;
  partnerOptions: PartnerOption[];
}
