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

// Curated brands carried by HerbsPro (via Rakuten LinkShare). Adding a brand
// = add the slug here, the display name in affiliateLinks.ts, and an entry in
// GW_BRAND_META in components/ui.tsx.
export type Brand =
  | 'source-naturals'
  | 'solgar'
  | 'now-foods'
  | 'life-extension'
  | 'solaray'
  | 'jarrow-formulas'
  | 'bucked-up'
  | 'primaforce'
  | 'nutricost';

export interface BrandOption {
  brand: Brand;
  productSlug: string;
  productName: string;
  productUrl: string;
  priceDisplay: string;
  imageUrl: string;
}

export type SupplementCategory =
  | 'daily-wellness'
  | 'healthy-aging'
  | 'athletic-performance'
  | 'food-sensitivity';

export type SupplementPriorityTier =
  | 'essential'
  | 'recommended'
  | 'consider'
  | 'skip'
  | 'gap';

export type SupplementConfidence =
  | 'high'
  | 'medium'
  | 'flagged-conflict'
  | 'insufficient-data';

export interface SNPReference {
  rsid: string;
  gene: string;
  role: 'primary' | 'supporting';
  description: string;
  riskGenotypes: readonly string[];
}

export interface PrimarySNPReference extends SNPReference {
  role: 'primary';
  variantLabel: string;
  citationUrl: string;
  // Wild-type genotype shown to the user as "Normal:" on the card.
  referenceGenotype: string;
  // Set only on dual-strand SNPs where the parser may emit either strand
  // orientation (TRPM6 rs11144134, VDR BsmI rs1544410). The adapter picks
  // whichever reference shares a strand with the user's matched genotype.
  referenceGenotypeAlt?: string;
}

export interface FiredVariantDetail {
  ref: PrimarySNPReference;
  // The user's actual genotype that matched this entry's riskGenotypes.
  firedGenotype: string;
}

export interface Supplement {
  name: string;
  category: SupplementCategory;
  defaultDosage: string;
  brandOptions: BrandOption[];
  healthEffect: string;
  culturalContext?: string;
}

export type EvidenceTier = 'SNP-driven' | 'SNP-informed';

export interface SupplementRule {
  supplement: Supplement;
  evidenceTier: EvidenceTier;
  primarySNPs: PrimarySNPReference[];
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
  firedPrimaryDetails: FiredVariantDetail[];
  firedSupporting: string[];
  confidence: SupplementConfidence;
  brandOptions: BrandOption[];
}

export type GroupedRecommendations = Record<SupplementCategory, SupplementRecommendation[]>;
