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
