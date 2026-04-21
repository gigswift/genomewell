import { describe, expect, it } from 'vitest';
import { deriveArchetype } from '../src/lib/archetype';
import type { Genotype, SupplementRecommendation } from '../src/types';

function rec(priority: SupplementRecommendation['priority'], fired: string[] = []): SupplementRecommendation {
  return {
    supplement: {
      name: 'x',
      category: 'daily-wellness',
      defaultDosage: '',
      partnerOptions: [],
      healthEffect: '',
    },
    priority,
    dosage: '',
    reasoning: [],
    firedPrimary: fired,
    firedSupporting: [],
    confidence: 'high',
    partnerOptions: [],
  };
}

describe('deriveArchetype', () => {
  it('pairs Slow Methylator with Quick Responder when 3+ essentials fire', () => {
    const snps = new Map<string, Genotype>([['rs1801133', 'TT']]);
    const recs = [
      rec('essential', ['rs1801133']),
      rec('essential', ['rs174537']),
      rec('essential', ['rs4988235']),
      rec('recommended'),
    ];
    const a = deriveArchetype(snps, recs, 637294);
    expect(a.primary).toBe('Slow Methylator');
    expect(a.secondary).toBe('Quick Responder');
    expect(a.name).toBe('Slow Methylator, Quick Responder');
    expect(a.stats[0]).toEqual({ k: 'SNPs analyzed', v: '637,294' });
    expect(a.stats[2]).toEqual({ k: 'Essential picks', v: '3' });
  });

  it('leads with Cardio-Cognitive Priority for APOE e4 carriers', () => {
    const snps = new Map<string, Genotype>([
      ['rs429358', 'CT'],
      ['rs7412', 'CC'],
      ['rs1801133', 'TT'],
    ]);
    const a = deriveArchetype(snps, [], 500000);
    expect(a.primary).toBe('Cardio-Cognitive Priority');
    expect(a.secondary).toBe('Slow Methylator');
  });

  it('falls back to Balanced Baseline with no biology triggers', () => {
    const a = deriveArchetype(new Map(), [], 0);
    expect(a.primary).toBe('Balanced Baseline');
    expect(a.secondary).toBeUndefined();
    expect(a.name).toBe('Balanced Baseline');
    expect(a.subtitle).toMatch(/high-impact/i);
  });

  it('pairs two biology descriptors when essentials < 3', () => {
    const snps = new Map<string, Genotype>([
      ['rs1800562', 'AA'],
      ['rs174537', 'TT'],
    ]);
    const a = deriveArchetype(snps, [rec('recommended')], 600000);
    expect(a.primary).toBe('Iron-Conservative');
    expect(a.secondary).toBe('Omega Converter (Low)');
    expect(a.name).toBe('Iron-Conservative, Omega Converter (Low)');
  });

  it('renders a single descriptor (no comma) with only one match and no quick-responder signal', () => {
    const snps = new Map<string, Genotype>([['rs1801133', 'TT']]);
    const a = deriveArchetype(snps, [rec('recommended')], 100);
    expect(a.primary).toBe('Slow Methylator');
    expect(a.secondary).toBeUndefined();
    expect(a.name).toBe('Slow Methylator');
  });
});
