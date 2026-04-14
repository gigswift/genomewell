export interface SNPResult {
  rsid: string;
  chromosome: string;
  position: string;
  genotype: string;
  gene: string;
  trait: string;
  category: HealthCategory;
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

export type AppState = 'upload' | 'parsing' | 'generating' | 'results' | 'error';
