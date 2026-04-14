import type { SNPResult } from './types';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

export async function generateWellnessNarrative(snps: SNPResult[]): Promise<string> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;

  if (!apiKey) {
    throw new Error(
      'API key not configured. Please add VITE_ANTHROPIC_API_KEY to your .env file and restart the dev server.'
    );
  }

  const byCategory = snps.reduce<Record<string, SNPResult[]>>((acc, snp) => {
    (acc[snp.category] ??= []).push(snp);
    return acc;
  }, {});

  const snpSummary = Object.entries(byCategory)
    .map(([cat, items]) => {
      const lines = items
        .map((s) => `  • ${s.rsid} (${s.gene}): ${s.topic} — Genotype: ${s.genotype}`)
        .join('\n');
      return `${cat}:\n${lines}`;
    })
    .join('\n\n');

  const prompt = `You are a warm, knowledgeable genetic wellness advisor specializing in health insights for the Black American community. You understand the history of medical disparities, the importance of culturally affirming healthcare, and the genetic science most relevant to this population.

A user has uploaded their raw DNA file. Their data was analyzed entirely in their browser — you are receiving only the following structured SNP results (no raw genetic file data was transmitted), covering ${snps.length} genetic markers across ${Object.keys(byCategory).length} health categories.

GENETIC MARKERS IDENTIFIED:
${snpSummary}

Write a personalized wellness narrative that:
1. Opens with a warm, empowering greeting acknowledging the user's proactive engagement with their health
2. Provides meaningful insights for each health category present, explaining what the genes and variants mean in accessible language
3. Where relevant, acknowledges specific health challenges historically affecting Black Americans (e.g., hypertension prevalence, APOL1-associated kidney disease risk, sickle cell, vitamin D deficiency linked to melanin and inadequate sun exposure in clinical guidelines)
4. Emphasizes strengths and opportunities for proactive wellness
5. Includes culturally relevant wellness recommendations: diet, movement, community care, stress management
6. Notes where drug metabolism variants are clinically relevant to discuss with a prescribing physician
7. Closes with an empowering message rooted in community strength and ancestral resilience

FORMAT:
- Use ## for section headings
- Use **bold** for key terms
- Use bullet points (- ) for lists
- Length: 650–950 words
- End with a disclaimer paragraph that this is informational and not a substitute for medical advice

Be warm, affirming, scientifically grounded, and culturally honest.`;

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-allow-browser': 'true',
    },
    body: JSON.stringify({
      model: 'claude-opus-4-6',
      max_tokens: 1800,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    let detail = '';
    try {
      const err = await response.json();
      detail = err?.error?.message ?? JSON.stringify(err);
    } catch {
      detail = await response.text();
    }
    throw new Error(`Claude API error ${response.status}: ${detail}`);
  }

  const data = await response.json();
  return (data.content[0] as { text: string }).text;
}
