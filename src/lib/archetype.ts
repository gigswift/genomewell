import type { Genotype, SupplementRecommendation } from '../types';

export interface ArchetypeStat {
  k: string;
  v: string;
}

export interface Archetype {
  primary: string;
  secondary?: string;
  name: string;
  subtitle: string;
  stats: ArchetypeStat[];
}

type DescriptorId =
  | 'Cardio-Cognitive Priority'
  | 'Iron-Conservative'
  | 'Slow Methylator'
  | 'Omega Converter (Low)'
  | 'Detox-Sensitive'
  | 'Vitamin D Demander'
  | 'Balanced Baseline';

interface BiologyRule {
  id: DescriptorId;
  match: (snps: Map<string, Genotype>) => boolean;
}

function has(snps: Map<string, Genotype>, rsid: string, alleles: readonly string[]): boolean {
  const g = snps.get(rsid);
  return g !== undefined && alleles.includes(g);
}

function isApoeE4Carrier(snps: Map<string, Genotype>): boolean {
  return has(snps, 'rs429358', ['CT', 'TC', 'CC']) && has(snps, 'rs7412', ['CC']);
}

const BIOLOGY_RULES: BiologyRule[] = [
  { id: 'Cardio-Cognitive Priority', match: isApoeE4Carrier },
  { id: 'Iron-Conservative', match: (s) => has(s, 'rs1800562', ['AA']) },
  { id: 'Slow Methylator', match: (s) => has(s, 'rs1801133', ['TT']) },
  { id: 'Omega Converter (Low)', match: (s) => has(s, 'rs174537', ['TT']) },
  { id: 'Iron-Conservative', match: (s) => has(s, 'rs1800562', ['AG', 'GA']) },
  { id: 'Detox-Sensitive', match: (s) => has(s, 'rs1695', ['GG']) },
  { id: 'Vitamin D Demander', match: (s) => has(s, 'rs1544410', ['AA']) },
];

const SUBTITLE_SENTENCE_1: Record<DescriptorId, string> = {
  'Slow Methylator':
    'You need a little extra help turning B-vitamins into their active forms.',
  'Cardio-Cognitive Priority':
    'Your APOE profile raises the stakes on lipid and brain-supportive nutrition.',
  'Iron-Conservative':
    'You hold onto iron more aggressively than most — extra iron is a liability, not a gift.',
  'Omega Converter (Low)':
    'Your body converts plant-based omega-3s poorly, so marine EPA/DHA carries more of the load.',
  'Detox-Sensitive':
    'Your phase-II detox capacity runs lean, so cofactor support makes a visible difference.',
  'Vitamin D Demander':
    'Your vitamin D receptor reads circulating D less efficiently, so adequate status matters more.',
  'Balanced Baseline':
    'None of the high-impact variants we scan for fired strongly in your file — good news.',
};

function composeSubtitle(
  primary: DescriptorId,
  secondary: DescriptorId | 'Quick Responder' | undefined,
  essentialCount: number,
): string {
  const s1 = SUBTITLE_SENTENCE_1[primary];
  let s2: string;
  if (secondary === 'Quick Responder') {
    s2 = 'Small, targeted nutrients move the needle fast for you — start with the essentials.';
  } else if (secondary) {
    s2 = 'Layer the essentials first; the stacked signal means benefit compounds.';
  } else if (primary === 'Balanced Baseline') {
    s2 =
      'Stay consistent on broad-spectrum fundamentals; no single variant lane is driving override priority.';
  } else if (essentialCount > 0) {
    s2 = 'Start with the essentials; the rest is honest context.';
  } else {
    s2 = 'Focus on the fundamentals; nothing in your profile demands an aggressive override.';
  }
  return `${s1} ${s2}`;
}

export function deriveArchetype(
  snps: Map<string, Genotype>,
  recommendations: SupplementRecommendation[],
  totalRowsParsed: number,
): Archetype {
  const matches: DescriptorId[] = [];
  for (const rule of BIOLOGY_RULES) {
    if (rule.match(snps) && !matches.includes(rule.id)) {
      matches.push(rule.id);
    }
  }

  const essentialCount = recommendations.filter((r) => r.priority === 'essential').length;
  const variantsMatched = new Set(recommendations.flatMap((r) => r.firedPrimary)).size;

  let primary: DescriptorId;
  let secondary: DescriptorId | 'Quick Responder' | undefined;

  if (matches.length === 0) {
    primary = 'Balanced Baseline';
    secondary = undefined;
  } else {
    primary = matches[0];
    if (essentialCount >= 3) {
      secondary = 'Quick Responder';
    } else if (matches.length >= 2) {
      secondary = matches[1];
    } else {
      secondary = undefined;
    }
  }

  const name = secondary ? `${primary}, ${secondary}` : primary;
  const subtitle = composeSubtitle(primary, secondary, essentialCount);

  const stats: ArchetypeStat[] = [
    { k: 'SNPs analyzed', v: totalRowsParsed.toLocaleString() },
    { k: 'Variants matched', v: String(variantsMatched) },
    { k: 'Essential picks', v: String(essentialCount) },
    { k: 'Processed locally', v: '100%' },
  ];

  return { primary, secondary, name, subtitle, stats };
}
