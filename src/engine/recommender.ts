import type {
  Genotype,
  SNPResult,
  RiskLevel,
  SupplementRecommendation,
} from '../types/index';
import { SNP_RULES } from './snpRules';

interface InterpretOutput {
  risk: RiskLevel;
  insight: string;
  recommendation: string;
}

export function resolveAPOE(rs429358: Genotype, rs7412: Genotype): string {
  const key = `${rs429358}|${rs7412}`;
  const table: Record<string, string> = {
    'TT|TT': 'E3/E3',
    'CT|TT': 'E3/E4',
    'TC|TT': 'E3/E4',
    'TT|CT': 'E2/E3',
    'TT|TC': 'E2/E3',
    'CT|CT': 'E2/E4',
    'CT|TC': 'E2/E4',
    'TC|CT': 'E2/E4',
    'TC|TC': 'E2/E4',
    'CC|TT': 'E4/E4',
    'TT|CC': 'E2/E2',
  };
  return table[key] ?? 'Unknown';
}

function interpretAPOE(apoe: string): InterpretOutput {
  if (apoe === 'Unknown') {
    return {
      risk: 'normal',
      insight: 'APOE genotype could not be resolved from the provided markers.',
      recommendation:
        'Confirm APOE status with a clinical test before making risk-based decisions.',
    };
  }

  const isE4Carrier = apoe.includes('E4');
  const isE2Only = apoe === 'E2/E2' || apoe === 'E2/E3';

  if (isE4Carrier) {
    const isHomozygous = apoe === 'E4/E4';
    return {
      risk: 'elevated',
      insight: isHomozygous
        ? "APOE E4/E4: the strongest common genetic risk factor for late-onset Alzheimer's disease and elevated cardiovascular risk."
        : `APOE ${apoe}: E4 carrier status elevates Alzheimer's and cardiovascular risk; lifestyle strongly modifies this.`,
      recommendation:
        'Reduce saturated fat, increase omega-3 (EPA/DHA) intake, and consider phosphatidylserine; prioritize aerobic exercise, quality sleep, and cognitive engagement.',
    };
  }

  if (isE2Only) {
    return {
      risk: 'normal',
      insight: `APOE ${apoe}: E2 is associated with lower Alzheimer's risk relative to E3/E3, though it can influence lipid metabolism.`,
      recommendation:
        'Maintain a Mediterranean-style diet, regular exercise, and routine lipid monitoring.',
    };
  }

  return {
    risk: 'normal',
    insight: `APOE ${apoe}: the most common genotype, associated with average Alzheimer's and cardiovascular risk.`,
    recommendation:
      'Support brain and heart health with a Mediterranean diet, regular exercise, quality sleep, and social/cognitive engagement.',
  };
}

export function runRecommendations(
  snpMap: Record<string, Genotype>,
): SNPResult[] {
  const results: SNPResult[] = [];
  const rsidsProcessed = new Set<string>();

  const apoe1 = snpMap['rs429358'];
  const apoe2 = snpMap['rs7412'];
  if (apoe1 && apoe2) {
    const apoe = resolveAPOE(apoe1, apoe2);
    const { risk, insight, recommendation } = interpretAPOE(apoe);
    const rule = SNP_RULES['rs429358'] ?? SNP_RULES['rs7412'];
    if (rule) {
      results.push({
        rsid: 'APOE',
        gene: 'APOE',
        topic: "APOE Genotype — Alzheimer's & Lipid Metabolism",
        category: rule.category,
        genotype: apoe,
        risk,
        insight,
        recommendation,
      });
    }
    rsidsProcessed.add('rs429358');
    rsidsProcessed.add('rs7412');
  }

  for (const [rsid, rule] of Object.entries(SNP_RULES)) {
    if (rsidsProcessed.has(rsid)) continue;
    const genotype = snpMap[rsid];
    if (!genotype) continue;

    const { risk, insight, recommendation } = rule.interpret(genotype);
    results.push({
      rsid,
      gene: rule.gene,
      topic: rule.topic,
      category: rule.category,
      genotype,
      risk,
      insight,
      recommendation,
    });
  }

  const order: Record<RiskLevel, number> = {
    elevated: 0,
    moderate: 1,
    normal: 2,
  };
  results.sort((a, b) => order[a.risk] - order[b.risk]);
  return results;
}

interface ParsedSupplement {
  name: string;
  dosage: string;
  timing: string;
}

const SUPPLEMENT_PATTERNS: Array<{
  match: RegExp;
  name: string;
  dosage: string;
  timing: string;
}> = [
  {
    match: /vitamin\s*d(?:3)?|25-oh\s*vitamin\s*d/i,
    name: 'Vitamin D3',
    dosage: '2,000–5,000 IU/day',
    timing: 'With a fat-containing meal',
  },
  {
    match: /vitamin\s*k2|mk-?7/i,
    name: 'Vitamin K2 (MK-7)',
    dosage: '100–200 mcg/day',
    timing: 'With vitamin D3',
  },
  {
    match: /omega-?3|epa\/dha|epa\s*\/\s*dha|fish oil/i,
    name: 'Omega-3 (EPA/DHA)',
    dosage: '2–3 g/day',
    timing: 'With meals',
  },
  {
    match: /methylated\s*folate|5-?mthf/i,
    name: 'Methylated Folate (5-MTHF)',
    dosage: '400–800 mcg/day',
    timing: 'Morning, with food',
  },
  {
    match: /methylcobalamin|methylated\s*b12/i,
    name: 'Methyl B12',
    dosage: '1,000 mcg/day',
    timing: 'Morning, sublingual',
  },
  {
    match: /b6\b|vitamin\s*b6/i,
    name: 'Vitamin B6 (P5P)',
    dosage: '25–50 mg/day',
    timing: 'With food',
  },
  {
    match: /riboflavin|\bb2\b/i,
    name: 'Riboflavin (B2)',
    dosage: '25–100 mg/day',
    timing: 'With food',
  },
  {
    match: /magnesium/i,
    name: 'Magnesium Glycinate',
    dosage: '300–400 mg/day',
    timing: 'Evening',
  },
  {
    match: /zinc/i,
    name: 'Zinc',
    dosage: '15–30 mg/day',
    timing: 'With food',
  },
  {
    match: /l-?citrulline|citrulline/i,
    name: 'L-Citrulline',
    dosage: '3–6 g/day',
    timing: 'Pre-workout or morning',
  },
  {
    match: /curcumin/i,
    name: 'Curcumin (with black pepper)',
    dosage: '500–1,000 mg/day',
    timing: 'With meals',
  },
  {
    match: /phosphatidylserine/i,
    name: 'Phosphatidylserine',
    dosage: '100–300 mg/day',
    timing: 'With meals',
  },
  {
    match: /tyrosine/i,
    name: 'L-Tyrosine',
    dosage: '500–1,500 mg/day',
    timing: 'Morning, on empty stomach',
  },
  {
    match: /quercetin/i,
    name: 'Quercetin',
    dosage: '250–500 mg/day',
    timing: 'With meals',
  },
  {
    match: /lycopene/i,
    name: 'Lycopene',
    dosage: '10–20 mg/day',
    timing: 'With a fat-containing meal',
  },
  {
    match: /vitamin\s*e\b/i,
    name: 'Vitamin E (mixed tocopherols)',
    dosage: '100–200 IU/day',
    timing: 'With a fat-containing meal',
  },
  {
    match: /lactase/i,
    name: 'Lactase Enzyme',
    dosage: '9,000 FCC units per dairy serving',
    timing: 'Immediately before dairy intake',
  },
];

function parseSupplementsFromText(text: string): ParsedSupplement[] {
  const seen = new Set<string>();
  const found: ParsedSupplement[] = [];
  for (const pattern of SUPPLEMENT_PATTERNS) {
    if (pattern.match.test(text) && !seen.has(pattern.name)) {
      seen.add(pattern.name);
      found.push({
        name: pattern.name,
        dosage: pattern.dosage,
        timing: pattern.timing,
      });
    }
  }
  return found;
}

export function buildSupplementStack(
  snpResults: SNPResult[],
): SupplementRecommendation[] {
  const stack = new Map<
    string,
    {
      name: string;
      dosage: string;
      timing: string;
      reasons: string[];
      highestRisk: RiskLevel;
    }
  >();

  const riskRank: Record<RiskLevel, number> = {
    normal: 0,
    moderate: 1,
    elevated: 2,
  };

  for (const result of snpResults) {
    if (result.risk === 'normal') continue;

    const parsed = parseSupplementsFromText(result.recommendation);
    for (const supp of parsed) {
      const reason = `${result.gene} (${result.rsid === 'APOE' ? 'APOE' : result.rsid}): ${result.topic}`;
      const existing = stack.get(supp.name);
      if (existing) {
        existing.reasons.push(reason);
        if (riskRank[result.risk] > riskRank[existing.highestRisk]) {
          existing.highestRisk = result.risk;
        }
      } else {
        stack.set(supp.name, {
          name: supp.name,
          dosage: supp.dosage,
          timing: supp.timing,
          reasons: [reason],
          highestRisk: result.risk,
        });
      }
    }
  }

  const priorityFor = (risk: RiskLevel): SupplementRecommendation['priority'] => {
    if (risk === 'elevated') return 'essential';
    if (risk === 'moderate') return 'beneficial';
    return 'optional';
  };

  return Array.from(stack.values())
    .map((entry) => ({
      name: entry.name,
      dosage: entry.dosage,
      timing: entry.timing,
      reason: entry.reasons.join('; '),
      priority: priorityFor(entry.highestRisk),
    }))
    .sort((a, b) => {
      const rank = { essential: 0, beneficial: 1, optional: 2 } as const;
      return rank[a.priority] - rank[b.priority];
    });
}
