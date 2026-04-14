import type { Category, Genotype, RiskLevel } from '../types/index';

export interface SNPRule {
  gene: string;
  topic: string;
  category: Category;
  description: string;
  interpret: (genotype: Genotype) => {
    risk: RiskLevel;
    insight: string;
    recommendation: string;
  };
}

const norm = (g: Genotype): string =>
  g.replace(/[^ACGTDI]/gi, '').toUpperCase().split('').sort().join('');

export const SNP_RULES: Record<string, SNPRule> = {
  // ─── Nutrition & Vitamin Absorption ──────────────────────────────────────
  rs1801133: {
    gene: 'MTHFR',
    topic: 'Folate metabolism',
    category: 'Nutrition & Supplements',
    description:
      'C677T variant affecting methylenetetrahydrofolate reductase activity and folate conversion. // PMID: 10951516',
    interpret: (g) => {
      const n = norm(g);
      if (n === 'CC')
        return {
          risk: 'normal',
          insight: 'Normal MTHFR activity; efficient conversion of folate to active methylfolate.',
          recommendation: 'Standard folate intake from leafy greens and legumes is sufficient.',
        };
      if (n === 'CT')
        return {
          risk: 'moderate',
          insight: '~35% reduction in MTHFR enzyme activity; moderately impaired folate conversion.',
          recommendation:
            'Prefer methylfolate (5-MTHF) over synthetic folic acid; ensure adequate B12.',
        };
      if (n === 'TT')
        return {
          risk: 'elevated',
          insight:
            '~70% reduction in MTHFR activity; significantly impaired folate metabolism with elevated homocysteine risk.',
          recommendation:
            'Supplement 400–800 mcg methylfolate (5-MTHF) daily with methylcobalamin B12; avoid folic acid.',
        };
      return {
        risk: 'normal',
        insight: 'Genotype not interpretable.',
        recommendation: 'Retest or consult a clinician.',
      };
    },
  },

  rs4988235: {
    gene: 'LCT',
    topic: 'Lactase persistence',
    category: 'Nutrition & Supplements',
    description:
      'Variant upstream of LCT determining whether lactase production persists into adulthood. // PMID: 12161756',
    interpret: (g) => {
      const n = norm(g);
      if (n === 'AA')
        return {
          risk: 'normal',
          insight: 'Lactase persistent; full ability to digest lactose into adulthood.',
          recommendation: 'Dairy can remain a regular protein and calcium source if tolerated.',
        };
      if (n === 'AG')
        return {
          risk: 'moderate',
          insight:
            'Partial lactase persistence; moderate dairy usually tolerated, fermented dairy often better.',
          recommendation:
            'Favor hard cheeses, yogurt, and kefir; limit large servings of milk or ice cream.',
        };
      if (n === 'GG')
        return {
          risk: 'elevated',
          insight:
            'Lactase non-persistent; lactose digestion drops sharply after childhood, causing GI symptoms with dairy.',
          recommendation:
            'Shift to dairy-free protein sources (whey isolate is often tolerated, or plant proteins); use lactase enzyme if consuming dairy.',
        };
      return {
        risk: 'normal',
        insight: 'Genotype not interpretable.',
        recommendation: 'Retest or consult a clinician.',
      };
    },
  },

  rs1544410: {
    gene: 'VDR',
    topic: 'Vitamin D receptor sensitivity',
    category: 'Vitamin & Mineral Absorption',
    description:
      'BsmI variant of the vitamin D receptor influencing downstream vitamin D signaling. // PMID: 11408956',
    interpret: (g) => {
      const n = norm(g);
      if (n === 'GG')
        return {
          risk: 'normal',
          insight: 'Typical VDR signaling; standard vitamin D requirements.',
          recommendation:
            'Maintain 1,000–2,000 IU D3 daily and aim for serum 25(OH)D of 30–50 ng/mL.',
        };
      if (n === 'AG')
        return {
          risk: 'moderate',
          insight:
            'Moderately reduced VDR responsiveness; may need higher circulating D for equivalent effect.',
          recommendation: 'Target 2,000–4,000 IU D3 daily with K2 (MK-7); check 25(OH)D annually.',
        };
      if (n === 'AA')
        return {
          risk: 'elevated',
          insight:
            'Reduced VDR signaling; higher risk of suboptimal bone, immune, and metabolic vitamin D effects.',
          recommendation:
            'Consider 4,000–5,000 IU D3 daily with K2; retest 25(OH)D every 3–6 months until optimized.',
        };
      return {
        risk: 'normal',
        insight: 'Genotype not interpretable.',
        recommendation: 'Retest or consult a clinician.',
      };
    },
  },

  rs2282679: {
    gene: 'GC',
    topic: 'Vitamin D binding protein',
    category: 'Vitamin & Mineral Absorption',
    description:
      'GC (DBP) variant affecting free vitamin D transport; especially relevant in African ancestry. // PMID: 20541252',
    interpret: (g) => {
      const n = norm(g);
      if (n === 'AA')
        return {
          risk: 'normal',
          insight: 'Typical DBP levels; normal vitamin D transport and bioavailability.',
          recommendation: 'Standard D3 intake of 1,000–2,000 IU daily is typically sufficient.',
        };
      if (n === 'AC')
        return {
          risk: 'moderate',
          insight: 'Moderately lower DBP and total 25(OH)D; bioavailable D may still be adequate.',
          recommendation:
            'Aim for 2,000 IU D3 daily with sun exposure; prioritize bioavailable D testing if available.',
        };
      if (n === 'CC')
        return {
          risk: 'elevated',
          insight:
            'Lower DBP and 25(OH)D, particularly meaningful for individuals of African ancestry where baseline levels are already lower.',
          recommendation:
            'Consider 3,000–5,000 IU D3 daily, and prioritize bioavailable vitamin D testing over total 25(OH)D.',
        };
      return {
        risk: 'normal',
        insight: 'Genotype not interpretable.',
        recommendation: 'Retest or consult a clinician.',
      };
    },
  },

  rs174537: {
    gene: 'FADS1',
    topic: 'Omega-3 conversion (ALA → EPA/DHA)',
    category: 'Nutrition & Supplements',
    description:
      'FADS1 variant affecting desaturase activity for long-chain omega-3 synthesis. // PMID: 19129505',
    interpret: (g) => {
      const n = norm(g);
      if (n === 'TT')
        return {
          risk: 'normal',
          insight:
            'Efficient conversion of plant ALA to EPA/DHA; baseline long-chain omega-3 status is typically adequate.',
          recommendation: 'Flax/chia/walnuts plus 1–2 fatty fish meals weekly is usually sufficient.',
        };
      if (n === 'GT')
        return {
          risk: 'moderate',
          insight: 'Moderately reduced ALA → EPA/DHA conversion efficiency.',
          recommendation:
            'Include fatty fish 2–3×/week or supplement with ~1g/day combined EPA+DHA.',
        };
      if (n === 'GG')
        return {
          risk: 'elevated',
          insight:
            'Poor converter of ALA to EPA/DHA; plant-based omega-3 alone is unlikely to maintain optimal levels.',
          recommendation:
            'Supplement marine omega-3 (fish or algal oil) providing 1.5–2g EPA+DHA daily.',
        };
      return {
        risk: 'normal',
        insight: 'Genotype not interpretable.',
        recommendation: 'Retest or consult a clinician.',
      };
    },
  },

  rs1799945: {
    gene: 'HFE',
    topic: 'Iron absorption (H63D)',
    category: 'Vitamin & Mineral Absorption',
    description:
      'HFE H63D variant associated with increased intestinal iron absorption. // PMID: 9463314',
    interpret: (g) => {
      const n = norm(g);
      if (n === 'CC')
        return {
          risk: 'normal',
          insight: 'Typical iron regulation; standard absorption of dietary iron.',
          recommendation: 'Consume iron from varied dietary sources; no special precautions.',
        };
      if (n === 'CG')
        return {
          risk: 'moderate',
          insight:
            'Mildly increased iron absorption; slightly elevated risk of iron overload over decades.',
          recommendation:
            'Do not supplement iron without confirmed deficiency; monitor ferritin periodically.',
        };
      if (n === 'GG')
        return {
          risk: 'elevated',
          insight:
            'Significantly increased iron absorption; elevated risk of iron accumulation, especially combined with C282Y.',
          recommendation:
            'Avoid iron supplements and iron-fortified foods unless deficiency is confirmed; test ferritin and transferrin saturation.',
        };
      return {
        risk: 'normal',
        insight: 'Genotype not interpretable.',
        recommendation: 'Retest or consult a clinician.',
      };
    },
  },

  rs1695: {
    gene: 'GSTP1',
    topic: 'Glutathione antioxidant activity',
    category: 'Nutrition & Supplements',
    description:
      'GSTP1 Ile105Val variant reducing detoxification and antioxidant capacity. // PMID: 9536098',
    interpret: (g) => {
      const n = norm(g);
      if (n === 'AA')
        return {
          risk: 'normal',
          insight: 'Normal GSTP1 activity; typical detoxification and oxidative stress handling.',
          recommendation:
            'Maintain a polyphenol-rich diet (berries, cruciferous vegetables, green tea).',
        };
      if (n === 'AG')
        return {
          risk: 'moderate',
          insight: 'Moderately reduced GSTP1 activity; slightly impaired detox of oxidative byproducts.',
          recommendation:
            'Emphasize sulfur-rich foods (broccoli sprouts, garlic); consider 600mg NAC daily during high-stress periods.',
        };
      if (n === 'GG')
        return {
          risk: 'elevated',
          insight:
            'Significantly reduced glutathione-S-transferase activity; higher oxidative stress burden.',
          recommendation:
            'Consider daily NAC (600–1200mg) or liposomal glutathione; prioritize cruciferous vegetables and limit toxin exposure.',
        };
      return {
        risk: 'normal',
        insight: 'Genotype not interpretable.',
        recommendation: 'Retest or consult a clinician.',
      };
    },
  },

  rs4880: {
    gene: 'SOD2',
    topic: 'Mitochondrial antioxidant defense',
    category: 'Nutrition & Supplements',
    description:
      'SOD2 Ala16Val variant altering mitochondrial targeting of superoxide dismutase 2. // PMID: 9663258',
    interpret: (g) => {
      const n = norm(g);
      if (n === 'CC')
        return {
          risk: 'normal',
          insight: 'Efficient mitochondrial SOD2 import; strong endogenous antioxidant defense.',
          recommendation: 'Standard antioxidant intake from whole foods is sufficient.',
        };
      if (n === 'CT')
        return {
          risk: 'moderate',
          insight:
            'Moderately reduced mitochondrial SOD2 activity; elevated mitochondrial oxidative stress.',
          recommendation:
            'Consider CoQ10 (100–200mg/day) and dietary manganese; prioritize colorful plants.',
        };
      if (n === 'TT')
        return {
          risk: 'elevated',
          insight:
            'Lower efficiency of SOD2 mitochondrial import; increased mitochondrial oxidative damage risk.',
          recommendation:
            'Consider CoQ10 or MitoQ (10mg/day); ensure adequate manganese, riboflavin, and polyphenol intake.',
        };
      return {
        risk: 'normal',
        insight: 'Genotype not interpretable.',
        recommendation: 'Retest or consult a clinician.',
      };
    },
  },

  // ─── Metabolic Health ────────────────────────────────────────────────────
  rs7903146: {
    gene: 'TCF7L2',
    topic: 'Type 2 diabetes risk',
    category: 'Metabolic Health',
    description:
      'TCF7L2 intronic variant; one of the strongest common genetic risk factors for T2D. T allele more common in African ancestry. // PMID: 16415884',
    interpret: (g) => {
      const n = norm(g);
      if (n === 'CC')
        return {
          risk: 'normal',
          insight: 'Baseline T2D risk; typical insulin secretion dynamics.',
          recommendation: 'Maintain balanced macronutrients and regular physical activity.',
        };
      if (n === 'CT')
        return {
          risk: 'moderate',
          insight:
            'Moderately elevated T2D risk (~1.4×) due to impaired insulin secretion in response to glucose.',
          recommendation:
            'Favor a low-glycemic diet, eat protein/fat before carbs, and consider berberine 500mg with carbohydrate meals.',
        };
      if (n === 'TT')
        return {
          risk: 'elevated',
          insight:
            'Highest common-variant T2D risk (~2×); impaired incretin and insulin response.',
          recommendation:
            'Prioritize low-glycemic whole-food carbs, post-meal walks, resistance training, and discuss berberine 500mg 2–3×/day with a clinician.',
        };
      return {
        risk: 'normal',
        insight: 'Genotype not interpretable.',
        recommendation: 'Retest or consult a clinician.',
      };
    },
  },

  rs429358: {
    gene: 'APOE',
    topic: 'APOE ε4 marker (cardio-metabolic & cognitive)',
    category: 'Metabolic Health',
    description:
      'APOE rs429358 — together with rs7412 defines ε2/ε3/ε4 haplotypes. C allele marks ε4; see recommender for APOE composite.',
    interpret: (g) => {
      const n = norm(g);
      if (n === 'TT')
        return {
          risk: 'normal',
          insight:
            'No ε4 allele at this site; baseline cardio-metabolic and cognitive profile (combine with rs7412 for full APOE status).',
          recommendation: 'Standard heart-healthy nutrition and regular cardiovascular activity.',
        };
      if (n === 'CT')
        return {
          risk: 'moderate',
          insight:
            'One ε4 allele likely present; moderately elevated LDL response to saturated fat and cognitive aging risk.',
          recommendation:
            'Favor a Mediterranean-style diet, limit saturated fat, prioritize omega-3 and aerobic exercise; see APOE composite for full interpretation.',
        };
      if (n === 'CC')
        return {
          risk: 'elevated',
          insight:
            'Two ε4 alleles likely; highest APOE-related risk profile for LDL, cardiovascular disease, and late-onset cognitive decline.',
          recommendation:
            'Strict Mediterranean or low-saturated-fat pattern, daily omega-3, vigorous cardio 150+ min/week, and regular lipid and cognitive monitoring.',
        };
      return {
        risk: 'normal',
        insight: 'Genotype not interpretable.',
        recommendation: 'Retest or consult a clinician.',
      };
    },
  },

  rs7412: {
    gene: 'APOE',
    topic: 'APOE ε2 marker (cardio-metabolic & cognitive)',
    category: 'Metabolic Health',
    description:
      'APOE rs7412 — with rs429358 defines ε2/ε3/ε4 haplotypes. T allele marks ε2; see recommender for APOE composite.',
    interpret: (g) => {
      const n = norm(g);
      if (n === 'CC')
        return {
          risk: 'normal',
          insight:
            'No ε2 allele at this site; combine with rs429358 for full APOE haplotype.',
          recommendation:
            'Standard cardio-metabolic nutrition; interpret alongside rs429358.',
        };
      if (n === 'CT')
        return {
          risk: 'moderate',
          insight:
            'One ε2 allele; generally associated with lower LDL but can rarely contribute to type III hyperlipidemia.',
          recommendation:
            'Maintain balanced fat intake; monitor triglycerides and full lipid panel periodically.',
        };
      if (n === 'TT')
        return {
          risk: 'elevated',
          insight:
            'ε2/ε2 — usually lower LDL, but elevated risk of type III hyperlipidemia under metabolic stress.',
          recommendation:
            'Maintain healthy weight and low refined-carb intake; monitor lipid panel including triglycerides yearly.',
        };
      return {
        risk: 'normal',
        insight: 'Genotype not interpretable.',
        recommendation: 'Retest or consult a clinician.',
      };
    },
  },

  rs1801282: {
    gene: 'PPARG',
    topic: 'Insulin sensitivity (Pro12Ala)',
    category: 'Metabolic Health',
    description:
      'PPARG Pro12Ala variant; Ala allele generally protective for insulin sensitivity. // PMID: 9771853',
    interpret: (g) => {
      const n = norm(g);
      if (n === 'CC')
        return {
          risk: 'normal',
          insight: 'Standard PPARG activity; typical insulin sensitivity response to diet.',
          recommendation: 'Balanced macronutrients with emphasis on fiber and whole grains.',
        };
      if (n === 'CG')
        return {
          risk: 'moderate',
          insight:
            'One Ala allele; different insulin-sensitizing response — more sensitive to dietary fat quality, lower-carb pattern typically preferred.',
          recommendation:
            'Favor monounsaturated fats (olive oil, nuts) and moderate-to-lower carbs; limit refined sugar.',
        };
      if (n === 'GG')
        return {
          risk: 'moderate',
          insight:
            'Two Ala alleles; generally protective for T2D but stronger response to dietary pattern quality.',
          recommendation:
            'Mediterranean-style lower-carb pattern; emphasize fiber and healthy fats.',
        };
      return {
        risk: 'normal',
        insight: 'Genotype not interpretable.',
        recommendation: 'Retest or consult a clinician.',
      };
    },
  },

  rs9939609: {
    gene: 'FTO',
    topic: 'Appetite regulation & obesity risk',
    category: 'Metabolic Health',
    description:
      'FTO intronic variant influencing satiety signaling and body weight. // PMID: 17434869',
    interpret: (g) => {
      const n = norm(g);
      if (n === 'TT')
        return {
          risk: 'normal',
          insight: 'Baseline appetite regulation and body weight risk.',
          recommendation: 'Standard balanced nutrition and regular activity.',
        };
      if (n === 'AT')
        return {
          risk: 'moderate',
          insight:
            'One risk allele; moderately blunted satiety and ~1.3kg higher average body weight.',
          recommendation:
            'Protein-forward meals (~30g/meal), structured meal timing, and daily movement.',
        };
      if (n === 'AA')
        return {
          risk: 'elevated',
          insight:
            'Two risk alleles; greater tendency toward higher caloric intake and ~3kg higher average body weight.',
          recommendation:
            'Protein at every meal (30–40g), time-restricted eating window, resistance training, and minimize ultra-processed snacks.',
        };
      return {
        risk: 'normal',
        insight: 'Genotype not interpretable.',
        recommendation: 'Retest or consult a clinician.',
      };
    },
  },

  // ─── Fitness & Recovery ──────────────────────────────────────────────────
  rs1815739: {
    gene: 'ACTN3',
    topic: 'Muscle fiber composition (power vs endurance)',
    category: 'Fitness & Recovery',
    description:
      'ACTN3 R577X stop-gain variant; TT genotype produces no functional alpha-actinin-3 in fast-twitch fibers. // PMID: 12879365',
    interpret: (g) => {
      const n = norm(g);
      if (n === 'CC')
        return {
          risk: 'normal',
          insight:
            'Power/sprint profile — full alpha-actinin-3 expression favors fast-twitch muscle performance.',
          recommendation:
            'Prioritize heavy strength work, sprints, and explosive training; endurance gains require more deliberate volume.',
        };
      if (n === 'CT')
        return {
          risk: 'normal',
          insight:
            'Mixed profile — functional alpha-actinin-3 present, compatible with both power and endurance training.',
          recommendation: 'Hybrid training (strength + conditioning) matches this genotype well.',
        };
      if (n === 'TT')
        return {
          risk: 'normal',
          insight:
            'Endurance profile — no functional alpha-actinin-3; reduced peak power but favorable endurance adaptation.',
          recommendation:
            'Lean into aerobic and endurance training; allow longer recovery after eccentric/heavy lifting.',
        };
      return {
        risk: 'normal',
        insight: 'Genotype not interpretable.',
        recommendation: 'Retest or consult a clinician.',
      };
    },
  },

  rs1799752: {
    gene: 'ACE',
    topic: 'Cardiovascular response to training',
    category: 'Fitness & Recovery',
    description:
      'ACE I/D polymorphism; D allele associated with power, I allele with endurance performance. // PMID: 9554843',
    interpret: (g) => {
      const n = norm(g);
      if (n === 'DD')
        return {
          risk: 'normal',
          insight: 'Power/HIIT-biased cardiovascular response; stronger strength and sprint adaptations.',
          recommendation:
            'HIIT, heavy strength, and short-interval conditioning tend to produce the strongest gains.',
        };
      if (n === 'DI')
        return {
          risk: 'normal',
          insight: 'Mixed cardiovascular response — balanced power and endurance potential.',
          recommendation: 'Varied training (strength + moderate endurance) aligns well with this profile.',
        };
      if (n === 'II')
        return {
          risk: 'normal',
          insight:
            'Endurance-favored cardiovascular response; stronger aerobic and muscular endurance adaptations.',
          recommendation: 'Prioritize Zone 2 cardio, tempo work, and longer endurance sessions.',
        };
      return {
        risk: 'normal',
        insight:
          'Genotype not interpretable (ACE I/D is an indel — may not appear on standard SNP arrays).',
        recommendation: 'Confirm ACE genotyping method; retest if needed.',
      };
    },
  },

  rs8192678: {
    gene: 'PPARGC1A',
    topic: 'Mitochondrial biogenesis & aerobic adaptation',
    category: 'Fitness & Recovery',
    description:
      'PPARGC1A Gly482Ser variant affecting PGC-1α–driven mitochondrial biogenesis. // PMID: 12750488',
    interpret: (g) => {
      const n = norm(g);
      if (n === 'GG')
        return {
          risk: 'normal',
          insight: 'Efficient mitochondrial biogenesis and strong aerobic training response.',
          recommendation: 'Standard aerobic programming (Zone 2 + intervals) produces strong adaptations.',
        };
      if (n === 'AG')
        return {
          risk: 'moderate',
          insight: 'Moderately reduced PGC-1α-driven aerobic adaptation.',
          recommendation:
            'Add a second Zone 2 session weekly and include 1–2 HIIT sessions to drive mitochondrial adaptation.',
        };
      if (n === 'AA')
        return {
          risk: 'elevated',
          insight: 'Reduced mitochondrial biogenesis response; slower aerobic adaptation.',
          recommendation:
            'Increase aerobic training volume (3–4 Zone 2 sessions/week plus 1–2 HIIT), and ensure adequate CoQ10, B-vitamins, and protein.',
        };
      return {
        risk: 'normal',
        insight: 'Genotype not interpretable.',
        recommendation: 'Retest or consult a clinician.',
      };
    },
  },

  rs1042713: {
    gene: 'ADRB2',
    topic: 'Fat oxidation & exercise response',
    category: 'Fitness & Recovery',
    description:
      'ADRB2 Arg16Gly variant affecting β2-adrenergic receptor signaling and lipolysis. // PMID: 9545397',
    interpret: (g) => {
      const n = norm(g);
      if (n === 'AA')
        return {
          risk: 'normal',
          insight: 'Efficient β2-adrenergic signaling; strong lipolytic response to exercise.',
          recommendation: 'Any training modality drives fat oxidation well; fasted cardio is optional.',
        };
      if (n === 'AG')
        return {
          risk: 'moderate',
          insight:
            'Moderately reduced β2-adrenergic response; fat oxidation during exercise is somewhat blunted.',
          recommendation:
            'Add 1–2 Zone 2 sessions weekly; consider fasted morning cardio and 1–2g L-carnitine pre-workout.',
        };
      if (n === 'GG')
        return {
          risk: 'elevated',
          insight:
            'Reduced β2-adrenergic signaling; lower lipolytic response and fat oxidation during training.',
          recommendation:
            'Prioritize fasted Zone 2 cardio 3×/week, consider L-carnitine 2g/day, and emphasize post-meal walks.',
        };
      return {
        risk: 'normal',
        insight: 'Genotype not interpretable.',
        recommendation: 'Retest or consult a clinician.',
      };
    },
  },
};

export const TARGET_SNPS: string[] = Object.keys(SNP_RULES);
