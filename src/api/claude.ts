import type { RecommendationReport, SNPResult } from '../types';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

const SYSTEM_PROMPT =
  'You are a knowledgeable, warm, and culturally aware wellness advisor. You communicate clearly without clinical jargon. You deeply understand the health context and priorities of Black Americans — including higher prevalence of Vitamin D deficiency, metabolic risk, and cardiovascular factors. You always emphasize that your recommendations are wellness-focused and not medical diagnoses or medical advice.';

const FALLBACK =
  'Based on your genetic results, you have several actionable insights to support your wellness journey. Focus on the highest-priority supplement recommendations and fitness guidance above. As always, discuss any supplement changes with a healthcare provider.';

export async function generateNarrativeSummary(
  report: Partial<RecommendationReport>,
  userGoals: string[]
): Promise<string> {
  try {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;
    if (!apiKey) throw new Error('Missing VITE_ANTHROPIC_API_KEY');

    const snpContext = (report.snpResults ?? []).map((s: SNPResult) => ({
      rsid: s.rsid,
      gene: s.gene,
      risk: s.risk,
      insight: s.insight,
      recommendation: s.recommendation,
    }));

    const userContent = `Here is the structured wellness context for a user. Please write 3–4 paragraphs: (1) a holistic interpretation of their genetic results, (2) the 2–3 most important first actions to take, and (3) an encouraging closing that connects back to their stated goals.

USER GOALS:
${JSON.stringify(userGoals, null, 2)}

GENETIC RESULTS (SNPResult[]):
${JSON.stringify(snpContext, null, 2)}

SUPPLEMENT STACK:
${JSON.stringify(report.supplementStack ?? [], null, 2)}

FITNESS PROTOCOL:
${JSON.stringify(report.fitnessProtocol ?? [], null, 2)}

Keep the tone warm and culturally aware. Avoid clinical jargon. Remind the reader this is wellness guidance, not medical advice.`;

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-allow-browser': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userContent }],
      }),
    });

    if (!response.ok) throw new Error(`Claude API error ${response.status}`);

    const data = await response.json();
    const text = (data?.content?.[0] as { text?: string } | undefined)?.text;
    if (!text) throw new Error('Empty response from Claude');
    return text;
  } catch {
    return FALLBACK;
  }
}
