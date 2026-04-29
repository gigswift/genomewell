import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseDNAFile } from '../src/dnaParser';
import { recommendSupplements } from '../src/services/recommendSupplements';
import { SUPPLEMENT_RULES } from '../src/engine/supplementRules';

describe('supplement engine (end-to-end smoke)', () => {
  const fixturePath = join(__dirname, 'fixtures/sample-23andme.txt');
  const text = readFileSync(fixturePath, 'utf8');
  const file = new File([text], 'sample-23andme.txt', { type: 'text/plain' });

  it('catalog contains exactly 18 rules across 4 categories', () => {
    expect(SUPPLEMENT_RULES).toHaveLength(18);
    const categories = new Set(SUPPLEMENT_RULES.map((r) => r.supplement.category));
    expect(categories.size).toBe(4);
  });

  it('parses fixture and populates engineSnpMap with engine-relevant rsids', async () => {
    const { results, engineSnpMap } = await parseDNAFile(file);
    expect(results.length).toBeGreaterThan(0);
    expect(engineSnpMap.size).toBeGreaterThan(20);
    expect(engineSnpMap.get('rs1801133')).toBe('CT');
    expect(engineSnpMap.get('rs429358')).toBe('CT');
  });

  it('produces at least one recommendation in each category', async () => {
    const { engineSnpMap } = await parseDNAFile(file);
    const { flat, grouped } = recommendSupplements(engineSnpMap);

    expect(flat.length).toBeGreaterThan(0);
    expect(grouped['daily-wellness'].length).toBeGreaterThan(0);
    expect(grouped['healthy-aging'].length).toBeGreaterThan(0);
    expect(grouped['body-optimization'].length).toBeGreaterThan(0);
    expect(grouped['food-sensitivity'].length).toBeGreaterThan(0);
  });

  it('honors the Vitamin D dose modulator for GC minor allele', async () => {
    const { engineSnpMap } = await parseDNAFile(file);
    const { flat } = recommendSupplements(engineSnpMap);
    const d3 = flat.find((r) => r.supplement.name === 'Vitamin D3 + K2');
    expect(d3).toBeDefined();
    expect(d3!.dosage).toContain('5000 IU');
  });

  it('fires Phosphatidylserine via APOE E4 customGate, not rsid primaries alone', async () => {
    const { engineSnpMap } = await parseDNAFile(file);
    const { flat } = recommendSupplements(engineSnpMap);
    const ps = flat.find((r) => r.supplement.name === 'Phosphatidylserine (PS)');
    expect(ps).toBeDefined();
    expect(ps!.firedPrimary).toContain('rs429358');
    expect(ps!.firedPrimary).toContain('rs7412');
  });

  it('flags Iron as skip when HFE variants are present', async () => {
    const { engineSnpMap } = await parseDNAFile(file);
    const { flat } = recommendSupplements(engineSnpMap);
    const iron = flat.find((r) => r.supplement.name.startsWith('Iron'));
    expect(iron).toBeDefined();
    expect(iron!.priority).toBe('skip');
  });

  it('returns null for rules with no fired primaries when given an empty map', () => {
    const empty = new Map<string, string>();
    const { flat } = recommendSupplements(empty);
    expect(flat).toHaveLength(0);
  });
});

describe('rule-logic corrections (2026-04-29)', () => {
  function findRule(supplementName: string) {
    return SUPPLEMENT_RULES.find((r) => r.supplement.name === supplementName)!;
  }

  it('PPARG rs1801282: Pro/Pro (CC) fires Berberine; Ala/Ala (GG) does not via PPARG', () => {
    const proHomo = new Map([['rs1801282', 'CC']]);
    const aloneFiresPro = recommendSupplements(proHomo).flat.find(
      (r) => r.supplement.name === 'Berberine',
    );
    expect(aloneFiresPro?.firedPrimary).toContain('rs1801282');

    const alaHomo = new Map([['rs1801282', 'GG']]);
    const aloneFiresAla = recommendSupplements(alaHomo).flat.find(
      (r) => r.supplement.name === 'Berberine',
    );
    expect(aloneFiresAla).toBeUndefined();
  });

  it('FUT2 rs601338: only AA homozygotes trigger Methyl-B12 non-secretor primary', () => {
    const homo = new Map([['rs601338', 'AA']]);
    const recHomo = recommendSupplements(homo).flat.find(
      (r) => r.supplement.name === 'Methyl-B12 (methylcobalamin)',
    );
    expect(recHomo?.firedPrimary).toContain('rs601338');

    const het = new Map([['rs601338', 'AG']]);
    const recHet = recommendSupplements(het).flat.find(
      (r) => r.supplement.name === 'Methyl-B12 (methylcobalamin)',
    );
    expect(recHet).toBeUndefined();
  });

  it('LCT rs4988235: only GG (non-persistent) triggers Lactase enzyme; AG/GA do not', () => {
    const nonPersistent = new Map([['rs4988235', 'GG']]);
    const recHomo = recommendSupplements(nonPersistent).flat.find(
      (r) => r.supplement.name === 'Lactase enzyme',
    );
    expect(recHomo?.firedPrimary).toContain('rs4988235');

    const het = new Map([['rs4988235', 'AG']]);
    const recHet = recommendSupplements(het).flat.find(
      (r) => r.supplement.name === 'Lactase enzyme',
    );
    expect(recHet).toBeUndefined();

    const persistent = new Map([['rs4988235', 'AA']]);
    const recAA = recommendSupplements(persistent).flat.find(
      (r) => r.supplement.name === 'Lactase enzyme',
    );
    expect(recAA).toBeUndefined();
  });

  it('TRPM6 rs11144134: minor-allele carriers in either strand orientation trigger Magnesium; wild-type homo does not', () => {
    for (const g of ['CC', 'CT', 'TC', 'GG', 'AG', 'GA']) {
      const m = new Map([['rs11144134', g]]);
      const rec = recommendSupplements(m).flat.find(
        (r) => r.supplement.name === 'Magnesium (glycinate)',
      );
      expect(rec, `expected Magnesium rule to fire for rs11144134=${g}`).toBeDefined();
    }
    for (const g of ['TT', 'AA']) {
      const m = new Map([['rs11144134', g]]);
      const rec = recommendSupplements(m).flat.find(
        (r) => r.supplement.name === 'Magnesium (glycinate)',
      );
      expect(rec, `expected Magnesium rule NOT to fire for rs11144134=${g}`).toBeUndefined();
    }
  });

  it('riskGenotypes match the verified-correction tables in docs/science-snp-catalog.md', () => {
    // After the per-genotype split (2026-04-29), each multi-trigger primary SNP is
    // stored as multiple PrimarySNPReference entries (one per genotype outcome).
    // Aggregate riskGenotypes across all entries with the same rsid before comparing.
    function unionRiskGenotypes(rule: typeof SUPPLEMENT_RULES[number], rsid: string): string[] {
      return Array.from(
        new Set(
          rule.primarySNPs
            .filter((s) => s.rsid === rsid)
            .flatMap((s) => [...s.riskGenotypes]),
        ),
      ).sort();
    }

    expect(unionRiskGenotypes(findRule('Berberine'), 'rs1801282')).toEqual(['CC', 'CG', 'GC']);
    expect(unionRiskGenotypes(findRule('Methyl-B12 (methylcobalamin)'), 'rs601338')).toEqual(['AA']);
    expect(unionRiskGenotypes(findRule('Lactase enzyme'), 'rs4988235')).toEqual(['GG']);
    expect(unionRiskGenotypes(findRule('Magnesium (glycinate)'), 'rs11144134')).toEqual(
      ['AG', 'CC', 'CT', 'GA', 'GG', 'TC'],
    );
  });
});
