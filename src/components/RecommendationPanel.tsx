import { NARRATIVE_FALLBACK } from '../types';

function renderMarkdown(text: string): string {
  const lines = text.split('\n');
  const html: string[] = [];
  let inList = false;

  for (const raw of lines) {
    const line = raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');

    if (line.startsWith('## ')) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push(`<h2 class="md-h2">${line.slice(3)}</h2>`);
    } else if (line.startsWith('# ')) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push(`<h1 class="md-h1">${line.slice(2)}</h1>`);
    } else if (line.startsWith('- ') || line.startsWith('\u2022 ')) {
      if (!inList) { html.push('<ul class="md-ul">'); inList = true; }
      html.push(`<li class="md-li">${line.slice(2)}</li>`);
    } else if (line.trim() === '') {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push('<div class="md-spacer"></div>');
    } else {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push(`<p class="md-p">${line}</p>`);
    }
  }

  if (inList) html.push('</ul>');
  return html.join('');
}

interface RecommendationPanelProps {
  narrativeSummary: string;
  isLoading: boolean;
}

export function RecommendationPanel({ narrativeSummary, isLoading }: RecommendationPanelProps) {
  // ── Loading skeleton ───────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="bg-white border border-stone-200 rounded-2xl p-8 space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          <p className="text-sm text-stone-500">Claude is crafting your personalized narrative...</p>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-stone-200 rounded-lg w-3/4" />
          <div className="h-4 bg-stone-100 rounded-lg w-full" />
          <div className="h-4 bg-stone-100 rounded-lg w-5/6" />
          <div className="h-4 bg-stone-100 rounded-lg w-4/5" />
          <div className="h-5 bg-stone-200 rounded-lg w-2/3 mt-4" />
          <div className="h-4 bg-stone-100 rounded-lg w-full" />
          <div className="h-4 bg-stone-100 rounded-lg w-11/12" />
          <div className="h-4 bg-stone-100 rounded-lg w-3/4" />
        </div>
      </div>
    );
  }

  // ── Fallback: structured static summary ────────────────────────────
  if (narrativeSummary === NARRATIVE_FALLBACK) {
    return (
      <div className="bg-white border border-stone-200 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-stone-800">Your Genetic Wellness Summary</h3>
            <p className="text-xs text-stone-500">Structured summary (AI narrative unavailable)</p>
          </div>
        </div>
        <div className="prose-genomewell space-y-2">
          <p className="md-p">
            Your DNA analysis is complete. Review your <strong>supplement stack</strong> and{' '}
            <strong>fitness protocols</strong> below &mdash; each recommendation is based directly on the
            genetic variants identified in your file.
          </p>
          <p className="md-p">
            The <strong>SNP Explorer</strong> section lets you drill into each genetic marker, understand
            what it means, and see the specific insight and recommendation for your genotype.
          </p>
          <p className="md-p text-stone-400 italic">
            To generate a personalized AI narrative, add your Anthropic API key to the
            VITE_ANTHROPIC_API_KEY environment variable and reload.
          </p>
        </div>
      </div>
    );
  }

  // ── Claude narrative ───────────────────────────────────────────────
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
      {/* eslint-disable-next-line react-dom/no-dangerously-set-innerhtml */}
      <div className="prose-genomewell" dangerouslySetInnerHTML={{ __html: renderMarkdown(narrativeSummary) }} />
    </div>
  );
}
