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

export const NARRATIVE_FALLBACK = '__NARRATIVE_FALLBACK__';

export interface RecommendationReport {
  grouped: GroupedRecommendations;
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
  riskGenotypes: readonly string[];
}

export interface Supplement {
  name: string;
  category: SupplementCategory;
  defaultDosage: string;
  partnerOptions: PartnerOption[];
}

export type EvidenceTier = 'SNP-driven' | 'SNP-informed';

export interface SupplementRule {
  supplement: Supplement;
  evidenceTier: EvidenceTier;
  primarySNPs: SNPReference[];
  supportingSNPs: SNPReference[];
  // Skip-only rules (e.g. Iron + HFE carrier) force priority = 'skip' when any primary fires.
  avoidanceRule?: boolean;
  // Haplotype gate — if present, a rule only fires when this predicate is true
  // (used by PS which requires APOE E4 haplotype across rs429358 + rs7412).
  customGate?: (snpMap: Map<string, Genotype>) => boolean;
  // Dose modulator — applied after firing to bump dosage for specific genotypes
  // (e.g. Vitamin D GC minor allele → 5000 IU).
  doseModulator?: (snpMap: Map<string, Genotype>, defaultDosage: string) => string;
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

export type GroupedRecommendations = Record<SupplementCategory, SupplementRecommendation[]>;
