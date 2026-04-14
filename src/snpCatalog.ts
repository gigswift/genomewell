import type { HealthCategory, RiskLevel } from './types';

export interface SNPDefinition {
  gene: string;
  topic: string;
  category: HealthCategory;
  elevatedGenotypes: readonly string[];
  moderateGenotypes: readonly string[];
  insights: {
    readonly normal: string;
    readonly moderate: string;
    readonly elevated: string;
  };
  recommendation: string;
}

export function getRiskLevel(genotype: string, def: SNPDefinition): RiskLevel {
  if (def.elevatedGenotypes.includes(genotype)) return 'elevated';
  if (def.moderateGenotypes.includes(genotype)) return 'moderate';
  return 'normal';
}

export const SNP_CATALOG: Record<string, SNPDefinition> = {
  // ── Blood Disorders ────────────────────────────────────────────────────
  rs334: {
    gene: 'HBB',
    topic: 'Sickle Cell Trait (HbS mutation)',
    category: 'Blood Disorders',
    elevatedGenotypes: ['TT'],
    moderateGenotypes: ['AT', 'TA'],
    insights: {
      normal: 'No HbS alleles detected — standard hemoglobin structure.',
      moderate: 'You carry one HbS allele (sickle cell trait). Carriers are typically healthy but may experience symptoms under extreme hypoxia or severe dehydration.',
      elevated: 'Your genotype indicates two copies of an HBB variant. Discuss with a hematologist to confirm hemoglobin status and appropriate monitoring.',
    },
    recommendation: 'Stay well hydrated, avoid extreme altitude or dehydration during intense exercise, and get routine CBC annually.',
  },

  rs11886868: {
    gene: 'BCL11A',
    topic: 'Fetal Hemoglobin Production',
    category: 'Blood Disorders',
    elevatedGenotypes: ['AA'],
    moderateGenotypes: ['AC', 'CA'],
    insights: {
      normal: 'Your BCL11A variant supports typical fetal hemoglobin (HbF) production, which can moderate hemoglobin S effects.',
      moderate: 'One BCL11A variant allele may moderately affect fetal hemoglobin production — relevant if you also carry HBB variants.',
      elevated: 'Your BCL11A genotype is associated with reduced fetal hemoglobin production, which can influence severity if sickle cell variants are present.',
    },
    recommendation: 'If you carry HBB variants, discuss your BCL11A genotype with a hematologist — fetal hemoglobin levels significantly modify sickle cell outcomes.',
  },

  // ── Kidney Health ──────────────────────────────────────────────────────
  rs73885319: {
    gene: 'APOL1',
    topic: 'Kidney Disease Risk (G1 variant — S342G)',
    category: 'Kidney Health',
    elevatedGenotypes: ['AA'],
    moderateGenotypes: ['AG', 'GA'],
    insights: {
      normal: 'No APOL1 G1 risk alleles detected at this position — kidney disease risk from this variant is not elevated.',
      moderate: 'One APOL1 G1 (S342G) allele detected. Single-copy risk is generally low but annual kidney function monitoring is wise.',
      elevated: 'Two APOL1 G1 (S342G) alleles detected — significantly increases risk for FSGS in Black Americans. Discuss with a nephrologist.',
    },
    recommendation: 'Monitor blood pressure closely, limit NSAID use, stay well hydrated, and check kidney function (eGFR and urine protein) annually.',
  },

  rs60910145: {
    gene: 'APOL1',
    topic: 'Kidney Disease Risk (G1 variant — I384M)',
    category: 'Kidney Health',
    elevatedGenotypes: ['CC'],
    moderateGenotypes: ['AC', 'CA'],
    insights: {
      normal: 'No APOL1 G1 (I384M) risk alleles detected — kidney disease risk from this position is not elevated.',
      moderate: 'One APOL1 G1 I384M allele detected. In isolation the risk is low, but combined with other APOL1 variants, monitoring is recommended.',
      elevated: 'Two APOL1 G1 I384M alleles detected. Combined with S342G variants, this significantly elevates kidney disease risk.',
    },
    recommendation: 'Annual kidney function labs are important. Limit protein intake if eGFR declines and avoid nephrotoxic medications without physician guidance.',
  },

  // ── Cardiovascular ────────────────────────────────────────────────────
  rs699: {
    gene: 'AGT',
    topic: 'Hypertension Risk (Angiotensinogen)',
    category: 'Cardiovascular',
    elevatedGenotypes: ['CC'],
    moderateGenotypes: ['TC', 'CT'],
    insights: {
      normal: 'Your AGT variant is associated with typical angiotensinogen levels and lower genetically-driven hypertension risk.',
      moderate: 'One AGT risk allele may modestly raise angiotensinogen levels, contributing to blood pressure challenges.',
      elevated: 'Your AGT genotype is associated with higher angiotensinogen levels — a known contributor to hypertension, particularly prevalent in Black Americans.',
    },
    recommendation: 'Follow a low-sodium DASH diet, maintain a healthy weight, prioritize regular aerobic exercise, and monitor blood pressure at least monthly.',
  },

  rs4961: {
    gene: 'ADD1',
    topic: 'Salt-Sensitive Hypertension',
    category: 'Cardiovascular',
    elevatedGenotypes: ['GG'],
    moderateGenotypes: ['TG', 'GT'],
    insights: {
      normal: 'Your ADD1 variant suggests typical salt sensitivity — sodium restriction is still beneficial but less genetically urgent.',
      moderate: 'One ADD1 risk allele indicates moderately increased salt sensitivity; your blood pressure is more responsive to dietary sodium.',
      elevated: 'Your ADD1 genotype is strongly associated with salt-sensitive hypertension — sodium intake has an amplified effect on your blood pressure.',
    },
    recommendation: 'Target sodium under 1,500 mg/day. Increase potassium-rich foods (sweet potatoes, plantains, collard greens) and track blood pressure alongside sodium intake.',
  },

  rs5186: {
    gene: 'AGTR1',
    topic: 'Blood Pressure Regulation (Angiotensin II receptor)',
    category: 'Cardiovascular',
    elevatedGenotypes: ['CC'],
    moderateGenotypes: ['AC', 'CA'],
    insights: {
      normal: 'Your AGTR1 variant indicates typical angiotensin II receptor sensitivity — standard blood pressure management applies.',
      moderate: 'One AGTR1 risk allele may moderately affect how your body responds to angiotensin II, a key blood pressure hormone.',
      elevated: 'Your AGTR1 genotype is associated with increased angiotensin II receptor sensitivity, amplifying hypertensive responses to stress and sodium.',
    },
    recommendation: 'Stress management is especially important. Regular meditation, breathwork, or yoga combined with a heart-healthy diet support optimal blood pressure.',
  },

  rs1799983: {
    gene: 'NOS3',
    topic: 'Nitric Oxide Synthesis & Vascular Health',
    category: 'Cardiovascular',
    elevatedGenotypes: ['TT'],
    moderateGenotypes: ['GT', 'TG'],
    insights: {
      normal: 'Your NOS3 variant supports healthy nitric oxide production, promoting good blood vessel dilation and circulation.',
      moderate: 'One NOS3 risk allele may modestly reduce nitric oxide production, affecting blood vessel elasticity.',
      elevated: 'Your NOS3 genotype is associated with reduced nitric oxide synthase activity, impairing vasodilation and increasing cardiovascular risk.',
    },
    recommendation: 'Boost nitric oxide naturally: eat nitrate-rich foods (beets, leafy greens), exercise regularly, and consider L-citrulline supplementation.',
  },

  rs662: {
    gene: 'PON1',
    topic: 'Oxidative Stress & Cardiovascular Risk',
    category: 'Cardiovascular',
    elevatedGenotypes: ['AA'],
    moderateGenotypes: ['AG', 'GA'],
    insights: {
      normal: 'Your PON1 variant is associated with efficient HDL antioxidant activity, helping protect LDL from oxidation.',
      moderate: 'One PON1 risk allele may modestly reduce paraoxonase-1 activity, slightly increasing vulnerability to oxidized LDL.',
      elevated: 'Your PON1 genotype is associated with reduced antioxidant capacity in HDL particles, increasing cardiovascular risk through oxidative stress.',
    },
    recommendation: 'Prioritize antioxidant-rich foods: dark berries, leafy greens, green tea. Omega-3 fatty acids and vitamin E support PON1 activity.',
  },

  rs1800795: {
    gene: 'IL6',
    topic: 'Interleukin-6 & Cardiovascular Inflammation',
    category: 'Cardiovascular',
    elevatedGenotypes: ['CC'],
    moderateGenotypes: ['GC', 'CG'],
    insights: {
      normal: 'Your IL6 variant is associated with typical interleukin-6 production — lower chronic cardiovascular inflammation risk.',
      moderate: 'One IL6 risk allele may moderately increase inflammatory cytokine production under stress or infection.',
      elevated: 'Your IL6 genotype is associated with higher interleukin-6 production, contributing to chronic inflammation and elevated cardiovascular risk.',
    },
    recommendation: 'Follow an anti-inflammatory diet (Mediterranean-style), prioritize 7-9 hours of sleep, and consider regular hs-CRP testing to monitor systemic inflammation.',
  },

  // ── Metabolic ─────────────────────────────────────────────────────────
  rs7903146: {
    gene: 'TCF7L2',
    topic: 'Type 2 Diabetes Risk',
    category: 'Metabolic',
    elevatedGenotypes: ['TT'],
    moderateGenotypes: ['CT', 'TC'],
    insights: {
      normal: 'Your TCF7L2 variant is associated with typical insulin secretion and lower genetically-driven Type 2 diabetes risk.',
      moderate: 'One TCF7L2 risk allele moderately increases Type 2 diabetes risk. Lifestyle factors significantly determine whether this risk is realized.',
      elevated: 'Your TCF7L2 genotype is one of the strongest genetic risk factors for Type 2 diabetes — it affects insulin secretion from pancreatic beta cells.',
    },
    recommendation: 'Limit refined carbs and added sugars, incorporate resistance training 2-3x per week, and get fasting glucose + HbA1c checked annually.',
  },

  rs1801133: {
    gene: 'MTHFR',
    topic: 'Folate Metabolism (C677T) — Homocysteine Levels',
    category: 'Metabolic',
    elevatedGenotypes: ['TT'],
    moderateGenotypes: ['CT', 'TC'],
    insights: {
      normal: 'Your MTHFR C677T position shows typical folate processing efficiency — standard folate intake is generally sufficient.',
      moderate: 'One C677T allele reduces MTHFR enzyme activity ~35%. Methylated B-vitamins are utilized more efficiently than synthetic folic acid.',
      elevated: 'Two C677T alleles reduce MTHFR activity ~70%. Elevated homocysteine is a risk — methylated folate (5-MTHF) is essential rather than synthetic folic acid.',
    },
    recommendation: 'Use methylated folate (5-MTHF) rather than synthetic folic acid. Pair with methylated B12 (methylcobalamin) and B6. Check homocysteine levels annually.',
  },

  rs1801131: {
    gene: 'MTHFR',
    topic: 'Folate Metabolism (A1298C) — B-Vitamin Processing',
    category: 'Metabolic',
    elevatedGenotypes: ['CC'],
    moderateGenotypes: ['AC', 'CA'],
    insights: {
      normal: 'Your MTHFR A1298C variant shows typical BH4 production, supporting neurotransmitter and nitric oxide synthesis.',
      moderate: 'One A1298C allele modestly reduces the BH4 pathway — relevant for neurotransmitter and nitric oxide production.',
      elevated: 'Two A1298C alleles reduce BH4 pathway function, affecting serotonin, dopamine, and nitric oxide production.',
    },
    recommendation: 'Support the BH4 pathway with riboflavin (B2) and methylated B-vitamins. Zinc and magnesium are essential cofactors for MTHFR enzyme function.',
  },

  // ── Nutrition & Vitamins ──────────────────────────────────────────────
  rs4988235: {
    gene: 'LCT',
    topic: 'Lactase Persistence (Dairy Digestion)',
    category: 'Nutrition & Vitamins',
    elevatedGenotypes: ['GG'],
    moderateGenotypes: ['AG', 'GA'],
    insights: {
      normal: 'Your LCT variant supports lactase persistence — you likely produce lactase into adulthood and tolerate dairy well.',
      moderate: 'One LCT variant allele may reduce lactase production, potentially causing mild discomfort with large amounts of dairy.',
      elevated: 'Your LCT genotype indicates lactose intolerance — your body likely produces little to no adult lactase.',
    },
    recommendation: 'Get calcium from fortified plant milks, leafy greens (collard greens, kale), sardines with bones, and tofu. Lactase supplements help if you eat dairy.',
  },

  rs2282679: {
    gene: 'GC',
    topic: 'Vitamin D Binding Protein',
    category: 'Nutrition & Vitamins',
    elevatedGenotypes: ['AA'],
    moderateGenotypes: ['AC', 'CA'],
    insights: {
      normal: 'Your GC variant is associated with efficient vitamin D binding and transport throughout your body.',
      moderate: 'One GC risk allele may reduce vitamin D binding protein efficiency, moderately affecting tissue availability.',
      elevated: 'Your GC genotype is associated with reduced vitamin D binding protein function — deficiency risk is elevated even with adequate sun exposure.',
    },
    recommendation: 'Test 25-OH vitamin D levels and target 50-80 ng/mL. Supplement D3 (2,000-5,000 IU/day) plus vitamin K2 (MK-7) to direct calcium appropriately.',
  },

  rs10741657: {
    gene: 'CYP2R1',
    topic: 'Vitamin D Hydroxylation',
    category: 'Nutrition & Vitamins',
    elevatedGenotypes: ['AA'],
    moderateGenotypes: ['AG', 'GA'],
    insights: {
      normal: 'Your CYP2R1 variant supports efficient conversion of vitamin D into its active 25-hydroxyvitamin D form.',
      moderate: 'One CYP2R1 risk allele modestly reduces vitamin D hydroxylation — your liver may be less efficient at activating vitamin D.',
      elevated: 'Your CYP2R1 genotype significantly reduces vitamin D activation — higher supplementation doses may be needed.',
    },
    recommendation: 'Sun exposure alone is insufficient. Supplement with vitamin D3 with a fat-containing meal. Recheck blood levels 3 months after starting.',
  },

  rs12785878: {
    gene: 'DHCR7',
    topic: 'Vitamin D Synthesis from Cholesterol',
    category: 'Nutrition & Vitamins',
    elevatedGenotypes: ['TT'],
    moderateGenotypes: ['GT', 'TG'],
    insights: {
      normal: 'Your DHCR7 variant supports typical cholesterol-to-vitamin D conversion in the skin during sun exposure.',
      moderate: 'One DHCR7 risk allele may moderately reduce skin vitamin D synthesis from UV light.',
      elevated: 'Your DHCR7 genotype reduces vitamin D synthesis from sun — your skin is less efficient at converting 7-dehydrocholesterol to previtamin D3.',
    },
    recommendation: 'Darker skin already reduces UV vitamin D synthesis; this variant compounds that effect. Direct supplementation is more reliable than sun alone.',
  },

  // ── Drug Metabolism ───────────────────────────────────────────────────
  rs4244285: {
    gene: 'CYP2C19',
    topic: 'Clopidogrel & Antidepressant Metabolism',
    category: 'Drug Metabolism',
    elevatedGenotypes: ['AA'],
    moderateGenotypes: ['GA', 'AG'],
    insights: {
      normal: 'Your CYP2C19 variant indicates normal metabolizer status for medications processed by this enzyme.',
      moderate: 'One CYP2C19 variant allele suggests intermediate metabolizer status — some medications may require dose adjustment.',
      elevated: 'Your CYP2C19 genotype suggests poor metabolizer status. Medications like clopidogrel (Plavix) may not be effectively activated.',
    },
    recommendation: 'Share CYP2C19 genotype with prescribers before starting antidepressants, antifungals, or blood thinners like clopidogrel.',
  },

  rs1799853: {
    gene: 'CYP2C9',
    topic: 'Warfarin & NSAID Metabolism',
    category: 'Drug Metabolism',
    elevatedGenotypes: ['TT'],
    moderateGenotypes: ['CT', 'TC'],
    insights: {
      normal: 'Your CYP2C9 variant shows typical warfarin and NSAID metabolism — standard dosing applies.',
      moderate: 'One CYP2C9*2 allele slows warfarin metabolism — lower doses may be needed to avoid bleeding risk.',
      elevated: 'Your CYP2C9 genotype significantly reduces warfarin metabolism — standard doses may cause dangerous over-anticoagulation.',
    },
    recommendation: 'Always inform your doctor and pharmacist of this genotype before starting warfarin or NSAIDs. FDA-recommended genotype-guided dosing should be used.',
  },

  rs1057910: {
    gene: 'CYP2C9',
    topic: 'Warfarin & NSAID Metabolism (CYP2C9*3)',
    category: 'Drug Metabolism',
    elevatedGenotypes: ['CC'],
    moderateGenotypes: ['AC', 'CA'],
    insights: {
      normal: 'Your CYP2C9*3 position shows normal enzyme function for warfarin and related compounds.',
      moderate: 'One CYP2C9*3 allele significantly reduces enzyme activity — warfarin doses must be substantially lowered.',
      elevated: 'Your CYP2C9*3 homozygous genotype causes severe reduction in enzyme activity — extremely low warfarin doses required.',
    },
    recommendation: 'Carry a pharmacogenomic card and ensure every prescriber knows this genotype. Avoid NSAIDs without medical guidance.',
  },

  rs3892097: {
    gene: 'CYP2D6',
    topic: 'Antidepressant & Opioid Metabolism',
    category: 'Drug Metabolism',
    elevatedGenotypes: ['TT'],
    moderateGenotypes: ['CT', 'TC'],
    insights: {
      normal: 'Your CYP2D6 variant indicates standard metabolism of antidepressants, antipsychotics, and opioids.',
      moderate: 'One CYP2D6 variant allele suggests intermediate metabolizer status — some medications may have altered efficacy or side effects.',
      elevated: 'Your CYP2D6 genotype indicates poor metabolizer status — opioids, antidepressants, and beta-blockers may accumulate to higher levels.',
    },
    recommendation: 'Discuss CYP2D6 genotype with prescribers before starting SSRIs, tricyclics, opioid pain medications, or beta-blockers.',
  },

  rs1065852: {
    gene: 'CYP2D6',
    topic: 'Drug Metabolism (CYP2D6*10)',
    category: 'Drug Metabolism',
    elevatedGenotypes: ['CC'],
    moderateGenotypes: ['TC', 'CT'],
    insights: {
      normal: 'Your CYP2D6*10 position shows standard enzyme activity for a wide range of common medications.',
      moderate: 'One CYP2D6*10 allele reduces enzyme activity — intermediate metabolizer status for many common drugs.',
      elevated: 'Two CYP2D6*10 alleles significantly reduce CYP2D6 activity — poor metabolizer status affecting over 25% of common medications.',
    },
    recommendation: 'Request a full CYP2D6 pharmacogenomic panel to understand your complete metabolizer status across many drug classes.',
  },

  rs9923231: {
    gene: 'VKORC1',
    topic: 'Warfarin Sensitivity',
    category: 'Drug Metabolism',
    elevatedGenotypes: ['TT'],
    moderateGenotypes: ['CT', 'TC'],
    insights: {
      normal: 'Your VKORC1 variant indicates typical warfarin sensitivity — standard anticoagulation dosing applies.',
      moderate: 'One VKORC1 risk allele increases warfarin sensitivity — lower doses are typically required.',
      elevated: 'Your VKORC1 genotype indicates high warfarin sensitivity. Standard doses can cause life-threatening bleeding — genotype-guided dosing is essential.',
    },
    recommendation: 'This variant is in FDA warfarin dosing guidelines. Before any anticoagulation therapy, ensure genotype-guided dosing algorithms are used.',
  },

  // ── Cancer Risk ───────────────────────────────────────────────────────
  rs16901979: {
    gene: '8q24',
    topic: 'Prostate Cancer Risk',
    category: 'Cancer Risk',
    elevatedGenotypes: ['AA'],
    moderateGenotypes: ['AC', 'CA'],
    insights: {
      normal: 'Your 8q24 variant shows typical prostate cancer risk from this locus.',
      moderate: 'One 8q24 risk allele modestly elevates prostate cancer risk — relevant for screening discussions.',
      elevated: 'Your 8q24 genotype is associated with elevated prostate cancer risk. Black men already face 1.7x higher incidence — this adds additional genetic risk.',
    },
    recommendation: 'Discuss PSA screening timing with your physician (earlier than standard guidelines may be appropriate). Maintain high lycopene intake and reduce saturated fat.',
  },

  rs6983267: {
    gene: '8q24',
    topic: 'Colorectal & Prostate Cancer Risk',
    category: 'Cancer Risk',
    elevatedGenotypes: ['GG'],
    moderateGenotypes: ['GT', 'TG'],
    insights: {
      normal: 'Your 8q24 variant shows typical risk for colorectal and prostate cancers from this shared locus.',
      moderate: 'One 8q24 risk allele at rs6983267 moderately increases colorectal cancer risk via effects on MYC oncogene regulation.',
      elevated: 'Your 8q24 genotype is associated with elevated colorectal and prostate cancer risk through effects on MYC expression.',
    },
    recommendation: 'Ensure regular colorectal cancer screening starting at 45 (earlier with family history). High-fiber diet, regular exercise, and minimizing processed meat reduce risk.',
  },

  // ── Cognitive Health ──────────────────────────────────────────────────
  rs429358: {
    gene: 'APOE',
    topic: "Alzheimer's Risk & Lipid Metabolism (APOE e4 marker 1)",
    category: 'Cognitive Health',
    elevatedGenotypes: ['CC'],
    moderateGenotypes: ['TC', 'CT'],
    insights: {
      normal: "Your APOE variant at this position is consistent with e2 or e3 alleles — lower Alzheimer's disease risk from this marker.",
      moderate: "One e4-associated allele — modestly elevated Alzheimer's risk; lifestyle factors strongly modify this.",
      elevated: "Your APOE genotype is associated with the e4 allele — one of the strongest genetic risk factors for late-onset Alzheimer's disease.",
    },
    recommendation: "Control blood pressure, exercise regularly, sleep 7-9 hours, and stay socially and mentally active — the strongest modifiable factors for cognitive risk.",
  },

  rs7412: {
    gene: 'APOE',
    topic: "Alzheimer's Risk & Lipid Metabolism (APOE e4 marker 2)",
    category: 'Cognitive Health',
    elevatedGenotypes: ['TT'],
    moderateGenotypes: ['TC', 'CT'],
    insights: {
      normal: 'Your APOE rs7412 variant is consistent with standard risk — full APOE interpretation requires both rs429358 and rs7412.',
      moderate: 'Intermediate APOE status at this position — combined with rs429358, determines full APOE e genotype.',
      elevated: 'This rs7412 genotype, with rs429358, contributes to APOE e4 status — associated with increased Alzheimer\'s and cardiovascular risk.',
    },
    recommendation: 'Mediterranean diet, regular physical activity, social engagement, cognitive stimulation, and quality sleep are the strongest brain health strategies.',
  },

  rs4680: {
    gene: 'COMT',
    topic: 'Dopamine Metabolism & Stress Response (Val158Met)',
    category: 'Cognitive Health',
    elevatedGenotypes: ['AA'],
    moderateGenotypes: ['AG', 'GA'],
    insights: {
      normal: 'Your COMT Met/Met genotype means slower dopamine breakdown — often linked to better working memory but more vulnerability under acute stress.',
      moderate: 'Your COMT Val/Met genotype strikes a balance — moderate dopamine clearance with intermediate stress reactivity and executive function.',
      elevated: 'Your COMT Val/Val genotype means faster dopamine breakdown in the prefrontal cortex — stress resilient but lower baseline prefrontal dopamine tone.',
    },
    recommendation: 'Val/Val benefits from dopamine-supporting strategies: tyrosine-rich foods, regular aerobic exercise, and active stress management. Magnesium and B6 support COMT function.',
  },

  rs6265: {
    gene: 'BDNF',
    topic: 'Brain-Derived Neurotrophic Factor (Val66Met)',
    category: 'Cognitive Health',
    elevatedGenotypes: ['AA'],
    moderateGenotypes: ['AG', 'GA'],
    insights: {
      normal: 'Your BDNF Val/Val genotype is associated with efficient BDNF secretion — robust neuroplasticity and memory consolidation.',
      moderate: 'One Met allele reduces activity-dependent BDNF secretion by ~30% — moderate impact on memory and neuroplasticity.',
      elevated: 'Your BDNF Met/Met genotype is associated with reduced BDNF secretion, affecting memory formation and stress resilience.',
    },
    recommendation: 'Exercise is the most powerful BDNF booster (aerobic activity, especially running and cycling). Omega-3 DHA, magnesium, and quality sleep also support BDNF levels.',
  },

  // ── Inflammation ──────────────────────────────────────────────────────
  rs1800629: {
    gene: 'TNF',
    topic: 'TNF-Alpha Inflammatory Response',
    category: 'Inflammation',
    elevatedGenotypes: ['AA'],
    moderateGenotypes: ['AG', 'GA'],
    insights: {
      normal: 'Your TNF-alpha variant is associated with typical cytokine production and a balanced inflammatory response.',
      moderate: 'One TNF-alpha risk allele may moderately increase inflammatory cytokine production during infection or injury.',
      elevated: 'Your TNF-alpha genotype is associated with higher chronic inflammatory cytokine production — systemic low-grade inflammation risk is elevated.',
    },
    recommendation: 'Anti-inflammatory lifestyle: omega-3 fatty acids (EPA/DHA 2-3g daily), curcumin with black pepper, adequate sleep, stress management, and limit ultra-processed foods.',
  },

  rs1800587: {
    gene: 'IL1A',
    topic: 'Interleukin-1 Alpha Inflammation',
    category: 'Inflammation',
    elevatedGenotypes: ['CC'],
    moderateGenotypes: ['CT', 'TC'],
    insights: {
      normal: 'Your IL-1A variant shows typical interleukin-1 alpha production — standard inflammatory response.',
      moderate: 'One IL-1A risk allele may modestly increase interleukin-1 alpha levels, contributing to pro-inflammatory signaling.',
      elevated: 'Your IL-1A genotype is associated with higher interleukin-1 alpha production, linked to systemic inflammation and immune hyperactivation.',
    },
    recommendation: 'Gut health is key — high-fiber diet and fermented foods reduce systemic IL-1A effects. Quercetin-rich foods (onions, apples) may help modulate IL-1 pathways.',
  },
};
