import type { HealthCategory } from './types';

export interface SNPDefinition {
  gene: string;
  trait: string;
  category: HealthCategory;
}

export const SNP_CATALOG: Record<string, SNPDefinition> = {
  // Blood Disorders
  rs334: { gene: 'HBB', trait: 'Sickle Cell Trait (HbS mutation)', category: 'Blood Disorders' },
  rs11886868: { gene: 'BCL11A', trait: 'Fetal Hemoglobin Production', category: 'Blood Disorders' },

  // Kidney Health — APOL1 variants are strongly associated with kidney disease in Black Americans
  rs73885319: { gene: 'APOL1', trait: 'Kidney Disease Risk (G1 variant — S342G)', category: 'Kidney Health' },
  rs60910145: { gene: 'APOL1', trait: 'Kidney Disease Risk (G1 variant — I384M)', category: 'Kidney Health' },

  // Cardiovascular / Hypertension
  rs699: { gene: 'AGT', trait: 'Hypertension Risk (Angiotensinogen)', category: 'Cardiovascular' },
  rs4961: { gene: 'ADD1', trait: 'Salt-Sensitive Hypertension', category: 'Cardiovascular' },
  rs5186: { gene: 'AGTR1', trait: 'Blood Pressure Regulation (Angiotensin II receptor)', category: 'Cardiovascular' },
  rs1799983: { gene: 'NOS3', trait: 'Nitric Oxide Synthesis & Vascular Health', category: 'Cardiovascular' },
  rs662: { gene: 'PON1', trait: 'Oxidative Stress & Cardiovascular Risk', category: 'Cardiovascular' },
  rs1800795: { gene: 'IL6', trait: 'Interleukin-6 & Cardiovascular Inflammation', category: 'Cardiovascular' },

  // Metabolic
  rs7903146: { gene: 'TCF7L2', trait: 'Type 2 Diabetes Risk', category: 'Metabolic' },
  rs1801133: { gene: 'MTHFR', trait: 'Folate Metabolism (C677T) — Homocysteine Levels', category: 'Metabolic' },
  rs1801131: { gene: 'MTHFR', trait: 'Folate Metabolism (A1298C) — B-Vitamin Processing', category: 'Metabolic' },

  // Nutrition & Vitamins
  rs4988235: { gene: 'LCT', trait: 'Lactase Persistence (Dairy Digestion)', category: 'Nutrition & Vitamins' },
  rs2282679: { gene: 'GC', trait: 'Vitamin D Binding Protein', category: 'Nutrition & Vitamins' },
  rs10741657: { gene: 'CYP2R1', trait: 'Vitamin D Hydroxylation', category: 'Nutrition & Vitamins' },
  rs12785878: { gene: 'DHCR7', trait: 'Vitamin D Synthesis from Cholesterol', category: 'Nutrition & Vitamins' },

  // Drug Metabolism (Pharmacogenomics)
  rs4244285: { gene: 'CYP2C19', trait: 'Clopidogrel & Antidepressant Metabolism', category: 'Drug Metabolism' },
  rs1799853: { gene: 'CYP2C9', trait: 'Warfarin & NSAID Metabolism', category: 'Drug Metabolism' },
  rs1057910: { gene: 'CYP2C9', trait: 'Warfarin & NSAID Metabolism', category: 'Drug Metabolism' },
  rs3892097: { gene: 'CYP2D6', trait: 'Antidepressant & Opioid Metabolism', category: 'Drug Metabolism' },
  rs1065852: { gene: 'CYP2D6', trait: 'Drug Metabolism (CYP2D6*10)', category: 'Drug Metabolism' },
  rs9923231: { gene: 'VKORC1', trait: 'Warfarin Sensitivity', category: 'Drug Metabolism' },

  // Cancer Risk
  rs16901979: { gene: '8q24', trait: 'Prostate Cancer Risk', category: 'Cancer Risk' },
  rs6983267: { gene: '8q24', trait: 'Colorectal & Prostate Cancer Risk', category: 'Cancer Risk' },

  // Cognitive Health
  rs429358: { gene: 'APOE', trait: "Alzheimer's Risk & Lipid Metabolism (APOE genotype, part 1)", category: 'Cognitive Health' },
  rs7412: { gene: 'APOE', trait: "Alzheimer's Risk & Lipid Metabolism (APOE genotype, part 2)", category: 'Cognitive Health' },
  rs4680: { gene: 'COMT', trait: 'Dopamine Metabolism & Stress Response (Val158Met)', category: 'Cognitive Health' },
  rs6265: { gene: 'BDNF', trait: 'Brain-Derived Neurotrophic Factor (Val66Met)', category: 'Cognitive Health' },

  // Inflammation
  rs1800629: { gene: 'TNF', trait: 'TNF-Alpha Inflammatory Response', category: 'Inflammation' },
  rs1800587: { gene: 'IL1A', trait: 'Interleukin-1 Alpha Inflammation', category: 'Inflammation' },
};
