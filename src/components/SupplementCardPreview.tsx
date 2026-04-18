import type { SupplementRecommendation } from '../types';
import { SupplementCard } from './SupplementCard';

// Dev-only fixture exercising all three partners + a gap supplement.
// Loaded at /?preview=supplement-cards when running `npm run dev`.
const SAMPLES: SupplementRecommendation[] = [
  {
    supplement: {
      name: 'Methylfolate (L-5-MTHF)',
      category: 'daily-wellness',
      defaultDosage: '400–1000 mcg daily',
      partnerOptions: [{ partner: 'thorne', productSlug: '5-mthf' }],
    },
    priority: 'essential',
    dosage: '800 mcg daily',
    reasoning: [
      'MTHFR (rs1801133, CT): MTHFR C677T — T allele reduces enzyme activity; methylated folate bypasses the blocked step',
      'MTHFR (rs1801131, AC): MTHFR A1298C — C allele reduces BH4 pathway function',
    ],
    firedPrimary: ['rs1801133', 'rs1801131'],
    firedSupporting: [],
    confidence: 'high',
    partnerOptions: [{ partner: 'thorne', productSlug: '5-mthf' }],
  },
  {
    supplement: {
      name: 'Grass-Fed Whey Protein',
      category: 'body-optimization',
      defaultDosage: '25–30 g post-workout',
      partnerOptions: [{ partner: 'biotrust', productSlug: 'low-carb-protein' }],
    },
    priority: 'recommended',
    dosage: '25 g post-workout',
    reasoning: [
      'ACTN3 (rs1815739, CT): power-performance variant — protein timing supports recovery around resistance work',
    ],
    firedPrimary: ['rs1815739'],
    firedSupporting: [],
    confidence: 'medium',
    partnerOptions: [{ partner: 'biotrust', productSlug: 'low-carb-protein' }],
  },
  {
    supplement: {
      name: 'Organic Green Juice Blend',
      category: 'daily-wellness',
      defaultDosage: '1 scoop daily, morning',
      partnerOptions: [{ partner: 'organifi', productSlug: 'green-juice' }],
    },
    priority: 'consider',
    dosage: '1 scoop daily',
    reasoning: [
      'GSTM1 (null, null): reduced phase-II detox capacity — cruciferous + chlorophyll intake supports glutathione pathways',
    ],
    firedPrimary: ['rs-placeholder'],
    firedSupporting: [],
    confidence: 'medium',
    partnerOptions: [{ partner: 'organifi', productSlug: 'green-juice' }],
  },
  {
    supplement: {
      name: 'DAO enzyme (histamine intolerance)',
      category: 'food-sensitivity',
      defaultDosage: '10,000 HDU before histamine-rich meals',
      partnerOptions: [],
    },
    priority: 'recommended',
    dosage: '10,000 HDU before histamine-rich meals',
    reasoning: [
      'AOC1 (rs10156191, CT): diamine oxidase activity; T allele reduces DAO',
    ],
    firedPrimary: ['rs10156191'],
    firedSupporting: [],
    confidence: 'high',
    partnerOptions: [],
  },
  {
    supplement: {
      name: 'Iron — SKIP if HFE carrier',
      category: 'food-sensitivity',
      defaultDosage: 'Skip iron supplementation',
      partnerOptions: [],
    },
    priority: 'skip',
    dosage: 'Skip iron supplementation — talk to your practitioner about ferritin monitoring',
    reasoning: [
      'HFE (rs1800562, AG): C282Y — strongest hemochromatosis allele; iron supplementation contraindicated',
    ],
    firedPrimary: ['rs1800562'],
    firedSupporting: [],
    confidence: 'high',
    partnerOptions: [],
  },
];

export function SupplementCardPreview() {
  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">
          SupplementCard preview
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Dev-only fixture: Thorne · BioTrust · Organifi · gap · skip
        </p>
      </header>
      {SAMPLES.map((rec) => (
        <SupplementCard key={rec.supplement.name} recommendation={rec} />
      ))}
    </div>
  );
}
