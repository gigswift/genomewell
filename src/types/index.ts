export type Genotype = string;
export type RiskLevel = 'normal' | 'moderate' | 'elevated';
export type Category = 'Nutrition & Supplements' | 'Fitness & Recovery' | 'Metabolic Health' | 'Vitamin & Mineral Absorption';

export interface SNPResult { rsid: string; gene: string; topic: string; category: Category; genotype: Genotype; risk: RiskLevel; insight: string; recommendation: string; }
export interface ParsedDNA { snpMap: Record<string, Genotype>; platform: '23andMe' | 'AncestryDNA' | 'Unknown'; totalSNPs: number; coveragePercent: number; }
export interface UserProfile { goals: string[]; parsedDNA: ParsedDNA; }
export interface RecommendationReport { snpResults: SNPResult[]; narrativeSummary: string; supplementStack: SupplementRecommendation[]; fitnessProtocol: FitnessRecommendation[]; }
export interface SupplementRecommendation { name: string; dosage: string; timing: string; reason: string; priority: 'essential' | 'beneficial' | 'optional'; }
export interface FitnessRecommendation { area: string; guidance: string; reason: string; priority: 'essential' | 'beneficial' | 'optional'; }
