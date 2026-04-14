import type { SNPResult, FitnessProtocol } from '../types';

export function runRecommendations(snps: SNPResult[]): FitnessProtocol[] {
  const categories = new Set(snps.map((s) => s.category));
  const protocols: FitnessProtocol[] = [];

  if (categories.has('Cardiovascular') || categories.has('Metabolic')) {
    protocols.push({
      area: 'Aerobic Conditioning',
      guidance:
        '150 minutes of moderate-intensity cardio per week (brisk walking, cycling, swimming). Zone 2 training (60-70% max heart rate) is ideal for cardiovascular adaptation.',
      priority: 'essential',
      reason:
        'Cardiovascular and metabolic variants respond strongly to consistent aerobic exercise, improving heart function, insulin sensitivity, and blood pressure.',
    });
  }

  if (categories.has('Metabolic')) {
    protocols.push({
      area: 'Resistance Training',
      guidance:
        '2-3 sessions per week targeting major muscle groups with progressive overload. Focus on compound movements: squats, deadlifts, rows, presses.',
      priority: 'essential',
      reason:
        'Resistance training is the strongest intervention for insulin sensitivity and metabolic function — critical for TCF7L2 and MTHFR variants.',
    });
  }

  if (categories.has('Blood Disorders')) {
    protocols.push({
      area: 'Low-Impact Activity',
      guidance:
        'Swimming, cycling, and walking are preferred. Avoid extreme altitude, intense dehydration, or prolonged hypoxic conditions if you carry HBB variants.',
      priority: 'essential',
      reason:
        'Low-impact exercise builds cardiovascular fitness while minimizing triggers for HBB-related complications.',
    });
  }

  if (categories.has('Inflammation')) {
    protocols.push({
      area: 'Active Recovery & Mobility',
      guidance:
        '20-30 minutes of yoga, stretching, or foam rolling 3-4x per week. Cold exposure (cold showers) may reduce systemic inflammation markers.',
      priority: 'beneficial',
      reason:
        'Recovery protocols directly reduce TNF-alpha and IL-1 inflammatory markers — particularly important with your inflammation gene variants.',
    });
  }

  if (categories.has('Cognitive Health')) {
    protocols.push({
      area: 'Mind-Body Practice',
      guidance:
        'Daily meditation (10-20 min), breathwork (box breathing or 4-7-8), or tai chi. These reduce cortisol and support dopamine and serotonin balance.',
      priority: 'beneficial',
      reason:
        'COMT and BDNF variants affect stress response and neuroplasticity — mind-body practices directly modulate these pathways.',
    });
  }

  if (categories.has('Cardiovascular') || categories.has('Kidney Health')) {
    protocols.push({
      area: 'Blood Pressure Monitoring',
      guidance:
        'Check blood pressure at home 2-3x per week. Target under 120/80 mmHg. Log readings and share with your physician.',
      priority: 'essential',
      reason:
        'Cardiovascular and kidney health variants make blood pressure management a primary protective strategy.',
    });
  }

  if (categories.has('Cognitive Health') || categories.has('Inflammation')) {
    protocols.push({
      area: 'Sleep Optimization',
      guidance:
        'Target 7-9 hours in a cool, dark room. Consistent sleep/wake times support circadian rhythm. Avoid screens 1 hour before bed.',
      priority: 'essential',
      reason:
        'Sleep is the most powerful natural BDNF booster and inflammation reducer — non-negotiable for your genetic profile.',
    });
  }

  if (categories.has('Nutrition & Vitamins')) {
    protocols.push({
      area: 'Outdoor Activity & Sun Exposure',
      guidance:
        '15-30 minutes of midday sun on most days when possible. Supplement vitamin D regardless — sun alone is unreliable with vitamin D gene variants.',
      priority: 'beneficial',
      reason:
        'Vitamin D synthesis from sun exposure is reduced by both melanin and your genetic variants — outdoor activity supports mood, bone health, and wellness.',
    });
  }

  if (categories.has('Cancer Risk')) {
    protocols.push({
      area: 'Body Composition Management',
      guidance:
        'Maintain healthy body composition through consistent diet and exercise. Excess adipose tissue increases cancer-promoting hormones (IGF-1, estrogen, insulin).',
      priority: 'essential',
      reason:
        'Healthy body composition is one of the strongest modifiable cancer risk factors alongside your 8q24 genetic variants.',
    });
  }

  protocols.push({
    area: 'Community & Social Wellness',
    guidance:
      'Maintain strong community connections, attend regular social activities, and consider culturally affirming mental health support when needed.',
    priority: 'beneficial',
    reason:
      'Social connection and community belonging are potent modulators of stress hormones, immune function, and cardiovascular health outcomes.',
  });

  return protocols;
}
