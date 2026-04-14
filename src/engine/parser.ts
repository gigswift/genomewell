import type { ParsedDNA, Genotype } from '../types/index';
import { TARGET_SNPS } from './snpRules';

export function detectPlatform(
  headerLines: string[],
): '23andMe' | 'AncestryDNA' | 'Unknown' {
  for (const line of headerLines.slice(0, 10)) {
    const lower = line.toLowerCase();
    if (lower.includes('23andme')) return '23andMe';
    if (lower.includes('ancestry')) return 'AncestryDNA';
  }
  return 'Unknown';
}

export function parseRawDNA(fileText: string): ParsedDNA {
  const headerLines: string[] = [];
  const snpMap: Record<string, Genotype> = {};

  const lines = fileText.split(/\r?\n/);

  for (const rawLine of lines) {
    if (rawLine.length === 0) continue;

    if (rawLine.startsWith('#')) {
      if (headerLines.length < 10) headerLines.push(rawLine);
      continue;
    }

    const trimmed = rawLine.trim();
    if (trimmed.length === 0) continue;

    const cols = rawLine.split('\t');
    let rsid: string | undefined;
    let genotype: string | undefined;

    if (cols.length === 4) {
      rsid = cols[0];
      genotype = cols[3];
    } else if (cols.length === 5) {
      rsid = cols[0];
      genotype = (cols[3] ?? '') + (cols[4] ?? '');
    } else {
      continue;
    }

    if (!rsid) continue;
    const normalizedRsid = rsid.trim();
    const normalizedGenotype = (genotype ?? '').trim().toUpperCase();
    if (normalizedRsid.length === 0 || normalizedGenotype.length === 0) continue;

    snpMap[normalizedRsid] = normalizedGenotype;
  }

  const platform = detectPlatform(headerLines);

  const foundTargets = TARGET_SNPS.reduce(
    (count, rsid) => (rsid in snpMap ? count + 1 : count),
    0,
  );
  const coveragePercent =
    TARGET_SNPS.length === 0 ? 0 : (foundTargets / TARGET_SNPS.length) * 100;

  return {
    snpMap,
    platform,
    totalSNPs: Object.keys(snpMap).length,
    coveragePercent,
  };
}
